/**
 * Search routes.
 * @module routes/search/search
 */

import moment from 'moment';
import { normalize } from 'path';

import { apiLimiter } from '../../helpers/limiter/limiter';
import { embed } from '../../helpers/ai/ai';
import { getUrl } from '../../helpers/url/url';

import { Catalog } from '../../models/catalog/catalog';
import { Index } from '../../models/index/index';

import config from '../../helpers/config/config';

/**
 * Convert querystring to query.
 * @method querystringToQuery
 * @param {Object} querystring Querystring
 * @param {String} path Path to search
 * @param {Object} req Request object
 * @param {Object} trx Transaction object.
 * @returns {Object} Query.
 */
const querystringToQuery = async (querystring = {}, path = '/', req, trx) => {
  // Get root url
  const root = path.endsWith('/') ? path : `${path}/`;

  // Get indexes
  let indexes = {};
  (await Index.fetchAll({ metadata: false }, {}, trx)).map((index) => {
    indexes[index.name] = index;
  });

  const where = {};

  // Default options
  const options = {
    offset: 0,
    limit: 100,
    order: {
      column: 'UID',
      reverse: false,
    },
  };

  // Add query
  await Promise.all(
    querystring.query.map(async (query) => {
      // Check if key is SearchableText and AI is enabled
      if (
        query.i === 'SearchableText' &&
        config.settings.ai?.models?.embed?.enabled
      ) {
        // Get embedding vector
        const embedding = await embed(query.v.replace(/\*/g, ''), trx);

        where['_embedding'] = [
          'raw',
          `1 - (_embedding <=> '${embedding}') > ${config.settings.ai.models.embed.minSimilarity}`,
        ];
        options.select = [
          '*',
          trx.raw(`1 - (_embedding <=> ?) AS similarity`, [embedding]),
        ];
        options.order.column = 'similarity';
        options.order.reverse = true;
      } else {
        switch (query.o) {
          case 'selection.any':
            where[`_${query.i}`] = ['=', query.v];
            break;
          case 'selection.all':
            where[`_${query.i}`] = ['all', query.v];
            break;
          case 'date.today':
            where[`_${query.i}`] = [
              '>=',
              `${moment().format('MM-DD-YYYY')} 00:00:00`,
            ];
            where[`_${query.i}`] = [
              '<=',
              `${moment().format('MM-DD-YYYY')} 23:59:59`,
            ];
            break;
          case 'date.between':
            where[`_${query.i}`] = ['>', query.v[0]];
            where[`_${query.i}`] = ['<', query.v[1]];
            break;
          case 'date.lessThen':
            where[`_${query.i}`] = ['<', query.v];
            break;
          case 'date.afterToday':
            where[`_${query.i}`] = [
              '>',
              `${moment().format('MM-DD-YYYY')} 23:59:59`,
            ];
            break;
          case 'date.largerThan':
            where[`_${query.i}`] = ['>', query.v];
            break;
          case 'date.beforeToday':
            where[`_${query.i}`] = [
              '<',
              `${moment().format('MM-DD-YYYY')} 00:00:00`,
            ];
            break;
          case 'date.afterRelativeDate':
            where[`_${query.i}`] = ['>', query.v];
            break;
          case 'date.beforeRelativeDate':
            where[`_${query.i}`] = ['<', query.v];
            break;
          case 'date.lessThanRelativeDate':
            where[`_${query.i}`] = ['<', query.v];
            break;
          case 'date.largerThanRelativeDate':
            where[`_${query.i}`] = ['>', query.v];
            break;
          case 'string.is':
            where[`_${query.i}`] = query.v;
            break;
          case 'string.path':
            where[`_${query.i}`] = query.v;
            break;
          case 'string.absolutePath':
            where[`_${query.i}`] = query.v.replace(getUrlByPath(req, '/'), '/');
            break;
          case 'string.relativePath':
            where[`_${query.i}`] = ['~', normalize(`${root}${query.v}`)];
            break;
          case 'string.currentUser':
            where[`_${query.i}`] = req.user.id;
            break;
          case 'string.contains':
            if (indexes[query.i].type === 'text') {
              where[`_${query.i}`] = ['@@', query.v];
            } else if (query.v.length >= 2) {
              where[`_${query.i}`] = ['like', `%${query.v}%`];
            }
            break;
          default:
            break;
        }
      }
    }),
  );

  // Check sort
  if (querystring.sort_on) {
    if (Object.keys(indexes).includes(querystring.sort_on)) {
      options.order.column = `_${querystring.sort_on}`;
    }
  }

  // Check sort order
  if (querystring.sort_order) {
    options.order.reverse = querystring.sort_order !== 'ascending';
  }

  // Check path depth
  if (querystring['path.depth']) {
    where['_path'] = [
      '~',
      `^${root}[^/]+${'(/[^/]+)?'.repeat(Math.min(querystring['path.depth'] - 1, 20))}$`,
    ];
  }

  // Check batch size
  if (querystring.b_size) {
    options.limit = Math.min(
      1000,
      Math.max(1, parseInt(querystring.b_size, 10) || 1),
    );
  }

  // Check batch start
  if (querystring.b_start) {
    options.offset = parseInt(querystring.b_start, 10) || 0;
  }

  // Check metafields
  if (querystring.meta_fields === '_all') {
    // select column_name from information_schema.columns where table_name = 'catalog' and column_name ~ '^[^_]';
  }

  return [where, options];
};

