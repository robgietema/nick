import { map, omit } from 'lodash';
import bcrypt from 'bcrypt-promise';

import { fileExists, stripI18n } from '../../helpers';
import { User } from '../../models';

export const seedUser = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/users`)) {
    const profile = stripI18n(require(`${profilePath}/users`));
    if (profile.purge) {
      await User.delete({}, trx);
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
          trx,
        );
      }),
    );
    console.log('Users imported');
  }
};
