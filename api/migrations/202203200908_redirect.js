export const up = (knex) =>
  knex.schema.createTable('redirect', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('document').notNull();
    table.string('path').notNull();
    table.string('redirect').notNull();
  });

export const down = (knex) => knex.schema.dropTable('redirect');
