// Solucionador de circuitos por análisis nodal (fuentes en forma Norton, sin filas extra).
// Elementos: R (a,b,r) · V (a=+, b=−, v, rint) · I (inyecta i en a, la saca de b) · D (a=ánodo, b=cátodo, vf, ron) por tramos · C (a,b,c) Euler implícito.
export const GMIN = 1e-9, GOFF = 1e-9;

function gauss(A, b, n) {
  for (let c = 0; c < n; c++) {
    let p = c, mx = Math.abs(A[c * n + c]);
    for (let r = c + 1; r < n; r++) { const v = Math.abs(A[r * n + c]); if (v > mx) { mx = v; p = r; } }
    if (mx < 1e-30) continue;
    if (p !== c) { for (let k = 0; k < n; k++) { const t = A[c * n + k]; A[c * n + k] = A[p * n + k]; A[p * n + k] = t; } const t = b[c]; b[c] = b[p]; b[p] = t; }
    const d = A[c * n + c];
    for (let r = c + 1; r < n; r++) {
      const f = A[r * n + c] / d; if (f === 0) continue;
      for (let k = c; k < n; k++) A[r * n + k] -= f * A[c * n + k];
      b[r] -= f * b[c];
    }
  }
  const x = new Float64Array(n);
  for (let r = n - 1; r >= 0; r--) { let s = b[r]; for (let k = r + 1; k < n; k++) s -= A[r * n + k] * x[k]; const d = A[r * n + r]; x[r] = Math.abs(d) < 1e-30 ? 0 : s / d; }
  return x;
}

function assemble(n, els, don, dt, capV) {
  const A = new Float64Array(n * n), b = new Float64Array(n);
  const G = (a, c, g) => { A[a * n + a] += g; A[c * n + c] += g; A[a * n + c] -= g; A[c * n + a] -= g; };
  const J = (a, c, i) => { b[a] += i; b[c] -= i; }; // inyecta i en a y la saca de c
  for (let i = 0; i < n; i++) A[i * n + i] += GMIN;
  for (const e of els) {
    if (e.a === e.b) continue;
    switch (e.k) {
      case 'R': G(e.a, e.b, 1 / e.r); break;
      case 'V': G(e.a, e.b, 1 / e.rint); J(e.a, e.b, e.v / e.rint); break;
      case 'I': J(e.a, e.b, e.i); break;
      case 'D': if (don[e.id]) { G(e.a, e.b, 1 / e.ron); J(e.a, e.b, e.vf / e.ron); } else G(e.a, e.b, GOFF); break;
      case 'C': if (isFinite(dt)) { const g = e.c / dt; G(e.a, e.b, g); J(e.a, e.b, g * (capV[e.id] || 0)); } break;
    }
  }
  return gauss(A, b, n);
}

export function solve(n, els, opt = {}) {
  const dt = opt.dt ?? Infinity, capV = opt.capV || {};
  const don = opt.don || {};
  const diodes = els.filter(e => e.k === 'D' && e.a !== e.b);
  let V = new Float64Array(n), converged = false, it;
  if (n === 0) return { V, I: {}, don, converged: true };
  for (it = 0; it < 60; it++) {
    V = assemble(n, els, don, dt, capV);
    let worst = null, wv = 0; const viol = [];
    for (const d of diodes) {
      const v = V[d.a] - V[d.b];
      if (don[d.id]) { const i = (v - d.vf) / d.ron; if (i < -1e-9) { viol.push(d); if (-i * d.ron > wv) { wv = -i * d.ron; worst = d; } } }
      else if (v > d.vf + 1e-9) { viol.push(d); if (v - d.vf > wv) { wv = v - d.vf; worst = d; } }
    }
    if (!viol.length) { converged = true; break; }
    if (it < 25) for (const d of viol) don[d.id] = !don[d.id];
    else don[worst.id] = !don[worst.id];
  }
  const I = {};
  for (const e of els) {
    const v = e.a === e.b ? 0 : V[e.a] - V[e.b];
    switch (e.k) {
      case 'R': I[e.id] = v / e.r; break;
      case 'V': I[e.id] = e.a === e.b ? Infinity : (e.v - v) / e.rint; break;
      case 'I': I[e.id] = e.i; break;
      case 'D': I[e.id] = don[e.id] ? (v - e.vf) / e.ron : v * GOFF; break;
      case 'C': I[e.id] = isFinite(dt) ? e.c / dt * (v - (capV[e.id] || 0)) : 0; break;
    }
  }
  return { V, I, don, converged };
}
