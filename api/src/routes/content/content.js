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
    review_state: document.get('workflowState'),
  };
}

/**
 * Create a unique id
 * @method uniqueId
 * @param {String} id Base id.
 * @param {Array<String>} ids Array of sibling ids.
 * @param {Number} counter Current iteration.
 * @returns {String} Unique id.
 */
function uniqueId(id, ids, counter = 0) {
  const newId = counter === 0 ? id : `${id}-${counter}`;
  return ids.indexOf(newId) === -1 ? newId : uniqueId(id, ids, counter + 1);
}

export default [
  {
    op: 'post',
    view: '/@move',
    handler: (req, res) =>
      requirePermission('Add', req, res, async () => {
        let siblings = await DocumentRepository.findAll({
          parent: req.document.get('uuid'),
        });
        siblings = siblings.map((sibling) => sibling.get('id'));

        let items = [];
        let source;

        for (let i = 0; i < req.body.source.length; i++) {
          source = req.body.source[i];
          const document = await DocumentRepository.findOne({ path: source });
          if (req.document.get('uuid') === document.get('parent')) {
            items.push({
              source,
              target: source,
            });
          } else {
            const newPath = `${req.document.get('path')}/${uniqueId(
              document.get('id'),
              siblings,
            )}`;
            await DocumentRepository.replacePath(source, newPath);
            await document.save({
              parent: req.document.get('uuid'),
              path: newPath,
            });
            items.push({
              source,
              target: newPath,
            });
          }
        }

        res.send(
          items.map((item) => ({
            source: `${req.protocol || 'http'}://${req.headers.host}${
              item.source
            }`,
            target: `${req.protocol || 'http'}://${req.headers.host}${
              item.target
            }`,
          })),
        );
      }),
  },
  {
    op: 'get',
    view: '/@history/:version',
    handler: (req, res) =>
      requirePermission('View', req, res, () =>
        DocumentRepository.findAll(
          { parent: req.document.get('uuid') },
          'position_in_parent',
        ).then((items) =>
          VersionRepository.findOne({
            document: req.document.get('uuid'),
            version: parseInt(req.params.version, 10),
          }).then((version) =>
            res.send({
              ...{
                ...documentToJson(req.document, req),
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
    handler: (req, res) =>
      requirePermission('View', req, res, () =>
        DocumentRepository.findAll(
          { parent: req.document.get('uuid') },
          'position_in_parent',
        ).then((items) =>
          res.send({
            ...documentToJson(req.document, req),
            items: items.map((item) => documentToJson(item, req)),
          }),
        ),
      ),
  },
  {
    op: 'post',
    view: '',
    handler: (req, res) =>
      requirePermission('Add', req, res, () =>
        TypeRepository.findOne(
          { id: req.body['@type'] },
          { withRelated: ['workflow'] },
        ).then((type) => {
          let id = req.body.id || slugify(req.body.title, { lower: true });
          const created = moment.utc().format();
          DocumentRepository.findAll({ parent: req.document.get('uuid') }).then(
            (items) => {
              id = uniqueId(
                id,
                items.map((item) => item.get('id')),
              );
              DocumentRepository.create(
                {
                  parent: req.document.get('uuid'),
                  id,
                  path: `${
                    req.document.get('path') === '/'
                      ? ''
                      : req.document.get('path')
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
    handler: (req, res) =>
      requirePermission('Modify', req, res, () =>
        TypeRepository.findOne({ id: req.document.get('type') }).then(
          (type) => {
            let id = req.body.id || req.document.get('id');
            const path = req.document.get('path');
            const slugs = path.split('/');
            const parent = dropRight(slugs).join('/');
            const modified = moment.utc().format();
            DocumentRepository.findAll({
              parent: req.document.get('parent'),
            }).then((items) => {
              id =
                req.body.id && req.body.id !== req.document.get('id')
                  ? uniqueId(
                      id,
                      items.map((item) => item.get('id')),
                    )
                  : id;
              const newPath = path === '/' ? path : `${parent}/${id}`;

              return VersionRepository.create({
                document: req.document.get('uuid'),
                id,
                created: modified,
                actor: req.user.get('uuid'),
                version: req.document.get('version'),
                json: {
                  ...req.document.get('json'),
                  changeNote: req.body.changeNote,
                },
              })
                .then(() =>
                  path === newPath
                    ? Promise.resolve({})
                    : DocumentRepository.replacePath(path, newPath),
                )
                .then(() =>
                  req.document.save(
                    {
                      id,
                      path: newPath,
                      version: req.document.get('version') + 1,
                      modified,
                      json: {
                        ...req.document.get('json'),
                        ...omit(
                          pick(req.body, keys(type.get('schema').properties)),
                          omitProperties,
                        ),
                      },
                    },
                    { patch: true },
                  ),
                )
                .then((data) => res.status(204).send());
            });
          },
        ),
      ),
  },
  {
    op: 'delete',
    view: '',
    handler: (req, res) =>
      requirePermission('Modify', req, res, () =>
        DocumentRepository.delete({ uuid: req.document.get('uuid') }).then(() =>
          res.status(204).send(),
        ),
      ),
  },
];
