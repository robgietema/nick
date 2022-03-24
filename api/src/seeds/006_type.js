import { stripI18n } from '../helpers';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/types'));
    if (profile.purge) {
      await knex('type').del();
    }
    await knex('type').insert(profile.types);
  } catch (e) {
    // No data to be imported
  }
};
