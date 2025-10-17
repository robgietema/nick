/**
 * Limiter helper.
 * @module helpers/limiter/limiter
 */

import { rateLimit } from 'express-rate-limit';
const { config } = require(`${process.cwd()}/config`);

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit?.api || 100,
  message: { message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit?.auth || 5,
  message: { message: 'Too many authentication attempts' },
  standardHeaders: true,
  legacyHeaders: false,
});
