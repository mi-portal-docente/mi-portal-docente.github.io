// Textos comunes: normativa, herramientas, software y seguridad
export const MODULO = {
  codigo: '3015', nombre: 'Equipos eléctricos y electrónicos',
  titulo: 'Título Profesional Básico en Informática y Comunicaciones',
  norma: 'Orden de 8 de noviembre de 2016 (BOJA nº 241, de 19 de diciembre de 2016), Anexo IV',
  url: 'https://www.juntadeandalucia.es/boja/2016/241/1',
};
export const RA = {
  1: { t: 'Identifica el material, herramientas y equipo necesarios para el montaje y ensamblado de equipos eléctricos y electrónicos, describiendo sus principales características y funcionalidad.', ce: {
    a: 'Se han identificado y clasificado los elementos y componentes tipo de un equipo eléctrico o electrónico.',
    b: 'Se han identificado y clasificado los anclajes y sujeciones tipo (tornillos, clips, pestañas, entre otros) de un equipo eléctrico o electrónico en función de su aplicación, rigidez y estabilidad.',
    c: 'Se han identificado y clasificado las herramientas (atornillador eléctrico, atornilladores planos y de estrella y llaves, entre otros) normalmente empleadas en el ensamblado de un equipo eléctrico o electrónico en función de su aplicación e idoneidad.',
    d: 'Se han identificado y clasificado los diferentes medios y equipos de seguridad personal (guantes de protección, gafas y mascarilla, entre otros) en función de su aplicación y teniendo en cuenta las herramientas a utilizar.' } },
  2: { t: 'Determina la secuencia de las operaciones de montaje y desmontaje de equipos eléctricos y electrónicos, interpretando esquemas e identificando los pasos a seguir.', ce: {
    a: 'Se ha reconocido la simbología de representación gráfica de los elementos y componentes de los equipos eléctricos y electrónicos.',
    b: 'Se ha interpretado el procedimiento y secuencia de montaje/conexión, a partir de esquemas o guías de montaje.',
    c: 'Se ha identificado cada uno de los elementos representados en el esquema con el elemento real.',
    d: 'Se ha identificado el procedimiento y secuencia de montaje/conexión de los distintos elementos (inserción de tarjetas, fijación de elementos, entre otros).',
    e: 'Se ha definido el proceso y secuencia de montaje/conexión a partir del esquema o guía de montaje.' } },
  3: { t: 'Monta y desmonta elementos de equipos eléctricos o electrónicos, interpretando esquemas y guías de montaje.', ce: {
    a: 'Se han seleccionado los esquemas y guías de montaje indicados para un modelo determinado.',
    b: 'Se han seleccionado las herramientas indicadas en los esquemas y guías de montaje.',
    c: 'Se han preparado los elementos y materiales que se van a utilizar, siguiendo procedimientos normalizados.',
    d: 'Se ha identificado la ubicación de los distintos elementos en el equipo.',
    e: 'Se han ensamblado los distintos componentes siguiendo procedimientos normalizados, aplicando las normas de seguridad de los mismos.',
    f: 'Se han fijado los componentes con los elementos de sujeción indicados en los esquemas o guías de montaje y aplicando el par de apriete o presión establecidos.',
    g: 'Se ha aplicado técnicas de montaje de componentes y conectores electrónicos en placas de circuito impreso.',
    h: 'Se han aplicado técnicas de desmontaje de equipos eléctricos o electrónicos.',
    i: 'Se han observado los requerimientos de seguridad establecidos.',
    j: 'Se ha elaborado un informe recogiendo las actividades desarrolladas y resultados obtenidos.' } },
  4: { t: 'Conexiona elementos en equipos eléctricos o electrónicos aplicando técnicas básicas y verificando la continuidad.', ce: {
    a: 'Se han seleccionado los esquemas y guías de montaje indicados para un modelo determinado de conexión.',
    b: 'Se ha seleccionado las herramientas indicadas en los esquemas y guías de conexión.',
    c: 'Se han dispuesto y colocado las piezas del conector y los cables.',
    d: 'Se han dispuesto y colocado las protecciones personales y de los elementos.',
    e: 'Se han acondicionado los cables (pelar, estirar, ordenar) siguiendo procedimientos.',
    f: 'Se han insertado las piezas del conector en el orden correcto y unir los cables (soldar, crimpar, embornar, entre otros) de la forma establecida en el procedimiento.',
    g: 'Se ha realizado la conexión (soldadura, embornado, conector) según el procedimiento establecido (posición de elementos, inserción del elemento, maniobra de fijación, entre otros).',
    h: 'Se han observado las medidas de seguridad en la utilización de equipos y herramientas.',
    i: 'Se han dispuesto y colocado las etiquetas en los cables, según el procedimiento establecido.',
    j: 'Se han tratado los residuos generados de acuerdo a la normativa sobre medioambiente.' } },
  5: { t: 'Realiza el mantenimiento básico de equipos eléctricos y electrónicos, aplicando las técnicas establecidas en condiciones de calidad y seguridad.', ce: {
    a: 'Se han seleccionado los esquemas y guías indicados para un modelo determinado.',
    b: 'Se han seleccionado las herramientas según las operaciones a realizar.',
    c: 'Se han identificado los elementos a sustituir.',
    d: 'Se han acopiado los elementos de sustitución.',
    e: 'Se han seleccionado las herramientas necesarias para las operaciones a realizar.',
    f: 'Se han desmontado los elementos a sustituir, empleando las técnicas y herramientas apropiadas según los requerimientos de cada intervención.',
    g: 'Se han montado los elementos de sustitución, empleando las técnicas y herramientas apropiadas según los requerimientos de cada intervención.',
    h: 'Se han realizado las operaciones observando las medidas de seguridad previstas para los componentes y personales.',
    i: 'Se ha elaborado un informe con las operaciones realizadas en un documento con el formato establecido.' } },
};

