/**
 * Sharing routes.
 * @module routes/sharing/sharing
 */

import { Role } from '../../models';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@sharing',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const roles = await Role.findAll({}, 'order');
        res.send({
          available_roles: roles.map((role) => ({
            id: role.id,
            title: role.title,
          })),
          entries: [
            {
              id: 'Administrators',
              login: null,
              roles: {
                Contributer: false,
                Editor: false,
                Reader: false,
                Reviewer: false,
                Administrator: false,
              },
              title: 'Administrators',
              type: 'group',
            },
          ],
          inherit: true,
        });
      }),
  },
];
