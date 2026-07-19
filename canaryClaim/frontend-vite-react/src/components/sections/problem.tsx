import { motion } from 'framer-motion';
import { EyeOff, HandCoins, Megaphone, ShieldAlert } from 'lucide-react';
import { Section, Eyebrow, SectionHeading, Lead, Reveal, RevealGroup, RevealItem } from '@/components/ui/primitives';

const CHOICES = [
  {
    icon: EyeOff,
    title: 'Reveal everything first',
    body: 'Hand over the full exploit and hope you get paid. Once it’s out, your leverage is gone.',
  },
  {
    icon: HandCoins,
    title: 'Ask to be trusted',
    body: 'Request payment on your word alone. The lab has no way to tell you apart from a scammer.',
  },
  {
    icon: Megaphone,
    title: 'Go public',
    body: 'Publish the vulnerability to force a response, and expose real users in the process.',
  },
];

export function Problem() {
  return (
    <Section id="problem">
      <div className="max-w-2xl">
        <Reveal>
          <Eyebrow tone="danger" className="text-danger">
            The trust problem
          </Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <SectionHeading className="mt-4">
            Reporting an AI vulnerability forces an impossible choice.
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.1}>
          <Lead className="mt-5">
            Today a researcher who finds a real jailbreak has only bad options. Every one of them
            breaks trust for someone.
          </Lead>
        </Reveal>
      </div>

      <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
        {CHOICES.map((c) => (
          <RevealItem
            key={c.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6"
          >
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-danger/25 bg-danger/10 text-danger">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-danger/5 blur-2xl" />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* The standoff */}
      <Reveal delay={0.1} className="mt-16">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-secondary/40 to-card/20 p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/60 text-muted-foreground sm:flex">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="grid flex-1 gap-8 sm:grid-cols-3">
              {[
                { who: 'The researcher', fear: 'fears being ignored, or robbed of credit and reward.' },
                { who: 'The AI lab', fear: 'fears paying out for fake or unverifiable claims.' },
                { who: 'The public', fear: 'risks exposure the moment an exploit is published.' },
              ].map((r, i) => (
                <motion.div
                  key={r.who}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <p className="text-sm font-semibold">{r.who}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.fear}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
