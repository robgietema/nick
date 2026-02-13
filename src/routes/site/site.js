/**
 * Site route.
 * @module routes/site/site
 */

import { last } from 'es-toolkit/array';

import { getRootUrl } from '../../helpers/url/url';
import config from '../../helpers/config/config';

import { Controlpanel } from '../../models/controlpanel/controlpanel';

/**
 * Detect MIME type from filename extension.
 * @param {string} filename
 * @returns {string} MIME type
 */
function getMimeType(filename) {
  const ext = filename?.split('.').pop()?.toLowerCase();
  const types = {
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    ico: 'image/x-icon',
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Parse site_logo value and return a displayable URL.
 * Handles three storage formats:
 * 1. Plone registry format: "filenameb64:BASE64_NAME;datab64:BASE64_DATA"
 * 2. Object with UUID (from handleFiles/blobstorage)
 * 3. Object with inline base64 data (legacy)
 * @param {string|Object|null} site_logo
 * @returns {string|null} URL or data URI for the logo
 */
function getSiteLogoUrl(site_logo) {
  if (!site_logo) return null;

  // Format 1: Plone registry format string
  if (typeof site_logo === 'string' && site_logo.startsWith('filenameb64:')) {
    const parts = site_logo.split(';datab64:');
    if (parts.length === 2 && parts[1]) {
      const filenameb64 = parts[0].replace('filenameb64:', '');
      const filename = Buffer.from(filenameb64, 'base64').toString('utf-8');
      const mimeType = getMimeType(filename);
      // Strip trailing '}' — Volto's RegistryImageWidget (line 102) appends
      // a stray '}' due to a template literal bug: `${fields[3]}}`
      const data = parts[1].replace(/\}+$/, '');
      return `data:${mimeType};base64,${data}`;
    }
    return null;
  }

  // Format 2: Object with UUID (from handleFiles → blobstorage)
  if (typeof site_logo === 'object' && site_logo.uuid) {
    return `${config.settings.frontendUrl}/en/@@images/${site_logo.uuid}.${last(site_logo.filename.split('.'))}`;
  }

  // Format 3: Object with inline base64 data (legacy/fallback)
  if (
    typeof site_logo === 'object' &&
    site_logo.data &&
    site_logo['content-type']
  ) {
    return `data:${site_logo['content-type']};base64,${site_logo.data}`;
  }

  return null;
}

export default [
  {
    op: 'get',
    view: '/@site',
    permission: 'View',
    client: 'getSite',
    handler: async (req, trx) => {
      const siteControlpanel = await Controlpanel.fetchById('site', {}, trx);
      const languageControlpanel = await Controlpanel.fetchById(
        'language',
        {},
        trx,
      );
      const site = siteControlpanel.data;
      const language = languageControlpanel.data;

      // Return database information
      return {
        json: {
          '@id': `${getRootUrl(req)}/@site`,
          features: {
            multilingual: language?.multilingual,
          },
          'plone.robots_txt': site?.robots_txt,
          'plone.site_logo': getSiteLogoUrl(site?.site_logo),
          'plone.site_title': site?.site_title,
          'plone.available_languages': language?.available_languages,
          'plone.default_language': language?.default_language,
        },
      };
    },
  },
];
