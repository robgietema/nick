/**
 * GroupRoleDocument Model.
 * @module models/group-role-document/group-role-document
 */

import { BaseModel } from '../../models';

/**
 * A model for Group Role Document.
 * @class GroupRoleDocument
 * @extends BaseModel
 */
export class GroupRoleDocument extends BaseModel {
  /**
   * Get roles.
   * @method getRoles
   * @param {string} document Document uuid.
   * @param {Array} groups Array of group id.
   * @param {Object} trx Transaction object.
   * @returns {Array} An array of the permissions.
   */
  static async getRoles(document, groups, trx) {
    const entries = await this.findAll({
      document,
      group: ['=', groups],
    });
    return entries.map((entry) => entry.role);
  }
}
