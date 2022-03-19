/**
 * Groups routes.
 * @module routes/groups/groups
 */

import { map, keys } from 'lodash';
import { GroupRepository, GroupRoleRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

/**
 * Convert group to json.
 * @method groupToJson
 * @param {Object} group Group object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the user.
 */
function groupToJson(group, req) {
  return {
    '@id': `${req.protocol}://${req.headers.host}${
      req.params[0]
    }/@groups/${group.get('id')}`,
    id: group.get('id'),
    groupname: group.get('id'),
    title: group.get('title'),
    description: group.get('description'),
    email: group.get('email'),
    roles: group.related('roles').map((role) => role.get('id')),
  };
}

export default [
  {
    op: 'get',
    view: '/@groups/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        try {
          const group = await GroupRepository.findOne({ id: req.params.id });
          res.send(groupToJson(group, req));
        } catch (e) {
          res.status(404).send({ error: 'Not Found' });
        }
      }),
  },
  {
    op: 'get',
    view: '/@groups',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const users = await GroupRepository.findAll(
          req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
          'title',
          { withRelated: ['roles'] },
        );
        res.send(users.map((user) => groupToJson(user, req)));
      }),
  },
  {
    op: 'post',
    view: '/@groups',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const newGroup = await GroupRepository.create(
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
              await GroupRoleRepository.create({
                group: group.get('uuid'),
                role,
              }),
          ),
        );

        // Send created
        res.status(201).send(groupToJson(group, req));
      }),
  },
  {
    op: 'patch',
    view: '/@groups/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        // Get group
        const group = await GroupRepository.findOne({ id: req.params.id });

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
          await GroupRoleRepository.delete({
            group: group.get('uuid'),
          });

          // Add new roles
          await Promise.all(
            map(req.body.roles, async (role) => {
              await GroupRoleRepository.create({
                group: group.get('uuid'),
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
        await GroupRepository.delete({ id: req.params.id });
        res.status(204).send();
      }),
  },
];
