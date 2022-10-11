/**
 * Server.
 * @module server
 */

import { log } from './helpers';
import app from './app';

const { config } = require(`${process.cwd()}/config`);

// Start server
app.listen(config.port, () =>
  log.info(`Server listening on port ${config.port}`),
);
