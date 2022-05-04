/**
 * Utils.
 * @module helpers/utils/utils
 */

import { keys, map, omitBy } from 'lodash';

/**
 * Map asynchronous but in order through array
 * @method mapAsync
 * @param {Array} array Array to be looped over
 * @param {function} call Callback function
 * @returns {Promise} Promise which returns when all callbacks are done
 */
export async function mapAsync(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i);
  }
}

/**
 * Map synchronous through array
 * @method mapSync
 * @param {Array} array Array to be looped over
 * @param {function} call Callback function
 */
export function mapSync(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i);
  }
}

/**
 * Create a unique id
 * @method uniqueId
 * @param {String} id Base id.
 * @param {Array<String>} ids Array of sibling ids.
 * @param {Number} counter Current iteration.
 * @returns {String} Unique id.
 */
export function uniqueId(id, ids, counter = 0) {
  const newId = counter === 0 ? id : `${id}-${counter}`;
  return ids.indexOf(newId) === -1 ? newId : uniqueId(id, ids, counter + 1);
}

/**
 * Remove undefined
 * @method removeUndefined
 * @param {Object} object Object to remove undefined values from.
 * @returns {Object} Cleaned up object.
 */
export function removeUndefined(object) {
  return omitBy(object, (value) => typeof value === 'undefined');
}

/**
 * Stringify and fix uuid fields
 * @method stringify
 * @param {Object} object Object to stringify
 * @returns {string} Stringified object
 */
export function stringify(object) {
  return JSON.stringify(
    object,
    (key, value) => {
      if (
        value.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        )
      ) {
        return '<UUID>';
      }
      return value;
    },
    '  ',
  );
}

/**
 * Convert array to vocabulary
 * @method arrayToVocabulary
 * @param {Array} items Items to be converted
 * @returns {Array} Array of terms
 */
export function arrayToVocabulary(items) {
  return map(items, (item) => ({
    title: item,
    token: item,
  }));
}

/**
 * Convert object to vocabulary
 * @method objectToVocabulary
 * @param {Object} items Items to be converted
 * @returns {Array} Array of terms
 */
export function objectToVocabulary(items) {
  return map(keys(items), (key) => ({
    title: items[key],
    token: key,
  }));
}

/**
 * Checks if variable is a promise
 * @method isPromise
 * @param {*} variable Variable to be checked
 * @returns {boolean} True if variable is a promise
 */
export function isPromise(variable) {
  return typeof variable === 'object' && typeof variable.then === 'function';
}
