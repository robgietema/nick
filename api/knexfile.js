var path = require('path');
var config = require('./config');

const knexSettings = {
  client: 'pg',
  connection: config.connection,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.resolve(__dirname, './migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.resolve(__dirname, './seeds'),
  },
};

module.exports = {
  development: knexSettings,
  production: knexSettings,
};
