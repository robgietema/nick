/**
 * App.
 * @module app
 */

import bodyParser from 'body-parser';
import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { compact, isObject, map, uniq } from 'lodash';

import {
  RequestException,
  getPath,
  getUserId,
  hasPermission,
  log,
  regExpEscape,
} from './helpers';
import { Document, Model, Redirect, Role, Type, User } from './models';
import routes from './routes';
import { accessLogger, cors, i18n } from './middleware';
import { applyBehaviors } from './behaviors';

const { config } = require(`${process.cwd()}/config`);

// Create blob dir if it doesn't exist
if (!existsSync(config.blobsDir)) {
  mkdirSync(config.blobsDir, { recursive: true });
}

// Create app
const app = express();

// Add middleware
app.use(bodyParser.json({ limit: config.clientMaxSize }));
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

      try {
        // Get user
        req.user = await User.fetchById(
          getUserId(req),
          {
            related: '[_roles, _groups._roles]',
          },
          trx,
        );

        // Traverse to document
        const root = await Document.fetchOne({ parent: null }, {}, trx);
        const result = await root.traverse(
          compact(getPath(req).split('/')), // Slugs
          req.user,
          await req.user.fetchUserGroupRolesByDocument(root.uuid), // Root roles
          trx,
        );

        // If result not found
        if (!result) {
          // Find redirect
          const redirect = await Redirect.fetchByPath(getPath(req), trx);

          // If no redirect found
          if (!redirect) {
            throw new RequestException(404, { error: req.i18n('Not found.') });
          }

          // Send redirect
          throw new RequestException(
            301,
            `${redirect._document.path}${route.view}`,
          );
        }

        // Get results
        const { document, localRoles } = result;
        const mergedRoles = uniq([...localRoles, ...req.user.getRoles()]);
        const permissions = await Role.fetchPermissions(mergedRoles, trx);

        // Find type
        const type = await Type.fetchById(document.type, {}, trx);

        // Check if type found
        if (!type) {
          throw new RequestException(500, {
            message: req.i18n('Type of the current document is not found.'),
          });
        }

        // Get workflow
        await type.fetchRelated('_workflow', trx);

        // Call handler
        req.document = applyBehaviors(document, type.schema.behaviors);
        req.type = type;
        req.permissions = uniq([
          ...permissions,
          ...type._workflow.getPermissions(
            document.workflow_state,
            mergedRoles,
          ),
        ]);

        // Check permission
        if (!hasPermission(req.permissions, route.permission)) {
          throw new RequestException(401, {
            message: req.i18n(
              'You are not authorization to access this resource.',
            ),
          });
        }

        // Call view
        const view = await route.handler(req, trx);

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
