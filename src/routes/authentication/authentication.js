/**
 * Authentication routes.
 * @module routes/authentication/authentication
 */

import bcrypt from 'bcrypt-promise';
import jwt from 'jsonwebtoken';

import { User } from '../../models';
import { config } from '../../../config';
import { RequestException } from '../../helpers';

export default [
  {
    op: 'post',
    view: '/@login',
    handler: async (req, trx) => {
      if (!req.body.login || !req.body.password) {
        throw new RequestException(400, {
          error: {
            type: req.i18n('Missing credentials'),
            message: req.i18n('Login and password must be provided in body.'),
          },
        });
      }

      // Find user
      const user = await User.fetchById(req.body.login, {}, trx);

      // If user not found
      if (!user) {
        throw new RequestException(401, {
          error: {
            type: req.i18n('Invalid credentials'),
            message: req.i18n('Wrong login and/or password.'),
          },
        });
      }

      // Check password
      const same = await bcrypt.compare(req.body.password, user.password);
      if (!same) {
        throw new RequestException(401, {
          error: {
            type: req.i18n('Invalid credentials'),
            message: req.i18n('Wrong login and/or password.'),
          },
        });
      }

      // Return ok
      return {
        json: {
          token: jwt.sign(
            {
              sub: user.id,
              fullname: user.fullname,
            },
            config.secret,
            { expiresIn: '12h' },
          ),
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@login-renew',
    handler: async (req, trx) => {
      if (req.user.id === 'anonymous') {
        throw new RequestException(401, {
          error: {
            type: req.i18n('Invalid session'),
            message: req.i18n('User is not logged in.'),
          },
        });
      }
      return {
        json: {
          token: jwt.sign(
            {
              sub: req.user.id,
              fullname: req.user.fullname,
            },
            config.secret,
            { expiresIn: '12h' },
          ),
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@logout',
    handler: async (req) => ({
      status: 204,
    }),
  },
];
