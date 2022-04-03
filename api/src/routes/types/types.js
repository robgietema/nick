/**
 * Types routes.
 * @module routes/types/types
 */

import { omit } from 'lodash';

import { translateSchema } from '../../helpers';
import { Type } from '../../models';

export default [
  {
    op: 'get',
    view: '/@types',
    permission: 'View',
    handler: async (req, res) => {
      const types = await Type.fetchAll();
      res.send(types.toJSON(req));
    },
  },
  {
    op: 'get',
    view: '/@types/:type',
    permission: 'View',
    handler: async (req, res) => {
      const type = await Type.fetchById(req.params.type);
      if (!type) {
        return res.status(404).send({ error: req.i18n('Not Found') });
      }
      await type.fetchSchema();
      res.send({
        ...translateSchema(omit(type._schema, ['behaviors']), req),
        title: req.i18n(type.title),
      });
    },
  },
];
