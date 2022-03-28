/**
 * Format helper.
 * @module helpers/format/format
 */

import { includes, map } from 'lodash';

/**
 * Format size
 * @method formatSize
 * @param {number} bytes Size in bytes.
 * @returns {string} Formatted size.
 */
export function formatSize(bytes) {
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (bytes / Math.pow(1024, e)).toFixed(0) + ' ' + ' KMGTP'.charAt(e) + 'B'
  );
}

/**
 * Format attribute
 * @method formatAttribute
 * @param {string} attribute Input attribute name.
 * @returns {string} Formatted attribute.
 */
export function formatAttribute(attribute) {
  return includes(attribute, '->>')
    ? attribute
    : map(attribute.split('.'), (part) => `"${part}"`).join('.');
}
