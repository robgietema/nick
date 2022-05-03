/**
 * Search routes.
 * @module routes/search/search
 */

import moment from 'moment';
import { endsWith, find, includes, map, mapKeys, repeat } from 'lodash';

import { formatSize, getRootUrl, getUrl } from '../../helpers';
import { Catalog } from '../../models';

import profile from '../../profiles/catalog';

/**
 * Convert document to json.
 * @method documentToJson
 * @param {Object} document Current document object.
 * @param {Object} req Request object.
 * @param {Object} trx Transaction object.
 * @returns {Object} Json representation of the document.
 */
async function documentToJson(document, req, trx) {
  await document.fetchRelated('[_type, _owner]', trx);
  const json = document.json;
  return {
    '@id': `${getRootUrl(req)}${document.path}`,
    '@type': document.type,
    UID: document.uuid,
    Creator: document._owner.fullname,
    Description: json.description,
    title: json.title,
    review_state: document.workflow_state,
    ModificationDate: moment(document.modified).format(),
    CreationDate: moment(document.created).format(),
    EffectiveDate: json.effective ? moment(json.effective).format() : 'None',
    ExpirationDate: json.expires ? moment(json.expires).format() : 'None',
    id: document.id,
    is_folderish: includes(document._type._schema.behaviors, 'folderish'),
    Subject: json.subjects,
    getObjSize: formatSize(JSON.stringify(json).length),
    start: null,
    end: null,
  };
}

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
      const items = await Catalog.fetchAll(
        ...querystringToQuery(req.query, req.document.path),
        trx,
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
