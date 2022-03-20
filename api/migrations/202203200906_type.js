export const up = (knex) =>
  knex.schema.createTable('type', (table) => {
    table.string('id').primary().notNull();
    table.string('title').notNull();
    table.boolean('addable');
    table.jsonb('schema').notNull();
    table
      .string('workflow')
      .references('workflow.id')
      .notNull()
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });

export const down = (knex) => knex.schema.dropTable('type');
