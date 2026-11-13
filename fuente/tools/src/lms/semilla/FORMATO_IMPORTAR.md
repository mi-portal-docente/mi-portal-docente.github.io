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
