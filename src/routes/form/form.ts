/**
 * Form routes.
 * @module routes/form/form
 */

import { Request } from '../../types';
import type { Knex } from 'knex';

export default [
  {
    op: 'post',
    view: '/@schemaform-data',
    permission: 'View',
    client: 'schemaformData',
    handler: async (req: Request, trx: Knex.Transaction) => {
      return {
        json: {},
      };
    },
  },
];
