import { SUBJECTS, CENTRO, APARTADOS } from './subjects.js';
import { CircuitLab } from './circ/lab.js';
import { ViviendaLab } from './viv/lab.js';
import { PRACTICES } from './circ/practices.js';
import { Viewer, WIRE_CSS } from './scene.js';
import { LESSONS } from './lessons.js';
import { MODULO, RA, SOFTWARE_STEPS, LIBS, TOOLS_BASE, SAFETY_BASE, BOARD_GUIDE, WIRE_TYPES, BOARD_URL } from './common.js';
import { boardDesc, boardShort, COLOR_NAME } from './describe.js';
import { BIBLIOTECA, asignatura } from './lms/biblioteca.js';
import { bibliotecaHTML, enlazarBiblioteca, tarjetaAsig } from './lms/vistas-biblio.js';
import { asigHTML, pestañas, pestañaPorDefecto } from './asig.js';
import { Actividad3D } from './act/motor.js';
import { actividad, enlaceActividad } from './act/registro.js';
import { instalarIconos, ic } from './ui/iconos.js';
import { calidad } from './kit3d/base.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const params = new URLSearchParams(location.search);
const RENDER = params.get('render') === '1';

// ---------- utilidades de cables ----------
const TERMINALS = { relay: ['COM', 'NO', 'NC'], l298n: ['OUT1', 'OUT2', 'OUT3', 'OUT4', '+12V', 'GND', '+5V'] };
function endType(L, ref) {
  if (/^(D|A|I)\d/.test(ref)) return 'H';
  if (/^P\./.test(ref)) return 'M';
  if (ref === 'DC') return 'DC';
  const [pid, pin] = ref.split('.'); const p = L.parts[pid];
  if (!p) return '?';
  if ((TERMINALS[p.type] || []).includes(pin)) return 'M';
  if (['pump', 'motor', 'servo'].includes(p.type)) return 'LEAD';
  if (p.type === 'battery') return 'DC';
  if (p.type === 'breadboard') return 'M';
  return 'H';
}
function cableType(L, w) {
  const a = endType(L, w.from), b = endType(L, w.to);
  if (a === 'DC' || b === 'DC') return 'Clavija DC';
  if (a === 'LEAD' || b === 'LEAD') { const p = L.parts[(a === 'LEAD' ? w.from : w.to).split('.')[0]]; return p.type === 'servo' ? 'Conector del servo' : 'Cable propio del componente'; }
  const s = [a, b].sort().join('-');
  return { 'H-H': 'H-H', 'H-M': 'M-H', 'M-M': 'M-M' }[s] || s;
}
function partPinName(L, ref) {
  if (/^(D|A|I)\d|^P\.|^DC$/.test(ref)) return null;
  const [pid, pin] = ref.split('.'); const p = L.parts[pid];
  const base = (p.label || p.type).split('→')[0].trim();
  if ((TERMINALS[p.type] || []).includes(pin)) return `<b>borne ${esc(pin)}</b> de: ${esc(base)}`;
  const pinTxt = { marron: 'cable marrón', rojo: 'cable rojo', naranja: 'cable naranja', negro: 'cable negro', dc: 'clavija', c55a: 'columna 55, fila a', c55c: 'columna 55, fila c' }[pin] || ('pin ' + pin);
  return `<b>${esc(pinTxt)}</b> de: ${esc(base)}`;
}
function endDesc(L, ref) { return partPinName(L, ref) || boardDesc(ref); }
function endShort(L, ref) {
  const n = partPinName(L, ref); if (!n) return boardShort(ref);
  const [pid, pin] = ref.split('.'); const p = L.parts[pid];
  return (p.label || p.type).split('→')[0].trim() + ' · ' + pin;
}
const swatch = (c) => `<span class="sw" style="background:${WIRE_CSS[c] || '#888'}"></span>`;

// ---------- resaltado de código Arduino ----------
const KW = /\b(const|int|float|bool|void|if|else|for|while|return|unsigned|long|char|true|false|byte|static|break|case|switch|do|String)\b/;
const FN = /\b(setup|loop|pinMode|digitalWrite|digitalRead|analogRead|analogWrite|analogReadMilliVolts|analogReadResolution|analogSetPinAttenuation|delay|delayMicroseconds|millis|tone|noTone|pulseIn|map|constrain|min|max|abs|ledcAttach|ledcWrite|Serial|Wire|begin|print|println)\b/;
function highlight(code) {
  const re = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)')|(#\w+[^\n]*)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index)); last = re.lastIndex;
    const t = esc(m[0]);
    if (m[1]) out += `<span class="c-com">${t}</span>`;
    else if (m[2]) out += `<span class="c-str">${t}</span>`;
    else if (m[3]) out += `<span class="c-pre">${t}</span>`;
    else if (m[4]) out += `<span class="c-num">${t}</span>`;
    else if (KW.test(m[0]) && m[0].match(KW)[0] === m[0]) out += `<span class="c-kw">${t}</span>`;
    else if (FN.test(m[0]) && m[0].match(FN)[0] === m[0]) out += `<span class="c-fn">${t}</span>`;
    else if (/^[A-Z][A-Z0-9_]+$/.test(m[0])) out += `<span class="c-const">${t}</span>`;
    else out += t;
  }
  return out + esc(code.slice(last));
}

