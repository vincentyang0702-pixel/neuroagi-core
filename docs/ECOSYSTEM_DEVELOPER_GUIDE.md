# NeuroAGI Ecosystem — Developer Guide

> **How to build agent apps on the NeuroAGI brain**

This guide is for developers building products on the NeuroAGI ecosystem — whether you're on the FschoolAI team, the Reggie team, or an external developer building your own agent.

---

## The Big Idea

Every AI product today starts from zero. When a new user opens your app, your AI knows nothing about them. You spend weeks collecting data before you can personalize anything. Most apps never get there.

**NeuroAGI flips this.**

When you build on NeuroAGI, your agent calls `brain.getContext(userId)` and immediately knows:

- What the user knows and doesn't know (knowledge graph)
- How they learn best (learning style)
- When they focus best (focus patterns)
- What they're struggling with right now (knowledge gaps)
- Their emotional state (stressed, motivated, fatigued)
- Their goals and recent activity

Your agent is **immediately personalized** from the first interaction.

---

## The Ecosystem Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     NeuroAGI Core (PRIVATE)                  │
│                                                              │
│   Brain Engine                                               │
│   ├── Pattern Recognition  (finds behavioral patterns)      │
│   ├── Causal Inference     (understands WHY things happen)  │
│   ├── Prediction Engine    (forecasts what user needs next) │
│   ├── Intervention Engine  (decides WHEN and HOW to act)    │
│   ├── Knowledge Graph      (maps what user knows)           │
│   └── Brain Compounding    (brain gets smarter over time)   │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │              Brain SDK  (PUBLIC)                     │  │
│   │   getContext() | update() | suggestNext() | verify() │  │
│   └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
   ┌─────▼──────┐      ┌──────▼─────┐      ┌──────▼──────┐
   │ FschoolAI  │      │   Reggie   │      │  Your App   │
   │ (students) │      │ (personal) │      │ (ecosystem) │
   └────────────┘      └────────────┘      └─────────────┘
```

**The rule:** Products never touch the brain internals. They only call the SDK. This is how the brain stays secure and how NeuroAGI maintains the platform.

---

## Quick Start: Build Your First Agent App

### Step 1 — Install the SDK

```bash
# Copy the SDK files into your project
cp neuroagi-sdk/brain-sdk.ts your-project/src/
cp neuroagi-sdk/brain-sdk-impl.ts your-project/src/
```

### Step 2 — Initialize the Brain

```typescript
import { createBrainSDK } from './brain-sdk-impl';

// One line. Your agent now has access to the brain.
const brain = createBrainSDK({ productId: 'your-product-id' });
```

### Step 3 — Get User Context Before Every Response

```typescript
async function handleUserMessage(userId: string, message: string) {
  // ✅ ALWAYS do this first — never respond without brain context
  const context = await brain.getContext(userId);
  
  // Now your agent knows everything about this user
  console.log(context.knowledgeGaps);    // What they need to learn
  console.log(context.emotionalState);   // How they're feeling
  console.log(context.focusPattern);     // When they work best
  console.log(context.learningStyle);    // How they learn best
  
  // Build a personalized response using this context
  const response = buildResponse(message, context);
  return response;
}
```

### Step 4 — Ask the Brain What to Do Next

```typescript
// Don't guess what the user needs — ask the brain
const suggestion = await brain.suggestNext(userId);

console.log(suggestion.agentId);   // 'study-agent' | 'focus-agent' | etc.
console.log(suggestion.reason);    // Why this agent was chosen
console.log(suggestion.urgency);   // 'low' | 'medium' | 'high'
console.log(suggestion.action);    // What the agent should do

// Route to the right agent
const agent = agentRegistry[suggestion.agentId];
const response = await agent.respond(userId, context);
```

### Step 5 — Feed Every User Action Back to the Brain

```typescript
// Every user action teaches the brain something new
// This is how the brain gets smarter over time

// User completed an assignment
await brain.update({
  userId,
  productId: 'your-product-id',
  eventType: 'assignment_completed',
  data: { subject: 'Calculus', grade: 0.87, timeSpent: 45 }
});

// User learned a concept
await brain.update({
  userId,
  productId: 'your-product-id',
  eventType: 'concept_learned',
  data: { subject: 'Physics', concept: 'Newton\'s Third Law', masteryLevel: 0.75 }
});

// User had a focus session
await brain.update({
  userId,
  productId: 'your-product-id',
  eventType: 'focus_session',
  data: { duration: 45, subject: 'Math', outcome: 'completed' }
});
```

---

## The Four SDK Methods

### `brain.getContext(userId)`

Returns the brain's full understanding of a user. Call this before every AI response.

```typescript
const context: UserContext = await brain.getContext(userId);

