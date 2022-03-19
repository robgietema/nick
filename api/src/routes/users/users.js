/**
 * Users routes.
 * @module routes/users/users
 */

import bcrypt from 'bcrypt-promise';
import { map, keys } from 'lodash';
import {
  UserRepository,
  UserRoleRepository,
  UserGroupRepository,
  GroupRepository,
} from '../../repositories';
import { requirePermission } from '../../helpers';

/**
 * Convert user to json.
 * @method userToJson
 * @param {Object} user User object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the user.
 */
function userToJson(user, req) {
  return {
    '@id': `${req.protocol}://${req.headers.host}${
      req.params[0]
    }/@users/${user.get('id')}`,
    id: user.get('id'),
    username: user.get('username'),
    fullname: user.get('fullname'),
    roles: user.related('roles').map((role) => role.get('id')),
  };
}

export default [
  {
    op: 'get',
    view: '/@users/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        try {
          const user = await UserRepository.findOne({ id: req.params.id });
          res.send(userToJson(user, req));
        } catch (e) {
          res.status(404).send({ error: 'Not Found' });
        }
      }),
  },
  {
    op: 'get',
    view: '/@users',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const users = await UserRepository.findAll(
          req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
          'fullname',
          { withRelated: ['roles'] },
        );
        res.send(users.map((user) => userToJson(user, req)));
      }),
  },
  {
    op: 'post',
    view: '/@users',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const password = await bcrypt.hash(req.body.password, 10);
        const newUser = await UserRepository.create(
          {
            id: req.body.username,
            fullname: req.body.fullname,
            email: req.body.email,
            password,
          },
          { method: 'insert' },
        );
        const user = await newUser.fetch();

        // Create roles
        const roles = req.body.roles || [];
        await Promise.all(
          roles.map(
            async (role) =>
              await UserRoleRepository.create({
                user: user.get('uuid'),
                role,
              }),
          ),
        );

        // Create groups
        const groups = req.body.groups || [];
        await Promise.all(
          groups.map(async (group) => {
            const groupObject = await GroupRepository.findOne({ id: group });
            await UserGroupRepository.create({
              user: user.get('uuid'),
              group: groupObject.get('uuid'),
            });
          }),
        );

        // Send created
        res.status(201).send(userToJson(user, req));
      }),
  },
  {
    op: 'patch',
    view: '/@users/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        // Get user
        const user = await UserRepository.findOne({ id: req.params.id });

        // Save document with new values
        await user.save(
          {
            id: req.body.id || user.get('id'),
            fullname: req.body.fullname || user.get('fullname'),
            email: req.body.email || user.get('email'),
          },
          { patch: true },
        );

        // Loop through roles
        const roles = req.body.roles || {};
        await Promise.all(
          map(keys(roles), async (role) => {
            // Check if to be removed
            if (roles[role] === false) {
              // Delete role from user
              await UserRoleRepository.delete({ user: user.get('uuid'), role });
            } else {
              // Add role to user if not exists
              const exists = await UserRoleRepository.findAll({
                user: user.get('uuid'),
                role,
              });
              if (exists.isEmpty()) {
                await UserRoleRepository.create({
                  user: user.get('uuid'),
                  role,
                });
              }
            }
          }),
        );

        // Send ok
        res.status(204).send();
      }),
  },
  {
    op: 'delete',
    view: '/@users/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        try {
          await UserRepository.delete({ id: req.params.id });
        } catch (e) {
          return res.status(500).send({
            error: {
              message:
                'Unable to remove user, most likely this user is still owner of documents.',
              type: 'Delete User',
            },
          });
        }

        res.status(204).send();
      }),
  },
];
