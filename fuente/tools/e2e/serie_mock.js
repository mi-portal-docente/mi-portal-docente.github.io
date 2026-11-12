// Placa ESP32 simulada para las pruebas: sustituye navigator.serial (Web Serial) por un puerto falso
// que imita (1) el circuito de auto-reset DTR/RTS del CH340, (2) el cargador de la ROM del ESP32 y el
// «stub» de esptool (protocolo SLIP: sync, registros, subir stub, cambiar baudios, grabar comprimido,
// MD5) y (3) el REPL de MicroPython (normal y «raw»). Se configura con window.__mockCfg antes de cargar.
(() => {
  // Opciones extra para los caminos de reserva del grabador:
  //   muestreoIO0: ms tras subir EN en que la ROM lee GPIO0 (CH340 «lento»: solo valen los reinicios largos)
  //   maxBaud: por encima, la placa no entiende nada (cable/adaptador que no aguanta 921600)
  //   md5MalSobre: por encima de esos baudios, lo grabado llega corrupto (MD5 distinto)
  //   stubFalla: el stub no arranca (se graba solo con la ROM)
  //   autoReset:false + __mockPlaca.botonBoot(): placa sin auto-reset; se entra a mano (BOOT/GPIO0 + RESET)
  const cfg = Object.assign({ app: 'arduino', autoReset: true, hayPuerto: true, muestreoIO0: 15, maxBaud: 0, md5MalSobre: 0 }, window.__mockCfg || {});
  const enc = new TextEncoder(), dec = new TextDecoder();
  const M = window.__mockPlaca = { app: cfg.app, estado: 'app', stub: false, fs: {}, grabado: [], borrados: 0, resets: [], ordenes: [], abierto: false, baud: 0, ejecutando: null, raw: false, señales: [] };
  const BANNER = 'MicroPython v1.29.0 on 2026-08-24; Generic ESP32 module with ESP32\r\nType "help()" for more information.\r\n';
  let port = null;
  const push = (d) => { if (!port || !port.ctrl) return; try { port.ctrl.enqueue(typeof d === 'string' ? enc.encode(d) : d); } catch (e) {} };
  const tarde = (f, ms = 2) => setTimeout(f, ms);
  // MD5 en la propia página (antes se pedía a Node con exposeFunction: con 350 KB y la máquina cargada
  // tardaba más que el plazo de esptool-js y la placa simulada «no respondía»).
  function md5hex(b) {
    const K = new Uint32Array(64), S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
    const n = b.length, tot = (((n + 8) >>> 6) + 1) << 6, m = new Uint8Array(tot); m.set(b); m[n] = 0x80;
    const bits = n * 8; for (let i = 0; i < 8; i++) m[tot - 8 + i] = Math.floor(bits / 2 ** (8 * i)) & 255;
    const w = new Uint32Array(16); let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    for (let o = 0; o < tot; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = m[o + 4 * i] | (m[o + 4 * i + 1] << 8) | (m[o + 4 * i + 2] << 16) | (m[o + 4 * i + 3] << 24);
      let A = a0, B = b0, C = c0, D = d0;
      for (let i = 0; i < 64; i++) {
        let F, g;
        if (i < 16) { F = (B & C) | (~B & D); g = i; } else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) & 15; }
        else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) & 15; } else { F = C ^ (B | ~D); g = (7 * i) & 15; }
        const s = S[(i >> 4) * 4 + (i & 3)]; const t = (A + F + K[i] + w[g]) | 0;
        A = D; D = C; C = B; B = (B + ((t << s) | (t >>> (32 - s)))) | 0;
      }
      a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
    }
    return [a0, b0, c0, d0].map((x) => [0, 8, 16, 24].map((s) => ((x >>> s) & 255).toString(16).padStart(2, '0')).join('')).join('');
  }

  // ------------------------------------------------ arranque de la aplicación
  let tickApp = null;
  function arrancar(modo) {
    M.estado = modo; M.stub = false; M.raw = false; M.ejecutando = null; clearInterval(tickApp); tickApp = null;
    M.resets.push(modo);
    if (modo === 'rom') { tarde(() => push('ets Jun  8 2016 00:22:57\r\n\r\nrst:0x1 (POWERON_RESET),boot:0x3 (DOWNLOAD_BOOT(UART0/UART1/SDIO_REI_REO_V2))\r\nwaiting for download\r\n'), 5); return; }
    if (M.app === 'arduino') {
      tarde(() => push('ets Jun  8 2016 00:22:57\r\nrst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)\r\n'), 5);
      let n = 0; tickApp = setInterval(() => push(`Programa ${M.proyecto || 'Arduino'} en marcha · ${++n}\r\n`), 250);
    } else if (M.app === 'micropython') {
      tarde(() => { if (M.fs['main.py']) correrMain(); else push(BANNER + '>>> '); }, 5);
    }
  }
  function correrMain() {
    const c = dec.decode(M.fs['main.py']);
    if (/while True/.test(c)) { M.ejecutando = { main: true }; let n = 0; tickApp = setInterval(() => push(`[main.py] vuelta ${++n}\r\n`), 200); }
    else { push(salidaDe(c).out); push(BANNER + '>>> '); }
  }
  // ------------------------------------------------ señales (auto-reset con 2 transistores y condensador en EN)
  const S = { dtr: false, rts: false };
  const EN = () => !(S.rts && !S.dtr), IO0 = () => !(S.dtr && !S.rts);
  let enAntes = true, latch = null;
  function señales(s) {
    if ('dataTerminalReady' in s) S.dtr = !!s.dataTerminalReady;
    if ('requestToSend' in s) S.rts = !!s.requestToSend;
    M.señales.push([S.dtr, S.rts]);
    if (!cfg.autoReset) return;
    const en = EN();
    if (!en && enAntes) { clearTimeout(latch); latch = null; M.estado = 'reset'; clearInterval(tickApp); }
    if (en && !enAntes) { clearTimeout(latch); latch = setTimeout(() => arrancar(IO0() ? 'app' : 'rom'), cfg.muestreoIO0); }
    enAntes = en;
  }
  // ------------------------------------------------ SLIP / ROM / stub
  let slip = null, esc = false;
  const u32 = (b, i) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0;
  function slipEnc(bytes) { const o = [0xc0]; for (const x of bytes) { if (x === 0xc0) o.push(0xdb, 0xdc); else if (x === 0xdb) o.push(0xdb, 0xdd); else o.push(x); } o.push(0xc0); return new Uint8Array(o); }
  function resp(op, val = 0, data = [], status = [0, 0]) {
    const d = [...data, ...status]; const p = [1, op, d.length & 255, d.length >> 8, val & 255, (val >> 8) & 255, (val >> 16) & 255, (val >>> 24) & 255, ...d];
    push(slipEnc(p));
  }
  let flashCur = null;
  async function orden(p) {
    const op = p[1], len = p[2] | (p[3] << 8), d = p.slice(8, 8 + len);
    const ses = M.sesion; // si el puerto se cierra y se reabre mientras tanto, la respuesta se pierde (como en la placa)
    if (cfg.maxBaud && M.baud > cfg.maxBaud) { M.ignoradas = (M.ignoradas || 0) + 1; return; }
    M.ordenes.push(op);
    switch (op) {
      case 0x08: if (M.stub) resp(op, 0); else for (let i = 0; i < 8; i++) resp(op, 0x20120707); break;
      case 0x0a: { const a = u32(d, 0); resp(op, a === 0x40001000 ? 0x00f01d83 : a === 0x3ff5a004 ? 0x00000000 : 0); break; }
      case 0x14: push(slipEnc([1, 0x00, 4, 0, 0, 0, 0, 0, 1, 5, 0, 0])); break; // ROM: orden no admitida
      case 0x05: case 0x07: case 0x09: case 0x0b: case 0x0d: resp(op); break;
      case 0x06: resp(op); if (cfg.stubFalla) { M.stubFallos = (M.stubFallos || 0) + 1; break; } tarde(() => { if (ses !== M.sesion) return; M.stub = true; push(slipEnc(enc.encode('OHAI'))); }, 10); break;
      case 0x0f: resp(op); M.baud = u32(d, 0); break;
      case 0xd0: M.fs = {}; M.borrados++; resp(op); break;
      case 0x10: flashCur = { tam: u32(d, 0), dir: u32(d, 12), trozos: [] }; resp(op); break;
      case 0x11: flashCur.trozos.push(d.slice(16)); resp(op); break;
      case 0x12: resp(op); break;
      case 0x13: {
        const comp = new Blob(flashCur.trozos); const ds = new DecompressionStream('deflate');
        const datos = new Uint8Array(await new Response(comp.stream().pipeThrough(ds)).arrayBuffer());
        if (ses !== M.sesion) return;
        const md5 = md5hex(datos);
        const raw = md5.match(/../g).map((h) => parseInt(h, 16));
        const corrupto = cfg.md5MalSobre && M.baud > cfg.md5MalSobre;
        if (corrupto) { raw[0] ^= 0xff; M.corruptos = (M.corruptos || 0) + 1; resp(op, 0, raw); break; }
        M.grabado.push({ dir: flashCur.dir, tam: datos.length, md5, baud: M.baud, stub: M.stub });
        if (flashCur.dir === 0x1000 && datos.length > 1000000) { M.app = 'micropython'; } else if (flashCur.dir === 0) { M.app = 'arduino'; M.proyecto = 'P' + (window.__mockProyecto || '?'); }
        resp(op, 0, M.stub ? raw : Array.from(enc.encode(md5))); break; // la ROM responde 32 caracteres ASCII
      }
      default: push(slipEnc([1, 0x00, 4, 0, 0, 0, 0, 0, 1, 5, 0, 0]));
    }
  }
  function entradaRom(b) {
    for (const x of b) {
      if (x === 0xc0) { if (slip && slip.length) { const p = new Uint8Array(slip); slip = null; orden(p); } else slip = []; continue; }
      if (!slip) continue;
      if (esc) { slip.push(x === 0xdc ? 0xc0 : 0xdb); esc = false; } else if (x === 0xdb) esc = true; else slip.push(x);
    }
  }
  // ------------------------------------------------ MicroPython simulado
  function bytesDe(lit) { // b'...' → bytes
    const s = lit.slice(2, -1); const o = [];
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '\\') { const n = s[i + 1]; if (n === 'x') { o.push(parseInt(s.substr(i + 2, 2), 16)); i += 3; } else { o.push(n.charCodeAt(0)); i++; } }
      else o.push(s.charCodeAt(i));
    }
    return new Uint8Array(o);
  }
  let abierto = null;
  function salidaDe(c) {
    let m;
    if ((m = c.match(/^f=open\('(.+?)','wb'\)/))) { abierto = m[1]; M.fs[abierto] = new Uint8Array(0); return { out: '', err: '' }; }
    if ((m = c.match(/^w\((b'[\s\S]*')\)$/))) { const n = bytesDe(m[1]); const a = M.fs[abierto]; const t = new Uint8Array(a.length + n.length); t.set(a); t.set(n, a.length); M.fs[abierto] = t; return { out: '', err: '' }; }
    if (c === 'f.close()') { abierto = null; return { out: '', err: '' }; }
    if ((m = c.match(/os\.stat\('(.+?)'\)\[6\]/))) return M.fs[m[1]] ? { out: M.fs[m[1]].length + '\r\n', err: '' } : { out: '', err: 'Traceback (most recent call last):\r\n  File "<stdin>", line 2, in <module>\r\nOSError: [Errno 2] ENOENT\r\n' };
    if ((m = c.match(/os\.remove\('(.+?)'\)/))) { delete M.fs[m[1]]; return { out: '', err: '' }; }
    if (/nombre_que_no_existe/.test(c)) return { out: '', err: 'Traceback (most recent call last):\r\n  File "<stdin>", line 1, in <module>\r\nNameError: name \'nombre_que_no_existe\' isn\'t defined\r\n' };
    const antes = c.split(/while True/)[0];
    const out = [...antes.matchAll(/^\s*print\((["'])(.*?)\1/gm)].map((x) => x[2] + '\r\n').join('');
    return { out, err: '' };
  }
  let rawBuf = '';
  function entradaMP(b) {
    for (const ch of dec.decode(b)) {
      if (M.ejecutando && ch === '\x03') {
        const e = M.ejecutando; M.ejecutando = null; clearInterval(tickApp); tickApp = null;
        const tb = 'Traceback (most recent call last):\r\n  File "' + (e.main ? 'main.py' : '<stdin>') + '", line 9, in <module>\r\nKeyboardInterrupt: \r\n';
        if (e.raw) push('\x04' + tb + '\x04>'); else push(tb + '>>> ');
        continue;
      }
      if (M.raw) {
        if (ch === '\x02') { M.raw = false; push('\r\n' + BANNER + '>>> '); }
        else if (ch === '\x03') { rawBuf = ''; }
        else if (ch === '\x01') { rawBuf = ''; push('\r\nraw REPL; CTRL-B to exit\r\n>'); }
        else if (ch === '\x04') {
          const code = rawBuf; rawBuf = ''; push('OK');
          if (/while True/.test(code) && !/^(w\(|f=open|import os)/.test(code)) {
            const r = salidaDe(code); push(r.out); M.ejecutando = { raw: true }; let n = 0;
            tickApp = setInterval(() => push(`vuelta ${++n}\r\n`), 150);
          } else { const r = salidaDe(code); tarde(() => push(r.out + '\x04' + r.err + '\x04>'), 3); }
        } else rawBuf += ch;
        continue;
      }
      if (ch === '\x03') push('\r\n>>> ');
      else if (ch === '\x02') push('\r\n' + BANNER + '>>> ');
      else if (ch === '\x01') { M.raw = true; rawBuf = ''; push('\r\nraw REPL; CTRL-B to exit\r\n>'); }
      else if (ch === '\x04') { push('MPY: soft reboot\r\n'); tarde(() => { if (M.fs['main.py']) correrMain(); else push(BANNER + '>>> '); }, 5); }
      else if (ch === '\r') push('\r\n>>> ');
      else if (ch !== '\n') push(ch);
    }
  }
  // ------------------------------------------------ puerto falso
  class Puerto extends EventTarget {
    constructor() { super(); this.readable = null; this.writable = null; this.ctrl = null; }
    getInfo() { return { usbVendorId: 0x1a86, usbProductId: 0x7523 }; }
    async open({ baudRate }) {
      if (this.readable) throw new DOMException('The port is already open.', 'InvalidStateError');
      M.abierto = true; M.baud = baudRate; M.sesion = (M.sesion || 0) + 1;
      this.readable = new ReadableStream({ start: (c) => { this.ctrl = c; } }, { highWaterMark: 1 << 20 });
      this.writable = new WritableStream({ write: (chunk) => { const b = new Uint8Array(chunk); if (M.estado === 'rom') entradaRom(b); else if (M.estado === 'app' && M.app === 'micropython') entradaMP(b); } });
      S.dtr = true; S.rts = true; enAntes = EN();
      if (!M.encendida) { M.encendida = true; arrancar('app'); M.resets.length = 0; }
    }
    async setSignals(s) { if (!this.readable) throw new DOMException('closed', 'InvalidStateError'); señales(s); }
    async getSignals() { return { dataCarrierDetect: false, clearToSend: false, ringIndicator: false, dataSetReady: false }; }
    async close() {
      if (!this.readable) throw new DOMException('The port is already closed.', 'InvalidStateError');
      if (this.readable.locked || this.writable.locked) throw new TypeError('Failed to execute \'close\' on \'SerialPort\': Cannot cancel a locked stream');
      try { this.ctrl.close(); } catch (e) {}
      this.readable = null; this.writable = null; this.ctrl = null; M.abierto = false; M.sesion = (M.sesion || 0) + 1;
    }
    async forget() {}
  }
  const serial = new EventTarget();
  serial.requestPort = async () => { if (!cfg.hayPuerto) throw new DOMException('No port selected by the user.', 'NotFoundError'); port = port || new Puerto(); return port; };
  serial.getPorts = async () => (port ? [port] : []);
  M.botonBoot = () => { clearInterval(tickApp); arrancar('rom'); };
  M.desenchufar = () => { const p = port; if (!p) return; try { p.ctrl?.error(new DOMException('The device has been lost.', 'NetworkError')); } catch (e) {} p.readable = null; p.writable = null; M.abierto = false; const ev = new Event('disconnect'); ev.port = p; serial.dispatchEvent(ev); };
  Object.defineProperty(navigator, 'serial', { value: serial, configurable: true });
  if (cfg.app === 'arduino') M.proyecto = 'de fábrica';
})();
