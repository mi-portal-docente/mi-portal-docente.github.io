// Control de acceso del portal con Firebase (Auth + Firestore).
//  · Profesor: inicio de sesión con Google (rol comprobado por las reglas de Firestore).
//  · Alumno: código de grupo + número de lista, con sesión ANÓNIMA (sin nombre ni correo).
import { onAuthStateChanged, signInAnonymously, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, updateDoc, onSnapshot, serverTimestamp, collection, query, where } from 'firebase/firestore';
import { iniciarFirebase } from './fb.js';
import { normalizaCodigo, formatoCodigo } from './codigos.js';
import { crearPanel } from './panel.js';
import { esc, enHorario, conTimeout } from './util.js';
import { crearAula } from './aula-datos.js';
import { crearVistas } from './aula-vistas.js';
import { crearClase } from './aula-clase.js';
import { pinValido, hashPin } from '../lms/modelo.js';

const ACC = window.__portalAcceso || {};
const AVISO_KEY = 'portal.aviso';
const LATIDO_MS = 60000;      // latido normal
const MIN_PAGINA_MS = 15000;  // al cambiar de página, como mucho un aviso cada 15 s
const AVISOS = {
  expulsado: 'El profesor ha cerrado tu sesión.',
  codigo_cambiado: 'El código del grupo ha cambiado. Pide el nuevo al profesor.',
  cerrado: 'El profesor ha cerrado el acceso de tu grupo.',
  horario: 'Tu grupo está fuera del horario de acceso.',
  caducada: 'Tu sesión ha terminado. Vuelve a entrar.',
  salida: 'Has salido del portal.',
};
const ERR = {
  codigo: 'El código no es correcto. Compruébalo y vuelve a intentarlo.',
  cerrado: 'El acceso de este grupo está cerrado ahora mismo.',
  horario: 'Este grupo está fuera de su horario de acceso.',
  numero: 'Elige tu número de lista.',
  pin: 'Escribe tu PIN: de 4 a 8 cifras.',
  pinMal: 'Ese número de lista ya tiene otro PIN. Si lo has olvidado (o no eres tú), pide al profesor que lo reinicie.',
  red: 'No se puede conectar con el portal. Comprueba la conexión a Internet y vuelve a intentarlo.',
  limite: 'Demasiados intentos seguidos desde esta red. Espera unos minutos y vuelve a intentarlo.',
  otro: 'No se ha podido entrar ahora mismo. Vuelve a intentarlo.',
  popup: 'Se ha cerrado la ventana de Google antes de terminar.',
  dominio: 'Este sitio todavía no está autorizado para iniciar sesión con Google (falta añadirlo en Firebase).',
};

let fb = null, rol = null, ses = null, codDoc = null, panel = null, aula = null, vistas = null, clase = null;
const entregas = new Map();
let unsubs = [], timer = null, ultimoLatido = 0, timerPagina = null, cerrando = false;

const pad = (n) => String(n).padStart(2, '0');
const esRed = (e) => /network|unavailable|deadline|offline/i.test(String(e?.code || e?.message || ''));

