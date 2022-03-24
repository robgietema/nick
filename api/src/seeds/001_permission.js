import { stripI18n } from '../helpers';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/permissions'));
    if (profile.purge) {
      await knex('permission').del();
    }
    await knex('permission').insert(profile.permissions);
  } catch (e) {
    // No data to be imported
  }
};