// What you get:
context.knowledgeLevel      // { 'Calculus': 0.85, 'Physics': 0.62, ... }
context.learningStyle       // 'visual' | 'auditory' | 'kinesthetic' | 'reading'
context.focusPattern        // { peakHours: [20, 21, 22], avgSessionMinutes: 45 }
context.emotionalState      // 'stressed' | 'motivated' | 'neutral' | 'fatigued'
context.goals               // ['Pass finals', 'Get internship at startup']
context.recentActivity      // Last 20 events
context.knowledgeGaps       // ['Integration by parts', 'Thermodynamics', ...]
context.strengths           // ['Algebra', 'Python', 'Problem-solving', ...]
```

### `brain.update(event)`

Feeds a new event into the brain. Call this after every meaningful user action.

```typescript
await brain.update({
  userId: 'user-123',
  productId: 'your-product-id',
  eventType: 'study_session',          // See event types below
  data: {
    subject: 'Calculus',
    duration: 45,                       // minutes
    outcome: 'completed',
    grade: 0.87,
  }
});
```

**Available event types:**

| Event Type | When to Use |
|---|---|
| `study_session` | User completes a study session |
| `assignment_completed` | User submits or finishes an assignment |
| `concept_learned` | User demonstrates understanding of a concept |
| `focus_session` | User enters/exits focus mode |
| `grade_received` | User gets a grade back |
| `content_consumed` | User watches a video, reads an article |
| `signal_captured` | Any other signal (chat, click, behavior) |
| `knowledge_transfer` | User teaches someone else (strong mastery signal) |

### `brain.suggestNext(userId)`

Asks the brain what the user needs right now. Returns the best agent and action.

```typescript
const suggestion: AgentSuggestion = await brain.suggestNext(userId);

suggestion.agentId    // Which agent to use
suggestion.agentName  // Human-readable name
suggestion.reason     // Why this agent was chosen (for logging/debugging)
suggestion.confidence // 0-1 confidence score
suggestion.action     // What the agent should do
suggestion.urgency    // 'low' | 'medium' | 'high'
```

**Decision logic (in priority order):**
1. If user is stressed → `motivation-agent` (urgency: high)
2. If knowledge gaps exist → `study-agent` (urgency: medium)
3. If long focus session detected → `focus-agent` (urgency: medium)
4. Default → `recommendation-agent` (urgency: low)

### `brain.verifySkill(userId, skill)`

Returns AI-verified proof of a user's skill based on observed evidence — not self-reported.

```typescript
const proof: SkillVerification = await brain.verifySkill(userId, 'Python');

proof.verified        // true/false (requires 3+ sessions + 70%+ mastery)
proof.masteryLevel    // 0.92 (average across all observed sessions)
proof.evidenceCount   // 47 (number of sessions where this skill was used)
proof.lastVerified    // ISO timestamp of most recent evidence
```

**Use cases:**
- Skill badges on student profiles
- Resume/portfolio verification
- Recruiting — "This student has verified Python skills"
- Adaptive difficulty — adjust content based on verified mastery

---

## The Learning Loop

This is the core pattern every agent app must follow. Without this loop, the brain never learns and agents never improve.

```
┌─────────────────────────────────────────────────────────────┐
│                    The Learning Loop                         │
│                                                              │
│  1. User does something                                      │
│         ↓                                                    │
│  2. brain.update(event)  ← Feed it to the brain             │
│         ↓                                                    │
│  3. brain.getContext()   ← Brain now knows more              │
│         ↓                                                    │
│  4. brain.suggestNext()  ← Brain decides what to do         │
│         ↓                                                    │
│  5. Agent responds with personalized content                 │
│         ↓                                                    │
│  6. User does something again → back to step 1              │
│                                                              │
│  Result: Brain gets smarter with every cycle.               │
│  After 30 days: agent knows user better than any human.     │
└─────────────────────────────────────────────────────────────┘
```

---

## Building an Agent: Complete Example

Here is a complete example of a study agent that uses the brain properly.

```typescript
import { createBrainSDK } from './brain-sdk-impl';
import type { UserContext } from './brain-sdk';

const brain = createBrainSDK({ productId: 'my-study-app' });

class SmartStudyAgent {
  
