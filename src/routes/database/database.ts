/**
 * Database route.
 * @module routes/database/database
 */

import du from 'du';

import models from '../../models';
import { formatSize } from '../../helpers/format/format';
import { getRootUrl } from '../../helpers/url/url';
import type { Knex } from 'knex';
import type { Request } from '../../types';

import config from '../../helpers/config/config';

export default [
  {
    op: 'get',
    view: '/@database',
    permission: 'Manage Site',
    client: 'getDatabase',
    cache: 'manage',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const Document = models.get('Document');
      // Get db size
      const knex = Document.knex();
      const postgres = await knex
        .raw("select pg_database_size('nick')")
        .transacting(trx);

      // Return database information
      return {
        json: {
          '@id': `${getRootUrl(req)}/@database`,
          db_name: config.settings.connection.database,
          db_size: formatSize(postgres.rows[0].pg_database_size),
          blob_size: formatSize(
            config.settings.blobs === 'file'
              ? await du(config.settings.blobsDir)
              : 0,
          ),
        },
      };
    },
  },
];
