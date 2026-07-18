# CanaryClaim product requirements document

## 1. Product summary

CanaryClaim is a private safety-bounty protocol for AI systems. It enables a researcher to prove that they accessed a secret value which an AI system was required to protect, without revealing the secret, the exploit path, the researcher identity, or the report contents to the public.

An organization creates a scoped safety campaign and locks a reward. It places a unique, high-entropy canary in a controlled AI environment. A researcher who obtains the canary through an unauthorized behavior can submit a zero-knowledge proof of knowledge. CanaryClaim verifies the proof, prevents duplicate claims, and releases a pre-agreed proof reward. The organization and researcher then use an encrypted disclosure flow for remediation details and any remaining reward.

CanaryClaim is not a general vulnerability scanner or a claim that a model is safe. It is a verifiable process for handling a specific class of findings: a protected secret became accessible when it should not have been.

## 2. Problem

AI systems increasingly retrieve private documents, call tools, act on behalf of users, and connect to business systems. A prompt injection, tool-permission failure, retrieval mistake, or unsafe agent action can expose data that should remain inaccessible.

The current reporting process creates a trust gap:

- Researchers must often disclose the full exploit before they can establish that a finding is real or receive payment.
- Organizations receive weak, duplicate, or fabricated claims and must manually determine which ones deserve urgent attention.
- Publishing a working exploit can increase risk before a fix exists.
- Traditional reporting systems cannot offer public auditability without exposing sensitive details.

CanaryClaim lets both parties establish one useful fact early: a researcher demonstrably accessed a secret that the system should have protected.

## 3. Product goal

Make a valid, scoped AI safety finding provable before its exploit details are disclosed.

### Success criteria

- A campaign owner can create and fund a campaign without publishing the canary.
- A researcher can submit a proof without revealing the canary or exploit path on the public ledger.
- The system pays at most one proof reward per campaign.
- The campaign owner can receive an encrypted reproduction report after a valid proof.
- An authorized auditor can verify campaign status, reward handling, and response timing without accessing sensitive report content.

## 4. Non-goals

- Proving that an AI system is universally safe or unsafe.
- Automatically determining the severity of every finding.
- Replacing a security team's review, incident response process, or legal policy.
- Supporting real-world testing without explicit authorization and scope.
- Publishing exploit material, canaries, private prompts, or customer data.
- Acting as a marketplace for unscoped or unauthorized vulnerability testing.

## 5. Users and roles

### Campaign owner

An AI provider, product security team, or authorized system owner. The campaign owner defines the test scope, generates a canary, locks the reward, receives encrypted disclosure details, and closes the campaign after remediation.

### Researcher

An authorized safety researcher. The researcher tests an in-scope environment, proves a valid canary retrieval without publicly exposing it, and provides a private reproduction report after the proof is accepted.

### Auditor

An internal security, compliance, or governance stakeholder. The auditor verifies the existence of a campaign, proof status, response times, and payout state. The auditor only receives additional details through explicitly granted selective disclosure.

### Protocol administrator

An operational role responsible for platform configuration, supported cryptographic primitives, campaign templates, and incident escalation policies. This role cannot access private canaries or encrypted report contents by default.

## 6. Core concept: the canary

A canary is a random secret placed in a controlled location that an AI system must not reveal. It must be high entropy and unique to a campaign. Examples include a fake customer record identifier, a protected document token, or a restricted tool-response marker.

The campaign owner stores only a cryptographic commitment to the canary on the ledger. The plaintext canary stays in the controlled test environment and with the campaign owner.

The protocol proves knowledge of the canary. It does not claim to prove every detail of the exploit automatically. The encrypted report and review process provide those details after the initial proof.

## 7. User stories

### Campaign owner stories

- As a campaign owner, I want to define a narrow test scope so that researchers know what is authorized.
- As a campaign owner, I want to lock a defined reward before testing begins so that researchers can trust the reward exists.
- As a campaign owner, I want proof that a finding is real without the exploit becoming public.
- As a campaign owner, I want a private reproduction report so that my team can fix the issue.
- As a campaign owner, I want to show response timing to an auditor without exposing sensitive security details.

