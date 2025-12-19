/**
 * Server.
 * @module server
 */

import { log } from './helpers/log/log';
import app from './app';

import config from './helpers/config/config';

// Start server
app.listen(config.settings.port, () =>
  log.info(`Server listening on port ${config.settings.port}`),
);
