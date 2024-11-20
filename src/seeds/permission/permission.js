import { map } from 'lodash';

import { fileExists, stripI18n } from '../../helpers';
import { Permission } from '../../models';

export const seedPermission = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/permissions`)) {
    const profile = stripI18n(require(`${profilePath}/permissions`));
    if (profile.purge) {
      await Permission.delete({}, trx);
    }
    await Promise.all(
      map(
        profile.permissions,
        async (permission) => await Permission.create(permission, {}, trx),
      ),
    );
    console.log('Permissions imported');
  }
};
