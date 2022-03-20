export const up = (knex) =>
  knex.schema.createTable('workflow', (table) => {
    table.string('id').primary();
    table.string('title').notNull();
    table.string('description');
    table.jsonb('json').notNull();
  });

export const down = (knex) => knex.schema.dropTable('workflow');
