/**
 * Principals routes.
 * @module routes/principals/principals
 */

import { User } from '../../models/user/user';
import { Group } from '../../models/group/group';
import { RequestException } from '../../helpers/error/error';
import { apiLimiter } from '../../helpers/limiter/limiter';
import type { Knex } from 'knex';
import type { Request } from '../../types';

export default [
  {
    op: 'get',
    view: '/@principals',
    permission: 'Manage Users',
    client: 'getPrincipals',
    middleware: apiLimiter,
    handler: async (req: Request, trx: Knex.Transaction) => {
      if (!req.query.search || req.query.search.length < 2) {
        throw new RequestException(400, {
          error: req.i18n('Query must be at least 2 characters long.'),
        });
      }
      const users = await User.fetchAll(
        { id: ['like', `%${req.query.search}%`] },
        { order: 'fullname', related: '[_roles, _groups]' },
        trx,
      );
      const groups = await Group.fetchAll(
        { id: ['like', `%${req.query.search}%`] },
        { order: 'title', related: '_roles' },
        trx,
      );
      return {
        json: {
          users: await users.toJson(req),
          groups: await groups.toJson(req),
        },
      };
    },
  },
];
