/*
  PROYECTO 2 - TIMBRE CON MELODÍA
  CFGB Informática y Comunicaciones · Módulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")

  CONEXIONES (interruptor de la placa en 3.3V):
    Módulo PULSADOR        -> conector G-V-S del GPIO 27
    Módulo ZUMBADOR PASIVO -> conector G-V-S del GPIO 25
    Módulo LED ROJO        -> conector G-V-S del GPIO 18

  FUNCIONAMIENTO: al pulsar el botón suena "ding-dong" seguido de una
  melodía corta; el LED se enciende con cada nota. Cada pulsación se
  cuenta y se muestra en el Monitor Serie (115200 baudios).

  NOTA: el programa detecta solo si el pulsador da 0 o 1 en reposo,
  así funciona con cualquier módulo pulsador (activo a nivel alto o bajo).
*/

const int PIN_PULSADOR = 27;
const int PIN_ZUMBADOR = 25;
const int PIN_LED      = 18;

// Frecuencias de las notas en hercios (Hz)
const int DO4 = 262, RE4 = 294, MI4 = 330, FA4 = 349, SOL4 = 392,
          LA4 = 440, SI4 = 494, DO5 = 523, MI5 = 659, SOL5 = 784;

// Melodía: cada nota con su duración en ms. 0 = silencio.
const int melodia[]   = {MI5, DO5, 0,   SOL4, LA4, SI4, DO5, SOL5};
const int duracion[]  = {400, 600, 200, 150,  150, 150, 300, 500};
const int NUM_NOTAS = sizeof(melodia) / sizeof(melodia[0]);

int estadoReposo;           // nivel que da el pulsador SIN pulsar
int contadorTimbres = 0;

// Toca una nota y enciende el LED mientras suena
void tocarNota(int frecuencia, int ms) {
  if (frecuencia > 0) {
    digitalWrite(PIN_LED, HIGH);
    tone(PIN_ZUMBADOR, frecuencia);   // genera la onda cuadrada
  }
  delay(ms);
  noTone(PIN_ZUMBADOR);               // para el sonido
  digitalWrite(PIN_LED, LOW);
  delay(30);                          // pequeña pausa entre notas
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_PULSADOR, INPUT_PULLUP);  // entrada con resistencia interna
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_ZUMBADOR, OUTPUT);
  delay(200);
  estadoReposo = digitalRead(PIN_PULSADOR);  // ¡no pulses al arrancar!
  Serial.print("Pulsador en reposo = ");
  Serial.println(estadoReposo);
  Serial.println("Timbre listo. Pulsa el boton.");
}

void loop() {
  // ¿Está pulsado? (nivel distinto al de reposo)
  if (digitalRead(PIN_PULSADOR) != estadoReposo) {
    delay(30);                                   // antirrebote
    if (digitalRead(PIN_PULSADOR) != estadoReposo) {
      contadorTimbres++;
      Serial.print("DING-DONG! Timbre numero ");
      Serial.println(contadorTimbres);
      for (int i = 0; i < NUM_NOTAS; i++) {
        tocarNota(melodia[i], duracion[i]);
      }
      // Espera a que se suelte el botón para no repetir
      while (digitalRead(PIN_PULSADOR) != estadoReposo) {
        delay(10);
      }
    }
  }
}
