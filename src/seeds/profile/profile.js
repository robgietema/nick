import { fileExists, stripI18n } from '../../helpers';
import { Profile } from '../../models';

export const seedProfile = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/metadata`)) {
    const profile = stripI18n(require(`${profilePath}/metadata`));
    await Profile.deleteById(profile.id, trx);
    await Profile.create(profile, {}, trx);
    console.log('Profile imported');
  }
};
