export const seed = async (knex) => {
  try {
    const profile = require('../profiles/redirects');
    if (profile.purge) {
      await knex('redirect').del();
    }
    await knex('redirect').insert(profile.redirects);
  } catch (e) {
    // No data to be imported
  }
};
