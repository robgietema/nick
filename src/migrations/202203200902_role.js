export const up = async (knex) => {
  await knex.schema.createTable('role', (table) => {
    table.string('id').primary();
    table.string('title');
    table.integer('order');
  });
  await knex.schema.createTable('role_permission', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .string('role')
      .notNull()
      .references('role.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('permission')
      .notNull()
      .references('permission.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.unique(['role', 'permission']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('role_permission');
  await knex.schema.dropTable('role');
};
