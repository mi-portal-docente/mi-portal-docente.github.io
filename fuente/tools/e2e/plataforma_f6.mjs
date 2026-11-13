// Fase 6 · Laboratorios de TIC: Anatomía del PC (3D), Representación de la información, Ciberseguridad,
// Editor web en vivo y Retos por bloques; elemento importado en JSON y reto asignado como tarea.
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON }) {
  const pg = T.P.pg;
  await pg.goto(BASE + '#asig/tic1/laboratorio');
  await pg.waitForSelector('#asig .ap-card[href="#tic1/web"]', { timeout: 20000 });
  const cards = await pg.$$eval('#asig .ap-card', (L) => L.map((a) => a.getAttribute('href')));
  ok('TIC I → Laboratorio: 5 laboratorios (Anatomía del PC, Información, Ciberseguridad, Web, Bloques)', ['#asig/tic1/actividades/anatomia-pc', '#tic1/info', '#tic1/ciber', '#tic1/web', '#tic1/bloques'].every((h) => cards.includes(h)), cards.join(' '));
  ok('las tarjetas llevan iconos Lucide (sin emoji)', (await pg.$$('#asig .ap-card .ap-ic svg.ic')).length >= 5);
  await shot(pg, 'f6_laboratorios_tic');
  // ------------------------------------------------------------- Anatomía del PC (3D)
  await pg.goto(BASE + '#asig/tic1/actividades/anatomia-pc');
  await pg.waitForSelector('#act canvas', { timeout: 20000 }); await pg.waitForTimeout(2500);
  ok('Anatomía del PC: juego 3D con sus dos niveles', /Anatomía del PC/.test(await pg.textContent('#act')) && /Reconoce las piezas/.test(await pg.textContent('#act')));
  await shot(pg, 'f6_anatomia_pc');
  // ------------------------------------------------------------- Representación de la información
  await pg.goto(BASE + '#tic1/info/practica');
  await pg.waitForSelector('[data-i=valor]', { timeout: 15000 });
  const conv = await pg.textContent('[data-i=res]');
  ok('conversor: 65 → binario 1000001, hexadecimal 41, ASCII «A»', /1000001/.test(conv) && /41/.test(conv) && /ASCIIA/.test(conv.replace(/\s/g, '')), conv);
  await pg.fill('[data-ir="0"]', '1101'); await pg.click('[data-ic="0"]');
  await pg.fill('[data-ir="1"]', '1406,25'); await pg.click('[data-ic="1"]');
  ok('preguntas: 13 → 1101 y 800×600 a 24 bits = 1406,25 KB, correctas', (await pg.$$('.if-fb .ok')).length === 2);
  await shot(pg, 'f6_informacion');
  // ------------------------------------------------------------- Ciberseguridad
  await pg.goto(BASE + '#tic1/ciber/correos');
  await pg.waitForSelector('[data-cbd="1"]', { timeout: 15000 });
  await pg.click('[data-cbd="1"]');
  ok('bandeja: marcar el correo como phishing → «¡Bien!» con la explicación', /Bien!.*Urgencia/.test(await pg.textContent('.cb-fb')));
  await shot(pg, 'f6_phishing');
  await pg.goto(BASE + '#tic1/ciber/contrasena');
  await pg.waitForSelector('[data-cbp]');
  await pg.fill('[data-cbp]', '1234'); const debil = await pg.textContent('[data-cbniv]');
  await pg.fill('[data-cbp]', 'Pato-Azul-Salta-Muro-8!');
  await pg.waitForSelector('.cb-pass .cb-fb.ok');
  ok('contraseñas: «1234» muy débil; una frase larga con símbolos llega a «fuerte»', /muy débil/.test(debil) && /fuerte/.test(await pg.textContent('[data-cbniv]')));
  ok('la contraseña no se guarda en el navegador', !(await pg.evaluate(() => JSON.stringify(localStorage))).includes('Pato-Azul'));
  await shot(pg, 'f6_contrasena');
  await pg.goto(BASE + '#tic1/ciber/red');
  await pg.waitForSelector('[data-cbn=router]');
  await pg.click('[data-cbn=router]'); await pg.click('[data-cbo="0"]');
  ok('red de la pyme: riesgo del router resuelto', !!(await pg.$('.cb-nodo.ok[data-cbn=router]')));
  await shot(pg, 'f6_red');
  // ------------------------------------------------------------- Editor web
  await pg.goto(BASE + '#tic1/web/titulo');
  await pg.waitForSelector('[data-w=html]', { timeout: 15000 });
  await pg.fill('[data-w=html]', '<h1>Mi web</h1>'); await pg.fill('[data-w=css]', 'h1 { color: blue; }');
  await pg.click('[data-wa=comprobar]'); await pg.waitForSelector('.p5-veredicto');
  ok('web: título azul → «Todavía no» (falta el color)', /Todavía no/.test(await pg.textContent('[data-w=res]')));
  await pg.fill('[data-w=css]', 'h1 { color: red; }');
  await pg.click('[data-wa=comprobar]'); await pg.waitForFunction(() => /superado/.test(document.querySelector('[data-w=res]')?.textContent || ''));
  ok('web: <h1>Mi web</h1> en rojo → reto superado (estilo calculado)', true);
  const sb = await pg.getAttribute('.wl-if', 'sandbox');
  ok('vista previa aislada y sin scripts (sandbox="allow-same-origin")', sb === 'allow-same-origin');
  await shot(pg, 'f6_web');
  // ------------------------------------------------------------- Bloques
  await pg.goto(BASE + '#tic1/bloques/niveles');
  await pg.waitForSelector('.bl-ws .blocklySvg', { timeout: 20000 });
  await pg.evaluate(() => { const ws = window.__lab.ctl.ws(); const ini = ws.getBlocksByType('rb_inicio')[0]; let prev = ini; for (let i = 0; i < 2; i++) { const b = ws.newBlock('rb_avanzar'); b.initSvg(); b.render(); prev.nextConnection.connect(b.previousConnection); prev = b; } });
  await pg.click('[data-ba=ejecutar]');
  await pg.waitForFunction(() => /Nivel superado/.test(document.querySelector('[data-b=res]')?.textContent || ''), null, { timeout: 15000 });
  ok('bloques: «avanzar» ×2 → nivel 1 superado', true);
  await pg.click('[data-br="1"]'); await pg.waitForTimeout(800);
  await pg.evaluate(() => { const ws = window.__lab.ctl.ws(); const ini = ws.getBlocksByType('rb_inicio')[0]; let prev = ini; for (let i = 0; i < 4; i++) { const b = ws.newBlock('rb_avanzar'); b.initSvg(); b.render(); prev.nextConnection.connect(b.previousConnection); prev = b; } });
  await pg.click('[data-ba=ejecutar]');
  await pg.waitForFunction(() => /chocado/.test(document.querySelector('[data-b=res]')?.textContent || ''), null, { timeout: 15000 });
  ok('bloques: nivel 2 sin girar → «El robot ha chocado con un muro»', true);
  await shot(pg, 'f6_bloques');
  // ------------------------------------------------------------- asignar «Bandeja de entrada» como tarea
  await pg.goto(BASE + '#tic1/ciber');
  await pg.waitForSelector('[data-lg-asignar=correos]', { timeout: 15000 });
  await pg.click('[data-lg-asignar=correos]'); await pg.waitForSelector('#apItemForm', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]'); await pg.waitForTimeout(1500);
  // ------------------------------------------------------------- elemento «info» importado en JSON
  await pg.goto(BASE + '#asig/tic1/trabajo');
  await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  await pegarJSON(pg, { tipo: 'web', titulo: 'x', contenido: { retos: [{ titulo: 'a', enunciado: 'b', comprobaciones: [{ tipo: 'estilo', selector: 'h1' }] }] } });
  await pg.waitForSelector('#jsErr li', { timeout: 10000 });
  ok('JSON web con errores: ruta y mensaje en castellano', /comprobaciones\[0\]\.propiedad/.test(await pg.textContent('#jsErr')));
  const INFO = { tipo: 'info', titulo: 'Sistemas de numeración', puntos: 10, contenido: { preguntas: [{ tipo: 'conversion', de: 'bin', a: 'dec', valor: '1010' }, { tipo: 'tamano', archivo: { tipo: 'texto', caracteres: 2048 }, unidad: 'KB' }] } };
  await pg.fill('.cl-modal [data-m-f=json]', JSON.stringify(INFO)); await pg.click('.cl-modal [data-m=validar]');
  await pg.waitForSelector('#jsPrev .js-prev');
  ok('vista previa: «2 preguntas · 1 de conversión, 1 de tamaño»', /2 preguntas · 1 de conversión, 1 de tamaño/.test(await pg.textContent('#jsPrev')));
  await guardarJSON(pg);
  await pg.waitForSelector('#asTrabajo .cl-it:has-text("Sistemas de numeración")', { timeout: 15000 });
  const id = await pg.getAttribute('#asTrabajo .cl-it:has-text("Sistemas de numeración")', 'data-item');
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [name=contenido]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });
  // ------------------------------------------------------------- alumno
  const B = T.B5 || await T.alumno(T.GB, 5, '4321', { width: 1280, height: 860 }); T.B5 = B;
  await B.pg.goto(BASE + '#trabajo/' + id);
  await B.pg.waitForSelector('.ifl [data-ir="0"]', { timeout: 20000 });
  await B.pg.fill('[data-ir="0"]', '10'); await B.pg.click('[data-ic="0"]');
  await B.pg.fill('[data-ir="1"]', '3'); await B.pg.click('[data-ic="1"]');
  ok('tarea: cada pregunta se comprueba una sola vez (se bloquea)', await B.pg.isDisabled('[data-ir="1"]'));
  await B.pg.click('[data-lb-ent]');
  await B.pg.waitForFunction(() => /Entregado/.test(document.querySelector('.lb-entmsg')?.textContent || ''), null, { timeout: 15000 });
  ok('entrega del elemento «info»: «Aciertos: 1/2»', /Aciertos: 1\/2/.test(JSON.stringify(await docREST(`trabajos/${id}_${T.GB.id}_5`))));
  await shot(B.pg, 'f6_alumno_info');
  await B.pg.goto(BASE + '#tic1/ciber/correos');
  await B.pg.waitForSelector('.lg-tarea', { timeout: 20000 });
  await B.pg.click('[data-cbd="1"]'); await B.pg.click('[data-cbd="0"]');
  ok('reto asignado (bandeja): cuenta la primera respuesta', /Bien!/.test(await B.pg.textContent('.cb-fb')));
  await B.pg.click('[data-lb-ent]');
  await B.pg.waitForFunction(() => /Entregado/.test(document.querySelector('.lb-entmsg')?.textContent || ''), null, { timeout: 15000 });
  ok('entrega desde el laboratorio: «Aciertos: 1/1»', /Aciertos: 1\/1/.test(await B.pg.textContent('.lb-ent')));
  await B.pg.setViewportSize({ width: 390, height: 844 }); await B.pg.goto(BASE + '#tic1/ciber/red'); await B.pg.waitForSelector('[data-cbn=router]'); await B.pg.waitForTimeout(400);
  await shot(B.pg, 'f6_red_movil');
  await B.pg.setViewportSize({ width: 1280, height: 860 });
}
