import { map } from 'lodash';

import { fileExists, stripI18n } from '../../helpers';
import { Permission } from '../../models';

export const seedPermission = async (knex, profilePath) => {
  try {
    if (fileExists(`${profilePath}/permissions`)) {
      const profile = stripI18n(require(`${profilePath}/permissions`));
      if (profile.purge) {
        await Permission.delete(knex);
      }
      await Promise.all(
        map(
          profile.permissions,
          async (permission) => await Permission.create(permission, {}, knex),
        ),
      );
      console.log('Permissions imported');
    }
  } catch (err) {
    console.log(err);
  }
};
