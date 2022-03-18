/**
 * App.
 * @module app
 */

import express from 'express';
import bodyParser from 'body-parser';
import { compact, drop, flatten, head, map, uniq } from 'lodash';
import jwt from 'jsonwebtoken';

import routes from './routes';
import {
  DocumentRepository,
  RedirectRepository,
  RolePermissionRepository,
  TypeRepository,
  UserRepository,
  UserRoleDocumentRepository,
  UserRoleRepository,
} from './repositories';
import { secret } from './config';

const app = express();

// Parse JSON
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

// Add JWT authentication
app.use(async (req, res, next) => {
  const token =
    req.headers.authorization &&
    req.headers.authorization.match(/^Bearer (.*)$/);
  const anonymous = await UserRepository.findOne({ id: 'anonymous' });

  if (token) {
    jwt.verify(token[1], secret, async (err, decoded) => {
      if (err || new Date().getTime() / 1000 > decoded.exp) {
        req.user = anonymous;
        next();
      } else {
        try {
          req.user = await UserRepository.findOne({ id: decoded.sub });
          next();
        } catch (e) {
          req.user = anonymous;
          next();
        }
      }
    });
  } else {
    req.user = anonymous;
    next();
  }
});

/**
 * Get roles.
 * @method getRoles
 * @param {Object} document Current document object.
 * @param {Object} user Current user object.
 * @returns {Array} An array of the permissions.
 */
async function getRoles(document, user) {
  const entries = await UserRoleDocumentRepository.findAll({
    document: document.get('uuid'),
    user: user.get('uuid'),
  });
  return entries.map((entry) => entry.get('role'));
}

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
  if (slugs.length === 0) {
    const extendedRoles = [
      ...roles,
      user.get('id') === 'anonymous' ? 'Anonymous' : 'Authenticated',
      ...(user.get('uuid') === document.get('owner') ? ['Owner'] : []),
    ];
    const entries = await RolePermissionRepository.findAll([
      'role',
      'in',
      extendedRoles,
    ]);
    return {
      document,
      permissions: entries.map((entry) => entry.get('permission')),
      roles: extendedRoles,
    };
  } else {
    const child = await DocumentRepository.findOne({
      parent: document.get('uuid'),
      id: head(slugs),
    });
    const childRoles = await getRoles(child, user);
    return traverse(child, drop(slugs), user, uniq([...roles, ...childRoles]));
  }
}

map(routes, (route) => {
  app[route.op](`*${route.view}`, async (req, res) => {
    const slugs = req.params[0].split('/');

    const globalRoleObjects = await UserRoleRepository.findAll({
      user: req.user.get('uuid'),
    });
    const globalRoles = globalRoleObjects.map((entry) => entry.get('role'));

    const root = await DocumentRepository.findOne({ parent: null });
    const rootRoles = await getRoles(root, req.user);

    try {
      const { document, permissions, roles } = await traverse(
        root,
        compact(slugs),
        req.user,
        uniq([...rootRoles, ...globalRoles]),
      );

      const type = await TypeRepository.findOne(
        { id: document.get('type') },
        { withRelated: ['workflow'] },
      );
      req.document = document;
      req.type = type;
      req.permissions = uniq([
        ...permissions,
        ...flatten(
          map(
            roles,
            (role) =>
              type.related('workflow').get('json').states[
                document.get('workflow_state')
              ].permissions[role] || [],
          ),
        ),
      ]);
      req.roles = roles;
      route.handler(req, res);
    } catch (e) {
      try {
        const redirect = await RedirectRepository.findOne({
          path: req.params[0],
        });
        res.redirect(301, redirect.get('redirect'));
      } catch (e) {
        res.status(404).send({ error: 'Not Found' });
      }
    }
  });
});

export default app;
