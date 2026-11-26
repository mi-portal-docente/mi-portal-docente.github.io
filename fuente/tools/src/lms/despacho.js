// «Despacho virtual» (PIAC SA1 T4 «Jefe por un día»): lógica pura del tablero de planificación.
// Sin DOM ni Firebase: la usan la web (src/portal/despacho-ui.js) y las pruebas (despacho_test.mjs).
//  · validarDespacho(contenido, err): comprueba y normaliza el JSON que carga el profesor (empresas, trabajos, llamadas).
//  · avisos(cont, emp, tablero): avisos en vivo (rojo, naranja, amarillo). Solo informan: no bloquean nada.
//  · empresaPara(...): empresa de cada alumno (la que asigna el profesor o una «al azar» estable).
//  · leerDoc / docTexto: lo que se guarda en trabajos/{id}.doc (JSON en texto, como la hoja de cálculo).
// Sin nombres de alumnos: el alumno es su nº de lista dentro del grupo.

export const DIAS_DEF = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
export const PASO = 30; // minutos por fila del tablero
export const VERSION_DOC = 'dv1';
const sinTildes = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const esTexto = (x) => typeof x === 'string';
const corta = (s, n) => String(s ?? '').trim().slice(0, n);

// «8:00», «08.30», «8h», 8 → minutos desde las 0:00 (o NaN)
export function aMin(v) {
  // Números: hasta 24 son horas (8 → 8:00); más de 24 son minutos ya calculados (480 → 8:00), para que validar dos veces dé lo mismo
  if (typeof v === 'number' && Number.isFinite(v)) return v <= 24 ? Math.round(v * 60) : Math.round(v);
  const m = /^\s*(\d{1,2})(?:[:.h](\d{2}))?\s*h?\s*$/i.exec(String(v ?? ''));
  if (!m) return NaN; const h = +m[1], mi = +(m[2] || 0);
  return h <= 24 && mi < 60 ? h * 60 + mi : NaN;
}
export const hhmm = (min) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;
// «8:00-22:00» | { inicio, fin } | [ini, fin] → { ini, fin } en minutos (o null)
export function aRango(v) {
  if (v == null || v === '') return null;
  let a, b;
  if (Array.isArray(v)) [a, b] = v;
  else if (typeof v === 'object') { a = v.inicio ?? v.ini ?? v.desde; b = v.fin ?? v.hasta; }
  else {
    const s = sinTildes(v);
    if (s === 'manana' || s === 'mananas') return { ini: 8 * 60, fin: 14 * 60 };
    if (s === 'tarde' || s === 'tardes') return { ini: 14 * 60, fin: 22 * 60 };
    if (['cualquiera', 'flexible', 'todo el dia', 'libre', '-'].includes(s)) return null;
    [a, b] = String(v).split(/\s*[-–a]\s*/);
  }
  const ini = aMin(a), fin = aMin(b);
  return Number.isFinite(ini) && Number.isFinite(fin) && ini < fin ? { ini, fin } : undefined;
}
export const rangoTexto = (r) => (r ? `${hhmm(r.ini)}-${hhmm(r.fin)}` : 'Sin ventana');
export const slots = (horas) => Math.max(1, Math.ceil((Number(horas) || 0.5) * 60 / PASO));
export const duracionMin = (horas) => slots(horas) * PASO;
const TURNOS = { manana: 'Mañana', tarde: 'Tarde', flexible: 'Flexible' };
export const normTurno = (t) => TURNOS[sinTildes(t)] || null;
// El perfil de un trabajo se cumple si alguna persona tiene ese rol (sin mayúsculas ni tildes; vale «Electricista» para «electricista oficial»).
export function cumplePerfil(rol, perfil) {
  const a = sinTildes(rol), b = sinTildes(perfil); if (!b) return true; if (!a) return false;
  return a === b || a.includes(b) || b.includes(a);
}

