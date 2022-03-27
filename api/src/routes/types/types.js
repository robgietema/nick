/**
 * Types routes.
 * @module routes/types/types
 */

import { omit } from 'lodash';

import { Type } from '../../models';
import { requirePermission, translateSchema } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@types',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const types = await Type.findAll();
        res.send(types.toJSON(req));
      }),
  },
  {
    op: 'get',
    view: '/@types/:type',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const type = await Type.findById(req.params.type);
        if (!type) {
          return res.status(404).send({ error: req.i18n('Not Found') });
        }
        res.send({
          ...translateSchema(omit(await type.getSchema(), ['behaviors']), req),
          title: req.i18n(type.title),
        });
      }),
  },
];
