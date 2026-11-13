# Importar elementos en JSON · formato `superprofe/elemento@1`

En **Trabajo de clase** (profesor) → botón **📥 Importar JSON**: pega el JSON (o abre un archivo `.json`),
pulsa **Validar y ver** y, si no hay errores, **Guardar como borrador**. Nada se publica solo: el elemento
queda en *Borrador* hasta que lo publiques.

* Se puede pegar **un elemento**, **una lista** `[ {…}, {…} ]` o `{ "elementos": [ … ] }` (máximo 50).
* Los errores salen en castellano con la ruta del fallo (p. ej. `preguntas[2].correcta`).
* **⬇ Exportar JSON** (menú ⋮ de cada elemento o botón «JSON» del editor) da el JSON de cualquier
  elemento: sirve de copia de seguridad y de plantilla. Los exámenes exportados **incluyen las soluciones**.
* Solo los ejemplos de este archivo marcados como `json` se comprueban en las pruebas automáticas
  (`plataforma_test.mjs`): tienen que ser siempre válidos.

## Campos comunes

| Campo | Obligatorio | Qué es |
|---|---|---|
| `formato` | no | `"superprofe/elemento@1"` |
| `tipo` | sí | `tarea`, `examen`, `material`, `pregunta`, `cuestionario` (formulario externo), `actividad`, `practica`, `proyecto` y los tipos de los motores (más abajo) |
| `titulo` | sí | máximo 150 caracteres |
| `instrucciones` | no | texto; `**negrita**`; los enlaces se ven como enlaces; párrafos con línea en blanco (`\n\n`) |
| `enlaces` | no | `[ { "titulo": "…", "url": "https://…" } ]` (también `materiales/…` o `#…` del portal) |
| `puntos` | no | 0–1000. Sin puntos = sin calificar |
| `fechaEntrega` | no | `"2026-11-20T23:59"` (hora de Madrid) |
| `criterio` | no | criterio de evaluación, sin espacios: `"eee_c1_1"` |
| `categoria` | no | categoría del cuaderno: `examenes`, `tareas`, `proyectos`, `practicas` |
| `rubrica` | no | `[ { "criterio": "Contenido", "puntos": 4 } ]` |
| `opciones` | no | solo `pregunta`: opciones de respuesta (sin opciones = respuesta corta) |
| `nota` | no | nota privada para el profesor |

## Tarea

```json
{
  "formato": "superprofe/elemento@1",
  "tipo": "tarea",
  "titulo": "Ejemplo de tarea",
  "instrucciones": "Escribe aquí lo que tienen que hacer.\n\nPuedes usar **negrita**.",
  "enlaces": [ { "titulo": "Documento de apoyo", "url": "https://example.com/apuntes.pdf" } ],
  "puntos": 10,
  "fechaEntrega": "2026-11-20T23:59",
  "criterio": "eee_c1_1",
  "rubrica": [ { "criterio": "Contenido", "puntos": 6 }, { "criterio": "Presentación", "puntos": 4 } ]
}
```

## Material y pregunta (varios a la vez)

```json
[
  { "tipo": "material", "titulo": "Ejemplo de material", "enlaces": [ { "titulo": "Vídeo", "url": "https://www.youtube.com/watch?v=xxxxxxxxxxx" } ] },
  { "tipo": "pregunta", "titulo": "Ejemplo de pregunta con opciones", "opciones": ["Opción A", "Opción B"], "puntos": 1 }
]
```

## Examen (tarea de cuestionario autocorregida)

`examen`: `abre` y `cierra` (fecha y hora), `limiteMin` (minutos o `null`), `barajar` (true/false).
Si no pones fechas, se abre mañana durante 24 h (lo cambias al editar). Cada pregunta: `id` (opcional),
`tipo`, `enunciado`, `puntos` (1 por defecto), `criterio` (opcional) y los campos de su tipo:

