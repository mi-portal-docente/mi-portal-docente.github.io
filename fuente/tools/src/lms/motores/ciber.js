// Motor «Ciberseguridad» (TIC): bandeja de correos (¿phishing o fiable?), medidor de contraseñas (la
// contraseña no sale nunca del navegador) y diagrama de la red de una pyme con sus riesgos.
import { registrarMotor } from '../elemento.js';
import { texto, lista, numero, esTexto } from './comun.js';

export const TIPOS_NODO = ['router', 'servidor', 'pc', 'portatil', 'movil', 'wifi', 'impresora', 'camara', 'nube', 'internet', 'switch'];
export const NIVELES = ['muy débil', 'débil', 'aceptable', 'fuerte', 'muy fuerte'];
const opcionesValidas = (q, ruta, err) => {
  const opciones = lista(q.opciones, ruta + '.opciones', err, { min: 2, max: 6, nombre: 'opciones' }).map((o, i) => texto(o, `${ruta}.opciones[${i}]`, err, { max: 200, obligatorio: true, nombre: 'opción' }));
  const correcta = numero(q.correcta, ruta + '.correcta', err, { min: 0, max: Math.max(0, opciones.length - 1), entero: true, obligatorio: true, nombre: 'correcta' });
  return { opciones, correcta };
};
export function validarCiber(c, err) {
  const o = {};
  if (c.correos != null) o.correos = lista(c.correos, 'correos', err, { min: 1, max: 20, nombre: 'correos' }).map((m, i) => {
    const r = `correos[${i}]`; if (!m || typeof m !== 'object') { err(r, 'Cada correo es un objeto { "de", "asunto", "cuerpo", "phishing" }.'); return null; }
    if (typeof m.phishing !== 'boolean') err(r + '.phishing', '«phishing» tiene que ser true o false.');
    return { de: texto(m.de, r + '.de', err, { max: 150, obligatorio: true, nombre: 'de' }), asunto: texto(m.asunto, r + '.asunto', err, { max: 200, obligatorio: true, nombre: 'asunto' }),
      cuerpo: texto(m.cuerpo, r + '.cuerpo', err, { max: 3000, obligatorio: true, nombre: 'cuerpo' }), enlace: texto(m.enlace, r + '.enlace', err, { max: 300, nombre: 'enlace' }),
      phishing: m.phishing === true, explicacion: texto(m.explicacion, r + '.explicacion', err, { max: 1000, nombre: 'explicacion' }) };
  }).filter(Boolean);
  if (c.contrasena != null) {
    const n = c.contrasena?.minimo; if (!NIVELES.includes(n)) err('contrasena.minimo', `«minimo» tiene que ser uno de: ${NIVELES.map((x) => `"${x}"`).join(', ')}.`);
    o.contrasena = { minimo: NIVELES.includes(n) ? n : 'fuerte' };
  }
  if (c.red != null) {
    const R = c.red || {}; const ids = new Set();
    const nodos = lista(R.nodos, 'red.nodos', err, { min: 2, max: 16, nombre: 'nodos' }).map((n, i) => {
      const r = `red.nodos[${i}]`; if (!n || typeof n !== 'object') { err(r, 'Cada nodo es un objeto { "id", "nombre", "tipo", "x", "y" }.'); return null; }
      if (!esTexto(n.id) || !/^[a-z0-9_-]{1,30}$/.test(n.id) || ids.has(n.id)) { err(r + '.id', '«id» único, con minúsculas, números, «-» o «_».'); return null; } ids.add(n.id);
      if (!TIPOS_NODO.includes(n.tipo)) { err(r + '.tipo', `«tipo» tiene que ser uno de: ${TIPOS_NODO.join(', ')}.`); return null; }
      const x = { id: n.id, nombre: texto(n.nombre, r + '.nombre', err, { max: 60, obligatorio: true, nombre: 'nombre' }), tipo: n.tipo,
        x: numero(n.x, r + '.x', err, { min: 0, max: 100, obligatorio: true, nombre: 'x' }), y: numero(n.y, r + '.y', err, { min: 0, max: 100, obligatorio: true, nombre: 'y' }) };
      if (n.riesgo != null) { const q = n.riesgo; x.riesgo = { pregunta: texto(q.pregunta, r + '.riesgo.pregunta', err, { max: 300, obligatorio: true, nombre: 'pregunta' }), ...opcionesValidas(q, r + '.riesgo', err), explicacion: texto(q.explicacion, r + '.riesgo.explicacion', err, { max: 1000, nombre: 'explicacion' }) }; }
      return x;
    }).filter(Boolean);
    const enlaces = lista(R.enlaces, 'red.enlaces', err, { max: 40, nombre: 'enlaces' }).map((e, i) => { if (!e || !ids.has(e.a) || !ids.has(e.b)) { err(`red.enlaces[${i}]`, 'Cada enlace es { "a": id, "b": id } con ids de nodos que existan.'); return null; } return { a: e.a, b: e.b, wifi: e.wifi === true }; }).filter(Boolean);
    if (!nodos.some((n) => n.riesgo)) err('red.nodos', 'Al menos un nodo necesita «riesgo» (pregunta con opciones).');
    o.red = { titulo: texto(R.titulo, 'red.titulo', err, { max: 150, nombre: 'titulo' }), nodos, enlaces };
  }
  if (!o.correos && !o.contrasena && !o.red) err('contenido', 'Pon al menos una parte: «correos», «contrasena» o «red».');
  return o;
}
// ---------------------------------------------------------------- contraseñas (solo en el navegador)
const COMUNES = ['123456', 'password', 'contraseña', 'qwerty', 'abc123', '111111', 'iloveyou', 'admin', 'letmein', 'futbol', 'barcelona', 'madrid', 'hola', 'secreto', 'superprofe'];
export function fuerzaContrasena(p) {
  const s = String(p || ''); const consejos = [];
  if (!s) return { nivel: 0, nombre: NIVELES[0], bits: 0, consejos: ['Escribe una contraseña para medirla.'] };
  let alfabeto = 0; if (/[a-zñ]/.test(s)) alfabeto += 27; if (/[A-ZÑ]/.test(s)) alfabeto += 27; if (/\d/.test(s)) alfabeto += 10; if (/[^a-zA-ZñÑ\d]/.test(s)) alfabeto += 33;
  let bits = s.length * Math.log2(Math.max(alfabeto, 2));
  const bajo = s.toLowerCase();
  if (COMUNES.some((c) => bajo.includes(c))) { bits = Math.min(bits, 20); consejos.push('Contiene una palabra o secuencia muy usada: es lo primero que se prueba.'); }
  if (/(.)\1\1/.test(s)) { bits -= 10; consejos.push('Evita repetir el mismo carácter seguido.'); }
  if (/(0123|1234|2345|3456|4567|5678|6789|abcd|qwer|asdf)/i.test(s)) { bits -= 12; consejos.push('Evita secuencias del teclado o del abecedario.'); }
  if (/(19|20)\d\d/.test(s)) { bits -= 6; consejos.push('Un año (de nacimiento, por ejemplo) se adivina fácil.'); }
  if (s.length < 12) consejos.push('Mejor 12 caracteres o más (una frase de varias palabras es fácil de recordar).');
  if (!/[A-ZÑ]/.test(s) || !/[a-zñ]/.test(s)) consejos.push('Mezcla mayúsculas y minúsculas.');
  if (!/\d/.test(s)) consejos.push('Añade algún número.');
  if (!/[^a-zA-ZñÑ\d]/.test(s)) consejos.push('Añade algún símbolo (- _ . ! ? …).');
  bits = Math.max(0, Math.round(bits));
  const nivel = bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
  return { nivel, nombre: NIVELES[nivel], bits, consejos: consejos.slice(0, 4) };
}
export const partesCiber = (c) => (c.correos?.length || 0) + (c.contrasena ? 1 : 0) + (c.red ? c.red.nodos.filter((n) => n.riesgo).length : 0);

