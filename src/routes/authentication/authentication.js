/**
 * Authentication routes.
 * @module routes/authentication/authentication
 */

import bcrypt from 'bcrypt-promise';
import jwt from 'jsonwebtoken';

import { User } from '../../models/user/user';
import { log } from '../../helpers/log/log';
import { RequestException } from '../../helpers/error/error';
import { authLimiter } from '../../helpers/limiter/limiter';

import config from '../../helpers/config/config';

export default [
  {
    op: 'post',
    view: '/@login',
    client: 'login',
    middleware: authLimiter,
    handler: async (req, trx) => {
      if (!req.body.login || !req.body.password) {
        log.error(`Log in attempt without login or password from ${req.ip}.`);
        throw new RequestException(400, {
          error: {
            type: req.i18n('Missing credentials'),
            message: req.i18n('Login and password must be provided in body.'),
          },
        });
      }

      // Find user by id
      let user = await User.fetchById(req.body.login, {}, trx);

      // Find user by email
      if (!user) {
        user = await User.fetchOne({ email: req.body.login }, {}, trx);
      }

      // If user not found
      if (!user) {
        log.error(
          `Log in attempt failed, user '${req.body.login}' not found from ${req.ip}.`,
        );
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
        log.error(
          `Log in attempt failed, password incorrect for user '${req.body.login}' from ${req.ip}.`,
        );
        throw new RequestException(401, {
          error: {
            type: req.i18n('Invalid credentials'),
            message: req.i18n('Wrong login and/or password.'),
          },
        });
      }

      // Log success
      log.info(
        `Log in attempt success for user '${req.body.login}' from ${req.ip}.`,
      );

      // Trigger on login
      await config.settings.events.trigger('onLogin', user, trx);

      // Return ok
      return {
        json: {
          token: jwt.sign(
            {
              sub: user.id,
              fullname: user.fullname,
            },
            config.settings.secret,
            { expiresIn: '2h', algorithm: 'HS256' },
          ),
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@login-renew',
    client: 'renewLogin',
    middleware: authLimiter,
    handler: async (req, trx) => {
      if (req.user.id === 'anonymous') {
        // Log error
        log.info('Log in renew attempt failed for anonymous user.');

        throw new RequestException(401, {
          error: {
            type: req.i18n('Invalid session'),
            message: req.i18n('User is not logged in.'),
          },
        });
      }

      // Log success
      log.info(`Log in renew attempt success for user '${req.user.id}'.`);

      return {
        json: {
          token: jwt.sign(
            {
              sub: req.user.id,
              fullname: req.user.fullname,
            },
            config.settings.secret,
            { expiresIn: '2h', algorithm: 'HS256' },
          ),
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@logout',
    client: 'logout',
    handler: async (req, trx) => {
      // Trigger on logout
      await config.settings.events.trigger('onLogout', req.user, trx);

      // Log success
      return {
        status: 204,
      };
    },
  },
];
