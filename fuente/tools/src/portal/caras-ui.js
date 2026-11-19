// v5 · Botones de las dos caras de un elemento (lista de la sección y página del elemento).
import { esc } from './util.js';
import { ic } from './ico.js';
import { pdfDe, interactivoDe } from '../lms/caras.js';
// v5 · botones «Ver PDF» y «Versión interactiva» (este solo si existe). El PDF se abre en el visor de solo lectura.
export function carasHTML(it) {
  const p = pdfDe(it); const x = interactivoDe(it); if (!p && !x) return '';
  return `<span class="cl-caras">${p ? `<a class="btn tiny cl-cara" href="${esc(p.href)}" data-titulo="${esc(p.titulo)}">${ic('file-text')} Ver PDF</a>` : ''}${x ? `<a class="btn tiny cl-cara" href="${esc(x.href)}" title="${esc(x.nombre)}">${ic('sparkles')} Versión interactiva</a>` : ''}</span>`;
}
