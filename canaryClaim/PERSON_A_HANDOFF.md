# Person A — CanaryClaim Blockchain Handoff

## Purpose and status

Person A owns the Midnight/Compact implementation: the privacy-preserving claim
predicate, witness/private-state wiring, local Midnight stack, and the CLI deploy,
join, claim, and status flow.

The core contract and client are complete and verified. The only active environment
blocker is proof generation on this Apple Silicon Mac: the official
`midnightntwrk/proof-server:7.0.0` image starts its proof executable through
Rosetta. The local node, indexer, DUST wallet, and proof HTTP endpoint are healthy,
but a real `/prove` call is not reliable on this host. Use a team-controlled
x86_64/Intel Linux prover for a complete deploy-and-claim demonstration.

| Deliverable | Status | Evidence |
| --- | --- | --- |
| Compact canary contract | Complete | `counter-contract/src/canary.compact` |
| Generated ZK assets | Complete | `counter-contract/src/managed/counter/` |
| Private witness and state | Complete | `counter-contract/src/witnesses.ts` |
| CLI deploy/join/claim/status | Complete | `counter-cli/src/api.ts`, `counter-cli/src/cli.ts` |
| Contract tests | Complete | 5 simulator tests pass |
| Local services and dev wallet sync | Complete | `npm run setup-standalone`, `npm run tui-undeployed` |
| Local Apple-Silicon proof transaction | Upstream-blocked | v7 prover executes under Rosetta |
| Preview transaction | Not performed | Requires wallet-owner approval and faucet funds |

## Contract behavior

The contract is a proof-of-knowledge canary claim. A deployer stores a persistent
hash of a 32-byte secret. A claimant proves they know the secret without writing the
secret to public ledger state.

```compact
export sealed ledger canaryCommitment: Bytes<32>;
export ledger claimed: Boolean;
export ledger winner: Bytes<32>;

witness secret(): Bytes<32>;

export circuit claim(): [] {
  assert(!claimed, "Already claimed");
  const h = persistentHash<Bytes<32>>(secret());
  assert(disclose(h == canaryCommitment), "Wrong secret");
  claimed = true;
  winner = disclose(ownPublicKey().bytes);
}
```

- `canaryCommitment` is set once during deployment and sealed afterwards.
- `secret()` is supplied from off-chain private state as a Midnight witness.
- `claimed` prevents a second successful claim.
- `winner` records the successful claimant's public key.
- The claim result and winner key are public; the witness secret is not ledger data.

## Scope boundary

`claim()` records a winner. It does **not** mint, transfer, escrow, or pay a token
bounty. Do not describe it as a payment contract. A real payout needs separate
funded-contract and Zswap/token-transfer work.

The frontend still contains starter Counter wiring. Person D must replace it with
the compiled `Canary` contract, private-state/witness setup, and public status reads
before a website claim button is ready.

## Repository map

| Path | Responsibility |
| --- | --- |
| `counter-contract/src/canary.compact` | On-chain Compact claim circuit |
| `counter-contract/src/witnesses.ts` | Secret encoding and witness implementation |
| `counter-contract/src/test/canary.test.ts` | Contract simulator tests |
| `counter-contract/src/managed/counter/` | Generated JS, ZKIR, prover, and verifier assets |
| `counter-cli/src/api.ts` | Contract compilation, providers, wallet, deploy/join/claim calls |
| `counter-cli/src/cli.ts` | Interactive menu and headless local dev wallet |
| `counter-cli/src/config.ts` | Undeployed, Preview, and Preprod endpoints |
| `counter-cli/standalone.yml` | Local node, indexer, and proof server |

## Security requirements

1. Secrets must be **1–32 UTF-8 bytes**. Empty and oversized input is rejected,
   never silently truncated.
2. Never print, commit, document, or send a real wallet seed/mnemonic. The
   undeployed wallet is a deterministic public development wallet only.
3. Never use a public prover. A proof request contains private proving input. A
   remote prover must be team-controlled, loopback-bound, and reached through SSH.
