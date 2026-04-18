/**
 * Copy item action for content rules
 * @module content_rules/actions/copy_item
 */

import type { Params, Reference, Request } from '../../types';

export const copy_item = {
  getTitle: (req: Request) => req.i18n('Copy to folder'),
  getDescription: (req: Request) =>
    req.i18n('Copy the triggering item to a specific folder'),
  getSummary: (req: Request, params: Params) =>
    req.i18n('Copy to folder {target_folder}', {
      target_folder:
        params.target_folder && params.target_folder.length > 0
          ? params.target_folder.map((item: Reference) => item.path).join(', ')
          : req.i18n('None'),
    }),
  schema: {
    fieldsets: [
      {
        fields: ['target_folder'],
        id: 'default',
        title: 'Default',
      },
    ],
    properties: {
      target_folder: {
        'description:i18n': 'As a path relative to the portal root.',
        'title:i18n': 'Target folder',
        widget: 'object_browser',
        factory: 'Relation Choice',
      },
    },
    required: ['target_folder'],
    type: 'object',
  },
  handler: async (params: Params, req: Request) => {},
};
