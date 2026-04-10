/**
 * Send email action for content rules
 * @module content_rules/actions/send_email
 */

import type { Request } from '../../types';

export const send_email = {
  getTitle: (req: Request) => req.i18n('Send email'),
  getDescription: (req: Request) =>
    req.i18n('Send an email on the triggering object'),
  getSummary: (req: Request, params: any) =>
    req.i18n('Email report to {recipients}', {
      recipients: params.recipients || req.i18n('None'),
    }),
  schema: {
    fieldsets: [
      {
        fields: ['subject', 'source', 'recipients', 'exclude_actor', 'message'],
        id: 'default',
        'title:i18n': 'Default',
      },
    ],
    properties: {
      exclude_actor: {
        'description:i18n':
          'Do not send the email to the user that did the action.',
        factory: 'Yes/No',
        'title:i18n': 'Exclude actor from recipients',
        type: 'boolean',
      },
      message: {
        'description:i18n': 'The message that you want to mail.',
        factory: 'Text',
        'title:i18n': 'Message',
        type: 'string',
        widget: 'textarea',
      },
      recipients: {
        'description:i18n':
          'The email where you want to send this message. To send it to different email addresses, just separate them with ,',
        factory: 'Text line (String)',
        'title:i18n': 'Email recipients',
        type: 'string',
      },
      source: {
        'description:i18n':
          'The email address that sends the email. If no email is provided here, it will use the portal from address.',
        factory: 'Text line (String)',
        'title:i18n': 'Email source',
        type: 'string',
      },
      subject: {
        'description:i18n': 'Subject of the message',
        factory: 'Text line (String)',
        'title:i18n': 'Subject',
        type: 'string',
      },
    },
    required: ['subject', 'recipients', 'message'],
    type: 'object',
  },
  handler: async (params: any, req: Request) => {},
};
