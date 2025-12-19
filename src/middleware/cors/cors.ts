/**
 * Cors middleware.
 * @module cors
 */
import { Request, Response, NextFunction } from 'express';

import config from '../../helpers/config/config';

// Export middleware
export function cors(_req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', config.settings.cors.allowOrigin);
  res.header('Access-Control-Allow-Headers', config.settings.cors.allowHeaders);
  res.header('Access-Control-Allow-Methods', config.settings.cors.allowMethods);
  res.header(
    'Access-Control-Allow-Credentials',
    config.settings.cors.allowCredentials ? 'true' : 'false',
  );
  res.header(
    'Access-Control-Expose-Headers',
    config.settings.cors.exposeHeaders,
  );
  res.header('Access-Control-Max-Age', `${config.settings.cors.maxAge}`);
  next();
}
