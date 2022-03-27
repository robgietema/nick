/**
 * Content routes.
 * @module routes/content/content
 */

import moment from 'moment';
import { dropRight, omit } from 'lodash';
import {
  documentRepository,
  versionRepository,
  userRepository,
} from '../../repositories';
import { lockExpired, requirePermission, uniqueId } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@history',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const items = await versionRepository.findAll(
          { document: req.document.get('uuid') },
          'version desc',
        );
        res.send(
          await Promise.all(
            items.map(async (item) => {
              const actor = await userRepository.findOne({
                id: item.get('actor'),
              });
              return {
                '@id': `${req.protocol}://${req.headers.host}${req.document.get(
                  'path',
                )}/@history/${item.get('version')}`,
                action: 'Edited',
                actor: {
                  '@id': `${req.protocol}://${
                    req.headers.host
                  }/@users/${actor.get('id')}`,
                  fullname: actor.get('fullname'),
                  id: actor.get('id'),
                  username: actor.get('id'),
                },
                comments: item.get('json').changeNote,
                may_revert: true,
                time: item.get('created'),
                transition_title: 'Edited',
                type: 'versioning',
                version: item.get('version'),
              };
            }),
          ),
        );
      }),
  },
  {
    op: 'patch',
    view: '/@history',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        // Get version
        const version = await versionRepository.findOne({
          document: req.document.get('uuid'),
          version: req.body.version,
        });

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
        const id = version.get('id');
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

        // Create new version
        const json = omit(version.get('json'), ['changeNote']);
        const modified = moment.utc().format();
        const versionNumber = req.document.get('version') + 1;
        await versionRepository.create({
          document: req.document.get('uuid'),
          id: newId,
          created: modified,
          actor: req.user.get('id'),
          version: versionNumber,
          json: {
            ...json,
            changeNote: `Reverted to version ${version.get('version')}`,
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
            version: versionNumber,
            modified,
            json,
            lock: {
              locked: false,
              stealable: true,
            },
          },
          { patch: true },
        );

        // Send ok message
        res.send({
          message: `${
            req.document.get('json').title
          } has been reverted to revision ${version.get('version')}`,
        });
      }),
  },
];
