// Grabar un firmware (.bin) en la ESP32 desde el navegador con esptool-js 0.7.1 (Apache-2.0, de Espressif).
// Paso a paso y con red de seguridad para los adaptadores CH340 de las placas de clase:
//   1. el puerto se recibe ya liberado (sin lectores ni escritores) y lo abre esptool-js con su propio Transport;
//   2. modo grabación: reinicio clásico DTR/RTS → reinicio USB-JTAG → reinicios lentos (CH340), con varios
//      intentos de sincronización cada uno; si nada funciona, se pide BOOT/GPIO0 a mano y «Reintentar» (sin reinicio);
//   3. sincronización con la ROM a 115200 y después 921600 → 460800 → 115200 baudios (y, en último caso, sin «stub»);
//   4. imagen tal cual («keep»): los .bin ya llevan DIO / 4 MB en la cabecera del bootloader; verificación MD5.
import { ESPLoader, Transport } from 'esptool-js';
import SparkMD5 from 'spark-md5';

export const VERSION_ESPTOOL = '0.7.1';
export const ROM_BAUDIOS = 115200;
export const VELOCIDADES = [921600, 460800, 115200];
export const FLASH_4MB = 4 * 1024 * 1024;
export const MENSAJE_BOOT = 'Mantén pulsado BOOT (o pon un cable de GPIO0 a GND) y pulsa RESET; luego pulsa Reintentar';

export const PASOS = {
  descargar: 'Descargar el firmware',
  puerto: 'Abrir el puerto USB',
  modo: 'Poner la placa en modo grabación',
  stub: 'Cargar el programa de grabación (stub)',
  velocidad: 'Cambiar la velocidad de grabación',
  flash: 'Comprobar la memoria flash',
  borrar: 'Borrar la memoria',
  grabar: 'Grabar',
  verificar: 'Verificar lo grabado (MD5)',
  reiniciar: 'Reiniciar la placa',
};

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const md5 = (u8) => SparkMD5.ArrayBuffer.hash(u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength));
const hex = (n, d = 0) => '0x' + n.toString(16).padStart(d, '0');

export class ErrorGrabacion extends Error {
  constructor(paso, causa, { manual = false } = {}) {
    super(String(causa?.message || causa || 'error desconocido'));
    this.name = 'ErrorGrabacion'; this.paso = paso; this.causa = causa; this.manual = manual;
  }
}

// ------------------------------------------------------------------ reinicios al modo grabación
// Circuito de auto-reset (dos transistores): EN = !(RTS && !DTR) · IO0 = !(DTR && !RTS).
// Se usa device.setSignals directamente (sin «break»), y setDTR/setRTS cuando hace falta el orden de esptool.py.
const sen = async (t, dtr, rts) => { await t.device.setSignals({ dataTerminalReady: dtr, requestToSend: rts }); t._DTR_state = dtr; };
export const ESTRATEGIAS = [
  { id: 'clasico', nombre: 'clásico DTR/RTS (como esptool)', async reset(t) {
    await sen(t, false, true); await espera(100); await sen(t, true, false); await espera(50); await sen(t, false, false); } },
  { id: 'usbjtag', nombre: 'USB-JTAG (ESP32 con USB nativo)', async reset(t) {
    await t.setRTS(false); await t.setDTR(false); await espera(100);
    await t.setDTR(true); await t.setRTS(false); await espera(100);
    await t.setRTS(true); await t.setDTR(false); await t.setRTS(true); await espera(100);
    await t.setRTS(false); await t.setDTR(false); } },
  { id: 'lento', nombre: 'lento para CH340 (EN 250 ms, GPIO0 600 ms)', async reset(t) {
    await t.setDTR(false); await t.setRTS(true); await espera(250);
    await t.setDTR(true); await t.setRTS(false); await espera(600); await t.setDTR(false); } },
  { id: 'muylento', nombre: 'muy lento para CH340 (EN 500 ms, GPIO0 1,2 s)', async reset(t) {
    await sen(t, false, false); await sen(t, true, true); await sen(t, false, true); await espera(500);
    await sen(t, true, false); await espera(1200); await sen(t, false, false); await t.setDTR(false); } },
];
const MANUAL = { id: 'manual', nombre: 'sin reinicio (BOOT/GPIO0 puesto a mano)', async reset() {} };

