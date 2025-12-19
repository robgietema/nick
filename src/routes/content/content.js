/**
 * Content routes.
 * @module routes/content/content
 */

import express from 'express';
import moment from 'moment';
import {
  drop,
  flattenDeep,
  includes,
  intersection,
  isArray,
  join,
  keys,
  map,
  omit,
  pick,
  split,
  startsWith,
  uniq,
} from 'lodash';
import { v4 as uuid } from 'uuid';

import { getRootUrl, getUrl } from '../../helpers/url/url';
import { lockExpired } from '../../helpers/lock/lock';
import { mapAsync, uniqueId } from '../../helpers/utils/utils';
import { readFile, removeFile } from '../../helpers/fs/fs';
import { RequestException } from '../../helpers/error/error';
import {
  handleFiles,
  handleImages,
  handleRelationLists,
  handleBlockReferences,
} from '../../helpers/content/content';

import { Document } from '../../models/document/document';
import { Type } from '../../models/type/type';

import { handler as actions } from '../actions/actions';
import { handler as breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { handler as navigation } from '../navigation/navigation';
import { handler as navroot } from '../navroot/navroot';
import { handler as related } from '../related/related';
import { handler as translations } from '../translations/translations';
import { handler as types } from '../types/types';
import { handler as workflow } from '../workflow/workflow';

import config from '../../helpers/config/config';

const omitProperties = ['@type', 'id', 'changeNote', 'language'];

const getComponents = async (req, trx) => {
  const components = {};

  // Get nodes to expand
  const expand = req.query?.expand?.split(',') || [];

  // Get base url
  const baseUrl = getUrl(req);

  // Include catalog expander
  if (includes(expand, 'catalog')) {
    await req.document.fetchRelated('_catalog', trx);

    if (req.document._children) {
      await mapAsync(req.document._children, async (child) => {
        await child.fetchRelated('_catalog', trx);
        await child.fetchRelationLists(trx);
      });
    }
    components.catalog = {
      ...req.document._catalog.toJSON(req),
      '@id': `${baseUrl}/@catalog`,
    };
  } else {
    components.catalog = { '@id': `${baseUrl}/@catalog` };
  }

  // Include actions expander
  if (includes(expand, 'actions')) {
    components.actions = (await actions(req, trx)).json;
  } else {
    components.actions = { '@id': `${baseUrl}/@actions` };
  }

  // Include breadcrumbs expander
  if (includes(expand, 'breadcrumbs')) {
    components.breadcrumbs = (await breadcrumbs(req, trx)).json;
  } else {
    components.breadcrumbs = { '@id': `${baseUrl}/@breadcrumbs` };
  }

  // Include navigation expander
  if (includes(expand, 'navigation')) {
    components.navigation = (await navigation(req, trx)).json;
  } else {
    components.navigation = { '@id': `${baseUrl}/@navigation` };
  }

  // Include navroot expander
  if (includes(expand, 'navroot')) {
    components.navroot = (await navroot(req, trx)).json;
  } else {
    components.navroot = { '@id': `${baseUrl}/@navroot` };
  }

  // Include related expander
  if (includes(expand, 'related')) {
    components.related = (await related(req, trx)).json;
  } else {
    components.related = { '@id': `${baseUrl}/@related` };
  }

  // Include types expander
  if (includes(expand, 'types')) {
    components.types = (await types(req, trx)).json;
  } else {
    components.types = { '@id': `${baseUrl}/@types` };
  }

  // Include workflow expander
  if (includes(expand, 'workflow')) {
    components.workflow = (await workflow(req, trx)).json;
  } else {
    components.workflow = { '@id': `${baseUrl}/@workflow` };
  }

  // Include translations expander
  if (includes(expand, 'translations')) {
    components.translations = (await translations(req, trx)).json;
  } else {
    components.translations = { '@id': `${baseUrl}/@translations` };
  }

  // Return components
  return components;
};

export default [
  {
    op: 'post',
    view: '/@move',
    permission: 'Add',
    client: 'moveContent',
    handler: async (req, trx) => {
      // Get children
      await req.document.fetchRelated('_children', trx);
      const childIds = req.document._children.map((child) => child.id);

      // Return items
      const items = [];

      // Loop through source objects to be moved
      const sources = isArray(req.body.source)
        ? req.body.source
        : [req.body.source];
      await mapAsync(sources, async (source) => {
        // Get item to be moved
        const document = await Document.fetchOne({ path: source }, {}, trx);

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
          const parent = await Document.fetchById(document.parent, {}, trx);

          // Calculate new id and path
          const path = req.document.path;
          const newId = uniqueId(document.id, childIds);
          const newPath = `${path}${path === '/' ? '' : '/'}${newId}`;

          // Add new id to list of taken ids
          childIds.push(newId);

          // Replace path of moved object and children
          await Document.replacePath(source, newPath, trx);

          // Save document in new location
          await document.update(
            {
              parent: req.document.uuid,
              position_in_parent: 32767,
              path: newPath,
            },
            trx,
          );

          // Fetch children of previous parent
          await parent.fetchRelated('_children', trx);
          await parent.fixOrder(trx);

          // Reindex siblings
          await parent.reindexChildren(trx);

          // Add items to return array
          items.push({
            source,
            target: newPath,
          });
        }
      });

      // Fetch new children and fix order
      await req.document.fetchRelated('_children', trx);
      await req.document.fixOrder(trx);

      // Reindex children
      await req.document.reindexChildren(trx);

      return {
        json: items.map((item) => ({
          source: `${getRootUrl(req)}${item.source}`,
          target: `${getRootUrl(req)}${item.target}`,
        })),
      };
    },
  },
  {
    op: 'post',
    view: '/@copy',
    permission: 'Add',
    client: 'copyContent',
    handler: async (req, trx) => {
      // Get children
      await req.document.fetchRelated('_children', trx);
      const childIds = req.document._children.map((child) => child.id);

      // Return items
      const items = [];

      // Loop through source objects to be copied
      const sources = isArray(req.body.source)
        ? req.body.source
        : [req.body.source];
      await mapAsync(sources, async (source) => {
        // Get item to be moved
        const document = await Document.fetchOne({ path: source }, {}, trx);

        // Calculate new id and path
        const path = req.document.path;
        const newId = uniqueId(document.id, childIds);
        const newPath = `${path}${path === '/' ? '' : '/'}${newId}`;

        // Add new id to list of taken ids
        childIds.push(newId);

        // Copy object
        await document.copy(req.document.uuid, newPath, newId, trx);

        // Add items to return array
        items.push({
          source,
          target: newPath,
        });
      });

      // Fetch new children and fix order
      await req.document.fetchRelated('_children', trx);
      await req.document.fixOrder(trx);

      // Reindex children
      await req.document.reindexChildren(trx);

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
    client: 'getHistoryVersion',
    handler: async (req, trx) => {
      await req.document.fetchRelated('[_children._type, _type]', trx);
      await req.document.fetchVersion(parseInt(req.params.version, 10), trx);
      await req.document.fetchRelationLists(trx);
      return {
        json: await handleBlockReferences(
          await req.document.toJSON(req, await getComponents(req, trx)),
        ),
      };
    },
  },
  {
    op: 'get',
    view: '/@@download/:field',
    permission: 'View',
    handler: async (req, trx) => {
      const field = req.document.json[req.params.field];
      const buffer = readFile(field.uuid);
      return {
        headers: {
          'content-type': field['content-type'],
          'content-disposition': `attachment; filename="${field.filename}"`,
          'Accept-Ranges': 'bytes',
        },
        binary: buffer,
      };
    },
  },
  {
    op: 'get',
    view: '/@@images/:uuid.:ext',
    permission: 'View',
    handler: async (req, trx) => {
      const buffer = readFile(req.params.uuid);
      return {
        headers: {
          'content-type': `image/${req.params.ext}`,
        },
        binary: buffer,
      };
    },
  },
  {
    op: 'get',
    view: '/@@images/:field',
    permission: 'View',
    handler: async (req, trx) => {
      const field = req.document.json[req.params.field];
      const buffer = readFile(field.uuid);
      return {
        headers: {
          'content-type': field['content-type'],
          'content-disposition': `attachment; filename="${field.filename}"`,
        },
        binary: buffer,
      };
    },
  },
  {
    op: 'get',
    view: '/@@images/:field/:scale',
    permission: 'View',
    handler: async (req, trx) => {
      const field = req.document.json[req.params.field];
      const buffer = readFile(field.scales[req.params.scale].uuid);
      return {
        headers: {
          'content-type': field['content-type'],
          'content-disposition': `attachment; filename="${field.filename}"`,
        },
        binary: buffer,
      };
    },
  },
  {
    op: 'get',
    view: '@export',
    permission: 'View',
    client: 'exportContent',
    handler: async (req, trx) => {
      const json = await req.document.toJSON(req);
      return {
        headers: {
          'content-cype': 'application/json',
          'content-disposition': `attachment; filename="${
            req.document.path === '/'
              ? '_root.json'
              : `${join(drop(split(req.document.path, '/')), '.')}.json`
          }"`,
        },
        json: {
          uuid: json['UID'],
          type: json['@type'],
          workflow_state: json['review_state'],
          ...omit(json, [
            '@id',
            '@type',
            'UID',
            'review_state',
            'id',
            'is_folderish',
            'lock',
          ]),
        },
      };
    },
  },
  {
    op: 'get',
    view: '',
    permission: 'View',
    client: 'getContent',
    handler: async (req, trx) => {
      await req.document.fetchRelated('[_children(order)._type, _type]', trx);
      await req.document.fetchRelationLists(trx);
      const json = await req.document.toJSON(req, await getComponents(req));
      return {
        json: await handleBlockReferences(json, trx),
      };
    },
  },
  {
    op: 'post',
    view: '',
    permission: 'Add',
    client: 'addContent',
    middleware: express.json({
      limit: config.settings.requestLimit?.files || '10mb',
    }),
    handler: async (req, trx) => {
      // Get content type date
      const type = await Type.fetchById(
        req.body['@type'],
        {
          related: '_workflow',
        },
        trx,
      );

      // Check required fields
      const required = type._schema.required;
      const requiredPosted = intersection(required, keys(req.body));
      if (required.length !== requiredPosted.length) {
        throw new RequestException(400, {
          message: req.i18n('Required field(s) missing.'),
        });
      }

      // Set creation time
      const created = moment.utc().format();

      // Get child nodes
      await req.document.fetchRelated('_children', trx);

      // Get json data
      const properties = type._schema.properties;

      // Set uuid
      const newUuid = req.body.uuid || uuid();

      // Set translation
      let translation_group = uuid;
      if (req.body.translation_of) {
        if (startsWith(req.body.translation_of, '/')) {
          const translation = await Document.fetchOne(
            { path: req.body.translation_of },
            {},
            trx,
          );
          if (translation) {
            translation_group = translation.uuid;
          }
        } else {
          translation_group = req.body.translation_of;
        }
      }

      // Remove fields which are not in the schema
      let json = {
        ...omit(pick(req.body, keys(properties)), omitProperties),
      };

      // Handle files, images and relation lists
      json = await handleFiles(json, type);
      json = await handleImages(json, type);
      json = await handleRelationLists(json, req.type);

      // Create new document
      let document = Document.fromJson({
        uuid: newUuid,
        type: req.body['@type'],
        created,
        translation_group,
        language: req.body.language,
        modified: created,
        version: 0,
        position_in_parent:
          req.body.position_in_parent !== undefined
            ? req.body.position_in_parent
            : req.document._children.length,
        lock: { locked: false, stealable: true },
        workflow_state: type._workflow.json.initial_state,
        workflow_history: JSON.stringify(req.body.workflow_history || []),
        owner: req.user.id,
        json,
      });

      // Apply behaviors
      await document.applyBehaviors(trx);

      // Set id
      document.setId(
        req.body.id,
        req.document._children.map((item) => item.id),
        json,
      );

      // Set path
      document.path = `${req.document.path === '/' ? '' : req.document.path}/${
        document.id
      }`;

      // Trigger onBeforeAdd
      await config.settings.events.trigger('onBeforeAdd', document, json, trx);

      // Insert document in database
      document = await req.document.createRelatedAndFetch(
        '_children',
        document.$toDatabaseJson(),
        trx,
      );

      // Apply behaviors
      await document.applyBehaviors(trx);

      // Create initial version
      await document.createRelated(
        '_versions',
        {
          id: document.id,
          version: 0,
          created,
          actor: req.user.id,
          json: {
            ...document.json,
            changeNote: req.body.changeNote || 'Initial version',
          },
        },
        trx,
      );

      // Fetch type
      await document.fetchRelated('_type', trx);

      // Trigger onAfterAdd
      await config.settings.events.trigger('onAfterAdd', document, trx);

      // Index new document
      await document.index(trx);

      // Fetch related lists
      await document.fetchRelationLists(trx);

      // Send data back to client
      return {
        status: 201,
        json: await document.toJSON(req, await getComponents(req)),
      };
    },
  },
  {
    op: 'patch',
    view: '',
    permission: 'Modify',
    client: 'updateContent',
    middleware: express.json({
      limit: config.settings.requestLimit?.files || '10mb',
    }),
    handler: async (req, trx) => {
      // Check if ordering request
      if (typeof req.body?.ordering !== 'undefined') {
        // Get children and reorder
        await req.document.fetchRelated('_children(order)', trx);
        await req.document.reorder(
          req.body.ordering.obj_id,
          req.body.ordering.delta,
          trx,
        );

        // Reindex children
        await req.document.reindexChildren(trx);

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
      await req.document.fetchRelated('_parent._children', trx);
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
        path === '/'
          ? path
          : `${
              req.document._parent.path === '/' ? '' : req.document._parent.path
            }/${newId}`;

      // Handle file uploads
      let json = {
        ...req.document.json,
        ...omit(
          pick(req.body, keys(req.type._schema.properties)),
          omitProperties,
        ),
      };
      json = await handleFiles(json, req.type);
      json = await handleImages(json, req.type);
      json = await handleRelationLists(json, req.type);

      // Create new version
      const modified = moment.utc().format();
      const version = req.document.version + 1;
      await req.document.createRelated(
        '_versions',
        {
          document: req.document.uuid,
          id: newId,
          created: modified,
          actor: req.user.id,
          version,
          json: {
            ...json,
            changeNote: req.body.changeNote,
          },
        },
        trx,
      );

      // If path has changed change path of document and children
      if (path !== newPath) {
        await Document.replacePath(path, newPath, trx);
      }

      // Trigger onBeforeAdd
      await config.settings.events.trigger(
        'onBeforeModified',
        req.document,
        { ...json, id: newId, path: newPath },
        trx,
      );

      // Save document with new values
      await req.document.update(
        {
          id: newId,
          path: newPath,
          position_in_parent:
            req.body.position_in_parent !== undefined
              ? req.body.position_in_parent
              : req.document.position_in_parent,
          version,
          modified,
          json,
          lock: {
            locked: false,
            stealable: true,
          },
        },
        trx,
      );

      // Reindex document
      await req.document.reindex(trx);

      // Trigger onAfterModified
      await config.settings.events.trigger(
        'onAfterModified',
        req.document,
        trx,
      );

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
    client: 'deleteContent',
    handler: async (req, trx) => {
      // Get file and image fields
      const fileFields = req.type.getFactoryFields('File');
      const imageFields = req.type.getFactoryFields('Image');

      // If file fields exist
      if (fileFields.length > 0 || imageFields.length > 0) {
        // Get versions
        await req.document.fetchRelated('_versions', trx);

        // Get all file uuids from all versions and all fields
        const files = uniq(
          flattenDeep(
            req.document._versions.map((version) => [
              ...fileFields.map((field) => version.json[field].uuid),
              ...imageFields.map((field) => [
                version.json[field].uuid,
                ...map(
                  keys(config.settings.imageScales),
                  (scale) => version.json[field].scales[scale].uuid,
                ),
              ]),
            ]),
          ),
        );

        // Remove files
        files.map((file) => removeFile(file));
      }

      // Get parent
      await req.document.fetchRelated('_parent', trx);
      const parent = req.document._parent;

      // Trigger onBeforeAdd
      await config.settings.events.trigger('onBeforeDelete', req.document, trx);

      // Remove document (versions will be cascaded)
      await req.document.delete(trx);

      // Fix order in parent
      await parent.fetchRelated('_children(order)', trx);
      await parent.fixOrder(trx);

      // Reindex children
      await parent.reindexChildren(trx);

      // Reindex parent
      await parent.reindex(trx);

      // Return deleted
      return {
        status: 204,
      };
    },
  },
];
