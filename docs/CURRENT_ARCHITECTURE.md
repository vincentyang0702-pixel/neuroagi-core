# NeuroAGI Brain — Current Architecture

**Last updated:** June 4, 2026  
**Database:** NeuroAGI Brain (Supabase, `qiolhlvqfzujnkwnymft`)  
**Repo:** `vincentyang0702-pixel/neuroagi-core`  
**Status:** Active — Vincent's founding data live. FschoolAI connected.

---

## What NeuroAGI Brain Is

NeuroAGI Brain is the **OS-level intelligence layer** — the persistent, compounding "second brain" that sits underneath all NeuroAGI products. It is not a product itself. It is the substrate.

Every product in the ecosystem (FschoolAI, future NeuroAGI hardware, future enterprise products) reads from and writes to this brain. The brain owns the person. Products borrow the person temporarily.

```
┌─────────────────────────────────────────────────────────────────┐
│                      NeuroAGI Brain DB                          │
│  (qiolhlvqfzujnkwnymft.supabase.co)                             │
│                                                                 │
│  neuro.*     — Who the person is (identity, trust, consent)     │
│  brain.*     — What the brain knows (signals, patterns, models) │
│  agents.*    — What was said (sessions, messages, outputs)      │
│  fschool.*   — Academic data (courses, assignments, grades)     │
└────────────────────────┬────────────────────────────────────────┘
                         │ reads/writes via SUPABASE_URL env var
                         │
          ┌──────────────┴──────────────┐
          │                             │
   FschoolAI Backend            (future products)
   (brain-chat-session,          NeuroAGI hardware,
    brain-context-window,        enterprise, etc.
    brain-reflection-engine,
    brain-scheduler, etc.)
```

---

## Database Schema Map

### `neuro` schema — The Person

| Table | Rows | Purpose |
|---|---|---|
| `neuro.persons` | 1 | Core identity: name, university, programme, nationality, timezone, Canvas ID, social handles |
| `neuro.trust` | 1 | Trust levels per domain: academic(8), personal(6), family(3), identity(5), financial(4) |
| `neuro.consent` | 4 | What the person has consented to share (conversation, behavioral, academic, social) |
| `neuro.memory` | 8 | Key-value persistent memory (device_id, last_exchange, etc.) |
| `neuro.patterns` | 88 | Behavioral/learning patterns with confidence scores |
| `neuro.signal_sources` | 1 | Canvas LMS at UofT |
| `neuro.preferences` | 0 | Communication preferences (not yet populated) |
| `neuro.voice` | 0 | Voice/tone preferences (not yet populated) |
| `neuro.boundaries` | 0 | Topics the brain should not cross (not yet populated) |
| `neuro.locations` | 0 | Location context (not yet populated) |
| `neuro.milestones` | 0 | Life milestones (not yet populated) |
| `neuro.network` | 0 | Social/professional network (not yet populated) |
| `neuro.social_profiles` | 0 | Social media profiles (not yet populated) |

**Key columns in `neuro.persons`:**
```
id, name, email, university, programme, nationality, hometown,
timezone, canvas_user_id, instagram, linkedin, phone,
is_founding, subscription_tier, created_at
```

---

### `brain` schema — The Intelligence

| Table | Rows | Purpose |
|---|---|---|
| `brain.signals` | 371 | Core signal store: behavioral, emotional, knowledge, context, outcome signals |
| `brain.reflections` | 203 | Brain's synthesized reflections after sessions |
| `brain.patterns` (→ `neuro.patterns`) | — | Patterns live in `neuro.patterns` |
| `brain.goals` | 6 | Active goals (NeuroAGI, FschoolAI, GPA, etc.) |
| `brain.momentum` | 1 | Current momentum state: "building" |
| `brain.reasoning_state` | 1 | Current reasoning/thinking state |
| `brain.reports` | 9 | Weekly/monthly brain reports |
| `brain.behavior_config` | 4 | Behavior settings (response_style, thinking_partner_mode, etc.) |
| `brain.hypotheses` | 0 | Brain's hypotheses about the person — **NOT YET POPULATED** |
| `brain.interventions` | 0 | Queued interventions — **NOT YET POPULATED** |
| `brain.context_window` | 0 | Pre-computed context snapshot — **NOT YET POPULATED** |
| `brain.knowledge` | 0 | Knowledge graph nodes — **NOT YET POPULATED** |
| `brain.knowledge_graph` | 0 | Knowledge graph edges — **NOT YET POPULATED** |
| `brain.predictions` | 0 | Outcome predictions — **NOT YET POPULATED** |
| `brain.person_model` | 1 | Deep psychological model (behavioral_signature, theory, silence_map) |
| `brain.self_model` | 1 | Self-model snapshot |
| `brain.scheduled_thinking` | 3 | Scheduled autonomous thinking tasks |
| `brain.subscriptions` | 1 | Founding tier subscription |
| `brain.feature_flags` | 4 | Feature flags |
| `brain.signal_types` | 37 | Signal taxonomy definitions |
| `brain.cost_tracking` | 0 | LLM cost tracking — **NOT YET POPULATED** |

