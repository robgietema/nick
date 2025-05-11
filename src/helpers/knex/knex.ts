/**
 * Knex setup.
 * @module knex
 */

import knexPkg, { Knex } from 'knex';

const { config } = require(`${process.cwd()}/config`);

// Initialize knex with proper types
export const knex = knexPkg({
  client: 'pg',
  connection: config.connection,
});

// Debug
knex.on('query', (query: Knex.QueryBuilder) => {
  // console.log(query);
});

/**
 * Get postgres version
 * @method getPostgresVersion
 * @param {Transaction} trx Transaction object
 * @returns {Promise<string>} Postgres version.
 */
export async function getPostgresVersion(
  trx: Knex.Transaction,
): Promise<string> {
  const postgres = await knex.raw('show server_version').transacting(trx);
  return postgres.rows[0].server_version;
}
