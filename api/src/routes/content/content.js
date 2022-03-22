/**
 * Content routes.
 * @module routes/content/content
 */

import slugify from 'slugify';
import moment from 'moment';
import { dropRight, flatten, keys, omit, pick, uniq } from 'lodash';

import {
  DocumentRepository,
  TypeRepository,
  VersionRepository,
} from '../../repositories';
import {
  lockExpired,
  mapAsync,
  mapSync,
  readFile,
  removeFile,
  requirePermission,
  writeFile,
} from '../../helpers';

const omitProperties = ['@type', 'id', 'changeNote'];

/**
 * Convert document to json.
 * @method documentToJson
 * @param {Object} document Current document object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the document.
 */
async function documentToJson(document, req) {
  // Get file fields
  const type = await TypeRepository.findOne({ id: document.get('type') });
  const fileFields = type.getFactoryFields('File');

  // Loop through file fields
  const json = document.get('json');
  mapSync(fileFields, (field) => {
    // Set data
    json[field] = {
      'content-type': json[field]['content-type'],
      download: `${req.protocol || 'http'}://${req.headers.host}${document.get(
        'path',
      )}/@@download/file`,
      filename: json[field].filename,
      size: json[field].size,
    };
  });

  // Return data
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
    lock: document.get('lock'),
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
        // Get Siblings
        const siblings = await DocumentRepository.findAll({
          parent: req.document.get('uuid'),
        });

        let items = [];
        let parent;
        let path;

        // Loop through source objects to be moved
        await mapAsync(req.body.source, async (source) => {
          // Get item to be moved
          const document = await DocumentRepository.findOne({ path: source });

          // If moved to same folder or subfolder do nothing
          if (
            req.document.get('uuid') === document.get('parent') ||
            req.document.get('path').indexOf(document.get('path')) !== -1
          ) {
            items.push({
              source,
              target: source,
            });
          } else {
            parent = document.get('parent');
            path = req.document.get('path');
            const newPath = `${path}${path === '/' ? '' : '/'}${uniqueId(
              document.get('id'),
              siblings.map((sibling) => sibling.get('id')),
            )}`;
            await DocumentRepository.replacePath(source, newPath);
            await document.save({
              parent: req.document.get('uuid'),
              position_in_parent: 32767,
              path: newPath,
            });
            await DocumentRepository.fixOrder(parent);
            items.push({
              source,
              target: newPath,
            });
          }
        });
        await DocumentRepository.fixOrder(req.document.get('uuid'));

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
      requirePermission('View', req, res, async () => {
        let document = req.document;
        if (document.get('lock').locked && lockExpired(document)) {
          document = await DocumentRepository.deleteLock(req.document);
        }
        const items = await DocumentRepository.findAll(
          { parent: document.get('uuid') },
          'position_in_parent',
        );
        const version = await VersionRepository.findOne({
          document: document.get('uuid'),
          version: parseInt(req.params.version, 10),
        });
        res.send({
          ...{
            ...(await documentToJson(document, req)),
            ...version.get('json'),
            id: version.get('id'),
            modified: version.get('created'),
          },
          items: await Promise.all(
            items.map(async (item) => await documentToJson(item, req)),
          ),
        });
      }),
  },
  {
    op: 'get',
    view: '/@@download/:field',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const field = req.document.get('json')[req.params.field];
        res.setHeader('Content-Type', field['content-type']);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${field.filename}"`,
        );
        const buffer = readFile(field.uuid);
        res.write(buffer, 'binary');
        res.end(undefined, 'binary');
      }),
  },
  {
    op: 'get',
    view: '',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        let document = req.document;
        if (document.get('lock').locked && lockExpired(document)) {
          document = await DocumentRepository.deleteLock(req.document);
        }
        const items = await DocumentRepository.findAll(
          { parent: document.get('uuid') },
          'position_in_parent',
        );
        res.send({
          ...(await documentToJson(document, req)),
          items: await Promise.all(
            items.map(async (item) => documentToJson(item, req)),
          ),
        });
      }),
  },
  {
    op: 'post',
    view: '',
    handler: (req, res) =>
      requirePermission('Add', req, res, async () => {
        // Get content type date
        const type = await TypeRepository.findOne(
          { id: req.body['@type'] },
          { withRelated: ['workflow'] },
        );

        // Set creation time
        const created = moment.utc().format();

        // Get child nodes
        const items = await DocumentRepository.findAll({
          parent: req.document.get('uuid'),
        });

        // Set unique id
        let id =
          req.body.id ||
          slugify(req.body.title, { lower: true, remove: /[*+~.()'"!:@]/g });
        id = uniqueId(
          id,
          items.map((item) => item.get('id')),
        );

        // Get json data
        const properties = type.get('schema').properties;
        const json = {
          ...omit(pick(req.body, keys(properties)), omitProperties),
        };

        // Get file fields
        const fileFields = type.getFactoryFields('File');

        mapSync(fileFields, (field) => {
          // Create filestream
          const { uuid, size } = writeFile(
            json[field].data,
            json[field].encoding,
          );

          // Set data
          json[field] = {
            'content-type': json[field]['content-type'],
            uuid,
            filename: json[field].filename,
            size,
          };
        });

        // Insert document in database
        const newDocument = await DocumentRepository.create(
          {
            parent: req.document.get('uuid'),
            id,
            path: `${
              req.document.get('path') === '/' ? '' : req.document.get('path')
            }/${id}`,
            type: req.body['@type'],
            created,
            modified: created,
            version: 0,
            position_in_parent: items.length,
            lock: { locked: false, stealable: true },
            workflow_state: type.related('workflow').get('json').initial_state,
            owner: req.user.get('id'),
            json,
          },
          { method: 'insert' },
        );

        // Fetch inserted data
        const document = await newDocument.fetch();

        // Create initial version
        await VersionRepository.create({
          document: document.get('uuid'),
          id,
          version: 0,
          created,
          actor: req.user.get('id'),
          json: {
            ...document.get('json'),
            changeNote: req.body.changeNote || 'Initial version',
          },
        });

        // Send data back to client
        res.status(201).send(await documentToJson(document, req));
      }),
  },
  {
    op: 'patch',
    view: '',
    handler: (req, res) =>
      requirePermission('Modify', req, res, async () => {
        // Check if ordering request
        if (typeof req.body?.ordering !== 'undefined') {
          // Get document to be ordered
          const id = req.body.ordering.obj_id;
          const delta = req.body.ordering.delta;
          const document = await DocumentRepository.findOne({
            parent: req.document.get('uuid'),
            id,
          });

          // Check ordering method
          if (delta === 'top') {
            await document.save({ position_in_parent: -1 }, { patch: true });
          } else if (delta === 'bottom') {
            await document.save({ position_in_parent: 32767 }, { patch: true });
          } else {
            await DocumentRepository.reorder(
              req.document.get('uuid'),
              id,
              delta,
            );
          }

          // Fix order
          await DocumentRepository.fixOrder(req.document.get('uuid'));

          // Send ok
          return res.status(204).send();
        }

        // Check if locked
        const lock = req.document.get('lock');
        if (
          lock.locked &&
          !lockExpired(req.document) &&
          req.headers['lock-token'] !== lock.token
        ) {
          return res.status(401).send({
            error: {
              message:
                "You don't have permission to save this document because it is locked by another user.",
              type: 'Document locked',
            },
          });
        }

        // Get id and path variables of document, parent and siblings
        const id = req.body.id || req.document.get('id');
        const path = req.document.get('path');
        const slugs = path.split('/');
        const parent = dropRight(slugs).join('/');
        const siblings = await DocumentRepository.findAll({
          parent: req.document.get('parent'),
        });

        // Get unique id if id has changed
        const newId =
          req.body.id && req.body.id !== req.document.get('id')
            ? uniqueId(
                id,
                siblings.map((sibling) => sibling.get('id')),
              )
            : id;
        const newPath = path === '/' ? path : `${parent}/${newId}`;

        const type = await TypeRepository.findOne({
          id: req.document.get('type'),
        });

        // Get json data
        const json = {
          ...req.document.get('json'),
          ...omit(
            pick(req.body, keys(type.get('schema').properties)),
            omitProperties,
          ),
        };

        // Get file fields
        const fileFields = type.getFactoryFields('File');

        mapSync(fileFields, (field) => {
          // Check if new data is uploaded
          if ('data' in json[field]) {
            // Create filestream
            const { uuid, size } = writeFile(
              json[field].data,
              json[field].encoding,
            );

            // Set data
            json[field] = {
              'content-type': json[field]['content-type'],
              uuid,
              filename: json[field].filename,
              size,
            };
          }
        });

        // Create new version
        const modified = moment.utc().format();
        const version = req.document.get('version') + 1;
        await VersionRepository.create({
          document: req.document.get('uuid'),
          id: newId,
          created: modified,
          actor: req.user.get('id'),
          version,
          json: {
            ...json,
            changeNote: req.body.changeNote,
          },
        });

        // If path has changed change path of document and children
        if (path !== newPath) {
          await DocumentRepository.replacePath(path, newPath);
        }

        // Save document with new values
        await req.document.save(
          {
            id: newId,
            path: newPath,
            version,
            modified,
            json,
            lock: {
              locked: false,
              stealable: true,
            },
          },
          { patch: true },
        );

        // Send ok
        res.status(204).send();
      }),
  },
  {
    op: 'delete',
    view: '',
    handler: (req, res) =>
      requirePermission('Modify', req, res, async () => {
        // Get parent id
        const parent = req.document.get('parent');

        // Get file fields
        const type = await TypeRepository.findOne({
          id: req.document.get('type'),
        });
        const fileFields = type.getFactoryFields('File');

        // If file fields exist
        if (fileFields.length > 0) {
          // Find all version
          const versions = await VersionRepository.findAll({
            document: req.document.get('uuid'),
          });

          // Get all file uuids from all versions and all fields
          const files = uniq(
            flatten(
              versions.map((version) =>
                fileFields.map((field) => version.get('json')[field].uuid),
              ),
            ),
          );

          // Remove files
          files.map((file) => removeFile(file));
        }

        // Remove document (versions will be cascaded)
        await DocumentRepository.delete({ uuid: req.document.get('uuid') });

        // Fix order in parent
        await DocumentRepository.fixOrder(parent);
        res.status(204).send();
      }),
  },
];
