import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import type { Knex } from 'knex';

const { config } = require(`${process.cwd()}/config`);

interface Config {
  blobsDir: string;
}

export const up = async (knex: Knex): Promise<void> => {
  // Create blob dir if it doesn't exist
  if (!existsSync((config as Config).blobsDir)) {
    mkdirSync((config as Config).blobsDir, { recursive: true });
  }
  await knex.schema.createTable('document', (table: Knex.TableBuilder) => {
    table.uuid('uuid').primary();
    table
      .uuid('parent')
      .index()
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('id').notNullable();
    table.string('path').notNullable().index();
    table.dateTime('created');
    table.dateTime('modified');
    table
      .string('type')
      .references('type.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.integer('position_in_parent');
    table.integer('version');
    table
      .string('owner')
      .references('user.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.jsonb('json').notNullable();
    table.jsonb('lock').notNullable();
    table.boolean('inherit_roles').notNullable().defaultTo(true);
    table.string('workflow_state').notNullable();
    table.jsonb('workflow_history').notNullable();
    table.index(['parent', 'id']);
  });

  await knex.schema.createTable('version', (table: Knex.TableBuilder) => {
    table.integer('version');
    table.dateTime('created');
    table
      .string('actor')
      .references('user.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .uuid('document')
      .index()
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('id').notNullable();
    table.jsonb('json').notNullable();
    table.primary(['document', 'version']);
  });

  await knex.schema.createTable('user_role_document', (table: Knex.TableBuilder) => {
    table
      .string('user')
      .notNullable()
      .references('user.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('role')
      .notNullable()
      .references('role.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .uuid('document')
      .notNullable()
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.primary(['user', 'role', 'document']);
  });

  await knex.schema.createTable('group_role_document', (table: Knex.TableBuilder) => {
    table
      .string('group')
      .notNullable()
      .references('group.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('role')
      .notNullable()
      .references('role.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .uuid('document')
      .notNullable()
      .references('document.uuid')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.primary(['group', 'role', 'document']);
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable('group_role_document');
  await knex.schema.dropTable('user_role_document');
  await knex.schema.dropTable('version');
  await knex.schema.dropTable('document');
  readdirSync((config as Config).blobsDir).forEach((file) =>
    rmSync(`${(config as Config).blobsDir}/${file}`),
  );
};