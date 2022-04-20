import { dropRight, map } from 'lodash';
import { promises as fs } from 'fs';

import { log, mapAsync, stripI18n } from '../helpers';
import { Behavior, Type } from '../models';

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
      await Behavior.create(data, {}, knex);
    });

    // Get type profiles
    const types = map(
      await fs.readdir(`${__dirname}/../profiles/types`),
      (file) => dropRight(file.split('.')).join('.'),
    ).sort();

    // Import types
    await mapAsync(types, async (type) => {
      const data = stripI18n(require(`../profiles/types/${type}`));
      const typeModel = await Type.create({
        global_allow: true,
        filter_content_types: false,
        ...data,
      });
      await typeModel.cacheSchema();
    });
    log.info('Types imported');
  } catch (err) {
    log.error(err);
  }
};
