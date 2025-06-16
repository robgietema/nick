/**
 * Search routes.
 * @module routes/search/search
 */

import moment from 'moment';
import { normalize } from 'path';
import { endsWith, includes, keys, map, mapKeys, repeat } from 'lodash';

import { embed, getUrl } from '../../helpers';
import { Catalog, Index } from '../../models';

const { config } = require(`${process.cwd()}/config`);

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
  const root = endsWith(path, '/') ? path : `${path}/`;

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
    map(querystring.query, async (query) => {
      // Check if key is SearchableText and AI is enabled
      if (query.i === 'SearchableText' && config.ai?.models?.embed?.enabled) {
        // Get embedding vector
        const embedding = await embed(query.v.replace(/\*/, ''), trx);

        where['_embedding'] = [
          'raw',
          `1 - (_embedding <=> '${embedding}') > ${config.ai.models.embed.minSimilarity}`,
        ];
        options.select = [
          '*',
          trx.raw(`1 - (_embedding <=> '${embedding}') AS similarity`),
        ];
        options.order.column = 'similarity';
        options.order.reverse = true;
      } else {
        switch (query.o) {
          case 'selection.any':
            where[query.i] = ['=', query.v];
            break;
          case 'selection.all':
            where[query.i] = ['all', query.v];
            break;
          case 'date.today':
            where[query.i] = [
              '>=',
              `${moment().format('MM-DD-YYYY')} 00:00:00`,
            ];
            where[query.i] = [
              '<=',
              `${moment().format('MM-DD-YYYY')} 23:59:59`,
            ];
            break;
          case 'date.between':
            where[query.i] = ['>', query.v[0]];
            where[query.i] = ['<', query.v[1]];
            break;
          case 'date.lessThen':
            where[query.i] = ['<', query.v];
            break;
          case 'date.afterToday':
            where[query.i] = ['>', `${moment().format('MM-DD-YYYY')} 23:59:59`];
            break;
          case 'date.largerThan':
            where[query.i] = ['>', query.v];
            break;
          case 'date.beforeToday':
            where[query.i] = ['<', `${moment().format('MM-DD-YYYY')} 00:00:00`];
            break;
          case 'date.afterRelativeDate':
            where[query.i] = ['>', query.v];
            break;
          case 'date.beforeRelativeDate':
            where[query.i] = ['<', query.v];
            break;
          case 'date.lessThanRelativeDate':
            where[query.i] = ['<', query.v];
            break;
          case 'date.largerThanRelativeDate':
            where[query.i] = ['>', query.v];
            break;
          case 'string.is':
            where[query.i] = query.v;
            break;
          case 'string.path':
            where[query.i] = query.v;
            break;
          case 'string.absolutePath':
            where[query.i] = query.v.replace(getUrlByPath(req, '/'), '/');
            break;
          case 'string.relativePath':
            where[query.i] = ['~', normalize(`${root}${query.v}`)];
            break;
          case 'string.currentUser':
            where[query.i] = req.user.id;
            break;
          case 'string.contains':
            where[query.i] = ['like', `%${query.v}%`];
            break;
          default:
            break;
        }
      }
    }),
  );

  // Check sort
  if (querystring.sort_on) {
    if (includes(keys(indexes), querystring.sort_on)) {
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
      `^${root}[^/]+${repeat('(/[^/]+)?', querystring['path.depth'] - 1)}$`,
    ];
  }

  // Check batch size
  if (querystring.b_size) {
    options.limit = querystring.b_size;
  }

  // Check batch start
  if (querystring.b_start) {
    options.offset = querystring.b_start;
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
  const root = endsWith(path, '/') ? path : `${path}/`;

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
    map(keys(queryparam), async (key) => {
      const value = queryparam[key];

      // Check if key in indexes
      if (indexes[key]) {
        // Check if key is SearchableText and AI is enabled
        if (key === 'SearchableText' && config.ai?.models?.embed?.enabled) {
          // Get embedding vector
          const embedding = await embed(value.replace(/\*/, ''), trx);

          where['_embedding'] = [
            'raw',
            `1 - (_embedding <=> '${embedding}') > ${config.ai.models.embed.minSimilarity}`,
          ];
          options.select = [
            '*',
            trx.raw(`1 - (_embedding <=> '${embedding}') AS similarity`),
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
          if (includes(keys(indexes), value)) {
            options.order.column = `_${value}`;
          }
          break;
        case 'sort_order':
          options.order.reverse = value !== 'ascending';
          break;
        case 'path.depth':
          where['_path'] = [
            '~',
            `^${root}[^/]+${repeat('(/[^/]+)?', value - 1)}$`,
          ];
          break;
        case 'b_size':
          options.limit = value;
          break;
        case 'b_start':
          options.offset = value;
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
