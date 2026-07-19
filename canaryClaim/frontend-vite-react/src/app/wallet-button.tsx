import { useState } from 'react';
import { Wallet, ChevronDown, Copy, LogOut, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './store';
import { cn } from '@/lib/utils';

/**
 * Top-bar wallet connect. Stubbed with a mock address/balance for now — swap
 * `connectWallet` in store.tsx for the template's Lace/Midnight wallet widget
 * (already provided via MidnightMeshProvider) when the backend is ready.
 */
export function WalletButton() {
  const { wallet, connectWallet, disconnectWallet } = useApp();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!wallet.connected) {
    return (
      <button
        onClick={connectWallet}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-95"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </button>
    );
  }

  const short = wallet.address ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}` : '';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-2 text-sm transition-colors hover:bg-secondary"
      >
        <span className="h-2 w-2 rounded-full bg-brand" />
        <span className="hidden font-mono text-xs sm:inline">{short}</span>
        <span className="font-medium">{wallet.balance} DUST</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-xl shadow-black/40"
          >
            <div className="rounded-xl bg-secondary/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Balance</p>
              <p className="mt-0.5 text-lg font-semibold">{wallet.balance} DUST</p>
              <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">{wallet.address}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(wallet.address ?? '').catch(() => void 0);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy address'}
            </button>
            <button
              onClick={() => {
                disconnectWallet();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
