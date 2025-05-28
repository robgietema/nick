/**
 * TypeCollection.
 * @module collections/type/type
 */

import { includes } from 'lodash';

import { getRootUrl, hasPermission } from '../../helpers';
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
  async toJSON(req) {
    return _(super.toJSON())
      .map((model) => ({
        '@id': `${getRootUrl(req)}/@types/${model.id}`,
        addable:
          hasPermission(req.permissions, 'Add') &&
          (req.type.filter_content_types
            ? includes(req.type.allowed_content_types, model.id)
            : model.global_allow),
        title: req.i18n(model.title),
      }))
      .value();
  }
}