| `tipo` | Campos | Corrección |
|---|---|---|
| `test` | `opciones` (2–8 textos), `correcta` (nº de la buena, **empezando en 0**) | todo o nada |
| `vf` | `correcta`: `true` / `false` | todo o nada |
| `corta` | `aceptadas`: lista de respuestas válidas (sin tildes ni mayúsculas); vacía = la corriges tú | todo o nada / manual |
| `emparejar` | `pares`: `[["izquierda", "derecha"], …]` (2–12); `distractores` (opcional): opciones de la derecha que no van con ninguna | **parcial**: cada pareja bien hecha |
| `ordenar` | `elementos`: lista **en el orden correcto** (2–12); al alumno le salen desordenados | **parcial**: cada posición correcta |
| `huecos` | `texto` con los huecos entre `[[ ]]`; otras respuestas válidas con `|`: `"La ley de [[Ohm]] relaciona [[intensidad|corriente]]"` | **parcial**: cada hueco |
| `numerica` | `valor`, `tolerancia` (0 por defecto), `modo`: `"abs"` (±) o `"pct"` (en %), `unidad` (opcional) | todo o nada |
| `zonas` | `imagen` (https://…, `materiales/…` o `img/…`), `alt` (descripción), `zonas`: `[{ "x": 10, "y": 20, "w": 15, "h": 10, "nombre": "…", "correcta": true }]` en **% de la imagen** (origen arriba a la izquierda). El alumno pulsa un punto | todo o nada |

Modo examen: `"examen": { …, "pantallaCompleta": true }` → el examen se abre a pantalla completa y se anota
cada salida de la pestaña o de la pantalla completa (hora y duración). Lo ve solo el profesor, en el
cuaderno (casilla del alumno). **Es informativo: no anula ni puntúa nada.**

```json
{
  "formato": "superprofe/elemento@1",
  "tipo": "examen",
  "titulo": "Ejemplo de examen",
  "puntos": 10,
  "examen": { "abre": "2026-11-20T09:00", "cierra": "2026-11-20T10:00", "limiteMin": 30, "barajar": true },
  "preguntas": [
    { "id": "q1", "tipo": "test", "enunciado": "Pregunta de ejemplo con opciones", "opciones": ["Opción A", "Opción B", "Opción C"], "correcta": 1, "criterio": "eee_c1_1" },
    { "id": "q2", "tipo": "vf", "enunciado": "Afirmación de ejemplo", "correcta": true },
    { "id": "q3", "tipo": "corta", "enunciado": "Pregunta de respuesta corta de ejemplo", "aceptadas": ["respuesta"] }
  ]
}
```

### Examen con los tipos nuevos (modo examen)

```json
{
  "formato": "superprofe/elemento@1",
  "tipo": "examen",
  "titulo": "Ejemplo con los tipos nuevos",
  "examen": { "limiteMin": 20, "barajar": true, "pantallaCompleta": true },
  "preguntas": [
    { "tipo": "emparejar", "enunciado": "Une cada magnitud con su unidad", "puntos": 2, "pares": [["Magnitud A", "Unidad A"], ["Magnitud B", "Unidad B"], ["Magnitud C", "Unidad C"]], "distractores": ["Unidad D"], "criterio": "eee_c1_1" },
    { "tipo": "ordenar", "enunciado": "Ordena los pasos", "puntos": 2, "elementos": ["Primer paso", "Segundo paso", "Tercer paso"] },
    { "tipo": "huecos", "enunciado": "Completa la frase", "texto": "Texto con un [[hueco]] y otro [[hueco2|alternativa]].", "puntos": 2 },
    { "tipo": "numerica", "enunciado": "Calcula el valor", "valor": 2.5, "tolerancia": 5, "modo": "pct", "unidad": "A" },
    { "tipo": "zonas", "enunciado": "Pulsa sobre la zona indicada", "imagen": "img/fotos/eee.webp", "alt": "Foto de ejemplo", "zonas": [{ "x": 30, "y": 30, "w": 40, "h": 40, "nombre": "Centro", "correcta": true }] }
  ]
}
```

## Banco de preguntas (por asignatura)

«Trabajo de clase» → **🗄 Banco de preguntas**. Se pegan **preguntas** (no elementos): una lista con el mismo
formato que las `preguntas` de un examen, y **cada una con su `criterio`** (o un criterio por defecto para todas).
También se pueden copiar las preguntas de un examen ya hecho. **Generar examen**: eliges cuántas preguntas al
azar quieres de cada criterio y se crea un examen en borrador. En el editor de exámenes, **🗄 Del banco…** añade
preguntas sueltas. «Exportar el banco» da este mismo formato:

```text
{ "preguntas": [
  { "tipo": "vf", "enunciado": "Afirmación de ejemplo", "correcta": true, "criterio": "eee_c1_1" },
  { "tipo": "test", "enunciado": "Pregunta de ejemplo", "opciones": ["A", "B"], "correcta": 0, "criterio": "eee_c1_2" }
] }
```

## Explicación interactiva (`"tipo": "explicacion"`)

Diapositivas que el alumno pasa con «Anterior / Siguiente» (o las flechas del teclado), preguntas de
control con respuesta al momento (no son examen), un laboratorio del portal incrustado y un resumen final.
Al terminar, el alumno pulsa «He terminado: entregar» y se guarda «Aciertos: a/t»; en el cuaderno,
«Poner notas» lo convierte en nota sobre 10 (si quieres que cuente). Todo va en `contenido`:

| Campo | Qué es |
|---|---|
| `diapositivas` | Lista (1–40). Cada una: `titulo` (obligatorio), y al menos uno de `texto`, `imagen`, `lab`, `pregunta`. |
| `texto` | Texto de la diapositiva (`**negrita**` y enlaces). Máx. 5000. |
| `imagen` / `alt` | Ruta del portal (`img/…`, `materiales/…`) o `https://…`, y su texto alternativo. |
| `video` | Enlace de YouTube o Vimeo (se incrusta) o un `.mp4` del portal (`materiales/…`). |
| `lab` | Laboratorio del portal incrustado, p. ej. `"#eee/circuitos"`, `"#eee/vivienda"`. |
| `pregunta` | De control: `{ "tipo": "test", "enunciado", "opciones": [...], "correcta": 0, "explicacion" }` o `{ "tipo": "vf", "enunciado", "correcta": true, "explicacion" }`. |
| `resumen` | Texto del resumen final (si no se pone, se listan los títulos). |

```json
{
  "tipo": "explicacion",
  "titulo": "Ejemplo de explicación",
  "puntos": 10,
  "criterio": "eee_c1_1",
  "contenido": {
    "diapositivas": [
      { "titulo": "Qué vamos a ver", "texto": "Escribe aquí la explicación." },
      { "titulo": "Comprueba", "texto": "Una pregunta de control:",
        "pregunta": { "tipo": "vf", "enunciado": "Escribe aquí una afirmación.", "correcta": true, "explicacion": "Por qué." } },
      { "titulo": "Pruébalo", "texto": "Haz la prueba en el laboratorio.", "lab": "#eee/circuitos" }
    ],
    "resumen": "Ideas clave para recordar."
  }
}
```

## Pregunta en directo

No se importa: se lanza desde «Trabajo de clase» → «Pregunta en directo» (grupo, pregunta y opciones, o
verdadero/falso). Los alumnos conectados de ese grupo la ven al momento en una tarjeta y responden; el
profesor ve el gráfico en pantalla grande. Es anónimo (solo el recuento).

## Laboratorio p5.js (`"tipo": "p5"`, CDPC)

Uno o varios **retos** (1–20). Cada reto: `titulo`, `enunciado`, `codigo` inicial (si falta, un lienzo de
400 × 400), `pistas` (se enseñan de una en una) y `comprobaciones`:

* `{"tipo": "codigo", "contiene": "rect(" }` · también `"noContiene"` o `"regex"` (expresión regular).
* `{"tipo": "variable", "nombre": "vel", "min": 1, "max": 5 }` · o `"igual": 80` (número, texto o true/false).
  La variable tiene que estar declarada fuera de las funciones (`let vel = 3;` arriba del todo).
* `{"tipo": "pixel", "x": 100, "y": 100, "color": "#ff0000", "tolerancia": 40 }` · o `"distinto": "#dcdcdc"`
  (el píxel no es del color del fondo). Se mide medio segundo después de arrancar el programa.

Todas admiten `"mensaje"` (lo que ve el alumno en la lista de comprobaciones). Un reto está superado si el
programa se ejecuta sin errores y cumple todas sus comprobaciones. Al entregar se guarda «Aciertos: a/t»
(retos superados) y el código de cada reto; el cuaderno lo pasa a nota con «Poner notas».

```json
{
  "formato": "superprofe/elemento@1",
  "tipo": "p5",
  "titulo": "Primeros dibujos",
  "puntos": 10,
  "contenido": {
    "retos": [
      {
        "id": "circulo",
        "titulo": "Un círculo",
        "enunciado": "Dibuja un círculo en el centro del lienzo.",
        "codigo": "function setup() {\n  createCanvas(200, 200);\n}\n\nfunction draw() {\n  background(220);\n}\n",
        "pistas": ["circle(x, y, d) dibuja un círculo."],
        "comprobaciones": [
          { "tipo": "codigo", "regex": "circle\\s*\\(|ellipse\\s*\\(", "mensaje": "Usas circle() o ellipse()" },
          { "tipo": "pixel", "x": 100, "y": 100, "distinto": "#dcdcdc", "mensaje": "Hay algo dibujado en el centro" }
        ]
      }
    ]
  }
}
```

Los retos de ejemplo del **Laboratorio p5.js** (CDPC → Laboratorio) también se pueden asignar como tarea
desde su tarjeta («Asignar como tarea»): se crea una tarea de tipo «actividad» con el enlace al reto
(`#cdpc1/p5/<id>`) y el alumno entrega desde el propio laboratorio.

## Editor web en vivo (`"tipo": "web"`, TIC)

Retos de HTML y CSS (1–20). Cada reto: `titulo`, `enunciado`, `html` y `css` iniciales, `pistas` y
`comprobaciones` (al menos una). La vista previa está aislada (no ejecuta scripts).

* `{"tipo": "selector", "selector": "ul li", "min": 3}` · hay al menos `min` elementos (por defecto 1);
  con `"texto": "Mi web"`, alguno contiene ese texto.
* `{"tipo": "estilo", "selector": "h1", "propiedad": "color", "valor": "#ff0000"}` · se compara el estilo
  calculado (vale `"red"`, `"#f00"` o `"rgb(255,0,0)"`; también `"text-align": "center"`, `"font-size": "24px"`…).
* `{"tipo": "codigo", "en": "css", "contiene": "flex"}` · o `"regex"`; `"en"`: `"html"` o `"css"`.

```json
{ "formato": "superprofe/elemento@1", "tipo": "web", "titulo": "Mi primera web", "puntos": 10,
  "contenido": { "retos": [ { "id": "titulo", "titulo": "Un título rojo",
    "enunciado": "Añade un título <h1> con el texto «Mi web» y ponlo de color rojo.",
    "html": "", "css": "", "pistas": ["El título principal se escribe <h1>…</h1>."],
    "comprobaciones": [ { "tipo": "selector", "selector": "h1", "texto": "Mi web" },
                        { "tipo": "estilo", "selector": "h1", "propiedad": "color", "valor": "#ff0000" } ] } ] } }
```

## Representación de la información (`"tipo": "info"`, TIC)

Preguntas (1–40) que se corrigen solas; la solución la calcula el portal:

* `{"tipo": "conversion", "de": "dec", "a": "bin", "valor": "13"}` · sistemas `dec`, `bin`, `hex`, `ascii`
  (en ASCII, los códigos van separados por espacios: «72 105» ↔ «Hi»).
* `{"tipo": "tamano", "archivo": {…}, "unidad": "KB"}` · `archivo`: `{"tipo": "imagen", "ancho", "alto", "bits"}`,
  `{"tipo": "audio", "segundos", "hz", "bits", "canales"}`, `{"tipo": "texto", "caracteres", "bits": 8}` o
  `{"tipo": "video", "ancho", "alto", "bits", "fps", "segundos"}`. Unidades `bit`, `B`, `KB`, `MB`, `GB`;
  `"base": 1000` si se usa 1 K = 1000 (por defecto 1024); `"tolerancia"` en % (por defecto 1).

Opcionales: `enunciado` (si no, se genera) y `explicacion`. En una tarea, cada pregunta se comprueba una vez.

```json
{ "formato": "superprofe/elemento@1", "tipo": "info", "titulo": "Sistemas de numeración", "puntos": 10,
  "contenido": { "preguntas": [
    { "tipo": "conversion", "de": "dec", "a": "bin", "valor": "13" },
    { "tipo": "tamano", "archivo": { "tipo": "imagen", "ancho": 800, "alto": 600, "bits": 24 }, "unidad": "KB" } ] } }
```

## Ciberseguridad (`"tipo": "ciber"`, TIC)

Una o varias partes: `correos` (bandeja: cada correo con `de`, `asunto`, `cuerpo`, `enlace` opcional,
`phishing`: true/false y `explicacion`), `contrasena` (`{"minimo": "fuerte"}`: niveles «muy débil», «débil»,
«aceptable», «fuerte», «muy fuerte»; **la contraseña no se guarda ni se envía**, solo cuenta si se alcanzó el
nivel) y `red` (`nodos` con `id`, `nombre`, `tipo` —router, servidor, pc, portatil, movil, wifi, impresora,
camara, nube, internet, switch—, posición `x` e `y` en % y, en los que tengan riesgo, `riesgo` con `pregunta`,
`opciones`, `correcta` y `explicacion`; `enlaces`: `{"a": id, "b": id, "wifi": true}`). En una tarea cuenta la
primera respuesta de cada correo y de cada riesgo.

```json
{ "formato": "superprofe/elemento@1", "tipo": "ciber", "titulo": "¿Es phishing?", "puntos": 10,
  "contenido": {
    "correos": [ { "de": "soporte@banco-seguro.example", "asunto": "Su cuenta será bloqueada",
      "cuerpo": "Verifique sus datos en las próximas 2 horas.", "enlace": "http://banco-seguro.example.verificar-datos.top/login",
      "phishing": true, "explicacion": "Urgencia, amenaza y un dominio que no es el del banco." } ],
    "contrasena": { "minimo": "fuerte" },
    "red": { "titulo": "Oficina pequeña",
      "nodos": [ { "id": "internet", "nombre": "Internet", "tipo": "internet", "x": 10, "y": 50 },
                 { "id": "router", "nombre": "Router", "tipo": "router", "x": 40, "y": 50,
                   "riesgo": { "pregunta": "El router tiene la contraseña de fábrica. ¿Qué haces?",
                               "opciones": ["Cambiarla por una fuerte y actualizar el firmware", "Nada"], "correcta": 0 } },
                 { "id": "pc", "nombre": "PC de recepción", "tipo": "pc", "x": 75, "y": 50 } ],
      "enlaces": [ { "a": "internet", "b": "router" }, { "a": "router", "b": "pc" } ] } } }
```

## Retos por bloques (`"tipo": "bloques"`, TIC)

Niveles (1–20) con un robot en una cuadrícula. `mapa`: filas de igual largo (máx. 12) con `#` (muro),
`.` (camino), `S` (salida) y `G` (meta); `direccion` inicial `N`, `E` (por defecto), `S` u `O`; `bloques`
disponibles: `avanzar`, `girar`, `repetir`, `mientras` (repetir hasta la meta) y `si` (si hay camino);
`maxBloques` opcional. El nivel se supera si el robot acaba en la meta sin chocar (y sin pasarse de bloques).

```json
{ "formato": "superprofe/elemento@1", "tipo": "bloques", "titulo": "El robot", "puntos": 10,
  "contenido": { "niveles": [
    { "id": "recto", "titulo": "En línea recta", "mapa": ["#####", "#S.G#", "#####"], "bloques": ["avanzar"] },
    { "id": "esquina", "titulo": "Doblar la esquina", "mapa": ["######", "#S...#", "####.#", "####G#", "######"],
      "bloques": ["avanzar", "girar", "repetir"], "maxBloques": 5 } ] } }
```

## Anatomía del PC (TIC I · Actividades de clase)

Es una actividad 3D del motor de «Actividades de clase» (`src/act/registro.js`, piezas en `src/kit3d/pc.js`):
se practica en TIC I → Laboratorio / Actividades de clase y se asigna como tarea desde su tarjeta.

## Encuentra la avería (`"tipo": "averia"`, EEE)

Un montaje del laboratorio de **Circuitos** con una avería escondida. `montaje` es el circuito tal cual lo
exporta Circuitos (botón Exportar; vale el archivo entero `{app, version, model}`, solo `model`, o el mismo
JSON escrito como texto). Se guarda como texto porque Firestore no admite listas dentro de listas.
`averia.elemento` es el id de un componente (`R1`, `L1`…) o de un cable (`w3`); `averia.tipo`:
`abierto` (no deja pasar la corriente), `corto` (une sus patas), `valor` (solo resistencias, con `valor` en Ω)
o `cable` (solo cables, cortado por dentro). `pistas` (hasta 6) se muestran una a una; `explicacion` se ve al
acertar en modo práctica. El alumno abre el circuito, mide con el polímetro (V, A, Ω y continuidad ·))) ),
señala el elemento y el tipo y entrega «Diagnóstico: R1 · … Aciertos: a/2» (1 por elemento, 1 por tipo);
en el laboratorio no ve si ha acertado. Si el montaje no tiene polímetro se añade uno.

