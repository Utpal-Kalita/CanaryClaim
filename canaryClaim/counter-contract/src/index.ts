// The compiled contract lives under managed/counter/ so the existing repo
// plumbing (Git LFS in .gitattributes, frontend copy-contract-keys, and the
// public/midnight/counter asset path) keeps working. The logic inside is
// CanaryClaim, exported here as `Canary`.
export * as Canary from "./managed/counter/contract/index.js";
export * from "./witnesses.js";
