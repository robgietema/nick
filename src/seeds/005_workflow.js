import { map } from 'lodash';

import { log, stripI18n } from '../helpers';
import { Workflow } from '../models';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/workflows'));
    if (profile.purge) {
      await Workflow.delete(knex);
    }
    await Promise.all(
      map(
        profile.workflows,
        async (workflow) => await Workflow.create(workflow, {}, knex),
      ),
    );
    log.info('Workflows imported');
  } catch (err) {
    log.error(err);
  }
};
