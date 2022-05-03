export const up = (knex) =>
  knex.schema.createTable('redirect', (table) => {
    table
      .uuid('document')
      .notNull()
      .references('document.uuid')
      .onDelete('CASCADE');
    table.string('path').notNull().index();
    table.primary(['document', 'path']);
  });

export const down = (knex) => knex.schema.dropTable('redirect');
