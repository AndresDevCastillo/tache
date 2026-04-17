import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contact: ContactService) {}

  /**
   * POST /api/contact
   * Recibe el formulario, valida con CreateContactDto, dispara el email
   * y devuelve la URL de WhatsApp pre-rellenada para que el cliente la abra.
   *
   * Rate-limit por IP: máximo 3 envíos por minuto (más estricto que el global).
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async create(@Body() dto: CreateContactDto): Promise<{
    ok: true;
    delivered: boolean;
    mode: 'smtp' | 'dry-run';
    whatsappUrl: string;
  }> {
    return this.contact.submit(dto);
  }
}
