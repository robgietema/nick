import { fileExists, mapAsync, stripI18n } from '../../helpers';
import { Action } from '../../models';

export const seedAction = async (knex, profilePath) => {
  try {
    if (fileExists(`${profilePath}/actions`)) {
      const profile = stripI18n(require(`${profilePath}/actions`));
      if (profile.purge) {
        await Action.delete(knex);
      }
      await mapAsync(
        ['object', 'site_actions', 'object_buttons', 'user'],
        async (category) => {
          await mapAsync(profile[category], async (action, index) => {
            await Action.create(
              {
                ...action,
                category,
                order: action.order || index,
              },
              {},
              knex,
            );
          });
        },
      );
      console.log('Actions imported');
    }
  } catch (err) {
    console.log(err);
  }
};
