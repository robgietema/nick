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
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const items = await VersionRepository.findAll(
          { document: req.document.get('uuid') },
          'version desc',
          { withRelated: ['actor'] },
        );
        res.send(
          items.map((item) => ({
            '@id': `${req.protocol}://${req.headers.host}${req.document.get(
              'path',
            )}/@history/${item.get('version')}`,
            action: 'Edited',
            actor: {
              '@id': `${req.protocol}://${req.headers.host}/@users/${item
                .related('actor')
                .get('id')}`,
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
        );
      }),
  },
];
