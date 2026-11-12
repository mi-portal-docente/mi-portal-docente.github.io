// Simulación de la instalación con el mismo solucionador nodal del laboratorio de circuitos (230 V eficaces
// tratados como continua: resistencias puras), estado real de cada punta de cable (pelado, apriete, fichas),
// medidas con multímetro y buscapolos, y comprobación de normas (REBT) y averías.
import { solve } from '../circ/sim.js';
import { esEnchufe, TIPOS, COLORES, CARGAS, ADMISIBLE, fmtSec, partePorId, bornes, rutaCable, metrosCable, tuboEntre, nombreBorne, TUBOS_REF, REFERENCIA, clone,
  esMT, amperios, circuitoDe, curvaDe, tipoBorne, extremo, cablesDelTubo, largoTubo, huecoGrapas, dims } from './modelo.js';
import { CIRCUITOS, FICHAS, BORNES, PROTEGE, tuboMinimo, GRAPA_MAX } from './catalogo.js';

const RHO = 0.0172; // Ω·mm²/m (cobre)
const V_RED = 230;
export const R_BOMBILLA = (V_RED * V_RED) / 60;
const k = (p, t) => `${p}:${t}`;
const fmtA = (i) => (i >= 100 ? Math.round(i) : Math.round(i * 100) / 100).toString().replace('.', ',') + ' A';
const fmtmA = (i) => Math.round(i * 1000) + ' mA';
const lista = (a, n = 3) => a.slice(0, n).join('; ') + (a.length > n ? '…' : '');

class UF { constructor() { this.p = new Map(); } f(x) { if (!this.p.has(x)) this.p.set(x, x); let r = x; while (this.p.get(r) !== r) r = this.p.get(r); this.p.set(x, r); return r; } u(a, b) { this.p.set(this.f(a), this.f(b)); } }

// ---------------------------------------------------------------- estado de cada punta de cable
// ok · largo (cobre a la vista) · flojo · pasado (apretado con máquina) conducen; el resto no hace contacto.
export const CONDUCE = new Set(['ok', 'largo', 'flojo', 'pasado']);
export const TXT_PUNTA = {
  ok: 'bien', sinPelar: 'sin pelar', corto: 'pelado corto: el aislante queda dentro del borne (no hace contacto)', largo: 'pelado largo: cobre a la vista fuera del borne',
  flojo: 'borne sin apretar (flojo)', pasado: 'apretado con el taladro: par excesivo, cable dañado', sinFicha: 'sin ficha de empalme', llena: 'la ficha ya está llena: este cable no entra',
  seccion: 'sección fuera del rango de la ficha',
};
export function puntas(m) {
  const res = new Map(); const cuenta = new Map();
  for (const c of m.cables) {
    const o = {};
    for (const lado of ['a', 'b']) {
      const ref = c[lado]; const kind = tipoBorne(m, ref); const p = partePorId(m, ref.p); const e = extremo(c, lado);
      let s = 'ok';
      if (p?.type === 'caja') {
        const f = FICHAS[p.fichas?.[ref.t]]; const key = k(ref.p, ref.t); const n = (cuenta.get(key) || 0) + 1; cuenta.set(key, n);
        if (!f) s = 'sinFicha'; else if (n > f.vias) s = 'llena'; else if (c.sec < f.smin || c.sec > f.smax) s = 'seccion';
      }
      if (s === 'ok') {
        const B = BORNES[kind] || BORNES.mecanismo;
        if (!e.pel) s = 'sinPelar'; else if (e.pel < B.pel[0]) s = 'corto';
        else if (B.puntas && e.apr === false) s = 'flojo'; else if (B.puntas && e.apr === 'pasado') s = 'pasado';
        else if (e.pel > B.pel[1]) s = 'largo';
      }
      o[lado] = s;
    }
    res.set(c.id, o);
  }
  return res;
}

// Red estructural: cables unidos, interruptores/conmutadores cerrados en todas sus posiciones.
export function redes(m) {
  const uf = new UF();
  for (const c of m.cables) uf.u(k(c.a.p, c.a.t), k(c.b.p, c.b.t));
  for (const p of m.parts) {
    if (p.type === 'interruptor' || p.type === 'pulsador') uf.u(k(p.id, '1'), k(p.id, '2'));
    if (p.type === 'conmutador') { uf.u(k(p.id, 'C'), k(p.id, '1')); uf.u(k(p.id, 'C'), k(p.id, '2')); }
    if (p.type === 'cruzamiento') { uf.u(k(p.id, '1'), k(p.id, '3')); uf.u(k(p.id, '1'), k(p.id, '4')); uf.u(k(p.id, '2'), k(p.id, '3')); }
    if (p.type === 'minutero') uf.u(k(p.id, 'L'), k(p.id, '4'));
  }
  const clase = new Map(); const circ = new Map();
  const marca = (key, cl, mt) => { const r = uf.f(key); if (!clase.has(r)) clase.set(r, new Set()); clase.get(r).add(cl); if (mt) { if (!circ.has(r)) circ.set(r, new Set()); circ.get(r).add(mt); } };
  const cuadro = m.parts.find((p) => p.type === 'cuadro');
  if (cuadro?.cab) {
    const mg = m.parts.find((p) => p.type === 'manguera' && p.cab); if (mg) { marca(k(mg.id, 'L'), 'fase'); marca(k(mg.id, 'N'), 'neutro'); marca(k(mg.id, 'PE'), 'tierra'); }
    for (const p of m.parts) if (p.cab && TIPOS[p.type].modulo) { if (esMT(p)) { marca(k(p.id, 'Le'), 'fase'); marca(k(p.id, 'Ne'), 'neutro'); } else { uf.u(k(p.id, 'Le'), k(p.id, 'L')); uf.u(k(p.id, 'Ne'), k(p.id, 'N')); } }
  }
  for (const p of m.parts) if (esMT(p)) { const c = circuitoDe(p) || p.id; marca(k(p.id, 'L'), 'fase', c); marca(k(p.id, 'N'), 'neutro', c); }
  if (cuadro) marca(k(cuadro.id, 'PE'), 'tierra');
  return { uf, clase: (key) => clase.get(uf.f(key)) || new Set(), circ: (key) => circ.get(uf.f(key)) || new Set(), mismo: (a, b) => uf.f(a) === uf.f(b) };
}

