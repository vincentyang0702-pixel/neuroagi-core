# NeuroAGI Ecosystem Overview

> **Two companies. One brain. An ecosystem that gets smarter with every user.**

---

## The Two Companies

### NeuroAGI Inc. — The Platform Company

NeuroAGI is the infrastructure company. It builds and owns the brain — the persistent user intelligence layer that powers every product in the ecosystem.

Think of NeuroAGI as the equivalent of Apple building iOS, or AWS building cloud infrastructure. NeuroAGI doesn't build apps. It builds the intelligence that makes apps 10x better.

**What NeuroAGI owns:**
- The Brain Engine — pattern recognition, causal inference, prediction, intervention
- The Knowledge Graph — maps what every user knows
- The Brain SDK — the API that products use to access the brain
- The Neural Card — the physical hardware that makes the brain feel owned, not rented
- NeuroOS — the agent orchestration layer (Agent Manager)

### FschoolAI Inc. — The First Product

FschoolAI is the first product built on the NeuroAGI ecosystem. It's the student-facing app — academic AI for university students.

FschoolAI is to NeuroAGI what the iPhone was to iOS. It's the flagship product that proves the ecosystem works and shows the world what's possible when an AI actually knows you.

**What FschoolAI owns:**
- The student app (web + mobile)
- Canvas LMS integration
- Student-facing AI agents (Study Buddy, Focus Guardian, etc.)
- The student community and network

---

## The Relationship

```
NeuroAGI Inc.
│
├── Brain Engine (core asset — never shared)
├── Brain SDK (the API — shared with all products)
├── Neural Card (hardware)
└── NeuroOS Agent Manager
    │
    ├── FschoolAI (first-party product — students)
    ├── Future Product 2 (health, productivity, etc.)
    ├── Future Product 3 (enterprise, recruiting, etc.)
    └── External Developer Apps (ecosystem)
```

**The key insight:** FschoolAI doesn't own the brain. It rents access to the brain through the SDK. This means:

1. The brain gets smarter from FschoolAI usage, which benefits all other products
2. FschoolAI can never take the brain with them if they split — the brain stays with NeuroAGI
3. Every new product built on NeuroAGI makes the brain smarter for every user on every product

---

## Why This Structure Is Defensible

**For users:** Your brain is yours. It lives on your Neural Card. No app owns it. You can revoke access from any app at any time. This trust model is what makes users comfortable letting the brain learn everything about them.

**For developers:** You don't build an AI that starts from zero. You build on a brain that already knows the user. Your agent is immediately 10x smarter than any competitor's.

**For NeuroAGI:** The brain gets smarter with every user on every product. The more products built on NeuroAGI, the more data the brain has, the smarter it gets, the more valuable the platform becomes. This is the flywheel.

**For competitors:** They can't copy this. To replicate NeuroAGI, a competitor would need to rebuild the brain from scratch AND convince users to trust them with their data AND build the hardware AND build the SDK AND attract developers. The moat compounds over time.

---

## The Brain: What It Is and How It Works

The brain is not a chatbot. It's not an LLM wrapper. It's a persistent user intelligence model that grows over time.

### What the brain tracks:

**Knowledge Layer**
- What the user knows (mastery levels per subject/concept)
- What they don't know (knowledge gaps)
- How concepts connect to each other (knowledge graph)
- How fast they learn new concepts (learning velocity)

**Behavioral Layer**
- When they focus best (peak hours, session length)
- How they learn best (visual, kinesthetic, reading, auditory)
- What triggers procrastination (behavioral patterns)
- What motivates them (motivation drivers)

**Emotional Layer**
- Current emotional state (stressed, motivated, fatigued, neutral)
- Stress patterns (what causes stress, when it peaks)
- Confidence levels per subject
- Resilience after setbacks

**Predictive Layer**
- What they'll struggle with next (based on patterns)
- When they'll need intervention (before they ask)
- What they'll achieve if they stay on track
- Risk of burnout or dropout

### How the brain learns:

Every user action is a signal. Signals feed the brain. The brain updates its model of the user. The model gets more accurate over time.

```
User action → Signal captured → Brain processes → Model updated → Better predictions
```

After 7 days: the brain knows your patterns.
After 30 days: the brain knows you better than your study group.
After 90 days: the brain knows you better than most teachers.
After 1 year: the brain is your second brain.

---

## The Neural Card

The Neural Card is the physical manifestation of the brain. It's a credit-card-sized device that stores the user's brain data locally, on-device.

**Why hardware matters:**
- It makes the brain feel owned, not rented
- It creates a physical key that controls access to the brain
- It enables on-device processing for privacy-sensitive operations
- It's a pre-sale mechanism that generates revenue before the software is complete
- It's a status symbol — "I have a Neural Card" means "I have an AI that knows me"

**Pre-sale tiers:**
- Neural Card Standard — $599
- Neural Card Pro — $799
- Neural Card Elite — $1,299

---

## The Developer Ecosystem (Future)

When the brain is proven with FschoolAI, NeuroAGI will open the SDK to external developers.

**The developer pitch:**
> "Your agent knows the user from day one. When you build on NeuroAGI, you don't start with a blank user. You start with a user who already has months of context, learning history, goals, and preferences. Your agent is immediately 10x smarter than any competitor's."

**What developers get:**
- Brain SDK access (read context, update brain, get suggestions)
- 10,000 free API calls per month
- Access to the NeuroAGI developer community
- Co-marketing opportunities for top apps

**What NeuroAGI gets:**
- More data for the brain (every developer app adds signals)
- Platform revenue (API calls above free tier)
- Ecosystem lock-in (developers can't leave without losing the brain)

---

## Repository Structure

| Repository | Team | Access |
|---|---|---|
| `neuroagi-core` | NeuroAGI team only | Private — brain internals + SDK |
| `fschoolai-backend` | FschoolAI team | Private — student app backend |
| `FschoolAI-` | FschoolAI team | Private — original monorepo (being migrated) |

**Access rule:** FschoolAI team accesses `fschoolai-backend` only. They use the SDK to call the brain — they never see the brain internals. The brain internals are NeuroAGI's core IP.

---

## Current Status

| Component | Status | Notes |
|---|---|---|
| Brain Engine | Built, needs LLM wiring | Services exist, need real AI calls |
| Brain SDK | Built | `neuroagi-sdk/brain-sdk-impl.ts` |
| Agent Orchestrator | Fixed | Now uses brain context properly |
| Canvas Integration | Working | Grades/assignments sync to brain |
| Neural Card pre-sale | Live | reggieai.manus.space |
| FschoolAI app | In development | React frontend + Express backend |
| NeuroOS Agent Manager | Conceptual | Agent manager not yet built |
| Developer SDK (public) | Not started | After FschoolAI proves the model |

---

## The North Star

A student uses FschoolAI for 30 days. On day 31, they open the app and the first thing they see is:

> "You've been avoiding Integration by Parts for 3 weeks. Your Calculus final is in 12 days. Based on your learning style and the 45-minute focus window you have tonight at 9pm, I've prepared a 3-part session that will get you to 80% mastery. Want to start?"

They didn't ask for this. The brain knew. That moment — when the AI knows something the user didn't even consciously realize — is the moment the ecosystem becomes irreplaceable.

**That is the north star. Everything else is engineering to get there.**
