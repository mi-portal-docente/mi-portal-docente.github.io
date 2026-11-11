/* Acceso al portal.
   - Si js/config-acceso.js tiene ENDPOINT (Apps Script + Hoja de Google): nombre + código de la
     asignatura, validados en el servidor, con latido para ver quién está conectado.
   - Si ENDPOINT está vacío: «código de clase» de siempre (solo hashes en js/acceso-config.js). */
(function () {
  'use strict';
  var LS_KEY = 'portal.acceso';
  var APP_SRC = 'js/app.js';

  function cfg() { return window.PORTAL_ACCESO || {}; }

  function normalizeCodigo(s) {
    return String(s).trim().toLowerCase().replace(/[\s\-]+/g, '-').replace(/^-|-$/g, '');
  }

  function toHex(buf) {
    var b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    var s = '';
    for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? '0' : '') + b[i].toString(16);
    return s;
  }

  /* SHA-256 en JS puro (respaldo si crypto.subtle no está, p.ej. algunos file://). */
  function sha256pure(bytes) {
    var K = [
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ];
    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var len = bytes.length;
    var bitLenHi = Math.floor(len / 0x20000000);
    var bitLenLo = (len << 3) >>> 0;
    var padLen = ((len + 9 + 63) & ~63);
    var buf = new Uint8Array(padLen);
    buf.set(bytes);
    buf[len] = 0x80;
    var view = new DataView(buf.buffer);
    view.setUint32(padLen - 8, bitLenHi, false);
    view.setUint32(padLen - 4, bitLenLo, false);
    var w = new Uint32Array(64);
    for (var i = 0; i < padLen; i += 64) {
      var t;
      for (t = 0; t < 16; t++) w[t] = view.getUint32(i + t * 4, false);
      for (t = 16; t < 64; t++) {
        var s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    var hex = '';
    for (var hi = 0; hi < 8; hi++) hex += ('00000000' + H[hi].toString(16)).slice(-8);
    return hex;
  }

  function sha256hexSync(text) {
    var bytes = new TextEncoder().encode(text);
    return sha256pure(bytes);
  }

  function sha256hex(text) {
    var bytes = new TextEncoder().encode(text);
    if (!window.__PORTAL_FORCE_PURE_SHA && globalThis.crypto && crypto.subtle) {
      return crypto.subtle.digest('SHA-256', bytes).then(function (buf) { return toHex(buf); });
    }
    return Promise.resolve(sha256pure(bytes));
  }

  function hashCodigo(code) {
    var c = cfg();
    return sha256hex(String(c.salt || '') + '\n' + normalizeCodigo(code));
  }

  function saved() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { return null; }
  }

  function isUnlocked() {
    var c = cfg();
    var s = saved();
    if (!s || s.version !== c.version || !s.hash) return false;
    return Array.isArray(c.hashes) && c.hashes.indexOf(s.hash) !== -1;
  }

  function remember(hash) {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ version: cfg().version, hash: hash })); } catch (e) {}
  }

  function forget() {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
  }

  function isRender() {
    try { return new URLSearchParams(location.search).get('render') === '1'; } catch (e) { return false; }
  }

  function gateHTML() {
    return (
      '<div class="gate" id="gate" role="dialog" aria-labelledby="gate-title">' +
        '<div class="gate-card">' +
          '<h1 id="gate-title">Portal docente</h1>' +
          '<form id="gate-form" autocomplete="off">' +
            '<label for="gate-code">Código de clase</label>' +
            '<input id="gate-code" name="codigo" type="text" inputmode="text" autocapitalize="off" autocomplete="off" spellcheck="false" autofocus>' +
            '<button type="submit" class="gate-go">Entrar</button>' +
            '<p class="gate-err" id="gate-err" hidden>El código no es correcto. Compruébalo y vuelve a intentarlo.</p>' +
          '</form>' +
        '</div>' +
      '</div>'
    );
  }

  function showGate() {
    document.title = 'Portal docente';
    document.body.classList.add('is-gate');
    document.body.classList.remove('is-unlocked');
    var loading = document.querySelector('.loading');
    if (loading) loading.remove();
    var existing = document.getElementById('gate');
    if (!existing) document.body.insertAdjacentHTML('afterbegin', gateHTML());
    var form = document.getElementById('gate-form');
    var input = document.getElementById('gate-code');
    var err = document.getElementById('gate-err');
    if (input) setTimeout(function () { input.focus(); }, 0);
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = input.value;
      err.hidden = true;
      form.classList.add('busy');
      hashCodigo(value).then(function (hash) {
        form.classList.remove('busy');
        var hashes = cfg().hashes || [];
        if (hashes.indexOf(hash) !== -1) {
          remember(hash);
          enterApp();
        } else {
          err.hidden = false;
          input.select();
          input.focus();
        }
      }).catch(function () {
        form.classList.remove('busy');
        err.hidden = false;
      });
    });
  }

  function mountSalir() {
    if (document.getElementById('btn-salir')) return;
    var b = document.createElement('button');
    b.id = 'btn-salir';
    b.type = 'button';
    b.className = 'btn-salir';
    b.textContent = 'Salir';
    b.title = 'Cerrar sesión de esta clase';
    b.addEventListener('click', function () {
      if (HOJA) { salirHoja(); return; }
      forget();
      location.reload();
    });
    document.body.appendChild(b);
  }

  function loadApp() {
    if (document.querySelector('script[data-portal-app]')) return;
    document.body.classList.remove('is-gate');
    document.body.classList.add('is-unlocked');
    var gate = document.getElementById('gate');
    if (gate) gate.remove();
    if (!document.querySelector('.loading') && !document.querySelector('header, #cover, main')) {
      var l = document.createElement('div');
      l.className = 'loading';
      l.textContent = 'Cargando el laboratorio…';
      document.body.appendChild(l);
    }
    var s = document.createElement('script');
    s.src = APP_SRC;
    s.dataset.portalApp = '1';
    s.onload = function () { mountSalir(); };
    s.onerror = function () {
      document.body.insertAdjacentHTML('beforeend', '<p class="loading">No se ha podido cargar la aplicación.</p>');
    };
    document.body.appendChild(s);
  }

  function enterApp() {
    loadApp();
  }

  /* ===================== Modo Hoja de Google (Apps Script) ===================== */
  var CONF = window.PORTAL_CONFIG || {};
  var ENDPOINT = String(CONF.ENDPOINT || '').trim();
  var HOJA = !!ENDPOINT;
  var SES_KEY = 'portal.sesion';
  var AVISO_KEY = 'portal.aviso';
  var latidoMs = Math.max(5, Number(CONF.LATIDO_SEGUNDOS) || 60) * 1000;
  var timer = null, ultimoEnvio = 0, ultimaPagina = '', enCurso = false, cerrando = false;

  var AVISOS = {
    expulsado: 'El profesor ha cerrado tu sesión.',
    codigo_cambiado: 'El código de la asignatura ha cambiado. Pide el nuevo al profesor.',
    caducada: 'Tu sesión ha terminado. Vuelve a entrar.',
    salida: 'Has salido del portal.'
  };
  var ERRORES = {
    codigo: 'El código no es correcto o la asignatura está cerrada. Compruébalo y vuelve a intentarlo.',
    nombre: 'Escribe tu nombre y la inicial del apellido (de 2 a 40 letras, sin símbolos).',
    red: 'No se puede conectar con el servidor. Comprueba la conexión a Internet y vuelve a intentarlo.',
    ocupado: 'El servidor está ocupado. Espera unos segundos y vuelve a intentarlo.',
    otro: 'No se ha podido entrar ahora mismo. Vuelve a intentarlo en un momento.'
  };

  function sesion() {
    try {
      var x = JSON.parse(localStorage.getItem(SES_KEY) || 'null');
      return x && x.token && x.ep === ENDPOINT ? x : null;
    } catch (e) { return null; }
  }
  function guardarSesion(x) { try { localStorage.setItem(SES_KEY, JSON.stringify(x)); } catch (e) {} }
  function borrarSesion() { try { localStorage.removeItem(SES_KEY); } catch (e) {} }

  function nombreValido(t) {
    t = String(t || '').replace(/\s+/g, ' ').trim();
    if (t.length < 2 || t.length > 40) return '';
    try { if (!new RegExp("^[\\p{L}\\p{N}][\\p{L}\\p{M}\\p{N} .'’\\-]*$", 'u').test(t)) return ''; }
    catch (e) { if (/[<>&"`=]/.test(t)) return ''; }
    return t;
  }

  /* POST con text/plain: Apps Script no admite la consulta previa (preflight) de CORS. fetch sigue la redirección. */
  function api(datos, ms) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms || 20000);
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos),
      redirect: 'follow',
      cache: 'no-store',
      credentials: 'omit',
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (j) { clearTimeout(to); return j || {}; },
      function (e) { clearTimeout(to); var err = new Error('red'); err.red = true; throw err; });
  }

  /* Texto legible del sitio donde está el alumno (lo que ve el profesor en «Apartado»). */
  function etiquetaPagina() {
    var h = location.hash || '#inicio';
    var m, t;
    if (h === '#' || h === '#inicio') t = 'Portada';
    else if (h === '#asignaturas') t = 'Asignaturas';
    else if (h === '#eee' || h === '#eee/') t = 'EEE · apartados';
    else if (h === '#eee/esp32') t = 'ESP32 · inicio';
    else if ((m = h.match(/^#p(\d)(?:-(\d+))?/))) t = 'ESP32 · Proyecto ' + m[1] + (m[2] ? ', paso ' + m[2] : '');
    else if ((m = h.match(/^#eee\/circuitos(?:\/([\w-]+))?/))) {
      var v = m[1] || '';
      t = 'Circuitos · ' + (!v ? 'inicio' : v === 'libre' ? 'modo libre' : /^c\d+$/.test(v) ? 'práctica ' + v.slice(1) : v);
    } else t = 'Otra página';
    return (t + ' (' + h + ')').slice(0, 100);
  }

  function gateHojaHTML(aviso) {
    return (
      '<div class="gate" id="gate" role="dialog" aria-labelledby="gate-title">' +
        '<div class="gate-card">' +
          '<h1 id="gate-title">Portal docente</h1>' +
          (aviso ? '<p class="gate-note" id="gate-note" role="status"></p>' : '') +
          '<form id="gate-form" autocomplete="off" novalidate>' +
            '<label for="gate-name">Tu nombre (nombre e inicial del apellido)</label>' +
            '<input id="gate-name" name="nombre" type="text" maxlength="40" autocomplete="off" spellcheck="false" placeholder="Ej.: Ana G.">' +
            '<label for="gate-code" class="gate-l2">Código de la asignatura</label>' +
            '<input id="gate-code" name="codigo" type="text" inputmode="text" maxlength="60" autocapitalize="off" autocomplete="off" spellcheck="false">' +
            '<button type="submit" class="gate-go">Entrar</button>' +
            '<p class="gate-err" id="gate-err" role="alert" hidden></p>' +
          '</form>' +
          '<p class="gate-priv">Tu nombre lo ve solo el profesor para saber quién está conectado; se borra periódicamente.</p>' +
        '</div>' +
      '</div>'
    );
  }

  function showGateHoja() {
    detenerLatido();
    document.title = 'Portal docente';
    document.body.classList.add('is-gate', 'gate-hoja');
    document.body.classList.remove('is-unlocked');
    var loading = document.querySelector('.loading');
    if (loading) loading.remove();
    var aviso = '';
    try { aviso = sessionStorage.getItem(AVISO_KEY) || ''; sessionStorage.removeItem(AVISO_KEY); } catch (e) {}
    if (!document.getElementById('gate')) document.body.insertAdjacentHTML('afterbegin', gateHojaHTML(aviso));
    if (aviso) document.getElementById('gate-note').textContent = AVISOS[aviso] || '';
    var form = document.getElementById('gate-form');
    var nom = document.getElementById('gate-name');
    var cod = document.getElementById('gate-code');
    var err = document.getElementById('gate-err');
    var btn = form.querySelector('.gate-go');
    setTimeout(function () { nom.focus(); }, 0);
    function fallo(k, campo) {
      err.textContent = ERRORES[k] || ERRORES.otro;
      err.hidden = false;
      if (campo) { campo.focus(); campo.select(); }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.classList.contains('busy')) return;
      err.hidden = true;
      var nombre = nombreValido(nom.value);
      if (!nombre) return fallo('nombre', nom);
      if (!cod.value.trim()) return fallo('codigo', cod);
      form.classList.add('busy');
      btn.textContent = 'Entrando…';
      api({ accion: 'login', nombre: nombre, codigo: cod.value, pagina: etiquetaPagina() }).then(function (r) {
        form.classList.remove('busy');
        btn.textContent = 'Entrar';
        if (r.ok && r.token) {
          guardarSesion({ ep: ENDPOINT, token: r.token, nombre: r.nombre || nombre, asignaturas: r.asignaturas || [], sesion: r.sesion });
          if (r.latido) latidoMs = Math.max(5000, Math.min(latidoMs, r.latido * 1000));
          entrarHoja(false);
        } else if (r.error === 'nombre') fallo('nombre', nom);
        else if (r.error === 'codigo') fallo('codigo', cod);
        else if (r.error === 'ocupado') fallo('ocupado');
        else fallo('otro');
      }).catch(function () {
        form.classList.remove('busy');
        btn.textContent = 'Entrar';
        fallo('red');
      });
    });
  }

  function entrarHoja(latidoYa) {
    var s = sesion();
    if (!s) { showGateHoja(); return; }
    window.PORTAL_SESION = { nombre: s.nombre, asignaturas: s.asignaturas || [] };
    loadApp();
    ultimaPagina = location.hash;
    iniciarLatido(latidoYa);
  }

  function banner(txt) {
    var b = document.getElementById('portal-red');
    if (!txt) { if (b) b.remove(); return; }
    if (!b) {
      b = document.createElement('div');
      b.id = 'portal-red';
      b.className = 'portal-red';
      b.setAttribute('role', 'status');
      document.body.appendChild(b);
    }
    b.textContent = txt;
  }

  function cerrarSesion(motivo) {
    if (cerrando) return;
    cerrando = true;
    detenerLatido();
    borrarSesion();
    try { sessionStorage.setItem(AVISO_KEY, motivo); } catch (e) {}
    location.reload();
  }

  function latido() {
    var s = sesion();
    if (!s) { cerrarSesion('caducada'); return Promise.resolve(); }
    if (enCurso || cerrando) return Promise.resolve();
    enCurso = true;
    ultimoEnvio = Date.now();
    ultimaPagina = location.hash;
    return api({ accion: 'latido', token: s.token, pagina: etiquetaPagina() }, 25000).then(function (r) {
      enCurso = false;
      banner('');
      if (r.estado === 'expulsado' || r.estado === 'codigo_cambiado' || r.estado === 'caducada') return cerrarSesion(r.estado);
      if (r.estado === 'ok' && Array.isArray(r.asignaturas)) {
        var antes = (s.asignaturas || []).join(',');
        if (antes !== r.asignaturas.join(',')) {
          s.asignaturas = r.asignaturas;
          guardarSesion(s);
          if (window.PORTAL_SESION) window.PORTAL_SESION.asignaturas = r.asignaturas;
        }
      }
    }, function () {
      enCurso = false;
      banner('Sin conexión con el servidor del portal. Reintentando…');
    });
  }

  function iniciarLatido(ya) {
    detenerLatido();
    timer = setInterval(function () {
      var cambio = location.hash !== ultimaPagina;
      if (Date.now() - ultimoEnvio >= latidoMs - 500 || (cambio && Date.now() - ultimoEnvio > 3000)) latido();
    }, 1000);
    window.addEventListener('hashchange', alCambiarPagina);
    document.addEventListener('visibilitychange', alVolver);
    if (!ya) latido();
  }
  function detenerLatido() {
    if (timer) clearInterval(timer);
    timer = null;
    window.removeEventListener('hashchange', alCambiarPagina);
    document.removeEventListener('visibilitychange', alVolver);
  }
  function alCambiarPagina() {
    // al cambiar de página se avisa enseguida (con un mínimo de 3 s entre envíos)
    if (Date.now() - ultimoEnvio > 3000) setTimeout(latido, 300);
  }
  function alVolver() { if (document.visibilityState === 'visible' && Date.now() - ultimoEnvio > 10000) latido(); }

  function salirHoja() {
    var s = sesion();
    detenerLatido();
    var fin = function () { cerrarSesion('salida'); };
    if (!s) return fin();
    api({ accion: 'logout', token: s.token }, 5000).then(fin, fin);
  }

  /* Para comprobaciones automáticas */
  window.__portalAcceso = {
    normalize: normalizeCodigo,
    sha256pure: sha256hexSync,
    hashCodigo: hashCodigo,
    isUnlocked: isUnlocked,
    key: LS_KEY,
    modo: HOJA ? 'hoja' : 'codigo',
    latido: function () { return latido(); },
    pagina: etiquetaPagina
  };

  if (isRender()) loadApp();
  else if (HOJA) { if (sesion()) entrarHoja(false); else showGateHoja(); }
  else if (isUnlocked()) loadApp();
  else showGate();
})();
