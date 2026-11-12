import c1 from '../../../codigo/P1_Semaforo/P1_Semaforo.ino';
import c2 from '../../../codigo/P2_Timbre/P2_Timbre.ino';
import c3 from '../../../codigo/P3_Farola/P3_Farola.ino';
import c4 from '../../../codigo/P4_Termometro/P4_Termometro.ino';
import c5 from '../../../codigo/P5_Aparcamiento/P5_Aparcamiento.ino';
import c6 from '../../../codigo/P6_Barrera/P6_Barrera.ino';
import c7 from '../../../codigo/P7_Riego/P7_Riego.ino';
import c8 from '../../../codigo/P8_Ventilador/P8_Ventilador.ino';

// Tres cables H-H de un módulo G-V-S a una columna G-V-S de la placa
const gvs = (part, col, sColor, prefix = 'D') => [
  { id: part + 'G', from: part + '.G', to: `${prefix}${col}.G`, color: 'negro' },
  { id: part + 'V', from: part + '.V', to: `${prefix}${col}.V`, color: 'rojo' },
  { id: part + 'S', from: part + '.S', to: `${prefix}${col}.S`, color: sColor },
];
const ids = (ws) => ws.map(w => w.id);
const i2c = (part, row, names = { G: 'GND', V: 'VCC', SDA: 'SDA', SCL: 'SCL' }) => [
  { id: part + 'G', from: `${part}.${names.G}`, to: `I${row}.G`, color: 'negro' },
  { id: part + 'V', from: `${part}.${names.V}`, to: `I${row}.V`, color: 'rojo' },
  { id: part + 'SDA', from: `${part}.${names.SDA}`, to: `I${row}.SDA`, color: 'azul' },
  { id: part + 'SCL', from: `${part}.${names.SCL}`, to: `I${row}.SCL`, color: 'blanco' },
];

const PREP = (sw, extra = []) => ({
  t: 'Prepara la placa', focus: 'switch',
  take: ['Placa ACEBOTT ESP32 Plus (SIN conectar el USB)', ...extra],
  do: [
    'Coloca la placa sobre la mesa con el conector USB (plateado) a tu IZQUIERDA y el conector azul con los números 18, 19, 23… arriba, lejos de ti. Así la verás igual que en el modelo 3D.',
    `Pon el interruptor de tensión en <b>${sw === '5V' ? '5V (palanca hacia ARRIBA, hacia el conector azul)' : '3.3V (palanca hacia ABAJO, hacia el texto «3.3V»)'}</b>.`,
    'Los números 18, 19, 23, 5, 13, 12 | 14, 27, 16, 17, 25, 26 están impresos junto al conector azul superior: cada número marca la <b>columna de 3 pines</b> (S, V, G) que tiene justo debajo.',
    'Localiza los bloques que vas a usar en esta práctica (mira la pestaña «Esquema»).',
  ],
  check: `La placa está desconectada y el interruptor marca <b>${sw === '5V' ? '5V' : '3.3V'}</b>.`,
});

const UPLOAD = (code, state, extra = {}) => ({
  t: 'Conecta el USB y sube el programa', usb: true, focus: 'usb', state, allLabels: true,
  take: ['Cable USB-A a USB-B', 'Ordenador con Arduino IDE preparado'],
  do: [
    '<b>Antes de conectar:</b> repasa todos los cables con la tabla de la pestaña «Esquema» (color, pin de origen y pin de destino). Pide al profesor que lo revise.',
    'Conecta el cable USB-B a la placa y al ordenador. Debe encenderse el LED <b>PWR</b> rojo.',
    `En Arduino IDE abre <b>${code}</b>, elige «ESP32 Dev Module» y el puerto, y pulsa <b>→ Subir</b>.`,
    'Abre el Monitor Serie a <b>115200 baudios</b>.',
    ...(extra.do || []),
  ],
  check: extra.check || 'El programa se ha subido («Hard resetting via RTS pin…») y el montaje funciona como se describe en la pestaña «Prueba».',
});

// ======================================================================
export const LESSONS = [];

// ---------------------------------------------------------------- P1
{
  const w = [...gvs('r', 18, 'amarillo'), ...gvs('a', 19, 'blanco'), ...gvs('v', 23, 'verde')];
  LESSONS.push({
    n: 1, slug: 'semaforo', title: 'Semáforo', level: 'Iniciación', duration: '2 sesiones (2 h)',
    icon: '🚦', short: 'Tres LEDs que se encienden por turnos como un semáforo.',
    intro: 'Tu primer montaje con la ESP32 Plus: conectarás tres módulos LED a tres salidas digitales y programarás la secuencia de un semáforo. Aprenderás a reconocer los conectores G-V-S de la placa y qué hace cada uno de sus tres pines.',
    switch: '3V3',
    objectives: ['Identificar las partes de la placa ESP32 Plus: USB, jack DC, interruptor 3.3V/5V y conectores G-V-S.', 'Conectar módulos de 3 pines (G, V, S) con cables Dupont hembra-hembra respetando el código de colores.', 'Programar salidas digitales con pinMode() y digitalWrite().', 'Comprobar con el polímetro la tensión de alimentación y de una salida.'],
    ra: { 1: ['a'], 2: ['a', 'b', 'c'], 3: ['c', 'd', 'e', 'i', 'j'] },
    materials: [['Placa ACEBOTT ESP32 Plus', 1], ['Módulo LED rojo', 1], ['Módulo LED azul (hará de luz ámbar)', 1], ['Módulo LED verde', 1], ['Cables Dupont hembra-hembra (H-H) 20 cm', 9, 'negro ×3, rojo ×3, amarillo, blanco, verde'], ['Cable USB-A a USB-B', 1]],
    libs: [], code: c1, file: 'P1_Semaforo/P1_Semaforo.ino',
    parts: {
      r: { type: 'led', color: 'rojo', pos: [-30, -64], label: 'LED rojo → GPIO 18' },
      a: { type: 'led', color: 'azul', pos: [0, -64], label: 'LED azul → GPIO 19' },
      v: { type: 'led', color: 'verde', pos: [30, -64], label: 'LED verde → GPIO 23' },
    },
    wires: w,
    steps: [
      PREP('3V3', ['Módulos LED rojo, azul y verde', '9 cables H-H']),
      { t: 'Conecta el LED rojo', add: ['r'], wires: ids(w.slice(0, 3)), take: ['Módulo LED rojo', '3 cables H-H: negro, rojo y amarillo'],
        do: ['Coloca el módulo arriba a la izquierda de la placa, con sus pines G-V-S mirando hacia la placa.'],
        check: 'Los 3 cables salen de la columna <b>18</b> y llegan a G, V y S del LED rojo, sin cruzarse entre sí. Cada conector está metido hasta el fondo.' },
      { t: 'Conecta el LED azul', add: ['a'], wires: ids(w.slice(3, 6)), take: ['Módulo LED azul', '3 cables H-H: negro, rojo y blanco'],
        do: ['Coloca el módulo en el centro, junto al rojo.'],
        check: 'Columna <b>19</b> (la que está justo a la derecha de la 18): G negro, V rojo, S blanco.' },
      { t: 'Conecta el LED verde', add: ['v'], wires: ids(w.slice(6, 9)), take: ['Módulo LED verde', '3 cables H-H: negro, rojo y verde'],
        do: ['Coloca el módulo a la derecha.'],
        check: 'Columna <b>23</b>: G negro, V rojo, S verde. En total hay 9 cables y ninguno toca a otro pin.' },
      UPLOAD('P1_Semaforo.ino', { glow: { v: true } }, { check: 'Al arrancar se encienden rojo, azul y verde 0,5 s cada uno (prueba). Después: verde 5 s → azul parpadeando 3 s → rojo 5 s, y vuelta a empezar.' }),
    ],
    expected: ['Al encender: prueba rápida de los tres LEDs (rojo, azul, verde, 0,5 s cada uno).', 'Ciclo continuo: VERDE 5 s → AZUL parpadeando 3 s (precaución) → ROJO 5 s.', 'En el Monitor Serie aparece la fase actual.'],
    serial: 'Prueba de LEDs: ROJO, AZUL, VERDE\nSemaforo en marcha\nVERDE  -> se puede pasar\nAZUL   -> precaucion (parpadeo)\nROJO   -> detenerse\nVERDE  -> se puede pasar',
    example: 'Ejemplo: si cambias <code>T_VERDE = 5000</code> por <code>T_VERDE = 8000</code>, el verde durará 8 segundos. Un ciclo completo dura 5 + 3 + 5 = 13 s; ¿cuántos ciclos hace en un minuto? (60 / 13 ≈ 4,6 ciclos).',
    multimeter: [['Tensión de alimentación', 'Polímetro en 20 V DC. Punta NEGRA en un pin G, punta ROJA en un pin V de cualquier columna.', '≈ 3,3 V (interruptor en 3.3V)'], ['Salida GPIO 23 (LED verde)', 'Punta negra en G, roja en S de la columna 23. Mide mientras el verde está encendido y cuando está apagado.', 'Encendido ≈ 3,3 V · Apagado ≈ 0 V'], ['Continuidad de un cable', 'ANTES de montar: polímetro en continuidad (pitido), una punta en cada extremo del cable Dupont.', 'Pita = cable bueno. No pita = cable roto, apártalo.']],
    trouble: [['Ningún LED se enciende y el LED PWR está apagado', 'USB mal conectado o cable solo de carga', 'Prueba otro cable/puerto USB.'], ['Un LED no se enciende nunca', 'Cable S en otra columna, o G/V cambiados', 'Sigue el cable desde el módulo hasta la placa y compáralo con la tabla.'], ['Los LEDs se encienden en otro orden', 'Módulos conectados en columnas cambiadas', 'Comprueba que rojo=18, azul=19, verde=23.'], ['Error «Failed to connect to ESP32»', 'Puerto equivocado o Monitor Serie ocupando el puerto', 'Elige el puerto correcto; cierra otros programas que usen el puerto.'], ['Brillo muy débil', 'Pin V sin conectar (el LED solo recibe señal)', 'Revisa el cable rojo V.']],
    challenge: ['Añade un modo nocturno: si escribes «n» en el Monitor Serie, el semáforo pasa a azul intermitente permanente.', 'Usa el cuarto módulo (LED RGB, proyecto 3) como semáforo de peatones: verde cuando el de coches está en rojo.'],
  });
}

