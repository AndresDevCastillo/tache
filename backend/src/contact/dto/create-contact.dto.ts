import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export const SERVICE_OPTIONS = [
  'Desarrollo web',
  'Aplicación web',
  'Automatización con IA',
  'Integraciones / APIs',
  'Cloud y DevOps',
  'Asesoría / consultoría',
  'Otro',
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

/**
 * Payload aceptado por POST /api/contact.
 * Se valida con class-validator + se aplica trim para normalizar datos.
 */
export class CreateContactDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Length(2, 80, { message: 'El nombre debe tener entre 2 y 80 caracteres.' })
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @MaxLength(120)
  email!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^[+\d\s()-]{7,20}$/u, {
    message: 'El WhatsApp debe tener entre 7 y 20 caracteres (dígitos, +, espacios, paréntesis o guiones).',
  })
  whatsapp!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsIn(SERVICE_OPTIONS, { message: 'Servicio no válido.' })
  service!: ServiceOption;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(10, 2000, { message: 'El mensaje debe tener entre 10 y 2000 caracteres.' })
  message!: string;

  /**
   * Honeypot anti-bots: este campo no se muestra en el formulario real.
   * Si llega con valor, se descarta la petición silenciosamente.
   */
  @IsOptional()
  @IsString()
  @MaxLength(0, { message: 'Campo inválido.' })
  website?: string;
}
