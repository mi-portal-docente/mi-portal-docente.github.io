// Una clase = un código (PIP-11). Lógica pura (sin Firebase ni DOM) para:
//  · añadir una asignatura a una clase y llevar a esa clase los elementos ya creados de la asignatura;
//  · «Unir grupos»: cuando ya existe un grupo duplicado (mismos alumnos, otro código), la clase principal pasa a ver
//    todo lo del duplicado. Migración COMPATIBLE: solo se AÑADE el id de la clase principal a grupos/visible
//    (y a visibleAl en las recuperaciones). No se borra ni se reescribe nada de los alumnos (entregas, trabajos,
//    notas, PIN, versiones, registros): eso sigue en el grupo duplicado, que se queda tal cual pero cerrado.
//  · «Separar» (deshacer): quita la clase principal solo de los elementos que también son del duplicado.
// La marca de la unión va en grupos/{duplicado}.apartados como «union:<idPrincipal>:<asig1>.<asig2>» (las reglas
// ya permiten esa lista; no hace falta ninguna regla nueva).
export const PREFIJO_UNION = 'union:';
export const esTokenUnion = (x) => typeof x === 'string' && x.startsWith(PREFIJO_UNION);
export function leerUnion(apartados) {
  const t = (Array.isArray(apartados) ? apartados : []).find(esTokenUnion); if (!t) return null;
  const [, principal = '', asigs = ''] = t.split(':');
  return principal ? { principal, asigs: asigs ? asigs.split('.').filter(Boolean) : [] } : null;
}
export const tokenUnion = (principal, asigs) => `${PREFIJO_UNION}${principal}:${(asigs || []).join('.')}`;
export const conUnion = (apartados, token) => [...(Array.isArray(apartados) ? apartados : []).filter((x) => !esTokenUnion(x)), ...(token ? [token] : [])];

const L = (v) => (Array.isArray(v) ? v : []);
const nAl = (s) => { const i = String(s).lastIndexOf('_'); return i < 0 ? null : String(s).slice(i + 1); };
const grupoAl = (s) => { const i = String(s).lastIndexOf('_'); return i < 0 ? '' : String(s).slice(0, i); };

// Elemento (items/{id}) al que se añade el grupo «gid». Devuelve los campos a cambiar o null si ya lo tiene.
// Las reglas exigen: publicado → visible == grupos; borrador → visible = []; recuperación → visible = [] y visibleAl.
export function itemConGrupo(it, gid, { desde = null } = {}) {
  const grupos = L(it.grupos); const rec = it.tipo === 'recuperacion';
  const cambios = {};
  if (!grupos.includes(gid)) cambios.grupos = [...grupos, gid];
  const g2 = cambios.grupos || grupos;
  if (!rec) { const vis = it.publicado ? g2 : []; if (JSON.stringify(vis) !== JSON.stringify(L(it.visible))) cambios.visible = vis; }
  else if (desde && it.publicado) {
    // recuperación: los mismos nº de lista del duplicado, también con el id de la clase principal
    const va = L(it.visibleAl); const extra = va.filter((s) => grupoAl(s) === desde).map((s) => `${gid}_${nAl(s)}`).filter((s) => !va.includes(s));
    if (extra.length) cambios.visibleAl = [...va, ...extra];
  }
  if (cambios.grupos && cambios.grupos.length > 40) return { error: 'demasiados grupos' };
  return Object.keys(cambios).length ? cambios : null;
}
// Lo contrario, solo para «Separar»: quita «gid» (y sus visibleAl copiados del duplicado).
export function itemSinGrupo(it, gid, { desde = null } = {}) {
  const grupos = L(it.grupos); if (!grupos.includes(gid)) return null;
  const g2 = grupos.filter((x) => x !== gid); const cambios = { grupos: g2 };
  if (it.tipo !== 'recuperacion') cambios.visible = it.publicado ? g2 : [];
  else if (desde) { const va = L(it.visibleAl); const nDup = new Set(va.filter((s) => grupoAl(s) === desde).map(nAl)); const va2 = va.filter((s) => !(grupoAl(s) === gid && nDup.has(nAl(s)))); if (va2.length !== va.length) { cambios.visibleAl = va2; if (!va2.length && it.publicado) return { grupos: g2 }; } }
  return cambios;
}
// Anuncios del tablón: visible == grupos (publicado) o visible vacío (programado).
export function anuncioConGrupo(a, gid) {
  const grupos = L(a.grupos); if (grupos.includes(gid)) return null;
  const g2 = [...grupos, gid]; return { grupos: g2, visible: L(a.visible).length ? g2 : [] };
}
export function anuncioSinGrupo(a, gid) {
  const grupos = L(a.grupos); if (!grupos.includes(gid)) return null;
  const g2 = grupos.filter((x) => x !== gid); return { grupos: g2, visible: L(a.visible).length ? g2 : [] };
}
// ¿Es este elemento de la asignatura y del curso de la clase? (como gruposDe del aula)
export const encajaClase = (it, g, asig) => it.asig === asig && !it.papelera && (!g.curso || !it.curso || it.curso === g.curso);

