/**
 * Bookshelf BaseModel.
 * @module helpers/base-model/base-model
 */

import { reduce, camelCase, snakeCase } from 'lodash';

import bookshelf from '../../bookshelf';

const instanceProps = {
  parse(attrs) {
    return reduce(
      attrs,
      (memo, val, key) => {
        memo[camelCase(key)] = val;
        return memo;
      },
      {},
    );
  },
  format(attrs) {
    return reduce(
      attrs,
      (memo, val, key) => {
        memo[snakeCase(key)] = val;
        return memo;
      },
      {},
    );
  },
  orderBy(column, order) {
    return this.query(qb => {
      qb.orderBy(column, order);
    });
  },
  updateWith(data) {
    this.keys().forEach(key => {
      if (key !== this.idAttribute && typeof data[key] !== 'undefined') {
        this.set(key, data[key]);
      }
    });
  },
};

const classProps = {};

export default bookshelf.Model.extend(instanceProps, classProps);
