/**
 * App.
 * @module app
 */

import express from 'express';
import bodyParser from 'body-parser';
import { compact, drop, flatten, head, map, uniq, zipObject } from 'lodash';
import jwt from 'jsonwebtoken';
import { createIntl, createIntlCache } from '@formatjs/intl';

import routes from './routes';
import {
  documentRepository,
  redirectRepository,
  rolePermissionRepository,
  userGroupRepository,
  userRepository,
  userRoleRepository,
} from './repositories';
import { config } from '../config';
import { GroupRoleDocument, Type, UserRoleDocument, Workflow } from './models';

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
  const anonymous = await userRepository.findOne({ id: 'anonymous' });

  // If system user anonymous not found
  if (!anonymous) {
    return res.status(500).send({ error: req.i18n('Internal server error') });
  }

  // Check if auth token
  if (!token) {
    req.user = anonymous;
    req.roles = ['Anonymous'];
    req.groups = await userGroupRepository.getGroups(anonymous);
    return next();
  }

  jwt.verify(token[1], config.secret, async (err, decoded) => {
    // If not valid token or expired
    if (err || new Date().getTime() / 1000 > decoded.exp) {
      req.user = anonymous;
      req.roles = ['Anonymous'];
      req.groups = await userGroupRepository.getGroups(anonymous);
      next();
    } else {
      // Find user object
      req.user = await userRepository.findOne({ id: decoded.sub });

      // Check if user exists
      if (req.user) {
        req.groups = await userGroupRepository.getGroups(req.user);
        req.roles = ['Authenticated'];
        next();
      } else {
        req.user = anonymous;
        req.roles = ['Anonymous'];
        req.groups = await userGroupRepository.getGroups(anonymous);
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
 * @param {Array} groups Array of groups.
 * @param {Array} roles Array of roles.
 * @returns {Promise<Object>} A Promise that resolves to an object.
 */
async function traverse(document, slugs, user, groups, roles) {
  // Check if at leaf node
  if (slugs.length === 0) {
    // Add owner to groups if current document owned by user
    const extendedGroups = [
      ...groups,
      ...(user.get('id') === document.get('owner') ? ['Owner'] : []),
    ];

    // Get all roles from groups
    const groupRoles = []; // await groupRoleRepository.getRoles(extendedGroups);

    // Combine all roles
    const extendedRoles = uniq([...roles, ...groupRoles]);

    // Get all permissions from roles
    const permissions = await rolePermissionRepository.getPermissions(
      extendedRoles,
    );

    // Return document and authorization data
    return {
      document,
      permissions: permissions,
      groups: extendedGroups,
      roles: extendedRoles,
    };
  } else {
    // Fetch child matching the id
    const child = await documentRepository.findOne({
      parent: document.get('uuid'),
      id: head(slugs),
    });

    // Check if child not found
    if (!child) {
      return false;
    }

    // Get roles based on user and group from child
    const childUserRoles = await UserRoleDocument.getRoles(
      child.get('uuid'),
      user.get('id'),
    );
    const childGroupRoles = await GroupRoleDocument.getRoles(
      child.get('uuid'),
      groups,
    );

    // Recursively call the traverse on child
    return traverse(
      child,
      drop(slugs),
      user,
      groups,
      uniq([...roles, ...childUserRoles, ...childGroupRoles]),
    );
  }
}

map(routes, (route) => {
  app[route.op](`*${route.view}`, async (req, res) => {
    const slugs = req.params[0].split('/');

    // Get global roles based on user and groups
    const globalUserRoles = await userRoleRepository.getRoles(req.user);
    const globalGroupRoles = []; // await groupRoleRepository.getRoles(req.groups);

    // Check if root exists
    const root = await documentRepository.findOne({ parent: null });
    if (!root) {
      return res.status(500).send({ error: req.i18n('Internal server error') });
    }

    // Get roles based on root location
    const rootUserRoles = await UserRoleDocument.getRoles(
      root.get('uuid'),
      req.user.get('id'),
    );
    const rootGroupRoles = await GroupRoleDocument.getRoles(
      root.get('uuid'),
      req.groups,
    );

    // Traverse to document
    const result = await traverse(
      root,
      compact(slugs),
      req.user,
      req.groups,
      uniq([
        ...rootUserRoles,
        ...rootGroupRoles,
        ...globalUserRoles,
        ...globalGroupRoles,
        ...req.roles,
      ]),
    );

    // If result not found
    if (!result) {
      // Find redirect
      const redirect = await redirectRepository.findOne({
        path: req.params[0],
      });

      // If no redirect found
      if (!redirect) {
        return res.status(404).send({ error: req.i18n('Not Found') });
      }

      // Get document
      const redirectDocument = documentRepository.findOne({
        uuid: redirect.get('document'),
      });

      // Send redirect
      res.redirect(301, `${redirectDocument.get('path')}${route.view}`);
    }

    // Get results
    const { document, permissions, groups, roles } = result;

    // Find type
    const type = await Type.findById(document.get('type'));

    // Check if type found
    if (!type) {
      return res.status(500).send({ error: req.i18n('Internal server error') });
    }

    const workflow = await Workflow.findById(type.workflow);

    // Call handler
    req.document = document;
    req.type = type;
    req.permissions = uniq([
      ...permissions,
      ...flatten(
        map(
          roles,
          (role) =>
            workflow.json.states[document.get('workflow_state')].permissions[
              role
            ] || [],
        ),
      ),
    ]);
    req.groups = groups;
    req.roles = roles;
    route.handler(req, res);
  });
});

export default app;
