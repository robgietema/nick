/**
 * Mail.
 * @module helpers/mail/mail
 */

import nodemailer from 'nodemailer';

import { log } from '../../helpers';
import { config } from '../../../config';

/**
 * Send mail
 * @method sendMail
 * @param {Object} data Mail data to send
 */
export async function sendMail(data) {
  let transporter;

  // If debug
  if (config.mailDebug) {
    // Set test mailserver
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    // Set mailserver
    transporter = nodemailer.createTransport(config.mailServer);
  }

  // Send mail
  const info = await transporter.sendMail(data);

  // Log mail
  log.info(`Mail sent: ${info.messageId}`);

  // If debug
  if (config.mailDebug) {
    log.info(`Mail preview url: ${nodemailer.getTestMessageUrl(info)}`);
  }
}
