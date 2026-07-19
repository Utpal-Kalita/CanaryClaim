import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Aurora, GridBackdrop } from '@/components/site/backgrounds';
import { Reveal } from '@/components/ui/primitives';
import { scrollToId } from '@/lib/scroll';

export function CtaBand() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 px-6 py-16 text-center sm:px-16">
            <Aurora className="opacity-70" />
            <GridBackdrop />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
                <ShieldCheck className="h-3.5 w-3.5" />
                The exploit never left the researcher’s device
              </span>
              <h2 className="mx-auto mt-6 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
                Prove the vulnerability.
                <br />
                <span className="text-gradient">Keep the secret.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
                CanaryClaim turns confidential discovery into an automatic, verifiable payout — a
                trust move only Midnight makes possible.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => scrollToId('demo')}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow-brand transition-transform hover:scale-[1.03] active:scale-95"
                >
                  Run the demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => scrollToId('why-midnight')}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Why Midnight
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
