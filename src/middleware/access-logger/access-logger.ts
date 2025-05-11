/**
 * Log.
 * @module log
 */

import { logger } from '../../helpers';
import moment from 'moment';
import { Request, Response, NextFunction } from 'express';

// Create access logger
const access = logger.getLogger('access');

interface RequestWithLog extends Request {
  timestamp: string;
  user: {
    id: string;
  };
}

interface ResponseWithLog extends Request {
  _contentLength: number;
}

// Access logger middleware
export function accessLogger(
  req: RequestWithLog,
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
