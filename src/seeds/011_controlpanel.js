import { dropRight, map, merge } from 'lodash';
import { promises as fs } from 'fs';

import { dirExists, log, mapAsync, stripI18n } from '../helpers';
import { Controlpanel } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await mapAsync(config.profiles, async (profilePath) => {
      if (dirExists(`${profilePath}/controlpanels`)) {
        // Get controlpanel profiles
        const controlpanels = map(
          await fs.readdir(`${profilePath}/controlpanels`),
          (file) => dropRight(file.split('.')).join('.'),
        ).sort();

        // Import controlpanels
        await mapAsync(controlpanels, async (controlpanel) => {
          const data = stripI18n(
            require(`${profilePath}/controlpanels/${controlpanel}`),
          );

          // Check if controlpanel exists
          const current = await Controlpanel.fetchById(data.id);

          // If doesn't exist
          if (!current) {
            await Controlpanel.create(data, {}, knex);
          } else {
            await Controlpanel.update(
              data.id,
              merge(current.$toDatabaseJson(), data),
              knex,
            );
          }
        });
      }
    });
  } catch (err) {
    log.error(err);
  }
};