// ------------------------------------------------------------------ API para la aplicación
const PORTAL = window.PORTAL = {
  modo: 'firebase', rol: null, esProfesor: false, revision: null,
  chipHTML() {
    if (rol === 'alumno' && ses) return `<span class="pchip"><span class="pchip-who" title="Tu grupo y tu número de lista">${esc(ses.grupoNombre || 'Grupo')} · nº ${pad(ses.numero)}</span><button type="button" class="pchip-b" data-portal="salir">Salir</button></span>`;
    if (rol === 'profesor') return `<span class="pchip prof"><span class="pchip-who">Profesor</span><button type="button" class="pchip-b" data-portal="salir">Salir</button></span>`;
    return '';
  },
  // Entradas del encabezado, iguales en todas las pantallas. Alumno: sus asignaturas. Profesor: + Biblioteca y Panel.
  navHTML(activa = '') {
    const a = (href, k, t) => `<a class="top-nav-a ${activa === k ? 'on' : ''}" href="${href}" ${activa === k ? 'aria-current="page"' : ''}>${t}</a>`;
    if (rol !== 'profesor') return `<nav class="top-nav" aria-label="Principal">${a('#asignaturas', 'asig', '📚 Mis asignaturas')}</nav>`;
    return `<nav class="top-nav" aria-label="Principal">${a('#asignaturas', 'asig', '📚 Mis asignaturas')}${a('#biblioteca', 'biblio', '🗂 Biblioteca')}${a('#panel', 'panel', '⚙️ Panel del profesor')}</nav>`;
  },
  estadoEntrega(practica) { return entregas.get(practica) || null; },
  entregar,
  calificar(id, nota, comentario) { return panel ? panel.calificar(id, nota, comentario) : Promise.reject(new Error('no-profesor')); },
  renderPanel(el, sub) { if (panel) panel.render(el, sub); },
  alCambiarPantalla(nombre) { if (nombre !== 'panelprof' && panel) panel.parar(); },
  salir,
  // Aula virtual (biblioteca, tareas, exámenes y notas)
  aula: {
    activa: () => !!vistas,
    // Pestañas de la asignatura que dependen del aula: 'organizacion' (profesor), 'trabajo', 'tablon'.
    renderVista(el, asig, vista) { if (clase) clase.render(el, asig, vista); else if (el) el.innerHTML = ''; },
    renderTrabajo(el, asig) { this.renderVista(el, asig, 'trabajo'); },
    // Actividades de clase: el profesor las asigna como tarea (tipo «actividad» con enlace interno) y el
    // alumno entrega el resultado como texto; el cuaderno lo lee para proponer la nota.
    asignarActividad({ asig, titulo, texto, enlace, tituloEnlace }) {
      if (!clase?.editor || rol !== 'profesor') return;
      clase.editor.abrir(null, { tipo: 'actividad', asig, curso: aula.st.cursoSel, titulo, texto, enlaces: [{ t: tituloEnlace || titulo, u: enlace }], puntos: 10 });
    },
    asignacionActividad(url) { return vistas?.asignacionActividad?.(url) || null; },
    entregarActividad(itemId, texto) { return vistas ? vistas.entregarActividad(itemId, texto) : Promise.reject(new Error('sin-sesion')); },
    // Estado de una actividad para su tarjeta (HTML corto) o null.
    actividadEstado(url) {
      if (!aula) return null;
      if (rol === 'profesor') {
        const L = [...aula.st.items.values()].filter((x) => x.tipo === 'actividad' && x.curso === aula.st.cursoSel && (x.enlaces || []).some((e) => e.u === url));
        if (!L.length) return null; const p = L.filter((x) => x.publicado).length;
        return `📌 Asignada en ${L.length} tarea${L.length === 1 ? '' : 's'} (${p} publicada${p === 1 ? '' : 's'}) · <a href="#trabajo/${esc(L[0].id)}">ver</a>`;
      }
      const a = vistas?.asignacionActividad?.(url); if (!a) return null;
      return a.nota != null ? `✅ Calificada: <b>${esc(a.nota)}</b>` : a.entregado ? '📤 Entregada · pendiente de calificar' : `📌 Tarea asignada${a.fechaEntrega ? ' · para el ' + esc(new Date(a.fechaEntrega).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })) : ''}`;
    },
    editar(id) { clase?.editar(id); },
    importar(asig) { clase?.importar(asig); },
    reutilizar(asig) { clase?.reutilizar(asig); },
    renderItem(el, id) { if (vistas) vistas.renderItem(el, id); },
    // Profesor: asignaturas del curso escolar activo (null si aún no hay curso).
    asignaturasCurso() { const c = aula && rol === 'profesor' ? aula.cursoActivo() : null; return c ? { curso: c.nombre, asignaturas: (c.asignaturas || []).slice() } : null; },
  },
  pagina: () => (ACC.pagina ? ACC.pagina() : location.hash),
};
document.addEventListener('click', (e) => { if (e.target.closest('[data-portal="salir"]')) { e.preventDefault(); salir(); } });

// ------------------------------------------------------------------ pantalla de entrada
const G_LOGO = '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

