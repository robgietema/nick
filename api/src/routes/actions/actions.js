/**
 * Action route.
 * @module routes/actions/actions
 */

import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@actions',
    handler: (req, res) =>
      requirePermission('View', req, res, () =>
        res.send({
          object: [
            {
              icon: '',
              id: 'view',
              title: req.i18n('View'),
            },
            {
              icon: '',
              id: 'edit',
              title: req.i18n('Edit'),
            },
            {
              icon: '',
              id: 'folderContents',
              title: req.i18n('Contents'),
            },
            {
              icon: '',
              id: 'history',
              title: req.i18n('History'),
            },
            {
              icon: '',
              id: 'local_roles',
              title: req.i18n('Sharing'),
            },
          ],
          site_actions: [
            {
              icon: '',
              id: 'sitemap',
              title: req.i18n('Site Map'),
            },
            {
              icon: '',
              id: 'accessibility',
              title: req.i18n('Accessibility'),
            },
            {
              icon: '',
              id: 'contact',
              title: req.i18n('Contact'),
            },
          ],
          user: [
            {
              icon: '',
              id: 'preferences',
              title: req.i18n('Preferences'),
            },
            {
              icon: '',
              id: 'dashboard',
              title: req.i18n('Dashboard'),
            },
            {
              icon: '',
              id: 'plone_setup',
              title: req.i18n('Site Setup'),
            },
            {
              icon: '',
              id: 'logout',
              title: req.i18n('Log out'),
            },
          ],
        }),
      ),
  },
];
