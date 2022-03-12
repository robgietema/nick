/**
 * Base repository that provides common actions for Bookshelf models.
 * @module common/base-repository
 */

import autobind from 'autobind-decorator';
import { keys, map, isArray } from 'lodash';

@autobind
/**
 * Base repository.
 * Do not forget to add the autobind decorator when extending.
 * @class BaseRepository
 */
export default class BaseRepository {
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
    if (isArray(where)) {
      return this.Model.where(...where)
        .query('orderByRaw', order)
        .fetchAll(options);
    }
    return this.Model.query((qb) => {
      map(keys(where), (key) => {
        qb.whereRaw(
          // user is a reserved word so needs to be wrapper in quotes
          `${key === 'user' ? '"user"' : key} ${
            isArray(where[key]) ? where[key][0] : '='
          } ?`,
          [isArray(where[key]) ? where[key][1] : where[key]],
        );
      });
    })
      .query('orderByRaw', order)
      .fetchPage(options);
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
  delete(where, options = {}) {
    return this.findAll(where).then((records) =>
      records.map((record) => record.destroy(options)),
    );
  }
}
