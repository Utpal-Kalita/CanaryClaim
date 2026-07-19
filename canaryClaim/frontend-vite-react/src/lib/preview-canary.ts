import { Canary, createPrivateState, secretToBytes, witnesses } from '@eddalabs/counter-contract';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';

const privateStateId = 'canaryPrivateState';

const compiledCanary = CompiledContract.make('counter', Canary.Contract).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets(`${window.location.origin}/midnight/counter`),
);

/** Deploy a new Preview campaign. The secret remains private state in this browser. */
export async function deployPreviewCampaign(providers: any, secretText: string): Promise<string> {
  const secret = secretToBytes(secretText);
  const commitment = Canary.pureCircuits.commitmentOf(secret);
  const deployed = await deployContract(providers, {
    compiledContract: compiledCanary,
    privateStateId,
    initialPrivateState: createPrivateState(secret),
    args: [commitment],
  } as any);
  return deployed.deployTxData.public.contractAddress;
}

/** Join a campaign with a locally held witness, then submit the real claim circuit. */
export async function claimPreviewCampaign(
  providers: any,
  contractAddress: string,
  secretText: string,
): Promise<{ transactionId: string; blockHeight: string | null }> {
  const secret = secretToBytes(secretText);
  const deployed = await findDeployedContract(providers, {
    contractAddress,
    compiledContract: compiledCanary,
    privateStateId,
    initialPrivateState: createPrivateState(secret),
  } as any);
  const finalized = await deployed.callTx.claim();
  const tx = finalized.public as { txHash?: unknown; txId?: unknown; blockHeight?: unknown };
  return {
    transactionId: String(tx.txId ?? tx.txHash ?? 'submitted'),
    blockHeight: tx.blockHeight === undefined ? null : String(tx.blockHeight),
  };
}
