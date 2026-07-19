import 'dotenv/config';
import { createLogger } from './logger.js';
import { run } from './cli.js';
import { UndeployedConfig } from './config.js';

const config = new UndeployedConfig();
const logger = await createLogger(config.logDir);
await run(config, logger);
