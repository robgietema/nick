/**
 * Controlpanel Model.
 * @module models/controlpanel/controlpanel
 */

import { getRootUrl, translateSchema } from '../../helpers';
import { Model } from '../../models';

/**
 * A model for Controlpanel.
 * @class Controlpanel
 * @extends Model
 */
export class Controlpanel extends Model {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object
   * @param {Boolean} extend Extend data
   * @returns {Array} JSON object.
   */
  toJSON(req, extend = false) {
    // Get basic data
    const json = {
      '@id': `${getRootUrl(req)}/@controlpanels/${this.id}`,
      group: this.group,
      title: this.title,
    };

    // Return extended or basic data
    return extend
      ? { ...json, data: this.data, schema: translateSchema(this.schema, req) }
      : json;
  }
}