**Key columns in `brain.signals`:**
```
id, person_id, signal_type, subtype, value, value_text,
source, source_session_id, confidence, occurred_at, created_at, metadata
```

**Key columns in `brain.reflections`:**
```
id, person_id, session_id, source_session_id, summary, stress_level,
momentum_assessment, key_insights, do_not_mention, watching_for,
confirmed_hypotheses, pending_intervention, created_at
```

---

### `agents` schema — The Conversations

| Table | Rows | Purpose |
|---|---|---|
| `agents.sessions` | 39 | Chat sessions (38 real + 1 legacy anchor) |
| `agents.messages` | 1,467 | All messages (1,224 real + 243 legacy) |
| `agents.registry` | 3 | Registered agents |
| `agents.outputs` | 0 | Agent structured outputs — **NOT YET POPULATED** |
| `agents.unsaid` | 0 | Things brain wanted to say but didn't — **NOT YET POPULATED** |

**Key columns in `agents.sessions`:**
```
id, person_id, started_at, ended_at, duration_seconds, message_count,
session_type, platform, source, topic, was_significant,
significance_score, significance_reason, summary, mood_start, mood_end
```

---

### `fschool` schema — Academic Data (lives in Brain DB)

| Table | Rows | Purpose |
|---|---|---|
| `fschool.assignments` | 0 | Assignments synced from Canvas — **NOT YET POPULATED** |
| `fschool.courses` | 0 | Courses — **NOT YET POPULATED** |
| `fschool.grades` | 0 | Grades — **NOT YET POPULATED** |
| `fschool.students` | 0 | Student records — **NOT YET POPULATED** |
| `fschool.study_plans` | 0 | Study plans — **NOT YET POPULATED** |
| `fschool.submissions` | 0 | Assignment submissions — **NOT YET POPULATED** |
| `fschool.interview_prep` | 0 | Interview prep sessions — **NOT YET POPULATED** |
| `fschool.universities` | 1 | University of Toronto |
| `fschool.canvas_sync_log` | 0 | Canvas sync history — **NOT YET POPULATED** |

> **Note:** The `fschool.*` schema in the Brain DB is intentionally separate from the FschoolAI Production DB. The Brain DB's `fschool.*` tables are the **brain's view** of academic data — enriched, synthesized, and used for intelligence generation. The FschoolAI Production DB's `public.*` tables are the **raw operational data** (Canvas sync, user accounts, etc.).

---

## Source Code Map

### Files in `src/brain/`

| File | Purpose | Status |
|---|---|---|
| `neuro-agi.ts` | Unified brain manager across all products | ⚠️ BROKEN — references non-existent flat tables |
| `brain-compounding.ts` | Signal processing and knowledge graph updates | ⚠️ BROKEN — references non-existent flat tables |
| `knowledge-graph.ts` | Concept mapping and relationship tracking | ⚠️ BROKEN — references non-existent flat tables |
| `pattern-recognition.ts` | Behavioral pattern detection | ⚠️ BROKEN — references non-existent flat tables |
| `prediction-engine.ts` | Outcome prediction | ⚠️ BROKEN — references non-existent flat tables |
| `causal-inference.ts` | Root cause analysis | ⚠️ BROKEN — references non-existent flat tables |
| `intervention-engine.ts` | Proactive intervention generation | ⚠️ BROKEN — references non-existent flat tables |
| `event-stream.ts` | Event streaming | ⚠️ BROKEN — references non-existent flat tables |

### Files in `src/sdk/`

| File | Purpose | Status |
|---|---|---|
| `brain-sdk.ts` | Public SDK interface (the iOS SDK equivalent) | ✅ Interface only — no DB calls |
| `brain-sdk-impl.ts` | SDK implementation | ⚠️ BROKEN — references non-existent flat tables |

---

## Broken Table References (neuroagi-core)

All `src/brain/*.ts` files reference a **flat public schema** that no longer exists. These were from the original Reggie architecture and were never updated when the schema was restructured.

