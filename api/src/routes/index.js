/**
 * Global routes.
 * @module routes
 */

import actions from './actions/actions';
import breadcrumbs from './breadcrumbs/breadcrumbs';
import content from './content/content';
import controlpanels from './controlpanels/controlpanels';
import groups from './groups/groups';
import history from './history/history';
import login from './login/login';
import navigation from './navigation/navigation';
import querystring from './querystring/querystring';
import roles from './roles/roles';
import search from './search/search';
import types from './types/types';
import user from './user/user';

export default [
  ...actions,
  ...breadcrumbs,
  ...controlpanels,
  ...groups,
  ...history,
  ...login,
  ...navigation,
  ...querystring,
  ...roles,
  ...search,
  ...types,
  ...user,
  ...content, // Always keep the content routes last since this is the fallback
];
