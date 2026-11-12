// Rutas comunes de las herramientas, relativas al repositorio (fuente/tools → raíz de la web).
//   SITE   carpeta de la web publicada (por defecto, la raíz del repositorio)
//   SHOTS  carpeta de capturas de las pruebas (por defecto fuente/capturas, ignorada por git)
//   CODIGO_CLASE / CODIGO_CLASE_FILE  código de clase en claro para las pruebas (nunca se sube)
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';

export const TOOLS = dirname(fileURLToPath(import.meta.url));
export const SITE = resolve(process.env.SITE || join(TOOLS, '..', '..')) + '/';
export const SITE_URL = pathToFileURL(SITE).href.replace(/\/?$/, '/');
export const SHOTS = resolve(process.env.SHOTS || join(TOOLS, '..', 'capturas')) + '/';
mkdirSync(SHOTS, { recursive: true });

export function codigoClase() {
  if (process.env.CODIGO_CLASE) return process.env.CODIGO_CLASE.trim();
  const f = process.env.CODIGO_CLASE_FILE || join(homedir(), '.secrets', 'portal_codigo_clase.txt');
  if (!existsSync(f)) throw new Error('Falta el código de clase: define CODIGO_CLASE o CODIGO_CLASE_FILE');
  return readFileSync(f, 'utf8').trim();
}
