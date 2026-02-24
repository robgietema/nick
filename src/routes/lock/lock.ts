/**
 * Lock routes.
 * @module routes/lock/lock
 */

import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { getRootUrl } from '../../helpers/url/url';
import { lockExpired } from '../../helpers/lock/lock';
import { RequestException } from '../../helpers/error/error';
import type { Knex } from 'knex';
import type { Request } from '../../types';

export default [
  {
    op: 'get',
    view: '/@lock',
    permission: 'View',
    client: 'getLock',
    handler: async (req: Request, trx: Knex.Transaction) => {
      if (req.document.lock.locked && lockExpired(req.document)) {
        return {
          json: {
            locked: false,
            stealable: true,
          },
        };
      } else {
        return {
          json: req.document.lock,
        };
      }
    },
  },
  {
    op: 'post',
    view: '/@lock',
    permission: 'Modify',
    client: 'createLock',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const lock = req.document.lock;

      // Check if lock already exists
      if (lock.locked && !lockExpired(req.document)) {
        // Check if lock from current user
        if (req.user.id === lock.creator) {
          // Send current lock info
          return {
            json: lock,
          };
        } else {
          // Send error
          throw new RequestException(401, {
            error: {
              message: req.i18n(
                'This document is already locked by another user.',
              ),
              type: req.i18n('Already locked'),
            },
          });
        }
      } else {
        const newLock = {
          created: moment.utc().format(),
          creator: req.user.id,
          creator_name: req.user.fullname,
          creator_url: `${getRootUrl(req)}/@users/${req.user.id}`,
          locked: true,
          stealable:
            typeof req.body?.stealable === 'undefined'
              ? true
              : req.body.stealable,
          time: moment.utc().format(),
          timeout: req.body?.timeout || 600,
          token: uuid(),
        };
        // Create new lock
        await req.document.update(
          {
            lock: newLock,
          },
          trx,
        );
        return {
          json: newLock,
        };
      }
    },
  },
  {
    op: 'patch',
    view: '/@lock',
    permission: 'Modify',
    client: 'updateLock',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const lock = req.document.lock;

      // Check if lock already exists
      if (
        lock.locked &&
        !lockExpired(req.document) &&
        req.user.id !== lock.creator
      ) {
        // Send error
        throw new RequestException(401, {
          error: {
            message: req.i18n(
              'This document is already locked by another user.',
            ),
            type: req.i18n('Already locked'),
          },
        });
      } else {
        const newLock = {
          created: moment.utc().format(),
          creator: req.user.id,
          creator_name: req.user.fullname,
          creator_url: `${getRootUrl(req)}/@users/${req.user.id}`,
          locked: true,
          stealable:
            typeof req.body?.stealable === 'undefined'
              ? true
              : req.body.stealable,
          time: moment.utc().format(),
          timeout: req.body?.timeout || 600,
          token: uuid(),
        };
        // Create new lock
        await req.document.update(
          {
            lock: newLock,
          },
          trx,
        );
        return {
          json: newLock,
        };
      }
    },
  },
  {
    op: 'delete',
    view: '/@lock',
    permission: 'Modify',
    client: 'deleteLock',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const lock = req.document.lock;

      // If not locked just send lock status
      if (
        (lock.locked && lock.creator !== req.user.id) ||
        (req.body?.force && lock.stealable === false)
      ) {
        // Send error
        throw new RequestException(401, {
          error: {
            message: req.i18n(
              'You don’t have permission to unlock this document.',
            ),
            type: req.i18n('Not allowed'),
          },
        });
      }
      return {
        json: {
          locked: false,
          stealable: true,
        },
      };
    },
  },
];
