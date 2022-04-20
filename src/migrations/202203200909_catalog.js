export const up = async (knex) => {
  await knex.schema.createTable('catalog', (table) => {
    table
      .uuid('document')
      .primary()
      .references('document.uuid')
      .onDelete('CASCADE');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('catalog');
};
