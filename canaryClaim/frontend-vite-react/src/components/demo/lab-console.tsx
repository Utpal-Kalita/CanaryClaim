import { motion } from 'framer-motion';
import { Lock, Timer, Fingerprint, Coins } from 'lucide-react';
import { CAMPAIGN, useDemo } from './demo-context';
import { PanelShell, PanelHeader } from './panel-shell';

export function LabConsole() {
  const { phase } = useDemo();
  const funded = true;
  const claimed = phase === 'settled';

  return (
    <PanelShell tone="brand">
      <PanelHeader
        tone="brand"
        eyebrow="AI Lab Console"
        title={CAMPAIGN.name}
        subtitle={CAMPAIGN.lab}
      />

      <div className="mt-5 space-y-4">
        {/* Reward + status */}
        <div className="grid grid-cols-2 gap-3">
          <Stat
            icon={<Coins className="h-4 w-4 text-canary" />}
            label="Reward"
            value={CAMPAIGN.reward}
          />
          <Stat
            icon={
              <span
                className={`h-2 w-2 rounded-full ${claimed ? 'bg-verify' : 'bg-canary'} ${
                  !claimed && 'animate-pulse'
                }`}
              />
            }
            label="Status"
            value={claimed ? 'Claimed' : 'Live'}
            valueClass={claimed ? 'text-verify' : 'text-canary'}
          />
          <Stat
            icon={<Timer className="h-4 w-4 text-muted-foreground" />}
            label="Time left"
            value={claimed ? '—' : '2d 14h'}
          />
          <Stat
            icon={<Lock className="h-4 w-4 text-muted-foreground" />}
            label="Escrow"
            value={funded ? 'Funded' : 'Pending'}
            valueClass="text-verify"
          />
        </div>

        {/* Fingerprint */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Fingerprint className="h-3.5 w-3.5" />
            Canary commitment
          </div>
          <p className="mt-2 font-mono text-sm text-foreground">{CAMPAIGN.fingerprint}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Public fingerprint only — the secret itself is sealed.
          </p>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">{CAMPAIGN.description}</p>

        {/* Sealed secret visual */}
        <motion.div
          animate={claimed ? { borderColor: 'var(--verify)' } : {}}
          className="flex items-center justify-between rounded-xl border border-canary/25 bg-canary-soft px-4 py-3"
        >
          <div className="flex items-center gap-2.5">
            <Lock className={`h-4 w-4 ${claimed ? 'text-verify' : 'text-canary'}`} />
            <span className="text-sm font-medium text-foreground">Sealed canary</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">••• ••• •••</span>
        </motion.div>
      </div>
    </PanelShell>
  );
}

function Stat({
  icon,
  label,
  value,
  valueClass = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className={`mt-1 text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}