// ---------- Validación del JSON (lo carga Claude / el profesor) ----------
export function validarDespacho(c, err = () => {}) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) { err('', 'El contenido tiene que ser un objeto { "empresas": [ … ] }.'); return null; }
  const o = {};
  // Días
  const dias = c.dias == null ? DIAS_DEF : c.dias;
  if (!Array.isArray(dias) || dias.length < 1 || dias.length > 7 || dias.some((d) => !esTexto(d) || !d.trim())) { err('dias', '«dias» tiene que ser una lista de 1 a 7 nombres: ["Lunes", "Martes", …].'); return null; }
  o.dias = dias.map((d) => corta(d, 20));
  const idxDia = (d) => { if (Number.isInteger(d) && d >= 0 && d < o.dias.length) return d; const k = o.dias.findIndex((x) => sinTildes(x) === sinTildes(d)); return k; };
  // Horario
  const hor = c.horario == null ? { ini: 480, fin: 1320 } : aRango(c.horario);
  if (!hor) { err('horario', '«horario» tiene que ser como "8:00-22:00".'); return null; }
  if ((hor.ini % PASO) || (hor.fin % PASO)) err('horario', `El horario tiene que empezar y acabar en hora o media hora (filas de ${PASO} min).`);
  o.horario = { ini: hor.ini, fin: hor.fin };
  const vm = c.viaje_min == null ? 30 : Number(c.viaje_min);
  if (!Number.isFinite(vm) || vm < 0 || vm > 240) err('viaje_min', '«viaje_min» tiene que ser un número de minutos (0-240).');
  o.viaje_min = Number.isFinite(vm) ? Math.max(0, Math.min(240, Math.round(vm))) : 30;
  // Prioridad: texto o lista de textos (criterio para decidir qué va primero)
  if (c.prioridad != null) {
    if (esTexto(c.prioridad)) o.prioridad = [corta(c.prioridad, 300)];
    else if (Array.isArray(c.prioridad) && c.prioridad.every((x) => esTexto(x) || typeof x === 'number')) o.prioridad = c.prioridad.slice(0, 12).map((x) => corta(x, 300));
    else err('prioridad', '«prioridad» tiene que ser un texto o una lista de textos.');
  }
  if (c.asignacion != null && !['azar', 'profesor'].includes(c.asignacion)) err('asignacion', '«asignacion» tiene que ser "azar" o "profesor".');
  o.asignacion = c.asignacion === 'profesor' ? 'profesor' : 'azar';
  // Empresas
  const E = c.empresas;
  if (!Array.isArray(E) || !E.length) { err('empresas', 'Falta «empresas»: una lista con al menos una empresa.'); return null; }
  if (E.length > 12) err('empresas', 'Máximo 12 empresas.');
  const idsE = new Set();
  o.empresas = E.slice(0, 12).map((e, i) => {
    const r = `empresas[${i}]`;
    if (!e || typeof e !== 'object') { err(r, `La empresa ${i + 1} tiene que ser un objeto.`); return null; }
    const id = corta(e.id ?? `e${i + 1}`, 30).replace(/[^\w-]/g, '_');
    if (idsE.has(id)) err(r + '.id', `El id de empresa «${id}» está repetido.`); idsE.add(id);
    if (!esTexto(e.nombre) || !e.nombre.trim()) err(r + '.nombre', `Empresa ${i + 1}: falta «nombre».`);
    // Personal
    const P = Array.isArray(e.personal) ? e.personal : null;
    if (!P || !P.length) err(r + '.personal', `Empresa ${i + 1}: «personal» tiene que ser una lista [ { "codigo", "rol", "turno" } ].`);
    const cods = new Set();
    const personal = (P || []).slice(0, 30).map((p, j) => {
      const rr = `${r}.personal[${j}]`;
      if (!p || typeof p !== 'object') { err(rr, `Persona ${j + 1}: tiene que ser un objeto.`); return null; }
      const codigo = corta(p.codigo, 20); if (!codigo) { err(rr + '.codigo', `Empresa ${i + 1}, persona ${j + 1}: falta «codigo».`); return null; }
      if (cods.has(codigo)) err(rr + '.codigo', `Empresa ${i + 1}: el código «${codigo}» está repetido.`); cods.add(codigo);
      const turno = p.turno == null || p.turno === '' ? 'Flexible' : normTurno(p.turno);
      if (!turno) err(rr + '.turno', `Empresa ${i + 1}, ${codigo}: «turno» tiene que ser Mañana, Tarde o Flexible.`);
      return { codigo, rol: corta(p.rol, 60), turno: turno || 'Flexible' };
    }).filter(Boolean);
    // Recursos únicos
    const Rr = e.recursos == null ? [] : e.recursos;
    if (!Array.isArray(Rr)) err(r + '.recursos', `Empresa ${i + 1}: «recursos» tiene que ser una lista de textos.`);
    const recursos = [...new Set((Array.isArray(Rr) ? Rr : []).slice(0, 30).map((x) => corta(typeof x === 'object' && x ? x.nombre ?? x.id : x, 60)).filter(Boolean))];
    // Trabajos
    const T = Array.isArray(e.trabajos) ? e.trabajos : null;
    if (!T || !T.length) err(r + '.trabajos', `Empresa ${i + 1}: «trabajos» tiene que ser una lista.`);
    if (T && T.length > 40) err(r + '.trabajos', `Empresa ${i + 1}: máximo 40 trabajos.`);
    const idsT = new Set();
    const trabajos = (T || []).slice(0, 40).map((t, j) => {
      const rr = `${r}.trabajos[${j}]`; const q = `Empresa ${i + 1}, trabajo ${j + 1}`;
      if (!t || typeof t !== 'object') { err(rr, `${q}: tiene que ser un objeto.`); return null; }
      const tid = corta(t.id ?? `t${j + 1}`, 20).replace(/[^\w-]/g, '_');
      if (idsT.has(tid)) err(rr + '.id', `${q}: el id «${tid}» está repetido.`); idsT.add(tid);
      const horas = Number(t.horas);
      if (!Number.isFinite(horas) || horas <= 0 || horas > 14) err(rr + '.horas', `${q}: «horas» tiene que ser un número (por ejemplo 1.5).`);
      const personas = t.personas == null ? 1 : Number(t.personas);
      if (!Number.isInteger(personas) || personas < 1 || personas > 10) err(rr + '.personas', `${q}: «personas» tiene que ser un número entero de 1 a 10.`);
      const ventana = aRango(t.ventana);
      if (ventana === undefined) err(rr + '.ventana', `${q}: «ventana» tiene que ser como "9:00-13:00", "Mañana" o "Tarde".`);
      let dia = null;
      if (t.dia != null && t.dia !== '') { dia = idxDia(t.dia); if (dia < 0) { err(rr + '.dia', `${q}: el día «${t.dia}» no está en «dias».`); dia = null; } }
      const recurso = t.recurso == null || t.recurso === '' || sinTildes(t.recurso) === 'ninguno' ? null : corta(t.recurso, 60);
      if (recurso && !recursos.includes(recurso)) err(rr + '.recurso', `${q}: el recurso «${recurso}» no está en los «recursos» de la empresa.`);
      const perfil = corta(t.perfil, 60);
      if (perfil && personal.length && !personal.some((p) => cumplePerfil(p.rol, perfil))) err(rr + '.perfil', `${q}: nadie del personal tiene el perfil «${perfil}».`);
      return { id: tid, cliente: corta(t.cliente, 80), trabajo: corta(t.trabajo, 120), perfil, personas: Number.isInteger(personas) ? personas : 1, horas: Number.isFinite(horas) && horas > 0 ? horas : 1, ventana: ventana || null, dia, recurso };
    }).filter(Boolean);
    // Llamadas de la centralita
    const L = e.llamadas == null ? [] : e.llamadas;
    if (!Array.isArray(L)) err(r + '.llamadas', `Empresa ${i + 1}: «llamadas» tiene que ser una lista.`);
    const llamadas = (Array.isArray(L) ? L : []).slice(0, 10).map((l, j) => {
      if (!l || typeof l !== 'object' || !esTexto(l.texto) || !l.texto.trim()) { err(`${r}.llamadas[${j}]`, `Empresa ${i + 1}, llamada ${j + 1}: falta «texto».`); return null; }
      return { cuando: corta(l.cuando, 60), texto: corta(l.texto, 600), tipo: corta(l.tipo, 40) };
    }).filter(Boolean);
    return { id, nombre: corta(e.nombre, 80), personal, recursos, trabajos, llamadas };
  }).filter(Boolean);
  return o;
}

