import { motion } from 'framer-motion';
import { FlaskConical, Laptop, Boxes, Gavel, Lock, Cpu, ShieldCheck } from 'lucide-react';
import { Section, Eyebrow, SectionHeading, Lead, Reveal } from '@/components/ui/primitives';
import { viewportOnce } from '@/lib/motion';

const NODES = [
  {
    icon: FlaskConical,
    title: 'AI Lab',
    tone: 'brand' as const,
    items: ['Seals canary secret', 'Escrows DUST reward', 'Publishes commitment hash'],
  },
  {
    icon: Laptop,
    title: 'Researcher Device',
    tone: 'canary' as const,
    items: ['Runs the jailbreak', 'Captures leaked canary', 'Builds ZK proof locally'],
    note: 'Exploit never leaves here',
  },
  {
    icon: Boxes,
    title: 'Midnight Contract',
    tone: 'verify' as const,
    items: ['Verifies the proof', 'Matches hidden commitment', 'Releases the bounty'],
  },
  {
    icon: Gavel,
    title: 'Auditor',
    tone: 'muted' as const,
    items: ['Reads public facts only', 'Confirms payout occurred', 'Sees no secrets'],
  },
];

const toneMap = {
  brand: 'border-brand/30 bg-brand-soft text-brand',
  canary: 'border-canary/30 bg-canary-soft text-canary',
  verify: 'border-verify/30 bg-verify-soft text-verify',
  muted: 'border-border bg-secondary/50 text-muted-foreground',
};

const DATAFLOW = [
  { icon: Lock, label: 'Commitment hash', desc: 'public, reveals nothing' },
  { icon: Cpu, label: 'Zero-knowledge proof', desc: 'generated on-device' },
  { icon: ShieldCheck, label: 'Verification result', desc: 'valid / invalid only' },
];

export function Architecture() {
  return (
    <Section id="architecture">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow tone="brand">Architecture</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <SectionHeading className="mt-4">Four actors. One secret that never moves.</SectionHeading>
        </Reveal>
        <Reveal delay={0.1}>
          <Lead className="mt-5">
            Data flows left to right, but the exploit stays put. Only proofs and public facts cross
            between parties.
          </Lead>
        </Reveal>
      </div>

      {/* Actor pipeline */}
      <div className="mt-14 grid gap-4 md:grid-cols-4">
        {NODES.map((n, i) => (
          <motion.div
            key={n.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-border bg-card/60 p-5"
          >
            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${toneMap[n.tone]}`}>
              <n.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">{n.title}</h3>
            <ul className="mt-3 space-y-1.5">
              {n.items.map((it) => (
                <li key={it} className="text-xs leading-relaxed text-muted-foreground">
                  {it}
                </li>
              ))}
            </ul>
            {n.note && (
              <p className="mt-3 rounded-lg border border-canary/25 bg-canary-soft px-2.5 py-1.5 text-[11px] font-medium text-canary">
                {n.note}
              </p>
            )}
            {i < NODES.length - 1 && (
              <div className="absolute -right-2 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 items-center justify-center md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* What actually crosses the wire */}
      <Reveal delay={0.1} className="mt-6">
        <div className="rounded-2xl border border-border bg-gradient-to-b from-secondary/30 to-card/10 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What crosses the wire
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {DATAFLOW.map((d) => (
              <div key={d.label} className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand/25 bg-brand-soft text-brand">
                  <d.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
