/**
 * Auth helper.
 * @module helpers/auth/auth
 */

import { Request } from 'express';

import { includes, isString, isUndefined } from 'lodash';
import jwt from 'jsonwebtoken';

const { config } = require(`${process.cwd()}/config`);

// Extend Request to include token property
interface RequestWithToken extends Request {
  token: string | undefined;
}

/**
 * Check required permission.
 * @method hasPermission
 * @param {string[]} permissions Permissions of the current user.
 * @param {string} permission Permission to check.
 * @returns {boolean} True if you have permission.
 */
export function hasPermission(
  permissions: string[],
  permission: string,
): boolean {
  return isUndefined(permission) || includes(permissions, permission);
}

/**
 * Get user based on token.
 * @method getUser
 * @param {Object} req Request object.
 * @returns {string} User id.
 */
export function getUserId(req: RequestWithToken): string | undefined {
  // Check if auth token
  if (!req.token) {
    return 'anonymous';
  } else {
    let decoded;
    try {
      decoded = jwt.verify(req.token, config.secret);
    } catch (err) {
      return 'anonymous';
    }

    // Return user id
    return isString(decoded.sub) ? decoded.sub : undefined;
  }
}