// ---------------------------------------------------------------- P2
{
  const w = [...gvs('led', 18, 'amarillo'), ...gvs('btn', 27, 'verde'), ...gvs('bz', 25, 'naranja')];
  LESSONS.push({
    n: 2, slug: 'timbre', title: 'Timbre con melodía', level: 'Iniciación', duration: '2 sesiones (2 h)',
    icon: '🔔', short: 'Un pulsador que hace sonar una melodía y enciende un LED.',
    intro: 'Construirás el timbre de una casa: al pulsar el botón suena «ding-dong» y una melodía corta mientras un LED parpadea. Aprenderás la diferencia entre una entrada (el pulsador) y una salida (zumbador y LED) y cómo un zumbador pasivo produce notas musicales.',
    switch: '3V3',
    objectives: ['Distinguir entradas y salidas digitales.', 'Leer un pulsador con digitalRead() y evitar rebotes.', 'Generar sonidos de distinta frecuencia con tone() en un zumbador pasivo.', 'Medir con el polímetro el estado de una entrada.'],
    ra: { 2: ['b', 'c', 'e'], 3: ['d', 'e', 'i'], 4: ['a', 'b', 'c', 'h'] },
    materials: [['Placa ACEBOTT ESP32 Plus', 1], ['Módulo pulsador', 1], ['Módulo zumbador pasivo', 1], ['Módulo LED rojo', 1], ['Cables Dupont H-H', 9, 'negro ×3, rojo ×3, amarillo, verde, naranja'], ['Cable USB-A a USB-B', 1]],
    libs: [], code: c2, file: 'P2_Timbre/P2_Timbre.ino',
    parts: {
      led: { type: 'led', color: 'rojo', pos: [-32, -64], label: 'LED rojo → GPIO 18' },
      btn: { type: 'button', pos: [2, -66], label: 'Pulsador → GPIO 27' },
      bz: { type: 'buzzer', pos: [36, -66], label: 'Zumbador → GPIO 25' },
    },
    wires: w,
    steps: [
      PREP('3V3', ['Módulo pulsador, zumbador pasivo y LED rojo', '9 cables H-H']),
      { t: 'Conecta el pulsador (entrada)', add: ['btn'], wires: ids(w.slice(3, 6)), take: ['Módulo pulsador', '3 cables H-H: negro, rojo y verde'],
        do: ['Coloca el pulsador arriba, en el centro.'],
        check: 'Columna <b>27</b> (la segunda del bloque derecho): G negro, V rojo, S verde.' },
      { t: 'Conecta el zumbador pasivo', add: ['bz'], wires: ids(w.slice(6, 9)), take: ['Módulo zumbador pasivo (el cilindro negro sobre placa)', '3 cables H-H: negro, rojo y naranja'],
        do: ['Coloca el zumbador arriba a la derecha.'],
        check: 'Columna <b>25</b>: G negro, V rojo, S naranja.' },
      { t: 'Conecta el LED rojo', add: ['led'], wires: ids(w.slice(0, 3)), take: ['Módulo LED rojo', '3 cables H-H: negro, rojo y amarillo'],
        do: ['Coloca el LED arriba a la izquierda.'],
        check: 'Columna <b>18</b>: G negro, V rojo, S amarillo. Hay 9 cables en total.' },
      UPLOAD('P2_Timbre.ino', { glow: { led: true } }, { do: ['<b>No pulses el botón mientras arranca la placa</b>: el programa aprende cómo está el botón en reposo.'], check: 'Al pulsar suena «ding-dong» + melodía y el LED se enciende con cada nota. El Monitor Serie cuenta los timbrazos.' }),
    ],
    expected: ['Al pulsar: «ding-dong» (MI5–DO5) y una escala corta (SOL–LA–SI–DO–SOL).', 'El LED rojo se enciende con cada nota.', 'El Monitor Serie muestra «DING-DONG! Timbre numero N».', 'Si mantienes pulsado, solo suena una vez hasta que sueltes.'],
    serial: 'Pulsador en reposo = 1\nTimbre listo. Pulsa el boton.\nDING-DONG! Timbre numero 1\nDING-DONG! Timbre numero 2',
    example: 'Ejemplo: la nota LA4 vibra 440 veces por segundo (440 Hz). Si duplicas la frecuencia (880 Hz) suena la misma nota una octava más aguda. Prueba a cambiar <code>MI5</code> por <code>MI4</code> en la melodía y escucha la diferencia.',
    multimeter: [['Señal del pulsador', 'Polímetro en 20 V DC. Negra en G y roja en S de la columna 27. Mide sin pulsar y pulsando.', 'Un estado ≈ 3,3 V y el otro ≈ 0 V (depende del módulo)'], ['Zumbador sonando', 'Negra en G, roja en S de la columna 25 mientras suena.', '≈ 1,6 V: el polímetro muestra la MEDIA de una onda cuadrada de 0 a 3,3 V'], ['Alimentación', 'Negra en G, roja en V de cualquier columna.', '≈ 3,3 V']],
    trouble: [['Suena solo, sin pulsar', 'Se pulsó el botón durante el arranque', 'Pulsa RESET sin tocar el botón.'], ['No suena nada pero el LED parpadea', 'Zumbador mal conectado o es el activo', 'Revisa la columna 25; usa el zumbador PASIVO.'], ['Suena un pitido continuo sin melodía', 'Has usado un zumbador activo', 'Cámbialo por el pasivo.'], ['No reacciona al botón', 'Cable S del pulsador en otra columna', 'Debe ir a la columna 27.'], ['Suena dos veces por pulsación', 'Rebote del pulsador', 'Aumenta delay(30) a delay(60).']],
    challenge: ['Programa una segunda melodía y elige cuál suena según cuántas veces pulses seguidas.', 'Haz que si pulsas más de 3 veces en 5 segundos suene una «alarma» (sirena subiendo y bajando de frecuencia).'],
  });
}

