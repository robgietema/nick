import { omit } from 'es-toolkit/object';

import { fileExists } from '../../helpers/fs/fs';
import { mapAsync } from '../../helpers/utils/utils';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Role } from '../../models/role/role';

export const seedRole = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/roles`)) {
    const profile = stripI18n(require(`${profilePath}/roles`));
    if (profile.purge) {
      await Role.delete({}, trx);
    }
    await mapAsync(profile.roles, async (role, index) => {
      await Role.create(
        {
          ...omit(role, ['permissions']),
          _permissions: role.permissions,
          order: role.order || index,
        },
        {},
        trx,
      );
    });
    console.log('Roles imported');
  }
};
