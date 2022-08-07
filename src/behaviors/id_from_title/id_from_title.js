/**
 * Id from title behavior.
 * @module behaviors/id_from_title/id_from_title
 */

import slugify from 'slugify';

import { uniqueId } from '../../helpers';

/**
 * Id from title behavior.
 * @constant id_from_title
 */
export const id_from_title = {
  /**
   * Set id
   * @method getId
   * @param {string} id Provided id (can be empty)
   * @param {Array} blacklist Blacklist ids
   * @returns {string} Id
   */
  setId: function (id, blacklist) {
    this.id = uniqueId(
      id || slugify(this.json.title, { lower: true, remove: /[*+~.()'"!:@]/g }),
      blacklist,
    );
  },
};
