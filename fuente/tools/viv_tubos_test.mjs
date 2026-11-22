// Los cables van SIEMPRE por dentro del tubo: en todos los montajes de referencia (proyectos y tablero de la SA1),
// cada punto de la curva de cada cable que está fuera de las cajas queda dentro de la pared del tubo.
//   node viv_tubos_test.mjs
import * as THREE from 'three';
import { recorridoCable, lineaTubo, rutaCable, radioCable, partePorId, posParte, medidas, TIPOS, solucionTablero } from './src/viv/modelo.js';
import { PROYECTOS, solucion } from './src/viv/proyectos.js';
let fallos = 0, n = 0;
function dentroDePieza(m, q) { return m.parts.some((p) => { if (TIPOS[p.type].modulo || p.type === 'manguera') return false; const c = posParte(m, p); if (!c) return false; const d = medidas(p); return Math.abs(q.x - c.x) < d.w / 2 + 0.05 && Math.abs(q.y - c.y) < d.h / 2 + 0.05; }); }
function distEje(L, q) { let best = 1e9; for (let i = 1; i < L.length; i++) { const a = L[i - 1], b = L[i]; const dx = b.x - a.x, dy = b.y - a.y; const l2 = dx * dx + dy * dy || 1; const t = Math.max(0, Math.min(1, ((q.x - a.x) * dx + (q.y - a.y) * dy) / l2)); best = Math.min(best, Math.hypot(q.x - a.x - t * dx, q.y - a.y - t * dy)); } return best; }
function revisa(nombre, m) {
  for (const c of m.cables) {
    const rc = rutaCable(m, c); if (!rc.tubo) continue; n++;
    const pts = recorridoCable(m, c); const t = m.tubos.find((x) => x.id === rc.tubo); const L = lineaTubo(m, t);
    const rad = (+t.d || 16) / 20, zt = rad + 0.05, rr = radioCable(c.sec || 1.5);
    const curva = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(q.x, q.y, q.z)), false, 'centripetal');
    let peor = 0;
    for (let i = 0; i <= 600; i++) { const q = curva.getPointAt(i / 600); if (dentroDePieza(m, q)) continue; const d = Math.hypot(distEje(L, q), q.z - zt) + rr; peor = Math.max(peor, d - rad); }
    if (peor > 0.02) { fallos++; console.log(`FAIL ${nombre} · cable ${c.id} sale ${peor.toFixed(2)} cm del tubo ${t.id}`); }
  }
}
revisa('tablero SA1', solucionTablero());
for (const P of PROYECTOS) { if (P.casa) continue; try { revisa('proyecto ' + P.n, solucion(P)); } catch (e) { console.log('sin solución', P.n, e.message); } }
console.log(fallos ? `FALLAN ${fallos} de ${n} cables` : `OK ${n} cables por dentro de su tubo`); process.exit(fallos ? 1 : 0);
