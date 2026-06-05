# NeuroAGI + FschoolAI — Database & Repo Audit
*Generated June 4, 2026*

---

## The 3 Supabase Projects

| Project | Ref | Region | Plan | Role | Action |
|---|---|---|---|---|---|
| **Reggie** | vanzrpqmkmqgsbjdnfvj | us-east-1 | NANO | → **NeuroAGI Brain DB** | Rename to "NeuroAGI Brain" |
| **vincentyang0702's Project** | wqgxpouhbwhwpzudrptp | us-east-1 | NANO | → **FschoolAI Product DB** | Rename to "FschoolAI Production" |
| **neuroagi-core** | qiolhlvqfzujnkwnymft | us-west-2 | MICRO | Empty duplicate | **DELETE** |

---

## The 2 GitHub Repos

| Repo | Connects To | Manages Schemas |
|---|---|---|
| `neuroagi-core` | NeuroAGI Brain DB | `brain.*`, `neuro.*`, `agents.*` |
| `FschoolAI-` | FschoolAI Product DB (primary) + Brain DB (read/write signals) | `public.*` (product), reads/writes to `brain.*` via Brain DB |

---

## Reggie DB — Full Schema Inventory (becomes NeuroAGI Brain DB)

### Schema: `brain` (53 tables)
**Currently referenced in FschoolAI- code (10 tables):**
- `signals` — all brain signals (behavioral, emotional, knowledge, context)
- `reflections` — autonomous reflections (89 rows of real data)
- `goals` — student goals
- `hypotheses` — brain hypotheses about the student
- `interventions` — intervention records
- `momentum` — current momentum state (1 row)
- `context_window` — assembled context
- `cost_tracking` — API cost tracking
- `scheduled_thinking` — scheduled brain tasks (3 rows)
- `signal_types` — signal type registry (20 rows)

**In DB but not yet referenced in code (43 tables — future brain capabilities):**
- `knowledge_graph`, `knowledge_world`, `knowledge` — knowledge mapping
- `predictions`, `reasoning_state` — predictive intelligence
- `peer_intelligence`, `referral_intelligence` — social brain
- `wellbeing`, `sleep`, `stress`, `coping` — wellbeing tracking
- `synthesis`, `self_model`, `growth` — higher-order brain
- `relationships`, `groups`, `group_members` — social graph
- `reports` (9 rows), `behavior_config` (4 rows) — operational
- 28 more empty tables for future features

### Schema: `neuro` (13 tables)
**Referenced in code (5 tables):**
- `persons` — person profiles (3 rows)
- `patterns` — behavioral patterns (88 rows of real data)
- `memory` — key-value memory (12 rows)
- `preferences` — user preferences
- `voice` — voice patterns

**In DB but not referenced (8 tables):**
- `consent`, `boundaries`, `trust` — privacy/trust layer
- `locations`, `milestones`, `network`, `social_profiles`, `signal_sources`

### Schema: `agents` (5 tables)
**Referenced in code (2 tables):**
- `messages` — 1,469 rows (all Reggie conversation messages)
- `sessions` — 39 rows (all Reggie sessions)

**In DB but not referenced (3 tables):**
- `outputs`, `registry` (1 row), `unsaid`

### Schema: `api` (10 tables) — LEGACY
**NOT referenced in any code — these are the old grademaxing.com Netlify function tables:**
- `messages` (1,469 rows — duplicate of agents.messages)
- `sessions` (39 rows — duplicate of agents.sessions)
- `reggie_impressions` (68 rows — real impression data)
- `reggie_memory` (8 rows — real memory data)
- `reggie_profile` (1 row)
- `reggie_errors`, `reggie_future`, `reggie_session_notes`, `reggie_unsaid`, `students` (3 rows)

**Action needed:** The `api` schema is the old grademaxing.com schema. The data here (impressions, memory, profile) is Vincent's real brain data. This needs to be migrated into `brain.*` and `neuro.*` before grademaxing.com is retired.

### Schema: `fschool` (9 tables)
**Referenced in code (4 tables):**
- `assignments`, `courses`, `grades`, `students`

**In DB but not referenced (5 tables):**
- `canvas_sync_log`, `interview_prep`, `study_plans`, `submissions`, `universities`

### Schema: `public` (in Reggie DB — old grademaxing.com tables)
- `messages` (1,469 rows), `sessions` (39 rows), `students` (3 rows)
- `reggie_impressions` (68 rows), `reggie_memory` (8 rows)
- `student_patterns`, `student_momentum`, `trust_levels`, `reggie_unsaid`, `reggie_future`
- `reggie_mirror`, `reggie_corrections`, `session_close_queue`
- `reggie_session_notes`, `reggie_config`, `reggie_errors`, `reggie_profile`
- `relationship_tokens`, `reggie_arc`, `courses`

