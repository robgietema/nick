/**
 * App.
 * @module app
 */

import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import { compact, isObject, map, uniq } from 'lodash';

import { config } from '../config';
import { RequestException, getUserId, hasPermission, log } from './helpers';
import { Document, Redirect, Type, User } from './models';
import routes from './routes';
import { accessLogger, cors, i18n } from './middleware';

// Create blob dir if it doesn't exist
if (!fs.existsSync(config.blobsDir)) {
  fs.mkdirSync(config.blobsDir);
}

// Create app
const app = express();

// Add middleware
app.use(bodyParser.json({ limit: config.clientMaxSize }));
app.use(accessLogger);
app.use(i18n);
app.use(cors);

// Add routes
map(routes, (route) => {
  app[route.op](`*${route.view}`, async (req, res) => {
    try {
      // Get user
      req.user = await User.fetchById(getUserId(req), {
        related: '[_roles, _groups._roles]',
      });

      // Traverse to document
      const root = await Document.fetchOne({ parent: null });
      const result = await root.traverse(
        compact(req.params[0].split('/')), // Slugs
        req.user,
        uniq([
          ...(await req.user.findRolesByDocument(root.uuid)), // Root roles
          ...req.user.getRoles(), // Global roles
        ]),
      );

      // If result not found
      if (!result) {
        // Find redirect
        const redirect = await Redirect.fetchByPath(req.params[0]);

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
      const { document, permissions, roles } = result;

      // Find type
      const type = await Type.fetchById(document.type);

      // Check if type found
      if (!type) {
        throw new RequestException(500, {
          message: req.i18n('Type of the current document is not found.'),
        });
      }

      // Get workflow
      await type.fetchRelated('_workflow');

      // Call handler
      req.document = document;
      req.type = type;
      req.permissions = uniq([
        ...permissions,
        ...type._workflow.getPermissions(document.workflow_state, roles),
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
      const view = await route.handler(req, res);

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
  });
});

// Export app
export default app;
