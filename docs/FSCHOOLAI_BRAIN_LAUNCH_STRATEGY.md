# FschoolAI → NeuroAGI: Student Second Brain Launch Strategy

> **The sequencing plan for launching FschoolAI before NeuroAGI hardware, while building the brain from day one so students can claim it when hardware ships.**

---

## The Core Insight

FschoolAI launches first. NeuroAGI hardware ships later. But the brain starts building on day one of FschoolAI — silently, automatically, from academic data that requires no hardware to capture. When NeuroAGI launches, the student does not start fresh. They **claim a brain that has been growing for months.**

This is not a workaround. It is the correct product strategy. The brain's value compounds over time. The earlier it starts, the more valuable it is at claim. A student who signs up for FschoolAI in September and claims their brain in March has six months of academic identity already built. That is the moat.

---

## What the FschoolAI Brain Contains

The student second brain inside FschoolAI is built entirely from software-accessible data sources. No hardware required.

| Data Source | Capture Method | What It Builds in the Brain |
|---|---|---|
| **Canvas LMS** | OAuth token sync | Grades, assignments, courses, deadlines, performance trends, submission history |
| **AI tutor conversations** | Native to FschoolAI | How the student thinks, what confuses them, learning velocity, concept mastery, communication style |
| **Class recordings** | Upload or LMS integration | Comprehension signals, vocabulary gaps, note-taking patterns |
| **Assignment submissions** | Canvas API | Writing style, effort signals, deadline behavior, improvement trajectory |
| **App behavioral signals** | FschoolAI session data | Focus patterns, session length, avoidance behaviors, time-of-day performance |
| **Session notes** | AI tutor synthesis | Weekly brain updates: what was learned, what gaps remain, what to address next |

Every one of these is captured through software. None requires the Neural Card. The brain builds itself from the moment the student connects their Canvas account.

---

## The Student Journey

### Stage 1 — FschoolAI Signup (Day 0)

Student signs up for FschoolAI. They connect their Canvas account. The brain is initialized silently in the background — a `person_id` is created in the NeuroAGI brain schema, and data ingestion begins.

The student does not need to know the brain exists yet. They are using FschoolAI as an AI tutor and academic assistant. The brain is the infrastructure running underneath.

> **Decision point:** Silent brain from day one (Option A) vs. explicit opt-in at signup (Option B).
>
> **Recommendation: Option A.** The data being captured is academic — Canvas grades, tutor sessions, class recordings. This is not biometric or social data. It is the same data the student is actively sharing with FschoolAI to get help. Starting the brain silently from day one gives a richer brain at claim time and does not require explaining NeuroAGI to a student who just wants help with their homework. A clear consent disclosure in the terms of service covers this.

### Stage 2 — Brain Grows (Months 1–N)

Every interaction with FschoolAI feeds the brain:

