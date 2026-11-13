// Plantilla de rúbrica de 5 criterios ponderados (fase 8). Uno de ellos es de AUTORÍA: el alumno
// tiene que poder explicar y defender con sus palabras lo que entrega. Los pesos suman 100.
// Es genérica (no es contenido curricular): el profesor cambia los textos y los pesos a su gusto.
export const RUBRICA_PLANTILLA = [
  { id: 'contenido', c: 'Contenido: correcto y completo', peso: 30 },
  { id: 'proceso', c: 'Proceso: planificación y trabajo continuado', peso: 20 },
  { id: 'comunicacion', c: 'Comunicación: presentación clara y ordenada', peso: 20 },
  { id: 'herramientas', c: 'Herramientas y fuentes: uso adecuado y fuentes citadas', peso: 15 },
  { id: 'autoria', c: 'Autoría: lo explica y lo defiende con sus palabras', peso: 15, autoria: true },
];
// Texto para el campo «Rúbrica» del editor («Criterio | puntos», sobre 10)
export const rubricaPlantillaTexto = () => RUBRICA_PLANTILLA.map((r) => `${r.c} | ${String(r.peso / 10).replace('.', ',')}`).join('\n');
// Escala de 1 a 4 de la autoevaluación y la coevaluación
export const NIVELES_RUBRICA = [[1, 'Insuficiente'], [2, 'Suficiente'], [3, 'Bien'], [4, 'Excelente']];
// Nota sobre 10 de una evaluación { criterio: 1..4 } con pesos; null si no hay ningún criterio puntuado
export function notaPonderada(criterios, puntos) {
  let s = 0, w = 0;
  for (const c of criterios) { const p = Number(puntos?.[c.id]); if (p >= 1 && p <= 4) { s += c.peso * (p / 4); w += c.peso; } }
  return w ? Math.round((s / w) * 100) / 10 : null;
}
