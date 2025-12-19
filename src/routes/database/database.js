/**
 * Database route.
 * @module routes/database/database
 */

import du from 'du';

import { Model } from '../../models/_model/_model';
import { formatSize } from '../../helpers/format/format';
import { getRootUrl } from '../../helpers/url/url';

import config from '../../helpers/config/config';

export default [
  {
    op: 'get',
    view: '/@database',
    permission: 'Manage Site',
    client: 'getDatabase',
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
          db_name: config.settings.connection.database,
          db_size: formatSize(postgres.rows[0].pg_database_size),
          blob_size: formatSize(await du(config.settings.blobsDir)),
        },
      };
    },
  },
];
