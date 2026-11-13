// Vista de la «Explicación interactiva» (alumno y vista previa del profesor): diapositivas con
// anterior/siguiente (también con las flechas del teclado), preguntas de control con respuesta al
// momento, laboratorio del portal incrustado y resumen final. El alumno entrega «Aciertos: a/t».
import { esc } from './util.js';
import { ic } from './ico.js';
import { textoHTML } from './aula-vistas.js';
import { aciertoControl } from '../lms/motores/explicacion.js';

const clave = (id) => `portal.expl.${id}`;
function leer(id) { try { return JSON.parse(sessionStorage.getItem(clave(id)) || 'null') || { i: 0, r: {} }; } catch (e) { return { i: 0, r: {} }; } }
function guardar(id, s) { try { sessionStorage.setItem(clave(id), JSON.stringify(s)); } catch (e) { } }

// opciones: { rol, trabajo, nota, entregar(texto) → Promise }
export function montarExplicacion(nodo, it, op) {
  const c = it.contenido || { diapositivas: [] }; const D = c.diapositivas || [];
  const S = leer(it.id); const total = D.length + 1; // + resumen
  let msg = '';
  const aciertos = () => D.reduce((a, d, i) => a + (d.pregunta && S.r[i] != null && aciertoControl(d.pregunta, S.r[i]) ? 1 : 0), 0);
  const nCtrl = D.filter((d) => d.pregunta).length;
  const respondidas = () => D.filter((d, i) => d.pregunta && S.r[i] != null).length;
  function controlHTML(d, i) {
    const p = d.pregunta; const r = S.r[i]; const hecho = r != null; const ok = hecho && aciertoControl(p, r);
    const ver = hecho || op.rol === 'profesor';
    const ops = p.tipo === 'test' ? p.opciones.map((o, j) => ({ v: j, t: o })) : [{ v: true, t: 'Verdadero' }, { v: false, t: 'Falso' }];
    return `<fieldset class="xp-ctrl" data-xi="${i}"><legend>Pregunta de control</legend><p class="xp-enun">${esc(p.enunciado)}</p>
      <div class="xp-ops" role="group">${ops.map((o) => { const sel = hecho && String(r) === String(o.v); const bien = ver && String(o.v) === String(p.correcta); return `<button type="button" class="btn xp-op ${sel ? 'sel' : ''} ${ver && bien ? 'bien' : ''} ${sel && !bien ? 'mal' : ''}" data-xr="${esc(JSON.stringify(o.v))}" ${hecho ? 'disabled' : ''} aria-pressed="${sel}">${esc(o.t)}</button>`; }).join('')}</div>
      ${hecho ? `<p class="xp-fb ${ok ? 'ok' : 'ko'}" role="status">${ok ? ic('circle-check') + ' ¡Correcto!' : ic('circle-x') + ' No es correcto.'}${p.explicacion ? ' ' + esc(p.explicacion) : ''}</p>` : op.rol === 'profesor' && p.explicacion ? `<p class="pn-small">Explicación: ${esc(p.explicacion)}</p>` : ''}</fieldset>`;
  }
  function diapoHTML(i) {
    if (i >= D.length) {
      const tr = op.trabajo; const n = op.nota;
      const ent = op.rol === 'alumno' && !n ? `<div class="au-acts"><button type="button" class="btn primary" data-xp="entregar">${tr ? ic('refresh-cw') + ' Volver a entregar' : ic('send') + ' He terminado: entregar'}</button><span class="au-msg" id="xpMsg" role="status">${esc(msg)}</span></div>
        ${nCtrl && respondidas() < nCtrl ? `<p class="au-small">Te quedan ${nCtrl - respondidas()} pregunta(s) de control sin responder.</p>` : ''}` : '';
      return `<h3 class="xp-h">Resumen</h3>${c.resumen ? `<div class="au-texto">${textoHTML(c.resumen)}</div>` : `<ul>${D.map((d) => `<li>${esc(d.titulo)}</li>`).join('')}</ul>`}
        ${nCtrl ? `<p class="xp-res"><b>Preguntas de control:</b> ${aciertos()} de ${nCtrl} acertadas${op.rol === 'profesor' ? ' (vista previa)' : ''}.</p>` : ''}
        ${tr ? `<div class="au-ok">${ic('circle-check')} Entregado${n ? '' : ' · puedes repetirla y volver a entregar hasta que el profesor la califique'}</div>` : ''}${ent}`;
    }
    const d = D[i];
    return `<h3 class="xp-h">${esc(d.titulo)}</h3>${d.texto ? `<div class="au-texto">${textoHTML(d.texto)}</div>` : ''}
      ${d.imagen ? `<figure class="xp-fig"><img src="${esc(d.imagen)}" alt="${esc(d.alt || '')}" loading="lazy"></figure>` : ''}
      ${d.video ? (d.video.tipo === 'iframe' ? `<div class="xp-video"><iframe title="Vídeo" src="${esc(d.video.src)}" loading="lazy" allow="fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>` : `<video class="xp-video" src="${esc(d.video.src)}" controls preload="metadata"></video>`) : ''}
      ${d.lab ? `<div class="xp-lab"><div class="xp-lab-b"><span>${ic('microscope')} Laboratorio</span><a class="btn small" href="${esc(d.lab)}" target="_blank" rel="noopener">Abrir en otra pestaña</a></div><iframe title="Laboratorio del portal" src="index.html?incrustado=1${esc(d.lab)}" loading="lazy" allow="fullscreen"></iframe></div>` : ''}
      ${d.pregunta ? controlHTML(d, i) : ''}`;
  }
  function pintar() {
    const i = Math.max(0, Math.min(total - 1, S.i || 0)); S.i = i;
    nodo.innerHTML = `<section class="xp" aria-roledescription="presentación" aria-label="${esc(it.titulo)}">
      <div class="xp-top"><span class="xp-n" aria-live="polite">${i + 1} / ${total}</span><div class="xp-prog" aria-hidden="true"><span style="width:${((i + 1) / total) * 100}%"></span></div></div>
      <div class="xp-diapo" tabindex="-1">${diapoHTML(i)}</div>
      <div class="xp-nav"><button type="button" class="btn" data-xp="ant" ${i ? '' : 'disabled'}>${ic('chevron-left')} Anterior</button>
        <div class="xp-dots">${Array.from({ length: total }, (_, k) => `<button type="button" class="xp-dot ${k === i ? 'on' : ''} ${k < D.length && D[k].pregunta && S.r[k] != null ? 'hecha' : ''}" data-xg="${k}" aria-label="Ir a la diapositiva ${k + 1}${k === D.length ? ' (resumen)' : ''}"></button>`).join('')}</div>
        <button type="button" class="btn ${i < total - 1 ? 'primary' : ''}" data-xp="sig" ${i < total - 1 ? '' : 'disabled'}>Siguiente ${ic('chevron-right')}</button></div></section>`;
  }
  function ir(i, foco = true) { S.i = i; guardar(it.id, S); pintar(); if (foco) nodo.querySelector('.xp-diapo')?.focus(); }
  nodo.addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b || !nodo.contains(b)) return;
    if (b.dataset.xp === 'ant') ir(S.i - 1);
    if (b.dataset.xp === 'sig') ir(S.i + 1);
    if (b.dataset.xg != null) ir(+b.dataset.xg);
    if (b.dataset.xr != null) { const i = +b.closest('[data-xi]').dataset.xi; if (S.r[i] == null && op.rol === 'alumno') { S.r[i] = JSON.parse(b.dataset.xr); guardar(it.id, S); pintar(); nodo.querySelector('.xp-fb')?.focus?.(); } else if (op.rol === 'profesor') { S.r[i] = JSON.parse(b.dataset.xr); pintar(); } }
    if (b.dataset.xp === 'entregar' && op.entregar) {
      b.disabled = true; msg = 'Enviando…'; nodo.querySelector('#xpMsg').textContent = msg;
      try { await op.entregar(nCtrl ? `Explicación terminada. Aciertos: ${aciertos()}/${nCtrl}` : 'Explicación terminada. Aciertos: 1/1 (sin preguntas de control)'); msg = 'Entregado.'; }
      catch (er) { msg = 'No se ha podido entregar. Revisa la conexión.'; }
      pintar();
    }
  });
  nodo.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select, iframe')) return;
    if (e.key === 'ArrowRight' && S.i < total - 1) { e.preventDefault(); ir(S.i + 1); }
    if (e.key === 'ArrowLeft' && S.i > 0) { e.preventDefault(); ir(S.i - 1); }
  });
  pintar();
  return { actualizar(o) { Object.assign(op, o); if (S.i >= D.length) pintar(); } };
}
