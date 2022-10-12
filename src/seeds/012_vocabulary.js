import { dropRight, map } from 'lodash';
import { promises as fs } from 'fs';

import { dirExists, log, mapAsync, stripI18n } from '../helpers';
import { Vocabulary } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await Promise.all(
      map(config.profiles, async (profilePath) => {
        if (dirExists(`${profilePath}/vocabularies`)) {
          // Get vocabulary profiles
          const vocabularies = map(
            await fs.readdir(`${profilePath}/vocabularies`),
            (file) => dropRight(file.split('.')).join('.'),
          ).sort();

          // Import vocabularies
          await mapAsync(vocabularies, async (vocabulary) => {
            const data = stripI18n(
              require(`${profilePath}/vocabularies/${vocabulary}`),
            );
            await Vocabulary.create(data, {}, knex);
          });
        }
      }),
    );
    log.info('Vocabularies imported');
  } catch (err) {
    log.error(err);
  }
};
