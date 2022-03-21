/**
 * Bookshelf configuration.
 * @module bookshelf
 */

import bookshelf from 'bookshelf';
import knex from 'knex';

import config from '../config';

const Knex = knex({
  client: 'pg',
  connection: config.connection,
});

Knex.on('query', (query) => {
  // console.log(query);
});

const Bookshelf = bookshelf(Knex);

export default Bookshelf;
