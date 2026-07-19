import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, ClipboardPaste, Cpu, Wallet, ArrowRight, AlertCircle } from 'lucide-react';
import { PROOF_STEPS, useDemo } from './demo-context';
import { PanelShell, PanelHeader } from './panel-shell';
import { cn } from '@/lib/utils';

export function ResearcherConsole() {
  const {
    phase,
    secretInput,
    setSecretInput,
    pasteCanary,
    generateProof,
    proofStep,
    proofError,
    secretMatches,
    txRef,
  } = useDemo();

  const proving = phase === 'proving';
  const settled = phase === 'settled';

  return (
    <PanelShell tone="verify">
      <PanelHeader
        tone="verify"
        eyebrow="Researcher Console"
        title="Claim your bounty"
        subtitle="Everything below runs on your device"
      />

      <div className="mt-5 flex-1">
        <AnimatePresence mode="wait">
          {!settled ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Secret input */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Paste the leaked secret
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                    placeholder="CNRY-••••-••••-••••"
                    disabled={proving}
                    className={cn(
                      'w-full rounded-xl border bg-background/60 px-3.5 py-2.5 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-verify',
                      proofError ? 'border-danger' : 'border-border',
                    )}
                  />
                  <button
                    onClick={pasteCanary}
                    disabled={proving}
                    title="Paste from clipboard"
                    className="inline-flex shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/50 px-3 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                  >
                    <ClipboardPaste className="h-4 w-4" />
                  </button>
                </div>
                <AnimatePresence>
                  {proofError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 flex items-center gap-1.5 text-xs text-danger"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      That secret doesn’t match the commitment. Leak the real canary first.
                    </motion.p>
                  )}
                  {secretMatches && !proving && !proofError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center gap-1.5 text-xs text-verify"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Secret captured, ready to prove.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Generate button */}
              <button
                onClick={generateProof}
                disabled={proving || !secretInput}
                className={cn(
                  'group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  proving
                    ? 'bg-secondary text-muted-foreground'
                    : 'bg-primary text-primary-foreground shadow-glow-brand hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:shadow-none disabled:hover:scale-100',
                )}
              >
                {proving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating proof…
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4" />
                    Generate proof
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Progress steps */}
              {proving && (
                <div className="space-y-2.5 rounded-xl border border-border bg-secondary/30 p-4">
                  {PROOF_STEPS.map((step, i) => {
                    const done = i < proofStep;
                    const active = i === proofStep;
                    return (
                      <div key={step.key} className="flex items-center gap-3">
                        <StepIcon done={done} active={active} />
                        <div className="flex-1">
                          <p
                            className={cn(
                              'text-sm transition-colors',
                              done || active ? 'text-foreground' : 'text-muted-foreground/60',
                            )}
                          >
                            {step.label}
                          </p>
                          {active && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="font-mono text-[11px] text-muted-foreground"
                            >
                              {step.detail}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <SuccessState txRef={txRef} />
          )}
        </AnimatePresence>
      </div>
    </PanelShell>
  );
}

function StepIcon({ done, active }: { done: boolean; active: boolean }) {
  return (
    <div
      className={cn(
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors',
        done
          ? 'border-verify bg-verify text-background'
          : active
            ? 'border-brand bg-brand-soft text-brand'
            : 'border-border text-muted-foreground/50',
      )}
    >
      {done ? (
        <Check className="h-3.5 w-3.5" />
      ) : active ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
    </div>
  );
}

function SuccessState({ txRef }: { txRef: string | null }) {
  const rows = [
    { label: 'Proof verified', icon: Check },
    { label: 'Bounty released', icon: Check },
    { label: 'Wallet credited', icon: Check },
  ];
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex flex-col items-center rounded-2xl border border-verify/30 bg-verify-soft p-6 text-center"
      >
        <div className="relative flex h-14 w-14 items-center justify-center">
          <motion.span
            className="absolute inset-0 rounded-full bg-verify/30"
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-verify text-background">
            <Check className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-verify" />
          <span className="text-lg font-semibold text-foreground">+500 DUST</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">credited to your wallet</p>
      </motion.div>

      <div className="space-y-2">
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12 }}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/30 px-3.5 py-2.5 text-sm"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-verify text-background">
              <r.icon className="h-3 w-3" />
            </span>
            {r.label}
          </motion.div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-background/50 p-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Transaction</p>
        <p className="mt-1 truncate font-mono text-xs text-brand">{txRef}</p>
      </div>
    </motion.div>
  );
}