### Researcher stories

- As a researcher, I want to prove a finding before revealing my exploit chain.
- As a researcher, I want my identity and research history to remain private by default.
- As a researcher, I want a valid proof to trigger a clearly defined reward.
- As a researcher, I want to submit a private report only after the protocol records my finding.

### Auditor stories

- As an auditor, I want to verify whether a campaign received a valid proof and met its response target.
- As an auditor, I want to request only the evidence needed for a review.
- As an auditor, I must not receive exploit details or researcher identity unless explicitly authorized.

## 8. Functional requirements

### FR-1: Campaign creation

The campaign owner must be able to create a campaign containing:

- Campaign title and short description.
- Authorized target environment and scope statement.
- Campaign start and end times.
- Proof reward and remediation reward amounts.
- Response service-level target.
- Canary commitment.
- Public encryption key for private report delivery.
- Optional auditor disclosure policy.

The contract must escrow the total campaign reward before the campaign becomes active.

### FR-2: Canary commitment

The system must derive a commitment from a random canary and a private salt. The plaintext canary and salt must never be written to the public ledger.

```text
canaryCommitment = hash(canary || salt || campaignId)
```

The campaign owner must generate a fresh canary and salt for every campaign.

### FR-3: Proof submission

The researcher must be able to submit a zero-knowledge proof that privately demonstrates:

- They know a canary and salt matching the campaign commitment.
- The campaign is currently active.
- The claim is linked to the current campaign.
- The claim nullifier has not been used.

The submitted proof must not reveal the canary, salt, exploit prompt, target response, or researcher identity.

### FR-4: Duplicate-claim protection

The protocol must generate and record a claim nullifier. A campaign must accept only one proof-reward claim unless the campaign explicitly supports multiple canaries and reward slots.

```text
claimNullifier = hash(researcherSecret || campaignId || claimSlot)
```

### FR-5: Proof reward

When a valid first claim is verified, the protocol must:

- Mark the campaign as `PROOF_ACCEPTED`.
- Record the proof acceptance timestamp.
- Release the proof reward to the researcher's private payment destination.
- Start the response service-level timer.

### FR-6: Encrypted reproduction report

After proof acceptance, the researcher must be able to submit an encrypted reproduction report reference. The reference may point to encrypted storage controlled by the campaign owner or an approved storage provider.

The report package must include, at minimum:

- Reproduction steps.
- Impact explanation.
- Relevant prompts, tool calls, or system responses.
- A suggested mitigation, if available.
- A report integrity hash.

The public ledger stores only the encrypted reference, integrity hash, and submission timestamp.

### FR-7: Remediation resolution

The campaign owner must be able to mark a report as resolved, disputed, or expired.

- `RESOLVED`: releases the remediation reward.
- `DISPUTED`: records a dispute reason commitment and pauses the remaining reward.
- `EXPIRED`: is available only after the response target and campaign policy conditions are met.

The product must clearly distinguish an accepted proof from acceptance of every claim in the detailed report.

### FR-8: Selective audit disclosure

The campaign owner must be able to issue a time-limited disclosure package to an auditor. The package may include selected metadata such as campaign scope, proof timestamp, payout status, resolution date, and response-time result.

Exploit details, plaintext canaries, and researcher identity must remain excluded unless the campaign owner and researcher explicitly authorize their disclosure.

### FR-9: Private reputation credential

After a successful resolution, the researcher may receive a non-transferable private credential, such as "one accepted critical finding." The credential must support later proof of reputation without exposing the campaign name, report, payout amount, or research history.

## 9. End-to-end flow

### 9.1 Campaign setup

1. Campaign owner creates a controlled test environment and inserts a unique canary.
2. Campaign owner generates `canaryCommitment` locally.
3. Campaign owner creates a campaign and locks the full reward.
4. The contract publishes the campaign metadata and commitment, then marks the campaign active.

