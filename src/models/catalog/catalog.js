/**
 * Catalog Model.
 * @module models/catalog/catalog
 */

import { Model } from '../../models';

/**
 * A model for Catalog.
 * @class Catalog
 * @extends Model
 */
export class Catalog extends Model {
  static idColumn = 'document';
}
