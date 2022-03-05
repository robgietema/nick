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
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () =>
        RoleRepository.findAll().then((roles) =>
          res.send(
            roles.map((role) => ({
              '@id': `${req.protocol || 'http'}://${
                req.headers.host
              }/@roles/${role.get('id')}`,
              '@type': 'role',
              id: role.get('id'),
              title: role.get('id'),
            })),
          ),
        ),
      ),
  },
];
