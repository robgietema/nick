import { map, omit } from 'lodash';

import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Group } from '../../models/group/group';

export const seedGroup = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/groups`)) {
    const profile = stripI18n(require(`${profilePath}/groups`));
    if (profile.purge) {
      await Group.delete({}, trx);
    }
    await Promise.all(
      map(profile.groups, async (group) => {
        await Group.create(
          {
            ...omit(group, ['roles']),
            _roles: group.roles,
          },
          {},
          trx,
        );
      }),
    );
    console.log('Groups imported');
  }
};
