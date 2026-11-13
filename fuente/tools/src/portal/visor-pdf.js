// Fase 13 · Visor de PDF dentro del portal (pdf.js 3.11, Apache-2.0, en vendor/pdfjs; se carga solo al abrir un PDF).
// Páginas a lo ancho (también en el móvil), zoom, ir a página, pantalla completa y teclado. Si el PDF no se puede
// leer (otro servidor sin permiso CORS), ofrece abrir el original. isEvalSupported:false por seguridad.
import { esc } from './util.js';
import { ic } from './ico.js';

let carga = null;
function cargarPdfjs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (!carga) carga = new Promise((res, rej) => { const s = document.createElement('script'); s.src = new URL('vendor/pdfjs/pdf.min.js?v=3.11.174', document.baseURI).href; s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('vendor/pdfjs/pdf.worker.min.js?v=3.11.174', document.baseURI).href; res(window.pdfjsLib); }; s.onerror = () => { carga = null; rej(new Error('No se ha podido cargar el visor.')); }; document.head.appendChild(s); });
  return carga;
}
export const esPDF = (u) => /\.pdf($|[?#])/i.test(String(u || ''));

export async function abrirPDF(url, titulo = 'Documento PDF') {
  cerrarPDF();
  const abs = new URL(url, document.baseURI).href;
  const V = document.createElement('div'); V.className = 'vp'; V.id = 'visorPdf'; V.setAttribute('role', 'dialog'); V.setAttribute('aria-modal', 'true'); V.setAttribute('aria-label', 'Visor PDF: ' + titulo);
  V.innerHTML = `<header class="vp-bar">
      <button type="button" class="vp-b" data-vp="cerrar" aria-label="Cerrar el visor" title="Cerrar (Esc)">${ic('x')}</button>
      <b class="vp-tit">${esc(titulo)}</b>
      <span class="vp-grp"><button type="button" class="vp-b" data-vp="ant" aria-label="Página anterior">${ic('chevron-up')}</button><span class="vp-pag" aria-live="polite"><input class="vp-n" inputmode="numeric" value="1" aria-label="Página"> / <span class="vp-tot">…</span></span><button type="button" class="vp-b" data-vp="sig" aria-label="Página siguiente">${ic('chevron-down')}</button></span>
      <span class="vp-grp"><button type="button" class="vp-b" data-vp="menos" aria-label="Alejar">${ic('zoom-out')}</button><span class="vp-zoom">100 %</span><button type="button" class="vp-b" data-vp="mas" aria-label="Acercar">${ic('zoom-in')}</button></span>
      <span class="vp-grp"><button type="button" class="vp-b" data-vp="pantalla" aria-label="Pantalla completa" title="Pantalla completa">${ic('maximize-2')}</button><a class="vp-b" href="${esc(abs)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir el original" title="Abrir el original / descargar">${ic('external-link')}</a></span>
    </header><div class="vp-pages" tabindex="0"><p class="vp-msg">Cargando el PDF…</p></div>`;
  document.body.appendChild(V); document.body.classList.add('vp-abierto');
  const P = V.querySelector('.vp-pages'); const S = { zoom: 1, pdf: null, pags: [], obs: null, tarea: 0, previo: document.activeElement };
  V.querySelector('[data-vp=cerrar]').focus();
  const fin = () => cerrarPDF();
  V._cerrar = () => { S.obs?.disconnect(); S.pdf?.destroy?.(); document.removeEventListener('keydown', tecla, true); try { if (document.fullscreenElement === V) document.exitFullscreen(); } catch (e) { } S.previo?.focus?.(); };
  function tecla(e) {
    if (!document.getElementById('visorPdf')) return;
    if (e.key === 'Escape' && !document.fullscreenElement) { e.preventDefault(); fin(); }
    else if ((e.key === '+' || e.key === '=') && (e.ctrlKey || e.metaKey || e.target === P)) { e.preventDefault(); zoom(1.2); }
    else if (e.key === '-' && (e.ctrlKey || e.metaKey || e.target === P)) { e.preventDefault(); zoom(1 / 1.2); }
  }
  document.addEventListener('keydown', tecla, true);
  try {
    const lib = await cargarPdfjs();
    S.pdf = await lib.getDocument({ url: abs, isEvalSupported: false, enableXfa: false }).promise;
  } catch (e) {
    P.innerHTML = `<div class="vp-msg">${ic('triangle-exclamation-point')} No se ha podido abrir el PDF aquí. <a class="btn small" href="${esc(abs)}" target="_blank" rel="noopener noreferrer">${ic('external-link')} Abrir el original</a></div>`; return;
  }
  if (!document.body.contains(V)) return;
  V.querySelector('.vp-tot').textContent = S.pdf.numPages; P.innerHTML = '';
  const pag1 = await S.pdf.getPage(1); const vp1 = pag1.getViewport({ scale: 1 });
  for (let i = 1; i <= S.pdf.numPages; i++) { const d = document.createElement('div'); d.className = 'vp-pg'; d.dataset.n = i; d.setAttribute('aria-label', `Página ${i}`); d.style.aspectRatio = `${vp1.width} / ${vp1.height}`; P.appendChild(d); S.pags.push(d); }
  const ancho = () => Math.min(P.clientWidth - 24, 1100) * S.zoom;
  async function pintar(d) {
    const t = S.tarea; d.dataset.ok = '1';
    const pg = await S.pdf.getPage(+d.dataset.n); const v0 = pg.getViewport({ scale: 1 }); const esc2 = ancho() / v0.width; const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const v = pg.getViewport({ scale: esc2 * dpr }); const cv = document.createElement('canvas'); cv.width = Math.floor(v.width); cv.height = Math.floor(v.height); cv.style.width = Math.floor(v.width / dpr) + 'px';
    await pg.render({ canvasContext: cv.getContext('2d'), viewport: v }).promise;
    if (t !== S.tarea) return; d.style.aspectRatio = `${v0.width} / ${v0.height}`; d.replaceChildren(cv);
  }
  const ajustar = () => { S.pags.forEach((d) => { d.style.width = ancho() + 'px'; }); V.querySelector('.vp-zoom').textContent = Math.round(S.zoom * 100) + ' %'; };
  S.obs = new IntersectionObserver((E) => E.forEach((x) => { if (x.isIntersecting && !x.target.dataset.ok) pintar(x.target).catch(() => { }); }), { root: P, rootMargin: '600px 0px' });
  ajustar(); S.pags.forEach((d) => S.obs.observe(d));
  function zoom(f) { const pg = actual(); S.zoom = Math.max(0.5, Math.min(3, S.zoom * f)); S.tarea++; ajustar(); S.pags.forEach((d) => { delete d.dataset.ok; S.obs.unobserve(d); S.obs.observe(d); }); ir(pg, false); }
  function actual() { const top = P.scrollTop + 40; let n = 1; for (const d of S.pags) { if (d.offsetTop <= top) n = +d.dataset.n; else break; } return n; }
  function ir(n, suave = true) { n = Math.max(1, Math.min(S.pdf.numPages, n)); S.pags[n - 1].scrollIntoView({ block: 'start', behavior: suave ? 'smooth' : 'auto' }); V.querySelector('.vp-n').value = n; }
  P.addEventListener('scroll', () => { const n = actual(); const i = V.querySelector('.vp-n'); if (document.activeElement !== i) i.value = n; }, { passive: true });
  V.addEventListener('click', (e) => {
    const b = e.target.closest('[data-vp]'); if (!b) return; const k = b.dataset.vp;
    if (k === 'cerrar') fin(); if (k === 'ant') ir(actual() - 1); if (k === 'sig') ir(actual() + 1);
    if (k === 'mas') zoom(1.2); if (k === 'menos') zoom(1 / 1.2);
    if (k === 'pantalla') { if (document.fullscreenElement) document.exitFullscreen(); else V.requestFullscreen?.().catch(() => { }); }
  });
  V.querySelector('.vp-n').addEventListener('change', (e) => ir(parseInt(e.target.value, 10) || 1));
  let tR; window.addEventListener('resize', () => { clearTimeout(tR); tR = setTimeout(() => { if (document.body.contains(V)) zoom(1); }, 250); });
}
export function cerrarPDF() { const V = document.getElementById('visorPdf'); if (!V) return; V._cerrar?.(); V.remove(); document.body.classList.remove('vp-abierto'); }
// Clic en cualquier enlace a un PDF del portal (adjuntos, materiales, entregas) → visor. Ctrl/Cmd+clic = pestaña nueva.
export function instalarVisorPDF() {
  if (window.__visorPdf) return; window.__visorPdf = true;
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest?.('a[href]'); if (!a || a.closest('.vp') || a.hasAttribute('download') || a.dataset.noVisor != null) return;
    const href = a.getAttribute('href'); if (!esPDF(href)) return;
    const u = new URL(href, document.baseURI); if (u.origin !== location.origin) return; // otros servidores: pestaña nueva (CORS)
    e.preventDefault(); abrirPDF(u.href, (a.textContent || '').trim().slice(0, 120) || decodeURIComponent(u.pathname.split('/').pop()));
  });
}
