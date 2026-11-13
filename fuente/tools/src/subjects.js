// Asignaturas de la plataforma. Para añadir una nueva, añade un objeto a este array
// (id = hash de la URL, active:false la muestra como "Próximamente").
export const CENTRO = { ciclo: 'CFGB Informática y Comunicaciones' };
export const SUBJECTS = [
  {
    id: 'eee', codigo: '3015', nombre: 'Equipos eléctricos y electrónicos',
    profesor: 'Pablo Mateos Lema', icon: '⚡', active: true,
    desc: 'Dos apartados: proyectos paso a paso en 3D con la placa ESP32 Plus y un laboratorio de circuitos 3D para montar, simular y medir en la protoboard.',
  },
];
// Apartados de cada asignatura. Para añadir uno nuevo, añade un objeto a la lista
// (id = parte final de la URL: #eee/<id>; active:false lo muestra como "Próximamente").
export const APARTADOS = {
  eee: [
    {
      id: 'esp32', foto: 'img/fotos/esp32.webp', nombre: 'ESP32', icon: '🤖', color: '#DC001B', active: true,
      desc: '8 proyectos paso a paso en 3D con la placa ESP32 Plus y el kit de sensores: semáforo, timbre, farola, termómetro, aparcamiento, barrera, riego y ventilador.',
      tags: ['8 proyectos', 'Programación Arduino', 'Sensores y actuadores'],
    },
    {
      id: 'circuitos', foto: 'img/fotos/circuitos.webp', nombre: 'Circuitos', icon: '🔌', color: '#0f5e66', active: true,
      desc: 'Laboratorio 3D para montar circuitos en la protoboard, simularlos y medir con el polímetro: pilas, resistencias, LED, bombillas, interruptores, motores…',
      tags: ['9 prácticas guiadas', 'Modo libre', 'Polímetro V · A · Ω'],
    },
    {
      id: 'vivienda', foto: 'img/fotos/vivienda.webp', nombre: 'Instalación de vivienda', icon: '🏠', color: '#8a5a2b', active: true,
      desc: 'Laboratorio 3D de instalación eléctrica doméstica en un tablero de madera: cuadro con diferencial y magnetotérmicos, bombillas, interruptores, enchufe con tierra, cajas de empalme, tubo corrugado y cables por colores.',
      tags: ['Ejercicio guiado: el tablero de la SA1', 'Modo libre', 'Averías y lista de materiales'],
    },
  ],
  tic1: [
    { id: 'anatomia', nombre: 'Anatomía del PC', lucide: 'cpu', color: '#1f6feb', active: true, enlace: '#asig/tic1/actividades/anatomia-pc', desc: 'Juego 3D: reconoce las piezas de un ordenador y para qué sirve cada una.', tags: ['3D', 'Hardware'] },
    { id: 'info', nombre: 'Representación de la información', lucide: 'binary', color: '#1f6feb', active: true, desc: 'Conversor decimal, binario, hexadecimal y ASCII, y retos de tamaño de archivos.', tags: ['Conversor', 'Se corrige solo'] },
    { id: 'ciber', nombre: 'Ciberseguridad', lucide: 'shield-check', color: '#b42318', active: true, desc: 'Bandeja de phishing, medidor de contraseñas y la red de una pyme con sus riesgos.', tags: ['Phishing', 'Contraseñas', 'Red'] },
    { id: 'web', nombre: 'Editor web en vivo', lucide: 'globe', color: '#0f766e', active: true, desc: 'HTML y CSS con vista previa aislada y retos comprobados.', tags: ['HTML', 'CSS', 'Modo libre'] },
    { id: 'bloques', nombre: 'Retos por bloques', lucide: 'blocks', color: '#7a4cc2', active: true, desc: 'Programa al robot con bloques (Blockly) por niveles.', tags: ['Blockly', 'Por niveles'] },
  ],
  tic2: [
    { id: 'info', nombre: 'Representación de la información', lucide: 'binary', color: '#1f6feb', active: true, desc: 'Conversor decimal, binario, hexadecimal y ASCII, y retos de tamaño de archivos.', tags: ['Conversor', 'Se corrige solo'] },
    { id: 'ciber', nombre: 'Ciberseguridad', lucide: 'shield-check', color: '#b42318', active: true, desc: 'Bandeja de phishing, medidor de contraseñas y la red de una pyme con sus riesgos.', tags: ['Phishing', 'Contraseñas', 'Red'] },
    { id: 'web', nombre: 'Editor web en vivo', lucide: 'globe', color: '#0f766e', active: true, desc: 'HTML y CSS con vista previa aislada y retos comprobados.', tags: ['HTML', 'CSS', 'Modo libre'] },
    { id: 'bloques', nombre: 'Retos por bloques', lucide: 'blocks', color: '#7a4cc2', active: true, desc: 'Programa al robot con bloques (Blockly) por niveles.', tags: ['Blockly', 'Por niveles'] },
  ],
  cdpc1: [
    {
      id: 'p5', nombre: 'Laboratorio p5.js', lucide: 'palette', color: '#6b3fa0', active: true,
      desc: 'Programa dibujos y animaciones con p5.js: editor de código, lienzo aislado, consola con los errores explicados en castellano y retos que se comprueban solos.',
      tags: ['Retos con comprobación', 'Modo libre', 'Se entrega como tarea'],
    },
  ],
};
