export const up = async (knex) => {
  await knex.schema.createTable('controlpanel', (table) => {
    table.string('id').primary();
    table.string('title');
    table.string('group');
    table.jsonb('schema').notNull();
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('controlpanel');
};
