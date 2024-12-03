export const up = async (knex) => {
  await knex.schema.alterTable('index', (table) => {
    table.string('name');
    table.string('type');
    table.boolean('metadata').index();
    table.string('attr');
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable('index', (table) => {
    table.dropColumn('name');
    table.dropColumn('type');
    table.dropColumn('metadata');
    table.dropColumn('attr');
  });
};
