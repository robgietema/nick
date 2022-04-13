/**
 * Global routes.
 * @module routes
 */

import actions from './actions/actions';
import authentication from './authentication/authentication';
import breadcrumbs from './breadcrumbs/breadcrumbs';
import content from './content/content';
import controlpanels from './controlpanels/controlpanels';
import email from './email/email';
import groups from './groups/groups';
import history from './history/history';
import lock from './lock/lock';
import navigation from './navigation/navigation';
import querystring from './querystring/querystring';
import roles from './roles/roles';
import search from './search/search';
import sharing from './sharing/sharing';
import system from './system/system';
import types from './types/types';
import users from './users/users';
import vocabularies from './vocabularies/vocabularies';
import workflow from './workflow/workflow';

export default [
  ...actions,
  ...authentication,
  ...breadcrumbs,
  ...controlpanels,
  ...email,
  ...groups,
  ...history,
  ...lock,
  ...navigation,
  ...querystring,
  ...roles,
  ...search,
  ...sharing,
  ...system,
  ...types,
  ...users,
  ...vocabularies,
  ...workflow,
  ...content, // Always keep the content routes last since this is the fallback
];
