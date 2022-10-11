import { map, omit } from 'lodash';

import { fileExists, log, stripI18n } from '../helpers';
import { Group } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await Promise.all(
      map(config.profiles, async (profilePath) => {
        if (fileExists(`${profilePath}/groups`)) {
          const profile = stripI18n(require(`${profilePath}/groups`));
          if (profile.purge) {
            await Group.delete(knex);
          }
          await Promise.all(
            map(profile.groups, async (group) => {
              await Group.create(
                {
                  ...omit(group, ['roles']),
                  _roles: group.roles,
                },
                {},
                knex,
              );
            }),
          );
        }
      }),
    );
    log.info('Groups imported');
  } catch (err) {
    log.error(err);
  }
};
