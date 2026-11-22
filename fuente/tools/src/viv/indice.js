// Índice ligero de las prácticas y de los niveles de evaluación de vivienda, para el panel del profesor (sin cargar el
// laboratorio). viv_eval_test comprueba que coincide con PRACTICAS (practicas.js) y EVALS_VIV (evaluacion.js).
export const VIV_PR = [
  { id: 'vp1', n: 1, title: 'El cuadro general: IGA, diferencial y PIAs' },
  { id: 'vp2', n: 2, title: 'Punto de luz con interruptor simple' },
  { id: 'vp3', n: 3, title: 'Conmutada: una luz desde dos sitios' },
  { id: 'vp4', n: 4, title: 'Toma de corriente schuko 16 A con tierra' },
  { id: 'vp5', n: 5, title: 'Caja de registro con empalmes' },
  { id: 'vp6', n: 6, title: 'Circuito completo desde el cuadro' },
  { id: 'vp7', n: 7, title: 'Cruzamiento: una luz desde tres sitios' },
];
export const VIV_EV = [
  { id: 've1', entrega: 'v7', nivel: 1, title: 'Puntos de luz' },
  { id: 've2', entrega: 'v8', nivel: 2, title: 'Schuko y caja de registro' },
  { id: 've3', entrega: 'v9', nivel: 3, title: 'Cuadro y avería' },
];
export const VIV_REGISTRO = 'v6';
// Progreso del registro (entrega v6): { vp1: { guiada, autonoma }, … }
export function progresoRegistro(e) { try { const j = JSON.parse(e?.datos?.montaje || 'null'); return (j && j.practicas) || {}; } catch (er) { return {}; } }
