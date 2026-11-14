// Diálogos propios del portal (P5): sustituyen a confirm(), prompt() y alert() del navegador.
// Motivo: algunos navegadores (y el modo quiosco / pantalla completa) bloquean o silencian esos diálogos
// y entonces el botón «no hace nada». Estos funcionan siempre, se ven con el estilo del portal y son accesibles
// (elemento <dialog> modal: foco atrapado, Esc = cancelar).
//   if (!(await confirmar('¿Entregar?', { aceptar: 'Entregar' }))) return;
//   const t = await pedirTexto('Escribe el nombre del curso', { valor: '' });   // null si cancela
//   await avisar('Hecho.');
const CSS = `
.dlg-portal{border:0;padding:0;border-radius:18px;max-width:min(460px,calc(100vw - 32px));width:100%;
  background:var(--glass-fuerte,#fff);color:var(--tinta,#1d1d1f);box-shadow:var(--sh3,0 20px 60px rgba(0,0,0,.3));
  -webkit-backdrop-filter:var(--blur,none);backdrop-filter:var(--blur,none);font:inherit}
.dlg-portal::backdrop{background:rgba(20,20,24,.42)}
.dlg-portal form{margin:0;padding:22px 22px 18px;display:flex;flex-direction:column;gap:14px}
.dlg-portal .dlg-txt{margin:0;white-space:pre-line;line-height:1.45;font-size:15px}
.dlg-portal input{font:inherit;padding:10px 12px;border-radius:10px;border:1px solid var(--sep2,#bbb);background:var(--card,#fff);color:inherit}
.dlg-portal .dlg-acts{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}
.dlg-portal button{font:inherit;font-weight:600;padding:9px 16px;border-radius:10px;border:1px solid var(--sep2,#ccc);
  background:var(--card,#fff);color:inherit;cursor:pointer;min-height:40px}
.dlg-portal button.dlg-ok{background:var(--azul,#0a66d8);border-color:transparent;color:#fff}
.dlg-portal button.dlg-ok.peligro{background:var(--rojo,#DC001B)}
.dlg-portal button:focus-visible{outline:3px solid var(--acc-ring,rgba(220,0,27,.35));outline-offset:2px}`;

let estilo = false;
function ponerEstilo() {
  if (estilo || typeof document === 'undefined') return; estilo = true;
  const s = document.createElement('style'); s.id = 'dlg-portal-css'; s.textContent = CSS; document.head.appendChild(s);
}
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// tipo: 'confirmar' | 'texto' | 'aviso'. Devuelve true/false, el texto (o null) o undefined.
function abrir(tipo, mensaje, o = {}) {
  ponerEstilo();
  // Sin <dialog> (navegador muy antiguo) o en las pruebas automáticas (window.__dialogosNativos): los del navegador.
  if (typeof HTMLDialogElement === 'undefined' || window.__dialogosNativos) {
    if (tipo === 'texto') return Promise.resolve(window.prompt(mensaje, o.valor || ''));
    if (tipo === 'aviso') { window.alert(mensaje); return Promise.resolve(); }
    return Promise.resolve(window.confirm(mensaje));
  }
  return new Promise((res) => {
    const d = document.createElement('dialog'); d.className = 'dlg-portal';
    d.setAttribute('aria-label', o.titulo || (tipo === 'aviso' ? 'Aviso' : 'Confirmación'));
    const ok = o.aceptar || (tipo === 'aviso' ? 'Entendido' : 'Aceptar');
    d.innerHTML = `<form method="dialog"><p class="dlg-txt">${esc(mensaje)}</p>
      ${tipo === 'texto' ? `<input name="t" autocomplete="off" value="${esc(o.valor || '')}" aria-label="Respuesta">` : ''}
      <div class="dlg-acts">${tipo === 'aviso' ? '' : `<button value="no" type="submit">${esc(o.cancelar || 'Cancelar')}</button>`}
      <button value="si" type="submit" class="dlg-ok ${o.peligro ? 'peligro' : ''}">${esc(ok)}</button></div></form>`;
    // En pantalla completa el diálogo tiene que colgar del elemento que está a pantalla completa para verse.
    (document.fullscreenElement || document.body).appendChild(d);
    let hecho = false;
    const fin = (v) => { if (hecho) return; hecho = true; d.close(); d.remove(); res(v); };
    d.addEventListener('close', () => fin(tipo === 'confirmar' ? d.returnValue === 'si' : tipo === 'texto' ? (d.returnValue === 'si' ? d.querySelector('input').value : null) : undefined));
    d.addEventListener('cancel', (e) => { e.preventDefault(); d.returnValue = 'no'; d.close(); });
    // Enter en el campo de texto = Aceptar (si no, el formulario usaría el primer botón, «Cancelar»).
    d.querySelector('input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); d.close('si'); } });
    d.showModal();
    const foco = tipo === 'texto' ? d.querySelector('input') : d.querySelector(o.peligro ? 'button[value=no]' : '.dlg-ok');
    foco?.focus(); if (tipo === 'texto') foco.select();
  });
}
export const confirmar = (mensaje, o) => abrir('confirmar', mensaje, o);
export const pedirTexto = (mensaje, o) => abrir('texto', mensaje, o);
export const avisar = (mensaje, o) => abrir('aviso', mensaje, o);
