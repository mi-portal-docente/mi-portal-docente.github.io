// Último paso de cada proyecto ESP32: «Conecta y graba tu placa». Conectar por USB (Web Serial), grabar el
// proyecto ya compilado (p1.bin … p8.bin) con el grabador reforzado (grabador.js), ver el monitor serie y,
// si algo falla, un resumen en español, «Reintentar» y el registro técnico completo para copiarlo.
import { PuertoSerie, compatibilidad, espera } from './serie.js';
import { grabar, cargarBin, resumenError, infoCabecera, MENSAJE_BOOT, PASOS, VERSION_ESPTOOL } from './grabador.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export class GrabarPlaca {
  constructor(o = {}) {
    this.o = o; this.L = null;
    this.compat = compatibilidad();
    this.ps = new PuertoSerie(navigator.serial);
    this.ps.alDesconectar = () => { this.aviso('Placa desconectada. Vuelve a enchufarla y pulsa «Conectar placa».', 'mal'); this.pintarCon(); };
    this.dec = new TextDecoder();
    this.ps.alRecibir((b) => this.mon(this.dec.decode(b, { stream: true })));
    this.ocupado = false; this.manifest = null; this.registro = '';
    this.el = document.createElement('div'); this.el.className = 'pg';
    this.montar();
  }
  get conectada() { return !!(this.ps.port && this.ps.abierto); }
  // Se llama al entrar en el último paso de un proyecto (L = {n, title}). El mismo bloque sirve para todos.
  proyecto(L) {
    const cambia = !this.L || this.L.n !== L.n;
    this.L = L;
    const b = this.el.querySelector('[data-acc=grabar]'); if (b) b.textContent = `⚡ Grabar P${L.n} en la placa`;
    this.el.querySelector('#pgNombre').textContent = `P${L.n} · ${L.title}`;
    if (cambia && !this.ocupado) { this.aviso(''); this.mostrarFallo(null); const p = this.el.querySelector('#plProg'); if (p) p.hidden = true; }
    this.pintarCon();
  }
  montar() {
    const c = this.compat;
    this.el.innerHTML = `
      ${c.ok ? '' : `<div class="pl-aviso" role="alert"><b>⚠️ No se puede conectar con la placa desde aquí.</b> ${esc(c.motivo)}</div>`}
      <ol class="pg-guia">
        <li>Comprueba el montaje con el modelo 3D y pon el interruptor de la placa como indica la ficha.</li>
        <li>Conecta la placa al ordenador con el <b>cable USB de datos</b> y pulsa <b>Conectar placa</b> (elige «USB2.0-Serial» o «CH340»).</li>
        <li>Pulsa <b>Grabar</b> y espera a que la barra llegue al 100 %. La placa se reinicia sola y el monitor muestra lo que escribe el programa.</li>
      </ol>
      <div class="pl-con">
        <span id="plEstado" class="pl-est off" role="status">🔴 Sin conectar</span>
        <span id="plChip" class="pl-chip"></span>
        <span class="grow"></span>
        <button type="button" class="btn" id="plConectar" ${c.ok ? '' : 'disabled'}>🔌 Conectar placa</button>
        <button type="button" class="btn" id="plDesconectar" hidden>Desconectar</button>
        <button type="button" class="btn" id="plReiniciar" hidden title="Como pulsar el botón RESET de la placa">↺ Reiniciar placa</button>
      </div>
      <div class="pg-grabar"><b id="pgNombre"></b><button type="button" class="btn primary" data-acc="grabar" ${c.ok ? '' : 'disabled'}>⚡ Grabar en la placa</button></div>
      <div id="plMsg" class="pl-msg" hidden></div>
      <div id="plProg" class="pl-prog" hidden><div class="pl-prog-t"><b id="plProgFase">Preparando…</b><span id="plProgPct">0 %</span></div>
        <div class="pl-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Progreso de la grabación"><div id="plBar"></div></div></div>
      <div id="plFallo" class="pl-fallo" role="alert" hidden></div>
      <details class="pl-log" id="plDet"><summary>Detalles técnicos</summary>
        <div class="pl-log-b"><button type="button" class="btn sm" data-acc="copiar-log">📋 Copiar registro</button><span id="plCopiado" class="small muted" aria-live="polite"></span><span class="grow"></span><span class="small muted">Si falla, copia el registro y envíaselo al profesor.</span></div>
        <pre id="plLog">Todavía no se ha grabado nada.</pre></details>
      <div class="pl-mon" aria-label="Monitor serie">
        <div class="pl-mon-h"><b>Monitor serie</b><select id="plBaud" title="Velocidad (baudios)"><option>115200</option><option>9600</option></select><label class="pl-auto"><input type="checkbox" id="plAuto" checked> seguir</label><button type="button" class="btn sm" id="plLimpiar">Limpiar</button></div>
        <pre id="plMonTxt" class="pl-mon-txt" aria-live="off"></pre>
        <form id="plEnviar" class="pl-mon-in"><input id="plLinea" autocomplete="off" placeholder="Escribe y pulsa Intro para enviarlo a la placa"><button class="btn sm">Enviar</button></form>
      </div>
      <details class="pg-ayuda"><summary>🛟 Si algo no funciona</summary><ul>
        <li><b>Navegador:</b> Google Chrome o Microsoft Edge en un ordenador (Windows, macOS, Linux) o Chromebook. No funciona en iPad ni en móviles.</li>
        <li><b>No aparece ningún puerto:</b> el cable puede ser solo de carga; prueba otro cable y otro puerto USB (sin regleta). <a href="#" data-acc="todos">Mostrar todos los puertos</a>.</li>
        <li><b>Windows:</b> el chip USB de la placa es un <b>CH340</b>. Windows suele instalar el controlador solo la primera vez; si en el Administrador de dispositivos sale «USB2.0-Serial» con un triángulo amarillo, hay que instalar el controlador CH340 de WCH. macOS, Chromebook y Linux ya lo traen.</li>
        <li><b>Puerto ocupado:</b> cierra Arduino IDE, AceCode, Thonny u otras pestañas que usen la placa.</li>
        <li><b>No entra en modo grabación:</b> esta placa no tiene botón BOOT. Une con un cable el pin <b>GPIO0</b> con <b>GND</b>, pulsa RESET, pulsa Reintentar y quita el cable al terminar. Desconecta también lo que haya en los pines 0, 2, 12 y 15.</li>
        <li><b>Grabado pero no hace nada:</b> revisa el interruptor <b>3.3V / 5V</b> y el montaje, y pulsa «↺ Reiniciar placa» con el monitor a 115200.</li>
        <li>También puedes grabarlo con Arduino IDE (pestaña «Software» y «Código»).</li></ul></details>`;
    const $ = (s) => this.el.querySelector(s);
    $('#plConectar').onclick = () => this.conectar();
    $('#plDesconectar').onclick = () => this.desconectar();
    $('#plReiniciar').onclick = () => this.ps.reiniciar().catch(() => {});
    $('#plLimpiar').onclick = () => { $('#plMonTxt').textContent = ''; };
    $('#plBaud').onchange = async (e) => { if (this.conectada && !this.ocupado) { await this.ps.abrir(+e.target.value).catch(() => {}); this.pintarCon(); } };
    $('#plEnviar').onsubmit = (e) => { e.preventDefault(); const i = $('#plLinea'); if (!this.conectada) return this.aviso('Conecta primero la placa.', 'mal'); this.ps.escribir(i.value + '\r\n').catch(() => {}); i.value = ''; };
    this.el.addEventListener('click', (e) => {
      const a = e.target.closest('[data-acc]'); if (!a) return;
      const acc = a.dataset.acc; if (a.tagName === 'A') e.preventDefault();
      if (acc === 'grabar') return this.grabarProyecto();
      if (acc === 'copiar-log') return this.copiarRegistro();
      if (acc === 'reintentar') return this.grabarProyecto({ manual: a.dataset.modo === 'manual' });
      if (acc === 'todos') return this.conectar(true);
    });
  }
  // ---------------------------------------------------------------- conexión
  pintarCon() {
    const $ = (s) => this.el.querySelector(s); const c = this.conectada;
    $('#plConectar').hidden = c; $('#plDesconectar').hidden = !c; $('#plReiniciar').hidden = !c;
    const est = $('#plEstado'); est.className = 'pl-est ' + (c ? 'on' : 'off');
    est.textContent = c ? `🟢 Conectada · ${this.ps.baud} baudios` : '🔴 Sin conectar';
    $('#plChip').textContent = c ? this.ps.info.chip : '';
    this.el.querySelectorAll('[data-acc=grabar],#plDesconectar,#plReiniciar,#plConectar').forEach((b) => { b.disabled = this.ocupado || !this.compat.ok; });
  }
  async conectar(todos = false) {
    if (!this.compat.ok) { this.aviso(this.compat.motivo, 'mal'); return false; }
    try { await this.ps.elegir(todos); }
    catch (e) {
      if (e?.name === 'NotFoundError') this.aviso('No has elegido ninguna placa. Si no aparece en la lista, abre «🛟 Si algo no funciona» (cable de datos, controlador CH340 en Windows).', 'mal');
      else this.aviso('No se ha podido acceder al puerto: ' + (e?.message || e), 'mal');
      return false;
    }
    try { await this.ps.abrir(+this.el.querySelector('#plBaud').value || 115200); }
    catch (e) { this.aviso('El puerto está ocupado (¿Arduino IDE, AceCode u otra pestaña lo tienen abierto?). Ciérralo y vuelve a conectar.', 'mal'); this.pintarCon(); return false; }
    this.aviso(''); this.pintarCon();
    return true;
  }
  async desconectar() { await this.ps.cerrar(); this.pintarCon(); this.aviso('Placa desconectada. Ya puedes desenchufarla.'); }
  // ---------------------------------------------------------------- mensajes, monitor y registro
  aviso(t, tipo = '') { const m = this.el.querySelector('#plMsg'); m.hidden = !t; m.className = 'pl-msg ' + tipo; m.innerHTML = t ? esc(t).replace(/\n/g, '<br>') : ''; }
  mon(t) {
    t = t.replace(/\r\n/g, '\n').replace(/\r/g, ''); if (!t) return;
    const pre = this.el.querySelector('#plMonTxt');
    pre.appendChild(document.createTextNode(t));
    if (pre.childNodes.length > 600) pre.textContent = pre.textContent.slice(-20000);
    if (this.el.querySelector('#plAuto')?.checked) pre.scrollTop = pre.scrollHeight;
  }
  log(t) {
    this.registro += t;
    if (this.registro.length > 600000) this.registro = this.registro.slice(0, 20000) + '\n[…recortado…]\n' + this.registro.slice(-500000);
    const pre = this.el.querySelector('#plLog'); if (!pre) return;
    pre.textContent = this.registro.length > 120000 ? '[…] ' + this.registro.slice(-120000) : this.registro;
    pre.scrollTop = pre.scrollHeight;
  }
  cabeceraRegistro(nombre, archivos, opc) {
    const v = (document.querySelector('script[src*="js/app.js"]')?.getAttribute('src') || '').split('v=')[1] || '?';
    const i = this.ps.info;
    const usb = i.vid != null ? `${i.chip} (VID ${i.vid.toString(16).padStart(4, '0')} · PID ${(i.pid ?? 0).toString(16).padStart(4, '0')})` : 'desconocido';
    return [`Registro de grabación · ${new Date().toISOString()}`, `Firmware: ${nombre}`,
      ...archivos.map((f) => `  0x${f.address.toString(16)}: ${f.data.length} bytes · cabecera ${infoCabecera(f.data, f.address) || '—'}`),
      `Opciones: ${opc.manual ? 'modo manual (BOOT/GPIO0), sin reinicio · ' : ''}flash keep (DIO 4MB de la imagen) · comprimido · MD5`,
      `Adaptador USB: ${usb}`, `Navegador: ${navigator.userAgent}`, `Portal: ${v} · esptool-js ${VERSION_ESPTOOL}`, ''].join('\n') + '\n';
  }
  async copiarRegistro() {
    const t = this.registro || this.el.querySelector('#plLog')?.textContent || '';
    let hecho = false;
    try { await navigator.clipboard.writeText(t); hecho = true; } catch (e) {
      try { const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); hecho = document.execCommand('copy'); ta.remove(); } catch (e2) {}
    }
    const ok = this.el.querySelector('#plCopiado');
    if (ok) ok.textContent = hecho ? '✅ Registro copiado: pégalo en un mensaje al profesor.' : 'No se ha podido copiar: selecciona el texto y cópialo a mano.';
    return hecho;
  }
  mostrarFallo(r) {
    const box = this.el.querySelector('#plFallo'); if (!box) return;
    if (!r) { box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;
    box.innerHTML = `<b>❌ ${esc(r.titulo)}.</b><div>${esc(r.que)}</div>
      ${r.manual ? `<div class="pl-boot"><b>${esc(MENSAJE_BOOT)}.</b><div class="small muted">En la ESP32 Plus no hay botón BOOT: une con un cable el pin <b>GPIO0</b> (en la tira de pines) con <b>GND</b>, pulsa RESET, pulsa Reintentar y quita el cable al terminar.</div></div>` : ''}
      <div class="pl-fallo-b"><button type="button" class="btn primary" data-acc="reintentar" data-modo="${r.manual ? 'manual' : ''}">↻ Reintentar</button><button type="button" class="btn" data-acc="copiar-log">📋 Copiar registro</button></div>
      <div class="small muted">Detalle: ${esc(r.detalle.slice(0, 300))}</div>`;
  }
  progreso(p, fase) {
    const F = { ...Object.fromEntries(Object.entries(PASOS).map(([k, v]) => [k, v + '…'])), borrando: 'Borrando la memoria…', grabando: 'Grabando…', reiniciando: 'Reiniciando la placa…', descargando: 'Descargando el firmware…' };
    const box = this.el.querySelector('#plProg'); box.hidden = false; const pc = Math.round(p * 100);
    box.querySelector('#plProgFase').textContent = F[fase] || fase;
    box.querySelector('#plProgPct').textContent = pc + ' %';
    box.querySelector('#plBar').style.width = pc + '%';
    box.querySelector('.pl-bar').setAttribute('aria-valuenow', pc);
  }
  async manifiesto() {
    if (!this.manifest) { const r = await fetch((this.o.base || 'firmware/') + 'manifest.json', { cache: 'no-cache' }); if (!r.ok) throw Object.assign(new Error('No se encuentra la lista de firmwares.'), { paso: 'descargar' }); this.manifest = await r.json(); }
    return this.manifest;
  }
  // ---------------------------------------------------------------- grabar este proyecto
  // El puerto se libera del todo (lector del monitor y cola de escritura) y se le presta a esptool-js, que lo
  // abre con su propio Transport; al terminar se reabre el monitor y se reinicia la placa para que arranque.
  async grabarProyecto({ manual = false } = {}) {
    const L = this.L; if (!L || this.ocupado) return false;
    // «Conectar» y después «Grabar», o «Grabar» directamente: el puerto se elige ahora (necesita el clic).
    if (!this.ps.port && !(await this.conectar())) return false;
    this.ocupado = true; this.pintarCon(); this.aviso(''); this.mostrarFallo(null);
    this.registro = ''; this.log('');
    const cp = this.el.querySelector('#plCopiado'); if (cp) cp.textContent = '';
    const nombre = `P${L.n} ${L.title}`;
    let ok = false, paso = 'descargar', res = null;
    try {
      this.progreso(0, 'descargando');
      const m = await this.manifiesto();
      const f = m.proyectos.find((p) => p.id === 'p' + L.n);
      if (!f) throw Object.assign(new Error('Este proyecto no tiene firmware compilado.'), { paso: 'descargar' });
      const archivos = [{ data: await cargarBin((this.o.base || 'firmware/') + f.archivo, f.sha256, { tam: f.tam, direccion: f.direccion }), address: f.direccion }];
      if (!this.ps.port) throw Object.assign(new Error('La placa se ha desconectado.'), { paso: 'puerto' });
      this.log(this.cabeceraRegistro(nombre, archivos, { manual }));
      paso = 'puerto'; this.progreso(0, 'puerto');
      const habia = this.ps.abierto;
      await this.ps.cerrar({ estricto: true });
      this.log(`Puerto liberado (${habia ? 'estaba abierto por el monitor serie' : 'estaba cerrado'}); se lo presto a esptool-js.\n`);
      res = await grabar(this.ps.port, archivos, { manual, alProgreso: (p, fs) => this.progreso(p, fs), alPaso: (p) => { paso = p; this.progreso(0, p); }, alLog: (t) => this.log(t) });
      this.progreso(1, `✅ ${nombre} grabado (${res.chip.split(' ')[0]} · ${res.baudios} baudios)`);
      ok = true;
    } catch (e) {
      const r = resumenError(e?.paso ? e : Object.assign(e || {}, { paso }));
      this.log(`\n✗ RESULTADO: ${r.titulo}\n${r.detalle}\n`);
      const box = this.el.querySelector('#plProg'); box.hidden = false; box.querySelector('#plProgFase').textContent = '❌ ' + r.titulo;
      this.mostrarFallo(r);
    } finally {
      // esptool-js deja la placa en el cargador: reinicio normal (EN a 0 con IO0 en alto) para que arranque lo grabado
      try { if (this.ps.port) { await this.ps.abrir(115200); await this.ps.reiniciar(); } } catch (e) { this.log(`(reabrir el monitor: ${e?.message || e})\n`); }
      if (ok) this.log(`\n✓ RESULTADO: grabado a ${res.baudios} baudios · reinicio ${res.estrategia}${res.stub ? '' : ' · sin stub'} · placa reiniciada\n`);
      this.el.querySelector('#plBaud').value = '115200';
      this.ocupado = false; this.pintarCon();
    }
    if (ok) this.aviso(`✅ «${L.title}» está grabado y la placa ya lo está ejecutando. Mira el monitor serie.${manual ? ' Si no arranca, quita el cable de GPIO0 y pulsa RESET.' : ''}`, 'bien');
    return ok;
  }
}
