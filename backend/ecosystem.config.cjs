/**
 * PM2 ecosystem para despliegue en VPS sin Docker.
 *
 * Uso:
 *   1) npm ci --omit=dev   (en el VPS, tras hacer npm run build localmente)
 *      o bien:  npm ci && npm run build
 *   2) pm2 start ecosystem.config.cjs --env production
 *   3) pm2 save && pm2 startup   (para arranque automático)
 *
 * Las variables sensibles van en .env (cargadas por @nestjs/config),
 * NO se duplican aquí.
 */
module.exports = {
  apps: [
    {
      name: 'tachetech-api',
      script: 'dist/main.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      time: true,
    },
  ],
};
