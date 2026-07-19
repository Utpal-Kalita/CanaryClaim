import { describe, it, expect } from "vitest";
import { CanarySimulator } from "./simulators/simulator.js";
import { secretToBytes } from "../witnesses.js";
import * as utils from "./utils/utils";

const SECRET = "ACME-RESTRICTED-7749";
const researcher = utils.toHexPadded("researcher");

describe("CanaryClaim", () => {
  it("rejects an empty or oversized secret instead of truncating it", () => {
    expect(() => secretToBytes("")).toThrow();
    expect(() => secretToBytes("x".repeat(33))).toThrow();
  });

  it("starts unclaimed", () => {
    const sim = CanarySimulator.deploy(secretToBytes(SECRET));
    const l = sim.getLedger();
    expect(l.claimed).toBe(false);
    expect(l.canaryCommitment.length).toBe(32);
  });

  it("records the claimer who knows the secret", () => {
    const sim = CanarySimulator.deploy(secretToBytes(SECRET));
    const before = sim.getLedger().winner;
    const l = sim.claim(researcher, secretToBytes(SECRET));
    expect(l.claimed).toBe(true);
    expect(l.winner).not.toEqual(before);
    expect(l.winner.some((b) => b !== 0)).toBe(true);
  });

  it("rejects a wrong secret", () => {
    const sim = CanarySimulator.deploy(secretToBytes(SECRET));
    expect(() => sim.claim(researcher, secretToBytes("WRONG-GUESS"))).toThrow();
    expect(sim.getLedger().claimed).toBe(false);
  });

  it("rejects a second claim", () => {
    const sim = CanarySimulator.deploy(secretToBytes(SECRET));
    sim.claim(researcher, secretToBytes(SECRET));
    expect(() => sim.claim(researcher, secretToBytes(SECRET))).toThrow();
  });
});
