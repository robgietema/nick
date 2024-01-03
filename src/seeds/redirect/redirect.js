import { map } from 'lodash';

import { fileExists, stripI18n } from '../../helpers';
import { Redirect } from '../../models';

export const seedRedirect = async (knex, profilePath) => {
  try {
    if (fileExists(`${profilePath}/redirects`)) {
      const profile = stripI18n(require(`${profilePath}/redirects`));
      if (profile.purge) {
        await Redirect.delete(knex);
      }
      await Promise.all(
        map(
          profile.redirects,
          async (redirects) => await Redirect.create(redirects, {}, knex),
        ),
      );
      console.log('Redirects imported');
    }
  } catch (err) {
    console.log(err);
  }
};
