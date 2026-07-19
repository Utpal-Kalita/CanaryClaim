import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Check, Coins, Receipt, TrendingUp, ArrowRight, ExternalLink, FlaskConical } from 'lucide-react';
import { AppLayout, PageHeader } from '../app-layout';
import { useApp } from '../store';

export function ClaimsPage() {
  const { claims, addMockTransaction } = useApp();
  const navigate = useNavigate();
  const total = claims.reduce((n, c) => n + c.amount, 0);

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <PageHeader title="My Claims" subtitle="Your settled bounties. Every payout is publicly verifiable; every exploit stays private." />

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat icon={<Coins className="h-4 w-4 text-brand" />} label="Total earned" value={`${total.toLocaleString()} DUST`} />
          <Stat icon={<Receipt className="h-4 w-4 text-brand" />} label="Claims" value={String(claims.length)} />
          <Stat icon={<TrendingUp className="h-4 w-4 text-brand" />} label="Success rate" value={claims.length ? '100%' : '-'} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Judge demo: add a sample workflow entry. This does not contact Midnight, generate a proof, or create a wallet transaction.
          </p>
          <button onClick={addMockTransaction} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-500/40 px-3 py-2 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/10">
            <FlaskConical className="h-3.5 w-3.5" /> Add mock transaction
          </button>
        </div>

        {claims.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary/50">
              <Receipt className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-4 font-medium">No claims yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">Claim your first bounty and it will show up here with its proof transaction.</p>
            <button onClick={() => navigate({ to: '/bounties' })} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]">
              Browse bounties <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/60">
            {claims.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {c.bountyName}{c.isMock && <span className="ml-2 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">Mock</span>}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {new Date(c.date).toLocaleDateString()} · verified
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="hidden items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                    title={c.txRef}
                  >
                    {c.txRef.slice(0, 14)}… <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-sm font-semibold text-brand">+{c.amount} DUST</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 p-4">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 text-lg font-semibold sm:text-xl">{value}</p>
    </div>
  );
}
