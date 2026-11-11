/*
  PROYECTO 6 - BARRERA DE PARKING
  CFGB Informática y Comunicaciones · Módulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")
  Librerías: "ESP32Servo" (Kevin Harrington) y "LiquidCrystal I2C" (Frank de Brabander)

  CONEXIONES:
    Interruptor de la placa en 5V  +  portapilas 6xAA en el jack DC
    Sensor IR de obstáculos: GND -> G, VCC -> 3V3, OUT -> S de la fila 34 del bloque ANALOG
    Servo 180º (cable marrón/rojo/naranja) -> G-V-S del GPIO 13
        marrón = G, rojo = V, naranja = S
    LCD1602 I2C -> fila 1 del bloque I2C (GND-VCC-SDA-SCL)

  FUNCIONAMIENTO: cuando el sensor IR detecta un coche (OUT = 0), la
  barrera sube a 90º, la LCD muestra "ADELANTE" y cuenta el vehículo.
  Cuando el coche se va, espera 3 s y baja la barrera a 0º.
*/

#include <Wire.h>
#include <ESP32Servo.h>
#include <LiquidCrystal_I2C.h>

const int PIN_IR = 34;          // solo entrada; el módulo IR ya trae resistencia
const int PIN_SERVO = 13;
const int ANGULO_CERRADA = 0;
const int ANGULO_ABIERTA = 90;
const unsigned long ESPERA_CIERRE = 3000;  // ms tras irse el coche

Servo barrera;
LiquidCrystal_I2C lcd(0x27, 16, 2);

bool abierta = false;
unsigned long ultimaDeteccion = 0;
int coches = 0;

void mostrarLCD(const char* linea1) {
  lcd.setCursor(0, 0); lcd.print(linea1);
  lcd.setCursor(0, 1); lcd.print("Coches: "); lcd.print(coches); lcd.print("      ");
}

// Mueve el servo poco a poco (más suave y consume menos de golpe)
void moverBarrera(int desde, int hasta) {
  int paso = (hasta > desde) ? 2 : -2;
  for (int a = desde; a != hasta; a += paso) { barrera.write(a); delay(15); }
  barrera.write(hasta);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_IR, INPUT);
  barrera.setPeriodHertz(50);                 // servo estándar: 50 Hz
  barrera.attach(PIN_SERVO, 500, 2400);       // pulso mínimo y máximo (µs)
  barrera.write(ANGULO_CERRADA);
  Wire.begin(21, 22);
  lcd.init(); lcd.backlight();
  mostrarLCD("BARRERA CERRADA ");
  Serial.println("Barrera lista");
}

void loop() {
  bool hayCoche = (digitalRead(PIN_IR) == LOW);   // el módulo da 0 al detectar

  if (hayCoche) {
    ultimaDeteccion = millis();
    if (!abierta) {
      coches++;
      Serial.print("Coche detectado. Total = "); Serial.println(coches);
      mostrarLCD("ADELANTE  >>>   ");
      moverBarrera(ANGULO_CERRADA, ANGULO_ABIERTA);
      abierta = true;
    }
  } else if (abierta && millis() - ultimaDeteccion > ESPERA_CIERRE) {
    Serial.println("Cerrando barrera");
    mostrarLCD("CERRANDO...     ");
    moverBarrera(ANGULO_ABIERTA, ANGULO_CERRADA);
    abierta = false;
    mostrarLCD("BARRERA CERRADA ");
  }
  delay(50);
}
