import { map } from 'lodash';

import { fileExists, log, mapAsync, stripI18n } from '../helpers';
import { Action } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await Promise.all(
      map(config.profiles, async (profilePath) => {
        if (fileExists(`${profilePath}/actions`)) {
          const profile = stripI18n(require(`${profilePath}/actions`));
          if (profile.purge) {
            await Action.delete(knex);
          }
          await mapAsync(
            ['object', 'site_actions', 'object_buttons', 'user'],
            async (category) => {
              await mapAsync(profile[category], async (action, index) => {
                await Action.create(
                  {
                    ...action,
                    category,
                    order: action.order || index,
                  },
                  {},
                  knex,
                );
              });
            },
          );
        }
      }),
    );
    log.info('Actions imported');
  } catch (err) {
    log.error(err);
  }
};
