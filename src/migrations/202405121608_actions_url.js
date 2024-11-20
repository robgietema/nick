export const up = async (knex) => {
  await knex.schema.alterTable('action', (table) => {
    table.string('url');
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable('action', (table) => {
    table.dropColumn('url');
  });
};
