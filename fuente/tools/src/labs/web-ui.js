// Editor web en vivo: HTML y CSS con vista previa aislada (iframe sandbox sin scripts) y retos comprobados.
import { ic } from '../ui/iconos.js';
import { evaluarWeb, textoComprobacionWeb } from '../lms/motores/web.js';
import { esc, leerJSON, guardar, cajaEntrega } from './comun.js';

const LIBRE = { id: 'libre', titulo: 'Modo libre', enunciado: 'Escribe HTML y CSS: la vista previa se actualiza sola.', html: '<h1>Hola</h1>\n<p>Mi primera página.</p>\n', css: 'body {\n  font-family: system-ui, sans-serif;\n}\nh1 {\n  color: #1f6feb;\n}\n', pistas: [], comprobaciones: [] };

export function montarWeb(nodo, retos, ctx = {}) {
  const libre = !retos.length; const R = libre ? [LIBRE] : retos; const clave = ctx.clave || 'weblab';
  const est = { i: 0, pistas: 0, superados: leerJSON(clave + ':ok', {}) };
  const codigoDe = (r) => leerJSON(`${clave}:${r.id}`, null) || { html: r.html, css: r.css };
  nodo.classList.add('wl');
  nodo.innerHTML = `${R.length > 1 ? '<nav class="p5-retos" aria-label="Retos" data-w-nav></nav>' : ''}
  <div class="p5-grid">
    <section class="p5-izq" aria-label="Enunciado y código">
      <div class="p5-enun" data-w="enun"></div>
      <label class="wl-lab" for="wlHtml">${ic('code')} HTML</label><textarea id="wlHtml" class="wl-ta" data-w="html" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
      <label class="wl-lab" for="wlCss">${ic('palette')} CSS</label><textarea id="wlCss" class="wl-ta" data-w="css" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
      <div class="p5-bot">${libre ? '' : `<button type="button" class="btn" data-wa="comprobar">${ic('list-checks')} Comprobar</button>`}
        <button type="button" class="btn sec" data-wa="pista">${ic('lightbulb')} Pista</button><button type="button" class="btn sec" data-wa="reiniciar">${ic('rotate-ccw')} Código inicial</button></div>
      <div class="p5-res" data-w="res" aria-live="polite"></div><div data-w="ent"></div>
    </section>
    <section class="p5-der" aria-label="Vista previa"><div class="p5-con-h">${ic('globe')} Vista previa</div>
      <iframe class="wl-if" data-w="if" sandbox="allow-same-origin" title="Vista previa de tu página"></iframe></section>
  </div>`;
  const $ = (s) => nodo.querySelector(s); const th = $('[data-w=html]'); const tc = $('[data-w=css]'); const fr = $('[data-w=if]');
  let t = 0; let carga = null;
  const doc = () => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="script-src 'none'"><style>${tc.value.replace(/<\/style/gi, '')}</style></head><body>${th.value}</body></html>`;
  function refrescar() { carga = new Promise((res) => { fr.onload = () => res(); }); fr.srcdoc = doc(); guardar(`${clave}:${R[est.i].id}`, JSON.stringify({ html: th.value, css: tc.value })); return carga; }
  const programar = () => { clearTimeout(t); t = setTimeout(refrescar, 400); };
  function medir(c) {
    const d = fr.contentDocument; if (!d) return null; let L = []; try { L = [...d.querySelectorAll(c.selector)]; } catch (e) { return { n: 0 }; }
    if (c.tipo === 'selector') return { n: L.length, textos: L.map((x) => x.textContent || '') };
    const w = fr.contentWindow; const p = d.createElement('span'); p.style.setProperty(c.propiedad, c.valor); d.body.appendChild(p); const esperado = w.getComputedStyle(p).getPropertyValue(c.propiedad); p.remove();
    return { n: L.length, coincide: L.some((x) => w.getComputedStyle(x).getPropertyValue(c.propiedad) === esperado) };
  }
  const ent = cajaEntrega($('[data-w=ent]'), ctx, () => ({ a: aciertos(), t: R.length, texto: textoEntrega() }), { boton: 'Entregar la página' });
  function aciertos() { return R.filter((r) => est.superados[r.id]).length; }
  function textoEntrega() { return `${ctx.titulo || 'Editor web'}. Aciertos: ${aciertos()}/${R.length}\n\n${R.map((r, i) => { const c = i === est.i ? { html: th.value, css: tc.value } : codigoDe(r); return `--- Reto ${i + 1}: ${r.titulo} (${est.superados[r.id] ? 'superado' : 'sin superar'}) ---\nHTML:\n${c.html.slice(0, 2500)}\nCSS:\n${c.css.slice(0, 1500)}`; }).join('\n\n')}`; }
  async function comprobar() {
    clearTimeout(t); await refrescar(); const r = R[est.i]; const cod = { html: th.value, css: tc.value };
    const L = r.comprobaciones.map((c) => ({ c, ok: evaluarWeb(c, cod, c.tipo === 'codigo' ? null : medir(c)) })); const ok = L.every((x) => x.ok);
    est.superados[r.id] = ok; guardar(clave + ':ok', JSON.stringify(est.superados));
    $('[data-w=res]').innerHTML = `<div class="p5-veredicto ${ok ? 'ok' : 'mal'}">${ok ? `${ic('circle-check')} ¡Reto superado!` : `${ic('circle-x')} Todavía no: revisa lo que falta.`}</div><ul class="p5-checks">${L.map((x) => `<li class="${x.ok ? 'ok' : 'mal'}">${ic(x.ok ? 'check' : 'x')} ${esc(textoComprobacionWeb(x.c))}</li>`).join('')}</ul>`;
    pintarNav(); ent.pintar();
  }
  function pintarNav() { const n = $('[data-w-nav]'); if (n) n.innerHTML = R.map((r, i) => `<button type="button" class="p5-rt${i === est.i ? ' on' : ''}" data-wr="${i}" ${i === est.i ? 'aria-current="step"' : ''}>${ic(est.superados[r.id] ? 'circle-check' : 'circle-dot')} ${i + 1}. ${esc(r.titulo)}</button>`).join(''); }
  function pintarReto() {
    const r = R[est.i]; est.pistas = 0; const c = codigoDe(r); th.value = c.html; tc.value = c.css;
    $('[data-w=enun]').innerHTML = `<h2 class="p5-tit">${esc(r.titulo)}</h2><p>${esc(r.enunciado)}</p>${r.comprobaciones.length ? `<details class="p5-crit"><summary>Qué se comprueba (${r.comprobaciones.length})</summary><ul>${r.comprobaciones.map((x) => `<li>${esc(textoComprobacionWeb(x))}</li>`).join('')}</ul></details>` : ''}<div data-w="pistas"></div>`;
    $('[data-wa=pista]').hidden = !r.pistas.length; $('[data-wa=pista]').disabled = false; $('[data-w=res]').innerHTML = ''; pintarNav(); refrescar();
  }
  nodo.addEventListener('input', (e) => { if (e.target === th || e.target === tc) programar(); });
  nodo.addEventListener('keydown', (e) => { if ((e.target === th || e.target === tc) && e.key === 'Tab' && !e.shiftKey && !e.target.dataset.salir) { e.preventDefault(); e.target.setRangeText('  ', e.target.selectionStart, e.target.selectionEnd, 'end'); programar(); } if (e.key === 'Escape') e.target.dataset.salir = '1'; else if (e.key !== 'Tab') delete e.target.dataset.salir; });
  nodo.addEventListener('click', (e) => {
    const rb = e.target.closest('[data-wr]'); if (rb) { est.i = Number(rb.dataset.wr); return pintarReto(); }
    const b = e.target.closest('[data-wa]'); if (!b) return; const r = R[est.i];
    if (b.dataset.wa === 'comprobar') comprobar();
    else if (b.dataset.wa === 'pista') { est.pistas = Math.min(r.pistas.length, est.pistas + 1); $('[data-w=pistas]').innerHTML = r.pistas.slice(0, est.pistas).map((p, i) => `<p class="p5-pista">${ic('lightbulb')} <b>Pista ${i + 1}:</b> ${esc(p)}</p>`).join(''); if (est.pistas >= r.pistas.length) b.disabled = true; }
    else if (b.dataset.wa === 'reiniciar' && confirm('¿Volver al código inicial? Se perderán tus cambios.')) { th.value = r.html; tc.value = r.css; refrescar(); }
  });
  pintarReto();
  return { destruir() { clearTimeout(t); }, actualizar: (o) => ent.actualizar(o), comprobar };
}
