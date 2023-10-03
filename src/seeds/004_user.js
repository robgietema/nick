import { map, omit } from 'lodash';
import bcrypt from 'bcrypt-promise';

import { fileExists, log, mapAsync, stripI18n } from '../helpers';
import { User } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await mapAsync(config.profiles, async (profilePath) => {
      if (fileExists(`${profilePath}/users`)) {
        const profile = stripI18n(require(`${profilePath}/users`));
        if (profile.purge) {
          await User.delete(knex);
        }
        await Promise.all(
          map(profile.users, async (user) => {
            // Insert user
            await User.create(
              {
                ...omit(user, ['password', 'roles', 'groups']),
                password: await bcrypt.hash(user.password, 10),
                _roles: user.roles,
                _groups: user.groups,
              },
              {},
              knex,
            );
          }),
        );
      }
    });
    log.info('Users imported');
  } catch (err) {
    log.error(err);
  }
};
