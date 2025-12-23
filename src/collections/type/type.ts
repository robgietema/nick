/**
 * TypeCollection.
 * @module collections/type/type
 */

import { getRootUrl } from '../../helpers/url/url';
import { hasPermission } from '../../helpers/auth/auth';
import { Collection } from '../../collections/_collection/_collection';
import type { Json, Model, Request } from '../../types';

interface TypeModel extends Model {
  id: string;
  title: string;
  global_allow: boolean;
}

/**
 * Type Collection
 * @class TypeCollection
 * @extends Collection
 */
export class TypeCollection extends Collection<TypeModel> {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {CustomRequest} req Request object.
   * @returns {Promise<TypeResponse[]>} JSON object.
   */
  async toJSON(req: Request): Promise<Json> {
    return ((await super.toJSON(req)) as any).map((model: TypeModel) => ({
      '@id': `${getRootUrl(req)}/@types/${model.id}`,
      addable:
        hasPermission(req.permissions, 'Add') &&
        (req.type.filter_content_types
          ? req.type.allowed_content_types.includes(model.id)
          : model.global_allow),
      title: req.i18n(model.title),
    }));
  }
}
