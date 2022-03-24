export const up = async (knex) => {
  await knex.schema.createTable('permission', (table) => {
    table.string('id').primary();
    table.string('title');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('permission');
};
