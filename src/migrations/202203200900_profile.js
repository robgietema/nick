export const up = async (knex) => {
  await knex.schema.createTable('profile', (table) => {
    table.string('id').primary();
    table.string('title');
    table.string('description');
    table.string('version');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('profile');
};
