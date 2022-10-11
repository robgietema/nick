/**
 * Database route.
 * @module routes/database/database
 */

import du from 'du';

import { Model } from '../../models';
import { formatSize, getRootUrl } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);
const knexfile = require(`${process.cwd()}/knexfile`);

export default [
  {
    op: 'get',
    view: '/@database',
    permission: 'Manage Site',
    handler: async (req, trx) => {
      // Get db size
      const knex = Model.knex();
      const postgres = await knex
        .raw("select pg_database_size('nick')")
        .transacting(trx);

      // Return database information
      return {
        json: {
          '@id': `${getRootUrl(req)}/@database`,
          db_name: config.connection.database,
          db_size: formatSize(postgres.rows[0].pg_database_size),
          pool: knexfile.production.pool,
          blob_size: formatSize(await du(config.blobsDir)),
        },
      };
    },
  },
];
