/**
 * Breadcrumbs route.
 * @module routes/breadcrumbs/breadcrumbs
 */

import { compact, drop, head, last } from 'lodash';

import { Document, Type } from '../../models';
import { getUrl, getRootUrl, getPath } from '../../helpers';
import { applyBehaviors } from '../../behaviors';

/**
 * Traverse path.
 * @method traverse
 * @param {Object} document Current document object.
 * @param {Array} slugs Array of slugs.
 * @param {Array} items Current array of items.
 * @param {Object} trx Transaction object.
 * @returns {Promise<Array>} A Promise that resolves to an array of items.
 */
async function traverse(document, slugs, items, trx) {
  if (slugs.length === 0) {
    return items;
  } else {
    // Get parent
    let parent = await Document.fetchOne(
      {
        parent: document.uuid,
        id: head(slugs),
      },
      {},
      trx,
    );
    const type = await Type.fetchById(parent.type, {}, trx);

    // Apply behaviors
    parent = applyBehaviors(parent, type.schema.behaviors);

    // Traverse up
    return traverse(
      parent,
      drop(slugs),
      [
        ...items,
        {
          '@id': `${last(items)['@id']}/${parent.id}`,
          title: parent.getTitle(),
        },
      ],
      trx,
    );
  }
}

export default [
  {
    op: 'get',
    view: '/@breadcrumbs',
    permission: 'View',
    handler: async (req, trx) => {
      const slugs = getPath(req).split('/');
      let document = await Document.fetchOne({ parent: null }, {}, trx);
      const type = await Type.fetchById(document.type, {}, trx);

      // Apply behaviors
      document = applyBehaviors(document, type.schema.behaviors);

      const items = await traverse(
        document,
        compact(slugs),
        [
          {
            '@id': getRootUrl(req),
            title: document.getTitle(),
          },
        ],
        trx,
      );
      return {
        json: {
          '@id': `${getUrl(req)}/@breadcrumbs`,
          items: drop(items),
        },
      };
    },
  },
];
