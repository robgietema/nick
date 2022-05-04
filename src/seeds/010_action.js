import { log, mapAsync, stripI18n } from '../helpers';
import { Action } from '../models';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/actions'));
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
    log.info('Actions imported');
  } catch (err) {
    log.error(err);
  }
};
