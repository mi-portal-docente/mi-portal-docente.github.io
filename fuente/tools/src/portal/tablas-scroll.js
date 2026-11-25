// Tablas anchas dentro de su propio contenedor: ninguna tabla ensancha la página (y con ella la cabecera, que se
// quedaba con el ancho de la ventana mientras el cuerpo se deslizaba hacia los lados). Cada tabla que no tenga ya
// un contenedor con scroll horizontal se envuelve en <div class="tbl-scroll">, que es quien se desliza.
const SEL = 'table.pn-t, table.au-t, table.tbl, table.cx-tbl, table.vv-mat, table.pn-pg, table.rb-t, table.pi-tab, table.an-t, table.bk-t, table.hj-t, table.ap-crit';
function yaScrollea(t) {
  for (let p = t.parentElement; p && p !== document.body; p = p.parentElement) {
    if (p.classList.contains('tbl-scroll')) return true;
    const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll') return true;
  }
  return false;
}
export function envolverTablas(raiz = document) {
  raiz.querySelectorAll(SEL).forEach((t) => {
    if (t.dataset.sinEnvoltorio != null || !t.parentNode || t.parentElement.classList.contains('tbl-scroll')) return;
    if (yaScrollea(t)) return;
    const w = document.createElement('div'); w.className = 'tbl-scroll'; t.parentNode.insertBefore(w, t); w.appendChild(t);
  });
}
export function iniciarTablasScroll() {
  let pend = false;
  const pasar = () => { pend = false; envolverTablas(); };
  const mo = new MutationObserver(() => { if (!pend) { pend = true; requestAnimationFrame(pasar); } });
  mo.observe(document.body, { childList: true, subtree: true });
  envolverTablas();
}
