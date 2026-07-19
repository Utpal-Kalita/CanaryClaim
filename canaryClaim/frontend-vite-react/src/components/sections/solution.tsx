import { motion } from 'framer-motion';
import { KeyRound, Bot, Bird, Cpu, ShieldCheck, Coins, Lock } from 'lucide-react';
import { Section, Eyebrow, SectionHeading, Lead, Reveal } from '@/components/ui/primitives';
import { viewportOnce } from '@/lib/motion';

const STEPS = [
  { icon: KeyRound, title: 'Commit a hidden canary', body: 'Before the challenge opens, the lab seals a secret string inside the AI and commits only its fingerprint on-chain.', tone: 'canary' },
  { icon: Bot, title: 'Researcher attacks the model', body: 'The researcher probes and jailbreaks the AI, entirely on their own machine.', tone: 'brand' },
  { icon: Bird, title: 'The AI leaks the canary', body: 'A successful exploit makes the model reveal the sealed secret, proof the vulnerability is real.', tone: 'canary' },
  { icon: Cpu, title: 'Generate a proof locally', body: 'A zero-knowledge proof is built on-device showing the leaked value matches the commitment.', tone: 'brand' },
  { icon: ShieldCheck, title: 'Midnight verifies', body: 'The network checks the proof, confirming the match without ever seeing the secret or the exploit.', tone: 'verify' },
  { icon: Coins, title: 'Bounty releases automatically', body: 'The smart contract unlocks the escrowed reward and credits the researcher’s wallet.', tone: 'verify' },
  { icon: Lock, title: 'The exploit stays confidential', body: 'The prompt, the leaked data, and the researcher’s identity never leave their device.', tone: 'canary' },
] as const;

const toneMap = {
  brand: 'border-brand/30 bg-brand-soft text-brand',
  canary: 'border-canary/30 bg-canary-soft text-canary',
  verify: 'border-verify/30 bg-verify-soft text-verify',
} as const;

export function Solution() {
  return (
    <Section id="solution" className="relative">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow tone="brand">The solution</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <SectionHeading className="mt-4">Confidential Proof of Discovery.</SectionHeading>
        </Reveal>
        <Reveal delay={0.1}>
          <Lead className="mt-5">
            Instead of choosing between proof and privacy, CanaryClaim gives you both. Seven steps
            turn a secret leak into a verifiable, automatic payout.
          </Lead>
        </Reveal>
      </div>

      <div className="relative mt-16">
        {/* vertical spine */}
        <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-canary/40 via-brand/40 to-verify/40 md:left-1/2 md:-translate-x-1/2" />

        <ol className="space-y-8 md:space-y-3">
          {STEPS.map((s, i) => {
            const left = i % 2 === 0;
            return (
              <li key={s.title} className="relative md:grid md:grid-cols-2 md:items-center md:gap-10">
                {/* node */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: 0.05, type: 'spring', stiffness: 260, damping: 20 }}
                  className={`absolute left-0 top-1 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border ${toneMap[s.tone]} md:left-1/2 md:-translate-x-1/2`}
                >
                  <s.icon className="h-6 w-6" />
                </motion.div>

                {/* card */}
                <motion.div
                  initial={{ opacity: 0, x: left ? -24 : 24, y: 8 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`ml-20 rounded-2xl border border-border bg-card/60 p-5 md:ml-0 ${
                    left ? 'md:col-start-1 md:mr-4 md:text-right' : 'md:col-start-2 md:ml-4'
                  }`}
                >
                  <div
                    className={`mb-2 flex items-center gap-2 ${left ? 'md:justify-end' : ''}`}
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
