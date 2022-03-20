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
  GroupRepository,
  GroupRoleDocumentRepository,
  GroupRoleRepository,
  RedirectRepository,
  RolePermissionRepository,
  TypeRepository,
  UserGroupRepository,
  UserRepository,
  UserRoleDocumentRepository,
  UserRoleRepository,
} from './repositories';
import { secret } from './config';

const app = express();

// Parse JSON
app.use(bodyParser.json({ limit: '64mb' }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

// Add JWT authentication
app.use(async (req, res, next) => {
  // Get token
  const token =
    req.headers.authorization &&
    req.headers.authorization.match(/^Bearer (.*)$/);

  // Get anonymous user object
  const anonymous = await UserRepository.findOne({ id: 'anonymous' });

  // Check if auth token
  if (token) {
    jwt.verify(token[1], secret, async (err, decoded) => {
      // If not valid token or expired
      if (err || new Date().getTime() / 1000 > decoded.exp) {
        req.user = anonymous;
        req.groups = await UserGroupRepository.getGroups(anonymous);
        next();
      } else {
        try {
          // Find user object
          req.user = await UserRepository.findOne({ id: decoded.sub });

          // Get authenticated group
          const authenticated = await GroupRepository.findOne({
            id: 'authenticated',
          });

          // Get global groups of user
          const globalGroups = await UserGroupRepository.getGroups(req.user);

          // Combine groups
          req.groups = [...globalGroups, authenticated.get('uuid')];
          next();
        } catch (e) {
          req.user = anonymous;
          req.groups = await UserGroupRepository.getGroups(anonymous);
          next();
        }
      }
    });
  } else {
    req.user = anonymous;
    req.groups = await UserGroupRepository.getGroups(anonymous);
    next();
  }
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
    // Get owner group
    const owner = await GroupRepository.findOne({ id: 'owner' });

    // Add owner to groups if current document owned by user
    const extendedGroups = [
      ...groups,
      ...(user.get('uuid') === document.get('owner')
        ? [owner.get('uuid')]
        : []),
    ];

    // Get all roles from groups
    const groupRoles = await GroupRoleRepository.getRoles(extendedGroups);

    // Combine all roles
    const extendedRoles = uniq([
      ...roles,
      ...groupRoles,
      ...(user.get('uuid') === document.get('owner') ? ['Owner'] : []),
    ]);

    // Get all permissions from roles
    const permissions = await RolePermissionRepository.getPermissions(
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
    const child = await DocumentRepository.findOne({
      parent: document.get('uuid'),
      id: head(slugs),
    });

    // Get roles based on user and group from child
    const childUserRoles = await UserRoleDocumentRepository.getRoles(
      child,
      user,
    );
    const childGroupRoles = await GroupRoleDocumentRepository.getRoles(
      child,
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
    const globalUserRoles = await UserRoleRepository.getRoles(req.user);
    const globalGroupRoles = await GroupRoleRepository.getRoles(req.groups);

    // Get roles based on root location
    const root = await DocumentRepository.findOne({ parent: null });
    const rootUserRoles = await UserRoleDocumentRepository.getRoles(
      root,
      req.user,
    );
    const rootGroupRoles = await GroupRoleDocumentRepository.getRoles(
      root,
      req.groups,
    );

    try {
      const { document, permissions, groups, roles } = await traverse(
        root,
        compact(slugs),
        req.user,
        req.groups,
        uniq([
          ...rootUserRoles,
          ...rootGroupRoles,
          ...globalUserRoles,
          ...globalGroupRoles,
        ]),
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
      req.groups = groups;
      req.roles = roles;
      route.handler(req, res);
    } catch (e) {
      try {
        const redirect = await RedirectRepository.findOne({
          path: req.params[0],
        });
        res.redirect(301, `${redirect.get('redirect')}${route.view}`);
      } catch (e) {
        res.status(404).send({ error: 'Not Found' });
      }
    }
  });
});

export default app;
