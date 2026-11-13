// Resultado de una actividad de clase: texto de la entrega y su lectura en el cuaderno (sin three.js:
// lo usa también el panel del profesor).
export const nota10 = (a, t) => (t ? Math.round((a / t) * 100) / 10 : 0);
// Texto que se guarda como entrega (el cuaderno lo lee para poner la nota sugerida).
export function textoResultado(def, aciertos, total, detalle = []) {
  return `🧩 Actividad «${def.titulo}» · Aciertos: ${aciertos}/${total} · Nota: ${String(nota10(aciertos, total)).replace('.', ',')}\n\n${detalle.map((d) => `${d.ok ? '✔' : '✖'} ${d.q}`).join('\n')}`.slice(0, 9000);
}
// Lee «Aciertos: a/t» de una entrega de actividad → { aciertos, total, nota } o null
export function leerResultado(texto) {
  const m = String(texto || '').match(/Aciertos: (\d+(?:[.,]\d+)?)\/(\d+(?:[.,]\d+)?)/); if (!m) return null;
  const a = +m[1].replace(',', '.'), t = +m[2].replace(',', '.'); if (!(t > 0) || a > t) return null; return { aciertos: a, total: t, nota: nota10(a, t) };
}
