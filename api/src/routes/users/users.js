/**
 * Users routes.
 * @module routes/users/users
 */

import bcrypt from 'bcrypt-promise';
import { includes } from 'lodash';

import { config } from '../../../config';
import { User } from '../../models';

export default [
  {
    op: 'get',
    view: '/@users/:id',
    permission: 'Manage Users',
    handler: async (req, res) => {
      const user = await User.fetchById(req.params.id, {
        related: '[_roles, _groups]',
      });
      if (user) {
        res.send(user.toJSON(req));
      } else {
        res.status(404).send({ error: req.i18n('Not Found') });
      }
    },
  },
  {
    op: 'get',
    view: '/@users',
    permission: 'Manage Users',
    handler: async (req, res) => {
      const groups = await User.fetchAll(
        req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
        { order: 'fullname', related: '[_roles, _groups]' },
      );
      res.send(groups.toJSON(req));
    },
  },
  {
    op: 'post',
    view: '/@users',
    permission: 'Manage Users',
    handler: async (req, res) => {
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create(
        {
          id: req.body.username,
          fullname: req.body.fullname,
          email: req.body.email,
          password,
          _roles: req.body.roles || [],
          _groups: req.body.groups || [],
        },
        { related: ['_roles', '_groups'] },
      );

      // Send created
      res.status(201).send(user.toJSON(req));
    },
  },
  {
    op: 'patch',
    view: '/@users/:id',
    permission: 'Manage Users',
    handler: async (req, res) => {
      await User.update(req.params.id, {
        id: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        _roles: req.body.roles,
        _groups: req.body.groups,
      });

      // Send ok
      res.status(204).send();
    },
  },
  {
    op: 'delete',
    view: '/@users/:id',
    permission: 'Manage Users',
    handler: async (req, res) => {
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
    },
  },
];
