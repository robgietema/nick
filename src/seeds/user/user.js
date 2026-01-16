import { omit } from 'es-toolkit/object';
import bcrypt from 'bcrypt-promise';

import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';

import { User } from '../../models/user/user';

export const seedUser = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/users`)) {
    const profile = stripI18n((await import(`${profilePath}/users`)).default);
    if (profile.purge) {
      await User.delete({}, trx);
    }
    await Promise.all(
      profile.users.map(async (user) => {
        // Insert user
        await User.create(
          {
            ...omit(user, ['password', 'roles', 'groups']),
            password: await bcrypt.hash(user.password, 10),
            _roles: user.roles,
            _groups: user.groups,
          },
          {},
          trx,
        );
      }),
    );
    console.log('Users imported');
  }
};
