/**
 * Sharing routes.
 * @module routes/sharing/sharing
 */

import { Role } from '../../models';

export default [
  {
    op: 'get',
    view: '/@sharing',
    permission: 'View',
    handler: async (req) => {
      const roles = await Role.fetchAll({}, 'order');
      return {
        json: {
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
        },
      };
    },
  },
];
