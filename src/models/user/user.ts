/**
 * User Model.
 * @module models/user/user
 */

import { uniq } from 'es-toolkit/array';
import type { Knex } from 'knex';

import { getRootUrl } from '../../helpers/url/url';
import { Model } from '../../models/_model/_model';
import { Group } from '../../models/group/group';
import { Role } from '../../models/role/role';
import type { Json, Request } from '../../types';

/**
 * A model for User.
 * @class User
 * @extends Model
 */
export class User extends Model {
  // Set relation mappings
  static get relationMappings(): any {
    return {
      _roles: {
        relation: (Model as any).ManyToManyRelation,
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
        relation: (Model as any).ManyToManyRelation,
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
        relation: (Model as any).ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'user.id',
          through: {
            from: 'user_role_document.user',
            to: 'user_role_document.role',
            extra: ['document'],
          },
          to: 'role.id',
        },
      },
    };
  }

  /**
   * Returns JSON data.
   * @method toJson
   * @param {Request} req Request object.
   * @returns {Json} JSON object.
   */
  toJson(req: Request): Json {
    const self: any = this;
    return {
      '@id': `${getRootUrl(req)}/@users/${self.id}`,
      id: self.id,
      fullname: self.fullname,
      email: self.email,
      roles: self._roles ? self._roles.map((role: any) => role.id) : [],
      groups: self._groups ? self._groups.map((group: any) => group.id) : [],
    } as Json;
  }

  /**
   * Get groups of the user.
   * @method getGroups
   * @returns {string[]} Array of groups.
   */
  getGroups(): string[] {
    const self: any = this;
    return self._groups ? self._groups.map((group: any) => group.id) : [];
  }

  /**
   * Get roles of the user.
   * @method getRoles
   * @returns {string[]} Array of roles.
   */
  getRoles(): string[] {
    const self: any = this;
    // Add anonymous or authenticated role based on user
    let roles: string[] =
      self.id === 'anonymous' ? ['Anonymous'] : ['Authenticated'];

    // Add roles of the user
    if (self._roles) {
      roles = [...roles, ...self._roles.map((role: any) => role.id)];
    }

    // Add roles of the groups of the users
    if (self._groups) {
      self._groups.map((group: any) => {
        if (group._roles) {
          roles = [...roles, ...group._roles.map((role: any) => role.id)];
        }
      });
    }

    // Return roles
    return roles;
  }

  /**
   * Fetch user roles by document.
   * @method fetchRolesByDocument
   * @param {string} document Uuid of the document
   * @param {Knex.Transaction} trx Transaction object.
   * @returns {Promise<string[]>} Array of roles.
   */
  async fetchRolesByDocument(
    document: string,
    trx?: Knex.Transaction,
  ): Promise<string[]> {
    const self: any = this;
    const rows: any[] = await self.$relatedQuery('_documentRoles', trx).where({
      'user_role_document.document': document,
    });
    return rows.map((role: any) => role.id);
  }

  /**
   * Fetch user and group roles by document.
   * @method fetchUserGroupRolesByDocument
   * @param {string} document Uuid of the document
   * @param {Knex.Transaction} trx Transaction object.
   * @returns {Promise<string[]>} Array of roles.
   */
  async fetchUserGroupRolesByDocument(
    document: string,
    trx?: Knex.Transaction,
  ): Promise<string[]> {
    const roles = await this.fetchRolesByDocument(document, trx);
    const groupRoles = await Group.fetchRolesByDocument(
      this.getGroups(),
      document,
      trx,
    );
    return uniq([...roles, ...groupRoles]);
  }

  /**
   * Returns vocabulary data.
   * @method getVocabulary
   * @param {Request} req Request object.
   * @returns {Json} JSON object.
   */
  getVocabulary(req: Request): Json {
    const self: any = this;
    return {
      title: req.i18n(self.fullname),
      token: self.id,
    } as Json;
  }
}
