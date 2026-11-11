/*
  PROYECTO 5 - SENSOR DE APARCAMIENTO
  CFGB Informática y Comunicaciones · Módulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")
  Librerías: "Adafruit SH110X" + "Adafruit GFX Library" (Adafruit)

  CONEXIONES (interruptor de la placa en 3.3V):
    HC-SR04: VCC  -> pin 5V  del conector POWER (cable rojo, macho-hembra)
             GND  -> pin GND del conector POWER (cable negro, macho-hembra)
             Trig -> S del GPIO 26 (cable amarillo)
             Echo -> S del GPIO 27 (cable verde)   ¡ver PRECAUCIÓN!
    OLED 1,3" I2C -> fila 1 del bloque I2C (GND-VCC-SDA-SCL)
    LED VERDE -> G-V-S del GPIO 18     LED ROJO -> G-V-S del GPIO 19
    Zumbador pasivo -> G-V-S del GPIO 25

  PRECAUCIÓN: el HC-SR04 funciona a 5 V y su pin Echo devuelve 5 V, pero
  las entradas del ESP32 son de 3,3 V. Muchos montajes lo conectan directo
  y funciona, pero queda fuera de especificación. Si el taller dispone de
  2 resistencias (1 kΩ y 2 kΩ) monta un divisor de tensión en Echo.

  FUNCIONAMIENTO (como el de un coche):
    > 50 cm  : LED verde, sin pitidos
    20-50 cm : pitidos lentos         10-20 cm : pitidos rápidos
    < 10 cm  : LED rojo y pitido continuo ("¡PARA!")
*/

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

const int PIN_TRIG = 26, PIN_ECHO = 27;
const int PIN_VERDE = 18, PIN_ROJO = 19, PIN_ZUMBADOR = 25;

Adafruit_SH1106G oled(128, 64, &Wire, -1);   // OLED 1,3" (chip SH1106)

unsigned long ultimoPitido = 0;
bool pitando = false;

// Mide la distancia en cm. Devuelve -1 si no hay eco (nada delante).
float medirDistancia() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);   // pulso de 10 µs
  digitalWrite(PIN_TRIG, LOW);
  unsigned long us = pulseIn(PIN_ECHO, HIGH, 30000);     // máx 30 ms
  if (us == 0) return -1;
  return us * 0.0343 / 2.0;      // velocidad del sonido 343 m/s, ida y vuelta
}

void mostrar(float d, const char* zona) {
  oled.clearDisplay();
  oled.setTextColor(SH110X_WHITE);
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("APARCAMIENTO");
  oled.setTextSize(3); oled.setCursor(0, 16);
  if (d < 0) oled.print("---"); else oled.print((int)d);
  oled.setTextSize(1); oled.print(" cm");
  oled.setCursor(0, 44); oled.print(zona);
  int ancho = (d < 0 || d > 100) ? 128 : (int)(d * 1.28);   // barra 0-100 cm
  oled.drawRect(0, 56, 128, 8, SH110X_WHITE);
  oled.fillRect(0, 56, ancho, 8, SH110X_WHITE);
  oled.display();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT); pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_VERDE, OUTPUT); pinMode(PIN_ROJO, OUTPUT); pinMode(PIN_ZUMBADOR, OUTPUT);
  Wire.begin(21, 22);
  if (!oled.begin(0x3C, true)) Serial.println("OLED no encontrada (revisa SDA/SCL)");
  oled.clearDisplay(); oled.display();
  Serial.println("Sensor de aparcamiento listo");
}

void loop() {
  float d = medirDistancia();
  unsigned long intervalo;       // ms entre pitidos (0 = continuo)
  const char* zona;

  if (d < 0 || d > 50)  { zona = "LIBRE";       intervalo = 1000000; }
  else if (d > 20)      { zona = "CERCA";       intervalo = 600; }
  else if (d > 10)      { zona = "MUY CERCA";   intervalo = 200; }
  else                  { zona = "PARA!";       intervalo = 0; }

  digitalWrite(PIN_VERDE, (d < 0 || d > 10) ? HIGH : LOW);
  digitalWrite(PIN_ROJO,  (d >= 0 && d <= 20) ? HIGH : LOW);

  // Pitidos sin bloquear el programa (con millis)
  if (intervalo == 0) { tone(PIN_ZUMBADOR, 1500); pitando = true; }
  else if (intervalo >= 1000000) { noTone(PIN_ZUMBADOR); pitando = false; }
  else if (millis() - ultimoPitido >= intervalo) {
    ultimoPitido = millis();
    pitando = !pitando;
    if (pitando) tone(PIN_ZUMBADOR, 1500); else noTone(PIN_ZUMBADOR);
  }

  mostrar(d, zona);
  Serial.print("Distancia = ");
  if (d < 0) Serial.print("sin eco"); else Serial.print(d, 1);
  Serial.print(" cm  -> "); Serial.println(zona);
  delay(60);                     // el HC-SR04 necesita ~60 ms entre medidas
}
