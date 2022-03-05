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
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () =>
        UserRepository.findOne({ id: req.params.id })
          .then((user) =>
            res.send({
              '@id': `${req.protocol || 'http'}://${req.headers.host}${
                req.params[0]
              }/@users/${req.params.id}`,
              id: user.get('id'),
              roles,
              username: user.get('username'),
              fullname: user.get('fullname'),
            }),
          )
          .catch(UserRepository.Model.NotFoundError, () => {
            res.status(404).send({ error: 'Not Found' });
          }),
      ),
  },
  {
    op: 'get',
    view: '/@users',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () =>
        UserRepository.findAll(
          req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
        ).then((users) =>
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
          ),
        ),
      ),
  },
];
