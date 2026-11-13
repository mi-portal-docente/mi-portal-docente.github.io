// Motor «Explicación interactiva»: diapositivas con texto (e imagen), preguntas de control con respuesta
// inmediata, un laboratorio del portal incrustado y un resumen final. Se importa en JSON (ver FORMATO_IMPORTAR.md).
// Las preguntas de control NO puntúan como examen: sirven para comprobar que se sigue la explicación;
// al terminar, el alumno entrega «Aciertos: a/t» y el profesor puede ponerlo como nota (⚡ Poner notas).
import { registrarMotor } from '../elemento.js';
import { texto, lista, imagen, lab, video, esTexto, corto } from './comun.js';

export function validarControl(p, ruta, err) {
  if (p == null) return null;
  if (typeof p !== 'object' || Array.isArray(p)) { err(ruta, '«pregunta» tiene que ser un objeto { "tipo": "test" | "vf", … }.'); return null; }
  const tipo = p.tipo || (Array.isArray(p.opciones) ? 'test' : 'vf');
  const enunciado = texto(p.enunciado, ruta + '.enunciado', err, { max: 1000, obligatorio: true, nombre: 'enunciado' });
  const explicacion = texto(p.explicacion, ruta + '.explicacion', err, { max: 1000, nombre: 'explicacion' });
  if (tipo === 'test') {
    const op = lista(p.opciones, ruta + '.opciones', err, { min: 2, max: 6, nombre: 'opciones' }).map((o, i) => texto(o, `${ruta}.opciones[${i}]`, err, { max: 300, obligatorio: true, nombre: 'opción' }));
    const c = Number(p.correcta);
    if (!Number.isInteger(c) || c < 0 || c >= op.length) { err(ruta + '.correcta', '«correcta» tiene que ser el número de la opción correcta, empezando por 0.'); return null; }
    return { tipo, enunciado, opciones: op, correcta: c, explicacion };
  }
  if (tipo === 'vf') {
    if (typeof p.correcta !== 'boolean') { err(ruta + '.correcta', 'En verdadero/falso, «correcta» es true o false.'); return null; }
    return { tipo, enunciado, correcta: p.correcta, explicacion };
  }
  err(ruta + '.tipo', 'Las preguntas de control son de tipo "test" o "vf".'); return null;
}

export function validarExplicacion(c, err) {
  const D = lista(c.diapositivas, 'diapositivas', err, { min: 1, max: 40, nombre: 'diapositivas' }).map((d, i) => {
    const r = `diapositivas[${i}]`;
    if (!d || typeof d !== 'object' || Array.isArray(d)) { err(r, 'Cada diapositiva es un objeto { "titulo": …, "texto": … }.'); return null; }
    const o = { titulo: texto(d.titulo, r + '.titulo', err, { max: 150, obligatorio: true, nombre: 'titulo' }), texto: texto(d.texto, r + '.texto', err, { max: 5000, nombre: 'texto' }) };
    const im = imagen(d.imagen, r + '.imagen', err); if (im) { o.imagen = im; o.alt = corto(esTexto(d.alt) ? d.alt : '', 300); }
    const vd = video(d.video, r + '.video', err); if (vd) o.video = vd;
    const l = lab(d.lab, r + '.lab', err); if (l) o.lab = l;
    const p = validarControl(d.pregunta, r + '.pregunta', err); if (p) o.pregunta = p;
    if (!o.texto && !o.imagen && !o.video && !o.lab && !o.pregunta) err(r, 'La diapositiva está vacía: pon «texto», «imagen», «video», «lab» o «pregunta».');
    return o;
  }).filter(Boolean);
  const resumen = texto(c.resumen, 'resumen', err, { max: 5000, nombre: 'resumen' });
  return { diapositivas: D, resumen };
}

export const controles = (c) => (c?.diapositivas || []).filter((d) => d.pregunta).length;
export const aciertoControl = (p, r) => (p.tipo === 'test' ? Number(r) === p.correcta : typeof r === 'boolean' && r === p.correcta);

registrarMotor('explicacion', {
  nombre: 'Explicación interactiva',
  validar: validarExplicacion,
  resumen: (c) => `${c.diapositivas.length} diapositiva${c.diapositivas.length === 1 ? '' : 's'} · ${controles(c)} pregunta${controles(c) === 1 ? '' : 's'} de control${c.diapositivas.some((d) => d.lab) ? ' · con laboratorio' : ''}${c.resumen ? ' · resumen' : ''}`,
  entregable: true,
  ejemplo: {
    diapositivas: [
      { titulo: 'Qué vamos a ver', texto: 'Escribe aquí la explicación. **Negrita** y enlaces funcionan.' },
      { titulo: 'Comprueba', texto: 'Una pregunta de control:', pregunta: { tipo: 'vf', enunciado: 'Escribe aquí una afirmación.', correcta: true, explicacion: 'Por qué es verdadera.' } },
      { titulo: 'Pruébalo', texto: 'Haz la prueba en el laboratorio.', lab: '#eee/circuitos' }],
    resumen: 'Ideas clave para recordar.',
  },
});
