/**
 * Breadcrumbs route.
 * @module routes/breadcrumbs/breadcrumbs
 */

import { compact, drop, head, last } from 'lodash';

import { DocumentRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

/**
 * Traverse path.
 * @method traverse
 * @param {Object} document Current document object.
 * @param {Array} slugs Array of slugs.
 * @param {Array} items Current array of items.
 * @returns {Promise<Array>} A Promise that resolves to an array of items.
 */
function traverse(document, slugs, items) {
  if (slugs.length === 0) {
    return Promise.resolve(items);
  } else {
    return DocumentRepository.findOne({
      parent: document.get('uuid'),
      id: head(slugs),
    }).then((parent) =>
      traverse(parent, drop(slugs), [
        ...items,
        {
          '@id': `${last(items)['@id']}/${parent.get('id')}`,
          title: parent.get('json').title,
        },
      ]),
    );
  }
}

export default [
  {
    op: 'get',
    view: '/@breadcrumbs',
    handler: (req, res) =>
      requirePermission('View', req, res, () => {
        const slugs = req.params[0].split('/');
        return DocumentRepository.findOne({ parent: null })
          .then((document) =>
            traverse(document, compact(slugs), [
              {
                '@id': `${req.protocol || 'http'}://${req.headers.host}`,
                title: document.get('json').title,
              },
            ]),
          )
          .then((items) =>
            res.send({
              '@id': `${req.protocol || 'http'}://${req.headers.host}${
                req.params[0]
              }/@breadcrumbs`,
              items: drop(items),
            }),
          );
      }),
  },
];
