/**
 * Url helper.
 * @module helpers/url/url
 */

import { Request } from 'express';

const { config } = require(`${process.cwd()}/config`);

// Extend Express Request to include document property
interface RequestWithDocument extends Request {
  document: {
    path: string;
  };
}

/**
 * Get url
 * @method getUrl
 * @param {RequestWithDocument} req Request object
 * @returns {string} Url
 */
export function getUrl(req: RequestWithDocument): string {
  return `${req.protocol}://${req.headers.host}${
    req.document.path === '/' ? '' : req.document.path
  }`;
}

/**
 * Get url by path
 * @method getUrlByPath
 * @param {Request} req Request object
 * @param {string} path Path
 * @returns {string} Url
 */
export function getUrlByPath(req: Request, path: string): string {
  return `${req.protocol}://${req.headers.host}${path === '/' ? '' : path}`;
}

/**
 * Get root url
 * @method getRootUrl
 * @param {Request} req Request object
 * @returns {string} Url
 */
export function getRootUrl(req: Request): string {
  return `${req.protocol}://${req.headers.host}`;
}

/**
 * Get path
 * @method getPath
 * @param {Request} req Request object
 * @returns {string} Path
 */
export function getPath(req: Request): string {
  return (req.params[0] as string).replace(config.prefix, '');
}
