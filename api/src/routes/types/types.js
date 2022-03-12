/**
 * Types routes.
 * @module routes/types/types
 */

import { TypeRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@types',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const types = await TypeRepository.findAll();
        res.send(
          types.map((type) => ({
            '@id': `${req.protocol || 'http'}://${
              req.headers.host
            }/@types/${type.get('id')}`,
            addable: type.get('addable'),
            title: type.get('title'),
          })),
        );
      }),
  },
  {
    op: 'get',
    view: '/@types/:type',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        try {
          const type = await TypeRepository.findOne({ id: req.params.type });
          res.send({
            ...type.get('schema'),
            title: type.get('title'),
          });
        } catch (e) {
          res.status(404).send({ error: 'Not Found' });
        }
      }),
  },
];
