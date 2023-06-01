import { map } from 'lodash';

import { fileExists, log, stripI18n } from '../helpers';
import { Profile } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await Promise.all(
      map(config.profiles, async (profilePath) => {
        if (fileExists(`${profilePath}/metadata`)) {
          const profile = stripI18n(require(`${profilePath}/metadata`));
          await Profile.create(profile, {}, knex);
        }
      }),
    );
    log.info('Profile imported');
  } catch (err) {
    log.error(err);
  }
};