- Every AI tutor conversation is analyzed for knowledge signals (what the student knows, what they don't, how they ask questions)
- Every Canvas sync updates the academic record (grades, upcoming deadlines, performance trends)
- Every session writes behavioral signals (focus duration, time of day, avoidance patterns)
- Weekly synthesis: Claude reads all signals and writes a structured brain update to `brain.reports`

The student can see their brain at any time through the FschoolAI dashboard — a "Your Second Brain" view showing what the AI knows about them, what gaps it has identified, and what it predicts they need next.

### Stage 3 — NeuroAGI Launch (Hardware Ships)

When NeuroAGI hardware launches, every FschoolAI student sees a prompt:

> **"Claim Your Brain"**
> Your second brain has been building since [signup date]. It contains [X] learning sessions, [Y] knowledge insights, and [Z] weeks of academic history. Claim it now to make it permanently yours — encrypted with your key, anchored on the blockchain, portable to any device.

The claim flow:
```
Student taps "Claim Your Brain"
        ↓
Privy creates their wallet keypair (email login → embedded wallet, no MetaMask needed)
        ↓
Brain data is encrypted with their public key
        ↓
Blockchain anchor written on Polygon:
  "Brain ID: [uuid], Owner: [wallet address], Built since: [signup date]"
        ↓
Neural Card ships — student activates card
        ↓
Brain migrates to card: encrypted local snapshot + private key stored in secure element
        ↓
Full self-sovereignty: brain lives on card, cloud is backup only
```

**The provenance advantage:** The blockchain anchor proves the brain was being built for this student since their FschoolAI signup date — not since the hardware launch. A student who signed up six months before hardware launched has six months of verified, timestamped brain history. No competitor can offer this because they don't have the longitudinal data.

---

## What the Brain Is NOT at FschoolAI Launch

Being precise about this matters for trust.

| What it is | What it is not |
|---|---|
| A growing model of the student's academic identity | A surveillance tool |
| Built from data the student actively shares with FschoolAI | Built from screen capture or private messages |
| Visible and controllable by the student at any time | Hidden or inaccessible |
| Encrypted at rest (Phase 1) | Encrypted during processing (Phase 3 — TEE) |
| Owned by NeuroAGI until claimed | Owned by the student after claim |

The honest Phase 1 privacy statement:

> "Your brain data is encrypted before it touches our servers. Only you hold the decryption key. When the brain processes new information — when it reads your Canvas data or analyzes a tutor session — that processing happens on our servers. We never store your plaintext data after processing. When you claim your brain, it becomes permanently yours."

---

## Build Priority for FschoolAI Launch

These are the components that must be built before FschoolAI ships, in order of impact on the brain's quality and the student's trust.

### Must-Have at Launch

**1. Canvas Sync (highest priority)**
The brain's primary fuel. Without Canvas data, the brain has no academic anchor. OAuth integration, grade sync, assignment sync, deadline tracking. This is what turns FschoolAI from a chatbot into an academic intelligence system.

**2. Knowledge Extraction from AI Tutor Conversations**
Every conversation the student has with the AI tutor should write structured knowledge signals to `brain.knowledge`. What concept was discussed? What did the student get right? What did they get wrong? How did they ask the question? This is the cognitive fingerprint — it builds automatically from normal usage.

**3. Weekly Brain Synthesis (`brain.reports`)**
Claude reads all signals from the past week and writes a structured brain update: what the student learned, what gaps remain, what to address next. This is the "second brain" experience — the student can read it and see that the AI actually understands them.

**4. Student Brain Dashboard**
A view inside FschoolAI where the student can see their brain: knowledge map, performance trends, identified gaps, upcoming deadlines, weekly synthesis. This makes the brain tangible and builds trust before the claim moment.

**5. Export and Delete Controls**
Students can export their full brain as JSON or PDF at any time. Students can delete their brain and all associated data. These are not nice-to-haves — they are the foundation of the trust relationship.

**6. Consent UI (Tier 1 / Tier 2)**
- **Tier 1 (always on, no toggle):** Canvas data, AI tutor sessions, assignment data — the core academic record. This is what the student signed up for.
- **Tier 2 (opt-in):** Behavioral signals — session length, time-of-day patterns, focus duration. Clearly explained, easy to turn off.

**7. Privy Wallet (optional at signup, required at claim)**
Plant the wallet seed at FschoolAI signup. Students who want it can connect a wallet immediately. Students who don't can skip it — they'll be prompted again at claim time. This avoids forcing crypto on students who just want homework help, while ensuring the infrastructure is ready.

### Defer Until NeuroAGI Launch

- Polygon blockchain anchor (needs wallet — do at claim time)
- Lit Protocol access control (needed for cross-app sharing — not needed for FschoolAI-only)
- Neural Card migration flow
- TEE processing (Phase 3)

---

## The Positioning

### For FschoolAI Students (now)

> "FschoolAI builds your second brain as you study. Every assignment, every tutoring session, every class recording — your AI understands you better over time. When NeuroAGI launches, you'll claim that brain as yours forever."

### For NeuroAGI Investors (now)

> "We are not launching hardware cold. Every FschoolAI student is a pre-seeded NeuroAGI user. By the time hardware ships, we will have thousands of brains already built, already rich with longitudinal data, waiting to be claimed. The hardware launch is a migration event, not a cold start."

### For Students at Claim Time

> "Your second brain has been building since [date]. Claim it now. It's yours."

---

## The Flywheel

```
Student signs up for FschoolAI
        ↓
Brain starts building (Canvas + tutor sessions + behavioral)
        ↓
Brain gets smarter → FschoolAI gets better for that student
        ↓
Student trusts FschoolAI more → shares more data → brain gets richer
        ↓
NeuroAGI launches → student claims brain → hardware ships
        ↓
Brain migrates to Neural Card → student has full ownership
        ↓
Student uses NeuroAGI ecosystem (Reggie, future products)
        ↓
Brain gets smarter across all products → student never leaves
```

The brain is the lock-in. Not the app. Not the hardware. The brain — which the student built themselves, over months, through normal usage — is the thing they cannot replicate anywhere else.

---

## Open Questions to Decide Before Launch

1. **Silent brain vs. explicit opt-in at signup?** Recommendation: silent (Option A), with clear disclosure in terms of service.

2. **What does the student see on day one?** Does the brain dashboard show an empty state with a progress bar ("Your brain is 3% built — connect Canvas to accelerate"), or is it hidden until a threshold is reached?

3. **Who owns the brain before claim?** Legally, NeuroAGI holds the data as a custodian on behalf of the student. The student can export or delete at any time. At claim, ownership transfers cryptographically. This needs to be in the terms of service.

4. **What happens if a student never claims?** Brain stays in NeuroAGI's custody indefinitely? Deleted after X years of inactivity? Needs a policy.

5. **Can a student use FschoolAI without a brain?** Or is the brain mandatory infrastructure? Recommendation: mandatory — it's what makes FschoolAI better over time. Students who don't want it can delete and use a stateless mode, but the default should be brain-on.

---

*Document version: 1.0 — June 2026*
*Repo: vincentyang0702-pixel/neuroagi-core*