  async respond(userId: string, userMessage: string): Promise<string> {
    
    // ─── Step 1: Get brain context ──────────────────────────────────
    const context = await brain.getContext(userId);
    
    // ─── Step 2: Build a context-aware prompt ───────────────────────
    const systemPrompt = this.buildSystemPrompt(context);
    
    // ─── Step 3: Call your LLM with the enriched prompt ─────────────
    const response = await callLLM({
      system: systemPrompt,
      user: userMessage,
    });
    
    // ─── Step 4: Update the brain with this interaction ─────────────
    await brain.update({
      userId,
      productId: 'my-study-app',
      eventType: 'signal_captured',
      data: {
        signalType: 'study_chat',
        topic: this.extractTopic(userMessage),
        responseQuality: 'high',
      }
    });
    
    return response;
  }
  
  private buildSystemPrompt(context: UserContext): string {
    return `
You are a personalized study assistant. Here is everything you know about this student:

KNOWLEDGE LEVEL:
${Object.entries(context.knowledgeLevel)
  .map(([subject, level]) => `- ${subject}: ${Math.round(level * 100)}% mastery`)
  .join('\n')}

KNOWLEDGE GAPS (focus on these):
${context.knowledgeGaps.map(g => `- ${g}`).join('\n')}

STRENGTHS (build on these):
${context.strengths.map(s => `- ${s}`).join('\n')}

EMOTIONAL STATE: ${context.emotionalState}
${context.emotionalState === 'stressed' ? '→ Be encouraging and break things into small steps.' : ''}
${context.emotionalState === 'motivated' ? '→ Challenge them with harder material.' : ''}
${context.emotionalState === 'fatigued' ? '→ Keep it short and use examples.' : ''}

LEARNING STYLE: ${context.learningStyle}
${context.learningStyle === 'visual' ? '→ Use diagrams, charts, and visual analogies.' : ''}
${context.learningStyle === 'kinesthetic' ? '→ Give practice problems and hands-on examples.' : ''}
${context.learningStyle === 'reading' ? '→ Use structured text with clear headings.' : ''}

BEST FOCUS HOURS: ${context.focusPattern.peakHours.map(h => `${h}:00`).join(', ')}
AVERAGE SESSION: ${context.focusPattern.avgSessionMinutes} minutes

Adapt your response to this specific student. Do not give generic answers.
    `.trim();
  }
  
  private extractTopic(message: string): string {
    // Simple topic extraction — replace with NLP in production
    const subjects = ['math', 'calculus', 'physics', 'chemistry', 'history', 'english'];
    return subjects.find(s => message.toLowerCase().includes(s)) || 'general';
  }
}
```

---

## What Makes a Good Agent on NeuroAGI

**Always call `brain.getContext()` first.** An agent that doesn't use brain context is just a generic chatbot. The brain is what makes your agent 10x better.

**Always call `brain.update()` after.** Every interaction is a learning opportunity. If you don't feed events back, the brain can't improve. The loop only works if both sides are connected.

**Use `brain.suggestNext()` for proactive features.** Don't wait for the user to ask. The brain knows what they need before they do. Use this to send proactive notifications, surface relevant content, or trigger interventions.

**Use `brain.verifySkill()` for trust.** Self-reported skills are worthless. Brain-verified skills are valuable. Build features that reward verified mastery — badges, unlocks, recruiting signals.

---

## Access Control

| Who | What They Can Access |
|---|---|
| **NeuroAGI team** | Full brain internals + SDK |
| **FschoolAI team** | SDK only (`neuroagi-sdk/`) |
| **Reggie team** | SDK only (`neuroagi-sdk/`) |
| **External developers** | SDK only (future public release) |

The brain internals (`src/brain/`) are never shared with product teams. Products consume the brain through the SDK contract. This is how the brain stays secure and how NeuroAGI maintains its competitive moat.

---

## Supabase Database

The brain reads from and writes to these key tables:

| Table | What It Stores |
|---|---|
| `behavioral_signals` | Study sessions, focus sessions, activity patterns |
| `emotional_signals` | Emotional state, stress levels, motivation |
| `knowledge_signals` | Subject mastery, concept understanding |
| `context_signals` | Any other signal (chat, click, behavior) |
| `concept_progress` | Per-concept mastery levels (the knowledge graph) |
| `concept_connections` | How concepts relate to each other |
| `insights` | AI-generated insights about the user |
| `changelog` | Audit trail of all brain updates |

---

## Questions?

- **NeuroAGI team:** Check `src/brain/` for internals
- **FschoolAI team:** Check `docs/FSCHOOLAI_NEUROAGI_INTEGRATION_GUIDE.md`
- **Architecture questions:** Check `docs/NEUROOS_AGI_CORE_ARCHITECTURE.md`
- **Product strategy:** Check `docs/NEUROAGI_PRODUCT_STRATEGY.md`
