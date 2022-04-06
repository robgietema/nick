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
    handler: async (req, trx) => {
      const roles = await Role.fetchAll({}, { order: 'order' }, trx);
      return {
        json: roles.toJSON(req),
      };
    },
  },
];
