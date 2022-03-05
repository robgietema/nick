/**
 * Search routes.
 * @module routes/search/search
 */

import { requirePermission } from '../../helpers';
import moment from 'moment';

/**
 * Convert document to json.
 * @method documentToJson
 * @param {Object} document Current document object.
 * @param {Object} req Request object.
 * @returns {Object} Json representation of the document.
 */
function documentToJson(document, req) {
  return {
    '@id': `${req.protocol || 'http'}://${req.headers.host}${document.path}`,
    '@type': document.portal_type,
    description: document.Description,
    title: document.Title,
    review_state: document.review_state,
    ModificationDate: moment.unix(document.modified).format(),
    EffectiveDate: moment.unix(document.effective).format(),
  };
}

/**
 * Strip incorrect chars from string
 * @method stripString
 * @param {String} string Input string
 * @returns {String} Stripped string.
 */
function stripString(string) {
  return string.replace(/\*/g, '');
}

/**
 * Convert querystring to query.
 * @method querystringToQuery
 * @param {Object} querystring Querystring
 * @returns {Object} Query.
 */
function querystringToQuery(querystring) {
  const fields = [];
  const sort = {};
  Object.keys(querystring).map((key) => {
    switch (key) {
      case 'SearchableText':
        fields.push({
          FIELD: 'SearchableText',
          VALUE: stripString(querystring[key]),
        });
        break;
      case 'sort_on':
        sort.FIELD = [querystring[key]];
        break;
      case 'sort_order':
        sort.DIRECTION =
          querystring[key] === 'ascending' ? 'ASCENDING' : 'DESCENDING';
        break;
    }
  });
  return fields.length === 0
    ? [
        {
          ALL_DOCUMENTS: true,
        },
        {
          DOCUMENTS: true,
        },
        {
          FIELD: sort.FIELD || '_id',
          DIRECTION: sort.DIRECTION || 'ASCENDING',
        },
      ]
    : [
        {
          AND: fields,
        },
        {
          DOCUMENTS: true,
          SCORE: {
            TYPE: 'TFIDF',
          },
        },
        {
          FIELD: sort.FIELD || '_score',
          DIRECTION: sort.DIRECTION || 'DESCENDING',
        },
      ];
}

export default [
  {
    op: 'get',
    view: '/@search',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () =>
        query(...querystringToQuery(req.query)).then((items) =>
          res.send({
            '@id': `${req.protocol || 'http'}://${req.headers.host}${
              req.params[0]
            }/@search`,
            items: items.RESULT.map((item) => documentToJson(item._doc, req)),
            items_total: items.RESULT_LENGTH,
          }),
        ),
      ),
  },
  {
    op: 'post',
    view: '/@querystring-search',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () =>
        query({ FIELD: 'end', VALUE: 0 }).then((items) => {
          return res.send({
            '@id': `${req.protocol || 'http'}://${req.headers.host}${
              req.params[0]
            }/@search`,
            items: items.RESULT.map((item) => documentToJson(item._doc, req)),
            items_total: items.RESULT_LENGTH,
          });
        }),
      ),
  },
];
