/**
 * App.
 * @module app
 */

import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import { compact, map, uniq } from 'lodash';

import { config } from '../config';
import { getUserId, hasPermission } from './helpers';
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
        return res.status(404).send({ error: req.i18n('Not Found') });
      }

      // Send redirect
      return res.redirect(301, `${redirect._document.path}${route.view}`);
    }

    // Get results
    const { document, permissions, roles } = result;

    // Find type
    const type = await Type.fetchById(document.type);

    // Check if type found
    if (!type) {
      return res.status(500).send({ error: req.i18n('Internal server error') });
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
      return res.status(401).send({
        error: {
          message: 'You are not authorization to access this resource.',
          type: 'Unauthorized',
        },
      });
    }

    // Call view
    route.handler(req, res);
  });
});

// Export app
export default app;
