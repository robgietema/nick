export const seed = async (knex) => {
  try {
    const profile = require('../profiles/workflows');
    if (profile.purge) {
      await knex('workflow').del();
    }
    await knex('workflow').insert(profile.workflows);
  } catch (e) {
    // No data to be imported
  }
};
