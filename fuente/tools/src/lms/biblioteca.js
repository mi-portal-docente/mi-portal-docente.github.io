// Biblioteca de asignaturas del portal. La estructura de cada asignatura (temas en el mismo orden y con
// los mismos nombres que en «Trabajo de clase» de Google Classroom, y los elementos de cada tema) sale de
// los archivos de semilla lms/semilla/<asignatura>.json (formato «portal-docente/classroom@1», ver
// lms/semilla/FORMATO.md). Donde todavía no tenemos el documento original, el elemento lleva
// «pendiente: true» y la web muestra «Contenido pendiente de subir».
import S_TIC1 from './semilla/tic1.json' with { type: 'json' };
import S_CDPC1 from './semilla/cdpc1.json' with { type: 'json' };
import S_TIC2 from './semilla/tic2.json' with { type: 'json' };
import S_PROY2 from './semilla/proy2.json' with { type: 'json' };
import S_EEE from './semilla/eee.json' with { type: 'json' };

export const TIPOS = {
  material: { nombre: 'Material', icon: '📄', cat: null },
  tarea: { nombre: 'Tarea', icon: '📝', cat: 'tareas' },
  pregunta: { nombre: 'Pregunta', icon: '❔', cat: 'tareas' },
  examen: { nombre: 'Tarea de cuestionario', icon: '🧪', cat: 'examenes' },
  cuestionario: { nombre: 'Cuestionario (formulario)', icon: '❓', cat: 'examenes' },
  actividad: { nombre: 'Actividad', icon: '🧩', cat: 'tareas' },
  practica: { nombre: 'Práctica', icon: '🔧', cat: 'practicas' },
  proyecto: { nombre: 'Proyecto', icon: '🚀', cat: 'proyectos' },
  explicacion: { nombre: 'Explicación interactiva', icon: '🎓', cat: 'tareas' },
  p5: { nombre: 'Laboratorio p5.js', icon: '🎨', cat: 'tareas' },
  web: { nombre: 'Editor web en vivo', icon: '🌐', cat: 'tareas' },
  info: { nombre: 'Representación de la información', icon: '🔢', cat: 'tareas' },
  ciber: { nombre: 'Ciberseguridad', icon: '🔐', cat: 'tareas' },
  bloques: { nombre: 'Retos por bloques', icon: '🧱', cat: 'tareas' },
  averia: { nombre: 'Encuentra la avería', icon: '🔧', cat: 'practicas' },
  recuperacion: { nombre: 'Recuperación', icon: '🔁', cat: 'tareas' },
  piac: { nombre: 'Proyecto en equipo (PIAC)', icon: '👥', cat: 'proyectos' },
};
export const CATEGORIAS = [
  { id: 'examenes', nombre: 'Exámenes y cuestionarios', peso: 40 },
  { id: 'tareas', nombre: 'Tareas y actividades', peso: 30 },
  { id: 'proyectos', nombre: 'Proyectos', peso: 20 },
  { id: 'practicas', nombre: 'Prácticas', peso: 10 },
];
export const ETAPAS = ['Bachillerato', 'CFGB'];
export const SEMILLAS = { tic1: S_TIC1, cdpc1: S_CDPC1, tic2: S_TIC2, proy2: S_PROY2, eee: S_EEE };

const META = [
  { id: 'tic1', foto: 'img/fotos/tic1.webp', nombre: 'Tecnologías de la Información y la Comunicación I', corto: 'T.I.Cs 1º Bach', etapa: 'Bachillerato', curso: '1º Bachillerato', icon: '💻', color: '#1f6feb',
    desc: 'Ofimática para el trabajo académico, sociedad de la información, hoja de cálculo y análisis de datos, y cómo funciona el mundo conectado.' },
  { id: 'cdpc1', foto: 'img/fotos/cdpc1.webp', nombre: 'Creación digital y pensamiento computacional', corto: 'Creación digital 1º Bach', etapa: 'Bachillerato', curso: '1º Bachillerato', icon: '🎨', color: '#8250df',
    desc: 'Inteligencia artificial generativa, ciberseguridad y programación creativa con p5.js.' },
  { id: 'tic2', foto: 'img/fotos/tic2.webp', nombre: 'Tecnologías de la Información y la Comunicación II', corto: 'TIC II 2º Bach', etapa: 'Bachillerato', curso: '2º Bachillerato', icon: '🖥️', color: '#0f766e',
    desc: 'Sociedad digital y el mundo del software.' },
  { id: 'proy2', foto: 'img/fotos/proy2.webp', nombre: 'Proyecto', corto: 'Proyecto 2º CFGB', etapa: 'CFGB', curso: '2º CFGB', icon: '🏗️', color: '#b45309',
    desc: 'Del proyecto de empresa a la maqueta: investigación, planificación, construcción y presentación (Expoeduca).' },
  { id: 'eee', foto: 'img/fotos/eee.webp', nombre: 'Equipos eléctricos y electrónicos', corto: 'EEE 2º CFGB', codigo: '3015', etapa: 'CFGB', curso: '2º CFGB', icon: '⚡', color: '#DC001B', labs: true,
    desc: 'Electricidad y electrónica básica, componentes, motores y electrodomésticos, laboratorio y programación. Incluye los laboratorios 3D: ESP32, circuitos e instalación de vivienda.' },
];
const TIPOS_SEMILLA = ['material', 'tarea', 'pregunta', 'cuestionario', 'examen'];
// Convierte un elemento de la semilla al formato de la biblioteca.
export function itemDeSemilla(asig, t, it) {
  const loc = String(it.id || '').startsWith(t.id + '.') ? it.id.slice(t.id.length + 1) : it.id;
  const enlaces = (it.enlaces || []).map((e) => ({ t: e.titulo || '', u: e.url || '' })).filter((e) => e.u);
  const texto = it.instrucciones || '';
  return {
    id: `${asig}.${t.id}.${loc}`, local: it.id, tipo: TIPOS_SEMILLA.includes(it.tipo) ? it.tipo : 'tarea', titulo: String(it.titulo || 'Sin título').slice(0, 150),
    texto, enlaces, puntos: it.puntos ?? null, estado: it.estado || 'publicado', fechaEntrega: it.fechaEntrega || null, rubrica: (it.rubrica || []).map((r) => ({ c: r.criterio, p: r.puntos })),
    opciones: it.opciones || null, preguntas: it.preguntas || null, nota: it.nota || '', desc: it.nota || texto.slice(0, 240), cursos: it.cursos || t.cursos || null,
    pendiente: it.pendiente ?? (!texto && !enlaces.length && !it.real),
  };
}
export function unidadesDeSemilla(s) {
  return (s.temas || []).map((t) => ({ id: t.id, titulo: t.nombre, sinTema: !!t.sinTema, cursos: t.cursos || null, archivo: !!t.anterior, lab: t.lab || null, items: (t.items || []).map((it) => itemDeSemilla(s.asignatura, t, it)) }));
}
export const BIBLIOTECA = META.map((m) => ({ ...m, cursos: ['25/26', '26/27'], semilla: SEMILLAS[m.id], unidades: unidadesDeSemilla(SEMILLAS[m.id]) }));

export const asignatura = (id) => BIBLIOTECA.find((a) => a.id === id) || null;
export function itemBiblioteca(id) {
  const [aid, uid] = String(id).split('.');
  const u = asignatura(aid)?.unidades.find((x) => x.id === uid);
  return u?.items.find((x) => x.id === id) || null;
}
export const cuentaItems = (a) => a.unidades.reduce((n, u) => n + u.items.length, 0);
