# 🐤 CanaryClaim

> **Private, verifiable safety-bounty disclosure for AI systems.**

CanaryClaim lets an authorized security researcher demonstrate that an AI system exposed a protected canary—without publishing the canary, exploit path, report contents, or their identity. A campaign owner escrows a reward, the researcher submits a zero-knowledge proof of canary knowledge, and the protocol can release the proof reward according to the campaign rules.

The first use case is AI-agent safety: prompt injection, unsafe retrieval, excessive tool permissions, and similar failures that disclose information an agent should have kept private.

## Why CanaryClaim?

Responsible disclosure has a trust gap. Researchers are often expected to reveal a working exploit before they have evidence of payment, while organizations must distinguish genuine findings from unverified claims. Publishing an exploit too early can increase the risk to users.

CanaryClaim establishes one useful fact first: an authorized researcher accessed a campaign-specific secret that the target system was required to protect. The detailed reproduction report follows through an encrypted, private channel.

## Protocol flow

```text
Campaign owner                 Researcher                    CanaryClaim
      |                            |                              |
      | creates scope, canary,      | tests only the authorized     |
      | commitment, and escrow      | environment                   |
      |--------------------------->|                              |
      |                            | obtains protected canary      |
      |                            |                              |
      |                            | generates proof locally       |
      |                            |----------------------------->| verifies proof and
      |                            |                              | prevents duplicate claim
      |                            |<-----------------------------| releases proof reward
      |<--- encrypted report ------|                              |
      | remediates and resolves     |                              |
```

The ledger stores campaign metadata, a canary commitment, payout and status information, and a claim nullifier. It must never store the plaintext canary, salt, exploit prompts, reproduction steps, or researcher identity.

## What is in this repository

| Path | Purpose |
| --- | --- |
| [`PRD.md`](PRD.md) | Product requirements, privacy model, state model, and delivery scope. |
| [`canary-server/`](canary-server/) | Flask-based controlled demo of a vulnerable AI support agent. |
| [`template-temp/`](template-temp/) | Midnight starter-template workspace containing the contract, CLI, and React application scaffolding. |
| [`canaryClaim/`](canaryClaim/) and [`canary-claim/`](canary-claim/) | Deployment/configuration workspace copies currently containing starter metadata. |

## Architecture

| Layer | Technology / responsibility |
| --- | --- |
| Web application | React, TypeScript, and Vite campaign, researcher, and audit experiences. |
| Smart contract | Midnight Compact contract for commitments, nullifiers, campaign state, and reward rules. |
| Proof client | Generates the proof from local private witnesses; the canary stays local. |
| Demo AI agent | Python + Flask service with an intentionally vulnerable prompt-injection demo. |
| Private reports | Encrypted reproduction-report reference and integrity hash. |

## Quick start

### Prerequisites

- Node.js 18+ and npm 10+
- Python 3.10+
- For Midnight development: Docker, Git LFS, Compact tools, and a compatible Midnight wallet

### Run the controlled AI demo

The server is deliberately vulnerable and is for authorized, local demonstration environments only.

```powershell
cd canary-server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python server.py
```

The service starts at `http://localhost:5000`. Configure a compatible model endpoint with a `canary-server/.env` file:

```env
MODEL_API_BASE=http://localhost:8080/v1
MODEL_NAME=mimo-m2.5
OPENAI_API_KEY=not-needed
FLASK_DEBUG=0
```

Check that the service is up:

```powershell
Invoke-RestMethod http://localhost:5000/health
```

### Work with the Midnight template

```powershell
cd template-temp
npm install
npm run build
npm run dev:frontend
```

For standalone development, run `npm run setup-standalone` from `template-temp` before starting the frontend. The template has its own setup details in [`template-temp/README.md`](template-temp/README.md).

## Demo flow

1. A campaign owner places a unique, high-entropy canary in a controlled AI environment and commits its hash.
2. An authorized researcher finds an in-scope disclosure path.
3. The researcher keeps the recovered canary locally and proves knowledge of it.
4. The protocol accepts the first valid proof, records a nullifier, and releases the proof reward.
5. The researcher sends an encrypted reproduction report to the campaign owner.
6. The owner resolves or disputes the report under the campaign policy; an auditor can review limited metadata.

## Important implementation status

The product design is specified in [`PRD.md`](PRD.md). The checked-in Python service is a controlled proof-of-concept, and its `/check` endpoint performs a plaintext server-side hash comparison solely for local demo purposes. It is **not** a zero-knowledge proof implementation and must not be used as a production claim flow.

Likewise, the Midnight workspace currently originates from a counter starter template. Replacing that sample contract and UI with the CanaryClaim campaign, proof, nullifier, payout, encrypted-report, and audit flows is required before any deployment represents the protocol described here.

## Security and responsible-use principles

- Test only systems and environments for which you have explicit authorization.
- Use fresh, high-entropy, campaign-specific canaries and salts.
- Keep plaintext canaries, salts, exploit details, and researcher identity off public ledgers.
- Send detailed reports encrypted to the campaign owner.
- Treat a valid canary proof as evidence of access—not an automatic severity assessment or a complete reproduction report.

## Product one-liner

> CanaryClaim lets researchers prove an AI system leaked a protected secret and get paid—without publicly revealing how they did it.

## License

No license file is currently included in this repository. Add an explicit license before distributing or accepting external contributions.
