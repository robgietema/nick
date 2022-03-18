exports.up = async (knex) => {
  await knex.schema.createTable('role', (table) => {
    table.string('id').primary();
  });
  await knex.schema.createTable('permission', (table) => {
    table.string('id').primary();
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
  });
  await knex.schema.createTable('user_role_document', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('user')
      .notNull()
      .references('user.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('role')
      .notNull()
      .references('role.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .uuid('document')
      .notNull()
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
  await knex.schema.createTable('user_role', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('user')
      .notNull()
      .references('user.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('role')
      .notNull()
      .references('role.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('user_role');
  await knex.schema.dropTable('user_role_document');
  await knex.schema.dropTable('role_permission');
  await knex.schema.dropTable('permission');
  await knex.schema.dropTable('role');
};
