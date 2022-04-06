export const up = (knex) =>
  knex.schema.createTable('redirect', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('document').notNull().references('document.uuid');
    table.string('path').notNull();
  });

export const down = (knex) => knex.schema.dropTable('redirect');