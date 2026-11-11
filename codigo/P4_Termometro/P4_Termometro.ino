/*
  PROYECTO 4 - TERMÓMETRO CON ALARMA
  CFGB Informática y Comunicaciones · Módulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")
  Librería necesaria: "LiquidCrystal I2C" de Frank de Brabander

  CONEXIONES (interruptor de la placa en 5V, para que la LCD se vea bien):
    Sensor LM35:  G -> G de la fila 35 del bloque ANALOG
                  S -> S de la fila 35 del bloque ANALOG (GPIO 35)
                  V -> pin 5V del conector POWER (el LM35 necesita 4 V o más)
    LCD1602 I2C:  GND/VCC/SDA/SCL -> fila 1 del bloque I2C (G-V-SDA-SCL)
    Zumbador pasivo -> conector G-V-S del GPIO 25

  FUNCIONAMIENTO: la LCD muestra la temperatura. Si supera la
  TEMP_ALARMA suena un pitido intermitente y la LCD muestra "ALARMA".
  La salida del LM35 es 10 mV por grado (25 °C = 250 mV): nunca pasa de
  1 V, así que es segura para la entrada de 3,3 V del ESP32.
*/

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const int PIN_LM35 = 35;
const int PIN_ZUMBADOR = 25;
const float TEMP_ALARMA = 28.0;   // ºC. Pellizca el sensor para probarla

LiquidCrystal_I2C lcd(0x27, 16, 2);  // dirección 0x27, 16 columnas, 2 filas

// Lee el LM35 haciendo la media de 32 medidas (en milivoltios)
float leerTemperatura() {
  long suma = 0;
  for (int i = 0; i < 32; i++) { suma += analogReadMilliVolts(PIN_LM35); delay(2); }
  float mV = suma / 32.0;
  return mV / 10.0;                // 10 mV = 1 ºC
}

void setup() {
  Serial.begin(115200);
  analogSetPinAttenuation(PIN_LM35, ADC_11db);
  pinMode(PIN_ZUMBADOR, OUTPUT);
  Wire.begin(21, 22);              // SDA = GPIO 21, SCL = GPIO 22
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0); lcd.print("Termometro ESP32");
  lcd.setCursor(0, 1); lcd.print("Portal docente  ");
  delay(1500);
  lcd.clear();
}

void loop() {
  float t = leerTemperatura();
  bool alarma = (t >= TEMP_ALARMA);

  // Fila 1: temperatura
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(t, 1);
  lcd.print((char)223);            // símbolo de grado en la LCD
  lcd.print("C   ");

  // Fila 2: estado
  lcd.setCursor(0, 1);
  if (alarma) lcd.print("!! ALARMA !!    ");
  else { lcd.print("Limite: "); lcd.print(TEMP_ALARMA, 0); lcd.print((char)223); lcd.print("C  "); }

  Serial.print("Temperatura = "); Serial.print(t, 1);
  Serial.println(alarma ? " C  -> ALARMA" : " C  -> normal");

  if (alarma) {                    // pitido de 200 ms
    tone(PIN_ZUMBADOR, 2000);
    delay(200);
    noTone(PIN_ZUMBADOR);
    delay(300);
  } else {
    delay(500);
  }
}
