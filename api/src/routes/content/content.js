/**
 * Content routes.
 * @module routes/content/content
 */

import slugify from 'slugify';
import moment from 'moment';
import { dropRight, keys, omit, pick } from 'lodash';

import {
  DocumentRepository,
  TypeRepository,
  VersionRepository,
} from '../../repositories';
import { requirePermission } from '../../helpers';

const omitProperties = ['@type', 'id', 'changeNote'];

/**
 * Convert document to json.
 * @method documentToJson
 * @param {Object} document Current document object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the document.
 */
function documentToJson(document, req) {
  return {
    ...document.get('json'),
    '@id': `${req.protocol || 'http'}://${req.headers.host}${document.get(
      'path',
    )}`,
    '@type': document.get('type'),
    id: document.get('id'),
    created: document.get('created'),
    modified: document.get('modified'),
    UID: document.get('uuid'),
    is_folderish: true,
    review_state: document.get('workflow_state'),
  };
}

/**
 * Create a unique id
 * @method uniqueId
 * @param {String} id Base id.
 * @param {Number} counter Current iteration.
 * @param {Array<String>} ids Array of sibling ids.
 * @returns {String} Unique id.
 */
function uniqueId(id, counter, ids) {
  const newId = counter === 0 ? id : `${id}-${counter}`;
  return ids.indexOf(newId) === -1 ? newId : uniqueId(id, counter + 1, ids);
}

export default [
  {
    op: 'get',
    view: '/@history/:version',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () =>
        DocumentRepository.findAll(
          { parent: context.get('uuid') },
          'position_in_parent',
        ).then((items) =>
          VersionRepository.findOne({
            document: context.get('uuid'),
            version: parseInt(req.params.version, 10),
          }).then((version) =>
            res.send({
              ...{
                ...documentToJson(context, req),
                ...version.get('json'),
                id: version.get('id'),
                modified: version.get('created'),
              },
              items: items.map((item) => documentToJson(item, req)),
            }),
          ),
        ),
      ),
  },
  {
    op: 'get',
    view: '',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () =>
        DocumentRepository.findAll(
          { parent: context.get('uuid') },
          'position_in_parent',
        ).then((items) =>
          res.send({
            ...documentToJson(context, req),
            items: items.map((item) => documentToJson(item, req)),
          }),
        ),
      ),
  },
  {
    op: 'post',
    view: '',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('Add', permissions, res, () =>
        TypeRepository.findOne(
          { id: req.body['@type'] },
          { withRelated: ['workflow'] },
        ).then((type) => {
          let id = req.body.id || slugify(req.body.title, { lower: true });
          const created = moment.utc().format();
          DocumentRepository.findAll({ parent: context.get('uuid') }).then(
            (items) => {
              id = uniqueId(
                id,
                0,
                items.map((item) => item.get('id')),
              );
              DocumentRepository.create(
                {
                  parent: context.get('uuid'),
                  id,
                  path: `${
                    context.get('path') === '/' ? '' : context.get('path')
                  }/${id}`,
                  type: req.body['@type'],
                  created,
                  modified: created,
                  version: 0,
                  position_in_parent: 0,
                  workflow_state: type.related('workflow').get('json')
                    .initial_state,
                  json: {
                    ...omit(
                      pick(req.body, keys(type.get('schema').properties)),
                      omitProperties,
                    ),
                  },
                },
                { method: 'insert' },
              )
                .then((document) => document.fetch())
                .then((document) =>
                  VersionRepository.create({
                    document: document.get('uuid'),
                    id,
                    version: 0,
                    created,
                    actor: req.user.get('uuid'),
                    json: {
                      ...document.get('json'),
                      changeNote: req.body.changeNote || 'Initial version',
                    },
                  }).then((version) =>
                    res
                      .status(201)
                      .send(
                        documentToJson(document, req, `/${document.get('id')}`),
                      ),
                  ),
                );
            },
          );
        }),
      ),
  },
  {
    op: 'patch',
    view: '',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('Modify', permissions, res, () =>
        TypeRepository.findOne({ id: context.get('type') }).then((type) => {
          let id = req.body.id || context.get('id');
          const path = context.get('path');
          const slugs = path.split('/');
          const parent = dropRight(slugs).join('/');
          const modified = moment.utc().format();
          DocumentRepository.findAll({ parent: context.get('parent') }).then(
            (items) => {
              id = uniqueId(
                id,
                0,
                items.map((item) => item.get('id')),
              );
              const newPath = path === '/' ? path : `${parent}/${id}`;

              return context
                .save(
                  {
                    id,
                    path: newPath,
                    version: context.get('version') + 1,
                    modified,
                    json: {
                      ...context.get('json'),
                      ...omit(
                        pick(req.body, keys(type.get('schema').properties)),
                        omitProperties,
                      ),
                    },
                  },
                  { patch: true },
                )
                .then(() =>
                  VersionRepository.create({
                    document: context.get('uuid'),
                    id,
                    created: modified,
                    actor: req.user.get('uuid'),
                    version: context.get('version'),
                    json: {
                      ...context.get('json'),
                      changeNote: req.body.changeNote,
                    },
                  }),
                )
                .then(() =>
                  path === newPath
                    ? Promise.resolve({})
                    : DocumentRepository.replacePath(path, newPath),
                )
                .then((data) => res.status(204).send());
            },
          );
        }),
      ),
  },
  {
    op: 'delete',
    view: '',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('Delete', permissions, res, () =>
        DocumentRepository.delete({ uuid: context.get('uuid') }).then(() =>
          res.status(204).send(),
        ),
      ),
  },
];