// ------------------------------------------------------------------ errores → resumen en español
export function pasoDe(e, def) {
  const m = String(e?.message || e || '');
  if (/device has been lost|NetworkError|disconnected/i.test(m)) return 'perdida';
  if (/Failed to execute 'open'|already open|Failed to open|Access denied|in use|locked/i.test(m)) return 'puerto';
  return e?.paso || def;
}
export function resumenError(e) {
  const paso = pasoDe(e, e?.paso || 'grabar');
  const titulo = paso === 'perdida' ? 'Se ha perdido la conexión con la placa' : `Ha fallado el paso «${PASOS[paso] || paso}»`;
  const Q = {
    descargar: 'No se ha podido descargar el firmware de esta web. Comprueba la conexión a Internet y recarga la página (Ctrl+F5).',
    puerto: 'El puerto USB está ocupado o no se ha podido abrir. Cierra Arduino IDE, Thonny, AceCode u otras pestañas que usen la placa, desenchufa y vuelve a enchufar el cable y pulsa «Conectar placa».',
    modo: 'La placa no ha entrado en modo grabación con los reinicios automáticos. Comprueba que el cable USB es de datos y que ningún otro programa (Arduino IDE, AceCode, otra pestaña) está usando la placa.',
    stub: 'La placa ha respondido pero se ha cortado la comunicación. Prueba otro cable USB (corto, de datos) o un puerto USB del propio ordenador (sin hub) y pulsa Reintentar.',
    velocidad: 'La placa no aguanta la velocidad alta. Pulsa Reintentar: se grabará más despacio.',
    flash: 'La placa responde, pero su memoria flash no. Quita lo que haya conectado a los pines y pulsa Reintentar.',
    borrar: 'No se ha podido borrar la memoria. Pulsa Reintentar; si se repite, desmarca «borrar toda la memoria antes».',
    grabar: 'La grabación se ha cortado. Prueba otro cable USB (corto, de datos) o un puerto USB del propio ordenador (sin hub) y pulsa Reintentar.',
    verificar: 'Lo grabado no coincide con el archivo (MD5 distinto). Pulsa Reintentar; si se repite, cambia de cable o de puerto USB.',
    reiniciar: 'El programa está grabado, pero la placa no se ha reiniciado sola: pulsa el botón RESET de la placa.',
    perdida: 'Se ha desconectado la placa (¿se ha movido el cable?). Vuelve a enchufarla, pulsa «Conectar placa» y repite.',
  };
  return { paso, titulo, que: Q[paso] || 'Pulsa Reintentar. Si se repite, copia el registro de «Detalles técnicos» y envíaselo al profesor.', manual: !!e?.manual || paso === 'modo', detalle: String(e?.message || e || '') };
}
// Compatibilidad con la versión anterior: una sola frase.
export function explicarError(e) { const r = resumenError(e); return r.titulo + '. ' + r.que; }

