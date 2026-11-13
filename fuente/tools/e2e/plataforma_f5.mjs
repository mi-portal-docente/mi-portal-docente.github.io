// Fase 5 · Laboratorio p5.js (CDPC): página del laboratorio, consola en castellano, comprobaciones,
// asignar un reto como tarea y elemento «Laboratorio p5.js» importado en JSON (alumno entrega el código).
const menu = (pg, id, acc) => pg.evaluate(([i, a]) => document.querySelector(`#asTrabajo [data-item="${i}"] [data-cl=${a}]`).click(), [id, acc]);
const escribir = (pg, codigo) => pg.fill('[data-p5=codigo]', codigo);
export default async function ({ T, BASE, ok, shot, docREST, pegarJSON, guardarJSON }) {
  const pg = T.P.pg;
  // ------------------------------------------------------------- página del laboratorio
  await pg.goto(BASE + '#asig/cdpc1/laboratorio');
  await pg.waitForSelector('#asig .ap-card[href="#cdpc1/p5"]', { timeout: 20000 });
  ok('CDPC → Laboratorio: tarjeta «Laboratorio p5.js» con icono Lucide (sin emoji)', !!(await pg.$('#asig .ap-card[href="#cdpc1/p5"] .ap-ic svg.ic')));
  await pg.click('#asig .ap-card[href="#cdpc1/p5"]');
  await pg.waitForSelector('.labg .lg-card [data-lg-asignar=circulo]', { timeout: 15000 });
  ok('portada del laboratorio: modo libre y 2 retos de ejemplo', (await pg.$$('.labg .lg-card')).length === 3);
  await shot(pg, 'f5_portada');
  await pg.goto(BASE + '#cdpc1/p5/circulo');
  await pg.waitForSelector('[data-p5=codigo]');
  await escribir(pg, 'function setup() {\n  createCanvas(200, 200);\n}\n\nfunction draw() {\n  background(220);\n  circel(100, 100, 50);\n}\n');
  await pg.click('[data-p5a=ejecutar]');
  await pg.waitForSelector('.p5-con .p5-ln.err', { timeout: 15000 });
  const err = await pg.textContent('.p5-con');
  ok('consola: error en castellano con la línea («circel» no existe · Línea 7)', /Línea 7/.test(err) && /«circel» no existe/.test(err), err.slice(0, 120));
  await shot(pg, 'f5_consola_error');
  await escribir(pg, 'function setup() {\n  createCanvas(200, 200);\n}\nfunction draw() {\n  background(220);\n  circel(100, 100, 50);\n}\n');
  await pg.click('[data-p5a=comprobar]');
  await pg.waitForSelector('.p5-veredicto', { timeout: 15000 });
  ok('comprobar con errores → «Todavía no»', /Todavía no/.test(await pg.textContent('.p5-res')));
  await escribir(pg, 'function setup() {\n  createCanvas(200, 200);\n}\nfunction draw() {\n  background(220);\n  fill(255, 0, 0);\n  circle(100, 100, 50);\n  console.log("hola");\n}\n');
  await pg.click('[data-p5a=comprobar]');
  await pg.waitForFunction(() => /superado/.test(document.querySelector('.p5-res')?.textContent || ''), null, { timeout: 15000 });
  ok('comprobar: código + píxel → «¡Reto superado!»', /Reto superado/.test(await pg.textContent('.p5-res')));
  ok('consola: muestra console.log del programa', /hola/.test(await pg.textContent('.p5-con')));
  await pg.click('[data-p5a=pista]');
  ok('pistas: se muestran de una en una', (await pg.$$('.p5-pista')).length === 1);
  const aislado = await pg.getAttribute('.p5-if', 'sandbox');
  ok('el lienzo es un iframe aislado (sandbox="allow-scripts", sin same-origin)', aislado === 'allow-scripts');
  await shot(pg, 'f5_reto_superado');
  // asignar el reto «variable» como tarea
  await pg.goto(BASE + '#cdpc1/p5');
  await pg.waitForSelector('[data-lg-asignar=variable]');
  await pg.click('[data-lg-asignar=variable]');
  await pg.waitForSelector('#apItemForm', { timeout: 15000 });
  ok('«Asignar como tarea» abre el editor con el enlace al reto', /#cdpc1\/p5\/variable/.test(await pg.inputValue('#apItemForm [name=enlaces]')));
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForTimeout(1500);

  // ------------------------------------------------------------- elemento importado en JSON
  await pg.goto(BASE + '#asig/cdpc1/trabajo');
  await pg.waitForSelector('#asTrabajo [data-cl=importarJSON]', { timeout: 20000 });
  const P5 = { tipo: 'p5', titulo: 'Retos p5 de prueba', puntos: 10, contenido: { retos: [
    { id: 'rojo', titulo: 'Cuadrado rojo', enunciado: 'Dibuja un cuadrado rojo que tape el punto (50, 50).', codigo: 'function setup() {\n  createCanvas(100, 100);\n}\nfunction draw() {\n  background(255);\n}\n',
      pistas: ['fill(255, 0, 0) pone el relleno rojo.'], comprobaciones: [{ tipo: 'codigo', contiene: 'rect(' }, { tipo: 'pixel', x: 50, y: 50, color: '#ff0000', tolerancia: 10 }] },
    { id: 'vel', titulo: 'Velocidad', enunciado: 'Crea la variable «vel» con un valor entre 1 y 5.', comprobaciones: [{ tipo: 'variable', nombre: 'vel', min: 1, max: 5 }] }] } };
  await pegarJSON(pg, { ...P5, contenido: { retos: [{ titulo: 'x', enunciado: 'y', comprobaciones: [{ tipo: 'pixel', x: 1 }] }] } });
  await pg.waitForSelector('#jsErr li', { timeout: 10000 });
  ok('JSON p5 con errores: ruta y mensaje en castellano', /retos\[0\]\.comprobaciones\[0\]/.test(await pg.textContent('#jsErr')));
  await pg.fill('.cl-modal [data-m-f=json]', JSON.stringify(P5)); await pg.click('.cl-modal [data-m=validar]');
  await pg.waitForSelector('#jsPrev .js-prev');
  ok('vista previa: «2 retos p5.js · 3 comprobaciones»', /2 retos p5\.js · 3 comprobaciones/.test(await pg.textContent('#jsPrev')));
  await guardarJSON(pg);
  await pg.waitForSelector('#asTrabajo .cl-it:has-text("Retos p5 de prueba")', { timeout: 15000 });
  const id = await pg.getAttribute('#asTrabajo .cl-it:has-text("Retos p5 de prueba")', 'data-item'); T.P5 = id;
  await menu(pg, id, 'editar'); await pg.waitForSelector('#apItemForm [name=contenido]', { timeout: 15000 });
  await pg.check('#apItemForm [name=estado][value=publicar]'); await pg.click('#apItemForm button[type=submit]');
  await pg.waitForSelector(`#asTrabajo .cl-it.pub[data-item="${id}"]`, { timeout: 15000 });

  // ------------------------------------------------------------- alumno de 1º Bach
  const B = T.B5 || await T.alumno(T.GB, 5, '4321', { width: 1280, height: 860 }); T.B5 = B;
  await B.pg.goto(BASE + '#cdpc1/p5/variable');
  await B.pg.waitForSelector('.lg-tarea', { timeout: 20000 });
  ok('alumno: el reto asignado se marca como tarea y tiene «Entregar»', !!(await B.pg.$('[data-p5a=entregar]')));
  await B.pg.goto(BASE + '#trabajo/' + id);
  await B.pg.waitForSelector('.p5l [data-p5=codigo]', { timeout: 20000 });
  ok('alumno: el elemento abre el editor con los 2 retos', (await B.pg.$$('.p5-rt')).length === 2);
  await escribir(B.pg, 'function setup() {\n  createCanvas(100, 100);\n}\nfunction draw() {\n  background(255);\n  noStroke();\n  fill(255, 0, 0);\n  rect(25, 25, 50, 50);\n}\n');
  await B.pg.click('[data-p5a=comprobar]');
  await B.pg.waitForFunction(() => /superado/.test(document.querySelector('.p5-res')?.textContent || ''), null, { timeout: 15000 });
  ok('alumno: reto 1 superado (código + color del píxel)', true);
  await B.pg.click('[data-p5r="1"]');
  await escribir(B.pg, 'let vel = 9;\nfunction setup() {\n  createCanvas(100, 100);\n}\n');
  await B.pg.click('[data-p5a=comprobar]');
  await B.pg.waitForSelector('.p5-veredicto', { timeout: 15000 });
  ok('alumno: variable fuera de rango → no superado', /Todavía no/.test(await B.pg.textContent('.p5-res')));
  await shot(B.pg, 'f5_alumno_elemento');
  await B.pg.click('[data-p5a=entregar]');
  await B.pg.waitForFunction(() => /Entregado/.test(document.querySelector('.p5-entmsg')?.textContent || ''), null, { timeout: 15000 });
  const tr = JSON.stringify(await docREST(`trabajos/${id}_${T.GB.id}_5`));
  ok('entrega: «Aciertos: 1/2» y el código de cada reto en el trabajo', /Aciertos: 1\/2/.test(tr) && /rect\(25, 25, 50, 50\)/.test(tr) && /let vel = 9/.test(tr));
  await B.pg.setViewportSize({ width: 390, height: 844 }); await B.pg.waitForTimeout(400);
  await shot(B.pg, 'f5_alumno_movil');
  await B.pg.setViewportSize({ width: 1280, height: 860 });
  // cuaderno: Poner notas
  await pg.goto(BASE + '#panel/notas');
  await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GB.id); await pg.waitForTimeout(400);
  await pg.selectOption('[data-ap-f=gAsig]', 'cdpc1').catch(() => { });
  await pg.waitForSelector(`td[data-celda="${id}"][data-n="5"]`, { timeout: 20000 });
  const th = await pg.evaluate((i) => [...document.querySelectorAll('th')].find((x) => x.querySelector(`[data-ap=notasActividad]`) && x.textContent.includes('Retos p5'))?.textContent || '', id);
  ok('cuaderno: el elemento p5 tiene «Poner notas» (lee los aciertos)', /Poner notas/.test(th), th.slice(0, 80));
}
