/**
 * Index Model.
 * @module models/index/index
 */

import { keys, mapValues } from 'lodash';

import { Model } from '../../models';
import { IndexCollection } from '../../collections';

/**
 * A model for Index.
 * @class Index
 * @extends Model
 */
export class Index extends Model {
  static collection = IndexCollection;

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object
   * @returns {Array} JSON object.
   */
  toJSON(req) {
    return {
      title: req.i18n(this.title),
      description: req.i18n(this.description),
      group: this.group,
      enabled: this.enabled,
      sortable: this.sortable,
      values: {},
      vocabulary: this.vocabulary,
      operations: keys(this.operators),
      operators: mapValues(this.operators, (operator) => ({
        ...operator,
        title: req.i18n(operator.title),
        description: req.i18n(operator.description),
      })),
    };
  }
}
