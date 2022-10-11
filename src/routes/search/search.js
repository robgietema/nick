/**
 * Search routes.
 * @module routes/search/search
 */

import moment from 'moment';
import { endsWith, find, includes, map, mapKeys, repeat } from 'lodash';

import { formatSize, getRootUrl, getUrl } from '../../helpers';
import { Catalog } from '../../models';

import profile from '../../profiles/core/catalog';

/**
 * Convert querystring to query.
 * @method querystringToQuery
 * @param {Object} querystring Querystring
 * @param {String} path Path to search
 * @returns {Object} Query.
 */
function querystringToQuery(querystring, path = '/') {
  // Get root url
  const root = endsWith(path, '/') ? path : `${path}/`;

  // Set path search
  const where = {
    _path: ['~', `^${path}`],
  };

  // Default options
  const options = {
    offset: 0,
    limit: 100,
    order: {
      column: 'UID',
      reverse: false,
    },
  };
  mapKeys(querystring, (value, key) => {
    switch (key) {
      case 'sort_on':
        if (
          includes(
            map(profile.indexes, (index) => index.name),
            value,
          )
        ) {
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
      case 'metadata_fields':
        if (value === '_all') {
          options.select = map(profile.metadata, (metadata) => metadata.name);
        }
        break;
      default:
        break;
    }

    // Check if key in indexes
    const index = find(profile.indexes, (index) => index.name === key);
    if (index) {
      const field = `_${index.name}`;
      switch (index.type) {
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
  });
  return [where, options];
}

export default [
  {
    op: 'get',
    view: '/@search',
    permission: 'View',
    handler: async (req, trx) => {
      const items = await Catalog.fetchAllRestricted(
        ...querystringToQuery(req.query, req.document.path),
        trx,
        req,
      );
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
    handler: async (req, trx) => {
      const items = await Catalog.fetchAll({}, { order: 'UID' }, trx);
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
