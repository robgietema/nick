/**
 * Delete item action for content rules
 * @module content_rules/actions/delete_item
 */

import type { Params, Request } from '../../types';

export const delete_item = {
  getTitle: (req: Request) => req.i18n('Delete item'),
  getDescription: (req: Request) => req.i18n('Delete the triggering item'),
  getSummary: (req: Request, params: Params) => req.i18n('Delete item'),
  schema: {
    fieldsets: [
      {
        fields: [],
        id: 'default',
        title: 'Default',
      },
    ],
    properties: {},
    required: [],
    type: 'object',
  },
  handler: async (
    params: Params,
    document: any,
    user: any,
    contentRule: any,
  ) => {},
};
