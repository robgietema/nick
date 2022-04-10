/**
 * Search routes.
 * @module routes/search/search
 */

import moment from 'moment';
import { endsWith, includes, mapKeys, repeat } from 'lodash';
import { formatSize, getRootUrl, getUrl } from '../../helpers';
import { Document } from '../../models';

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
  const root = endsWith(path, '/') ? path : `${path}/`;
  const where = {
    path: ['~', `^${path}`],
  };
  const options = {
    offset: 0,
    limit: 100,
    order: {
      column: 'uuid',
      reverse: false,
    },
  };
  mapKeys(querystring, (value, key) => {
    switch (key) {
      case 'SearchableText':
        where["json->>'title'"] = ['~*', value.replace(/\*/g, '')];
        break;
      case 'sort_on':
        switch (value) {
          case 'sortable_title':
            options.order.column = "json->>'title'";
            break;
          case 'effective':
            options.order.column = "json->>'effective'";
            break;
          case 'getObjPositionInParent':
            options.order.column = 'position_in_parent';
            break;
          default:
            break;
        }
        break;
      case 'sort_order':
        options.order.reverse = value !== 'ascending';
        break;
      case 'path.depth':
        where['path'] = [
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
  });
  return [where, options];
}

export default [
  {
    op: 'get',
    view: '/@search',
    permission: 'View',
    handler: async (req, trx) => {
      const items = await Document.fetchAll(
        ...querystringToQuery(req.query, req.document.path),
        trx,
      );
      return {
        json: {
          '@id': `${getUrl(req)}/@search`,
          items: await Promise.all(
            items.map(async (item) => await documentToJson(item, req, trx)),
          ),
          items_total: items.pagination?.rowCount || items.length,
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@querystring-search',
    permission: 'View',
    handler: async (req, trx) => {
      const items = await Document.fetchAll({}, {}, trx);
      return {
        json: {
          '@id': `${getUrl(req)}/@search`,
          items: await Promise.all(
            items.map(async (item) => await documentToJson(item, req, trx)),
          ),
          items_total: items.length,
        },
      };
    },
  },
];
