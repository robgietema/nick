/**
 * Navigation routes.
 * @module routes/navigation/navigation
 */

import { DocumentRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@navigation',
    handler: (req, res) =>
      requirePermission('View', req, res, () =>
        DocumentRepository.findOne({ parent: null }).then((root) =>
          DocumentRepository.findAll(
            { parent: root.get('uuid') },
            'position_in_parent',
          ).then((items) =>
            res.send({
              '@id': `${req.protocol || 'http'}://${req.headers.host}${
                req.params[0]
              }/@navigation`,
              items: items.map((item) => ({
                ...item.get('json'),
                '@id': `${req.protocol || 'http'}://${
                  req.headers.host
                }/${item.get('id')}`,
                '@type': item.get('type'),
                id: item.get('id'),
                UID: item.get('uuid'),
              })),
            }),
          ),
        ),
      ),
  },
];
