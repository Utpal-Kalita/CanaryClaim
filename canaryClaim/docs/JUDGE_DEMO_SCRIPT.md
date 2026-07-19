# CanaryClaim — transparent judge-demo script

Use this short script when presenting the app.

> “Before I start, one important distinction: CanaryClaim has a real local Midnight ZK claim path and a separate judge-demo walkthrough mode. I will label which one I am showing at every step.”

## 1. Product flow

> “A researcher finds an AI vulnerability and obtains a canary value. The canary is treated as private witness data. The contract stores only its commitment and the final claim state; it does not publish the exploit or the secret.”

Show the bounty and attack screens.

## 2. Judge demo mode

> “For a quick UI walkthrough, Judge demo mode is enabled. It accepts any input and displays the complete submission experience. It does **not** generate a ZK proof, contact a wallet, submit to Midnight, or create a payout. The resulting entry is visibly marked ‘Mock’ and ‘not on-chain.’”

Enter any value, click **Generate proof**, and show the success screen and **My Claims** entry.

> “This mode is only here to keep a live presentation reliable. It is not evidence of a blockchain transaction.”

## 3. Real local Midnight flow

> “When I disable Judge demo mode, the app requires the captured canary. The localhost bridge deploys a disposable contract on the local Midnight network, creates the proof, submits the claim, and reads back `claimed: true` from the indexer.”

Show the **Judge demo mode** toggle turned off, then show a previously captured terminal result:

```text
LOCAL_CLAIM_RESULT={"contractAddress":"…","transactionId":"…","claimed":true}
```

> “That terminal result is the real local-chain evidence. The local flow is not a token payout system; it records a proof-backed claim.”

## 4. Preview wallet path

> “The header can connect a real 1AM Preview wallet. Preview deployment and claim actions always require wallet approval. We do not represent those as completed unless the wallet transaction is actually approved and submitted.”

## Close

> “So the honest status is: mock mode demonstrates the UX; the local stack demonstrates a real ZK claim; and the 1AM Preview path is wired for user-approved wallet transactions. Token settlement remains future work.”

## Do not claim

- Do not call a mock entry a blockchain transaction.
- Do not claim a token payout or DUST transfer occurred.
- Do not claim Preview was deployed unless a wallet-approved Preview transaction is shown.
- Do not reveal wallet seeds, private logs, or the canary outside the controlled demo context.
