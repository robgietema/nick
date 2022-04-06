/**
 * User Model.
 * @module models/group/group
 */

import { concat, map, uniq } from 'lodash';

import { getUrl } from '../../helpers';
import { Model, Group } from '../../models';

/**
 * A model for User.
 * @class User
 * @extends Model
 */
export class User extends Model {
  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { Group } = require('../../models/group/group');
    const { Role } = require('../../models/role/role');

    return {
      _roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'user.id',
          through: {
            from: 'user_role.user',
            to: 'user_role.role',
          },
          to: 'role.id',
        },
      },
      _groups: {
        relation: Model.ManyToManyRelation,
        modelClass: Group,
        join: {
          from: 'user.id',
          through: {
            from: 'user_group.user',
            to: 'user_group.group',
          },
          to: 'group.id',
        },
      },
      _documentRoles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'user.id',
          through: {
            from: 'user_role_document.user',
            to: 'user_role_document.role',
          },
          to: 'role.id',
        },
      },
    };
  }

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  toJSON(req) {
    return {
      '@id': `${getUrl(req)}/@users/${this.id}`,
      id: this.id,
      fullname: this.fullname,
      email: this.email,
      roles: this._roles ? this._roles.map((role) => role.id) : [],
      groups: this._groups ? this._groups.map((group) => group.id) : [],
    };
  }

  /**
   * Get groups of the user.
   * @method getGroups
   * @returns {Array} Array of groups.
   */
  getGroups() {
    return this._groups ? this._groups.map((group) => group.id) : [];
  }

  /**
   * Get roles of the user.
   * @method getRoles
   * @returns {Array} Array of roles.
   */
  getRoles() {
    // Add anonymouse or authenticad role based on user
    let roles = this.id === 'anonymous' ? ['Anonymous'] : ['Authenticated'];

    // Add roles of the user
    if (this._roles) {
      roles = concat(
        roles,
        this._roles.map((role) => role.id),
      );
    }

    // Add roles of the groups of the users
    if (this._groups) {
      map(this._groups, (group) => {
        if (group._roles) {
          roles = concat(
            roles,
            group._roles.map((role) => role.id),
          );
        }
      });
    }

    // Return roles
    return roles;
  }

  /**
   * Fetch roles by document.
   * @method fetchRolesByDocument
   * @param {string} document Uuid of the document
   * @param {Object} trx Transaction object.
   * @returns {Array} Array of roles.
   */
  async fetchRolesByDocument(document, trx) {
    return uniq([
      ...map(
        await this.$relatedQuery('_documentRoles', trx).where({
          'user_role_document.document': document,
        }),
        (role) => role.id,
      ),
      ...(await Group.fetchRolesByDocument(this.getGroups(), document, trx)),
    ]);
  }
}
