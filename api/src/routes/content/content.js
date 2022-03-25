/**
 * Content routes.
 * @module routes/content/content
 */

import slugify from 'slugify';
import moment from 'moment';
import {
  dropRight,
  flattenDeep,
  keys,
  map,
  mapValues,
  omit,
  pick,
  uniq,
} from 'lodash';

import {
  documentRepository,
  typeRepository,
  versionRepository,
} from '../../repositories';
import {
  lockExpired,
  mapAsync,
  mapSync,
  readFile,
  removeFile,
  requirePermission,
  uniqueId,
  writeFile,
  writeImage,
} from '../../helpers';
import { config } from '../../../config';

const omitProperties = ['@type', 'id', 'changeNote'];

/**
 * Handle file uploads and updates
 * @method handleFiles
 * @param {Object} json Current json object.
 * @param {Object} type Type object.
 * @returns {Object} Fields with uuid info.
 */
async function handleFiles(json, type) {
  // Make a copy of the json data
  const fields = { ...json };

  // Get file fields
  const fileFields = await type.getFactoryFields('File');

  mapSync(fileFields, (field) => {
    // Check if new data is uploaded
    if ('data' in fields[field]) {
      // Create filestream
      const { uuid, size } = writeFile(
        fields[field].data,
        fields[field].encoding,
      );

      // Set data
      fields[field] = {
        'content-type': fields[field]['content-type'],
        uuid,
        filename: fields[field].filename,
        size,
      };
    }
  });

  // Return new field data
  return fields;
}

/**
 * Handle image uploads and updates
 * @method handleImages
 * @param {Object} json Current json object.
 * @param {Object} type Type object.
 * @returns {Object} Fields with uuid info.
 */
async function handleImages(json, type) {
  // Make a copy of the json data
  const fields = { ...json };

  // Get file fields
  const fileFields = type.getFactoryFields('Image');

  await mapAsync(fileFields, async (field) => {
    // Check if new data is uploaded
    if ('data' in fields[field]) {
      // Create filestream
      const { uuid, size, width, height, scales } = await writeImage(
        fields[field].data,
        fields[field].encoding,
      );

      // Set data
      fields[field] = {
        'content-type': fields[field]['content-type'],
        uuid,
        width,
        height,
        scales,
        filename: fields[field].filename,
        size,
      };
    }
  });

  // Return new field data
  return fields;
}

/**
 * Convert document to json.
 * @method documentToJson
 * @param {Object} document Current document object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the document.
 */
