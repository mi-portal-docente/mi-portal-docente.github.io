// P4 · Preguntas numéricas con datos distintos para cada alumno.
//  · variables: { R: {min, max, paso}, V: {…} } → valores fijos para cada alumno (semilla del examen + nº de lista);
//  · fórmula de la solución («V / R», «sqrt(P*R)»…): solo la tiene el profesor (claves), el alumno ve los datos.
// Evaluador propio y seguro (sin eval): números, variables, + - * / ^, paréntesis y funciones matemáticas.
import { semilla } from './modelo.js';

const FUNCS = { sqrt: Math.sqrt, abs: Math.abs, sin: (x) => Math.sin(x * Math.PI / 180), cos: (x) => Math.cos(x * Math.PI / 180), tan: (x) => Math.tan(x * Math.PI / 180), log: Math.log10, ln: Math.log, exp: Math.exp, round: Math.round };
const CONST = { pi: Math.PI };

export function evaluarFormula(txt, vars = {}) {
  const s = String(txt || '').replace(/,/g, '.'); let i = 0;
  const err = (m) => { throw new Error(m); };
  const esp = () => { while (s[i] === ' ') i++; };
  function primario() {
    esp();
    if (s[i] === '(') { i++; const v = suma(); esp(); if (s[i] !== ')') err('Falta un paréntesis «)».'); i++; return v; }
    if (s[i] === '-') { i++; return -potencia(); }
    if (s[i] === '+') { i++; return potencia(); }
    const mn = /^(\d+(\.\d+)?|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i)); if (mn) { i += mn[0].length; return Number(mn[0]); }
    const mi = /^[A-Za-z_][A-Za-z_0-9]*/.exec(s.slice(i));
    if (mi) {
      const n = mi[0]; i += n.length; esp();
      if (s[i] === '(') { const f = FUNCS[n.toLowerCase()]; if (!f) err(`Función desconocida: ${n}.`); i++; const v = suma(); esp(); if (s[i] !== ')') err('Falta un paréntesis «)».'); i++; return f(v); }
      if (n in vars) return Number(vars[n]);
      if (n.toLowerCase() in CONST) return CONST[n.toLowerCase()];
      err(`Variable desconocida: ${n}.`);
    }
    err(i >= s.length ? 'La fórmula está incompleta.' : `No entiendo «${s[i]}».`);
  }
  function potencia() { const b = primario(); esp(); if (s[i] === '^') { i++; return Math.pow(b, potencia()); } return b; }
  function producto() { let v = potencia(); for (;;) { esp(); if (s[i] === '*') { i++; v *= potencia(); } else if (s[i] === '/') { i++; v /= potencia(); } else return v; } }
  function suma() { let v = producto(); for (;;) { esp(); if (s[i] === '+') { i++; v += producto(); } else if (s[i] === '-') { i++; v -= producto(); } else return v; } }
  const v = suma(); esp(); if (i < s.length) err(`Sobra algo al final: «${s.slice(i)}».`);
  return v;
}

// «R = 10..100 paso 10» (una por línea) ↔ {R: {min, max, paso}}
export function leeVariables(txt) {
  const V = {}; const errores = [];
  for (const l of String(txt || '').split('\n').map((x) => x.trim()).filter(Boolean)) {
    const m = /^([A-Za-z_][A-Za-z_0-9]{0,11})\s*=\s*(-?[\d.,]+)\s*\.\.\s*(-?[\d.,]+)(?:\s*(?:paso|step)\s*([\d.,]+))?$/i.exec(l);
    if (!m) { errores.push(`No entiendo «${l}». Escribe, por ejemplo: R = 10..100 paso 10`); continue; }
    const n = (x) => Number(String(x).replace(',', '.'));
    const min = n(m[2]), max = n(m[3]), paso = m[4] ? n(m[4]) : 1;
    if (!(max >= min) || !(paso > 0)) { errores.push(`«${l}»: el máximo tiene que ser mayor que el mínimo y el paso, positivo.`); continue; }
    V[m[1]] = { min, max, paso };
  }
  return { V, errores };
}
export const textoVariables = (V) => Object.entries(V || {}).map(([k, v]) => `${k} = ${v.min}..${v.max}${v.paso !== 1 ? ' paso ' + v.paso : ''}`).join('\n');

// Valores de un alumno: siempre los mismos para (semilla del examen y del alumno, pregunta).
export function valoresAlumno(variables, s, qid) {
  let x = (semilla(String(s) + '|' + qid) >>> 0) || 1;
  const rnd = () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
  const out = {};
  for (const k of Object.keys(variables || {}).sort()) {
    const { min, max, paso } = variables[k]; const n = Math.floor((max - min) / paso + 1e-9) + 1;
    const dec = (String(paso).split('.')[1] || '').length;
    out[k] = Number((min + Math.floor(rnd() * n) * paso).toFixed(dec));
  }
  return out;
}
export const sustituir = (txt, vals) => String(txt || '').replace(/\{([A-Za-z_][A-Za-z_0-9]*)\}/g, (m, k) => (k in vals ? String(vals[k]).replace('.', ',') : m));