// ---------- esquema SVG ----------
function schematic(L) {
  const boardRefs = [], partPins = {};
  const isBoard = (r) => /^(D|A|I)\d|^P\.|^DC$/.test(r);
  for (const w of L.wires) for (const r of [w.from, w.to]) {
    if (isBoard(r)) { if (!boardRefs.includes(r)) boardRefs.push(r); }
    else { const [pid, pin] = r.split('.'); (partPins[pid] = partPins[pid] || []); if (!partPins[pid].includes(pin)) partPins[pid].push(pin); }
  }
  const order = (r) => { const m = r.match(/^(D|A|I|P)/); return ({ D: 0, A: 1, I: 2, P: 3 }[m ? m[1] : 'Z'] ?? 4) * 1000 + boardRefs.indexOf(r); };
  boardRefs.sort((a, b) => order(a) - order(b));
  const RH = 24, top = 16, bx = 8, bw = 168;
  const yB = {}; boardRefs.forEach((r, i) => yB[r] = top + 30 + i * RH);
  const bh = boardRefs.length * RH + 40;
  // componentes en el orden de la primera aparición
  const pids = Object.keys(partPins);
  const px = 392, pw = 196; let y = top; const yP = {}; const boxes = [];
  for (const pid of pids) {
    const pins = partPins[pid]; const p = L.parts[pid];
    boxes.push({ pid, y, h: pins.length * RH + 34, label: (p.label || p.type).split('→')[0].trim() });
    pins.forEach((pin, i) => yP[pid + '.' + pin] = y + 28 + i * RH + 6);
    y += pins.length * RH + 34 + 18;
  }
  const H = Math.max(top + bh, y) + 10, W = 600 + Math.max(0, L.wires.filter(w => !isBoard(w.from) && !isBoard(w.to)).length) * 14;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="schem" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif">`;
  s += `<rect x="${bx}" y="${top}" width="${bw}" height="${bh}" rx="8" fill="#15171a"/><text x="${bx + bw / 2}" y="${top + 20}" fill="#fff" font-size="13" font-weight="700" text-anchor="middle">ESP32 Plus · interruptor ${L.switch === '5V' ? '5V' : '3.3V'}</text>`;
  for (const r of boardRefs) s += `<text x="${bx + bw - 10}" y="${yB[r] + 6}" fill="#fff" font-size="13.5" text-anchor="end">${esc(boardShort(r))}</text><circle cx="${bx + bw}" cy="${yB[r] + 2}" r="3.5" fill="#f39900"/>`;
  for (const b of boxes) {
    s += `<rect x="${px}" y="${b.y}" width="${pw}" height="${b.h}" rx="8" fill="#fff" stroke="#51626F" stroke-width="1.5"/><text x="${px + pw / 2}" y="${b.y + 18}" font-size="14" font-weight="700" fill="#DC001B" text-anchor="middle">${esc(b.label)}</text>`;
    for (const pin of partPins[b.pid]) { const yy = yP[b.pid + '.' + pin]; s += `<circle cx="${px}" cy="${yy - 4}" r="3.5" fill="#51626F"/><text x="${px + 10}" y="${yy}" font-size="13.5" fill="#222">${esc(pin.replace(/^c55/, 'col.55 '))}</text>`; }
  }
  let lane = 0, rlane = 0;
  for (const w of L.wires) {
    const col = WIRE_CSS[w.color] || '#888'; const stroke = w.color === 'blanco' ? '#bbb' : col;
    const a = isBoard(w.from) ? w.from : (isBoard(w.to) ? w.to : null);
    if (a) {
      const other = a === w.from ? w.to : w.from;
      const y1 = yB[a] + 2, y2 = yP[other] - 4; const x1 = bx + bw, x2 = px; const xm = 190 + (lane++ % 20) * 10;
      s += `<path d="M${x1} ${y1} H${xm} V${y2} H${x2}" fill="none" stroke="${stroke}" stroke-width="2.4" ${w.color === 'blanco' ? 'stroke-dasharray="6 3"' : ''}/>`;
    } else {
      const y1 = yP[w.from] - 4, y2 = yP[w.to] - 4; const xr = px + pw + 14 + (rlane++) * 12;
      s += `<path d="M${px} ${y1} H${px - 12} M${px + pw} ${y1} H${xr} V${y2} H${px + pw}" fill="none" stroke="${stroke}" stroke-width="2.4"/>`;
      s += `<circle cx="${px + pw}" cy="${y1}" r="3" fill="${stroke}"/><circle cx="${px + pw}" cy="${y2}" r="3" fill="${stroke}"/>`;
    }
  }
  return s + '</svg>';
}

