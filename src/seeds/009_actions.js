import { mapAsync, stripI18n } from '../helpers';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/actions'));
    if (profile.purge) {
      await knex('action').del();
    }
    await mapAsync(
      ['object', 'site_actions', 'object_buttons', 'user'],
      async (category) => {
        await mapAsync(profile[category], async (action, index) => {
          await knex('action').insert({
            ...action,
            category,
            order: action.order || index,
          });
        });
      },
    );
  } catch (e) {
    // No data to be imported
  }
};
