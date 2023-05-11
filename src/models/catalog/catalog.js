/**
 * Catalog Model.
 * @module models/catalog/catalog
 */

import { concat, map, pick, uniq } from 'lodash';

import { fileExists, getRootUrl, stripI18n } from '../../helpers';
import { Model } from '../../models';

const { config } = require(`${process.cwd()}/config`);

/**
 * A model for Catalog.
 * @class Catalog
 * @extends Model
 */
export class Catalog extends Model {
  static idColumn = 'document';

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  toJSON(req) {
    let metadata = [];

    map(config.profiles, (profilePath) => {
      if (fileExists(`${profilePath}/catalog`)) {
        const profile = stripI18n(require(`${profilePath}/catalog`));
        metadata = [...metadata, ...profile.metadata];
      }
    });

    return {
      '@id': `${getRootUrl(req)}${this.path}`,
      '@type': this.Type,
      title: this.Title,
      ...pick(
        this,
        map(metadata, (field) => field.name),
      ),
    };
  }

  /**
   * Fetch all items but take permissions into account.
   * @method fetchAllRestricted
   * @static
   * @param {Object} where Where clause.
   * @param {Object} options Ooptions for the query.
   * @param {Object} trx Transaction object.
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  static async fetchAllRestricted(where = {}, options = {}, trx, req) {
    // Find user, groups and roles
    const userGroupsRoles = uniq(
      concat(
        [req.user.id],
        req.user._groups.map((groups) => groups.id),
        req.user.getRoles(),
      ),
    );

    // Fetch data
    return this.fetchAll(
      { ...where, _allowedUsersGroupsRoles: ['&&', userGroupsRoles] },
      options,
      trx,
    );
  }
}
