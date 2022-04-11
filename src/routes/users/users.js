/**
 * Users routes.
 * @module routes/users/users
 */

import bcrypt from 'bcrypt-promise';
import { includes } from 'lodash';
import jwt from 'jsonwebtoken';

import { config } from '../../../config';
import { User } from '../../models';
import { RequestException, sendMail } from '../../helpers';

export default [
  {
    op: 'post',
    view: '/@users/:email/reset-password',
    handler: async (req, trx) => {
      // Find user
      let user = await User.fetchOne({ email: req.params.email }, {}, trx);
      if (!user) {
        user = await User.fetchOne({ id: req.params.email }, {}, trx);
      }

      // Check input
      if (req.body.reset_token && req.body.new_password && user) {
        // Decode jwt
        const decoded = jwt.verify(req.body.reset_token, config.secret);

        // User found
        if (user && decoded && user.id === decoded.sub) {
          const password = await bcrypt.hash(req.body.new_password, 10);
          await User.update(
            user.id,
            {
              password,
            },
            trx,
          );
        } else {
          throw new RequestException(401, {
            message: req.i18n("User doesn't exist or invalid credentials."),
          });
        }
      } else if (req.body.old_password && req.body.new_password && user) {
        const same = await bcrypt.compare(req.body.old_password, user.password);
        if (req.user.id === user.id && same) {
          const password = await bcrypt.hash(req.body.new_password, 10);
          await User.update(
            user.id,
            {
              password,
            },
            trx,
          );
        }
      } else if (user) {
        // Create token
        const token = jwt.sign(
          {
            sub: user.id,
            fullname: user.fullname,
          },
          config.secret,
        );

        // Send mail
        await sendMail({
          to: `${user.fullname} <${user.email}>`,
          from: `${config.emailFrom.name} <${config.emailFrom.address}>`,
          subject: req.i18n('Password reset request'),
          text: req.i18n(
            'The following link takes you to a page where you can reset your password: {url}\n\n(This link will expire in 7 days)',
            { url: `${config.frontendUrl}/password-reset/${token}` },
          ),
        });
      }

      // Return success
      return {
        status: 200,
      };
    },
  },
  {
    op: 'get',
    view: '/@users/:id',
    permission: 'Manage Users',
    handler: async (req, trx) => {
      const user = await User.fetchById(
        req.params.id,
        {
          related: '[_roles, _groups]',
        },
        trx,
      );
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
    handler: async (req, trx) => {
      const groups = await User.fetchAll(
        req.query.query ? { id: ['like', `%${req.query.query}%`] } : {},
        { order: 'fullname', related: '[_roles, _groups]' },
        trx,
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
    handler: async (req, trx) => {
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
        trx,
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
    handler: async (req, trx) => {
      await User.update(
        req.params.id,
        {
          id: req.body.username,
          fullname: req.body.fullname,
          email: req.body.email,
          _roles: req.body.roles,
          _groups: req.body.groups,
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
    view: '/@users/:id',
    permission: 'Manage Users',
    handler: async (req, trx) => {
      if (includes(config.systemUsers, req.params.id)) {
        throw new RequestException(401, {
          error: {
            message: req.i18n("You can't delete system users."),
            type: req.i18n('System users'),
          },
        });
      }
      await User.deleteById(req.params.id, trx);
      return {
        status: 204,
      };
    },
  },
];
