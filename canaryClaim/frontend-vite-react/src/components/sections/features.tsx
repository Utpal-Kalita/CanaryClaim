import { FlaskConical, Search, Gavel, ArrowUpRight } from 'lucide-react';
import { Section, Eyebrow, SectionHeading, Lead, Reveal, RevealGroup, RevealItem } from '@/components/ui/primitives';

const AUDIENCES = [
  {
    icon: FlaskConical,
    tone: 'brand' as const,
    role: 'AI Labs',
    tagline: 'Launch confidential bounty campaigns',
    points: [
      'Seal a canary and escrow rewards in one flow',
      'Pay only on cryptographic proof of a real leak',
      'Keep exploit details out of the public record',
    ],
  },
  {
    icon: Search,
    tone: 'canary' as const,
    role: 'Security Researchers',
    tagline: 'Get paid the moment you prove it',
    points: [
      'Prove discovery without disclosing the exploit',
      'Automatic payout — no negotiation, no ghosting',
      'Your identity and methods stay yours',
    ],
  },
  {
    icon: Gavel,
    tone: 'verify' as const,
    role: 'Auditors',
    tagline: 'Verify payouts without seeing secrets',
    points: [
      'Confirm funds were locked and released',
      'Check every proof was validly verified',
      'Never touch confidential exploit data',
    ],
  },
];

const toneMap = {
  brand: 'border-brand/25 bg-brand-soft text-brand',
  canary: 'border-canary/25 bg-canary-soft text-canary',
  verify: 'border-verify/25 bg-verify-soft text-verify',
};

export function Features() {
  return (
    <Section id="features">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow tone="canary">Built for every side</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <SectionHeading className="mt-4">One protocol, three aligned incentives.</SectionHeading>
        </Reveal>
        <Reveal delay={0.1}>
          <Lead className="mt-5">
            CanaryClaim replaces fragile trust with math. Everyone gets what they need — and nothing
            they shouldn’t.
          </Lead>
        </Reveal>
      </div>

      <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
        {AUDIENCES.map((a) => (
          <RevealItem
            key={a.role}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-brand/30"
          >
            <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${toneMap[a.tone]}`}>
              <a.icon className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-lg font-semibold">{a.role}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{a.tagline}</p>

            <ul className="mt-5 space-y-3 border-t border-border/60 pt-5">
              {a.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <ArrowUpRight className={`mt-0.5 h-4 w-4 shrink-0 ${toneMap[a.tone].split(' ').pop()}`} />
                  {p}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
