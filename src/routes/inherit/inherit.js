/**
 * Inherit route.
 * @module routes/inherit/inherit
 */

import { pick } from 'es-toolkit/object';

import { Behavior } from '../../models/behavior/behavior';
import { Document } from '../../models/document/document';
import { getUrl, getUrlByPath } from '../../helpers/url/url';

/**
 * Traverse path.
 * @method traverse
 * @param {Object} document Current document object.
 * @param {Array} behaviors Array of behaviors.
 * @param {Object} items Current object of items.
 * @param {Object} req Request object.
 * @param {Object} trx Transaction object.
 * @returns {Promise<Array>} A Promise that resolves to an array of items.
 */
async function traverse(document, behaviors, items, req, trx) {
  let returnItems = { ...items };

  // If type not found fetch type
  if (!document._type) {
    await document.fetchRelated('_type', trx);
  }

  await Promise.all(
    behaviors.map(async (behavior) => {
      if (
        !returnItems[behavior] &&
        document._type._schema.behaviors.includes(behavior)
      ) {
        // Fetch behavior
        const behaviorObj = await Behavior.fetchById(behavior, {}, trx);
        const props = Object.keys(behaviorObj?.schema?.properties || {});

        returnItems[behavior] = {
          from: {
            '@id': getUrlByPath(req, document.path),
            title: document.json.title,
          },
          data: pick(await document.toJson(req), props),
        };
      }
    }),
  );

  if (document.parent === null) {
    return returnItems;
  } else {
    // Get parent
    let parent = await Document.fetchOne(
      {
        uuid: document.parent,
      },
      {},
      trx,
    );

    // Traverse up
    return await traverse(parent, behaviors, returnItems, req, trx);
  }
}

export const handler = async (req, trx) => {
  const behaviors = req.query['expand.inherit.behaviors']?.split(',') || [];
  const items = await traverse(req.document, behaviors, {}, req, trx);

  return {
    json: {
      '@id': `${getUrl(req)}/@inherit`,
      ...items,
    },
  };
};

export default [
  {
    op: 'get',
    view: '/@inherit',
    permission: 'View',
    client: 'inherit',
    handler,
  },
];
