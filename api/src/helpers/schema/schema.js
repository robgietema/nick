/**
 * Schema helper.
 * @module helpers/schema/schema
 */

import { concat, findIndex, map, mapValues } from 'lodash';

/**
 * Merge schemas
 * @method mergeSchemas
 * @param {Array} schemas Array of schemas
 * @returns {Object} Merged schemas.
 */
export function mergeSchemas(...schemas) {
  const fieldsets = [];
  let properties = {};
  let required = [];
  let behaviors = [];
  map(schemas, (schema) => {
    map(schema.fieldsets, (fieldset) => {
      // Find fieldset
      const index = findIndex(fieldsets, (entry) => entry.id === fieldset.id);

      // Check if already exists
      if (index !== -1) {
        // Append fields
        fieldsets[index].fields = [
          ...fieldsets[index].fields,
          ...fieldset.fields,
        ];
      } else {
        // Add new fieldset
        fieldsets.push(fieldset);
      }
    });
    properties = {
      ...properties,
      ...schema.properties,
    };
    if (schema.required) {
      required = concat(required, schema.required);
    }
    if (schema.behaviors) {
      behaviors = concat(behaviors, schema.behaviors);
    }
  });

  return {
    fieldsets,
    properties,
    required,
    behaviors,
  };
}

/**
 * Translate the schema
 * @method translateSchema
 * @param {Object} schema Schema object.
 * @param {Object} req Request object.
 * @returns {Object} Translated schema.
 */
export function translateSchema(schema, req) {
  return {
    ...schema,
    fieldsets: map(schema.fieldsets, (fieldset) => ({
      ...fieldset,
      title: req.i18n(fieldset.title),
    })),
    properties: mapValues(schema.properties, (property) => ({
      ...property,
      title: req.i18n(property.title),
      description: req.i18n(property.description),
    })),
  };
}
