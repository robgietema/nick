/**
 * Index Model.
 * @module models/index/index
 */

import { mapValues } from 'es-toolkit/object';

import { Model } from '../../models/_model/_model';
import { IndexCollection } from '../../collections/index/index';

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
  async toJSON(req) {
    return {
      title: req.i18n(this.title),
      description: req.i18n(this.description),
      group: this.group,
      enabled: this.enabled,
      sortable: this.sortable,
      values: {},
      vocabulary: this.vocabulary,
      operations: Object.keys(this.operators),
      operators: mapValues(this.operators, (operator) => ({
        ...operator,
        title: req.i18n(operator.title),
        description: req.i18n(operator.description),
      })),
    };
  }
}
