/**
 * Auth helper.
 * @module helpers/auth/auth
 */

import { includes, isUndefined } from 'lodash';
import jwt from 'jsonwebtoken';

import { config } from '../../../config';

/**
 * Check required permission.
 * @method hasPermission
 * @param {Array} permissions Permissions of the current user.
 * @param {string} permission Permission to check.
 * @returns {boolean} True if you have permission.
 */
export function hasPermission(permissions, permission) {
  return isUndefined(permission) || includes(permissions, permission);
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
    config.secret,
    { expiresIn: '12h' },
  )}`;
}

/**
 * Get user based on token.
 * @method getUser
 * @param {Object} req Request object.
 * @returns {string} User id.
 */
export function getUserId(req) {
  // Get token
  const token =
    req.headers.authorization &&
    req.headers.authorization.match(/^Bearer (.*)$/);

  // Check if auth token
  if (!token) {
    return 'anonymous';
  } else {
    const decoded = jwt.verify(token[1], config.secret);

    // If token expired
    if (new Date().getTime() / 1000 > decoded.exp) {
      return 'anonymous';
    } else {
      return decoded.sub;
    }
  }
}
