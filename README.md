# NeuroAGI Core

**The shared brain behind every NeuroAGI product.**

---

## What This Is

NeuroAGI Core is a **persistent intelligence engine** — a per-user "brain" that
lives independently of any single app. Our products plug into it and know the
user from day one instead of starting cold and re-collecting data each time.

NeuroAGI Core  =  the shared brain        (one source of user intelligence)
FschoolAI      =  a product on it          (students) — its agent layer is Reggie
Neural Card    =  hardware that carries the brain



Today the brain powers **our own (first-party) products**. Products never touch
the brain's internals — they consume it through one **Brain API**. The brain is
the asset; products are clients.

> **Scope note:** NeuroAGI is currently an **internal platform** for our products.
> Opening the Brain API to **external/third-party developers** is a possible
> future direction — not decided, not built. We don't claim it today.

---

## How It Fits Together

The brain **stores and predicts**. A product's agent layer turns that into
action. In FSchoolAI, that agent layer is **Reggie**.

User message  (in FschoolAI)
│
▼
┌──────────────────────────────────────────────┐
│  Reggie — FschoolAI's agent manager            │
│  "triage nurse": reads the brain, picks the     │
│   right specialist agent for THIS moment        │
│   (fast model for routing)                      │
└───────────────┬────────────────────────────────┘
│  brain.getContext() + brain.suggestNext()
▼
┌──────────────────────────────────────────────┐
│  Specialist Agents (stronger model)            │
│  Study Buddy · Focus Guardian · Motivation     │
│  Coach · Research · Writing · Monitor · …       │
└───────────────┬────────────────────────────────┘
│  brain.update()  (logs the interaction back)
▼
NeuroAGI Brain



**Example routing:**
- "I can't focus" → Reggie sees you've been up since 2am → **Focus Guardian**
- "I don't get this concept" → Reggie sees the knowledge gap → **Study Buddy**
- "I'm overwhelmed" → Reggie sees 3 deadlines in 48h → **Motivation Coach**

Reggie doesn't answer — it *decides who answers*. That's why it's a manager, not
a chatbot. Each product builds its own agent layer; Reggie is FSchoolAI's.

---

## The Brain API

Three groups: **Memory** (read/write), **Intelligence** (act/learn),
**Governance** (trust/privacy).

### Memory
| Endpoint | What it does | Status |
|---|---|---|
| `getContext(userId, productId)` | Everything the brain knows about a user | ✅ Available |
| `update(event)` | Feed one event into the brain | ✅ Available |
| `query(userId, filter)` | Targeted read (one subject / signal / date range) | 🟡 Planned |
| `setGoals(userId, goals)` | Set & manage a user's goals | 🟡 Planned |

### Intelligence
| Endpoint | What it does | Status |
|---|---|---|
| `suggestNext(userId)` | Best agent + action right now — **what Reggie calls** | ✅ Available (rule-based) |
| `recordOutcome(suggestionId, outcome)` | Did the suggestion work? — **the learning loop** | 🟡 Planned |
| `subscribe(userId, trigger, webhook)` | Brain **pushes** on stress / deadline / focus window | 🟡 Planned |
| `verifySkill(userId, skill)` | Evidence-backed proof of a skill | ✅ Available (basic) |
| `explain(userId, claim)` | Why the brain concluded something | 🟡 Planned |

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

const brain = createBrainSDK({ productId: 'fschoolai' });

// 1. Read — the agent is personalized instantly
const context = await brain.getContext(userId);

// 2. Reggie asks the brain who should help right now
const suggestion = await brain.suggestNext(userId);
// → { agentId: 'focus-agent', reason, action, urgency, confidence }

// 3. Reggie dispatches to that specialist → it responds

// 4. Write the interaction back so the brain learns
await brain.update({
  userId, productId: 'fschoolai',
  eventType: 'agent_interaction',
  data: { agentId: suggestion.agentId, outcome: 'helped' },
});

// 5. Close the loop (roadmap) — tell the brain if the routing worked
await brain.recordOutcome(suggestion.id, { worked: true });
The Core Loop

   update() ──→ brain learns ──→ suggestNext() ──→ Reggie routes ──→ agent acts
      ▲                                                                  │
      └─────────────────  recordOutcome()  ◄───────────────────────────┘
                        (did the routing actually help?)
recordOutcome + subscribe are what turn the brain from a smart database into
something that learns and acts. They're the next build priority.

Why It Matters
Without a shared brain: every product starts cold — months of data
collection before any personalization, and nothing carries across products.

With it: any of our products calls getContext(userId) and instantly knows
what the user knows, how they learn, when they focus, and what they're struggling
with. Because all our products share one brain, learning compounds across the
whole portfolio.

Architecture

┌──────────────────────────────────────────────────────────┐
│                  NeuroAGI Core (service)                   │
│   Brain Engines (PRIVATE)                                  │
│   pattern · causal · prediction · intervention · graph     │
│                          │                                 │
│                  Brain API (PUBLIC, internal)              │
└──────────────────────────┼─────────────────────────────────┘
                           │  HTTPS · per-product scoped key
              ┌────────────┴────────────┐
        ┌─────▼───────────────┐   ┌──────▼──────┐
        │      FschoolAI      │   │ Neural Card │
        │  ┌───────────────┐  │   │ (hardware)  │
        │  │ Reggie + agents│  │   └─────────────┘
        │  └───────────────┘  │
        └─────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    └─────────────┘
The brain runs as a hosted service; products get a thin client + a scoped
key — never the service key, never the internals.

Components
Component	What it is	Status
Brain	Persistent per-user intelligence (memory + engines)	Core, active
Brain API / SDK	The only way products touch the brain (internal)	Active
FschoolAI	First product — students	Active
Reggie	FSchoolAI's agent manager — reads brain, routes to specialists	In FschoolAI (reggie-mobile-proto)
Specialist agents	Study Buddy, Focus Guardian, Motivation Coach, Research, Writing, Monitor…	Partially built
Neural Card	Hardware that carries your brain	Pre-sale
Status & Roadmap
NeuroAGI is early-stage. Build against reality:

✅ Working now — persistent memory (getContext/update), event ingestion,
rule-based suggestNext, basic verifySkill, export/delete, Reggie routing in
FschoolAI.

🟡 Next — learning loop (recordOutcome), proactive triggers (subscribe),
targeted query, per-product isolation + consent, wire the brain engines into
suggestNext, full specialist-agent roster.

🔭 Exploring (undecided) — opening the Brain API to external/third-party
developers. Not committed; internal-only for now.

For the Dev Team
Brain engines (src/brain/) are private, server-side only.
First-party products consume the brain over the API with a scoped key.
The service key never ships inside a product.
Proprietary — NeuroAGI Inc. All rights reserved.


