/**
 * Sharing routes.
 * @module routes/sharing/sharing
 */

import { Document } from '../../models/document/document';
import { Group } from '../../models/group/group';
import { Role } from '../../models/role/role';
import { User } from '../../models/user/user';
import { log } from '../../helpers/log/log';
import { apiLimiter } from '../../helpers/limiter/limiter';
import type { Request } from '../../types';
import type { Knex } from 'knex';

/**
 * Fetch principals
 * @method fetchPrincipals
 * @param {string[]} roles Role models.
 * @param {Object} document Document object.
 * @param {string} query Query string.
 * @param {Model} Model Model to query.
 * @param {string} title Field name of the title of the principal.
 * @param {string} type Type of the principal.
 * @param {Object} trx transaction object.
 * @returns {Array} Array of principals.
 */
async function fetchPrincipals(
  roles: string[],
  document: any,
  query: string,
  Model: any,
  title: string,
  type: string,
  trx: Knex.Transaction,
) {
  // Get principals
  const principals =
    query && query.length >= 2
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
    principals.map(async (principal: any) => {
      // Get local roles
      const localRoles = await principal.fetchRolesByDocument(document.uuid);

      // Get acquired roles
      let acquiredRoles = [] as string[];
      let traverse = document;
      while (traverse.parent && traverse.inherit_roles) {
        traverse = await Document.fetchById(traverse.parent, {}, trx);
        acquiredRoles = [
          ...acquiredRoles,
          ...(await principal.fetchRolesByDocument(traverse.uuid)),
        ];
      }

      // Get global roles
      const globalRoles = principal._roles.map(
        (principalRoles: any) => principalRoles.id,
      );

      // Return principal
      return {
        id: principal.id,
        title: principal[title],
        roles: Object.fromEntries(
          roles.map((role: any) => {
            if (globalRoles.includes(role.id)) {
              return [role.id, 'global'];
            } else if (acquiredRoles.includes(role.id)) {
              return [role.id, 'acquired'];
            } else {
              return [role.id, localRoles.includes(role.id)];
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
    client: 'getSharing',
    middleware: apiLimiter,
    handler: async (req: Request, trx: Knex.Transaction) => {
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
        trx,
      );

      // Get groups
      const groups = await fetchPrincipals(
        roles,
        req.document,
        req.query.search,
        Group,
        'title',
        'group',
        trx,
      );

      // Return sharing data
      return {
        json: {
          available_roles: roles.map((role: any) => ({
            id: role.id,
            title: role.title,
          })),
          entries: [...users, ...groups].sort((a, b) =>
            a.title > b.title ? 1 : -1,
          ),
          inherit: req.document.inherit_roles,
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@sharing',
    permission: 'Modify',
    client: 'updateSharing',
    handler: async (req: Request, trx: Knex.Transaction) => {
      // Update inherit
      if (req.document.inherit_roles !== req.body.inherit) {
        await req.document.update(
          {
            inherit_roles: req.body.inherit,
          },
          trx,
        );
      }

      // Update local roles
      await Promise.all(
        req.body.entries.map(async (entry: any) => {
          const Model = entry.type === 'user' ? User : Group;
          const principal = await Model.fetchById(entry.id, {}, trx);
          await Promise.all(
            Object.keys(entry.roles).map(async (role) => {
              // If should relate
              if (entry.roles[role] === true) {
                try {
                  await principal
                    .$relatedQuery('_documentRoles', trx)
                    .relate({ id: role, document: req.document.uuid });
                } catch (err) {
                  // Already related
                  log.warn(
                    `Role ${role} already related to ${req.document.path}`,
                  );
                }
              } else if (entry.roles[role] === false) {
                // Unrelate
                await principal
                  .$relatedQuery('_documentRoles', trx)
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