// ---------------------------------------------------------------- red eléctrica (común a simular y medir)
function montarRed(m, est, abiertos, P, { ohmetro = false } = {}) {
  const nodos = new Map(); const N = (key) => { if (!nodos.has(key)) nodos.set(key, nodos.size); return nodos.get(key); };
  const els = []; let n = 0;
  const R = (a, b, r, id) => els.push({ k: 'R', a: N(a), b: N(b), r: Math.max(r, 1e-4), id: id || 'r' + n++ });
  N('TIERRA');
  const cuadro = m.parts.find((p) => p.type === 'cuadro'), manguera = m.parts.find((p) => p.type === 'manguera');
  const iga = m.parts.find((p) => p.type === 'iga'), idp = m.parts.find((p) => p.type === 'id'), mts = m.parts.filter(esMT);
  if (!ohmetro) {
    els.push({ k: 'V', a: N('RED:L'), b: N('RED:N'), v: V_RED, rint: 0.25, id: 'red' });
    R('RED:N', 'TIERRA', 0.5, 'neutroTrafo'); R('RED:PE', 'TIERRA', 1, 'tierraEdificio');
  }
  if (cuadro?.cab) {
    // cuadro cableado por el alumno: cada aparato une su entrada (arriba) con su salida (abajo) si está cerrado
    if (!ohmetro && manguera && est.enchufada !== false) { R('RED:L', k(manguera.id, 'L'), 0.05, 'mgL'); R('RED:N', k(manguera.id, 'N'), 0.05, 'mgN'); R('RED:PE', k(manguera.id, 'PE'), 0.05, 'mgPE'); }
    if (iga && !abiertos.has(iga.id)) { R(k(iga.id, 'Le'), k(iga.id, 'L'), 0.002, 'igaL'); R(k(iga.id, 'Ne'), k(iga.id, 'N'), 0.002, 'igaN'); }
    if (idp && !abiertos.has(idp.id)) { R(k(idp.id, 'Le'), k(idp.id, 'L'), 0.002, 'idL'); R(k(idp.id, 'Ne'), k(idp.id, 'N'), 0.002, 'idN'); if (est.test && !ohmetro) R(k(idp.id, 'L'), k(idp.id, 'Ne'), 5750, 'idTest'); }
    for (const p of mts) if (p.cuadro === cuadro.id && !abiertos.has(p.id)) { R(k(p.id, 'Le'), k(p.id, 'L'), 0.002, p.id + ':L'); R(k(p.id, 'Ne'), k(p.id, 'N'), 0.002, p.id + ':N'); }
  } else if (cuadro) {
    if (!ohmetro && manguera && est.enchufada !== false) { R('RED:L', 'Q:Lin', 0.05, 'mgL'); R('RED:N', 'Q:Nin', 0.05, 'mgN'); R('RED:PE', k(cuadro.id, 'PE'), 0.05, 'mgPE'); }
    let L = 'Q:Lin', Nn = 'Q:Nin', vivo = true;
    if (iga) { if (abiertos.has(iga.id)) vivo = false; else { R(L, 'IGA:Lo', 0.002, 'igaL'); R(Nn, 'IGA:No', 0.002, 'igaN'); L = 'IGA:Lo'; Nn = 'IGA:No'; } }
    if (vivo && idp) { if (abiertos.has(idp.id)) vivo = false; else { R(L, 'ID:Lo', 0.002, 'idL'); R(Nn, 'ID:No', 0.002, 'idN'); if (est.test && !ohmetro) R('ID:Lo', 'Q:Nin', 5750, 'idTest'); L = 'ID:Lo'; Nn = 'ID:No'; } }
    if (vivo) for (const p of mts) if (cuadro && p.cuadro === cuadro.id && !abiertos.has(p.id)) { R(L, k(p.id, 'L'), 0.002, p.id + ':L'); R(Nn, k(p.id, 'N'), 0.002, p.id + ':N'); }
  }
  for (const c of m.cables) {
    const e = P.get(c.id); if (!e || !CONDUCE.has(e.a) || !CONDUCE.has(e.b)) continue;
    R(k(c.a.p, c.a.t), k(c.b.p, c.b.t), (RHO * metrosCable(m, c)) / c.sec + (e.a === 'flojo' ? 0.4 : 0) + (e.b === 'flojo' ? 0.4 : 0), 'w:' + c.id);
  }
  for (const p of m.parts) {
    if (p.type === 'bombilla') R(k(p.id, 'L'), k(p.id, 'N'), ohmetro ? R_BOMBILLA / 12 : R_BOMBILLA, 'b:' + p.id);
    if ((p.type === 'interruptor' || p.type === 'pulsador') && p.on) R(k(p.id, '1'), k(p.id, '2'), 0.001);
    if (p.type === 'minutero') { R(k(p.id, '3'), k(p.id, 'N'), 40000, 'min:' + p.id); if (p.on) R(k(p.id, 'L'), k(p.id, '4'), 0.001); }
    if (p.type === 'conmutador') R(k(p.id, 'C'), k(p.id, p.pos ? '2' : '1'), 0.001);
    if (p.type === 'cruzamiento') { if (p.pos) { R(k(p.id, '1'), k(p.id, '4'), 0.001); R(k(p.id, '2'), k(p.id, '3'), 0.001); } else { R(k(p.id, '1'), k(p.id, '3'), 0.001); R(k(p.id, '2'), k(p.id, '4'), 0.001); } }
    if (esEnchufe(p)) {
      const c = CARGAS.find((x) => x.id === p.carga) || CARGAS[0];
      if (c.w) R(k(p.id, 'L'), k(p.id, 'N'), (V_RED * V_RED) / c.w, 'e:' + p.id);
      if (c.corto) R(k(p.id, 'L'), k(p.id, 'N'), 0.01, 'e:' + p.id);
      if (c.fuga) R(k(p.id, 'L'), k(p.id, 'PE'), 2000, 'fuga:' + p.id);
      if (est.tocar && c.id !== 'nada' && !ohmetro) R(k(p.id, 'PE'), 'TIERRA', 1000, 'persona:' + p.id);
    }
  }
  return { nodos, els };
}

