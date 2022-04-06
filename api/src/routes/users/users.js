/**
 * Users routes.
 * @module routes/users/users
 */

import bcrypt from 'bcrypt-promise';
import { includes } from 'lodash';

import { config } from '../../../config';
import { User } from '../../models';
import { RequestException } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@users/:id',
    permission: 'Manage Users',
    handler: async (req) => {
      const user = await User.fetchById(req.params.id, {
        related: '[_roles, _groups]',
      });
      if (!user) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: user.toJSON(req),
      };
    },
  },
  {
    op: 'get',
    view: '/@users',
    permission: 'Manage Users',
    handler: async (req) => {
      const groups = await User.fetchAll(
        req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
        { order: 'fullname', related: '[_roles, _groups]' },
      );
      return {
        json: groups.toJSON(req),
      };
    },
  },
  {
    op: 'post',
    view: '/@users',
    permission: 'Manage Users',
    handler: async (req) => {
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
      return {
        status: 201,
        json: user.toJSON(req),
      };
    },
  },
  {
    op: 'patch',
    view: '/@users/:id',
    permission: 'Manage Users',
    handler: async (req) => {
      await User.update(req.params.id, {
        id: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        _roles: req.body.roles,
        _groups: req.body.groups,
      });

      // Send ok
      return {
        status: 204,
      };
    },
  },
  {
    op: 'delete',
    view: '/@users/:id',
    permission: 'Manage Users',
    handler: async (req) => {
      if (includes(config.systemUsers, req.params.id)) {
        throw new RequestException(401, {
          error: {
            message: req.i18n("You can't delete system users."),
            type: req.i18n('System users'),
          },
        });
      }
      await User.deleteById(req.params.id);
      return {
        status: 204,
      };
    },
  },
];