// ---------- contenido de pestañas ----------
function raBlock(L) {
  return Object.entries(L.ra).map(([n, ces]) => `<div class="ra"><div class="ra-h"><span class="tag">RA${n}</span> ${esc(RA[n].t)}</div><ul>${ces.map(c => `<li><b>CE ${n}${c})</b> ${esc(RA[n].ce[c])}</li>`).join('')}</ul></div>`).join('');
}
function libsBlock(L) {
  if (!L.libs.length) return '<p class="muted">Esta práctica no necesita librerías adicionales: solo el paquete «esp32».</p>';
  return `<table class="tbl"><tr><th>Librería (nombre exacto)</th><th>Autor</th><th>Versión probada</th></tr>${L.libs.map(k => `<tr><td><b>${esc(LIBS[k].n)}</b>${LIBS[k].note ? `<div class="muted small">${esc(LIBS[k].note)}</div>` : ''}</td><td>${esc(LIBS[k].a)}</td><td>${esc(LIBS[k].v)}</td></tr>`).join('')}</table>`;
}
function stepHTML(L, k) {
  const s = L.steps[k];
  const wires = (s.wires || []).map(id => L.wires.find(w => w.id === id));
  const wireRows = wires.map(w => `<tr><td>${swatch(w.color)}<b>${COLOR_NAME[w.color] || w.color}</b><div class="muted small">${esc(cableType(L, w))}</div></td><td>${endDesc(L, w.from)}</td><td class="arrow">→</td><td>${endDesc(L, w.to)}</td></tr>`).join('');
  return `<div class="step-card">
    <div class="step-h"><span class="step-n">${k + 1}</span><div><div class="muted small">Paso ${k + 1} de ${nPasos(L)}</div><h3>${esc(s.t)}</h3></div></div>
    <div class="blk take"><h4>🧰 Coge</h4><ul>${(s.take || []).map(t => `<li>${t}</li>`).join('')}</ul></div>
    <div class="blk do"><h4>🔧 Haz</h4><ol>${(s.do || []).map(t => `<li>${t}</li>`).join('')}</ol>
    ${wireRows ? `<table class="tbl wires"><tr><th>Cable</th><th>Desde</th><th></th><th>Hasta</th></tr>${wireRows}</table>` : ''}</div>
    <div class="blk check"><h4>✅ Comprueba antes de seguir</h4><p>${s.check || ''}</p></div>
  </div>`;
}
// Último paso de cada proyecto: «Conecta y graba tu placa» (grabar desde el navegador, sin Arduino IDE).
const GRABAR_T = 'Conecta y graba tu placa';
const nPasos = (L) => L.steps.length + 1;
const esGrabar = (L, k) => k === L.steps.length;
function placaHTML(L) {
  return `<div class="placa-cta"><b>⚡ Sin instalar nada:</b> en el último paso, «${GRABAR_T}», puedes grabar este proyecto en la placa desde el navegador (Chrome o Edge).
    <div class="placa-cta-b"><a class="btn primary" href="#p${L.n}-${nPasos(L)}" data-tab-pasos>⚡ Ir a «${GRABAR_T}»</a></div></div>`;
}
function grabarStepHTML(L) {
  const k = L.steps.length;
  return `<div class="step-card step-grabar">
    <div class="step-h"><span class="step-n">${k + 1}</span><div><div class="muted small">Paso ${k + 1} de ${nPasos(L)}</div><h3>⚡ ${GRABAR_T}</h3></div></div>
    <div id="pgSitio"><p class="muted">Cargando…</p></div></div>`;
}
// El bloque de grabación (js/placa.js) se descarga al llegar al último paso; es uno solo para todos los proyectos,
// así que la conexión con la placa y el monitor se mantienen al cambiar de paso o de proyecto.
const versionApp = () => (document.querySelector('script[src*="js/app.js"]')?.getAttribute('src') || '').split('?')[1] || '';
function cargarJS(src) { return new Promise((ok, mal) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => mal(new Error(src)); document.head.appendChild(s); }); }
let placaCargando = null, grabador = null;
async function montarGrabar(L) {
  if (!window.GrabarPlaca) {
    const v = versionApp();
    try { await (placaCargando ||= cargarJS('js/placa.js' + (v ? '?' + v : ''))); }
    catch (e) { placaCargando = null; const s = $('#pgSitio'); if (s) s.innerHTML = '<p class="pl-msg mal">No se ha podido cargar el grabador. Revisa la conexión y recarga la página.</p>'; return; }
  }
  const sitio = $('#pgSitio'); if (!sitio || state.lesson !== L || !esGrabar(L, state.step) || state.tab !== 'pasos') return;
  if (!grabador) grabador = window.__grabador = new window.GrabarPlaca({ base: 'firmware/' });
  grabador.proyecto({ n: L.n, title: L.title });
  sitio.replaceChildren(grabador.el);
}
function tabsFor(L) {
  const allTools = [...TOOLS_BASE, ...(L.tools || [])];
  return {
    pasos: () => (esGrabar(L, state.step) ? grabarStepHTML(L) : stepHTML(L, state.step)) + `<div class="steps-list">${[...L.steps.map((s) => s.t), '⚡ ' + GRABAR_T].map((t, i) => `<button class="sl ${i === state.step ? 'on' : ''}" data-step="${i}"><span>${i + 1}</span>${esc(t)}</button>`).join('')}</div>`,
    ficha: () => `<h3>Proyecto ${L.n}. ${esc(L.title)}</h3><p class="lead">${esc(L.intro)}</p>
      <div class="facts"><div><b>Nivel</b>${esc(L.level)}</div><div><b>Duración</b>${esc(L.duration)}</div><div><b>Interruptor</b>${L.switch === '5V' ? '5V' : '3.3V'}</div></div>
      ${L.caution ? `<div class="caution">⚠️ <b>Precaución.</b> ${esc(L.caution)}</div>` : ''}
      <h4>Objetivos</h4><ul>${L.objectives.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
      <h4>Resultados de aprendizaje y criterios de evaluación</h4><p class="muted small">Profesor: <b>${esc(SUBJ.profesor)}</b> · Módulo ${MODULO.codigo} «${MODULO.nombre}» · ${esc(MODULO.norma)}</p>${raBlock(L)}
      <h4>Seguridad</h4><ul class="safety">${SAFETY_BASE.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`,
    material: () => `<h4>Material del kit</h4><table class="tbl"><tr><th>Componente</th><th>Cant.</th><th>Notas</th></tr>${L.materials.map(m => `<tr><td>${esc(m[0])}</td><td class="c">${m[1]}</td><td class="muted small">${esc(m[2] || '')}</td></tr>`).join('')}</table>
      <h4>Herramientas</h4><table class="tbl">${allTools.map(t => `<tr><td><b>${esc(t[0])}</b></td><td class="muted small">${esc(t[1])}</td></tr>`).join('')}</table>
      <h4>Librerías de Arduino</h4>${libsBlock(L)}
      <h4>Tipos de cable Dupont</h4><table class="tbl">${WIRE_TYPES.map(t => `<tr><td><b>${esc(t[0])}</b></td><td class="muted small">${esc(t[1])}</td></tr>`).join('')}</table>`,
    software: () => `<h4>Preparar el ordenador (una sola vez)</h4><ol class="sw-steps">${SOFTWARE_STEPS.map(([t, d]) => `<li><b>${t}</b><div>${d}</div></li>`).join('')}</ol>
      <h4>Librerías de esta práctica</h4>${libsBlock(L)}
      <div class="note">Configuración: placa <b>ESP32 Dev Module</b> · velocidad del Monitor Serie <b>115200 baudios</b> · paquete esp32 <b>3.x</b>.</div>${placaHTML(L)}`,
    esquema: () => `<h4>Esquema de conexiones</h4><div class="schem-wrap" title="Clic para ampliar">${schematic(L)}</div><p class="muted small">Clic en el esquema para ampliarlo. Cada línea es un cable con su color real (el blanco va discontinuo).</p>
      <h4>Tabla de cableado</h4><table class="tbl wires"><tr><th>#</th><th>Cable</th><th>Desde</th><th>Hasta</th><th>Tipo</th></tr>${L.wires.map((w, i) => `<tr><td class="c">${i + 1}</td><td>${swatch(w.color)}${COLOR_NAME[w.color]}</td><td>${esc(endShort(L, w.from))}</td><td>${esc(endShort(L, w.to))}</td><td class="small">${esc(cableType(L, w))}</td></tr>`).join('')}</table>`,
    codigo: () => `<div class="code-bar"><span>${esc(L.file.split('/')[1])}</span><span class="grow"></span><button class="btn" id="copyCode">Copiar</button><a class="btn" href="codigo/${L.file}" download>Descargar .ino</a></div>
      <pre class="code"><code>${highlight(L.code)}</code></pre>
      <p class="muted small">Código verificado: compila sin errores con arduino-cli, paquete esp32 3.3 y placa «ESP32 Dev Module».</p>${placaHTML(L)}`,
    prueba: () => `<h4>Funcionamiento esperado</h4><ul>${L.expected.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <h4>Ejemplo</h4><p>${L.example}</p>
      <h4>Monitor Serie (115200 baudios)</h4><pre class="serial">${esc(L.serial)}</pre>
      <h4>Comprobación con el polímetro</h4><table class="tbl"><tr><th>Medida</th><th>Cómo</th><th>Valor esperado</th></tr>${L.multimeter.map(m => `<tr><td><b>${esc(m[0])}</b></td><td class="small">${esc(m[1])}</td><td class="small">${esc(m[2])}</td></tr>`).join('')}</table>
      <h4>Averías frecuentes</h4><table class="tbl"><tr><th>Síntoma</th><th>Causa probable</th><th>Solución</th></tr>${L.trouble.map(m => `<tr><td><b>${esc(m[0])}</b></td><td class="small">${esc(m[1])}</td><td class="small">${esc(m[2])}</td></tr>`).join('')}</table>
      ${L.maintenance ? `<h4>Práctica de mantenimiento: sustituir un sensor averiado</h4><p>${esc(L.maintenance.intro)}</p><ol class="sw-steps">${L.maintenance.steps.map(([t, d]) => `<li><b>${esc(t)}</b><div>${esc(d)}</div></li>`).join('')}</ol>` : ''}`,
    reto: () => `<h4>Reto de ampliación</h4><ol>${L.challenge.map(t => `<li>${esc(t)}</li>`).join('')}</ol>
      <h4>Informe de la práctica</h4><ol class="small"><li>${portal()?.rol === 'alumno' ? 'Número de lista, grupo' : 'Nombre'}, fecha y número de kit.</li><li>Objetivo de la práctica con tus palabras.</li><li>Lista de material y herramientas usadas.</li><li>Esquema de conexiones (dibújalo o pega una captura) con los colores de los cables.</li><li>Tabla de mediciones con el polímetro (valor esperado / valor medido).</li><li>Problemas encontrados y cómo los resolviste.</li><li>Resultado del reto y conclusiones.</li><li>Desmontaje: material guardado y revisado, residuos depositados donde corresponde.</li></ol>${espEntregaHTML(L)}`,
  };
}
const SUBJ = SUBJECTS.find(s => s.id === 'eee');
// Asignaturas y apartados que permite la sesión del alumno (grupo del portal). Profesor o sin sesión → todo.
function permitida(id) {
  const ses = window.PORTAL_SESION;
  if (!ses || !Array.isArray(ses.asignaturas)) return true;
  return ses.asignaturas.includes('*') || ses.asignaturas.includes(id);
}
function apartadoPermitido(id) {
  const ses = window.PORTAL_SESION;
  if (!ses || !Array.isArray(ses.apartados) || !ses.apartados.length) return true;
  return ses.apartados.includes(id);
}
// Chip de sesión (grupo · nº · Salir / Profesor · Panel · Salir) que pinta el control de acceso.
const chip = () => (window.PORTAL && window.PORTAL.chipHTML ? window.PORTAL.chipHTML() : '');
const portal = () => window.PORTAL || null;
const fFecha = (t) => t ? new Date(t).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : '';
// Entrega de un proyecto ESP32 (solo alumnos con sesión del portal)
function espEstadoHTML(L) {
  const e = portal()?.estadoEntrega?.('p' + L.n);
  if (!e) return '<p class="muted small">Todavía no lo has entregado.</p>';
  return `<div class="esp-ent-ok">✅ <b>Entregado</b> · ${esc(fFecha(e.fecha))}</div>` +
    (e.nota != null ? `<div class="esp-ent-nota">Nota: <b>${esc(String(e.nota).replace('.', ','))}</b></div>` : '<div class="muted small">Pendiente de corregir.</div>') +
    (e.comentario ? `<div class="esp-ent-com">💬 ${esc(e.comentario)}</div>` : '');
}
function espEntregaHTML(L) {
  const P = portal(); if (!P || P.rol !== 'alumno') return '';
  const e = P.estadoEntrega('p' + L.n); const inf = e?.datos?.informe || {}; const cerrada = e && e.nota != null;
  const ta = (id, t, v) => `<label class="esp-l">${t}<textarea id="${id}" maxlength="3000" rows="3" ${cerrada ? 'disabled' : ''}>${esc(v || '')}</textarea></label>`;
  return `<h4>Entregar el proyecto</h4><div class="esp-entrega">
    <p class="muted small">Marca el proyecto como hecho. Si quieres, añade respuestas del informe (no escribas tu nombre).</p>
    ${ta('espMed', 'Tabla de mediciones (valor esperado / medido)', inf.mediciones)}
    ${ta('espProb', 'Problemas encontrados y cómo los resolviste', inf.problemas)}
    ${ta('espConc', 'Resultado del reto y conclusiones', inf.conclusiones)}
    ${cerrada ? '' : `<button class="btn primary" data-esp-entregar="${L.n}">${e ? '↻ Volver a entregar' : '✅ Marcar como hecho y entregar'}</button>`}
    <div id="espEstado" class="esp-estado">${espEstadoHTML(L)}</div></div>`;
}
function brandHTML() {
  return `<a href="#inicio" class="brand" title="Inicio">Super Profe Pablo</a>`;
}
// Navegación del encabezado, igual en todas las pantallas (alumno: sus asignaturas; profesor: + Biblioteca y Panel).
const topNav = (k = '') => portal()?.navHTML?.(k) || `<nav class="top-nav" aria-label="Principal"><a class="top-nav-a ${k === 'asig' ? 'on' : ''}" href="#asignaturas" ${k === 'asig' ? 'aria-current="page"' : ''}>📚 Asignaturas</a></nav>`;
const cabecera = (titulo, k = '') => `<header class="scr-top">${brandHTML()}<div class="scr-ttl">${esc(titulo)}</div>${topNav(k)}</header>`;
function coverHTML() {
  const P = portal(); const prof = !!P?.esProfesor; const alumno = P?.rol === 'alumno'; const ses = window.PORTAL_SESION;
  const mias = misAsignaturas();
  return `<div class="cov-band"><div class="cov-top"><span class="cov-chip">${chip()}</span></div><div class="cov-brand">Super Profe Pablo</div></div>
  <main class="cov-body">
    <div class="cov-ciclo">Bachillerato y CFGB · Informática y Comunicaciones</div>
    <div class="cov-sep"></div>
    <h1 class="cov-asig">Aula virtual</h1>
    <div class="cov-mod">${alumno ? `${esc(ses?.grupo || '')} · nº ${String(ses?.numero || '').padStart(2, '0')} · ${esc(mias.map(a => a.corto).join(' · '))}` : prof ? `${mias.length} asignatura${mias.length === 1 ? '' : 's'} en tu curso · ${BIBLIOTECA.length} en la biblioteca` : `${BIBLIOTECA.length} asignaturas · trabajo de clase, laboratorios y actividades 3D`}</div>
    <div class="cov-prof">Profesor: <b>${esc(SUBJ.profesor)}</b></div>
    <a class="btn-enter" href="#asignaturas">${alumno ? 'Entrar a mis asignaturas' : prof ? 'Mis asignaturas' : 'Entrar'} <span aria-hidden="true">→</span></a>
    ${prof ? '<div class="cov-links"><a href="#biblioteca">🗂 Biblioteca de asignaturas</a><a href="#panel">⚙️ Panel del profesor</a></div>' : ''}
  </main>
  <div class="cov-foot">Trabajo de clase · Tablón · Laboratorios 3D · Actividades de clase<span class="cov-cred"> · <a href="#eee/vivienda/creditos">Créditos de las fotos</a></span></div>`;
}
// Asignaturas que ve cada uno: alumno → las de su grupo; profesor → las de su curso escolar activo;
// sin Firebase (código de clase) → toda la biblioteca.
function misAsignaturas() {
  const ses = window.PORTAL_SESION;
  if (ses && Array.isArray(ses.asignaturas)) return BIBLIOTECA.filter(a => ses.asignaturas.includes('*') || ses.asignaturas.includes(a.id));
  const c = portal()?.aula?.asignaturasCurso?.();
  if (c) return BIBLIOTECA.filter(a => c.asignaturas.includes(a.id));
  return BIBLIOTECA;
}
function subjectsHTML() {
  const P = portal(); const prof = !!P?.esProfesor; const alumno = P?.rol === 'alumno';
  const c = prof ? P.aula?.asignaturasCurso?.() : null; const lista = misAsignaturas();
  const titulo = alumno ? 'Tus asignaturas' : c ? `Mis asignaturas · ${c.curso}` : 'Asignaturas';
  return `${cabecera(alumno ? 'Aula virtual' : 'Mis asignaturas', 'asig')}
  <nav class="crumbs static" aria-label="Estás en"><div><a href="#inicio">Inicio</a> › <span aria-current="page">${prof ? 'Mis asignaturas' : 'Asignaturas'}</span></div><div class="prof">${chip()}</div></nav>
  <main class="subj-wrap"><h1 class="subj-h1">${esc(titulo)}</h1><p class="muted">${alumno ? 'Elige una asignatura: verás su tablón, el trabajo de clase, los laboratorios y las actividades.' : prof && !c ? 'Todavía no has creado el curso escolar: hazlo en el <a href="#panel/cursos">Panel → Cursos escolares</a> y elige las asignaturas que impartes. Mientras, se muestran todas.' : prof ? `Las asignaturas que impartes en ${esc(c.curso)}. Las demás están en la <a href="#biblioteca">Biblioteca</a>.` : 'Elige una asignatura.'}</p>
  ${lista.length ? '' : '<p class="muted subj-none">Tu código todavía no da acceso a ninguna asignatura publicada.</p>'}
  <div class="subj-grid">${lista.map(a => tarjetaAsig(a, { alumno: !prof })).join('')}</div></main>`;
}
function setCrumbs() {
  const L = state.lesson;
  $('#crumbs').innerHTML = `<a href="#inicio">Inicio</a> › <a href="#asignaturas">Asignaturas</a> › ` + `<a href="#asig/eee">${esc(SUBJ.nombre)}</a> › <a href="#asig/eee/laboratorio">Laboratorio</a> › ` + (L ? `<a href="#eee/esp32">ESP32</a> › <span>Proyecto ${L.n}: ${esc(L.title)}</span>` : `<span>ESP32</span>`);
}
let lab = null, viv = null, act = null, curScreen = undefined;
function showScreen(name, arg) {
  document.body.classList.toggle('scr-cover', name === 'cover');
  document.body.classList.toggle('scr-subjects', name === 'subjects');
  document.body.classList.toggle('scr-act', name === 'act');
  document.body.classList.toggle('scr-circ', name === 'circ');
  document.body.classList.toggle('scr-viv', name === 'viv');
  document.body.classList.toggle('scr-panelprof', name === 'panelprof');
  document.body.classList.toggle('scr-biblio', name === 'biblio');
  document.body.classList.toggle('scr-asig', name === 'asig' || name === 'bibasig');
  document.body.classList.toggle('scr-aula', name === 'aula');
  if (curScreen !== name) portal()?.alCambiarPantalla?.(name);
  if (name === 'biblio') { const c = portal()?.aula?.asignaturasCurso?.() || null; $('#biblio').innerHTML = bibliotecaHTML({ chip: chip(), esProfesor: !!portal()?.esProfesor, enCurso: c }); enlazarBiblioteca($('#biblio'), c); }
  if (name === 'asig') pintarAsig(arg);
  if (name !== 'act' && act) { act.destruir(); act = null; }
  // el visor ESP32 se pausa cuando no está a la vista
  if (viewer && viewer.renderer) viewer.renderer.setAnimationLoop(name ? null : () => viewer.tick());
  if (name !== 'circ' && lab) lab.pause();
  if (name !== 'asig') asigActual = null;
  if (name !== 'viv' && viv) viv.pause();
  if (curScreen !== name && !name) setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
  curScreen = name;
  if (name === 'cover') $('#cover').innerHTML = coverHTML();
  if (name === 'subjects') $('#subjects').innerHTML = subjectsHTML();
  if (!name) window.dispatchEvent(new Event('resize'));
  window.scrollTo(0, 0);
}
// ---------- página de asignatura (pestañas) ----------
let asigActual = null;
function pintarAsig({ id, tab }) {
  const enCurso = misAsignaturas().some(a => a.id === id);
  const el = $('#asig'); const misma = asigActual && asigActual.id === id;
  el.innerHTML = asigHTML(id, tab, { cabecera: cabecera(asignatura(id).corto, 'asig'), chip: chip(), enCurso });
  asigActual = { id, tab };
  const A = portal()?.aula;
  if (tab === 'organizacion') A?.renderVista?.($('#asOrg'), id, 'organizacion');
  if (tab === 'trabajo' || tab === 'tablon') A?.renderVista?.($('#asTrabajo'), id, tab);
  if (misma) $('#tab-' + tab)?.focus({ preventScroll: true });
  const t = $('#tab-' + tab), bar = t?.parentNode; if (t && bar && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2;
}
function abrirActividad(asig, id) {
  const def = actividad(asig, id);
  if (!def) { history.replaceState(null, '', `#asig/${asig}/actividades`); return route(); }
  showScreen('act');
  if (act) act.destruir();
  const a = asignatura(asig); const P = portal(); const url = enlaceActividad(def);
  const cab = cabecera(def.titulo, 'asig') + `<nav class="crumbs static" aria-label="Estás en"><div><a href="#inicio">Inicio</a> › <a href="#asignaturas">Asignaturas</a> › <a href="#asig/${asig}">${esc(a.corto)}</a> › <a href="#asig/${asig}/actividades">Actividades de clase</a> › <span aria-current="page">${esc(def.titulo)}</span></div><div class="prof">${chip()}</div></nav>`;
  act = new Actividad3D($('#act'), def, { cabecera: cab, volver: `#asig/${asig}/actividades`, esProfesor: !!P?.esProfesor,
    asignacion: () => P?.aula?.asignacionActividad?.(url) || null,
    entregar: (itemId, texto) => P.aula.entregarActividad(itemId, texto) });
  window.__act = act;
}

const TAB_NAMES = [['pasos', 'Paso a paso'], ['ficha', 'Ficha'], ['material', 'Material'], ['software', 'Preparar PC'], ['esquema', 'Esquema'], ['codigo', 'Código'], ['prueba', 'Prueba'], ['reto', 'Reto']];

// ---------- inicio (guía general) ----------
function homeHTML() {
  return `<h3>Laboratorio ESP32 · Paso a paso en 3D</h3>
  <p class="lead">8 proyectos de dificultad creciente con la placa <b>ACEBOTT ESP32 Plus</b> y el kit de sensores y actuadores. Elige un proyecto abajo y sigue los pasos: el modelo 3D muestra en cada paso qué pieza coger y dónde va cada cable.</p>
  <div class="cards">${LESSONS.map(L => `<a class="card" href="#p${L.n}"><span class="num">${L.n}</span><div><b>${esc(L.title)}</b><div class="muted small">${esc(L.level)} · ${esc(L.duration)}</div><div class="small">${esc(L.short)}</div></div></a>`).join('')}</div>
  <div class="placa-cta"><b>⚡ Grabar la placa sin instalar nada.</b> El último paso de cada proyecto, «${GRABAR_T}», conecta la ESP32 por USB y graba el programa desde el navegador (Chrome o Edge), con monitor serie.</div>
  <h4>Conoce la placa ESP32 Plus</h4><table class="tbl">${BOARD_GUIDE.map(([t, d]) => `<tr><td><b>${t}</b></td><td class="small">${d}</td></tr>`).join('')}</table>
  <img class="pinout" src="img/esp32plus_pinout.jpg" alt="Pinout ESP32 Plus">
  <h4>Cómo usar esta web</h4><ul><li>Arrastra el modelo para girarlo; rueda del ratón para acercar; clic derecho (o dos dedos) para desplazar.</li><li>Botones ◀ ▶ (o flechas del teclado) para cambiar de paso. Lo nuevo de cada paso aparece resaltado en naranja.</li><li>Cada paso tiene: <b>Coge</b> (qué material), <b>Haz</b> (dónde va cada cable, con su color) y <b>Comprueba</b> (antes de seguir).</li><li>La web funciona sin Internet: se puede abrir desde una carpeta o un USB.</li></ul>
  <h4>Preparar el ordenador</h4><ol class="sw-steps">${SOFTWARE_STEPS.map(([t, d]) => `<li><b>${t}</b><div>${d}</div></li>`).join('')}</ol>
  <h4>Herramientas comunes</h4><table class="tbl">${TOOLS_BASE.map(t => `<tr><td><b>${esc(t[0])}</b></td><td class="muted small">${esc(t[1])}</td></tr>`).join('')}</table>
  <h4>Normas de seguridad</h4><ul class="safety">${SAFETY_BASE.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  <p class="muted small">Profesor: <b>${esc(SUBJ.profesor)}</b> · Módulo ${MODULO.codigo} «${MODULO.nombre}» · ${MODULO.titulo} · ${MODULO.norma}.</p>`;
}

// ---------- estado y render ----------
const state = { lesson: null, step: 0, tab: 'pasos' };
let viewer;

function setLesson(n, step = 0) {
  const L = LESSONS.find(l => l.n === n);
  state.lesson = L; state.step = Math.min(step, L ? nPasos(L) - 1 : 0);
  document.body.classList.toggle('home', !L);
  document.querySelectorAll('.lesson-strip .ls').forEach(b => b.classList.toggle('on', +b.dataset.n === n));
  setCrumbs();
  if (!L) {
    viewer.loadLesson({ parts: {}, wires: [], steps: [{ t: '', allLabels: true }], switch: '3V3', view: [0.15, 1, 0.75], margin: 1.25 });
    viewer.showStep(0, true); boardCallouts();
    $('#panel').innerHTML = homeHTML(); $('#tabs').innerHTML = ''; $('#vtitle').innerHTML = '<b>ESP32 Plus</b> · vista general';
    $('#stepbar').style.display = 'none';
    return;
  }
  $('#stepbar').style.display = '';
  viewer.loadLesson(L);
  $('#tabs').innerHTML = TAB_NAMES.map(([k, t]) => `<button data-tab="${k}" class="${k === state.tab ? 'on' : ''}">${t}</button>`).join('');
  $('#vtitle').innerHTML = `<span class="pill">${L.n}</span><b>${esc(L.title)}</b> · ${esc(L.level)}`;
  showStep(state.step, true);
}
function boardCallouts() {
  const pins = viewer.board.userData.pins;
  const add = (t, p) => { const el = document.createElement('div'); el.className = 'lbl part'; el.innerHTML = t; viewer.labelLayer.appendChild(el); viewer.labels.push({ el, pos: p.clone().setY(p.y + 4) }); };
  add('Conectores <b>G-V-S</b> (GPIO 18…12)', pins['D5.S'].pos); add('Conectores <b>G-V-S</b> (GPIO 14…26)', pins['D17.S'].pos);
  add('Bloque <b>I2C</b>', pins['I2.SDA'].pos); add('Bloque <b>ANALOG</b> 34·35·4·2', pins['A35.V'].pos);
  add('Interruptor <b>3.3V / 5V</b>', viewer.board.userData.switchPos); add('<b>USB-B</b>', pins['USB'].pos); add('<b>Jack DC</b> 7–12 V', pins['DC'].pos);
  add('Conector <b>POWER</b>', pins['P.GND'].pos); add('<b>ESP32</b> (Wi-Fi + Bluetooth)', viewer.board.position.clone().set(14, 6, 2));
}
function showStep(k, instant = false) {
  const L = state.lesson; if (!L) return;
  state.step = Math.max(0, Math.min(k, nPasos(L) - 1));
  viewer.showStep(Math.min(state.step, L.steps.length - 1), instant); // último paso: el montaje terminado
  $('#stepcount').textContent = `Paso ${state.step + 1} / ${nPasos(L)}`;
  $('#steptitle').textContent = esGrabar(L, state.step) ? '⚡ ' + GRABAR_T : L.steps[state.step].t;
  $('#dots').innerHTML = [...L.steps.map((s) => s.t), GRABAR_T].map((t, i) => `<button class="${i === state.step ? 'on' : i < state.step ? 'done' : ''}${i === L.steps.length ? ' grabar' : ''}" data-step="${i}" title="${esc(t)}"></button>`).join('');
  $('#prev').disabled = state.step === 0; $('#next').disabled = state.step === nPasos(L) - 1;
  renderTab();
  if (!RENDER) history.replaceState(null, '', `#p${L.n}-${state.step + 1}`);
}
function renderTab() {
  const L = state.lesson; if (!L) return;
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab));
  $('#panel').innerHTML = tabsFor(L)[state.tab]();
  $('#panel').scrollTop = 0;
  if (state.tab === 'pasos' && esGrabar(L, state.step)) montarGrabar(L);
}

