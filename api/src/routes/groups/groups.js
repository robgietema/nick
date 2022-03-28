/**
 * Groups routes.
 * @module routes/groups/groups
 */

import { includes } from 'lodash';
import { requirePermission } from '../../helpers';
import { config } from '../../../config';
import { Group } from '../../models';

export default [
  {
    op: 'get',
    view: '/@groups/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const group = await Group.findById(req.params.id, { related: 'roles' });
        if (group) {
          res.send(group.toJSON(req));
        } else {
          res.status(404).send({ error: req.i18n('Not Found') });
        }
      }),
  },
  {
    op: 'get',
    view: '/@groups',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const groups = await Group.findAll(
          req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
          { order: 'group.title', related: 'roles' },
        );
        res.send(groups.toJSON(req));
      }),
  },
  {
    op: 'post',
    view: '/@groups',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const group = await Group.create(
          {
            id: req.body.groupname,
            title: req.body.title,
            description: req.body.description,
            email: req.body.email,
            roles: req.body.roles || [],
          },
          { related: 'roles' },
        );

        // Send created
        res.status(201).send(group.toJSON(req));
      }),
  },
  {
    op: 'patch',
    view: '/@groups/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        Group.update(req.params.id, {
          id: req.body.groupname,
          title: req.body.title,
          description: req.body.description,
          email: req.body.email,
          roles: req.body.roles,
        });

        // Send ok
        res.status(204).send();
      }),
  },
  {
    op: 'delete',
    view: '/@groups/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        if (!includes(config.systemGroups, req.params.id)) {
          await Group.delete({ id: req.params.id });
          res.status(204).send();
        } else {
          res.status(401).send({
            error: {
              message: req.i18n("You can't delete system groups."),
              type: req.i18n('System group'),
            },
          });
        }
      }),
  },
];