// ---------------------------------------------------------------- P3
{
  const w = [...gvs('ldr', 34, 'amarillo', 'A'),
    { id: 'rgbR', from: 'rgb.R', to: 'D25.S', color: 'rojo' }, { id: 'rgbG', from: 'rgb.G', to: 'D26.S', color: 'verde' },
    { id: 'rgbB', from: 'rgb.B', to: 'D27.S', color: 'azul' }, { id: 'rgbN', from: 'rgb.-', to: 'D25.G', color: 'negro' }];
  LESSONS.push({
    n: 3, slug: 'farola', title: 'Farola automática', level: 'Básico', duration: '2–3 sesiones (3 h)',
    icon: '💡', short: 'Un sensor de luz que enciende un LED RGB al anochecer.',
    intro: 'Las farolas de la calle se encienden solas cuando se hace de noche. Usarás un sensor de luz (LDR) conectado a una entrada analógica y un LED RGB que cambia de color: apagado de día, ámbar al atardecer y blanco de noche.',
    switch: '3V3',
    objectives: ['Diferenciar señal analógica (0–4095) y digital (0/1).', 'Leer un sensor analógico con analogRead() y calibrar umbrales.', 'Controlar el brillo de cada color de un LED RGB con PWM (analogWrite).', 'Comprobar con el polímetro la tensión del sensor con luz y a oscuras.'],
    ra: { 2: ['a', 'b', 'c'], 3: ['c', 'd', 'e'], 4: ['c', 'g'] },
    materials: [['Placa ACEBOTT ESP32 Plus', 1], ['Sensor de luz (LDR)', 1], ['Módulo LED RGB', 1], ['Cables Dupont H-H', 7, 'negro ×2, rojo ×2, amarillo, verde, azul'], ['Cable USB-A a USB-B', 1]],
    libs: [], code: c3, file: 'P3_Farola/P3_Farola.ino',
    parts: {
      ldr: { type: 'ldr', pos: [-30, 66], rot: 180, label: 'Sensor de luz → ANALOG 34' },
      rgb: { type: 'rgb', pos: [22, -66], label: 'LED RGB → GPIO 25-26-27' },
    },
    wires: w,
    steps: [
      PREP('3V3', ['Sensor de luz (LDR) y módulo LED RGB', '7 cables H-H']),
      { t: 'Conecta el sensor de luz al bloque ANALOG', add: ['ldr'], wires: ids(w.slice(0, 3)), take: ['Sensor de luz (LDR)', '3 cables H-H: negro, rojo y amarillo'],
        do: ['Coloca el sensor delante de la placa (abajo a la izquierda), con sus pines mirando hacia la placa y la LDR hacia arriba.', 'El bloque ANALOG está a la izquierda del chip plateado, rodeado por un recuadro blanco. Usa la fila de ARRIBA, marcada <b>34</b>.'],
        check: 'Fila <b>34</b> del bloque ANALOG: G negro, 3V3 rojo, S amarillo. El pin rojo de este bloque da siempre 3,3 V.' },
      { t: 'Conecta el LED RGB', add: ['rgb'], wires: ids(w.slice(3, 7)), take: ['Módulo LED RGB (4 pines: R, G, B, −)', '4 cables H-H: rojo, verde, azul y negro'],
        do: ['Coloca el LED RGB arriba a la derecha.', 'Ojo: aquí los cables de color van a pines <b>S</b> de tres columnas distintas, y el negro a un pin <b>G</b>.', 'Si tu módulo tiene el pin común marcado «+» en vez de «−», conecta ese pin a <b>V</b> (no a G) y pon <code>ANODO_COMUN = true</code> en el código.'],
        check: 'R → S del 25, G → S del 26, B → S del 27, − → G del 25. El pin G del módulo RGB significa «green» (verde), ¡no GND!' },
      UPLOAD('P3_Farola.ino', { glow: { rgb: '#ffb347' } }, { do: ['<b>Calibra</b>: mira el valor «Luz =» con la luz del aula, tapando el sensor con la mano y a medio tapar. Ajusta <code>UMBRAL_NOCHE</code> y <code>UMBRAL_ATARDECER</code> y vuelve a subir el programa.'], check: 'Con luz: LED apagado. A medio tapar: ámbar. Tapado: blanco.' }),
    ],
    expected: ['Al arrancar: prueba de colores rojo → verde → azul.', 'Con la luz del aula el LED está apagado (DÍA).', 'Tapando a medias el sensor: luz ámbar (ATARDECER).', 'Tapándolo del todo: luz blanca (NOCHE).', 'Gracias a la histéresis el LED no parpadea al estar justo en el límite.'],
    serial: 'Farola automatica lista\nLuz = 2890  ->  DIA (apagada)\nLuz = 1710  ->  ATARDECER (ambar)\nLuz = 420  ->  NOCHE (blanca)',
    example: 'Ejemplo de cálculo: el ESP32 convierte 0–3,3 V en 0–4095. Una lectura de 2048 equivale a 2048 × 3,3 / 4095 ≈ 1,65 V. Mide con el polímetro el pin S del sensor y compara con la lectura del Monitor Serie.',
    multimeter: [['Tensión del sensor con luz', 'Polímetro en 20 V DC. Negra en G y roja en S de la fila 34 (bloque ANALOG).', 'Con luz y tapado deben salir valores claramente distintos (por ejemplo 2,3 V y 0,4 V)'], ['Alimentación del sensor', 'Negra en G, roja en 3V3 de la fila 34.', '≈ 3,3 V'], ['Brillo de un color (PWM)', 'Negra en G, roja en S de la columna 25 con la luz ámbar.', '≈ 3,3 V (rojo a 255) · columna 26 ≈ 1,2 V (verde a 90)']],
    trouble: [['El LED nunca se enciende', 'Umbrales sin calibrar', 'Mira el Monitor Serie y ajusta los umbrales a tu aula.'], ['Funciona al revés (se enciende con luz)', 'Tu sensor da valores más bajos con más luz', 'Pon MAS_LUZ_MAS_VALOR = false.'], ['Colores cambiados (rojo sale verde)', 'Cables R/G/B en columnas cambiadas', 'R→25, G→26, B→27.'], ['El LED RGB está siempre encendido en blanco', 'Módulo de ánodo común', 'Común a V y ANODO_COMUN = true.'], ['Lectura fija en 0 o 4095', 'Cable S suelto o en la fila equivocada', 'El sensor va en la fila 34 del bloque ANALOG.']],
    challenge: ['Haz que el brillo blanco sea proporcional a la oscuridad (más oscuro = más brillo) usando map().', 'Añade el zumbador: un pitido corto cada vez que la farola cambia de estado.'],
  });
}

// ---------------------------------------------------------------- P4
{
  const w = [
    { id: 'lmG', from: 'lm.G', to: 'A35.G', color: 'negro' }, { id: 'lmS', from: 'lm.S', to: 'A35.S', color: 'amarillo' },
    { id: 'lmV', from: 'lm.V', to: 'P.5V', color: 'rojo' },
    ...i2c('lcd', 1), ...gvs('bz', 25, 'naranja')];
  LESSONS.push({
    n: 4, slug: 'termometro', title: 'Termómetro con alarma', level: 'Básico', duration: '3 sesiones (3 h)',
    icon: '🌡️', short: 'LM35 + pantalla LCD I2C + zumbador de alarma.',
    intro: 'Fabricarás un termómetro digital: el sensor LM35 mide la temperatura, la pantalla LCD de 16×2 caracteres la muestra y, si se supera un límite, suena una alarma. Conocerás el bus I2C, que permite conectar pantallas con solo 4 cables.',
    switch: '5V',
    objectives: ['Convertir una tensión en temperatura (LM35: 10 mV/°C).', 'Conectar un dispositivo I2C (LCD1602, dirección 0x27) al bloque I2C.', 'Instalar y usar una librería en Arduino IDE.', 'Contrastar la medida del polímetro con la de la pantalla.'],
    ra: { 1: ['a'], 3: ['d', 'e', 'i', 'j'], 4: ['a', 'c', 'g', 'h', 'i'] },
    materials: [['Placa ACEBOTT ESP32 Plus', 1], ['Sensor de temperatura LM35', 1], ['Pantalla LCD1602 con adaptador I2C', 1], ['Módulo zumbador pasivo', 1], ['Cables Dupont H-H', 9, 'negro ×3, rojo ×2, amarillo, azul, blanco, naranja'], ['Cable Dupont macho-hembra (M-H)', 1, 'rojo'], ['Cable USB-A a USB-B', 1]],
    libs: ['lcd'], code: c4, file: 'P4_Termometro/P4_Termometro.ino',
    parts: {
      lm: { type: 'lm35', pos: [-28, 66], rot: 180, label: 'LM35 → ANALOG 35 + 5V' },
      lcd: { type: 'lcd', pos: [112, 4], label: 'LCD1602 I2C → I2C fila 1', lines: ['Temp: 24.6\u00B0C', 'Limite: 28\u00B0C'] },
      bz: { type: 'buzzer', pos: [26, -66], label: 'Zumbador → GPIO 25' },
    },
    wires: w,
    steps: [
      PREP('5V', ['LM35, pantalla LCD1602 I2C y zumbador pasivo', '9 cables H-H y 1 cable M-H']),
      { t: 'Conecta el sensor LM35', add: ['lm'], wires: ['lmG', 'lmS', 'lmV'], take: ['Módulo LM35', '2 cables H-H (negro y amarillo)', '1 cable M-H rojo (un extremo con agujero y otro con pin)'],
        do: ['Coloca el LM35 delante de la placa, abajo a la izquierda.', 'El G y la S van a la fila <b>35</b> del bloque ANALOG (la segunda fila empezando por arriba).', 'La V NO va al bloque ANALOG: el LM35 necesita 4 V o más. El extremo hembra del cable rojo va al pin V del LM35 y el extremo macho se clava en el agujero <b>5V</b> del conector POWER.'],
        check: 'G (negro) y S (amarillo) en la fila 35; el pin 3V3 de esa fila queda LIBRE. V (rojo) en el 2º agujero del conector POWER, marcado 5V.' },
      { t: 'Conecta la pantalla LCD al bloque I2C', add: ['lcd'], wires: ids(w.slice(3, 7)), take: ['Pantalla LCD1602 I2C', '4 cables H-H: negro, rojo, azul y blanco'],
        do: ['Coloca la pantalla a la derecha de la placa. Sus 4 pines están en el adaptador negro de la parte de atrás, en el lado izquierdo.', 'Usa la fila de ARRIBA (fila 1) del bloque I2C.'],
        check: 'GND→G (negro), VCC→V (rojo), SDA→SDA (azul), SCL→SCL (blanco). Lee los nombres en el adaptador: no los conectes por posición.' },
      { t: 'Conecta el zumbador', add: ['bz'], wires: ids(w.slice(7, 10)), take: ['Módulo zumbador pasivo', '3 cables H-H: negro, rojo y naranja'],
        do: ['Coloca el zumbador arriba, a la derecha.'],
        check: 'Columna <b>25</b>: G negro, V rojo, S naranja. Con el interruptor en 5V, los pines V dan 5 V.' },
      UPLOAD('P4_Termometro.ino', null, { do: ['Instala antes la librería <b>LiquidCrystal I2C</b> (Frank de Brabander).', 'Si la pantalla se enciende pero no se ven letras, gira con el destornillador el potenciómetro azul de la parte trasera.'], check: 'La LCD muestra «Temp: xx.x°C». Al pellizcar el LM35 con los dedos la temperatura sube; al pasar de 28 °C suena la alarma.' }),
    ],
    expected: ['Pantalla de bienvenida 1,5 s y luego la temperatura con 1 decimal.', 'Fila 2: «Limite: 28°C» o «!! ALARMA !!».', 'Al calentar el sensor con los dedos sube unos grados en 20–30 s; por encima de 28 °C pita cada medio segundo.'],
    serial: 'Temperatura = 24.6 C  -> normal\nTemperatura = 26.9 C  -> normal\nTemperatura = 28.3 C  -> ALARMA',
    example: 'Ejemplo: si el polímetro marca 0,246 V en la salida del LM35, la temperatura es 0,246 V ÷ 0,010 V/°C = <b>24,6 °C</b>. Compáralo con la pantalla: la diferencia debería ser menor de 1–2 °C.',
    multimeter: [['Salida del LM35', 'Polímetro en 2 V o 20 V DC. Negra en G y roja en S de la fila 35.', '≈ 0,20–0,30 V a temperatura ambiente (= 20–30 °C)'], ['Alimentación del LM35', 'Negra en G, roja en el pin V del LM35 (o en el agujero 5V del POWER).', '≈ 5 V'], ['Alimentación de la LCD', 'Negra en G, roja en V de la fila 1 del bloque I2C.', '≈ 5 V (interruptor en 5V)']],
    trouble: [['Pantalla iluminada pero sin letras', 'Contraste mal ajustado', 'Gira el potenciómetro azul de atrás.'], ['Pantalla apagada', 'Interruptor en 3.3V o VCC/GND mal', 'Interruptor en 5V; revisa GND y VCC.'], ['Cuadros negros en la fila 1', 'SDA/SCL cambiados o dirección distinta', 'Comprueba SDA/SCL; si persiste prueba la dirección 0x3F.'], ['Temperatura absurda (≈ 0 °C o > 100 °C)', 'LM35 sin 5 V o S en otra fila', 'V al 5V del POWER; S en la fila 35.'], ['Error de compilación «LiquidCrystal_I2C.h: No such file»', 'Falta la librería', 'Instálala desde el gestor de bibliotecas.']],
    challenge: ['Guarda la temperatura máxima y mínima desde el arranque y muéstralas alternando en la fila 2.', 'Haz que el límite de alarma se pueda cambiar enviando un número por el Monitor Serie.'],
  });
}

