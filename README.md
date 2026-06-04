# NeuroAGI Core

> The brain. The platform. The foundation of the NeuroAGI ecosystem.

---

## What This Is

NeuroAGI Core is the persistent intelligence engine that powers every product in the NeuroAGI ecosystem. It is **not** an app. It is the brain that apps are built on.

Think of it like this:

```
NeuroAGI Core  =  iOS + iCloud + Apple Silicon
FschoolAI      =  An app built on top of that
Neural Card    =  Hardware that carries the brain
Your Product   =  Your app, also built on top of that (future)
```

The difference from Apple: products don't just share infrastructure — they share a **persistent per-user brain**. When any product calls `brain.getContext(userId)`, it instantly knows what the user knows, how they learn, when they focus, and what they're struggling with. Learning compounds across the whole portfolio.

> **Scope note:** NeuroAGI Core currently powers **our own first-party products**. Opening the Brain API to external/third-party developers is a possible future direction — not decided, not built. We don't claim it today.

---

## How It Fits Together

The brain **stores and predicts**. A product's agent layer turns that into action. In FschoolAI, that agent layer is **Reggie**.

```
User message  (in FschoolAI)
│
▼
┌──────────────────────────────────────────────┐
│  Reggie — FschoolAI's agent manager           │
│  reads the brain, picks the right specialist  │
│  agent for THIS moment  (fast routing model)  │
└───────────────┬──────────────────────────────┘
                │  brain.getContext() + brain.suggestNext()
                ▼
┌──────────────────────────────────────────────┐
│  Specialist Agents  (stronger model)          │
│  Assignment · Citation · Study · Focus ·      │
│  Motivation · Performance · Crisis · …        │
└───────────────┬──────────────────────────────┘
                │  brain.update()  (logs back to brain)
                ▼
          NeuroAGI Brain
```

**Example routing:**
- "I can't focus" → Reggie sees you've been up since 2am → **Focus Agent**
- "I don't get this concept" → Reggie sees the knowledge gap → **Study Agent**
- "Help me write my essay" → Reggie reads the Canvas assignment → **Assignment Agent**

Reggie doesn't answer — it *decides who answers*. That's why it's a manager, not a chatbot. Each product builds its own agent layer; Reggie is FschoolAI's.

---

## Repository Structure

```
neuroagi-core/
├── src/
│   ├── brain/          ← Core brain engines (PRIVATE — never expose)
│   │   ├── neuro-agi.ts              ← Main brain service
│   │   ├── brain-compounding.ts      ← How the brain grows over time
│   │   ├── brain-context-window.ts   ← Context assembly for every call
│   │   ├── knowledge-graph.ts        ← User knowledge graph
│   │   ├── pattern-recognition.ts
│   │   ├── causal-inference.ts
│   │   ├── prediction-engine.ts
│   │   ├── hypothesis-engine.ts
│   │   └── intervention-engine.ts
│   ├── sdk/            ← PUBLIC — the only way products touch the brain
│   │   ├── brain-sdk.ts              ← Interface (the contract)
│   │   └── brain-sdk-impl.ts         ← Implementation
│   └── types/          ← Shared types
├── docs/               ← Architecture docs
└── tests/
```

> **Note:** Agents (Reggie, specialist agents) live in each product repo — not here. The brain has no agents. It has engines.

---

## The Brain API

Three groups: **Memory** (read/write), **Intelligence** (act/learn), **Governance** (trust/privacy).

### Memory

| Method | What It Does | Status |
|---|---|---|
| `getContext(userId, productId)` | Everything the brain knows about this user | ✅ Available |
| `update(event)` | Feed one event into the brain | ✅ Available |
| `query(userId, filter)` | Targeted read — one subject / signal / date range | 🟡 Planned |
| `setGoals(userId, goals)` | Set and manage a user's goals | 🟡 Planned |

### Intelligence

| Method | What It Does | Status |
|---|---|---|
| `suggestNext(userId)` | Best agent + action right now — **what Reggie calls** | ✅ Available (rule-based) |
| `recordOutcome(suggestionId, outcome)` | Did the suggestion work? — **the learning loop** | 🟡 Planned |
| `subscribe(userId, trigger, webhook)` | Brain **pushes** on stress / deadline / focus window | 🟡 Planned |
| `verifySkill(userId, skill)` | Evidence-backed proof of a skill | ✅ Available (basic) |
| `explain(userId, claim)` | Why the brain concluded something | 🟡 Planned |

