/**
 * Content routes.
 * @module routes/content/content
 */

import { VersionRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@history',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () =>
        VersionRepository.findAll(
          { document: context.get('uuid') },
          [{ column: 'version', order: 'desc' }],
          { withRelated: ['actor'] },
        ).then((items) =>
          res.send(
            items.map((item) => ({
              '@id': `${req.protocol || 'http'}://${
                req.headers.host
              }${context.get('path')}/@history/${item.get('version')}`,
              action: 'Edited',
              actor: {
                '@id': `${req.protocol || 'http'}://${
                  req.headers.host
                }/@users/${item.related('actor').get('id')}`,
                fullname: item.related('actor').get('fullname'),
                id: item.related('actor').get('id'),
                username: item.related('actor').get('id'),
              },
              comments: item.get('json').changeNote,
              may_revert: true,
              time: item.get('created'),
              transition_title: 'Edited',
              type: 'versioning',
              version: item.get('version'),
            })),
          ),
        ),
      ),
  },
];
