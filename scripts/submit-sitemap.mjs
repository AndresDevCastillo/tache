#!/usr/bin/env node
/**
 * Envío automático de URLs a buscadores después del build.
 *
 * - IndexNow (Bing, Yandex, Seznam, Naver, DuckDuckGo) — protocolo abierto y oficial.
 * - Google dejó de aceptar el endpoint /ping?sitemap= en junio 2023. Google ahora
 *   detecta cambios automáticamente leyendo el sitemap referenciado en robots.txt
 *   (ya está configurado). El envío manual inicial se hace una sola vez desde
 *   Search Console.
 *
 * No rompe el build si algo falla — solo imprime un aviso.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SITE_URL = process.env.SITE_URL || 'https://tachetech.com';
const INDEXNOW_KEY = '5d4c9864b62146298b343d95b5355e4a';
const INDEXNOW_KEY_URL = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const SKIP = process.env.SKIP_SITEMAP_SUBMIT === 'true' || process.env.NODE_ENV === 'development';

const log = (emoji, msg) => console.log(`${emoji}  [submit-sitemap] ${msg}`);

async function extractUrls() {
  const indexPath = resolve(ROOT, 'dist/sitemap-index.xml');
  if (!existsSync(indexPath)) {
    log('⚠️ ', 'No se encontró dist/sitemap-index.xml. ¿Corriste npm run build primero?');
    return [];
  }

  const indexXml = await readFile(indexPath, 'utf8');
  const sitemapPaths = Array.from(indexXml.matchAll(/<loc>(.*?)<\/loc>/g))
    .map((m) => m[1].trim())
    .map((u) => resolve(ROOT, 'dist', u.split('/').pop()))
    .filter((p) => existsSync(p));

  const urls = new Set();
  for (const path of sitemapPaths) {
    const xml = await readFile(path, 'utf8');
    for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
      urls.add(match[1].trim());
    }
  }
  return Array.from(urls);
}

async function submitToIndexNow(urls) {
  if (!urls.length) return;
  const body = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_URL,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    if (res.ok || res.status === 202) {
      log('✅', `IndexNow OK — ${urls.length} URL(s) enviadas (Bing, Yandex, Seznam, DuckDuckGo).`);
    } else {
      const text = await res.text().catch(() => '');
      log('⚠️ ', `IndexNow respondió ${res.status}: ${text.slice(0, 180)}`);
    }
  } catch (err) {
    log('⚠️ ', `IndexNow falló: ${err.message}`);
  }
}

async function pingSearchEngines() {
  // Google deprecó el ping endpoint — lo mantenemos como best-effort silencioso.
  // La indexación real viene por sitemap en robots.txt + Search Console.
  const sitemapUrl = `${SITE_URL}/sitemap-index.xml`;
  const targets = [
    // Bing lo sigue soportando, y aunque IndexNow también lo cubre, doble-notificar no daña.
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];
  await Promise.all(
    targets.map(async (url) => {
      try {
        const res = await fetch(url);
        if (res.ok) log('✅', `Sitemap ping OK → ${new URL(url).hostname}`);
      } catch {
        /* best-effort */
      }
    })
  );
}

async function main() {
  if (SKIP) {
    log('⏭️ ', 'SKIP_SITEMAP_SUBMIT=true o NODE_ENV=development, saltando envío.');
    return;
  }
  const urls = await extractUrls();
  if (!urls.length) {
    log('⚠️ ', 'Sin URLs que enviar.');
    return;
  }
  log('📤', `Enviando ${urls.length} URL(s) a buscadores…`);
  await submitToIndexNow(urls);
  await pingSearchEngines();
  log('🎉', 'Envío automático completado.');
}

main().catch((err) => {
  log('❌', `Error inesperado (no afecta el build): ${err.message}`);
  process.exit(0);
});
