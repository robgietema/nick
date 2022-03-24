import { map, omit } from 'lodash';

import { stripI18n } from '../helpers';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/groups'));
    if (profile.purge) {
      await knex('group').del();
      await knex('group_role').del();
    }
    await Promise.all(
      map(profile.groups, async (group) => {
        await knex('group').insert(omit(group, ['roles']));
        const groupRoles = map(group.roles, (role) => ({
          group: group.id,
          role,
        }));
        if (groupRoles.length > 0) {
          await knex('group_role').insert(groupRoles);
        }
      }),
    );
  } catch (e) {
    // No data to be imported
  }
};
