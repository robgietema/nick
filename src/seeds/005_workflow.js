import { stripI18n } from '../helpers';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/workflows'));
    if (profile.purge) {
      await knex('workflow').del();
    }
    await knex('workflow').insert(profile.workflows);
  } catch (e) {
    // No data to be imported
  }
};
