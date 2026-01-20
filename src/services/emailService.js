const nodemailer = require('nodemailer');
const Logger = require('./logger');

class EmailService {
  constructor() {
    this.logger = new Logger();
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendEmail(to, subject, text) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text
      });

      this.logger.info(`✅ Email sent to ${to}`);
      return info;
    } catch (error) {
      this.logger.error(`❌ Email error to ${to}:`, error);
      throw error;
    }
  }

  async sendBulkEmails(recipients) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail(
          recipient.email,
          recipient.subject,
          recipient.text
        );
        results.push({ status: 'sent', recipient: recipient.email });
      } catch (error) {
        results.push({ status: 'failed', recipient: recipient.email, error });
      }
    }

    return results;
  }
}

module.exports = EmailService;
