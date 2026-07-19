import 'dotenv/config';

import { Canary, secretToBytes } from '@eddalabs/counter-contract';
import * as api from './api.js';
import { UndeployedConfig } from './config.js';
import { createLogger } from './logger.js';

/**
 * The pre-funded account shipped by the local Midnight development network.
 * It is deliberately limited to the undeployed/local network and must never
 * be used outside a disposable development stack.
 */
const LOCAL_GENESIS_SEED = '0000000000000000000000000000000000000000000000000000000000000001';
const RESULT_PREFIX = 'LOCAL_CLAIM_RESULT=';

type SerializableTx = {
  txId?: unknown;
  txHash?: unknown;
  blockHeight?: unknown;
};

const secretText = process.argv[2];

if (!secretText) {
  throw new Error('Usage: node dist/local-claim.js <canary-secret>');
}

const config = new UndeployedConfig();
const logger = await createLogger(config.logDir);
api.setLogger(logger);

let walletContext: api.WalletContext | undefined;

try {
  const secret = secretToBytes(secretText);
  walletContext = await api.buildWalletAndWaitForFunds(config, LOCAL_GENESIS_SEED);
  const providers = await api.configureProviders(walletContext, config);
  const commitment = Canary.pureCircuits.commitmentOf(secret);

  const contract = await api.withStatus('Deploying local canary contract', () =>
    api.deploy(providers, commitment, secret),
  );
  const claimTx = await api.withStatus('Generating and submitting ZK claim proof', () => api.claim(contract));
  const status = await api.displayCanaryStatus(providers, contract);

  if (status.claimed !== true) {
    throw new Error('The local contract did not report a confirmed claim.');
  }

  const tx = claimTx as unknown as SerializableTx;
  const transactionId = String(tx.txId ?? tx.txHash ?? 'submitted');
  console.log(
    `${RESULT_PREFIX}${JSON.stringify({
      contractAddress: status.contractAddress,
      transactionId,
      blockHeight: tx.blockHeight === undefined ? null : String(tx.blockHeight),
      claimed: true,
    })}`,
  );
  // The Flask bridge waits for this process to exit. Wallet shutdown can keep
  // its WebSocket alive long after the transaction is confirmed, leaving the
  // browser stuck at the verification step. This runner is disposable local
  // demo infrastructure, so exit immediately after flushing the result.
  process.exit(0);
} finally {
  if (walletContext) {
    await api.closeWallet(walletContext);
  }
}
