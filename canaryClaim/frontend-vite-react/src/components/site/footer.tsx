import { Logo } from './logo';
import { scrollToId } from '@/lib/scroll';
import { Pill } from '@/components/ui/primitives';

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'The problem', id: 'problem' },
      { label: 'How it works', id: 'solution' },
      { label: 'Live demo', id: 'demo' },
      { label: 'Features', id: 'features' },
    ],
  },
  {
    title: 'Technology',
    links: [
      { label: 'Why Midnight', id: 'why-midnight' },
      { label: 'Architecture', id: 'architecture' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/70 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Confidential proof of discovery for AI vulnerabilities. Prove the bug, collect the
              bounty, keep the exploit private.
            </p>
            <div className="mt-5">
              <Pill tone="brand">Built on Midnight</Pill>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => scrollToId(l.id)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} CanaryClaim. A privacy-first AI bounty protocol.</p>
          <p className="font-mono text-xs">
            zk-proof · no exploit ever leaves the researcher&apos;s device
          </p>
        </div>
      </div>
    </footer>
  );
}
