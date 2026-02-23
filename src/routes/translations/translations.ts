/**
 * Translations routes.
 * @module routes/translations/translations
 */

import { Document } from '../../models/document/document';
import { Controlpanel } from '../../models/controlpanel/controlpanel';
import { stripPath, getUrl, getUrlByPath } from '../../helpers/url/url';
import type { Request } from '../../types';
import type { Knex } from 'knex';

export const handler = async (req: Request, trx: Knex.Transaction) => {
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
      items: documents.models.map((document: any) => ({
        '@id': getUrlByPath(req, document.path),
        language: document.language,
      })),
      root: Object.fromEntries(
        settings.available_languages.map((language: string) => [
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
    client: 'getTranslations',
    handler,
  },
  {
    op: 'delete',
    view: '/@translations',
    permission: 'Modify',
    client: 'unlinkTranslation',
    handler: async (req: Request, trx: Knex.Transaction) => {
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
    client: 'linkTranslation',
    handler: async (req: Request, trx: Knex.Transaction) => {
      // Strip prefix of url
      const id = stripPath(req.body.id);

      let target;
      // Check if path
      if (id.startsWith('/')) {
        target = await Document.fetchOne({ path: id }, {}, trx);
        // Else it is a uuid
      } else {
        target = await Document.fetchOne({ uuid: id }, {}, trx);
      }

      // Link documents
      await target.update(
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
    client: 'getTranslationLocation',
    handler: async (req: Request, trx: Knex.Transaction) => {
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
