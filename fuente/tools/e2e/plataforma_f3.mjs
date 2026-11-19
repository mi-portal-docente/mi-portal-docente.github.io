// Fase 3 · «Exportar CSV» por criterio (sin nombres) y panel «Analítica». Usa el examen y la entrega de la fase 2.
import { readFileSync } from 'fs';
export default async function ({ T, BASE, ok, shot }) {
  const pg = T.P.pg;
  if (!T.EX2) { ok('fase 3: necesita la fase 2 (FASES=2,3)', false); return; }
  await pg.goto(BASE + '#panel/notas');
  await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(400);
  await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
  await pg.waitForSelector(`td[data-celda="${T.EX2}"][data-n="3"]`, { timeout: 20000 });
  const [dl] = await Promise.all([pg.waitForEvent('download', { timeout: 20000 }), pg.click('[data-ap=csvCriterios]')]);
  const txt = readFileSync(await dl.path(), 'utf8').replace(/^\ufeff/, '');
  const L = txt.split(/\r\n/).map((l) => l.split(';').map((x) => x.replace(/^"|"$/g, '')));
  ok('CSV: cabecera nº de lista, actividad, fecha, nota, criterio (5 columnas)', L[0].join('|') === 'nº de lista|actividad|fecha|nota|criterio' && L.every((f) => f.length === 5), L[0].join('|'));
  const fila = (c) => L.find((f) => f[0] === '03' && f[1] === 'Examen tipos nuevos' && f[4] === c);
  ok('CSV: el examen sale con una fila por criterio (nota 0–10)', fila('eee_c1_1')?.[3] === '10' && fila('eee_c1_2')?.[3] === '7,5' && fila('eee_c1_3')?.[3] === '10', L.filter((f) => f[0] === '03').map((f) => f.join('|')).join(' / '));
  ok('CSV: fecha AAAA-MM-DD y sin nombres de alumnos', /^\d{4}-\d{2}-\d{2}$/.test(fila('eee_c1_1')?.[2] || '') && !/alumno|nombre/i.test(txt));
  ok('el CSV de siempre (tabla) sigue estando', !!(await pg.$('[data-ap=csvNotas]')));
  await shot(pg, 'f3_cuaderno_csv');
  // ------------------------------------------------------------- Analítica
  await pg.click('#pnTabs [data-pn-tab=analitica]');
  await pg.waitForSelector('[data-ap-f=gGrupo]', { timeout: 20000 });
  await pg.selectOption('[data-ap-f=gGrupo]', T.GE.id); await pg.waitForTimeout(300);
  await pg.selectOption('[data-ap-f=gAsig]', 'eee').catch(() => { });
  await pg.waitForSelector('[data-ap-f=anEx]', { timeout: 20000 });
  await pg.selectOption('[data-ap-f=anEx]', T.EX2);
  await pg.waitForSelector('#anCrit', { timeout: 20000 });
  const crit = await pg.$$eval('#anCrit tbody tr', (l) => l.map((r) => r.cells[0].textContent + '=' + r.cells[2].textContent.trim()));
  ok('Analítica: % de acierto por criterio, de menor a mayor', crit[0] === 'eee_c1_2=75 %' && crit.length === 3, crit.join(' · '));
  const preg = await pg.$$eval('#anPreg tbody tr', (l) => l.map((r) => r.cells[1].textContent + '=' + r.cells[4].textContent.trim()));
  ok('Analítica: % por pregunta (huecos 50 %) primero la más fallada', preg[0] === 'Completa=50 %' && preg.length === 5, preg.join(' · '));
  ok('Analítica: lista de preguntas más falladas', /Completa/.test(await pg.textContent('#anFall')) && (await pg.$$('#anFall li')).length === 1);
  // v5 · 6e: alumno × criterio del examen (nota 0–10 por criterio) y su CSV
  const ac = await pg.$$eval('#anAlCrit tbody tr', (l) => l.map((r) => [...r.cells].map((c) => c.textContent.trim()).join('|')));
  ok('6e: tabla alumno × criterio (nº 03: c1_1 10, c1_2 7,5, c1_3 10)', ac.length === 1 && /^03\|10 [^|]*\|7,5 [^|]*\|10 /.test(ac[0]), ac.join(' / '));
  const [dl2] = await Promise.all([pg.waitForEvent('download', { timeout: 20000 }), pg.click('[data-ap=csvExCrit]')]);
  const t2 = readFileSync(await dl2.path(), 'utf8').replace(/^\ufeff/, '').split(/\r\n/).map((l) => l.split(';').map((x) => x.replace(/^"|"$/g, '')));
  ok('6e: CSV alumno × criterio (nº de lista y una columna por criterio, sin nombres)', t2[0].join('|') === 'nº de lista|eee_c1_1|eee_c1_2|eee_c1_3' && t2[1].join('|') === '03|10|7,5|10', t2.map((f) => f.join('|')).join(' / '));
  await (await pg.$('#anAlCrit'))?.screenshot({ path: '/workspace/capturas-v5/v5_f6_alumno_criterio.png' }).catch(() => { });
  await shot(pg, 'f3_analitica');
  await pg.setViewportSize({ width: 390, height: 844 }); await pg.waitForTimeout(400);
  await shot(pg, 'f3_analitica_movil');
  await pg.setViewportSize({ width: 1440, height: 900 });
}
