/**
 * Redirect Model.
 * @module models/redirect/redirect
 */

import { Model } from '../../models/_model/_model';
import { Document } from '../../models/document/document';

/**
 * A model for Redirect.
 * @class Redirect
 * @extends Model
 */
export class Redirect extends Model {
  // Id column
  static get idColumn() {
    return ['document', 'path'];
  }

  // Set relation mappings
  static get relationMappings() {
    return {
      _document: {
        relation: Model.BelongsToOneRelation,
        modelClass: Document,
        join: {
          from: 'redirect.document',
          to: 'document.uuid',
        },
      },
    };
  }

  /**
   * Fetch by path
   * @method fetchByPath
   * @static
   * @param {string} path Path to check
   * @param {Object} trx Transaction object.
   * @returns {Object} Document model or false.
   */
  static fetchByPath(path, trx) {
    return this.fetchOne(
      {
        path,
      },
      { related: '_document' },
      trx,
    );
  }
}
