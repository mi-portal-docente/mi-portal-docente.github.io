// Genera src/ui/iconos-datos.js con los iconos de Lucide (licencia ISC) que usa el portal.
//   npm pack lucide-static && tar xzf lucide-static-*.tgz   →   LUCIDE=./package node iconos-gen.mjs
// Los iconos se copian dentro del código (SVG en línea): no se descarga nada en tiempo de ejecución.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.env.LUCIDE || '/tmp/luc/package';
const nodes = JSON.parse(readFileSync(join(dir, 'icon-nodes.json'), 'utf8'));
const ver = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).version;
// Emoji del texto → icono de línea (o punto de color «dot:<color>»). Los que no están aquí se ocultan.
export const MAPA = {
  '✔': 'check', '✓': 'check', '✅': 'circle-check', '☑': 'circle-check', '❌': 'circle-x', '✖': 'x', '✕': 'x', '✗': 'x', '⛔': 'ban',
  '⚡': 'zap', '⚠': 'triangle-exclamation-point', '❗': 'circle-exclamation-point', '❕': 'circle-exclamation-point', '❔': 'circle-question-mark', '❓': 'circle-question-mark',
  '📤': 'send', '📥': 'inbox', '🗑': 'trash', '⏱': 'timer', '⏰': 'alarm-clock', '⏳': 'hourglass', '⌛': 'hourglass', '🕘': 'clock', '🕒': 'clock', '🕐': 'clock',
  '🔌': 'plug', '⬇': 'download', '⬆': 'arrow-up', '✂': 'scissors', '🔍': 'search', '🔎': 'search', '💥': 'flame', '🔥': 'flame',
  '📚': 'library-big', '📖': 'book-open', '📘': 'book', '📗': 'book', '📙': 'book', '📕': 'book', '🗂': 'folder-open', '📂': 'folder-open', '📁': 'folder-open',
  '💾': 'save', '🔗': 'link', '📟': 'gauge', '🔧': 'wrench', '🛠': 'hammer', '🔨': 'hammer', '💡': 'lightbulb', '🧩': 'puzzle', '🪛': 'screw', '🔦': 'flashlight',
  '📏': 'ruler', '📐': 'drafting-compass', '🔩': 'bolt', '➕': 'plus', '➖': 'minus', '✏': 'pencil', '✎': 'pencil', '✍': 'pen-line', '📝': 'notebook-pen', '🧰': 'toolbox', '💼': 'briefcase',
  '🔬': 'microscope', '🧪': 'flask-conical', '📄': 'file-text', '📃': 'file-text', '👁': 'eye', '👀': 'eye', '🧤': 'hand', '🖐': 'hand', '✋': 'hand', '💬': 'message-circle', '🔔': 'bell',
  '📅': 'calendar', '📆': 'calendar', '🗓': 'calendar', '📋': 'clipboard-list', '⚙': 'settings', '📌': 'pin', '📍': 'map-pin', '🏠': 'house', '🏡': 'house', '⌂': 'house',
  '♻': 'recycle', '🔄': 'refresh-cw', '🔁': 'refresh-cw', '↻': 'rotate-cw', '↺': 'rotate-ccw', '⟲': 'rotate-ccw', '🔀': 'shuffle', '📎': 'paperclip', '🔊': 'volume-2', '🔇': 'volume-x', '🗄': 'archive',
  '🎉': 'party-popper', '🏷': 'tag', '📣': 'megaphone', '📢': 'megaphone', '👥': 'users', '👤': 'user', '📊': 'chart-column', '📈': 'chart-column', '⏸': 'pause', '▶': 'play', '◀': 'chevron-left', '⏹': 'square',
  '🔒': 'lock', '🔓': 'lock', '🔑': 'key', '🧹': 'brush-cleaning', '🔘': 'circle-dot', '🧵': 'cable', '🏁': 'flag', '🚩': 'flag', '🎯': 'target', '🏆': 'trophy', '🥇': 'trophy',
  '🚦': 'traffic-cone', '🧭': 'compass', '🛟': 'life-buoy', '⏻': 'power', '🥽': 'glasses', '🗜': 'wrench', '🔪': 'slice', '🎨': 'palette', '🌐': 'globe', '🧱': 'blocks', '🔢': 'binary', '🔐': 'shield-exclamation-point', '🎣': 'fish', '📡': 'router', '🛰': 'radio', '🗣': 'volume-2', '💪': 'biceps-flexed',
  '⭐': 'star', '🌟': 'star', '✦': 'sparkle', '✨': 'sparkles', '⛶': 'maximize', '🌡': 'thermometer', '🚧': 'construction', '🏗': 'construction', '🌱': 'sprout', '🌀': 'fan',
  '🤖': 'cpu', '🔤': 'type', '🎮': 'gamepad-2', '🍳': 'cooking-pot', '🚀': 'rocket', '💻': 'laptop', '🖥': 'monitor', '🖼': 'image', '🧠': 'brain', '🖱': 'mouse',
  '🎚': 'sliders-horizontal', '🧲': 'magnet', '🌑': 'moon', '🌙': 'moon', '☀': 'sun', '🐊': 'paperclip', '🔋': 'battery-charging', '📶': 'wifi', '🎓': 'graduation-cap', '🏫': 'school', '🅿': 'parking-meter', '➜': 'arrow-right',
  '🚪': 'door-open', 'ℹ': 'info', '🦺': 'hard-hat', '⛑': 'hard-hat', '🛡': 'shield-check', '📦': 'box', '✉': 'mail', '📧': 'mail', '🖨': 'printer', '📷': 'image', '📸': 'image',
  '🟢': 'dot:#34c759', '🔴': 'dot:#ff3b30', '🟡': 'dot:#ffcc00', '🟠': 'dot:#ff9500', '🔵': 'dot:#007aff', '⚪': 'dot:#e5e5ea', '⚫': 'dot:#1c1c1e', '🟣': 'dot:#af52de', '🟤': 'dot:#8e5b3a',
  '🟥': 'sq:#ff3b30', '🟦': 'sq:#007aff', '🟪': 'sq:#af52de', '🟩': 'sq:#34c759', '🟨': 'sq:#ffcc00', '🟧': 'sq:#ff9500', '⬜': 'sq:#e5e5ea', '⬛': 'sq:#1c1c1e', '🟫': 'sq:#8e5b3a',
};
// Iconos que usa el marcado directamente (cabeceras, barras de herramientas…), además de los del mapa.
const EXTRA = ['chevron-left', 'chevron-right', 'chevron-down', 'rotate-ccw', 'square-arrow-down', 'tags', 'maximize', 'log-out', 'arrow-right', 'arrow-left', 'layout-grid', 'circle-user', 'shield-check', 'eye', 'layers', 'undo-2', 'redo-2', 'rotate-cw', 'ellipsis', 'external-link', 'copy', 'graduation-cap', 'move-3d', 'scan-eye', 'arrow-down', 'arrow-up', 'chevron-up', 'radio', 'code', 'upload', 'presentation', 'kanban', 'binary', 'bug', 'blocks', 'globe', 'list-checks', 'calendar-days', 'repeat', 'notebook-text', 'terminal', 'hash', 'network', 'key-round', 'hard-drive', 'memory-stick', 'server', 'router', 'eye-off', 'table', 'copy-plus', 'square-kanban', 'circle-play', 'user-check', 'calculator', 'file-code', 'monitor-play', 'list-ordered', 'grip-vertical', 'mouse-pointer-click', 'video', 'copy', 'external-link', 'trash', 'download', 'plus', 'pencil', 'check', 'x', 'info', 'save', 'send', 'zap', 'eye', 'shuffle', 'archive', 'target', 'chart-column', 'triangle-exclamation-point', 'circle-check', 'circle-x', 'volume-2', 'square', 'play', 'graduation-cap', 'clipboard-list', 'file-text', 'folder-open', 'inbox', 'lightbulb', 'microscope', 'refresh-cw', 'users', 'user', 'calendar', 'megaphone', 'timer', 'flag', 'puzzle', 'wifi', 'image', 'link', 'star', 'lock', 'cpu', 'monitor', 'laptop', 'mail', 'shield-check', 'search', 'cloud', 'smartphone', 'cctv', 'shield-exclamation-point', 'fish', 'bot', 'mail-open', 'step-forward', 'corner-up-left', 'corner-up-right', 'arrow-big-up', 'square-check-big', 'ear', 'clipboard-check', 'kanban', 'calendar-days', 'gauge', 'cable', 'search-check', 'user-round-check', 'circle-stop', 'list-todo', 'book-open-check', 'circle-slash', 'circle-dashed', 'printer', 'message-square', 'rotate-ccw-clock', 'cloud-off', 'briefcase', 'ban', 'chevrons-left-right', 'file-down', 'letter-b', 'italic', 'heading-2', 'heading-3', 'list', 'square-code', 'table-2', 'image-plus', 'file-type', 'grid-3x3', 'box', 'chart-bar', 'sheet', 'database', 'eraser', 'arrow-left-right', 'message-square-plus', 'book-open', 'maximize-2', 'minimize-2', 'zoom-in', 'zoom-out', 'pilcrow', 'underline'];
const usados = [...new Set([...Object.values(MAPA).filter((v) => !/^(dot|sq):/.test(v)), ...EXTRA])].sort();
const falta = usados.filter((n) => !nodes[n]); if (falta.length) throw new Error('Iconos que no existen en Lucide: ' + falta.join(', '));
const svg = (n) => nodes[n].map(([tag, at]) => `<${tag} ${Object.entries(at).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
const out = `// Generado por iconos-gen.mjs — no editar a mano.
// Iconos de Lucide ${ver} (https://lucide.dev) · Licencia ISC: vendor/LICENCIAS-iconos.txt
export const ICONOS = ${JSON.stringify(Object.fromEntries(usados.map((n) => [n, svg(n)])), null, 0).replace(/","/g, '",\n"')};
export const MAPA = ${JSON.stringify(MAPA, null, 0).replace(/","/g, '",\n"')};
`;
writeFileSync(new URL('./src/ui/iconos-datos.js', import.meta.url), out);
console.log(usados.length + ' iconos, ' + Object.keys(MAPA).length + ' emoji');
