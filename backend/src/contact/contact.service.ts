import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

export interface ContactResult {
  ok: true;
  delivered: boolean;
  mode: 'smtp' | 'dry-run';
  whatsappUrl: string;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async submit(dto: CreateContactDto): Promise<ContactResult> {
    const to = this.config.get<string>('MAIL_TO', 'contacto@tachetech.com');
    const whatsappNumber = this.config
      .get<string>('WHATSAPP_NUMBER', '573013745541')
      .replace(/\D/g, '');

    const subject = `Nuevo lead — ${dto.service} — ${dto.name}`;

    const text = [
      'Nueva solicitud desde tachetech.com',
      '',
      `Nombre:    ${dto.name}`,
      `Email:     ${dto.email}`,
      `WhatsApp:  ${dto.whatsapp}`,
      `Servicio:  ${dto.service}`,
      '',
      'Mensaje:',
      dto.message,
      '',
      `Recibido:  ${new Date().toISOString()}`,
    ].join('\n');

    const html = this.renderHtml(dto);

    const mailResult = await this.mail.send({
      to,
      subject,
      text,
      html,
      replyTo: dto.email,
    });

    this.logger.log(
      `Lead capturado: ${dto.name} <${dto.email}> · ${dto.service} · email=${mailResult.mode}`,
    );

    return {
      ok: true,
      delivered: mailResult.delivered,
      mode: mailResult.mode,
      whatsappUrl: this.buildWhatsappUrl(whatsappNumber, dto),
    };
  }

  private buildWhatsappUrl(phone: string, dto: CreateContactDto): string {
    const lines = [
      '*Nueva solicitud desde tachetech.com*',
      '',
      `*Nombre:* ${dto.name}`,
      `*Email:* ${dto.email}`,
      `*WhatsApp:* ${dto.whatsapp}`,
      `*Servicio:* ${dto.service}`,
      '',
      '*Mensaje:*',
      dto.message,
    ];
    return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  private renderHtml(dto: CreateContactDto): string {
    // Email-safe HTML inline (sin Tailwind: clientes de correo lo ignoran).
    const esc = (s: string): string =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    return `
<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#1d0cdf 0%,#7c3aed 100%);padding:24px 28px;color:#ffffff;">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.85;">Tache Technology</div>
              <div style="font-size:22px;font-weight:700;margin-top:6px;">Nuevo lead desde la web</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:120px;">Nombre</td><td style="padding:8px 0;font-weight:600;">${esc(dto.name)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(dto.email)}" style="color:#1d0cdf;text-decoration:none;">${esc(dto.email)}</a></td></tr>
                <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">WhatsApp</td><td style="padding:8px 0;">${esc(dto.whatsapp)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Servicio</td><td style="padding:8px 0;"><span style="display:inline-block;background:#eef2ff;color:#4338ca;padding:4px 10px;border-radius:999px;font-size:13px;font-weight:600;">${esc(dto.service)}</span></td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
              <div style="color:#64748b;font-size:13px;margin-bottom:8px;">Mensaje</div>
              <div style="white-space:pre-wrap;line-height:1.6;color:#0f172a;">${esc(dto.message)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center;">
              Recibido el ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })} · Bogotá
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
  }
}
