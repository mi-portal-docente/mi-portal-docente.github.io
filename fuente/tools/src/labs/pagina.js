// Página común de los laboratorios «ligeros» (p5.js, TIC…): portada con los retos de ejemplo y el modo
// libre, y la vista de un reto. Si el profesor asigna un reto como tarea (tipo «actividad» con el enlace
// del reto), el alumno ve «Entregar» y el resultado llega al cuaderno como el de las actividades 3D.
import { ic } from '../ui/iconos.js';

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const LABS = {};
// def: { asig, id, titulo, lucide, intro, retos: [{id, titulo, desc}], libre?: texto, abrir(nodo, reto|null, ctx) → {destruir} }
export function registrarLab(def) { LABS[`${def.asig}/${def.id}`] = def; return def; }
export const enlaceReto = (def, reto) => `#${def.asig}/${def.id}/${reto.id}`;

export class PaginaLab {
  constructor(host, def, sub, opts = {}) {
    this.host = host; this.def = def; this.opts = opts; this.ctl = null;
    host.className = 'screen labg'; const base = `#${def.asig}/${def.id}`;
    const reto = sub && sub !== 'libre' ? def.retos.find((r) => r.id === sub) : null;
    if (sub && sub !== 'libre' && !reto) { location.replace(base); return; }
    const vista = sub ? (reto ? reto.titulo : 'Modo libre') : '';
    host.innerHTML = `${opts.cabecera || ''}<nav class="crumbs static" aria-label="Estás en"><div><a href="#inicio">Inicio</a> › <a href="#asignaturas">Asignaturas</a> › <a href="#asig/${def.asig}/laboratorio">${esc(opts.asigCorto || def.asig)}</a> › ${vista ? `<a href="${base}">${esc(def.titulo)}</a> › <span aria-current="page">${esc(vista)}</span>` : `<span aria-current="page">${esc(def.titulo)}</span>`}</div><div class="prof">${opts.chip || ''}</div></nav>
      <main class="lg-wrap" id="lgMain"></main>`;
    this.main = host.querySelector('#lgMain'); this.base = base; this.sub = sub; this.reto = reto;
    this.pintar();
  }
  // Se llama al cargar o cambiar los datos del aula (tareas asignadas, entregas, notas)
  pintar() {
    const { def, opts, reto, main } = this;
    if (!this.sub) { this.portada(main, this.base); return; }
    const as = reto ? opts.asignacion?.(enlaceReto(def, reto)) : null; const asId = as?.itemId || null;
    if (this.ctl && this.asId === asId) { this.ctl.actualizar?.({ entregadoTexto: as?.texto || '', nota: as?.nota || null }); return; }
    this.ctl?.destruir?.(); this.asId = asId; main.innerHTML = '';
    const nodo = document.createElement('div'); main.appendChild(nodo);
    if (as) { const a = document.createElement('p'); a.className = 'lg-tarea'; a.innerHTML = `${ic('clipboard-list')} Este reto es una tarea de clase: <b>${esc(as.titulo)}</b>${as.fechaEntrega ? ` · entrega hasta ${esc(new Date(as.fechaEntrega).toLocaleDateString('es-ES'))}` : ''}.`; main.insertBefore(a, nodo); }
    this.ctl = def.abrir(nodo, reto, { rol: opts.esProfesor ? 'profesor' : 'alumno', titulo: reto ? `${def.titulo} · ${reto.titulo}` : def.titulo,
      tarea: asId, entregar: as ? (texto) => opts.entregar(as.itemId, texto) : null, entregadoTexto: as?.texto || '', nota: as?.nota || null });
  }
  portada(main, base) {
    const d = this.def; const prof = !!this.opts.esProfesor;
    main.innerHTML = `<div class="lg-hero"><div class="lg-ic" aria-hidden="true">${ic(d.lucide || 'microscope')}</div><div><h1>${esc(d.titulo)}</h1><p>${esc(d.intro)}</p></div></div>
      <div class="lg-grid">${d.libre ? `<a class="lg-card" href="${base}/libre"><h2>${ic('pencil')} Modo libre</h2><p>${esc(d.libre)}</p><span class="lg-go">Entrar ${ic('arrow-right')}</span></a>` : ''}
      ${d.retos.map((r) => { const est = this.opts.asignacion?.(enlaceReto(d, r)); return `<article class="lg-card"><h2>${ic('target')} ${esc(r.titulo)}</h2><p>${esc(r.desc || '')}</p>${est ? `<p class="lg-est">${ic('clipboard-list')} Tarea: ${est.entregado ? (est.nota ? `nota ${esc(est.nota)}` : 'entregada') : 'pendiente'}</p>` : ''}
        <div class="lg-acc"><a class="btn" href="${enlaceReto(d, r)}">${ic('play')} Abrir</a>${prof ? `<button type="button" class="btn sec" data-lg-asignar="${esc(r.id)}">${ic('send')} Asignar como tarea</button>` : ''}</div></article>`; }).join('')}</div>
      ${prof ? `<p class="muted lg-nota">${ic('info')} Al asignar un reto se crea una tarea en Trabajo de clase con el enlace al reto; lo que entregue cada alumno llega al cuaderno y con «Poner notas» se califica según los aciertos.</p>` : ''}`;
    if (this._portada) return; this._portada = true;
    main.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lg-asignar]'); if (!b) return; const r = d.retos.find((x) => x.id === b.dataset.lgAsignar); if (!r) return;
      this.opts.asignar?.({ asig: d.asig, titulo: `${d.titulo}: ${r.titulo}`, texto: `${r.desc || ''}\n\nAbre el reto, resuélvelo y pulsa **Entregar** al final. Puedes repetirlo y entregar de nuevo hasta que se califique.`, enlace: enlaceReto(d, r), tituloEnlace: `${r.titulo} (${d.titulo})` });
    });
  }
  destruir() { this.ctl?.destruir?.(); this.host.className = 'screen'; this.host.innerHTML = ''; }
}