### Governance

| Method | What It Does | Status |
|---|---|---|
| `exportData(userId)` | Full data export (portability) | ✅ Available |
| `deleteData(userId)` | Right to be forgotten (GDPR/FERPA) | ✅ Available |
| `getHealthMetrics(userId)` | Brain stats — signals, concepts, age | ✅ Available |

---

## Usage

```typescript
import { createBrainSDK } from '@neuroagi/brain-sdk';

const brain = createBrainSDK({ productId: 'fschoolai' });

// 1. Read — the agent is personalized instantly
const context = await brain.getContext(userId);
// context.knowledgeGaps     → what to teach next
// context.emotionalState    → how to tone the response
// context.focusPattern      → when to send notifications

// 2. Reggie asks the brain who should help right now
const suggestion = await brain.suggestNext(userId);
// → { agentId: 'assignment-agent', reason, action, urgency, confidence }

// 3. Reggie dispatches to that specialist → it responds

// 4. Write the interaction back so the brain learns
await brain.update({
  userId,
  productId: 'fschoolai',
  eventType: 'agent_interaction',
  data: { agentId: suggestion.agentId, outcome: 'helped' },
});

// 5. Close the loop (roadmap) — tell the brain if the routing worked
await brain.recordOutcome(suggestion.id, { worked: true });
```

**The Core Loop:**

```
update() ──→ brain learns ──→ suggestNext() ──→ Reggie routes ──→ agent acts
   ▲                                                                   │
   └──────────────────  recordOutcome()  ◄──────────────────────────┘
                      (did the routing actually help?)
```

`recordOutcome` and `subscribe` are what turn the brain from a smart database into something that learns and acts proactively. They are the next build priority.

---

## Ecosystem Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    NeuroAGI Core (This Repo)                  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Brain Engines (PRIVATE)                             │   │
│  │  pattern · causal · prediction · intervention ·      │   │
│  │  hypothesis · knowledge-graph · compounding          │   │
│  └─────────────────────────┬────────────────────────────┘   │
│                             │                                 │
│  ┌──────────────────────────▼────────────────────────────┐  │
│  │  Brain API / SDK (internal — scoped key per product)  │  │
│  │  getContext() | update() | suggestNext() | verify()   │  │
│  └──────────────────────────┬────────────────────────────┘  │
└─────────────────────────────┘                                 
                              │  HTTPS · per-product scoped key
             ┌────────────────┴────────────────┐
       ┌─────▼──────────────────┐   ┌──────────▼──────┐
       │       FschoolAI        │   │   Neural Card   │
       │  ┌──────────────────┐  │   │  (hardware)     │
       │  │ Reggie + agents  │  │   └─────────────────┘
       │  └──────────────────┘  │
       └────────────────────────┘
                              │
                       ┌──────▼──────┐
                       │  Supabase   │
                       │ (90 tables) │
                       └─────────────┘
```

---

## Components

| Component | What It Is | Status |
|---|---|---|
| **Brain** | Persistent per-user intelligence — memory + engines | Core, active |
| **Brain API / SDK** | The only way products touch the brain | Active |
| **FschoolAI** | First product — academic intelligence for students | Active |
| **Neural Card** | Hardware that carries your brain | Pre-sale |

> Reggie and all specialist agents live in the FschoolAI repo, not here.

---

## Status and Roadmap

NeuroAGI is early-stage. Build against reality:

**✅ Working now** — persistent memory (`getContext` / `update`), event ingestion, rule-based `suggestNext`, basic `verifySkill`, export/delete, Reggie routing in FschoolAI.

**🟡 Next** — learning loop (`recordOutcome`), proactive triggers (`subscribe`), targeted query, per-product isolation and consent, wire brain engines into `suggestNext`, Canvas sync, knowledge extraction from conversations.

**🔭 Exploring (undecided)** — opening the Brain API to external/third-party developers. Not committed; internal-only for now.

---

## For the Dev Team

- Brain engines (`src/brain/`) are **private, server-side only** — never expose internals to products
- First-party products consume the brain over the API with a **scoped key** — never the service key
- Agents belong in product repos — if you are adding an agent to `neuroagi-core`, you are in the wrong place
- The brain has no personality and no voice — that is Reggie's job

---

## License

Proprietary — NeuroAGI Inc. All rights reserved.
