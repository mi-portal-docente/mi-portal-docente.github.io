// Interfaz del laboratorio p5.js: editor de código, lienzo aislado (iframe sandbox="allow-scripts",
// sin acceso al portal ni a la sesión) y consola de errores en castellano. Lo usan la página del
// laboratorio (#cdpc1/p5) y los elementos «Laboratorio p5.js» de Trabajo de clase.
import { ic } from '../ui/iconos.js';
import { evaluarComprobacion, textoComprobacion, traducirError } from '../lms/motores/p5.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const P5_URL = () => new URL('vendor/p5/p5.min.js?v=1.11.13', document.baseURI).href;
const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };

// Documento del lienzo. El código del alumno va en su propio <script>; LINEA0 = línea donde empieza.
function documento(codigo, token) {
  const pre = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff;overflow:hidden}canvas{display:block}</style>
<script>(function(){var T=${JSON.stringify(token)};function env(t,d){d=d||{};d.p5lab=T;d.t=t;parent.postMessage(d,'*');}window.__env=env;
window.onerror=function(m,s,l,c,e){env('error',{msg:String(m),line:l||0,name:e&&e.name||''});return true;};
['log','info','warn','error'].forEach(function(k){var o=console[k];console[k]=function(){var a=[].slice.call(arguments).map(function(x){try{return typeof x==='object'?JSON.stringify(x):String(x);}catch(er){return String(x);}});env('log',{k:k,msg:a.join(' ').slice(0,500)});try{o.apply(console,arguments);}catch(er){}};});
window.addEventListener('message',function(ev){var d=ev.data||{};if(d.p5lab!==T||d.t!=='medir')return;var r={variables:{},pixeles:{}};
(d.variables||[]).forEach(function(n){if(!/^[A-Za-z_$][\\w$]*$/.test(n))return;try{var v=(0,eval)('typeof '+n+'!=="undefined"?'+n+':undefined');r.variables[n]={existe:v!==undefined,v:(typeof v==='number'||typeof v==='string'||typeof v==='boolean')?v:(v===undefined?null:String(v))};}catch(er){r.variables[n]={existe:false,v:null};}});
(d.pixeles||[]).forEach(function(p){try{if(typeof get==='function'){var c=get(p[0],p[1]);r.pixeles[p[0]+','+p[1]]=[c[0],c[1],c[2]];}}catch(er){}});env('medidas',r);});
})();</script>
<script src="${P5_URL()}"></script>
</head><body><script>
`;
  const post = `
