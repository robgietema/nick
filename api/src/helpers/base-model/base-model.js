/**
 * Objection BaseModel.
 * @module helpers/base-model/base-model
 */

import { mixin, Model } from 'objection';
import TableName from 'objection-table-name';
import { includes, snakeCase } from 'lodash';

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
   * @param {Object} options Ooptions for the query.
   * @param {Object} trx Transaction object.
   * @returns {Array} JSON object.
   */
  static where(where, options, trx) {
    let query = this.query(trx);
    if (where) {
      query = query.where(where);
    }
    if (options.order) {
      query = query.orderByRaw(
        `${
          includes(options.order, '->>') ? options.order : `"${options.order}"`
        }${options.reverse ? ' DESC' : ''}`,
      );
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
