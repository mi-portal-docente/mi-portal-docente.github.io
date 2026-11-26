// Secciones de cada asignatura (v5): Avisos · Teoría · Ejercicios en clase · Tareas · Test · Exámenes ·
// Laboratorio, y «Gestión» para el profesor. Lógica pura (sin Firebase ni DOM): se usa en la web y en las pruebas.
//  · La sección de cada elemento se deduce AL LEER de su tipo (migración automática): no se reescribe ni se
//    borra nada en Firestore. Si el elemento trae «seccion» (nuevo campo), manda esa.
//  · La configuración (orden, nombre, ocultar) y la lista de asignaturas activadas se guardan en
//    config/secciones: { activas: ['eee', 'proy2'], asig: { eee: [{ id, nombre, orden, visible }] } }.
//    Sin ese documento (o con las reglas antiguas, que no dejan leerlo) se usan los valores por defecto.

export const SECCIONES = [
  { id: 'avisos', nombre: 'Avisos', icono: 'megaphone', orden: 0, carpeta: null },
  { id: 'teoria', nombre: 'Teoría', icono: 'book-open', orden: 1, carpeta: '1_Teoria' },
  { id: 'clase', nombre: 'Ejercicios en clase', icono: 'pencil', orden: 2, carpeta: '2_Ejercicios_clase' },
  { id: 'tareas', nombre: 'Tareas', icono: 'clipboard-list', orden: 3, carpeta: '3_Tareas' },
  { id: 'test', nombre: 'Test', icono: 'list-checks', orden: 4, carpeta: '4_Test' },
  { id: 'examenes', nombre: 'Exámenes', icono: 'clipboard-check', orden: 5, carpeta: '5_Examenes' },
  { id: 'laboratorio', nombre: 'Laboratorio', icono: 'flask-conical', orden: 6, carpeta: '6_Laboratorio' },
];
export const GESTION = { id: 'gestion', nombre: 'Gestión', icono: 'settings' };
export const IDS_SECCION = SECCIONES.map((s) => s.id);
// Secciones donde puede ir un elemento (los avisos son anuncios, no elementos).
export const IDS_ELEMENTO = IDS_SECCION.filter((s) => s !== 'avisos');
// Asignaturas con secciones activadas por defecto (EEE y Proyecto de 2.º CFGB). El profesor añade más
// desde «Gestión» (se guarda en config/secciones.activas) sin tocar el código.
export const ACTIVAS_DEFECTO = ['eee', 'proy2'];

// Tipo actual → sección (tabla del punto 2 del encargo).
export const TIPO_A_SECCION = {
  material: 'teoria', explicacion: 'teoria',
  actividad: 'clase', p5: 'clase', web: 'clase', info: 'clase', ciber: 'clase', bloques: 'clase', interactiva: 'clase', despacho: 'clase',
  tarea: 'tareas', pregunta: 'tareas', proyecto: 'tareas', piac: 'tareas', documento: 'tareas', hoja: 'tareas',
  cuestionario: 'test', examen: 'test',
  recuperacion: 'examenes',
  practica: 'laboratorio', averia: 'laboratorio',
};
const esPdf = (u) => /\.pdf($|\?)/i.test(String(u || '')) || /^#?archivo\//.test(String(u || ''));
// ¿Tiene un PDF? (campo nuevo «pdf» o un adjunto PDF de los de antes)
export const tienePdf = (it) => !!(it?.pdf?.archivo) || (it?.enlaces || []).some((e) => /\.pdf($|\?)/i.test(String(e?.u || '')) || /\.pdf$/i.test(String(e?.t || '')));

// Sección de un elemento (migración en lectura).
export function seccionDe(it) {
  if (!it) return 'tareas';
  if (IDS_ELEMENTO.includes(it.seccion)) return it.seccion;
  // «examen» es el cuestionario autocorregido (Test); con PDF o en modo examen sin elementos externos es
  // una prueba escrita (Exámenes).
  if (it.tipo === 'examen') return tienePdf(it) || it.sinExternos ? 'examenes' : 'test';
  return TIPO_A_SECCION[it.tipo] || 'tareas';
}
export { esPdf };

// ¿Tiene esta asignatura las secciones activadas?
export function seccionesActivas(conf, asig) {
  const L = Array.isArray(conf?.activas) ? conf.activas : ACTIVAS_DEFECTO;
  return L.includes(asig);
}
// Secciones de una asignatura, en su orden, con el nombre y la visibilidad del profesor.
//  [{ id, nombre, icono, orden, visible, carpeta }]
export function seccionesDe(conf, asig) {
  const propia = Array.isArray(conf?.asig?.[asig]) ? conf.asig[asig] : [];
  const por = new Map(propia.filter((s) => s && IDS_SECCION.includes(s.id)).map((s) => [s.id, s]));
  return SECCIONES.map((b) => {
    const p = por.get(b.id) || {};
    const nombre = typeof p.nombre === 'string' && p.nombre.trim() ? p.nombre.trim().slice(0, 40) : b.nombre;
    const orden = Number.isFinite(Number(p.orden)) && p.orden !== null && p.orden !== '' ? Number(p.orden) : b.orden;
    return { ...b, nombre, orden, visible: p.visible !== false };
  }).sort((a, b) => a.orden - b.orden || SECCIONES.findIndex((x) => x.id === a.id) - SECCIONES.findIndex((x) => x.id === b.id));
}
export const seccionesVisibles = (conf, asig) => seccionesDe(conf, asig).filter((s) => s.visible);

