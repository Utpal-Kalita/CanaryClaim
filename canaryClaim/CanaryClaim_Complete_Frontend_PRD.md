# CanaryClaim --- Complete Frontend Product Requirements Document (PRD)

## 1. Vision

CanaryClaim is a privacy-first AI vulnerability bounty platform built on
Midnight.

Its mission is to allow security researchers to prove they discovered a
real AI vulnerability and automatically receive a bounty **without
revealing the exploit or leaked data publicly**.

The website is **not** a traditional SaaS dashboard.

It is an interactive story-driven product demo designed to convince
judges within two minutes that this workflow is only possible because of
Midnight's privacy-preserving smart contracts.

------------------------------------------------------------------------

# 2. The Problem

Today's AI bug bounty process forces researchers into an impossible
choice:

-   Reveal everything before payment.
-   Ask for payment without proof.
-   Publish the exploit publicly.

Every option breaks trust.

The researcher fears being ignored.

The AI company fears fake claims.

The public risks exposure.

------------------------------------------------------------------------

# 3. The Solution

CanaryClaim introduces Confidential Proof of Discovery.

Instead of revealing the exploit:

1.  The lab commits a hidden canary (secret) before the challenge
    starts.
2.  The researcher jailbreaks the AI.
3.  The AI leaks the canary.
4.  The researcher generates a proof locally.
5.  Midnight verifies the proof.
6.  The smart contract releases the bounty.
7.  The exploit remains confidential.

------------------------------------------------------------------------

# 4. Target Audience

## AI Labs

Launch confidential AI bounty campaigns.

## Security Researchers

Find vulnerabilities and receive automatic payment.

## Auditors

Verify that payouts occurred without seeing confidential information.

------------------------------------------------------------------------

# 5. Website Objective

The website should make judges think:

"I understand the problem. I understand the solution. This genuinely
needs Midnight."

------------------------------------------------------------------------

# 6. Information Architecture

Single-page application.

Sections:

1.  Hero
2.  Story / Problem
3.  Interactive Demo
4.  Why Midnight
5.  Features
6.  Architecture
7.  Footer

The Interactive Demo is the centerpiece.

------------------------------------------------------------------------

# 7. Hero Section

Headline: **CanaryClaim**

Subheadline: Private AI Safety Bounties on Midnight

CTA: Start Demo

Background: Subtle animated network / privacy motif.

------------------------------------------------------------------------

# 8. Interactive Demo Layout

Three columns:

LEFT - AI Lab Console

CENTER - AI Chat

RIGHT - Researcher Console

Bottom: Auditor View / Midnight Verification

------------------------------------------------------------------------

# 9. AI Lab Console

Purpose: Shows an active bounty.

Include:

-   Campaign name
-   Reward (500 DUST)
-   Status
-   Time remaining
-   Hash/Fingerprint of secret
-   Description
-   Lock icon

No confidential data is shown.

------------------------------------------------------------------------

# 10. AI Chat

Purpose: Simulate attacking an AI.

States:

Initial: Normal conversation.

Middle: User sends jailbreak prompt.

Final: AI leaks a hidden canary.

Typing animation required.

Messages should animate smoothly.

------------------------------------------------------------------------

# 11. Researcher Console

Contains:

-   Input field
-   Paste leaked secret
-   Generate Proof button
-   Progress animation:
    -   Preparing
    -   Generating Proof
    -   Verifying
    -   Confirmed

Success state:

✓ Proof Verified

✓ Bounty Released

✓ Wallet Credited

Display transaction reference.

------------------------------------------------------------------------

# 12. Auditor View

Display only public facts:

✓ Campaign Exists

✓ Funds Locked

✓ Proof Verified

✓ Payout Released

Hide:

🔒 Secret

🔒 Exploit Prompt

🔒 Researcher Identity

Explain this demonstrates Midnight's confidentiality.

------------------------------------------------------------------------

# 13. User Flow

Landing

↓

View bounty

↓

Chat

↓

Leak occurs

↓

Copy secret

↓

Paste secret

↓

Generate proof

↓

Verification animation

↓

Wallet receives 500 DUST

↓

Auditor panel updates

------------------------------------------------------------------------

# 14. Visual Design

Look and feel:

Modern security platform.

Avoid "Hollywood hacker" aesthetics.

Reference inspiration:

-   Stripe
-   Linear
-   Vercel
-   Notion
-   Cloudflare Dashboard

Use: - Large whitespace - Rounded cards - Smooth motion - Professional
typography

------------------------------------------------------------------------

# 15. Motion

Every important step should animate:

-   Card fade-ins
-   Chat messages
-   Typing indicator
-   Proof generation
-   Verification timeline
-   Wallet payout
-   Auditor updates

Animations should communicate progress.

------------------------------------------------------------------------

# 16. Responsive Design

Desktop: 3-column layout.

Tablet: 2 columns.

Mobile: Stack vertically.

------------------------------------------------------------------------

# 17. Technical Stack

React

TypeScript

Vite

Tailwind (preferred)

Framer Motion

Lace Wallet

Midnight SDK

------------------------------------------------------------------------

# 18. API Contract

POST /chat

Input: User message

Output: AI reply

POST /check

Input: Leaked secret / proof

Output: Valid / Invalid

Future:

Smart contract integration.

------------------------------------------------------------------------

# 19. States

Loading

Success

Failure

Offline backend

Wallet disconnected

Proof invalid

Already claimed

------------------------------------------------------------------------

# 20. Demo Script

1.  Open website.
2.  Show bounty.
3.  Ask normal question.
4.  Trigger jailbreak.
5.  AI leaks canary.
6.  Copy canary.
7.  Paste into console.
8.  Generate proof.
9.  Midnight verifies.
10. 500 DUST released.
11. Auditor shows only public information.
12. Conclude:

"The exploit never left the researcher's device."

------------------------------------------------------------------------

# 21. Acceptance Criteria

The final website should:

-   Feel premium.
-   Tell a complete story without explanation.
-   Make Midnight's role obvious.
-   Be usable in a live two-minute hackathon demo.
-   Guide users naturally from problem to solution.
