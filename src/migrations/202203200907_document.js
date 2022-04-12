import { readdirSync, rmSync } from 'fs';

import { config } from '../../config';

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
    table.string('owner').references('user.id');
    table.jsonb('json').notNull();
    table.jsonb('lock').notNull();
    table.boolean('inherit_roles').notNull().defaultTo(true);
    table.string('workflow_state').notNull();
    table.jsonb('workflow_history').notNull();
  });
  await knex.schema.createTable('version', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.integer('version');
    table.dateTime('created');
    table.string('actor').references('user.id');
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
    table
      .uuid('document')
      .notNull()
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.unique(['user', 'role', 'document']);
  });
  await knex.schema.createTable('group_role_document', (table) => {
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
    table
      .uuid('document')
      .notNull()
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.unique(['group', 'role', 'document']);
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('group_role_document');
  await knex.schema.dropTable('user_role_document');
  await knex.schema.dropTable('version');
  await knex.schema.dropTable('document');
  readdirSync(config.blobsDir).forEach((file) =>
    rmSync(`${config.blobsDir}/${file}`),
  );
};