| Code References | Actual Table | Fix |
|---|---|---|
| `behavioral_signals` | `brain.signals` WHERE `signal_type='behavioral'` | Use `.schema('brain').from('signals').eq('signal_type','behavioral')` |
| `emotional_signals` | `brain.signals` WHERE `signal_type='emotional'` | Use `.schema('brain').from('signals').eq('signal_type','emotional')` |
| `knowledge_signals` | `brain.signals` WHERE `signal_type='knowledge'` | Use `.schema('brain').from('signals').eq('signal_type','knowledge')` |
| `context_signals` | `brain.signals` WHERE `signal_type='context'` | Use `.schema('brain').from('signals').eq('signal_type','context')` |
| `outcome_signals` | `brain.signals` WHERE `signal_type='outcome'` | Use `.schema('brain').from('signals').eq('signal_type','outcome')` |
| `concept_progress` | `brain.knowledge` | Use `.schema('brain').from('knowledge')` |
| `concept_connections` | `brain.knowledge_graph` | Use `.schema('brain').from('knowledge_graph')` |
| `insights` | `brain.reflections` (key_insights field) | Use `.schema('brain').from('reflections')` |
| `patterns` | `neuro.patterns` | Use `.schema('neuro').from('patterns')` |
| `students` | `neuro.persons` | Use `.schema('neuro').from('persons')` |
| `agents` | `agents.registry` | Use `.schema('agents').from('registry')` |
| `events` | `brain.action_log` | Use `.schema('brain').from('action_log')` |
| `changelog` | `brain.audit_trail` | Use `.schema('brain').from('audit_trail')` |

---

## Architecture Problems Found

### Problem 1: `src/brain/*.ts` files are entirely dead code
**Severity: HIGH**  
Every file in `src/brain/` references tables that do not exist in the current schema. None of these files can execute successfully. They are conceptual blueprints written before the schema was restructured, never updated.

**Impact:** The neuroagi-core repo's `src/` directory is currently non-functional. The actual working brain logic lives in `FschoolAI-/backend/server/services/brain-*.ts`.

**Fix:** Rewrite all `src/brain/*.ts` files to use `schema('brain').from(...)` pattern. Or delete them and treat the FschoolAI backend brain services as the canonical implementation.

