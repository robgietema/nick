/**
 * Content type condition for content rules
 * @module content_rules/conditions/content_type
 */

import type { Request } from '../../types';

export const content_type = {
  getTitle: (req: Request) => req.i18n('Content type'),
  getDescription: (req: Request) =>
    req.i18n(
      'Apply only when the current content object is of a particular type',
    ),
  schema: {
    fieldsets: [
      {
        fields: ['check_types'],
        id: 'default',
        'title:i18n': 'Default',
      },
    ],
    properties: {
      check_types: {
        additionalItems: true,
        'description:i18n': 'The content type to check for.',
        factory: 'Multiple Choice',
        items: {
          description: '',
          factory: 'Choice',
          title: '',
          type: 'string',
          vocabulary: {
            '@id': 'types',
          },
        },
        'title:i18n': 'Content type',
        type: 'array',
        uniqueItems: true,
      },
    },
    required: ['check_types'],
    type: 'object',
  },
  handler: async (params: any, req: Request) => {},
};
