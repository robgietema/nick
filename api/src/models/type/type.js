/**
 * Type Model.
 * @module models/type/type
 */

import { compact, keys, map } from 'lodash';

import { mergeSchemas, BaseModel } from '../../helpers';
import { Workflow } from '../../models';
import { behaviorRepository } from '../../repositories';

async function getBehaviorSchemas(ids) {
  // Return empty list if no ids specified
  if (ids.length === 0) {
    return [];
  }

  // Fetch behaviors
  const behaviors = compact(
    await Promise.all(
      map(ids, async (id) => await behaviorRepository.findOne({ id })),
    ),
  );

  // Recursively fetch child behaviors
  const schemas = await Promise.all(
    behaviors.map(async (behavior) =>
      mergeSchemas(
        behavior.get('schema'),
        ...(await getBehaviorSchemas(behavior.get('behaviors'))),
      ),
    ),
  );

  // Return schemas
  return schemas;
}

export const Type = BaseModel.extend({
  tableName: 'type',
  idAttribute: 'id',
  workflow() {
    return this.belongsTo(Workflow, 'workflow', 'id');
  },
  async getSchema() {
    const behaviorSchemas = await getBehaviorSchemas(this.get('behaviors'));
    return mergeSchemas(...behaviorSchemas, this.get('schema'));
  },
  async getFactoryFields(factory) {
    const properties = (await this.getSchema()).properties;

    // Get file fields
    const fileFields = map(keys(properties), (property) =>
      properties[property].factory === factory ? property : false,
    );
    return compact(fileFields);
  },
});
