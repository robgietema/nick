/**
 * Url helper.
 * @module helpers/url/url
 */

import { config } from '../config';

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

/**
 * Get path
 * @method getPath
 * @param {Object} req Request object
 * @returns {string} Path
 */
export function getPath(req) {
  return req.params[0].replace(config.prefix, '');
}
