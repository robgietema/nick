/**
 * Groups routes.
 * @module routes/groups/groups
 */

import { includes } from 'lodash';
import { config } from '../../../config';
import { Group } from '../../models';
import { RequestException } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@groups/:id',
    permission: 'Manage User',
    handler: async (req, res) => {
      const group = await Group.fetchById(req.params.id, {
        related: '_roles',
      });
      if (!group) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: group.toJSON(req),
      };
    },
  },
  {
    op: 'get',
    view: '/@groups',
    permission: 'Manage Users',
    handler: async (req, res) => {
      const groups = await Group.fetchAll(
        req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
        { order: 'title', related: '_roles' },
      );
      return {
        json: groups.toJSON(req),
      };
    },
  },
  {
    op: 'post',
    view: '/@groups',
    permission: 'Manage Users',
    handler: async (req, res) => {
      const group = await Group.create(
        {
          id: req.body.groupname,
          title: req.body.title,
          description: req.body.description,
          email: req.body.email,
          _roles: req.body.roles,
          _users: req.body.users,
        },
        { related: 'roles' },
      );

      // Send created
      return {
        status: 201,
        json: group.toJSON(req),
      };
    },
  },
  {
    op: 'patch',
    view: '/@groups/:id',
    permission: 'Manage Users',
    handler: async (req, res) => {
      await Group.update(req.params.id, {
        id: req.body.groupname,
        title: req.body.title,
        description: req.body.description,
        email: req.body.email,
        _roles: req.body.roles,
        _users: req.body.users,
      });

      // Send ok
      return {
        status: 204,
      };
    },
  },
  {
    op: 'delete',
    view: '/@groups/:id',
    permission: 'Manage Users',
    handler: async (req, res) => {
      if (includes(config.systemGroups, req.params.id)) {
        throw new RequestException(401, {
          error: {
            message: req.i18n("You can't delete system groups."),
            type: req.i18n('System group'),
          },
        });
      }
      await Group.deleteById(req.params.id);
      return {
        status: 204,
      };
    },
  },
];
