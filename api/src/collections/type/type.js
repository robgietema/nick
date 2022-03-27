/**
 * TypeCollection.
 * @module collections/type/type
 */

import { getUrl, BaseCollection } from '../../helpers';
import _ from 'lodash';

/**
 * Type Collection
 * @class TypeCollection
 * @extends TypeCollection
 */
export class TypeCollection extends BaseCollection {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  toJSON(req) {
    return _(super.toJSON())
      .map((model) => ({
        '@id': `${getUrl(req)}/@types/${model.id}`,
        addable: model.addable,
        title: req.i18n(model.title),
      }))
      .value();
  }
}
