/**
 * Breadcrumbs route.
 * @module routes/breadcrumbs/breadcrumbs
 */

import { compact, drop, head, includes, last } from 'lodash';

import { Document } from '../../models';
import { getUrl, getRootUrl, getPath } from '../../helpers';

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
    // Get child
    let child = await Document.fetchOne(
      {
        parent: document.uuid,
        id: head(slugs),
      },
      {},
      trx,
    );

    // Apply behaviors
    await child.applyBehaviors(trx);

    // Traverse up
    return traverse(
      child,
      drop(slugs),
      [
        ...(includes(child._type._schema.behaviors, 'navigation_root')
          ? []
          : items),
        {
          '@id': `${last(items)['@id']}/${child.id}`,
          title: child.getTitle(),
        },
      ],
      trx,
    );
  }
}

export const handler = async (req, trx) => {
  const slugs = getPath(req).split('/');
  let document = await Document.fetchOne({ parent: null }, {}, trx);

  // Apply behaviors
  await document.applyBehaviors(trx);

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
      root: req.navroot.path,
    },
  };
};

export default [
  {
    op: 'get',
    view: '/@breadcrumbs',
    permission: 'View',
    handler,
  },
];
