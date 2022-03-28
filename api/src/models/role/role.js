/**
 * Role Model.
 * @module models/role/role
 */

import { getUrl } from '../../helpers';
import { RoleCollection } from '../../collections';
import { BaseModel } from '../../models';

/**
 * A model for Role.
 * @class Role
 * @extends BaseModel
 */
export class Role extends BaseModel {
  static collection = RoleCollection;

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  toJSON(req) {
    return {
      '@id': `${getUrl(req)}/@roles/${this.id}`,
      '@type': 'role',
      id: this.id,
      title: req.i18n(this.title),
    };
  }
}
