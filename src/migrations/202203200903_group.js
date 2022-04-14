export const up = async (knex) => {
  await knex.schema.createTable('group', (table) => {
    table.string('id').primary();
    table.string('title');
    table.string('description');
    table.string('email').unique();
  });
  await knex.schema.createTable('group_role', (table) => {
    table
      .string('group')
      .notNull()
      .references('group.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('role')
      .notNull()
      .references('role.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.primary(['group', 'role']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('group_role');
  await knex.schema.dropTable('group');
};
