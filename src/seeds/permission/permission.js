import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Permission } from '../../models/permission/permission';

export const seedPermission = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/permissions`)) {
    const profile = stripI18n(require(`${profilePath}/permissions`));
    if (profile.purge) {
      await Permission.delete({}, trx);
    }
    await Promise.all(
      profile.permissions.map(
        async (permission) => await Permission.create(permission, {}, trx),
      ),
    );
    console.log('Permissions imported');
  }
};
