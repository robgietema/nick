/**
 * Vocabulary Model.
 * @module models/vocabulary/vocabulary
 */

import { mapValues } from 'es-toolkit/object';

import { Model } from '../../models/_model/_model';
import { getRootUrl } from '../../helpers/url/url';

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
   * @method toJson
   * @param {Object} req Request object
   * @returns {Array} JSON object.
   */
  toJson(req) {
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
