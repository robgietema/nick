export const up = async (knex) => {
  await knex.schema.alterTable('document', (table) => {
    table.uuid('translation_group').index();
    table.string('language').index();
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable('document', (table) => {
    table.dropColumn('translation_group');
    table.dropColumn('language');
  });
};
