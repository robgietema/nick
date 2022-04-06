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
    req.document.path === '/' ? '' : req.document.path
  }`;
}

/**
 * Get root url
 * @method getRootUrl
 * @param {Object} req Request object
 * @returns {string} Url
 */
export function getRootUrl(req) {
  return `${req.protocol}://${req.headers.host}`;
}