// ---------- Empresa de cada alumno ----------
// Hash estable (FNV-1a) para el reparto «al azar»: el mismo alumno recibe siempre la misma empresa, y el
// profesor ve la misma que verá el alumno sin que nadie tenga que guardar nada.
export function hash(s) { let h = 2166136261; for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function empresaAzar(cont, itemId, numero) { const n = cont.empresas.length; return cont.empresas[(hash(`${itemId}|${numero}`) + Number(numero)) % n].id; }
// Prioridad: 1) la que puso el profesor; 2) la que el alumno ya empezó (para no perder su tablero); 3) al azar.
export function empresaPara(cont, { itemId, numero, asign = {}, docEmp = null, tableroVacio = true }) {
  const ok = (id) => cont.empresas.some((e) => e.id === id);
  const prof = asign?.[String(numero)];
  if (prof && ok(prof) && (tableroVacio || !docEmp || docEmp === prof)) return prof;
  if (docEmp && ok(docEmp)) return docEmp;
  if (prof && ok(prof)) return prof;
  return empresaAzar(cont, itemId, numero);
}
// Reparto equilibrado al azar para todo el grupo (botón del profesor)
export function repartir(cont, numeros, rnd = Math.random) {
  const ids = cont.empresas.map((e) => e.id); const bolsa = [];
  while (bolsa.length < numeros.length) bolsa.push(...ids);
  for (let i = bolsa.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [bolsa[i], bolsa[j]] = [bolsa[j], bolsa[i]]; }
  const o = {}; numeros.forEach((n, i) => { o[String(n)] = bolsa[i]; }); return o;
}

// ---------- Tablero ----------
// tablero: { [trabajoId]: { d: índice de día, s: minuto de inicio, p: [códigos], r: [recursos] } }
export function bloques(emp, tablero) {
  const L = [];
  for (const t of emp.trabajos) {
    const b = tablero[t.id]; if (!b || !Number.isInteger(b.d)) continue;
    L.push({ id: t.id, t, d: b.d, ini: b.s, fin: b.s + duracionMin(t.horas), p: b.p || [], r: b.r || [] });
  }
  return L;
}
const solapan = (a, b) => a.d === b.d && a.ini < b.fin && b.ini < a.fin;
export const NIVELES = { rojo: 3, naranja: 2, amarillo: 1 };
// Avisos en vivo. Cada aviso: { nivel, tipo, ids: [trabajos], texto }
export function avisos(cont, emp, tablero) {
  const A = []; const B = bloques(emp, tablero); const per = new Map(emp.personal.map((p) => [p.codigo, p]));
  const dia = (d) => cont.dias[d] || `Día ${d + 1}`;
  const nom = (b) => `${b.t.id} ${b.t.cliente || b.t.trabajo}`.trim();
  for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
    const a = B[i], b = B[j];
    if (solapan(a, b)) {
      for (const c of a.p) if (b.p.includes(c)) A.push({ nivel: 'rojo', tipo: 'solape-persona', ids: [a.id, b.id], texto: `${c} está en dos trabajos a la vez (${nom(a)} y ${nom(b)}, ${dia(a.d)}).` });
      for (const r of a.r) if (b.r.includes(r)) A.push({ nivel: 'rojo', tipo: 'solape-recurso', ids: [a.id, b.id], texto: `«${r}» está en dos trabajos a la vez (${nom(a)} y ${nom(b)}, ${dia(a.d)}).` });
    } else if (a.d === b.d && cont.viaje_min > 0) {
      const comun = a.p.filter((c) => b.p.includes(c));
      const hueco = a.ini >= b.fin ? a.ini - b.fin : b.ini - a.fin;
      if (comun.length && hueco < cont.viaje_min) A.push({ nivel: 'naranja', tipo: 'viaje', ids: [a.id, b.id], texto: `${comun.join(', ')}: no hay ${cont.viaje_min} min de viaje entre ${nom(a)} y ${nom(b)} (${dia(a.d)}).` });
    }
  }
  for (const b of B) {
    const t = b.t;
    if (t.perfil && !b.p.some((c) => cumplePerfil(per.get(c)?.rol, t.perfil))) A.push({ nivel: 'rojo', tipo: 'perfil', ids: [b.id], texto: `${nom(b)}: falta una persona con el perfil «${t.perfil}».` });
    if (b.p.length !== t.personas) A.push({ nivel: 'naranja', tipo: 'personas', ids: [b.id], texto: `${nom(b)}: necesita ${t.personas} persona${t.personas === 1 ? '' : 's'} y tiene ${b.p.length}.` });
    if (t.recurso && !b.r.includes(t.recurso)) A.push({ nivel: 'naranja', tipo: 'recurso', ids: [b.id], texto: `${nom(b)}: falta el recurso «${t.recurso}».` });
    if (b.ini < cont.horario.ini || b.fin > cont.horario.fin) A.push({ nivel: 'naranja', tipo: 'horario', ids: [b.id], texto: `${nom(b)}: se sale del horario (${rangoTexto(cont.horario)}).` });
    else if (t.ventana && (b.ini < t.ventana.ini || b.fin > t.ventana.fin)) A.push({ nivel: 'naranja', tipo: 'ventana', ids: [b.id], texto: `${nom(b)}: fuera de su ventana (${rangoTexto(t.ventana)}). Justifícalo en una incidencia.` });
    for (const c of b.p) {
      const p = per.get(c); if (!p) continue;
      if (p.turno === 'Mañana' && b.fin > 14 * 60) A.push({ nivel: 'amarillo', tipo: 'turno', ids: [b.id], texto: `${c} es de mañana (hasta las 14:00) y ${nom(b)} acaba a las ${hhmm(b.fin)}.` });
      if (p.turno === 'Tarde' && b.ini < 14 * 60) A.push({ nivel: 'amarillo', tipo: 'turno', ids: [b.id], texto: `${c} es de tarde (desde las 14:00) y ${nom(b)} empieza a las ${hhmm(b.ini)}.` });
    }
  }
  return A.sort((x, y) => NIVELES[y.nivel] - NIVELES[x.nivel]);
}
// Nivel más grave de cada trabajo (para pintar el borde del bloque)
export function nivelPorTrabajo(A) { const m = {}; for (const a of A) for (const id of a.ids) if (!m[id] || NIVELES[a.nivel] > NIVELES[m[id]]) m[id] = a.nivel; return m; }
export const colocados = (emp, tablero) => emp.trabajos.filter((t) => tablero[t.id] && Number.isInteger(tablero[t.id].d)).length;
export function contador(cont, emp, tablero) { const A = avisos(cont, emp, tablero); return { colocados: colocados(emp, tablero), total: emp.trabajos.length, avisos: A.length, A }; }

