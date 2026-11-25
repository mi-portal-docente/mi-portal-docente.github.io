import { calcularAjuste, ajustesDe } from './src/lms/ajustes.js';
import assert from 'node:assert';
const P=[{id:'a',tipo:'test',puntos:1},{id:'b',tipo:'vf',puntos:1},{id:'c',tipo:'corta',puntos:2}];
const K={a:1,b:true,c:['ohm']}; const R={a:0,b:true,c:'ohmio'};
const ex={preguntas:P,claves:K,respuestas:R};
// sin nota previa
let r=calcularAjuste(ex,null,'c',2); assert.equal(r.datos.nota,7.5); assert.deepEqual(ajustesDe(r.datos.detalle),['c']);
let nt={...r.datos}; r=calcularAjuste(ex,nt,'c',null); assert.equal(r.datos.nota,2.5); assert.equal(Object.keys(r.datos.detalle).filter(k=>k.startsWith('aj:')).length,0);
// con nota previa a mano 3 (auto 2.5)
const nt0={nota:3,publicada:true,detalle:{a:0,b:1,c:0}};
r=calcularAjuste(ex,nt0,'a',1); assert.equal(r.datos.nota,5.5); assert.equal(r.datos.publicada,true);
r=calcularAjuste(ex,{...nt0,...r.datos},'c',1); assert.equal(r.datos.nota,8);
let n2={...nt0,...r.datos}; r=calcularAjuste(ex,n2,'a',null); n2={...n2,...r.datos}; r=calcularAjuste(ex,n2,'c',null);
assert.equal(r.datos.nota,3); assert.deepEqual(r.datos.detalle,{a:0,b:1,c:0});
console.log('ajustes OK');