// ---------------------------------------------------------------- simulación eléctrica
// est: { enchufada, test, tocar } · devuelve estado de bombillas, enchufes, protecciones y corrientes.
export function simular(m0, est = {}) {
  const m = clone(m0);
  const iga = m.parts.find((p) => p.type === 'iga'), idp = m.parts.find((p) => p.type === 'id');
  const mts = m.parts.filter(esMT);
  const disparos = []; const avisos = []; const P = puntas(m);
  const abiertos = new Set(m.parts.filter((p) => TIPOS[p.type].modulo && p.on === false).map((p) => p.id));
  let res = null;
  for (let vuelta = 0; vuelta < 8; vuelta++) {
    const { nodos, els } = montarRed(m, est, abiertos, P);
    const r = solve(nodos.size, els);
    const uf = new UF(); for (const e of els) uf.u(e.a, e.b); const raiz = uf.f(nodos.get('TIERRA'));
    const V = (key) => (nodos.has(key) ? (uf.f(nodos.get(key)) === raiz ? r.V[nodos.get(key)] - r.V[nodos.get('TIERRA')] : 0) : null);
    const I = (id) => r.I[id] ?? 0;
    res = { V, I, nodos };
    let cambia = false;
    if (idp && !abiertos.has(idp.id) && (nodos.has('ID:Lo') || els.some((e) => e.id === 'idL'))) {
      const fuga = Math.abs(I('idL') + I('idN')); res.fuga = fuga;
      if (fuga > 0.03) { abiertos.add(idp.id); disparos.push({ p: idp.id, por: est.test && fuga < 0.05 ? 'test' : 'fuga', t: est.test && fuga < 0.05 ? `Salta el diferencial con el botón de prueba (${fmtmA(fuga)})` : `Salta el diferencial: fuga a tierra de ${fmtmA(fuga)} (> 30 mA)` }); cambia = true; }
    }
    // primero saltan los magnetotérmicos (selectividad); si ninguno, el IGA
    let algunMT = false;
    for (const p of mts) {
      if (abiertos.has(p.id) || !nodos.has(k(p.id, 'L'))) continue;
      const i = Math.abs(I(p.id + ':L')); const In = amperios(p); const mag = curvaDe(p) === 'B' ? 5 : 10;
      if (i > mag * In) { abiertos.add(p.id); algunMT = true; disparos.push({ p: p.id, por: 'corto', t: `Salta ${p.nombre}: cortocircuito (${fmtA(i)} ≫ ${In} A, disparo magnético instantáneo)` }); cambia = true; }
      else if (i > 1.13 * In) { abiertos.add(p.id); algunMT = true; disparos.push({ p: p.id, por: 'sobrecarga', t: `Salta ${p.nombre} ${i > 1.45 * In ? 'al cabo de unos segundos' : 'al cabo de unos minutos'}: sobrecarga (${fmtA(i)} > ${In} A, disparo térmico)` }); cambia = true; }
    }
    if (!algunMT && iga && !abiertos.has(iga.id) && (nodos.has('IGA:Lo') || els.some((e) => e.id === 'igaL'))) {
      const i = Math.abs(I('igaL')); const In = amperios(iga);
      if (i > 10 * In) { abiertos.add(iga.id); disparos.push({ p: iga.id, por: 'corto', t: `Salta el IGA: cortocircuito (${fmtA(i)})` }); cambia = true; }
      else if (i > 1.13 * In) { abiertos.add(iga.id); disparos.push({ p: iga.id, por: 'sobrecarga', t: `Salta el IGA por sobrecarga: toda la vivienda consume ${fmtA(i)} (> ${In} A)` }); cambia = true; }
    }
    if (!cambia) break;
  }
  const { V, I } = res;
  const dif = (a, b) => { const va = V(a), vb = V(b); return va == null || vb == null ? 0 : va - vb; };
  const bombillas = m.parts.filter((p) => p.type === 'bombilla').map((p) => { const v = Math.abs(dif(k(p.id, 'L'), k(p.id, 'N'))); return { id: p.id, nombre: p.nombre, v, luz: Math.min(1, (v / V_RED) ** 2), encendida: v > 150, vL: Math.abs(V(k(p.id, 'L')) ?? 0), vN: Math.abs(V(k(p.id, 'N')) ?? 0) }; });
  const enchufes = m.parts.filter(esEnchufe).map((p) => ({ id: p.id, nombre: p.nombre, v: Math.abs(dif(k(p.id, 'L'), k(p.id, 'N'))), vL: Math.abs(V(k(p.id, 'L')) ?? 0), vN: Math.abs(V(k(p.id, 'N')) ?? 0), vCarcasa: Math.abs(V(k(p.id, 'PE')) ?? 0), i: Math.abs(I('e:' + p.id)) }));
  const cables = m.cables.map((c) => ({ id: c.id, i: Math.abs(I('w:' + c.id)) }));
  const iCab = new Map(cables.map((c) => [c.id, c.i]));
  for (const c of m.cables) { const i = iCab.get(c.id); if (i > (ADMISIBLE[c.sec] || 25)) avisos.push(`Cable de ${fmtSec(c.sec)} (${nombreBorne(m, c.a)} → ${nombreBorne(m, c.b)}) con ${fmtA(i)}: supera los ${ADMISIBLE[c.sec]} A que admite (se calienta)`); }
  for (const e of enchufes) if (e.vCarcasa > 50) avisos.push(`¡Peligro! La carcasa del aparato de ${e.nombre} tiene ${Math.round(e.vCarcasa)} V respecto a tierra`);
  // puntas flojas o con cobre a la vista
  for (const c of m.cables) { const e = P.get(c.id); const i = iCab.get(c.id);
    for (const lado of ['a', 'b']) {
      if (e[lado] === 'flojo' && i > 1) avisos.push(`Borne flojo en ${nombreBorne(m, c[lado])}: con ${fmtA(i)} hace mal contacto, chispea y se calienta (puede quemar el mecanismo)`);
      if (e[lado] === 'largo' && Math.abs(V(k(c[lado].p, c[lado].t)) ?? 0) > 50) avisos.push(`Cobre a la vista en ${nombreBorne(m, c[lado])} con tensión: riesgo de contacto directo`);
    } }
  // fichas por encima de su corriente
  for (const p of m.parts.filter((q) => q.type === 'caja')) for (const b of bornes(p)) {
    const f = FICHAS[p.fichas?.[b.t]]; if (!f) continue;
    const i = m.cables.filter((c) => (c.a.p === p.id && c.a.t === b.t) || (c.b.p === p.id && c.b.t === b.t)).reduce((s, c) => s + (iCab.get(c.id) || 0), 0) / 2;
    if (i > f.A) avisos.push(`La ficha ${b.t} de ${p.nombre} (${f.corto}) lleva ${fmtA(i)}: más de sus ${f.A} A`);
  }
  const corrientes = Object.fromEntries(mts.map((p) => [p.id, Math.abs(I(p.id + ':L'))]));
  if (iga) corrientes[iga.id] = Math.abs(I('igaL'));
  const minuteros = m.parts.filter((p) => p.type === 'minutero').map((p) => ({ id: p.id, v3: Math.abs(dif(k(p.id, '3'), k(p.id, 'N'))), on: !!p.on }));
  return { minuteros, bombillas, enchufes, cables, disparos, avisos, abiertos: [...abiertos], fuga: res.fuga || 0, corrientes, puntas: P, v: (a, b) => dif(a, b), V };
}

