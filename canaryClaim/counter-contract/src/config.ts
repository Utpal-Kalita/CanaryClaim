import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const currentDir = path.dirname(fileURLToPath(import.meta.url));

export interface Config {
  readonly logDir: string;  
}

export class LogicTestingConfig implements Config {
  logDir = path.resolve(currentDir, '..', 'logs', 'logic-testing', `${new Date().toISOString().replace(/:/g, '-')}.log`);  
  constructor() {}
}


