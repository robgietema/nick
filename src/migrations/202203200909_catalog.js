export const up = async (knex) => {
  await knex.schema.createTable('catalog', (table) => {
    table
      .uuid('document')
      .primary()
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
  await knex.schema.createTable('index', (table) => {
    table.string('id').primary();
    table.string('title');
    table.string('description');
    table.string('group');
    table.boolean('enabled');
    table.boolean('sortable');
    table.jsonb('operators');
    table.string('vocabulary');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('index');
  await knex.schema.dropTable('catalog');
};
