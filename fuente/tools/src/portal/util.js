export const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ¿Estamos dentro del horario? (misma cuenta que las reglas de Firestore)
// h = {dias: [1..7] (1 = lunes), desde, hasta (minutos), offset (minutos respecto a UTC)}
export function enHorario(h, ahora = Date.now()) {
  if (!h) return true;
  const t = new Date(ahora + (h.offset || 0) * 60000);
  const dia = t.getUTCDay() || 7; const m = t.getUTCHours() * 60 + t.getUTCMinutes();
  return (h.dias || []).includes(dia) && m >= h.desde && m < h.hasta;
}
// Desfase de Madrid (o del navegador) respecto a UTC en minutos: 60 en invierno, 120 en verano.
export const offsetLocal = () => -new Date().getTimezoneOffset();

export function conTimeout(p, ms) {
  let t; return Promise.race([p, new Promise((_, rej) => { t = setTimeout(() => rej({ timeout: true, code: 'timeout' }), ms); })]).finally(() => clearTimeout(t));
}
export const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
export const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
