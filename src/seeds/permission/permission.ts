import type { Knex } from 'knex';
import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Permission } from '../../models/permission/permission';

export const seedPermission = async (
  trx: Knex.Transaction,
  profilePath: string,
): Promise<void> => {
  if (fileExists(`${profilePath}/permissions`)) {
    const profile = stripI18n(
      (await import(`${profilePath}/permissions`)).default,
    );
    if (profile.purge) {
      await Permission.delete({}, trx);
    }
    await Promise.all(
      profile.permissions.map(
        async (permission: any) => await Permission.create(permission, {}, trx),
      ),
    );
    console.log('Permissions imported');
  }
};