function gateHTML() {
  let opts = '<option value="">Elige…</option>';
  for (let i = 1; i <= 40; i++) opts += `<option value="${i}">${pad(i)}</option>`;
  return `<div class="gate fb" id="gate" role="dialog" aria-labelledby="gate-title">
    <div class="gate-card">
      <h1 id="gate-title">Portal docente</h1>
      <p class="gate-note" id="gate-note" role="status" hidden></p>
      <p class="gate-loading" id="gate-loading">Comprobando la sesión…</p>
      <div class="gate-body" id="gate-body" hidden>
        <div class="gate-tabs" role="tablist">
          <button type="button" role="tab" data-gate-rol="alumno" class="on" aria-selected="true">Soy alumno</button>
          <button type="button" role="tab" data-gate-rol="profesor" aria-selected="false">Soy profesor</button>
        </div>
        <form id="gate-alumno" class="gate-pane" autocomplete="off" novalidate>
          <label for="gate-code">Código de grupo</label>
          <input id="gate-code" name="codigo" type="text" maxlength="20" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="Ej.: FARO-472">
          <label for="gate-num" class="gate-l2">Número de lista</label>
          <select id="gate-num" name="numero">${opts}</select>
          <label for="gate-pin" class="gate-l2">Tu PIN personal</label>
          <input id="gate-pin" name="pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="8" autocomplete="off" placeholder="4 a 8 cifras">
          <p class="gate-pin-ayuda">¿Primera vez? Inventa un PIN y apúntalo: con él verás tus tareas y notas desde cualquier ordenador.</p>
          <button type="submit" class="gate-go">Entrar</button>
          <p class="gate-err" id="gate-err-a" role="alert" hidden></p>
          <p class="gate-priv">No se pide tu nombre ni tu correo: el profesor solo ve tu grupo y tu número de lista. Tu PIN no se guarda: solo una huella cifrada.</p>
        </form>
        <div id="gate-profesor" class="gate-pane" hidden>
          <button type="button" class="gate-google" id="gate-google">${G_LOGO}<span>Iniciar sesión con Google</span></button>
          <p class="gate-err" id="gate-err-p" role="alert" hidden></p>
          <p class="gate-priv">Acceso del profesor al panel de grupos, conectados y entregas.</p>
        </div>
      </div>
    </div></div>`;
}

