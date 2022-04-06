import { map, omit } from 'lodash';

import { mapAsync, stripI18n } from '../helpers';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/roles'));
    if (profile.purge) {
      await knex('role').del();
      await knex('role_permission').del();
    }
    await mapAsync(profile.roles, async (role, index) => {
      await knex('role').insert({
        ...omit(role, ['permissions']),
        order: role.order || index,
      });
      const rolePermissions = map(role.permissions, (permission) => ({
        role: role.id,
        permission,
      }));
      if (rolePermissions.length > 0) {
        await knex('role_permission').insert(rolePermissions);
      }
    });
  } catch (e) {
    // No data to be imported
  }
};