// Movimientos (devuelven un tablero NUEVO; no tocan el anterior → «Deshacer» trivial)
const copia = (tb) => JSON.parse(JSON.stringify(tb || {}));
export function limitarInicio(cont, t, s) {
  const dur = duracionMin(t.horas); const max = Math.max(cont.horario.ini, cont.horario.fin - dur);
  const r = Math.round((Number(s) - cont.horario.ini) / PASO) * PASO + cont.horario.ini;
  return Math.max(cont.horario.ini, Math.min(max, r));
}
export function colocar(cont, emp, tablero, id, d, s) {
  const t = emp.trabajos.find((x) => x.id === id); if (!t || !Number.isInteger(d) || d < 0 || d >= cont.dias.length) return tablero;
  const o = copia(tablero); const prev = o[id] || { p: [], r: [] };
  o[id] = { d, s: limitarInicio(cont, t, s), p: prev.p || [], r: prev.r || [] }; return o;
}
export function quitarTrabajo(tablero, id) { const o = copia(tablero); delete o[id]; return o; }
export function asignar(emp, tablero, id, clase, valor) {
  const o = copia(tablero); const b = o[id]; if (!b) return tablero;
  if (clase === 'p') { if (!emp.personal.some((p) => p.codigo === valor) || b.p.includes(valor)) return tablero; b.p = [...b.p, valor].slice(0, 10); }
  else if (clase === 'r') { if (!emp.recursos.includes(valor) || b.r.includes(valor)) return tablero; b.r = [...b.r, valor].slice(0, 10); }
  else return tablero;
  return o;
}
export function desasignar(tablero, id, clase, valor) { const o = copia(tablero); const b = o[id]; if (!b) return tablero; b[clase] = (b[clase] || []).filter((x) => x !== valor); return o; }

