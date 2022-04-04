/**
 * Redirect Model.
 * @module models/redirect/redirect
 */

import { Model } from '../../models';

/**
 * A model for Redirect.
 * @class Redirect
 * @extends Model
 */
export class Redirect extends Model {
  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { Document } = require('../../models/document/document');

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
   * @returns {Object} Document model or false.
   */
  static fetchByPath(path) {
    return this.fetchOne(
      {
        path,
      },
      { related: '_document' },
    );
  }
}
