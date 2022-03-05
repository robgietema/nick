/**
 * Login routes.
 * @module routes/login/login
 */

import bcrypt from 'bcrypt-promise';
import jwt from 'jsonwebtoken';

import { UserRepository } from '../../repositories';
import { secret } from '../../config.js';

export default [
  {
    op: 'post',
    view: '/@login',
    handler: (context, permissions, roles, req, res) => {
      if (!req.body.login || !req.body.password) {
        return res.status(400).send({
          error: {
            message: 'Login and password must be provided in body.',
            type: 'Missing credentials',
          },
        });
      }
      UserRepository.findOne({ id: req.body.login })
        .then((user) =>
          bcrypt.compare(req.body.password, user.get('password')).then((same) =>
            same
              ? res.send({
                  token: jwt.sign(
                    {
                      sub: user.get('id'),
                      fullname: user.get('fullname'),
                    },
                    secret,
                    { expiresIn: '12h' },
                  ),
                })
              : res.status(401).send({
                  error: {
                    message: 'Wrong login and/or password.',
                    type: 'Invalid credentials',
                  },
                }),
          ),
        )
        .catch(UserRepository.Model.NotFoundError, () =>
          res.status(401).send({
            error: {
              message: 'Wrong login and/or password.',
              type: 'Invalid credentials',
            },
          }),
        );
    },
  },
  {
    op: 'post',
    view: '/@login-renew',
    handler: (context, permissions, roles, req, res) =>
      res.send({
        token: jwt.sign(
          {
            sub: req.user.get('id'),
            fullname: req.user.get('fullname'),
          },
          secret,
          { expiresIn: '12h' },
        ),
      }),
  },
  {
    op: 'post',
    view: '/@logout',
    handler: (context, permissions, roles, req, res) => res.status(204).send(),
  },
];
