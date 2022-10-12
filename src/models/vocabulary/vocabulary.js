/**
 * Vocabulary Model.
 * @module models/vocabulary/vocabulary
 */

import { getRootUrl, translateSchema } from '../../helpers';
import { Model } from '../../models';

/**
 * A model for Vocabulary.
 * @class Vocabulary
 * @extends Model
 */
export class Vocabulary extends Model {
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    };
  }

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object
   * @returns {Array} JSON object.
   */
  toJSON(req) {
    // Get basic data
    return {
      '@id': `${getRootUrl(req)}/@vocabularies/${this.id}`,
      items: mapValues(this.items, (item) => ({
        title: req.i18n(item.title),
        token: item.token,
      })),
      items_total: this.items.length,
    };
  }
}
