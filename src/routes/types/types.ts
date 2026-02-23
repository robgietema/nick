/**
 * Types routes.
 * @module routes/types/types
 */

import { omit } from 'es-toolkit/object';

import { RequestException } from '../../helpers/error/error';
import { translateSchema } from '../../helpers/schema/schema';
import type { Request } from '../../types';
import type { Knex } from 'knex';

import { Type } from '../../models/type/type';

export const handler = async (req: Request, trx: Knex.Transaction) => {
  const types = await Type.fetchAll({}, {}, trx);
  return {
    json: await types.toJson(req),
  };
};

export default [
  {
    op: 'get',
    view: '/@types',
    permission: 'View',
    client: 'getTypes',
    handler,
  },
  {
    op: 'get',
    view: '/@types/:type',
    permission: 'View',
    client: 'getType',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const type = await Type.fetchById(req.params.type, {}, trx);
      if (!type) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: {
          ...translateSchema(omit(type._schema, ['behaviors']) as any, req),
          title: req.i18n(type.title),
        },
      };
    },
  },
];
