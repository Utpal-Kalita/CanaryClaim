import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, ClipboardPaste, Cpu, Loader2, Check, AlertCircle, Wallet, Crosshair,
} from 'lucide-react';
import { AppLayout, PageHeader } from '../app-layout';
import { PROOF_STEPS, useApp } from '../store';
import { cn } from '@/lib/utils';

export function SubmitPage() {
  const app = useApp();
  const navigate = useNavigate();
  const { selectedBounty, secretInput, setSecretInput, pasteCanary, generateProof, proving, proofStep, proofError, secretMatches, capturedSecret, lastClaim } = app;

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        <PageHeader
          title="Submit Proof"
          subtitle="Generate a zero-knowledge proof that the leaked value matches the sealed commitment — locally."
        />

        {!selectedBounty ? (
          <EmptyState onBrowse={() => navigate({ to: '/bounties' })} />
        ) : (
          <div className="mt-6 space-y-4">
            {/* target */}
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card/60 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Claiming</p>
                <p className="text-sm font-semibold">{selectedBounty.name}</p>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
                {selectedBounty.reward} DUST
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!lastClaim ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl border border-border bg-card/60 p-6">
                  <label className="text-xs font-medium text-muted-foreground">Leaked secret</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={secretInput}
                      onChange={(e) => setSecretInput(e.target.value)}
                      placeholder="CNRY-••••-••••-••••"
                      disabled={proving}
                      className={cn(
                        'w-full rounded-xl border bg-background/60 px-3.5 py-2.5 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-brand',
                        proofError ? 'border-danger' : 'border-border',
                      )}
                    />
                    {capturedSecret && (
                      <button
                        onClick={pasteCanary}
                        disabled={proving}
                        title="Paste captured secret"
                        className="inline-flex shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/50 px-3 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                      >
                        <ClipboardPaste className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {proofError && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 flex items-center gap-1.5 text-xs text-danger">
                        <AlertCircle className="h-3.5 w-3.5" />
                        That secret doesn’t match the commitment. Capture the real canary first.
                      </motion.p>
                    )}
                    {secretMatches && !proving && !proofError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex items-center gap-1.5 text-xs text-brand">
                        <Check className="h-3.5 w-3.5" /> Secret matches — ready to prove.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={generateProof}
                    disabled={proving || !secretInput}
                    className={cn(
                      'mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                      proving ? 'bg-secondary text-muted-foreground' : 'bg-white text-black hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100',
                    )}
                  >
                    {proving ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Generating proof…</>
                    ) : (
                      <><Cpu className="h-4 w-4" /> Generate proof <ArrowRight className="h-3.5 w-3.5" /></>
                    )}
                  </button>

                  {proving && (
                    <div className="mt-4 space-y-2.5 rounded-xl border border-border bg-secondary/30 p-4">
                      {PROOF_STEPS.map((step, i) => {
                        const done = i < proofStep;
                        const active = i === proofStep;
                        return (
                          <div key={step.key} className="flex items-center gap-3">
                            <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', done ? 'border-brand bg-brand text-black' : active ? 'border-brand bg-brand/10 text-brand' : 'border-border text-muted-foreground/50')}>
                              {done ? <Check className="h-3.5 w-3.5" /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                            </div>
                            <div>
                              <p className={cn('text-sm', done || active ? 'text-foreground' : 'text-muted-foreground/60')}>{step.label}</p>
                              {active && <p className="font-mono text-[11px] text-muted-foreground">{step.detail}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p className="mt-4 text-center text-[11px] text-muted-foreground">
                    Everything above runs in your browser. The exploit and secret never leave your device.
                  </p>
                </motion.div>
              ) : (
                <Success onClaims={() => navigate({ to: '/claims' })} onBrowse={() => navigate({ to: '/bounties' })} />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary/50">
        <Crosshair className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="mt-4 font-medium">No captured secret yet</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Pick a bounty and jailbreak the model to capture its canary, then submit your proof here.
      </p>
      <button onClick={onBrowse} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]">
        Browse bounties <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Success({ onClaims, onBrowse }: { onClaims: () => void; onBrowse: () => void }) {
  const { lastClaim } = useApp();
  if (!lastClaim) return null;
  const rows = ['Proof verified', 'Bounty released', 'Wallet credited'];
  return (
    <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card/60 p-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="flex flex-col items-center rounded-2xl border border-brand/30 bg-brand/5 p-6 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <motion.span className="absolute inset-0 rounded-full bg-brand/30" animate={{ scale: [1, 1.8], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand text-black">
            <Check className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-brand" />
          <span className="text-lg font-semibold">+{lastClaim.amount} DUST</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">credited to your wallet</p>
      </motion.div>

      <div className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <motion.div key={r} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }} className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/30 px-3.5 py-2.5 text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-black"><Check className="h-3 w-3" /></span>
            {r}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-background/50 p-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Transaction</p>
        <p className="mt-1 truncate font-mono text-xs text-brand">{lastClaim.txRef}</p>
      </div>

      <div className="mt-5 flex gap-2">
        <button onClick={onClaims} className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]">
          View my claims
        </button>
        <button onClick={onBrowse} className="flex-1 rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
          Find another bounty
        </button>
      </div>
    </motion.div>
  );
}
