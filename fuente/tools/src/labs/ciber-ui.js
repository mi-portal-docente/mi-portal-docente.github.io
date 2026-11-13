// Ciberseguridad: bandeja de correos (¿phishing?), medidor de contraseñas (no se guarda ni se envía la
// contraseña) y red de una pyme con sus riesgos.
import { ic } from '../ui/iconos.js';
import { fuerzaContrasena, NIVELES, partesCiber } from '../lms/motores/ciber.js';
import { esc, leerJSON, guardar, cajaEntrega } from './comun.js';

const ICONO_NODO = { router: 'router', servidor: 'server', pc: 'monitor', portatil: 'laptop', movil: 'smartphone', wifi: 'wifi', impresora: 'printer', camara: 'cctv', nube: 'cloud', internet: 'globe', switch: 'network' };
export function montarCiber(nodo, c, ctx = {}) {
  const clave = ctx.clave || 'ciberlab'; const est = leerJSON(clave, { correos: {}, pass: false, red: {} });
  const partes = [c.correos && ['correos', 'Bandeja de entrada', 'inbox'], c.contrasena && ['pass', 'Contraseñas', 'key-round'], c.red && ['red', 'Red de la empresa', 'network']].filter(Boolean);
  let tab = partes[0][0]; let correo = 0; let nodoSel = null;
  nodo.classList.add('cbl');
  const aciertos = () => (c.correos || []).filter((m, i) => est.correos[i] === m.phishing).length + (c.contrasena && est.pass ? 1 : 0) + (c.red ? c.red.nodos.filter((n) => n.riesgo && est.red[n.id] === n.riesgo.correcta).length : 0);
  const total = partesCiber(c);
  nodo.innerHTML = `${ctx.entregar ? `<p class="muted cb-aviso">${ic('info')} Es una tarea: en los correos y en la red cuenta tu primera respuesta.</p>` : ''}<div class="cb-tabs" role="tablist">${partes.map(([k, n, i]) => `<button type="button" role="tab" data-cbt="${k}">${ic(i)} ${n}</button>`).join('')}</div><div class="cb-panel" data-cb="panel"></div><div data-cb="ent"></div>`;
  const $ = (s) => nodo.querySelector(s);
  const ent = cajaEntrega($('[data-cb=ent]'), ctx, () => ({ a: aciertos(), t: total, texto: `${ctx.titulo || 'Ciberseguridad'}. Aciertos: ${aciertos()}/${total}\n\n${[
    ...(c.correos || []).map((m, i) => `Correo «${m.asunto}»: ${est.correos[i] == null ? 'sin responder' : est.correos[i] ? 'phishing' : 'fiable'} (${est.correos[i] === m.phishing ? 'bien' : 'mal'})`),
    ...(c.contrasena ? [`Contraseña de nivel «${c.contrasena.minimo}» o más: ${est.pass ? 'conseguida' : 'no conseguida'} (la contraseña no se guarda)`] : []),
    ...(c.red ? c.red.nodos.filter((n) => n.riesgo).map((n) => `Riesgo en ${n.nombre}: ${est.red[n.id] == null ? 'sin responder' : n.riesgo.opciones[est.red[n.id]]} (${est.red[n.id] === n.riesgo.correcta ? 'bien' : 'mal'})`) : [])].join('\n')}` }));
  const salvar = () => { guardar(clave, JSON.stringify(est)); ent.pintar(); pintarTabs(); };
  function pintarTabs() { nodo.querySelectorAll('[data-cbt]').forEach((b) => { b.classList.toggle('on', b.dataset.cbt === tab); b.setAttribute('aria-selected', b.dataset.cbt === tab); }); }
  function correosHTML() {
    const L = c.correos; const m = L[correo]; const r = est.correos[correo];
    return `<div class="cb-mail"><ul class="cb-bandeja" aria-label="Correos">${L.map((x, i) => `<li><button type="button" data-cbm="${i}" class="${i === correo ? 'on' : ''}">${est.correos[i] == null ? ic('mail') : est.correos[i] === x.phishing ? ic('circle-check') : ic('circle-x')}<span><b>${esc(x.de)}</b><small>${esc(x.asunto)}</small></span></button></li>`).join('')}</ul>
      <article class="cb-leer"><header><div><small>De:</small> <b>${esc(m.de)}</b></div><h3>${esc(m.asunto)}</h3></header><p>${esc(m.cuerpo).replace(/\n/g, '<br>')}</p>
      ${m.enlace ? `<p class="cb-enl">${ic('link')} <span class="cb-url" tabindex="0" title="${esc(m.enlace)}">Pulsa aquí</span> <small class="muted">(el enlace lleva a: <code>${esc(m.enlace)}</code>)</small></p>` : ''}
      <div class="cb-dec" role="group" aria-label="¿Qué es este correo?"><button type="button" class="btn sec" data-cbd="0">${ic('shield-check')} Es fiable</button><button type="button" class="btn sec" data-cbd="1">${ic('fish')} Es phishing</button></div>
      ${r != null ? `<div class="cb-fb ${r === m.phishing ? 'ok' : 'mal'}">${r === m.phishing ? `${ic('circle-check')} ¡Bien!` : `${ic('circle-x')} No.`} ${m.phishing ? 'Es phishing.' : 'Es un correo fiable.'} ${esc(m.explicacion || '')}</div>` : ''}</article></div>`;
  }
  function passHTML() {
    return `<div class="cb-pass"><p>Escribe una contraseña inventada para medir su fuerza. <b>No se guarda ni se envía</b>: solo se mide en tu navegador. Objetivo: nivel <b>${esc(c.contrasena.minimo)}</b> o más.</p>
      <label>Contraseña de prueba<span class="cb-pin"><input type="password" data-cbp autocomplete="off" spellcheck="false"><button type="button" class="btn sec" data-cbver aria-label="Mostrar u ocultar la contraseña">${ic('eye')}</button></span></label>
      <div class="cb-medidor" aria-hidden="true"><span data-cbbar></span></div><p data-cbniv aria-live="polite"></p><ul class="cb-cons" data-cbcons></ul>${est.pass ? `<p class="cb-fb ok">${ic('circle-check')} Objetivo conseguido.</p>` : ''}</div>`;
  }
  function redHTML() {
    const R = c.red; const pos = Object.fromEntries(R.nodos.map((n) => [n.id, n]));
    const sel = nodoSel && pos[nodoSel];
    return `<div class="cb-red">${R.titulo ? `<h3>${esc(R.titulo)}</h3>` : ''}<p class="muted">Pulsa los equipos marcados con ${ic('shield-exclamation-point')} para revisar su riesgo.</p>
      <div class="cb-mapa"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${R.enlaces.map((e) => `<line x1="${pos[e.a].x}" y1="${pos[e.a].y}" x2="${pos[e.b].x}" y2="${pos[e.b].y}" class="${e.wifi ? 'wifi' : ''}"/>`).join('')}</svg>
      ${R.nodos.map((n) => { const r = est.red[n.id]; const cls = n.riesgo ? (r == null ? 'riesgo' : r === n.riesgo.correcta ? 'ok' : 'mal') : ''; return `<button type="button" class="cb-nodo ${cls}${nodoSel === n.id ? ' on' : ''}" style="left:${n.x}%;top:${n.y}%" data-cbn="${esc(n.id)}" title="${esc(n.nombre)}" aria-label="${esc(n.nombre)}${n.riesgo && r == null ? " (riesgo por revisar)" : ""}" ${n.riesgo ? '' : 'disabled'}>${ic(ICONO_NODO[n.tipo])}<span>${esc(n.nombre)}</span>${n.riesgo && r == null ? `<i>${ic('shield-exclamation-point')}</i>` : ''}</button>`; }).join('')}</div>
      ${sel?.riesgo ? `<div class="cb-q"><h4>${ic(ICONO_NODO[sel.tipo])} ${esc(sel.nombre)}</h4><p>${esc(sel.riesgo.pregunta)}</p><div class="cb-ops">${sel.riesgo.opciones.map((o, i) => `<button type="button" class="btn sec${est.red[sel.id] === i ? (i === sel.riesgo.correcta ? ' ok' : ' mal') : ''}" data-cbo="${i}">${esc(o)}</button>`).join('')}</div>
        ${est.red[sel.id] != null ? `<div class="cb-fb ${est.red[sel.id] === sel.riesgo.correcta ? 'ok' : 'mal'}">${est.red[sel.id] === sel.riesgo.correcta ? `${ic('circle-check')} ¡Bien!` : `${ic('circle-x')} No es la mejor medida.`} ${esc(sel.riesgo.explicacion || '')}</div>` : ''}</div>` : ''}</div>`;
  }
  function medir() {
    const i = $('[data-cbp]'); if (!i) return; const f = fuerzaContrasena(i.value);
    $('[data-cbbar]').style.width = `${i.value ? (f.nivel + 1) * 20 : 0}%`; $('[data-cbbar]').className = 'n' + f.nivel;
    $('[data-cbniv]').innerHTML = i.value ? `Nivel: <b>${esc(f.nombre)}</b> (≈ ${f.bits} bits)` : '';
    $('[data-cbcons]').innerHTML = i.value ? f.consejos.map((x) => `<li>${esc(x)}</li>`).join('') : '';
    if (i.value && f.nivel >= NIVELES.indexOf(c.contrasena.minimo) && !est.pass) { est.pass = true; salvar(); const p = document.createElement('p'); p.className = 'cb-fb ok'; p.innerHTML = `${ic('circle-check')} Objetivo conseguido.`; $('.cb-pass').appendChild(p); }
  }
  function pintar() { const P = $('[data-cb=panel]'); P.innerHTML = tab === 'correos' ? correosHTML() : tab === 'pass' ? passHTML() : redHTML(); pintarTabs(); }
  nodo.addEventListener('input', (e) => { if (e.target.matches('[data-cbp]')) medir(); });
  nodo.addEventListener('click', (e) => {
    const t = e.target.closest('[data-cbt]'); if (t) { tab = t.dataset.cbt; return pintar(); }
    const m = e.target.closest('[data-cbm]'); if (m) { correo = Number(m.dataset.cbm); return pintar(); }
    const d = e.target.closest('[data-cbd]'); if (d) { if (ctx.entregar && est.correos[correo] != null) return; est.correos[correo] = d.dataset.cbd === '1'; salvar(); return pintar(); }
    if (e.target.closest('[data-cbver]')) { const i = $('[data-cbp]'); i.type = i.type === 'password' ? 'text' : 'password'; return; }
    const n = e.target.closest('[data-cbn]'); if (n) { nodoSel = n.dataset.cbn; return pintar(); }
    const o = e.target.closest('[data-cbo]'); if (o) { if (ctx.entregar && est.red[nodoSel] != null) return; est.red[nodoSel] = Number(o.dataset.cbo); salvar(); return pintar(); }
  });
  pintar();
  return { destruir() {}, actualizar: (o) => ent.actualizar(o) };
}
