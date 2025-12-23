/**
 * Vocabularies route.
 * @module routes/vocabularies/vocabularies
 */

import { sortBy } from 'es-toolkit/compat';

import { Vocabulary } from '../../models/vocabulary/vocabulary';
import { vocabularies } from '../../vocabularies';
import { RequestException } from '../../helpers/error/error';
import { getUrl } from '../../helpers/url/url';

import config from '../../helpers/config/config';

export default [
  {
    op: 'get',
    view: '/@vocabularies',
    permission: 'View',
    client: 'getVocabularies',
    handler: async (req, trx) => {
      const profileVocabularies = await Vocabulary.fetchAll({}, {}, trx);
      return {
        json: sortBy(
          [
            ...Object.keys(vocabularies).map((vocabulary) => ({
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
    client: 'getVocabulary',
    handler: async (req, trx) => {
      // Check if vocabulary is available
      if (
        !Object.keys(vocabularies).includes(req.params.id) &&
        !Object.keys(config.settings.vocabularies || {}).includes(req.params.id)
      ) {
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
      const items = Object.keys(vocabularies).includes(req.params.id)
        ? await vocabularies[req.params.id](req)
        : await config.settings.vocabularies[req.params.id](req);

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
