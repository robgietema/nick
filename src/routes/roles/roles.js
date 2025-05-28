/**
 * Roles routes.
 * @module routes/roles/roles
 */

import { Role } from '../../models';

export default [
  {
    op: 'get',
    view: '/@roles',
    permission: 'View',
    client: 'getRoles',
    handler: async (req, trx) => {
      const roles = await Role.fetchAll({}, { order: 'order' }, trx);
      return {
        json: await roles.toJSON(req),
      };
    },
  },
];
