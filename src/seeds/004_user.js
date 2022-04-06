import { map, omit } from 'lodash';
import bcrypt from 'bcrypt-promise';

import { log, stripI18n } from '../helpers';
import { User } from '../models';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/users'));
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
    log.info('Users imported');
  } catch (err) {
    log.error(err);
  }
};
