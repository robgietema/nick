/**
 * Client.
 * @module client
 */

import routes from './routes';
import models from './models';
import { i18n } from './middleware/i18n/i18n';
import type { Request } from './types';
import { RequestException } from './helpers/error/error';
import { Response, NextFunction } from 'express';

import { callHandler } from './helpers/handler/handler';
import { content_rules } from './events/content_rules/content_rules';

// Add content rules events
import config from './helpers/config/config';
config.settings.events.register(content_rules);

/**
 * Client component
 * @class Client
 */
export class Client {
  /**
   * Initialize.
   * @method initialize
   * @param {Object} Request object.
   * @static
   * @returns {Client} New client object.
   */
  static initialize = ({ token: initToken, apiPath }: any): any => {
    const client = new Client() as any;
    const Document = models.get('Document');

    routes.map((route: any) => {
      if (route.client) {
        client[route.client] = async (
          { token, path, data, locktoken, query, params, headers } = {} as any,
        ) => {
          const req = {
            token: initToken || token,
            apiPath,
            documentPath: path || '/',
            body: data,
            query,
            params,
            headers,
          } as Request;
          if (locktoken) {
            req.headers['Lock-Token'] = locktoken;
          }

          await i18n(req, {} as Response, (() => {}) as NextFunction);

          const trx = await Document.startTransaction();

          try {
            const res = await callHandler(req, trx, route, () => {});

            // Try to commit the transaction
            try {
              await trx.commit();
            } catch (err) {
              throw new RequestException(500, {
                message: req.i18n('Transaction error.'),
              });
            }

            // Call the handler
            return {
              data: res.json,
            };
          } catch (err) {
            // Rollback transaction
            await trx.rollback();
            throw err;
          }
        };
      }
    });

    return client;
  };
}
