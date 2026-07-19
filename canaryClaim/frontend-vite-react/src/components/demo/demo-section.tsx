import { motion } from 'framer-motion';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { Section, Eyebrow, SectionHeading, Lead, Reveal } from '@/components/ui/primitives';
import { Aurora } from '@/components/site/backgrounds';
import { DemoProvider, useDemo, type Phase } from './demo-context';
import { LabConsole } from './lab-console';
import { AiChat } from './ai-chat';
import { ResearcherConsole } from './researcher-console';
import { AuditorView } from './auditor-view';
import { cn } from '@/lib/utils';

const STEPS: { phase: Phase; label: string }[] = [
  { phase: 'idle', label: 'Attack the model' },
  { phase: 'leaked', label: 'Capture the canary' },
  { phase: 'proving', label: 'Generate the proof' },
  { phase: 'settled', label: 'Bounty settled' },
];

const order: Phase[] = ['idle', 'leaked', 'proving', 'settled'];

function ProgressRail() {
  const { phase, reset } = useDemo();
  const current = order.indexOf(phase);

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {STEPS.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={s.phase} className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'border-brand/40 bg-brand-soft text-brand'
                    : done
                      ? 'border-verify/30 bg-verify-soft text-verify'
                      : 'border-border bg-secondary/40 text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold',
                    active ? 'bg-brand text-primary-foreground' : done ? 'bg-verify text-background' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {i + 1}
                </span>
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <ArrowRight className="hidden h-3.5 w-3.5 text-muted-foreground/40 sm:block" />
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={reset}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset demo
      </button>
    </div>
  );
}

export function DemoSection() {
  return (
    <Section id="demo" className="relative overflow-hidden" containerClassName="max-w-7xl">
      <Aurora className="opacity-60" />
      <div className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow tone="canary">Live demo</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <SectionHeading className="mt-4">Watch a bounty settle in real time.</SectionHeading>
          </Reveal>
          <Reveal delay={0.1}>
            <Lead className="mx-auto mt-5">
              Jailbreak the model, leak the canary, and generate a proof. Follow the trust move from
              left to right — the exploit never leaves this browser.
            </Lead>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14">
          <DemoProvider>
            <ProgressRail />
            <div className="grid gap-4 lg:grid-cols-3">
              <motion.div layout>
                <LabConsole />
              </motion.div>
              <motion.div layout>
                <AiChat />
              </motion.div>
              <motion.div layout>
                <ResearcherConsole />
              </motion.div>
            </div>
            <div className="mt-4">
              <AuditorView />
            </div>
          </DemoProvider>
        </Reveal>
      </div>
    </Section>
  );
}
