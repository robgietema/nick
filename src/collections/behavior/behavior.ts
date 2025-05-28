/**
 * BehaviorCollection.
 * @module collection/behavior/behavior
 */

import { Knex } from 'knex';
import { mergeSchemas } from '../../helpers';
import { Collection } from '../../collections';
import type { Model, Schema } from '../../types';

interface BehaviorModel extends Model {
  fetchSchema: (trx: Knex.Transaction) => Promise<Schema>;
}

/**
 * Behavior Collection
 * @class BehaviorCollection
 * @extends Collection
 */
export class BehaviorCollection extends Collection<BehaviorModel> {
  /**
   * Fetch schema.
   * @method fetchSchema
   * @param {Knex.Transaction} trx Transaction object.
   * @returns {Promise<Schema>} Schema.
   */
  async fetchSchema(trx: Knex.Transaction): Promise<Schema> {
    return mergeSchemas(
      ...(await Promise.all(
        this.map(async (model) => await model.fetchSchema(trx)),
      )),
    );
  }
}