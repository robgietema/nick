exports.up = (knex) =>
  knex.schema.createTable('type', (table) => {
    table.string('id').primary().notNull();
    table.string('title').notNull();
    table.boolean('addable');
    table.json('schema').notNull();
  });

exports.down = (knex) => knex.schema.dropTable('type');
