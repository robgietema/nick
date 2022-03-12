/**
 * Format helper.
 * @module helpers/format/format
 */

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
