// brain-scheduler.js — NeuroAGI Brain Scheduler
//
// THE MISSING ENGINE. This is what makes the brain "alive".
//
// WHAT IT DOES:
//   Runs every hour (via cron). For each active person in neuro.persons:
//   1. Reads all brain.signals from the last 24 hours
//   2. Reads fschool.assignments for upcoming deadlines
//   3. Calls Claude Haiku to synthesise a context_window entry
//   4. Upserts brain.context_window with: stress_level, momentum_state,
//      active_deadline, recent_summary, what_to_focus_on, what_not_to_mention
//   5. Writes a brain.reflections entry (daily, not hourly)
//
// WHY THIS MATTERS:
//   Without this, context_window only updates when a session closes.
//   With this, the brain is always current — even when the student isn't
//   actively using FschoolAI. Reggie reads context_window (pre-computed,
//   ~40ms) not raw signals (600ms+). This is how we solve the latency problem.
//
// DEPLOYMENT:
//   Option A — Vercel Cron (vercel.json):
//     { "crons": [{ "path": "/api/brain-scheduler", "schedule": "0 * * * *" }] }
//   Option B — Railway / Render cron job:
//     node brain-scheduler.js
//   Option C — GitHub Actions scheduled workflow (free):
//     schedule: cron: '0 * * * *'
//
// ENV VARS REQUIRED:
//   BRAIN_SUPABASE_URL   — NeuroAGI Brain DB URL
//   BRAIN_SUPABASE_KEY   — Brain DB service_role key
//   ANTHROPIC_API_KEY    — Claude Haiku for synthesis (~$0.001/run/student)
//
// COST ESTIMATE:
//   64 students × 1 run/hour × $0.001 = $0.064/hour = ~$1.54/day
//   Acceptable for beta. Reduce to every 4 hours post-launch.

import Anthropic from "@anthropic-ai/sdk";

const BRAIN_URL = process.env.BRAIN_SUPABASE_URL;
const BRAIN_KEY = process.env.BRAIN_SUPABASE_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const brainHeaders = {
  apikey: BRAIN_KEY,
  Authorization: `Bearer ${BRAIN_KEY}`,
  "Content-Type": "application/json",
};

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchPersons() {
  const res = await fetch(
    `${BRAIN_URL}/rest/v1/neuro.persons?select=id,name,email,source&limit=200`,
    { headers: brainHeaders }
  );
  if (!res.ok) throw new Error(`fetchPersons failed: ${res.status}`);
  return res.json();
}

async function fetchRecentSignals(personId, hoursBack = 24) {
  const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
  const res = await fetch(
    `${BRAIN_URL}/rest/v1/brain.signals?person_id=eq.${personId}&created_at=gte.${since}&select=signal_type,source,payload,created_at&order=created_at.desc&limit=50`,
    { headers: brainHeaders }
  );
  if (!res.ok) return [];
  return res.json();
}

async function fetchUpcomingAssignments(personId) {
  const now = new Date().toISOString();
  const weekOut = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const res = await fetch(
    `${BRAIN_URL}/rest/v1/fschool.assignments?person_id=eq.${personId}&due_at=gte.${now}&due_at=lte.${weekOut}&select=title,due_at,missing,score,points_possible&order=due_at.asc&limit=10`,
    { headers: brainHeaders }
  );
  if (!res.ok) return [];
  return res.json();
}

async function fetchExistingContext(personId) {
  const res = await fetch(
    `${BRAIN_URL}/rest/v1/brain.context_window?person_id=eq.${personId}&select=*&limit=1`,
    { headers: brainHeaders }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] ?? null;
}

// ── Claude synthesis ──────────────────────────────────────────────────────────