// ---------- Documento que se guarda en trabajos/{id}.doc ----------
// { v:'dv1', emp, b: tablero, h: [[ms, acción, trabajo, detalle]], inc: [incidencias], at: [llamadas atendidas], reg: { seg, pest } }
const MAX_HIST = 400;
export function docVacio(emp) { return { v: VERSION_DOC, emp, b: {}, h: [], inc: [], at: [], reg: { seg: 0, pest: 0 } }; }
export function leerDoc(txt) {
  try { const o = typeof txt === 'string' ? JSON.parse(txt || 'null') : txt; if (o && o.v === VERSION_DOC && o.b && typeof o.b === 'object') return { ...docVacio(o.emp), ...o, reg: { seg: 0, pest: 0, ...(o.reg || {}) } }; } catch (e) { /* no es un despacho */ }
  return null;
}
export function anotar(D, accion, id = '', detalle = '', t = Date.now()) { D.h.push([t, accion, id, String(detalle).slice(0, 80)]); if (D.h.length > MAX_HIST) D.h.splice(0, D.h.length - MAX_HIST); }
export const docTexto = (D) => JSON.stringify(D);
export function resumenTexto(cont, emp, D) { const c = contador(cont, emp, D.b); return `Despacho virtual · ${emp.nombre} · Trabajos colocados ${c.colocados}/${c.total} · Avisos ${c.avisos} · Llamadas atendidas ${D.at.length} · Incidencias ${D.inc.length}`; }
// Incidencia válida: «qué he cambiado» y «por qué» con al menos una frase (3 palabras o más)
export const fraseOk = (s) => String(s || '').trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length >= 3;
export function incidenciaOk(x) { return fraseOk(x?.cambio) && fraseOk(x?.porque); }
// Llamadas que el alumno tiene pendientes de ver: las lanzadas para él (o para todo el grupo) y su empresa.
// lanzadas: [{ e: empresa ('' = la de cada alumno), k: nº de llamada (0…), n: nº de lista (0 = todos), t: ms }]
export const claveLlamada = (emp, k) => `${emp}:${k}`;
export function pendientes(lanzadas, { emp, numero, atendidas = [] }) {
  const vistas = new Set(atendidas.map((a) => a.c || a)); const o = []; const ya = new Set();
  for (const l of lanzadas || []) {
    if (l.n && Number(l.n) !== Number(numero)) continue;
    if (l.e && l.e !== emp) continue;
    const c = claveLlamada(emp, l.k); if (vistas.has(c) || ya.has(c)) continue; ya.add(c); o.push({ ...l, c });
  }
  return o;
}
