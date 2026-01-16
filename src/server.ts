/**
 * Server.
 * @module server
 */

const { config: configSettings } = await import(`${process.cwd()}/config`);
import config from './helpers/config/config';
config.settings = configSettings;

import { log } from './helpers/log/log';
import app from './app';

// Start server
app.listen(config.settings.port, () =>
  log.info(`Server listening on port ${configSettings.port}`),
);