4. Preview requires the wallet owner's explicit approval and custody of recovery
   material. Faucet tokens remain owned by that wallet.
5. A low-entropy canary secret can still be guessed from its public commitment.

## Pinned compatible versions

| Component | Version |
| --- | --- |
| Compact compiler | `0.28.0` |
| Compact runtime | `0.14.0` |
| Midnight.js providers/contracts | `3.0.0` |
| Ledger | `7.0.0` |
| Local node | `0.20.0` |
| Local indexer | `3.0.0` |
| Proof server | `7.0.0` |

Do not use the old Bricktower v6 workaround: it rejects this ledger-v7 proof format
with `unrecognised discriminant`.

## Verification

Run from `canaryClaim/`:

```bash
npm --workspace @eddalabs/counter-contract run test
npm --workspace @eddalabs/counter-cli run typecheck
npm --workspace @eddalabs/counter-contract run build
npm --workspace @eddalabs/counter-cli run build
```

The simulator covers: unclaimed initial state, correct-secret winner recording,
wrong-secret rejection, second-claim rejection, and secret-length validation.

## Local undeployed setup

Docker Desktop is required. The undeployed network has a pre-funded dev wallet, so
it needs neither a faucet nor a real wallet.

```bash
cd canaryClaim
npm run setup-standalone

cd counter-cli
npm run tui-undeployed
```

`setup-standalone` starts the node, indexer, and proof server then waits for the
proof server version endpoint. The TUI rebuilds the contract and CLI first, so it
does not depend on the incompatible `ts-node` launcher under newer Node.js releases.

```bash
docker ps
curl http://127.0.0.1:6300/version
```

Before deployment, the TUI must reach `Contract Actions` and show a synchronized
wallet with tNight and DUST. Run only one local TUI at a time because the dev wallet
and private-state storage are shared.

## Complete deploy + claim with a trusted x86 prover

### On a team-controlled x86_64/Intel Linux host

```bash
docker run --rm --name counter-proof-server \
  -p 127.0.0.1:6300:6300 \
  midnightntwrk/proof-server:7.0.0 \
  midnight-proof-server -v

curl http://127.0.0.1:6300/version
```

The response must be `7.0.0`.

### On the Apple Silicon Mac

```bash
cd canaryClaim
npm run setup-standalone

cd counter-cli
docker compose -f standalone.yml stop proof-server
ssh -N -L 6300:127.0.0.1:6300 USER@TEAM_X86_HOST
```

Keep the tunnel open. In another terminal:

```bash
cd canaryClaim/counter-cli
npm run tui-undeployed
```

1. Choose **Deploy a new canary contract**.
2. Enter a new non-empty secret with at most 32 UTF-8 bytes.
3. Record the public contract address after finalization.
4. Choose **Claim**, then **Display claim status**.
5. Capture only public contract/transaction evidence. Never screenshot a seed or
   secret.

## Preview procedure

Preview is a real network target. It requires a wallet owner with Preview tNight
and DUST, an approved transaction, and a trusted compatible proof endpoint.

```bash
cd canaryClaim/counter-cli
npm run tui-preview
```

Provide the finalized contract address and public `claimed`/`winner` state to the
frontend team only after the transaction completes.

## Handoff checklist

### Person A

- [x] Contract compiles and generated ZK assets are committed.
- [x] CLI is wired to `Canary` with a real secret witness.
- [x] Local stack and headless dev wallet reach the contract menu.
- [x] Tests and typecheck pass.
- [ ] Run deploy + claim through the team x86 prover.
- [ ] Save public transaction/contract evidence.

### Person D / frontend

- [ ] Replace starter Counter interactions with `Canary` calls.
- [ ] Store the entered canary secret only in private state for proving.
- [ ] Read `claimed` and `winner` through the indexer.
- [ ] Do not promise a payout without a separate funded payment contract.

### Submission wording

Use: **“The claimant proves knowledge of a committed canary secret in zero
knowledge, then the contract records the winning public key.”**

Do not use: **“The app transfers the bounty automatically”** or **“the secret is
publicly verified on-chain.”**
