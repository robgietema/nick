/**
 * Objection BaseModel.
 * @module helpers/base-model/base-model
 */

import { mixin, Model } from 'objection';
import TableName from 'objection-table-name';
import _, { isArray, isString, mapKeys, snakeCase } from 'lodash';

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
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.offset(options.offset);
    }
    return query;
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
    return new this.collection(await this.where(where, options, trx));
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
    return await this.where(where, options, trx).first();
  }

  /**
   * Find by id.
   * @method findById
   * @static
   * @param {string} id Id to be searched for
   * @param {Object} trx Transaction object.
   * @returns {Object} Model of the item.
   */
  static async findById(id, trx) {
    return await this.query(trx).findById(id);
  }
}
