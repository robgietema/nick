/**
 * File system helper.
 * @module helpers/fs/fs
 */

import { isArray, isObject, mapKeys, mapValues, map } from 'lodash';

/**
 * Node of an object
 * @typedef {*} Node
 */
export type Node = any;

/**
 * Strip i18n
 * @method stripI18n
 * @param {Node} node Node to be stripped
 * @returns {Node} Node stripped of i18n data
 */
export function stripI18n(node: Node): Node {
  if (isArray(node)) {
    return map(node, (child) => stripI18n(child));
  } else if (isObject(node)) {
    return mapValues(
      mapKeys(node, (value, key) => key.replace(/:i18n$/, '')),
      (value) => stripI18n(value),
    );
  } else {
    return node;
  }
}
