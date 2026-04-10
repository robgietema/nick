/**
 * User group condition for content rules
 * @module content_rules/conditions/user_group
 */

import type { Request } from '../../types';

export const user_group = {
  getTitle: (req: Request) => req.i18n('User’s group'),
  getDescription: (req: Request) =>
    req.i18n('Apply only when the current user is in the given group'),
  schema: {
    fieldsets: [
      {
        fields: ['group_names'],
        id: 'default',
        'title:i18n': 'Default',
      },
    ],
    properties: {
      group_names: {
        additionalItems: true,
        'description:i18n': 'The name of the group.',
        factory: 'Multiple Choice',
        items: {
          description: '',
          factory: 'Choice',
          title: '',
          type: 'string',
          vocabulary: {
            '@id': 'groups',
          },
        },
        'title:i18n': 'Group name',
        type: 'array',
        uniqueItems: true,
      },
    },
    required: ['group_names'],
    type: 'object',
  },
  handler: async (params: any, req: Request) => {},
};
