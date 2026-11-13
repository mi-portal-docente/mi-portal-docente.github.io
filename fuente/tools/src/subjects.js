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
  cdpc1: [
    {
      id: 'p5', nombre: 'Laboratorio p5.js', lucide: 'palette', color: '#6b3fa0', active: true,
      desc: 'Programa dibujos y animaciones con p5.js: editor de código, lienzo aislado, consola con los errores explicados en castellano y retos que se comprueban solos.',
      tags: ['Retos con comprobación', 'Modo libre', 'Se entrega como tarea'],
    },
  ],
};
