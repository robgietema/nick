/**
 * Lock routes.
 * @module routes/lock/lock
 */

import { RequestException, log, sendMail } from '../../helpers';

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
];
