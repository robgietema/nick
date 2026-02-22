/**
 * Controlpanel Model.
 * @module models/controlpanel/controlpanel
 */

import { compact } from 'es-toolkit/array';

import { getRootUrl } from '../../helpers/url/url';
import { translateSchema } from '../../helpers/schema/schema';
import { Model } from '../../models/_model/_model';

/**
 * A model for Controlpanel.
 * @class Controlpanel
 * @extends Model
 */
export class Controlpanel extends Model {
  /**
   * Returns JSON data.
   * @method toJson
   * @param {Object} req Request object
   * @param {Boolean} extend Extend data
   * @returns {Array} JSON object.
   */
  toJson(req, extend = false) {
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
    const factoryFields = Object.keys(properties).map((property) =>
      properties[property].factory === factory ? property : false,
    );
    return compact(factoryFields);
  }
}
