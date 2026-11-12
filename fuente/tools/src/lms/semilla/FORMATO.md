# Semilla / importación de Classroom · formato `portal-docente/classroom@1`

Un archivo JSON por asignatura (`tic1`, `cdpc1`, `tic2`, `proy2`, `eee`). El portal lo usa para:
la **Biblioteca** (estructura de cada asignatura) y el botón **⬇ Importar de Classroom** del
«Trabajo de clase» (crea los temas y elementos en el curso escolar elegido; no duplica lo ya importado).
El profesor también puede importar un archivo propio con el mismo formato («Archivo JSON…»).

```json
{
  "formato": "portal-docente/classroom@1",
  "asignatura": "eee",
  "clase": "Equipos Eléctricos y Electrónicos (EEE) 2ºCFGB 26/27",
  "cursoEscolar": "26/27",
  "fuente": "de dónde sale",
  "temas": [
    { "id": "sin-tema", "nombre": "Sin tema", "sinTema": true, "items": [ … ] },
    { "id": "t02-sa-1-b1", "nombre": "SA 1- B1 (Tema 1,2,3,4)- Construimos nuestro tablero eléctrico.",
      "cursos": ["26/27"],
      "items": [
        { "id": "t02-sa-1-b1.06",
          "tipo": "tarea",            // tarea | cuestionario (formulario externo) | pregunta | material | examen (con «preguntas»)
          "titulo": "SA1 - Mi tablero eléctrico. Ejercicio 1 - Tema 1.",
          "estado": "publicado",      // publicado | borrador | programado (+ "programadoPara": "2026-11-20T08:00")
          "fechaEntrega": "2026-10-27T23:59",   // hora de Madrid, opcional
          "puntos": 100,              // opcional (sin puntos = sin calificar)
          "instrucciones": "Texto. **negrita**; saltos de línea con \n",
          "enlaces": [ { "titulo": "Presentación (PDF)", "url": "https://drive.google.com/…" },
                       { "titulo": "PDF en el portal", "url": "materiales/eee/sa1/archivo.pdf" } ],
          "rubrica": [ { "criterio": "Contenido", "puntos": 4 } ],
          "opciones": ["Sí", "No"],   // solo «pregunta»: opciones (vacío = respuesta corta)
          "preguntas": [ { "id": "q1", "tipo": "test", "enunciado": "…", "opciones": ["a","b"], "correcta": 1, "puntos": 1 } ],
          "cursos": ["25/26"],        // opcional: solo se importa en esos cursos
          "nota": "aviso para el profesor (se añade al final de las instrucciones)" } ] } ]
}
```

* Orden: el de los arrays (temas y elementos), igual que en Classroom.
* `borrador` se importa como borrador (los alumnos no lo ven). Lo publicado sin instrucciones ni
  adjuntos entra como «Borrador · sin contenido» hasta completarlo.
* Archivos alojados en la web: `materiales/<asignatura>/…` y enlace `materiales/…`.
* Regenerar desde la copia de Classroom: `node fuente/tools/importar-classroom.mjs <carpeta-de-la-copia>`
  (lee `contenido_<ASIG>_2627.md`; añade los extras de `extras.json`).
