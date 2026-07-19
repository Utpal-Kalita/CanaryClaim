import { useState } from 'react';
import { Wallet, ChevronDown, Copy, LogOut, Check, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWallet } from '@/modules/midnight/wallet-widget/hooks/useWallet';
import { cn } from '@/lib/utils';

/** Real 1AM Preview connection through the Midnight DApp Connector API. */
export function WalletButton() {
  const { connectingWallet, connectedAPI, unshieldedAddress, dustBalance, error, connectWallet, disconnect } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const connected = Boolean(connectedAPI && unshieldedAddress?.unshieldedAddress);
  const address = unshieldedAddress?.unshieldedAddress ?? null;
  const balance = dustBalance?.balance?.toString() ?? '0';

  if (!connected) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={() => void connectWallet('1am', 'preview')}
          disabled={connectingWallet}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
        >
          {connectingWallet ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
          {connectingWallet ? 'Connecting…' : 'Connect 1AM'}
        </button>
        {error && <span className="max-w-48 text-right text-[10px] text-danger">Install and unlock 1AM on Preview to connect.</span>}
      </div>
    );
  }

  const short = `${address!.slice(0, 6)}…${address!.slice(-4)}`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-2 text-sm transition-colors hover:bg-secondary"
      >
        <span className="h-2 w-2 rounded-full bg-brand" />
        <span className="hidden font-mono text-xs sm:inline">{short}</span>
        <span className="font-medium">1AM</span>
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
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">1AM wallet (Preview)</p>
              <p className="mt-0.5 text-lg font-semibold">{balance} DUST</p>
              <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">{address}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(address).catch(() => void 0);
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
                disconnect();
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