registrarMotor('ciber', {
  nombre: 'Ciberseguridad', validar: validarCiber, entregable: true,
  resumen: (c) => [c.correos ? `${c.correos.length} correo${c.correos.length === 1 ? '' : 's'}` : '', c.contrasena ? `contraseña ${c.contrasena.minimo}` : '', c.red ? `red con ${c.red.nodos.length} equipos` : ''].filter(Boolean).join(' · '),
  ejemplo: {
    correos: [{ de: 'soporte@banco-seguro.example', asunto: 'Su cuenta será bloqueada', cuerpo: 'Verifique sus datos en las próximas 2 horas o bloquearemos su cuenta.', enlace: 'http://banco-seguro.example.verificar-datos.top/login', phishing: true, explicacion: 'Urgencia, amenaza y un enlace a un dominio que no es el del banco.' }],
    contrasena: { minimo: 'fuerte' },
    red: { titulo: 'Oficina pequeña', nodos: [{ id: 'internet', nombre: 'Internet', tipo: 'internet', x: 10, y: 50 }, { id: 'router', nombre: 'Router', tipo: 'router', x: 40, y: 50, riesgo: { pregunta: 'El router tiene la contraseña de fábrica. ¿Qué haces?', opciones: ['Cambiarla por una fuerte y actualizar el firmware', 'Nada, ya viene protegido'], correcta: 0 } }, { id: 'pc', nombre: 'PC de recepción', tipo: 'pc', x: 75, y: 50 }],
      enlaces: [{ a: 'internet', b: 'router' }, { a: 'router', b: 'pc' }] },
  },
});
