/**
 * User Model.
 * @module models/group/group
 */

import { concat, map, uniq } from 'lodash';

import { getUrl } from '../../helpers';
import { BaseModel, Group } from '../../models';
import { UserCollection } from '../../collections';

/**
 * A model for User.
 * @class User
 * @extends BaseModel
 */
export class User extends BaseModel {
  // Set collection
  static collection = UserCollection;

  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { Group } = require('../../models/group/group');
    const { Role } = require('../../models/role/role');

    return {
      roles: {
        relation: BaseModel.ManyToManyRelation,
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
      groups: {
        relation: BaseModel.ManyToManyRelation,
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
      documentRoles: {
        relation: BaseModel.ManyToManyRelation,
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
      roles: this.roles ? this.roles.map((role) => role.id) : [],
      groups: this.groups ? this.groups.map((group) => group.id) : [],
    };
  }

  /**
   * Get groups of the user.
   * @method getGroups
   * @returns {Array} Array of groups.
   */
  getGroups() {
    return this.groups ? this.groups.map((group) => group.id) : [];
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
    if (this.roles) {
      roles = concat(
        roles,
        this.roles.map((role) => role.id),
      );
    }

    // Add roles of the groups of the users
    if (this.groups) {
      map(this.groups, (group) => {
        if (group.roles) {
          roles = concat(
            roles,
            group.roles.map((role) => role.id),
          );
        }
      });
    }

    // Return roles
    return roles;
  }

  /**
   * Find roles by document.
   * @method findRolesByDocument
   * @param {string} document Uuid of the document
   * @param {Object} trx Transaction object.
   * @returns {Array} Array of roles.
   */
  async findRolesByDocument(document, trx) {
    return uniq([
      ...map(
        await this.$relatedQuery('documentRoles', trx).where({
          'user_role_document.document': document,
        }),
        (role) => role.id,
      ),
      ...(await Group.findRolesByDocument(this.getGroups(), document, trx)),
    ]);
  }
}