// ------------------------------------------------------------------ descarga y comprobación del .bin
// Se descarga como arrayBuffer → Uint8Array (lo que exige esptool-js 0.7.1) y se rechaza lo que no sea una
// imagen de ESP32: páginas HTML de error, punteros de Git LFS, tamaño distinto al del manifiesto o huella distinta.
export function comprobarImagen(b, { tam, direccion = 0, nombre = 'firmware' } = {}) {
  const ini = new TextDecoder().decode(b.slice(0, 64)).toLowerCase();
  if (ini.startsWith('version https://git-lfs')) throw new ErrorGrabacion('descargar', `${nombre}: es un puntero de Git LFS, no el firmware`);
  if (/^\s*(<!doctype|<html|<\?xml|\{)/.test(ini)) throw new ErrorGrabacion('descargar', `${nombre}: el servidor ha devuelto una página o texto en lugar del firmware`);
  if (tam && b.length !== tam) throw new ErrorGrabacion('descargar', `${nombre}: tamaño ${b.length} bytes, se esperaban ${tam}`);
  const cab = direccion === 0 ? 0x1000 : direccion === 0x1000 ? 0 : -1; // bootloader del ESP32 en 0x1000
  if (cab >= 0 && b[cab] !== 0xe9) throw new ErrorGrabacion('descargar', `${nombre}: no empieza como una imagen de ESP32 (byte mágico ${hex(b[cab] ?? 0, 2)} en ${hex(cab)})`);
  if (direccion + b.length > FLASH_4MB) throw new ErrorGrabacion('descargar', `${nombre}: no cabe en 4 MB a partir de ${hex(direccion)}`);
  return true;
}
export function infoCabecera(b, direccion = 0) {
  const o = direccion === 0 ? 0x1000 : 0; if (b.length < o + 4 || b[o] !== 0xe9) return '';
  const modo = ['QIO', 'QOUT', 'DIO', 'DOUT'][b[o + 2]] || '?';
  const tam = { 0: '1MB', 1: '2MB', 2: '4MB', 3: '8MB', 4: '16MB' }[b[o + 3] >> 4] || '?';
  const fr = { 0: '40m', 1: '26m', 2: '20m', 15: '80m' }[b[o + 3] & 15] || '?';
  return `${modo} · ${tam} · ${fr}`;
}
export async function cargarBin(url, sha256, { tam, direccion = 0 } = {}) {
  const nombre = url.split('/').pop();
  let r;
  try { r = await fetch(sha256 ? url + '?h=' + sha256.slice(0, 12) : url); }
  catch (e) { throw new ErrorGrabacion('descargar', `${nombre}: ${e?.message || e}`); }
  if (!r.ok) throw new ErrorGrabacion('descargar', `${nombre}: el servidor responde ${r.status}`);
  const tipo = r.headers.get('content-type') || '';
  if (/text\/html/i.test(tipo)) throw new ErrorGrabacion('descargar', `${nombre}: el servidor ha devuelto una página web (${tipo})`);
  const b = new Uint8Array(await r.arrayBuffer());
  comprobarImagen(b, { tam, direccion, nombre });
  if (sha256 && globalThis.crypto?.subtle) {
    const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', b))].map((x) => x.toString(16).padStart(2, '0')).join('');
    if (h !== sha256) throw new ErrorGrabacion('descargar', `${nombre}: huella SHA-256 distinta (archivo dañado o en caché). Recarga la página.`);
  }
  return b;
}

// ------------------------------------------------------------------ grabación
async function soltar(transport, alLog) {
  // Transport.disconnect espera sin límite a que se liberen los streams: se le pone un tope.
  try { await Promise.race([transport.disconnect(), espera(3000).then(() => { throw new Error('tiempo agotado al cerrar'); })]); }
  catch (e) { alLog(`(cerrar puerto: ${e?.message || e})\n`); try { await transport.device.close(); } catch (e2) {} }
}

// archivos: [{data:Uint8Array, address}] · opciones: borrarTodo, manual (placa ya en modo grabación),
// alProgreso(0..1, fase), alLog(texto), alPaso(paso). Devuelve {chip, baudios, estrategia, stub}.
export async function grabar(port, archivos, o = {}) {
  const { borrarTodo = false, manual = false, alProgreso = () => {}, alLog = () => {}, alPaso = () => {},
    velocidades = VELOCIDADES, estrategias = ESTRATEGIAS, intentosSync = 2 } = o;
  for (const [i, f] of archivos.entries()) {
    if (!(f.data instanceof Uint8Array)) throw new ErrorGrabacion('descargar', `archivo ${i + 1}: no es un Uint8Array`);
    if (f.address + f.data.length > FLASH_4MB) throw new ErrorGrabacion('descargar', `archivo ${i + 1}: no cabe en 4 MB`);
  }
  const total = archivos.reduce((s, f) => s + f.data.length, 0);
  const terminal = { clean() {}, writeLine: (t) => alLog(t + '\n'), write: (t) => alLog(t) };
  const lista = manual ? [MANUAL] : estrategias;
  let iEst = 0; // la estrategia que funcionó se reutiliza en los reintentos
  let k = 0; // índice de velocidad
  const intentos = [...velocidades.map((b) => ({ baud: b, stub: true })), { baud: ROM_BAUDIOS, stub: false }];
  let ultimo = null;
  let paso = 'puerto';
  const fase = (p) => { paso = p; alPaso(p); alLog(`\n== ${PASOS[p]} ==\n`); };

  for (let n = 1; k < intentos.length; n++) {
    const I = intentos[k];
    alLog(`\n######## Intento ${n}: ${I.stub ? 'stub a ' + I.baud + ' baudios' : 'sin stub, solo ROM a 115200'} ########\n`);
    let actual = lista[iEst] || lista[0];
    const transport = new Transport(port, false);
    const loader = new ESPLoader({
      transport, baudrate: ROM_BAUDIOS, romBaudrate: ROM_BAUDIOS, terminal, debugLogging: true,
      serialOptions: { bufferSize: 65536 },
      // esptool-js usa estos constructores en connect() y también al recuperarse de un cambio de velocidad fallido.
      resetConstructors: { classicReset: (t) => ({ reset: () => actual.reset(t) }), usbJTAGSerialReset: (t) => ({ reset: () => actual.reset(t) }) },
    });
    try {
      // ---- puerto + modo grabación
      fase('puerto');
      if (port.readable || port.writable) throw new ErrorGrabacion('puerto', 'el puerto sigue abierto por otra parte de la página');
      fase('modo');
      let ok = false, err = null;
      for (let j = iEst; j < lista.length; j++) {
        actual = lista[j];
        alLog(`-- Reinicio ${actual.nombre}: hasta ${intentosSync} × 5 sincronizaciones a ${ROM_BAUDIOS} baudios\n`);
        try { await loader.connect(manual ? 'no_reset' : 'default_reset', manual ? 3 : intentosSync, true); ok = true; iEst = j; break; }
        catch (e) {
          err = e; alLog(`-- Sin respuesta con el reinicio ${actual.nombre}: ${e?.message || e}\n`);
          if (pasoDe(e, 'modo') !== 'modo') throw new ErrorGrabacion(pasoDe(e, 'modo'), e);
          await soltar(transport, alLog); await espera(200);
        }
      }
      if (!ok) throw new ErrorGrabacion('modo', err || 'sin respuesta', { manual: true });
      alLog(`-- En modo grabación con el reinicio ${actual.nombre}\n`);
      let chip = loader.chip?.CHIP_NAME || '?';
      try {
        chip = await loader.chip.getChipDescription(loader);
        alLog(`Chip: ${chip} · ${[].concat(await loader.chip.getChipFeatures(loader)).join(', ')} · cristal ${await loader.chip.getCrystalFreq(loader)} MHz · MAC ${await loader.chip.readMac(loader)}\n`);
      } catch (e) { alLog(`(sin descripción del chip: ${e?.message || e})\n`); }
      if (!/ESP32/.test(chip)) alLog('Aviso: el chip detectado es ' + chip + '\n');
      // ---- stub
      fase('stub');
      if (I.stub) await loader.runStub(); else alLog('Se graba con el cargador de la ROM (sin stub), a 115200 baudios.\n');
      // ---- velocidad: 921600 → 460800 → 115200 (esptool-js vuelve a 115200 solo si la placa deja de responder)
      fase('velocidad');
      let baud = ROM_BAUDIOS;
      if (I.stub) {
        for (let v = k; v < velocidades.length && velocidades[v] !== ROM_BAUDIOS; v++) {
          loader.baudrate = velocidades[v];
          await loader.changeBaud();
          if (loader.baudrate === velocidades[v] && transport.baudrate === velocidades[v]) { baud = velocidades[v]; k = v; break; }
          alLog(`-- ${velocidades[v]} baudios no funciona; se prueba la siguiente velocidad\n`);
          k = v + 1;
        }
        if (baud === ROM_BAUDIOS) k = Math.max(k, velocidades.indexOf(ROM_BAUDIOS));
      }
      alLog(`-- Velocidad de grabación: ${baud} baudios\n`);
      // ---- memoria flash
      fase('flash');
      const id = await loader.readFlashId();
      alLog(`Flash ID: ${hex(id, 6)} (${loader.DETECTED_FLASH_SIZES?.[(id >> 16) & 0xff] || 'tamaño desconocido'})\n`);
      if (id === 0xffffff || id === 0) alLog('AVISO: la memoria flash no contesta bien (ID ' + hex(id, 6) + '); si la grabación falla, revisa lo conectado a los pines GPIO6–11.\n');
      // ---- borrar
      if (borrarTodo) {
        fase('borrar');
        if (loader.IS_STUB) { alProgreso(0, 'borrando'); await loader.eraseFlash(); }
        else alLog('La ROM no puede borrar toda la memoria de una vez: se graba encima.\n');
      }
      // ---- grabar + verificar (writeFlash compara el MD5 que calcula la placa con el del archivo)
      fase('grabar');
      alProgreso(0, 'grabando');
      try {
        await loader.writeFlash({
          fileArray: archivos.map((f) => ({ data: f.data, address: f.address })),
          flashMode: 'keep', flashFreq: 'keep', flashSize: 'keep', eraseAll: false, compress: true,
          reportProgress: (i, escrito, tam) => { const previos = archivos.slice(0, i).reduce((s, f) => s + f.data.length, 0); alProgreso(Math.min(1, (previos + (escrito / tam) * archivos[i].data.length) / total), 'grabando'); },
          // Con la ROM (sin stub) la placa responde el MD5 como 32 caracteres ASCII y esptool-js 0.7.1 los pasa a hex
          // tal cual (64 cifras): se compara en ese mismo formato para no dar un «MD5 distinto» falso.
          calculateMD5Hash: loader.IS_STUB ? md5 : (img) => [...md5(img)].map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
        });
      } catch (e) { throw new ErrorGrabacion(/MD5|match/i.test(String(e?.message || e)) ? 'verificar' : 'grabar', e); }
      alLog(`-- Grabado y verificado (MD5) a ${baud} baudios con el reinicio ${actual.nombre}${loader.IS_STUB ? '' : ', sin stub'}\n`);
      alProgreso(1, 'reiniciando');
      return { chip, baudios: baud, estrategia: actual.id, stub: !!loader.IS_STUB };
    } catch (e0) {
      const e = e0 instanceof ErrorGrabacion ? e0 : new ErrorGrabacion(pasoDe(e0, paso), e0);
      ultimo = e;
      alLog(`\n✗ Falla «${PASOS[e.paso] || e.paso}»: ${e.message}\n`);
      // Sin modo grabación, puerto ocupado o placa desenchufada: bajar la velocidad no arregla nada.
      if (['modo', 'puerto', 'perdida', 'descargar', 'flash'].includes(e.paso)) throw e;
      k += 1;
      if (k < intentos.length) alLog('-- Se repite más despacio…\n');
    } finally {
      await soltar(transport, alLog);
    }
  }
  throw ultimo || new ErrorGrabacion(paso, 'no se ha podido grabar');
}
