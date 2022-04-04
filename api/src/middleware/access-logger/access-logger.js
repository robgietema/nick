/**
 * Log.
 * @module log
 */

import { logger } from '../../helpers';
import moment from 'moment';

// Create access logger
const access = logger.getLogger('access');

// Access logger middleware
export function accessLogger(req, res, next) {
  function onResFinished() {
    access.info(
      `${req.hostname} - ${req.user.id} [${req.timestamp}] "${req.method} ${
        req.originalUrl
      } HTTP/${req.httpVersion}" ${res.statusCode} ${
        res._contentLength || '-'
      } "-" "${req.get('User-Agent')}"`,
    );
  }
  req.timestamp = moment.utc().format();
  res.on('finish', onResFinished);
  res.on('error', onResFinished);
  next();
}
