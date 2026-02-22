/**
 * Version Model.
 * @module models/version/version
 */

import { Model } from '../../models/_model/_model';
import { getRootUrl, getUrl } from '../../helpers/url/url';
import type { Json, Request } from '../../types';

import { User } from '../../models/user/user';

/**
 * A model for Version.
 * @class Version
 * @extends Model
 */
export class Version extends Model {
  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports

    return {
      _actor: {
        relation: (Model as any).BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'version.actor',
          to: 'user.id',
        },
      },
    };
  }

  // Modifiers
  static modifiers: any = {
    order(query: any) {
      query.orderBy('version', 'desc');
    },
  };

  /**
   * Returns JSON data.
   * @method toJson
   * @param {Request} req Request object.
   * @returns {Json} JSON object.
   */
  toJson(req: Request): Json {
    const self: any = this;
    return {
      '@id': `${getUrl(req)}/@history/${self.version}`,
      action: 'Edited',
      actor: {
        '@id': `${getRootUrl(req)}/@users/${self._actor?.id}`,
        fullname: self._actor?.fullname,
        id: self._actor?.id,
        username: self._actor?.id,
      },
      comments: (self.json || {}).changeNote,
      may_revert: true,
      time: self.created,
      transition_title: 'Edited',
      type: 'versioning',
      version: self.version,
    } as Json;
  }
}
