/**
 * Catalog Model.
 * @module models/catalog/catalog
 */

import { map, pick } from 'lodash';

import { getRootUrl } from '../../helpers';
import { Model } from '../../models';

import profile from '../../profiles/catalog';

/**
 * A model for Catalog.
 * @class Catalog
 * @extends Model
 */
export class Catalog extends Model {
  static idColumn = 'document';

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  toJSON(req) {
    return {
      '@id': `${getRootUrl(req)}${this.path}`,
      '@type': this.Type,
      title: this.Title,
      ...pick(
        this,
        map(profile.metadata, (metadata) => metadata.name),
      ),
    };
  }
}
