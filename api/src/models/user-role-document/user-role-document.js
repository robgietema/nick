/**
 * UserRoleDocument Model.
 * @module models/user-role-document/user-role-document
 */

import { BaseModel } from '../../models';

/**
 * A model for User Role Document.
 * @class UserRoleDocument
 * @extends BaseModel
 */
export class UserRoleDocument extends BaseModel {
  /**
   * Get roles.
   * @method getRoles
   * @param {string} document Document uuid.
   * @param {string} user User id.
   * @param {Object} trx Transaction object.
   * @returns {Array} An array of the permissions.
   */
  static async getRoles(document, user, trx) {
    const entries = await this.findAll({
      document,
      user,
    });
    return entries.map((entry) => entry.role);
  }
}
