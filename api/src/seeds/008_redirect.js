import { stripI18n } from '../helpers';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/redirects'));
    if (profile.purge) {
      await knex('redirect').del();
    }
    await knex('redirect').insert(profile.redirects);
  } catch (e) {
    // No data to be imported
  }
};