export const BOARD_URL = 'https://espressif.github.io/arduino-esp32/package_esp32_index.json';

export const SOFTWARE_STEPS = [
  ['Instala Arduino IDE 2', 'Descárgalo gratis de <b>arduino.cc/en/software</b> (Windows, macOS o Linux) e instálalo con las opciones por defecto.'],
  ['Añade las placas ESP32', `Abre <b>Archivo → Preferencias</b>. En «URLs adicionales de gestor de placas» pega:<br><code class="url">${BOARD_URL}</code><br>Pulsa <b>Aceptar</b>.`],
  ['Instala el paquete «esp32»', 'Abre <b>Herramientas → Placa → Gestor de placas</b>, busca <b>esp32</b> y pulsa <b>Instalar</b> en «esp32 by Espressif Systems» (versión 3.x; probado con la 3.3). Tarda unos minutos.'],
  ['Instala el driver CH340', 'La ESP32 Plus usa el chip USB <b>CH340</b>. En Windows, si al conectar la placa no aparece ningún puerto COM nuevo, instala el driver «CH341SER» de <b>wch-ic.com</b> (en Linux y macOS recientes ya viene incluido). Usa un cable USB-B que transmita datos.'],
  ['Selecciona la placa', 'En <b>Herramientas → Placa → esp32</b> elige <b>«ESP32 Dev Module»</b>.'],
  ['Selecciona el puerto', 'Conecta la placa por USB y elige en <b>Herramientas → Puerto</b> el puerto que aparece (COM3, COM4… en Windows; /dev/ttyUSB0 en Linux). Si dudas, desconecta la placa: el puerto que desaparece es el suyo.'],
  ['Instala las librerías de la práctica', 'Abre <b>Herramientas → Gestionar bibliotecas…</b> (o el icono de libros), busca cada librería por su nombre exacto e instálala. Si pregunta por instalar dependencias, pulsa <b>«Instalar todo»</b>.'],
  ['Sube el programa', 'Abre el archivo <b>.ino</b> de la práctica (o pega el código), pulsa <b>✓ Verificar</b> y después <b>→ Subir</b>. Normalmente la placa entra sola en modo de carga. Si se queda en «Connecting…» y falla: prueba otro cable o puerto USB; como último recurso une con un cable M-M el agujero <b>0</b> y un <b>GND</b> del conector POWER, pulsa <b>RESET</b>, sube el programa y quita el cable.'],
  ['Abre el Monitor Serie', 'Pulsa la lupa (arriba a la derecha) y elige <b>115200 baudios</b> abajo a la derecha. Ahí verás los mensajes de la placa.'],
];

