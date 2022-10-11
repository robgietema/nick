import { map } from 'lodash';

import { fileExists, log, stripI18n } from '../helpers';
import { Permission } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await Promise.all(
      map(config.profiles, async (profilePath) => {
        if (fileExists(`${profilePath}/permissions`)) {
          const profile = stripI18n(require(`${profilePath}/permissions`));
          if (profile.purge) {
            await Permission.delete(knex);
          }
          await Promise.all(
            map(
              profile.permissions,
              async (permission) =>
                await Permission.create(permission, {}, knex),
            ),
          );
        }
      }),
    );
    log.info('Permissions imported');
  } catch (err) {
    log.error(err);
  }
};
