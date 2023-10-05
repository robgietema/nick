/**
 * Vocabularies route.
 * @module routes/vocabularies/vocabularies
 */

import { includes, keys, map, sortBy } from 'lodash';

import { Vocabulary } from '../../models';
import { vocabularies } from '../../vocabularies';
import { RequestException, getUrl } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);

export default [
  {
    op: 'get',
    view: '/@vocabularies',
    permission: 'View',
    handler: async (req, trx) => {
      const profileVocabularies = await Vocabulary.fetchAll({}, {}, trx);
      return {
        json: sortBy(
          [
            ...map(keys(vocabularies), (vocabulary) => ({
              '@id': `${getUrl(req)}/@vocabularies/${vocabulary}`,
              title: vocabulary,
            })),
            ...profileVocabularies.map((vocabulary) => ({
              '@id': `${getUrl(req)}/@vocabularies/${vocabulary.id}`,
              title: vocabulary.title,
            })),
          ],
          'title',
        ),
      };
    },
  },
  {
    op: 'get',
    view: '/@vocabularies/:id',
    permission: 'View',
    handler: async (req, trx) => {
      console.log(config.vocabularies);
      // Check if vocabulary is available
      if (!includes(keys(vocabularies, req.param.id)) &&
          !includes(keys(config.vocabularies), req.params.id)) {
        const vocabulary = await Vocabulary.fetchById(req.params.id, {}, trx);
        if (!vocabulary) {
          throw new RequestException(404, { error: req.i18n('Not found.') });
        }

        // Return data
        return {
          json: {
            '@id': `${getUrl(req)}/@vocabularies/${req.params.id}`,
            items: vocabulary.items,
            items_total: vocabulary.items.length,
          },
        };
      }

      // Get items
      const items = includes(keys(vocabularies), req.param.id) ?
        await vocabularies[req.params.id](req) :
        await config.vocabularies[req.params.id](req);

      // Return data
      return {
        json: {
          '@id': `${getUrl(req)}/@vocabularies/${req.params.id}`,
          items,
          items_total: items.length,
        },
      };
    },
  },
];
