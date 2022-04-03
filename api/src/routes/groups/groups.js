/**
 * Groups routes.
 * @module routes/groups/groups
 */

import { includes } from 'lodash';
import { config } from '../../../config';
import { Group } from '../../models';

export default [
  {
    op: 'get',
    view: '/@groups/:id',
    permission: 'Manage User',
    handler: async (req, res) => {
      const group = await Group.fetchById(req.params.id, {
        related: '_roles',
      });
      if (group) {
        res.send(group.toJSON(req));
      } else {
        res.status(404).send({ error: req.i18n('Not Found') });
      }
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
      res.send(groups.toJSON(req));
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
      res.status(201).send(group.toJSON(req));
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
      res.status(204).send();
    },
  },
  {
    op: 'delete',
    view: '/@groups/:id',
    permission: 'Manage Users',
    handler: async (req, res) => {
      if (!includes(config.systemGroups, req.params.id)) {
        await Group.deleteById(req.params.id);
        res.status(204).send();
      } else {
        res.status(401).send({
          error: {
            message: req.i18n("You can't delete system groups."),
            type: req.i18n('System group'),
          },
        });
      }
    },
  },
];
