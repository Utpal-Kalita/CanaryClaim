import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'brand' | 'canary' | 'verify' | 'muted';

const topBorder: Record<Tone, string> = {
  brand: 'before:bg-brand',
  canary: 'before:bg-canary',
  verify: 'before:bg-verify',
  muted: 'before:bg-border',
};

export function PanelShell({
  children,
  tone = 'brand',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm',
        'before:absolute before:inset-x-0 before:top-0 before:h-px before:opacity-60',
        topBorder[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

const dot: Record<Tone, string> = {
  brand: 'bg-brand',
  canary: 'bg-canary',
  verify: 'bg-verify',
  muted: 'bg-muted-foreground',
};

export function PanelHeader({
  eyebrow,
  title,
  subtitle,
  tone = 'brand',
  right,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  tone?: Tone;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span className={cn('h-1.5 w-1.5 rounded-full', dot[tone])} />
          {eyebrow}
        </div>
        <h3 className="mt-2 text-base font-semibold leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
