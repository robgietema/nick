import { map } from 'lodash';

import { fileExists, stripI18n } from '../../helpers';
import { Redirect } from '../../models';

export const seedRedirect = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/redirects`)) {
    const profile = stripI18n(require(`${profilePath}/redirects`));
    if (profile.purge) {
      await Redirect.delete(trx);
    }
    await Promise.all(
      map(
        profile.redirects,
        async (redirects) => await Redirect.create(redirects, {}, trx),
      ),
    );
    console.log('Redirects imported');
  }
};
