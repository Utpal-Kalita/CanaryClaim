import { Canary, type CanaryPrivateState } from '@eddalabs/counter-contract';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ImpureCircuitId } from '@midnight-ntwrk/compact-js';

export type CanaryCircuits = ImpureCircuitId<Canary.Contract<CanaryPrivateState>>;

export const CanaryPrivateStateId = 'canaryPrivateState';

export type CanaryProviders = MidnightProviders<CanaryCircuits, typeof CanaryPrivateStateId, CanaryPrivateState>;

export type CanaryContract = Canary.Contract<CanaryPrivateState>;

export type DeployedCanaryContract = DeployedContract<CanaryContract> | FoundContract<CanaryContract>;

export type DerivedState = {
  readonly claimed: Canary.Ledger["claimed"];
  readonly winner: Canary.Ledger["winner"];
  readonly canaryCommitment: Canary.Ledger["canaryCommitment"];
};

export const emptyState: DerivedState = {
  claimed: false,
  winner: new Uint8Array(32),
  canaryCommitment: new Uint8Array(32),
};
