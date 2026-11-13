// Laboratorios de TIC I y TIC II: Representación de la información, Ciberseguridad, Editor web en vivo y
// Retos por bloques. Cada uno con 1–2 ejemplos mínimos; el profesorado añade los suyos importando JSON.
import { registrarLab } from './pagina.js';
import { motor } from '../lms/elemento.js';
import '../lms/motores/index.js';
import { montarInfo } from './info-ui.js';
import { montarCiber } from './ciber-ui.js';
import { montarWeb } from './web-ui.js';
import { montarBloques } from './bloques-ui.js';

const ej = (tipo, c) => motor(tipo).validar(c || motor(tipo).ejemplo, () => {});
const INFO = ej('info');
const CIBER = ej('ciber');
const WEB = ej('web', { retos: [...motor('web').ejemplo.retos, { id: 'lista', titulo: 'Una lista', enunciado: 'Haz una lista sin numerar (<ul>) con al menos 3 elementos.', html: '', css: '', pistas: ['Cada elemento va en <li>…</li> dentro de <ul>…</ul>.'], comprobaciones: [{ tipo: 'selector', selector: 'ul li', min: 3 }] }] });
const BLOQ = ej('bloques', { niveles: [...motor('bloques').ejemplo.niveles,
  { id: 'esquina', titulo: 'Doblar la esquina', enunciado: 'Llega a la meta usando «repetir» (máximo 5 bloques).', mapa: ['######', '#S...#', '####.#', '####G#', '######'], bloques: ['avanzar', 'girar', 'repetir'], maxBloques: 5 }] });
const clave = (k, ctx) => `${k}${ctx.tarea ? ':' + ctx.tarea : ''}`;

for (const asig of ['tic1', 'tic2']) {
  registrarLab({ asig, id: 'info', titulo: 'Representación de la información', lucide: 'binary',
    intro: 'Conversor entre decimal, binario, hexadecimal y ASCII, y preguntas de conversión y de tamaño de archivos que se corrigen solas.',
    libre: 'Solo el conversor, para practicar.', retos: [{ id: 'practica', titulo: 'Conversiones y tamaños', desc: 'Preguntas de ejemplo: un número a binario y el tamaño de una imagen.' }],
    abrir: (nodo, reto, ctx) => montarInfo(nodo, reto ? INFO : null, { ...ctx, clave: clave(`info:${asig}:${reto?.id || 'libre'}`, ctx) }) });
  registrarLab({ asig, id: 'ciber', titulo: 'Ciberseguridad', lucide: 'shield-check',
    intro: 'Detecta correos de phishing, mide la fuerza de una contraseña (no se guarda ni se envía) y revisa los riesgos de la red de una pyme.',
    retos: [{ id: 'correos', titulo: 'Bandeja de entrada', desc: '¿Phishing o fiable? Decide con cada correo.' }, { id: 'contrasena', titulo: 'Medidor de contraseñas', desc: 'Consigue una contraseña de nivel «fuerte».' }, { id: 'red', titulo: 'Red de una pyme', desc: 'Revisa los equipos con riesgo y elige la medida.' }],
    abrir: (nodo, reto, ctx) => montarCiber(nodo, reto.id === 'correos' ? { correos: CIBER.correos } : reto.id === 'contrasena' ? { contrasena: CIBER.contrasena } : { red: CIBER.red }, { ...ctx, clave: clave(`ciber:${asig}:${reto.id}`, ctx) }) });
  registrarLab({ asig, id: 'web', titulo: 'Editor web en vivo', lucide: 'globe',
    intro: 'Escribe HTML y CSS y mira el resultado al momento en una vista previa aislada. Los retos se comprueban solos.',
    libre: 'HTML y CSS con vista previa, sin comprobaciones.', retos: WEB.retos.map((r) => ({ id: r.id, titulo: r.titulo, desc: r.enunciado })),
    abrir: (nodo, reto, ctx) => montarWeb(nodo, reto ? [WEB.retos.find((r) => r.id === reto.id)] : [], { ...ctx, clave: clave(`web:${asig}:${reto?.id || 'libre'}`, ctx) }) });
  registrarLab({ asig, id: 'bloques', titulo: 'Retos por bloques', lucide: 'blocks',
    intro: 'Programa al robot con bloques para que llegue a la meta. Cada nivel añade bloques nuevos.',
    retos: [{ id: 'niveles', titulo: 'Niveles de ejemplo', desc: 'Dos niveles: en línea recta y doblar la esquina con «repetir».' }],
    abrir: (nodo, reto, ctx) => montarBloques(nodo, BLOQ, { ...ctx, clave: clave(`bloques:${asig}`, ctx) }) });
}
