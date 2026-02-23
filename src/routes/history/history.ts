/**
 * History routes.
 * @module routes/history/history
 */

import moment from 'moment';
import { omit } from 'es-toolkit/object';

import { lockExpired } from '../../helpers/lock/lock';
import { RequestException } from '../../helpers/error/error';
import { uniqueId } from '../../helpers/utils/utils';
import { Collection } from '../../collections/_collection/_collection';
import { Version } from '../../models/version/version';
import { Document } from '../../models/document/document';
import type { Request } from '../../types';
import type { Knex } from 'knex';

export default [
  {
    op: 'get',
    view: '/@history',
    permission: 'View',
    client: 'getHistory',
    handler: async (req: Request, trx: Knex.Transaction) => {
      await req.document.fetchRelated('_versions(order)._actor', trx);
      const workflow_history = await req.document.fetchWorkflowHistory(
        req,
        trx,
      );
      const versions = new Collection(req.document._versions);
      return {
        json: [
          ...((await versions.toJson(req)) as any),
          ...workflow_history,
        ].sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
        ),
      };
    },
  },
  {
    op: 'patch',
    view: '/@history',
    permission: 'View',
    client: 'revertHistory',
    handler: async (req: Request, trx: Knex.Transaction) => {
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

      // Get version
      const version = await Version.fetchOne(
        {
          document: req.document.uuid,
          version: req.body.version,
        },
        {},
        trx,
      );

      // Get id and path variables of document, parent and siblings
      await req.document.fetchRelated('_parent._children', trx);
      const id = version.id;
      const path = req.document.path;

      // Get unique id if id has changed
      const newId =
        req.body.id && req.body.id !== req.document.id
          ? uniqueId(
              id,
              req.document._parent._children.map((sibling: any) => sibling.id),
            )
          : id;
      const newPath =
        path === '/' ? path : `${req.document._parent.path}/${newId}`;

      // Create new version
      const json = omit(version.json, ['changeNote']);
      const modified = moment.utc().format();
      const versionNumber = req.document.version + 1;
      await req.document.createRelated(
        '_versions',
        {
          document: req.document.uuid,
          id: newId,
          created: modified,
          actor: req.user.id,
          version: versionNumber,
          json: {
            ...json,
            changeNote: `Reverted to version ${version.version}`,
          },
        },
        trx,
      );

      // If path has changed change path of document and children
      if (path !== newPath) {
        await Document.replacePath(path, newPath, trx);
      }

      // Save document with new values
      await req.document.update(
        {
          id: newId,
          path: newPath,
          version: versionNumber,
          modified,
          json,
          lock: {
            locked: false,
            stealable: true,
          },
        },
        trx,
      );

      // Send ok message
      return {
        json: {
          message: `${req.document.json.title} has been reverted to revision ${version.version}.`,
        },
      };
    },
  },
];
