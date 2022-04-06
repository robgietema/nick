/**
 * Error helper.
 * @module helpers/error/error
 */

/**
 * Base collection used to extend collections from.
 * @class Collection
 */
export class RequestException {
  /**
   * Construct a Collection.
   * @constructs Collection
   */
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}
