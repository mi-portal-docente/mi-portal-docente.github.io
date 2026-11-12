// Verificación del último paso de los proyectos ESP32, «Conecta y graba tu placa», con una ESP32 simulada
// (e2e/serie_mock.js): conexión Web Serial, grabación real con esptool-js contra la ROM simulada, caminos de
// reserva del grabador (reinicios, baudios, sin stub, BOOT a mano), registro técnico y monitor serie.
// No sustituye a la prueba con la placa de verdad.
import { chromium } from 'playwright-core';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import { hashCodigo, leerConfig } from './set-codigo.mjs';
import { SHOTS, SITE, codigoClase } from './rutas.mjs';
const base = process.env.PORTAL_BASE || 'http://localhost:8765/index.html';
const MOCK = readFileSync(new URL('./e2e/serie_mock.js', import.meta.url), 'utf8');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const results = []; const errs = []; const externas = [];
const ok = (name, cond, info = '') => { results.push({ name, ok: !!cond, info }); console.log((cond ? 'OK  ' : 'FAIL') + ' ' + name + (info ? ' · ' + info : '')); };
const md5 = (u8) => createHash('md5').update(Buffer.from(u8)).digest('hex');
async function pagina(mockCfg, { serie = true, ancho = 1440 } = {}) {
  const ctx = await b.newContext({ viewport: { width: ancho, height: 900 }, deviceScaleFactor: 1 });
  await ctx.route('**/js/firebase-config.js*', r => r.fulfill({ contentType: 'application/javascript', body: "window.PORTAL_FIREBASE={apiKey:'',projectId:''};" }));
  const cfg = leerConfig(); const code = codigoClase();
  await ctx.addInitScript(([key, val]) => { localStorage.setItem(key, val); }, ['portal.acceso', JSON.stringify({ version: cfg.version, hash: hashCodigo(code, cfg.salt) })]);
  if (serie) { await ctx.addInitScript((c) => { window.__mockCfg = c; }, mockCfg || {}); await ctx.addInitScript(MOCK); }
  else await ctx.addInitScript(() => { try { Object.defineProperty(Navigator.prototype, 'serial', { get: () => undefined, configurable: true }); } catch (e) {} });
  ctx.on('request', (r) => { const u = r.url(); if (!u.startsWith(new URL(base).origin) && !/^(http:\/\/localhost|data:|blob:)/.test(u)) externas.push(u); });
  const pg = await ctx.newPage();
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  return { ctx, pg };
}
const msg = (pg) => pg.evaluate(() => document.querySelector('#plMsg')?.textContent || '');
const mon = (pg) => pg.evaluate(() => document.querySelector('#plMonTxt')?.textContent || '');
const mock = (pg, f) => pg.evaluate(f);

// ============================================================ 1. Laboratorio y pantalla
const fase = (p) => p.evaluate(() => document.querySelector('#plProgFase')?.textContent || '');
const logDe = (p) => p.evaluate(() => window.__grabador?.registro || '');
const finGrabar = (p, ms = 150000) => p.waitForFunction(() => /grabado|❌/.test(document.querySelector('#plProgFase')?.textContent || ''), null, { timeout: ms });
const binDe = (n) => readFileSync(SITE + 'firmware/' + n);
// Ir al último paso de un proyecto con el botón ▶ / los puntos
async function ultimoPaso(p, n) {
  await p.goto(base + '#p' + n);
  await p.waitForSelector('#dots button');
  const k = await p.$$eval('#dots button', (l) => l.length);
  await p.click(`#dots button:nth-child(${k})`);
  await p.waitForSelector('#pgSitio .pg #plConectar', { timeout: 15000 });
  return k;
}