function buildUI() {
  document.body.innerHTML = `
  <div id="cover" class="screen"></div>
  <div id="subjects" class="screen"></div>
  <div id="act" class="screen"></div>
  <div id="circ" class="screen"></div>
  <div id="viv" class="screen"></div>
  <div id="panelprof" class="screen"></div>
  <div id="biblio" class="screen"></div>
  <div id="asig" class="screen"></div>
  <div id="aula" class="screen"></div>
  <header class="top">${brandHTML()}
    <div class="ttl"><div class="t1">Laboratorio <span>ESP32</span></div><div class="t2">${esc(SUBJ.nombre)} · ${esc(CENTRO.ciclo)}</div></div>
    <nav aria-label="Laboratorio ESP32"><a href="#asignaturas" class="navb">Asignaturas</a><a href="#asig/eee/laboratorio" class="navb">Laboratorio</a><a href="#p1" class="navb">Empezar</a></nav></header>
  <div class="crumbs"><div id="crumbs"></div><div class="prof">Profesor: <b>${esc(SUBJ.profesor)}</b>${chip()}</div></div>
  <main>
    <section class="viewer"><div id="gl"></div><div id="labels"></div>
      <div id="vtitle" class="vtitle"></div>
      <div class="vtools"><button id="vreset" title="Vista inicial" aria-label="Vista inicial">${ic('rotate-ccw')}</button><button id="vtop" title="Vista desde arriba" aria-label="Vista desde arriba">${ic('square-arrow-down')}</button><button id="vlabels" title="Mostrar/ocultar etiquetas" aria-label="Mostrar u ocultar etiquetas">${ic('tags')}</button><button id="vfull" title="Pantalla completa" aria-label="Pantalla completa">${ic('maximize')}</button></div>
      <div id="stepbar" class="stepbar"><button id="prev" class="btn">◀ Anterior</button><div class="mid"><div id="stepcount"></div><div id="steptitle"></div><div id="dots" class="dots"></div></div><button id="next" class="btn primary">Siguiente ▶</button></div>
      <div class="hint">Arrastra para girar · rueda para zoom · clic derecho para mover</div>
    </section>
    <aside class="side"><div id="tabs" class="tabs"></div><div id="panel" class="panel"></div></aside>
  </main>
  <footer class="lesson-strip">${LESSONS.map(L => `<a class="ls" data-n="${L.n}" href="#p${L.n}"><span class="num">${L.n}</span><span class="ic">${L.icon}</span><span class="nm">${esc(L.title)}</span></a>`).join('')}</footer>`;
}
function bind() {
  $('#prev').onclick = () => showStep(state.step - 1);
  $('#next').onclick = () => showStep(state.step + 1);
  $('#vreset').onclick = () => viewer.resetView();
  $('#vtop').onclick = () => viewer.topView();
  $('#vlabels').onclick = () => { viewer.showLabels = !viewer.showLabels; };
  $('#vfull').onclick = () => { const v = $('.viewer'); document.fullscreenElement ? document.exitFullscreen() : v.requestFullscreen && v.requestFullscreen(); };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab]'); if (t) { state.tab = t.dataset.tab; renderTab(); }
    const s = e.target.closest('[data-step]'); if (s) { showStep(+s.dataset.step); }
    const gp = e.target.closest('[data-tab-pasos]'); if (gp && state.lesson) { e.preventDefault(); state.tab = 'pasos'; document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === 'pasos')); showStep(nPasos(state.lesson) - 1); }
    const sw = e.target.closest('.schem-wrap'); if (sw) { const o = document.createElement('div'); o.className = 'overlay'; o.innerHTML = sw.innerHTML + '<div class="ov-close">✕ Cerrar</div>'; o.onclick = () => o.remove(); document.body.appendChild(o); }
    const ee = e.target.closest('[data-esp-entregar]');
    if (ee && portal()?.entregar) {
      const L = LESSONS.find(l => l.n === +ee.dataset.espEntregar); const v = (id) => ($('#' + id)?.value || '').slice(0, 3000);
      ee.disabled = true; ee.textContent = 'Enviando…';
      portal().entregar({ practica: 'p' + L.n, tipo: 'esp32', titulo: `Proyecto ${L.n}: ${L.title}`.slice(0, 120), datos: { hecho: true, informe: { mediciones: v('espMed'), problemas: v('espProb'), conclusiones: v('espConc') } } })
        .then(() => { ee.textContent = '↻ Volver a entregar'; }, (er) => { ee.textContent = '❌ No se ha podido entregar. Reintentar'; alert('No se ha podido entregar: ' + (er?.mensaje || 'revisa la conexión.')); })
        .finally(() => { ee.disabled = false; const st = $('#espEstado'); if (st && state.lesson) st.innerHTML = espEstadoHTML(state.lesson); });
    }
    if (e.target.id === 'copyCode') { navigator.clipboard?.writeText(state.lesson.code).then(() => { e.target.textContent = '¡Copiado!'; setTimeout(() => e.target.textContent = 'Copiar', 1500); }).catch(() => {}); }
  });
  document.addEventListener('keydown', (e) => { if (e.target.closest('input,textarea,select') || curScreen) return; if (e.key === 'ArrowRight') showStep(state.step + 1); if (e.key === 'ArrowLeft') showStep(state.step - 1); });
  window.addEventListener('hashchange', route);
  window.addEventListener('portal-entregas', () => {
    if (lab) lab.refreshEntrega();
    const st = $('#espEstado'); if (st && state.lesson) st.innerHTML = espEstadoHTML(state.lesson);
  });
}
function route() {
  const h = location.hash;
  // Panel del profesor (solo con sesión de profesor del portal)
  if (/^#panel(\/|$)/.test(h)) {
    if (portal()?.esProfesor) { showScreen('panelprof'); portal().renderPanel($('#panelprof'), h.replace(/^#panel\/?/, '') || 'grupos'); return; }
    history.replaceState(null, '', '#inicio'); return showScreen('cover');
  }
  if (h === '#asignaturas') return showScreen('subjects');
  if (h === '' || h === '#' || h === '#inicio') return showScreen('cover');
  // Biblioteca: solo el profesor (es su catálogo de planificación, con todas las asignaturas y borradores)
  if (/^#biblioteca(\/|$)/.test(h)) {
    if (!portal()?.esProfesor) { history.replaceState(null, '', '#asignaturas'); return showScreen('subjects'); }
    const b = h.match(/^#biblioteca\/([\w-]+)/);
    // una sola página por asignatura: desde la biblioteca se abre su «Organización»
    if (b && asignatura(b[1])) { history.replaceState(null, '', `#asig/${b[1]}/organizacion`); return route(); }
    return showScreen('biblio');
  }
  const as = h.match(/^#asig\/([\w-]+)(?:\/([\w-]+))?(?:\/([\w-]+))?/);
  if (as) {
    const [, id, t, sub] = as;
    if (!asignatura(id) || !permitida(id)) { history.replaceState(null, '', '#asignaturas'); return showScreen('subjects'); }
    if (t === 'actividades' && sub) return abrirActividad(id, sub);
    const tabs = pestañas().map(x => x[0]);
    if (!tabs.includes(t)) { const d = pestañaPorDefecto(); history.replaceState(null, '', `#asig/${id}/${d}`); return showScreen('asig', { id, tab: d }); }
    return showScreen('asig', { id, tab: t });
  }
  const tb = h.match(/^#trabajo\/([\w-]+)/);
  if (tb) {
    if (!portal()?.aula?.activa?.()) { history.replaceState(null, '', '#asignaturas'); return showScreen('subjects'); }
    showScreen('aula'); portal().aula.renderItem($('#aula'), tb[1]); return;
  }
  // sin permiso para esta asignatura → listado de asignaturas
  if (!permitida(SUBJ.id)) { history.replaceState(null, '', '#asignaturas'); return showScreen('subjects'); }
  if (h === '#eee' || h === '#eee/') { history.replaceState(null, '', '#asig/eee'); return route(); }
  const vv = h.match(/^#eee\/vivienda(?:\/([\w-]+))?/);
  if (vv) {
    if (!apartadoPermitido('vivienda')) { history.replaceState(null, '', '#asig/eee/laboratorio'); return route(); }
    if (!viv) viv = new ViviendaLab($('#viv'), { subject: SUBJ.nombre, profesor: SUBJ.profesor });
    showScreen('viv'); window.__viv = viv;
    const v = vv[1] || 'home';
    if (v === 'revision') {
      const rev = portal()?.esProfesor && portal().revision;
      if (rev) { viv.review(rev); return; }
      history.replaceState(null, '', portal()?.esProfesor ? '#panel/entregas' : '#eee/vivienda'); return route();
    }
    viv.show(v); return;
  }
  // Enlaces antiguos a «Programar la placa» (#eee/placa/…/p3) → último paso del proyecto, o el inicio de ESP32.
  const pl = h.match(/^#eee\/placa(?:\/[\w-]+)?(?:\/p(\d))?/);
  if (pl) { const L = pl[1] && LESSONS.find((x) => x.n === +pl[1]); history.replaceState(null, '', L ? `#p${L.n}-${nPasos(L)}` : '#eee/esp32'); return route(); }
  const c = h.match(/^#eee\/circuitos(?:\/([\w-]+))?/);
  if (c && !apartadoPermitido('circuitos')) { history.replaceState(null, '', '#asig/eee/laboratorio'); return route(); }
  if (!c && !apartadoPermitido('esp32')) { history.replaceState(null, '', '#asig/eee/laboratorio'); return route(); }
  if (c) {
    if (!lab) lab = new CircuitLab($('#circ'), { subject: SUBJ.nombre, profesor: SUBJ.profesor });
    showScreen('circ'); window.__circ = lab;
    const v = c[1] || 'home';
    if (v === 'revision') {
      const rev = portal()?.esProfesor && portal().revision;
      if (rev) { lab.review(rev); return; }
      history.replaceState(null, '', portal()?.esProfesor ? '#panel/entregas' : '#eee/circuitos'); return route();
    }
    lab.show(v === 'libre' || /^c\d+$/.test(v) ? v : 'home');
    return;
  }
  showScreen(null);
  const m = h.match(/^#p(\d)(?:-(\d+))?/);
  if (m) { const n = +m[1], st = m[2] ? +m[2] - 1 : 0; labReady = true; if (!state.lesson || state.lesson.n !== n) setLesson(n, st); else if (st !== state.step) showStep(st); }
  else if (state.lesson || !labReady) { labReady = true; setLesson(0); history.replaceState(null, '', '#eee/esp32'); }
}
let labReady = false;

// ---------- modo render (para PowerPoint) ----------
function renderMode() {
  document.body.className = 'render';
  document.body.innerHTML = `<div class="viewer render"><div id="gl"></div><div id="labels"></div></div>`;
  viewer = new Viewer($('#gl'), $('#labels'), { render: true, background: params.get('bg') || '#ffffff', fitAspect: 16 / 9, padTop: 0.13, padBottom: 0.04, padX: 0.05 });
  window.renderShot = (n, step) => {
    const L = LESSONS.find(l => l.n === n);
    viewer.loadLesson(L);
    const k = step === 'final' ? L.steps.length - 1 : step - 1;
    viewer.showStep(k, true);
    const fullH = viewer.homeH;
    viewer.fitAll(true, fullH * 0.5);
    if (step === 'final') { viewer.labels.forEach(l => l.el.remove()); viewer.labels = []; viewer.halos.forEach(h => viewer.root.remove(h)); viewer.halos = []; viewer.buildLabels({ allLabels: true }, new Set(Object.keys(L.parts)), new Set()); }
    viewer.layoutLabels();
    return L.steps.length;
  };
  window.lessonInfo = LESSONS.map(L => ({ n: L.n, slug: L.slug, steps: L.steps.length, titles: L.steps.map(s => s.t) }));
  window.__viewer = viewer; window.renderReady = true;
}

if (RENDER) renderMode();
else {
  window.PORTAL_CATALOGO = {
    practicas: PRACTICES.map(p => ({ id: p.id, n: p.n, titulo: p.title })),
    proyectos: LESSONS.map(L => ({ id: 'p' + L.n, n: L.n, titulo: L.title })),
    subjects: SUBJECTS, apartados: APARTADOS, biblioteca: BIBLIOTECA,
  };
  // El curso escolar del profesor llega después de cargar: refrescar la lista de asignaturas si está a la vista.
  window.addEventListener('portal-aula', () => {
    if (curScreen === 'subjects') $('#subjects').innerHTML = subjectsHTML();
    if (curScreen === 'cover') $('#cover').innerHTML = coverHTML();
    // estado de las actividades asignadas (entregada, nota…)
    if (curScreen === 'asig' && asigActual?.tab === 'actividades') pintarAsig(asigActual);
    if (curScreen === 'act' && act && act.estado?.fase !== 'ronda') act.pintar();
  });
  // pestañas de la asignatura: flechas ← → (accesibilidad) y «Asignar como tarea»
  document.addEventListener('keydown', (e) => {
    const t = e.target.closest?.('.as-tabs [role=tab]'); if (!t || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const L = [...t.parentNode.querySelectorAll('[role=tab]')]; let i = L.indexOf(t);
    i = e.key === 'Home' ? 0 : e.key === 'End' ? L.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + L.length) % L.length;
    e.preventDefault(); L[i].focus(); location.hash = L[i].getAttribute('href');
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest?.('[data-asignar]'); if (!b || !asigActual) return;
    const def = actividad(asigActual.id, b.dataset.asignar); if (def) portal()?.aula?.asignarActividad?.({ asig: def.asig, titulo: def.titulo, texto: `${def.desc}\n\nAbre la actividad, complétala y pulsa **📤 Entregar este resultado** al final. Puedes repetirla y entregar de nuevo hasta que la califique.`, enlace: enlaceActividad(def), tituloEnlace: `${def.icon} ${def.titulo} (actividad 3D)` });
  });

  // Estética: iconos de línea en lugar de emoji, y cristal más ligero en ordenadores modestos (Chromebook).
  instalarIconos(document.body);
  try { if (calidad().baja) document.documentElement.classList.add('glass-lite'); } catch (e) { /* sin navegador */ }
  buildUI();
  viewer = new Viewer($('#gl'), $('#labels'), { padTop: 0.1, padBottom: 0.2, padX: 0.04 });
  bind(); route();
  window.__app = { state, viewer, LESSONS };

}
