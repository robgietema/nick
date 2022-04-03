/**
 * Login routes.
 * @module routes/login/login
 */

import bcrypt from 'bcrypt-promise';
import jwt from 'jsonwebtoken';

import { User } from '../../models';
import { config } from '../../../config';

export default [
  {
    op: 'post',
    view: '/@login',
    handler: async (req, res) => {
      if (!req.body.login || !req.body.password) {
        return res.status(400).send({
          error: {
            type: req.i18n('Missing credentials'),
            message: req.i18n('Login and password must be provided in body.'),
          },
        });
      }

      // Find user
      const user = await User.fetchById(req.body.login);

      // If user not found
      if (!user) {
        return res.status(401).send({
          error: {
            type: req.i18n('Invalid credentials'),
            message: req.i18n('Wrong login and/or password.'),
          },
        });
      }

      // Check password
      const same = await bcrypt.compare(req.body.password, user.password);
      if (same) {
        res.send({
          token: jwt.sign(
            {
              sub: user.id,
              fullname: user.fullname,
            },
            config.secret,
            { expiresIn: '12h' },
          ),
        });
      } else {
        res.status(401).send({
          error: {
            type: req.i18n('Invalid credentials'),
            message: req.i18n('Wrong login and/or password.'),
          },
        });
      }
    },
  },
  {
    op: 'post',
    view: '/@login-renew',
    handler: (req, res) =>
      res.send({
        token: jwt.sign(
          {
            sub: req.user.id,
            fullname: req.user.fullname,
          },
          config.secret,
          { expiresIn: '12h' },
        ),
      }),
  },
  {
    op: 'post',
    view: '/@logout',
    handler: (req, res) => res.status(204).send(),
  },
];
