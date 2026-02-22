/**
 * Vocabulary Model.
 * @module models/vocabulary/vocabulary
 */

import { mapValues } from 'es-toolkit/object';

import { Model } from '../../models/_model/_model';
import { getRootUrl } from '../../helpers/url/url';
import type { Json, Request } from '../../types';

/**
 * A model for Vocabulary.
 * @class Vocabulary
 * @extends Model
 */
export class Vocabulary extends Model {
  static get jsonSchema(): any {
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
   * @param {Request} req Request object
   * @returns {Json} JSON object.
   */
  toJson(req: Request): Json {
    const self: any = this;
    return {
      '@id': `${getRootUrl(req)}/@vocabularies/${self.id}`,
      items: mapValues(self.items || {}, (item: any) => ({
        title: req.i18n(item.title),
        token: item.token,
      })),
      items_total: (self.items && self.items.length) || 0,
    } as Json;
  }
}
