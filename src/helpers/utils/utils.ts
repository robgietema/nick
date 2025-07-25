/**
 * Utils.
 * @module helpers/utils/utils
 */

import { keys, map, omitBy } from 'lodash';

/**
 * Map asynchronous but in order through array
 * @method mapAsync
 * @param {Array} array Array to be looped over
 * @param {function} callback Callback function
 * @returns {Promise} Promise which returns when all callbacks are done
 */
export async function mapAsync<Item>(
  array: Item[],
  callback: (item: Item, index: number) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i);
  }
}

/**
 * Map synchronous through array
 * @method mapSync
 * @param {Array} array Array to be looped over
 * @param {function} callback Callback function
 */
export function mapSync<Item>(
  array: Item[],
  callback: (item: Item, index: number) => void,
): void {
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
export function uniqueId(id: string, ids: string[], counter = 0): string {
  const newId = counter === 0 ? id : `${id}-${counter}`;
  return ids.indexOf(newId) === -1 ? newId : uniqueId(id, ids, counter + 1);
}

/**
 * Remove undefined
 * @method removeUndefined
 * @param {Object} object Object to remove undefined values from.
 * @returns {Object} Cleaned up object.
 */
export function removeUndefined<T extends object>(object: T): Partial<T> {
  return omitBy(object, (value) => typeof value === 'undefined');
}

interface VocabularyTerm {
  title: string;
  token: string;
}

/**
 * Convert array to vocabulary
 * @method arrayToVocabulary
 * @param {Array} items Items to be converted
 * @returns {Array} Array of terms
 */
export function arrayToVocabulary(items: string[]): VocabularyTerm[] {
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
export function objectToVocabulary(items: {
  [key: string]: string;
}): VocabularyTerm[] {
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
export function isPromise(variable: any): boolean {
  return typeof variable === 'object' && typeof variable.then === 'function';
}

/**
 * Escape string to be usable for regexps
 * @method regExpEscape
 * @param {String} string Input string
 * @returns {String} Escaped string
 */
export function regExpEscape(string: string): string {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Get the node version
 * @method getNodeVersion
 * @returns {String} Node version
 */
export function getNodeVersion(): string {
  return process.version;
}
