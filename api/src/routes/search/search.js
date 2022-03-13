/**
 * Search routes.
 * @module routes/search/search
 */

import moment from 'moment';
import { endsWith, mapKeys, repeat } from 'lodash';
import { formatSize, requirePermission } from '../../helpers';
import { DocumentRepository } from '../../repositories';

/**
 * Convert document to json.
 * @method documentToJson
 * @param {Object} document Current document object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the document.
 */
function documentToJson(document, req) {
  const json = document.get('json');
  return {
    '@id': `${req.protocol}://${req.headers.host}${document.get('path')}`,
    '@type': document.get('type'),
    UID: document.get('uuid'),
    Creator: document.related('owner').get('fullname'),
    Description: json.description,
    title: json.title,
    review_state: document.get('workflowState'),
    ModificationDate: moment(document.get('modified')).format(),
    CreationDate: moment(document.get('created')).format(),
    EffectiveDate: 'None',
    ExpirationDate: 'None',
    id: document.get('id'),
    is_folderish: true,
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
  const fields = {
    path: ['~', `^${path}`],
  };
  const sort = {
    field: 'uuid',
    order: 'ASC',
  };
  const options = {
    offset: 0,
    limit: 100,
    withRelated: ['owner'],
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
        sort.order = value === 'ascending' ? 'ASC' : 'DESC';
        break;
      case 'path.depth':
        fields['path'] = [
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
  return [fields, `${sort.field} ${sort.order}`, options];
}

export default [
  {
    op: 'get',
    view: '/@search',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const items = await DocumentRepository.findAll(
          ...querystringToQuery(req.query, req.document.get('path')),
        );
        res.send({
          '@id': `${req.protocol}://${req.headers.host}${req.params[0]}/@search`,
          items: items.map((item) => documentToJson(item, req)),
          items_total: items.pagination?.rowCount || items.length,
        });
      }),
  },
  {
    op: 'post',
    view: '/@querystring-search',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const items = await DocumentRepository.findAll();
        res.send({
          '@id': `${req.protocol}://${req.headers.host}${req.params[0]}/@search`,
          items: items.map((item) => documentToJson(item, req)),
          items_total: items.length,
        });
      }),
  },
];
