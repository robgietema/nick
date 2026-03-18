/**
 * Cache helper.
 * @module helpers/cache/cache
 */

import type { Response } from 'express';
import type { Request, Route } from '../../types';
import config from '../config/config';

/**
 * Apply cache
 * @method applyCache
 * @param {Response} res Response object
 */
export function applyCache(req: Request, res: Response, route: Route): void {
  // Add caching
  if (
    config.settings.cache.enabled &&
    ((config.settings.cache.anonymousOnly && req.user.id === 'anonymous') ||
      !config.settings.cache.anonymousOnly)
  ) {
    const cachePolicy = config.settings.cache.policies[route.cache];
    switch (cachePolicy.method) {
      case 'private':
      case 'public':
        res.set({
          'Cache-Policy': [
            cachePolicy.method,
            ...(typeof cachePolicy.maxAge === 'number'
              ? [`max-age=${cachePolicy.maxAge}`]
              : []),
            ...(typeof cachePolicy.sMaxAge === 'number'
              ? [`s-maxage=${cachePolicy.sMaxAge}`]
              : []),
            'must-revalidate',
          ].join(', '),
        });
        break;
      case 'no-cache':
      default:
        res.set({
          'Cache-Policy': ['no-cache', 'no-store', 'must-revalidate'].join(
            ', ',
          ),
        });
        break;
    }
  }
}
