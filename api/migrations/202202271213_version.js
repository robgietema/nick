exports.up = (knex) =>
  knex.schema.createTable('version', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.integer('version');
    table.dateTime('created');
    table.uuid('actor').references('user.uuid');
    table
      .uuid('document')
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('id').notNull();
    table.jsonb('json').notNull();
  });

exports.down = (knex) => knex.schema.dropTable('version');