/**
 * Convert queryparam to query.
 * @method queryparamToQuery
 * @param {Object} queryparam Querystring
 * @param {String} path Path to search
 * @param {Object} req Request object
 * @param {Object} trx Transaction object.
 * @returns {Object} Query.
 */
const queryparamToQuery = async (queryparam, path = '/', req, trx) => {
  // Get root url
  const root = path.endsWith('/') ? path : `${path}/`;

  // Get indexes
  let indexes = {};
  (await Index.fetchAll({ metadata: false }, {}, trx)).map((index) => {
    indexes[index.name] = index;
  });

  // Set path search
  const where = {
    _path: ['~', `^${path}`],
  };

  // Default option
  const options = {
    offset: 0,
    limit: 100,
    order: {
      column: 'UID',
      reverse: false,
    },
  };

  // Loop through query params
  await Promise.all(
    Object.keys(queryparam).map(async (key) => {
      const value = queryparam[key];

      // Check if key in indexes
      if (indexes[key]) {
        // Check if key is SearchableText and AI is enabled
        if (
          key === 'SearchableText' &&
          config.settings.ai?.models?.embed?.enabled
        ) {
          // Get embedding vector
          const embedding = await embed(value.replace(/\*/g, ''), trx);

          where['_embedding'] = [
            'raw',
            `1 - (_embedding <=> '${embedding}') > ${config.settings.ai.models.embed.minSimilarity}`,
          ];
          options.select = [
            '*',
            trx.raw(`1 - (_embedding <=> ?) AS similarity`, [embedding]),
          ];
          options.order.column = 'similarity';
          options.order.reverse = true;
        } else {
          const field = `_${key}`;
          switch (indexes[key].type) {
            case 'string':
            case 'integer':
            case 'path':
            case 'uuid':
            case 'boolean':
            case 'date':
              where[field] = value;
              break;
            case 'string[]':
            case 'uuid[]':
              break;
            case 'text':
              where[field] = ['@@', value.replace(/\*/g, '')];
              break;
            default:
              break;
          }
        }
      }

      // Check other query params
      switch (key) {
        case 'sort_on':
          if (Object.keys(indexes).includes(value)) {
            options.order.column = `_${value}`;
          }
          break;
        case 'sort_order':
          options.order.reverse = value !== 'ascending';
          break;
        case 'path.depth':
          where['_path'] = [
            '~',
            `^${root}[^/]+${'(/[^/]+)?'.repeat(value - 1)}$`,
          ];
          break;
        case 'b_size':
          options.limit = Math.min(1000, Math.max(1, parseInt(value, 10) || 1));
          break;
        case 'b_start':
          options.offset = parseInt(value, 10) || 0;
          break;
        default:
          break;
      }
    }),
  );
  return [where, options];
};

export default [
  {
    op: 'get',
    view: '/@search',
    permission: 'View',
    client: 'search',
    middleware: apiLimiter,
    handler: async (req, trx) => {
      const items = await Catalog.fetchAllRestricted(
        ...(await queryparamToQuery(req.query, req.document.path, req, trx)),
        trx,
        req,
      );

      // Fetch indexes
      if (!req.indexes) {
        req.indexes = await Index.fetchAll({}, {}, trx);
      }

      // Return JSON response
      return {
        json: {
          '@id': `${getUrl(req)}/@search`,
          items: items.map((item) => item.toJSON(req)),
          items_total: items.getLength(),
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@querystring-search',
    permission: 'View',
    client: 'querystringSearch',
    middleware: apiLimiter,
    handler: async (req, trx) => {
      const items = await Catalog.fetchAllRestricted(
        ...(await querystringToQuery(req.body, req.document.path, req, trx)),
        trx,
        req,
      );

      // Fetch indexes
      if (!req.indexes) {
        req.indexes = await Index.fetchAll({}, {}, trx);
      }

      // Return JSON response
      return {
        json: {
          '@id': `${getUrl(req)}/@search`,
          items: items.map((item) => item.toJSON(req)),
          items_total: items.getLength(),
        },
      };
    },
  },
];
