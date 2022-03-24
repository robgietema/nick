/**
 * Login routes.
 * @module routes/login/login
 */

import bcrypt from 'bcrypt-promise';
import jwt from 'jsonwebtoken';
import { defineMessages } from '@formatjs/intl';

import { userRepository } from '../../repositories';
import { config } from '../../../config.js';

const messages = defineMessages({
  errorMissingType: {
    id: 'Missing credentials',
    defaultMessage: 'Missing credentials',
  },
  errorMissingMessage: {
    id: 'Login and password must be provided in body.',
    defaultMessage: 'Login and password must be provided in body.',
  },
  errorInvalidType: {
    id: 'Invalid credentials',
    defaultMessage: 'Invalid credentials',
  },
  errorInvalidMessage: {
    id: 'Wrong login and/or password.',
    defaultMessage: 'Wrong login and/or password.',
  },
});

export default [
  {
    op: 'post',
    view: '/@login',
    handler: async (req, res) => {
      if (!req.body.login || !req.body.password) {
        return res.status(400).send({
          error: {
            type: req.intl.formatMessage(messages.errorMissingType),
            message: req.intl.formatMessage(messages.errorMissingMessage),
          },
        });
      }
      try {
        const user = await userRepository.findOne({ id: req.body.login });
        const same = await bcrypt.compare(
          req.body.password,
          user.get('password'),
        );
        if (same) {
          res.send({
            token: jwt.sign(
              {
                sub: user.get('id'),
                fullname: user.get('fullname'),
              },
              config.secret,
              { expiresIn: '12h' },
            ),
          });
        } else {
          res.status(401).send({
            error: {
              type: req.intl.formatMessage(messages.errorInvalidType),
              message: req.intl.formatMessage(messages.errorInvalidMessage),
            },
          });
        }
      } catch (e) {
        res.status(401).send({
          error: {
            type: req.intl.formatMessage(messages.errorInvalidType),
            message: req.intl.formatMessage(messages.errorInvalidMessage),
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
            sub: req.user.get('id'),
            fullname: req.user.get('fullname'),
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