// ---------------------------------------------------------------- P5
{
  const w = [
    { id: 'usV', from: 'us.VCC', to: 'P.5V', color: 'rojo' }, { id: 'usG', from: 'us.GND', to: 'P.GND', color: 'negro' },
    { id: 'usT', from: 'us.Trig', to: 'D26.S', color: 'amarillo' }, { id: 'usE', from: 'us.Echo', to: 'D27.S', color: 'verde' },
    ...i2c('oled', 1), ...gvs('lv', 18, 'verde'), ...gvs('lr', 19, 'morado'), ...gvs('bz', 25, 'naranja')];
  LESSONS.push({
    n: 5, slug: 'aparcamiento', title: 'Sensor de aparcamiento', level: 'Intermedio', duration: '3 sesiones (3 h)',
    icon: '🅿️', short: 'Ultrasonidos HC-SR04 + OLED + LEDs + pitidos según la distancia.',
    intro: 'Como el sensor de aparcamiento de un coche: el HC-SR04 mide la distancia con ultrasonidos, la pantalla OLED la muestra en grande con una barra, y los LEDs y el zumbador avisan cada vez más rápido según te acercas.',
    switch: '3V3',
    caution: 'El HC-SR04 funciona a 5 V y su pin Echo devuelve pulsos de 5 V, pero las entradas del ESP32 son de 3,3 V. Muchos montajes lo conectan directo y funciona, pero queda fuera de lo que admite el fabricante y podría dañar el pin a la larga. Si el taller dispone de 2 resistencias (1 kΩ y 2 kΩ, no incluidas en el kit) monta un divisor de tensión en Echo sobre la protoboard: Echo → 1 kΩ → GPIO 27, y GPIO 27 → 2 kΩ → GND.',
    objectives: ['Explicar cómo se mide una distancia por el tiempo de un eco (d = t × 343 m/s ÷ 2).', 'Alimentar un módulo de 5 V desde el conector POWER y conocer el riesgo de los niveles de 5 V en entradas de 3,3 V.', 'Mostrar datos y gráficos en una pantalla OLED I2C.', 'Programar avisos sin bloquear el programa con millis().'],
    ra: { 2: ['b', 'c', 'e'], 3: ['e', 'i'], 4: ['c', 'd', 'g', 'h'] },
    materials: [['Placa ACEBOTT ESP32 Plus', 1], ['Sensor de ultrasonidos HC-SR04', 1], ['Pantalla OLED 1,3" I2C', 1], ['Módulo LED verde', 1], ['Módulo LED rojo', 1], ['Módulo zumbador pasivo', 1], ['Cables Dupont H-H', 15, 'negro ×4, rojo ×4, amarillo, verde ×2, azul, blanco, morado, naranja'], ['Cables Dupont M-H', 2, 'rojo y negro'], ['Cable USB-A a USB-B', 1], ['Una caja o libro como «coche»', 1, 'no incluido en el kit']],
    libs: ['sh110x', 'gfx'], code: c5, file: 'P5_Aparcamiento/P5_Aparcamiento.ino',
    parts: {
      us: { type: 'hcsr04', pos: [100, -6], rot: -90, label: 'HC-SR04 → 5V, GND, GPIO 26, 27' },
      car: { type: 'car', pos: [158, -6], rot: 90 },
      oled: { type: 'oled', pos: [30, 72], rot: 180, label: 'OLED → I2C fila 1', draw: 'parking' },
      lv: { type: 'led', color: 'verde', pos: [-48, -64], label: 'LED verde → GPIO 18' },
      lr: { type: 'led', color: 'rojo', pos: [-20, -64], label: 'LED rojo → GPIO 19' },
      bz: { type: 'buzzer', pos: [26, -66], label: 'Zumbador → GPIO 25' },
    },
    wires: w,
    steps: [
      PREP('3V3', ['HC-SR04, OLED 1,3", LED verde, LED rojo y zumbador', '15 cables H-H y 2 cables M-H']),
      { t: 'Alimenta el HC-SR04 desde el conector POWER', add: ['us'], wires: ['usV', 'usG'], take: ['Sensor HC-SR04', '2 cables M-H: rojo y negro'],
        do: ['Coloca el HC-SR04 a la derecha de la placa, de pie, con los dos «ojos» mirando hacia fuera (apóyalo contra un estuche o sujétalo con plastilina; el soporte gris del modelo 3D es solo orientativo).', 'Extremo hembra en el sensor; extremo macho en el conector azul POWER de abajo.'],
        check: 'VCC (rojo) en el agujero <b>5V</b> (2º por la izquierda) y GND (negro) en el agujero <b>GND</b> (6º por la izquierda). ¡No los inviertas!' },
      { t: 'Conecta Trig y Echo', add: [], wires: ['usT', 'usE'], take: ['2 cables H-H: amarillo y verde'],
        do: ['Trig y Echo van a pines <b>S</b> (solo señal) del bloque derecho.', '⚠️ Lee la nota de precaución de 5 V sobre el pin Echo (pestaña «Ficha»).'],
        check: 'Trig (amarillo) → S de la columna 26 · Echo (verde) → S de la columna 27. Los pines V y G de esas columnas quedan libres.' },
      { t: 'Conecta la pantalla OLED', add: ['oled'], wires: ids(w.slice(4, 8)), take: ['Pantalla OLED 1,3"', '4 cables H-H: negro, rojo, azul y blanco'],
        do: ['Coloca la OLED delante de la placa, con sus pines hacia la placa.', 'Lee el orden de los pines en la propia pantalla: en algunas es GND-VCC-SCL-SDA y en otras VCC-GND-SCL-SDA.'],
        check: 'Fila 1 del bloque I2C: GND→G, VCC→V, SDA→SDA (azul), SCL→SCL (blanco).' },
      { t: 'Conecta los LEDs y el zumbador', add: ['lv', 'lr', 'bz'], wires: ids(w.slice(8, 17)), take: ['LED verde, LED rojo y zumbador pasivo', '9 cables H-H'],
        do: ['LED verde → columna 18, LED rojo → columna 19, zumbador → columna 25 (los tres con G negro, V rojo y S de color).'],
        check: 'En total 17 cables. Ningún pin tiene dos cables.' },
      { ...UPLOAD('P5_Aparcamiento.ino', { glow: { lr: true } }, { do: ['Instala antes <b>Adafruit SH110X</b> (y sus dependencias Adafruit GFX y BusIO).', 'Acerca despacio una caja o tu mano al sensor.'], check: '>50 cm: verde y silencio · 20–50 cm: pitidos lentos · 10–20 cm: rápidos y LED rojo · <10 cm: pitido continuo y «PARA!».' }), add: ['car'] },
    ],
    expected: ['La OLED muestra la distancia en grande, la zona y una barra (0–100 cm).', 'Sin obstáculo (o a más de 4 m) aparece «---» y LIBRE.', 'Acercando un objeto: los pitidos se aceleran hasta ser continuos a menos de 10 cm.'],
    serial: 'Sensor de aparcamiento listo\nDistancia = 72.4 cm  -> LIBRE\nDistancia = 35.1 cm  -> CERCA\nDistancia = 14.8 cm  -> MUY CERCA\nDistancia = 7.2 cm  -> PARA!',
    example: 'Ejemplo: si el eco tarda 1.000 µs, la distancia es 1.000 × 0,0343 ÷ 2 = <b>17,2 cm</b> (se divide entre 2 porque el sonido va y vuelve). Mide con una regla la distancia real a la caja y compárala con la pantalla.',
    multimeter: [['Alimentación del HC-SR04', 'Polímetro en 20 V DC. Negra en GND y roja en VCC del sensor.', '≈ 5 V'], ['Alimentación de la OLED', 'Negra en G, roja en V de la fila 1 del bloque I2C.', '≈ 3,3 V'], ['Pin Echo (comprobación de riesgo)', 'Negra en G, roja en el pin Echo, con un objeto a 10 cm.', 'Valor medio bajo (< 1 V); los picos son de 5 V aunque el polímetro no los muestre']],
    trouble: [['Siempre «---»', 'Trig/Echo cambiados o sin 5 V', 'Trig→26, Echo→27; VCC al 5V.'], ['OLED en negro', 'Pines cambiados o dirección 0x3D', 'Conecta por nombre; prueba oled.begin(0x3D).'], ['Imagen de la OLED desplazada o con basura', 'La pantalla es SSD1306', 'Usa la librería Adafruit SSD1306 o pregunta al profesor.'], ['Medidas que saltan', 'Superficie blanda o inclinada', 'Usa un objeto plano y rígido.'], ['Pitido continuo sin objeto', 'Echo mal conectado (lee 0 cm)', 'Revisa el cable verde.']],
    challenge: ['Muestra en la OLED la velocidad a la que se acerca el objeto (cm/s).', 'Añade el sensor IR del kit como «tope»: si detecta algo, «PARA!» aunque el ultrasonido no lo vea.'],
  });
}

