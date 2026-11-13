// Iconos de línea (Lucide, ISC) en lugar de emoji en toda la interfaz.
// - ic('nombre') devuelve el SVG en línea para el marcado nuevo.
// - instalarIconos() sustituye, al vuelo, los emoji del texto de la página por su icono (o los oculta si no
//   tienen equivalente). El emoji original se conserva en un <span> invisible, de modo que textContent e
//   innerText no cambian (las pruebas y el código que leen el texto siguen funcionando igual).
import { ICONOS, MAPA } from './iconos-datos.js';

const ATR = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
export const ic = (n, cls = '') => ICONOS[n] ? `<svg class="ic${cls ? ' ' + cls : ''}" ${ATR}>${ICONOS[n]}</svg>` : '';

// Emoji: pictogramas del plano 1 (siempre), o símbolos del BMP que están en el mapa o llevan el selector FE0F.
// Los símbolos técnicos (⏚ tierra, ⎓ continua, ★ estrellas…) no están en el mapa y se quedan como texto.
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const BMP = Object.keys(MAPA).filter((k) => k.codePointAt(0) < 0x10000).map(esc).join('|');
const RE = new RegExp(`(?:[\\u{1F000}-\\u{1FAFF}](?:\\uFE0F)?(?:\\u200D[\\u{1F000}-\\u{1FAFF}\\u2600-\\u27BF]\\uFE0F?)*)|(?:${BMP})\\uFE0F?|[\\u2190-\\u2BFF]\\uFE0F`, 'gu');
const SALTAR = 'script,style,textarea,option,select,pre,code,svg,canvas,noscript,title,[contenteditable],.ic-e,.cm-editor,.no-ic';

function nodoIcono(e, previo, siguiente) {
  const base = e.replace(/\uFE0F/g, '');
  let n = MAPA[base];
  // flechas de navegación: «Siguiente ▶» → chevrón; «▶ Simular» → reproducir
  if (base === '▶' && !/\S/.test(siguiente) && /\S/.test(previo)) n = 'chevron-right';
  const w = document.createElement('span'); w.className = 'ic-e'; w.setAttribute('aria-hidden', 'true');
  if (n && /^(dot|sq):/.test(n)) { const i = document.createElement('i'); i.className = n.startsWith('dot') ? 'ic-dot' : 'ic-sq'; i.style.setProperty('--c', n.split(':')[1]); w.appendChild(i); }
  else if (n && ICONOS[n]) { w.dataset.i = n; w.insertAdjacentHTML('afterbegin', ic(n)); }
  else w.classList.add('ic-vacio');
  const t = document.createElement('span'); t.className = 'ic-t'; t.textContent = e; w.appendChild(t);
  return w;
}
function textoANodos(tn) {
  const s = tn.nodeValue; if (!s || s.length > 20000) return;
  RE.lastIndex = 0; if (!RE.test(s)) return;
  const p = tn.parentElement; if (!p || p.closest(SALTAR)) return;
  const frag = document.createDocumentFragment(); let last = 0, m; RE.lastIndex = 0;
  while ((m = RE.exec(s))) {
    if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
    frag.appendChild(nodoIcono(m[0], s.slice(0, m.index), s.slice(m.index + m[0].length)));
    last = m.index + m[0].length;
  }
  if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
  tn.replaceWith(frag);
}
function recorrer(root) {
  if (root.nodeType === 3) return textoANodos(root);
  if (root.nodeType !== 1 || root.closest?.(SALTAR)) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => { RE.lastIndex = 0; return RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
  const L = []; while (w.nextNode()) L.push(w.currentNode);
  L.forEach(textoANodos);
}
export function instalarIconos(raiz = document.body) {
  if (typeof window === 'undefined' || window.__iconos || !raiz) return;
  window.__iconos = true;
  recorrer(raiz);
  new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'characterData') textoANodos(m.target);
      else for (const n of m.addedNodes) if (n.isConnected) recorrer(n);
    }
  }).observe(raiz, { childList: true, subtree: true, characterData: true });
}
