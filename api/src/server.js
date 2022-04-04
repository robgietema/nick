/**
 * Server.
 * @module server
 */

import { log } from './helpers';
import { config } from '../config';
import app from './app';

// Start server
app.listen(config.port, () =>
  log.info(`Server listening on port ${config.port}`),
);
