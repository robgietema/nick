/**
 * Content routes.
 * @module routes/content/content
 */

import slugify from 'slugify';
import moment from 'moment';
import { flattenDeep, includes, keys, map, omit, pick, uniq } from 'lodash';

import {
  getRootUrl,
  lockExpired,
  mapAsync,
  mapSync,
  readFile,
  removeFile,
  RequestException,
  uniqueId,
  writeFile,
  writeImage,
} from '../../helpers';
import { Type } from '../../models';
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
  const fileFields = await type.getFactoryFields('Image');

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

export default [
  {
    op: 'post',
    view: '/@move',
    permission: 'Add',
    handler: async (req, res) => {
      // Get children
      await req.document.fetchRelated('_children');
      const childIds = req.document._children.map((child) => child.id);

      // Return items
      const items = [];

      // Loop through source objects to be moved
      await mapAsync(req.body.source, async (source) => {
        // Get item to be moved
        const document = await Document.fetchOne({ path: source });

        // If moved to same folder or subfolder do nothing
        if (
          req.document.uuid === document.parent ||
          includes(req.document.path, document.path)
        ) {
          items.push({
            source,
            target: source,
          });
        } else {
          // Get current (previous) parent of document to be moved
          const parent = Document.fetchById(document.parent);

          // Calculate new id and path
          const path = req.document.path;
          const newId = uniqueId(document.id, childIds);
          const newPath = `${path}${path === '/' ? '' : '/'}${newId}`;

          // Add new id to list of taken ids
          childIds.push(newId);

          // Replace path of moved object and children
          await Document.replacePath(source, newPath);

          // Save document in new location
          await document.update({
            parent: req.document.uuid,
            position_in_parent: 32767,
            path: newPath,
          });

          // Fetch children of previous parent
          await parent.fetchRelated('_children');
          await parent.fixOrder();

          // Add items to return array
          items.push({
            source,
            target: newPath,
          });
        }
      });

      // Fetch new children and fix order
      await req.document.fetchRelated('_children');
      await req.document.fixOrder();

      return {
        json: items.map((item) => ({
          source: `${getRootUrl(req)}${item.source}`,
          target: `${getRootUrl(req)}${item.target}`,
        })),
      };
    },
  },
  {
    op: 'get',
    view: '/@history/:version',
    permission: 'View',
    handler: async (req, res) => {
      await req.document.fetchRelated('[_children._type, _type]');
      await req.document.fetchVersion(parseInt(req.params.version, 10));
      return {
        json: await req.document.toJSON(req),
      };
    },
  },
  {
    op: 'get',
    view: '/@@download/:field',
    permission: 'View',
    handler: async (req, res) => {
      const field = req.document.json[req.params.field];
      const buffer = readFile(field.uuid);
      return {
        headers: {
          'Content-Type': field['content-type'],
          'Content-Disposition': `attachment; filename="${field.filename}"`,
        },
        binary: buffer,
      };
    },
  },
  {
    op: 'get',
    view: '/@@images/:uuid.:ext',
    permission: 'View',
    handler: async (req, res) => {
      const buffer = readFile(req.params.uuid);
      return {
        headers: { 'Content-Type': `image/${req.params.ext}` },
        binary: buffer,
      };
    },
  },
  {
    op: 'get',
    view: '/@@images/:field',
    permission: 'View',
    handler: async (req, res) => {
      const field = req.document.json[req.params.field];
      const buffer = readFile(field.uuid);
      return {
        headers: {
          'Content-Type': field['content-type'],
          'Content-Disposition': `attachment; filename="${field.filename}"`,
        },
        binary: buffer,
      };
    },
  },
  {
    op: 'get',
    view: '/@@images/:field/:scale',
    permission: 'View',
    handler: async (req, res) => {
      const field = req.document.json[req.params.field];
      const buffer = readFile(field.scales[req.params.scale].uuid);
      return {
        headers: {
          'Content-Type': field['content-type'],
          'Content-Disposition': `attachment; filename="${field.filename}"`,
        },
        binary: buffer,
      };
    },
  },
  {
    op: 'get',
    view: '',
    permission: 'View',
    handler: async (req, res) => {
      await req.document.fetchRelated('[_children(order)._type, _type]');
      return {
        json: await req.document.toJSON(req),
      };
    },
  },
  {
    op: 'post',
    view: '',
    permission: 'Add',
    handler: async (req, res) => {
      // Get content type date
      const type = await Type.fetchById(req.body['@type'], {
        related: '_workflow',
      });

      // Set creation time
      const created = moment.utc().format();

      // Get child nodes
      await req.document.fetchRelated('_children');

      // Set unique id
      let id =
        req.body.id ||
        slugify(req.body.title, { lower: true, remove: /[*+~.()'"!:@]/g });
      id = uniqueId(
        id,
        req.document._children.map((item) => item.id),
      );

      // Get json data
      await type.fetchSchema();
      const properties = type._schema.properties;

      // Handle file uploads
      let json = {
        ...omit(pick(req.body, keys(properties)), omitProperties),
      };
      json = await handleFiles(json, type);
      json = await handleImages(json, type);

      // Insert document in database
      const document = await req.document.createRelatedAndFetch('_children', {
        id,
        path: `${req.document.path === '/' ? '' : req.document.path}/${id}`,
        type: req.body['@type'],
        created,
        modified: created,
        version: 0,
        position_in_parent: req.document._children.length,
        lock: { locked: false, stealable: true },
        workflow_state: type._workflow.json.initial_state,
        owner: req.user.id,
        json,
      });

      // Create initial version
      await document.createRelated('_versions', {
        id,
        version: 0,
        created,
        actor: req.user.id,
        json: {
          ...document.json,
          changeNote: req.body.changeNote || 'Initial version',
        },
      });

      // Fetch type
      await document.fetchRelated('_type');

      // Send data back to client
      return {
        status: 201,
        json: await document.toJSON(req),
      };
    },
  },
  {
    op: 'patch',
    view: '',
    permission: 'Modify',
    handler: async (req, res) => {
      // Check if ordering request
      if (typeof req.body?.ordering !== 'undefined') {
        // Get children and reorder
        await req.document.fetchRelated('_children(order)');
        this.document.reorder(
          req.body.ordering.obj_id,
          req.body.ordering.delta,
        );

        // Send ok
        return {
          status: 204,
        };
      }

      // Check if locked
      const lock = req.document.lock;
      if (
        lock.locked &&
        !lockExpired(req.document) &&
        req.headers['lock-token'] !== lock.token
      ) {
        throw new RequestException(401, {
          error: {
            message: req.i18n(
              "You don't have permission to save this document because it is locked by another user.",
            ),
            type: req.i18n('Document locked'),
          },
        });
      }

      // Get id and path variables of document, parent and siblings
      await req.document.fetchRelated('_parent._children');
      const id = req.body.id || req.document.id;
      const path = req.document.path;

      // Get unique id if id has changed
      const newId =
        req.body.id && req.body.id !== req.document.id
          ? uniqueId(
              id,
              req.document._parent._children.map((sibling) => sibling.id),
            )
          : id;
      const newPath =
        path === '/' ? path : `${req.document._parent.path}/${newId}`;

      // Handle file uploads
      await req.type.fetchSchema();
      let json = {
        ...req.document.json,
        ...omit(
          pick(req.body, keys(req.type._schema.properties)),
          omitProperties,
        ),
      };
      json = await handleFiles(json, req.type);
      json = await handleImages(json, req.type);

      // Create new version
      const modified = moment.utc().format();
      const version = req.document.version + 1;
      await req.document.createRelated('_versions', {
        document: req.document.uuid,
        id: newId,
        created: modified,
        actor: req.user.id,
        version,
        json: {
          ...json,
          changeNote: req.body.changeNote,
        },
      });

      // If path has changed change path of document and children
      if (path !== newPath) {
        await Document.replacePath(path, newPath);
      }

      // Save document with new values
      await req.document.update({
        id: newId,
        path: newPath,
        version,
        modified,
        json,
        lock: {
          locked: false,
          stealable: true,
        },
      });

      // Send ok
      return {
        status: 204,
      };
    },
  },
  {
    op: 'delete',
    view: '',
    permission: 'Modify',
    handler: async (req, res) => {
      // Get file and image fields
      await req.type.fetchSchema();
      const fileFields = req.type.getFactoryFields('File');
      const imageFields = req.type.getFactoryFields('Image');

      // If file fields exist
      if (fileFields.length > 0 || imageFields.length > 0) {
        // Get versions
        await req.document.fetchRelated('_versions');

        // Get all file uuids from all versions and all fields
        const files = uniq(
          flattenDeep(
            req.document._versions.map((version) => [
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

      // Get parent
      await req.document.fetchRelated('_parent');
      const parent = req.document._parent;

      // Remove document (versions will be cascaded)
      await req.document.delete();

      // Fix order in parent
      await parent.fetchRelated('_children(order)');
      await parent.fixOrder();
      return {
        status: 204,
      };
    },
  },
];
