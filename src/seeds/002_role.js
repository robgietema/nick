import { map, omit } from 'lodash';

import { fileExists, log, mapAsync, stripI18n } from '../helpers';
import { Role } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await mapAsync(config.profiles, async (profilePath) => {
      if (fileExists(`${profilePath}/roles`)) {
        const profile = stripI18n(require(`${profilePath}/roles`));
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
      }
    });
    log.info('Roles imported');
  } catch (err) {
    log.error(err);
  }
};
