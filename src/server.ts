/**
 * Server.
 * @module server
 */

import config from './helpers/config/config';
import { log } from './helpers/log/log';
import app from './app';

// Start server
app.listen(config.settings.port, () =>
  log.info(`Server listening on port ${config.settings.port}`),
);
