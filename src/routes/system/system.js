/**
 * System route.
 * @module routes/system/system
 */

import { Model } from '../../models';
import { getRootUrl } from '../../helpers';
import packageJson from '../../../package.json';

export default [
  {
    op: 'get',
    view: '/@system',
    permission: 'Manage Site',
    handler: async (req, trx) => {
      const knex = Model.knex();
      const postgres = await knex.raw('show server_version').transacting(trx);

      return {
        json: {
          '@id': `${getRootUrl(req)}/@system`,
          nick_version: packageJson.version,
          node_version: process.version,
          express_version: packageJson.dependencies.express,
          objection_version: packageJson.dependencies.objection,
          knex_version: packageJson.dependencies.knex,
          postgres_version: postgres.rows[0].server_version,
        },
      };
    },
  },
];
