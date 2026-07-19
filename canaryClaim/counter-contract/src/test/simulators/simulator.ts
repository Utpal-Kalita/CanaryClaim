import { createLogger } from "../../logger.js";
import { LogicTestingConfig } from "../../config.js";
import {
  Contract,
  type Ledger,
  ledger,
  pureCircuits,
} from "../../managed/counter/contract/index.js";
import {
  type CanaryPrivateState,
  createPrivateState,
  witnesses,
} from "../../witnesses.js";
import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  createConstructorContext,
  CostModel,
  CircuitResults,
  CoinPublicKey,
  emptyZswapLocalState,
  ContractAddress,
} from "@midnight-ntwrk/compact-runtime";

const config = new LogicTestingConfig();
export const logger = await createLogger(config.logDir);

const deployer = "0".repeat(64);

export class CanarySimulator {
  readonly contract: Contract<CanaryPrivateState>;
  circuitContext: CircuitContext<CanaryPrivateState>;
  contractAddress: ContractAddress;

  constructor(secret: Uint8Array) {
    this.contract = new Contract<CanaryPrivateState>(witnesses);
    this.contractAddress = sampleContractAddress();
    const commitment = pureCircuits.commitmentOf(secret);
    const { currentPrivateState, currentContractState, currentZswapLocalState } =
      this.contract.initialState(
        createConstructorContext(createPrivateState(secret), deployer),
        commitment,
      );
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      currentQueryContext: new QueryContext(
        currentContractState.data,
        this.contractAddress,
      ),
      costModel: CostModel.initialCostModel(),
    };
  }

  static deploy(secret: Uint8Array): CanarySimulator {
    return new CanarySimulator(secret);
  }

  getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  getPrivateState(): CanaryPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  claim(sender: CoinPublicKey, claimSecret: Uint8Array): Ledger {
    const results: CircuitResults<CanaryPrivateState, []> =
      this.contract.impureCircuits.claim({
        ...this.circuitContext,
        currentPrivateState: createPrivateState(claimSecret),
        currentZswapLocalState: emptyZswapLocalState(sender),
      });
    this.circuitContext = results.context;
    return this.getLedger();
  }
}
