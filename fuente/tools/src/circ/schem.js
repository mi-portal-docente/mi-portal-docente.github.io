// Símbolos eléctricos (norma UNE-EN 60617 / IEC) en SVG para los esquemas de las prácticas.
const S = 'stroke="#12343a" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const T = (x, y, t, a = 'middle', c = '#0f5e66') => `<text x="${x}" y="${y}" font-size="12.5" font-weight="700" fill="${c}" text-anchor="${a}">${t}</text>`;
const rotG = (x, y, v, body) => v ? `<g transform="rotate(90 ${x} ${y})">${body}</g>` : body;
// Todos los símbolos: horizontales con bornes en (x−30, y) y (x+30, y); v=true los gira 90° (bornes arriba/abajo)
export const sym = {
  bat: (x, y, v, lab) => rotG(x, y, v, `<path ${S} d="M${x - 30} ${y}H${x - 4}M${x + 4} ${y}H${x + 30}"/><path stroke="#12343a" stroke-width="2.6" d="M${x - 4} ${y - 14}V${y + 14}"/><path stroke="#12343a" stroke-width="5" d="M${x + 4} ${y - 7}V${y + 7}"/>${T(x - 12, y - 18, '+', 'middle', '#d23')}`) + (lab ? T(v ? x - 22 : x, v ? y + 4 : y + 30, lab, v ? 'end' : 'middle') : ''),
  res: (x, y, v, lab) => rotG(x, y, v, `<path ${S} d="M${x - 30} ${y}H${x - 16}M${x + 16} ${y}H${x + 30}"/><rect ${S} x="${x - 16}" y="${y - 6}" width="32" height="12"/>`) + (lab ? T(v ? x + 14 : x, v ? y + 4 : y - 12, lab, v ? 'start' : 'middle') : ''),
  lamp: (x, y, v, lab) => rotG(x, y, v, `<path ${S} d="M${x - 30} ${y}H${x - 12}M${x + 12} ${y}H${x + 30}"/><circle ${S} cx="${x}" cy="${y}" r="12"/><path ${S} d="M${x - 8.5} ${y - 8.5}L${x + 8.5} ${y + 8.5}M${x + 8.5} ${y - 8.5}L${x - 8.5} ${y + 8.5}"/>`) + (lab ? T(v ? x + 18 : x, v ? y + 4 : y - 17, lab, v ? 'start' : 'middle') : ''),
  led: (x, y, v, lab) => rotG(x, y, v, `<path ${S} d="M${x - 30} ${y}H${x - 8}M${x + 8} ${y}H${x + 30}"/><path ${S} d="M${x - 8} ${y - 9}L${x + 8} ${y}L${x - 8} ${y + 9}Z" fill="#fff"/><path ${S} d="M${x + 8} ${y - 10}V${y + 10}"/><path ${S} d="M${x + 1} ${y - 12}l6 -8m-4 0h4v4M${x + 7} ${y - 9}l6 -8m-4 0h4v4"/>`) + (lab ? T(v ? x + 16 : x, v ? y + 4 : y + 28, lab, v ? 'start' : 'middle') : ''),
  sw: (x, y, v, lab) => rotG(x, y, v, `<path ${S} d="M${x - 30} ${y}H${x - 12}L${x + 10} ${y - 12}M${x + 12} ${y}H${x + 30}"/><circle cx="${x - 12}" cy="${y}" r="2.5" fill="#12343a"/><circle cx="${x + 12}" cy="${y}" r="2.5" fill="#12343a"/>`) + (lab ? T(v ? x + 16 : x, v ? y + 4 : y + 20, lab, v ? 'start' : 'middle') : ''),
  // conmutador: común a la izquierda (x−30,y); extremos a la derecha (x+30,y−16) y (x+30,y+16)
  spdt: (x, y, lab, flip) => { const d = flip ? -1 : 1; return `<path ${S} d="M${x - 30 * d} ${y}H${x - 10 * d}L${x + 10 * d} ${y - 10}M${x + 12 * d} ${y - 16}H${x + 30 * d}M${x + 12 * d} ${y + 16}H${x + 30 * d}"/><circle cx="${x - 10 * d}" cy="${y}" r="2.5" fill="#12343a"/><circle cx="${x + 12 * d}" cy="${y - 16}" r="2.5" fill="#12343a"/><circle cx="${x + 12 * d}" cy="${y + 16}" r="2.5" fill="#12343a"/>` + (lab ? T(x, y + 34, lab) : ''); },
  // potenciómetro horizontal con cursor hacia arriba (x, y−30)
  pot: (x, y, lab) => `<path ${S} d="M${x - 30} ${y}H${x - 16}M${x + 16} ${y}H${x + 30}"/><rect ${S} x="${x - 16}" y="${y - 6}" width="32" height="12"/><path ${S} d="M${x} ${y - 30}V${y - 8}m-5 -6l5 6l5 -6"/>` + (lab ? T(x, y + 24, lab) : ''),
  ldr: (x, y, v, lab) => rotG(x, y, v, `<path ${S} d="M${x - 30} ${y}H${x - 16}M${x + 16} ${y}H${x + 30}"/><rect ${S} x="${x - 16}" y="${y - 6}" width="32" height="12"/><path ${S} d="M${x - 14} ${y - 24}l8 10m-1 -5v5h-5M${x - 4} ${y - 26}l8 10m-1 -5v5h-5"/>`) + (lab ? T(v ? x + 14 : x, v ? y + 4 : y + 24, lab, v ? 'start' : 'middle') : ''),
  buzz: (x, y, v, lab) => rotG(x, y, v, `<path ${S} d="M${x - 30} ${y}H${x - 10}M${x + 10} ${y}H${x + 30}"/><path ${S} d="M${x - 10} ${y}V${y - 8}H${x + 10}V${y}"/><path ${S} d="M${x - 10} ${y - 8}A10 10 0 0 1 ${x + 10} ${y - 8}"/>${T(x - 16, y - 8, '+', 'middle', '#d23')}`) + (lab ? T(v ? x + 16 : x, v ? y + 4 : y + 20, lab, v ? 'start' : 'middle') : ''),
  meter: (x, y, v, l, lab) => rotG(x, y, v, `<path ${S} d="M${x - 30} ${y}H${x - 13}M${x + 13} ${y}H${x + 30}"/><circle ${S} cx="${x}" cy="${y}" r="13" fill="#fff"/>`) + `<text x="${x}" y="${y + 5}" font-size="15" font-weight="700" fill="#12343a" text-anchor="middle">${l}</text>` + (lab ? T(v ? x + 18 : x, v ? y + 4 : y - 18, lab, v ? 'start' : 'middle') : ''),
  // pulsador NA: bornes en (x−30, y) y (x+30, y)
  push: (x, y, v, lab) => rotG(x, y, v, `<path ${S} d="M${x - 30} ${y}H${x - 12}M${x + 12} ${y}H${x + 30}M${x - 14} ${y - 10}H${x + 14}M${x} ${y - 10}V${y - 22}M${x - 6} ${y - 22}H${x + 6}"/><circle cx="${x - 12}" cy="${y}" r="2.5" fill="#12343a"/><circle cx="${x + 12}" cy="${y}" r="2.5" fill="#12343a"/>`) + (lab ? T(v ? x + 16 : x, v ? y + 4 : y + 20, lab, v ? 'start' : 'middle') : ''),
  // bobina de relé (rectángulo con diagonal) vertical, bornes (x, y−30) y (x, y+30)
  coil: (x, y, lab) => `<path ${S} d="M${x} ${y - 30}V${y - 12}M${x} ${y + 12}V${y + 30}"/><rect ${S} x="${x - 9}" y="${y - 12}" width="18" height="24"/><path ${S} d="M${x - 9} ${y + 12}L${x + 9} ${y - 12}"/>` + (lab ? T(x - 14, y + 4, lab, 'end') : ''),
  diodeV: (x, y, up) => { const d = up ? -1 : 1; return `<path ${S} d="M${x} ${y - 30}V${y + 30}"/><path ${S} d="M${x - 8} ${y - 6 * d}H${x + 8}L${x} ${y + 6 * d}Z" fill="#fff"/><path ${S} d="M${x - 8} ${y + 6 * d}H${x + 8}"/>`; },
  dash: (d) => `<path stroke="#12343a" stroke-width="1.6" stroke-dasharray="5 4" fill="none" d="${d}"/>`,
  dot: (x, y) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#12343a"/>`,
  w: (d) => `<path ${S} d="${d}"/>`,
  txt: T,
};
export const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" class="c-schem" font-family="system-ui, Segoe UI, Arial, sans-serif">${body}</svg>`;
