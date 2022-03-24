/**
 * Navigation routes.
 * @module routes/navigation/navigation
 */

import { documentRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@navigation',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const root = await documentRepository.findOne({ parent: null });
        const items = await documentRepository.findAll(
          { parent: root.get('uuid') },
          'position_in_parent',
        );
        res.send({
          '@id': `${req.protocol}://${req.headers.host}${req.params[0]}/@navigation`,
          items: items.map((item) => ({
            ...item.get('json'),
            '@id': `${req.protocol}://${req.headers.host}/${item.get('id')}`,
            '@type': item.get('type'),
            id: item.get('id'),
            UID: item.get('uuid'),
          })),
        });
      }),
  },
];
