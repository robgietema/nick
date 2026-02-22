/**
 * Catalog Model.
 * @module models/catalog/catalog
 */

import { uniq } from 'es-toolkit/array';
import { pick } from 'es-toolkit/object';

import { getRootUrl } from '../../helpers/url/url';
import { Model } from '../../models/_model/_model';

import config from '../../helpers/config/config';
import type { Json, Request } from '../../types';
import type { Knex } from 'knex';

/**
 * A model for Catalog.
 * @class Catalog
 * @extends Model
 */
export class Catalog extends Model {
  static idColumn: string = 'document';

  /**
   * Returns JSON data.
   * @method toJson
   * @param {Request} req Request object.
   * @returns {Json} JSON object.
   */
  toJson(req: Request): Json {
    const self: any = this;
    const metadata = req.indexes.models.filter(
      (index: any) => index.metadata === true && index.enabled !== false,
    );

    if (
      config.settings.ai?.models?.embed?.enabled &&
      typeof self.similarity === 'number'
    ) {
      metadata.push({
        name: 'similarity',
      });
    }

    return {
      '@id': `${getRootUrl(req)}${self.path}`,
      '@type': self.Type,
      title: self.Title,
      ...pick(
        self,
        metadata.map((field: any) => field.name),
      ),
    } as Json;
  }

  /**
   * Fetch all items but take permissions into account.
   * @method fetchAllRestricted
   * @static
   * @param {Object} where Where clause.
   * @param {Object} options Options for the query.
   * @param {Knex.Transaction} trx Transaction object.
   * @param {Request} req Request object.
   * @returns {Promise<any>} JSON object.
   */
  static async fetchAllRestricted(
    where: any = {},
    options: any = {},
    trx?: Knex.Transaction,
    req?: Request,
  ): Promise<any> {
    if (!req) return this.fetchAll(where, options, trx);

    // Find user, groups and roles
    const userGroupsRoles = uniq([
      ...[req.user.id],
      ...req.user._groups.map((groups: any) => groups.id),
      ...req.user.getRoles(),
    ]);

    // Fetch data
    return this.fetchAll(
      { ...where, _allowedUsersGroupsRoles: ['&&', userGroupsRoles] },
      options,
      trx,
    );
  }

  /**
   * Fetch all items closest by embedding but take permissions into account.
   * @method fetchClosestEmbeddingRestricted
   * @static
   * @param {any} embedding Embedding vector to compare.
   * @param {number} limit Limit for the query.
   * @param {Knex.Transaction} trx Transaction object.
   * @param {Request} req Request object.
   * @returns {Promise<any>} JSON object.
   */
  static async fetchClosestEmbeddingRestricted(
    embedding: any,
    limit: number,
    trx?: Knex.Transaction,
    req?: Request,
  ): Promise<any> {
    // Fetch data
    return this.fetchAllRestricted(
      {},
      {
        select: [
          '*',
          (this as any)
            .knex()
            .raw(`1 - (_embedding <=> '${embedding}') AS similarity`),
        ],
        order: { column: 'similarity', reverse: true },
        limit,
      },
      trx,
      req,
    );
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
      title: req.i18n(self.Title),
      token: self.Title,
    } as Json;
  }
}
