/*
  PROYECTO 1 - SEMÁFORO
  Salesianos Algeciras · FPB Informática y Comunicaciones · Módulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")

  CONEXIONES (interruptor de la placa en 3.3V):
    Módulo LED ROJO  -> conector G-V-S del GPIO 18
    Módulo LED AZUL  -> conector G-V-S del GPIO 19 (hace de luz "ámbar")
    Módulo LED VERDE -> conector G-V-S del GPIO 23
  En cada módulo: G = GND (cable negro), V = alimentación (cable rojo),
  S = señal (cable de color).

  FUNCIONAMIENTO: verde 5 s -> azul parpadeando 3 s -> rojo 5 s -> repetir.
  El Monitor Serie (115200 baudios) muestra en qué fase está el semáforo.
*/

// --- 1. Pines (si cambias un cable de sitio, cambia aquí el número) ---
const int PIN_ROJO  = 18;
const int PIN_AZUL  = 19;
const int PIN_VERDE = 23;

// --- 2. Tiempos en milisegundos (1000 ms = 1 segundo) ---
const unsigned long T_VERDE = 5000;
const unsigned long T_AMBAR = 3000;   // tiempo total del parpadeo azul
const unsigned long T_ROJO  = 5000;
const unsigned long T_PARPADEO = 250; // medio periodo del parpadeo

// Apaga los tres LEDs
void apagarTodo() {
  digitalWrite(PIN_ROJO, LOW);
  digitalWrite(PIN_AZUL, LOW);
  digitalWrite(PIN_VERDE, LOW);
}

void setup() {
  Serial.begin(115200);          // abre el Monitor Serie a 115200 baudios
  pinMode(PIN_ROJO, OUTPUT);     // los tres pines son SALIDAS digitales
  pinMode(PIN_AZUL, OUTPUT);
  pinMode(PIN_VERDE, OUTPUT);
  apagarTodo();

  // Prueba inicial: enciende cada LED 0,5 s para comprobar el montaje
  Serial.println("Prueba de LEDs: ROJO, AZUL, VERDE");
  int pines[3] = {PIN_ROJO, PIN_AZUL, PIN_VERDE};
  for (int i = 0; i < 3; i++) {
    digitalWrite(pines[i], HIGH);
    delay(500);
    digitalWrite(pines[i], LOW);
  }
  Serial.println("Semaforo en marcha");
}

void loop() {
  // FASE 1: VERDE (los coches pasan)
  apagarTodo();
  digitalWrite(PIN_VERDE, HIGH);
  Serial.println("VERDE  -> se puede pasar");
  delay(T_VERDE);

  // FASE 2: AZUL PARPADEANDO (precaución, equivale al ámbar)
  digitalWrite(PIN_VERDE, LOW);
  Serial.println("AZUL   -> precaucion (parpadeo)");
  unsigned long inicio = millis();
  while (millis() - inicio < T_AMBAR) {
    digitalWrite(PIN_AZUL, HIGH);
    delay(T_PARPADEO);
    digitalWrite(PIN_AZUL, LOW);
    delay(T_PARPADEO);
  }

  // FASE 3: ROJO (los coches se detienen)
  digitalWrite(PIN_ROJO, HIGH);
  Serial.println("ROJO   -> detenerse");
  delay(T_ROJO);
}
