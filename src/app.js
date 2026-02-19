/**
 * App.
 * @module app
 */

import express from 'express';
import helmet from 'helmet';
import { existsSync, mkdirSync } from 'fs';
import { isObject } from 'es-toolkit/compat';
import cron from 'node-cron';

import { RequestException } from './helpers/error/error';
import { log } from './helpers/log/log';
import { regExpEscape } from './helpers/utils/utils';
import { callHandler } from './helpers/handler/handler';
import { Model } from './models/_model/_model';
import globalRoutes from './routes';
import globalTasks from './tasks';

import { accessLogger } from './middleware/access-logger/access-logger';
import { cors } from './middleware/cors/cors';
import { i18n } from './middleware/i18n/i18n';
import { removeZopeVhosting } from './middleware/volto/volto';

import config from './helpers/config/config';
import form from './routes/form/form';

const localRoutes = config.settings.routes
  ? (await import(`${process.cwd()}/src/routes`)).default
  : [];

const localTasks = config.settings.tasks
  ? (await import(`${process.cwd()}/src/tasks`)).default
  : [];

const routes = [...localRoutes, ...globalRoutes];
const tasks = [...localTasks, ...globalTasks];

// Run scheduled tasks
tasks.forEach((task) => {
  cron.schedule(task.schedule, async () => {
    log.info(`Running scheduled task: ${task.name}`);
    task.handler();
  });
});

// Create blob dir if it doesn't exist
if (!existsSync(config.settings.blobsDir)) {
  mkdirSync(config.settings.blobsDir, { recursive: true });
}

// Check required environment variables
if (process.env.NODE_ENV === 'production') {
  const required = ['SECRET', 'DB_PASSWORD'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n`,
    );
  }

  // Check secret
  if (config.settings.secret === 'secret') {
    throw new Error(
      `Secret can not have the default value in production mode.`,
    );
  }

  // Check cors settings
  if (
    config.settings.cors.allowCredentials === true &&
    config.settings.cors.allowOrigin === '*'
  ) {
    throw new Error(
      'CORS allowOrigin can not be * when allowCredentials is true in production mode.',
    );
  }
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
        formAction: ["'self'"],
        baseUri: ["'self'"],
        frameAncestors: ["'self'"],
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
app.use(express.json({ limit: config.settings.requestLimit?.api || '1mb' }));
app.use(removeZopeVhosting);
app.use(accessLogger);
app.use(i18n);
app.use(cors);

app.set('trust proxy', config.settings.rateLimit.trustProxy || 1);

// Add routes
routes.map((route) => {
  app[route.op](
    `${regExpEscape(config.settings.prefix)}{*path}${route.view}`,
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
            'Access-Control-Allow-Origin': config.settings.cors.allowOrigin,
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
