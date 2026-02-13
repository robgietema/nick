/**
 * Controlpanel Model.
 * @module models/controlpanel/controlpanel
 */

import { compact } from 'es-toolkit/array';

import { getRootUrl } from '../../helpers/url/url';
import { translateSchema } from '../../helpers/schema/schema';
import { Model } from '../../models/_model/_model';

/**
 * Convert legacy file/image objects to Plone registry format strings.
 * Volto's RegistryImageWidget expects: "filenameb64:BASE64_NAME;datab64:BASE64_DATA"
 * This handles data stored as raw objects before the PATCH fix was applied.
 * @param {Object} data - The controlpanel data object
 * @param {Object} schema - The controlpanel schema
 * @returns {Object} Data with file/image fields in registry format
 */
function normalizeFileFields(data, schema) {
  if (!data || !schema || !schema.properties) return data;
  const result = { ...data };

  for (const field of Object.keys(schema.properties)) {
    const prop = schema.properties[field];
    if (
      (prop.factory === 'File' || prop.factory === 'Image') &&
      result[field] &&
      typeof result[field] === 'object' &&
      result[field].data &&
      result[field].filename
    ) {
      const filenameb64 = Buffer.from(result[field].filename).toString(
        'base64',
      );
      result[field] = `filenameb64:${filenameb64};datab64:${result[field].data}`;
    }
  }
  return result;
}

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
      ? {
          ...json,
          data: normalizeFileFields(this.data, this.schema),
          schema: translateSchema(this.schema, req),
        }
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
