export const up = async (knex) => {
  await knex.schema.createTable('group', (table) => {
    table.string('id').primary().notNull();
    table.string('title');
    table.string('description');
    table.string('email');
  });
  await knex.schema.createTable('group_role', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
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
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('group_role');
  await knex.schema.dropTable('group');
};
