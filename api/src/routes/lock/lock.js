/**
 * Lock routes.
 * @module routes/lock/lock
 */

import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { lockExpired, requirePermission } from '../../helpers';
import { DocumentRepository } from '../../repositories';

export default [
  {
    op: 'get',
    view: '/@lock',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        if (req.document.get('lock').locked && lockExpired(req.document)) {
          const document = await DocumentRepository.deleteLock(req.document);
          res.send(document.get('lock'));
        } else {
          res.send(req.document.get('lock'));
        }
      }),
  },
  {
    op: 'post',
    view: '/@lock',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const lock = req.document.get('lock');

        // Check if lock already exists
        if (lock.locked && !lockExpired(req.document)) {
          // Check if lock from current user
          if (req.user.get('id') === lock.creator) {
            // Send current lock info
            res.send(req.document.get('lock'));
          } else {
            // Send error
            res.status(401).send({
              error: {
                message: 'This document is already locked by another user.',
                type: 'Already locked',
              },
            });
          }
        } else {
          const newLock = {
            created: moment.utc(),
            creator: req.user.get('id'),
            creator_name: req.user.get('fullname'),
            creator_url: `${req.protocol}://${
              req.headers.host
            }/@users/${req.user.get('id')}`,
            locked: true,
            stealable:
              typeof req.body?.stealable === 'undefined'
                ? true
                : req.body.stealable,
            time: 807211800.0,
            timeout: req.body?.timeout || 600,
            token: uuid(),
          };
          // Create new lock
          await req.document.save(
            {
              lock: newLock,
            },
            { patch: true },
          );
          res.send(newLock);
        }
      }),
  },
  {
    op: 'delete',
    view: '/@lock',
    handler: (req, res) =>
      requirePermission('Modify', req, res, async () => {
        const lock = req.document.get('lock');

        // If not locked just send lock status
        if (!lock.locked) {
          res.send(lock);
        } else if (
          // Check if permission to unlock
          lock.creator === req.user.get('id') ||
          (req.body?.force && lock.stealable === true)
        ) {
          // Delete lock and send new status
          const document = await DocumentRepository.deleteLock(req.document);
          res.send(document.get('lock'));
        } else {
          // Send error
          res.status(401).send({
            error: {
              message: "You don't have permission to unlock this document.",
              type: 'Not allowed',
            },
          });
        }
      }),
  },
];
