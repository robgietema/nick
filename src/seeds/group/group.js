import { omit } from 'es-toolkit/object';

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
      profile.groups.map(async (group) => {
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
