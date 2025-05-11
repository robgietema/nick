/**
 * Cors middleware.
 * @module cors
 */
import { Request, Response, NextFunction } from 'express';

const { config } = require(`${process.cwd()}/config`);

// Export middleware
export function cors(_req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', config.cors.allowOrigin);
  res.header('Access-Control-Allow-Headers', config.cors.allowHeaders);
  res.header('Access-Control-Allow-Methods', config.cors.allowMethods);
  res.header('Access-Control-Allow-Credentials', config.cors.allowCredentials);
  res.header('Access-Control-Expose-Headers', config.cors.exposeHeaders);
  res.header('Access-Control-Max-Age', config.cors.maxAge);
  next();
}