export const LIBS = {
  lcd: { n: 'LiquidCrystal I2C', a: 'Frank de Brabander', v: '1.1.2', inc: '#include <LiquidCrystal_I2C.h>', note: 'Al compilar puede avisar de que «podría ser incompatible con ESP32»: es solo un aviso, funciona.' },
  servo: { n: 'ESP32Servo', a: 'Kevin Harrington, John K. Bennett', v: '3.x', inc: '#include <ESP32Servo.h>' },
  sh110x: { n: 'Adafruit SH110X', a: 'Adafruit', v: '2.1.x', inc: '#include <Adafruit_SH110X.h>', note: 'Instala también sus dependencias (Adafruit GFX Library y Adafruit BusIO).' },
  gfx: { n: 'Adafruit GFX Library', a: 'Adafruit', v: '1.11+', inc: '#include <Adafruit_GFX.h>' },
  bmp: { n: 'Adafruit BMP280 Library', a: 'Adafruit', v: '2.6+ / 3.x', inc: '#include <Adafruit_BMP280.h>', note: 'Instala también «Adafruit Unified Sensor» y «Adafruit BusIO».' },
  unified: { n: 'Adafruit Unified Sensor', a: 'Adafruit', v: '1.1.x', inc: '(dependencia)' },
};

export const TOOLS_BASE = [
  ['Polímetro digital', 'con escalas de tensión continua (20 V), resistencia y prueba de continuidad (pitido)'],
  ['Ordenador con Arduino IDE 2', 'Windows, macOS o Linux, con el paquete «esp32» instalado (ver «Preparar el PC»)'],
  ['Cable USB-A a USB-B', 'el de tipo «impresora»; debe ser de datos, no solo de carga'],
  ['Bandeja o alfombrilla antiestática', 'recomendable: trabaja sobre una superficie limpia, seca y no metálica'],
];

export const SAFETY_BASE = [
  'Monta y desmonta SIEMPRE con la placa desconectada (sin USB y sin portapilas). Conecta la alimentación solo cuando el profesor haya revisado el montaje.',
  'Coge las placas por los bordes. No toques los pines ni el chip con los dedos: la electricidad estática puede dañarlos.',
  'Conecta cada cable por su NOMBRE serigrafiado (G, V, S, GND, VCC…) y nunca solo por su posición: hay módulos con los pines en otro orden.',
  'Nunca unas directamente V (o 5V/3V3) con G (GND): es un cortocircuito.',
  'Si algo se calienta, huele a quemado o el LED PWR se apaga, desconecta el USB inmediatamente y avisa al profesor.',
  'Trabajamos solo con baja tensión (≤ 9 V). Prohibido conectar nada a la red eléctrica (230 V).',
];

export const BOARD_GUIDE = [
  ['Conectores G-V-S (digitales)', 'Dos bloques de pines macho bajo el conector azul superior. Cada columna lleva el número de su GPIO (18, 19, 23, 5, 13, 12 | 14, 27, 16, 17, 25, 26) y tiene 3 pines: <b>S</b> (señal, base azul, la fila junto al conector azul), <b>V</b> (alimentación, base roja, fila del medio) y <b>G</b> (GND, base negra, la fila más cercana al centro de la placa).'],
  ['Interruptor 3.3V / 5V', 'Elige la tensión que sale por los pines <b>V</b> de los conectores G-V-S y del bloque I2C. Arriba (hacia el conector azul) = <b>5V</b>; abajo = <b>3.3V</b>. Cámbialo SOLO con la placa desconectada.'],
  ['Bloque ANALOG (G-3V3-S)', 'A la izquierda del chip, 4 filas: <b>34, 35, 4 y 2</b> (de arriba abajo). Columnas: <b>G</b> (negra), <b>3V3</b> (roja, siempre 3,3 V, no depende del interruptor) y <b>S</b> (azul). Para sensores analógicos usaremos las filas <b>34 y 35</b>, que son solo de entrada.'],
  ['Bloque I2C (G-V-SDA-SCL)', 'Junto al interruptor: 4 filas iguales para conectar hasta 4 módulos I2C (pantallas, BMP280…). Columnas: <b>G</b> (negra), <b>V</b> (roja), <b>SDA</b> (azul, GPIO 21) y <b>SCL</b> (blanca, GPIO 22).'],
  ['Conector POWER (azul, abajo)', 'De izquierda a derecha: 0 · 5V · RST · 3V3 · 5V · GND · GND · VIN. Aquí se toman 5 V fijos, GND y VIN (la tensión del portapilas).'],
  ['USB-B y jack DC', 'USB-B: programa y alimenta la placa (5 V). Jack DC (7–12 V): portapilas de 6×AA (9 V) cuando un motor o servo necesita más corriente.'],
];

export const WIRE_TYPES = [
  ['H-H (hembra-hembra)', 'de pin macho de un módulo a pin macho de la placa (G-V-S, ANALOG, I2C)'],
  ['M-H (macho-hembra)', 'de pin macho de un módulo a un agujero del conector azul de la placa (POWER: 5V, GND…)'],
  ['M-M (macho-macho)', 'de un agujero del conector azul a un borne de tornillo o a la protoboard'],
];