### 9.2 Finding and proof

1. Researcher tests the authorized environment.
2. Researcher discovers a path that returns the protected canary.
3. The client stores the canary locally as a private witness.
4. The client generates a proof of canary knowledge.
5. The contract verifies the proof and checks that no previous claim is present.
6. The contract releases the proof reward and marks the campaign `PROOF_ACCEPTED`.

### 9.3 Private disclosure and resolution

1. Researcher encrypts the reproduction report using the campaign owner's public key.
2. Researcher submits the encrypted report reference and integrity hash.
3. Campaign owner decrypts and reviews the report.
4. Campaign owner fixes the issue and marks it resolved, or opens a dispute according to policy.
5. The protocol releases the remediation reward on resolution.
6. The campaign owner may issue a limited audit disclosure package.

## 10. Privacy model

| Data | Visibility | Notes |
|---|---|---|
| Campaign title, dates, status | Public | Keep descriptions non-sensitive. |
| Total reward escrow | Public or shielded per deployment policy | The product should prefer shielded payment paths where available. |
| Canary commitment | Public | A hash commitment reveals no usable canary value. |
| Canary and salt | Private | Used only as local proof witnesses. |
| Researcher identity | Private | A public account address must not be the default identity layer. |
| Exploit prompt and reproduction steps | Private | Encrypted for the campaign owner. |
| Proof acceptance | Public | Verifiable without exposing the proof witness. |
| Claim nullifier | Public | Prevents duplicate claims without revealing identity. |
| Resolution evidence | Selectively disclosed | Only the approved audit subset is shared. |
| Reputation credential | Private | Non-transferable proof of prior accepted work. |

## 11. Trust and security model

### What the protocol guarantees

- A valid proof shows knowledge of the committed canary.
- The same claim slot cannot be paid twice.
- Reward escrow and proof-reward release follow contract rules.
- The public can verify a proof was accepted without accessing private inputs.
- Encrypted report references can be integrity-checked against their committed hash.

### What the protocol does not guarantee

- That every canary retrieval has the same severity.
- That a detailed report is complete or describes the only exploit path.
- That the campaign owner will agree with every remediation claim.
- That a canary placement perfectly models every production failure.
- That an encrypted report remains safe if the recipient's private key is compromised.

### Required controls

- High-entropy, campaign-specific canaries.
- Approved cryptographic hash function and key-management process.
- Explicit researcher authorization and scope rules.
- Separate testing environments from production systems.
- Time-bound campaign configuration.
- Explicit dispute policy and escalation owner.
- Secure private-key storage for campaign report decryption.
- Rate limits and anti-spam controls for proof submission attempts.

## 12. System architecture

```text
Campaign owner
  | creates scope, canary commitment, reward escrow
  v
CanaryClaim web app ----> Midnight contract <---- Researcher proof client
  |                                  |                    |
  |                                  |                    | local canary witness
  |                                  v                    |
  |                           campaign state              |
  |                                                       |
  +---- encrypted report storage <---- encrypted report --+
  |
  +---- selective disclosure package ----> Auditor
```

### Components

1. **Web application**: campaign management, researcher workflow, status views, and audit portal.
2. **Proof client**: generates the researcher-side proof from local private witness data.
3. **Midnight Compact contract**: stores campaign state, commitments, nullifiers, reward rules, and resolution state.
4. **Private state provider**: stores researcher secret material and local witness data.
5. **Encrypted report storage**: stores encrypted report blobs or pointers; must not receive plaintext reports.
6. **Audit disclosure service**: creates signed, time-limited disclosure packages from approved metadata.

## 13. Contract state model

### Campaign states

```text
DRAFT
  -> ACTIVE
  -> PROOF_ACCEPTED
  -> REPORT_SUBMITTED
  -> RESOLVED

ACTIVE
  -> EXPIRED

PROOF_ACCEPTED or REPORT_SUBMITTED
  -> DISPUTED
  -> EXPIRED
```

