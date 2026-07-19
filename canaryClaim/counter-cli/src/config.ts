import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const contractConfig = {
  privateStateStoreName: 'counter-private-state',
  zkConfigPath: path.resolve(currentDir, '..', '..', 'counter-contract', 'src', 'managed', 'counter'),
};

export interface Config {
  readonly logDir: string;
  readonly indexer: string;
  readonly indexerWS: string;
  readonly node: string;
  readonly proofServer: string;
}

export class UndeployedConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'tui-standalone', `${new Date().toISOString().replace(/:/g, '-')}.log`);
  indexer = 'http://127.0.0.1:8089/api/v3/graphql';
  indexerWS = 'ws://127.0.0.1:8089/api/v3/graphql/ws';
  node = 'http://127.0.0.1:9944';
  proofServer = 'http://127.0.0.1:6301';
  constructor() {
    setNetworkId('undeployed');
  }
}

export class PreviewConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'tui-preview', `${new Date().toISOString().replace(/:/g, '-')}.log`);
  indexer = 'https://indexer.preview.midnight.network/api/v3/graphql';
  indexerWS = 'wss://indexer.preview.midnight.network/api/v3/graphql/ws';
  node = 'https://rpc.preview.midnight.network';
  proofServer = 'http://127.0.0.1:6300';
  constructor() {
    setNetworkId('preview');
  }
}

export class PreprodConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'tui-preprod', `${new Date().toISOString().replace(/:/g, '-')}.log`);
  indexer = 'https://indexer.preprod.midnight.network/api/v3/graphql';
  indexerWS = 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws';
  node = 'https://rpc.preprod.midnight.network';
  proofServer = 'http://127.0.0.1:6300';
  constructor() {
    setNetworkId('preprod');
  }
}
