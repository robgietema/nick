/**
 * Lock helper.
 * @module helpers/lock/lock
 */

import moment from 'moment';

/**
 * Lock type
 * @typedef {object} Lock
 * @property {number} created Lock timestamp
 * @property {number} timeout Timeout time
 */
export interface Lock {
  created: number;
  timeout: number;
}

/**
 * Document type
 * @typedef {object} Document
 * @property {Lock} lock Lock information
 */
export interface Document {
  lock: Lock;
}

/**
 * Check if lock is expired
 * @method lockExpired
 * @param {Object} document Document to be checked
 * @returns {boolean} True if document lock is expired
 */
export function lockExpired(document: Document): boolean {
  const lock = document.lock;
  const created = moment(lock.created).unix();

  return moment.utc().unix() > created + lock.timeout;
}