### Contract actions

| Action | Caller | Result |
|---|---|---|
| `createCampaign` | Campaign owner | Creates campaign and locks rewards. |
| `activateCampaign` | Campaign owner or constructor | Opens an escrow-funded campaign. |
| `proveLeak` | Researcher | Verifies proof, records nullifier, releases proof reward. |
| `submitEncryptedRepro` | Researcher | Attaches encrypted report reference after proof acceptance. |
| `resolveCampaign` | Campaign owner | Releases remediation reward and creates reputation credential. |
| `disputeCampaign` | Campaign owner | Pauses remediation reward and records dispute state. |
| `expireCampaign` | Authorized caller | Closes an expired campaign per policy. |
| `issueAuditDisclosure` | Campaign owner | Creates limited disclosure package. |
| `revokeAuditorAccess` | Campaign owner | Revokes active disclosure access where supported. |

## 14. UX requirements

### Campaign owner experience

The campaign creation flow must explain canaries in plain language and prevent unsafe configuration. It should require a scope statement, campaign deadline, public report-encryption key, and confirmation that the target is authorized.

The campaign dashboard must show campaign status, proof acceptance time, report submission status, response timer, escrow state, and resolution actions. It must never render a plaintext canary.

### Researcher experience

The researcher flow must clearly state the permitted scope and emphasize that only authorized testing is allowed. Proof generation must occur locally and display exactly what will remain private.

The interface must show whether the proof reward was paid, whether an encrypted report is required, and the current response deadline. It must not pressure the researcher to disclose the canary in a public form.

### Auditor experience

The auditor view must use a concise timeline: campaign created, proof accepted, report submitted, resolved or disputed, and response time. Any disclosure beyond standard metadata must show scope, expiration, and authorization source.

## 15. Measurement

### Product metrics

- Number of active campaigns.
- Proof submission success rate.
- Median time from proof acceptance to encrypted report submission.
- Median time from proof acceptance to resolution.
- Percentage of campaigns meeting their response target.
- Duplicate-claim attempts blocked.
- Percentage of audit requests satisfied through limited disclosure rather than full report sharing.

### Safety metrics

- Number of public canary or exploit leaks caused by product workflows. Target: zero.
- Number of campaigns with missing scope or authorization data. Target: zero active campaigns.
- Number of private report decryption failures.
- Number of disputed campaigns and time to closure.

## 16. Delivery scope

### Initial release

- Single-canary campaigns.
- One proof-reward slot per campaign.
- Fixed proof and remediation reward split.
- Controlled test-agent integration.
- Private proof of canary knowledge.
- Nullifier-based duplicate prevention.
- Encrypted report reference submission.
- Campaign owner resolution flow.
- Basic audit timeline with limited metadata.

### Later releases

- Multiple canaries and tiered rewards.
- Multi-party dispute resolution.
- Private reputation credential portability.
- Integration with agent frameworks and retrieval systems.
- Automated canary rotation.
- Team-based campaign ownership.
- Advanced selective disclosure policy templates.
- Risk scoring that remains separate from proof validity.

## 17. Open questions

1. Which payment asset and shielded payout method should be used in the first deployment?
2. What dispute process balances researcher protection with campaign-owner review rights?
3. How long should encrypted report storage be retained by default?
4. Which audit metadata is appropriate to expose publicly versus only under selective disclosure?
5. How should campaign owners prove they are authorized to operate a target environment?
6. Should proof rewards be automatic for every valid canary proof, or require a short review window?
7. What minimum canary design requirements prevent predictable or replayable secret values?

## 18. Product positioning

CanaryClaim is a verification layer for responsible AI safety reporting.

It does not ask researchers to publish an exploit to prove it exists. It does not ask organizations to accept a vague claim on trust. It gives both sides a verifiable first step: a private proof that the system protected a secret poorly enough for an authorized researcher to obtain it.
