// Cross-platform copy of the compiled Compact proving keys + zkir into public/.
// Replaces the Unix-only `mkdir -p && cp` shell script so the build works on
// Windows, macOS, and Linux alike.
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, '../counter-contract/src/managed/counter');

const targets = [
  { from: resolve(src, 'keys'), to: resolve(root, 'public/midnight/counter/keys') },
  { from: resolve(src, 'zkir'), to: resolve(root, 'public/midnight/counter/zkir') },
];

for (const { from, to } of targets) {
  if (!existsSync(from)) {
    console.warn(`[copy-contract-keys] source missing, skipping: ${from}`);
    continue;
  }
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`[copy-contract-keys] ${from} -> ${to}`);
}
