// Motor «Retos por bloques» (TIC): niveles en una cuadrícula; el alumno programa al robot con bloques
// (avanzar, girar, repetir, si hay camino) y el programa se ejecuta paso a paso sin evaluar JavaScript.
import { registrarMotor } from '../elemento.js';
import { texto, lista, numero } from './comun.js';
import { ID_RE } from './p5.js';

export const BLOQUES = { avanzar: 'avanzar', girar: 'girar a la izquierda / derecha', repetir: 'repetir N veces', mientras: 'repetir hasta la meta', si: 'si hay camino' };
export function validarBloques(c, err) {
  const niveles = lista(c.niveles, 'niveles', err, { min: 1, max: 20, nombre: 'niveles' }).map((n, i) => {
    const r = `niveles[${i}]`; if (!n || typeof n !== 'object') { err(r, 'Cada nivel es un objeto { "titulo", "mapa", … }.'); return null; }
    const mapa = lista(n.mapa, r + '.mapa', err, { min: 2, max: 12, nombre: 'mapa' }).map((f) => String(f));
    const ancho = mapa[0]?.length || 0; let S = 0, G = 0;
    mapa.forEach((f, y) => { if (!/^[#.SGNEOW]+$/.test(f.replace(/[NEOW]/g, 'S')) || f.length !== ancho || ancho > 12) err(`${r}.mapa[${y}]`, 'Cada fila del mapa: mismo largo (máx. 12) y solo «#» (muro), «.» (camino), «S» (salida) y «G» (meta).'); S += (f.match(/S/g) || []).length; G += (f.match(/G/g) || []).length; });
    if (mapa.length && (S !== 1 || G !== 1)) err(r + '.mapa', 'El mapa necesita exactamente una «S» (salida) y una «G» (meta).');
    const bl = lista(n.bloques ?? ['avanzar', 'girar', 'repetir'], r + '.bloques', err, { min: 1, max: 5, nombre: 'bloques' }).filter((b) => { if (!BLOQUES[b]) { err(r + '.bloques', `Bloques posibles: ${Object.keys(BLOQUES).join(', ')}.`); return false; } return true; });
    const dir = ['N', 'E', 'S', 'O'].includes(n.direccion) ? n.direccion : 'E';
    return { id: typeof n.id === 'string' && ID_RE.test(n.id) ? n.id : 'n' + (i + 1), titulo: texto(n.titulo, r + '.titulo', err, { max: 150, obligatorio: true, nombre: 'titulo' }),
      enunciado: texto(n.enunciado, r + '.enunciado', err, { max: 1000, nombre: 'enunciado' }), mapa, direccion: dir, bloques: bl,
      maxBloques: numero(n.maxBloques, r + '.maxBloques', err, { min: 1, max: 50, entero: true, nombre: 'maxBloques' }) };
  }).filter(Boolean);
  return { niveles };
}
// ---------------------------------------------------------------- ejecución
// programa: [{op:'avanzar'} | {op:'girar', lado:'izq'|'der'} | {op:'repetir', n, cuerpo:[…]} | {op:'mientras', cuerpo} | {op:'si', dir:'delante'|'izq'|'der', cuerpo, sino?}]
const DX = { N: [0, -1], E: [1, 0], S: [0, 1], O: [-1, 0] }; const ORDEN = ['N', 'E', 'S', 'O'];
export function inicio(nivel) { for (let y = 0; y < nivel.mapa.length; y++) { const x = nivel.mapa[y].indexOf('S'); if (x >= 0) return { x, y, d: nivel.direccion }; } return null; }
const libre = (nivel, x, y) => y >= 0 && y < nivel.mapa.length && x >= 0 && x < nivel.mapa[0].length && nivel.mapa[y][x] !== '#';
export function ejecutar(nivel, programa, { maxPasos = 400 } = {}) {
  const r = inicio(nivel); const pasos = [{ ...r }]; let error = null; let n = 0;
  const meta = () => nivel.mapa[r.y][r.x] === 'G';
  const girada = (lado) => ORDEN[(ORDEN.indexOf(r.d) + (lado === 'izq' ? 3 : 1)) % 4];
  const hayCamino = (dir) => { const d = dir === 'delante' ? r.d : girada(dir); return libre(nivel, r.x + DX[d][0], r.y + DX[d][1]); };
  function run(L) {
    for (const b of L) {
      if (error) return;
      if (++n > maxPasos) { error = 'El programa no termina (demasiados pasos).'; return; }
      if (b.op === 'avanzar') { const nx = r.x + DX[r.d][0], ny = r.y + DX[r.d][1]; if (!libre(nivel, nx, ny)) { error = 'El robot ha chocado con un muro.'; pasos.push({ ...r, choque: true }); return; } r.x = nx; r.y = ny; pasos.push({ ...r }); }
      else if (b.op === 'girar') { r.d = girada(b.lado); pasos.push({ ...r }); }
      else if (b.op === 'repetir') { for (let i = 0; i < Math.min(50, b.n || 0) && !error; i++) run(b.cuerpo || []); }
      else if (b.op === 'mientras') { let k = 0; while (!meta() && !error && k++ < 200) { const antes = n; run(b.cuerpo || []); if (n === antes) break; } }
      else if (b.op === 'si') { if (hayCamino(b.dir || 'delante')) run(b.cuerpo || []); else run(b.sino || []); }
      if (error) return;
    }
  }
  run(programa);
  return { pasos, meta: !error && meta(), error, bloques: contar(programa) };
}
export const contar = (L) => L.reduce((a, b) => a + 1 + contar(b.cuerpo || []) + contar(b.sino || []), 0);
export function superado(nivel, res) { return res.meta && (!nivel.maxBloques || res.bloques <= nivel.maxBloques); }

registrarMotor('bloques', {
  nombre: 'Retos por bloques', validar: validarBloques, entregable: true,
  resumen: (c) => `${c.niveles.length} nivel${c.niveles.length === 1 ? '' : 'es'} de bloques`,
  ejemplo: { niveles: [{ id: 'recto', titulo: 'En línea recta', enunciado: 'Lleva el robot hasta la meta.', mapa: ['#####', '#S.G#', '#####'], bloques: ['avanzar'] }] },
});
