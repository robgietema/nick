/**
 * Middleware to work better with Volto.
 * @module volto
 */
import { Request, Response, NextFunction } from 'express';

// Export middleware
export function removeZopeVhosting(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.url = req.url.replace(/\/VirtualHostBase.*\/VirtualHostRoot/, '');
  next();
}
