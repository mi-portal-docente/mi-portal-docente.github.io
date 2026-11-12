// Conexión con la placa por Web Serial (Chrome/Edge en ordenador o Chromebook).
// Un único puerto para todo: monitor serie, MicroPython y grabación (esta última lo cierra
// y se lo presta a esptool-js, que lo abre a su manera).

// Chips USB-serie habituales en placas ESP32: CH340/CH341 (WCH, el de la ESP32 Plus),
// CP210x (Silicon Labs), FTDI y el USB nativo de Espressif.
export const FILTROS = [{ usbVendorId: 0x1a86 }, { usbVendorId: 0x10c4 }, { usbVendorId: 0x0403 }, { usbVendorId: 0x303a }];
const CHIPS = { 0x1a86: 'CH340', 0x10c4: 'CP210x', 0x0403: 'FTDI', 0x303a: 'USB de Espressif' };
export const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// Compatibilidad: lo que hace falta para hablar con la placa desde la página.
export function compatibilidad(nav = navigator, win = window) {
  const ua = nav.userAgent || '';
  const movil = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1);
  const seguro = win.isSecureContext !== false;
  const serie = !!(nav.serial && typeof nav.serial.requestPort === 'function');
  let motivo = '';
  if (!seguro) motivo = 'La página no se ha abierto con https:// (o desde localhost). Abre el portal desde su dirección web, no desde un archivo.';
  else if (!serie && movil) motivo = 'En tablets y móviles (iPad, Android) el navegador no puede usar el puerto USB de la placa. Usa un ordenador o un Chromebook.';
  else if (!serie) motivo = 'Este navegador no puede usar el puerto USB de la placa. Abre el portal con Google Chrome o Microsoft Edge (en Windows, macOS, Linux o Chromebook).';
  return { ok: seguro && serie, motivo, firefox: /Firefox\//.test(ua) };
}

export class PuertoSerie {
  constructor(serial = navigator.serial) {
    this.serial = serial; this.port = null; this.abierto = false; this.baud = 115200;
    this.lector = null; this.bucle = null; this.oyentes = new Set();
    this.alDesconectar = null;
    serial?.addEventListener?.('disconnect', (e) => { if (e.target === this.port || e.port === this.port) this._perdido(); });
  }
  get info() { const i = this.port?.getInfo?.() || {}; return { chip: CHIPS[i.usbVendorId] || 'USB-serie', vid: i.usbVendorId, pid: i.usbProductId }; }
  alRecibir(fn) { this.oyentes.add(fn); return () => this.oyentes.delete(fn); }
  // Pide al usuario el puerto (ventana del navegador). todos=true: sin filtrar por chip.
  async elegir(todos = false) {
    this.port = await this.serial.requestPort(todos ? {} : { filters: FILTROS });
    return this.port;
  }
  async abrir(baud = this.baud) {
    if (!this.port) throw new Error('sin-puerto');
    if (this.abierto) await this.cerrar();
    this.baud = baud;
    await this.port.open({ baudRate: baud, bufferSize: 8192 });
    this.abierto = true;
    // DTR y RTS en reposo: con el circuito de auto-reset de la placa, ni reinicia ni entra en modo grabación.
    try { await this.port.setSignals({ dataTerminalReady: false, requestToSend: false }); } catch (e) { /* algunos adaptadores no lo admiten */ }
    this._leer();
  }
  _leer() {
    const port = this.port;
    this.bucle = (async () => {
      while (this.abierto && port.readable) {
        const r = port.readable.getReader(); this.lector = r;
        try {
          for (;;) { const { value, done } = await r.read(); if (done) break; if (value && value.length) for (const f of this.oyentes) f(value); }
        } catch (e) { /* error de lectura (cable movido): se reintenta o se sale */ }
        finally { try { r.releaseLock(); } catch (e) {} this.lector = null; }
        if (!this.abierto) break;
        await espera(50);
      }
    })();
  }
  // Escrituras en cola: el puerto solo admite un «writer» a la vez (p. ej. ■ Parar mientras termina ▶ Ejecutar).
  escribir(datos) {
    const b = typeof datos === 'string' ? new TextEncoder().encode(datos) : datos;
    const t = (this._cola || Promise.resolve()).catch(() => {}).then(async () => {
      if (!this.abierto || !this.port?.writable) throw new Error('sin-conexion');
      const w = this.port.writable.getWriter(); this.escritor = w;
      try { await w.write(b); } finally { this.escritor = null; w.releaseLock(); }
    });
    this._cola = t;
    return t;
  }
  // Reinicio normal (como el botón RESET): EN a 0 un momento con IO0 en alto.
  async reiniciar() {
    if (!this.abierto) return;
    await this.port.setSignals({ dataTerminalReady: false, requestToSend: true });
    await espera(120);
    await this.port.setSignals({ dataTerminalReady: false, requestToSend: false });
  }
  // Libera el puerto del todo: para el bucle de lectura, vacía la cola de escritura y cierra.
  // Web Serial no deja cerrar mientras haya un lector o un escritor con el stream bloqueado, y esptool-js
  // necesita abrirlo él mismo: por eso se comprueba que de verdad queda cerrado (estricto=true lanza error).
  async cerrar({ estricto = false } = {}) {
    const port = this.port; if (!port) return true;
    this.abierto = false;
    try { await this.lector?.cancel(); } catch (e) {}
    await Promise.race([Promise.resolve(this.bucle).catch(() => {}), espera(1500)]);
    if (this.escritor) { try { await this.escritor.abort(); } catch (e) {} }
    await Promise.race([Promise.resolve(this._cola).catch(() => {}), espera(1500)]);
    this._cola = null; this.bucle = null;
    let ultimo = null;
    for (let i = 0; i < 10; i++) {
      if (!port.readable && !port.writable) return true;
      try { await port.close(); return true; }
      catch (e) {
        ultimo = e;
        if (/already closed/i.test(e?.message || '')) return true;
        try { if (port.readable?.locked) await this.lector?.cancel(); } catch (e2) {}
        await espera(100 + i * 50);
      }
    }
    this.errorCierre = ultimo;
    if (estricto) throw new Error('No se ha podido liberar el puerto: ' + (ultimo?.message || ultimo || 'bloqueado'));
    return false;
  }
  async olvidar() { await this.cerrar(); try { await this.port?.forget?.(); } catch (e) {} this.port = null; }
  _perdido() { this.abierto = false; this.lector = null; const f = this.alDesconectar; this.port = null; if (f) f(); }
}
