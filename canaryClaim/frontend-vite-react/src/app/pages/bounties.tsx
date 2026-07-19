import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Lock, Clock, Users, Coins, Search, Crosshair, ShieldCheck, LayoutGrid } from 'lucide-react';
import { AppLayout, PageHeader } from '../app-layout';
import { useApp } from '../store';
import { CATEGORIES } from '../categories';
import type { Bounty, BountyCategory, BountyStatus, Difficulty } from '../types';
import { cn } from '@/lib/utils';

const diffColor: Record<Difficulty, string> = {
  Easy: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Medium: 'text-brand border-brand/30 bg-brand/10',
  Hard: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  Expert: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
};

const statusMeta: Record<BountyStatus, { label: string; cls: string; dot: string }> = {
  live: { label: 'Live', cls: 'text-brand', dot: 'bg-brand animate-pulse' },
  'ending-soon': { label: 'Ending soon', cls: 'text-amber-400', dot: 'bg-amber-400 animate-pulse' },
  claimed: { label: 'Claimed', cls: 'text-muted-foreground', dot: 'bg-muted-foreground' },
};

const CATEGORY_KEYS = Object.keys(CATEGORIES) as BountyCategory[];

export function BountiesPage() {
  const { bounties } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<BountyCategory | 'all'>('all');
  const [openOnly, setOpenOnly] = useState(false);

  const stats = useMemo(() => {
    const open = bounties.filter((b) => b.status !== 'claimed');
    return {
      open: open.length,
      pool: open.reduce((n, b) => n + b.reward, 0),
      classes: new Set(bounties.map((b) => b.category)).size,
    };
  }, [bounties]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    bounties.forEach((b) => (map[b.category] = (map[b.category] ?? 0) + 1));
    return map;
  }, [bounties]);

  const visible = useMemo(() => {
    return bounties.filter((b) => {
      const matchesQ =
        !q ||
        b.name.toLowerCase().includes(q.toLowerCase()) ||
        b.lab.toLowerCase().includes(q.toLowerCase()) ||
        b.target.toLowerCase().includes(q.toLowerCase()) ||
        b.tags.some((t) => t.includes(q.toLowerCase()));
      const matchesCat = cat === 'all' || b.category === cat;
      const matchesOpen = !openOnly || b.status !== 'claimed';
      return matchesQ && matchesCat && matchesOpen;
    });
  }, [bounties, q, cat, openOnly]);

  return (
    <AppLayout>
      <div className="px-4 py-8 sm:px-8">
        <PageHeader
          title="Bounties"
          subtitle="Confidential vulnerability campaigns across every AI attack surface, chatbots, agents, RAG, tools, computer-use and more."
          right={
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-2 text-sm">
              <input type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} className="accent-brand" />
              Open only
            </label>
          }
        />

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat icon={<Crosshair className="h-4 w-4 text-brand" />} label="Open bounties" value={String(stats.open)} />
          <Stat icon={<Coins className="h-4 w-4 text-brand" />} label="Total pool" value={`${stats.pool.toLocaleString()} DUST`} />
          <Stat icon={<LayoutGrid className="h-4 w-4 text-brand" />} label="Vuln. classes" value={String(stats.classes)} />
        </div>

        {/* Search */}
        <div className="mt-8 relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bounties, labs, targets, tags…"
            className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand"
          />
        </div>

        {/* Category filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          <CatChip active={cat === 'all'} onClick={() => setCat('all')} label="All" count={bounties.length} />
          {CATEGORY_KEYS.map((k) => {
            const meta = CATEGORIES[k];
            const Icon = meta.icon;
            return (
              <CatChip
                key={k}
                active={cat === k}
                onClick={() => setCat(k)}
                label={meta.label}
                count={counts[k] ?? 0}
                icon={<Icon className="h-3.5 w-3.5" />}
              />
            );
          })}
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((b, i) => (
            <BountyCard key={b.id} bounty={b} index={i} />
          ))}
        </div>
        {visible.length === 0 && (
          <p className="mt-16 text-center text-sm text-muted-foreground">No bounties match your filters.</p>
        )}
      </div>
    </AppLayout>
  );
}

function CatChip({
  active, onClick, label, count, icon,
}: {
  active: boolean; onClick: () => void; label: string; count: number; icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active ? 'border-brand/40 bg-brand/10 text-brand' : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {label}
      <span className={cn('rounded-full px-1.5 text-[10px]', active ? 'bg-brand/20' : 'bg-secondary/60')}>{count}</span>
    </button>
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

function BountyCard({ bounty: b, index }: { bounty: Bounty; index: number }) {
  const { selectBounty } = useApp();
  const navigate = useNavigate();
  const st = statusMeta[b.status];
  const meta = CATEGORIES[b.category];
  const Icon = meta.icon;
  const claimed = b.status === 'claimed';

  const attack = () => {
    selectBounty(b.id);
    navigate({ to: '/attack' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={claimed ? undefined : attack}
      aria-label={claimed ? undefined : `Attack ${b.name}`}
      className={cn(
        'group flex flex-col rounded-2xl border border-border bg-card/60 p-5 transition-colors',
        !claimed && 'cursor-pointer hover:border-brand/40 hover:bg-card/80',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={cn('flex items-center gap-1.5 font-medium', st.cls)}>
              <span className={cn('h-1.5 w-1.5 rounded-full', st.dot)} />
              {st.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              <Icon className="h-3 w-3" />
              {meta.label}
            </span>
          </div>
          <h3 className="mt-2 truncate text-base font-semibold leading-tight">{b.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{b.lab} · {b.target}</p>
        </div>
        <span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium', diffColor[b.difficulty])}>
          {b.difficulty}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {b.tags.map((t) => (
          <span key={t} className="rounded-md bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{t}</span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-xs">
        <Meta icon={<Coins className="h-3.5 w-3.5 text-brand" />} value={`${b.reward} DUST`} />
        <Meta icon={<Clock className="h-3.5 w-3.5" />} value={claimed ? 'Closed' : `${b.endsInHours}h left`} />
        <Meta icon={<Users className="h-3.5 w-3.5" />} value={`${b.submissions}`} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          {b.fingerprint}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); attack(); }}
          disabled={claimed}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-transform',
            claimed
              ? 'cursor-not-allowed bg-secondary text-muted-foreground'
              : 'bg-brand text-white shadow-[0_0_22px_-4px_var(--brand)] hover:scale-[1.04] active:scale-95',
          )}
        >
          {claimed ? <ShieldCheck className="h-3.5 w-3.5" /> : <Crosshair className="h-3.5 w-3.5" />}
          {claimed ? 'Claimed' : 'Attack'}
        </button>
      </div>
    </motion.div>
  );
}

function Meta({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="text-foreground">{value}</span>
    </span>
  );
}
