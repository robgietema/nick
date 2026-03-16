/**
 * Redirect Model.
 * @module models/redirect/redirect
 */

import type { Knex } from 'knex';
import type { Json, Request } from '../../types';
import { Model } from '../../models/_model/_model';
import { Document } from '../../models/document/document';

/**
 * A model for Redirect.
 * @class Redirect
 * @extends Model
 */
export class Redirect extends Model {
  // Id column
  static get idColumn(): string[] {
    return ['document', 'path'];
  }

  // Set relation mappings
  static get relationMappings() {
    return {
      _document: {
        relation: (Model as any).BelongsToOneRelation,
        modelClass: Document as any,
        join: {
          from: 'redirect.document',
          to: 'document.uuid',
        },
      },
    };
  }

  /**
   * Returns JSON data.
   * @method toJson
   * @param {Request} req Request object.
   * @returns {Json} JSON object.
   */
  toJson(req: Request): Json {
    const self: any = this;
    return {
      path: self.path,
      manual: self.manual,
      datetime: self.datetime,
      'redirect-to': self._document ? self._document.path : null,
    } as Json;
  }

  /**
   * Fetch by path
   * @method fetchByPath
   * @static
   * @param {string} path Path to check
   * @param {Knex.Transaction} trx Transaction object.
   * @returns {Promise<any>} Document model or false.
   */
  static fetchByPath(path: string, trx?: Knex.Transaction): Promise<any> {
    return this.fetchOne(
      {
        path,
      },
      { related: '_document' },
      trx,
    );
  }
}
