/**
 * Transition workflow action for content rules
 * @module content_rules/actions/transition_workflow
 */

import type { Request } from '../../types';

export const transition_workflow = {
  getTitle: (req: Request) => req.i18n('Transition workflow state'),
  getDescription: (req: Request) =>
    req.i18n('Perform a workflow transition on the triggering object'),
  schema: {
    fieldsets: [
      {
        fields: ['transition'],
        id: 'default',
        'title:i18n': 'Default',
      },
    ],
    properties: {
      transition: {
        'description:i18n': 'Select the workflow transition to attempt',
        factory: 'Choice',
        'title:i18n': 'Transition',
        type: 'string',
        vocabulary: {
          '@id': 'workflowTransitions',
        },
      },
    },
    required: ['transition'],
    type: 'object',
  },
  handler: async (params: any, req: Request) => {},
};
