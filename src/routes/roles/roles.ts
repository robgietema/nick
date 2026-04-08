/**
 * Roles routes.
 * @module routes/roles/roles
 */

import models from '../../models';
import type { Knex } from 'knex';
import type { Request } from '../../types';

export default [
  {
    op: 'get',
    view: '/@roles',
    permission: 'View',
    client: 'getRoles',
    cache: 'static',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const Role = models.get('Role');
      const roles = await Role.fetchAll({}, { order: 'order' }, trx);
      return {
        json: await roles.toJson(req),
        xkeys: ['roles'],
      };
    },
  },
];
