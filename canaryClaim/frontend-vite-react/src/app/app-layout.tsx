import { type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Radar, FileCheck2, Receipt, ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/site/logo';
import { WalletButton } from './wallet-button';
import { useApp } from './store';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/bounties', label: 'Bounties', icon: Radar },
  { to: '/submit', label: 'Submit Proof', icon: FileCheck2 },
  { to: '/claims', label: 'My Claims', icon: Receipt },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const { claims } = useApp();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* magenta ambiance */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(55% 45% at 88% -5%, #FF2E9A33, transparent 60%), radial-gradient(50% 45% at -5% 105%, #FF2E9A28, transparent 60%)',
        }}
      />
      <div className="relative z-10">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/bounties"
            title="CanaryClaim bounties"
            className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80"
          >
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="https://midnight.network"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Testnet
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <WalletButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-border/70 p-4 md:flex">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                activeProps={{ className: 'bg-secondary text-foreground' }}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                {item.to === '/claims' && claims.length > 0 && (
                  <span className="rounded-full bg-brand/20 px-1.5 py-0.5 text-[10px] font-medium text-brand">
                    {claims.length}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-border bg-card/50 p-4">
            <p className="text-xs font-medium">Confidential by design</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Proofs are generated on your device. Exploits never leave your machine.
            </p>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 pb-24">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/70 bg-background/90 backdrop-blur-md md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: true }}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
            activeProps={{ className: 'text-brand' }}
          >
            <item.icon className="h-4 w-4" />
            {item.label.split(' ')[0]}
          </Link>
        ))}
      </nav>
      </div>
    </div>
  );
}

/** Consistent page header used across app pages. */
export function PageHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
