import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, '..');
const tsc = path.resolve(projectDir, '..', 'node_modules', 'typescript', 'bin', 'tsc');

rmSync(path.resolve(projectDir, 'dist'), { recursive: true, force: true });

const result = spawnSync(process.execPath, [tsc, '--project', 'tsconfig.build.json'], {
  cwd: projectDir,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
