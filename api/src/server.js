/**
 * Server.
 * @module server
 */

import fs from 'fs';

import app from './app';
import config from '../config';

if (!fs.existsSync(config.blobsDir)) {
  fs.mkdirSync(config.blobsDir);
}

app.listen(config.port, () =>
  console.log(`Server listening on port ${config.port}`),
);
