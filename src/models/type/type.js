/**
 * Type Model.
 * @module models/type/type
 */

import { map, keys, compact } from 'lodash';

import { getRootUrl, mergeSchemas } from '../../helpers';
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
   * @param {Object} trx Transaction object.
   */
  async cacheSchema(trx) {
    let schema;
    if (this.schema.behaviors && this.schema.behaviors.length > 0) {
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
              title: 'Default',
            },
          ],
        },
        await behaviors.fetchSchema(trx),
        this.schema,
      );
    } else {
      schema = this.schema;
    }
    await this.update({ _schema: schema }, trx);
  }

  /**
   * Returns the control panel JSON data.
   * @method toControlPanelJSON
   * @param {Object} req Request object
   * @param {Object} trx Transaction object.
   * @returns {Array} JSON object.
   */
  async toControlPanelJSON(req, trx) {
    const behaviors = await Behavior.fetchAll({}, {}, trx);

    // Get basic data
    let json = {
      '@id': `${getRootUrl(req)}/@controlpanels/dexterity-types/${this.id}`,
      title: this.title,
      description: this.description,
      schema: {
        fieldsets: [
          {
            fields: [
              'title',
              'description',
              'allowed_content_types',
              'filter_content_types',
            ],
            id: 'default',
            title: 'Default',
          },
          {
            fields: behaviors.map((behavior) => behavior.id),
            id: 'behaviors',
            title: req.i18n('Behaviors'),
          },
        ],
        properties: {
          allowed_content_types: {
            additionalItems: true,
            description: '',
            factory: 'Multiple Choice',
            items: {
              description: '',
              factory: 'Choice',
              title: '',
              type: 'string',
              vocabulary: {
                '@id': `${getRootUrl(req)}/@vocabularies/types`,
              },
            },
            title: req.i18n('Allowed Content Types'),
            type: 'array',
            uniqueItems: true,
          },
          description: {
            description: '',
            factory: 'Text',
            title: req.i18n('Description'),
            type: 'string',
            widget: 'textarea',
          },
          filter_content_types: {
            factory: 'Yes/No',
            title: req.i18n('Filter Contained Types'),
            description: req.i18n(
              'Items of this type can act as a folder containing other  items. What content types should be allowed inside?',
            ),
            type: 'boolean',
          },
          title: {
            description: '',
            factory: 'Text line (String)',
            title: req.i18n('Type Name'),
            type: 'string',
          },
        },
        required: ['title', 'filter_content_types'],
      },
      data: {
        title: this.title,
        description: this.description,
        allowed_content_types: this.allowed_content_types,
        filter_content_types: this.filter_content_types,
      },
    };

    // Loop through behaviors
    behaviors.map((behavior) => {
      // Set behavior data
      json.data[behavior.id] = this.schema.behaviors
        ? this.schema.behaviors.includes(behavior.id)
        : false;

      // Set behavior schema
      json.schema.properties[behavior.id] = {
        description: req.i18n(behavior.description),
        factory: 'Yes/No',
        title: req.i18n(behavior.title),
        type: 'boolean',
      };
    });

    // Return data
    return json;
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

    // Get factory fields
    const factoryFields = map(keys(properties), (property) =>
      properties[property].factory === factory ? property : false,
    );
    return compact(factoryFields);
  }
}
