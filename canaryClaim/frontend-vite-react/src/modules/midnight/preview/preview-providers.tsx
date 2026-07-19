import * as ledger from '@midnight-ntwrk/ledger-v7';
import { createContext, useContext, useMemo } from 'react';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { fromHex, toHex } from '@midnight-ntwrk/compact-runtime';
import { useWallet } from '../wallet-widget/hooks/useWallet';
import { CachedFetchZkConfigProvider } from '../wallet-widget/utils/providersWrappers/zkConfigProvider';
import { noopProofClient, proofClient } from '../wallet-widget/utils/providersWrappers/proofClient';
import { inMemoryPrivateStateProvider } from '../wallet-widget/utils/customImplementations/in-memory-private-state-provider';
import { type CanaryPrivateState } from '@eddalabs/counter-contract';

type PreviewContextValue = { providers?: unknown };
const PreviewCanaryContext = createContext<PreviewContextValue>({});

/** Adapts the connected 1AM DApp Connector to the Midnight.js v3 contract APIs. */
export function PreviewCanaryProvider({ children }: { children: React.ReactNode }) {
  const { serviceUriConfig, shieldedAddresses, connectedAPI } = useWallet();

  const providers = useMemo(() => {
    if (!serviceUriConfig || !connectedAPI || !shieldedAddresses || typeof window === 'undefined') return undefined;

    const privateStateProvider = inMemoryPrivateStateProvider<string, CanaryPrivateState>();
    const publicDataProvider = indexerPublicDataProvider(serviceUriConfig.indexerUri, serviceUriConfig.indexerWsUri);
    const zkConfigProvider = new CachedFetchZkConfigProvider<any>(
      `${window.location.origin}/midnight/counter`, fetch.bind(window), () => {},
    );
    const walletProvider = {
      getCoinPublicKey: () => shieldedAddresses.shieldedCoinPublicKey as unknown as ledger.CoinPublicKey,
      getEncryptionPublicKey: () => shieldedAddresses.shieldedEncryptionPublicKey as unknown as ledger.EncPublicKey,
      async balanceTx(tx: any) {
        const received = await connectedAPI.balanceUnsealedTransaction(toHex(tx.serialize()));
        return ledger.Transaction.deserialize('signature', 'proof', 'binding', fromHex(received.tx));
      },
    };
    const midnightProvider = {
      async submitTx(tx: any) {
        await connectedAPI.submitTransaction(toHex(tx.serialize()));
        return tx.identifiers()[0];
      },
    };

    return {
      privateStateProvider,
      publicDataProvider,
      zkConfigProvider,
      proofProvider: serviceUriConfig.proverServerUri
        ? proofClient(serviceUriConfig.proverServerUri, zkConfigProvider, () => {})
        : noopProofClient(),
      walletProvider,
      midnightProvider,
    };
  }, [connectedAPI, serviceUriConfig, shieldedAddresses]);

  return <PreviewCanaryContext.Provider value={{ providers }}>{children}</PreviewCanaryContext.Provider>;
}

export const usePreviewCanaryProviders = () => useContext(PreviewCanaryContext);
