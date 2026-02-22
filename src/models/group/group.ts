/**
 * Group Model.
 * @module models/group/group
 */

import { uniq } from 'es-toolkit/array';
import type { Knex } from 'knex';

import { getRootUrl } from '../../helpers/url/url';

import { Model } from '../../models/_model/_model';
import { Role } from '../../models/role/role';
import { User } from '../../models/user/user';
import type { Json, Request } from '../../types';

/**
 * A model for Group.
 * @class Group
 * @extends Model
 */
export class Group extends Model {
  // Set relation mappings
  static get relationMappings() {
    return {
      _roles: {
        relation: (Model as any).ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'group.id',
          through: {
            from: 'group_role.group',
            to: 'group_role.role',
          },
          to: 'role.id',
        },
      },
      _users: {
        relation: (Model as any).ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'group.id',
          through: {
            from: 'user_group.group',
            to: 'user_group.user',
          },
          to: 'user.id',
        },
      },
      _documentRoles: {
        relation: (Model as any).ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'group.id',
          through: {
            from: 'group_role_document.group',
            to: 'group_role_document.role',
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
      '@id': `${getRootUrl(req)}/@groups/${self.id}`,
      id: self.id,
      groupname: self.id,
      title: req.i18n(self.title),
      description: req.i18n(self.description),
      email: self.email,
      roles: self._roles ? self._roles.map((role: any) => role.id) : [],
    } as Json;
  }

  /**
   * Fetch roles by document.
   * @method fetchRolesByDocument
   * @param {any} groups Array of groups
   * @param {string} document Uuid of the document
   * @param {Knex.Transaction} trx Transaction object.
   * @returns {Promise<string[]>} Array of roles.
   */
  static async fetchRolesByDocument(
    groups: any,
    document: string,
    trx?: Knex.Transaction,
  ): Promise<string[]> {
    const rows: any[] = await this.relatedQuery('_documentRoles', trx)
      .for(groups)
      .where({
        'group_role_document.document': document,
      });
    return uniq(rows.map((role: any) => role.id));
  }

  /**
   * Fetch group roles by document.
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
      'group_role_document.document': document,
    });
    return rows.map((role: any) => role.id);
  }
}
