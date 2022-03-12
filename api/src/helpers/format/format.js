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
  if (bytes === 0) {
    return '0 B';
  }
  var e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (bytes / Math.pow(1024, e)).toFixed(0) + ' ' + ' KMGTP'.charAt(e) + 'B'
  );
}