// ---------------------------------------------------------------- medidas
const clave = (ref) => (ref === 'TIERRA' ? 'TIERRA' : k(ref.p, ref.t));
// Multímetro: modo 'V' (con tensión) u 'ohm' (sin tensión). Devuelve { v } o { r } (Infinity = OL) o { error }.
export function medir(m, est, a, b, modo = 'V') {
  if (modo === 'V') { if (!est.enchufada) return { v: 0 }; const r = simular(m, est); return { v: Math.abs(r.v(clave(a), clave(b))) }; }
  if (est.enchufada) return { error: 'tension' };
  const x = clone(m); const P = puntas(x);
  const abiertos = new Set(x.parts.filter((p) => TIPOS[p.type].modulo && p.on === false).map((p) => p.id));
  const { nodos, els } = montarRed(x, { ...est, enchufada: false }, abiertos, P, { ohmetro: true });
  const N = (key) => { if (!nodos.has(key)) nodos.set(key, nodos.size); return nodos.get(key); };
  const ka = clave(a), kb = clave(b); if (ka === kb) return { r: 0 };
  els.push({ k: 'I', a: N(ka), b: N(kb), i: 0.001, id: 'ohm' });
  const r = solve(nodos.size, els); const R = (r.V[nodos.get(ka)] - r.V[nodos.get(kb)]) / 0.001;
  return { r: R > 2e6 ? Infinity : Math.max(0, R) };
}
export function buscapolos(m, est, ref) { if (!est.enchufada) return { luz: false, v: 0 }; const r = simular(m, est); const v = Math.abs(r.V(clave(ref)) ?? 0); return { luz: v > 50, v }; }

