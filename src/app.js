/**
 * App.
 * @module app
 */

import bodyParser from 'body-parser';
import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { isObject, map } from 'lodash';

import { RequestException, log, regExpEscape } from './helpers';
import { callHandler } from './helpers/handler/handler';
import { Model } from './models';
import routes from './routes';
import { accessLogger, cors, i18n, removeZopeVhosting } from './middleware';

const { config } = require(`${process.cwd()}/config`);

// Create blob dir if it doesn't exist
if (!existsSync(config.blobsDir)) {
  mkdirSync(config.blobsDir, { recursive: true });
}

// Create app
const app = express();

// Add middleware
app.use(bodyParser.json({ limit: config.clientMaxSize }));
app.use(removeZopeVhosting);
app.use(accessLogger);
app.use(i18n);
app.use(cors);

app.enable('trust proxy');

// Add routes
map(routes, (route) => {
  app[route.op](
    `${regExpEscape(config.prefix)}*${route.view}`,
    async (req, res) => {
      // Start transaction
      const trx = await Model.startTransaction();
      req.apiPath = `${req.protocol}://${req.headers.host}`;
      if (req.headers.authorization) {
        const match = req.headers.authorization.match(/^Bearer (.*)$/);
        req.token = match ? match[1] : undefined;
      }
      req.documentPath = req.params[0];

      try {
        const view = await callHandler(req, trx, route);

        // Try to commit the transaction
        try {
          await trx.commit();
        } catch (err) {
          throw new RequestException(500, {
            message: req.i18n('Transaction error.'),
          });
        }

        // Add headers if specified
        if (view && view.headers) {
          res.set(view.headers);
        }

        if (view && view.json) {
          // Send json data
          res.status(view.status || 200).send(view.json);
        } else if (view && view.status) {
          // Send just the status code with no data
          res.status(view.status).send();
        } else if (view && view.binary) {
          // Send binary data
          res.write(view.binary, 'binary');
          res.end(undefined, 'binary');
        } else if (view && view.html) {
          res.status(view.status || 200).send(view.html);
        }
      } catch (err) {
        // Rollback transaction
        await trx.rollback();

        // Check if request exception
        if (err instanceof RequestException) {
          // Log error
          log.error(
            `${err.status} ${
              isObject(err.message) ? JSON.stringify(err.message) : err.message
            }`,
          );

          // Return error message
          return res.status(err.status).send(err.message);
        } else {
          // Log error
          log.error(err);

          // Return internal server error
          return res
            .status(500)
            .send({ message: req.i18n('Internal server error') });
        }
      }
    },
  );
});

// Export app
export default app;