// Elementos de una asignatura que la clase todavía no tiene (al añadir la asignatura a la clase).
export function planAsignatura(g, asig, items) {
  const out = [];
  for (const it of items) { if (!encajaClase(it, g, asig)) continue; const c = itemConGrupo(it, g.id); if (c && !c.error) out.push({ id: it.id, titulo: it.titulo, publicado: !!it.publicado, cambios: c }); }
  return out;
}

// Plan de «Unir grupos». principal y duplicado: { id, nombre, asignaturas, codigo, activo, apartados, curso }.
// items / anuncios: [{ id, … }]; despachos: Map id → datos (centralita de cada elemento y grupo).
export function planUnion({ principal, duplicado, items = [], anuncios = [], despachos = new Map(), alumnosDup = {} }) {
  if (!principal || !duplicado) return { error: 'Elige las dos clases.' };
  if (principal.id === duplicado.id) return { error: 'Elige dos clases distintas.' };
  if (leerUnion(principal.apartados)) return { error: `«${principal.nombre}» ya está unida a otra clase: elige la clase principal.` };
  const ya = leerUnion(duplicado.apartados); if (ya) return { error: `«${duplicado.nombre}» ya está unida. Si quieres, sepárala antes.` };
  const asigNuevas = L(duplicado.asignaturas).filter((a) => !L(principal.asignaturas).includes(a));
  if (L(principal.asignaturas).length + asigNuevas.length > 20) return { error: 'Demasiadas asignaturas en una clase.' };
  const its = []; const avisos = [];
  for (const it of items) {
    const del = L(it.grupos).includes(duplicado.id) || L(it.visible).includes(duplicado.id) || L(it.visibleAl).some((s) => grupoAl(s) === duplicado.id);
    if (!del) continue;
    const c = itemConGrupo(it, principal.id, { desde: duplicado.id });
    if (c?.error) { avisos.push(`«${it.titulo}» ya tiene 40 grupos: no se cambia.`); continue; }
    if (c) its.push({ id: it.id, titulo: it.titulo, asig: it.asig, publicado: !!it.publicado, cambios: c });
  }
  const ans = [];
  for (const a of anuncios) { if (!L(a.grupos).includes(duplicado.id)) continue; const c = anuncioConGrupo(a, principal.id); if (c) ans.push({ id: a.id, cambios: c }); }
  const desp = [];
  for (const [id, d] of despachos) {
    if (!id.endsWith('_' + duplicado.id)) continue; const item = id.slice(0, id.length - duplicado.id.length - 1); const dest = `${item}_${principal.id}`;
    if (despachos.has(dest)) continue; desp.push({ desde: id, a: dest, datos: { item, grupo: principal.id, asign: d.asign || {}, llamadas: L(d.llamadas) } });
  }
  return {
    principal, duplicado, asigNuevas, asignaturas: [...L(principal.asignaturas), ...asigNuevas], items: its, anuncios: ans, despachos: desp, avisos,
    token: tokenUnion(principal.id, asigNuevas), alumnosDup,
  };
}
// Plan de «Separar» (deshacer la unión), a partir de la marca del duplicado.
export function planSeparar({ duplicado, principal, items = [], anuncios = [] }) {
  const u = leerUnion(duplicado?.apartados); if (!u || !principal || u.principal !== principal.id) return { error: 'Esta clase no está unida.' };
  const its = []; const ans = [];
  for (const it of items) { if (!L(it.grupos).includes(duplicado.id)) continue; const c = itemSinGrupo(it, principal.id, { desde: duplicado.id }); if (c) its.push({ id: it.id, titulo: it.titulo, cambios: c }); }
  for (const a of anuncios) { if (!L(a.grupos).includes(duplicado.id)) continue; const c = anuncioSinGrupo(a, principal.id); if (c) ans.push({ id: a.id, cambios: c }); }
  return { duplicado, principal, asigQuitar: u.asigs, asignaturas: L(principal.asignaturas).filter((a) => !u.asigs.includes(a)), items: its, anuncios: ans };
}
