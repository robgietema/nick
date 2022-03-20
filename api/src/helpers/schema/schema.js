/**
 * Schema helper.
 * @module helpers/schema/schema
 */

import merge from 'deepmerge';
import { findIndex, map } from 'lodash';

/**
 * Merge schemas
 * @method mergeSchemas
 * @param {Array} schemas Array of schemas
 * @returns {Object} Merged schemas.
 */
export function mergeSchemas(...schemas) {
  const schema = merge.all(schemas);
  let fieldsets = [];
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

  return {
    ...schema,
    fieldsets,
  };
}
