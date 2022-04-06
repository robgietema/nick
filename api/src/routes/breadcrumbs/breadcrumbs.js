/**
 * Breadcrumbs route.
 * @module routes/breadcrumbs/breadcrumbs
 */

import { compact, drop, head, last } from 'lodash';

import { Document } from '../../models';

/**
 * Traverse path.
 * @method traverse
 * @param {Object} document Current document object.
 * @param {Array} slugs Array of slugs.
 * @param {Array} items Current array of items.
 * @returns {Promise<Array>} A Promise that resolves to an array of items.
 */
async function traverse(document, slugs, items) {
  if (slugs.length === 0) {
    return items;
  } else {
    const parent = await Document.fetchOne({
      parent: document.uuid,
      id: head(slugs),
    });
    return traverse(parent, drop(slugs), [
      ...items,
      {
        '@id': `${last(items)['@id']}/${parent.id}`,
        title: parent.json.title,
      },
    ]);
  }
}

export default [
  {
    op: 'get',
    view: '/@breadcrumbs',
    permission: 'View',
    handler: async (req) => {
      const slugs = req.params[0].split('/');
      const document = await Document.fetchOne({ parent: null });
      const items = await traverse(document, compact(slugs), [
        {
          '@id': `${req.protocol}://${req.headers.host}`,
          title: document.json.title,
        },
      ]);
      return {
        json: {
          '@id': `${req.protocol}://${req.headers.host}${req.params[0]}/@breadcrumbs`,
          items: drop(items),
        },
      };
    },
  },
];
