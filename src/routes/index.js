/**
 * Global routes.
 * @module routes
 */

import actions from './actions/actions';
import authentication from './authentication/authentication';
import breadcrumbs from './breadcrumbs/breadcrumbs';
import catalog from './catalog/catalog';
import content from './content/content';
import controlpanels from './controlpanels/controlpanels';
import database from './database/database';
import email from './email/email';
import form from './form/form';
import groups from './groups/groups';
import history from './history/history';
import inherit from './inherit/inherit';
import lock from './lock/lock';
import navigation from './navigation/navigation';
import navroot from './navroot/navroot';
import nick from './nick/nick';
import querystring from './querystring/querystring';
import roles from './roles/roles';
import search from './search/search';
import sharing from './sharing/sharing';
import site from './site/site';
import system from './system/system';
import translations from './translations/translations';
import types from './types/types';
import users from './users/users';
import vocabularies from './vocabularies/vocabularies';
import workflow from './workflow/workflow';

export default [
  ...actions,
  ...authentication,
  ...breadcrumbs,
  ...catalog,
  ...controlpanels,
  ...database,
  ...email,
  ...form,
  ...groups,
  ...history,
  ...inherit,
  ...lock,
  ...navigation,
  ...navroot,
  ...nick,
  ...querystring,
  ...roles,
  ...search,
  ...sharing,
  ...site,
  ...system,
  ...translations,
  ...types,
  ...users,
  ...vocabularies,
  ...workflow,
  ...content, // Always keep the content routes last since this is the fallback
];
