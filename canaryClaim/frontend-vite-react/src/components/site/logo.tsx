import { cn } from '@/lib/utils';

export function CanaryMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('h-7 w-7', className)} fill="none" aria-hidden>
      <defs>
        <linearGradient id="canaryMarkGrad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand)" />
          <stop offset="1" stopColor="var(--canary)" />
        </linearGradient>
      </defs>
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="8.25" className="fill-card stroke-border" strokeWidth="1.5" />
      <path
        d="M16 7c-3.5 0-6 2-6 5 0 1.8 1 3.1 2.3 4l-2 5.9c-.2.6.3 1.1.9 1l3.1-.7c.5-.1.8-.5.8-1v-2.1c0-.3.2-.5.5-.5s.5.2.5.5v1.9c0 .5.4.9.8.9l2.5.5c.6.1 1-.5.9-1l-1.8-5.4c1.5-.9 2.7-2.3 2.7-4.2C23.9 9.3 20.6 7 16 7Z"
        fill="url(#canaryMarkGrad)"
      />
      <circle cx="14.3" cy="12.2" r="1.05" className="fill-card" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <CanaryMark />
      <span className="text-[15px] font-semibold tracking-tight">
        Canary<span className="text-muted-foreground">Claim</span>
      </span>
    </div>
  );
}
