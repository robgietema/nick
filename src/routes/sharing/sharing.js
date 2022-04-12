/**
 * Sharing routes.
 * @module routes/sharing/sharing
 */

import { concat, fromPairs, includes, keys, map } from 'lodash';

import { Document, Group, Role, User } from '../../models';

/**
 * Fetch principals
 * @method fetchPrincipals
 * @param {Array} roles Role models.
 * @param {Object} document Document object.
 * @param {string} query Query string.
 * @param {Model} Model Model to query.
 * @param {string} title Field name of the title of the principal.
 * @param {string} type Type of the principal.
 * @param {Object} trx transaction object.
 * @returns {Array} Array of principals.
 */
async function fetchPrincipals(
  roles,
  document,
  query,
  Model,
  title,
  type,
  trx,
) {
  // Get principals
  const principals = query
    ? await Model.fetchAll(
        {
          [`LOWER(${title})`]: ['like', `%${query.toLowerCase()}%`],
        },
        { related: '_roles' },
        trx,
      )
    : [];

  // Return principal data
  return await Promise.all(
    principals.map(async (principal) => {
      // Get local roles
      const localRoles = await principal.fetchRolesByDocument(document.uuid);

      // Get acquired roles
      let acquiredRoles = [];
      let traverse = document;
      while (traverse.parent) {
        traverse = await Document.fetchById(traverse.parent, {}, trx);
        acquiredRoles = concat(
          acquiredRoles,
          await principal.fetchRolesByDocument(traverse.uuid),
        );
      }

      // Get global roles
      const globalRoles = principal._roles.map(
        (principalRoles) => principalRoles.id,
      );

      // Return principal
      return {
        id: principal.id,
        title: principal[title],
        roles: fromPairs(
          roles.map((role) => {
            if (includes(globalRoles, role.id)) {
              return [role.id, 'global'];
            } else if (includes(acquiredRoles, role.id)) {
              return [role.id, 'acquired'];
            } else {
              return [role.id, includes(localRoles, role.id)];
            }
          }),
        ),
        type,
      };
    }),
  );
}

export default [
  {
    op: 'get',
    view: '/@sharing',
    permission: 'Modify',
    handler: async (req, trx) => {
      // Get roles
      const roles = await Role.fetchAll({}, { order: 'order' }, trx);

      // Get user roles
      const users = await fetchPrincipals(
        roles,
        req.document,
        req.query.search,
        User,
        'fullname',
        'user',
      );

      // Get groups
      const groups = await fetchPrincipals(
        roles,
        req.document,
        req.query.search,
        Group,
        'title',
        'group',
      );

      // Return sharing data
      return {
        json: {
          available_roles: roles.map((role) => ({
            id: role.id,
            title: role.title,
          })),
          entries: concat(users, groups).sort((a, b) =>
            a.title > b.title ? 1 : -1,
          ),
          inherit: true,
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@sharing',
    permission: 'Modify',
    handler: async (req, trx) => {
      await Promise.all(
        map(req.body.entries, async (entry) => {
          const Model = entry.type === 'user' ? User : Group;
          const principal = await Model.fetchById(entry.id, {}, trx);
          await Promise.all(
            map(keys(entry.roles), async (role) => {
              // If should relate
              if (entry.roles[role] === true) {
                try {
                  await principal
                    .$relatedQuery('_documentRoles')
                    .relate({ id: role, document: req.document.uuid });
                } catch (err) {
                  // Already related
                }
              } else if (entry.roles[role] === false) {
                // Unrelate
                await principal
                  .$relatedQuery('_documentRoles')
                  .unrelate()
                  .where({ role, document: req.document.uuid });
              }
            }),
          );
        }),
      );
      return {
        status: 204,
      };
    },
  },
];
