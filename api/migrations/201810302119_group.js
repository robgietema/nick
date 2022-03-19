exports.up = async (knex) => {
  await knex.schema.createTable('group', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('id').unique().notNull();
    table.string('title');
    table.string('description');
    table.string('email');
  });
  await knex.schema.createTable('user_group', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('user')
      .notNull()
      .references('user.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .uuid('group')
      .notNull()
      .references('group.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('user_group');
  await knex.schema.dropTable('group');
};
