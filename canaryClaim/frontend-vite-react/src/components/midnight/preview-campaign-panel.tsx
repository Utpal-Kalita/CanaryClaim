import { useEffect, useState } from 'react';
import { Check, Loader2, Rocket, ShieldCheck } from 'lucide-react';
import { PreviewCanaryProvider, usePreviewCanaryProviders } from '@/modules/midnight/preview/preview-providers';
import { useWallet } from '@/modules/midnight/wallet-widget/hooks/useWallet';
import { claimPreviewCampaign, deployPreviewCampaign } from '@/lib/preview-canary';

const storageKey = 'canaryclaim-preview-campaign-address';

function PreviewCampaignControls({ secret }: { secret: string }) {
  const { providers } = usePreviewCanaryProviders();
  const { connectedAPI, status } = useWallet();
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState<'deploy' | 'claim' | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setAddress(window.localStorage.getItem(storageKey) ?? '');
  }, []);

  const isPreview = status?.status === 'connected' && status.networkId === 'preview';
  const ready = Boolean(connectedAPI && isPreview && providers);

  const deploy = async () => {
    if (!providers || !secret.trim()) return;
    setBusy('deploy');
    setMessage(null);
    try {
      const deployedAddress = await deployPreviewCampaign(providers, secret.trim());
      setAddress(deployedAddress);
      window.localStorage.setItem(storageKey, deployedAddress);
      setMessage(`Preview campaign submitted: ${deployedAddress}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Preview deployment failed.');
    } finally {
      setBusy(null);
    }
  };

  const claim = async () => {
    if (!providers || !address.trim() || !secret.trim()) return;
    setBusy('claim');
    setMessage(null);
    try {
      const result = await claimPreviewCampaign(providers, address.trim(), secret.trim());
      setMessage(`Preview claim submitted: ${result.transactionId}${result.blockHeight ? ` (block ${result.blockHeight})` : ''}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Preview claim failed.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-brand" />
        <div>
          <h2 className="text-sm font-semibold">Preview wallet campaign</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Uses your connected 1AM Preview wallet to prove, balance, and submit Canary contract transactions. Each action requires wallet approval.
          </p>
        </div>
      </div>

      {!ready && (
        <p className="mt-4 rounded-lg border border-border bg-background/50 p-3 text-xs text-muted-foreground">
          Connect 1AM and select the Preview network to enable this panel.
        </p>
      )}

      <label className="mt-4 block text-xs font-medium text-muted-foreground">
        Preview campaign contract address
        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Deploy a campaign or paste its hexadecimal address"
          disabled={busy !== null}
          className="mt-2 w-full rounded-xl border border-border bg-background/60 px-3 py-2 font-mono text-xs outline-none focus:border-brand disabled:opacity-60"
        />
      </label>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          onClick={() => void deploy()}
          disabled={!ready || !secret.trim() || busy !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-black disabled:opacity-50"
        >
          {busy === 'deploy' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          Deploy Preview campaign
        </button>
        <button
          onClick={() => void claim()}
          disabled={!ready || !address.trim() || !secret.trim() || busy !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {busy === 'claim' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Submit Preview claim
        </button>
      </div>

      {message && <p className="mt-3 break-all rounded-lg border border-border bg-background/50 p-3 font-mono text-[11px] text-muted-foreground">{message}</p>}
    </section>
  );
}

/** Loaded only on the Preview claim screen, keeping the main app bundle lightweight. */
export function PreviewCampaignPanel({ secret }: { secret: string }) {
  return (
    <PreviewCanaryProvider>
      <PreviewCampaignControls secret={secret} />
    </PreviewCanaryProvider>
  );
}
