# CanaryClaim — 75-second hackathon demo

## Recording setup

Start the Docker stack, Flask bridge, and Vite UI as described in the root README. Keep a terminal with the local claim result visible. Record at 1080p with browser zoom at 100%.

## Voiceover and shots

| Time | Screen | Say/show |
| --- | --- | --- |
| 0–8s | Bounty list | “CanaryClaim lets AI security researchers prove a disclosure without publishing the exploit or secret.” |
| 8–20s | Attack workspace | Trigger the canned vulnerable AI using the jailbreak action. Show the canary appearing only in the researcher UI. |
| 20–31s | Submit Proof | Paste the canary. Say: “The canary is a private witness. It is not a contract argument and is never written to the ledger.” |
| 31–50s | Proof progress | Click **Generate proof**. Show the local proof steps while saying: “Midnight verifies that the private witness hashes to the public commitment.” |
| 50–62s | Claim success | Show the returned transaction ID and claim confirmation. |
| 62–70s | Terminal | Show `LOCAL_CLAIM_RESULT` with `claimed:true`. Say: “This is a live local Midnight transaction, not a mocked UI success.” |
| 70–75s | README architecture diagram | Close with: “CanaryClaim turns responsible AI disclosure into a verifiable, privacy-preserving workflow.” |

## Do not claim

- Do not say a bounty token payout occurs; this version records a verified claim only.
- Do not say the local bridge is production-ready; it is a disposable local-demo path.
- Do not show or narrate wallet seeds, API keys, or private logs.