function mostrarGate({ cargando = false, aviso = '', error = '', pestaña = 'alumno' } = {}) {
  document.title = 'Portal docente';
  document.body.classList.add('is-gate');
  document.body.classList.remove('is-unlocked');
  document.querySelector('.loading')?.remove();
  if (!document.getElementById('gate')) { document.body.insertAdjacentHTML('afterbegin', gateHTML()); enlazarGate(); }
  document.getElementById('gate-loading').hidden = !cargando;
  document.getElementById('gate-body').hidden = cargando;
  if (!aviso) { try { aviso = sessionStorage.getItem(AVISO_KEY) || ''; sessionStorage.removeItem(AVISO_KEY); } catch (e) { } }
  const note = document.getElementById('gate-note');
  if (aviso && AVISOS[aviso]) { note.textContent = AVISOS[aviso]; note.hidden = false; }
  if (!cargando) {
    elegirPestaña(pestaña);
    if (error) fallo(pestaña, error);
    if (pestaña === 'alumno') setTimeout(() => document.getElementById('gate-code')?.focus(), 0);
  }
}
function elegirPestaña(r) {
  document.querySelectorAll('[data-gate-rol]').forEach(b => { const on = b.dataset.gateRol === r; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  document.getElementById('gate-alumno').hidden = r !== 'alumno';
  document.getElementById('gate-profesor').hidden = r !== 'profesor';
}
function fallo(r, txt) {
  const el = document.getElementById(r === 'alumno' ? 'gate-err-a' : 'gate-err-p');
  if (!el) return; el.textContent = txt; el.hidden = !txt;
}
function ocupado(on, btn, txt) {
  const f = document.getElementById('gate-body'); f.classList.toggle('busy', on);
  if (btn) { if (on) { btn.dataset.txt = btn.innerHTML; btn.textContent = txt; } else if (btn.dataset.txt) btn.innerHTML = btn.dataset.txt; btn.disabled = on; }
}
function enlazarGate() {
  document.querySelectorAll('[data-gate-rol]').forEach(b => b.addEventListener('click', () => { elegirPestaña(b.dataset.gateRol); fallo('alumno', ''); fallo('profesor', ''); }));
  const form = document.getElementById('gate-alumno');
  form.addEventListener('submit', (e) => { e.preventDefault(); entrarComoAlumno(); });
  document.getElementById('gate-google').addEventListener('click', () => entrarComoProfesor());
}

// ------------------------------------------------------------------ alumno
function motivoCodigo(snap, grupo) {
  if (!snap.exists()) return 'codigo_cambiado';
  const c = snap.data();
  if (grupo && c.grupo !== grupo) return 'codigo_cambiado';
  if (!c.activo) return 'cerrado';
  if (!enHorario(c.horario)) return 'horario';
  return null;
}

async function entrarComoAlumno() {
  const btn = document.querySelector('#gate-alumno .gate-go');
  if (btn.disabled) return;
  fallo('alumno', '');
  const input = document.getElementById('gate-code');
  const codigo = normalizaCodigo(input.value);
  const numero = parseInt(document.getElementById('gate-num').value, 10);
  if (!formatoCodigo(codigo)) { fallo('alumno', ERR.codigo); input.focus(); input.select(); return; }
  if (!(numero >= 1 && numero <= 40)) { fallo('alumno', ERR.numero); document.getElementById('gate-num').focus(); return; }
  const pinEl = document.getElementById('gate-pin'); const pin = String(pinEl.value || '').trim();
  if (!pinValido(pin)) { fallo('alumno', ERR.pin); pinEl.focus(); return; }
  ocupado(true, btn, 'Entrando…');
  const { auth, db } = fb;
  try {
    let user = auth.currentUser;
    if (user && !user.isAnonymous) { await signOut(auth); user = null; }
    if (user) {
      // Se reutiliza la sesión anónima de este navegador (Firebase limita las cuentas nuevas por red).
      const vieja = await getDoc(doc(db, 'sesiones', user.uid));
      if (vieja.exists()) {
        if (vieja.data().revocada) { await deleteUser(user).catch(() => signOut(auth)); user = null; }
        else await deleteDoc(vieja.ref).catch(() => { });
      }
    }
    if (!user) user = (await signInAnonymously(auth)).user;
    const snap = await getDoc(doc(db, 'codigos', codigo));
    const m = motivoCodigo(snap);
    if (m) { ocupado(false, btn); fallo('alumno', m === 'cerrado' ? ERR.cerrado : m === 'horario' ? ERR.horario : ERR.codigo); input.focus(); input.select(); return; }
    const c = snap.data();
    const h = await hashPin(c.grupo, numero, pin);
    try {
      await setDoc(doc(db, 'sesiones', user.uid), { codigo, grupo: c.grupo, numero, pagina: PORTAL.pagina(), desde: serverTimestamp(), latido: serverTimestamp(), revocada: false, pin: h });
    } catch (e) {
      if (e?.code === 'permission-denied') { ocupado(false, btn); fallo('alumno', ERR.pinMal); pinEl.value = ''; pinEl.focus(); return; }
      throw e;
    }
    // PIN: si este nº aún no tenía, se registra ahora (la primera vez). Si otro se adelantó con otro PIN, no se entra.
    const nuevo = await registrarPin(c.grupo, numero, h);
    if (nuevo === null) { await deleteDoc(doc(db, 'sesiones', user.uid)).catch(() => { }); ocupado(false, btn); fallo('alumno', ERR.pinMal); pinEl.value = ''; return; }
    if (nuevo) { try { sessionStorage.setItem('portal.pinNuevo', '1'); } catch (er) { } }
    entrarAlumno(user.uid, { codigo, grupo: c.grupo, numero }, c);
  } catch (e) {
    ocupado(false, btn);
    const code = String(e?.code || '');
    fallo('alumno', code === 'auth/too-many-requests' ? ERR.limite : code === 'permission-denied' ? ERR.codigo : esRed(e) ? ERR.red : ERR.otro);
    if (!/network|unavailable/.test(code)) console.warn('[portal] entrada de alumno:', code || e);
  }
}

// true = PIN nuevo registrado · false = ya estaba y coincide · null = no coincide
async function registrarPin(grupo, numero, h) {
  const ref = doc(fb.db, 'pines', `${grupo}_${numero}`);
  try { const d = await getDoc(ref); if (d.exists()) return false; } catch (e) { /* no existe o no coincide */ }
  try { await setDoc(ref, { h, creado: serverTimestamp() }); return true; } catch (e) { return null; }
}

function entrarAlumno(uid, s, c) {
  rol = 'alumno'; PORTAL.rol = 'alumno'; PORTAL.esProfesor = false;
  ses = { uid, ...s, grupoNombre: c.nombre }; codDoc = c;
  window.PORTAL_SESION = { asignaturas: (c.asignaturas || []).slice(), apartados: (c.apartados || []).slice(), grupo: c.nombre, numero: s.numero };
  aula = crearAula({ db: fb.db, rol: 'alumno', ses: { ...ses, asignaturas: (c.asignaturas || []).slice() } });
  vistas = crearVistas({ db: fb.db, aula, rol: 'alumno', ses, uid: () => uid });
  clase = crearClase({ db: fb.db, aula, rol: 'alumno', ses, estado: vistas.estado });
  ACC.loadApp();
  try { if (sessionStorage.getItem('portal.pinNuevo')) { sessionStorage.removeItem('portal.pinNuevo'); setTimeout(() => banner(`PIN guardado para el nº ${pad(s.numero)}. Apúntalo: lo necesitarás para entrar la próxima vez.`, 9000), 600); } } catch (e) { }
  const { db } = fb;
  unsubs.push(onSnapshot(doc(db, 'sesiones', uid), (snap) => {
    if (!snap.exists()) expulsar('caducada'); else if (snap.data().revocada) expulsar('expulsado');
  }, () => { }));
  unsubs.push(onSnapshot(doc(db, 'codigos', s.codigo), (snap) => {
    const m = motivoCodigo(snap, s.grupo); if (m) return expulsar(m);
    codDoc = snap.data();
    // cambios de asignaturas/apartados del grupo: se aplican al recargar la vista
    if (window.PORTAL_SESION) { window.PORTAL_SESION.asignaturas = (codDoc.asignaturas || []).slice(); window.PORTAL_SESION.apartados = (codDoc.apartados || []).slice(); }
  }, () => { }));
  unsubs.push(onSnapshot(query(collection(db, 'entregas'), where('uid', '==', uid)), (qs) => {
    entregas.clear();
    qs.forEach((d) => {
      const x = d.data({ serverTimestamps: 'estimate' });
      if (x.grupo !== s.grupo || x.numero !== s.numero) return; // solo las de esta sesión (grupo + nº)
      entregas.set(x.practica, { id: d.id, ...x, fecha: x.fecha?.toMillis ? x.fecha.toMillis() : Date.now(), pendiente: d.metadata.hasPendingWrites });
    });
    window.dispatchEvent(new Event('portal-entregas'));
  }, () => { }));
  ultimoLatido = Date.now();
  timer = setInterval(() => { if (Date.now() - ultimoLatido >= LATIDO_MS) latido(); }, 5000);
  window.addEventListener('hashchange', alCambiarPagina);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && Date.now() - ultimoLatido > LATIDO_MS / 2) latido(); });
  window.addEventListener('offline', () => banner('Sin conexión con el portal. Reintentando…'));
  window.addEventListener('online', () => { banner(''); latido(); });
}

