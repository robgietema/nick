/**
 * Types routes.
 * @module routes/types/types
 */

import { omit } from 'lodash';

import { RequestException, translateSchema } from '../../helpers';
import { Type } from '../../models';

export default [
  {
    op: 'get',
    view: '/@types',
    permission: 'View',
    handler: async (req) => {
      const types = await Type.fetchAll();
      return {
        json: types.toJSON(req),
      };
    },
  },
  {
    op: 'get',
    view: '/@types/:type',
    permission: 'View',
    handler: async (req) => {
      const type = await Type.fetchById(req.params.type);
      if (!type) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      await type.fetchSchema();
      return {
        json: {
          ...translateSchema(omit(type._schema, ['behaviors']), req),
          title: req.i18n(type.title),
        },
      };
    },
  },
];
