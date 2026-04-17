# syntax=docker/dockerfile:1.7
# =========================================================================
# Tache Technology — API NestJS · Dockerfile multi-stage
# Imagen final ~150 MB, no-root, healthcheck integrado.
# =========================================================================

# --- 1. Builder: instala TODO y compila TypeScript -----------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Instalación reproducible
COPY package.json package-lock.json* ./
RUN npm ci

# Código y build
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

# Reinstala solo dependencias de producción para la imagen final
RUN npm prune --omit=dev


# --- 2. Runtime: imagen mínima -------------------------------------------
FROM node:20-alpine AS runtime

# tini = init process limpio (forwarding de señales para graceful shutdown)
# wget se usa en HEALTHCHECK
RUN apk add --no-cache tini wget && \
    addgroup -S app && adduser -S app -G app

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3001

COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/package.json ./package.json

USER app

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]
