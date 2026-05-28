# NeuroAGI Core

> The brain. The platform. The foundation of the NeuroAGI ecosystem.

---

## What This Is

NeuroAGI Core is the persistent intelligence engine that powers every product in the NeuroAGI ecosystem. It is **not** an app. It is the brain that apps are built on.

Think of it like this:

```
NeuroAGI Core  =  iOS + iCloud + Apple Silicon
FschoolAI      =  An app built on top of that
Reggie         =  Another app built on top of that
Your Agent     =  Your app, also built on top of that
```

The difference from Apple: developers don't just build apps — they build **agents that tap into a user's persistent brain**. When you build on NeuroAGI, your agent knows the user from day one.

---

## Repository Structure

```
neuroagi-core/
├── src/
│   ├── brain/          ← Core brain services (PRIVATE — never expose)
│   │   ├── neuro-agi.ts          ← Main brain service
│   │   ├── brain-compounding.ts  ← How the brain grows over time
│   │   ├── knowledge-graph.ts    ← User knowledge graph
│   │   ├── pattern-recognition.ts
│   │   ├── causal-inference.ts
│   │   ├── prediction-engine.ts
│   │   └── intervention-engine.ts
│   ├── agents/         ← Core agent implementations (PRIVATE)
│   │   ├── study-agent.ts
│   │   ├── focus-agent.ts
│   │   └── ...
│   ├── sdk/            ← PUBLIC — this is what developers use
│   │   ├── brain-sdk.ts          ← Interface (the contract)
│   │   └── brain-sdk-impl.ts     ← Implementation
│   └── types/          ← Shared types
├── docs/               ← Architecture docs
└── tests/
```

---

## The Brain SDK

The SDK is the **only** way external products interact with the brain. The internals are never exposed.

```typescript
import { createBrainSDK } from '@neuroagi/brain-sdk';

const brain = createBrainSDK({ productId: 'your-product-id' });

// Get full user context — your agent is immediately personalized
const context = await brain.getContext(userId);
// context.knowledgeGaps → what to teach next
// context.emotionalState → how to tone the response
// context.focusPattern → when to send notifications

// Feed events into the brain — it learns from everything
await brain.update({
  userId,
  productId: 'your-product-id',
  eventType: 'concept_learned',
  data: { subject: 'Calculus', concept: 'Integration', masteryLevel: 0.85 }
});

// Ask the brain what the user needs right now
const suggestion = await brain.suggestNext(userId);
// suggestion.agentId → which agent to use
// suggestion.reason → why
// suggestion.urgency → how fast to act

// Verify a user's skill with observed evidence
const proof = await brain.verifySkill(userId, 'Python');
// proof.verified → true/false
// proof.masteryLevel → 0.92
// proof.evidenceCount → 47 sessions
```

---

## The Four Core Methods

| Method | What It Does | When to Call |
|---|---|---|
| `brain.getContext(userId)` | Returns everything the brain knows about this user | Before every AI response |
| `brain.update(event)` | Feeds a new event into the brain | After every user action |
| `brain.suggestNext(userId)` | Returns the best agent + action for right now | When deciding what to show the user |
| `brain.verifySkill(userId, skill)` | Returns AI-verified proof of a skill | For skill badges, resumes, recruiting |

---

## Why Build on NeuroAGI?

**Without NeuroAGI:** Your agent starts from zero with every new user. You spend months collecting data before you can personalize anything.

**With NeuroAGI:** Your agent calls `brain.getContext(userId)` and immediately knows:
- What the user knows and doesn't know
- How they learn best
- When they focus best
- What they're struggling with right now
- Their goals and emotional state

Your agent is **immediately 10x more useful** than a generic AI.

---

## Products Built on NeuroAGI

| Product | Description | Status |
|---|---|---|
| **FschoolAI** | AI academic intelligence for students | Active |
| **Reggie** | Personal AI agent manager | Planned |
| **Neural Card** | Physical brain card (hardware) | Pre-sale |

---

## For the NeuroAGI Dev Team

The brain internals (`src/brain/`) are **never exposed to product teams**. Product teams (FschoolAI, Reggie) only get access to `src/sdk/`.

This is intentional. The brain is the core asset. Products consume it through the SDK contract.

---

## Ecosystem Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NeuroAGI Core (This Repo)                 │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Brain (PRIVATE)                                    │   │
│  │  Pattern Recognition → Causal Inference             │   │
│  │  → Prediction Engine → Intervention Engine          │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│  ┌───────────────────────▼──────────────────────────────┐  │
│  │  Brain SDK (PUBLIC)                                  │  │
│  │  getContext() | update() | suggestNext() | verify()  │  │
│  └───────────────────────┬──────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼──────┐  ┌──────▼─────┐  ┌──────▼──────┐
    │ FschoolAI  │  │   Reggie   │  │  Your Agent │
    │ (students) │  │ (personal) │  │ (ecosystem) │
    └────────────┘  └────────────┘  └─────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    │ (57 tables) │
                    └─────────────┘
```

---

## License

Proprietary — NeuroAGI Inc. All rights reserved.
