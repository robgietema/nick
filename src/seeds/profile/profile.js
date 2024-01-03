import { fileExists, stripI18n } from '../../helpers';
import { Profile } from '../../models';

export const seedProfile = async (knex, profilePath) => {
  try {
    if (fileExists(`${profilePath}/metadata`)) {
      const profile = stripI18n(require(`${profilePath}/metadata`));
      await Profile.deleteById(profile.id, knex);
      await Profile.create(profile, {}, knex);
      console.log('Profile imported');
    }
  } catch (err) {
    console.log(err);
  }
};
