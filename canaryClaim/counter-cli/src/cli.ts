import { type WalletContext } from './api.js';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface, type Interface } from 'node:readline/promises';
import { type Logger } from 'pino';
import { type StartedDockerComposeEnvironment, type DockerComposeEnvironment } from 'testcontainers';
import { type CanaryProviders, type DeployedCanaryContract } from './common-types.js';
import { type Config, UndeployedConfig } from './config.js';
import * as api from './api.js';
import { Canary, secretToBytes } from '@eddalabs/counter-contract';

let logger: Logger;

/**
 * This seed gives access to tokens minted in the genesis block of a local development node.
 * Only used in standalone networks to build a wallet with initial funds.
 */
const GENESIS_MINT_WALLET_SEED = '0000000000000000000000000000000000000000000000000000000000000001';

// ─── Display Helpers ────────────────────────────────────────────────────────

const BANNER = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              CanaryClaim                                     ║
║              ─────────────────────                           ║
║              A privacy-preserving smart contract demo        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`;

const DIVIDER = '──────────────────────────────────────────────────────────────';

// ─── Menu Helpers ──────────────────────────────────────────────────────────

const WALLET_MENU = `
${DIVIDER}
  Wallet Setup
${DIVIDER}
  [1] Create a new wallet
  [2] Restore wallet from seed
  [3] Restore wallet from mnemonic
  [4] Use mnemonic from .env file
  [5] Exit
${'─'.repeat(62)}
> `;

/** Build the contract actions menu, showing current DUST balance in the header. */
const contractMenu = (dustBalance: string) => `
${DIVIDER}
  Contract Actions${dustBalance ? `                    DUST: ${dustBalance}` : ''}
${DIVIDER}
  [1] Deploy a new canary contract
  [2] Join an existing canary contract
  [3] Monitor DUST balance
  [4] Exit
${'─'.repeat(62)}
> `;

/** Build the canary actions menu, showing current DUST balance in the header. */
const canaryMenu = (dustBalance: string) => `
${DIVIDER}
  Canary Actions${dustBalance ? `                      DUST: ${dustBalance}` : ''}
${DIVIDER}
  [1] Claim (prove you know the secret)
  [2] Display claim status
  [3] Exit
