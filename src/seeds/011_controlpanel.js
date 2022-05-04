import { map } from 'lodash';

import { log, stripI18n } from '../helpers';
import { Controlpanel } from '../models';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/controlpanels'));
    if (profile.purge) {
      await Controlpanel.delete(knex);
    }
    await Promise.all(
      map(
        profile.controlpanels,
        async (controlpanel) =>
          await Controlpanel.create(controlpanel, {}, knex),
      ),
    );
    log.info('Controlpanels imported');
  } catch (err) {
    log.error(err);
  }
};
