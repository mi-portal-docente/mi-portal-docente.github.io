// Fase 9 · estados de un trabajo (tarea, proyecto, documento…):
//   borrador → entregado → devuelto (el profesor pide que lo rehaga) → calificado (tiene nota).
// «calificado» no se guarda en el trabajo: sale de la nota (para el alumno, solo si está publicada).
export const ESTADOS_TRABAJO = {
  sin: { t: 'Sin empezar', ic: 'circle-dashed' },
  borrador: { t: 'Borrador', ic: 'pencil' },
  entregado: { t: 'Entregado', ic: 'send' },
  devuelto: { t: 'Devuelto para corregir', ic: 'undo-2' },
  calificado: { t: 'Calificado', ic: 'circle-check' },
};
export const MAX_VERSIONES = 5;

/** Estado efectivo. tr: trabajo (o null); nota: nota visible (o null). Trabajos antiguos sin estado = entregado. */
export function estadoTrabajo(tr, nota) {
  const e = tr ? tr.estado || 'entregado' : 'sin';
  if (nota && nota.nota != null && e !== 'devuelto' && e !== 'borrador') return 'calificado';
  if (e === 'en_curso') return 'borrador';
  return ESTADOS_TRABAJO[e] ? e : 'entregado';
}
/** ¿Puede el alumno escribir? (sin empezar, borrador o devuelto) */
export const editable = (estado) => estado === 'sin' || estado === 'borrador' || estado === 'devuelto';
/** ¿Puede anular la entrega? (entregado y sin nota) */
export const anulable = (estado) => estado === 'entregado';
/** ¿Cuenta como entrega para el profesor? (los borradores no se corrigen) */
export const cuentaComoEntrega = (tr) => !!tr && tr.estado !== 'borrador' && tr.estado !== 'en_curso';

/** Hueco de la versión n (1, 2, 3…) en la colección versiones: se guardan las 5 últimas. */
export const idVersion = (idTrabajo, n) => `${idTrabajo}_v${n % MAX_VERSIONES}`;
/** Versiones ordenadas de la más reciente a la más antigua (máx. 5). */
export const ordenarVersiones = (L) => [...(L || [])].sort((a, b) => (b.n || 0) - (a.n || 0)).slice(0, MAX_VERSIONES);

/** Hora «hh:mm» para el indicador «Guardado hh:mm». */
export const horaCorta = (t) => new Date(t).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

/** Copia local del borrador (por si se corta la red): la más reciente gana. */
export function elegirBorrador(remoto, local) {
  if (!local) return remoto ? { texto: remoto.texto || '', enlaces: remoto.enlaces || [], t: remoto.guardado || remoto.fecha || 0, origen: 'nube' } : null;
  const tr = remoto ? remoto.guardado || remoto.fecha || 0 : 0;
  if (!remoto || (local.t || 0) > tr) return { texto: local.texto || '', enlaces: local.enlaces || [], t: local.t || 0, origen: 'local' };
  return { texto: remoto.texto || '', enlaces: remoto.enlaces || [], t: tr, origen: 'nube' };
}

// ---------------------------------------------------------------- entregas del laboratorio
/** ID nuevo (fase 9): ligado a grupo + nº, no al uid anónimo del ordenador. */
export const idEntregaLab = (grupo, numero, practica) => `${grupo}_${numero}_${practica}`;
/** ¿Es una entrega antigua (ID con el uid)? */
export const entregaAntigua = (e) => !!e && !e.al;
/**
 * Plan de migración de entregas antiguas: para cada grupo+nº+práctica sin copia nueva, elige la antigua a copiar
 * (la que tenga nota; si no, la más reciente). Devuelve [{ id: nuevoId, de: idOriginal, datos }]. Idempotente.
 */
export function planMigracion(entregas) {
  const nuevas = new Set(entregas.filter((e) => e.al).map((e) => e.id));
  const grupos = new Map();
  for (const e of entregas) {
    if (e.al || !e.grupo || e.numero == null || !e.practica) continue;
    const id = idEntregaLab(e.grupo, e.numero, e.practica); if (nuevas.has(id)) continue;
    const prev = grupos.get(id);
    const mejor = !prev || (e.nota != null && prev.nota == null) || ((e.nota != null) === (prev.nota != null) && (e.fecha || 0) > (prev.fecha || 0));
    if (mejor) grupos.set(id, e);
  }
  return [...grupos.entries()].map(([id, e]) => {
    const { id: _o, fecha, ...resto } = e;
    return { id, de: e.id, datos: { ...resto, al: `${e.grupo}_${e.numero}`, migradaDe: e.id } };
  });
}
/** Quita del listado las antiguas que ya tienen copia nueva (para no verlas dos veces). */
export function sinDuplicadas(entregas) {
  const nuevas = new Set(entregas.filter((e) => e.al).map((e) => e.id));
  return entregas.filter((e) => e.al || !nuevas.has(idEntregaLab(e.grupo, e.numero, e.practica)));
}
