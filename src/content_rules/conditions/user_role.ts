/**
 * User role condition for content rules
 * @module content_rules/conditions/user_role
 */

import type { Request } from '../../types';

export const user_role = {
  getTitle: (req: Request) => req.i18n('User`s role'),
  getDescription: (req: Request) =>
    req.i18n('Apply only when the current user has the given role'),
  schema: {
    fieldsets: [
      {
        fields: ['role_names'],
        id: 'default',
        'title:i18n': 'Default',
      },
    ],
    properties: {
      role_names: {
        additionalItems: true,
        'description:i18n': 'The roles to check for.',
        factory: 'Multiple Choice',
        items: {
          description: '',
          factory: 'Choice',
          title: '',
          type: 'string',
          vocabulary: {
            '@id': 'roles',
          },
        },
        'title:i18n': 'Roles',
        type: 'array',
        uniqueItems: true,
      },
    },
    required: ['role_names'],
    type: 'object',
  },
  handler: async (params: any, req: Request) => {},
};
