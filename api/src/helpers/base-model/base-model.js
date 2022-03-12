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
};

const classProps = {};

export default bookshelf.Model.extend(instanceProps, classProps);
