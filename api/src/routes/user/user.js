/**
 * User routes.
 * @module routes/navigation/navigation
 */

import { UserRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@users/:id',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        try {
          const user = await UserRepository.findOne({ id: req.params.id });
          res.send({
            '@id': `${req.protocol || 'http'}://${req.headers.host}${
              req.params[0]
            }/@users/${req.params.id}`,
            id: user.get('id'),
            roles: [],
            username: user.get('username'),
            fullname: user.get('fullname'),
          });
        } catch (e) {
          res.status(404).send({ error: 'Not Found' });
        }
      }),
  },
  {
    op: 'get',
    view: '/@users',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const users = await UserRepository.findAll(
          req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
        );
        res.send(
          users.map((user) => ({
            '@id': `${req.protocol || 'http'}://${
              req.headers.host
            }/@users/${user.get('id')}`,
            '@type': 'role',
            id: user.get('id'),
            username: user.get('id'),
            fullname: user.get('fullname'),
            roles: [],
          })),
        );
      }),
  },
];
