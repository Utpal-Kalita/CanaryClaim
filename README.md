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

## Setup guide

### Prerequisites

- Node.js 18+ and npm 10+
- Python 3.10+
- For Midnight development: Docker, Git LFS, Compact tools, and a compatible Midnight wallet

Verify the local tools before continuing:

```powershell
node --version
npm --version
python --version
docker --version
git lfs version
compact check
```

`docker`, `git lfs`, and `compact` are required only for the Midnight workspace. Install and initialize Git LFS once after installing it:

```powershell
git lfs install
```

### 1. Set up the controlled AI demo

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

`MODEL_API_BASE` must expose an OpenAI-compatible `/chat/completions` API. The default assumes a local model server at `http://localhost:8080/v1`; change it to match your provider or local inference server.

Check that the service is up:

```powershell
Invoke-RestMethod http://localhost:5000/health
```

Expected response:

```json
{"status":"ok"}
```

### 2. Set up the Midnight workspace

The contract, CLI, and frontend starter workspace is under `template-temp`.


```powershell
cd template-temp
npm install
```

Create local environment files from the included templates. Do not commit either resulting `.env` file.

```powershell
Copy-Item counter-cli\.env_template counter-cli\.env
Copy-Item frontend-vite-react\.env_template frontend-vite-react\.env
```

Update `counter-cli/.env` with a funded Preview Network mnemonic when working against a network:

```env
MY_PREVIEW_MNEMONIC="your wallet recovery phrase"
MY_UNDEPLOYED_UNSHIELDED_ADDRESS="mn_addr_undeployed1sx6prym3qx4cq9rydga33803pg8v64y7tmnveug6jd69v35ymeesnqqrz5"
```

After deploying a contract, put its address in `frontend-vite-react/.env`:

```env
VITE_CONTRACT_ADDRESS="your deployed contract address"
```

### 3. Build and run

Build the workspace from the `template-temp` directory:

```powershell
npm run build
```

To use the Preview Network, start the frontend:

```powershell
npm run dev:frontend
```

For an undeployed local environment, start the standalone services first, then use a second terminal to start the frontend:

```powershell
# Terminal 1
cd template-temp
npm run setup-standalone

# Terminal 2
cd template-temp
npm run dev:frontend
```

Vite will print the local application URL, typically `http://localhost:5173`. Connect a compatible Midnight wallet only after the environment variables and network configuration match the selected mode.

### 4. Troubleshooting

| Symptom | Check |
| --- | --- |
| `compact` is not recognized | Install Compact tools and reopen the terminal so the executable is on `PATH`. |
| Contract keys fail to load | Run `npm run build`; ensure Git LFS is installed and `git lfs pull` has fetched binary assets. |
| Frontend cannot connect to a contract | Confirm `VITE_CONTRACT_ADDRESS` is set in `frontend-vite-react/.env`, then restart Vite. |
| `/chat` returns a model request error | Confirm the model server is running, `MODEL_API_BASE` is correct, and the configured model name is available. |
| Wallet has no funds on Preview | Use the appropriate Midnight Preview Network faucet before deployment or transactions. |

See [`template-temp/README.md`](template-temp/README.md) for the starter-template-specific notes and [`canaryClaim/DEPLOYMENT_PROCEDURE.md`](canaryClaim/DEPLOYMENT_PROCEDURE.md) for Vercel deployment configuration.

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
