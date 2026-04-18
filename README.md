# Tache Technology Web

Sitio web de **Tache Technology** construido con **Astro + Tailwind CSS**, con backend en **NestJS** para el formulario de contacto.

## Stack

- Frontend: Astro 4, Tailwind CSS, Astro Icon
- Backend: NestJS 10, Nodemailer, Class Validator, Throttler

## Estructura del proyecto

```text
.
├── src/                  # Frontend Astro
├── public/               # Assets públicos
├── backend/              # API NestJS (contacto, salud, correo)
├── .env.example          # Variables de entorno del frontend
└── backend/.env.example  # Variables de entorno del backend
```

## Ejecutar en local

### 1) Frontend

```bash
npm install
npm run dev
```

Por defecto corre en `http://localhost:3000`.

### 2) Backend

```bash
cd backend
npm install
npm run start:dev
```

Por defecto corre en `http://localhost:3001` con prefijo `/api`.

## Variables de entorno

### Frontend (`.env`)

Copiar `.env.example` a `.env` y configurar:

- `PUBLIC_API_URL` (ejemplo: `https://api.tachetech.com/api/contact`)

### Backend (`backend/.env`)

Copiar `backend/.env.example` a `backend/.env` y configurar:

- `PORT`
- `CORS_ORIGINS`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- `MAIL_FROM`, `MAIL_TO`
- `WHATSAPP_NUMBER`
- `THROTTLE_TTL_MS`, `THROTTLE_LIMIT`

## Comandos útiles

### Frontend (raíz)

- `npm run dev` - entorno de desarrollo
- `npm run build` - build de producción
- `npm run preview` - previsualizar build
- `npm run lint:eslint` - lint
- `npm run format` - formateo

### Backend (`backend/`)

- `npm run start:dev` - entorno de desarrollo
- `npm run build` - compilación
- `npm run start:prod` - ejecutar build

## Rutas principales

- `/` - Inicio
- `/nosotros` - Información de la empresa y reconocimiento
- `/servicios` - Catálogo de servicios
- `/proyectos` - Portafolio
- `/proceso` - Flujo de trabajo
- `/contacto` - Formulario + CTA a WhatsApp

## Actualización reciente

Se agregó en la sección **Nosotros** un bloque de reconocimiento por el premio:

- Título: *Ganadores del Programa Transformación Digital para MiPYMES*
- Fuente: `https://www.chicanoticias.com/2024/11/13/trasnformacion-comercio-digital/`
- Imagen del equipo: `public/images/news/premio-transformacion-3.jpeg`
- Componente: `src/components/widgets/MissionVision.astro`

## Notas

- El backend tiene documentación detallada en `backend/README.md`.
- Si el SMTP no está configurado, el backend entra en modo `dry-run` para pruebas.
