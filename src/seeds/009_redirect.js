import { map } from 'lodash';

import { fileExists, log, stripI18n } from '../helpers';
import { Redirect } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await Promise.all(
      map(config.profiles, async (profilePath) => {
        if (fileExists(`${profilePath}/redirects`)) {
          const profile = stripI18n(require(`${profilePath}/redirects`));
          if (profile.purge) {
            await Redirect.delete(knex);
          }
          await Promise.all(
            map(
              profile.redirects,
              async (redirect) => await Redirect.create(redirects, {}, knex),
            ),
          );
        }
      }),
    );
    log.info('Redirects imported');
  } catch (err) {
    log.error(err);
  }
};