// Valida la lista «secciones» de una asignatura (importador / editor). Devuelve un texto de error o null.
export function validarSecciones(L) {
  if (!Array.isArray(L)) return '«secciones» tiene que ser una lista.';
  if (L.length > IDS_SECCION.length) return 'Hay más secciones de la cuenta.';
  const vistos = new Set();
  for (const s of L) {
    if (!s || typeof s !== 'object') return 'Hay una sección mal escrita.';
    if (!IDS_SECCION.includes(s.id)) return `Sección desconocida: «${s.id}». Usa ${IDS_SECCION.join(', ')}.`;
    if (vistos.has(s.id)) return `La sección «${s.id}» está repetida.`; vistos.add(s.id);
    if (s.nombre != null && (typeof s.nombre !== 'string' || s.nombre.length > 40)) return `El nombre de «${s.id}» es demasiado largo (40 letras).`;
    if (s.orden != null && !Number.isFinite(Number(s.orden))) return `El orden de «${s.id}» tiene que ser un número.`;
    if (s.visible != null && typeof s.visible !== 'boolean') return `«visible» de «${s.id}» tiene que ser true o false.`;
  }
  return null;
}
// Limpia una lista de secciones para guardarla.
export const limpiarSecciones = (L) => (L || []).filter((s) => s && IDS_SECCION.includes(s.id)).map((s) => ({ id: s.id, nombre: String(s.nombre ?? SECCIONES.find((b) => b.id === s.id).nombre).trim().slice(0, 40), orden: Number(s.orden) || 0, visible: s.visible !== false }));

// v5 · importador: deja solo los campos que trae el archivo (para no pisar con valores por defecto lo que ya había).
export const parcialSecciones = (L) => (L || []).filter((s) => s && IDS_SECCION.includes(s.id)).map((s) => ({ id: s.id,
  ...(s.nombre != null && String(s.nombre).trim() ? { nombre: String(s.nombre).trim().slice(0, 40) } : {}),
  ...(s.orden != null && s.orden !== '' && Number.isFinite(Number(s.orden)) ? { orden: Number(s.orden) } : {}),
  ...(s.visible != null ? { visible: s.visible !== false } : {}) }));
// Junta las secciones guardadas de la asignatura con las del archivo: lo que no trae el archivo se queda como estaba
// (o con su valor por defecto). Devuelve la lista limpia para guardar en config/secciones.asig[asig].
export function fusionarSecciones(previas, nuevas) {
  const pre = new Map((Array.isArray(previas) ? previas : []).filter((s) => s && IDS_SECCION.includes(s.id)).map((s) => [s.id, s]));
  const nu = new Map(parcialSecciones(nuevas).map((s) => [s.id, s]));
  return limpiarSecciones(SECCIONES.filter((b) => pre.has(b.id) || nu.has(b.id)).map((b) => {
    const p = pre.get(b.id) || {}; const n = nu.get(b.id) || {};
    return { id: b.id, nombre: n.nombre ?? p.nombre ?? b.nombre, orden: n.orden ?? (p.orden != null && p.orden !== '' ? Number(p.orden) : b.orden), visible: n.visible ?? (p.visible !== false) };
  }));
}

// Pestañas antiguas de la asignatura → sección nueva (los enlaces de antes siguen funcionando).
export const VISTA_ANTIGUA = { tablon: 'avisos', trabajo: 'teoria', organizacion: 'gestion', actividades: 'clase', laboratorio: 'laboratorio' };
export function vistaNueva(vista, { prof = false, visibles = SECCIONES } = {}) {
  if (vista === 'gestion') return prof ? 'gestion' : (visibles[0]?.id || 'avisos');
  if (IDS_SECCION.includes(vista) && visibles.some((s) => s.id === vista)) return vista;
  let v = VISTA_ANTIGUA[vista] || null;
  if (vista === 'trabajo' && prof) v = 'gestion';
  if (v === 'gestion') return prof ? 'gestion' : (visibles[0]?.id || 'avisos');
  if (v && visibles.some((s) => s.id === v)) return v;
  // sección oculta o desconocida → la primera visible
  return visibles[0]?.id || (prof ? 'gestion' : 'avisos');
}

// Contador de pendientes del alumno por sección. estado(it) → [k, texto] como en la lista del alumno.
// Cuenta lo que tiene que hacer: asignado sin entregar, devuelto o con fecha que se acerca/pasada.
export const K_PENDIENTE = ['pend', 'tarde', 'curso', 'abierto']; // sin entregar, fuera de plazo o devuelto, borrador, examen abierto
export function pendientesPorSeccion(items, estado) {
  const n = Object.fromEntries(IDS_SECCION.map((s) => [s, 0]));
  for (const it of items || []) { const k = estado ? estado(it)?.[0] : null; if (k && K_PENDIENTE.includes(k)) n[seccionDe(it)]++; }
  return n;
}
// Agrupa los elementos de una sección por tema (en el orden del profesor). temas: [{id, nombre, orden}]
export function agruparPorTema(items, temas) {
  const T = (temas || []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const ids = new Set(T.map((t) => t.id));
  const grupos = T.map((t) => ({ tema: t, items: items.filter((it) => it.tema === t.id) })).filter((g) => g.items.length);
  const sin = items.filter((it) => !it.tema || !ids.has(it.tema));
  return sin.length ? [{ tema: null, items: sin }, ...grupos] : grupos;
}
