/**
 * Copy item action for content rules
 * @module content_rules/actions/copy_item
 */

import type { Request } from '../../types';

export const copy_item = {
  getTitle: (req: Request) => req.i18n('Copy to folder'),
  getDescription: (req: Request) =>
    req.i18n('Copy the triggering item to a specific folder'),
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
  handler: async (params: any, req: Request) => {},
};
