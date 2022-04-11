export const up = async (knex) => {
  await knex.schema.createTable('behavior', (table) => {
    table.string('id').primary().notNull();
    table.string('title').notNull();
    table.string('description');
    table.jsonb('schema').notNull();
  });
  await knex.schema.createTable('type', (table) => {
    table.string('id').primary().notNull();
    table.string('title').notNull();
    table.string('description');
    table.boolean('global_allow');
    table.boolean('filter_content_types');
    table.jsonb('allowed_content_types').notNull();
    table.jsonb('schema').notNull();
    table.jsonb('_schema');
    table
      .string('workflow')
      .references('workflow.id')
      .notNull()
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('type');
  await knex.schema.dropTable('behavior');
};
