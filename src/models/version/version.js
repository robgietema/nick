/**
 * Version Model.
 * @module models/version/version
 */

import { Model } from '../../models';
import { getRootUrl, getUrl } from '../../helpers';

/**
 * A model for Version.
 * @class Version
 * @extends Model
 */
export class Version extends Model {
  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { User } = require('../../models/user/user');

    return {
      _actor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'version.actor',
          to: 'user.id',
        },
      },
    };
  }

  // Modifiers
  static modifiers = {
    order(query) {
      query.orderBy('version', 'desc');
    },
  };

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  toJSON(req) {
    return {
      '@id': `${getUrl(req)}/@history/${this.version}`,
      action: 'Edited',
      actor: {
        '@id': `${getRootUrl(req)}/@users/${this._actor.id}`,
        fullname: this._actor.fullname,
        id: this._actor.id,
        username: this._actor.id,
      },
      comments: this.json.changeNote,
      may_revert: true,
      time: this.created,
      transition_title: 'Edited',
      type: 'versioning',
      version: this.version,
    };
  }
}
