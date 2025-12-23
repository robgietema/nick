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
export function formatSize(bytes: number): string {
  const exponent = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, exponent)).toFixed(0)}${
    exponent === 0 ? '' : ' '
  }${' KMGTP'.charAt(exponent)}B`;
}

/**
 * Format attribute
 * @method formatAttribute
 * @param {string} attribute Input attribute name.
 * @returns {string} Formatted attribute.
 */
export function formatAttribute(attribute: string): string {
  return attribute.includes('->>') || attribute.includes('(')
    ? attribute
    : attribute
        .split('.')
        .map((part) => `"${part}"`)
        .join('.');
}