function alCambiarPagina() {
  if (cerrando || rol !== 'alumno') return;
  clearTimeout(timerPagina);
  const espera = Math.max(300, MIN_PAGINA_MS - (Date.now() - ultimoLatido));
  timerPagina = setTimeout(latido, espera);
}

async function diagnosticar() {
  try {
    const s = await getDoc(doc(fb.db, 'sesiones', ses.uid));
    if (!s.exists()) return 'caducada';
    if (s.data().revocada) return 'expulsado';
    return motivoCodigo(await getDoc(doc(fb.db, 'codigos', ses.codigo)), ses.grupo);
  } catch (e) { return null; }
}

function latido() {
  if (cerrando || rol !== 'alumno' || !ses) return;
  if (Date.now() - ultimoLatido < 6000) return alCambiarPagina();
  if (codDoc && !enHorario(codDoc.horario)) return expulsar('horario');
  clearTimeout(timerPagina);
  ultimoLatido = Date.now();
  updateDoc(doc(fb.db, 'sesiones', ses.uid), { latido: serverTimestamp(), pagina: PORTAL.pagina() })
    .then(() => banner(''), async (e) => {
      if (e?.code === 'permission-denied') { const m = await diagnosticar(); if (m) expulsar(m); }
      else banner('Sin conexión con el portal. Reintentando…');
    });
}

