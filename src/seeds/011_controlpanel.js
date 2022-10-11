import { dropRight, map } from 'lodash';
import { promises as fs } from 'fs';

import { dirExists, log, mapAsync, stripI18n } from '../helpers';
import { Controlpanel } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await Promise.all(
      map(config.profiles, async (profilePath) => {
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
            await Controlpanel.create(data, {}, knex);
          });
        }
      }),
    );
    log.info('Controlpanels imported');
  } catch (err) {
    log.error(err);
  }
};
