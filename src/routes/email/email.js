/**
 * Lock routes.
 * @module routes/lock/lock
 */

import { RequestException, sendMail } from '../../helpers';
import { User } from '../../models';
import { config } from '../../../config';

export default [
  {
    op: 'post',
    view: '/@email-send',
    permission: 'Modify',
    handler: async (req, trx) => {
      // Check if required fields provided
      if (!req.body.to || !req.body.from || !req.body.message) {
        throw new RequestException(400, {
          message: req.i18n('To, from and message are required fields.'),
        });
      }

      // Send mail
      await sendMail({
        to: req.body.to,
        from: req.body.name
          ? `"${req.body.name}" <${req.body.from}>`
          : req.body.from,
        subject: req.body.subject || '',
        text: req.body.message,
      });

      return {
        status: 204,
      };
    },
  },
  {
    op: 'post',
    view: '/@users/:id/@email-notification',
    permission: 'Modify',
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
      await sendMail({
        to: `"${user.fullname}" <${user.email}>`,
        from: req.body.name
          ? `"${req.body.name}" <${req.body.from}>`
          : req.body.from,
        subject: req.body.subject || '',
        text: req.body.message,
      });

      return {
        status: 204,
      };
    },
  },
  {
    op: 'post',
    view: '/@email-notification',
    permission: 'View',
    handler: async (req, trx) => {
      // Check if required fields provided
      if (!req.body.from || !req.body.message) {
        throw new RequestException(400, {
          message: req.i18n('From and message are required fields.'),
        });
      }

      // Send mail
      await sendMail({
        to: `"${config.emailFrom.name}" <${config.emailFrom.address}>`,
        from: req.body.name
          ? `"${req.body.name}" <${req.body.from}>`
          : req.body.from,
        subject: req.body.subject || '',
        text: req.body.message,
      });

      return {
        status: 204,
      };
    },
  },
];
