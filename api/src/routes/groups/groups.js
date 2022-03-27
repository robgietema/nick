/**
 * Groups routes.
 * @module routes/groups/groups
 */

import { map } from 'lodash';
import { groupRepository, groupRoleRepository } from '../../repositories';
import { requirePermission } from '../../helpers';
import { config } from '../../../config';

/**
 * Convert group to json.
 * @method groupToJson
 * @param {Object} group Group object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the user.
 */
async function groupToJson(group, req) {
  const roles = await groupRoleRepository.findAll({ group: group.get('id') });
  return {
    '@id': `${req.protocol}://${req.headers.host}${
      req.params[0]
    }/@groups/${group.get('id')}`,
    id: group.get('id'),
    groupname: group.get('id'),
    title: req.i18n(group.get('title')),
    description: req.i18n(group.get('description')),
    email: group.get('email'),
    roles: roles.map((role) => role.get('role')),
  };
}

export default [
  {
    op: 'get',
    view: '/@groups/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const group = await groupRepository.findOne({ id: req.params.id });
        if (group) {
          res.send(await groupToJson(group, req));
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
        const users = await groupRepository.findAll(
          req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
          'title',
        );
        res.send(
          await Promise.all(
            await users.map(async (user) => await groupToJson(user, req)),
          ),
        );
      }),
  },
  {
    op: 'post',
    view: '/@groups',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const newGroup = await groupRepository.create(
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
              await groupRoleRepository.create({
                group: group.get('id'),
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
        const group = await groupRepository.findOne({ id: req.params.id });

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
          await groupRoleRepository.delete({
            group: group.get('id'),
          });

          // Add new roles
          await Promise.all(
            map(req.body.roles, async (role) => {
              await groupRoleRepository.create({
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
          await groupRepository.delete({ id: req.params.id });
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
