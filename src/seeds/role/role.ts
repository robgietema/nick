import type { Knex } from 'knex';
import { omit } from 'es-toolkit/object';
import { uniq } from 'es-toolkit/array';
import { merge } from 'es-toolkit/object';

import { fileExists } from '../../helpers/fs/fs';
import { mapAsync } from '../../helpers/utils/utils';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Role } from '../../models/role/role';

export const seedRole = async (
  trx: Knex.Transaction,
  profilePath: string,
): Promise<void> => {
  if (fileExists(`${profilePath}/roles`)) {
    const profile = stripI18n((await import(`${profilePath}/roles`)).default);
    if (profile.purge) {
      await Role.delete({}, trx);
    }
    await mapAsync(profile.roles, async (role: any, index: number) => {
      // Check if role exists
      const current: any = await Role.fetchById(role.id, {}, trx);

      // If doesn't exist
      if (!current) {
        await Role.create(
          {
            ...omit(role, ['permissions']),
            _permissions: role.permissions,
            order: role.order || index,
          },
          {},
          trx,
        );
      } else {
        await current.fetchRelated('_permissions', trx);
        await Role.update(
          role.id,
          {
            ...omit(merge((current as any).$toDatabaseJson(), role), [
              'permissions',
            ]),
            _permissions: role.permissions
              ? uniq([
                  ...current._permissions.map(
                    (permission: any) => permission.id,
                  ),
                  ...role.permissions,
                ])
              : current._permissions,
          },
          trx,
        );
      }
    });
    console.log('Roles imported');
  }
};