async function documentToJson(document, req) {
  // Get file fields
  const type = await typeRepository.findOne({ id: document.get('type') });
  const json = document.get('json');

  // Loop through file fields
  const fileFields = await type.getFactoryFields('File');
  mapSync(fileFields, (field) => {
    // Set data
    json[field] = {
      'content-type': json[field]['content-type'],
      download: `${req.protocol}://${req.headers.host}${document.get(
        'path',
      )}/@@download/file`,
      filename: json[field].filename,
      size: json[field].size,
    };
  });

  // Loop through image fields
  const imageFields = await type.getFactoryFields('Image');
  mapSync(imageFields, (field) => {
    // Set data
    json[field] = {
      'content-type': json[field]['content-type'],
      download: `${req.protocol}://${req.headers.host}${document.get(
        'path',
      )}/@@images/${json[field].uuid}.${
        json[field]['content-type'].split('/')[1]
      }`,
      filename: json[field].filename,
      size: json[field].size,
      width: json[field].width,
      height: json[field].height,
      scales: mapValues(json[field].scales, (scale) => ({
        width: scale.width,
        height: scale.height,
        download: `${req.protocol}://${req.headers.host}${document.get(
          'path',
        )}/@@images/${scale.uuid}.${json[field]['content-type'].split('/')[1]}`,
      })),
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
    is_folderish: type.get('behaviors').indexOf('folderish') !== -1,
    review_state: document.get('workflow_state'),
    lock: document.get('lock'),
  };
}

export default [
  {
    op: 'post',
    view: '/@move',
    handler: (req, res) =>
      requirePermission('Add', req, res, async () => {
        // Get Siblings
        const siblings = await documentRepository.findAll({
          parent: req.document.get('uuid'),
        });

        let items = [];
        let parent;
        let path;

        // Loop through source objects to be moved
        await mapAsync(req.body.source, async (source) => {
          // Get item to be moved
          const document = await documentRepository.findOne({ path: source });

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
            await documentRepository.replacePath(source, newPath);
            await document.save({
              parent: req.document.get('uuid'),
              position_in_parent: 32767,
              path: newPath,
            });
            await documentRepository.fixOrder(parent);
            items.push({
              source,
              target: newPath,
            });
          }
        });
        await documentRepository.fixOrder(req.document.get('uuid'));

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
          document = await documentRepository.deleteLock(req.document);
        }
        const items = await documentRepository.findAll(
          { parent: document.get('uuid') },
          'position_in_parent',
        );
        const version = await versionRepository.findOne({
          document: document.get('uuid'),
          version: parseInt(req.params.version, 10),
        });
        res.send({
          ...{
            ...(await documentToJson(document, req)),
            ...omit(version.get('json'), ['changeNote']),
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
    view: '/@@images/:uuid.:ext',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        res.setHeader('Content-Type', `image/${req.params.ext}`);
        const buffer = readFile(req.params.uuid);
        res.write(buffer, 'binary');
        res.end(undefined, 'binary');
      }),
  },
  {
    op: 'get',
    view: '/@@images/:field',
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
    view: '/@@images/:field/:scale',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const field = req.document.get('json')[req.params.field];
        res.setHeader('Content-Type', field['content-type']);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${field.filename}"`,
        );
        const buffer = readFile(field.scales[req.params.scale].uuid);
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
          document = await documentRepository.deleteLock(req.document);
        }
        const items = await documentRepository.findAll(
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
        const type = await typeRepository.findOne(
          { id: req.body['@type'] },
          { withRelated: ['workflow'] },
        );

        // Set creation time
        const created = moment.utc().format();

        // Get child nodes
        const items = await documentRepository.findAll({
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
        const properties = (await type.getSchema()).properties;

        // Handle file uploads
        let json = {
          ...omit(pick(req.body, keys(properties)), omitProperties),
        };
        json = await handleFiles(json, type);
        json = await handleImages(json, type);

        // Insert document in database
        const newDocument = await documentRepository.create(
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
        await versionRepository.create({
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
          const document = await documentRepository.findOne({
            parent: req.document.get('uuid'),
            id,
          });

          // Check ordering method
          if (delta === 'top') {
            await document.save({ position_in_parent: -1 }, { patch: true });
          } else if (delta === 'bottom') {
            await document.save({ position_in_parent: 32767 }, { patch: true });
          } else {
            await documentRepository.reorder(
              req.document.get('uuid'),
              id,
              delta,
            );
          }

          // Fix order
          await documentRepository.fixOrder(req.document.get('uuid'));

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
              message: req.i18n(
                "You don't have permission to save this document because it is locked by another user.",
              ),
              type: req.i18n('Document locked'),
            },
          });
        }

        // Get id and path variables of document, parent and siblings
        const id = req.body.id || req.document.get('id');
        const path = req.document.get('path');
        const slugs = path.split('/');
        const parent = dropRight(slugs).join('/');
        const siblings = await documentRepository.findAll({
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

        const type = await typeRepository.findOne({
          id: req.document.get('type'),
        });

        // Handle file uploads
        let json = {
          ...req.document.get('json'),
          ...omit(
            pick(req.body, keys((await type.getSchema()).properties)),
            omitProperties,
          ),
        };
        json = await handleFiles(json, type);
        json = await handleImages(json, type);

        // Create new version
        const modified = moment.utc().format();
        const version = req.document.get('version') + 1;
        await versionRepository.create({
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
          await documentRepository.replacePath(path, newPath);
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

        // Get file and image fields
        const type = await typeRepository.findOne({
          id: req.document.get('type'),
        });
        const fileFields = await type.getFactoryFields('File');
        const imageFields = await type.getFactoryFields('Image');

        // If file fields exist
        if (fileFields.length > 0 || imageFields.length > 0) {
          // Find all version
          const versions = await versionRepository.findAll({
            document: req.document.get('uuid'),
          });

          // Get all file uuids from all versions and all fields
          const files = uniq(
            flattenDeep(
              versions.map((version) => [
                ...fileFields.map((field) => version.get('json')[field].uuid),
                ...imageFields.map((field) => [
                  version.get('json')[field].uuid,
                  ...map(
                    keys(config.imageScales),
                    (scale) => version.get('json')[field].scales[scale].uuid,
                  ),
                ]),
              ]),
            ),
          );

          // Remove files
          files.map((file) => removeFile(file));
        }

        // Remove document (versions will be cascaded)
        await documentRepository.delete({ uuid: req.document.get('uuid') });

        // Fix order in parent
        await documentRepository.fixOrder(parent);
        res.status(204).send();
      }),
  },
];
