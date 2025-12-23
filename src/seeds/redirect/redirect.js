import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Redirect } from '../../models/redirect/redirect';

export const seedRedirect = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/redirects`)) {
    const profile = stripI18n(require(`${profilePath}/redirects`));
    if (profile.purge) {
      await Redirect.delete({}, trx);
    }
    await Promise.all(
      profile.redirects.map(
        async (redirects) => await Redirect.create(redirects, {}, trx),
      ),
    );
    console.log('Redirects imported');
  }
};
