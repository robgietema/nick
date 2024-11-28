/**
 * Translations routes.
 * @module routes/translations/translations
 */

import { fromPairs, map } from 'lodash';

import { Document, Controlpanel } from '../../models';
import { getPath, getUrl, getUrlByPath } from '../../helpers';

export const handler = async (req, trx) => {
  const documents = req.document.translation_group
    ? await Document.fetchAll(
        { translation_group: req.document.translation_group },
        {},
        trx,
      )
    : [];
  const controlpanel = await Controlpanel.fetchById('language', {}, trx);
  const settings = controlpanel.data;

  return {
    json: {
      '@id': `${getUrl(req)}/@translations`,
      items: map(documents.models, (document) => ({
        '@id': getUrlByPath(req, document.path),
        language: document.language,
      })),
      root: fromPairs(
        map(settings.available_languages, (language) => [
          language,
          getUrlByPath(req, `/${language}`),
        ]),
      ),
    },
  };
};

export default [
  {
    op: 'get',
    view: '/@translations',
    permission: 'View',
    handler,
  },
  {
    op: 'delete',
    view: '/@translations',
    permission: 'Modify',
    handler: async (req, trx) => {
      const document = await Document.fetchOne(
        {
          translation_group: req.document.translation_group,
          language: req.body.language,
        },
        {},
        trx,
      );
      await document.update(
        {
          translation_group: null,
        },
        trx,
      );
      return {
        json: {},
      };
    },
  },
  {
    op: 'post',
    view: '/@translations',
    permission: 'Modify',
    handler: async (req, trx) => {
      // Strip prefix of url
      const id = getPath(req.body.id);

      let target;
      // Check if path
      if (startsWith(id, '/')) {
        target = await Document.fetchOne({ path: id }, {}, trx);
        // Else it is a uuid
      } else {
        target = await Document.fetchOne({ uuid: id }, {}, trx);
      }

      // Link documents
      await document.update(
        {
          translation_group: req.document.translation_group,
        },
        trx,
      );

      return {
        json: {},
      };
    },
  },
  {
    op: 'get',
    view: '/@translation-locator',
    permission: 'View',
    handler: async (req, trx) => {
      // Fetch parent
      const parent = await Document.fetchOne({
        uuid: req.document.parent,
      });

      const document = await Document.fetchOne(
        {
          translation_group: parent.translation_group,
          language: req.query.target_language,
        },
        {},
        trx,
      );

      return {
        json: {
          '@id': document
            ? getUrlByPath(req, document.path)
            : getUrlByPath(req, `/${req.query.target_language}`),
        },
      };
    },
  },
];
