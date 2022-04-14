export const up = async (knex) => {
  await knex.schema.createTable('user', (table) => {
    table.string('id').primary();
    table.string('password').notNull();
    table.string('fullname');
    table.string('email').unique();
  });
  await knex.schema.createTable('user_role', (table) => {
    table
      .string('user')
      .notNull()
      .references('user.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('role')
      .notNull()
      .references('role.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.primary(['user', 'role']);
  });
  await knex.schema.createTable('user_group', (table) => {
    table
      .string('user')
      .notNull()
      .references('user.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('group')
      .notNull()
      .references('group.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.primary(['user', 'group']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('user_group');
  await knex.schema.dropTable('user_role');
  await knex.schema.dropTable('user');
};