function banner(txt, dura = 0) {
  let b = document.getElementById('portal-red');
  if (!txt) { b?.remove(); return; }
  if (!b) { b = document.createElement('div'); b.id = 'portal-red'; b.className = 'portal-red'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
  b.textContent = txt;
  if (dura) setTimeout(() => { if (b.textContent === txt) b.remove(); }, dura);
}

async function entregar({ practica, tipo, titulo, datos }) {
  if (rol !== 'alumno' || !ses) throw { mensaje: 'solo los alumnos con sesión pueden entregar.' };
  const id = `${ses.uid}_${ses.grupo}_${ses.numero}_${practica}`;
  const data = { uid: ses.uid, codigo: ses.codigo, grupo: ses.grupo, numero: ses.numero, practica, tipo, titulo, fecha: serverTimestamp(), datos, nota: null, comentario: '' };
  try {
    await conTimeout(setDoc(doc(fb.db, 'entregas', id), data), 15000);
  } catch (e) {
    if (e?.code === 'permission-denied') {
      const ya = entregas.get(practica);
      if (ya && ya.nota != null) throw { mensaje: 'esta entrega ya está corregida por el profesor.' };
      const m = await diagnosticar();
      if (m) { setTimeout(() => expulsar(m), 2500); throw { mensaje: AVISOS[m] }; }
      throw { mensaje: 'el portal no ha aceptado la entrega.' };
    }
    if (e?.timeout) throw { mensaje: 'sin conexión: se enviará sola cuando vuelva la conexión (no cierres la página).' };
    throw { mensaje: 'revisa la conexión.' };
  }
}

async function limpiarAlumno({ borrarUsuario }) {
  const { auth, db } = fb; const u = auth.currentUser;
  unsubs.forEach(f => { try { f(); } catch (e) { } }); unsubs = [];
  aula?.parar();
  clearInterval(timer); clearTimeout(timerPagina);
  if (!u) return;
  await conTimeout(deleteDoc(doc(db, 'sesiones', u.uid)), 3000).catch(() => { });
  if (borrarUsuario && u.isAnonymous) await conTimeout(deleteUser(u), 4000).catch(() => signOut(auth).catch(() => { }));
}

async function expulsar(motivo) {
  if (cerrando) return; cerrando = true;
  try { sessionStorage.setItem(AVISO_KEY, motivo); } catch (e) { }
  await limpiarAlumno({ borrarUsuario: motivo === 'expulsado' || motivo === 'salida' });
  location.reload();
}

async function salir() {
  if (rol === 'alumno') return expulsar('salida');
  if (cerrando) return; cerrando = true;
  try { sessionStorage.setItem(AVISO_KEY, 'salida'); } catch (e) { }
  panel?.parar();
  await signOut(fb.auth).catch(() => { });
  location.hash = ''; location.reload();
}

async function reanudarAlumno(user) {
  const { db } = fb;
  try {
    const s = await getDoc(doc(db, 'sesiones', user.uid));
    if (!s.exists()) return mostrarGate();
    const d = s.data();
    if (d.revocada) { await limpiarAlumno({ borrarUsuario: true }); return mostrarGate({ aviso: 'expulsado' }); }
    if (!d.pin) { await limpiarAlumno({ borrarUsuario: false }); return mostrarGate({ aviso: 'caducada' }); }
    const c = await getDoc(doc(db, 'codigos', d.codigo));
    const m = motivoCodigo(c, d.grupo);
    if (m) { await limpiarAlumno({ borrarUsuario: false }); return mostrarGate({ aviso: m }); }
    entrarAlumno(user.uid, { codigo: d.codigo, grupo: d.grupo, numero: d.numero }, c.data());
  } catch (e) {
    mostrarGate({ error: esRed(e) ? ERR.red : ERR.otro });
  }
}

// ------------------------------------------------------------------ profesor
async function entrarComoProfesor() {
  const btn = document.getElementById('gate-google');
  if (btn.disabled) return;
  fallo('profesor', '');
  const prov = new GoogleAuthProvider();
  prov.setCustomParameters({ prompt: 'select_account' });
  ocupado(true, btn, 'Abriendo Google…');
  try {
    if (fb.auth.currentUser) await signOut(fb.auth);
    const r = await signInWithPopup(fb.auth, prov);
    await comprobarProfesor(r.user, true);
  } catch (e) {
    const code = String(e?.code || '');
    // Ventanas emergentes bloqueadas o no admitidas (algunos móviles): se usa la redirección.
    if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/web-storage-unsupported'].includes(code)) {
      try { sessionStorage.setItem('portal.redir', '1'); } catch (er) { }
      return signInWithRedirect(fb.auth, prov);
    }
    ocupado(false, btn);
    fallo('profesor', code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request' ? ERR.popup : code === 'auth/unauthorized-domain' ? ERR.dominio : esRed(e) ? ERR.red : ERR.otro);
  }
}

async function comprobarProfesor(user, interactivo) {
  try {
    // Solo el profesor puede leer config/profesores (lo decide el servidor con las reglas).
    await getDoc(doc(fb.db, 'config', 'profesores'));
  } catch (e) {
    if (e?.code === 'permission-denied') {
      const email = user.email || 'indicada';
      await signOut(fb.auth).catch(() => { });
      return mostrarGate({ pestaña: 'profesor', error: `La cuenta ${email} no tiene permiso de profesor en este portal.` });
    }
    return mostrarGate({ pestaña: 'profesor', error: esRed(e) ? ERR.red : ERR.otro });
  }
  rol = 'profesor'; PORTAL.rol = 'profesor'; PORTAL.esProfesor = true;
  window.PORTAL_SESION = null;
  aula = crearAula({ db: fb.db, rol: 'profesor' });
  vistas = crearVistas({ db: fb.db, aula, rol: 'profesor', ses: null, uid: () => user.uid });
  clase = crearClase({ db: fb.db, aula, rol: 'profesor', ses: null, estado: vistas.estado });
  window.__clase = clase;
  panel = crearPanel({ db: fb.db, auth: fb.auth, email: user.email, PORTAL, aula });
  if (interactivo && (!location.hash || location.hash === '#' || location.hash === '#inicio')) history.replaceState(null, '', '#panel');
  ACC.loadApp();
}

// ------------------------------------------------------------------ arranque
export async function arrancar(cfg) {
  try { fb = iniciarFirebase(cfg); } catch (e) { console.error('[portal] Firebase no se ha podido iniciar', e); ACC.fallback?.(); return; }
  mostrarGate({ cargando: true });
  let errRedir = null, redir = false;
  try { redir = sessionStorage.getItem('portal.redir') === '1'; sessionStorage.removeItem('portal.redir'); } catch (e) { }
  if (redir) { try { await getRedirectResult(fb.auth); } catch (e) { errRedir = e; } }
  const user = await new Promise((res) => { const off = onAuthStateChanged(fb.auth, (u) => { off(); res(u); }); });
  if (errRedir) return mostrarGate({ pestaña: 'profesor', error: errRedir.code === 'auth/unauthorized-domain' ? ERR.dominio : ERR.otro });
  if (!user) return mostrarGate();
  if (user.isAnonymous) return reanudarAlumno(user);
  return comprobarProfesor(user, redir);
}

window.__portalFirebase = { arrancar, get rol() { return rol; }, get ses() { return ses; }, latido: () => { ultimoLatido = 0; latido(); } };
if (window.PORTAL_FIREBASE && !window.__portalNoAuto) arrancar(window.PORTAL_FIREBASE);
