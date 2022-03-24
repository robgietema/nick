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
  groupRoleDocumentRepository,
  groupRoleRepository,
  redirectRepository,
  rolePermissionRepository,
  typeRepository,
  userGroupRepository,
  userRepository,
  userRoleDocumentRepository,
  userRoleRepository,
} from './repositories';
import { config } from '../config';

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
  req.i18n = (id, ...rest) =>
    intl.nl.formatMessage({ id, defaultMessage: id }, ...rest);
  /*
    intl[
      req.acceptsLanguages(...config.supportedLanguages) ||
        config.defaultLanguage
    ].formatMessage({ id, defaultMessage: id}, ...rest);
  */
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

  // Check if auth token
  if (token) {
    jwt.verify(token[1], config.secret, async (err, decoded) => {
      // If not valid token or expired
      if (err || new Date().getTime() / 1000 > decoded.exp) {
        req.user = anonymous;
        req.groups = await userGroupRepository.getGroups(anonymous);
        next();
      } else {
        try {
          // Find user object
          req.user = await userRepository.findOne({ id: decoded.sub });

          // Get global groups of user
          const globalGroups = await userGroupRepository.getGroups(req.user);

          // Combine groups
          req.groups = [...globalGroups, 'Authenticated'];
          next();
        } catch (e) {
          req.user = anonymous;
          req.groups = await userGroupRepository.getGroups(anonymous);
          next();
        }
      }
    });
  } else {
    req.user = anonymous;
    req.groups = await userGroupRepository.getGroups(anonymous);
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
    // Add owner to groups if current document owned by user
    const extendedGroups = [
      ...groups,
      ...(user.get('id') === document.get('owner') ? ['Owner'] : []),
    ];

    // Get all roles from groups
    const groupRoles = await groupRoleRepository.getRoles(extendedGroups);

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

    // Get roles based on user and group from child
    const childUserRoles = await userRoleDocumentRepository.getRoles(
      child,
      user,
    );
    const childGroupRoles = await groupRoleDocumentRepository.getRoles(
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
    const globalUserRoles = await userRoleRepository.getRoles(req.user);
    const globalGroupRoles = await groupRoleRepository.getRoles(req.groups);

    // Get roles based on root location
    const root = await documentRepository.findOne({ parent: null });
    const rootUserRoles = await userRoleDocumentRepository.getRoles(
      root,
      req.user,
    );
    const rootGroupRoles = await groupRoleDocumentRepository.getRoles(
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

      const type = await typeRepository.findOne(
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
        const redirect = await redirectRepository.findOne(
          {
            path: req.params[0],
          },
          { withRelated: ['document'] },
        );
        res.redirect(
          301,
          `${redirect.related('document').get('path')}${route.view}`,
        );
      } catch (e) {
        res.status(404).send({ error: 'Not Found' });
      }
    }
  });
});

export default app;