// ---------------------------------------------------------------- P6
{
  const w = [
    { id: 'irG', from: 'ir.GND', to: 'A34.G', color: 'negro' }, { id: 'irV', from: 'ir.VCC', to: 'A34.V', color: 'rojo' }, { id: 'irS', from: 'ir.OUT', to: 'A34.S', color: 'amarillo' },
    { id: 'svG', from: 'sv.marron', to: 'D13.G', color: 'marron', k0: 30 }, { id: 'svV', from: 'sv.rojo', to: 'D13.V', color: 'rojo', k0: 30 }, { id: 'svS', from: 'sv.naranja', to: 'D13.S', color: 'naranja', k0: 30 },
    ...i2c('lcd', 1),
    { id: 'bat', from: 'bat.dc', to: 'DC', color: 'negro', thick: true },
  ];
  LESSONS.push({
    n: 6, slug: 'barrera', title: 'Barrera de parking', level: 'Intermedio', duration: '3 sesiones (3 h)',
    icon: '🚧', short: 'Sensor IR + servo 180° + LCD, con alimentación externa.',
    intro: 'Automatizarás la barrera de un parking: cuando el sensor de infrarrojos detecta un coche, un servomotor levanta la barrera y la pantalla da la bienvenida y cuenta los vehículos. Como el servo consume más corriente de la que da el USB, usarás un portapilas externo.',
    switch: '5V',
    caution: 'Pon el interruptor en 5V solo con la placa desconectada. Con 5V, los pines V de TODOS los conectores G-V-S dan 5 V; por eso el sensor IR va al bloque ANALOG, cuyo pin 3V3 da siempre 3,3 V y así su salida nunca supera los 3,3 V.',
    objectives: ['Controlar la posición de un servomotor con PWM (librería ESP32Servo).', 'Justificar por qué un actuador necesita alimentación externa y conectarla de forma segura.', 'Leer un sensor digital de obstáculos (activo a nivel bajo).', 'Medir la tensión del portapilas y la de los pines V.'],
    ra: { 1: ['a', 'c', 'd'], 3: ['e', 'f', 'i'], 4: ['d', 'g', 'h'] },
    materials: [['Placa ACEBOTT ESP32 Plus', 1], ['Sensor de infrarrojos (obstáculos)', 1], ['Servo motor estándar 180°', 1, 'el de ángulo, NO el de rotación continua 360°'], ['Pantalla LCD1602 I2C', 1], ['Portapilas 6×AA con clavija DC y 6 pilas AA', 1, 'comprueba que lo tienes; las pilas no vienen en el kit'], ['Cables Dupont H-H', 7, 'negro ×2, rojo ×2, amarillo, azul, blanco'], ['Cable USB-A a USB-B', 1], ['Palito o pajita para la barrera (opcional)', 1]],
    libs: ['servo', 'lcd'], code: c6, file: 'P6_Barrera/P6_Barrera.ino',
    parts: {
      ir: { type: 'ir', pos: [-12, 70], rot: 180, label: 'Sensor IR → ANALOG 34' },
      car: { type: 'car', pos: [-12, 130] },
      sv: { type: 'servo', pos: [-8, -62], label: 'Servo 180° → GPIO 13' },
      lcd: { type: 'lcd', pos: [112, 4], label: 'LCD1602 → I2C fila 1', lines: ['ADELANTE  >>>', 'Coches: 3'] },
      bat: { type: 'battery', pos: [-118, 52], label: 'Portapilas 6×AA (9 V)' },
    },
    wires: w,
    steps: [
      PREP('5V', ['Sensor IR, servo 180°, LCD1602 I2C y portapilas 6×AA', '7 cables H-H']),
      { t: 'Conecta el sensor de infrarrojos', add: ['ir'], wires: ['irG', 'irV', 'irS'], take: ['Sensor IR (con 2 LEDs en la punta y un potenciómetro azul)', '3 cables H-H: negro, rojo y amarillo'],
        do: ['Coloca el sensor delante de la placa con los LEDs IR mirando hacia fuera (hacia donde llegarán los coches).', 'Va al bloque ANALOG, fila <b>34</b> (la de arriba), aunque es un sensor digital: así se alimenta a 3,3 V.'],
        check: 'GND → G (negro), VCC → 3V3 (rojo), OUT → S (amarillo) de la fila 34.' },
      { t: 'Enchufa el servo', add: ['sv'], wires: ['svG', 'svV', 'svS'], take: ['Servo 180°', 'No necesitas cables: el conector del servo se enchufa directamente'],
        do: ['El conector del servo tiene 3 cables: <b>marrón</b> (GND), <b>rojo</b> (V) y <b>naranja</b> (señal).', 'Enchúfalo en la columna <b>13</b> del bloque izquierdo con el cable marrón hacia el centro de la placa (fila G) y el naranja hacia el conector azul (fila S).'],
        check: 'Marrón en G, rojo en V, naranja en S de la columna 13. Si lo enchufas al revés el servo no se moverá (no se rompe, pero desconecta antes de girarlo).' },
      { t: 'Conecta la pantalla LCD', add: ['lcd'], wires: ids(w.slice(6, 10)), take: ['LCD1602 I2C', '4 cables H-H: negro, rojo, azul y blanco'],
        do: ['Igual que en el proyecto 4: fila 1 del bloque I2C.'],
        check: 'GND→G, VCC→V, SDA→SDA (azul), SCL→SCL (blanco).' },
      { t: 'Prepara la alimentación externa', add: ['bat'], wires: [], take: ['Portapilas 6×AA con interruptor y clavija DC', '6 pilas AA nuevas'],
        do: ['Mete las 6 pilas respetando la polaridad (+/−) dibujada en el portapilas.', 'Mide con el polímetro la tensión en la clavija (punta roja dentro, negra fuera): debe dar 8–9,6 V.', 'Deja el portapilas APAGADO y todavía sin enchufar.'],
        check: 'El portapilas da entre 8 y 9,6 V y está apagado.' },
      { ...UPLOAD('P6_Barrera.ino', { servo: 75 }, { do: ['Instala antes <b>ESP32Servo</b> y <b>LiquidCrystal I2C</b>.', 'Cuando el programa esté subido, enchufa la clavija del portapilas en el <b>jack DC</b> y enciéndelo. Puedes dejar también el USB para ver el Monitor Serie.', 'Ajusta el potenciómetro azul del sensor IR para que detecte tu mano a unos 10 cm (se enciende su LED).'], check: 'Al acercar la mano al sensor IR la barrera sube a 90°, la LCD pone «ADELANTE» y el contador aumenta. 3 s después de quitar la mano, la barrera baja.' }), wires: ['bat'], add: ['car'] },
    ],
    expected: ['Al arrancar la barrera se coloca a 0° y la LCD muestra «BARRERA CERRADA».', 'Coche (o mano) delante del sensor → la barrera sube suavemente a 90° y la LCD muestra «ADELANTE >>>» y «Coches: N».', '3 s después de que el coche pase, la barrera baja.'],
    serial: 'Barrera lista\nCoche detectado. Total = 1\nCerrando barrera\nCoche detectado. Total = 2',
    example: 'Ejemplo: el servo se controla con pulsos de 0,5 ms (0°) a 2,4 ms (180°) repetidos 50 veces por segundo. Para 90° el pulso dura unos 1,45 ms. Cambia <code>ANGULO_ABIERTA</code> a 120 y observa la diferencia.',
    multimeter: [['Portapilas', 'Polímetro en 20 V DC, en la clavija antes de enchufarla.', '8–9,6 V con pilas nuevas'], ['Pines V con interruptor en 5V', 'Negra en G y roja en V de la columna 13.', '≈ 5 V'], ['Salida del sensor IR', 'Negra en G, roja en S de la fila 34. Sin obstáculo y con la mano delante.', '≈ 3,3 V sin obstáculo · ≈ 0 V detectando']],
    trouble: [['El servo tiembla o la placa se reinicia', 'Falta alimentación externa', 'Enchufa y enciende el portapilas.'], ['El servo no se mueve', 'Conector al revés o en otra columna', 'Marrón en G, columna 13.'], ['El servo gira sin parar', 'Es el servo de 360°', 'Usa el servo de 180°.'], ['La barrera no reacciona', 'Sensor IR poco sensible', 'Gira su potenciómetro azul hasta que su LED se encienda con la mano a 10 cm.'], ['La LCD no se ve', 'Interruptor en 3.3V o contraste', 'Interruptor en 5V; ajusta el potenciómetro de la LCD.']],
    challenge: ['Limita la capacidad del parking a 5 coches: al llegar a 5 la LCD pone «COMPLETO» y la barrera no sube.', 'Añade un LED verde/rojo como semáforo de entrada (proyecto 1).'],
  });
}

