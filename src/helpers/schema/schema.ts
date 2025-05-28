/**
 * Schema helper.
 * @module helpers/schema/schema
 */

import { concat, findIndex, map, mapValues } from 'lodash';

import {Fieldset, Property, Schema, Request} from '../../types';

/**
 * Merge schemas
 * @method mergeSchemas
 * @param {Array} schemas Array of schemas
 * @returns {Schema} Merged schemas.
 */
export function mergeSchemas(...schemas: Schema[]): Schema {
  const fieldsets: Fieldset[] = [];
  let properties: { [key: string]: Property } = {};
  let required: string[] = [];
  let behaviors: string[] = [];

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
 * @param {Schema} schema Schema object.
 * @param {Request} req Request object.
 * @returns {Schema} Translated schema.
 */
export function translateSchema(schema: Schema, req: Request): Schema {
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
