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
              title: 'View',
            },
            {
              icon: '',
              id: 'edit',
              title: 'Edit',
            },
            {
              icon: '',
              id: 'folderContents',
              title: 'Contents',
            },
            {
              icon: '',
              id: 'history',
              title: 'History',
            },
            {
              icon: '',
              id: 'local_roles',
              title: 'Sharing',
            },
          ],
          site_actions: [
            {
              icon: '',
              id: 'sitemap',
              title: 'Site Map',
            },
            {
              icon: '',
              id: 'accessibility',
              title: 'Accessibility',
            },
            {
              icon: '',
              id: 'contact',
              title: 'Contact',
            },
          ],
          user: [
            {
              icon: '',
              id: 'preferences',
              title: 'Preferences',
            },
            {
              icon: '',
              id: 'dashboard',
              title: 'Dashboard',
            },
            {
              icon: '',
              id: 'plone_setup',
              title: 'Site Setup',
            },
            {
              icon: '',
              id: 'logout',
              title: 'Log out',
            },
          ],
        }),
      ),
  },
];
