export const up = async (knex) => {
  await knex.schema.createTable('action', (table) => {
    table.string('id').primary();
    table.string('title');
    table.string('category');
    table.integer('order');
    table
      .string('permission')
      .notNull()
      .references('permission.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('action');
};
