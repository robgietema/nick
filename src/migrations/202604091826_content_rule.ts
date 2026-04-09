import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('content_rule', (table: Knex.TableBuilder) => {
    table.string('id').primary();
    table.string('title');
    table.text('description');
    table.string('event').index();
    table.boolean('enabled').index();
    table.jsonb('json').notNullable().defaultTo('{}');
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable('content_rule');
};
