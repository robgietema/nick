import { dropRight, map } from 'lodash';
import { promises as fs } from 'fs';

import { mapAsync, stripI18n } from '../helpers';

export const seed = async (knex) => {
  try {
    // Get behavior profiles
    const behaviors = map(
      await fs.readdir(`${__dirname}/../profiles/behaviors`),
      (file) => dropRight(file.split('.')).join('.'),
    ).sort();

    // Import behaviors
    await mapAsync(behaviors, async (behavior) => {
      const data = stripI18n(require(`../profiles/behaviors/${behavior}`));
      await knex('behavior').insert({
        ...data,
        schema: data.schema ? JSON.stringify(data.schema) : '{}',
      });
    });

    // Get type profiles
    const types = map(
      await fs.readdir(`${__dirname}/../profiles/types`),
      (file) => dropRight(file.split('.')).join('.'),
    ).sort();

    // Import types
    await mapAsync(types, async (type) => {
      const data = stripI18n(require(`../profiles/types/${type}`));
      await knex('type').insert({
        ...data,
        schema: data.schema ? JSON.stringify(data.schema) : '{}',
      });
    });
  } catch (e) {
    // No data to be imported
  }
};
