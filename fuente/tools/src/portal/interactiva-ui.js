// Fase 12 · «Actividad interactiva» en la página del elemento: preguntas de examen sin tiempo límite y con
// varios intentos. Comprobar → cada pregunta marcada (bien / a medias / mal) y, si el profesor lo permite, la
// solución. Se guarda el MEJOR intento («Aciertos: a/t» → «Poner notas» en el cuaderno). Iconos Lucide.
import { esc } from './util.js';
import { ic } from './ico.js';
import { corregirExamen, fmtNota, semilla } from '../lms/modelo.js';
import { preguntaHTML, leerRespuesta, enlazarPreguntas, solucionTexto } from './examen-ui.js';

export function montarInteractiva(nodo, it, cx) {
  const c = it.contenido || {}; const P = c.preguntas || []; const K = c.claves || {};
  const prof = cx.rol !== 'alumno';
  const S = { datos: cx.trabajo?.datos || null, nota: cx.nota || null, res: null, intentoVista: 0, msg: '', guardando: false };
  const usados = () => S.datos?.intentos || 0;
  const quedan = () => (c.intentos ? Math.max(0, c.intentos - usados()) : Infinity);
  const bloqueado = () => !prof && (S.nota?.nota != null || quedan() <= 0);
  const seed = () => semilla(`${cx.ses?.grupo || 'prof'}_${cx.ses?.numero || 0}|${it.id}|${usados() + S.intentoVista}`);
  function cabecera() {
    const d = S.datos;
    const lim = c.intentos ? `${usados()} de ${c.intentos} intento${c.intentos === 1 ? '' : 's'}` : `${usados()} intento${usados() === 1 ? '' : 's'} · sin límite`;
    return `<div class="ia-cab"><span class="ia-chip">${ic('timer')} Sin tiempo límite</span><span class="ia-chip">${ic('repeat')} ${prof ? (c.intentos ? `${c.intentos} intentos` : 'Intentos ilimitados') : esc(lim)}</span>${!prof && d?.mejor != null ? `<span class="ia-chip ok">${ic('star')} Mejor nota: <b>${esc(fmtNota(d.mejor))}</b></span>` : ''}${S.nota?.nota != null && S.nota.publicada !== false ? `<span class="ia-chip ok">${ic('circle-check')} Calificada: <b>${esc(fmtNota(S.nota.nota))}</b></span>` : ''}</div>
      ${prof ? `<p class="au-small">${ic('eye')} Vista previa del profesor: puedes probarla (no se guarda). ${c.soluciones !== false ? 'Al comprobar, el alumno ve la solución de lo que falle.' : 'El alumno solo ve si acierta, no la solución.'}</p>` : ''}`;
  }
  function pintar() {
    const s = seed(); const fin = S.res;
    let h = cabecera();
    if (bloqueado() && !fin) {
      h += `<div class="ia-fin">${ic('circle-check')} ${S.nota?.nota != null ? 'Tu profesor ya ha puesto la nota de esta actividad.' : 'Has usado todos los intentos.'}${S.datos?.mejor != null ? ` Tu mejor resultado: <b>${esc(fmtNota(S.datos.mejor))}</b>.` : ''}</div>`;
      nodo.innerHTML = `<div class="ia">${h}</div>`; return;
    }
    h += `<form class="au-form ia-form" autocomplete="off">${P.map((q, n) => preguntaHTML(q, fin ? fin.resp[q.id] : undefined, { n: n + 1, barajarOps: true, s })).join('')}`;
    if (!fin) h += `<div class="pn-acts"><button type="submit" class="btn primary">${ic('check')} Comprobar</button><span class="au-msg" role="status">${esc(S.msg)}</span></div>`;
    h += '</form>';
    if (fin) {
      const r = fin.r;
      h += `<div class="ia-res ${r.nota >= 5 ? 'ok' : 'ko'}" role="status"><b>${esc(fmtNota(r.puntos))} / ${esc(fmtNota(r.max))} puntos · Nota ${esc(fmtNota(r.nota))}</b>${!prof ? `<span>${S.guardando ? 'Guardando…' : esc(S.msg)}</span>` : ''}</div>
        <div class="pn-acts">${!bloqueado() || prof ? `<button type="button" class="btn primary" data-ia="otra">${ic('rotate-ccw')} Intentar de nuevo</button>` : `<span class="au-small">${S.nota?.nota != null ? 'Ya está calificada.' : 'No te quedan intentos.'}</span>`}</div>`;
    }
    nodo.innerHTML = `<div class="ia">${h}</div>`;
    if (fin) marcar(nodo, fin);
  }
  function marcar(raiz, fin) {
    raiz.querySelectorAll('.ia-form fieldset[data-q]').forEach((fs) => {
      const q = P.find((x) => x.id === fs.dataset.q); if (!q) return;
      const p = fin.r.detalle[q.id] || 0; const max = Number(q.puntos) > 0 ? Number(q.puntos) : 1;
      const cl = p >= max - 1e-9 ? 'ok' : p > 0 ? 'med' : 'ko'; fs.classList.add('ia-' + cl); fs.disabled = true;
      const sol = cl !== 'ok' && c.soluciones !== false ? `<div class="ia-sol">${ic('lightbulb')} Solución: ${esc(solucionTexto(q, K[q.id]) || '')}</div>` : '';
      fs.insertAdjacentHTML('beforeend', `<div class="ia-fb ${cl}">${ic(cl === 'ok' ? 'circle-check' : cl === 'med' ? 'circle-dashed' : 'circle-x')} ${cl === 'ok' ? 'Correcta' : cl === 'med' ? `A medias (${esc(fmtNota(p))} de ${esc(fmtNota(max))})` : 'Incorrecta'}</div>${sol}`);
    });
  }
  async function comprobar(f) {
    const resp = {}; f.querySelectorAll('fieldset[data-q]').forEach((fs) => { const q = P.find((x) => x.id === fs.dataset.q); if (!q) return; const v = leerRespuesta(q, fs); if (v !== undefined && v !== null) resp[q.id] = v; });
    if (!Object.keys(resp).length) { S.msg = 'Responde al menos una pregunta.'; pintar(); return; }
    const r = corregirExamen(P, K, resp); S.res = { resp, r }; S.msg = '';
    if (prof || !cx.entregar) { pintar(); return; }
    const d0 = S.datos || {}; const n = (d0.intentos || 0) + 1; const mejor = d0.mejor == null || r.nota >= d0.mejor;
    const best = mejor ? { nota: r.nota, puntos: r.puntos, max: r.max, resp } : { nota: d0.mejor, puntos: d0.puntos, max: d0.max, resp: d0.resp || {} };
    const datos = { intentos: n, mejor: best.nota, puntos: best.puntos, max: best.max, ultima: r.nota, resp: best.resp };
    S.guardando = true; pintar();
    try {
      await cx.entregar(`Actividad interactiva «${it.titulo}» · ${n} intento${n === 1 ? '' : 's'} · Aciertos: ${fmtNota(best.puntos)}/${fmtNota(best.max)} · Nota: ${fmtNota(best.nota)}`, { datos });
      S.datos = datos; S.intentoVista = -1; S.msg = mejor && n > 1 ? '¡Es tu mejor intento! Guardado.' : 'Guardado.';
    } catch (e) { S.msg = e?.code === 'permission-denied' ? 'No se ha guardado: puede que ya esté calificada o que tu sesión haya caducado.' : 'No se ha guardado: revisa la conexión.'; }
    S.guardando = false; pintar();
  }
  nodo.addEventListener('submit', (e) => { const f = e.target.closest('.ia-form'); if (!f) return; e.preventDefault(); comprobar(f); });
  nodo.addEventListener('click', (e) => { const b = e.target.closest('[data-ia=otra]'); if (!b) return; S.res = null; S.msg = ''; S.intentoVista = prof ? S.intentoVista + 1 : 0; pintar(); nodo.querySelector('fieldset')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
  enlazarPreguntas(nodo, () => {});
  pintar();
  return {
    actualizar(o) { if (o.trabajo?.datos && (o.trabajo.datos.intentos || 0) >= usados()) S.datos = o.trabajo.datos; const cambioNota = (o.nota?.nota ?? null) !== (S.nota?.nota ?? null); S.nota = o.nota || null; if (!S.guardando && (cambioNota || !nodo.querySelector('.ia-form'))) pintar(); },
    destruir() { nodo.innerHTML = ''; },
  };
}
