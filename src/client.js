/**
 * Client.
 * @module client
 */

import routes from './routes';
import { map } from 'lodash';
import { Model } from './models';
import { callHandler } from './helpers/handler/handler';
import { i18n } from './middleware';

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
  static initialize = ({ token, apiPath }) => {
    const client = new Client();

    map(routes, (route) => {
      if (route.client) {
        client[route.client] = async ({ path, data, query }) => {
          let req = {
            token,
            apiPath,
            documentPath: path,
            body: data,
            query,
          };
          await i18n(req, {}, () => {});

          const trx = await Model.startTransaction();

          try {
            const res = await callHandler(req, trx, route);

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
