/**
 * File system helper.
 * @module helpers/fs/fs
 */

import { isArray, isObject, mapKeys, mapValues, map } from 'lodash';

export function stripI18n(node) {
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
