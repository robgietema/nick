/**
 * Controlpanel Model.
 * @module models/controlpanel/controlpanel
 */

import { compact, keys, map } from 'lodash';
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

  /**
   * Get factory fields.
   * @method getFactoryFields
   * @static
   * @param {string} factory Factory field.
   * @returns {Array} Array of fields with given factory.
   */
  getFactoryFields(factory) {
    const properties = this.schema.properties;

    // Get factory fields
    const factoryFields = map(keys(properties), (property) =>
      properties[property].factory === factory ? property : false,
    );
    return compact(factoryFields);
  }
}
