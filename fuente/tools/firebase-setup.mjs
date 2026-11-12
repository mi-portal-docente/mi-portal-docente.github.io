#!/usr/bin/env node
// Puesta en marcha de Firebase para el portal docente.
//
//   node firebase-setup.mjs --config <archivo>      escribe js/firebase-config.js con la configuración web
//                                                  (acepta el JSON o el bloque «const firebaseConfig = {...}» de la consola)
//   node firebase-setup.mjs --email <correo>        prepara las reglas con el correo del profesor
//        [--project <id>]                          (por defecto, el projectId de js/firebase-config.js)
//        [--deploy]                                y las despliega con firebase-tools. Credenciales:
//                                                  GOOGLE_APPLICATION_CREDENTIALS=<cuenta de servicio .json>
//                                                  o FIREBASE_TOKEN=<token de «firebase login:ci»>
//   Sin --deploy deja el archivo listo para PEGAR en la consola:
//     Firebase → Firestore Database → Reglas → pegar → Publicar.
//
// Ejemplo completo:
//   node firebase-setup.mjs --config ruta/firebase-config.json --email profe@ejemplo.com --deploy
//   [--pegar <archivo>]  dónde dejar las reglas listas para pegar (por defecto firebase/firestore.rules.para-pegar.txt,
//                        que git ignora porque lleva el correo del profesor; también vale la variable PEGAR)
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const WEB = process.env.SITE || join(DIR, '..', '..');
const FB = join(DIR, 'firebase');
const CAMPOS = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId', 'measurementId'];

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf('--' + k); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : null; };
const die = (m) => { console.error('✖ ' + m); process.exit(1); };
const PEGAR = (typeof opt('pegar') === 'string' && opt('pegar')) || process.env.PEGAR || join(FB, 'firestore.rules.para-pegar.txt');

// Lee la configuración tanto en JSON como en el formato JS que muestra la consola de Firebase.
export function leerConfig(texto) {
  const out = {};
  try { const j = JSON.parse(texto); for (const k of CAMPOS) if (typeof j[k] === 'string') out[k] = j[k]; } catch (e) {
    for (const k of CAMPOS) { const m = texto.match(new RegExp(`["']?${k}["']?\\s*:\\s*["']([^"']+)["']`)); if (m) out[k] = m[1]; }
  }
  return out;
}
function configActual() {
  const t = readFileSync(join(WEB, 'js', 'firebase-config.js'), 'utf8');
  return leerConfig(t);
}

const cfgFile = opt('config');
if (cfgFile) {
  if (!existsSync(cfgFile)) die('No existe ' + cfgFile);
  const c = leerConfig(readFileSync(cfgFile, 'utf8'));
  for (const k of ['apiKey', 'authDomain', 'projectId', 'appId']) if (!c[k]) die(`A la configuración le falta «${k}».`);
  if (!/^AIza[0-9A-Za-z_-]{20,}$/.test(c.apiKey)) console.warn('⚠ La apiKey no tiene el formato habitual (AIza…). Revísala.');
  const q = (v) => `'${String(v || '').replace(/[\\']/g, '')}'`;
  const js = `/* Configuración de Firebase del portal docente.
   Estos datos NO son secretos (van en toda web que usa Firebase): la seguridad la dan las
   reglas de Firestore, que se despliegan aparte.
   Mientras apiKey o projectId estén vacíos, la web sigue pidiendo el «código de clase» de siempre. */
window.PORTAL_FIREBASE = {
${['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'].map(k => `  ${k}: ${q(c[k])}`).join(',\n')}
};
`;
  writeFileSync(join(WEB, 'js', 'firebase-config.js'), js);
  console.log(`✔ js/firebase-config.js escrito para el proyecto «${c.projectId}».`);
}

const email = opt('email');
if (email) {
  execFileSync(process.execPath, [join(FB, 'prepara-reglas.mjs'), String(email)], { stdio: 'inherit' });
  copyFileSync(join(FB, 'firestore.rules.desplegar'), PEGAR);
  const project = opt('project') || configActual().projectId;
  if (opt('deploy')) {
    if (!project) die('Falta el proyecto: usa --project <id> o rellena antes js/firebase-config.js (--config).');
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIREBASE_TOKEN) die('Para desplegar hace falta GOOGLE_APPLICATION_CREDENTIALS (cuenta de servicio) o FIREBASE_TOKEN. Si no, pega las reglas en la consola: ' + PEGAR);
    console.log(`→ Desplegando reglas en «${project}»…`);
    execFileSync('npx', ['firebase', 'deploy', '--only', 'firestore:rules', '--project', project, '--non-interactive'], { cwd: FB, stdio: 'inherit', env: process.env });
    console.log('✔ Reglas desplegadas.');
  } else {
    console.log(`\nReglas listas para pegar: ${PEGAR}\n  Firebase → Firestore Database → pestaña «Reglas» → borrar todo → pegar → «Publicar».`);
  }
}
if (!cfgFile && !email) { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 17).join('\n')); }
