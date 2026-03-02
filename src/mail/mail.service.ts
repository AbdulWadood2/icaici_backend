import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}

@Injectable()
export class MailService {
  private transporter: Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const portStr = process.env.SMTP_PORT;
    const port = portStr ? parseInt(portStr, 10) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure =
      process.env.SMTP_SECURE === 'true' ||
      process.env.SMTP_SECURE === '1' ||
      port === 465;
    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    }
  }

  isConfigured(): boolean {
    return this.transporter !== null;
  }

  async send(options: SendMailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.warn('MailService: SMTP not configured; skipping email.');
      return false;
    }
    const from =
      process.env.SMTP_FROM ||
      process.env.MAIL_FROM ||
      process.env.SMTP_USER ||
      'noreply@localhost';
    const to = Array.isArray(options.to) ? options.to : [options.to];
    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });
      return true;
    } catch (err) {
      console.error('MailService.send error:', err);
      return false;
    }
  }
}
