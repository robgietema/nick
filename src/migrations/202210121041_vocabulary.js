export const up = async (knex) => {
  await knex.schema.createTable('vocabulary', (table) => {
    table.string('id').primary();
    table.string('title');
    table.jsonb('items').notNull();
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('vocabulary');
};
