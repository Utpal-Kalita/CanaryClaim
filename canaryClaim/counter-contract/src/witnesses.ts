import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "./managed/counter/contract/index.js";

// The leaked canary secret, held in local private state (never on-chain).
export type CanaryPrivateState = {
  readonly secret: Uint8Array;
};

export const createPrivateState = (secret: Uint8Array): CanaryPrivateState => ({
  secret,
});

// Pad a non-empty UTF-8 secret into Bytes<32>.
export const secretToBytes = (secret: string): Uint8Array => {
  const encoded = new TextEncoder().encode(secret);
  if (encoded.length === 0 || encoded.length > 32) {
    throw new Error('Canary secret must be between 1 and 32 UTF-8 bytes');
  }
  const b = new Uint8Array(32);
  b.set(encoded);
  return b;
};

export const witnesses = {
  secret: ({
    privateState,
  }: WitnessContext<Ledger, CanaryPrivateState>): [
    CanaryPrivateState,
    Uint8Array,
  ] => [privateState, privateState.secret],
};