// ---------------------------------------------------------------- P7
{
  const w = [
    ...gvs('soil', 34, 'amarillo', 'A'), ...gvs('rel', 25, 'naranja'),
    { id: 'com', from: 'P.5V', to: 'rel.COM', color: 'rojo', lift: 25 },
    { id: 'pR', from: 'pump.rojo', to: 'rel.NO', color: 'rojo', k0: 40 },
    { id: 'pN', from: 'pump.negro', to: 'bb.c55a', color: 'negro', k0: 40 },
    { id: 'gnd', from: 'bb.c55c', to: 'P.GND', color: 'negro' },
    { id: 'bat', from: 'bat.dc', to: 'DC', color: 'negro', thick: true },
  ];
  LESSONS.push({
    n: 7, slug: 'riego', title: 'Riego automático', level: 'Avanzado', duration: '4 sesiones (4 h)',
    icon: '🌱', short: 'Sensor de humedad + relé + bomba de agua, y práctica de mantenimiento.',
    intro: 'Una maceta que se riega sola: el sensor de humedad mide la tierra y, si está seca, el relé enciende una mini bomba de agua unos segundos. Separarás el circuito de CONTROL (ESP32) del de POTENCIA (bomba). Al final harás una práctica de mantenimiento: localizar y sustituir un sensor «averiado».',
    switch: '5V',
    caution: 'Solo baja tensión: la bomba funciona a 5 V tomados del conector POWER. Nunca conectes el relé a la red eléctrica de 230 V aunque su etiqueta diga 250 VAC. El agua y la electrónica no se llevan bien: la placa, el relé y la protoboard deben quedar LEJOS del vaso, sobre una bandeja seca. Seca cualquier salpicadura con la alimentación desconectada.',
    objectives: ['Explicar la función de un relé (interruptor controlado) y sus bornes COM, NO y NC.', 'Conectar un circuito de potencia de baja tensión separado del de control, usando bornes de tornillo y protoboard.', 'Calibrar un sensor analógico (seco/mojado) y convertir la lectura en %.', 'Diagnosticar y sustituir un elemento averiado siguiendo un procedimiento, y documentarlo en un informe.'],
    ra: { 4: ['c', 'f', 'g', 'h'], 5: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'] },
    materials: [['Placa ACEBOTT ESP32 Plus', 1], ['Sensor de humedad del suelo', 1], ['Módulo relé de 1 canal', 1], ['Micro bomba de agua 3–6 V', 1], ['Protoboard 830 puntos', 1], ['Portapilas 6×AA con clavija DC y 6 pilas AA', 1, 'las pilas no vienen en el kit'], ['Cables Dupont H-H', 6, 'negro ×2, rojo ×2, amarillo, naranja'], ['Cables Dupont M-M', 2, 'rojo y negro'], ['Cable USB-A a USB-B', 1], ['Vaso o recipiente con agua, tubo de silicona de 5 mm (≈ 50 cm) y maceta con tierra', 1, 'NO incluidos en el kit'], ['Sensor de humedad de repuesto (de otro kit)', 1, 'para la práctica de mantenimiento']],
    tools: [['Destornillador plano pequeño (2–2,5 mm)', 'para apretar los bornes de tornillo del relé'], ['Papel absorbente / bayeta', 'por si hay salpicaduras']],
    libs: [], code: c7, file: 'P7_Riego/P7_Riego.ino',
    parts: {
      soil: { type: 'soil', pos: [-68, 96], rot: 180, label: 'Sensor humedad → ANALOG 34' },
      rel: { type: 'relay', pos: [96, -24], rot: -90, label: 'Relé → GPIO 25' },
      bb: { type: 'breadboard', pos: [42, 108], label: 'Protoboard' },
      pump: { type: 'pump', pos: [168, 62], rot: -90, label: 'Bomba 5 V en el vaso' },
      plant: { type: 'plant', pos: [180, -42] },
      bat: { type: 'battery', pos: [-132, 44], label: 'Portapilas 6×AA' },
    },
    margin: 1.05,
    wires: w,
    steps: [
      PREP('5V', ['Sensor de humedad, relé, bomba, protoboard y portapilas', '6 cables H-H y 2 cables M-M', 'Destornillador plano pequeño']),
      { t: 'Conecta el sensor de humedad', add: ['soil'], wires: ids(w.slice(0, 3)), take: ['Sensor de humedad del suelo', '3 cables H-H: negro, rojo y amarillo'],
        do: ['Coloca el sensor delante de la placa a la izquierda, con las dos patas doradas hacia fuera.', 'Va a la fila <b>34</b> del bloque ANALOG (3,3 V fijos).'],
        check: 'G (negro), 3V3 (rojo) y S (amarillo) en la fila 34. Las patas doradas NO deben tocar nada metálico.' },
      { t: 'Conecta el relé (circuito de control)', add: ['rel'], wires: ids(w.slice(3, 6)), take: ['Módulo relé', '3 cables H-H: negro, rojo y naranja'],
        do: ['Coloca el relé a la derecha de la placa, con sus pines G-V-S hacia la placa y los bornes de tornillo (NO, COM, NC) hacia fuera.'],
        check: 'Columna <b>25</b>: G negro, V rojo, S naranja. El interruptor está en 5V (la bobina del relé es de 5 V).' },
      { t: 'Coloca la protoboard y la bomba', add: ['bb', 'pump', 'plant'], wires: [], take: ['Protoboard', 'Micro bomba con su tubo, dentro de un vaso con agua'],
        do: ['Coloca la protoboard delante de la placa y el vaso con la bomba a la derecha, lejos de la electrónica.', 'Mete el extremo libre del tubo en la maceta.', 'La bomba debe estar totalmente sumergida antes de funcionar: en seco se estropea.'],
        check: 'Bomba sumergida, tubo en la maceta y vaso a más de 15 cm de la placa.' },
      { t: 'Cablea el circuito de potencia (5 V)', add: [], wires: ['com', 'pR', 'pN', 'gnd'], take: ['2 cables M-M: rojo y negro', 'Destornillador plano'],
        do: ['Afloja el tornillo del borne <b>COM</b> (el del centro), mete el pin del cable M-M rojo, aprieta y tira suavemente para comprobar que no sale. Su otro extremo va al agujero <b>5V</b> del conector POWER.', 'Mete el cable ROJO de la bomba en el borne <b>NO</b> (normalmente abierto) y aprieta.', 'Mete el cable NEGRO de la bomba en la protoboard, columna <b>55</b>, fila <b>a</b>.', 'Cable M-M negro: de la columna 55, fila <b>c</b> de la protoboard al agujero <b>GND</b> del conector POWER. (Los 5 agujeros a-b-c-d-e de una misma columna están unidos por dentro.)'],
        check: 'Recorrido de la corriente: 5V → COM → (relé cerrado) → NO → bomba → protoboard col. 55 → GND. El borne NC queda libre.' },
      { ...UPLOAD('P7_Riego.ino', { glow: {} }, { do: ['Primero con SOLO el USB: mira «Lectura =» con el sensor al aire (seco) y con las patas en un vaso de agua (mojado). Escribe esos valores en <code>LECTURA_SECO</code> y <code>LECTURA_MOJADO</code> y vuelve a subir.', 'Enchufa el portapilas al jack DC y enciéndelo (la bomba consume más de lo que da bien un USB).', 'Clava el sensor en la tierra de la maceta.'], check: 'Con tierra seca el relé hace «clic», la bomba riega 3 s y espera 10 s. Con tierra húmeda el Monitor Serie dice «OK, no hace falta regar».' }), add: ['bat'], wires: ['bat'] },
    ],
    expected: ['El Monitor Serie muestra la lectura bruta, la dispersión y la humedad en %.', 'Si la humedad < 35 %: «SECO: regando», clic del relé (se enciende su LED) y la bomba funciona 3 s; luego espera 10 s.', 'Si se desconecta o estropea el sensor: «AVERIA SENSOR: bomba bloqueada» y la bomba no arranca.'],
    serial: 'Riego automatico listo\nLectura = 2950   Dispersion = 18   Humedad = 3 %   -> SECO: regando\nRiego terminado. Esperando a que el agua se reparta...\nLectura = 1530   Dispersion = 22   Humedad = 82 %   -> OK, no hace falta regar\nLectura = 2210   Dispersion = 1380   Humedad = 44 %   -> AVERIA SENSOR: bomba bloqueada. Revisa/sustituye el sensor.',
    example: 'Ejemplo de calibración: seco = 3000, mojado = 1200. Una lectura de 2100 está justo en medio → humedad = (3000 − 2100) / (3000 − 1200) × 100 = <b>50 %</b>.',
    maintenance: {
      intro: 'El profesor prepara un sensor «averiado» (por ejemplo con un cable cortado por dentro, una pata despegada o un conector flojo) y lo cambia por el bueno sin decir nada. El alumnado debe detectar la avería, sustituir el elemento y documentarlo.',
      steps: [
        ['Detectar el síntoma', 'El Monitor Serie muestra «AVERIA SENSOR» (lectura fuera de rango o muy inestable) y la bomba no riega. Anota el síntoma y los valores de «Lectura» y «Dispersión».'],
        ['Consultar la guía', 'Abre el esquema de esta práctica (pestaña «Esquema») e identifica qué elemento produce la señal: el sensor de humedad en la fila 34 del bloque ANALOG.'],
        ['Medir con seguridad', 'Con la placa ALIMENTADA solo por USB y la bomba fuera del agua: polímetro en 20 V DC, negra en G, roja en 3V3 de la fila 34 (debe dar ≈ 3,3 V). Luego roja en S: en seco y mojado debe cambiar. Si 3V3 es correcto pero S no cambia o baila → el sensor está averiado.'],
        ['Comprobar los cables', 'DESCONECTA el USB y el portapilas. Con el polímetro en continuidad, comprueba los 3 cables del sensor de extremo a extremo. Si un cable falla, sustitúyelo; si los tres pitan, el fallo está en el sensor.'],
        ['Acopiar el repuesto', 'Pide al profesor un sensor de repuesto del mismo modelo. Compruébalo visualmente (patas sin óxido, pines rectos).'],
        ['Desmontar', 'Con todo desconectado, retira los 3 cables del sensor tirando del conector (nunca del cable). Apártalo en la caja de «averiados» etiquetado.'],
        ['Montar el repuesto', 'Conecta el sensor nuevo: G negro, 3V3 rojo, S amarillo en la fila 34. Revisa con la tabla del esquema.'],
        ['Verificar y recalibrar', 'Conecta el USB, comprueba que desaparece el aviso y repite la calibración seco/mojado si los valores han cambiado. Prueba un ciclo de riego completo.'],
        ['Informe', 'Rellena el parte de mantenimiento: fecha, equipo, síntoma, mediciones, causa, elemento sustituido, herramientas usadas, prueba final y residuos (el sensor averiado se deposita en el contenedor de RAEE del centro).'],
      ],
    },
    multimeter: [['Alimentación del relé', 'Polímetro en 20 V DC. Negra en G, roja en V de la columna 25.', '≈ 5 V'], ['Señal del relé', 'Negra en G, roja en S de la columna 25 durante el riego.', '≈ 3,3 V regando · 0 V en reposo'], ['Tensión en la bomba', 'Negra en el cable negro de la bomba (protoboard col. 55), roja en el borne NO, durante el riego.', '≈ 4,5–5 V'], ['Contactos del relé (sin bomba)', 'Desconecta todo, quita el cable de COM. Continuidad entre COM y NC, y entre COM y NO.', 'COM–NC pita · COM–NO no pita (relé en reposo)']],
    trouble: [['El relé hace clic pero la bomba no gira', 'Cable suelto en un borne o en la protoboard', 'Aprieta los tornillos; comprueba que los dos cables están en la MISMA columna 55.'], ['La bomba está siempre encendida', 'Cable en NC en vez de NO, o relé activo a nivel bajo', 'Pásalo a NO; si sigue, pon RELE_ACTIVO = LOW.'], ['El relé no hace clic', 'Interruptor en 3.3V', 'Interruptor en 5V (desconectado).'], ['«AVERIA SENSOR» con el sensor bueno', 'Calibración sin hacer', 'Mide seco/mojado y actualiza LECTURA_SECO y LECTURA_MOJADO.'], ['La placa se reinicia al arrancar la bomba', 'Solo USB: caída de tensión', 'Usa el portapilas en el jack DC.']],
    challenge: ['Cuenta cuántos riegos se hacen al día y muéstralo cada hora por el Monitor Serie.', 'Añade la LCD del proyecto 4 para mostrar la humedad y el estado (OK / REGANDO / AVERÍA).'],
  });
}

// ---------------------------------------------------------------- P8
{
  const w = [
    { id: 'vin', from: 'P.VIN', to: 'drv.+12V', color: 'rojo', lift: 20 }, { id: 'gnd', from: 'P.GND_2', to: 'drv.GND', color: 'negro', lift: 20 },
    { id: 'ena', from: 'drv.ENA', to: 'D25.S', color: 'blanco' }, { id: 'in1', from: 'drv.IN1', to: 'D26.S', color: 'amarillo' }, { id: 'in2', from: 'drv.IN2', to: 'D27.S', color: 'verde' },
    { id: 'm1', from: 'mot.rojo', to: 'drv.OUT1', color: 'rojo', k0: 20, k1: 20 }, { id: 'm2', from: 'mot.negro', to: 'drv.OUT2', color: 'negro', k0: 20, k1: 20 },
    { id: 'jG', from: 'joy.GND', to: 'A34.G', color: 'negro' }, { id: 'jV', from: 'joy.+5V', to: 'A34.V', color: 'rojo' }, { id: 'jY', from: 'joy.VRy', to: 'A34.S', color: 'morado' },
    { id: 'jSW', from: 'joy.SW', to: 'D23.S', color: 'gris', lift: 10 },
    ...i2c('bmp', 1, { G: 'GND', V: 'VCC', SDA: 'SDA', SCL: 'SCL' }), ...i2c('oled', 2),
    { id: 'bat', from: 'bat.dc', to: 'DC', color: 'negro', thick: true },
  ];
  LESSONS.push({
    n: 8, slug: 'ventilador', title: 'Ventilador inteligente', level: 'Proyecto final', duration: '6 sesiones (6 h)',
    icon: '🌀', short: 'Motor DC + L298N, joystick, BMP280 y OLED: modo manual y automático.',
    intro: 'El proyecto final reúne todo lo aprendido: un ventilador cuyo motor de corriente continua se controla con el driver L298N. En modo MANUAL lo manejas con el joystick (velocidad y sentido); en modo AUTO gira más rápido cuanto más calor mide el sensor BMP280. Todo se muestra en la pantalla OLED.',
    switch: '3V3',
    caution: 'El motor se alimenta del portapilas a través del pin VIN, no de los pines de la ESP32. No toques la hélice mientras gira y sujeta el motor a la mesa (cinta adhesiva o pinza) para que no salte. El disipador del L298N puede calentarse: no lo toques tras un uso prolongado.',
    objectives: ['Explicar por qué un motor necesita un driver (L298N, puente en H) y separar alimentación de potencia y de control con masa común.', 'Controlar velocidad (PWM en ENA) y sentido de giro (IN1/IN2).', 'Integrar dos dispositivos en el mismo bus I2C (BMP280 y OLED).', 'Planificar, montar, verificar y documentar un sistema completo.'],
    ra: { 1: ['a', 'b', 'c', 'd'], 2: ['d', 'e'], 3: ['e', 'f', 'g', 'h', 'j'], 4: ['e', 'f', 'g', 'j'], 5: ['a', 'b', 'h', 'i'] },
    materials: [['Placa ACEBOTT ESP32 Plus', 1], ['Motor DC con módulo controlador L298N', 1], ['Módulo joystick analógico', 1], ['Sensor BMP280', 1], ['Pantalla OLED 1,3" I2C', 1], ['Portapilas 6×AA con clavija DC y 6 pilas AA', 1, 'las pilas no vienen en el kit'], ['Cables Dupont H-H', 15, 'negro ×3, rojo ×3, blanco ×3, azul ×2, amarillo, verde, morado, gris'], ['Cables Dupont M-M', 2, 'rojo y negro'], ['Cable USB-A a USB-B', 1], ['Hélice de cartulina o rueda para el eje del motor', 1, 'opcional, no incluida'], ['Cinta adhesiva', 1, 'para sujetar el motor']],
    tools: [['Destornillador plano pequeño (2–2,5 mm)', 'bornes de tornillo del L298N'], ['Pinzas o alicates de punta', 'para quitar el puente (jumper) de ENA']],
    libs: ['bmp', 'unified', 'sh110x', 'gfx'], code: c8, file: 'P8_Ventilador/P8_Ventilador.ino',
    parts: {
      drv: { type: 'l298n', pos: [72, -84], label: 'Driver L298N' },
      mot: { type: 'motor', pos: [-30, -104], rot: 180, label: 'Motor DC + hélice' },
      joy: { type: 'joystick', pos: [-42, 74], rot: 180, label: 'Joystick → ANALOG 34 + GPIO 23' },
      oled: { type: 'oled', pos: [10, 74], rot: 180, label: 'OLED → I2C fila 2', draw: 'fan' },
      bmp: { type: 'bmp280', pos: [52, 66], rot: 180, label: 'BMP280 → I2C fila 1' },
      bat: { type: 'battery', pos: [-118, 52], label: 'Portapilas 6×AA (9 V)' },
    },
    margin: 1.06,
    wires: w,
    steps: [
      PREP('3V3', ['Todos los componentes de la lista de material', '15 cables H-H y 2 cables M-M', 'Destornillador y pinzas']),
      { t: 'Prepara el L298N y el motor', add: ['drv', 'mot'], wires: ['m1', 'm2'], take: ['Driver L298N', 'Motor DC', 'Destornillador plano y pinzas'],
        do: ['Quita con las pinzas el puente (jumper) negro que une los pines <b>ENA</b> y el de al lado; guárdalo. Deja puesto el puente «12V EN» (junto a los bornes de alimentación).', 'Afloja los bornes <b>OUT1</b> y <b>OUT2</b> (lado izquierdo del L298N), mete un cable del motor en cada uno y aprieta. Tira suavemente para comprobarlo.', 'Sujeta el motor a la mesa con cinta adhesiva y coloca la hélice.'],
        check: 'El pin ENA está libre (sin puente). Los cables del motor están firmes en OUT1 y OUT2.' },
      { t: 'Alimentación del L298N (desde VIN)', add: [], wires: ['vin', 'gnd'], take: ['2 cables M-M: rojo y negro'],
        do: ['Cable M-M ROJO: del agujero <b>VIN</b> del conector POWER (el último a la derecha) al borne <b>+12V</b> del L298N.', 'Cable M-M NEGRO: de un agujero <b>GND</b> del conector POWER al borne <b>GND</b> del L298N (el del centro). Esta es la MASA COMÚN: sin ella el motor no obedece.', 'El borne +5V del L298N queda LIBRE.'],
        check: 'VIN → +12V (rojo) y GND → GND (negro). Revisa que no están cruzados: invertirlos puede dañar el driver.' },
      { t: 'Señales de control ENA, IN1, IN2', add: [], wires: ['ena', 'in1', 'in2'], take: ['3 cables H-H: blanco, amarillo y verde'],
        do: ['Del L298N a los pines <b>S</b> del bloque derecho: ENA → columna 25, IN1 → 26, IN2 → 27.'],
        check: 'ENA (blanco) → S 25 · IN1 (amarillo) → S 26 · IN2 (verde) → S 27. IN3, IN4 y ENB quedan libres.' },
      { t: 'Conecta el joystick', add: ['joy'], wires: ['jG', 'jV', 'jY', 'jSW'], take: ['Joystick', '4 cables H-H: negro, rojo, morado y gris'],
        do: ['GND, +5V y VRy van a la fila <b>34</b> del bloque ANALOG (G, 3V3 y S). Aunque el pin diga +5V, lo alimentamos a 3,3 V para que su salida no supere los 3,3 V.', 'SW (el botón al pulsar la palanca) va al pin <b>S</b> de la columna <b>23</b>.', 'VRx queda sin conectar.'],
        check: 'Fila 34: GND→G, +5V→3V3, VRy→S. SW→S de la columna 23.' },
      { t: 'Conecta BMP280 y OLED (bus I2C)', add: ['bmp', 'oled'], wires: ids(w.slice(11, 19)), take: ['BMP280 y OLED 1,3"', '8 cables H-H: 2 negros, 2 rojos, 2 azules, 2 blancos'],
        do: ['BMP280 → fila 1 del bloque I2C. OLED → fila 2. Las 4 filas están unidas por dentro: es el mismo bus, cada dispositivo tiene su dirección (BMP280 0x76/0x77, OLED 0x3C).', 'Si tu BMP280 tiene 6 pines (también CSB y SDO), deja esos dos libres.'],
        check: 'En cada módulo: GND→G, VCC→V, SDA→SDA (azul), SCL→SCL (blanco).' },
      { ...UPLOAD('P8_Ventilador.ino', { spin: true }, { do: ['Instala antes <b>Adafruit BMP280 Library</b>, <b>Adafruit Unified Sensor</b> y <b>Adafruit SH110X</b> (con sus dependencias).', 'Con la palanca del joystick en el centro, enchufa el portapilas al jack DC y enciéndelo.', 'Pulsa la palanca del joystick para cambiar entre MANUAL y AUTO.'], check: 'MANUAL: palanca arriba = gira en un sentido, abajo = en el otro, centro = parado. AUTO: calienta el BMP280 con los dedos y el ventilador acelera.' }), add: ['bat'], wires: ['bat'] },
    ],
    expected: ['La OLED muestra modo, temperatura, presión y velocidad con una barra (izquierda = sentido inverso, derecha = directo).', 'MANUAL: la velocidad sigue a la palanca (30–100 %) y se para en el centro.', 'AUTO: parado por debajo de 24 °C, del 40 % al 100 % entre 24 y 30 °C, 100 % por encima.', 'Cada pulsación del joystick cambia de modo.'],
    serial: 'BMP280 OK\nCentro del joystick = 1893\nMANUAL  T=23.8 C  P=1014 hPa  vel=0 %\nMANUAL  T=23.8 C  P=1014 hPa  vel=72 %\nCambio a modo AUTO\nAUTO  T=26.1 C  P=1014 hPa  vel=61 %',
    example: 'Ejemplo: con T_MIN = 24 °C y T_MAX = 30 °C, a 27 °C la velocidad es 40 + (27 − 24) × 60 / 6 = <b>70 %</b>, es decir, PWM = 70 % de 210 = 147 sobre 255.',
    multimeter: [['VIN (portapilas)', 'Polímetro en 20 V DC. Negra en GND, roja en VIN del conector POWER.', '≈ 8–9 V'], ['5 V lógicos del L298N', 'Negra en el borne GND, roja en el borne +5V del L298N.', '≈ 5 V (lo genera su regulador)'], ['Tensión en el motor', 'Puntas en OUT1 y OUT2 en modo manual.', 'Sube con la palanca; cambia de signo (+/−) al invertir el sentido'], ['Joystick en reposo', 'Negra en G, roja en S de la fila 34.', '≈ 1,5–1,7 V (mitad de 3,3 V)']],
    trouble: [['El motor no gira nunca', 'Puente ENA puesto, falta masa común o portapilas apagado', 'Quita el puente ENA, revisa GND–GND y enciende el portapilas.'], ['Gira solo a tope o nada', 'ENA sin conectar al 25', 'Cable blanco ENA → S 25.'], ['Gira al revés de lo esperado', 'Cables del motor invertidos', 'Intercambia OUT1 y OUT2 (o IN1/IN2).'], ['«sin BMP280» en la OLED', 'SDA/SCL cambiados o pines CSB/SDO mal', 'Revisa la fila 1; prueba otra fila.'], ['Se mueve solo con la palanca en el centro', 'Centro mal calibrado', 'Reinicia sin tocar el joystick; aumenta ZONA_MUERTA.']],
    challenge: ['Añade un tercer modo «BRISA»: el ventilador alterna 5 s rápido y 5 s lento.', 'Guarda T_MIN y T_MAX con el joystick (eje X) en vez de en el código.', 'Elabora el informe final del proyecto con fotos, esquema, lista de material, mediciones y conclusiones.'],
  });
}
