# Código fuente del portal docente

Esta carpeta contiene todo lo necesario para **compilar y probar** la web que se publica
en la raíz de este repositorio (GitHub Pages). La web publicada (`index.html`, `css/`, `js/`,
`img/`, `codigo/`, `firmware/`…) está en la raíz; aquí solo está el código fuente y las herramientas.

```
fuente/
├── LEEME.md            este archivo
├── .gitignore          node_modules, .env, reglas con correo, registros y capturas
└── tools/
    ├── package.json    scripts de compilación (npm run build)
    ├── src/            código fuente de la aplicación (ESP32, Circuitos, Vivienda, Actividades, aula…)
    ├── rutas.mjs       rutas comunes (raíz de la web, carpeta de capturas, código de clase)
    ├── *_test.mjs      pruebas (unitarias y con navegador)
    ├── e2e/            pruebas de extremo a extremo con los emuladores de Firebase
    └── firebase/       reglas de Firestore (firestore.rules), su preparación y sus pruebas
```

## Requisitos

- Node.js 20 o posterior y npm.
- Para las pruebas con navegador: Google Chrome en `/usr/bin/google-chrome`.
- Para las pruebas con emuladores de Firebase: Java 21 (`JAVA_HOME`, o una carpeta `~/jdk/jdk-21*`).

## Instalar dependencias

```bash
cd fuente/tools
npm ci
cd firebase && npm ci && cd ..      # solo para las reglas y las pruebas con emuladores
```

## Compilar

```bash
cd fuente/tools
npm run build
```

Genera en la raíz del repositorio `js/app.js`, `js/portal-fb.js` y `js/placa.js`
(con sus archivos `.LEGAL.txt`). Después hay que subir esos archivos junto con el cambio
del código fuente. Si cambian los archivos de la web, conviene actualizar la etiqueta de
caché (`?v=…`) en `index.html` para que los navegadores descarguen la versión nueva.

## Pruebas

Las pruebas con navegador necesitan la web servida en local:

```bash
# desde la raíz del repositorio
python3 -m http.server 8766 --bind 127.0.0.1 &
cd fuente/tools
export PORTAL_BASE=http://127.0.0.1:8766/index.html
export CODIGO_CLASE='código-de-clase'     # o CODIGO_CLASE_FILE=/ruta/al/archivo (nunca en el repositorio)

node circ_pins_test.mjs                   # modelo por patas de Circuitos
node --test viv_modelo_test.mjs           # modelo y simulador de Vivienda
node --test aula_modelo_test.mjs          # lógica del aula virtual
node placa_test.mjs                       # grabación del ESP32 (placa simulada)
node circ_test.mjs                        # laboratorio de Circuitos
node viv_test.mjs                         # instalación eléctrica de vivienda
node acceso_test.mjs                      # pantalla del código de clase

bash e2e/ejecutar.sh                      # Firebase (emuladores): fb_e2e + aula_e2e
(cd firebase && npm run test:reglas)      # reglas de Firestore con el emulador
```

Las capturas que hacen las pruebas se guardan en `fuente/capturas/` (git la ignora) o en
la carpeta indicada con la variable `SHOTS`.

## Reglas de Firestore

El archivo `firebase/firestore.rules` lleva el marcador `PROFESOR_EMAIL` en lugar del correo
del profesor. Para publicarlas:

```bash
cd fuente/tools/firebase
node prepara-reglas.mjs correo-del-profesor@ejemplo.com
```

Esto crea `firestore.rules.desplegar` con el correo ya puesto (git lo ignora: **no lo subas**).
Abre ese archivo, copia todo su contenido y pégalo en la consola de Firebase:
**Firestore Database → Reglas → borrar todo → pegar → Publicar**.

También puedes usar `node ../firebase-setup.mjs --email correo@ejemplo.com [--pegar archivo]`,
que deja una copia lista para pegar (por defecto `firebase/firestore.rules.para-pegar.txt`,
también ignorada por git).

## Qué no se sube nunca

`node_modules/`, archivos `.env`, claves o credenciales, las reglas con el correo real,
los códigos de clase en claro, los registros de los emuladores y las capturas de las pruebas.
