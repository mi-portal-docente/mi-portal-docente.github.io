/*
  PROYECTO 3 - FAROLA AUTOMÁTICA
  CFGB Informática y Comunicaciones · Módulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")

  CONEXIONES (interruptor de la placa en 3.3V):
    Sensor de luz (LDR) -> bloque ANALOG, fila 34 (G - 3V3 - S)
    Módulo LED RGB:  R -> S del GPIO 25
                     G -> S del GPIO 26
                     B -> S del GPIO 27
                     - -> G del GPIO 25  (GND)

  FUNCIONAMIENTO:
    Mucha luz   (día)       -> farola apagada
    Luz media   (atardecer) -> luz ámbar suave
    Poca luz    (noche)     -> luz blanca a tope
  El Monitor Serie (115200 baudios) muestra la lectura (0-4095) para
  que puedas CALIBRAR los umbrales de tu aula.
*/

const int PIN_LDR = 34;            // entrada analógica (solo entrada)
const int PIN_R = 25, PIN_G = 26, PIN_B = 27;

// --- CALIBRACIÓN: mira el Monitor Serie y ajusta estos valores ---
// Si al TAPAR el sensor el número BAJA, deja true. Si SUBE, pon false.
const bool MAS_LUZ_MAS_VALOR = true;
int UMBRAL_NOCHE     = 1200;  // por debajo de esto (en "luz") es de noche
int UMBRAL_ATARDECER = 2200;  // entre NOCHE y ATARDECER: atardecer
const int HISTERESIS = 100;   // margen para que no parpadee en el límite

// Si tu módulo RGB tiene el pin común marcado "+" (ánodo común),
// pon true y conecta ese pin a V en lugar de G.
const bool ANODO_COMUN = false;

int estado = -1;  // 0 = día, 1 = atardecer, 2 = noche

void ponerColor(int r, int g, int b) {      // valores 0-255
  if (ANODO_COMUN) { r = 255 - r; g = 255 - g; b = 255 - b; }
  analogWrite(PIN_R, r);                     // PWM: brillo de cada color
  analogWrite(PIN_G, g);
  analogWrite(PIN_B, b);
}

// Media de 20 lecturas para reducir el ruido
int leerLuz() {
  long suma = 0;
  for (int i = 0; i < 20; i++) { suma += analogRead(PIN_LDR); delay(2); }
  int v = suma / 20;
  if (!MAS_LUZ_MAS_VALOR) v = 4095 - v;     // invertimos si hace falta
  return v;                                  // 0 = oscuro ... 4095 = mucha luz
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);                  // lecturas de 0 a 4095
  analogSetPinAttenuation(PIN_LDR, ADC_11db);// rango completo 0-3,3 V
  pinMode(PIN_R, OUTPUT); pinMode(PIN_G, OUTPUT); pinMode(PIN_B, OUTPUT);
  // Prueba de colores al arrancar: rojo, verde, azul
  ponerColor(255, 0, 0); delay(400);
  ponerColor(0, 255, 0); delay(400);
  ponerColor(0, 0, 255); delay(400);
  ponerColor(0, 0, 0);
  Serial.println("Farola automatica lista");
}

void loop() {
  int luz = leerLuz();
  int nuevo = estado;

  // Decide el estado con histéresis
  if (luz < UMBRAL_NOCHE - HISTERESIS)            nuevo = 2;
  else if (luz > UMBRAL_ATARDECER + HISTERESIS)   nuevo = 0;
  else if (luz > UMBRAL_NOCHE + HISTERESIS &&
           luz < UMBRAL_ATARDECER - HISTERESIS)   nuevo = 1;
  if (estado == -1 && nuevo == -1) nuevo = 1;

  if (nuevo != estado) {
    estado = nuevo;
    if (estado == 0) ponerColor(0, 0, 0);          // día: apagada
    if (estado == 1) ponerColor(255, 90, 0);       // atardecer: ámbar
    if (estado == 2) ponerColor(255, 255, 255);    // noche: blanco
  }

  Serial.print("Luz = ");
  Serial.print(luz);
  Serial.print("  ->  ");
  Serial.println(estado == 0 ? "DIA (apagada)" : estado == 1 ? "ATARDECER (ambar)" : "NOCHE (blanca)");
  delay(300);
}
