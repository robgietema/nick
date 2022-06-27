/**
 * Knex setup.
 * @module knex
 */

import Knex from 'knex';

import { config } from '../../../config';

// Initialize knex.
export const knex = Knex({
  client: 'pg',
  connection: config.connection,
});

// Debug
knex.on('query', (query) => {
  // console.log(query);
});

/**
 * Start transaction
 * @method startTransaction
 * @returns {Object} Transaction object.
 */
export function startTransaction() {
  return knex.transaction();
}

/**
 * Rollback transaction
 * @method rollbackTransaction
 * @param {Object} trx Transaction object
 * @returns {Boolean} True if succeeded
 */
export function rollbackTransaction(trx) {
  return trx.rollback();
}

/**
 * Commit transaction
 * @method commitTransaction
 * @param {Object} trx Transaction object
 * @returns {Boolean} True if succeeded
 */
export function commitTransaction(trx) {
  return trx.commit();
}

/**
 * Get postgres version
 * @method getPostgresVersion
 * @param {Object} trx Transaction object
 * @returns {String} Postgres version.
 */
export async function getPostgresVersion(trx) {
  const postgres = await knex.raw('show server_version').transacting(trx);
  return postgres.rows[0].server_version;
}
