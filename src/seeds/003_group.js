import { map, omit } from 'lodash';

import { log, stripI18n } from '../helpers';
import { Group } from '../models';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/groups'));
    if (profile.purge) {
      await Group.delete(knex);
    }
    await Promise.all(
      map(profile.groups, async (group) => {
        await Group.create(
          {
            ...omit(group, ['roles']),
            _roles: group.roles,
          },
          {},
          knex,
        );
      }),
    );
    log.info('Groups imported');
  } catch (err) {
    log.error(err);
  }
};
