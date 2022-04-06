import { map } from 'lodash';

import { log, stripI18n } from '../helpers';
import { Permission } from '../models';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/permissions'));
    if (profile.purge) {
      await Permission.delete(knex);
    }
    await Promise.all(
      map(
        profile.permissions,
        async (permission) => await Permission.create(permission, {}, knex),
      ),
    );
    log.info('Permissions imported');
  } catch (err) {
    log.error(err);
  }
};
