import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Logo } from './logo';
import { ScrambleText } from '@/components/ui/scramble';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Bounties', to: '/bounties' as const },
  { label: 'Submit Proof', to: '/submit' as const },
  { label: 'My Claims', to: '/claims' as const },
];

function NavLink({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-full px-3.5 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      <ScrambleText text={label} isHovered={hovered} />
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            'mt-3 flex items-center justify-between rounded-full border px-3 py-2 transition-all duration-300 sm:px-4',
            scrolled ? 'glass border-border shadow-lg shadow-black/20' : 'border-transparent bg-transparent',
          )}
        >
          <button onClick={() => go('/')} className="pl-1" aria-label="CanaryClaim home">
            <Logo />
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} label={l.label} onClick={() => go(l.to)} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go('/bounties')}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              className="group hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
            >
              <ScrambleText text="Enter app" isHovered={ctaHover} />
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 md:hidden"
          >
            <div className="glass flex flex-col gap-1 rounded-2xl border border-border p-2">
              {LINKS.map((l) => (
                <button
                  key={l.to}
                  onClick={() => go(l.to)}
                  className="rounded-xl px-4 py-3 text-left text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => go('/bounties')}
                className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"
              >
                Enter app <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
