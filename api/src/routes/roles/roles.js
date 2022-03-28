/**
 * Roles routes.
 * @module routes/roles/roles
 */

import { Role } from '../../models';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@roles',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const roles = await Role.findAll({}, 'order');
        res.send(roles.toJSON(req));
      }),
  },
];
