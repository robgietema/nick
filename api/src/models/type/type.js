/**
 * Type Model.
 * @module models/type/type
 */

import { map, keys, compact } from 'lodash';

import { mergeSchemas } from '../../helpers';
import { TypeCollection } from '../../collections';
import { Behavior, Model } from '../../models';

/**
 * A model for Type.
 * @class Type
 * @extends Model
 */
export class Type extends Model {
  static collection = TypeCollection;

  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { Workflow } = require('../../models/workflow/workflow');

    return {
      _workflow: {
        relation: Model.BelongsToOneRelation,
        modelClass: Workflow,
        join: {
          from: 'type.workflow',
          to: 'workflow.id',
        },
      },
    };
  }

  /**
   * Fetch schema.
   * @method fetchSchema
   * @static
   * @param {Object} trx Transaction object.
   */
  async fetchSchema(trx) {
    if (!this._schema) {
      if (this.schema.behaviors) {
        const behaviors = await Behavior.fetchAll(
          {
            id: ['=', this.schema.behaviors],
          },
          {
            order: {
              column: 'id',
              values: this.schema.behaviors,
            },
          },
          trx,
        );
        this._schema = mergeSchemas(
          await behaviors.fetchSchema(trx),
          this.schema,
        );
      } else {
        this._schema = this.schema;
      }
    }
  }

  /**
   * Get factory fields.
   * @method getFactoryFields
   * @static
   * @param {string} factory Factory field.
   * @param {Object} trx Transaction object.
   * @returns {Array} Array of fields with given factory.
   */
  getFactoryFields(factory, trx) {
    const properties = this._schema.properties;

    // Get file fields
    const fileFields = map(keys(properties), (property) =>
      properties[property].factory === factory ? property : false,
    );
    return compact(fileFields);
  }
}
