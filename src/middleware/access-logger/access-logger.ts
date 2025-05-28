/**
 * Log.
 * @module log
 */

import { logger } from '../../helpers';
import moment from 'moment';
import { Response, NextFunction } from 'express';
import type { Request } from '../../types';

// Create access logger
const access = logger.getLogger('access');

interface ResponseWithLog extends Response {
  _contentLength: number;
}

// Access logger middleware
export function accessLogger(
  req: Request,
  res: ResponseWithLog,
  next: NextFunction,
) {
  function onResFinished() {
    access.info(
      `${req.hostname} - ${(req.user && req.user.id) || 'anonymous'} [${
        req.timestamp
      }] "${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${
        res.statusCode
      } ${res._contentLength || '-'} "-" "${req.get('User-Agent')}"`,
    );
  }
  req.timestamp = moment.utc().format();
  res.on('finish', onResFinished);
  res.on('error', onResFinished);
  next();
}
