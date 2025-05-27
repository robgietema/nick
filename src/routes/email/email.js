/**
 * Lock routes.
 * @module routes/lock/lock
 */

import { RequestException, sendMail } from '../../helpers';
import { Controlpanel, User } from '../../models';

export default [
  {
    op: 'post',
    view: '/@email-send',
    permission: 'Modify',
    client: 'sendEmail',
    handler: async (req, trx) => {
      // Check if required fields provided
      if (!req.body.to || !req.body.from || !req.body.message) {
        throw new RequestException(400, {
          message: req.i18n('To, from and message are required fields.'),
        });
      }

      // Send mail
      await sendMail(
        {
          to: req.body.to,
          from: req.body.name
            ? `"${req.body.name}" <${req.body.from}>`
            : req.body.from,
          subject: req.body.subject || '',
          text: req.body.message,
        },
        trx,
      );

      return {
        status: 204,
      };
    },
  },
  {
    op: 'post',
    view: '/@users/:id/@email-notification',
    permission: 'Modify',
    client: 'userEmailNotification',
    handler: async (req, trx) => {
      // Check if required fields provided
      if (!req.body.from || !req.body.message) {
        throw new RequestException(400, {
          message: req.i18n('From and message are required fields.'),
        });
      }

      // Fetch user
      const user = await User.fetchById(req.params.id, {}, trx);
      if (!user) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }

      // Send mail
      await sendMail(
        {
          to: `"${user.fullname}" <${user.email}>`,
          from: req.body.name
            ? `"${req.body.name}" <${req.body.from}>`
            : req.body.from,
          subject: req.body.subject || '',
          text: req.body.message,
        },
        trx,
      );

      return {
        status: 204,
      };
    },
  },
  {
    op: 'post',
    view: '/@email-notification',
    permission: 'View',
    client: 'emailNotification',
    handler: async (req, trx) => {
      // Check if required fields provided
      if (!req.body.from || !req.body.message) {
        throw new RequestException(400, {
          message: req.i18n('From and message are required fields.'),
        });
      }

      // Fetch settings
      const controlpanel = await Controlpanel.fetchById('mail', {}, trx);
      const settings = controlpanel.data;

      // Send mail
      await sendMail(
        {
          to: `"${settings.email_from_name}" <${settings.email_from_address}>`,
          from: req.body.name
            ? `"${req.body.name}" <${req.body.from}>`
            : req.body.from,
          subject: req.body.subject || '',
          text: req.body.message,
        },
        trx,
      );

      return {
        status: 204,
      };
    },
  },
];
