import type { Knex } from 'knex';
import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Redirect } from '../../models/redirect/redirect';

export const seedRedirect = async (
  trx: Knex.Transaction,
  profilePath: string,
): Promise<void> => {
  if (fileExists(`${profilePath}/redirects`)) {
    const profile = stripI18n(
      (await import(`${profilePath}/redirects`)).default,
    );
    if (profile.purge) {
      await Redirect.delete({}, trx);
    }
    await Promise.all(
      profile.redirects.map(
        async (redirects: any) => await Redirect.create(redirects, {}, trx),
      ),
    );
    console.log('Redirects imported');
  }
};
