// Piezas comunes de los laboratorios ligeros: caja «Entregar», carga de scripts de vendor/ y utilidades.
import { ic } from '../ui/iconos.js';

export const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
export const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };
export const leerJSON = (k, d) => { try { return JSON.parse(leer(k) || '') ?? d; } catch (e) { return d; } };

// Caja de entrega: ctx = { entregar(texto) → Promise, entregadoTexto, nota }; datos() → { a, t, texto }
export function cajaEntrega(nodo, ctx, datos, { boton = 'Entregar' } = {}) {
  if (!ctx.entregar) { nodo.hidden = true; return { pintar() {}, actualizar() {} }; }
  nodo.classList.add('lb-ent');
  function pintar() {
    const d = datos();
    const prev = ctx.entregadoTexto ? `<p class="muted">${ic('check')} Ya entregaste: ${esc((ctx.entregadoTexto.match(/Aciertos: \d+\/\d+/) || [''])[0])}${ctx.nota ? ` · Nota: <b>${esc(ctx.nota)}</b>` : ''}. Puedes volver a entregar mientras no esté calificado.</p>` : '';
    nodo.innerHTML = `${prev}<p>Aciertos: <b>${d.a}/${d.t}</b></p><button type="button" class="btn" data-lb-ent>${ic('send')} ${esc(boton)}</button><span class="lb-entmsg" role="status"></span>`;
  }
  nodo.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-lb-ent]'); if (!b) return; const m = nodo.querySelector('.lb-entmsg');
    b.disabled = true; m.textContent = 'Entregando…';
    try { const d = datos(); const t = `${d.texto}`.slice(0, 10000); await ctx.entregar(t); ctx.entregadoTexto = t; pintar(); nodo.querySelector('.lb-entmsg').textContent = 'Entregado. El resultado llega al cuaderno.'; }
    catch (er) { m.textContent = 'No se pudo entregar: ' + (er.message || er); b.disabled = false; }
  });
  pintar();
  return { pintar, actualizar(o = {}) { if ('entregadoTexto' in o) ctx.entregadoTexto = o.entregadoTexto; if ('nota' in o) ctx.nota = o.nota; pintar(); } };
}

// Carga (una vez) un script de vendor/
const cargados = new Map();
export function cargarScript(ruta) {
  if (!cargados.has(ruta)) cargados.set(ruta, new Promise((res, rej) => { const s = document.createElement('script'); s.src = new URL(ruta, document.baseURI).href; s.onload = res; s.onerror = () => { cargados.delete(ruta); rej(new Error('No se pudo cargar ' + ruta)); }; document.head.appendChild(s); }));
  return cargados.get(ruta);
}
