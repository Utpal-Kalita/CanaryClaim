import { motion } from 'framer-motion';
import { Check, X, EyeOff, FileCheck2, ShieldCheck, Wallet } from 'lucide-react';
import { Section, Eyebrow, SectionHeading, Lead, Reveal, RevealGroup, RevealItem } from '@/components/ui/primitives';

const CAPABILITIES = [
  {
    icon: EyeOff,
    title: 'Shielded state',
    body: 'The canary commitment and researcher inputs live in private state, on-chain but unreadable to the public.',
  },
  {
    icon: FileCheck2,
    title: 'Zero-knowledge proofs',
    body: 'Contracts verify that a leaked value matches a commitment without ever learning the value itself.',
  },
  {
    icon: ShieldCheck,
    title: 'Selective disclosure',
    body: 'Auditors see exactly what they need: funds locked, proof valid, payout made, and nothing more.',
  },
  {
    icon: Wallet,
    title: 'Programmable escrow',
    body: 'DUST bounties are locked in a contract and released the instant a valid proof is verified.',
  },
];

const COMPARE = [
  { label: 'Prove the exploit is real', public: true, midnight: true },
  { label: 'Keep the exploit private', public: false, midnight: true },
  { label: 'Hide leaked user data', public: false, midnight: true },
  { label: 'Protect researcher identity', public: false, midnight: true },
  { label: 'Auditable payout trail', public: true, midnight: true },
];

export function WhyMidnight() {
  return (
    <Section id="why-midnight">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow tone="verify">Why Midnight</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <SectionHeading className="mt-4">
            This workflow is only possible with privacy-preserving smart contracts.
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.1}>
          <Lead className="mt-5">
            A public blockchain would leak the very thing we’re protecting. Midnight verifies the
            truth while keeping the secret sealed — that’s the whole trick.
          </Lead>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {CAPABILITIES.map((c) => (
            <RevealItem
              key={c.title}
              className="rounded-2xl border border-border bg-card/60 p-5"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-verify/25 bg-verify-soft text-verify">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Comparison table */}
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <div className="grid grid-cols-[1.6fr_0.7fr_0.7fr] items-center gap-2 border-b border-border bg-secondary/40 px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Requirement
              </span>
              <span className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Public chain
              </span>
              <span className="text-center text-xs font-semibold uppercase tracking-wider text-verify">
                Midnight
              </span>
            </div>
            {COMPARE.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="grid grid-cols-[1.6fr_0.7fr_0.7fr] items-center gap-2 border-b border-border/60 px-5 py-4 last:border-0"
              >
                <span className="text-sm">{row.label}</span>
                <span className="flex justify-center">
                  {row.public ? (
                    <Check className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <X className="h-4 w-4 text-danger/70" />
                  )}
                </span>
                <span className="flex justify-center">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-verify-soft">
                    <Check className="h-3.5 w-3.5 text-verify" />
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
