# NeuroAGI Core

**The brain. The platform. The foundation of the NeuroAGI ecosystem.**

---

## What This Is

NeuroAGI Core is a **persistent intelligence engine** — a per-user "brain" that
lives independently of any single app. Products don't store their own user data
and start from zero; they plug into the brain and know the user from day one.

NeuroAGI Core  =  the brain + the platform        (the foundation)
FschoolAI      =  a product built on it           (students)
Reggie         =  a product built on it           (personal agent)
Your Agent     =  a product built on it           (ecosystem)



Products never touch the brain's internals. They consume it through one
**Brain API** — a stable contract. The brain is the asset; products are clients.

---

## The Brain API

Every interaction with the brain goes through these endpoints. They split into
three groups: **Memory** (read/write), **Intelligence** (act/learn), and
**Governance** (trust/privacy).

### Memory

| Endpoint | What it does | Status |
|---|---|---|
| `getContext(userId, productId)` | Everything the brain knows about a user | ✅ Available |
| `update(event)` | Feed one event into the brain | ✅ Available |
| `query(userId, filter)` | Targeted read (one subject, one signal type, a date range) | 🟡 Planned |
| `setGoals(userId, goals)` | Set/manage a user's goals | 🟡 Planned |

### Intelligence

| Endpoint | What it does | Status |
|---|---|---|
| `suggestNext(userId)` | Best agent + action for right now | ✅ Available (rule-based) |
| `recordOutcome(suggestionId, outcome)` | Tell the brain whether a suggestion worked — **the learning loop** | 🟡 Planned |
| `subscribe(userId, trigger, webhook)` | Brain **pushes** when it detects something (stress, deadline, focus window) | 🟡 Planned |
| `verifySkill(userId, skill)` | Evidence-backed proof of a skill | ✅ Available (basic) |
| `explain(userId, claim)` | Why the brain concluded something (trust/audit) | 🟡 Planned |

### Governance

| Endpoint | What it does | Status |
|---|---|---|
| `exportData(userId)` | Full data export (portability) | ✅ Available |
| `deleteData(userId)` | Right to be forgotten (GDPR/FERPA) | ✅ Available |
| `getHealthMetrics(userId)` | Brain stats (signals, concepts, age) | ✅ Available |

---

## Usage

```ts
import { createBrainSDK } from '@neuroagi/brain-sdk';

const brain = createBrainSDK({ productId: 'your-product-id' });

// 1. Read — your agent is personalized instantly
const context = await brain.getContext(userId);
// context.knowledgeGaps  → what to teach next
// context.focusPattern   → when to send notifications
// context.emotionalState → how to tone the response

// 2. Write — the brain learns from every interaction
await brain.update({
  userId,
  productId: 'your-product-id',
  eventType: 'concept_learned',
  data: { subject: 'Calculus', concept: 'Integration', masteryLevel: 0.85 },
});

// 3. Act — ask what the user needs right now
const suggestion = await brain.suggestNext(userId);
// → { agentId, reason, action, urgency, confidence }

// 4. Learn (roadmap) — close the loop so the brain improves
await brain.recordOutcome(suggestion.id, { worked: true });
The Core Loop
A real brain isn't just storage — it's a closed loop:


   update() ──→  brain learns  ──→  suggestNext()  ──→  product acts
      ▲                                                      │
      └──────────────  recordOutcome()  ◄────────────────────┘
                    (did the suggestion work?)
recordOutcome and subscribe are what turn the brain from a smart database
into something that learns and acts. They're the next build priority.

Why Build on NeuroAGI?
Without it: every app starts cold. Months of data collection before any
personalization.

With it: call getContext(userId) and immediately know what the user knows,
how they learn, when they focus, and what they're struggling with. Every product
gets smart on day one, and because they share one brain, learning compounds
across the whole ecosystem.

Architecture

┌──────────────────────────────────────────────────────────┐
│                  NeuroAGI Core (service)                   │
│                                                            │
│   Brain Engines (PRIVATE)                                  │
│   pattern · causal · prediction · intervention · graph     │
│                          │                                 │
│                  Brain API (PUBLIC)                        │
│   memory · intelligence · governance                       │
└──────────────────────────┼─────────────────────────────────┘
                           │  (HTTPS · scoped per-product key)
          ┌────────────────┼────────────────┐
     ┌────▼────┐      ┌─────▼────┐      ┌────▼─────┐
     │FschoolAI│      │  Reggie  │      │Your Agent│
     └─────────┘      └──────────┘      └──────────┘
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    └─────────────┘
The brain runs as a hosted service. Products get a thin client + a
scoped key — never the service key, never the internals.

Status & Roadmap
NeuroAGI is early-stage. Here's what's real today vs. what's coming, so
teams build against reality:

✅ Working now

Persistent per-user memory (getContext / update)
Event ingestion + signal routing
Rule-based suggestNext
Basic verifySkill
Data export / delete
🟡 In progress / next

Learning loop (recordOutcome) — so suggestions improve over time
Proactive triggers (subscribe / webhooks) — brain pushes, not just polled
Targeted queries (query) — stop over-fetching full context
Per-product isolation + consent — scope what each product reads
Wire the brain engines into suggestNext (pattern → prediction → intervention)
🔭 Planned

explain for trust/audit
Hardened verifySkill with evidence model (for recruiting use)
Goal management
For the NeuroAGI Dev Team
Brain engines (src/brain/) are private and run server-side only.
Products consume the brain over the API with a per-product scoped key.
The service key never ships inside a product.
Products on NeuroAGI
Product	Description	Status
FschoolAI	AI academic intelligence for students	Active
Reggie	Personal AI agent manager	Planned
Neural Card	Physical brain card (hardware)	Pre-sale
Proprietary — NeuroAGI Inc. All rights reserved.


