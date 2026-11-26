// PIAC SA1 T4 · «Despacho virtual»: tablero de planificación semanal con etiquetas arrastrables.
// contenido: { dias, horario "8:00-22:00", viaje_min, prioridad, empresas: [{ id, nombre, personal, recursos, trabajos, llamadas }] }
// Se entrega como un trabajo (trabajos/{id}.doc = JSON del tablero) y se califica con la rúbrica del portal.
import { registrarMotor } from '../elemento.js';
import { validarDespacho } from '../despacho.js';

registrarMotor('despacho', {
  nombre: 'Despacho virtual (tablero de planificación)', validar: validarDespacho, entregable: true, despacho: true,
  resumen: (c) => `${c.empresas.length} empresa${c.empresas.length === 1 ? '' : 's'} · ${c.empresas.reduce((s, e) => s + e.trabajos.length, 0)} trabajos · ${c.empresas.reduce((s, e) => s + e.llamadas.length, 0)} llamadas`,
  ejemplo: {
    dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'], horario: '8:00-22:00', viaje_min: 30, prioridad: ['Urgencias primero'],
    empresas: [{ id: 'e1', nombre: 'Empresa de ejemplo', personal: [{ codigo: 'P1', rol: 'Técnico/a', turno: 'Mañana' }, { codigo: 'P2', rol: 'Ayudante', turno: 'Tarde' }], recursos: ['Furgoneta'],
      trabajos: [{ id: 'T01', cliente: 'Cliente A', trabajo: 'Revisión', perfil: 'Técnico/a', personas: 1, horas: 1.5, ventana: '9:00-13:00', dia: 'Lunes', recurso: 'Furgoneta' }],
      llamadas: [{ cuando: 'Lunes 10:00', texto: 'El cliente A pide cambiar la cita al martes.', tipo: 'Cambio del cliente' }] }],
  },
});