### Problem 2: SDK references same broken flat tables
**Severity: HIGH**  
`brain-sdk-impl.ts` (both in neuroagi-core and FschoolAI's copy) calls `.from('knowledge_signals')`, `.from('behavioral_signals')`, etc. — none of which exist.

**Impact:** Any product that uses the SDK to call `getContext()` will get empty results or errors.

**Fix:** Rewrite `brain-sdk-impl.ts` to use the `brain.signals` table with signal_type filtering.

### Problem 3: 58 brain tables, only ~10 have data
**Severity: MEDIUM**  
The `brain` schema has 58 tables. Only 10 have any rows. The other 48 are empty — `hypotheses`, `interventions`, `context_window`, `knowledge`, `knowledge_graph`, `predictions`, `cost_tracking`, etc.

**Impact:** The most important intelligence tables (hypotheses, interventions, context_window) are empty, meaning the brain cannot currently generate proactive interventions or pre-compute context windows.

**Fix:** The `brain-context-window.ts`, `brain-reflection-engine.ts`, and `autonomous-reflection-engine.ts` services in FschoolAI need to be running and processing data to populate these tables.

### Problem 4: No indexes on high-traffic columns
**Severity: MEDIUM**  
`brain.signals` (371 rows, will grow to millions) has no index on `(person_id, signal_type, occurred_at)`. Same for `agents.messages` (1,467 rows) on `(person_id, session_id)`.

**Impact:** As data grows, queries will become slow. At 100k signals, an unindexed scan will take 50-200ms per query.

**Fix:** Add composite indexes:
```sql
CREATE INDEX idx_signals_person_type_time ON brain.signals (person_id, signal_type, occurred_at DESC);
CREATE INDEX idx_messages_person_session ON agents.messages (person_id, session_id);
CREATE INDEX idx_reflections_person_time ON brain.reflections (person_id, created_at DESC);
CREATE INDEX idx_patterns_person_confidence ON neuro.patterns (person_id, confidence DESC);
```

### Problem 5: No foreign key constraints
**Severity: MEDIUM**  
There are zero foreign key constraints in the NeuroAGI Brain DB (confirmed by inspection). `brain.signals.person_id` does not reference `neuro.persons.id`. `agents.messages.session_id` does not reference `agents.sessions.id`.

**Impact:** Orphan records can accumulate silently. Data integrity is not enforced at the database level.

**Fix:** Add FK constraints, at minimum on the most critical relationships.

### Problem 6: `fschool.*` schema in Brain DB is empty
**Severity: LOW (for now)**  
The Brain DB has a `fschool` schema with 9 tables for academic data, but all are empty (except `universities`). The FschoolAI Production DB has the actual Canvas data in `public.assignments`, `public.courses`, etc.

**Impact:** The brain cannot currently reason about academic deadlines, grades, or course load from its own schema. It reads from the FschoolAI Production DB's `public.*` tables via the FschoolAI backend.

**Fix:** Decide on the canonical location for academic data. Two options:
- **Option A (recommended):** FschoolAI syncs Canvas data into `fschool.*` in the Brain DB. Brain has everything in one place.
- **Option B:** Brain reads from FschoolAI Production DB directly via the SDK. Adds cross-database latency.

---

## How FschoolAI Connects to NeuroAGI Brain

The connection is **direct** — FschoolAI's backend services connect to the NeuroAGI Brain DB using `SUPABASE_URL` (which should point to `qiolhlvqfzujnkwnymft.supabase.co`).

```
FschoolAI Backend (Node.js)
  │
  ├── brain-chat-session.ts    → reads neuro.persons, agents.sessions/messages, brain.context_window
  ├── brain-context-window.ts  → reads brain.*, neuro.*, fschool.assignments
  ├── brain-reflection-engine.ts → writes brain.reflections, brain.signals
  ├── brain-scheduler.ts       → reads brain.scheduled_thinking
  ├── hypothesis-engine.ts     → reads/writes brain.hypotheses
  ├── intervention-engine.ts   → reads/writes brain.interventions
  └── signal-ingestion.ts      → writes brain.signals
```

**The single `SUPABASE_URL` env var must point to the NeuroAGI Brain DB** (`qiolhlvqfzujnkwnymft.supabase.co`), not the FschoolAI Production DB.

Some services (canvas-sync.ts, brain-compounding.ts) use `VITE_SUPABASE_URL` instead of `SUPABASE_URL` — this is a bug. Backend services should never use `VITE_` prefixed env vars.

---

## What Is Working Right Now

| Component | Status |
|---|---|
| Vincent's identity, trust, consent | ✅ Live in `neuro.*` |
| 371 brain signals | ✅ Live in `brain.signals` |
| 203 reflections | ✅ Live in `brain.reflections` |
| 88 patterns | ✅ Live in `neuro.patterns` |
| 39 sessions, 1,467 messages | ✅ Live in `agents.*` |
| 6 goals, momentum, reasoning state | ✅ Live in `brain.*` |
| Deep psychological model | ✅ Live in `brain.person_model` |
| brain-chat-session.ts (chat with brain) | ✅ Functional |
| brain-context-window.ts (context assembly) | ✅ Functional |
| brain-reflection-engine.ts (post-session reflection) | ✅ Functional |
| brain-scheduler.ts (scheduled thinking) | ✅ Functional |
| hypothesis-engine.ts | ✅ Functional |
| intervention-engine.ts | ✅ Functional |
| `src/brain/*.ts` (neuroagi-core SDK) | ❌ All broken — flat table references |
| `brain-sdk-impl.ts` | ❌ Broken — flat table references |
| `fschool.*` schema in Brain DB | ❌ Empty — Canvas data not synced here yet |
| `brain.hypotheses` | ❌ Empty — engine not yet running |
| `brain.interventions` | ❌ Empty — engine not yet running |
| `brain.context_window` | ❌ Empty — writer not yet running |
| `brain.knowledge` / `brain.knowledge_graph` | ❌ Empty — graph not yet built |

---

## Recommended Next Steps (Priority Order)

1. **Fix `src/brain/*.ts`** — Rewrite all files to use `schema('brain').from(...)` pattern. This makes the neuroagi-core SDK actually functional.

2. **Add database indexes** — Add composite indexes on `brain.signals`, `agents.messages`, `brain.reflections`, `neuro.patterns`. Do this before user growth.

3. **Decide on academic data location** — Either populate `fschool.*` in Brain DB from Canvas sync, or formalize that FschoolAI Production DB is the source and Brain DB reads via API.

4. **Start the brain engines** — Deploy `brain-scheduler.ts`, `hypothesis-engine.ts`, `intervention-engine.ts`, and `brain-context-window.ts` so the empty tables start populating.

5. **Add FK constraints** — At minimum on `brain.signals.person_id → neuro.persons.id` and `agents.messages.session_id → agents.sessions.id`.

6. **Fix env var naming** — Replace all `VITE_SUPABASE_URL` in backend services with `SUPABASE_URL`.