async function synthesiseContext(person, signals, assignments, existingContext) {
  if (!ANTHROPIC_KEY) {
    // Fallback: rule-based synthesis without LLM
    return ruleBasedSynthesis(signals, assignments, existingContext);
  }

  const client = new Anthropic({ apiKey: ANTHROPIC_KEY });

  const signalSummary = signals.length
    ? signals.slice(0, 20).map(s =>
        `[${new Date(s.created_at).toLocaleTimeString()}] ${s.signal_type} from ${s.source}: ${JSON.stringify(s.payload)}`
      ).join("\n")
    : "No signals in last 24 hours.";

  const assignmentSummary = assignments.length
    ? assignments.map(a => {
        const dueIn = Math.round((new Date(a.due_at) - Date.now()) / (1000 * 60 * 60));
        return `- ${a.title}: due in ${dueIn}h${a.missing ? " (MISSING)" : ""}${a.score != null ? ` (scored ${a.score}/${a.points_possible})` : ""}`;
      }).join("\n")
    : "No upcoming assignments in next 7 days.";

  const prompt = `You are the NeuroAGI Brain Scheduler. Your job is to synthesise a student's recent signals into a concise context window that their AI tutor (Reggie) will read before every conversation.

Student: ${person.name ?? "Unknown"}
Source: ${person.source ?? "fschoolai"}

RECENT SIGNALS (last 24h):
${signalSummary}

UPCOMING ASSIGNMENTS (next 7 days):
${assignmentSummary}

PREVIOUS CONTEXT WINDOW:
${existingContext ? JSON.stringify(existingContext, null, 2) : "None — first synthesis for this student."}

Synthesise a JSON object with EXACTLY these fields:
{
  "stress_level": <integer 0-10, where 0=calm, 10=crisis>,
  "momentum_state": <"building"|"steady"|"declining"|"stalled">,
  "active_deadline": <string: most urgent assignment name + hours remaining, or null>,
  "recent_summary": <1-2 sentences: what this student has been doing and how they seem>,
  "what_to_focus_on": <1 sentence: what Reggie should steer the student toward>,
  "what_not_to_mention": <1 sentence: what Reggie should avoid bringing up right now, or null>,
  "knowledge_gaps": <array of up to 3 topic strings where student showed confusion, or []>,
  "study_pattern": <"morning_person"|"night_owl"|"afternoon"|"irregular"|"unknown">
}

Rules:
- Base stress_level on: message emotional tone, number of missing assignments, time until deadlines
- Base momentum_state on: recent message frequency and length trends
- Be specific and actionable — Reggie reads this before every conversation
- Return ONLY the JSON object, no other text`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0]?.text ?? "";
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error(`[brain-scheduler] Claude synthesis failed for ${person.id}:`, err.message);
    return ruleBasedSynthesis(signals, assignments, existingContext);
  }
}

// ── Rule-based fallback (no LLM needed) ──────────────────────────────────────

function ruleBasedSynthesis(signals, assignments, existingContext) {
  // Count stress signals
  const stressSignals = signals.filter(s =>
    s.payload?.emotional_tone === "stressed" || s.signal_type === "stress"
  ).length;
  const missingCount = assignments.filter(a => a.missing).length;
  const urgentCount  = assignments.filter(a => {
    const hoursLeft = (new Date(a.due_at) - Date.now()) / (1000 * 60 * 60);
    return hoursLeft < 48;
  }).length;

  const stressLevel = Math.min(10, stressSignals * 2 + missingCount * 3 + urgentCount * 2);

  // Momentum from message frequency
  const recentMsgs = signals.filter(s => s.source === "fschoolai_chat").length;
  const momentum = recentMsgs >= 10 ? "building" : recentMsgs >= 5 ? "steady" : recentMsgs >= 1 ? "declining" : "stalled";

  // Most urgent deadline
  const nextDeadline = assignments[0];
  const activeDeadline = nextDeadline
    ? `${nextDeadline.title} — ${Math.round((new Date(nextDeadline.due_at) - Date.now()) / (1000 * 60 * 60))}h`
    : null;

  // Study pattern from hour_of_day signals
  const hours = signals.filter(s => s.payload?.hour_of_day != null).map(s => s.payload.hour_of_day);
  const avgHour = hours.length ? hours.reduce((a, b) => a + b, 0) / hours.length : null;
  const studyPattern = avgHour === null ? "unknown"
    : avgHour < 10 ? "morning_person"
    : avgHour < 15 ? "afternoon"
    : avgHour < 20 ? "afternoon"
    : "night_owl";

  return {
    stress_level:        stressLevel,
    momentum_state:      momentum,
    active_deadline:     activeDeadline,
    recent_summary:      `Student has ${recentMsgs} chat interactions in the last 24h. ${missingCount > 0 ? `${missingCount} missing assignments.` : "No missing assignments."}`,
    what_to_focus_on:    nextDeadline ? `Help with ${nextDeadline.title}` : "General study support",
    what_not_to_mention: null,
    knowledge_gaps:      [],
    study_pattern:       studyPattern,
  };
}

// ── Write context_window ──────────────────────────────────────────────────────

