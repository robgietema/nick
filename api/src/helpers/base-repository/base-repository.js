/**
 * Base repository that provides common actions for Bookshelf models.
 * @module common/base-repository
 */

import { keys, map, isArray } from 'lodash';
import bookshelf from '../../bookshelf';

/**
 * Base repository.
 * Do not forget to add the autobind decorator when extending.
 * @class BaseRepository
 */
export class BaseRepository {
  /**
   * Create a BaseRepository for Model.
   * @constructs BaseRepository
   * @param {Object} Model that this Repository belongs to.
   */
  constructor(Model) {
    this.Model = Model;
  }

  /**
   * Find all Models.
   * @function findAll
   * @param {Object} where Bookshelf key/operator/value or attributes hash.
   * @param {String} order Order field.
   * @param {Object} options Bookshelf options to pass on to fetchAll.
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of Models.
   */
  findAll(where = {}, order = 'id', options = {}) {
    return this.Model.query((qb) => {
      map(keys(where), (key) => {
        // user and group are reserved words so need to be wrapper in quotes
        const field = key === 'user' || key === 'group' ? `"${key}"` : key;
        const operator = isArray(where[key]) ? where[key][0] : '=';
        const value = isArray(where[key]) ? where[key][1] : where[key];
        qb.whereRaw(`${field} ${operator} ${isArray(value) ? 'any(?)' : '?'}`, [
          value,
        ]);
      });
    })
      .query('orderByRaw', order === 'order' ? '"order"' : order)
      .fetchPage({ limit: 65535, ...options });
  }

  /**
   * Find one Model.
   * @function findOne
   * @param {Object|string} where Bookshelf key/operator/value or attributes hash.
   * @param {Object} [options] Bookshelf options to pass on to fetch.
   * @returns {Promise<Model>} A Promise that resolves to a Model.
   */
  findOne(where, options = {}) {
    return this.Model.where(where).fetch({
      require: true,
      ...options,
    });
  }

  /**
   * Create a new Model.
   * @function create
   * @param {Object} attributes An object containing key-value attributes of the Model.
   * @param {Object} [options] Bookshelf options to pass on to save.
   * @returns {Promise<Model>} A Promise that resolves to the created Model.
   */
  create(attributes, options = {}) {
    return new this.Model(attributes).save(null, options);
  }

  /**
   * Delete a Model.
   * @function delete
   * @param {Object|string} [where] Bookshelf key/operator/value or attributes hash.
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Promise<Model>} A promise resolving to the destroyed
   * and thus "empty" Model.
   */
  async delete(where, options = {}) {
    const records = await this.findAll(where);
    return await Promise.all(records.map((record) => record.destroy(options)));
  }

  /**
   * Create a transaction.
   * @function transaction
   * @param {Function} callback Callback funnction
   */
  transaction(callback) {
    bookshelf.transaction(callback);
  }
}