// ---------------------------------------------------------------- comprobación de normas
// opts: { iga: exige IGA, realista: revisa puntas, fichas, tubos y fijación }. Devuelve { ok, items: [{ ok, t, k }] }.
export function comprobar(m, opts = {}) {
  const realista = opts.realista !== false;
  const it = []; const add = (ok, t, kk, extra) => it.push({ ok: !!ok, t, k: kk, ...(extra || {}) });
  const R = redes(m);
  const cuadro = m.parts.find((p) => p.type === 'cuadro');
  const mts = m.parts.filter(esMT); const iga = m.parts.find((p) => p.type === 'iga'); const idp = m.parts.find((p) => p.type === 'id');
  add(cuadro && idp && mts.length && m.parts.some((p) => p.type === 'manguera'), 'Cuadro con diferencial, magnetotérmicos y manguera de acometida', 'cuadro');
  if (opts.iga || iga) add(iga && amperios(iga) >= 25, !iga ? 'Falta el interruptor general automático (IGA) al principio del cuadro' : amperios(iga) >= 25 ? `IGA de ${amperios(iga)} A (mínimo 25 A en vivienda)` : `IGA de ${amperios(iga)} A: en una vivienda tiene que ser de 25 A o más`, 'iga');
  if (idp && iga) add(amperios(idp) >= amperios(iga), amperios(idp) >= amperios(iga) ? `Diferencial de ${amperios(idp)} A, igual o mayor que el IGA` : `El diferencial es de ${amperios(idp)} A y el IGA de ${amperios(iga)} A: el diferencial se sobrecargaría (tiene que ser de ${amperios(iga)} A o más)`, 'diferencial');
  // cortocircuitos y derivaciones directas
  const nets = new Map(); for (const c of m.cables) for (const r of [c.a, c.b]) { const key = k(r.p, r.t); nets.set(R.uf.f(key), key); }
  for (const p of mts) nets.set(R.uf.f(k(p.id, 'L')), k(p.id, 'L'));
  const choques = [];
  for (const key of nets.values()) { const cl = R.clase(key); if (cl.size > 1) choques.push([...cl].sort().join(' + ')); }
  add(!choques.some((c) => c === 'fase + neutro'), choques.includes('fase + neutro') ? 'Cortocircuito: la fase y el neutro están unidos sin receptor (saltaría el magnetotérmico)' : 'Sin cortocircuitos entre fase y neutro', 'corto');
  add(!choques.some((c) => /tierra/.test(c)), choques.some((c) => /tierra/.test(c)) ? `La tierra está unida a ${choques.find((c) => /tierra/.test(c)).replace(/ ?\+ ?|tierra/g, '') || 'otro conductor'} (saltaría el diferencial)` : 'La tierra no se une a la fase ni al neutro', 'tierraUnida');
  // colores
  const malColor = m.cables.filter((c) => { const cl = R.clase(k(c.a.p, c.a.t)); if (cl.size !== 1) return false; const x = [...cl][0]; return COLORES[c.color].clase !== x; });
  add(!malColor.length, malColor.length ? `Colores: ${malColor.length} cable${malColor.length > 1 ? 's' : ''} con color equivocado (fase marrón/negro/gris · neutro azul · tierra amarillo-verde): ${lista(malColor.map((c) => nombreBorne(m, c.a) + ' → ' + nombreBorne(m, c.b)))}` : 'Colores correctos (fase marrón/negro/gris · neutro azul · tierra amarillo-verde)', 'colores', { cables: malColor.map((c) => c.id) });
  // interruptores en la fase
  const enNeutro = m.parts.filter((p) => ['interruptor', 'conmutador', 'pulsador', 'cruzamiento'].includes(p.type) && R.clase(k(p.id, p.type === 'conmutador' ? 'C' : '1')).has('neutro'));
  add(!enNeutro.length, enNeutro.length ? `${enNeutro.map((p) => p.nombre).join(', ')} corta${enNeutro.length > 1 ? 'n' : ''} el NEUTRO: la bombilla queda con tensión aunque esté apagada (fase y neutro intercambiados)` : 'Los interruptores cortan la fase', 'interruptorFase');
  // marcado de los bornes (como en el mecanismo real): fase al borne L/1, salida ↓ a la lámpara, etc.
  const uf0 = new UF(); for (const c of m.cables) uf0.u(k(c.a.p, c.a.t), k(c.b.p, c.b.t));
  for (const p of m.parts) if (p.cab && (p.type === 'iga' || p.type === 'id')) { uf0.u(k(p.id, 'Le'), k(p.id, 'L')); uf0.u(k(p.id, 'Ne'), k(p.id, 'N')); }
  const fuentes = [...mts.map((p) => k(p.id, 'L')), ...m.parts.filter((p) => p.type === 'manguera' && p.cab).map((p) => k(p.id, 'L'))];
  const conFase = (key) => fuentes.some((f) => uf0.f(f) === uf0.f(key));
  const conLampara = (key) => m.parts.some((b) => b.type === 'bombilla' && uf0.f(k(b.id, 'L')) === uf0.f(key));
  const usado = (p, t) => m.cables.some((c) => (c.a.p === p.id && c.a.t === t) || (c.b.p === p.id && c.b.t === t));
  const marc = [];
  for (const p of m.parts) {
    const N = p.nombre || TIPOS[p.type].corto;
    if ((p.type === 'interruptor' || p.type === 'pulsador') && usado(p, '1') && usado(p, '2') && !conFase(k(p.id, '1')) && conFase(k(p.id, '2')))
      marc.push(`${N}: la fase entra por el borne marcado L y sale por el ↓ hacia la lámpara; lo tienes al revés (funciona, pero no respeta el marcado del mecanismo)`);
    if (p.type === 'conmutador' && usado(p, 'C') && !conFase(k(p.id, 'C')) && !conLampara(k(p.id, 'C')))
      marc.push(`${N}: el borne común (marcado L) va a la fase o al retorno de la lámpara; los viajeros 1 y 2 van al otro conmutador o al cruzamiento`);
    if (p.type === 'bombilla' && usado(p, 'L') && usado(p, 'N') && R.clase(k(p.id, 'L')).has('neutro') && R.clase(k(p.id, 'N')).has('fase'))
      marc.push(`${N}: el neutro va a la rosca (borne N) y la fase, que viene del interruptor, al contacto central (borne L). Al revés, la rosca queda con tensión y da calambre al cambiar la bombilla`);
    if (esEnchufe(p) && usado(p, 'L') && usado(p, 'N') && R.clase(k(p.id, 'L')).has('neutro') && R.clase(k(p.id, 'N')).has('fase'))
      marc.push(`${N}: fase y neutro cambiados. Respeta el marcado de la base: fase (marrón) al borne L y neutro (azul) al borne N`);
    if (p.type === 'minutero' && usado(p, 'L') && !conFase(k(p.id, 'L'))) marc.push(`${N}: el borne L del minutero va directo a la fase (lo alimenta); los pulsadores van al borne 3 y la lámpara al ↓`);
    if (p.cab && TIPOS[p.type].modulo) {
      const arriba = usado(p, 'Le') || usado(p, 'Ne'), abajo = usado(p, 'L') || usado(p, 'N');
      const alimAbajo = [k(p.id, 'L'), k(p.id, 'N')].some((x) => m.cables.some((c) => { const o = k(c.a.p, c.a.t) === x ? c.b : k(c.b.p, c.b.t) === x ? c.a : null; if (!o) return false; const q = partePorId(m, o.p); return q && (q.type === 'manguera' || ((q.type === 'iga' || q.type === 'id') && (o.t === 'L' || o.t === 'N') && q.id !== p.id)); }));
      if (alimAbajo || (abajo && !arriba)) marc.push(`${N}: la alimentación entra por ARRIBA (bornes 1 y N) y sale por ABAJO (2 y N) hacia el siguiente aparato o el circuito`);
      const fN = [['Le', 'Ne'], ['L', 'N']].some(([a, b]) => R.clase(k(p.id, a)).has('neutro') && R.clase(k(p.id, b)).has('fase'));
      if (fN) marc.push(`${N}: fase y neutro cruzados. La fase va al borne 1/2 y el neutro al borne marcado N (azul)`);
    }
  }
  add(!marc.length, marc.length ? 'Marcado de los bornes: ' + lista(marc, 3) : 'Cada cable en su borne según el marcado (L, ↓, 1, 2, N, ⏚)', 'marcado');
  // secciones según el circuito (ITC-BT-25)
  const reqSec = (key) => { const cl = R.clase(key); let s = 0;
    for (const c of R.circ(key)) s = Math.max(s, CIRCUITOS[c]?.sec || 0);
    if (cl.has('tierra')) for (const e of m.parts.filter((p) => esEnchufe(p) && R.mismo(k(p.id, 'PE'), key))) { let se = 0; for (const c of R.circ(k(e.id, 'L'))) se = Math.max(se, CIRCUITOS[c]?.sec || 0); s = Math.max(s, se || 2.5); }
    return s; };
  const malSec = m.cables.filter((c) => c.sec < reqSec(k(c.a.p, c.a.t)));
  add(!malSec.length, malSec.length ? `Sección: ${malSec.length} cable${malSec.length > 1 ? 's' : ''} más fino${malSec.length > 1 ? 's' : ''} de lo que pide su circuito (C1 1,5 · C2 2,5 · C3 6 · C4 4 · C5 2,5 mm²); por ejemplo el circuito de enchufes (C2, 16 A) necesita 2,5 mm²` : 'Secciones correctas (C1 alumbrado 1,5 mm² · C2 enchufes 2,5 mm²)', 'seccion', { cables: malSec.map((c) => c.id) });
  // calibre de cada magnetotérmico: protege su cable y es el de su circuito
  const malMT = [];
  for (const p of mts) {
    const c = circuitoDe(p); const In = amperios(p);
    const secs = m.cables.filter((w) => R.mismo(k(w.a.p, w.a.t), k(p.id, 'L'))).map((w) => w.sec);
    const minSec = secs.length ? Math.min(...secs) : null;
    if (minSec && In > (PROTEGE[minSec] || 0)) malMT.push(`${c || p.nombre}: magnetotérmico de ${In} A con cable de ${fmtSec(minSec)}: el cable no queda protegido (máx. ${PROTEGE[minSec]} A)`);
    else if (c && CIRCUITOS[c] && In > CIRCUITOS[c].In) malMT.push(`${c}: el ${c} (${CIRCUITOS[c].n.toLowerCase()}) lleva ${CIRCUITOS[c].In} A según la ITC-BT-25, no ${In} A`);
  }
  if (mts.length) add(!malMT.length, malMT.length ? 'Calibre: ' + lista(malMT) : `Calibres correctos: ${mts.map((p) => `${circuitoDe(p) || p.nombre} ${amperios(p)} A`).join(' · ')}`, 'calibre');
  // receptores en su circuito
  const lamps = m.parts.filter((p) => p.type === 'bombilla');
  const lampMal = lamps.filter((p) => { const c = new Set([...R.circ(k(p.id, 'L')), ...R.circ(k(p.id, 'N'))]); return c.size && !c.has('C1'); });
  const lampSueltas = lamps.filter((p) => !R.clase(k(p.id, 'L')).size || !R.clase(k(p.id, 'N')).size);
  if (lamps.length) add(!lampMal.length && !lampSueltas.length, lampSueltas.length ? `${lampSueltas.map((p) => p.nombre).join(', ')} sin fase o sin neutro` : lampMal.length ? `${lampMal.map((p) => p.nombre).join(', ')} no va${lampMal.length > 1 ? 'n' : ''} en el circuito de alumbrado (C1 10 A)` : 'Las bombillas están en el circuito de alumbrado (C1)', 'alumbrado');
  for (const e of m.parts.filter(esEnchufe)) {
    const cL = R.clase(k(e.id, 'L')), cN = R.clase(k(e.id, 'N')); const cs = R.circ(k(e.id, 'L')); const enTomas = ['C2', 'C4', 'C5'].some((c) => cs.has(c));
    add(cL.has('fase') && cN.has('neutro') && enTomas, cL.has('fase') && cN.has('neutro') ? (enTomas ? `${e.nombre} en el circuito de enchufes (${[...cs].join(', ')} 16 A)` : `${e.nombre} no va en el C2 (16 A)`) : `${e.nombre} sin fase y neutro bien conectados`, 'enchufe');
    add(R.clase(k(e.id, 'PE')).has('tierra'), R.clase(k(e.id, 'PE')).has('tierra') ? `${e.nombre} con toma de tierra` : `${e.nombre} SIN toma de tierra: si un aparato tiene una fuga, su carcasa queda con tensión`, 'tierra');
  }
  // canalización
  const fuera = m.cables.filter((c) => !rutaCable(m, c).enTubo);
  add(!fuera.length, fuera.length ? `${fuera.length} cable${fuera.length > 1 ? 's' : ''} sin tubo: cada cable va por un tubo entre dos piezas vecinas (empalma en las cajas)` : 'Todos los cables van por tubo corrugado', 'tubo', { cables: fuera.map((c) => c.id) });
  const finos = m.tubos.map((t) => ({ t, min: tuboMinimo(cablesDelTubo(m, t).map((c) => c.sec)) })).filter((x) => (x.t.d || 16) < x.min);
  if (m.tubos.length) add(!finos.length, finos.length ? `Diámetro del tubo (ITC-BT-21, tabla 5): ${lista(finos.map((x) => `${nombreTubo(m, x.t)} es de Ø${x.t.d || 16} y necesita Ø${x.min} mm o más`))}` : 'Diámetros de tubo correctos para los cables que llevan (ITC-BT-21)', 'tuboDiam', { tubos: finos.map((x) => x.t.id) });
  if (realista && m.tubos.length) {
    const sinCortar = m.tubos.filter((t) => !t.med || t.cort !== 'ok');
    add(!sinCortar.length, sinCortar.length ? `Tubo: ${lista(sinCortar.map((t) => `${nombreTubo(m, t)} ${!t.med && !t.cort ? 'sin medir ni cortar' : !t.cort ? 'sin cortar' : t.cort === 'corto' ? 'cortado a ojo: se queda corto y no entra en la caja' : 'cortado sin medir'}`))}` : 'Tubos medidos con el flexómetro y cortados a medida', 'tuboCorte', { tubos: sinCortar.map((t) => t.id) });
    const malGrapa = m.tubos.filter((t) => huecoGrapas(m, t) > GRAPA_MAX || (largoTubo(m, t) > 30 && !(t.grapas || []).length));
    add(!malGrapa.length, malGrapa.length ? `Grapas: ${lista(malGrapa.map((t) => `${nombreTubo(m, t)} tiene ${Math.round(huecoGrapas(m, t))} cm sin sujetar`))} (máximo ${GRAPA_MAX} cm entre grapas)` : `Tubos sujetos con grapas cada ${GRAPA_MAX} cm o menos`, 'grapas', { tubos: malGrapa.map((t) => t.id) });
  }
  if (realista && m.cables.length) {
    const P = puntas(m); const mal = (set) => m.cables.flatMap((c) => ['a', 'b'].filter((l) => set.includes(P.get(c.id)[l])).map((l) => ({ c, l, s: P.get(c.id)[l] })));
    const pel = mal(['sinPelar', 'corto', 'largo']); const apr = mal(['flojo', 'pasado']); const fic = mal(['sinFicha', 'llena', 'seccion']);
    add(!pel.length, pel.length ? `Pelado: ${pel.length} punta${pel.length > 1 ? 's' : ''} mal pelada${pel.length > 1 ? 's' : ''} (${lista(pel.map((x) => `${nombreBorne(m, x.c[x.l])}: ${TXT_PUNTA[x.s]}`), 2)})` : 'Puntas peladas a la medida de cada borne', 'pelado', { cables: pel.map((x) => x.c.id) });
    add(!apr.length, apr.length ? `Apriete: ${lista(apr.map((x) => `${nombreBorne(m, x.c[x.l])}: ${TXT_PUNTA[x.s]}`), 2)}` : 'Bornes de tornillo apretados con la punta correcta', 'apriete', { cables: apr.map((x) => x.c.id) });
    add(!fic.length, fic.length ? `Fichas de empalme: ${lista(fic.map((x) => `${nombreBorne(m, x.c[x.l])}: ${TXT_PUNTA[x.s]}`), 2)}` : 'Empalmes con fichas del número de vías y la sección correctos', 'fichas', { cables: fic.map((x) => x.c.id) });
  }
  if (realista) { const sueltas = m.parts.filter((p) => !TIPOS[p.type].modulo && p.type !== 'manguera' && !p.fijado); if (sueltas.length) add(false, `Sin atornillar al tablero: ${lista(sueltas.map((p) => p.nombre), 4)} (usa el taladro-atornillador)`, 'fijacion'); }
  return { ok: it.every((x) => x.ok), items: it };
}
export function nombreTubo(m, t) { const n = (id) => partePorId(m, id)?.nombre || id; return `el tubo ${n(t.a)}–${n(t.b)}`; }

