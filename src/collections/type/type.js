/**
 * TypeCollection.
 * @module collections/type/type
 */

import { getRootUrl } from '../../helpers';
import { Collection } from '../../collections';
import _ from 'lodash';

/**
 * Type Collection
 * @class TypeCollection
 * @extends Collection
 */
export class TypeCollection extends Collection {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  toJSON(req) {
    return _(super.toJSON())
      .map((model) => ({
        '@id': `${getRootUrl(req)}/@types/${model.id}`,
        addable: model.addable,
        title: req.i18n(model.title),
      }))
      .value();
  }
}