</script><script>window.addEventListener('load',function(){setTimeout(function(){window.__env('listo',{});},60);});</script></body></html>`;
  return { html: pre + String(codigo).replace(/<\/script/gi, '<\\/script') + post, linea0: pre.split('\n').length };
}

// Monta el editor de una lista de retos (o un único «modo libre» si retos está vacío).
// ctx: { clave, titulo, rol, entregar?(texto) → Promise, entregadoTexto?, nota?, aviso? }
export function montarP5(nodo, retos, ctx = {}) {
  const libre = !retos.length;
  const R = libre ? [{ id: 'libre', titulo: 'Modo libre', enunciado: 'Escribe tu programa y pulsa «Ejecutar».', codigo: 'function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(220);\n  circle(mouseX, mouseY, 40);\n}\n', pistas: [], comprobaciones: [] }] : retos;
  const clave = ctx.clave || 'p5lab';
  const est = { i: Math.min(Math.max(0, ctx.inicio || 0), R.length - 1), pistas: 0, token: '', linea0: 0, superados: {}, resultados: null };
  try { Object.assign(est.superados, JSON.parse(leer(clave + ':ok') || '{}')); } catch (e) { /* nada */ }
  const codigoDe = (r) => leer(`${clave}:${r.id}`) ?? r.codigo;
  nodo.classList.add('p5l');
  nodo.innerHTML = `${R.length > 1 ? `<nav class="p5-retos" aria-label="Retos" data-p5-nav></nav>` : ''}
  <div class="p5-grid">
    <section class="p5-izq" aria-label="Enunciado y código">
      <div class="p5-enun" data-p5="enun" aria-live="polite"></div>
      <div class="p5-ed"><pre class="p5-num" aria-hidden="true" data-p5="num"></pre><textarea data-p5="codigo" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Código del programa (Tab sangra; Esc y luego Tab para salir)" aria-describedby="p5Ayuda"></textarea></div>
      <p class="muted p5-ayuda" id="p5Ayuda">Tab sangra el código. Para salir del editor con el teclado pulsa Esc y luego Tab.</p>
      <div class="p5-bot">
        <button type="button" class="btn" data-p5a="ejecutar">${ic('play')} Ejecutar</button>
        <button type="button" class="btn sec" data-p5a="parar">${ic('square')} Parar</button>
        ${libre ? '' : `<button type="button" class="btn sec" data-p5a="comprobar">${ic('list-checks')} Comprobar</button>`}
        <button type="button" class="btn sec" data-p5a="pista">${ic('lightbulb')} Pista</button>
        <button type="button" class="btn sec" data-p5a="reiniciar">${ic('rotate-ccw')} Código inicial</button>
      </div>
      <div class="p5-res" data-p5="res" aria-live="polite"></div>
      ${ctx.entregar ? `<div class="p5-ent" data-p5="ent"></div>` : ''}
    </section>
    <section class="p5-der" aria-label="Lienzo y consola">
      <div class="p5-lienzo" data-p5="lienzo"><p class="muted">Pulsa «Ejecutar» para ver tu programa.</p></div>
      <div class="p5-con-h">${ic('terminal')} Consola</div>
      <div class="p5-con" data-p5="con" role="log" aria-live="polite" aria-label="Consola: errores y mensajes"></div>
    </section>
  </div>`;
  const $ = (s) => nodo.querySelector(s);
  const ta = $('[data-p5="codigo"]'); const num = $('[data-p5="num"]');
  const numerar = () => { const n = ta.value.split('\n').length; num.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n'); num.scrollTop = ta.scrollTop; };
  let iframe = null; let espera = null;
  const con = (cls, html) => { const c = $('[data-p5="con"]'); const d = document.createElement('div'); d.className = 'p5-ln ' + cls; d.innerHTML = html; c.appendChild(d); while (c.children.length > 200) c.firstChild.remove(); c.scrollTop = c.scrollHeight; };
  function parar() { if (iframe) iframe.remove(); iframe = null; est.token = ''; }
  function ejecutar() {
    parar(); $('[data-p5="con"]').innerHTML = ''; est.errores = 0; est.listo = false;
    const token = Math.random().toString(36).slice(2); const d = documento(ta.value, token); est.token = token; est.linea0 = d.linea0;
    iframe = document.createElement('iframe'); iframe.setAttribute('sandbox', 'allow-scripts'); iframe.setAttribute('allow', 'accelerometer; gyroscope; magnetometer'); iframe.setAttribute('title', 'Lienzo de tu programa p5.js');
    iframe.className = 'p5-if'; iframe.srcdoc = d.html; const L = $('[data-p5="lienzo"]'); L.innerHTML = ''; L.appendChild(iframe);
    guardar(`${clave}:${R[est.i].id}`, ta.value);
  }
  function onMsg(e) {
    const d = e.data; if (!d || !est.token || d.p5lab !== est.token || !iframe || e.source !== iframe.contentWindow) return;
    if (d.t === 'error') {
      est.errores++;
      const linea = d.line && d.line >= est.linea0 ? d.line - est.linea0 + 1 : 0;
      const msg = /^Script error\.?$/.test(d.msg) ? 'Error dentro de p5.js: revisa los valores que pasas a sus funciones (números, colores, tamaños).' : traducirError(d.msg);
      con('err', `${ic('circle-x')} ${linea ? `<b>Línea ${linea}:</b> ` : ''}${esc(msg)}<span class="p5-orig">${esc(d.msg)}</span>`);
    } else if (d.t === 'log') con(d.k === 'error' || d.k === 'warn' ? 'warn' : 'log', esc(d.msg));
    else if (d.t === 'listo') { est.listo = true; if (espera?.listo) espera.listo(); }
    else if (d.t === 'medidas') { if (espera?.medidas) espera.medidas(d); }
  }
  window.addEventListener('message', onMsg);
  // Ejecuta el programa, espera a que dibuje y mide variables y píxeles
  function medir(reto) {
    return new Promise((res) => {
      const vars = reto.comprobaciones.filter((c) => c.tipo === 'variable').map((c) => c.nombre);
      const pix = reto.comprobaciones.filter((c) => c.tipo === 'pixel').map((c) => [c.x, c.y]);
      let hecho = false; const fin = (m) => { if (hecho) return; hecho = true; espera = null; res({ ...(m || {}), errores: est.errores }); };
      espera = { listo: () => setTimeout(() => { if (!iframe) return fin(null); iframe.contentWindow.postMessage({ p5lab: est.token, t: 'medir', variables: vars, pixeles: pix }, '*'); }, 500), medidas: (d) => fin(d) };
      ejecutar(); setTimeout(() => fin(null), 6000);
    });
  }
  async function comprobar() {
    const r = R[est.i]; const box = $('[data-p5="res"]'); box.innerHTML = `<p class="muted">${ic('hourglass')} Comprobando…</p>`;
    const m = await medir(r);
    const L = r.comprobaciones.map((c) => ({ c, ok: evaluarComprobacion(c, ta.value, m) }));
    const sinErr = !m.errores; const ok = sinErr && L.every((x) => x.ok);
    est.superados[r.id] = ok; guardar(clave + ':ok', JSON.stringify(est.superados));
    box.innerHTML = `<div class="p5-veredicto ${ok ? 'ok' : 'mal'}">${ok ? `${ic('circle-check')} ¡Reto superado!` : `${ic('circle-x')} Todavía no: revisa lo que falta.`}</div>
      <ul class="p5-checks">${!sinErr ? `<li class="mal">${ic('x')} El programa se ejecuta sin errores (mira la consola)</li>` : ''}${L.map((x) => `<li class="${x.ok ? 'ok' : 'mal'}">${ic(x.ok ? 'check' : 'x')} ${esc(textoComprobacion(x.c))}</li>`).join('')}</ul>`;
    pintarNav(); pintarEnt();
  }
  const aciertos = () => R.filter((r) => est.superados[r.id]).length;
  function textoEntrega() {
    const partes = R.map((r, i) => `--- Reto ${i + 1}: ${r.titulo} (${est.superados[r.id] ? 'superado' : 'sin superar'}) ---\n${(i === est.i ? ta.value : codigoDe(r)).slice(0, 4000)}`);
    return `${ctx.titulo || 'Laboratorio p5.js'}. Aciertos: ${aciertos()}/${R.length}\n\n${partes.join('\n\n')}`.slice(0, 10000);
  }
  function pintarEnt() {
    const b = $('[data-p5="ent"]'); if (!b) return;
    const prev = ctx.entregadoTexto ? `<p class="muted">${ic('check')} Ya entregaste: ${esc((ctx.entregadoTexto.match(/Aciertos: \d+\/\d+/) || [''])[0])}${ctx.nota ? ` · Nota: <b>${esc(ctx.nota)}</b>` : ''}. Puedes volver a entregar mientras no esté calificado.</p>` : '';
    b.innerHTML = `${prev}<p>Retos superados: <b>${aciertos()}/${R.length}</b></p><button type="button" class="btn" data-p5a="entregar">${ic('send')} Entregar el código</button><span class="p5-entmsg" role="status"></span>`;
  }
  function pintarNav() {
    const n = $('[data-p5-nav]'); if (!n) return;
    n.innerHTML = R.map((r, i) => `<button type="button" class="p5-rt${i === est.i ? ' on' : ''}" data-p5r="${i}" ${i === est.i ? 'aria-current="step"' : ''}>${est.superados[r.id] ? ic('circle-check') : ic('circle-dot')} ${i + 1}. ${esc(r.titulo)}</button>`).join('');
  }
  function pintarReto() {
    const r = R[est.i]; est.pistas = 0;
    $('[data-p5="enun"]').innerHTML = `<h2 class="p5-tit">${esc(r.titulo)}</h2><p>${esc(r.enunciado).replace(/\n/g, '<br>')}</p>${r.comprobaciones.length ? `<details class="p5-crit"><summary>Qué se comprueba (${r.comprobaciones.length})</summary><ul>${r.comprobaciones.map((c) => `<li>${esc(textoComprobacion(c))}</li>`).join('')}</ul></details>` : ''}<div class="p5-pistas" data-p5="pistas"></div>`;
    $('[data-p5a="pista"]').hidden = !r.pistas.length;
    ta.value = codigoDe(r); numerar(); $('[data-p5="res"]').innerHTML = ''; pintarNav(); pintarEnt(); parar();
    $('[data-p5="lienzo"]').innerHTML = '<p class="muted">Pulsa «Ejecutar» para ver tu programa.</p>'; $('[data-p5="con"]').innerHTML = '';
  }
  async function onClick(e) {
    const rb = e.target.closest('[data-p5r]'); if (rb) { guardar(`${clave}:${R[est.i].id}`, ta.value); est.i = Number(rb.dataset.p5r); return pintarReto(); }
    const b = e.target.closest('[data-p5a]'); if (!b) return; const a = b.dataset.p5a; const r = R[est.i];
    if (a === 'ejecutar') ejecutar();
    else if (a === 'parar') { parar(); $('[data-p5="lienzo"]').innerHTML = '<p class="muted">Programa parado.</p>'; }
    else if (a === 'comprobar') comprobar();
    else if (a === 'pista') { if (est.pistas < r.pistas.length) est.pistas++; $('[data-p5="pistas"]').innerHTML = r.pistas.slice(0, est.pistas).map((p, i) => `<p class="p5-pista">${ic('lightbulb')} <b>Pista ${i + 1}:</b> ${esc(p)}</p>`).join(''); if (est.pistas >= r.pistas.length) b.disabled = true; }
    else if (a === 'reiniciar') { if (confirm('¿Volver al código inicial del reto? Se perderán tus cambios.')) { ta.value = r.codigo; numerar(); guardar(`${clave}:${r.id}`, ta.value); } }
    else if (a === 'entregar') {
      const m = $('.p5-entmsg'); b.disabled = true; m.textContent = 'Entregando…';
      try { guardar(`${clave}:${r.id}`, ta.value); const t = textoEntrega(); await ctx.entregar(t); ctx.entregadoTexto = t; pintarEnt(); $('.p5-entmsg').textContent = 'Entregado. Tu profesor verá el código en el cuaderno.'; }
      catch (er) { m.textContent = 'No se pudo entregar: ' + (er.message || er); b.disabled = false; }
    }
  }
  function onKey(e) {
    if (e.target !== ta) return;
    if (e.key === 'Escape') { ta.dataset.salir = '1'; return; }
    if (e.key === 'Tab' && !ta.dataset.salir) { e.preventDefault(); const s = ta.selectionStart; const f = ta.selectionEnd; ta.setRangeText('  ', s, f, 'end'); numerar(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); ejecutar(); return; }
    delete ta.dataset.salir;
  }
  nodo.addEventListener('click', onClick); nodo.addEventListener('keydown', onKey);
  let tGuardar = 0; ta.addEventListener('input', () => { numerar(); clearTimeout(tGuardar); tGuardar = setTimeout(() => guardar(`${clave}:${R[est.i].id}`, ta.value), 600); }); ta.addEventListener('scroll', () => { num.scrollTop = ta.scrollTop; });
  pintarReto();
  return {
    destruir() { parar(); window.removeEventListener('message', onMsg); nodo.removeEventListener('click', onClick); nodo.removeEventListener('keydown', onKey); },
    actualizar(o = {}) { if ('entregadoTexto' in o) ctx.entregadoTexto = o.entregadoTexto; if ('nota' in o) ctx.nota = o.nota; pintarEnt(); },
    comprobar, ejecutar, estado: () => ({ i: est.i, superados: { ...est.superados }, aciertos: aciertos(), total: R.length }),
  };
}
