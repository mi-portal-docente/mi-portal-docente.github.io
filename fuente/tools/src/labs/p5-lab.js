// Laboratorio p5.js de Creación Digital y Pensamiento Computacional (cdpc1).
import { registrarLab } from './pagina.js';
import { montarP5 } from './p5-ui.js';
import { validarP5 } from '../lms/motores/p5.js';

// Retos de ejemplo (mínimos; el profesorado añade los suyos importando JSON en Trabajo de clase)
const EJEMPLOS = validarP5({ retos: [
  { id: 'circulo', titulo: 'Un círculo', enunciado: 'Dibuja un círculo en el centro del lienzo (200 × 200).',
    codigo: 'function setup() {\n  createCanvas(200, 200);\n}\n\nfunction draw() {\n  background(220);\n  // dibuja aquí\n}\n',
    pistas: ['La función circle(x, y, d) dibuja un círculo con centro (x, y) y diámetro d.', 'El centro de un lienzo de 200 × 200 es (100, 100).'],
    comprobaciones: [{ tipo: 'codigo', regex: 'circle\\s*\\(|ellipse\\s*\\(', mensaje: 'Usas circle() o ellipse()' }, { tipo: 'pixel', x: 100, y: 100, distinto: '#dcdcdc', mensaje: 'Hay algo dibujado en el centro del lienzo' }] },
  { id: 'variable', titulo: 'Una variable', enunciado: 'Crea la variable «tam» con el valor 80 y úsala como diámetro del círculo.',
    codigo: 'let tam = 20;\n\nfunction setup() {\n  createCanvas(200, 200);\n}\n\nfunction draw() {\n  background(220);\n  circle(100, 100, tam);\n}\n',
    pistas: ['Cambia el número que se guarda en «tam» en la primera línea.'],
    comprobaciones: [{ tipo: 'variable', nombre: 'tam', igual: 80, mensaje: 'La variable «tam» vale 80' }, { tipo: 'pixel', x: 135, y: 100, distinto: '#dcdcdc', mensaje: 'El círculo llega hasta x = 135' }] },
] }, () => {}).retos;

export const LAB_P5 = registrarLab({
  asig: 'cdpc1', id: 'p5', titulo: 'Laboratorio p5.js', lucide: 'palette',
  intro: 'Programa dibujos y animaciones con p5.js: escribe el código, ejecútalo en el lienzo y comprueba el reto. Los errores salen explicados en la consola.',
  libre: 'Un lienzo en blanco para experimentar sin comprobaciones.',
  retos: EJEMPLOS.map((r) => ({ id: r.id, titulo: r.titulo, desc: r.enunciado })),
  abrir: (nodo, reto, ctx) => montarP5(nodo, reto ? [EJEMPLOS.find((r) => r.id === reto.id)] : [], { ...ctx, clave: `p5lab:${reto ? reto.id : 'libre'}` }),
});
export { EJEMPLOS as RETOS_P5 };