// ============================================================ 1. Sin tarjeta aparte: el grabador es el último paso de cada proyecto
const { pg } = await pagina({ app: 'arduino' });
await pg.goto(base + '#asig/eee/laboratorio');
await pg.waitForSelector('#asig a.ap-card');
const tarjetas = await pg.$$eval('#asig a.ap-card', (l) => l.map((a) => a.getAttribute('href')));
ok('Laboratorio de EEE: ya no hay tarjeta «Programar la placa» (3 tarjetas)', tarjetas.length === 3 && !tarjetas.some((h) => /placa/.test(h)), tarjetas.join(' '));
await pg.goto(base + '#p3');
await pg.waitForSelector('#dots button');
const pasosP3 = await pg.$$eval('#dots button', (l) => l.length);
const lista = await pg.$$eval('.steps-list .sl', (l) => l.map((x) => x.textContent));
ok('P3: el último paso de la lista es «⚡ Conecta y graba tu placa»', lista.length === pasosP3 && /Conecta y graba tu placa/.test(lista[lista.length - 1]) && !lista.slice(0, -1).some((t) => /Conecta y graba/.test(t)), lista.length + ' pasos');
ok('el grabador (js/placa.js) no se descarga hasta llegar a ese paso', await pg.evaluate(() => !window.GrabarPlaca));
await pg.click(`#dots button:nth-child(${pasosP3})`);
await pg.waitForSelector('#pgSitio .pg #plConectar', { timeout: 15000 });
ok('último paso: «Paso N de N», título y botones Conectar / Grabar P3, monitor y «Detalles técnicos»', new RegExp(`Paso ${pasosP3} de ${pasosP3}`).test(await pg.textContent('.step-grabar')) && /Conecta y graba tu placa/.test(await pg.textContent('#steptitle')) && /Grabar P3/.test(await pg.textContent('[data-acc=grabar]')) && !!(await pg.$('#plMonTxt')) && !!(await pg.$('#plDet [data-acc="copiar-log"]')) && await pg.$eval('#next', (x) => x.disabled));
ok('navegador compatible (Web Serial simulado): sin aviso y «Conectar» activo', !(await pg.$('.pl-aviso')) && !(await pg.$eval('#plConectar', (x) => x.disabled)));
ok('sin MicroPython ni bloques en la interfaz', !/MicroPython|Bloques|Blockly/i.test(await pg.textContent('#panel')));
await pg.screenshot({ path: SHOTS + 'placa_paso_final.png' });

// ============================================================ 2. Conectar y monitor
await pg.click('#plConectar');
await pg.waitForFunction(() => /Conectada/.test(document.querySelector('#plEstado').textContent));
await pg.waitForFunction(() => /en marcha/.test(document.querySelector('#plMonTxt').textContent), null, { timeout: 5000 });
ok('Conectar: «Conectada · 115200», chip CH340 y el monitor muestra lo que escribe la placa', /115200/.test(await pg.textContent('#plEstado')) && /CH340/.test(await pg.textContent('#plChip')) && /Programa de fábrica en marcha/.test(await mon(pg)));
const nRes = await mock(pg, () => window.__mockPlaca.resets.length);
await pg.click('#plReiniciar'); await pg.waitForTimeout(400);
ok('↺ Reiniciar placa: reinicio normal (no entra en modo grabación)', await mock(pg, () => window.__mockPlaca.resets.slice(-1)[0]) === 'app' && (await mock(pg, () => window.__mockPlaca.resets.length)) === nRes + 1);

// ============================================================ 3. «Conectar» y después «Grabar P3»
await pg.evaluate(() => { window.__mockProyecto = 3; });
await pg.click('[data-acc=grabar]');
// Espera a la barra (o a un fallo, que se informa con el final del registro en vez de agotar el tiempo sin más)
await pg.waitForFunction(() => { const t = document.querySelector('#plProgFase')?.textContent || ''; return /❌/.test(t) || (/Grabando/.test(t) && parseInt(document.querySelector('#plProgPct').textContent) > 5); }, null, { timeout: 90000 });
const cola = async (p) => (await logDe(p)).split('\n').filter((l) => /Falla|RESULTADO|Sin respuesta|no funciona/.test(l)).slice(-6).join(' // ');
ok('Grabar P3: la grabación arranca (barra > 5 %)', !/❌/.test(await fase(pg)), (await fase(pg)) + ' · ' + (await cola(pg)));
await pg.screenshot({ path: SHOTS + 'placa_grabando.png' });
await finGrabar(pg);
await pg.waitForFunction(() => /está grabado/.test(document.querySelector('#plMsg').textContent), null, { timeout: 10000 }).catch(() => {});
const bin3 = binDe('p3.bin');
const g = await mock(pg, () => window.__mockPlaca.grabado.slice(-1)[0]);
const lg = await logDe(pg);
ok('Grabar P3: libera el puerto del monitor, reinicio clásico, stub, 921600 y comprimido', /P3 .*grabado.*921600/.test(await fase(pg)) && /Puerto liberado \(estaba abierto por el monitor serie\)/.test(lg) && /En modo grabación con el reinicio clásico/.test(lg) && /Stub running/.test(lg), (await fase(pg)) + ' · ' + (await cola(pg)));
ok('lo grabado es p3.bin entero en 0x0, verificado con MD5', g && g.dir === 0 && g.tam === bin3.length && g.md5 === md5(bin3) && g.baud === 921600 && /Hash of data verified/.test(lg), JSON.stringify(g));
ok('registro con cabecera (firmware, cabecera DIO·4MB, VID/PID, navegador, versiones) y resultado', /Registro de grabación/.test(lg) && /0x0: 356352 bytes · cabecera DIO · 4MB · 80m/.test(lg) && /VID 1a86 · PID 7523/.test(lg) && /esptool-js 0\.7\.1/.test(lg) && /✓ RESULTADO: grabado a 921600/.test(lg) && await pg.$eval('#plFallo', (x) => x.hidden));
await pg.waitForFunction(() => /Programa P3 en marcha/.test(document.querySelector('#plMonTxt').textContent), null, { timeout: 5000 }).catch(() => {});
ok('después de grabar: la placa se reinicia sola y el monitor (115200) muestra el programa nuevo', /Programa P3 en marcha/.test(await mon(pg)) && /está grabado/.test(await msg(pg)) && /Conectada · 115200/.test(await pg.textContent('#plEstado')));
ok('todo se sirve desde la propia web: ni CDN ni servidores externos (esptool-js, firmwares)', externas.length === 0, externas.slice(0, 3).join(' '));

