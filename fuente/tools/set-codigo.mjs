#!/usr/bin/env node
/**
 * Actualiza los hashes de los códigos de clase del portal.
 * Uso:  node tools/set-codigo.mjs "palabra-palabra-00" ["otro-codigo-12" ...]
 *
 * No escribas los códigos en claro en el repositorio. Este script solo guarda
 * el hash SHA-256 (con la sal de js/acceso-config.js) y sube "version",
 * para que los navegadores que ya habían entrado vuelvan a pedirlo.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { createHash, randomBytes } from 'crypto';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const toolsDir = dirname(fileURLToPath(import.meta.url));
const root = process.env.SITE || join(toolsDir, '..', '..');
const cfgPath = join(root, 'js', 'acceso-config.js');

export function normalizeCodigo(s) {
  return String(s).trim().toLowerCase().replace(/[\s\-]+/g, '-').replace(/^-|-$/g, '');
}

export function hashCodigo(codigo, salt) {
  return createHash('sha256')
    .update(String(salt) + '\n' + normalizeCodigo(codigo), 'utf8')
    .digest('hex');
}

export function leerConfig(path = cfgPath) {
  if (!existsSync(path)) return null;
  const t = readFileSync(path, 'utf8');
  const m = t.match(/window\.PORTAL_ACCESO\s*=\s*(\{[\s\S]*?\});/);
  if (!m) return null;
  return JSON.parse(m[1]);
}

export function escribirConfig(cfg, path = cfgPath) {
  mkdirSync(dirname(path), { recursive: true });
  const body = {
    version: cfg.version,
    salt: cfg.salt,
    hashes: cfg.hashes,
  };
  const txt =
`/* Configuración de acceso del portal.
   No pongas códigos en claro aquí. Para cambiarlos, desde la carpeta tools:
     node set-codigo.mjs "palabra-palabra-00" ["otro-codigo-12"]
   Al cambiar el conjunto de códigos se sube "version" y los navegadores
   que ya habían entrado tendrán que volver a introducir un código. */
window.PORTAL_ACCESO = ${JSON.stringify(body, null, 2)};
`;
  writeFileSync(path, txt, 'utf8');
}

function main(argv = process.argv.slice(2)) {
  if (!argv.length || argv.includes('-h') || argv.includes('--help')) {
    console.error('Uso: node tools/set-codigo.mjs <codigo> [codigo2 ...]');
    process.exit(argv.length && (argv.includes('-h') || argv.includes('--help')) ? 0 : 1);
  }
  const prev = leerConfig();
  const salt = (prev && prev.salt) || randomBytes(16).toString('hex');
  const version = (prev && Number(prev.version) ? Number(prev.version) : 0) + 1;
  const hashes = [];
  const seen = new Set();
  for (const raw of argv) {
    const n = normalizeCodigo(raw);
    if (!n) {
      console.error('Código vacío después de normalizar.');
      process.exit(1);
    }
    const h = hashCodigo(n, salt);
    if (seen.has(h)) continue;
    seen.add(h);
    hashes.push(h);
  }
  escribirConfig({ version, salt, hashes });
  console.log('Actualizado ' + cfgPath);
  console.log('version=' + version + ' codigos=' + hashes.length);
}

const isMain = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();
