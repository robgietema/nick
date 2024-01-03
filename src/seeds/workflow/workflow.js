import { map } from 'lodash';

import { fileExists, stripI18n } from '../../helpers';
import { Workflow } from '../../models';

export const seedWorkflow = async (knex, profilePath) => {
  try {
    if (fileExists(`${profilePath}/workflows`)) {
      const profile = stripI18n(require(`${profilePath}/workflows`));
      if (profile.purge) {
        await Workflow.delete(knex);
      }
      await Promise.all(
        map(
          profile.workflows,
          async (workflow) => await Workflow.create(workflow, {}, knex),
        ),
      );
      console.log('Workflows imported');
    }
  } catch (err) {
    console.log(err);
  }
};
