// Códigos de grupo legibles: PALABRA-NÚMERO (p. ej. FARO-472). Sin tildes ni Ñ para dictarlos fácil.
export const PALABRAS = ('FARO LUNA ROCA NUBE PINO MONTE RIO MAR SOL OLA PUERTO ISLA CABO DUNA BRISA ROBLE ' +
  'TRUENO RAYO CHISPA CIRCUITO VOLTIO OHMIO AMPER BOBINA PILA CABLE MOTOR PALMA CEDRO SAUCE OLMO ACACIA ' +
  'LINCE ZORRO BUHO HALCON AGUILA DELFIN TORTUGA CIERVO GAMO TEJON NUTRIA GAVIOTA GARZA CIGUENA ' +
  'COMETA PLANETA ESTRELLA ORBITA SATURNO MARTE VENUS JUPITER ' +
  'TORRE MURO ARCO PUENTE CANAL MOLINO FAROL BRUJULA ANCLA VELA REMO BARCO ' +
  'NARANJA LIMON MANGO CEREZA MELON SANDIA UVA HIGO ' +
  'AZUL VERDE ROJO OCRE CORAL JADE AMBAR PERLA ONIX RUBI TOPACIO ' +
  'NORTE SUR ESTE OESTE ALBA OCASO NIEBLA ' +
  'PIANO FLAUTA TAMBOR GUITARRA VIOLIN ARPA ' +
  'DADO META RUTA SENDA PISTA ').trim().split(/\s+/).filter(w => w.length >= 3 && w.length <= 8);

export function nuevoCodigo(rnd = Math.random) {
  const w = PALABRAS[Math.floor(rnd() * PALABRAS.length)];
  const n = 100 + Math.floor(rnd() * 900);
  return `${w}-${n}`;
}

// Normaliza lo que escribe el alumno: mayúsculas, sin tildes, «faro 472» / «faro472» → «FARO-472».
export function normalizaCodigo(s) {
  let t = String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
  t = t.replace(/[\s_.\u2010-\u2015-]+/g, '-').replace(/^-+|-+$/g, '');
  const m = t.match(/^([A-Z]{3,8})-?([0-9]{2,4})$/);
  return m ? `${m[1]}-${m[2]}` : t;
}
export const formatoCodigo = (c) => /^[A-Z]{3,8}-[0-9]{2,4}$/.test(c);
