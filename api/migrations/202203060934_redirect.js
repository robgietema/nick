exports.up = (knex) =>
  knex.schema.createTable('redirect', (table) => {
    table.string('path').notNull().primary();
    table.string('redirect').notNull();
  });

exports.down = (knex) => knex.schema.dropTable('redirect');
