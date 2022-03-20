export const up = async (knex) => {
  await knex.schema.createTable('document', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('parent')
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('id').notNull();
    table.string('path').notNull();
    table.dateTime('created');
    table.dateTime('modified');
    table
      .string('type')
      .references('type.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.integer('position_in_parent');
    table.integer('version');
    table.uuid('owner').references('user.uuid');
    table.jsonb('json').notNull();
    table.jsonb('lock').notNull();
    table.string('workflow_state').notNull();
  });
  await knex.schema.createTable('version', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.integer('version');
    table.dateTime('created');
    table.uuid('actor').references('user.uuid');
    table
      .uuid('document')
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('id').notNull();
    table.jsonb('json').notNull();
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
  await knex.schema.createTable('group_role_document', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('group')
      .notNull()
      .references('group.uuid')
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
};

export const down = async (knex) => {
  await knex.schema.dropTable('group_role_document');
  await knex.schema.dropTable('user_role_document');
  await knex.schema.dropTable('version');
  await knex.schema.dropTable('document');
  await knex.raw('SELECT lo_unlink(l.oid) FROM pg_largeobject_metadata l;');
  await knex.raw('COMMIT;');
  await knex.raw('VACUUM FULL ANALYZE pg_largeobject;');
  await knex.raw('COMMIT;');
};
