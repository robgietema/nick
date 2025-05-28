/**
 * Url helper.
 * @module helpers/url/url
 */

import type { Request } from '../../types';

const { config } = require(`${process.cwd()}/config`);

/**
 * Get url
 * @method getUrl
 * @param {Request} req Request object
 * @returns {string} Url
 */
export function getUrl(req: Request): string {
  return `${req.apiPath}${req.document.path === '/' ? '' : req.document.path}`;
}

/**
 * Get url by path
 * @method getUrlByPath
 * @param {Request} req Request object
 * @param {string} path Path
 * @returns {string} Url
 */
export function getUrlByPath(req: Request, path: string): string {
  return `${req.apiPath}${path === '/' ? '' : path}`;
}

/**
 * Get root url
 * @method getRootUrl
 * @param {Request} req Request object
 * @returns {string} Url
 */
export function getRootUrl(req: Request): string {
  return req.apiPath;
}

/**
 * Get path
 * @method getPath
 * @param {Request} req Request object
 * @returns {string} Path
 */
export function getPath(req: Request): string {
  return (req.documentPath as string).replace(config.prefix, '');
}
