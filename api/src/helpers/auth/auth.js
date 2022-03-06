/**
 * Auth helper.
 * @module helpers/auth/auth
 */

import { indexOf } from 'lodash';
import jwt from 'jsonwebtoken';

import { secret } from '../../config.js';

/**
 * Check required permission.
 * @method requirePermission
 * @param {string} permission Permission to check.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {function} callback Callback function.
 * @returns {Promise<Object>} A Promise that resolves to an object.
 */
export function requirePermission(permission, req, res, callback) {
  if (indexOf(req.permissions, permission) !== -1) {
    return callback();
  } else {
    return res.status(401).send({
      error: {
        message: 'You are not authorization to access this resource.',
        type: 'Unauthorized',
      },
    });
  }
}

/**
 * Get admin header.
 * @method getAdminHeader
 * @returns {String} Admin header.
 */
export function getAdminHeader() {
  return `Bearer ${jwt.sign(
    {
      sub: 'admin',
      fullname: 'Admin',
    },
    secret,
    { expiresIn: '12h' },
  )}`;
}
