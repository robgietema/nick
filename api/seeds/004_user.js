import { map, omit } from 'lodash';
import bcrypt from 'bcrypt-promise';

export const seed = async (knex) => {
  try {
    const profile = require('../profiles/users');
    if (profile.purge) {
      await knex('user').del();
      await knex('user_role').del();
    }
    await Promise.all(
      map(profile.users, async (user) => {
        await knex('user').insert({
          ...omit(user, ['password', 'roles', 'groups']),
          password: await bcrypt.hash('admin', 10),
        });
        const userRoles = map(user.roles, (role) => ({
          user: user.id,
          role,
        }));
        if (userRoles.length > 0) {
          await knex('user_role').insert(userRoles);
        }
      }),
    );
  } catch (e) {
    // No data to be imported
  }
};
