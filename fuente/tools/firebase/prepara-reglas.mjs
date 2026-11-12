// Genera firestore.rules.desplegar sustituyendo PROFESOR_EMAIL por el correo indicado.
//   node prepara-reglas.mjs correo@ejemplo.com
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = dirname(fileURLToPath(import.meta.url));
const email = String(process.argv[2] || '').trim().toLowerCase();
if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
  console.error('Uso: node prepara-reglas.mjs correo@ejemplo.com  (falta un correo válido)');
  process.exit(1);
}
const src = readFileSync(join(dir, 'firestore.rules'), 'utf8');
if (!src.includes("'PROFESOR_EMAIL'")) { console.error('No encuentro el marcador PROFESOR_EMAIL en firestore.rules'); process.exit(1); }
const out = src.replaceAll("'PROFESOR_EMAIL'", `'${email.replace(/'/g, '')}'`);
writeFileSync(join(dir, 'firestore.rules.desplegar'), out);
console.log('Reglas preparadas para', email, '→ firestore.rules.desplegar');
