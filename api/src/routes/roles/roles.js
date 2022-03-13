/**
 * Roles routes.
 * @module routes/roles/roles
 */

import { RoleRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@roles',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const roles = await RoleRepository.findAll();
        res.send(
          roles.map((role) => ({
            '@id': `${req.protocol}://${req.headers.host}/@roles/${role.get(
              'id',
            )}`,
            '@type': 'role',
            id: role.get('id'),
            title: role.get('id'),
          })),
        );
      }),
  },
];