// ============================================================ 4. Otro proyecto: el mismo bloque, la conexión sigue
await pg.click('#prev');
ok('volver a un paso del montaje: se ve el paso normal', !!(await pg.$('.step-card .blk.take')));
await pg.goto(base + '#p5');
await pg.waitForSelector('#dots button');
await pg.click('#tabs [data-tab=codigo]');
await pg.click('[data-tab-pasos]');
await pg.waitForSelector('#pgSitio .pg', { timeout: 10000 });
ok('P5 → «Código» → «Ir a Conecta y graba tu placa»: último paso, botón «Grabar P5» y sigue conectada', /Grabar P5/.test(await pg.textContent('[data-acc=grabar]')) && /Conectada/.test(await pg.textContent('#plEstado')) && await pg.$eval('#tabs [data-tab=pasos]', (x) => x.classList.contains('on')));
await pg.goto(base + '#eee/placa/proyectos/p6');
await pg.waitForSelector('#pgSitio .pg', { timeout: 10000 });
ok('enlace antiguo #eee/placa/proyectos/p6 → último paso de P6', /Grabar P6/.test(await pg.textContent('[data-acc=grabar]')) && /^#p6-\d+$/.test(await pg.evaluate(() => location.hash)));
await mock(pg, () => window.__mockPlaca.desenchufar());
await pg.waitForFunction(() => /Sin conectar/.test(document.querySelector('#plEstado').textContent), null, { timeout: 5000 });
ok('desenchufar el cable: «Placa desconectada» y vuelve a «Conectar placa»', /desconectada/i.test(await msg(pg)) && !(await pg.$eval('#plConectar', (x) => x.hidden)));

// ============================================================ 5. Caminos de reserva del grabador (CH340 difíciles)
async function grabarCon(cfg, n = 1, conectarAntes = false) {
  const s = await pagina({ app: 'arduino', ...cfg });
  await s.ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(base).origin });
  await ultimoPaso(s.pg, n);
  await s.pg.evaluate((k) => { window.__mockProyecto = k; }, n);
  if (conectarAntes) { await s.pg.click('#plConectar'); await s.pg.waitForFunction(() => /Conectada/.test(document.querySelector('#plEstado').textContent)); }
  await s.pg.click('[data-acc=grabar]');
  await finGrabar(s.pg);
  return s;
}
// 5a. Sin auto-reset: todos los reinicios fallan → resumen, BOOT/GPIO0 a mano y «Reintentar»
const s2 = await grabarCon({ autoReset: false });
const lg2 = await logDe(s2.pg);
ok('«Grabar» sin conectar antes: pide el puerto y sigue', /Conectada/.test(await s2.pg.textContent('#plEstado')) && /Registro de grabación/.test(lg2));
ok('placa sin auto-reset: prueba reinicio clásico, USB-JTAG y los dos lentos, con varias sincronizaciones', ['clásico', 'USB-JTAG', 'lento para CH340', 'muy lento'].every((x) => lg2.includes('Sin respuesta con el reinicio ' + x)) && (lg2.match(/Sync connect attempt/g) || []).length >= 20);
ok('fallo: resumen en español con el paso que falla y qué probar', /Ha fallado el paso «Poner la placa en modo grabación»/.test(await s2.pg.textContent('#plFallo')) && /cable USB es de datos/.test(await s2.pg.textContent('#plFallo')) && /❌/.test(await fase(s2.pg)));
ok('fallo: «Mantén pulsado BOOT (o pon un cable de GPIO0 a GND) y pulsa RESET; luego pulsa Reintentar» con botón Reintentar', (await s2.pg.textContent('#plFallo .pl-boot')).includes('Mantén pulsado BOOT (o pon un cable de GPIO0 a GND) y pulsa RESET; luego pulsa Reintentar') && !!(await s2.pg.$('#plFallo [data-acc=reintentar][data-modo=manual]')));
ok('tras el fallo el puerto vuelve al monitor', /Conectada/.test(await s2.pg.textContent('#plEstado')));
await s2.pg.click('#plDet summary');
await s2.pg.click('#plDet [data-acc="copiar-log"]');
await s2.pg.waitForFunction(() => /copiado/.test(document.querySelector('#plCopiado')?.textContent || ''));
const copiado = await s2.pg.evaluate(() => navigator.clipboard.readText());
ok('«Copiar registro»: copia el registro completo de esptool-js con navegador, VID/PID y versiones', /Registro de grabación/.test(copiado) && /VID 1a86 · PID 7523/.test(copiado) && /esptool-js 0\.7\.1/.test(copiado) && /Failed to connect with the device/.test(copiado) && /RESULTADO: Ha fallado el paso/.test(copiado) && copiado.length > 2000, copiado.length + ' caracteres');
await s2.pg.screenshot({ path: SHOTS + 'placa_fallo_boot.png' });
await mock(s2.pg, () => window.__mockPlaca.botonBoot());
await s2.pg.click('#plFallo [data-acc=reintentar]');
await finGrabar(s2.pg);
await s2.pg.waitForFunction(() => /está grabado/.test(document.querySelector('#plMsg').textContent), null, { timeout: 10000 }).catch(() => {});
const g2 = await mock(s2.pg, () => window.__mockPlaca.grabado.slice(-1)[0]);
ok('Reintentar con BOOT/GPIO0 puesto a mano: sincroniza sin tocar DTR/RTS y graba (MD5 correcto)', /grabado/.test(await fase(s2.pg)) && g2?.md5 === md5(binDe('p1.bin')) && /sin reinicio \(BOOT\/GPIO0/.test(await logDe(s2.pg)) && /GPIO0 y pulsa RESET/.test(await msg(s2.pg)) && await s2.pg.$eval('#plFallo', (x) => x.hidden), JSON.stringify(g2));
await s2.ctx.close();
// 5b. CH340 lento: solo entra en modo grabación si GPIO0 sigue a 0 bastante tiempo tras soltar EN
const s6 = await grabarCon({ muestreoIO0: 300 }, 2, true);
const lg6 = await logDe(s6.pg);
ok('CH340 lento: falla el reinicio clásico y el USB-JTAG, entra con el reinicio lento y graba', /grabado/.test(await fase(s6.pg)) && /Sin respuesta con el reinicio clásico/.test(lg6) && /Sin respuesta con el reinicio USB-JTAG/.test(lg6) && /En modo grabación con el reinicio lento para CH340/.test(lg6) && (await mock(s6.pg, () => window.__mockPlaca.grabado.slice(-1)[0]?.md5)) === md5(binDe('p2.bin')));
await s6.ctx.close();
// 5c. El adaptador no aguanta 921600: esptool-js vuelve a 115200 y se prueba 460800
const s7 = await grabarCon({ maxBaud: 460800 }, 4, true);
const g7 = await mock(s7.pg, () => window.__mockPlaca.grabado.slice(-1)[0]);
ok('sin respuesta a 921600: baja a 460800 y graba ahí', /grabado.*460800/.test(await fase(s7.pg)) && g7?.baud === 460800 && g7?.md5 === md5(binDe('p4.bin')) && /921600 baudios no funciona/.test(await logDe(s7.pg)), JSON.stringify(g7));
await s7.ctx.close();
// 5d. A 921600 y 460800 los datos llegan corruptos (MD5 distinto): se repite entero más despacio
const s8 = await grabarCon({ md5MalSobre: 115200 }, 5, true);
const g8 = await mock(s8.pg, () => window.__mockPlaca.grabado.slice(-1)[0]);
ok('MD5 distinto a 921600 y a 460800: repite a 115200 y verifica', /grabado.*115200/.test(await fase(s8.pg)) && g8?.baud === 115200 && g8?.md5 === md5(binDe('p5.bin')) && (await mock(s8.pg, () => window.__mockPlaca.corruptos)) === 2 && (await logDe(s8.pg)).includes('Falla «Verificar lo grabado (MD5)»'), JSON.stringify(g8));
await s8.ctx.close();
// 5e. El stub no arranca: último recurso, grabar con el cargador de la ROM (MD5 en el formato de la ROM)
const s9 = await grabarCon({ stubFalla: true }, 6, true);
const g9 = await mock(s9.pg, () => window.__mockPlaca.grabado.slice(-1)[0]);
ok('sin stub: graba con la ROM a 115200 y la verificación MD5 sale bien', /grabado.*115200/.test(await fase(s9.pg)) && g9?.stub === false && g9?.md5 === md5(binDe('p6.bin')) && /sin stub/.test(await logDe(s9.pg)), JSON.stringify(g9));
await s9.ctx.close();
// 5f. Puerto con una escritura en curso del monitor justo al pulsar Grabar: se libera y se graba
const s10 = await pagina({ app: 'arduino' });
await ultimoPaso(s10.pg, 7);
await s10.pg.click('#plConectar');
await s10.pg.waitForFunction(() => /Conectada/.test(document.querySelector('#plEstado').textContent));
await s10.pg.evaluate(() => { const ps = window.__grabador.ps; for (let i = 0; i < 20; i++) ps.escribir('linea ' + i + '\r\n').catch(() => {}); document.querySelector('[data-acc=grabar]').click(); });
await finGrabar(s10.pg);
ok('Grabar con escrituras del monitor en cola: libera lector, escritor y puerto, y graba', /grabado/.test(await fase(s10.pg)) && !/already open|locked/i.test(await logDe(s10.pg)) && (await mock(s10.pg, () => window.__mockPlaca.grabado.slice(-1)[0]?.md5)) === md5(binDe('p7.bin')));
await s10.ctx.close();
// 5g. Firmware que no es un .bin (página HTML o puntero de Git LFS): se para antes de tocar la placa
const s11 = await pagina({ app: 'arduino' });
await s11.ctx.route('**/firmware/p8.bin*', (r) => r.fulfill({ status: 200, contentType: 'application/octet-stream', body: 'version https://git-lfs.github.com/spec/v1\noid sha256:0000\nsize 397312\n' }));
await ultimoPaso(s11.pg, 8);
await s11.pg.click('[data-acc=grabar]');
await finGrabar(s11.pg, 20000);
ok('firmware que es un puntero de Git LFS: falla «Descargar el firmware» sin tocar la placa', /Descargar el firmware/.test(await s11.pg.textContent('#plFallo')) && /Git LFS/.test(await logDe(s11.pg)) && (await mock(s11.pg, () => window.__mockPlaca.ordenes.length)) === 0);
await s11.ctx.close();

// ============================================================ 6. Sin elegir puerto / navegador sin Web Serial / pantalla estrecha
const s3 = await pagina({ hayPuerto: false });
await ultimoPaso(s3.pg, 1);
await s3.pg.click('#plConectar');
await s3.pg.waitForFunction(() => !document.querySelector('#plMsg').hidden);
ok('cancelar la ventana de puertos: «No has elegido ninguna placa» con pista', /No has elegido ninguna placa/.test(await msg(s3.pg)));
const s4 = await pagina(null, { serie: false });
await s4.pg.goto(base + '#p1');
await s4.pg.waitForSelector('#dots button');
await s4.pg.click('#dots button:last-child');
await s4.pg.waitForSelector('.pl-aviso', { timeout: 15000 });
ok('navegador sin Web Serial: aviso «Chrome o Microsoft Edge» y botones desactivados', /Chrome o Microsoft Edge/.test(await s4.pg.textContent('.pl-aviso')) && await s4.pg.$eval('#plConectar', (x) => x.disabled) && await s4.pg.$eval('[data-acc=grabar]', (x) => x.disabled));
await s4.pg.screenshot({ path: SHOTS + 'placa_sin_soporte.png' });
const s5 = await pagina({ app: 'arduino' }, { ancho: 820 });
await ultimoPaso(s5.pg, 2);
ok('pantalla estrecha: el último paso no desborda', await s5.pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

const malos = errs.filter((e) => !/favicon|ERR_FILE_NOT_FOUND|net::/.test(e));
ok('sin errores de JavaScript', malos.length === 0, malos.slice(0, 3).join(' | '));
await b.close();
const fail = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - fail}/${results.length} OK`);
process.exit(fail ? 1 : 0);
