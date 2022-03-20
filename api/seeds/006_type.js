export const seed = async (knex) => {
  try {
    const profile = require('../profiles/types');
    if (profile.purge) {
      await knex('type').del();
    }
    await knex('type').insert(profile.types);
  } catch (e) {
    // No data to be imported
  }
};
