import { map, omit } from 'lodash';
import bcrypt from 'bcrypt-promise';

import { stripI18n } from '../helpers';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/users'));
    if (profile.purge) {
      await knex('user').del();
      await knex('user_role').del();
    }
    await Promise.all(
      map(profile.users, async (user) => {
        // Insert user
        await knex('user').insert({
          ...omit(user, ['password', 'roles', 'groups']),
          password: await bcrypt.hash('admin', 10),
        });

        // Insert roles
        const userRoles = map(user.roles, (role) => ({
          user: user.id,
          role,
        }));
        if (userRoles.length > 0) {
          await knex('user_role').insert(userRoles);
        }

        // Insert groups
        const userGroups = map(user.groups, (group) => ({
          user: user.id,
          group,
        }));
        if (userGroups.length > 0) {
          await knex('user_group').insert(userGroups);
        }
      }),
    );
  } catch (e) {
    // No data to be imported
  }
};
