/*
  PROYECTO 8 - VENTILADOR INTELIGENTE (proyecto final)
  CFGB Informática y Comunicaciones · Módulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")
  Librerías: "Adafruit BMP280 Library", "Adafruit Unified Sensor",
             "Adafruit SH110X", "Adafruit GFX Library" (todas de Adafruit)

  CONEXIONES (interruptor de la placa en 3.3V; portapilas 6xAA en el jack DC):
    L298N:  borne +12V <- pin VIN del POWER     borne GND <- pin GND del POWER
            quitar el puente ENA
            ENA <- S del GPIO 25   IN1 <- S del GPIO 26   IN2 <- S del GPIO 27
            OUT1 y OUT2 -> los dos cables del motor DC
    Joystick: GND -> G, +5V -> 3V3, VRy -> S de la fila 34 del bloque ANALOG
              SW  -> S del GPIO 23        (VRx sin conectar)
    BMP280 -> fila 1 del bloque I2C       OLED 1,3" -> fila 2 del bloque I2C

  FUNCIONAMIENTO:
    Pulsa el joystick (SW) para cambiar de modo.
    MANUAL: joystick arriba = gira en un sentido, abajo = en el otro,
            cuanto más lo empujas, más rápido. En el centro se para.
    AUTO:   la velocidad depende de la temperatura del BMP280:
            < T_MIN parado; entre T_MIN y T_MAX de 40 % a 100 %; > T_MAX 100 %.
*/

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <Adafruit_BMP280.h>

const int PIN_ENA = 25, PIN_IN1 = 26, PIN_IN2 = 27;
const int PIN_JOY_Y = 34, PIN_JOY_SW = 23;

const float T_MIN = 24.0;        // ºC: por debajo, ventilador parado (modo AUTO)
const float T_MAX = 30.0;        // ºC: a partir de aquí, al 100 %
const int PWM_MAX = 210;         // límite (0-255) para no forzar el motor de 3-6 V
const int ZONA_MUERTA = 300;     // margen del centro del joystick

Adafruit_SH1106G oled(128, 64, &Wire, -1);
Adafruit_BMP280 bmp;

bool modoAuto = false;
bool bmpOk = false;
int centroJoy = 2048;
int estadoSWanterior = HIGH;

// velocidad de -100 a +100 (%). El signo indica el sentido de giro.
void motor(int velocidad) {
  velocidad = constrain(velocidad, -100, 100);
  digitalWrite(PIN_IN1, velocidad > 0 ? HIGH : LOW);
  digitalWrite(PIN_IN2, velocidad < 0 ? HIGH : LOW);
  ledcWrite(PIN_ENA, map(abs(velocidad), 0, 100, 0, PWM_MAX));   // PWM en ENA
}

void pantalla(float t, float p, int vel) {
  oled.clearDisplay();
  oled.setTextColor(SH110X_WHITE);
  oled.setTextSize(1); oled.setCursor(0, 0);
  oled.print("MODO: "); oled.print(modoAuto ? "AUTO" : "MANUAL");
  oled.setCursor(0, 14); oled.print("Temp: ");
  if (bmpOk) { oled.print(t, 1); oled.print(" C"); } else oled.print("sin BMP280");
  oled.setCursor(0, 26); oled.print("Pres: ");
  if (bmpOk) { oled.print(p, 0); oled.print(" hPa"); } else oled.print("--");
  oled.setCursor(0, 40); oled.print("Velocidad: "); oled.print(vel); oled.print(" %");
  oled.drawRect(0, 54, 128, 10, SH110X_WHITE);
  oled.fillRect(64, 56, (vel * 62) / 100, 6, SH110X_WHITE);  // barra con signo
  oled.drawFastVLine(64, 52, 12, SH110X_WHITE);
  oled.display();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_IN1, OUTPUT); pinMode(PIN_IN2, OUTPUT);
  ledcAttach(PIN_ENA, 1000, 8);            // PWM 1 kHz, 8 bits (0-255)
  motor(0);                                // arranca PARADO
  pinMode(PIN_JOY_SW, INPUT_PULLUP);       // el botón del joystick da 0 al pulsar
  analogReadResolution(12);
  analogSetPinAttenuation(PIN_JOY_Y, ADC_11db);

  Wire.begin(21, 22);
  if (!oled.begin(0x3C, true)) Serial.println("OLED no encontrada");
  bmpOk = bmp.begin(0x76) || bmp.begin(0x77);   // prueba las 2 direcciones
  Serial.println(bmpOk ? "BMP280 OK" : "BMP280 NO encontrado (revisa I2C)");

  delay(200);
  long s = 0;                               // calibra el centro del joystick
  for (int i = 0; i < 20; i++) { s += analogRead(PIN_JOY_Y); delay(5); }
  centroJoy = s / 20;
  Serial.print("Centro del joystick = "); Serial.println(centroJoy);
}

void loop() {
  // 1) Botón: cambia de modo al pulsar (flanco de bajada)
  int sw = digitalRead(PIN_JOY_SW);
  if (sw == LOW && estadoSWanterior == HIGH) {
    modoAuto = !modoAuto;
    Serial.println(modoAuto ? "Cambio a modo AUTO" : "Cambio a modo MANUAL");
    delay(50);
  }
  estadoSWanterior = sw;

  // 2) Sensores
  float t = bmpOk ? bmp.readTemperature() : 0;
  float p = bmpOk ? bmp.readPressure() / 100.0 : 0;   // Pa -> hPa

  // 3) Decidir velocidad
  int vel = 0;
  if (modoAuto) {
    if (!bmpOk || t < T_MIN) vel = 0;
    else if (t >= T_MAX) vel = 100;
    else vel = 40 + (int)((t - T_MIN) * 60.0 / (T_MAX - T_MIN));
  } else {
    int y = analogRead(PIN_JOY_Y) - centroJoy;
    if (abs(y) < ZONA_MUERTA) vel = 0;
    else if (y > 0) vel = map(y, ZONA_MUERTA, 4095 - centroJoy, 30, 100);
    else            vel = -map(-y, ZONA_MUERTA, centroJoy, 30, 100);
  }
  motor(vel);
  pantalla(t, p, vel);

  Serial.print(modoAuto ? "AUTO" : "MANUAL");
  Serial.print("  T="); Serial.print(t, 1);
  Serial.print(" C  P="); Serial.print(p, 0);
  Serial.print(" hPa  vel="); Serial.print(vel); Serial.println(" %");
  delay(100);
}
