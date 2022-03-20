export const seed = async (knex) => {
  try {
    const profile = require('../profiles/permissions');
    if (profile.purge) {
      await knex('permission').del();
    }
    await knex('permission').insert(profile.permissions);
  } catch (e) {
    // No data to be imported
  }
};
