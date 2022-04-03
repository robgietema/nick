/**
 * Lock helper.
 * @module helpers/lock/lock
 */

import moment from 'moment';

/**
 * Check if lock is expired
 * @method lockExpired
 * @param {Object} document Document to be checked
 * @returns {Boolean} True if document lock is expired
 */
export function lockExpired(document) {
  const lock = document.lock;
  const created = moment(lock.created).unix();

  return moment.utc().unix() > created + lock.timeout;
}
