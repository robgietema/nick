/**
 * Utils.
 * @module helpers/utils/utils
 */

/**
 * Map synchronous through array
 * @method mapSync
 * @param {Array} array Array to be looped over
 * @param {function} call Callback function
 * @returns {Promise} Promise which returns when all callbacks are done
 */
export async function mapSync(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i);
  }
}
