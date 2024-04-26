import { map } from 'lodash';

import { fileExists, stripI18n } from '../../helpers';
import { Workflow } from '../../models';

export const seedWorkflow = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/workflows`)) {
    const profile = stripI18n(require(`${profilePath}/workflows`));
    if (profile.purge) {
      await Workflow.delete(trx);
    }
    await Promise.all(
      map(
        profile.workflows,
        async (workflow) => await Workflow.create(workflow, {}, trx),
      ),
    );
    console.log('Workflows imported');
  }
};
