/**
 * System route.
 * @module routes/system/system
 */

import { getRootUrl, getPostgresVersion, getNodeVersion } from '../../helpers';
import packageJson from '../../../package.json';

export default [
  {
    op: 'get',
    view: '/@system',
    permission: 'Manage Site',
    handler: async (req, trx) => {
      const postgresVersion = await getPostgresVersion(trx);

      return {
        json: {
          '@id': `${getRootUrl(req)}/@system`,
          nick_version: packageJson.version,
          node_version: getNodeVersion(),
          express_version: packageJson.dependencies.express,
          objection_version: packageJson.dependencies.objection,
          knex_version: packageJson.dependencies.knex,
          postgres_version: postgresVersion,
        },
      };
    },
  },
];
