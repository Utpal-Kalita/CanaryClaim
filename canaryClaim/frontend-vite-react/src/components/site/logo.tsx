import { cn } from '@/lib/utils';

export function CanaryMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('h-8 w-8', className)} fill="none" aria-hidden>
      <defs>
        <linearGradient id="canaryBird" x1="9" y1="7" x2="22" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand)" />
          <stop offset="1" stopColor="var(--canary)" />
        </linearGradient>
        <linearGradient id="canaryRing" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--canary)" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="canaryGlow" cx="0.5" cy="0.42" r="0.62">
          <stop stopColor="var(--brand)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* badge + inner glow */}
      <rect x="1" y="1" width="30" height="30" rx="9" className="fill-card" />
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#canaryGlow)" />

      {/* canary */}
      <path
        d="M16 7c-3.5 0-6 2-6 5 0 1.8 1 3.1 2.3 4l-2 5.9c-.2.6.3 1.1.9 1l3.1-.7c.5-.1.8-.5.8-1v-2.1c0-.3.2-.5.5-.5s.5.2.5.5v1.9c0 .5.4.9.8.9l2.5.5c.6.1 1-.5.9-1l-1.8-5.4c1.5-.9 2.7-2.3 2.7-4.2C23.9 9.3 20.6 7 16 7Z"
        fill="url(#canaryBird)"
      />
      <circle cx="14.3" cy="12.1" r="1.05" className="fill-card" />

      {/* gradient ring on top so it frames the mark cleanly */}
      <rect x="1.75" y="1.75" width="28.5" height="28.5" rx="8.25" stroke="url(#canaryRing)" strokeWidth="1.5" />
    </svg>
  );
}

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <CanaryMark />
      <span className={cn('text-[15px] font-semibold tracking-tight', onDark ? 'text-white' : 'text-foreground')}>
        Canary<span className="text-brand">Claim</span>
      </span>
    </div>
  );
}
