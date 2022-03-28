/**
 * Groups routes.
 * @module routes/groups/groups
 */

import { map } from 'lodash';
import { requirePermission } from '../../helpers';
import { config } from '../../../config';
import { Group, GroupRole } from '../../models';

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
        const newGroup = await Group.create(
          {
            id: req.body.groupname,
            title: req.body.title,
            description: req.body.description,
            email: req.body.email,
          },
          { method: 'insert' },
        );
        const group = await newGroup.fetch();

        // Create roles
        const roles = req.body.roles || [];
        await Promise.all(
          roles.map(
            async (role) =>
              await GroupRole.create({
                group: group.get('id'),
                role,
              }),
          ),
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
        // Get group
        const group = await Group.findOne({ id: req.params.id });

        // Save document with new values
        await group.save(
          {
            id: req.body.id || group.get('id'),
            title: req.body.title || group.get('title'),
            description: req.body.description || group.get('description'),
            email: req.body.email || group.get('email'),
          },
          { patch: true },
        );

        // Loop through roles
        if (req.body.roles) {
          // Delete current roles
          await GroupRole.delete({
            group: group.get('id'),
          });

          // Add new roles
          await Promise.all(
            map(req.body.roles, async (role) => {
              await GroupRole.create({
                group: group.get('id'),
                role,
              });
            }),
          );
        }

        // Send ok
        res.status(204).send();
      }),
  },
  {
    op: 'delete',
    view: '/@groups/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        if (config.systemGroups.indexOf(req.params.id) === -1) {
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
