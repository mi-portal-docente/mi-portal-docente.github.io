// Cables y conectores como objetos reales: tipos de cable, extremos y compatibilidad con cada terminal (puro, sin three.js).
import { PARTS } from './parts.js';

// Extremos de cable
export const END = {
  M: { name: 'macho (pin Dupont)', short: 'macho' },
  H: { name: 'hembra (Dupont)', short: 'hembra' },
  C: { name: 'pinza de cocodrilo', short: 'cocodrilo' },
  B: { name: 'clavija banana de 4 mm', short: 'banana' },
  S: { name: 'punta pelada de cable rígido', short: 'punta pelada' },
};
// Tipos de cable que puede elegir el alumno (orden = preferencia al elegir uno automáticamente)
export const WIRE_KINDS = {
  mm: { name: 'Dupont macho-macho', ends: ['M', 'M'], icon: 'M–M', desc: 'El más usado con la protoboard: un pin en cada punta.' },
  mh: { name: 'Dupont macho-hembra', ends: ['M', 'H'], icon: 'M–H', desc: 'Un pin para la protoboard y una hembra para meter en un pin macho (módulos, cabezales).' },
  hh: { name: 'Dupont hembra-hembra', ends: ['H', 'H'], icon: 'H–H', desc: 'Une dos pines macho entre sí (por ejemplo, módulo con módulo). No entra en la protoboard.' },
  rig: { name: 'Cable rígido (puente)', ends: ['S', 'S'], icon: '⌐¬', desc: 'Hilo de cobre rígido de 0,5 mm pelado en las puntas: queda plano y ordenado sobre la protoboard.' },
  cm: { name: 'Cocodrilo-macho', ends: ['C', 'M'], icon: '🐊–M', desc: 'Pinza para morder un borne o una lengüeta, y pin para la protoboard.' },
  cc: { name: 'Pinzas de cocodrilo', ends: ['C', 'C'], icon: '🐊–🐊', desc: 'Muerden bornes, lengüetas y patas metálicas. No entran en los agujeros.' },
  bb: { name: 'Banana-banana', ends: ['B', 'B'], icon: 'B–B', desc: 'Clavijas de 4 mm para los bornes de la fuente de laboratorio.' },
  bc: { name: 'Banana-cocodrilo', ends: ['B', 'C'], icon: 'B–🐊', desc: 'Clavija banana para la fuente y pinza para el otro extremo.' },
};
export const KIND_ORDER = Object.keys(WIRE_KINDS);
// Terminales: qué extremos aceptan
export const SOCKETS = {
  hole: { name: 'agujero de la protoboard', accepts: ['M', 'S'] },
  post: { name: 'borne de la fuente (banana de 4 mm)', accepts: ['B', 'C', 'S'] },
  lug: { name: 'terminal metálico (borne o lengüeta)', accepts: ['C'] },
  lead: { name: 'punta estañada del cable', accepts: ['C', 'H'] },
  pinM: { name: 'pin macho', accepts: ['H', 'C'] },
  pinF: { name: 'conector hembra', accepts: ['M'] },
};
const WHY = {
  hole: { H: 'un extremo hembra no se puede pinchar en la protoboard: sus agujeros ya son hembra, necesitas un extremo macho', C: 'una pinza de cocodrilo no entra en un agujero de la protoboard: sirve para morder bornes y lengüetas', B: 'una clavija banana es para los bornes de la fuente, no cabe en la protoboard' },
  post: { M: 'un pin Dupont no queda sujeto en el borne de la fuente: usa una banana, una pinza de cocodrilo o un cable pelado apretado en el borne', H: 'una hembra Dupont no encaja en el borne de la fuente' },
  lug: { M: 'un pin macho no se puede sujetar a un borne o lengüeta: usa una pinza de cocodrilo', H: 'una hembra Dupont no queda sujeta en este terminal: usa una pinza de cocodrilo', B: 'una banana no encaja en este terminal: usa una pinza de cocodrilo', S: 'un cable pelado no se sujeta aquí sin soldar: usa una pinza de cocodrilo' },
  lead: { M: 'macho con la punta de un cable no encaja: usa una hembra Dupont o una pinza de cocodrilo', B: 'una banana no encaja en la punta de un cable', S: 'dos cables pelados sin ficha ni soldadura no hacen buen contacto' },
  pinM: { M: 'macho con macho no encaja: necesitas un extremo hembra', B: 'una banana no encaja en un pin', S: 'un cable pelado no queda sujeto en un pin: usa una hembra Dupont' },
  pinF: { H: 'hembra con hembra no encaja: necesitas un extremo macho', C: 'una pinza no puede morder dentro de un conector hembra: usa un pin macho', B: 'una banana no encaja en un conector Dupont', S: 'mejor un pin macho: el cable pelado queda flojo' },
};

export function socketOf(key, model) {
  if (key.startsWith('h:')) return 'hole';
  const [, id, pin] = key.split(':'); const p = model?.parts?.find(x => x.id === id);
  if (!p) return 'lug';
  return PARTS[p.type].sockets?.[pin] || 'lug';
}
const ok = (sock, end) => SOCKETS[sock].accepts.includes(end);
// orientación: 0 = ends[0] en a, 1 = ends[1] en a, -1 = no encaja
export function fitKind(kind, sa, sb) {
  const k = WIRE_KINDS[kind]; if (!k) return -1;
  const [e0, e1] = k.ends;
  if (ok(sa, e0) && ok(sb, e1)) return 0;
  if (ok(sa, e1) && ok(sb, e0)) return 1;
  return -1;
}
export function canStart(kind, sa) { const k = WIRE_KINDS[kind]; return !!k && k.ends.some(e => ok(sa, e)); }
export function validKinds(sa, sb) { return KIND_ORDER.filter(k => fitKind(k, sa, sb) >= 0); }
export function startKinds(sa) { return KIND_ORDER.filter(k => canStart(k, sa)); }
export function bestKind(sa, sb, prefer) { if (prefer && fitKind(prefer, sa, sb) >= 0) return prefer; return validKinds(sa, sb)[0] || 'mm'; }
// Explicación de por qué no encaja
export function whyNot(kind, sa, sb) {
  const k = WIRE_KINDS[kind]; if (!k) return 'Tipo de cable desconocido.';
  const [e0, e1] = k.ends;
  // el extremo que falla en cada terminal (probando las dos orientaciones, nos quedamos con la que tiene un solo fallo)
  const opts = [[e0, e1], [e1, e0]].map(([x, y]) => [ok(sa, x) ? null : [sa, x], ok(sb, y) ? null : [sb, y]].filter(Boolean));
  const best = opts.sort((a, b) => a.length - b.length)[0];
  const msg = best.map(([s, e]) => WHY[s]?.[e] || `${END[e].short} no encaja en ${SOCKETS[s].name}`);
  const uniq = [...new Set(msg)];
  return uniq.map(m => m[0].toUpperCase() + m.slice(1)).join('. ') + '.';
}
export function kindLabel(kind) { return WIRE_KINDS[kind]?.name || 'Cable'; }