```json
{ "formato": "superprofe/elemento@1", "tipo": "averia", "titulo": "El LED no luce", "puntos": 10,
  "contenido": {
    "enunciado": "El LED no se enciende. Inicia la simulación, mide y señala el elemento averiado.",
    "montaje": { "parts": [
        { "id": "B1", "type": "bat9", "pos": [-23, -5], "rot": 0, "props": {}, "state": {} },
        { "id": "R1", "type": "resistor", "at": "b10", "rot": 0, "props": { "r": 470 }, "state": {} },
        { "id": "L1", "type": "led", "at": "e14", "rot": 0, "props": { "color": "rojo" }, "state": {} } ],
      "wires": [ { "id": "w1", "a": "p:B1:+", "b": "h:tp2", "color": "rojo" }, { "id": "w2", "a": "p:B1:-", "b": "h:tn2", "color": "negro" },
                 { "id": "w3", "a": "h:tp9", "b": "h:a10", "color": "rojo" }, { "id": "w4", "a": "h:a15", "b": "h:tn15", "color": "negro" } ] },
    "averia": { "elemento": "R1", "tipo": "abierto" },
    "pistas": ["Mide la tensión en cada componente: el que se queda con toda la tensión de la pila está abierto."],
    "explicacion": "R1 está abierta: entre sus patas hay los 9 V de la pila y no circula corriente." } }
```

