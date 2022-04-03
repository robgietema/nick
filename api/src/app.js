/**
 * App.
 * @module app
 */

import { createIntl, createIntlCache } from '@formatjs/intl';
import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import { compact, drop, flatten, head, map, uniq, zipObject } from 'lodash';

import { config } from '../config';
import { requirePermission } from './helpers';
import { Document, Role, Redirect, Type, User, Workflow } from './models';
import routes from './routes';

const app = express();

// Create i18n cache
const intlCache = zipObject(
  config.supportedLanguages,
  map(config.supportedLanguages, () => createIntlCache()),
);

// Load i18n files
const intl = zipObject(
  config.supportedLanguages,
  map(config.supportedLanguages, (language) =>
    createIntl(
      {
        locale: language,
        messages: require(`../locales/${language}.json`),
      },
      intlCache[language],
    ),
  ),
);

// Parse JSON
app.use(bodyParser.json({ limit: '64mb' }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

// i18n
app.use((req, res, next) => {
  req.i18n = (id, ...rest) => {
    if (!id) {
      return id;
    }
    return intl[
      req.acceptsLanguages(...config.supportedLanguages) ||
        config.defaultLanguage
    ].formatMessage({ id, defaultMessage: id }, ...rest);
  };
  next();
});

// Add JWT authentication
app.use(async (req, res, next) => {
  // Get token
  const token =
    req.headers.authorization &&
    req.headers.authorization.match(/^Bearer (.*)$/);

  // Get anonymous user object
  const anonymous = await User.fetchById('anonymous', {
    related: '[_roles, _groups._roles]',
  });

  // If system user anonymous not found
  if (!anonymous) {
    return res.status(500).send({ error: req.i18n('Internal server error') });
  }

  // Check if auth token
  if (!token) {
    req.user = anonymous;
    return next();
  }

  jwt.verify(token[1], config.secret, async (err, decoded) => {
    // If not valid token or expired
    if (err || new Date().getTime() / 1000 > decoded.exp) {
      req.user = anonymous;
      next();
    } else {
      // Find user object
      req.user = await User.fetchById(decoded.sub, {
        related: '[_roles, _groups._roles]',
      });

      // Check if user exists
      if (req.user) {
        next();
      } else {
        req.user = anonymous;
        next();
      }
    }
  });
});

/**
 * Traverse path.
 * @method traverse
 * @param {Object} document Current document object.
 * @param {Array} slugs Array of slugs.
 * @param {Object} user Current user object.
 * @param {Array} roles Array of roles.
 * @returns {Promise<Object>} A Promise that resolves to an object.
 */
async function traverse(document, slugs, user, roles) {
  // Check if at leaf node
  if (slugs.length === 0) {
    // Add owner to roles if current document owned by user
    const extendedRoles = uniq([
      ...roles,
      ...(user.id === document.owner ? ['Owner'] : []),
    ]);

    // Get all permissions from roles
    const permissions = await Role.findPermissions(extendedRoles);

    // Return document and authorization data
    return {
      document,
      roles: extendedRoles,
      permissions,
    };
  } else {
    // Fetch child matching the id
    const child = await Document.fetchOne({
      parent: document.uuid,
      id: head(slugs),
    });

    // Check if child not found
    if (!child) {
      return false;
    }

    // Get roles based on user and group from child
    const childRoles = await user.findRolesByDocument(child.uuid);

    // Recursively call the traverse on child
    return traverse(child, drop(slugs), user, uniq([...roles, ...childRoles]));
  }
}

// Add routes
map(routes, (route) => {
  app[route.op](`*${route.view}`, async (req, res) => {
    const slugs = req.params[0].split('/');

    // Get global roles based on user and groups
    const globalRoles = req.user.getRoles();

    // Check if root exists
    const root = await Document.fetchOne({ parent: null });
    if (!root) {
      return res.status(500).send({ error: req.i18n('Internal server error') });
    }

    // Get roles based on root location
    const rootRoles = await req.user.findRolesByDocument(root.uuid);

    // Traverse to document
    const result = await traverse(
      root,
      compact(slugs),
      req.user,
      uniq([...rootRoles, ...globalRoles]),
    );

    // If result not found
    if (!result) {
      // Find redirect
      const redirect = await Redirect.fetchOne(
        {
          path: req.params[0],
        },
        { related: '_document' },
      );

      // If no redirect found
      if (!redirect) {
        return res.status(404).send({ error: req.i18n('Not Found') });
      }

      // Send redirect
      res.redirect(301, `${redirect._document.path}${route.view}`);
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
    const workflow = await Workflow.fetchById(type.workflow);

    // Call handler
    req.document = document;
    req.type = type;
    req.permissions = uniq([
      ...permissions,
      ...flatten(
        map(
          roles,
          (role) =>
            workflow.json.states[document.workflow_state].permissions[role] ||
            [],
        ),
      ),
    ]);

    // Check permission
    requirePermission(route.permission, req, res, () =>
      // Call view
      route.handler(req, res),
    );
  });
});

export default app;
