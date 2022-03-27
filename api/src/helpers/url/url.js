/**
 * Url helper.
 * @module helpers/url/url
 */

/**
 * Get url
 * @method getUrl
 * @param {Object} req Request object
 * @returns {string} Url
 */
export function getUrl(req) {
  return `${req.protocol}://${req.headers.host}${
    req.document.get('path') === '/' ? '' : req.document.get('path')
  }`;
}
