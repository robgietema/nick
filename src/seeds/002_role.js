import { map, omit } from 'lodash';

import { log, mapAsync, stripI18n } from '../helpers';
import { Role } from '../models';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/roles'));
    if (profile.purge) {
      await Role.delete(knex);
    }
    await mapAsync(profile.roles, async (role, index) => {
      await Role.create(
        {
          ...omit(role, ['permissions']),
          _permissions: role.permissions,
          order: role.order || index,
        },
        {},
        knex,
      );
    });
    log.info('Roles imported');
  } catch (err) {
    log.error(err);
  }
};
