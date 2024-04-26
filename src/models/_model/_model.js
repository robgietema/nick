/**
 * Objection Model.
 * @module helpers/base-model/base-model
 */

import { mixin, Model as ObjectionModel } from 'objection';
import TableName from 'objection-table-name';
import _, {
  difference,
  isArray,
  isEmpty,
  isObject,
  isString,
  keys,
  map,
  mapKeys,
  omit,
  snakeCase,
} from 'lodash';

import { formatAttribute, log, removeUndefined } from '../../helpers';
import { Collection } from '../../collections';
import { knex } from '../../helpers';

// Give the knex instance to objection.
ObjectionModel.knex(knex);

/**
 * Base model used to extend models from.
 * @class Model
 * @extends Model
 */
export class Model extends mixin(ObjectionModel, [
  TableName({ caseMapper: snakeCase }),
]) {
  static collection = Collection;

  /**
   * Build a query
   * @method buildQuery
   * @static
   * @param {Object} where Where clause.
   * @param {Object} options Options for the query.
   * @param {Object} trx Transaction object.
   * @returns {Array} JSON object.
   */
  static buildQuery(where, options, trx) {
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
        let valueWrapper =
          isArray(values) && operator !== '&&' ? 'any(?)' : '?';
        if (operator === '@@') {
          valueWrapper = 'to_tsquery(?)';
        }
        if (values === null) {
          query =
            operator === 'is not'
              ? query.whereNotNull(key)
              : query.whereNull(key);
        } else {
          query = query.whereRaw(`${attribute} ${operator} ${valueWrapper}`, [
            values,
          ]);
        }
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
      } else if (isArray(options.order)) {
        query = query.orderBy(
          map(options.order, (order) => ({
            column: order,
          })),
        );
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
          order = formatAttribute(options.order.column);
        }
        query = query.orderByRaw(
          `${order}${options.order.reverse ? ' DESC' : ''}`,
        );
      }
    }

    // Add paging options
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.offset(options.offset);
    }

    // Add related
    if (options.related) {
      query = query.withGraphFetched(options.related);
    }

    // Add select
    if (options.select) {
      query = query.select(...options.select);
    }

    // Return query
    return query;
  }

  /**
   * Add related items to the model.
   * @method fetchRelated
   * @param {string} graph Related graph.
   * @param {Object} trx Transaction object.
   */
  async fetchRelated(graph, trx) {
    // Get current keys
    const curKeys = keys(this);

    // Fetch related
    const related = await this.$fetchGraph(graph, { transaction: trx });

    // Get new keys
    const newKeys = difference(keys(related), curKeys);

    // Assign new props
    map(newKeys, (key) => (this[key] = related[key]));
  }

  /**
   * Fetch all items.
   * @method fetchAll
   * @static
   * @param {Object} where Where clause.
   * @param {Object} options Ooptions for the query.
   * @param {Object} trx Transaction object.
   * @returns {Array} JSON object.
   */
  static async fetchAll(where = {}, options = {}, trx) {
    let models = await this.buildQuery(where, options, trx);
    return new this.collection(models);
  }

  /**
   * Fetch one item.
   * @method fetchOne
   * @static
   * @param {Object} where Where clause.
   * @param {Object} options Ooptions for the query.
   * @param {Object} trx Transaction object.
   * @returns {Object} Model of the item.
   */
  static async fetchOne(where = {}, options = {}, trx) {
    return await this.buildQuery(where, options, trx).first();
  }

  /**
   * Fetch by id.
   * @method fetchById
   * @static
   * @param {string} id Id to be searched for
   * @param {Object} options Options for the query.
   * @param {Object} trx Transaction object.
   * @returns {Object} Model of the item.
   */
  static async fetchById(id, options = {}, trx) {
    return await this.buildQuery({}, options, trx).findById(id);
  }

  /**
   * Delete model
   * @method delete
   * @static
   * @param {Object} trx Transaction object.
   * @returns {Promise} Promise resolved when model deleted.
   */
  async delete(trx) {
    return await this.$query(trx).delete();
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
  static async create(data, options = {}, trx) {
    const relations = keys(this.getRelations());
    let own = omit(data, relations);
    let model = await this.query(trx).insertAndFetch(own);
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
    /*
    if (options.related) {
      await model.fetchRelated(options.related, trx);
    }
    */
    return model;
  }

  /**
   * Create related in model.
   * @method createRelated
   * @param {string} related Related field.
   * @param {Object} data Model data.
   * @param {Object} trx Transaction object.
   * @returns {Object} Model of the inserted record
   */
  async createRelated(related, data, trx) {
    return await this.$relatedQuery(related, trx).insertGraph(data);
  }

  /**
   * Create related in model and fetch it.
   * @method createRelatedAndFetch
   * @param {string} related Related field.
   * @param {Object} data Model data.
   * @param {Object} trx Transaction object.
   * @returns {Object} Model of the inserted record
   */
  async createRelatedAndFetch(related, data, trx) {
    return await this.$relatedQuery(related, trx).insertGraphAndFetch(data);
  }

  /**
   * Update model.
   * @method update
   * @param {Object} data Model data.
   * @param {Object} trx Transaction object.
   */
  async update(data, trx) {
    await this.$query(trx).patch(data);
  }

  /**
   * Update and fetch model.
   * @method updateAndFetch
   * @param {Object} data Model data.
   * @param {Object} trx Transaction object.
   */
  async updateAndFetch(data, trx) {
    await this.$query(trx).patchAndFetch(data);
  }

  /**
   * Update model.
   * @method update
   * @static
   * @param {string} id Id of the model.
   * @param {Object} data Model data.
   * @param {Object} trx Transaction object.
   * @returns {Object} Model of the updated record
   */
  static async update(id, data, trx) {
    const relationObjects = this.getRelations();
    const relations = keys(relationObjects);
    let own = removeUndefined(omit(data, relations));
    let model;
    if (isEmpty(own)) {
      model = await this.fetchById(id, {}, trx);
    } else {
      model = await this.query(trx).updateAndFetchById(id, own);
    }
    await Promise.all(
      map(relations, async (related) => {
        if (isArray(data[related])) {
          await model.$relatedQuery(related, trx).unrelate();
          await Promise.all(
            map(data[related], async (item) => {
              // Ignore insert related errors
              try {
                await model.$relatedQuery(related, trx).relate(item);
              } catch (e) {
                log.warn(`Can not relate ${item} to ${id}`);
              }
            }),
          );
        } else if (isObject(data[related])) {
          await Promise.all(
            map(keys(data[related]), async (key) => {
              if (data[related][key]) {
                // Ignore insert related errors
                try {
                  await model.$relatedQuery(related, trx).relate(key);
                } catch (e) {
                  log.warn(`Can not relate ${key} to ${id}`);
                }
              } else {
                await model
                  .$relatedQuery(related, trx)
                  .unrelate()
                  .where({
                    [`${relationObjects[related].relatedModelClass.tableName}.${relationObjects[related].relatedProp.cols[0]}`]:
                      key,
                  });
              }
            }),
          );
        }
      }),
    );
    return model;
  }

  /**
   * Returns vocabulary data.
   * @method getVocabulary
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  getVocabulary(req) {
    return {
      title: req.i18n(this.title),
      token: this.id,
    };
  }
}
