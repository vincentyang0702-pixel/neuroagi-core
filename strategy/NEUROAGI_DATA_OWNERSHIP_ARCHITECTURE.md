# NeuroAGI — Data Ownership, Privacy & Brain Sovereignty Architecture

> **Status:** Architecture specification. Identifies what is built, what is missing, and the correct approach for zero-privacy-compromise data ownership.

---

## The Core Problem

Every AI that learns about you has the same structural flaw: **the company that builds it owns the data, not you.** Your Google history belongs to Google. Your Spotify taste profile belongs to Spotify. Your therapy notes on BetterHelp belong to BetterHelp.

NeuroAGI is building the most intimate data product ever created — a model of how a person thinks, learns, feels, and behaves. If that data is stored on NeuroAGI's servers in plaintext, NeuroAGI has the same structural flaw as everyone else. We just have more sensitive data.

This document defines the architecture that makes the brain genuinely user-owned — not as marketing language, but as a technical guarantee.

---

## What "Brain Ownership" Actually Means

Ownership is not a UI setting. It is a cryptographic guarantee. A user truly owns their brain when:

1. **Only they can decrypt it** — not NeuroAGI, not a hacker, not a government subpoena
2. **They can prove it existed** — tamper-proof record of what the brain contained at any point in time
3. **They can take it anywhere** — export to any device, any app, any future system
4. **They can revoke access** — any app that has been granted access can be cut off instantly
5. **NeuroAGI going offline changes nothing** — the brain survives the company

Current state: **none of these are implemented.** Brain data lives in Supabase in plaintext, accessible to anyone with the service role key.

---

## The Three Approaches — Compared Honestly

### Approach 1: Blockchain + Lit Protocol (Crypto-Native)

The architecture discussed in previous sessions. User connects a wallet (MetaMask or Privy embedded wallet), brain data is encrypted with Lit Protocol access conditions, and a hash of each brain state is anchored on Polygon.

**What it solves:**
- User holds the decryption key in their wallet — NeuroAGI literally cannot read the data
- Blockchain anchor proves ownership and integrity without trusting NeuroAGI
- Lit Protocol allows conditional sharing: "decrypt only if wallet 0x123 signs"
- Brain is portable — can live on IPFS, S3, or anywhere

**What it does not solve:**
- The AI still needs to process raw data to build the brain. The moment you send a message to Claude, that message leaves the device. Encryption protects stored data, not data in transit or in use.
- Wallet UX is a barrier for non-crypto users (Privy solves this partially)
- Lit Protocol adds 200–400ms latency per decryption
- Smart contract writes cost money (small, but real)

**Verdict:** Correct for storage and ownership proof. Does not solve the processing privacy problem.

---

### Approach 2: Fully On-Device (Hardware-First)

The Neural Card / NeuroGlass vision. All brain data lives on the physical device. Processing happens locally using on-device models (Apple Neural Engine, Core ML, on-device LLMs like Llama 3 or Phi-3).

**What it solves:**
- Data never leaves the device — zero server exposure
- No API calls = no interception surface
- Works offline
- Truly self-sovereign: the card IS the brain

**What it does not solve — and this is the critical question you asked:**

> *"The data need to go through our system to auto build agent for user — is there a way that there is 0 privacy issue?"*

**Honest answer: not fully, with current technology.**

Here is why. Building the brain requires:

1. **Pattern recognition across thousands of signals** — current on-device models (even the best, like Phi-3 Mini or Gemma 2B) are not capable of the causal inference and hypothesis generation that Claude 3.5 Sonnet performs. The quality gap is significant.
2. **Reflection and synthesis** — the brain's weekly reflection process (89 reflections already in the DB) requires a frontier model. Running GPT-4 or Claude locally is not possible today on consumer hardware.
3. **Knowledge graph construction** — extracting structured knowledge from unstructured conversation requires a capable LLM.

**What IS possible on-device today:**
- Signal capture (behavioral, biometric, location, app usage)
- Local SQLite storage with AES-256 encryption
- Basic pattern matching and anomaly detection
- Inference using small models (Phi-3, Gemma 2B) for simple responses
- Encrypted sync to cloud backup

**What requires the cloud today:**
- Brain reflection and synthesis (frontier LLM)
- Knowledge graph construction
- Causal inference
- Prediction engine

**The honest position:** Full on-device is the 5-year vision. It is not achievable today without a significant quality compromise. The Neural Card can hold the data and handle capture, but the intelligence layer still needs the cloud.

---

### Approach 3: Confidential Computing (Zero-Knowledge Processing)

This is the correct answer to "0 privacy issue while still using our system."

The technology is called **Trusted Execution Environments (TEE)** — specifically, services like:
- **Phala Network** (decentralized TEE on blockchain)
- **Azure Confidential Computing** (Intel SGX)
- **AWS Nitro Enclaves**
- **Marlin Protocol** (TEE + blockchain)

**How it works:**

```
User's encrypted brain data
        ↓
Enters TEE (hardware-isolated secure enclave)
        ↓
Decrypted INSIDE the enclave — NeuroAGI server cannot see it
        ↓
Claude/LLM processes it inside the enclave
        ↓
Output (reflection, insight, updated brain) re-encrypted
        ↓
Returns to user — NeuroAGI never saw the plaintext
```

A TEE is a hardware-level secure zone inside a processor. Even the server operator — even NeuroAGI — cannot read what is being processed inside it. The user can verify (via remote attestation) that their data was processed in a genuine TEE and that the code running inside it is exactly what NeuroAGI published.

