/**
 * App.
 * @module app
 */

import express from 'express';
import helmet from 'helmet';
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
app.use(
  helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [], // Force HTTPS in production
      },
    },

    // HTTP Strict Transport Security
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },

    // X-Frame-Options
    frameguard: {
      action: 'deny',
    },

    // X-Content-Type-Options
    noSniff: true,

    // Referrer-Policy
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },

    // X-XSS-Protection (legacy, but still useful)
    xssFilter: true,
  }),
);
app.use(express.json({ limit: config.requestLimit?.api || '1mb' }));
app.use(removeZopeVhosting);
app.use(accessLogger);
app.use(i18n);
app.use(cors);

app.enable('trust proxy');
app.set('trust proxy', config.rateLimit.trustProxy || 0);

// Add routes
map(routes, (route) => {
  app[route.op](
    `${regExpEscape(config.prefix)}{*path}${route.view}`,
    route.middleware || ((req, res, next) => next()),
    async (req, res) => {
      // Start transaction
      const trx = await Model.startTransaction();
      req.apiPath = `${req.protocol}://${req.headers.host}`;
      if (req.headers.authorization) {
        const match = req.headers.authorization.match(/^Bearer (.*)$/);
        req.token = match ? match[1] : undefined;
      }
      req.documentPath = req.params.path?.join('/') || '/';

      try {
        if (req.body?.stream === true) {
          res.writeHead(200, {
            'Transfer-Encoding': 'chunked',
            'Access-Control-Allow-Origin': '*',
          });
          callHandler(req, trx, route, async (data) => {
            res.write(data);
            const result = JSON.parse(data);
            if (result.done) {
              res.end();

              // Try to commit the transaction
              try {
                await trx.commit();
              } catch (err) {
                throw new RequestException(500, {
                  message: req.i18n('Transaction error.'),
                });
              }
            }
          });
        } else {
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
          const message =
            process.env.NODE_ENV === 'production'
              ? { message: req.i18n('Internal server error') }
              : err.message;
          return res.status(err.status).send(message);
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
