/**
 * Types routes.
 * @module routes/types/types
 */

import { map, mapValues } from 'lodash';

import { typeRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

/**
 * Translate the schema
 * @method translateSchema
 * @param {Object} schema Schema object.
 * @param {Object} req Request object.
 * @returns {Object} Translated schema.
 */
function translateSchema(schema, req) {
  return {
    ...schema,
    fieldsets: map(schema.fieldsets, (fieldset) => ({
      ...fieldset,
      title: req.i18n(fieldset.title),
    })),
    properties: mapValues(schema.properties, (property) => ({
      ...property,
      title: req.i18n(property.title),
      description: req.i18n(property.description),
    })),
  };
}

export default [
  {
    op: 'get',
    view: '/@types',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const types = await typeRepository.findAll();
        res.send(
          types.map((type) => ({
            '@id': `${req.protocol}://${req.headers.host}/@types/${type.get(
              'id',
            )}`,
            addable: type.get('addable'),
            title: req.i18n(type.get('title')),
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
          const type = await typeRepository.findOne({ id: req.params.type });
          res.send({
            ...translateSchema(type.get('schema'), req),
            title: req.i18n(type.get('title')),
          });
        } catch (e) {
          res.status(404).send({ error: req.i18n('Not Found') });
        }
      }),
  },
];
