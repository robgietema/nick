export const up = async (knex) => {
  await knex.schema.createTable('behavior', (table) => {
    table.string('id').primary().notNull();
    table.string('title').notNull();
    table.string('description');
    table.jsonb('schema').notNull();
    table.jsonb('behaviors').notNull();
  });
  await knex.schema.createTable('type', (table) => {
    table.string('id').primary().notNull();
    table.string('title').notNull();
    table.string('description');
    table.boolean('addable');
    table.jsonb('schema').notNull();
    table.jsonb('behaviors').notNull();
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
