/**
 * Catalog Model.
 * @module models/catalog/catalog
 */

import { uniq } from 'es-toolkit/array';
import { pick } from 'es-toolkit/object';

import { getRootUrl } from '../../helpers/url/url';
import { Model } from '../../models/_model/_model';

import config from '../../helpers/config/config';

/**
 * A model for Catalog.
 * @class Catalog
 * @extends Model
 */
export class Catalog extends Model {
  static idColumn = 'document';

  /**
   * Returns JSON data.
   * @method toJson
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  toJson(req) {
    const metadata = req.indexes.models.filter(
      (index) => index.metadata === true && index.enabled !== false,
    );

    if (
      config.settings.ai?.models?.embed?.enabled &&
      typeof this.similarity === 'number'
    ) {
      metadata.push({
        name: 'similarity',
      });
    }

    return {
      '@id': `${getRootUrl(req)}${this.path}`,
      '@type': this.Type,
      title: this.Title,
      ...pick(
        this,
        metadata.map((field) => field.name),
      ),
    };
  }

  /**
   * Fetch all items but take permissions into account.
   * @method fetchAllRestricted
   * @static
   * @param {Object} where Where clause.
   * @param {Object} options Options for the query.
   * @param {Object} trx Transaction object.
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  static async fetchAllRestricted(where = {}, options = {}, trx, req) {
    // Find user, groups and roles
    const userGroupsRoles = uniq([
      ...[req.user.id],
      ...req.user._groups.map((groups) => groups.id),
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
   * @param {Object} embedding Embedding vector to compare.
   * @param {Object} limit Limit for the query.
   * @param {Object} trx Transaction object.
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  static async fetchClosestEmbeddingRestricted(embedding, limit, trx, req) {
    // Fetch data
    return this.fetchAllRestricted(
      {},
      {
        select: [
          '*',
          this.knex().raw(`1 - (_embedding <=> '${embedding}') AS similarity`),
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
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  getVocabulary(req) {
    return {
      title: req.i18n(this.Title),
      token: this.Title,
    };
  }
}
