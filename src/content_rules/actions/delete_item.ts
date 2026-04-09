/**
 * Delete item action for content rules
 * @module content_rules/actions/delete_item
 */

import type { Request } from '../../types';

export const delete_item = {
  getTitle: (req: Request) => req.i18n('Delete item'),
  getDescription: (req: Request) => req.i18n('Delete the triggering item'),
  schema: {
    fieldsets: [],
    properties: {},
    required: [],
    type: 'object',
  },
  handler: async (params: any, req: Request) => {},
};