${'─'.repeat(62)}
> `;

// ─── Wallet Setup ───────────────────────────────────────────────────────────

/** Prompt the user for a seed phrase and restore a wallet from it. */
const buildWalletFromSeed = async (config: Config, rli: Interface): Promise<WalletContext> => {
  const seed = await rli.question('Enter your wallet seed: ');
  return await api.buildWalletAndWaitForFunds(config, seed);
};

/** Prompt the user for a mnemonic phrase and restore a wallet from it. */
const buildWalletFromMnemonic = async (config: Config, rli: Interface): Promise<WalletContext> => {
  const mnemonic = await rli.question('Enter your mnemonic phrase: ');
  const seed = await api.mnemonicToSeed(mnemonic);
  return await api.buildWalletAndWaitForFunds(config, seed);
};

/**
 * Wallet creation flow.
 * - Standalone configs skip the menu and use the genesis seed automatically.
 * - All other configs present a menu to create or restore a wallet.
 */
const buildWallet = async (config: Config, rli: Interface): Promise<WalletContext | null> => {
  // Standalone mode: use the pre-funded genesis wallet
  if (config instanceof UndeployedConfig) {
    return await api.buildWalletAndWaitForFunds(config, GENESIS_MINT_WALLET_SEED);
  }

  const envMnemonic = process.env.MY_PREVIEW_MNEMONIC;

  while (true) {
    const choice = await rli.question(WALLET_MENU);
    switch (choice.trim()) {
      case '1':
        return await api.buildFreshWallet(config);
      case '2':
        return await buildWalletFromSeed(config, rli);
      case '3':
        return await buildWalletFromMnemonic(config, rli);
      case '4':
        if (envMnemonic) {
          logger.info('Using mnemonic from .env file...');
          const seed = await api.mnemonicToSeed(envMnemonic);
          return await api.buildWalletAndWaitForFunds(config, seed);
        } else {
          logger.error('MY_PREVIEW_MNEMONIC not found in environment. Set it in your .env file.');
        }
        break;
      case '5':
        return null;
      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};

// ─── Contract Interaction ───────────────────────────────────────────────────

/** Format dust balance for menu headers. */
const getDustLabel = async (wallet: api.WalletContext['wallet']): Promise<string> => {
  try {
    const dust = await api.getDustBalance(wallet);
    return dust.available.toLocaleString();
  } catch {
    return '';
  }
};

/** Prompt for a contract address and secret, then join an existing canary contract. */
const joinContract = async (providers: CanaryProviders, rli: Interface): Promise<DeployedCanaryContract> => {
  const contractAddress = await rli.question('Enter the contract address (hex): ');
  const secret = await rli.question('Enter the leaked canary secret: ');
  return await api.joinContract(providers, contractAddress, secretToBytes(secret));
};

/**
 * Start the DUST monitor. Shows a live-updating balance display
 * that runs until the user presses Enter.
 */
const startDustMonitor = async (wallet: api.WalletContext['wallet'], rli: Interface): Promise<void> => {
  console.log('');
  // Use readline question to wait for Enter — the monitor will render above this line
  const stopPromise = rli.question('  Press Enter to return to menu...\n').then(() => {});
  await api.monitorDustBalance(wallet, stopPromise);
  console.log('');
};

/**
 * Deploy or join flow. Returns the contract handle, or null if the user exits.
 * Errors during deploy/join are caught and displayed — the user stays in the menu.
 */
const deployOrJoin = async (
  providers: CanaryProviders,
  walletCtx: api.WalletContext,
  rli: Interface,
): Promise<DeployedCanaryContract | null> => {
  while (true) {
    const dustLabel = await getDustLabel(walletCtx.wallet);
    const choice = await rli.question(contractMenu(dustLabel));
    switch (choice.trim()) {
      case '1':
        try {
          const secretInput = await rli.question('Enter the canary secret to commit to: ');
          const secret = secretToBytes(secretInput);
          const commitment = Canary.pureCircuits.commitmentOf(secret);
          const contract = await api.withStatus('Deploying canary contract', () =>
            api.deploy(providers, commitment, secret),
          );
          console.log(`  Contract deployed at: ${contract.deployTxData.public.contractAddress}\n`);
          return contract;
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.log(`\n  ✗ Deploy failed: ${msg}`);
          // Log the full cause chain to help debug WASM/ledger errors
          if (e instanceof Error && e.cause) {
            let cause: unknown = e.cause;
            let depth = 0;
            while (cause && depth < 5) {
              const causeMsg =
                cause instanceof Error
                  ? `${cause.message}\n      ${cause.stack?.split('\n').slice(1, 3).join('\n      ') ?? ''}`
                  : String(cause);
              console.log(`    cause: ${causeMsg}`);
              cause = cause instanceof Error ? cause.cause : undefined;
              depth++;
            }
          }
          if (msg.toLowerCase().includes('dust') || msg.toLowerCase().includes('no dust')) {
            console.log('    Insufficient DUST for transaction fees. Use option [3] to monitor your balance.');
          }
          console.log('');
        }
        break;
      case '2':
        try {
          return await joinContract(providers, rli);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.log(`  ✗ Failed to join contract: ${msg}\n`);
        }
        break;
      case '3':
        await startDustMonitor(walletCtx.wallet, rli);
        break;
      case '4':
        return null;
      default:
        console.log(`  Invalid choice: ${choice}`);
    }
  }
};

/**
 * Main interaction loop. Once a contract is deployed/joined, the user
 * can claim the canary or query its public status.
 */
const mainLoop = async (providers: CanaryProviders, walletCtx: api.WalletContext, rli: Interface): Promise<void> => {
  const canaryContract = await deployOrJoin(providers, walletCtx, rli);
  if (canaryContract === null) {
    return;
  }

  while (true) {
    const dustLabel = await getDustLabel(walletCtx.wallet);
    const choice = await rli.question(canaryMenu(dustLabel));
    switch (choice.trim()) {
      case '1':
        try {
          await api.withStatus('Claiming', () => api.claim(canaryContract));
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.log(`  ✗ Claim failed: ${msg}\n`);
        }
        break;
      case '2':
        await api.displayCanaryStatus(providers, canaryContract);
        break;
      case '3':
        return;
      default:
        console.log(`  Invalid choice: ${choice}`);
    }
  }
};

// ─── Docker Port Mapping ────────────────────────────────────────────────────

/** Map a container's first exposed port into the config URL. */
const mapContainerPort = (env: StartedDockerComposeEnvironment, url: string, containerName: string) => {
  const mappedUrl = new URL(url);
  const container = env.getContainer(containerName);
  mappedUrl.port = String(container.getFirstMappedPort());
  return mappedUrl.toString().replace(/\/+$/, '');
};

// ─── Entry Point ────────────────────────────────────────────────────────────

/**
 * Main entry point for the CLI.
 *
 * Flow:
 *   1. (Optional) Start Docker containers for proof server / node / indexer
 *   2. Build or restore a wallet and wait for it to be funded
 *   3. Configure midnight-js providers (proof server, indexer, wallet, private state)
 *   4. Enter the contract deploy/join and counter interaction loop
 *   5. Clean up: close wallet, readline, and docker environment
 */
export const run = async (config: Config, _logger: Logger, dockerEnv?: DockerComposeEnvironment): Promise<void> => {
  logger = _logger;
  api.setLogger(_logger);

  // Print the title banner
  console.log(BANNER);

  const rli = createInterface({ input, output, terminal: true });
  let env: StartedDockerComposeEnvironment | undefined;

  try {
    // Step 1: Start Docker environment if provided (e.g. local proof server)
    if (dockerEnv !== undefined) {
      env = await dockerEnv.up();

      // In standalone mode, remap ports to the dynamically assigned container ports
      if (config instanceof UndeployedConfig) {
        config.indexer = mapContainerPort(env, config.indexer, 'counter-indexer');
        config.indexerWS = mapContainerPort(env, config.indexerWS, 'counter-indexer');
        config.node = mapContainerPort(env, config.node, 'counter-node');
        config.proofServer = mapContainerPort(env, config.proofServer, 'counter-proof-server');
      }
    }

    // Step 2: Build wallet (create new or restore from seed)
    const walletCtx = await buildWallet(config, rli);
    if (walletCtx === null) {
      return;
    }

    try {
      // Step 3: Configure midnight-js providers
      const providers = await api.withStatus('Configuring providers', () => api.configureProviders(walletCtx, config));
      console.log('');

      // Step 4: Enter the contract interaction loop
      await mainLoop(providers, walletCtx, rli);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Error: ${e.message}`);
        logger.debug(`${e.stack}`);
      } else {
        throw e;
      }
    } finally {
      // Step 5a: Stop the wallet
      try {
        await walletCtx.wallet.stop();
      } catch (e) {
        logger.error(`Error stopping wallet: ${e}`);
      }
    }
  } finally {
    // Step 5b: Close readline and Docker environment
    rli.close();
    rli.removeAllListeners();

    if (env !== undefined) {
      try {
        await env.down();
      } catch (e) {
        logger.error(`Error shutting down docker environment: ${e}`);
      }
    }

    logger.info('Goodbye.');
  }
};
