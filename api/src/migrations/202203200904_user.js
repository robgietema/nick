export const up = async (knex) => {
  await knex.schema.createTable('user', (table) => {
    table.string('id').primary().notNull();
    table.string('password').notNull();
    table.string('fullname');
    table.string('email');
  });
  await knex.schema.createTable('user_role', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
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
  });
  await knex.schema.createTable('user_group', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
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
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('user_group');
  await knex.schema.dropTable('user_role');
  await knex.schema.dropTable('user');
};
