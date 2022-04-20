export const up = (knex) =>
  knex.schema.createTable('redirect', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('document')
      .notNull()
      .references('document.uuid')
      .onDelete('CASCADE');
    table.string('path').notNull().index();
  });

export const down = (knex) => knex.schema.dropTable('redirect');
