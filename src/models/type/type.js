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
   * Cache schema.
   * @method cacheSchema
   * @static
   * @param {Object} trx Transaction object.
   */
  async cacheSchema(trx) {
    let schema;
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
      schema = mergeSchemas(
        {
          fieldsets: [
            {
              fields: [],
              id: 'default',
              'title:i18n': 'Default',
            },
          ],
        },
        await behaviors.fetchSchema(trx),
        this.schema,
      );
    } else {
      schema = this.schema;
    }
    await this.update({ _schema: schema });
  }

  /**
   * Get factory fields.
   * @method getFactoryFields
   * @static
   * @param {string} factory Factory field.
   * @returns {Array} Array of fields with given factory.
   */
  getFactoryFields(factory) {
    const properties = this._schema.properties;

    // Get file fields
    const fileFields = map(keys(properties), (property) =>
      properties[property].factory === factory ? property : false,
    );
    return compact(fileFields);
  }
}
