/**
 * Error helper.
 * @module helpers/error/error
 */

export type Status = 301 | 302 | 400 | 401 | 403 | 404 | 500;
export type Message =
  | string
  | {
      message: string;
    }
  | {
      error: string;
    }
  | {
      error: {
        type: string;
        message: string;
      };
    };

/**
 * Base collection used to extend collections from.
 * @class Collection
 */
export class RequestException {
  status: Status;
  message: Message;

  /**
   * Construct a Collection.
   * @constructs Collection
   */
  constructor(status: Status, message: Message) {
    this.status = status;
    this.message = message;
  }
}
