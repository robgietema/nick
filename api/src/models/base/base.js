/**
 * Objection BaseModel.
 * @module helpers/base-model/base-model
 */

import { mixin, Model } from 'objection';
import TableName from 'objection-table-name';
import _, {
  isArray,
  isString,
  keys,
  map,
  mapKeys,
  omit,
  snakeCase,
} from 'lodash';

import { formatAttribute } from '../../helpers';
import { BaseCollection } from '../../collections';
import { knex } from '../../knex';

// Give the knex instance to objection.
Model.knex(knex);

/**
 * Base model used to extend models from.
 * @class BaseModel
 * @extends Model
 */
export class BaseModel extends mixin(Model, [
  TableName({ caseMapper: snakeCase }),
]) {
  static collection = BaseCollection;

  /**
   * Create a where query object
   * @method where
   * @static
   * @param {Object} where Where clause.
   * @param {Object} options Options for the query.
   * @param {Object} trx Transaction object.
   * @returns {Array} JSON object.
   */
  static where(where, options, trx) {
    let query = this.query(trx);

    /**
     * Add where
     * Possible options are:
     * { id: 0 }                              // Search by field
     * { "json->>'title'": 'News'}            // Search in json field
     * { title: ['like', 'News'] }            // Override operator
     * { roles: ['=', ['Reader', 'Editor']] } // Search by values
     */
    if (where) {
      mapKeys(where, (value, key) => {
        // user and group are reserved words so need to be wrapper in quotes
        const attribute = formatAttribute(key);
        const operator = isArray(value) ? value[0] : '=';
        const values = isArray(value) ? value[1] : value;
        query = query.whereRaw(
          `${attribute} ${operator} ${isArray(values) ? 'any(?)' : '?'}`,
          [values],
        );
      });
    }

    /**
     * Add order by
     * Possible options are:
     * 'title'                            // Sort by title column
     * { column: 'title' }                // Sort by title column
     * { column: 'title', reverse: true } // Reverse sort
     * { column: 'title', values: [...] } // Sort by fixed values
     */
    if (options.order) {
      // Check if default order
      if (isString(options.order)) {
        query = query.orderByRaw(formatAttribute(options.order));
      } else {
        let order = '';
        // Check if values are defined
        if (options.order.values) {
          order = `case ${_(options.order.values)
            .map(
              (value, index) =>
                `when ${options.order.column} = '${value}' then ${index}`,
            )
            .join(' ')} end`;
        } else {
          // Order by column
          order = formatAttribute(options.order);
        }
        query = query.orderByRaw(`${order}${options.reverse ? ' DESC' : ''}`);
      }
    }

    // Add paging options
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.offset(options.offset);
    }
    return query;
  }

  /**
   * Add related items to the result.
   * @method findRelated
   * @static
   * @param {Object|Array} models Current models.
   * @param {Object} options Ooptions for the query.
   * @param {Object} trx Transaction object.
   * @returns {Array} JSON object.
   */
  static async findRelated(models, options, trx) {
    let result = models;
    if (models && options.related) {
      if (isArray(models)) {
        await Promise.all(
          result.map(async (item, index) => {
            result[index][options.related] = await this.relatedQuery(
              options.related,
            ).for(item[item.constructor.idColumn]);
          }),
        );
      } else {
        result[options.related] = await this.relatedQuery(options.related).for(
          result[result.constructor.idColumn],
        );
      }
    }
    return result;
  }

  /**
   * Find all items.
   * @method findAll
   * @static
   * @param {Object} where Where clause.
   * @param {Object} options Ooptions for the query.
   * @param {Object} trx Transaction object.
   * @returns {Array} JSON object.
   */
  static async findAll(where = {}, options = {}, trx) {
    let models = await this.where(where, options, trx);
    models = await this.findRelated(models, options, trx);
    return new this.collection(models);
  }

  /**
   * Find one item.
   * @method findOne
   * @static
   * @param {Object} where Where clause.
   * @param {Object} options Ooptions for the query.
   * @param {Object} trx Transaction object.
   * @returns {Object} Model of the item.
   */
  static async findOne(where = {}, options = {}, trx) {
    let model = await this.where(where, options, trx).first();
    model = await this.findRelated(model, options, trx);
    return model;
  }

  /**
   * Find by id.
   * @method findById
   * @static
   * @param {string} id Id to be searched for
   * @param {Object} options Options for the query.
   * @param {Object} trx Transaction object.
   * @returns {Object} Model of the item.
   */
  static async findById(id, options = {}, trx) {
    let model = await this.query(trx).findById(id);
    model = await this.findRelated(model, options, trx);
    return model;
  }

  /**
   * Delete by where.
   * @method delete
   * @static
   * @param {Object} where Where clause.
   * @param {Object} trx Transaction object.
   * @returns {number} Amount deleted
   */
  static async delete(where, trx) {
    return await this.query(trx).delete().where(where);
  }

  /**
   * Delete by id.
   * @method deleteById
   * @static
   * @param {string} id Id to be deleted
   * @param {Object} trx Transaction object.
   * @returns {boolean} True if model deleted.
   */
  static async deleteById(id, trx) {
    const numDeleted = await this.query(trx).deleteById(id);
    return numDeleted > 0;
  }

  /**
   * Create new model.
   * @method create
   * @static
   * @param {Object} data Model data.
   * @param {Object} options Options for the query.
   * @param {Object} trx Transaction object.
   * @returns {Object} Model of the inserted record
   */
  static async create(data, options, trx) {
    const relations = keys(this.getRelations());
    let own = omit(data, relations);
    let model = await this.query(trx).insert(own);
    await Promise.all(
      map(relations, async (related) => {
        if (data[related]) {
          await Promise.all(
            map(
              data[related],
              async (item) =>
                await model.$relatedQuery(related, trx).relate(item),
            ),
          );
        }
      }),
    );
    model = await this.findRelated(model, options, trx);
    return model;
  }

  /**
   * Update model.
   * @method update
   * @static
   * @param {string} id Id of the model.
   * @param {Object} data Model data.
   * @param {Object} trx Transaction object.
   */
  static async update(id, data, trx) {
    const relations = keys(this.getRelations());
    let own = omit(data, relations);
    const model = await this.query(trx).updateAndFetchById(id, own);
    await Promise.all(
      map(relations, async (related) => {
        if (isArray(data[related])) {
          await model.$relatedQuery(related, trx).unrelate();
          await Promise.all(
            map(
              data[related],
              async (item) =>
                await model.$relatedQuery(related, trx).relate(item),
            ),
          );
        }
      }),
    );
  }
}
