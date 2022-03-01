exports.up = (knex) =>
  knex.schema.createTable('user', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('id').unique().notNull();
    table.string('password').notNull();
    table.string('fullname');
  });

exports.down = (knex) => knex.schema.dropTable('user');
