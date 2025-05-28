/**
 * Groups routes.
 * @module routes/groups/groups
 */

import { includes } from 'lodash';
import { Group } from '../../models';
import { RequestException } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);

export default [
  {
    op: 'get',
    view: '/@groups/:id',
    permission: 'Manage Users',
    client: 'getGroup',
    handler: async (req, trx) => {
      const group = await Group.fetchById(
        req.params.id,
        {
          related: '_roles',
        },
        trx,
      );
      if (!group) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: await group.toJSON(req),
      };
    },
  },
  {
    op: 'get',
    view: '/@groups',
    permission: 'Manage Users',
    client: 'getGroups',
    handler: async (req, trx) => {
      const groups = await Group.fetchAll(
        req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
        { order: 'title', related: '_roles' },
        trx,
      );
      return {
        json: await groups.toJSON(req),
      };
    },
  },
  {
    op: 'post',
    view: '/@groups',
    permission: 'Manage Users',
    client: 'createGroup',
    handler: async (req, trx) => {
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
        trx,
      );

      // Send created
      return {
        status: 201,
        json: await group.toJSON(req),
      };
    },
  },
  {
    op: 'patch',
    view: '/@groups/:id',
    permission: 'Manage Users',
    client: 'updateGroup',
    handler: async (req, trx) => {
      await Group.update(
        req.params.id,
        {
          id: req.body.groupname,
          title: req.body.title,
          description: req.body.description,
          email: req.body.email,
          _roles: req.body.roles,
          _users: req.body.users,
        },
        trx,
      );

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
    client: 'deleteGroup',
    handler: async (req, trx) => {
      if (includes(config.systemGroups, req.params.id)) {
        throw new RequestException(401, {
          error: {
            message: req.i18n("You can't delete system groups."),
            type: req.i18n('System group'),
          },
        });
      }
      await Group.deleteById(req.params.id, trx);
      return {
        status: 204,
      };
    },
  },
];