// ---------------------------------------------------------------- autocomprobación del tablero de la SA1
export function comprobarTablero(m) {
  const items = []; const add = (ok, t) => items.push({ ok: !!ok, t });
  const n = (t) => m.parts.filter((p) => p.type === t).length;
  const porNombre = (nm) => m.parts.find((p) => p.nombre === nm);
  const c1 = m.parts.filter((p) => esMT(p) && circuitoDe(p) === 'C1').length, c2 = m.parts.filter((p) => esMT(p) && circuitoDe(p) === 'C2').length;
  add(n('cuadro') === 1 && n('id') === 1 && c1 === 1 && c2 === 1 && n('manguera') === 1, 'Cuadro con ID 30 mA + C1 10 A + C2 16 A y manguera con clavija');
  add(n('bombilla') === 3 && n('interruptor') === 2 && n('caja') === 2 && n('enchufe') === 1, `3 bombillas, 2 interruptores, 2 cajas de empalme y 1 enchufe (tienes ${n('bombilla')}, ${n('interruptor')}, ${n('caja')} y ${n('enchufe')})`);
  const id = (r) => (r === 'Q' ? m.parts.find((p) => p.type === 'cuadro')?.id : porNombre(REFERENCIA[r].nombre)?.id);
  const faltan = TUBOS_REF.filter(([a, b]) => !(id(a) && id(b) && tuboEntre(m, id(a), id(b))));
  const nom = (r) => (r === 'Q' ? 'cuadro' : REFERENCIA[r].nombre);
  add(!faltan.length, faltan.length ? `Tubos: faltan ${faltan.map(([a, b]) => nom(a) + '–' + nom(b)).join(', ')}` : 'Tubo corrugado como en el plano: cuadro–CE1–CE2, de cada caja a sus bombillas e interruptor, y cuadro–enchufe');
  const sobran = m.tubos.length - (TUBOS_REF.length - faltan.length);
  if (sobran > 0) add(false, `Hay ${sobran} tubo${sobran > 1 ? 's' : ''} que no están en el plano`);
  // funcionamiento: B1 = I1 ; B2 = B3 = I2
  const I1 = porNombre('Interruptor 1'), I2 = porNombre('Interruptor 2');
  let func = !!(I1 && I2 && porNombre('Bombilla 1') && porNombre('Bombilla 2') && porNombre('Bombilla 3'));
  const fallos = [];
  if (func) for (const [s1, s2] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
    const x = clone(m); x.parts.forEach((p) => { if (p.id === I1.id) p.on = !!s1; if (p.id === I2.id) p.on = !!s2; if (TIPOS[p.type].modulo) p.on = true; if (esEnchufe(p)) p.carga = 'nada'; });
    const s = simular(x, { enchufada: true }); const luz = (nm) => s.bombillas.find((b) => b.nombre === nm)?.encendida;
    if (luz('Bombilla 1') !== !!s1 || luz('Bombilla 2') !== !!s2 || luz('Bombilla 3') !== !!s2) { func = false; fallos.push(`I1 ${s1 ? 'ON' : 'OFF'} · I2 ${s2 ? 'ON' : 'OFF'}`); }
  }
  add(func, func ? 'Funciona: el interruptor 1 enciende la bombilla 1 y el interruptor 2 las bombillas 2 y 3' : `No funciona como en el plano${fallos.length ? ' (falla con ' + fallos.join(' / ') + ')' : ''}`);
  const ce1 = porNombre('CE1'), ce2 = porNombre('CE2');
  const llega = (pz, ce) => pz && ce && m.cables.some((c) => (c.a.p === pz.id && c.b.p === ce.id) || (c.b.p === pz.id && c.a.p === ce.id));
  add(llega(porNombre('Bombilla 1'), ce1) && llega(I1, ce1) && llega(porNombre('Bombilla 2'), ce2) && llega(porNombre('Bombilla 3'), ce2) && llega(I2, ce2), 'CE1 alimenta la bombilla 1 y el interruptor 1; CE2 las bombillas 2 y 3 y el interruptor 2');
  const x = clone(m); x.parts.forEach((p) => { if (TIPOS[p.type].modulo) p.on = true; if (esEnchufe(p)) p.carga = 'nada'; });
  const s = simular(x, { enchufada: true });
  const e = s.enchufes[0];
  add(e && e.v > 200, e ? `Enchufe con ${Math.round(e.v)} V` : 'Falta el enchufe');
  const t = simular(x, { enchufada: true, test: true });
  add(t.disparos.some((d) => d.por === 'test' || d.por === 'fuga'), 'El botón de prueba (T) hace saltar el diferencial');
  const normas = comprobar(m);
  return { ok: items.every((i) => i.ok) && normas.ok, items: [...items, ...normas.items], normas };
}
void dims;
