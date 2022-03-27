/**
 * Knex setup.
 * @module knex
 */

import Knex from 'knex';

import { config } from '../config';

// Initialize knex.
export const knex = Knex({
  client: 'pg',
  connection: config.connection,
});

// Debug
knex.on('query', (query) => {
  console.log(query);
});
