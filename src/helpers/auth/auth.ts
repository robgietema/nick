/**
 * Auth helper.
 * @module helpers/auth/auth
 */

import type { Request } from '../../types';

import { isUndefined } from 'es-toolkit/predicate';
import jwt from 'jsonwebtoken';

import config from '../config/config';

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
  return isUndefined(permission) || permissions.includes(permission);
}

/**
 * Get user based on token.
 * @method getUser
 * @param {Object} req Request object.
 * @returns {string} User id.
 */
export function getUserId(req: Request): string | undefined {
  // Check if auth token
  if (!req.token) {
    return 'anonymous';
  } else {
    let decoded;
    try {
      decoded = jwt.verify(req.token, config.settings.secret);
    } catch (err) {
      return 'anonymous';
    }

    // Return user id
    return typeof decoded.sub === 'string' ? decoded.sub : undefined;
  }
}
