/**
 * Roles routes.
 * @module routes/roles/roles
 */

import { Role } from '../../models/role/role';
import type { Knex } from 'knex';
import type { Request } from '../../types';

export default [
  {
    op: 'get',
    view: '/@roles',
    permission: 'View',
    client: 'getRoles',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const roles = await Role.fetchAll({}, { order: 'order' }, trx);
      return {
        json: await roles.toJson(req),
      };
    },
  },
];