**This is the only architecture that achieves:**
- Full frontier LLM quality (Claude, GPT-4 running inside the enclave)
- Zero data exposure to NeuroAGI
- Cryptographic proof that the correct code ran
- No quality compromise

**Current limitation:** TEE services are expensive (~3–5x normal compute cost) and add engineering complexity. This is a Phase 3 architecture, not Phase 1.

---

## The Recommended Architecture by Phase

### Phase 1 — Now (Launch) — Encrypted at Rest + Wallet Identity

**What to build:**

| Component | Technology | What it does |
|---|---|---|
| Wallet identity | Privy | User gets a persistent keypair without needing MetaMask. Works for non-crypto users. |
| Client-side encryption | AES-256 + user's public key | Brain data encrypted before it hits Supabase. NeuroAGI stores ciphertext only. |
| Decryption key custody | User's wallet | Only the user's private key can decrypt. NeuroAGI cannot read stored data. |
| Blockchain anchor | Polygon (smart contract) | Hash of each brain state written on-chain. Tamper-proof ownership receipt. |
| Access control | Lit Protocol | "Decrypt only if wallet 0x123 signs" — controls which apps can read the brain. |

**Privacy guarantee:** NeuroAGI cannot read stored brain data. However, data is decrypted in the browser/app before being sent to Claude for processing. The processing layer is still exposed.

**Honest disclosure to users:** "Your stored brain data is encrypted and only you hold the key. When the brain processes new information, that processing happens on our servers. We never store your plaintext data."

---

### Phase 2 — 6–12 Months — On-Device Capture + Selective Cloud

**What to build:**

- Native iOS app with on-device signal capture (app usage, calendar, health, location)
- Local SQLite encrypted database on device (the Neural Card stores this)
- Small on-device model (Phi-3 Mini or Gemma 2B) handles low-stakes responses
- Only reflection and synthesis tasks are sent to cloud — and only as anonymized, tokenized inputs
- Differential privacy layer: add calibrated noise to behavioral signals before cloud transmission, so individual data points cannot be reverse-engineered

**Privacy guarantee:** Raw signals never leave the device. Only processed, anonymized summaries go to the cloud for synthesis. Significantly reduces exposure surface.

---

### Phase 3 — 12–24 Months — Confidential Computing

**What to build:**

- Deploy brain processing inside a TEE (Phala Network or Azure Confidential Computing)
- User's encrypted brain data enters the enclave, is processed by Claude, exits re-encrypted
- Remote attestation: user can verify that the code inside the enclave is exactly what NeuroAGI published (no backdoors possible)
- NeuroAGI's servers handle routing only — they never see plaintext

**Privacy guarantee:** Cryptographic proof that NeuroAGI cannot read your data even during processing. This is the "0 privacy issue" architecture.

---

## The Hardware Question — What the Neural Card Actually Does

The Neural Card is not a storage device. It is an **identity and access device.**

```
Neural Card
├── Stores: User's private key (never leaves the card)
├── Stores: Encrypted local brain snapshot
├── Does: Signs requests to prove identity
├── Does: Authorizes app access (tap to grant/revoke)
├── Does: Offline brain access (read-only, local model)
└── Does NOT: Run frontier LLM inference
```

Think of it like a hardware security key (YubiKey) combined with a local brain cache. The card is the proof of identity and the portable data store. The intelligence still runs in the cloud — but the cloud cannot access the data without the card authorizing it.

**This is achievable with current hardware.** A secure element chip (like the one in every iPhone and modern credit card) can store a 256-bit private key and sign requests. The card does not need to be a powerful computer. It needs to be a trusted key.

---

## What Is Currently Missing in the Codebase

| Gap | Severity | Fix |
|---|---|---|
| No wallet identity — random key lost on refresh | Critical | Integrate Privy (`@privy-io/react-auth`) |
| Brain data stored in Supabase plaintext | Critical | Client-side AES-256 encryption before write |
| Blockchain anchor is `Math.random()` fake hash | High | Deploy real Polygon smart contract |
| No Lit Protocol — no conditional access control | High | Install `@lit-protocol/lit-node-client` |
| No tiered consent — on/off only | Medium | Build Tier 1/2/3/4 consent UI |
| No proactive output — pull-based only | Medium | Build push notification + WhatsApp layer |
| Screen capture listed as standard source | Low | Flag as Tier 3 power-user only, off by default |
| No TEE processing | Future | Phase 3 architecture |

---

## The Positioning Statement

> "Your brain is yours. We encrypt it before it touches our servers. Only your key can unlock it. When the brain thinks, it thinks inside a secure enclave — we route the request, we never read the content. When you leave NeuroAGI, you take your brain with you. No other AI company can say this."

This is not marketing. It is a technical guarantee that can be verified by any developer who reads the code. That verifiability is what makes it defensible.

---

## Build Order

```
Week 1:  Privy wallet identity integration
Week 2:  Client-side AES-256 encryption of brain data
Week 3:  Polygon smart contract + real blockchain anchor
Week 4:  Lit Protocol access control layer
Month 2: On-device signal capture (iOS app)
Month 3: Differential privacy layer for cloud transmission
Month 6: TEE pilot on Phala Network
Month 12: Full confidential computing deployment
```

---

*Document version: 1.0 — June 2026*
*Repo: vincentyang0702-pixel/neuroagi-core*
