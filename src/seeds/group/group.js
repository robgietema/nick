import { map, omit } from 'lodash';

import { fileExists, stripI18n } from '../../helpers';
import { Group } from '../../models';

export const seedGroup = async (knex, profilePath) => {
  try {
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
      console.log('Groups imported');
    }
  } catch (err) {
    console.log(err);
  }
};
