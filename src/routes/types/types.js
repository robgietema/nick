/**
 * Types routes.
 * @module routes/types/types
 */

import { omit } from 'lodash';

import { RequestException, translateSchema } from '../../helpers';
import { Type } from '../../models';

export const handler = async (req, trx) => {
  const types = await Type.fetchAll({}, {}, trx);
  return {
    json: types.toJSON(req),
  };
};

export default [
  {
    op: 'get',
    view: '/@types',
    permission: 'View',
    handler,
  },
  {
    op: 'get',
    view: '/@types/:type',
    permission: 'View',
    handler: async (req, trx) => {
      const type = await Type.fetchById(req.params.type, {}, trx);
      if (!type) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: {
          ...translateSchema(omit(type._schema, ['behaviors']), req),
          title: req.i18n(type.title),
        },
      };
    },
  },
];
