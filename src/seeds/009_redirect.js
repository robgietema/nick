import { map } from 'lodash';

import { log, stripI18n } from '../helpers';
import { Redirect } from '../models';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/redirects'));
    if (profile.purge) {
      await Redirect.delete(knex);
    }
    await Promise.all(
      map(
        profile.redirects,
        async (redirect) => await Redirect.create(redirects, {}, knex),
      ),
    );
    log.info('Redirects imported');
  } catch (err) {
    log.error(err);
  }
};
