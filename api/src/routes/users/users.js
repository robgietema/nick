/**
 * Users routes.
 * @module routes/users/users
 */

import bcrypt from 'bcrypt-promise';
import { includes } from 'lodash';
import { requirePermission } from '../../helpers';
import { config } from '../../../config';
import { User } from '../../models';

export default [
  {
    op: 'get',
    view: '/@users/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const user = await User.findById(req.params.id, {
          related: ['roles', 'groups'],
        });
        if (user) {
          res.send(user.toJSON(req));
        } else {
          res.status(404).send({ error: req.i18n('Not Found') });
        }
      }),
  },
  {
    op: 'get',
    view: '/@users',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const groups = await User.findAll(
          req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
          { order: 'fullname', related: ['roles', 'groups'] },
        );
        res.send(groups.toJSON(req));
      }),
  },
  {
    op: 'post',
    view: '/@users',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await User.create(
          {
            id: req.body.username,
            fullname: req.body.fullname,
            email: req.body.email,
            password,
            roles: req.body.roles || [],
            groups: req.body.groups || [],
          },
          { related: ['roles', 'groups'] },
        );

        // Send created
        res.status(201).send(user.toJSON(req));
      }),
  },
  {
    op: 'patch',
    view: '/@users/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        User.update(req.params.id, {
          id: req.body.username,
          fullname: req.body.fullname,
          email: req.body.email,
          roles: req.body.roles,
          groups: req.body.groups,
        });

        // Send ok
        res.status(204).send();
      }),
  },
  {
    op: 'delete',
    view: '/@users/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        if (!includes(config.systemUsers, req.params.id)) {
          await User.deleteById(req.params.id);
          res.status(204).send();
        } else {
          res.status(401).send({
            error: {
              message: req.i18n("You can't delete system users."),
              type: req.i18n('System users'),
            },
          });
        }
      }),
  },
];
