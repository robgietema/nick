/**
 * Middleware to work better with Volto.
 * @module volto
 */

// Export middleware
export function removeZopeVhosting(req, res, next) {
  req.url = req.url.replace(/\/VirtualHostBase.*\/VirtualHostRoot/, '');
  next();
}
