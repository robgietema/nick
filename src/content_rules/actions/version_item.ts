/**
 * Version item action for content rules
 * @module content_rules/actions/version_item
 */

import type { Params, Request } from '../../types';

export const version_item = {
  getTitle: (req: Request) => req.i18n('Version item'),
  getDescription: (req: Request) => req.i18n('Store a new version of the item'),
  getSummary: (req: Request, params: Params) =>
    req.i18n('Version item with comment {comment}', {
      comment: params.comment || req.i18n('None'),
    }),
  schema: {
    fieldsets: [
      {
        fields: ['comment'],
        id: 'default',
        'title:i18n': 'Default',
      },
    ],
    properties: {
      comment: {
        'description:i18n':
          'The comment added to the history while versioning the content.',
        factory: 'Text line (String)',
        'title:i18n': 'Comment',
        type: 'string',
      },
    },
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
