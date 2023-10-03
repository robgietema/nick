import { dropRight, map } from 'lodash';
import { promises as fs } from 'fs';

import { dirExists, log, mapAsync, stripI18n } from '../helpers';
import { Behavior, Type } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await mapAsync(config.profiles, async (profilePath) => {
      if (dirExists(`${profilePath}/behaviors`)) {
        // Get behavior profiles
        const behaviors = map(
          await fs.readdir(`${profilePath}/behaviors`),
          (file) => dropRight(file.split('.')).join('.'),
        ).sort();

        // Import behaviors
        await mapAsync(behaviors, async (behavior) => {
          const data = stripI18n(
            require(`${profilePath}/behaviors/${behavior}`),
          );
          await Behavior.create(data, {}, knex);
        });
      }
    });

    await mapAsync(config.profiles, async (profilePath) => {
      if (dirExists(`${profilePath}/types`)) {
        // Get type profiles
        const types = map(await fs.readdir(`${profilePath}/types`), (file) =>
          dropRight(file.split('.')).join('.'),
        ).sort();

        // Import types
        await mapAsync(types, async (type) => {
          const data = stripI18n(require(`${profilePath}/types/${type}`));
          const typeModel = await Type.create({
            global_allow: true,
            filter_content_types: false,
            ...data,
          });
          await typeModel.cacheSchema();
        });
      }
    });
    log.info('Types imported');
  } catch (err) {
    log.error(err);
  }
};
