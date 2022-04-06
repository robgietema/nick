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
    handler: async (req) => {
      const roles = await Role.fetchAll({}, 'order');
      return {
        json: roles.toJSON(req),
      };
    },
  },
];
