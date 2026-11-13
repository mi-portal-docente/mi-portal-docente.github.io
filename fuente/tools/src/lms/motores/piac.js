// Motor «Proyecto en equipo (PIAC)»: tablero del equipo (pendiente / en curso / hecho, con responsable por
// nº de lista y fecha), diario del equipo y auto/coevaluación con rúbrica ponderada. Los equipos se guardan
// en el propio elemento; para las reglas se derivan los mapas miembros {equipo: [nº]} y grupoDe {equipo: grupo}.
import { registrarMotor } from '../elemento.js';
import { texto, lista, numero, esTexto } from './comun.js';
import { RUBRICA_PLANTILLA } from '../rubrica.js';

const ID = /^[a-z0-9_-]{1,20}$/i;
export function validarPiac(c, err) {
  const o = { instrucciones: texto(c.instrucciones, 'instrucciones', err, { max: 3000, nombre: 'instrucciones' }) };
  const crit = c.criterios == null ? RUBRICA_PLANTILLA : lista(c.criterios, 'criterios', err, { min: 1, max: 8, nombre: 'criterios' });
  const ids = new Set();
  o.criterios = crit.map((x, i) => {
    const r = `criterios[${i}]`; const id = esTexto(x?.id) && ID.test(x.id) ? x.id : `c${i + 1}`;
    if (ids.has(id)) err(r + '.id', `El id «${id}» está repetido.`); ids.add(id);
    const y = { id, c: texto(x?.c, r + '.c', err, { max: 200, obligatorio: true, nombre: 'c' }), peso: numero(x?.peso, r + '.peso', err, { min: 1, max: 100, obligatorio: true, nombre: 'peso' }) ?? 1 };
    if (x?.autoria) y.autoria = true; return y;
  });
  if (c.criterios != null && !o.criterios.some((x) => x.autoria)) err('criterios', 'Marca un criterio de autoría con "autoria": true (el alumno lo explica y defiende con sus palabras).');
  const eqIds = new Set(); const vistos = new Map();
  o.equipos = lista(c.equipos, 'equipos', err, { max: 30, nombre: 'equipos' }).map((e, i) => {
    const r = `equipos[${i}]`; const id = esTexto(e?.id) && ID.test(e.id) ? e.id : `e${i + 1}`;
    if (eqIds.has(id)) err(r + '.id', `El equipo «${id}» está repetido.`); eqIds.add(id);
    const grupo = e?.grupo == null || e.grupo === '' ? null : esTexto(e.grupo) && /^[\w-]{1,40}$/.test(e.grupo) ? e.grupo : (err(r + '.grupo', '«grupo» no es válido.'), null);
    const miembros = lista(e?.miembros, r + '.miembros', err, { min: 1, max: 8, nombre: 'miembros' }).map((n, j) => numero(n, `${r}.miembros[${j}]`, err, { min: 1, max: 99, entero: true, obligatorio: true, nombre: 'nº de lista' })).filter((n) => n != null);
    for (const n of miembros) { const k = `${grupo}|${n}`; if (vistos.has(k)) err(r + '.miembros', `El nº ${n} ya está en el equipo «${vistos.get(k)}».`); else vistos.set(k, id); }
    return { id, nombre: texto(e?.nombre, r + '.nombre', err, { max: 60, nombre: 'nombre' }) || `Equipo ${i + 1}`, grupo, miembros };
  });
  return derivar(o);
}
// Mapas para las reglas de Firestore (solo los equipos con grupo)
export function derivar(o) {
  o.miembros = {}; o.grupoDe = {};
  for (const e of o.equipos) if (e.grupo) { o.miembros[e.id] = e.miembros; o.grupoDe[e.id] = e.grupo; }
  return o;
}
// Equipos sin grupo: si el elemento es para un solo grupo, se les asigna ese grupo
export function completarPiac(c, grupos) {
  if (!c || !Array.isArray(c.equipos)) return c;
  if (grupos?.length === 1) c.equipos = c.equipos.map((e) => (e.grupo ? e : { ...e, grupo: grupos[0] }));
  return derivar(c);
}
// Texto «Equipo 1: 1, 4, 7» ↔ equipos de un grupo
export function leerEquiposTexto(txt, grupo, err = () => {}) {
  return String(txt || '').split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 30).map((l, i) => {
    const k = l.lastIndexOf(':'); const nombre = (k >= 0 ? l.slice(0, k) : `Equipo ${i + 1}`).trim().slice(0, 60);
    const miembros = [...new Set((k >= 0 ? l.slice(k + 1) : l).split(/[,;\s]+/).filter(Boolean).map(Number))].filter((n) => Number.isInteger(n) && n >= 1 && n <= 99).slice(0, 8);
    if (!miembros.length) err(`Línea ${i + 1}: faltan los nº de lista (p. ej. «Equipo 1: 1, 4, 7»).`);
    return { nombre: nombre || `Equipo ${i + 1}`, grupo, miembros };
  }).filter((e) => e.miembros.length);
}
export const equiposTexto = (equipos, grupo) => equipos.filter((e) => e.grupo === grupo).map((e) => `${e.nombre}: ${e.miembros.join(', ')}`).join('\n');
export const ESTADOS_PIAC = [['pendiente', 'Pendiente'], ['encurso', 'En curso'], ['hecho', 'Hecho']];

registrarMotor('piac', {
  nombre: 'Proyecto en equipo (PIAC)', validar: validarPiac, entregable: false,
  resumen: (c) => `${c.equipos.length} equipo${c.equipos.length === 1 ? '' : 's'} · rúbrica de ${c.criterios.length} criterios (${c.criterios.filter((x) => x.autoria).length} de autoría)`,
  ejemplo: {
    instrucciones: 'Organizad el proyecto en el tablero: cada tarea con su responsable y su fecha. Al acabar cada sesión, escribid una entrada en el diario. Al final, autoevaluaos y evaluad a vuestros compañeros con la rúbrica.',
    equipos: [{ id: 'e1', nombre: 'Equipo 1', miembros: [1, 2, 3] }, { id: 'e2', nombre: 'Equipo 2', miembros: [4, 5, 6] }],
  },
});
