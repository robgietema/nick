import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Profile } from '../../models/profile/profile';

export const seedProfile = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/metadata`)) {
    const profile = stripI18n(
      (await import(`${profilePath}/metadata`)).default,
    );
    await Profile.deleteById(profile.id, trx);
    await Profile.create(profile, {}, trx);
    console.log('Profile imported');
  }
};
