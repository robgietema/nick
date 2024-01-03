import { omit } from 'lodash';

import { fileExists, mapAsync, stripI18n } from '../../helpers';
import { Role } from '../../models';

export const seedRole = async (knex, profilePath) => {
  try {
    if (fileExists(`${profilePath}/roles`)) {
      const profile = stripI18n(require(`${profilePath}/roles`));
      if (profile.purge) {
        await Role.delete(knex);
      }
      await mapAsync(profile.roles, async (role, index) => {
        await Role.create(
          {
            ...omit(role, ['permissions']),
            _permissions: role.permissions,
            order: role.order || index,
          },
          {},
          knex,
        );
      });
      console.log('Roles imported');
    }
  } catch (err) {
    console.log(err);
  }
};
