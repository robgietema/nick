/**
 * Users routes.
 * @module routes/users/users
 */

import bcrypt from 'bcrypt-promise';
import { map, keys } from 'lodash';
import {
  userRepository,
  userRoleRepository,
  userGroupRepository,
} from '../../repositories';
import { config } from '../../../config';
import { requirePermission } from '../../helpers';

/**
 * Convert user to json.
 * @method userToJson
 * @param {Object} user User object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the user.
 */
async function userToJson(user, req) {
  const roles = await userRoleRepository.findAll({ user: user.get('id') });
  return {
    '@id': `${req.protocol}://${req.headers.host}${
      req.params[0]
    }/@users/${user.get('id')}`,
    id: user.get('id'),
    username: user.get('username'),
    fullname: user.get('fullname'),
    roles: roles.map((role) => role.get('role')),
  };
}

export default [
  {
    op: 'get',
    view: '/@users/:id',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const user = await userRepository.findOne({ id: req.params.id });
        if (!user) {
          return res.status(404).send({ error: 'Not Found' });
        }
        res.send(await userToJson(user, req));
      }),
  },
  {
    op: 'get',
    view: '/@users',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const users = await userRepository.findAll(
          req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
          'fullname',
        );
        res.send(
          await Promise.all(
            users.map(async (user) => await userToJson(user, req)),
          ),
        );
      }),
  },
  {
    op: 'post',
    view: '/@users',
    handler: (req, res) =>
      requirePermission('Manage Users', req, res, async () => {
        const password = await bcrypt.hash(req.body.password, 10);
        const newUser = await userRepository.create(
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
              await userRoleRepository.create({
                user: user.get('id'),
                role,
              }),
          ),
        );

        // Create groups
        const groups = req.body.groups || [];
        await Promise.all(
          groups.map(async (group) => {
            await userGroupRepository.create({
              user: user.get('id'),
              group,
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
        const user = await userRepository.findOne({ id: req.params.id });

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
              await userRoleRepository.delete({ user: user.get('id'), role });
            } else {
              // Add role to user if not exists
              const exists = await userRoleRepository.findAll({
                user: user.get('id'),
                role,
              });
              if (exists.isEmpty()) {
                await userRoleRepository.create({
                  user: user.get('id'),
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
        if (config.systemUsers.indexOf(req.params.id) === -1) {
          try {
            await userRepository.delete({ id: req.params.id });
          } catch (e) {
            return res.status(500).send({
              error: {
                message: req.i18n(
                  'Unable to remove user, most likely this user is still owner of documents.',
                ),
                type: req.i18n('Delete User'),
              },
            });
          }
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