## Recuperación (`"tipo": "recuperacion"`)

Una tarea normal (instrucciones, adjuntos, puntos, fecha, rúbrica) que **solo ven algunos nº de lista**.
Los nº no van en el JSON: se escriben al editarla («Solo para los nº de lista», p. ej. `3, 7, 12`) junto con
los grupos. En Firestore se guarda `para` (los nº) y `visibleAl` (`grupo_nº`); `visible` queda vacío, así el
resto del grupo no la recibe ni puede abrirla con el enlace. Entrega y nota como cualquier tarea.

```json
{ "formato": "superprofe/elemento@1", "tipo": "recuperacion", "titulo": "Recuperación: práctica de soldadura",
  "texto": "Repite la práctica y entrega una foto del resultado.", "puntos": 10 }
```

## Proyecto en equipo (`"tipo": "piac"`)

Tablero del equipo (pendiente / en curso / hecho, con responsable por nº de lista y fecha), diario del
equipo y autoevaluación + coevaluación con rúbrica ponderada (escala 1–4 → nota sobre 10).
`criterios` (opcional, 1–8): `{ "id", "c", "peso", "autoria": true }`; uno tiene que ser de autoría. Si no se
pone, se usa la plantilla de 5 criterios (contenido 30 %, proceso 20 %, comunicación 20 %, herramientas y
fuentes 15 %, autoría 15 %). `equipos` (opcional, máx. 30): `{ "id", "nombre", "miembros": [nº…], "grupo"? }`.
Sin `grupo`, al guardar se asignan al grupo del elemento si solo hay uno; si no, el profesor los configura en
la página del elemento («Equipos»: una línea «Nombre: 1, 4, 7» por equipo y grupo). Solo nº de lista, nunca nombres.

```json
{ "formato": "superprofe/elemento@1", "tipo": "piac", "titulo": "Proyecto: estación meteorológica",
  "contenido": { "instrucciones": "Organizad el proyecto en el tablero y escribid el diario cada sesión.",
    "equipos": [ { "id": "e1", "nombre": "Equipo 1", "miembros": [1, 2, 3] },
                 { "id": "e2", "nombre": "Equipo 2", "miembros": [4, 5, 6] } ] } }
```
