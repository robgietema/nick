/**
 * Search routes.
 * @module routes/search/search
 */

import moment from 'moment';
import { endsWith, mapKeys, repeat } from 'lodash';
import { requirePermission } from '../../helpers';
import { DocumentRepository } from '../../repositories';

/**
 * Convert document to json.
 * @method documentToJson
 * @param {Object} document Current document object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the document.
 */
function documentToJson(document, req) {
  return {
    '@id': `${req.protocol || 'http'}://${req.headers.host}${document.get(
      'path',
    )}`,
    '@type': document.get('type'),
    description: document.get('json').description,
    title: document.get('json').title,
    review_state: '',
    ModificationDate: moment(document.get('modified')).format(),
    EffectiveDate: moment(document.get('created')).format(),
    is_folderish: true,
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
  const fields = {
    path: ['~', `^${path}`],
  };
  const sort = {
    field: 'uuid',
    order: 'ASC',
  };
  const page = {
    offset: 0,
    limit: 100,
  };
  mapKeys(querystring, (value, key) => {
    switch (key) {
      case 'SearchableText':
        fields["json->>'title'"] = ['~*', value.replace(/\*/g, '')];
        break;
      case 'sort_on':
        switch (value) {
          case 'sortable_title':
            sort.field = "json->>'title'";
            break;
          case 'effective':
            sort.field = "json->>'effective'";
            break;
          default:
            break;
        }
        break;
      case 'sort_order':
        sort.DIRECTION = value === 'ascending' ? 'ASC' : 'DESC';
        break;
      case 'path.depth':
        fields['path'] = [
          '~',
          `^${root}[^/]+${repeat('(/[^/]+)?', value - 1)}$`,
        ];
        break;
      case 'b_size':
        page.limit = value;
        break;
      case 'b_start':
        page.offset = value;
        break;
      default:
        break;
    }
  });
  return [fields, `${sort.field} ${sort.order}`, page];
}

export default [
  {
    op: 'get',
    view: '/@search',
    handler: (req, res) =>
      requirePermission('View', req, res, () =>
        DocumentRepository.findAll(
          ...querystringToQuery(req.query, req.document.get('path')),
        ).then((items) =>
          res.send({
            '@id': `${req.protocol || 'http'}://${req.headers.host}${
              req.params[0]
            }/@search`,
            items: items.map((item) => documentToJson(item, req)),
            items_total: items.pagination?.rowCount || items.length,
          }),
        ),
      ),
  },
  {
    op: 'post',
    view: '/@querystring-search',
    handler: (req, res) =>
      requirePermission('View', req, res, () =>
        DocumentRepository.findAll().then((items) =>
          res.send({
            '@id': `${req.protocol || 'http'}://${req.headers.host}${
              req.params[0]
            }/@search`,
            items: items.map((item) => documentToJson(item, req)),
            items_total: items.length,
          }),
        ),
      ),
  },
];
