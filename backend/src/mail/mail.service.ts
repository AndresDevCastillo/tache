import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private from = '';

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const host = this.config.get<string>('SMTP_HOST');
    const port = this.config.get<number>('SMTP_PORT', 587);
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    const secure = this.config.get<string>('SMTP_SECURE', 'false') === 'true';
    this.from = this.config.get<string>('MAIL_FROM', '');

    if (!host || !user || !pass || !this.from) {
      this.logger.warn(
        'SMTP no configurado (faltan SMTP_HOST/SMTP_USER/SMTP_PASS/MAIL_FROM). El servicio funciona en modo DRY-RUN: los emails se loguean en consola pero no se envían.',
      );
      return;
    }

    this.transporter = createTransport({
      host,
      port,
      secure, // true para 465, false para 587/STARTTLS
      auth: { user, pass },
    });

    this.transporter
      .verify()
      .then(() => this.logger.log(`✉️  SMTP listo (${host}:${port})`))
      .catch((err) => this.logger.error(`SMTP verify falló: ${err.message}`));
  }

  async send(message: MailMessage): Promise<{ delivered: boolean; mode: 'smtp' | 'dry-run' }> {
    if (!this.transporter) {
      this.logger.log('--- DRY-RUN EMAIL ---');
      this.logger.log(`To:      ${message.to}`);
      this.logger.log(`Subject: ${message.subject}`);
      if (message.replyTo) this.logger.log(`Reply-To: ${message.replyTo}`);
      this.logger.log('--- TEXT ---');
      this.logger.log(message.text);
      this.logger.log('--- END ---');
      return { delivered: false, mode: 'dry-run' };
    }

    await this.transporter.sendMail({
      from: this.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    });
    return { delivered: true, mode: 'smtp' };
  }
}
