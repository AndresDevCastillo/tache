# Tache Technology — API NestJS

Backend ligero para el formulario de contacto de [tachetech.com](https://tachetech.com).
Recibe el lead, lo valida, envía email al equipo y devuelve la URL de WhatsApp pre-rellenada.

## Stack

- **NestJS 10** · TypeScript · arquitectura modular (controller / service / DTO).
- **class-validator** + **class-transformer** para validación declarativa.
- **nodemailer** para envío de email (SMTP genérico — funciona con Hostinger, Zoho, Gmail, SendGrid, Brevo, Resend, etc.).
- **@nestjs/throttler** para rate-limiting anti-spam (3 envíos/min/IP en `/api/contact`).
- **helmet** + CORS por whitelist.
- Honeypot anti-bots en el DTO (campo invisible).
- **Modo dry-run automático**: si las variables SMTP no están configuradas, el servicio loguea el email en consola en vez de fallar — perfecto para desarrollo.

## Endpoints

| Método | Ruta            | Rate-limit | Descripción |
|--------|-----------------|------------|-------------|
| `GET`  | `/api/health`   | sin límite | Healthcheck para Docker/k8s/uptime monitor. |
| `POST` | `/api/contact`  | 3/min/IP   | Recibe el formulario, envía email, devuelve `whatsappUrl`. |

### Ejemplo `POST /api/contact`

```bash
curl -X POST https://api.tachetech.com/api/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Andrés Castillo",
    "email": "andres@empresa.com",
    "whatsapp": "+57 300 000 0000",
    "service": "Desarrollo web",
    "message": "Necesito una landing para mi nuevo producto."
  }'
```

Respuesta:

```json
{
  "ok": true,
  "delivered": true,
  "mode": "smtp",
  "whatsappUrl": "https://wa.me/573013745541?text=..."
}
```

## Desarrollo local

```bash
npm install
cp .env.example .env       # editar valores; sin SMTP corre en dry-run
npm run start:dev          # http://localhost:3001/api
```

Probar:

```bash
curl http://localhost:3001/api/health
```

## Despliegue en VPS

Tres caminos. Elegí **uno** según preferencia.

---

### Opción A — Docker Compose (recomendado)

Requisitos: Docker + Docker Compose en el VPS.

```bash
# En el VPS
git clone <repo> /opt/tachetech
cd /opt/tachetech/backend
cp .env.example .env
nano .env                      # completar SMTP_*, MAIL_FROM, MAIL_TO, CORS_ORIGINS
docker compose up -d --build

# Verificar
docker compose ps
docker compose logs -f api
curl http://127.0.0.1:3001/api/health
```

Actualizar tras un `git pull`:

```bash
docker compose up -d --build
docker image prune -f
```

---

### Opción B — PM2 (sin Docker)

Requisitos: Node.js 20+ y PM2 (`npm i -g pm2`) en el VPS.

```bash
cd /opt/tachetech/backend
cp .env.example .env && nano .env
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup            # genera el comando para arranque al boot — copiá y pegá
```

Operación:

```bash
pm2 logs tachetech-api
pm2 restart tachetech-api
pm2 status
```

---

### Opción C — systemd nativo

Crear `/etc/systemd/system/tachetech-api.service`:

```ini
[Unit]
Description=Tache Technology API (NestJS)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/tachetech/backend
EnvironmentFile=/opt/tachetech/backend/.env
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Activar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now tachetech-api
sudo systemctl status tachetech-api
journalctl -u tachetech-api -f
```

---

## Reverse proxy con nginx + HTTPS

El backend escucha en `127.0.0.1:3001` (no expuesto público). nginx termina TLS y hace proxy.

`/etc/nginx/sites-available/api.tachetech.com`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.tachetech.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.tachetech.com;

    # Certificados (certbot los crea — ver más abajo)
    ssl_certificate     /etc/letsencrypt/live/api.tachetech.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.tachetech.com/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # Headers de seguridad básicos (helmet ya cubre los del backend)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cuerpo razonable para el formulario
    client_max_body_size 1m;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }
}
```

Activar y emitir certificado:

```bash
sudo ln -s /etc/nginx/sites-available/api.tachetech.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.tachetech.com
```

## DNS

Crear un registro **A** en tu proveedor DNS:

```
api.tachetech.com   →   <IP-pública-del-VPS>
```

## Variables de entorno

Ver [`.env.example`](./.env.example). Las mínimas obligatorias para producción:

- `CORS_ORIGINS` — `https://tachetech.com,https://www.tachetech.com`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- `MAIL_FROM` — debe ser un alias válido en tu dominio (ej: `no-reply@tachetech.com`)
- `MAIL_TO` — buzón donde llegan los leads (ej: `contacto@tachetech.com`)

## Conexión desde el frontend

En el `ContactFormPro` ya hay una prop `apiEndpoint`. Pasarla así:

```astro
<ContactFormPro
  whatsappNumber="573013745541"
  apiEndpoint="https://api.tachetech.com/api/contact"
/>
```

O exponerla por variable de entorno de Astro (`PUBLIC_API_URL`) — ver el componente.

## Estructura

```
backend/
├── src/
│   ├── main.ts                    # Bootstrap (helmet, CORS, ValidationPipe, prefix /api)
│   ├── app.module.ts              # ConfigModule + ThrottlerModule globales
│   ├── contact/
│   │   ├── contact.controller.ts  # POST /api/contact (con @Throttle 3/min)
│   │   ├── contact.service.ts     # Compone email HTML + texto, llama MailService
│   │   ├── contact.module.ts
│   │   └── dto/create-contact.dto.ts
│   ├── mail/
│   │   ├── mail.service.ts        # nodemailer + modo dry-run
│   │   └── mail.module.ts
│   └── health/
│       ├── health.controller.ts   # GET /api/health
│       └── health.module.ts
├── Dockerfile                     # Multi-stage, no-root, healthcheck
├── docker-compose.yml             # Bind 127.0.0.1:3001 (proxy detrás de nginx)
├── ecosystem.config.cjs           # PM2 alternativa a Docker
└── .env.example
```
