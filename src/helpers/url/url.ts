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
  apiPath: string;
  documentPath: string;
}

/**
 * Get url
 * @method getUrl
 * @param {RequestWithDocument} req Request object
 * @returns {string} Url
 */
export function getUrl(req: RequestWithDocument): string {
  return `${req.apiPath}${req.document.path === '/' ? '' : req.document.path}`;
}

/**
 * Get url by path
 * @method getUrlByPath
 * @param {Request} req Request object
 * @param {string} path Path
 * @returns {string} Url
 */
export function getUrlByPath(req: RequestWithDocument, path: string): string {
  return `${req.apiPath}${path === '/' ? '' : path}`;
}

/**
 * Get root url
 * @method getRootUrl
 * @param {Request} req Request object
 * @returns {string} Url
 */
export function getRootUrl(req: RequestWithDocument): string {
  return req.apiPath;
}

/**
 * Get path
 * @method getPath
 * @param {Request} req Request object
 * @returns {string} Path
 */
export function getPath(req: RequestWithDocument): string {
  return (req.documentPath as string).replace(config.prefix, '');
}