async function writeContextWindow(personId, context) {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(); // 8h TTL

  const row = {
    person_id:           personId,
    stress_level:        context.stress_level,
    momentum_state:      context.momentum_state,
    active_deadline:     context.active_deadline,
    recent_summary:      context.recent_summary,
    what_to_focus_on:    context.what_to_focus_on,
    what_not_to_mention: context.what_not_to_mention,
    knowledge_gaps:      context.knowledge_gaps,
    study_pattern:       context.study_pattern,
    computed_at:         new Date().toISOString(),
    expires_at:          expiresAt,
  };

  const res = await fetch(`${BRAIN_URL}/rest/v1/brain.context_window`, {
    method:  "POST",
    headers: { ...brainHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
    body:    JSON.stringify(row),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error(`[brain-scheduler] context_window write failed for ${personId}:`, err);
  }
}

// ── Write daily reflection ────────────────────────────────────────────────────

async function writeDailyReflection(personId, context, signalCount) {
  // Only write once per day — check if today's reflection exists
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const checkRes = await fetch(
    `${BRAIN_URL}/rest/v1/brain.reflections?person_id=eq.${personId}&created_at=gte.${todayStart.toISOString()}&select=id&limit=1`,
    { headers: brainHeaders }
  );
  if (checkRes.ok) {
    const existing = await checkRes.json();
    if (existing?.length > 0) return; // Already wrote today's reflection
  }

  const reflection = {
    person_id:   personId,
    source:      "brain_scheduler",
    content:     context.recent_summary,
    stress_level: context.stress_level,
    momentum:    context.momentum_state,
    signal_count: signalCount,
    created_at:  new Date().toISOString(),
  };

  await fetch(`${BRAIN_URL}/rest/v1/brain.reflections`, {
    method:  "POST",
    headers: { ...brainHeaders, Prefer: "return=minimal" },
    body:    JSON.stringify(reflection),
  }).catch(err => console.error(`[brain-scheduler] reflection write failed:`, err.message));
}

// ── Main scheduler loop ───────────────────────────────────────────────────────

export async function runBrainScheduler() {
  if (!BRAIN_URL || !BRAIN_KEY) {
    console.error("[brain-scheduler] BRAIN_SUPABASE_URL or BRAIN_SUPABASE_KEY not set");
    return { ok: false, reason: "missing env vars" };
  }

  console.log(`[brain-scheduler] Starting run at ${new Date().toISOString()}`);

  let persons;
  try {
    persons = await fetchPersons();
  } catch (err) {
    console.error("[brain-scheduler] fetchPersons failed:", err.message);
    return { ok: false, reason: err.message };
  }

  console.log(`[brain-scheduler] Processing ${persons.length} persons`);

  const results = { processed: 0, skipped: 0, errors: 0 };

  for (const person of persons) {
    try {
      // Fetch data in parallel
      const [signals, assignments, existingContext] = await Promise.all([
        fetchRecentSignals(person.id, 24),
        fetchUpcomingAssignments(person.id),
        fetchExistingContext(person.id),
      ]);

      // Skip if no signals and context is fresh (< 2 hours old)
      if (signals.length === 0 && existingContext) {
        const age = Date.now() - new Date(existingContext.computed_at).getTime();
        if (age < 2 * 60 * 60 * 1000) {
          results.skipped++;
          continue;
        }
      }

      // Synthesise context
      const context = await synthesiseContext(person, signals, assignments, existingContext);

      // Write to Brain DB
      await writeContextWindow(person.id, context);
      await writeDailyReflection(person.id, context, signals.length);

      results.processed++;
      console.log(`[brain-scheduler] ✓ ${person.name ?? person.id} | stress=${context.stress_level} momentum=${context.momentum_state}`);

      // Rate limit: 200ms between persons to avoid overwhelming Brain DB
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      console.error(`[brain-scheduler] Error processing ${person.id}:`, err.message);
      results.errors++;
    }
  }

  console.log(`[brain-scheduler] Done. Processed: ${results.processed}, Skipped: ${results.skipped}, Errors: ${results.errors}`);
  return { ok: true, ...results };
}

// ── Vercel serverless handler (for Vercel Cron deployment) ───────────────────

export default async function handler(req, res) {
  // Verify cron secret to prevent unauthorized runs
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers["x-cron-secret"] !== cronSecret) {
    // Also allow Vercel's built-in cron auth header
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    const result = await runBrainScheduler();
    return res.status(200).json(result);
  } catch (err) {
    console.error("[brain-scheduler] handler error:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

// ── Standalone CLI runner (node brain-scheduler.js) ──────────────────────────

if (process.argv[1]?.endsWith("brain-scheduler.js")) {
  runBrainScheduler()
    .then(result => {
      console.log("Result:", result);
      process.exit(result.ok ? 0 : 1);
    })
    .catch(err => {
      console.error("Fatal:", err.message);
      process.exit(1);
    });
}
