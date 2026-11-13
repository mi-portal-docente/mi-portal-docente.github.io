// Fase 13 · «Hoja de cálculo»: el alumno trabaja en una hoja del portal (fórmulas en castellano, gráficos y tabla
// dinámica) y la entrega como un trabajo (borrador, versiones, comentarios, corrección). Retos opcionales que se
// comprueban solos con condiciones por celda. contenido:
// { filas: 30, columnas: 10, celdas: { "A1": "Producto", "B2": "=SUMA(…)" }, retos: [{ texto, comprobar: [{ celda, valor?, tolerancia?, formula? }] }] }
import { registrarMotor } from '../elemento.js';
import { parteCelda, MAX_FILAS, MAX_COLS, NOMBRES_FUNCIONES } from '../hoja.js';

export function validarHoja(c, err) {
  const ent = (v, d, min, max, k) => { if (v == null || v === '') return d; const n = Number(v); if (!Number.isInteger(n) || n < min || n > max) { err(k, `«${k}» tiene que ser un número entero de ${min} a ${max}.`); return d; } return n; };
  const o = { filas: ent(c.filas, 30, 5, MAX_FILAS, 'filas'), columnas: ent(c.columnas, 10, 2, MAX_COLS, 'columnas'), celdas: {}, retos: [] };
  const C = c.celdas ?? {};
  if (typeof C !== 'object' || Array.isArray(C)) err('celdas', '«celdas» tiene que ser un objeto: { "A1": "texto", "B3": "=SUMA(B1:B2)" }.');
  else for (const [k, v] of Object.entries(C).slice(0, 2000)) {
    const p = parteCelda(k); if (!p || p.f >= o.filas || p.c >= o.columnas) { err('celdas', `Celda «${k}» fuera de la hoja (${o.columnas} columnas × ${o.filas} filas).`); continue; }
    if (v == null || v === '') continue; if (typeof v !== 'string' && typeof v !== 'number') { err('celdas', `La celda ${k} tiene que ser un texto o un número.`); continue; }
    o.celdas[k.toUpperCase().replace(/\$/g, '')] = String(v).slice(0, 500);
  }
  const R = c.retos ?? [];
  if (!Array.isArray(R) || R.length > 20) { err('retos', '«retos» tiene que ser una lista (máx. 20).'); return o; }
  R.forEach((r, i) => {
    if (!r || typeof r.texto !== 'string' || !r.texto.trim()) { err(`retos[${i}].texto`, `Reto ${i + 1}: falta «texto».`); return; }
    const K = Array.isArray(r.comprobar) ? r.comprobar : [];
    if (!K.length || K.length > 10) { err(`retos[${i}].comprobar`, `Reto ${i + 1}: «comprobar» tiene que ser una lista (1–10) de condiciones: [{ "celda": "B6", "valor": 150 }, { "celda": "B6", "formula": "SUMA" }].`); return; }
    const comprobar = [];
    for (const k of K) {
      if (!k || !parteCelda(k.celda)) { err(`retos[${i}].comprobar`, `Reto ${i + 1}: cada condición necesita una «celda» válida (A1…Z${MAX_FILAS}).`); return; }
      if (k.formula != null && !NOMBRES_FUNCIONES.includes(String(k.formula).toUpperCase())) { err(`retos[${i}].comprobar`, `Reto ${i + 1}: «formula» tiene que ser una de: ${NOMBRES_FUNCIONES.join(', ')}.`); return; }
      if (k.valor == null && k.formula == null) { err(`retos[${i}].comprobar`, `Reto ${i + 1}: pon «valor» y/o «formula» en cada condición.`); return; }
      comprobar.push({ celda: String(k.celda).toUpperCase().replace(/\$/g, ''), ...(k.valor != null ? { valor: typeof k.valor === 'number' ? k.valor : String(k.valor).slice(0, 200) } : {}), ...(k.tolerancia != null ? { tolerancia: Math.abs(Number(k.tolerancia)) || 0 } : {}), ...(k.formula != null ? { formula: String(k.formula).toUpperCase() } : {}) });
    }
    o.retos.push({ texto: r.texto.trim().slice(0, 500), comprobar });
  });
  return o;
}
registrarMotor('hoja', {
  nombre: 'Hoja de cálculo', validar: validarHoja, entregable: true, hoja: true,
  resumen: (c) => `hoja de ${c.columnas || 10} × ${c.filas || 30}${c.retos?.length ? ` · ${c.retos.length} reto(s)` : ''}`,
  ejemplo: {
    filas: 20, columnas: 6,
    celdas: { A1: 'Aparato', B1: 'Potencia (W)', C1: 'Horas al día', D1: 'Energía (Wh)', A2: 'Nevera', B2: '150', C2: '24', A3: 'Televisor', B3: '100', C3: '4', A4: 'Lavadora', B4: '2000', C4: '1', A6: 'Total' },
    retos: [
      { texto: 'En D2:D4 calcula la energía de cada aparato (potencia × horas).', comprobar: [{ celda: 'D2', valor: 3600 }, { celda: 'D3', valor: 400 }, { celda: 'D4', valor: 2000 }] },
      { texto: 'En D6 suma la energía total con la función SUMA.', comprobar: [{ celda: 'D6', valor: 6000, formula: 'SUMA' }] },
      { texto: 'En E2 escribe «Mucho» si D2 pasa de 1000 Wh y si no «Poco» (función SI).', comprobar: [{ celda: 'E2', valor: 'Mucho', formula: 'SI' }] },
    ],
  },
});
