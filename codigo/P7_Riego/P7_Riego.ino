/*
  PROYECTO 7 - RIEGO AUTOMÁTICO (+ práctica de mantenimiento)
  Salesianos Algeciras · FPB Informática y Comunicaciones · Módulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")

  CONEXIONES (interruptor de la placa en 5V; portapilas 6xAA en el jack DC):
    Sensor de humedad: G -> G, V -> 3V3, S -> S de la fila 34 del bloque ANALOG
    Módulo relé:       G-V-S del GPIO 25
    Circuito de la bomba (SOLO BAJA TENSIÓN, 5 V):
      pin 5V del POWER -> borne COM del relé
      borne NO del relé -> cable ROJO de la bomba
      cable NEGRO de la bomba -> fila de la protoboard -> pin GND del POWER

  FUNCIONAMIENTO: si la humedad baja de HUMEDAD_MINIMA, el relé activa
  la bomba durante RIEGO_MS y luego espera REPOSO_MS a que el agua se
  reparta antes de volver a medir. Si la lectura sale del rango calibrado
  o es muy inestable (sensor desconectado o averiado) la bomba se BLOQUEA
  y el Monitor Serie avisa de "AVERIA SENSOR".
  ANTES DE USARLO: calibra LECTURA_SECO (sensor al aire) y LECTURA_MOJADO
  (puntas en un vaso de agua) con los valores que veas en el Monitor Serie.
*/

const int PIN_HUMEDAD = 34;
const int PIN_RELE = 25;
const int RELE_ACTIVO = HIGH;   // si tu relé se activa con LOW, cambia a LOW

// --- CALIBRACIÓN (mira el Monitor Serie) ---
int LECTURA_SECO   = 3000;  // valor con el sensor al aire (seco)
int LECTURA_MOJADO = 1200;  // valor con el sensor metido en agua
const int HUMEDAD_MINIMA = 35;          // % por debajo del cual se riega
const unsigned long RIEGO_MS  = 3000;   // tiempo de bomba encendida
const unsigned long REPOSO_MS = 10000;  // espera después de regar

// Diagnóstico de avería: una lectura "sana" está dentro del rango calibrado
// (con un margen) y es estable. Si no, sospechamos del sensor o su cable.
const int MARGEN_RANGO = 300;      // margen fuera de SECO..MOJADO
const int DISPERSION_MAX = 500;    // diferencia máx. entre lecturas seguidas
int dispersion = 0;                // se calcula en leerBruto()

void bomba(bool encender) {
  digitalWrite(PIN_RELE, encender ? RELE_ACTIVO : !RELE_ACTIVO);
}

// Media de 20 lecturas; además guarda la dispersión (máx - mín)
int leerBruto() {
  long suma = 0;
  int mn = 4095, mx = 0;
  for (int i = 0; i < 20; i++) {
    int v = analogRead(PIN_HUMEDAD);
    suma += v; mn = min(mn, v); mx = max(mx, v);
    delay(5);
  }
  dispersion = mx - mn;
  return suma / 20;
}

// true si la lectura no tiene sentido (sensor averiado o desconectado)
bool sensorAveriado(int bruto) {
  int bajo = min(LECTURA_SECO, LECTURA_MOJADO) - MARGEN_RANGO;
  int alto = max(LECTURA_SECO, LECTURA_MOJADO) + MARGEN_RANGO;
  return (bruto < bajo || bruto > alto || dispersion > DISPERSION_MAX);
}

int aPorcentaje(int bruto) {
  int p = map(bruto, LECTURA_SECO, LECTURA_MOJADO, 0, 100);
  return constrain(p, 0, 100);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELE, OUTPUT);
  bomba(false);                              // ¡la bomba empieza apagada!
  analogReadResolution(12);
  analogSetPinAttenuation(PIN_HUMEDAD, ADC_11db);
  Serial.println("Riego automatico listo");
}

void loop() {
  int bruto = leerBruto();
  int humedad = aPorcentaje(bruto);

  Serial.print("Lectura = "); Serial.print(bruto);
  Serial.print("   Dispersion = "); Serial.print(dispersion);
  Serial.print("   Humedad = "); Serial.print(humedad); Serial.print(" %");

  // 1) Diagnóstico: ¿la lectura tiene sentido?
  if (sensorAveriado(bruto)) {
    bomba(false);
    Serial.println("   -> AVERIA SENSOR: bomba bloqueada. Revisa/sustituye el sensor.");
    delay(1000);
    return;
  }

  // 2) Control de riego
  if (humedad < HUMEDAD_MINIMA) {
    Serial.println("   -> SECO: regando");
    bomba(true);
    delay(RIEGO_MS);
    bomba(false);
    Serial.println("Riego terminado. Esperando a que el agua se reparta...");
    delay(REPOSO_MS);
  } else {
    Serial.println("   -> OK, no hace falta regar");
    delay(1000);
  }
}