---

## FschoolAI Production DB — Schema Inventory (vincentyang0702 project)

### Schema: `public` (18 tables — live product data)
| Table | Rows | Status |
|---|---|---|
| users | 52 | LIVE — real students |
| assignments | 926 | LIVE — Canvas synced |
| courses | 84 | LIVE — Canvas synced |
| canvas_data | 57 | LIVE — 13 users synced |
| reggie_config | 1 | Reggie orientation prompt |
| reggie_arc | 1 | Relationship arc |
| reggie_founding_record | 3 | Founding session records |
| chat_sessions | 0 | Schema exists, no data yet |
| messages | 0 | Schema exists, no data yet |
| sessions | 0 | Schema exists, no data yet |
| students | 0 | Schema exists, no data yet |
| + 7 more | 0 | Empty |

**No brain schemas exist here yet** — `brain.*`, `neuro.*`, `agents.*` are all absent.

---

## neuroagi-core Repo — Code vs Database Mismatch

The `neuroagi-core` repo code references tables with **no schema prefix** — meaning it assumes `public` schema:

```typescript
// neuroagi-core/src/brain/neuro-agi.ts — WRONG
this.supabase.from('behavioral_signals')  // assumes public.behavioral_signals
this.supabase.from('emotional_signals')   // assumes public.emotional_signals
this.supabase.from('knowledge_signals')   // assumes public.knowledge_signals
this.supabase.from('concept_progress')    // assumes public.concept_progress
this.supabase.from('concept_connections') // assumes public.concept_connections
this.supabase.from('insights')            // assumes public.insights
```

**None of these tables exist in the Reggie DB** — not in `public`, not anywhere. The neuroagi-core code is referencing a completely different table structure that doesn't exist in either database.

**Conclusion:** The `neuroagi-core` repo code was written against a different schema design (flat public schema with separate signal tables per type) that was **never deployed** to any database. The actual Reggie DB uses `brain.signals` (one unified signals table with a `signal_type` column) — a cleaner design.

---

## FschoolAI- Repo — Code vs Database

FschoolAI- correctly uses the schema-prefixed pattern:
```typescript
supabase.schema('brain').from('signals')    ✓ EXISTS in Reggie DB
supabase.schema('brain').from('reflections') ✓ EXISTS (89 rows)
supabase.schema('neuro').from('patterns')   ✓ EXISTS (88 rows)
supabase.schema('agents').from('messages')  ✓ EXISTS (1,469 rows)
```

**But some files still use the wrong pattern:**
- `agent-feedback.ts` → `.from('brain_signals')` — should be `.schema('brain').from('signals')`
- `canvas-sync-patch.ts` → `.from('brain_signals')` — same fix needed
- `neuro-agi.ts` (FschoolAI copy) → references `brain.signals.emotional` as a nested object (wrong — it's a flat table with `signal_type` column)

---

## Summary: What Needs to Happen

### Immediate (database cleanup)
1. **Rename** "Reggie" project → "NeuroAGI Brain" in Supabase dashboard
2. **Rename** "vincentyang0702's Project" → "FschoolAI Production" in Supabase dashboard
3. **Delete** "neuroagi-core" project (empty, MICRO plan, wrong region)
4. **Migrate** `api.*` data from Reggie DB into `brain.*` / `neuro.*` before retiring grademaxing.com:
   - `api.reggie_impressions` (68 rows) → `brain.reflections` or new `brain.impressions` table
   - `api.reggie_memory` (8 rows) → `neuro.memory`
   - `api.students` (3 rows) → `neuro.persons`

### Code fixes needed
5. **neuroagi-core repo**: Rewrite `neuro-agi.ts`, `brain-compounding.ts`, `knowledge-graph.ts` to use `brain.*` schema pattern instead of flat public tables
6. **FschoolAI- repo**: Fix `agent-feedback.ts` and `canvas-sync-patch.ts` — replace `.from('brain_signals')` with `.schema('brain').from('signals')`

### Architecture alignment
7. **FschoolAI Production DB** needs brain schemas added when brain goes live:
   - Deploy `brain.*`, `neuro.*`, `agents.*` migrations from neuroagi-core repo
   - OR: FschoolAI backend gets a second Supabase client pointing to Brain DB
