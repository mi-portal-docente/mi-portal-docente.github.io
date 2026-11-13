/* Acceso al portal.
   - Si js/firebase-config.js tiene apiKey y projectId: control de acceso con Firebase
     (profesor con Google; alumnos con código de grupo + número de lista, sin datos personales).
     Lo hace js/portal-fb.js, que se carga desde aquí.
   - Si la configuración de Firebase está vacía: «código de clase» de siempre
     (solo hashes en js/acceso-config.js). */
(function () {
  'use strict';
  var LS_KEY = 'portal.acceso';
  var APP_SRC = 'js/app.js?v=cur1-20261113';

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
          '<h1 id="gate-title">SuperProfe · Alumnos</h1>' +
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
    document.title = 'SuperProfe · Alumnos';
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

  /* Modo código de clase: botón «Salir» dentro de las migas de cada pantalla. */
  function modoCodigo() {
    window.PORTAL = {
      modo: 'codigo', rol: null, esProfesor: false,
      chipHTML: function () { return '<span class="pchip"><button type="button" class="pchip-b" data-portal="salir" title="Olvidar el código de clase en este navegador">Salir</button></span>'; },
      estadoEntrega: function () { return null; }
    };
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-portal="salir"]')) { forget(); location.reload(); }
    });
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
    s.onerror = function () {
      document.body.insertAdjacentHTML('beforeend', '<p class="loading">No se ha podido cargar la aplicación.</p>');
    };
    document.body.appendChild(s);
  }

  function enterApp() {
    loadApp();
  }

  /* Etiqueta legible del sitio donde está el alumno (lo que ve el profesor en «Conectados»). */
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
    } else if (/^#panel/.test(h)) t = 'Panel';
    else t = 'Otra página';
    return (t + ' (' + h.slice(0, 40) + ')').slice(0, 100);
  }

  /* ¿Hay configuración de Firebase? (js/firebase-config.js) */
  function firebaseConfig() {
    var c = window.PORTAL_FIREBASE;
    return c && String(c.apiKey || '').trim() && String(c.projectId || '').trim() ? c : null;
  }

  function cargarFirebase() {
    var s = document.createElement('script');
    s.src = 'js/portal-fb.js?v=cur1-20261113';
    s.onerror = function () {
      document.body.insertAdjacentHTML('afterbegin', '<p class="loading">No se ha podido cargar el control de acceso. Comprueba la conexión y recarga la página.</p>');
    };
    document.body.appendChild(s);
  }

  /* Para comprobaciones automáticas y para js/portal-fb.js */
  window.__portalAcceso = {
    normalize: normalizeCodigo,
    sha256pure: sha256hexSync,
    hashCodigo: hashCodigo,
    isUnlocked: isUnlocked,
    key: LS_KEY,
    modo: firebaseConfig() ? 'firebase' : 'codigo',
    loadApp: loadApp,
    pagina: etiquetaPagina,
    fallback: function () { modoCodigo(); if (isUnlocked()) loadApp(); else showGate(); }
  };

  if (isRender()) loadApp();
  else if (firebaseConfig()) cargarFirebase();
  else { modoCodigo(); if (isUnlocked()) loadApp(); else showGate(); }
})();
