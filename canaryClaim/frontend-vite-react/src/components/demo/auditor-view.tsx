import { motion } from 'framer-motion';
import { Check, Lock, Eye, Clock } from 'lucide-react';
import { useDemo } from './demo-context';
import { PanelShell, PanelHeader } from './panel-shell';
import { cn } from '@/lib/utils';

export function AuditorView() {
  const { phase } = useDemo();
  const settled = phase === 'settled';

  const publicFacts = [
    { label: 'Campaign exists', done: true },
    { label: 'Funds locked in escrow', done: true },
    { label: 'Proof submitted', done: phase === 'proving' || settled },
    { label: 'Proof verified', done: settled },
    { label: 'Payout released', done: settled },
  ];

  const sealed = ['The canary secret', 'The exploit prompt', 'The leaked data', 'Researcher identity'];

  return (
    <PanelShell tone="muted">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <PanelHeader
          tone="muted"
          eyebrow="Auditor View · Midnight"
          title="Publicly verifiable, fully confidential"
          subtitle="Anyone can audit the outcome without seeing a single secret."
        />
        <div
          className={cn(
            'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            settled
              ? 'border-verify/30 bg-verify-soft text-verify'
              : 'border-border bg-secondary/40 text-muted-foreground',
          )}
        >
          {settled ? <Check className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
          {settled ? 'Settlement finalized' : 'Awaiting settlement'}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Public facts */}
        <div className="rounded-2xl border border-verify/20 bg-verify-soft/40 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-verify">
            <Eye className="h-4 w-4" />
            Public, verifiable by anyone
          </div>
          <ul className="mt-4 space-y-2.5">
            {publicFacts.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <motion.span
                  initial={false}
                  animate={{
                    backgroundColor: f.done ? 'var(--verify)' : 'transparent',
                    borderColor: f.done ? 'var(--verify)' : 'var(--border)',
                    scale: f.done ? [1, 1.15, 1] : 1,
                  }}
                  transition={{ duration: 0.35 }}
                  className="flex h-5 w-5 items-center justify-center rounded-full border"
                >
                  {f.done && <Check className="h-3 w-3 text-background" />}
                </motion.span>
                <span
                  className={cn(
                    'text-sm transition-colors',
                    f.done ? 'text-foreground' : 'text-muted-foreground/60',
                  )}
                >
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sealed */}
        <div className="rounded-2xl border border-canary/20 bg-canary-soft/30 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-canary">
            <Lock className="h-4 w-4" />
            Sealed, never revealed
          </div>
          <ul className="mt-4 space-y-2.5">
            {sealed.map((s) => (
              <li key={s} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-canary/30 bg-canary-soft">
                  <Lock className="h-2.5 w-2.5 text-canary" />
                </span>
                <span className="text-sm text-muted-foreground">{s}</span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground/50">
                  🔒 hidden
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        This is the guarantee only Midnight can make:{' '}
        <span className="text-foreground">the payout is provable, the exploit is invisible.</span>
      </p>
    </PanelShell>
  );
}
