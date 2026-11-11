(()=>{var vt=(i,e,t)=>()=>{if(t)throw t[0];try{return i&&(e=i(i=0)),e}catch(n){throw t=[n],n}};var om=(i,e)=>()=>{try{return e||i((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}};var Hr,_l,Sl,Ou=vt(()=>{Hr={ciclo:"CFGB Inform\xE1tica y Comunicaciones"},_l=[{id:"eee",codigo:"3015",nombre:"Equipos el\xE9ctricos y electr\xF3nicos",profesor:"Pablo Mateos Lema",icon:"\u26A1",active:!0,desc:"Dos apartados: proyectos paso a paso en 3D con la placa ESP32 Plus y un laboratorio de circuitos 3D para montar, simular y medir en la protoboard."}],Sl={eee:[{id:"esp32",nombre:"ESP32",icon:"\u{1F916}",color:"#DC001B",active:!0,desc:"8 proyectos paso a paso en 3D con la placa ESP32 Plus y el kit de sensores: sem\xE1foro, timbre, farola, term\xF3metro, aparcamiento, barrera, riego y ventilador.",tags:["8 proyectos","Programaci\xF3n Arduino","Sensores y actuadores"]},{id:"circuitos",nombre:"Circuitos",icon:"\u{1F50C}",color:"#0f5e66",active:!0,desc:"Laboratorio 3D para montar circuitos en la protoboard, simularlos y medir con el pol\xEDmetro: pilas, resistencias, LED, bombillas, interruptores, motores\u2026",tags:["9 pr\xE1cticas guiadas","Modo libre","Pol\xEDmetro V \xB7 A \xB7 \u03A9"]}]}});function si(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(on[i&255]+on[i>>8&255]+on[i>>16&255]+on[i>>24&255]+"-"+on[e&255]+on[e>>8&255]+"-"+on[e>>16&15|64]+on[e>>24&255]+"-"+on[t&63|128]+on[t>>8&255]+"-"+on[t>>16&255]+on[t>>24&255]+on[n&255]+on[n>>8&255]+on[n>>16&255]+on[n>>24&255]).toLowerCase()}function Wt(i,e,t){return Math.max(e,Math.min(t,i))}function Od(i,e){return(i%e+e)%e}function qm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Xm(i,e,t){return i!==e?(t-i)/(e-i):0}function ta(i,e,t){return(1-t)*i+t*e}function Ym(i,e,t,n){return ta(i,e,1-Math.exp(-t*n))}function Zm(i,e=1){return e-Math.abs(Od(i,e*2)-e)}function Jm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Km(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Qm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function e0(i,e){return i+Math.random()*(e-i)}function t0(i){return i*(.5-Math.random())}function n0(i){i!==void 0&&(Gu=i);let e=Gu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function i0(i){return i*ea}function s0(i){return i*la}function r0(i){return(i&i-1)===0&&i!==0}function a0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function o0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function l0(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),d=a((e+n)/2),u=r((e-n)/2),h=a((e-n)/2),p=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*d,l*u,l*h,o*c);break;case"YZY":i.set(l*h,o*d,l*u,o*c);break;case"ZXZ":i.set(l*u,l*h,o*d,o*c);break;case"XZX":i.set(o*d,l*m,l*p,o*c);break;case"YXY":i.set(l*p,o*d,l*m,o*c);break;case"ZYZ":i.set(l*m,l*p,o*d,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function $n(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function xt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}function hp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ro(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function c0(){let i=Ro("canvas");return i.style.display="block",i}function Kr(i){i in $u||($u[i]=!0,console.warn(i))}function d0(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function u0(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function h0(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}function Mi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function dr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function Al(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Gc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}function Cl(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){rs.fromArray(i,r);let o=s.x*Math.abs(rs.x)+s.y*Math.abs(rs.y)+s.z*Math.abs(rs.z),l=e.dot(rs),c=t.dot(rs),d=n.dot(rs);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}function Hl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function E0(i,e,t,n,s,r,a,o){let l;if(e.side===bn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===$i,o),l===null)return null;io.copy(o),io.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(io);return c<t.near||c>t.far?null:{distance:c,point:io.clone(),object:i}}function so(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Qa),i.getVertexPosition(l,eo),i.getVertexPosition(c,to);let d=E0(i,e,t,n,Qa,eo,to,oh);if(d){let u=new E;Hi.getBarycoord(oh,Qa,eo,to,u),s&&(d.uv=Hi.getInterpolatedAttribute(s,o,l,c,u,new K)),r&&(d.uv1=Hi.getInterpolatedAttribute(r,o,l,c,u,new K)),a&&(d.normal=Hi.getInterpolatedAttribute(a,o,l,c,u,new E),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new E,materialIndex:0};Hi.getNormal(Qa,eo,to,h.normal),d.face=h,d.barycoord=u}return d}function br(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function hn(i){let e={};for(let t=0;t<i.length;t++){let n=br(i[t]);for(let s in n)e[s]=n[s]}return e}function w0(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function fp(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}function mp(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function I0(i){let e=new WeakMap;function t(o,l){let c=o.array,d=o.usage,u=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,d),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let d=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,d);else{u.sort((p,m)=>p.start-m.start);let h=0;for(let p=1;p<u.length;p++){let m=u[h],b=u[p];b.start<=m.start+m.count+1?m.count=Math.max(m.count,b.start+b.count-m.start):(++h,u[h]=b)}u.length=h+1;for(let p=0,m=u.length;p<m;p++){let b=u[p];i.bufferSubData(c,b.start*d.BYTES_PER_ELEMENT,d,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}function hv(i,e,t,n,s,r,a){let o=new Be(0),l=r===!0?0:1,c,d,u=null,h=0,p=null;function m(A){let S=A.isScene===!0?A.background:null;return S&&S.isTexture&&(S=(A.backgroundBlurriness>0?t:e).get(S)),S}function b(A){let S=!1,y=m(A);y===null?f(o,l):y&&y.isColor&&(f(y,1),S=!0);let L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,a):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(A,S){let y=m(S);y&&(y.isCubeTexture||y.mapping===nl)?(d===void 0&&(d=new Oe(new Xt(1,1,1),new oi({name:"BackgroundCubeMaterial",uniforms:br(ti.backgroundCube.uniforms),vertexShader:ti.backgroundCube.vertexShader,fragmentShader:ti.backgroundCube.fragmentShader,side:bn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(L,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),ls.copy(S.backgroundRotation),ls.x*=-1,ls.y*=-1,ls.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ls.y*=-1,ls.z*=-1),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(uv.makeRotationFromEuler(ls)),d.material.toneMapped=ot.getTransfer(y.colorSpace)!==yt,(u!==y||h!==y.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,u=y,h=y.version,p=i.toneMapping),d.layers.enableAll(),A.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Oe(new Ht(2,2),new oi({name:"BackgroundMaterial",uniforms:br(ti.background.uniforms),vertexShader:ti.background.vertexShader,fragmentShader:ti.background.fragmentShader,side:$i,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=ot.getTransfer(y.colorSpace)!==yt,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||h!==y.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,h=y.version,p=i.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function f(A,S){A.getRGB(ao,fp(i)),n.buffers.color.setClear(ao.r,ao.g,ao.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(A,S=1){o.set(A),l=S,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(A){l=A,f(o,l)},render:b,addToRenderList:g}}function pv(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(x,P,F,U,B){let j=!1,k=u(U,F,P);r!==k&&(r=k,c(r.object)),j=p(x,U,F,B),j&&m(x,U,F,B),B!==null&&e.update(B,i.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,y(x,P,F,U),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function d(x){return i.deleteVertexArray(x)}function u(x,P,F){let U=F.wireframe===!0,B=n[x.id];B===void 0&&(B={},n[x.id]=B);let j=B[P.id];j===void 0&&(j={},B[P.id]=j);let k=j[U];return k===void 0&&(k=h(l()),j[U]=k),k}function h(x){let P=[],F=[],U=[];for(let B=0;B<t;B++)P[B]=0,F[B]=0,U[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:U,object:x,attributes:{},index:null}}function p(x,P,F,U){let B=r.attributes,j=P.attributes,k=0,ee=F.getAttributes();for(let G in ee)if(ee[G].location>=0){let ve=B[G],we=j[G];if(we===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(we=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(we=x.instanceColor)),ve===void 0||ve.attribute!==we||we&&ve.data!==we.data)return!0;k++}return r.attributesNum!==k||r.index!==U}function m(x,P,F,U){let B={},j=P.attributes,k=0,ee=F.getAttributes();for(let G in ee)if(ee[G].location>=0){let ve=j[G];ve===void 0&&(G==="instanceMatrix"&&x.instanceMatrix&&(ve=x.instanceMatrix),G==="instanceColor"&&x.instanceColor&&(ve=x.instanceColor));let we={};we.attribute=ve,ve&&ve.data&&(we.data=ve.data),B[G]=we,k++}r.attributes=B,r.attributesNum=k,r.index=U}function b(){let x=r.newAttributes;for(let P=0,F=x.length;P<F;P++)x[P]=0}function g(x){f(x,0)}function f(x,P){let F=r.newAttributes,U=r.enabledAttributes,B=r.attributeDivisors;F[x]=1,U[x]===0&&(i.enableVertexAttribArray(x),U[x]=1),B[x]!==P&&(i.vertexAttribDivisor(x,P),B[x]=P)}function A(){let x=r.newAttributes,P=r.enabledAttributes;for(let F=0,U=P.length;F<U;F++)P[F]!==x[F]&&(i.disableVertexAttribArray(F),P[F]=0)}function S(x,P,F,U,B,j,k){k===!0?i.vertexAttribIPointer(x,P,F,B,j):i.vertexAttribPointer(x,P,F,U,B,j)}function y(x,P,F,U){b();let B=U.attributes,j=F.getAttributes(),k=P.defaultAttributeValues;for(let ee in j){let G=j[ee];if(G.location>=0){let de=B[ee];if(de===void 0&&(ee==="instanceMatrix"&&x.instanceMatrix&&(de=x.instanceMatrix),ee==="instanceColor"&&x.instanceColor&&(de=x.instanceColor)),de!==void 0){let ve=de.normalized,we=de.itemSize,Xe=e.get(de);if(Xe===void 0)continue;let pt=Xe.buffer,X=Xe.type,ie=Xe.bytesPerElement,Ae=X===i.INT||X===i.UNSIGNED_INT||de.gpuType===Td;if(de.isInterleavedBufferAttribute){let oe=de.data,Ve=oe.stride,$e=de.offset;if(oe.isInstancedInterleavedBuffer){for(let He=0;He<G.locationSize;He++)f(G.location+He,oe.meshPerAttribute);x.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let He=0;He<G.locationSize;He++)g(G.location+He);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let He=0;He<G.locationSize;He++)S(G.location+He,we/G.locationSize,X,ve,Ve*ie,($e+we/G.locationSize*He)*ie,Ae)}else{if(de.isInstancedBufferAttribute){for(let oe=0;oe<G.locationSize;oe++)f(G.location+oe,de.meshPerAttribute);x.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let oe=0;oe<G.locationSize;oe++)g(G.location+oe);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let oe=0;oe<G.locationSize;oe++)S(G.location+oe,we/G.locationSize,X,ve,we*ie,we/G.locationSize*oe*ie,Ae)}}else if(k!==void 0){let ve=k[ee];if(ve!==void 0)switch(ve.length){case 2:i.vertexAttrib2fv(G.location,ve);break;case 3:i.vertexAttrib3fv(G.location,ve);break;case 4:i.vertexAttrib4fv(G.location,ve);break;default:i.vertexAttrib1fv(G.location,ve)}}}}A()}function L(){w();for(let x in n){let P=n[x];for(let F in P){let U=P[F];for(let B in U)d(U[B].object),delete U[B];delete P[F]}delete n[x]}}function T(x){if(n[x.id]===void 0)return;let P=n[x.id];for(let F in P){let U=P[F];for(let B in U)d(U[B].object),delete U[B];delete P[F]}delete n[x.id]}function R(x){for(let P in n){let F=n[P];if(F[x.id]===void 0)continue;let U=F[x.id];for(let B in U)d(U[B].object),delete U[B];delete F[x.id]}}function w(){v(),a=!0,r!==s&&(r=s,c(r.object))}function v(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:w,resetDefaultState:v,dispose:L,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:b,enableAttribute:g,disableUnusedAttributes:A}}function fv(i,e,t){let n;function s(c){n=c}function r(c,d){i.drawArrays(n,c,d),t.update(d,n,1)}function a(c,d,u){u!==0&&(i.drawArraysInstanced(n,c,d,u),t.update(d,n,u))}function o(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,d,0,u);let p=0;for(let m=0;m<u;m++)p+=d[m];t.update(p,n,1)}function l(c,d,u,h){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<c.length;m++)a(c[m],d[m],h[m]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,d,0,h,0,u);let m=0;for(let b=0;b<u;b++)m+=d[b]*h[b];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function mv(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Wn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let w=R===_a&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Ei&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==ii&&!w)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);let u=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=m>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:h,maxTextures:p,maxVertexTextures:m,maxTextureSize:b,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:A,maxVaryings:S,maxFragmentUniforms:y,vertexTextures:L,maxSamples:T}}function gv(i){let e=this,t=null,n=0,s=!1,r=!1,a=new wn,o=new Je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){let p=u.length!==0||h||n!==0||s;return s=h,n=u.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,p){let m=u.clippingPlanes,b=u.clipIntersection,g=u.clipShadows,f=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?d(null):c();else{let A=r?0:n,S=A*4,y=f.clippingState||null;l.value=y,y=d(m,h,S,p);for(let L=0;L!==S;++L)y[L]=t[L];f.clippingState=y,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,h,p,m){let b=u!==null?u.length:0,g=null;if(b!==0){if(g=l.value,m!==!0||g===null){let f=p+b*4,A=h.matrixWorldInverse;o.getNormalMatrix(A),(g===null||g.length<f)&&(g=new Float32Array(f));for(let S=0,y=p;S!==b;++S,y+=4)a.copy(u[S]).applyMatrix4(A,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,g}}function bv(i){let e=new WeakMap;function t(a,o){return o===hc?a.mapping=pr:o===pc&&(a.mapping=fr),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===hc||o===pc)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new qc(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}function vv(i){let e=[],t=[],n=[],s=i,r=i-ar+1+dh.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let l=1/o;a>i-ar?l=dh[a-i+ar-1]:a===0&&(l=0),n.push(l);let c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,m=6,b=3,g=2,f=1,A=new Float32Array(b*m*p),S=new Float32Array(g*m*p),y=new Float32Array(f*m*p);for(let T=0;T<p;T++){let R=T%3*2/3-1,w=T>2?0:-1,v=[R,w,0,R+2/3,w,0,R+2/3,w+1,0,R,w,0,R+2/3,w+1,0,R,w+1,0];A.set(v,b*m*T),S.set(h,g*m*T);let x=[T,T,T,T,T,T];y.set(x,f*m*T)}let L=new qt;L.setAttribute("position",new nn(A,b)),L.setAttribute("uv",new nn(S,g)),L.setAttribute("faceIndex",new nn(y,f)),e.push(L),s>ar&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ph(i,e,t){let n=new Ai(i,e,t);return n.texture.mapping=nl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function oo(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function xv(i,e,t){let n=new Float32Array(hs),s=new E(0,1,0);return new oi({name:"SphericalGaussianBlur",defines:{n:hs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Nd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function fh(){return new oi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function mh(){return new oi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function Nd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function yv(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===hc||l===pc,d=l===pr||l===fr;if(c||d){let u=e.get(o),h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new Uo(i)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let p=o.image;return c&&p&&p.height>0||d&&p&&s(p)?(t===null&&(t=new Uo(i)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0,c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function _v(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Kr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Sv(i,e,t,n){let s={},r=new WeakMap;function a(u){let h=u.target;h.index!==null&&e.remove(h.index);for(let m in h.attributes)e.remove(h.attributes[m]);for(let m in h.morphAttributes){let b=h.morphAttributes[m];for(let g=0,f=b.length;g<f;g++)e.remove(b[g])}h.removeEventListener("dispose",a),delete s[h.id];let p=r.get(h);p&&(e.remove(p),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(u){let h=u.attributes;for(let m in h)e.update(h[m],i.ARRAY_BUFFER);let p=u.morphAttributes;for(let m in p){let b=p[m];for(let g=0,f=b.length;g<f;g++)e.update(b[g],i.ARRAY_BUFFER)}}function c(u){let h=[],p=u.index,m=u.attributes.position,b=0;if(p!==null){let A=p.array;b=p.version;for(let S=0,y=A.length;S<y;S+=3){let L=A[S+0],T=A[S+1],R=A[S+2];h.push(L,T,T,R,R,L)}}else if(m!==void 0){let A=m.array;b=m.version;for(let S=0,y=A.length/3-1;S<y;S+=3){let L=S+0,T=S+1,R=S+2;h.push(L,T,T,R,R,L)}}else return;let g=new(hp(h)?Do:Lo)(h,1);g.version=b;let f=r.get(u);f&&e.remove(f),r.set(u,g)}function d(u){let h=r.get(u);if(h){let p=u.index;p!==null&&h.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function Mv(i,e,t){let n;function s(h){n=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function l(h,p){i.drawElements(n,p,r,h*a),t.update(p,n,1)}function c(h,p,m){m!==0&&(i.drawElementsInstanced(n,p,r,h*a,m),t.update(p,n,m))}function d(h,p,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,h,0,m);let g=0;for(let f=0;f<m;f++)g+=p[f];t.update(g,n,1)}function u(h,p,m,b){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let f=0;f<h.length;f++)c(h[f]/a,p[f],b[f]);else{g.multiDrawElementsInstancedWEBGL(n,p,0,r,h,0,b,0,m);let f=0;for(let A=0;A<m;A++)f+=p[A]*b[A];t.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function Ev(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function wv(i,e,t){let n=new WeakMap,s=new zt;function r(a,o,l){let c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0,h=n.get(o);if(h===void 0||h.count!==u){let v=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",v)};h!==void 0&&h.texture.dispose();let p=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,b=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],A=o.morphAttributes.color||[],S=0;p===!0&&(S=1),m===!0&&(S=2),b===!0&&(S=3);let y=o.attributes.position.count*S,L=1;y>e.maxTextureSize&&(L=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let T=new Float32Array(y*L*4*u),R=new Io(T,y,L,u);R.type=ii,R.needsUpdate=!0;let w=S*4;for(let x=0;x<u;x++){let P=g[x],F=f[x],U=A[x],B=y*L*4*x;for(let j=0;j<P.count;j++){let k=j*w;p===!0&&(s.fromBufferAttribute(P,j),T[B+k+0]=s.x,T[B+k+1]=s.y,T[B+k+2]=s.z,T[B+k+3]=0),m===!0&&(s.fromBufferAttribute(F,j),T[B+k+4]=s.x,T[B+k+5]=s.y,T[B+k+6]=s.z,T[B+k+7]=0),b===!0&&(s.fromBufferAttribute(U,j),T[B+k+8]=s.x,T[B+k+9]=s.y,T[B+k+10]=s.z,T[B+k+11]=U.itemSize===4?s.w:1)}}h={count:u,texture:R,size:new K(y,L)},n.set(o,h),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let b=0;b<c.length;b++)p+=c[b];let m=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function Av(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,d=l.geometry,u=e.get(l,d);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let h=l.skeleton;s.get(h)!==c&&(h.update(),s.set(h,c))}return u}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}function Ar(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=bh[s];if(r===void 0&&(r=new Float32Array(s),bh[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Yt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Zt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function sl(i,e){let t=vh[e];t===void 0&&(t=new Int32Array(e),vh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Tv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Cv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2fv(this.addr,e),Zt(t,e)}}function Rv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Yt(t,e))return;i.uniform3fv(this.addr,e),Zt(t,e)}}function Pv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4fv(this.addr,e),Zt(t,e)}}function Iv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Zt(t,e)}else{if(Yt(t,n))return;_h.set(n),i.uniformMatrix2fv(this.addr,!1,_h),Zt(t,n)}}function Lv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Zt(t,e)}else{if(Yt(t,n))return;yh.set(n),i.uniformMatrix3fv(this.addr,!1,yh),Zt(t,n)}}function Dv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Zt(t,e)}else{if(Yt(t,n))return;xh.set(n),i.uniformMatrix4fv(this.addr,!1,xh),Zt(t,n)}}function Ov(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Nv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2iv(this.addr,e),Zt(t,e)}}function Uv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;i.uniform3iv(this.addr,e),Zt(t,e)}}function Vv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4iv(this.addr,e),Zt(t,e)}}function Bv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Fv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2uiv(this.addr,e),Zt(t,e)}}function zv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;i.uniform3uiv(this.addr,e),Zt(t,e)}}function Hv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4uiv(this.addr,e),Zt(t,e)}}function kv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(gh.compareFunction=dp,r=gh):r=gp,t.setTexture2D(e||r,s)}function Gv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||vp,s)}function $v(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||xp,s)}function Wv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||bp,s)}function jv(i){switch(i){case 5126:return Tv;case 35664:return Cv;case 35665:return Rv;case 35666:return Pv;case 35674:return Iv;case 35675:return Lv;case 35676:return Dv;case 5124:case 35670:return Ov;case 35667:case 35671:return Nv;case 35668:case 35672:return Uv;case 35669:case 35673:return Vv;case 5125:return Bv;case 36294:return Fv;case 36295:return zv;case 36296:return Hv;case 35678:case 36198:case 36298:case 36306:case 35682:return kv;case 35679:case 36299:case 36307:return Gv;case 35680:case 36300:case 36308:case 36293:return $v;case 36289:case 36303:case 36311:case 36292:return Wv}}function qv(i,e){i.uniform1fv(this.addr,e)}function Xv(i,e){let t=Ar(e,this.size,2);i.uniform2fv(this.addr,t)}function Yv(i,e){let t=Ar(e,this.size,3);i.uniform3fv(this.addr,t)}function Zv(i,e){let t=Ar(e,this.size,4);i.uniform4fv(this.addr,t)}function Jv(i,e){let t=Ar(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Kv(i,e){let t=Ar(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Qv(i,e){let t=Ar(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function ex(i,e){i.uniform1iv(this.addr,e)}function tx(i,e){i.uniform2iv(this.addr,e)}function nx(i,e){i.uniform3iv(this.addr,e)}function ix(i,e){i.uniform4iv(this.addr,e)}function sx(i,e){i.uniform1uiv(this.addr,e)}function rx(i,e){i.uniform2uiv(this.addr,e)}function ax(i,e){i.uniform3uiv(this.addr,e)}function ox(i,e){i.uniform4uiv(this.addr,e)}function lx(i,e,t){let n=this.cache,s=e.length,r=sl(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),Zt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||gp,r[a])}function cx(i,e,t){let n=this.cache,s=e.length,r=sl(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),Zt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||vp,r[a])}function dx(i,e,t){let n=this.cache,s=e.length,r=sl(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),Zt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||xp,r[a])}function ux(i,e,t){let n=this.cache,s=e.length,r=sl(t,s);Yt(n,r)||(i.uniform1iv(this.addr,r),Zt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||bp,r[a])}function hx(i){switch(i){case 5126:return qv;case 35664:return Xv;case 35665:return Yv;case 35666:return Zv;case 35674:return Jv;case 35675:return Kv;case 35676:return Qv;case 5124:case 35670:return ex;case 35667:case 35671:return tx;case 35668:case 35672:return nx;case 35669:case 35673:return ix;case 5125:return sx;case 36294:return rx;case 36295:return ax;case 36296:return ox;case 35678:case 36198:case 36298:case 36306:case 35682:return lx;case 35679:case 36299:case 36307:return cx;case 35680:case 36300:case 36308:case 36293:return dx;case 36289:case 36303:case 36311:case 36292:return ux}}function Sh(i,e){i.seq.push(e),i.map[e.id]=e}function px(i,e,t){let n=i.name,s=n.length;for(Zl.lastIndex=0;;){let r=Zl.exec(n),a=Zl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Sh(t,c===void 0?new Xc(o,i,e):new Yc(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Zc(o),Sh(t,u)),t=u}}}function Mh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function gx(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function bx(i){ot._getMatrix(Eh,ot.workingColorSpace,i);let e=`mat3( ${Eh.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(i)){case il:return[e,"LinearTransferOETF"];case yt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function wh(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+gx(i.getShaderSource(e),a)}else return s}function vx(i,e){let t=bx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function xx(i,e){let t;switch(e){case Pm:t="Linear";break;case Im:t="Reinhard";break;case Lm:t="Cineon";break;case Er:t="ACESFilmic";break;case Om:t="AgX";break;case Nm:t="Neutral";break;case Dm:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function yx(){ot.getLuminanceCoefficients(lo);let i=lo.x.toFixed(4),e=lo.y.toFixed(4),t=lo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _x(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qr).join(`
`)}function Sx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Mx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Qr(i){return i!==""}function Ah(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Th(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function Jc(i){return i.replace(Ex,Ax)}function Ax(i,e){let t=et[e];if(t===void 0){let n=wx.get(e);if(n!==void 0)t=et[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Jc(t)}function Ch(i){return i.replace(Tx,Cx)}function Cx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Rh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Rx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Jh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ya?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===_i&&(e="SHADOWMAP_TYPE_VSM"),e}function Px(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case pr:case fr:e="ENVMAP_TYPE_CUBE";break;case nl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ix(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===fr&&(e="ENVMAP_MODE_REFRACTION"),e}function Lx(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Kh:e="ENVMAP_BLENDING_MULTIPLY";break;case Cm:e="ENVMAP_BLENDING_MIX";break;case Rm:e="ENVMAP_BLENDING_ADD";break}return e}function Dx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Ox(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Rx(t),c=Px(t),d=Ix(t),u=Lx(t),h=Dx(t),p=_x(t),m=Sx(r),b=s.createProgram(),g,f,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Qr).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Qr).join(`
`),f.length>0&&(f+=`
`)):(g=[Rh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qr).join(`
`),f=[Rh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gi?"#define TONE_MAPPING":"",t.toneMapping!==Gi?et.tonemapping_pars_fragment:"",t.toneMapping!==Gi?xx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",et.colorspace_pars_fragment,vx("linearToOutputTexel",t.outputColorSpace),yx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qr).join(`
`)),a=Jc(a),a=Ah(a,t),a=Th(a,t),o=Jc(o),o=Ah(o,t),o=Th(o,t),a=Ch(a),o=Ch(o),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",t.glslVersion===ku?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ku?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let S=A+g+a,y=A+f+o,L=Mh(s,s.VERTEX_SHADER,S),T=Mh(s,s.FRAGMENT_SHADER,y);s.attachShader(b,L),s.attachShader(b,T),t.index0AttributeName!==void 0?s.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b);function R(P){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(b).trim(),U=s.getShaderInfoLog(L).trim(),B=s.getShaderInfoLog(T).trim(),j=!0,k=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,b,L,T);else{let ee=wh(s,L,"vertex"),G=wh(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+F+`
`+ee+`
`+G)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(U===""||B==="")&&(k=!1);k&&(P.diagnostics={runnable:j,programLog:F,vertexShader:{log:U,prefix:g},fragmentShader:{log:B,prefix:f}})}s.deleteShader(L),s.deleteShader(T),w=new ur(s,b),v=Mx(s,b)}let w;this.getUniforms=function(){return w===void 0&&R(this),w};let v;this.getAttributes=function(){return v===void 0&&R(this),v};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(b,fx)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=mx++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=L,this.fragmentShader=T,this}function Ux(i,e,t,n,s,r,a){let o=new ca,l=new Kc,c=new Set,d=[],u=s.logarithmicDepthBuffer,h=s.vertexTextures,p=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(v){return c.add(v),v===0?"uv":`uv${v}`}function g(v,x,P,F,U){let B=F.fog,j=U.geometry,k=v.isMeshStandardMaterial?F.environment:null,ee=(v.isMeshStandardMaterial?t:e).get(v.envMap||k),G=ee&&ee.mapping===nl?ee.image.height:null,de=m[v.type];v.precision!==null&&(p=s.getMaxPrecision(v.precision),p!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",p,"instead."));let ve=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,we=ve!==void 0?ve.length:0,Xe=0;j.morphAttributes.position!==void 0&&(Xe=1),j.morphAttributes.normal!==void 0&&(Xe=2),j.morphAttributes.color!==void 0&&(Xe=3);let pt,X,ie,Ae;if(de){let bt=ti[de];pt=bt.vertexShader,X=bt.fragmentShader}else pt=v.vertexShader,X=v.fragmentShader,l.update(v),ie=l.getVertexShaderID(v),Ae=l.getFragmentShaderID(v);let oe=i.getRenderTarget(),Ve=i.state.buffers.depth.getReversed(),$e=U.isInstancedMesh===!0,He=U.isBatchedMesh===!0,at=!!v.map,Z=!!v.matcap,ne=!!ee,I=!!v.aoMap,Le=!!v.lightMap,Q=!!v.bumpMap,_e=!!v.normalMap,le=!!v.displacementMap,Fe=!!v.emissiveMap,xe=!!v.metalnessMap,C=!!v.roughnessMap,_=v.anisotropy>0,V=v.clearcoat>0,W=v.dispersion>0,J=v.iridescence>0,q=v.sheen>0,Te=v.transmission>0,he=_&&!!v.anisotropyMap,ye=V&&!!v.clearcoatMap,tt=V&&!!v.clearcoatNormalMap,te=V&&!!v.clearcoatRoughnessMap,Se=J&&!!v.iridescenceMap,ze=J&&!!v.iridescenceThicknessMap,Ge=q&&!!v.sheenColorMap,Me=q&&!!v.sheenRoughnessMap,st=!!v.specularMap,Qe=!!v.specularColorMap,At=!!v.specularIntensityMap,D=Te&&!!v.transmissionMap,pe=Te&&!!v.thicknessMap,$=!!v.gradientMap,Y=!!v.alphaMap,be=v.alphaTest>0,me=!!v.alphaHash,Ye=!!v.extensions,Ft=Gi;v.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(Ft=i.toneMapping);let an={shaderID:de,shaderType:v.type,shaderName:v.name,vertexShader:pt,fragmentShader:X,defines:v.defines,customVertexShaderID:ie,customFragmentShaderID:Ae,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:p,batching:He,batchingColor:He&&U._colorsTexture!==null,instancing:$e,instancingColor:$e&&U.instanceColor!==null,instancingMorph:$e&&U.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:wr,alphaToCoverage:!!v.alphaToCoverage,map:at,matcap:Z,envMap:ne,envMapMode:ne&&ee.mapping,envMapCubeUVHeight:G,aoMap:I,lightMap:Le,bumpMap:Q,normalMap:_e,displacementMap:h&&le,emissiveMap:Fe,normalMapObjectSpace:_e&&v.normalMapType===Fm,normalMapTangentSpace:_e&&v.normalMapType===cp,metalnessMap:xe,roughnessMap:C,anisotropy:_,anisotropyMap:he,clearcoat:V,clearcoatMap:ye,clearcoatNormalMap:tt,clearcoatRoughnessMap:te,dispersion:W,iridescence:J,iridescenceMap:Se,iridescenceThicknessMap:ze,sheen:q,sheenColorMap:Ge,sheenRoughnessMap:Me,specularMap:st,specularColorMap:Qe,specularIntensityMap:At,transmission:Te,transmissionMap:D,thicknessMap:pe,gradientMap:$,opaque:v.transparent===!1&&v.blending===lr&&v.alphaToCoverage===!1,alphaMap:Y,alphaTest:be,alphaHash:me,combine:v.combine,mapUv:at&&b(v.map.channel),aoMapUv:I&&b(v.aoMap.channel),lightMapUv:Le&&b(v.lightMap.channel),bumpMapUv:Q&&b(v.bumpMap.channel),normalMapUv:_e&&b(v.normalMap.channel),displacementMapUv:le&&b(v.displacementMap.channel),emissiveMapUv:Fe&&b(v.emissiveMap.channel),metalnessMapUv:xe&&b(v.metalnessMap.channel),roughnessMapUv:C&&b(v.roughnessMap.channel),anisotropyMapUv:he&&b(v.anisotropyMap.channel),clearcoatMapUv:ye&&b(v.clearcoatMap.channel),clearcoatNormalMapUv:tt&&b(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&b(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&b(v.iridescenceMap.channel),iridescenceThicknessMapUv:ze&&b(v.iridescenceThicknessMap.channel),sheenColorMapUv:Ge&&b(v.sheenColorMap.channel),sheenRoughnessMapUv:Me&&b(v.sheenRoughnessMap.channel),specularMapUv:st&&b(v.specularMap.channel),specularColorMapUv:Qe&&b(v.specularColorMap.channel),specularIntensityMapUv:At&&b(v.specularIntensityMap.channel),transmissionMapUv:D&&b(v.transmissionMap.channel),thicknessMapUv:pe&&b(v.thicknessMap.channel),alphaMapUv:Y&&b(v.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(_e||_),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!j.attributes.uv&&(at||Y),fog:!!B,useFog:v.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Ve,skinning:U.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:Xe,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ft,decodeVideoTexture:at&&v.map.isVideoTexture===!0&&ot.getTransfer(v.map.colorSpace)===yt,decodeVideoTextureEmissive:Fe&&v.emissiveMap.isVideoTexture===!0&&ot.getTransfer(v.emissiveMap.colorSpace)===yt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Gn,flipSided:v.side===bn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Ye&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ye&&v.extensions.multiDraw===!0||He)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return an.vertexUv1s=c.has(1),an.vertexUv2s=c.has(2),an.vertexUv3s=c.has(3),c.clear(),an}function f(v){let x=[];if(v.shaderID?x.push(v.shaderID):(x.push(v.customVertexShaderID),x.push(v.customFragmentShaderID)),v.defines!==void 0)for(let P in v.defines)x.push(P),x.push(v.defines[P]);return v.isRawShaderMaterial===!1&&(A(x,v),S(x,v),x.push(i.outputColorSpace)),x.push(v.customProgramCacheKey),x.join()}function A(v,x){v.push(x.precision),v.push(x.outputColorSpace),v.push(x.envMapMode),v.push(x.envMapCubeUVHeight),v.push(x.mapUv),v.push(x.alphaMapUv),v.push(x.lightMapUv),v.push(x.aoMapUv),v.push(x.bumpMapUv),v.push(x.normalMapUv),v.push(x.displacementMapUv),v.push(x.emissiveMapUv),v.push(x.metalnessMapUv),v.push(x.roughnessMapUv),v.push(x.anisotropyMapUv),v.push(x.clearcoatMapUv),v.push(x.clearcoatNormalMapUv),v.push(x.clearcoatRoughnessMapUv),v.push(x.iridescenceMapUv),v.push(x.iridescenceThicknessMapUv),v.push(x.sheenColorMapUv),v.push(x.sheenRoughnessMapUv),v.push(x.specularMapUv),v.push(x.specularColorMapUv),v.push(x.specularIntensityMapUv),v.push(x.transmissionMapUv),v.push(x.thicknessMapUv),v.push(x.combine),v.push(x.fogExp2),v.push(x.sizeAttenuation),v.push(x.morphTargetsCount),v.push(x.morphAttributeCount),v.push(x.numDirLights),v.push(x.numPointLights),v.push(x.numSpotLights),v.push(x.numSpotLightMaps),v.push(x.numHemiLights),v.push(x.numRectAreaLights),v.push(x.numDirLightShadows),v.push(x.numPointLightShadows),v.push(x.numSpotLightShadows),v.push(x.numSpotLightShadowsWithMaps),v.push(x.numLightProbes),v.push(x.shadowMapType),v.push(x.toneMapping),v.push(x.numClippingPlanes),v.push(x.numClipIntersection),v.push(x.depthPacking)}function S(v,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),v.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),v.push(o.mask)}function y(v){let x=m[v.type],P;if(x){let F=ti[x];P=A0.clone(F.uniforms)}else P=v.uniforms;return P}function L(v,x){let P;for(let F=0,U=d.length;F<U;F++){let B=d[F];if(B.cacheKey===x){P=B,++P.usedTimes;break}}return P===void 0&&(P=new Ox(i,x,v,r),d.push(P)),P}function T(v){if(--v.usedTimes===0){let x=d.indexOf(v);d[x]=d[d.length-1],d.pop(),v.destroy()}}function R(v){l.remove(v)}function w(){l.dispose()}return{getParameters:g,getProgramCacheKey:f,getUniforms:y,acquireProgram:L,releaseProgram:T,releaseShaderCache:R,programs:d,dispose:w}}function Vx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Bx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ph(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ih(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,h,p,m,b,g){let f=i[e];return f===void 0?(f={id:u.id,object:u,geometry:h,material:p,groupOrder:m,renderOrder:u.renderOrder,z:b,group:g},i[e]=f):(f.id=u.id,f.object=u,f.geometry=h,f.material=p,f.groupOrder=m,f.renderOrder=u.renderOrder,f.z=b,f.group=g),e++,f}function o(u,h,p,m,b,g){let f=a(u,h,p,m,b,g);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(u,h,p,m,b,g){let f=a(u,h,p,m,b,g);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(u,h){t.length>1&&t.sort(u||Bx),n.length>1&&n.sort(h||Ph),s.length>1&&s.sort(h||Ph)}function d(){for(let u=e,h=i.length;u<h;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:d,sort:c}}function Fx(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Ih,i.set(n,[a])):s>=r.length?(a=new Ih,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function zx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new E,color:new Be};break;case"SpotLight":t={position:new E,direction:new E,color:new Be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new E,color:new Be,distance:0,decay:0};break;case"HemisphereLight":t={direction:new E,skyColor:new Be,groundColor:new Be};break;case"RectAreaLight":t={color:new Be,position:new E,halfWidth:new E,halfHeight:new E};break}return i[e.id]=t,t}}}function Hx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function Gx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function $x(i){let e=new zx,t=Hx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new E);let s=new E,r=new ut,a=new ut;function o(c){let d=0,u=0,h=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let p=0,m=0,b=0,g=0,f=0,A=0,S=0,y=0,L=0,T=0,R=0;c.sort(Gx);for(let v=0,x=c.length;v<x;v++){let P=c[v],F=P.color,U=P.intensity,B=P.distance,j=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=F.r*U,u+=F.g*U,h+=F.b*U;else if(P.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(P.sh.coefficients[k],U);R++}else if(P.isDirectionalLight){let k=e.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let ee=P.shadow,G=t.get(P);G.shadowIntensity=ee.intensity,G.shadowBias=ee.bias,G.shadowNormalBias=ee.normalBias,G.shadowRadius=ee.radius,G.shadowMapSize=ee.mapSize,n.directionalShadow[p]=G,n.directionalShadowMap[p]=j,n.directionalShadowMatrix[p]=P.shadow.matrix,A++}n.directional[p]=k,p++}else if(P.isSpotLight){let k=e.get(P);k.position.setFromMatrixPosition(P.matrixWorld),k.color.copy(F).multiplyScalar(U),k.distance=B,k.coneCos=Math.cos(P.angle),k.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),k.decay=P.decay,n.spot[b]=k;let ee=P.shadow;if(P.map&&(n.spotLightMap[L]=P.map,L++,ee.updateMatrices(P),P.castShadow&&T++),n.spotLightMatrix[b]=ee.matrix,P.castShadow){let G=t.get(P);G.shadowIntensity=ee.intensity,G.shadowBias=ee.bias,G.shadowNormalBias=ee.normalBias,G.shadowRadius=ee.radius,G.shadowMapSize=ee.mapSize,n.spotShadow[b]=G,n.spotShadowMap[b]=j,y++}b++}else if(P.isRectAreaLight){let k=e.get(P);k.color.copy(F).multiplyScalar(U),k.halfWidth.set(P.width*.5,0,0),k.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=k,g++}else if(P.isPointLight){let k=e.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),k.distance=P.distance,k.decay=P.decay,P.castShadow){let ee=P.shadow,G=t.get(P);G.shadowIntensity=ee.intensity,G.shadowBias=ee.bias,G.shadowNormalBias=ee.normalBias,G.shadowRadius=ee.radius,G.shadowMapSize=ee.mapSize,G.shadowCameraNear=ee.camera.near,G.shadowCameraFar=ee.camera.far,n.pointShadow[m]=G,n.pointShadowMap[m]=j,n.pointShadowMatrix[m]=P.shadow.matrix,S++}n.point[m]=k,m++}else if(P.isHemisphereLight){let k=e.get(P);k.skyColor.copy(P.color).multiplyScalar(U),k.groundColor.copy(P.groundColor).multiplyScalar(U),n.hemi[f]=k,f++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=h;let w=n.hash;(w.directionalLength!==p||w.pointLength!==m||w.spotLength!==b||w.rectAreaLength!==g||w.hemiLength!==f||w.numDirectionalShadows!==A||w.numPointShadows!==S||w.numSpotShadows!==y||w.numSpotMaps!==L||w.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=b,n.rectArea.length=g,n.point.length=m,n.hemi.length=f,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=y+L-T,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,w.directionalLength=p,w.pointLength=m,w.spotLength=b,w.rectAreaLength=g,w.hemiLength=f,w.numDirectionalShadows=A,w.numPointShadows=S,w.numSpotShadows=y,w.numSpotMaps=L,w.numLightProbes=R,n.version=kx++)}function l(c,d){let u=0,h=0,p=0,m=0,b=0,g=d.matrixWorldInverse;for(let f=0,A=c.length;f<A;f++){let S=c[f];if(S.isDirectionalLight){let y=n.directional[u];y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),u++}else if(S.isSpotLight){let y=n.spot[p];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),p++}else if(S.isRectAreaLight){let y=n.rectArea[m];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),a.identity(),r.copy(S.matrixWorld),r.premultiply(g),a.extractRotation(r),y.halfWidth.set(S.width*.5,0,0),y.halfHeight.set(0,S.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),m++}else if(S.isPointLight){let y=n.point[h];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(g),h++}else if(S.isHemisphereLight){let y=n.hemi[b];y.direction.setFromMatrixPosition(S.matrixWorld),y.direction.transformDirection(g),b++}}}return{setup:o,setupView:l,state:n}}function Lh(i){let e=new $x(i),t=[],n=[];function s(d){c.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Wx(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Lh(i),e.set(s,[o])):r>=a.length?(o=new Lh(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}function Xx(i,e,t){let n=new da,s=new K,r=new K,a=new zt,o=new ed({depthPacking:Bm}),l=new td,c={},d=t.maxTextureSize,u={[$i]:bn,[bn]:$i,[Gn]:Gn},h=new oi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new K},radius:{value:4}},vertexShader:jx,fragmentShader:qx}),p=h.clone();p.defines.HORIZONTAL_PASS=1;let m=new qt;m.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new Oe(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Jh;let f=this.type;this.render=function(T,R,w){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;let v=i.getRenderTarget(),x=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),F=i.state;F.setBlending(ki),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let U=f!==_i&&this.type===_i,B=f===_i&&this.type!==_i;for(let j=0,k=T.length;j<k;j++){let ee=T[j],G=ee.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let de=G.getFrameExtents();if(s.multiply(de),r.copy(G.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/de.x),s.x=r.x*de.x,G.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/de.y),s.y=r.y*de.y,G.mapSize.y=r.y)),G.map===null||U===!0||B===!0){let we=this.type!==_i?{minFilter:An,magFilter:An}:{};G.map!==null&&G.map.dispose(),G.map=new Ai(s.x,s.y,we),G.map.texture.name=ee.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();let ve=G.getViewportCount();for(let we=0;we<ve;we++){let Xe=G.getViewport(we);a.set(r.x*Xe.x,r.y*Xe.y,r.x*Xe.z,r.y*Xe.w),F.viewport(a),G.updateMatrices(ee,we),n=G.getFrustum(),y(R,w,G.camera,ee,this.type)}G.isPointLightShadow!==!0&&this.type===_i&&A(G,w),G.needsUpdate=!1}f=this.type,g.needsUpdate=!1,i.setRenderTarget(v,x,P)};function A(T,R){let w=e.update(b);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Ai(s.x,s.y)),h.uniforms.shadow_pass.value=T.map.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(R,null,w,h,b,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(R,null,w,p,b,null)}function S(T,R,w,v){let x=null,P=w.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)x=P;else if(x=w.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let F=x.uuid,U=R.uuid,B=c[F];B===void 0&&(B={},c[F]=B);let j=B[U];j===void 0&&(j=x.clone(),B[U]=j,R.addEventListener("dispose",L)),x=j}if(x.visible=R.visible,x.wireframe=R.wireframe,v===_i?x.side=R.shadowSide!==null?R.shadowSide:R.side:x.side=R.shadowSide!==null?R.shadowSide:u[R.side],x.alphaMap=R.alphaMap,x.alphaTest=R.alphaTest,x.map=R.map,x.clipShadows=R.clipShadows,x.clippingPlanes=R.clippingPlanes,x.clipIntersection=R.clipIntersection,x.displacementMap=R.displacementMap,x.displacementScale=R.displacementScale,x.displacementBias=R.displacementBias,x.wireframeLinewidth=R.wireframeLinewidth,x.linewidth=R.linewidth,w.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let F=i.properties.get(x);F.light=w}return x}function y(T,R,w,v,x){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&x===_i)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,T.matrixWorld);let U=e.update(T),B=T.material;if(Array.isArray(B)){let j=U.groups;for(let k=0,ee=j.length;k<ee;k++){let G=j[k],de=B[G.materialIndex];if(de&&de.visible){let ve=S(T,de,v,x);T.onBeforeShadow(i,T,R,w,U,ve,G),i.renderBufferDirect(w,null,U,ve,T,G),T.onAfterShadow(i,T,R,w,U,ve,G)}}}else if(B.visible){let j=S(T,B,v,x);T.onBeforeShadow(i,T,R,w,U,j,null),i.renderBufferDirect(w,null,U,j,T,null),T.onAfterShadow(i,T,R,w,U,j,null)}}let F=T.children;for(let U=0,B=F.length;U<B;U++)y(F[U],R,w,v,x)}function L(T){T.target.removeEventListener("dispose",L);for(let w in c){let v=c[w],x=T.target.uuid;x in v&&(v[x].dispose(),delete v[x])}}}function Zx(i,e){function t(){let D=!1,pe=new zt,$=null,Y=new zt(0,0,0,0);return{setMask:function(be){$!==be&&!D&&(i.colorMask(be,be,be,be),$=be)},setLocked:function(be){D=be},setClear:function(be,me,Ye,Ft,an){an===!0&&(be*=Ft,me*=Ft,Ye*=Ft),pe.set(be,me,Ye,Ft),Y.equals(pe)===!1&&(i.clearColor(be,me,Ye,Ft),Y.copy(pe))},reset:function(){D=!1,$=null,Y.set(-1,0,0,0)}}}function n(){let D=!1,pe=!1,$=null,Y=null,be=null;return{setReversed:function(me){if(pe!==me){let Ye=e.get("EXT_clip_control");pe?Ye.clipControlEXT(Ye.LOWER_LEFT_EXT,Ye.ZERO_TO_ONE_EXT):Ye.clipControlEXT(Ye.LOWER_LEFT_EXT,Ye.NEGATIVE_ONE_TO_ONE_EXT);let Ft=be;be=null,this.setClear(Ft)}pe=me},getReversed:function(){return pe},setTest:function(me){me?oe(i.DEPTH_TEST):Ve(i.DEPTH_TEST)},setMask:function(me){$!==me&&!D&&(i.depthMask(me),$=me)},setFunc:function(me){if(pe&&(me=Yx[me]),Y!==me){switch(me){case rc:i.depthFunc(i.NEVER);break;case ac:i.depthFunc(i.ALWAYS);break;case oc:i.depthFunc(i.LESS);break;case hr:i.depthFunc(i.LEQUAL);break;case lc:i.depthFunc(i.EQUAL);break;case cc:i.depthFunc(i.GEQUAL);break;case dc:i.depthFunc(i.GREATER);break;case uc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Y=me}},setLocked:function(me){D=me},setClear:function(me){be!==me&&(pe&&(me=1-me),i.clearDepth(me),be=me)},reset:function(){D=!1,$=null,Y=null,be=null,pe=!1}}}function s(){let D=!1,pe=null,$=null,Y=null,be=null,me=null,Ye=null,Ft=null,an=null;return{setTest:function(bt){D||(bt?oe(i.STENCIL_TEST):Ve(i.STENCIL_TEST))},setMask:function(bt){pe!==bt&&!D&&(i.stencilMask(bt),pe=bt)},setFunc:function(bt,Bn,fi){($!==bt||Y!==Bn||be!==fi)&&(i.stencilFunc(bt,Bn,fi),$=bt,Y=Bn,be=fi)},setOp:function(bt,Bn,fi){(me!==bt||Ye!==Bn||Ft!==fi)&&(i.stencilOp(bt,Bn,fi),me=bt,Ye=Bn,Ft=fi)},setLocked:function(bt){D=bt},setClear:function(bt){an!==bt&&(i.clearStencil(bt),an=bt)},reset:function(){D=!1,pe=null,$=null,Y=null,be=null,me=null,Ye=null,Ft=null,an=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,d={},u={},h=new WeakMap,p=[],m=null,b=!1,g=null,f=null,A=null,S=null,y=null,L=null,T=null,R=new Be(0,0,0),w=0,v=!1,x=null,P=null,F=null,U=null,B=null,j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,ee=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(G)[1]),k=ee>=1):G.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),k=ee>=2);let de=null,ve={},we=i.getParameter(i.SCISSOR_BOX),Xe=i.getParameter(i.VIEWPORT),pt=new zt().fromArray(we),X=new zt().fromArray(Xe);function ie(D,pe,$,Y){let be=new Uint8Array(4),me=i.createTexture();i.bindTexture(D,me),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ye=0;Ye<$;Ye++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(pe,0,i.RGBA,1,1,Y,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D(pe+Ye,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return me}let Ae={};Ae[i.TEXTURE_2D]=ie(i.TEXTURE_2D,i.TEXTURE_2D,1),Ae[i.TEXTURE_CUBE_MAP]=ie(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ae[i.TEXTURE_2D_ARRAY]=ie(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ae[i.TEXTURE_3D]=ie(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),oe(i.DEPTH_TEST),a.setFunc(hr),Q(!1),_e(Nu),oe(i.CULL_FACE),I(ki);function oe(D){d[D]!==!0&&(i.enable(D),d[D]=!0)}function Ve(D){d[D]!==!1&&(i.disable(D),d[D]=!1)}function $e(D,pe){return u[D]!==pe?(i.bindFramebuffer(D,pe),u[D]=pe,D===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=pe),D===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=pe),!0):!1}function He(D,pe){let $=p,Y=!1;if(D){$=h.get(pe),$===void 0&&($=[],h.set(pe,$));let be=D.textures;if($.length!==be.length||$[0]!==i.COLOR_ATTACHMENT0){for(let me=0,Ye=be.length;me<Ye;me++)$[me]=i.COLOR_ATTACHMENT0+me;$.length=be.length,Y=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,Y=!0);Y&&i.drawBuffers($)}function at(D){return m!==D?(i.useProgram(D),m=D,!0):!1}let Z={[us]:i.FUNC_ADD,[um]:i.FUNC_SUBTRACT,[hm]:i.FUNC_REVERSE_SUBTRACT};Z[pm]=i.MIN,Z[fm]=i.MAX;let ne={[mm]:i.ZERO,[gm]:i.ONE,[bm]:i.SRC_COLOR,[ic]:i.SRC_ALPHA,[Mm]:i.SRC_ALPHA_SATURATE,[_m]:i.DST_COLOR,[xm]:i.DST_ALPHA,[vm]:i.ONE_MINUS_SRC_COLOR,[sc]:i.ONE_MINUS_SRC_ALPHA,[Sm]:i.ONE_MINUS_DST_COLOR,[ym]:i.ONE_MINUS_DST_ALPHA,[Em]:i.CONSTANT_COLOR,[wm]:i.ONE_MINUS_CONSTANT_COLOR,[Am]:i.CONSTANT_ALPHA,[Tm]:i.ONE_MINUS_CONSTANT_ALPHA};function I(D,pe,$,Y,be,me,Ye,Ft,an,bt){if(D===ki){b===!0&&(Ve(i.BLEND),b=!1);return}if(b===!1&&(oe(i.BLEND),b=!0),D!==dm){if(D!==g||bt!==v){if((f!==us||y!==us)&&(i.blendEquation(i.FUNC_ADD),f=us,y=us),bt)switch(D){case lr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ao:i.blendFunc(i.ONE,i.ONE);break;case Uu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Vu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case lr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ao:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Uu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Vu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}A=null,S=null,L=null,T=null,R.set(0,0,0),w=0,g=D,v=bt}return}be=be||pe,me=me||$,Ye=Ye||Y,(pe!==f||be!==y)&&(i.blendEquationSeparate(Z[pe],Z[be]),f=pe,y=be),($!==A||Y!==S||me!==L||Ye!==T)&&(i.blendFuncSeparate(ne[$],ne[Y],ne[me],ne[Ye]),A=$,S=Y,L=me,T=Ye),(Ft.equals(R)===!1||an!==w)&&(i.blendColor(Ft.r,Ft.g,Ft.b,an),R.copy(Ft),w=an),g=D,v=!1}function Le(D,pe){D.side===Gn?Ve(i.CULL_FACE):oe(i.CULL_FACE);let $=D.side===bn;pe&&($=!$),Q($),D.blending===lr&&D.transparent===!1?I(ki):I(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);let Y=D.stencilWrite;o.setTest(Y),Y&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Fe(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?oe(i.SAMPLE_ALPHA_TO_COVERAGE):Ve(i.SAMPLE_ALPHA_TO_COVERAGE)}function Q(D){x!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),x=D)}function _e(D){D!==lm?(oe(i.CULL_FACE),D!==P&&(D===Nu?i.cullFace(i.BACK):D===cm?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ve(i.CULL_FACE),P=D}function le(D){D!==F&&(k&&i.lineWidth(D),F=D)}function Fe(D,pe,$){D?(oe(i.POLYGON_OFFSET_FILL),(U!==pe||B!==$)&&(i.polygonOffset(pe,$),U=pe,B=$)):Ve(i.POLYGON_OFFSET_FILL)}function xe(D){D?oe(i.SCISSOR_TEST):Ve(i.SCISSOR_TEST)}function C(D){D===void 0&&(D=i.TEXTURE0+j-1),de!==D&&(i.activeTexture(D),de=D)}function _(D,pe,$){$===void 0&&(de===null?$=i.TEXTURE0+j-1:$=de);let Y=ve[$];Y===void 0&&(Y={type:void 0,texture:void 0},ve[$]=Y),(Y.type!==D||Y.texture!==pe)&&(de!==$&&(i.activeTexture($),de=$),i.bindTexture(D,pe||Ae[D]),Y.type=D,Y.texture=pe)}function V(){let D=ve[de];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function W(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Te(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function he(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ye(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function tt(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function te(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Se(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ze(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ge(D){pt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),pt.copy(D))}function Me(D){X.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),X.copy(D))}function st(D,pe){let $=c.get(pe);$===void 0&&($=new WeakMap,c.set(pe,$));let Y=$.get(D);Y===void 0&&(Y=i.getUniformBlockIndex(pe,D.name),$.set(D,Y))}function Qe(D,pe){let Y=c.get(pe).get(D);l.get(pe)!==Y&&(i.uniformBlockBinding(pe,Y,D.__bindingPointIndex),l.set(pe,Y))}function At(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},de=null,ve={},u={},h=new WeakMap,p=[],m=null,b=!1,g=null,f=null,A=null,S=null,y=null,L=null,T=null,R=new Be(0,0,0),w=0,v=!1,x=null,P=null,F=null,U=null,B=null,pt.set(0,0,i.canvas.width,i.canvas.height),X.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:oe,disable:Ve,bindFramebuffer:$e,drawBuffers:He,useProgram:at,setBlending:I,setMaterial:Le,setFlipSided:Q,setCullFace:_e,setLineWidth:le,setPolygonOffset:Fe,setScissorTest:xe,activeTexture:C,bindTexture:_,unbindTexture:V,compressedTexImage2D:W,compressedTexImage3D:J,texImage2D:Se,texImage3D:ze,updateUBOMapping:st,uniformBlockBinding:Qe,texStorage2D:tt,texStorage3D:te,texSubImage2D:q,texSubImage3D:Te,compressedTexSubImage2D:he,compressedTexSubImage3D:ye,scissor:Ge,viewport:Me,reset:At}}function Dh(i,e,t,n){let s=Jx(n);switch(t){case ip:return i*e;case rp:return i*e;case ap:return i*e*2;case Pd:return i*e/s.components*s.byteLength;case Id:return i*e/s.components*s.byteLength;case op:return i*e*2/s.components*s.byteLength;case Ld:return i*e*2/s.components*s.byteLength;case sp:return i*e*3/s.components*s.byteLength;case Wn:return i*e*4/s.components*s.byteLength;case Dd:return i*e*4/s.components*s.byteLength;case _o:case So:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Mo:case Eo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case gc:case vc:return Math.max(i,16)*Math.max(e,8)/4;case mc:case bc:return Math.max(i,8)*Math.max(e,8)/2;case xc:case yc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case _c:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Sc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Mc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ec:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case wc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ac:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Tc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Cc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Rc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Pc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ic:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Lc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Dc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Oc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Nc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case wo:case Uc:case Vc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case lp:case Bc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Fc:case zc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Jx(i){switch(i){case Ei:case ep:return{byteLength:1,components:1};case oa:case tp:case _a:return{byteLength:2,components:1};case Cd:case Rd:return{byteLength:2,components:4};case ms:case Td:case ii:return{byteLength:4,components:1};case np:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Kx(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new K,d=new WeakMap,u,h=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,_){return p?new OffscreenCanvas(C,_):Ro("canvas")}function b(C,_,V){let W=1,J=xe(C);if((J.width>V||J.height>V)&&(W=V/Math.max(J.width,J.height)),W<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let q=Math.floor(W*J.width),Te=Math.floor(W*J.height);u===void 0&&(u=m(q,Te));let he=_?m(q,Te):u;return he.width=q,he.height=Te,he.getContext("2d").drawImage(C,0,0,q,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+q+"x"+Te+")."),he}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function g(C){return C.generateMipmaps}function f(C){i.generateMipmap(C)}function A(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(C,_,V,W,J=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let q=_;if(_===i.RED&&(V===i.FLOAT&&(q=i.R32F),V===i.HALF_FLOAT&&(q=i.R16F),V===i.UNSIGNED_BYTE&&(q=i.R8)),_===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(q=i.R8UI),V===i.UNSIGNED_SHORT&&(q=i.R16UI),V===i.UNSIGNED_INT&&(q=i.R32UI),V===i.BYTE&&(q=i.R8I),V===i.SHORT&&(q=i.R16I),V===i.INT&&(q=i.R32I)),_===i.RG&&(V===i.FLOAT&&(q=i.RG32F),V===i.HALF_FLOAT&&(q=i.RG16F),V===i.UNSIGNED_BYTE&&(q=i.RG8)),_===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(q=i.RG8UI),V===i.UNSIGNED_SHORT&&(q=i.RG16UI),V===i.UNSIGNED_INT&&(q=i.RG32UI),V===i.BYTE&&(q=i.RG8I),V===i.SHORT&&(q=i.RG16I),V===i.INT&&(q=i.RG32I)),_===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(q=i.RGB8UI),V===i.UNSIGNED_SHORT&&(q=i.RGB16UI),V===i.UNSIGNED_INT&&(q=i.RGB32UI),V===i.BYTE&&(q=i.RGB8I),V===i.SHORT&&(q=i.RGB16I),V===i.INT&&(q=i.RGB32I)),_===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),V===i.UNSIGNED_INT&&(q=i.RGBA32UI),V===i.BYTE&&(q=i.RGBA8I),V===i.SHORT&&(q=i.RGBA16I),V===i.INT&&(q=i.RGBA32I)),_===i.RGB&&V===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),_===i.RGBA){let Te=J?il:ot.getTransfer(W);V===i.FLOAT&&(q=i.RGBA32F),V===i.HALF_FLOAT&&(q=i.RGBA16F),V===i.UNSIGNED_BYTE&&(q=Te===yt?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function y(C,_){let V;return C?_===null||_===ms||_===mr?V=i.DEPTH24_STENCIL8:_===ii?V=i.DEPTH32F_STENCIL8:_===oa&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ms||_===mr?V=i.DEPTH_COMPONENT24:_===ii?V=i.DEPTH_COMPONENT32F:_===oa&&(V=i.DEPTH_COMPONENT16),V}function L(C,_){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==An&&C.minFilter!==ni?Math.log2(Math.max(_.width,_.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?_.mipmaps.length:1}function T(C){let _=C.target;_.removeEventListener("dispose",T),w(_),_.isVideoTexture&&d.delete(_)}function R(C){let _=C.target;_.removeEventListener("dispose",R),x(_)}function w(C){let _=n.get(C);if(_.__webglInit===void 0)return;let V=C.source,W=h.get(V);if(W){let J=W[_.__cacheKey];J.usedTimes--,J.usedTimes===0&&v(C),Object.keys(W).length===0&&h.delete(V)}n.remove(C)}function v(C){let _=n.get(C);i.deleteTexture(_.__webglTexture);let V=C.source,W=h.get(V);delete W[_.__cacheKey],a.memory.textures--}function x(C){let _=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(_.__webglFramebuffer[W]))for(let J=0;J<_.__webglFramebuffer[W].length;J++)i.deleteFramebuffer(_.__webglFramebuffer[W][J]);else i.deleteFramebuffer(_.__webglFramebuffer[W]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[W])}else{if(Array.isArray(_.__webglFramebuffer))for(let W=0;W<_.__webglFramebuffer.length;W++)i.deleteFramebuffer(_.__webglFramebuffer[W]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let W=0;W<_.__webglColorRenderbuffer.length;W++)_.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[W]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let V=C.textures;for(let W=0,J=V.length;W<J;W++){let q=n.get(V[W]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),a.memory.textures--),n.remove(V[W])}n.remove(C)}let P=0;function F(){P=0}function U(){let C=P;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),P+=1,C}function B(C){let _=[];return _.push(C.wrapS),_.push(C.wrapT),_.push(C.wrapR||0),_.push(C.magFilter),_.push(C.minFilter),_.push(C.anisotropy),_.push(C.internalFormat),_.push(C.format),_.push(C.type),_.push(C.generateMipmaps),_.push(C.premultiplyAlpha),_.push(C.flipY),_.push(C.unpackAlignment),_.push(C.colorSpace),_.join()}function j(C,_){let V=n.get(C);if(C.isVideoTexture&&le(C),C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){let W=C.image;if(W===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(V,C,_);return}}t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+_)}function k(C,_){let V=n.get(C);if(C.version>0&&V.__version!==C.version){X(V,C,_);return}t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+_)}function ee(C,_){let V=n.get(C);if(C.version>0&&V.__version!==C.version){X(V,C,_);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+_)}function G(C,_){let V=n.get(C);if(C.version>0&&V.__version!==C.version){ie(V,C,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+_)}let de={[aa]:i.REPEAT,[ps]:i.CLAMP_TO_EDGE,[fc]:i.MIRRORED_REPEAT},ve={[An]:i.NEAREST,[Um]:i.NEAREST_MIPMAP_NEAREST,[ka]:i.NEAREST_MIPMAP_LINEAR,[ni]:i.LINEAR,[Ml]:i.LINEAR_MIPMAP_NEAREST,[fs]:i.LINEAR_MIPMAP_LINEAR},we={[zm]:i.NEVER,[jm]:i.ALWAYS,[Hm]:i.LESS,[dp]:i.LEQUAL,[km]:i.EQUAL,[Wm]:i.GEQUAL,[Gm]:i.GREATER,[$m]:i.NOTEQUAL};function Xe(C,_){if(_.type===ii&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===ni||_.magFilter===Ml||_.magFilter===ka||_.magFilter===fs||_.minFilter===ni||_.minFilter===Ml||_.minFilter===ka||_.minFilter===fs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,de[_.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,de[_.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,de[_.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,ve[_.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,ve[_.minFilter]),_.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,we[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===An||_.minFilter!==ka&&_.minFilter!==fs||_.type===ii&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function pt(C,_){let V=!1;C.__webglInit===void 0&&(C.__webglInit=!0,_.addEventListener("dispose",T));let W=_.source,J=h.get(W);J===void 0&&(J={},h.set(W,J));let q=B(_);if(q!==C.__cacheKey){J[q]===void 0&&(J[q]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,V=!0),J[q].usedTimes++;let Te=J[C.__cacheKey];Te!==void 0&&(J[C.__cacheKey].usedTimes--,Te.usedTimes===0&&v(_)),C.__cacheKey=q,C.__webglTexture=J[q].texture}return V}function X(C,_,V){let W=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(W=i.TEXTURE_3D);let J=pt(C,_),q=_.source;t.bindTexture(W,C.__webglTexture,i.TEXTURE0+V);let Te=n.get(q);if(q.version!==Te.__version||J===!0){t.activeTexture(i.TEXTURE0+V);let he=ot.getPrimaries(ot.workingColorSpace),ye=_.colorSpace===zi?null:ot.getPrimaries(_.colorSpace),tt=_.colorSpace===zi||he===ye?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt);let te=b(_.image,!1,s.maxTextureSize);te=Fe(_,te);let Se=r.convert(_.format,_.colorSpace),ze=r.convert(_.type),Ge=S(_.internalFormat,Se,ze,_.colorSpace,_.isVideoTexture);Xe(W,_);let Me,st=_.mipmaps,Qe=_.isVideoTexture!==!0,At=Te.__version===void 0||J===!0,D=q.dataReady,pe=L(_,te);if(_.isDepthTexture)Ge=y(_.format===gr,_.type),At&&(Qe?t.texStorage2D(i.TEXTURE_2D,1,Ge,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Ge,te.width,te.height,0,Se,ze,null));else if(_.isDataTexture)if(st.length>0){Qe&&At&&t.texStorage2D(i.TEXTURE_2D,pe,Ge,st[0].width,st[0].height);for(let $=0,Y=st.length;$<Y;$++)Me=st[$],Qe?D&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,Me.width,Me.height,Se,ze,Me.data):t.texImage2D(i.TEXTURE_2D,$,Ge,Me.width,Me.height,0,Se,ze,Me.data);_.generateMipmaps=!1}else Qe?(At&&t.texStorage2D(i.TEXTURE_2D,pe,Ge,te.width,te.height),D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,te.width,te.height,Se,ze,te.data)):t.texImage2D(i.TEXTURE_2D,0,Ge,te.width,te.height,0,Se,ze,te.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Qe&&At&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,Ge,st[0].width,st[0].height,te.depth);for(let $=0,Y=st.length;$<Y;$++)if(Me=st[$],_.format!==Wn)if(Se!==null)if(Qe){if(D)if(_.layerUpdates.size>0){let be=Dh(Me.width,Me.height,_.format,_.type);for(let me of _.layerUpdates){let Ye=Me.data.subarray(me*be/Me.data.BYTES_PER_ELEMENT,(me+1)*be/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,me,Me.width,Me.height,1,Se,Ye)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Me.width,Me.height,te.depth,Se,Me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,Ge,Me.width,Me.height,te.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Qe?D&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Me.width,Me.height,te.depth,Se,ze,Me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,$,Ge,Me.width,Me.height,te.depth,0,Se,ze,Me.data)}else{Qe&&At&&t.texStorage2D(i.TEXTURE_2D,pe,Ge,st[0].width,st[0].height);for(let $=0,Y=st.length;$<Y;$++)Me=st[$],_.format!==Wn?Se!==null?Qe?D&&t.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,Me.width,Me.height,Se,Me.data):t.compressedTexImage2D(i.TEXTURE_2D,$,Ge,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Qe?D&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,Me.width,Me.height,Se,ze,Me.data):t.texImage2D(i.TEXTURE_2D,$,Ge,Me.width,Me.height,0,Se,ze,Me.data)}else if(_.isDataArrayTexture)if(Qe){if(At&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,Ge,te.width,te.height,te.depth),D)if(_.layerUpdates.size>0){let $=Dh(te.width,te.height,_.format,_.type);for(let Y of _.layerUpdates){let be=te.data.subarray(Y*$/te.data.BYTES_PER_ELEMENT,(Y+1)*$/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Y,te.width,te.height,1,Se,ze,be)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,Se,ze,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ge,te.width,te.height,te.depth,0,Se,ze,te.data);else if(_.isData3DTexture)Qe?(At&&t.texStorage3D(i.TEXTURE_3D,pe,Ge,te.width,te.height,te.depth),D&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,Se,ze,te.data)):t.texImage3D(i.TEXTURE_3D,0,Ge,te.width,te.height,te.depth,0,Se,ze,te.data);else if(_.isFramebufferTexture){if(At)if(Qe)t.texStorage2D(i.TEXTURE_2D,pe,Ge,te.width,te.height);else{let $=te.width,Y=te.height;for(let be=0;be<pe;be++)t.texImage2D(i.TEXTURE_2D,be,Ge,$,Y,0,Se,ze,null),$>>=1,Y>>=1}}else if(st.length>0){if(Qe&&At){let $=xe(st[0]);t.texStorage2D(i.TEXTURE_2D,pe,Ge,$.width,$.height)}for(let $=0,Y=st.length;$<Y;$++)Me=st[$],Qe?D&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,Se,ze,Me):t.texImage2D(i.TEXTURE_2D,$,Ge,Se,ze,Me);_.generateMipmaps=!1}else if(Qe){if(At){let $=xe(te);t.texStorage2D(i.TEXTURE_2D,pe,Ge,$.width,$.height)}D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Se,ze,te)}else t.texImage2D(i.TEXTURE_2D,0,Ge,Se,ze,te);g(_)&&f(W),Te.__version=q.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function ie(C,_,V){if(_.image.length!==6)return;let W=pt(C,_),J=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+V);let q=n.get(J);if(J.version!==q.__version||W===!0){t.activeTexture(i.TEXTURE0+V);let Te=ot.getPrimaries(ot.workingColorSpace),he=_.colorSpace===zi?null:ot.getPrimaries(_.colorSpace),ye=_.colorSpace===zi||Te===he?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);let tt=_.isCompressedTexture||_.image[0].isCompressedTexture,te=_.image[0]&&_.image[0].isDataTexture,Se=[];for(let Y=0;Y<6;Y++)!tt&&!te?Se[Y]=b(_.image[Y],!0,s.maxCubemapSize):Se[Y]=te?_.image[Y].image:_.image[Y],Se[Y]=Fe(_,Se[Y]);let ze=Se[0],Ge=r.convert(_.format,_.colorSpace),Me=r.convert(_.type),st=S(_.internalFormat,Ge,Me,_.colorSpace),Qe=_.isVideoTexture!==!0,At=q.__version===void 0||W===!0,D=J.dataReady,pe=L(_,ze);Xe(i.TEXTURE_CUBE_MAP,_);let $;if(tt){Qe&&At&&t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,st,ze.width,ze.height);for(let Y=0;Y<6;Y++){$=Se[Y].mipmaps;for(let be=0;be<$.length;be++){let me=$[be];_.format!==Wn?Ge!==null?Qe?D&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,be,0,0,me.width,me.height,Ge,me.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,be,st,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Qe?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,be,0,0,me.width,me.height,Ge,Me,me.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,be,st,me.width,me.height,0,Ge,Me,me.data)}}}else{if($=_.mipmaps,Qe&&At){$.length>0&&pe++;let Y=xe(Se[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,st,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(te){Qe?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Se[Y].width,Se[Y].height,Ge,Me,Se[Y].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,st,Se[Y].width,Se[Y].height,0,Ge,Me,Se[Y].data);for(let be=0;be<$.length;be++){let Ye=$[be].image[Y].image;Qe?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,be+1,0,0,Ye.width,Ye.height,Ge,Me,Ye.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,be+1,st,Ye.width,Ye.height,0,Ge,Me,Ye.data)}}else{Qe?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Ge,Me,Se[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,st,Ge,Me,Se[Y]);for(let be=0;be<$.length;be++){let me=$[be];Qe?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,be+1,0,0,Ge,Me,me.image[Y]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,be+1,st,Ge,Me,me.image[Y])}}}g(_)&&f(i.TEXTURE_CUBE_MAP),q.__version=J.version,_.onUpdate&&_.onUpdate(_)}C.__version=_.version}function Ae(C,_,V,W,J,q){let Te=r.convert(V.format,V.colorSpace),he=r.convert(V.type),ye=S(V.internalFormat,Te,he,V.colorSpace),tt=n.get(_),te=n.get(V);if(te.__renderTarget=_,!tt.__hasExternalTextures){let Se=Math.max(1,_.width>>q),ze=Math.max(1,_.height>>q);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?t.texImage3D(J,q,ye,Se,ze,_.depth,0,Te,he,null):t.texImage2D(J,q,ye,Se,ze,0,Te,he,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),_e(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,J,te.__webglTexture,0,Q(_)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,J,te.__webglTexture,q),t.bindFramebuffer(i.FRAMEBUFFER,null)}function oe(C,_,V){if(i.bindRenderbuffer(i.RENDERBUFFER,C),_.depthBuffer){let W=_.depthTexture,J=W&&W.isDepthTexture?W.type:null,q=y(_.stencilBuffer,J),Te=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=Q(_);_e(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,he,q,_.width,_.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,he,q,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,q,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Te,i.RENDERBUFFER,C)}else{let W=_.textures;for(let J=0;J<W.length;J++){let q=W[J],Te=r.convert(q.format,q.colorSpace),he=r.convert(q.type),ye=S(q.internalFormat,Te,he,q.colorSpace),tt=Q(_);V&&_e(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,tt,ye,_.width,_.height):_e(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,tt,ye,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ye,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ve(C,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let W=n.get(_.depthTexture);W.__renderTarget=_,(!W.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),j(_.depthTexture,0);let J=W.__webglTexture,q=Q(_);if(_.depthTexture.format===cr)_e(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(_.depthTexture.format===gr)_e(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function $e(C){let _=n.get(C),V=C.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==C.depthTexture){let W=C.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),W){let J=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,W.removeEventListener("dispose",J)};W.addEventListener("dispose",J),_.__depthDisposeCallback=J}_.__boundDepthTexture=W}if(C.depthTexture&&!_.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");Ve(_.__webglFramebuffer,C)}else if(V){_.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[W]),_.__webglDepthbuffer[W]===void 0)_.__webglDepthbuffer[W]=i.createRenderbuffer(),oe(_.__webglDepthbuffer[W],C,!1);else{let J=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=_.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,q)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),oe(_.__webglDepthbuffer,C,!1);else{let W=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,W,i.RENDERBUFFER,J)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(C,_,V){let W=n.get(C);_!==void 0&&Ae(W.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&$e(C)}function at(C){let _=C.texture,V=n.get(C),W=n.get(_);C.addEventListener("dispose",R);let J=C.textures,q=C.isWebGLCubeRenderTarget===!0,Te=J.length>1;if(Te||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=_.version,a.memory.textures++),q){V.__webglFramebuffer=[];for(let he=0;he<6;he++)if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer[he]=[];for(let ye=0;ye<_.mipmaps.length;ye++)V.__webglFramebuffer[he][ye]=i.createFramebuffer()}else V.__webglFramebuffer[he]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer=[];for(let he=0;he<_.mipmaps.length;he++)V.__webglFramebuffer[he]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(Te)for(let he=0,ye=J.length;he<ye;he++){let tt=n.get(J[he]);tt.__webglTexture===void 0&&(tt.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&_e(C)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let he=0;he<J.length;he++){let ye=J[he];V.__webglColorRenderbuffer[he]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[he]);let tt=r.convert(ye.format,ye.colorSpace),te=r.convert(ye.type),Se=S(ye.internalFormat,tt,te,ye.colorSpace,C.isXRRenderTarget===!0),ze=Q(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,ze,Se,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,V.__webglColorRenderbuffer[he])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),oe(V.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Xe(i.TEXTURE_CUBE_MAP,_);for(let he=0;he<6;he++)if(_.mipmaps&&_.mipmaps.length>0)for(let ye=0;ye<_.mipmaps.length;ye++)Ae(V.__webglFramebuffer[he][ye],C,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+he,ye);else Ae(V.__webglFramebuffer[he],C,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);g(_)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let he=0,ye=J.length;he<ye;he++){let tt=J[he],te=n.get(tt);t.bindTexture(i.TEXTURE_2D,te.__webglTexture),Xe(i.TEXTURE_2D,tt),Ae(V.__webglFramebuffer,C,tt,i.COLOR_ATTACHMENT0+he,i.TEXTURE_2D,0),g(tt)&&f(i.TEXTURE_2D)}t.unbindTexture()}else{let he=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(he=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(he,W.__webglTexture),Xe(he,_),_.mipmaps&&_.mipmaps.length>0)for(let ye=0;ye<_.mipmaps.length;ye++)Ae(V.__webglFramebuffer[ye],C,_,i.COLOR_ATTACHMENT0,he,ye);else Ae(V.__webglFramebuffer,C,_,i.COLOR_ATTACHMENT0,he,0);g(_)&&f(he),t.unbindTexture()}C.depthBuffer&&$e(C)}function Z(C){let _=C.textures;for(let V=0,W=_.length;V<W;V++){let J=_[V];if(g(J)){let q=A(C),Te=n.get(J).__webglTexture;t.bindTexture(q,Te),f(q),t.unbindTexture()}}}let ne=[],I=[];function Le(C){if(C.samples>0){if(_e(C)===!1){let _=C.textures,V=C.width,W=C.height,J=i.COLOR_BUFFER_BIT,q=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Te=n.get(C),he=_.length>1;if(he)for(let ye=0;ye<_.length;ye++)t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let ye=0;ye<_.length;ye++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),he){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Te.__webglColorRenderbuffer[ye]);let tt=n.get(_[ye]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,tt,0)}i.blitFramebuffer(0,0,V,W,0,0,V,W,J,i.NEAREST),l===!0&&(ne.length=0,I.length=0,ne.push(i.COLOR_ATTACHMENT0+ye),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ne.push(q),I.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,I)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ne))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),he)for(let ye=0;ye<_.length;ye++){t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,Te.__webglColorRenderbuffer[ye]);let tt=n.get(_[ye]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,tt,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){let _=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function Q(C){return Math.min(s.maxSamples,C.samples)}function _e(C){let _=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function le(C){let _=a.render.frame;d.get(C)!==_&&(d.set(C,_),C.update())}function Fe(C,_){let V=C.colorSpace,W=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||V!==wr&&V!==zi&&(ot.getTransfer(V)===yt?(W!==Wn||J!==Ei)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),_}function xe(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=F,this.setTexture2D=j,this.setTexture2DArray=k,this.setTexture3D=ee,this.setTextureCube=G,this.rebindTextures=He,this.setupRenderTarget=at,this.updateRenderTargetMipmap=Z,this.updateMultisampleRenderTarget=Le,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=_e}function Qx(i,e){function t(n,s=zi){let r,a=ot.getTransfer(s);if(n===Ei)return i.UNSIGNED_BYTE;if(n===Cd)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Rd)return i.UNSIGNED_SHORT_5_5_5_1;if(n===np)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===ep)return i.BYTE;if(n===tp)return i.SHORT;if(n===oa)return i.UNSIGNED_SHORT;if(n===Td)return i.INT;if(n===ms)return i.UNSIGNED_INT;if(n===ii)return i.FLOAT;if(n===_a)return i.HALF_FLOAT;if(n===ip)return i.ALPHA;if(n===sp)return i.RGB;if(n===Wn)return i.RGBA;if(n===rp)return i.LUMINANCE;if(n===ap)return i.LUMINANCE_ALPHA;if(n===cr)return i.DEPTH_COMPONENT;if(n===gr)return i.DEPTH_STENCIL;if(n===Pd)return i.RED;if(n===Id)return i.RED_INTEGER;if(n===op)return i.RG;if(n===Ld)return i.RG_INTEGER;if(n===Dd)return i.RGBA_INTEGER;if(n===_o||n===So||n===Mo||n===Eo)if(a===yt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_o)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===So)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_o)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===So)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Mo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Eo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===mc||n===gc||n===bc||n===vc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===mc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===gc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===bc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===vc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===xc||n===yc||n===_c)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===xc||n===yc)return a===yt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===_c)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Sc||n===Mc||n===Ec||n===wc||n===Ac||n===Tc||n===Cc||n===Rc||n===Pc||n===Ic||n===Lc||n===Dc||n===Oc||n===Nc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Sc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Mc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ec)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===wc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ac)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Tc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Cc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Rc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Pc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ic)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Lc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Dc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Oc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Nc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wo||n===Uc||n===Vc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===wo)return a===yt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Uc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Vc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===lp||n===Bc||n===Fc||n===zc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===wo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Bc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Fc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===zc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===mr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function sy(i,e){function t(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function n(g,f){f.color.getRGB(g.fogColor.value,fp(i)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,A,S,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(g,f):f.isMeshToonMaterial?(r(g,f),u(g,f)):f.isMeshPhongMaterial?(r(g,f),d(g,f)):f.isMeshStandardMaterial?(r(g,f),h(g,f),f.isMeshPhysicalMaterial&&p(g,f,y)):f.isMeshMatcapMaterial?(r(g,f),m(g,f)):f.isMeshDepthMaterial?r(g,f):f.isMeshDistanceMaterial?(r(g,f),b(g,f)):f.isMeshNormalMaterial?r(g,f):f.isLineBasicMaterial?(a(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?l(g,f,A,S):f.isSpriteMaterial?c(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,t(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===bn&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,t(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===bn&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,t(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,t(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);let A=e.get(f),S=A.envMap,y=A.envMapRotation;S&&(g.envMap.value=S,cs.copy(y),cs.x*=-1,cs.y*=-1,cs.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(cs.y*=-1,cs.z*=-1),g.envMapRotation.value.setFromMatrix4(iy.makeRotationFromEuler(cs)),g.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,g.aoMapTransform))}function a(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function l(g,f,A,S){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*A,g.scale.value=S*.5,f.map&&(g.map.value=f.map,t(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function c(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function u(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function h(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function p(g,f,A){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===bn&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=A.texture,g.transmissionSamplerSize.value.set(A.width,A.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,f){f.matcap&&(g.matcap.value=f.matcap)}function b(g,f){let A=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(A.matrixWorld),g.nearDistance.value=A.shadow.camera.near,g.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ry(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,S){let y=S.program;n.uniformBlockBinding(A,y)}function c(A,S){let y=s[A.id];y===void 0&&(m(A),y=d(A),s[A.id]=y,A.addEventListener("dispose",g));let L=S.program;n.updateUBOMapping(A,L);let T=e.render.frame;r[A.id]!==T&&(h(A),r[A.id]=T)}function d(A){let S=u();A.__bindingPointIndex=S;let y=i.createBuffer(),L=A.__size,T=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,L,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,y),y}function u(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(A){let S=s[A.id],y=A.uniforms,L=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let T=0,R=y.length;T<R;T++){let w=Array.isArray(y[T])?y[T]:[y[T]];for(let v=0,x=w.length;v<x;v++){let P=w[v];if(p(P,T,v,L)===!0){let F=P.__offset,U=Array.isArray(P.value)?P.value:[P.value],B=0;for(let j=0;j<U.length;j++){let k=U[j],ee=b(k);typeof k=="number"||typeof k=="boolean"?(P.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,F+B,P.__data)):k.isMatrix3?(P.__data[0]=k.elements[0],P.__data[1]=k.elements[1],P.__data[2]=k.elements[2],P.__data[3]=0,P.__data[4]=k.elements[3],P.__data[5]=k.elements[4],P.__data[6]=k.elements[5],P.__data[7]=0,P.__data[8]=k.elements[6],P.__data[9]=k.elements[7],P.__data[10]=k.elements[8],P.__data[11]=0):(k.toArray(P.__data,B),B+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(A,S,y,L){let T=A.value,R=S+"_"+y;if(L[R]===void 0)return typeof T=="number"||typeof T=="boolean"?L[R]=T:L[R]=T.clone(),!0;{let w=L[R];if(typeof T=="number"||typeof T=="boolean"){if(w!==T)return L[R]=T,!0}else if(w.equals(T)===!1)return w.copy(T),!0}return!1}function m(A){let S=A.uniforms,y=0,L=16;for(let R=0,w=S.length;R<w;R++){let v=Array.isArray(S[R])?S[R]:[S[R]];for(let x=0,P=v.length;x<P;x++){let F=v[x],U=Array.isArray(F.value)?F.value:[F.value];for(let B=0,j=U.length;B<j;B++){let k=U[B],ee=b(k),G=y%L,de=G%ee.boundary,ve=G+de;y+=de,ve!==0&&L-ve<ee.storage&&(y+=L-ve),F.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=ee.storage}}}let T=y%L;return T>0&&(y+=L-T),A.__size=y,A.__cache={},this}function b(A){let S={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(S.boundary=4,S.storage=4):A.isVector2?(S.boundary=8,S.storage=8):A.isVector3||A.isColor?(S.boundary=16,S.storage=12):A.isVector4?(S.boundary=16,S.storage=16):A.isMatrix3?(S.boundary=48,S.storage=48):A.isMatrix4?(S.boundary=64,S.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),S}function g(A){let S=A.target;S.removeEventListener("dispose",g);let y=a.indexOf(S.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function f(){for(let A in s)i.deleteBuffer(s[A]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}function ho(i,e,t,n,s,r){sr.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(qr.x=r*sr.x-s*sr.y,qr.y=s*sr.x+r*sr.y):qr.copy(sr),i.copy(e),i.x+=qr.x,i.y+=qr.y,i.applyMatrix4(yp)}function mo(i,e,t,n,s,r){let a=i.geometry.attributes.position;if(zo.fromBufferAttribute(a,s),Ho.fromBufferAttribute(a,r),t.distanceSqToSegment(zo,Ho,Kl,Fh)>n)return;Kl.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Kl);if(!(l<e.near||l>e.far))return{distance:l,point:Fh.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}function Ud(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,d,u){let h=(a-r)/c-(o-r)/(c+d)+(o-a)/d,p=(o-a)/d-(l-a)/(d+u)+(l-o)/u;h*=d,p*=d,s(a,o,h,p)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}function kh(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function oy(i,e){let t=1-i;return t*t*e}function ly(i,e){return 2*(1-i)*i*e}function cy(i,e){return i*i*e}function ia(i,e,t,n){return oy(i,e)+ly(i,t)+cy(i,n)}function dy(i,e){let t=1-i;return t*t*t*e}function uy(i,e){let t=1-i;return 3*t*t*i*e}function hy(i,e){return 3*(1-i)*i*i*e}function py(i,e){return i*i*i*e}function sa(i,e,t,n,s){return dy(i,e)+uy(i,t)+hy(i,n)+py(i,s)}function _p(i,e,t,n,s){let r,a;if(s===Py(i,e,t,n)>0)for(r=e;r<t;r+=n)a=Gh(r,i[r],i[r+1],a);else for(r=t-n;r>=e;r-=n)a=Gh(r,i[r],i[r+1],a);return a&&rl(a,a.next)&&(ga(a),a=a.next),a}function Ss(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(rl(t,t.next)||Vt(t.prev,t,t.next)===0)){if(ga(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function fa(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Ey(i,n,s,r);let o=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?gy(i,n,s,r):my(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),ga(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=by(Ss(i),e,t),fa(i,e,t,n,s,r,2)):a===2&&vy(i,e,t,n,s,r):fa(Ss(i),e,t,n,s,r,1);break}}}function my(i){let e=i.prev,t=i,n=i.next;if(Vt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,d=s<r?s<a?s:a:r<a?r:a,u=o<l?o<c?o:c:l<c?l:c,h=s>r?s>a?s:a:r>a?r:a,p=o>l?o>c?o:c:l>c?l:c,m=n.next;for(;m!==e;){if(m.x>=d&&m.x<=h&&m.y>=u&&m.y<=p&&or(s,o,r,l,a,c,m.x,m.y)&&Vt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function gy(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Vt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,d=s.y,u=r.y,h=a.y,p=o<l?o<c?o:c:l<c?l:c,m=d<u?d<h?d:h:u<h?u:h,b=o>l?o>c?o:c:l>c?l:c,g=d>u?d>h?d:h:u>h?u:h,f=hd(p,m,e,t,n),A=hd(b,g,e,t,n),S=i.prevZ,y=i.nextZ;for(;S&&S.z>=f&&y&&y.z<=A;){if(S.x>=p&&S.x<=b&&S.y>=m&&S.y<=g&&S!==s&&S!==a&&or(o,d,l,u,c,h,S.x,S.y)&&Vt(S.prev,S,S.next)>=0||(S=S.prevZ,y.x>=p&&y.x<=b&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&or(o,d,l,u,c,h,y.x,y.y)&&Vt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;S&&S.z>=f;){if(S.x>=p&&S.x<=b&&S.y>=m&&S.y<=g&&S!==s&&S!==a&&or(o,d,l,u,c,h,S.x,S.y)&&Vt(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;y&&y.z<=A;){if(y.x>=p&&y.x<=b&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&or(o,d,l,u,c,h,y.x,y.y)&&Vt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function by(i,e,t){let n=i;do{let s=n.prev,r=n.next.next;!rl(s,r)&&Sp(s,n,n.next,r)&&ma(s,r)&&ma(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),ga(n),ga(n.next),n=i=r),n=n.next}while(n!==i);return Ss(n)}function vy(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Ty(a,o)){let l=Mp(a,o);a=Ss(a,a.next),l=Ss(l,l.next),fa(a,e,t,n,s,r,0),fa(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function xy(i,e,t,n){let s=[],r,a,o,l,c;for(r=0,a=e.length;r<a;r++)o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=_p(i,o,l,n,!1),c===c.next&&(c.steiner=!0),s.push(Ay(c));for(s.sort(yy),r=0;r<s.length;r++)t=_y(s[r],t);return t}function yy(i,e){return i.x-e.x}function _y(i,e){let t=Sy(i,e);if(!t)return e;let n=Mp(t,i);return Ss(n,n.next),Ss(t,t.next)}function Sy(i,e){let t=e,n=-1/0,s,r=i.x,a=i.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){let h=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=r&&h>n&&(n=h,s=t.x<t.next.x?t:t.next,h===r))return s}t=t.next}while(t!==e);if(!s)return null;let o=s,l=s.x,c=s.y,d=1/0,u;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&or(a<c?r:n,a,l,c,a<c?n:r,a,t.x,t.y)&&(u=Math.abs(a-t.y)/(r-t.x),ma(t,i)&&(u<d||u===d&&(t.x>s.x||t.x===s.x&&My(s,t)))&&(s=t,d=u)),t=t.next;while(t!==o);return s}function My(i,e){return Vt(i.prev,i,e.prev)<0&&Vt(e.next,i,i.next)<0}function Ey(i,e,t,n){let s=i;do s.z===0&&(s.z=hd(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,wy(s)}function wy(i){let e,t,n,s,r,a,o,l,c=1;do{for(t=i,i=null,r=null,a=0;t;){for(a++,n=t,o=0,e=0;e<c&&(o++,n=n.nextZ,!!n);e++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,o--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(a>1);return i}function hd(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Ay(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function or(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Ty(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Cy(i,e)&&(ma(i,e)&&ma(e,i)&&Ry(i,e)&&(Vt(i.prev,i,e.prev)||Vt(i,e.prev,e))||rl(i,e)&&Vt(i.prev,i,i.next)>0&&Vt(e.prev,e,e.next)>0)}function Vt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function rl(i,e){return i.x===e.x&&i.y===e.y}function Sp(i,e,t,n){let s=vo(Vt(i,e,t)),r=vo(Vt(i,e,n)),a=vo(Vt(t,n,i)),o=vo(Vt(t,n,e));return!!(s!==r&&a!==o||s===0&&bo(i,t,e)||r===0&&bo(i,n,e)||a===0&&bo(t,i,n)||o===0&&bo(t,e,n))}function bo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function vo(i){return i>0?1:i<0?-1:0}function Cy(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Sp(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ma(i,e){return Vt(i.prev,i,i.next)<0?Vt(i,e,i.next)>=0&&Vt(i,i.prev,e)>=0:Vt(i,e,i.prev)<0||Vt(i,i.next,e)<0}function Ry(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Mp(i,e){let t=new pd(i.i,i.x,i.y),n=new pd(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Gh(i,e,t,n){let s=new pd(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ga(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function pd(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Py(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}function $h(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Wh(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}function Ly(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}function xo(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Dy(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Xh(){return performance.now()}function Zh(i,e){return i.distance-e.distance}function Ad(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)Ad(r[a],e,t,!0)}}var Xn,ci,lm,Nu,cm,Jh,ya,_i,$i,bn,Gn,ki,lr,Ao,Uu,Vu,dm,us,um,hm,pm,fm,mm,gm,bm,vm,ic,sc,xm,ym,_m,Sm,Mm,Em,wm,Am,Tm,rc,ac,oc,hr,lc,cc,dc,uc,Kh,Cm,Rm,Gi,Pm,Im,Lm,Er,Dm,Om,Nm,Qh,pr,fr,hc,pc,nl,aa,ps,fc,An,Um,ka,ni,Ml,fs,Ei,ep,tp,oa,Td,ms,ii,_a,Cd,Rd,mr,np,ip,sp,Wn,rp,ap,cr,gr,Pd,Id,op,Ld,Dd,_o,So,Mo,Eo,mc,gc,bc,vc,xc,yc,_c,Sc,Mc,Ec,wc,Ac,Tc,Cc,Rc,Pc,Ic,Lc,Dc,Oc,Nc,wo,Uc,Vc,lp,Bc,Fc,zc,To,Hc,El,Bu,Fu,zu,Vm,Bm,cp,Fm,zi,kt,wr,il,yt,Hs,Hu,zm,Hm,km,dp,Gm,$m,Wm,jm,kc,ku,Si,Co,wi,on,Gu,ea,la,up,K,Je,wl,$u,ot,Wu,ju,qu,Xu,Yu,ks,Gc,p0,Po,f0,vn,zt,$c,Ai,Io,Wc,pn,E,Tl,Zu,jt,gi,zn,Ga,Gs,$s,Ws,Oi,Ni,ss,kr,$a,Wa,rs,m0,Gr,Rl,Wi,bi,Pl,ja,Ui,Il,qa,Ll,gs,ut,js,Hn,g0,b0,Vi,Xa,Mn,Ju,Ku,ri,ca,v0,Qu,qs,vi,Ya,$r,x0,y0,eh,th,nh,ih,_0,Xs,Dl,sn,kn,xi,Ol,yi,Ys,Zs,sh,Nl,Ul,Vl,Bl,Fl,zl,Hi,pp,Bi,Za,Be,ln,S0,ai,tn,Gt,Ja,nn,Lo,Do,rt,M0,Dn,kl,Js,En,Wr,en,qt,rh,as,Ka,ah,Qa,eo,to,Gl,no,oh,io,Oe,Xt,A0,T0,C0,oi,Oo,Fi,lh,ch,cn,Ks,Qs,jc,No,qc,$l,R0,P0,wn,os,ro,da,Ht,L0,D0,O0,N0,U0,V0,B0,F0,z0,H0,k0,G0,$0,W0,j0,q0,X0,Y0,Z0,J0,K0,Q0,eg,tg,ng,ig,sg,rg,ag,og,lg,cg,dg,ug,hg,pg,fg,mg,gg,bg,vg,xg,yg,_g,Sg,Mg,Eg,wg,Ag,Tg,Cg,Rg,Pg,Ig,Lg,Dg,Og,Ng,Ug,Vg,Bg,Fg,zg,Hg,kg,Gg,$g,Wg,jg,qg,Xg,Yg,Zg,Jg,Kg,Qg,eb,tb,nb,ib,sb,rb,ab,ob,lb,cb,db,ub,hb,pb,fb,mb,gb,bb,vb,xb,yb,_b,Sb,Mb,Eb,wb,Ab,Tb,Cb,Rb,Pb,Ib,Lb,Db,Ob,Nb,Ub,Vb,Bb,Fb,zb,Hb,kb,Gb,$b,Wb,jb,qb,Xb,Yb,Zb,Jb,Kb,Qb,ev,tv,nv,iv,sv,rv,av,ov,lv,cv,dv,et,ue,ti,ao,ls,uv,vr,ar,dh,hs,Wl,uh,jl,ql,Xl,Yl,ds,er,hh,Uo,Vo,gp,gh,bp,vp,xp,bh,vh,xh,yh,_h,Xc,Yc,Zc,Zl,ur,fx,mx,Eh,lo,Ex,wx,Tx,Nx,Kc,Qc,kx,ed,td,jx,qx,Yx,nd,Ue,ey,na,ty,ny,id,sd,cs,iy,bs,vs,rd,un,Bo,ji,tr,jr,nr,ir,sr,qr,yp,co,Xr,uo,Oh,Jl,Nh,xs,ad,Fo,rr,Uh,po,Vh,ay,Yr,Zr,ua,xr,zo,Ho,Bh,Jr,fo,Kl,Fh,od,zh,Hh,ha,yr,On,pa,ld,go,Ql,ec,tc,Ti,ko,ys,Go,cd,$o,Wo,jo,qo,dd,_s,ud,Xo,Ct,qi,fy,ra,Ms,Iy,ba,li,va,jn,Yo,lt,_r,fd,md,gd,qn,Es,bd,vd,xd,Zo,ws,yd,_d,Oy,Sd,Jo,As,nc,jh,qh,Md,Ed,Ci,Sr,Vd,Ny,Bd,Uy,Vy,By,Fy,zy,Hy,ky,wd,Ot,X_,Yh,Ko,xa,Mr,yo,Qo,el,tl,Tr=vt(()=>{Xn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ci={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},lm=0,Nu=1,cm=2,Jh=1,ya=2,_i=3,$i=0,bn=1,Gn=2,ki=0,lr=1,Ao=2,Uu=3,Vu=4,dm=5,us=100,um=101,hm=102,pm=103,fm=104,mm=200,gm=201,bm=202,vm=203,ic=204,sc=205,xm=206,ym=207,_m=208,Sm=209,Mm=210,Em=211,wm=212,Am=213,Tm=214,rc=0,ac=1,oc=2,hr=3,lc=4,cc=5,dc=6,uc=7,Kh=0,Cm=1,Rm=2,Gi=0,Pm=1,Im=2,Lm=3,Er=4,Dm=5,Om=6,Nm=7,Qh=300,pr=301,fr=302,hc=303,pc=304,nl=306,aa=1e3,ps=1001,fc=1002,An=1003,Um=1004,ka=1005,ni=1006,Ml=1007,fs=1008,Ei=1009,ep=1010,tp=1011,oa=1012,Td=1013,ms=1014,ii=1015,_a=1016,Cd=1017,Rd=1018,mr=1020,np=35902,ip=1021,sp=1022,Wn=1023,rp=1024,ap=1025,cr=1026,gr=1027,Pd=1028,Id=1029,op=1030,Ld=1031,Dd=1033,_o=33776,So=33777,Mo=33778,Eo=33779,mc=35840,gc=35841,bc=35842,vc=35843,xc=36196,yc=37492,_c=37496,Sc=37808,Mc=37809,Ec=37810,wc=37811,Ac=37812,Tc=37813,Cc=37814,Rc=37815,Pc=37816,Ic=37817,Lc=37818,Dc=37819,Oc=37820,Nc=37821,wo=36492,Uc=36494,Vc=36495,lp=36283,Bc=36284,Fc=36285,zc=36286,To=2300,Hc=2301,El=2302,Bu=2400,Fu=2401,zu=2402,Vm=3200,Bm=3201,cp=0,Fm=1,zi="",kt="srgb",wr="srgb-linear",il="linear",yt="srgb",Hs=7680,Hu=519,zm=512,Hm=513,km=514,dp=515,Gm=516,$m=517,Wm=518,jm=519,kc=35044,ku="300 es",Si=2e3,Co=2001,wi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},on=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Gu=1234567,ea=Math.PI/180,la=180/Math.PI;up={DEG2RAD:ea,RAD2DEG:la,generateUUID:si,clamp:Wt,euclideanModulo:Od,mapLinear:qm,inverseLerp:Xm,lerp:ta,damp:Ym,pingpong:Zm,smoothstep:Jm,smootherstep:Km,randInt:Qm,randFloat:e0,randFloatSpread:t0,seededRandom:n0,degToRad:i0,radToDeg:s0,isPowerOfTwo:r0,ceilPowerOfTwo:a0,floorPowerOfTwo:o0,setQuaternionFromProperEuler:l0,normalize:xt,denormalize:$n},K=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Je=class i{constructor(e,t,n,s,r,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=n,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],d=n[4],u=n[7],h=n[2],p=n[5],m=n[8],b=s[0],g=s[3],f=s[6],A=s[1],S=s[4],y=s[7],L=s[2],T=s[5],R=s[8];return r[0]=a*b+o*A+l*L,r[3]=a*g+o*S+l*T,r[6]=a*f+o*y+l*R,r[1]=c*b+d*A+u*L,r[4]=c*g+d*S+u*T,r[7]=c*f+d*y+u*R,r[2]=h*b+p*A+m*L,r[5]=h*g+p*S+m*T,r[8]=h*f+p*y+m*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-n*r*d+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*a-o*c,h=o*l-d*r,p=c*r-a*l,m=t*u+n*h+s*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/m;return e[0]=u*b,e[1]=(s*c-d*n)*b,e[2]=(o*n-s*a)*b,e[3]=h*b,e[4]=(d*t-s*l)*b,e[5]=(s*r-o*t)*b,e[6]=p*b,e[7]=(n*l-c*t)*b,e[8]=(a*t-n*r)*b,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(wl.makeScale(e,t)),this}rotate(e){return this.premultiply(wl.makeRotation(-e)),this}translate(e,t){return this.premultiply(wl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},wl=new Je;$u={};ot={enabled:!0,workingColorSpace:wr,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===yt&&(i.r=Mi(i.r),i.g=Mi(i.g),i.b=Mi(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===yt&&(i.r=dr(i.r),i.g=dr(i.g),i.b=dr(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===zi?il:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};Wu=[.64,.33,.3,.6,.15,.06],ju=[.2126,.7152,.0722],qu=[.3127,.329],Xu=new Je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Yu=new Je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ot.define({[wr]:{primaries:Wu,whitePoint:qu,transfer:il,toXYZ:Xu,fromXYZ:Yu,luminanceCoefficients:ju,workingColorSpaceConfig:{unpackColorSpace:kt},outputColorSpaceConfig:{drawingBufferColorSpace:kt}},[kt]:{primaries:Wu,whitePoint:qu,transfer:yt,toXYZ:Xu,fromXYZ:Yu,luminanceCoefficients:ju,outputColorSpaceConfig:{drawingBufferColorSpace:kt}}});Gc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ks===void 0&&(ks=Ro("canvas")),ks.width=e.width,ks.height=e.height;let n=ks.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ks}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ro("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Mi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Mi(t[n]/255)*255):t[n]=Mi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},p0=0,Po=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:p0++}),this.uuid=si(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Al(s[a].image)):r.push(Al(s[a]))}else r=Al(s);n.url=r}return t||(e.images[this.uuid]=n),n}};f0=0,vn=class i extends wi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=ps,s=ps,r=ni,a=fs,o=Wn,l=Ei,c=i.DEFAULT_ANISOTROPY,d=zi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:f0++}),this.uuid=si(),this.name="",this.source=new Po(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new K(0,0),this.repeat=new K(1,1),this.center=new K(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Qh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case aa:e.x=e.x-Math.floor(e.x);break;case ps:e.x=e.x<0?0:1;break;case fc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case aa:e.y=e.y-Math.floor(e.y);break;case ps:e.y=e.y<0?0:1;break;case fc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};vn.DEFAULT_IMAGE=null;vn.DEFAULT_MAPPING=Qh;vn.DEFAULT_ANISOTROPY=1;zt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],p=l[5],m=l[9],b=l[2],g=l[6],f=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-b)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+b)<.1&&Math.abs(m+g)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let S=(c+1)/2,y=(p+1)/2,L=(f+1)/2,T=(d+h)/4,R=(u+b)/4,w=(m+g)/4;return S>y&&S>L?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=T/n,r=R/n):y>L?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=w/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=R/r,s=w/r),this.set(n,s,r,t),this}let A=Math.sqrt((g-m)*(g-m)+(u-b)*(u-b)+(h-d)*(h-d));return Math.abs(A)<.001&&(A=1),this.x=(g-m)/A,this.y=(u-b)/A,this.z=(h-d)/A,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$c=class extends wi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new zt(0,0,e,t),this.scissorTest=!1,this.viewport=new zt(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ni,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new vn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Po(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ai=class extends $c{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Io=class extends vn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=ps,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Wc=class extends vn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=ps,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},pn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],d=n[s+2],u=n[s+3],h=r[a+0],p=r[a+1],m=r[a+2],b=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=h,e[t+1]=p,e[t+2]=m,e[t+3]=b;return}if(u!==b||l!==h||c!==p||d!==m){let g=1-o,f=l*h+c*p+d*m+u*b,A=f>=0?1:-1,S=1-f*f;if(S>Number.EPSILON){let L=Math.sqrt(S),T=Math.atan2(L,f*A);g=Math.sin(g*T)/L,o=Math.sin(o*T)/L}let y=o*A;if(l=l*g+h*y,c=c*g+p*y,d=d*g+m*y,u=u*g+b*y,g===1-o){let L=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=L,c*=L,d*=L,u*=L}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],d=n[s+3],u=r[a],h=r[a+1],p=r[a+2],m=r[a+3];return e[t]=o*m+d*u+l*p-c*h,e[t+1]=l*m+d*h+c*u-o*p,e[t+2]=c*m+d*p+o*h-l*u,e[t+3]=d*m-o*u-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(s/2),u=o(r/2),h=l(n/2),p=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=h*d*u+c*p*m,this._y=c*p*u-h*d*m,this._z=c*d*m+h*p*u,this._w=c*d*u-h*p*m;break;case"YXZ":this._x=h*d*u+c*p*m,this._y=c*p*u-h*d*m,this._z=c*d*m-h*p*u,this._w=c*d*u+h*p*m;break;case"ZXY":this._x=h*d*u-c*p*m,this._y=c*p*u+h*d*m,this._z=c*d*m+h*p*u,this._w=c*d*u-h*p*m;break;case"ZYX":this._x=h*d*u-c*p*m,this._y=c*p*u+h*d*m,this._z=c*d*m-h*p*u,this._w=c*d*u+h*p*m;break;case"YZX":this._x=h*d*u+c*p*m,this._y=c*p*u+h*d*m,this._z=c*d*m-h*p*u,this._w=c*d*u-h*p*m;break;case"XZY":this._x=h*d*u-c*p*m,this._y=c*p*u-h*d*m,this._z=c*d*m+h*p*u,this._w=c*d*u+h*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=n+o+u;if(h>0){let p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(d-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>u){let p=2*Math.sqrt(1+n-o-u);this._w=(d-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>u){let p=2*Math.sqrt(1+o-n-u);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+d)/p}else{let p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Wt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-n*c,this._z=r*d+a*c+n*l-s*o,this._w=a*d-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),d=Math.atan2(c,o),u=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=a*u+this._w*h,this._x=n*u+this._x*h,this._y=s*u+this._y*h,this._z=r*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},E=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Zu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Zu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),d=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*d,this.y=n+l*d+o*c-r*u,this.z=s+l*u+r*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Tl.copy(this).projectOnVector(e),this.sub(Tl)}reflect(e){return this.sub(Tl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Tl=new E,Zu=new pn,jt=class{constructor(e=new E(1/0,1/0,1/0),t=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(zn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(zn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=zn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,zn):zn.fromBufferAttribute(r,a),zn.applyMatrix4(e.matrixWorld),this.expandByPoint(zn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ga.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ga.copy(n.boundingBox)),Ga.applyMatrix4(e.matrixWorld),this.union(Ga)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,zn),zn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(kr),$a.subVectors(this.max,kr),Gs.subVectors(e.a,kr),$s.subVectors(e.b,kr),Ws.subVectors(e.c,kr),Oi.subVectors($s,Gs),Ni.subVectors(Ws,$s),ss.subVectors(Gs,Ws);let t=[0,-Oi.z,Oi.y,0,-Ni.z,Ni.y,0,-ss.z,ss.y,Oi.z,0,-Oi.x,Ni.z,0,-Ni.x,ss.z,0,-ss.x,-Oi.y,Oi.x,0,-Ni.y,Ni.x,0,-ss.y,ss.x,0];return!Cl(t,Gs,$s,Ws,$a)||(t=[1,0,0,0,1,0,0,0,1],!Cl(t,Gs,$s,Ws,$a))?!1:(Wa.crossVectors(Oi,Ni),t=[Wa.x,Wa.y,Wa.z],Cl(t,Gs,$s,Ws,$a))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,zn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(zn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},gi=[new E,new E,new E,new E,new E,new E,new E,new E],zn=new E,Ga=new jt,Gs=new E,$s=new E,Ws=new E,Oi=new E,Ni=new E,ss=new E,kr=new E,$a=new E,Wa=new E,rs=new E;m0=new jt,Gr=new E,Rl=new E,Wi=class{constructor(e=new E,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):m0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Gr.subVectors(e,this.center);let t=Gr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Gr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Rl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Gr.copy(e.center).add(Rl)),this.expandByPoint(Gr.copy(e.center).sub(Rl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},bi=new E,Pl=new E,ja=new E,Ui=new E,Il=new E,qa=new E,Ll=new E,gs=class{constructor(e=new E,t=new E(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,bi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=bi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(bi.copy(this.origin).addScaledVector(this.direction,t),bi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Pl.copy(e).add(t).multiplyScalar(.5),ja.copy(t).sub(e).normalize(),Ui.copy(this.origin).sub(Pl);let r=e.distanceTo(t)*.5,a=-this.direction.dot(ja),o=Ui.dot(this.direction),l=-Ui.dot(ja),c=Ui.lengthSq(),d=Math.abs(1-a*a),u,h,p,m;if(d>0)if(u=a*l-o,h=a*o-l,m=r*d,u>=0)if(h>=-m)if(h<=m){let b=1/d;u*=b,h*=b,p=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=r,u=Math.max(0,-(a*h+o)),p=-u*u+h*(h+2*l)+c;else h=-r,u=Math.max(0,-(a*h+o)),p=-u*u+h*(h+2*l)+c;else h<=-m?(u=Math.max(0,-(-a*r+o)),h=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+h*(h+2*l)+c):h<=m?(u=0,h=Math.min(Math.max(-r,-l),r),p=h*(h+2*l)+c):(u=Math.max(0,-(a*r+o)),h=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+h*(h+2*l)+c);else h=a>0?-r:r,u=Math.max(0,-(a*h+o)),p=-u*u+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Pl).addScaledVector(ja,h),p}intersectSphere(e,t){bi.subVectors(e.center,this.origin);let n=bi.dot(this.direction),s=bi.dot(bi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(r=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,bi)!==null}intersectTriangle(e,t,n,s,r){Il.subVectors(t,e),qa.subVectors(n,e),Ll.crossVectors(Il,qa);let a=this.direction.dot(Ll),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ui.subVectors(this.origin,e);let l=o*this.direction.dot(qa.crossVectors(Ui,qa));if(l<0)return null;let c=o*this.direction.dot(Il.cross(Ui));if(c<0||l+c>a)return null;let d=-o*Ui.dot(Ll);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ut=class i{constructor(e,t,n,s,r,a,o,l,c,d,u,h,p,m,b,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,d,u,h,p,m,b,g)}set(e,t,n,s,r,a,o,l,c,d,u,h,p,m,b,g){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=d,f[10]=u,f[14]=h,f[3]=p,f[7]=m,f[11]=b,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/js.setFromMatrixColumn(e,0).length(),r=1/js.setFromMatrixColumn(e,1).length(),a=1/js.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let h=a*d,p=a*u,m=o*d,b=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=p+m*c,t[5]=h-b*c,t[9]=-o*l,t[2]=b-h*c,t[6]=m+p*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*d,p=l*u,m=c*d,b=c*u;t[0]=h+b*o,t[4]=m*o-p,t[8]=a*c,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=p*o-m,t[6]=b+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*d,p=l*u,m=c*d,b=c*u;t[0]=h-b*o,t[4]=-a*u,t[8]=m+p*o,t[1]=p+m*o,t[5]=a*d,t[9]=b-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*d,p=a*u,m=o*d,b=o*u;t[0]=l*d,t[4]=m*c-p,t[8]=h*c+b,t[1]=l*u,t[5]=b*c+h,t[9]=p*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,p=a*c,m=o*l,b=o*c;t[0]=l*d,t[4]=b-h*u,t[8]=m*u+p,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=p*u+m,t[10]=h-b*u}else if(e.order==="XZY"){let h=a*l,p=a*c,m=o*l,b=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+b,t[5]=a*d,t[9]=p*u-m,t[2]=m*u-p,t[6]=o*d,t[10]=b*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(g0,e,b0)}lookAt(e,t,n){let s=this.elements;return Mn.subVectors(e,t),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Vi.crossVectors(n,Mn),Vi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Vi.crossVectors(n,Mn)),Vi.normalize(),Xa.crossVectors(Mn,Vi),s[0]=Vi.x,s[4]=Xa.x,s[8]=Mn.x,s[1]=Vi.y,s[5]=Xa.y,s[9]=Mn.y,s[2]=Vi.z,s[6]=Xa.z,s[10]=Mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],d=n[1],u=n[5],h=n[9],p=n[13],m=n[2],b=n[6],g=n[10],f=n[14],A=n[3],S=n[7],y=n[11],L=n[15],T=s[0],R=s[4],w=s[8],v=s[12],x=s[1],P=s[5],F=s[9],U=s[13],B=s[2],j=s[6],k=s[10],ee=s[14],G=s[3],de=s[7],ve=s[11],we=s[15];return r[0]=a*T+o*x+l*B+c*G,r[4]=a*R+o*P+l*j+c*de,r[8]=a*w+o*F+l*k+c*ve,r[12]=a*v+o*U+l*ee+c*we,r[1]=d*T+u*x+h*B+p*G,r[5]=d*R+u*P+h*j+p*de,r[9]=d*w+u*F+h*k+p*ve,r[13]=d*v+u*U+h*ee+p*we,r[2]=m*T+b*x+g*B+f*G,r[6]=m*R+b*P+g*j+f*de,r[10]=m*w+b*F+g*k+f*ve,r[14]=m*v+b*U+g*ee+f*we,r[3]=A*T+S*x+y*B+L*G,r[7]=A*R+S*P+y*j+L*de,r[11]=A*w+S*F+y*k+L*ve,r[15]=A*v+S*U+y*ee+L*we,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],p=e[14],m=e[3],b=e[7],g=e[11],f=e[15];return m*(+r*l*u-s*c*u-r*o*h+n*c*h+s*o*p-n*l*p)+b*(+t*l*p-t*c*h+r*a*h-s*a*p+s*c*d-r*l*d)+g*(+t*c*u-t*o*p-r*a*u+n*a*p+r*o*d-n*c*d)+f*(-s*o*d-t*l*u+t*o*h+s*a*u-n*a*h+n*l*d)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],p=e[11],m=e[12],b=e[13],g=e[14],f=e[15],A=u*g*c-b*h*c+b*l*p-o*g*p-u*l*f+o*h*f,S=m*h*c-d*g*c-m*l*p+a*g*p+d*l*f-a*h*f,y=d*b*c-m*u*c+m*o*p-a*b*p-d*o*f+a*u*f,L=m*u*l-d*b*l-m*o*h+a*b*h+d*o*g-a*u*g,T=t*A+n*S+s*y+r*L;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/T;return e[0]=A*R,e[1]=(b*h*r-u*g*r-b*s*p+n*g*p+u*s*f-n*h*f)*R,e[2]=(o*g*r-b*l*r+b*s*c-n*g*c-o*s*f+n*l*f)*R,e[3]=(u*l*r-o*h*r-u*s*c+n*h*c+o*s*p-n*l*p)*R,e[4]=S*R,e[5]=(d*g*r-m*h*r+m*s*p-t*g*p-d*s*f+t*h*f)*R,e[6]=(m*l*r-a*g*r-m*s*c+t*g*c+a*s*f-t*l*f)*R,e[7]=(a*h*r-d*l*r+d*s*c-t*h*c-a*s*p+t*l*p)*R,e[8]=y*R,e[9]=(m*u*r-d*b*r-m*n*p+t*b*p+d*n*f-t*u*f)*R,e[10]=(a*b*r-m*o*r+m*n*c-t*b*c-a*n*f+t*o*f)*R,e[11]=(d*o*r-a*u*r-d*n*c+t*u*c+a*n*p-t*o*p)*R,e[12]=L*R,e[13]=(d*b*s-m*u*s+m*n*h-t*b*h-d*n*g+t*u*g)*R,e[14]=(m*o*s-a*b*s-m*n*l+t*b*l+a*n*g-t*o*g)*R,e[15]=(a*u*s-d*o*s+d*n*l-t*u*l-a*n*h+t*o*h)*R,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,d=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+n,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,d=a+a,u=o+o,h=r*c,p=r*d,m=r*u,b=a*d,g=a*u,f=o*u,A=l*c,S=l*d,y=l*u,L=n.x,T=n.y,R=n.z;return s[0]=(1-(b+f))*L,s[1]=(p+y)*L,s[2]=(m-S)*L,s[3]=0,s[4]=(p-y)*T,s[5]=(1-(h+f))*T,s[6]=(g+A)*T,s[7]=0,s[8]=(m+S)*R,s[9]=(g-A)*R,s[10]=(1-(h+b))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=js.set(s[0],s[1],s[2]).length(),a=js.set(s[4],s[5],s[6]).length(),o=js.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Hn.copy(this);let c=1/r,d=1/a,u=1/o;return Hn.elements[0]*=c,Hn.elements[1]*=c,Hn.elements[2]*=c,Hn.elements[4]*=d,Hn.elements[5]*=d,Hn.elements[6]*=d,Hn.elements[8]*=u,Hn.elements[9]*=u,Hn.elements[10]*=u,t.setFromRotationMatrix(Hn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Si){let l=this.elements,c=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),h=(n+s)/(n-s),p,m;if(o===Si)p=-(a+r)/(a-r),m=-2*a*r/(a-r);else if(o===Co)p=-a/(a-r),m=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Si){let l=this.elements,c=1/(t-e),d=1/(n-s),u=1/(a-r),h=(t+e)*c,p=(n+s)*d,m,b;if(o===Si)m=(a+r)*u,b=-2*u;else if(o===Co)m=r*u,b=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=b,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},js=new E,Hn=new ut,g0=new E(0,0,0),b0=new E(1,1,1),Vi=new E,Xa=new E,Mn=new E,Ju=new ut,Ku=new pn,ri=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],u=s[2],h=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Wt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ju.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ju,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ku.setFromEuler(this),this.setFromQuaternion(Ku,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ri.DEFAULT_ORDER="XYZ";ca=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},v0=0,Qu=new E,qs=new pn,vi=new ut,Ya=new E,$r=new E,x0=new E,y0=new pn,eh=new E(1,0,0),th=new E(0,1,0),nh=new E(0,0,1),ih={type:"added"},_0={type:"removed"},Xs={type:"childadded",child:null},Dl={type:"childremoved",child:null},sn=class i extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:v0++}),this.uuid=si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new E,t=new ri,n=new pn,s=new E(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ut},normalMatrix:{value:new Je}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ca,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return qs.setFromAxisAngle(e,t),this.quaternion.multiply(qs),this}rotateOnWorldAxis(e,t){return qs.setFromAxisAngle(e,t),this.quaternion.premultiply(qs),this}rotateX(e){return this.rotateOnAxis(eh,e)}rotateY(e){return this.rotateOnAxis(th,e)}rotateZ(e){return this.rotateOnAxis(nh,e)}translateOnAxis(e,t){return Qu.copy(e).applyQuaternion(this.quaternion),this.position.add(Qu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(eh,e)}translateY(e){return this.translateOnAxis(th,e)}translateZ(e){return this.translateOnAxis(nh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ya.copy(e):Ya.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),$r.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vi.lookAt($r,Ya,this.up):vi.lookAt(Ya,$r,this.up),this.quaternion.setFromRotationMatrix(vi),s&&(vi.extractRotation(s.matrixWorld),qs.setFromRotationMatrix(vi),this.quaternion.premultiply(qs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ih),Xs.child=e,this.dispatchEvent(Xs),Xs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_0),Dl.child=e,this.dispatchEvent(Dl),Dl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vi.multiply(e.parent.matrixWorld)),e.applyMatrix4(vi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ih),Xs.child=e,this.dispatchEvent(Xs),Xs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($r,e,x0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($r,y0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),u=a(e.shapes),h=a(e.skeletons),p=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),h.length>0&&(n.skeletons=h),p.length>0&&(n.animations=p),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let l=[];for(let c in o){let d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};sn.DEFAULT_UP=new E(0,1,0);sn.DEFAULT_MATRIX_AUTO_UPDATE=!0;sn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;kn=new E,xi=new E,Ol=new E,yi=new E,Ys=new E,Zs=new E,sh=new E,Nl=new E,Ul=new E,Vl=new E,Bl=new zt,Fl=new zt,zl=new zt,Hi=class i{constructor(e=new E,t=new E,n=new E){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),kn.subVectors(e,t),s.cross(kn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){kn.subVectors(s,t),xi.subVectors(n,t),Ol.subVectors(e,t);let a=kn.dot(kn),o=kn.dot(xi),l=kn.dot(Ol),c=xi.dot(xi),d=xi.dot(Ol),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let h=1/u,p=(c*l-o*d)*h,m=(a*d-o*l)*h;return r.set(1-p-m,m,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,yi)===null?!1:yi.x>=0&&yi.y>=0&&yi.x+yi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,yi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,yi.x),l.addScaledVector(a,yi.y),l.addScaledVector(o,yi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Bl.setScalar(0),Fl.setScalar(0),zl.setScalar(0),Bl.fromBufferAttribute(e,t),Fl.fromBufferAttribute(e,n),zl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Bl,r.x),a.addScaledVector(Fl,r.y),a.addScaledVector(zl,r.z),a}static isFrontFacing(e,t,n,s){return kn.subVectors(n,t),xi.subVectors(e,t),kn.cross(xi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),xi.subVectors(this.a,this.b),kn.cross(xi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Ys.subVectors(s,n),Zs.subVectors(r,n),Nl.subVectors(e,n);let l=Ys.dot(Nl),c=Zs.dot(Nl);if(l<=0&&c<=0)return t.copy(n);Ul.subVectors(e,s);let d=Ys.dot(Ul),u=Zs.dot(Ul);if(d>=0&&u<=d)return t.copy(s);let h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(n).addScaledVector(Ys,a);Vl.subVectors(e,r);let p=Ys.dot(Vl),m=Zs.dot(Vl);if(m>=0&&p<=m)return t.copy(r);let b=p*c-l*m;if(b<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Zs,o);let g=d*m-p*u;if(g<=0&&u-d>=0&&p-m>=0)return sh.subVectors(r,s),o=(u-d)/(u-d+(p-m)),t.copy(s).addScaledVector(sh,o);let f=1/(g+b+h);return a=b*f,o=h*f,t.copy(n).addScaledVector(Ys,a).addScaledVector(Zs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},pp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bi={h:0,s:0,l:0},Za={h:0,s:0,l:0};Be=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=ot.workingColorSpace){return this.r=e,this.g=t,this.b=n,ot.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=ot.workingColorSpace){if(e=Od(e,1),t=Wt(t,0,1),n=Wt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Hl(a,r,e+1/3),this.g=Hl(a,r,e),this.b=Hl(a,r,e-1/3)}return ot.toWorkingColorSpace(this,s),this}setStyle(e,t=kt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){let n=pp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Mi(e.r),this.g=Mi(e.g),this.b=Mi(e.b),this}copyLinearToSRGB(e){return this.r=dr(e.r),this.g=dr(e.g),this.b=dr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return ot.fromWorkingColorSpace(ln.copy(this),e),Math.round(Wt(ln.r*255,0,255))*65536+Math.round(Wt(ln.g*255,0,255))*256+Math.round(Wt(ln.b*255,0,255))}getHexString(e=kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.fromWorkingColorSpace(ln.copy(this),t);let n=ln.r,s=ln.g,r=ln.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,d=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=d<=.5?u/(a+o):u/(2-a-o),a){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=ot.workingColorSpace){return ot.fromWorkingColorSpace(ln.copy(this),t),e.r=ln.r,e.g=ln.g,e.b=ln.b,e}getStyle(e=kt){ot.fromWorkingColorSpace(ln.copy(this),e);let t=ln.r,n=ln.g,s=ln.b;return e!==kt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Bi),this.setHSL(Bi.h+e,Bi.s+t,Bi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Bi),e.getHSL(Za);let n=ta(Bi.h,Za.h,t),s=ta(Bi.s,Za.s,t),r=ta(Bi.l,Za.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ln=new Be;Be.NAMES=pp;S0=0,ai=class extends wi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:S0++}),this.uuid=si(),this.name="",this.blending=lr,this.side=$i,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ic,this.blendDst=sc,this.blendEquation=us,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Be(0,0,0),this.blendAlpha=0,this.depthFunc=hr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Hs,this.stencilZFail=Hs,this.stencilZPass=Hs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==lr&&(n.blending=this.blending),this.side!==$i&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ic&&(n.blendSrc=this.blendSrc),this.blendDst!==sc&&(n.blendDst=this.blendDst),this.blendEquation!==us&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==hr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Hu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Hs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Hs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Hs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},tn=class extends ai{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=Kh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Gt=new E,Ja=new K,nn=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=kc,this.updateRanges=[],this.gpuType=ii,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ja.fromBufferAttribute(this,t),Ja.applyMatrix3(e),this.setXY(t,Ja.x,Ja.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix3(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=$n(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$n(t,this.array)),t}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$n(t,this.array)),t}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$n(t,this.array)),t}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$n(t,this.array)),t}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array),r=xt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==kc&&(e.usage=this.usage),e}},Lo=class extends nn{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Do=class extends nn{constructor(e,t,n){super(new Uint32Array(e),t,n)}},rt=class extends nn{constructor(e,t,n){super(new Float32Array(e),t,n)}},M0=0,Dn=new ut,kl=new sn,Js=new E,En=new jt,Wr=new jt,en=new E,qt=class i extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:M0++}),this.uuid=si(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(hp(e)?Do:Lo)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Dn.makeRotationFromQuaternion(e),this.applyMatrix4(Dn),this}rotateX(e){return Dn.makeRotationX(e),this.applyMatrix4(Dn),this}rotateY(e){return Dn.makeRotationY(e),this.applyMatrix4(Dn),this}rotateZ(e){return Dn.makeRotationZ(e),this.applyMatrix4(Dn),this}translate(e,t,n){return Dn.makeTranslation(e,t,n),this.applyMatrix4(Dn),this}scale(e,t,n){return Dn.makeScale(e,t,n),this.applyMatrix4(Dn),this}lookAt(e){return kl.lookAt(e),kl.updateMatrix(),this.applyMatrix4(kl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Js).negate(),this.translate(Js.x,Js.y,Js.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new rt(n,3))}else{for(let n=0,s=t.count;n<s;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];En.setFromBufferAttribute(r),this.morphTargetsRelative?(en.addVectors(this.boundingBox.min,En.min),this.boundingBox.expandByPoint(en),en.addVectors(this.boundingBox.max,En.max),this.boundingBox.expandByPoint(en)):(this.boundingBox.expandByPoint(En.min),this.boundingBox.expandByPoint(En.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new E,1/0);return}if(e){let n=this.boundingSphere.center;if(En.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Wr.setFromBufferAttribute(o),this.morphTargetsRelative?(en.addVectors(En.min,Wr.min),En.expandByPoint(en),en.addVectors(En.max,Wr.max),En.expandByPoint(en)):(En.expandByPoint(Wr.min),En.expandByPoint(Wr.max))}En.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)en.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(en));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)en.fromBufferAttribute(o,c),l&&(Js.fromBufferAttribute(e,c),en.add(Js)),s=Math.max(s,n.distanceToSquared(en))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let w=0;w<n.count;w++)o[w]=new E,l[w]=new E;let c=new E,d=new E,u=new E,h=new K,p=new K,m=new K,b=new E,g=new E;function f(w,v,x){c.fromBufferAttribute(n,w),d.fromBufferAttribute(n,v),u.fromBufferAttribute(n,x),h.fromBufferAttribute(r,w),p.fromBufferAttribute(r,v),m.fromBufferAttribute(r,x),d.sub(c),u.sub(c),p.sub(h),m.sub(h);let P=1/(p.x*m.y-m.x*p.y);isFinite(P)&&(b.copy(d).multiplyScalar(m.y).addScaledVector(u,-p.y).multiplyScalar(P),g.copy(u).multiplyScalar(p.x).addScaledVector(d,-m.x).multiplyScalar(P),o[w].add(b),o[v].add(b),o[x].add(b),l[w].add(g),l[v].add(g),l[x].add(g))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let w=0,v=A.length;w<v;++w){let x=A[w],P=x.start,F=x.count;for(let U=P,B=P+F;U<B;U+=3)f(e.getX(U+0),e.getX(U+1),e.getX(U+2))}let S=new E,y=new E,L=new E,T=new E;function R(w){L.fromBufferAttribute(s,w),T.copy(L);let v=o[w];S.copy(v),S.sub(L.multiplyScalar(L.dot(v))).normalize(),y.crossVectors(T,v);let P=y.dot(l[w])<0?-1:1;a.setXYZW(w,S.x,S.y,S.z,P)}for(let w=0,v=A.length;w<v;++w){let x=A[w],P=x.start,F=x.count;for(let U=P,B=P+F;U<B;U+=3)R(e.getX(U+0)),R(e.getX(U+1)),R(e.getX(U+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new nn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,p=n.count;h<p;h++)n.setXYZ(h,0,0,0);let s=new E,r=new E,a=new E,o=new E,l=new E,c=new E,d=new E,u=new E;if(e)for(let h=0,p=e.count;h<p;h+=3){let m=e.getX(h+0),b=e.getX(h+1),g=e.getX(h+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,b),a.fromBufferAttribute(t,g),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,b),c.fromBufferAttribute(n,g),o.add(d),l.add(d),c.add(d),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(b,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)en.fromBufferAttribute(e,t),en.normalize(),e.setXYZ(t,en.x,en.y,en.z)}toNonIndexed(){function e(o,l){let c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d),p=0,m=0;for(let b=0,g=l.length;b<g;b++){o.isInterleavedBufferAttribute?p=l[b]*o.data.stride+o.offset:p=l[b]*d;for(let f=0;f<d;f++)h[m++]=c[p++]}return new nn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let d=0,u=c.length;d<u;d++){let h=c[d],p=e(h,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){let p=c[u];d.push(p.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let d=s[c];this.setAttribute(c,d.clone(t))}let r=e.morphAttributes;for(let c in r){let d=[],u=r[c];for(let h=0,p=u.length;h<p;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,d=a.length;c<d;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},rh=new ut,as=new gs,Ka=new Wi,ah=new E,Qa=new E,eo=new E,to=new E,Gl=new E,no=new E,oh=new E,io=new E,Oe=class extends sn{constructor(e=new qt,t=new tn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){no.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let d=o[l],u=r[l];d!==0&&(Gl.fromBufferAttribute(u,e),a?no.addScaledVector(Gl,d):no.addScaledVector(Gl.sub(t),d))}t.add(no)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ka.copy(n.boundingSphere),Ka.applyMatrix4(r),as.copy(e.ray).recast(e.near),!(Ka.containsPoint(as.origin)===!1&&(as.intersectSphere(Ka,ah)===null||as.origin.distanceToSquared(ah)>(e.far-e.near)**2))&&(rh.copy(r).invert(),as.copy(e.ray).applyMatrix4(rh),!(n.boundingBox!==null&&as.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,as)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,h=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,b=h.length;m<b;m++){let g=h[m],f=a[g.materialIndex],A=Math.max(g.start,p.start),S=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let y=A,L=S;y<L;y+=3){let T=o.getX(y),R=o.getX(y+1),w=o.getX(y+2);s=so(this,f,e,n,c,d,u,T,R,w),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,p.start),b=Math.min(o.count,p.start+p.count);for(let g=m,f=b;g<f;g+=3){let A=o.getX(g),S=o.getX(g+1),y=o.getX(g+2);s=so(this,a,e,n,c,d,u,A,S,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,b=h.length;m<b;m++){let g=h[m],f=a[g.materialIndex],A=Math.max(g.start,p.start),S=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let y=A,L=S;y<L;y+=3){let T=y,R=y+1,w=y+2;s=so(this,f,e,n,c,d,u,T,R,w),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,p.start),b=Math.min(l.count,p.start+p.count);for(let g=m,f=b;g<f;g+=3){let A=g,S=g+1,y=g+2;s=so(this,a,e,n,c,d,u,A,S,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};Xt=class i extends qt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],d=[],u=[],h=0,p=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new rt(c,3)),this.setAttribute("normal",new rt(d,3)),this.setAttribute("uv",new rt(u,2));function m(b,g,f,A,S,y,L,T,R,w,v){let x=y/R,P=L/w,F=y/2,U=L/2,B=T/2,j=R+1,k=w+1,ee=0,G=0,de=new E;for(let ve=0;ve<k;ve++){let we=ve*P-U;for(let Xe=0;Xe<j;Xe++){let pt=Xe*x-F;de[b]=pt*A,de[g]=we*S,de[f]=B,c.push(de.x,de.y,de.z),de[b]=0,de[g]=0,de[f]=T>0?1:-1,d.push(de.x,de.y,de.z),u.push(Xe/R),u.push(1-ve/w),ee+=1}}for(let ve=0;ve<w;ve++)for(let we=0;we<R;we++){let Xe=h+we+j*ve,pt=h+we+j*(ve+1),X=h+(we+1)+j*(ve+1),ie=h+(we+1)+j*ve;l.push(Xe,pt,ie),l.push(pt,X,ie),G+=6}o.addGroup(p,G,v),p+=G,h+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};A0={clone:br,merge:hn},T0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,C0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,oi=class extends ai{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=T0,this.fragmentShader=C0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=br(e.uniforms),this.uniformsGroups=w0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Oo=class extends sn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=Si}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Fi=new E,lh=new K,ch=new K,cn=class extends Oo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=la*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ea*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return la*2*Math.atan(Math.tan(ea*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,t){return this.getViewBounds(e,lh,ch),t.subVectors(ch,lh)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ea*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ks=-90,Qs=1,jc=class extends sn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new cn(Ks,Qs,e,t);s.layers=this.layers,this.add(s);let r=new cn(Ks,Qs,e,t);r.layers=this.layers,this.add(r);let a=new cn(Ks,Qs,e,t);a.layers=this.layers,this.add(a);let o=new cn(Ks,Qs,e,t);o.layers=this.layers,this.add(o);let l=new cn(Ks,Qs,e,t);l.layers=this.layers,this.add(l);let c=new cn(Ks,Qs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Si)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Co)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let b=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=b,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(u,h,p),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},No=class extends vn{constructor(e,t,n,s,r,a,o,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:pr,super(e,t,n,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},qc=class extends Ai{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new No(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ni}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Xt(5,5,5),r=new oi({name:"CubemapFromEquirect",uniforms:br(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:bn,blending:ki});r.uniforms.tEquirect.value=t;let a=new Oe(s,r),o=t.minFilter;return t.minFilter===fs&&(t.minFilter=ni),new jc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},$l=new E,R0=new E,P0=new Je,wn=class{constructor(e=new E(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=$l.subVectors(n,t).cross(R0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta($l),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||P0.getNormalMatrix(e),s=this.coplanarPoint($l).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},os=new Wi,ro=new E,da=class{constructor(e=new wn,t=new wn,n=new wn,s=new wn,r=new wn,a=new wn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Si){let n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],d=s[5],u=s[6],h=s[7],p=s[8],m=s[9],b=s[10],g=s[11],f=s[12],A=s[13],S=s[14],y=s[15];if(n[0].setComponents(l-r,h-c,g-p,y-f).normalize(),n[1].setComponents(l+r,h+c,g+p,y+f).normalize(),n[2].setComponents(l+a,h+d,g+m,y+A).normalize(),n[3].setComponents(l-a,h-d,g-m,y-A).normalize(),n[4].setComponents(l-o,h-u,g-b,y-S).normalize(),t===Si)n[5].setComponents(l+o,h+u,g+b,y+S).normalize();else if(t===Co)n[5].setComponents(o,u,b,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),os.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),os.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(os)}intersectsSprite(e){return os.center.set(0,0,0),os.radius=.7071067811865476,os.applyMatrix4(e.matrixWorld),this.intersectsSphere(os)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(ro.x=s.normal.x>0?e.max.x:e.min.x,ro.y=s.normal.y>0?e.max.y:e.min.y,ro.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ro)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};Ht=class i extends qt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,d=l+1,u=e/o,h=t/l,p=[],m=[],b=[],g=[];for(let f=0;f<d;f++){let A=f*h-a;for(let S=0;S<c;S++){let y=S*u-r;m.push(y,-A,0),b.push(0,0,1),g.push(S/o),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let A=0;A<o;A++){let S=A+c*f,y=A+c*(f+1),L=A+1+c*(f+1),T=A+1+c*f;p.push(S,y,T),p.push(y,L,T)}this.setIndex(p),this.setAttribute("position",new rt(m,3)),this.setAttribute("normal",new rt(b,3)),this.setAttribute("uv",new rt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},L0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,D0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,O0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,N0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,U0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,V0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,B0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,F0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,z0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,H0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,k0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,G0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,W0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,j0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,q0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,X0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Y0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Z0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,J0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,K0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Q0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,eg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,tg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ng=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ig=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,sg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,rg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ag=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,og=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lg="gl_FragColor = linearToOutputTexel( gl_FragColor );",cg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,dg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ug=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,hg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,pg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,mg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,yg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_g=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Sg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Eg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,wg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ag=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Cg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Rg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Pg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ig=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Lg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Dg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Og=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ng=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ug=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Bg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Hg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$g=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Xg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Zg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Jg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,eb=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,tb=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,nb=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ib=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,sb=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,rb=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ab=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ob=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lb=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cb=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,db=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ub=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hb=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,pb=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,fb=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,mb=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,gb=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,bb=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,vb=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,xb=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yb=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_b=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sb=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Mb=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Eb=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,wb=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ab=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Tb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Rb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Pb=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Ib=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Lb=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Db=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ob=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ub=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Bb=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Fb=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,zb=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Hb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kb=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gb=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,$b=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,jb=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qb=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xb=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yb=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Zb=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Kb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Qb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ev=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,nv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,av=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ov=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,cv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,dv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,et={alphahash_fragment:L0,alphahash_pars_fragment:D0,alphamap_fragment:O0,alphamap_pars_fragment:N0,alphatest_fragment:U0,alphatest_pars_fragment:V0,aomap_fragment:B0,aomap_pars_fragment:F0,batching_pars_vertex:z0,batching_vertex:H0,begin_vertex:k0,beginnormal_vertex:G0,bsdfs:$0,iridescence_fragment:W0,bumpmap_pars_fragment:j0,clipping_planes_fragment:q0,clipping_planes_pars_fragment:X0,clipping_planes_pars_vertex:Y0,clipping_planes_vertex:Z0,color_fragment:J0,color_pars_fragment:K0,color_pars_vertex:Q0,color_vertex:eg,common:tg,cube_uv_reflection_fragment:ng,defaultnormal_vertex:ig,displacementmap_pars_vertex:sg,displacementmap_vertex:rg,emissivemap_fragment:ag,emissivemap_pars_fragment:og,colorspace_fragment:lg,colorspace_pars_fragment:cg,envmap_fragment:dg,envmap_common_pars_fragment:ug,envmap_pars_fragment:hg,envmap_pars_vertex:pg,envmap_physical_pars_fragment:Eg,envmap_vertex:fg,fog_vertex:mg,fog_pars_vertex:gg,fog_fragment:bg,fog_pars_fragment:vg,gradientmap_pars_fragment:xg,lightmap_pars_fragment:yg,lights_lambert_fragment:_g,lights_lambert_pars_fragment:Sg,lights_pars_begin:Mg,lights_toon_fragment:wg,lights_toon_pars_fragment:Ag,lights_phong_fragment:Tg,lights_phong_pars_fragment:Cg,lights_physical_fragment:Rg,lights_physical_pars_fragment:Pg,lights_fragment_begin:Ig,lights_fragment_maps:Lg,lights_fragment_end:Dg,logdepthbuf_fragment:Og,logdepthbuf_pars_fragment:Ng,logdepthbuf_pars_vertex:Ug,logdepthbuf_vertex:Vg,map_fragment:Bg,map_pars_fragment:Fg,map_particle_fragment:zg,map_particle_pars_fragment:Hg,metalnessmap_fragment:kg,metalnessmap_pars_fragment:Gg,morphinstance_vertex:$g,morphcolor_vertex:Wg,morphnormal_vertex:jg,morphtarget_pars_vertex:qg,morphtarget_vertex:Xg,normal_fragment_begin:Yg,normal_fragment_maps:Zg,normal_pars_fragment:Jg,normal_pars_vertex:Kg,normal_vertex:Qg,normalmap_pars_fragment:eb,clearcoat_normal_fragment_begin:tb,clearcoat_normal_fragment_maps:nb,clearcoat_pars_fragment:ib,iridescence_pars_fragment:sb,opaque_fragment:rb,packing:ab,premultiplied_alpha_fragment:ob,project_vertex:lb,dithering_fragment:cb,dithering_pars_fragment:db,roughnessmap_fragment:ub,roughnessmap_pars_fragment:hb,shadowmap_pars_fragment:pb,shadowmap_pars_vertex:fb,shadowmap_vertex:mb,shadowmask_pars_fragment:gb,skinbase_vertex:bb,skinning_pars_vertex:vb,skinning_vertex:xb,skinnormal_vertex:yb,specularmap_fragment:_b,specularmap_pars_fragment:Sb,tonemapping_fragment:Mb,tonemapping_pars_fragment:Eb,transmission_fragment:wb,transmission_pars_fragment:Ab,uv_pars_fragment:Tb,uv_pars_vertex:Cb,uv_vertex:Rb,worldpos_vertex:Pb,background_vert:Ib,background_frag:Lb,backgroundCube_vert:Db,backgroundCube_frag:Ob,cube_vert:Nb,cube_frag:Ub,depth_vert:Vb,depth_frag:Bb,distanceRGBA_vert:Fb,distanceRGBA_frag:zb,equirect_vert:Hb,equirect_frag:kb,linedashed_vert:Gb,linedashed_frag:$b,meshbasic_vert:Wb,meshbasic_frag:jb,meshlambert_vert:qb,meshlambert_frag:Xb,meshmatcap_vert:Yb,meshmatcap_frag:Zb,meshnormal_vert:Jb,meshnormal_frag:Kb,meshphong_vert:Qb,meshphong_frag:ev,meshphysical_vert:tv,meshphysical_frag:nv,meshtoon_vert:iv,meshtoon_frag:sv,points_vert:rv,points_frag:av,shadow_vert:ov,shadow_frag:lv,sprite_vert:cv,sprite_frag:dv},ue={common:{diffuse:{value:new Be(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Je}},envmap:{envMap:{value:null},envMapRotation:{value:new Je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Je},normalScale:{value:new K(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0},uvTransform:{value:new Je}},sprite:{diffuse:{value:new Be(16777215)},opacity:{value:1},center:{value:new K(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Je},alphaMap:{value:null},alphaMapTransform:{value:new Je},alphaTest:{value:0}}},ti={basic:{uniforms:hn([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:et.meshbasic_vert,fragmentShader:et.meshbasic_frag},lambert:{uniforms:hn([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Be(0)}}]),vertexShader:et.meshlambert_vert,fragmentShader:et.meshlambert_frag},phong:{uniforms:hn([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Be(0)},specular:{value:new Be(1118481)},shininess:{value:30}}]),vertexShader:et.meshphong_vert,fragmentShader:et.meshphong_frag},standard:{uniforms:hn([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag},toon:{uniforms:hn([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Be(0)}}]),vertexShader:et.meshtoon_vert,fragmentShader:et.meshtoon_frag},matcap:{uniforms:hn([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:et.meshmatcap_vert,fragmentShader:et.meshmatcap_frag},points:{uniforms:hn([ue.points,ue.fog]),vertexShader:et.points_vert,fragmentShader:et.points_frag},dashed:{uniforms:hn([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:et.linedashed_vert,fragmentShader:et.linedashed_frag},depth:{uniforms:hn([ue.common,ue.displacementmap]),vertexShader:et.depth_vert,fragmentShader:et.depth_frag},normal:{uniforms:hn([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:et.meshnormal_vert,fragmentShader:et.meshnormal_frag},sprite:{uniforms:hn([ue.sprite,ue.fog]),vertexShader:et.sprite_vert,fragmentShader:et.sprite_frag},background:{uniforms:{uvTransform:{value:new Je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:et.background_vert,fragmentShader:et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Je}},vertexShader:et.backgroundCube_vert,fragmentShader:et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:et.cube_vert,fragmentShader:et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:et.equirect_vert,fragmentShader:et.equirect_frag},distanceRGBA:{uniforms:hn([ue.common,ue.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:et.distanceRGBA_vert,fragmentShader:et.distanceRGBA_frag},shadow:{uniforms:hn([ue.lights,ue.fog,{color:{value:new Be(0)},opacity:{value:1}}]),vertexShader:et.shadow_vert,fragmentShader:et.shadow_frag}};ti.physical={uniforms:hn([ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Je},clearcoatNormalScale:{value:new K(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Je},sheen:{value:0},sheenColor:{value:new Be(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Je},transmissionSamplerSize:{value:new K},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Je},attenuationDistance:{value:0},attenuationColor:{value:new Be(0)},specularColor:{value:new Be(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Je},anisotropyVector:{value:new K},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Je}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag};ao={r:0,b:0,g:0},ls=new ri,uv=new ut;vr=class extends Oo{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ar=4,dh=[.125,.215,.35,.446,.526,.582],hs=20,Wl=new vr,uh=new Be,jl=null,ql=0,Xl=0,Yl=!1,ds=(1+Math.sqrt(5))/2,er=1/ds,hh=[new E(-ds,er,0),new E(ds,er,0),new E(-er,0,ds),new E(er,0,ds),new E(0,ds,-er),new E(0,ds,er),new E(-1,1,-1),new E(1,1,-1),new E(-1,1,1),new E(1,1,1)],Uo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){jl=this._renderer.getRenderTarget(),ql=this._renderer.getActiveCubeFace(),Xl=this._renderer.getActiveMipmapLevel(),Yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(jl,ql,Xl),this._renderer.xr.enabled=Yl,e.scissorTest=!1,oo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===pr||e.mapping===fr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),jl=this._renderer.getRenderTarget(),ql=this._renderer.getActiveCubeFace(),Xl=this._renderer.getActiveMipmapLevel(),Yl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ni,minFilter:ni,generateMipmaps:!1,type:_a,format:Wn,colorSpace:wr,depthBuffer:!1},s=ph(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ph(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=vv(r)),this._blurMaterial=xv(r,e,t)}return s}_compileMaterial(e){let t=new Oe(this._lodPlanes[0],e);this._renderer.compile(t,Wl)}_sceneToCubeUV(e,t,n,s){let o=new cn(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor(uh),d.toneMapping=Gi,d.autoClear=!1;let p=new tn({name:"PMREM.Background",side:bn,depthWrite:!1,depthTest:!1}),m=new Oe(new Xt,p),b=!1,g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,b=!0):(p.color.copy(uh),b=!0);for(let f=0;f<6;f++){let A=f%3;A===0?(o.up.set(0,l[f],0),o.lookAt(c[f],0,0)):A===1?(o.up.set(0,0,l[f]),o.lookAt(0,c[f],0)):(o.up.set(0,l[f],0),o.lookAt(0,0,c[f]));let S=this._cubeSize;oo(s,A*S,f>2?S:0,S,S),d.setRenderTarget(s),b&&d.render(m,o),d.render(e,o)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=h,d.autoClear=u,e.background=g}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===pr||e.mapping===fr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=mh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new Oe(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;oo(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Wl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=hh[(s-r-1)%hh.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let d=3,u=new Oe(this._lodPlanes[s],c),h=c.uniforms,p=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*hs-1),b=r/m,g=isFinite(r)?1+Math.floor(d*b):hs;g>hs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${hs}`);let f=[],A=0;for(let R=0;R<hs;++R){let w=R/b,v=Math.exp(-w*w/2);f.push(v),R===0?A+=v:R<g&&(A+=2*v)}for(let R=0;R<f.length;R++)f[R]=f[R]/A;h.envMap.value=e.texture,h.samples.value=g,h.weights.value=f,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);let{_lodMax:S}=this;h.dTheta.value=m,h.mipInt.value=S-n;let y=this._sizeLods[s],L=3*y*(s>S-ar?s-S+ar:0),T=4*(this._cubeSize-y);oo(t,L,T,3*y,2*y),l.setRenderTarget(t),l.render(u,Wl)}};Vo=class extends vn{constructor(e,t,n,s,r,a,o,l,c,d=cr){if(d!==cr&&d!==gr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===cr&&(n=ms),n===void 0&&d===gr&&(n=mr),super(null,s,r,a,o,l,d,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:An,this.minFilter=l!==void 0?l:An,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},gp=new vn,gh=new Vo(1,1),bp=new Io,vp=new Wc,xp=new No,bh=[],vh=[],xh=new Float32Array(16),yh=new Float32Array(9),_h=new Float32Array(4);Xc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=jv(t.type)}},Yc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=hx(t.type)}},Zc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Zl=/(\w+)(\])?(\[|\.)?/g;ur=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);px(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};fx=37297,mx=0;Eh=new Je;lo=new E;Ex=/^[ \t]*#include +<([\w\d./]+)>/gm;wx=new Map;Tx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;Nx=0,Kc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Qc(e),t.set(e,n)),n}},Qc=class{constructor(e){this.id=Nx++,this.code=e,this.usedTimes=0}};kx=0;ed=class extends ai{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Vm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},td=class extends ai{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},jx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;Yx={[rc]:ac,[oc]:dc,[lc]:uc,[hr]:cc,[ac]:rc,[dc]:oc,[uc]:lc,[cc]:hr};nd=class extends cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Ue=class extends sn{constructor(){super(),this.isGroup=!0,this.type="Group"}},ey={type:"move"},na=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ue,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ue,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ue,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let b of e.hand.values()){let g=t.getJointPose(b,n),f=this._getHandJoint(c,b);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}let d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),p=.02,m=.005;c.inputState.pinching&&h>p+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ey)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ue;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},ty=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ny=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,id=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new vn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new oi({vertexShader:ty,fragmentShader:ny,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Oe(new Ht(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},sd=class extends wi{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,p=null,m=null,b=new id,g=t.getContextAttributes(),f=null,A=null,S=[],y=[],L=new K,T=null,R=new cn;R.viewport=new zt;let w=new cn;w.viewport=new zt;let v=[R,w],x=new nd,P=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let ie=S[X];return ie===void 0&&(ie=new na,S[X]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(X){let ie=S[X];return ie===void 0&&(ie=new na,S[X]=ie),ie.getGripSpace()},this.getHand=function(X){let ie=S[X];return ie===void 0&&(ie=new na,S[X]=ie),ie.getHandSpace()};function U(X){let ie=y.indexOf(X.inputSource);if(ie===-1)return;let Ae=S[ie];Ae!==void 0&&(Ae.update(X.inputSource,X.frame,c||a),Ae.dispatchEvent({type:X.type,data:X.inputSource}))}function B(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",j);for(let X=0;X<S.length;X++){let ie=y[X];ie!==null&&(y[X]=null,S[X].disconnect(ie))}P=null,F=null,b.reset(),e.setRenderTarget(f),p=null,h=null,u=null,s=null,A=null,pt.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(f=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",B),s.addEventListener("inputsourceschange",j),g.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(L),s.renderState.layers===void 0){let ie={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ie),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),A=new Ai(p.framebufferWidth,p.framebufferHeight,{format:Wn,type:Ei,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let ie=null,Ae=null,oe=null;g.depth&&(oe=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=g.stencil?gr:cr,Ae=g.stencil?mr:ms);let Ve={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:r};u=new XRWebGLBinding(s,t),h=u.createProjectionLayer(Ve),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),A=new Ai(h.textureWidth,h.textureHeight,{format:Wn,type:Ei,depthTexture:new Vo(h.textureWidth,h.textureHeight,Ae,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),pt.setContext(s),pt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function j(X){for(let ie=0;ie<X.removed.length;ie++){let Ae=X.removed[ie],oe=y.indexOf(Ae);oe>=0&&(y[oe]=null,S[oe].disconnect(Ae))}for(let ie=0;ie<X.added.length;ie++){let Ae=X.added[ie],oe=y.indexOf(Ae);if(oe===-1){for(let $e=0;$e<S.length;$e++)if($e>=y.length){y.push(Ae),oe=$e;break}else if(y[$e]===null){y[$e]=Ae,oe=$e;break}if(oe===-1)break}let Ve=S[oe];Ve&&Ve.connect(Ae)}}let k=new E,ee=new E;function G(X,ie,Ae){k.setFromMatrixPosition(ie.matrixWorld),ee.setFromMatrixPosition(Ae.matrixWorld);let oe=k.distanceTo(ee),Ve=ie.projectionMatrix.elements,$e=Ae.projectionMatrix.elements,He=Ve[14]/(Ve[10]-1),at=Ve[14]/(Ve[10]+1),Z=(Ve[9]+1)/Ve[5],ne=(Ve[9]-1)/Ve[5],I=(Ve[8]-1)/Ve[0],Le=($e[8]+1)/$e[0],Q=He*I,_e=He*Le,le=oe/(-I+Le),Fe=le*-I;if(ie.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Fe),X.translateZ(le),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ve[10]===-1)X.projectionMatrix.copy(ie.projectionMatrix),X.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{let xe=He+le,C=at+le,_=Q-Fe,V=_e+(oe-Fe),W=Z*at/C*xe,J=ne*at/C*xe;X.projectionMatrix.makePerspective(_,V,W,J,xe,C),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function de(X,ie){ie===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(ie.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let ie=X.near,Ae=X.far;b.texture!==null&&(b.depthNear>0&&(ie=b.depthNear),b.depthFar>0&&(Ae=b.depthFar)),x.near=w.near=R.near=ie,x.far=w.far=R.far=Ae,(P!==x.near||F!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),P=x.near,F=x.far),R.layers.mask=X.layers.mask|2,w.layers.mask=X.layers.mask|4,x.layers.mask=R.layers.mask|w.layers.mask;let oe=X.parent,Ve=x.cameras;de(x,oe);for(let $e=0;$e<Ve.length;$e++)de(Ve[$e],oe);Ve.length===2?G(x,R,w):x.projectionMatrix.copy(R.projectionMatrix),ve(X,x,oe)};function ve(X,ie,Ae){Ae===null?X.matrix.copy(ie.matrixWorld):(X.matrix.copy(Ae.matrixWorld),X.matrix.invert(),X.matrix.multiply(ie.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(ie.projectionMatrix),X.projectionMatrixInverse.copy(ie.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=la*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(X){l=X,h!==null&&(h.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(x)};let we=null;function Xe(X,ie){if(d=ie.getViewerPose(c||a),m=ie,d!==null){let Ae=d.views;p!==null&&(e.setRenderTargetFramebuffer(A,p.framebuffer),e.setRenderTarget(A));let oe=!1;Ae.length!==x.cameras.length&&(x.cameras.length=0,oe=!0);for(let $e=0;$e<Ae.length;$e++){let He=Ae[$e],at=null;if(p!==null)at=p.getViewport(He);else{let ne=u.getViewSubImage(h,He);at=ne.viewport,$e===0&&(e.setRenderTargetTextures(A,ne.colorTexture,h.ignoreDepthValues?void 0:ne.depthStencilTexture),e.setRenderTarget(A))}let Z=v[$e];Z===void 0&&(Z=new cn,Z.layers.enable($e),Z.viewport=new zt,v[$e]=Z),Z.matrix.fromArray(He.transform.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.projectionMatrix.fromArray(He.projectionMatrix),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert(),Z.viewport.set(at.x,at.y,at.width,at.height),$e===0&&(x.matrix.copy(Z.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),oe===!0&&x.cameras.push(Z)}let Ve=s.enabledFeatures;if(Ve&&Ve.includes("depth-sensing")){let $e=u.getDepthInformation(Ae[0]);$e&&$e.isValid&&$e.texture&&b.init(e,$e,s.renderState)}}for(let Ae=0;Ae<S.length;Ae++){let oe=y[Ae],Ve=S[Ae];oe!==null&&Ve!==void 0&&Ve.update(oe,ie,c||a)}we&&we(X,ie),ie.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ie}),m=null}let pt=new mp;pt.setAnimationLoop(Xe),this.setAnimationLoop=function(X){we=X},this.dispose=function(){}}},cs=new ri,iy=new ut;bs=class{constructor(e={}){let{canvas:t=c0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let m=new Uint32Array(4),b=new Int32Array(4),g=null,f=null,A=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=kt,this.toneMapping=Gi,this.toneMappingExposure=1;let y=this,L=!1,T=0,R=0,w=null,v=-1,x=null,P=new zt,F=new zt,U=null,B=new Be(0),j=0,k=t.width,ee=t.height,G=1,de=null,ve=null,we=new zt(0,0,k,ee),Xe=new zt(0,0,k,ee),pt=!1,X=new da,ie=!1,Ae=!1,oe=new ut,Ve=new ut,$e=new E,He=new zt,at={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Z=!1;function ne(){return w===null?G:1}let I=n;function Le(M,O){return t.getContext(M,O)}try{let M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",Y,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",me,!1),I===null){let O="webgl2";if(I=Le(O,M),I===null)throw Le(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Q,_e,le,Fe,xe,C,_,V,W,J,q,Te,he,ye,tt,te,Se,ze,Ge,Me,st,Qe,At,D;function pe(){Q=new _v(I),Q.init(),Qe=new Qx(I,Q),_e=new mv(I,Q,e,Qe),le=new Zx(I,Q),_e.reverseDepthBuffer&&h&&le.buffers.depth.setReversed(!0),Fe=new Ev(I),xe=new Vx,C=new Kx(I,Q,le,xe,_e,Qe,Fe),_=new bv(y),V=new yv(y),W=new I0(I),At=new pv(I,W),J=new Sv(I,W,Fe,At),q=new Av(I,J,W,Fe),Ge=new wv(I,_e,C),te=new gv(xe),Te=new Ux(y,_,V,Q,_e,At,te),he=new sy(y,xe),ye=new Fx,tt=new Wx(Q),ze=new hv(y,_,V,le,q,p,l),Se=new Xx(y,q,_e),D=new ry(I,Fe,_e,le),Me=new fv(I,Q,Fe),st=new Mv(I,Q,Fe),Fe.programs=Te.programs,y.capabilities=_e,y.extensions=Q,y.properties=xe,y.renderLists=ye,y.shadowMap=Se,y.state=le,y.info=Fe}pe();let $=new sd(y,I);this.xr=$,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let M=Q.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=Q.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(M){M!==void 0&&(G=M,this.setSize(k,ee,!1))},this.getSize=function(M){return M.set(k,ee)},this.setSize=function(M,O,z=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=M,ee=O,t.width=Math.floor(M*G),t.height=Math.floor(O*G),z===!0&&(t.style.width=M+"px",t.style.height=O+"px"),this.setViewport(0,0,M,O)},this.getDrawingBufferSize=function(M){return M.set(k*G,ee*G).floor()},this.setDrawingBufferSize=function(M,O,z){k=M,ee=O,G=z,t.width=Math.floor(M*z),t.height=Math.floor(O*z),this.setViewport(0,0,M,O)},this.getCurrentViewport=function(M){return M.copy(P)},this.getViewport=function(M){return M.copy(we)},this.setViewport=function(M,O,z,H){M.isVector4?we.set(M.x,M.y,M.z,M.w):we.set(M,O,z,H),le.viewport(P.copy(we).multiplyScalar(G).round())},this.getScissor=function(M){return M.copy(Xe)},this.setScissor=function(M,O,z,H){M.isVector4?Xe.set(M.x,M.y,M.z,M.w):Xe.set(M,O,z,H),le.scissor(F.copy(Xe).multiplyScalar(G).round())},this.getScissorTest=function(){return pt},this.setScissorTest=function(M){le.setScissorTest(pt=M)},this.setOpaqueSort=function(M){de=M},this.setTransparentSort=function(M){ve=M},this.getClearColor=function(M){return M.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor.apply(ze,arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha.apply(ze,arguments)},this.clear=function(M=!0,O=!0,z=!0){let H=0;if(M){let N=!1;if(w!==null){let se=w.texture.format;N=se===Dd||se===Ld||se===Id}if(N){let se=w.texture.type,ge=se===Ei||se===ms||se===oa||se===mr||se===Cd||se===Rd,Ce=ze.getClearColor(),Re=ze.getClearAlpha(),We=Ce.r,Ze=Ce.g,Pe=Ce.b;ge?(m[0]=We,m[1]=Ze,m[2]=Pe,m[3]=Re,I.clearBufferuiv(I.COLOR,0,m)):(b[0]=We,b[1]=Ze,b[2]=Pe,b[3]=Re,I.clearBufferiv(I.COLOR,0,b))}else H|=I.COLOR_BUFFER_BIT}O&&(H|=I.DEPTH_BUFFER_BIT),z&&(H|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Y,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",me,!1),ye.dispose(),tt.dispose(),xe.dispose(),_.dispose(),V.dispose(),q.dispose(),At.dispose(),D.dispose(),Te.dispose(),$.dispose(),$.removeEventListener("sessionstart",Au),$.removeEventListener("sessionend",Tu),is.stop()};function Y(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;let M=Fe.autoReset,O=Se.enabled,z=Se.autoUpdate,H=Se.needsUpdate,N=Se.type;pe(),Fe.autoReset=M,Se.enabled=O,Se.autoUpdate=z,Se.needsUpdate=H,Se.type=N}function me(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Ye(M){let O=M.target;O.removeEventListener("dispose",Ye),Ft(O)}function Ft(M){an(M),xe.remove(M)}function an(M){let O=xe.get(M).programs;O!==void 0&&(O.forEach(function(z){Te.releaseProgram(z)}),M.isShaderMaterial&&Te.releaseShaderCache(M))}this.renderBufferDirect=function(M,O,z,H,N,se){O===null&&(O=at);let ge=N.isMesh&&N.matrixWorld.determinant()<0,Ce=sm(M,O,z,H,N);le.setMaterial(H,ge);let Re=z.index,We=1;if(H.wireframe===!0){if(Re=J.getWireframeAttribute(z),Re===void 0)return;We=2}let Ze=z.drawRange,Pe=z.attributes.position,dt=Ze.start*We,Tt=(Ze.start+Ze.count)*We;se!==null&&(dt=Math.max(dt,se.start*We),Tt=Math.min(Tt,(se.start+se.count)*We)),Re!==null?(dt=Math.max(dt,0),Tt=Math.min(Tt,Re.count)):Pe!=null&&(dt=Math.max(dt,0),Tt=Math.min(Tt,Pe.count));let Pt=Tt-dt;if(Pt<0||Pt===1/0)return;At.setup(N,H,Ce,z,Re);let gn,ft=Me;if(Re!==null&&(gn=W.get(Re),ft=st,ft.setIndex(gn)),N.isMesh)H.wireframe===!0?(le.setLineWidth(H.wireframeLinewidth*ne()),ft.setMode(I.LINES)):ft.setMode(I.TRIANGLES);else if(N.isLine){let De=H.linewidth;De===void 0&&(De=1),le.setLineWidth(De*ne()),N.isLineSegments?ft.setMode(I.LINES):N.isLineLoop?ft.setMode(I.LINE_LOOP):ft.setMode(I.LINE_STRIP)}else N.isPoints?ft.setMode(I.POINTS):N.isSprite&&ft.setMode(I.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)ft.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Q.get("WEBGL_multi_draw"))ft.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{let De=N._multiDrawStarts,mi=N._multiDrawCounts,mt=N._multiDrawCount,Fn=Re?W.get(Re).bytesPerElement:1,zs=xe.get(H).currentProgram.getUniforms();for(let Sn=0;Sn<mt;Sn++)zs.setValue(I,"_gl_DrawID",Sn),ft.render(De[Sn]/Fn,mi[Sn])}else if(N.isInstancedMesh)ft.renderInstances(dt,Pt,N.count);else if(z.isInstancedBufferGeometry){let De=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,mi=Math.min(z.instanceCount,De);ft.renderInstances(dt,Pt,mi)}else ft.render(dt,Pt)};function bt(M,O,z){M.transparent===!0&&M.side===Gn&&M.forceSinglePass===!1?(M.side=bn,M.needsUpdate=!0,Ha(M,O,z),M.side=$i,M.needsUpdate=!0,Ha(M,O,z),M.side=Gn):Ha(M,O,z)}this.compile=function(M,O,z=null){z===null&&(z=M),f=tt.get(z),f.init(O),S.push(f),z.traverseVisible(function(N){N.isLight&&N.layers.test(O.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),M!==z&&M.traverseVisible(function(N){N.isLight&&N.layers.test(O.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();let H=new Set;return M.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;let se=N.material;if(se)if(Array.isArray(se))for(let ge=0;ge<se.length;ge++){let Ce=se[ge];bt(Ce,z,N),H.add(Ce)}else bt(se,z,N),H.add(se)}),S.pop(),f=null,H},this.compileAsync=function(M,O,z=null){let H=this.compile(M,O,z);return new Promise(N=>{function se(){if(H.forEach(function(ge){xe.get(ge).currentProgram.isReady()&&H.delete(ge)}),H.size===0){N(M);return}setTimeout(se,10)}Q.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Bn=null;function fi(M){Bn&&Bn(M)}function Au(){is.stop()}function Tu(){is.start()}let is=new mp;is.setAnimationLoop(fi),typeof self<"u"&&is.setContext(self),this.setAnimationLoop=function(M){Bn=M,$.setAnimationLoop(M),M===null?is.stop():is.start()},$.addEventListener("sessionstart",Au),$.addEventListener("sessionend",Tu),this.render=function(M,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(O),O=$.getCamera()),M.isScene===!0&&M.onBeforeRender(y,M,O,w),f=tt.get(M,S.length),f.init(O),S.push(f),Ve.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),X.setFromProjectionMatrix(Ve),Ae=this.localClippingEnabled,ie=te.init(this.clippingPlanes,Ae),g=ye.get(M,A.length),g.init(),A.push(g),$.enabled===!0&&$.isPresenting===!0){let se=y.xr.getDepthSensingMesh();se!==null&&yl(se,O,-1/0,y.sortObjects)}yl(M,O,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(de,ve),Z=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,Z&&ze.addToRenderList(g,M),this.info.render.frame++,ie===!0&&te.beginShadows();let z=f.state.shadowsArray;Se.render(z,M,O),ie===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset();let H=g.opaque,N=g.transmissive;if(f.setupLights(),O.isArrayCamera){let se=O.cameras;if(N.length>0)for(let ge=0,Ce=se.length;ge<Ce;ge++){let Re=se[ge];Ru(H,N,M,Re)}Z&&ze.render(M);for(let ge=0,Ce=se.length;ge<Ce;ge++){let Re=se[ge];Cu(g,M,Re,Re.viewport)}}else N.length>0&&Ru(H,N,M,O),Z&&ze.render(M),Cu(g,M,O);w!==null&&(C.updateMultisampleRenderTarget(w),C.updateRenderTargetMipmap(w)),M.isScene===!0&&M.onAfterRender(y,M,O),At.resetDefaultState(),v=-1,x=null,S.pop(),S.length>0?(f=S[S.length-1],ie===!0&&te.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,A.pop(),A.length>0?g=A[A.length-1]:g=null};function yl(M,O,z,H){if(M.visible===!1)return;if(M.layers.test(O.layers)){if(M.isGroup)z=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(O);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||X.intersectsSprite(M)){H&&He.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Ve);let ge=q.update(M),Ce=M.material;Ce.visible&&g.push(M,ge,Ce,z,He.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||X.intersectsObject(M))){let ge=q.update(M),Ce=M.material;if(H&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),He.copy(M.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),He.copy(ge.boundingSphere.center)),He.applyMatrix4(M.matrixWorld).applyMatrix4(Ve)),Array.isArray(Ce)){let Re=ge.groups;for(let We=0,Ze=Re.length;We<Ze;We++){let Pe=Re[We],dt=Ce[Pe.materialIndex];dt&&dt.visible&&g.push(M,ge,dt,z,He.z,Pe)}}else Ce.visible&&g.push(M,ge,Ce,z,He.z,null)}}let se=M.children;for(let ge=0,Ce=se.length;ge<Ce;ge++)yl(se[ge],O,z,H)}function Cu(M,O,z,H){let N=M.opaque,se=M.transmissive,ge=M.transparent;f.setupLightsView(z),ie===!0&&te.setGlobalState(y.clippingPlanes,z),H&&le.viewport(P.copy(H)),N.length>0&&za(N,O,z),se.length>0&&za(se,O,z),ge.length>0&&za(ge,O,z),le.buffers.depth.setTest(!0),le.buffers.depth.setMask(!0),le.buffers.color.setMask(!0),le.setPolygonOffset(!1)}function Ru(M,O,z,H){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[H.id]===void 0&&(f.state.transmissionRenderTarget[H.id]=new Ai(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")||Q.has("EXT_color_buffer_float")?_a:Ei,minFilter:fs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace}));let se=f.state.transmissionRenderTarget[H.id],ge=H.viewport||P;se.setSize(ge.z,ge.w);let Ce=y.getRenderTarget();y.setRenderTarget(se),y.getClearColor(B),j=y.getClearAlpha(),j<1&&y.setClearColor(16777215,.5),y.clear(),Z&&ze.render(z);let Re=y.toneMapping;y.toneMapping=Gi;let We=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),f.setupLightsView(H),ie===!0&&te.setGlobalState(y.clippingPlanes,H),za(M,z,H),C.updateMultisampleRenderTarget(se),C.updateRenderTargetMipmap(se),Q.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let Pe=0,dt=O.length;Pe<dt;Pe++){let Tt=O[Pe],Pt=Tt.object,gn=Tt.geometry,ft=Tt.material,De=Tt.group;if(ft.side===Gn&&Pt.layers.test(H.layers)){let mi=ft.side;ft.side=bn,ft.needsUpdate=!0,Pu(Pt,z,H,gn,ft,De),ft.side=mi,ft.needsUpdate=!0,Ze=!0}}Ze===!0&&(C.updateMultisampleRenderTarget(se),C.updateRenderTargetMipmap(se))}y.setRenderTarget(Ce),y.setClearColor(B,j),We!==void 0&&(H.viewport=We),y.toneMapping=Re}function za(M,O,z){let H=O.isScene===!0?O.overrideMaterial:null;for(let N=0,se=M.length;N<se;N++){let ge=M[N],Ce=ge.object,Re=ge.geometry,We=H===null?ge.material:H,Ze=ge.group;Ce.layers.test(z.layers)&&Pu(Ce,O,z,Re,We,Ze)}}function Pu(M,O,z,H,N,se){M.onBeforeRender(y,O,z,H,N,se),M.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),N.onBeforeRender(y,O,z,H,M,se),N.transparent===!0&&N.side===Gn&&N.forceSinglePass===!1?(N.side=bn,N.needsUpdate=!0,y.renderBufferDirect(z,O,H,N,M,se),N.side=$i,N.needsUpdate=!0,y.renderBufferDirect(z,O,H,N,M,se),N.side=Gn):y.renderBufferDirect(z,O,H,N,M,se),M.onAfterRender(y,O,z,H,N,se)}function Ha(M,O,z){O.isScene!==!0&&(O=at);let H=xe.get(M),N=f.state.lights,se=f.state.shadowsArray,ge=N.state.version,Ce=Te.getParameters(M,N.state,se,O,z),Re=Te.getProgramCacheKey(Ce),We=H.programs;H.environment=M.isMeshStandardMaterial?O.environment:null,H.fog=O.fog,H.envMap=(M.isMeshStandardMaterial?V:_).get(M.envMap||H.environment),H.envMapRotation=H.environment!==null&&M.envMap===null?O.environmentRotation:M.envMapRotation,We===void 0&&(M.addEventListener("dispose",Ye),We=new Map,H.programs=We);let Ze=We.get(Re);if(Ze!==void 0){if(H.currentProgram===Ze&&H.lightsStateVersion===ge)return Lu(M,Ce),Ze}else Ce.uniforms=Te.getUniforms(M),M.onBeforeCompile(Ce,y),Ze=Te.acquireProgram(Ce,Re),We.set(Re,Ze),H.uniforms=Ce.uniforms;let Pe=H.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Pe.clippingPlanes=te.uniform),Lu(M,Ce),H.needsLights=am(M),H.lightsStateVersion=ge,H.needsLights&&(Pe.ambientLightColor.value=N.state.ambient,Pe.lightProbe.value=N.state.probe,Pe.directionalLights.value=N.state.directional,Pe.directionalLightShadows.value=N.state.directionalShadow,Pe.spotLights.value=N.state.spot,Pe.spotLightShadows.value=N.state.spotShadow,Pe.rectAreaLights.value=N.state.rectArea,Pe.ltc_1.value=N.state.rectAreaLTC1,Pe.ltc_2.value=N.state.rectAreaLTC2,Pe.pointLights.value=N.state.point,Pe.pointLightShadows.value=N.state.pointShadow,Pe.hemisphereLights.value=N.state.hemi,Pe.directionalShadowMap.value=N.state.directionalShadowMap,Pe.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Pe.spotShadowMap.value=N.state.spotShadowMap,Pe.spotLightMatrix.value=N.state.spotLightMatrix,Pe.spotLightMap.value=N.state.spotLightMap,Pe.pointShadowMap.value=N.state.pointShadowMap,Pe.pointShadowMatrix.value=N.state.pointShadowMatrix),H.currentProgram=Ze,H.uniformsList=null,Ze}function Iu(M){if(M.uniformsList===null){let O=M.currentProgram.getUniforms();M.uniformsList=ur.seqWithValue(O.seq,M.uniforms)}return M.uniformsList}function Lu(M,O){let z=xe.get(M);z.outputColorSpace=O.outputColorSpace,z.batching=O.batching,z.batchingColor=O.batchingColor,z.instancing=O.instancing,z.instancingColor=O.instancingColor,z.instancingMorph=O.instancingMorph,z.skinning=O.skinning,z.morphTargets=O.morphTargets,z.morphNormals=O.morphNormals,z.morphColors=O.morphColors,z.morphTargetsCount=O.morphTargetsCount,z.numClippingPlanes=O.numClippingPlanes,z.numIntersection=O.numClipIntersection,z.vertexAlphas=O.vertexAlphas,z.vertexTangents=O.vertexTangents,z.toneMapping=O.toneMapping}function sm(M,O,z,H,N){O.isScene!==!0&&(O=at),C.resetTextureUnits();let se=O.fog,ge=H.isMeshStandardMaterial?O.environment:null,Ce=w===null?y.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:wr,Re=(H.isMeshStandardMaterial?V:_).get(H.envMap||ge),We=H.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Ze=!!z.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Pe=!!z.morphAttributes.position,dt=!!z.morphAttributes.normal,Tt=!!z.morphAttributes.color,Pt=Gi;H.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Pt=y.toneMapping);let gn=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ft=gn!==void 0?gn.length:0,De=xe.get(H),mi=f.state.lights;if(ie===!0&&(Ae===!0||M!==x)){let Ln=M===x&&H.id===v;te.setState(H,M,Ln)}let mt=!1;H.version===De.__version?(De.needsLights&&De.lightsStateVersion!==mi.state.version||De.outputColorSpace!==Ce||N.isBatchedMesh&&De.batching===!1||!N.isBatchedMesh&&De.batching===!0||N.isBatchedMesh&&De.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&De.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&De.instancing===!1||!N.isInstancedMesh&&De.instancing===!0||N.isSkinnedMesh&&De.skinning===!1||!N.isSkinnedMesh&&De.skinning===!0||N.isInstancedMesh&&De.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&De.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&De.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&De.instancingMorph===!1&&N.morphTexture!==null||De.envMap!==Re||H.fog===!0&&De.fog!==se||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==te.numPlanes||De.numIntersection!==te.numIntersection)||De.vertexAlphas!==We||De.vertexTangents!==Ze||De.morphTargets!==Pe||De.morphNormals!==dt||De.morphColors!==Tt||De.toneMapping!==Pt||De.morphTargetsCount!==ft)&&(mt=!0):(mt=!0,De.__version=H.version);let Fn=De.currentProgram;mt===!0&&(Fn=Ha(H,O,N));let zs=!1,Sn=!1,Fr=!1,It=Fn.getUniforms(),ei=De.uniforms;if(le.useProgram(Fn.program)&&(zs=!0,Sn=!0,Fr=!0),H.id!==v&&(v=H.id,Sn=!0),zs||x!==M){le.buffers.depth.getReversed()?(oe.copy(M.projectionMatrix),u0(oe),h0(oe),It.setValue(I,"projectionMatrix",oe)):It.setValue(I,"projectionMatrix",M.projectionMatrix),It.setValue(I,"viewMatrix",M.matrixWorldInverse);let Li=It.map.cameraPosition;Li!==void 0&&Li.setValue(I,$e.setFromMatrixPosition(M.matrixWorld)),_e.logarithmicDepthBuffer&&It.setValue(I,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&It.setValue(I,"isOrthographic",M.isOrthographicCamera===!0),x!==M&&(x=M,Sn=!0,Fr=!0)}if(N.isSkinnedMesh){It.setOptional(I,N,"bindMatrix"),It.setOptional(I,N,"bindMatrixInverse");let Ln=N.skeleton;Ln&&(Ln.boneTexture===null&&Ln.computeBoneTexture(),It.setValue(I,"boneTexture",Ln.boneTexture,C))}N.isBatchedMesh&&(It.setOptional(I,N,"batchingTexture"),It.setValue(I,"batchingTexture",N._matricesTexture,C),It.setOptional(I,N,"batchingIdTexture"),It.setValue(I,"batchingIdTexture",N._indirectTexture,C),It.setOptional(I,N,"batchingColorTexture"),N._colorsTexture!==null&&It.setValue(I,"batchingColorTexture",N._colorsTexture,C));let zr=z.morphAttributes;if((zr.position!==void 0||zr.normal!==void 0||zr.color!==void 0)&&Ge.update(N,z,Fn),(Sn||De.receiveShadow!==N.receiveShadow)&&(De.receiveShadow=N.receiveShadow,It.setValue(I,"receiveShadow",N.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(ei.envMap.value=Re,ei.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&O.environment!==null&&(ei.envMapIntensity.value=O.environmentIntensity),Sn&&(It.setValue(I,"toneMappingExposure",y.toneMappingExposure),De.needsLights&&rm(ei,Fr),se&&H.fog===!0&&he.refreshFogUniforms(ei,se),he.refreshMaterialUniforms(ei,H,G,ee,f.state.transmissionRenderTarget[M.id]),ur.upload(I,Iu(De),ei,C)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(ur.upload(I,Iu(De),ei,C),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&It.setValue(I,"center",N.center),It.setValue(I,"modelViewMatrix",N.modelViewMatrix),It.setValue(I,"normalMatrix",N.normalMatrix),It.setValue(I,"modelMatrix",N.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){let Ln=H.uniformsGroups;for(let Li=0,Di=Ln.length;Li<Di;Li++){let Du=Ln[Li];D.update(Du,Fn),D.bind(Du,Fn)}}return Fn}function rm(M,O){M.ambientLightColor.needsUpdate=O,M.lightProbe.needsUpdate=O,M.directionalLights.needsUpdate=O,M.directionalLightShadows.needsUpdate=O,M.pointLights.needsUpdate=O,M.pointLightShadows.needsUpdate=O,M.spotLights.needsUpdate=O,M.spotLightShadows.needsUpdate=O,M.rectAreaLights.needsUpdate=O,M.hemisphereLights.needsUpdate=O}function am(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(M,O,z){xe.get(M.texture).__webglTexture=O,xe.get(M.depthTexture).__webglTexture=z;let H=xe.get(M);H.__hasExternalTextures=!0,H.__autoAllocateDepthBuffer=z===void 0,H.__autoAllocateDepthBuffer||Q.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,O){let z=xe.get(M);z.__webglFramebuffer=O,z.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(M,O=0,z=0){w=M,T=O,R=z;let H=!0,N=null,se=!1,ge=!1;if(M){let Re=xe.get(M);if(Re.__useDefaultFramebuffer!==void 0)le.bindFramebuffer(I.FRAMEBUFFER,null),H=!1;else if(Re.__webglFramebuffer===void 0)C.setupRenderTarget(M);else if(Re.__hasExternalTextures)C.rebindTextures(M,xe.get(M.texture).__webglTexture,xe.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Pe=M.depthTexture;if(Re.__boundDepthTexture!==Pe){if(Pe!==null&&xe.has(Pe)&&(M.width!==Pe.image.width||M.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(M)}}let We=M.texture;(We.isData3DTexture||We.isDataArrayTexture||We.isCompressedArrayTexture)&&(ge=!0);let Ze=xe.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ze[O])?N=Ze[O][z]:N=Ze[O],se=!0):M.samples>0&&C.useMultisampledRTT(M)===!1?N=xe.get(M).__webglMultisampledFramebuffer:Array.isArray(Ze)?N=Ze[z]:N=Ze,P.copy(M.viewport),F.copy(M.scissor),U=M.scissorTest}else P.copy(we).multiplyScalar(G).floor(),F.copy(Xe).multiplyScalar(G).floor(),U=pt;if(le.bindFramebuffer(I.FRAMEBUFFER,N)&&H&&le.drawBuffers(M,N),le.viewport(P),le.scissor(F),le.setScissorTest(U),se){let Re=xe.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,Re.__webglTexture,z)}else if(ge){let Re=xe.get(M.texture),We=O||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,Re.__webglTexture,z||0,We)}v=-1},this.readRenderTargetPixels=function(M,O,z,H,N,se,ge){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=xe.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ge!==void 0&&(Ce=Ce[ge]),Ce){le.bindFramebuffer(I.FRAMEBUFFER,Ce);try{let Re=M.texture,We=Re.format,Ze=Re.type;if(!_e.textureFormatReadable(We)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!_e.textureTypeReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=M.width-H&&z>=0&&z<=M.height-N&&I.readPixels(O,z,H,N,Qe.convert(We),Qe.convert(Ze),se)}finally{let Re=w!==null?xe.get(w).__webglFramebuffer:null;le.bindFramebuffer(I.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(M,O,z,H,N,se,ge){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=xe.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ge!==void 0&&(Ce=Ce[ge]),Ce){let Re=M.texture,We=Re.format,Ze=Re.type;if(!_e.textureFormatReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!_e.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=M.width-H&&z>=0&&z<=M.height-N){le.bindFramebuffer(I.FRAMEBUFFER,Ce);let Pe=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Pe),I.bufferData(I.PIXEL_PACK_BUFFER,se.byteLength,I.STREAM_READ),I.readPixels(O,z,H,N,Qe.convert(We),Qe.convert(Ze),0);let dt=w!==null?xe.get(w).__webglFramebuffer:null;le.bindFramebuffer(I.FRAMEBUFFER,dt);let Tt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await d0(I,Tt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Pe),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,se),I.deleteBuffer(Pe),I.deleteSync(Tt),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,O=null,z=0){M.isTexture!==!0&&(Kr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,M=arguments[1]);let H=Math.pow(2,-z),N=Math.floor(M.image.width*H),se=Math.floor(M.image.height*H),ge=O!==null?O.x:0,Ce=O!==null?O.y:0;C.setTexture2D(M,0),I.copyTexSubImage2D(I.TEXTURE_2D,z,0,0,ge,Ce,N,se),le.unbindTexture()},this.copyTextureToTexture=function(M,O,z=null,H=null,N=0){M.isTexture!==!0&&(Kr("WebGLRenderer: copyTextureToTexture function signature has changed."),H=arguments[0]||null,M=arguments[1],O=arguments[2],N=arguments[3]||0,z=null);let se,ge,Ce,Re,We,Ze,Pe,dt,Tt,Pt=M.isCompressedTexture?M.mipmaps[N]:M.image;z!==null?(se=z.max.x-z.min.x,ge=z.max.y-z.min.y,Ce=z.isBox3?z.max.z-z.min.z:1,Re=z.min.x,We=z.min.y,Ze=z.isBox3?z.min.z:0):(se=Pt.width,ge=Pt.height,Ce=Pt.depth||1,Re=0,We=0,Ze=0),H!==null?(Pe=H.x,dt=H.y,Tt=H.z):(Pe=0,dt=0,Tt=0);let gn=Qe.convert(O.format),ft=Qe.convert(O.type),De;O.isData3DTexture?(C.setTexture3D(O,0),De=I.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(C.setTexture2DArray(O,0),De=I.TEXTURE_2D_ARRAY):(C.setTexture2D(O,0),De=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);let mi=I.getParameter(I.UNPACK_ROW_LENGTH),mt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Fn=I.getParameter(I.UNPACK_SKIP_PIXELS),zs=I.getParameter(I.UNPACK_SKIP_ROWS),Sn=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,Pt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Pt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Re),I.pixelStorei(I.UNPACK_SKIP_ROWS,We),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ze);let Fr=M.isDataArrayTexture||M.isData3DTexture,It=O.isDataArrayTexture||O.isData3DTexture;if(M.isRenderTargetTexture||M.isDepthTexture){let ei=xe.get(M),zr=xe.get(O),Ln=xe.get(ei.__renderTarget),Li=xe.get(zr.__renderTarget);le.bindFramebuffer(I.READ_FRAMEBUFFER,Ln.__webglFramebuffer),le.bindFramebuffer(I.DRAW_FRAMEBUFFER,Li.__webglFramebuffer);for(let Di=0;Di<Ce;Di++)Fr&&I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,xe.get(M).__webglTexture,N,Ze+Di),M.isDepthTexture?(It&&I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,xe.get(O).__webglTexture,N,Tt+Di),I.blitFramebuffer(Re,We,se,ge,Pe,dt,se,ge,I.DEPTH_BUFFER_BIT,I.NEAREST)):It?I.copyTexSubImage3D(De,N,Pe,dt,Tt+Di,Re,We,se,ge):I.copyTexSubImage2D(De,N,Pe,dt,Tt+Di,Re,We,se,ge);le.bindFramebuffer(I.READ_FRAMEBUFFER,null),le.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else It?M.isDataTexture||M.isData3DTexture?I.texSubImage3D(De,N,Pe,dt,Tt,se,ge,Ce,gn,ft,Pt.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(De,N,Pe,dt,Tt,se,ge,Ce,gn,Pt.data):I.texSubImage3D(De,N,Pe,dt,Tt,se,ge,Ce,gn,ft,Pt):M.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,N,Pe,dt,se,ge,gn,ft,Pt.data):M.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,N,Pe,dt,Pt.width,Pt.height,gn,Pt.data):I.texSubImage2D(I.TEXTURE_2D,N,Pe,dt,se,ge,gn,ft,Pt);I.pixelStorei(I.UNPACK_ROW_LENGTH,mi),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,mt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Fn),I.pixelStorei(I.UNPACK_SKIP_ROWS,zs),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Sn),N===0&&O.generateMipmaps&&I.generateMipmap(De),le.unbindTexture()},this.copyTextureToTexture3D=function(M,O,z=null,H=null,N=0){return M.isTexture!==!0&&(Kr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,H=arguments[1]||null,M=arguments[2],O=arguments[3],N=arguments[4]||0),Kr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,O,z,H,N)},this.initRenderTarget=function(M){xe.get(M).__webglFramebuffer===void 0&&C.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?C.setTextureCube(M,0):M.isData3DTexture?C.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?C.setTexture2DArray(M,0):C.setTexture2D(M,0),le.unbindTexture()},this.resetState=function(){T=0,R=0,w=null,le.reset(),At.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}},vs=class extends sn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ri,this.environmentIntensity=1,this.environmentRotation=new ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},rd=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=kc,this.updateRanges=[],this.version=0,this.uuid=si()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=si()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=si()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},un=new E,Bo=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)un.fromBufferAttribute(this,t),un.applyMatrix4(e),this.setXYZ(t,un.x,un.y,un.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)un.fromBufferAttribute(this,t),un.applyNormalMatrix(e),this.setXYZ(t,un.x,un.y,un.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)un.fromBufferAttribute(this,t),un.transformDirection(e),this.setXYZ(t,un.x,un.y,un.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=$n(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=$n(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=$n(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=$n(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=$n(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),n=xt(n,this.array),s=xt(s,this.array),r=xt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new nn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ji=class extends ai{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new Be(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},jr=new E,nr=new E,ir=new E,sr=new K,qr=new K,yp=new ut,co=new E,Xr=new E,uo=new E,Oh=new K,Jl=new K,Nh=new K,xs=class extends sn{constructor(e=new ji){if(super(),this.isSprite=!0,this.type="Sprite",tr===void 0){tr=new qt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new rd(t,5);tr.setIndex([0,1,2,0,2,3]),tr.setAttribute("position",new Bo(n,3,0,!1)),tr.setAttribute("uv",new Bo(n,2,3,!1))}this.geometry=tr,this.material=e,this.center=new K(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),nr.setFromMatrixScale(this.matrixWorld),yp.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ir.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&nr.multiplyScalar(-ir.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;ho(co.set(-.5,-.5,0),ir,a,nr,s,r),ho(Xr.set(.5,-.5,0),ir,a,nr,s,r),ho(uo.set(.5,.5,0),ir,a,nr,s,r),Oh.set(0,0),Jl.set(1,0),Nh.set(1,1);let o=e.ray.intersectTriangle(co,Xr,uo,!1,jr);if(o===null&&(ho(Xr.set(-.5,.5,0),ir,a,nr,s,r),Jl.set(0,1),o=e.ray.intersectTriangle(co,uo,Xr,!1,jr),o===null))return;let l=e.ray.origin.distanceTo(jr);l<e.near||l>e.far||t.push({distance:l,point:jr.clone(),uv:Hi.getInterpolation(jr,co,Xr,uo,Oh,Jl,Nh,new K),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};ad=class extends vn{constructor(e=null,t=1,n=1,s,r,a,o,l,c=An,d=An,u,h){super(null,a,o,l,c,d,s,r,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Fo=class extends nn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},rr=new ut,Uh=new ut,po=[],Vh=new jt,ay=new ut,Yr=new Oe,Zr=new Wi,ua=class extends Oe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Fo(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ay)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new jt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,rr),Vh.copy(e.boundingBox).applyMatrix4(rr),this.boundingBox.union(Vh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Wi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,rr),Zr.copy(e.boundingSphere).applyMatrix4(rr),this.boundingSphere.union(Zr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Yr.geometry=this.geometry,Yr.material=this.material,Yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Zr.copy(this.boundingSphere),Zr.applyMatrix4(n),e.ray.intersectsSphere(Zr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,rr),Uh.multiplyMatrices(n,rr),Yr.matrixWorld=Uh,Yr.raycast(e,po);for(let a=0,o=po.length;a<o;a++){let l=po[a];l.instanceId=r,l.object=this,t.push(l)}po.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Fo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ad(new Float32Array(s*this.count),s,this.count,Pd,ii));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}},xr=class extends ai{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Be(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},zo=new E,Ho=new E,Bh=new ut,Jr=new gs,fo=new Wi,Kl=new E,Fh=new E,od=class extends sn{constructor(e=new qt,t=new xr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)zo.fromBufferAttribute(t,s-1),Ho.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=zo.distanceTo(Ho);e.setAttribute("lineDistance",new rt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fo.copy(n.boundingSphere),fo.applyMatrix4(s),fo.radius+=r,e.ray.intersectsSphere(fo)===!1)return;Bh.copy(s).invert(),Jr.copy(e.ray).applyMatrix4(Bh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=n.index,h=n.attributes.position;if(d!==null){let p=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let b=p,g=m-1;b<g;b+=c){let f=d.getX(b),A=d.getX(b+1),S=mo(this,e,Jr,l,f,A);S&&t.push(S)}if(this.isLineLoop){let b=d.getX(m-1),g=d.getX(p),f=mo(this,e,Jr,l,b,g);f&&t.push(f)}}else{let p=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let b=p,g=m-1;b<g;b+=c){let f=mo(this,e,Jr,l,b,b+1);f&&t.push(f)}if(this.isLineLoop){let b=mo(this,e,Jr,l,m-1,p);b&&t.push(b)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};zh=new E,Hh=new E,ha=class extends od{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)zh.fromBufferAttribute(t,s),Hh.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+zh.distanceTo(Hh);e.setAttribute("lineDistance",new rt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},yr=class extends vn{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},On=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let d=n[s],h=n[s+1]-d,p=(a-d)/h;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new K:new E);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new E,s=[],r=[],a=[],o=new E,l=new ut;for(let p=0;p<=e;p++){let m=p/e;s[p]=this.getTangentAt(m,new E)}r[0]=new E,a[0]=new E;let c=Number.MAX_VALUE,d=Math.abs(s[0].x),u=Math.abs(s[0].y),h=Math.abs(s[0].z);d<=c&&(c=d,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Wt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,m))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Wt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],p*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},pa=class extends On{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new K){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=l-this.aX,p=c-this.aY;l=h*d-p*u+this.aX,c=h*u+p*d+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ld=class extends pa{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};go=new E,Ql=new Ud,ec=new Ud,tc=new Ud,Ti=class extends On{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new E){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,d;this.closed||o>0?c=s[(o-1)%r]:(go.subVectors(s[0],s[1]).add(s[0]),c=go);let u=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(go.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=go),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),p),b=Math.pow(u.distanceToSquared(h),p),g=Math.pow(h.distanceToSquared(d),p);b<1e-4&&(b=1),m<1e-4&&(m=b),g<1e-4&&(g=b),Ql.initNonuniformCatmullRom(c.x,u.x,h.x,d.x,m,b,g),ec.initNonuniformCatmullRom(c.y,u.y,h.y,d.y,m,b,g),tc.initNonuniformCatmullRom(c.z,u.z,h.z,d.z,m,b,g)}else this.curveType==="catmullrom"&&(Ql.initCatmullRom(c.x,u.x,h.x,d.x,this.tension),ec.initCatmullRom(c.y,u.y,h.y,d.y,this.tension),tc.initCatmullRom(c.z,u.z,h.z,d.z,this.tension));return n.set(Ql.calc(l),ec.calc(l),tc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new E().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};ko=class extends On{constructor(e=new K,t=new K,n=new K,s=new K){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new K){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(sa(e,s.x,r.x,a.x,o.x),sa(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ys=class extends On{constructor(e=new E,t=new E,n=new E,s=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new E){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(sa(e,s.x,r.x,a.x,o.x),sa(e,s.y,r.y,a.y,o.y),sa(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Go=class extends On{constructor(e=new K,t=new K){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new K){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new K){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},cd=class extends On{constructor(e=new E,t=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new E){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new E){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$o=class extends On{constructor(e=new K,t=new K,n=new K){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new K){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ia(e,s.x,r.x,a.x),ia(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Wo=class extends On{constructor(e=new E,t=new E,n=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new E){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ia(e,s.x,r.x,a.x),ia(e,s.y,r.y,a.y),ia(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},jo=class extends On{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new K){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(kh(o,l.x,c.x,d.x,u.x),kh(o,l.y,c.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new K().fromArray(s))}return this}},qo=Object.freeze({__proto__:null,ArcCurve:ld,CatmullRomCurve3:Ti,CubicBezierCurve:ko,CubicBezierCurve3:ys,EllipseCurve:pa,LineCurve:Go,LineCurve3:cd,QuadraticBezierCurve:$o,QuadraticBezierCurve3:Wo,SplineCurve:jo}),dd=class extends On{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new qo[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let d=l[c];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new qo[s.type]().fromJSON(s))}return this}},_s=class extends dd{constructor(e){super(),this.type="Path",this.currentPoint=new K,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Go(this.currentPoint.clone(),new K(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new $o(this.currentPoint.clone(),new K(e,t),new K(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new ko(this.currentPoint.clone(),new K(e,t),new K(n,s),new K(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new jo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new pa(e,t,n,s,r,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ud=class i extends qt{constructor(e=[new K(0,-.5),new K(.5,0),new K(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=Wt(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],d=1/t,u=new E,h=new K,p=new E,m=new E,b=new E,g=0,f=0;for(let A=0;A<=e.length-1;A++)switch(A){case 0:g=e[A+1].x-e[A].x,f=e[A+1].y-e[A].y,p.x=f*1,p.y=-g,p.z=f*0,b.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(b.x,b.y,b.z);break;default:g=e[A+1].x-e[A].x,f=e[A+1].y-e[A].y,p.x=f*1,p.y=-g,p.z=f*0,m.copy(p),p.x+=b.x,p.y+=b.y,p.z+=b.z,p.normalize(),l.push(p.x,p.y,p.z),b.copy(m)}for(let A=0;A<=t;A++){let S=n+A*d*s,y=Math.sin(S),L=Math.cos(S);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*y,u.y=e[T].y,u.z=e[T].x*L,a.push(u.x,u.y,u.z),h.x=A/t,h.y=T/(e.length-1),o.push(h.x,h.y);let R=l[3*T+0]*y,w=l[3*T+1],v=l[3*T+0]*L;c.push(R,w,v)}}for(let A=0;A<t;A++)for(let S=0;S<e.length-1;S++){let y=S+A*e.length,L=y,T=y+e.length,R=y+e.length+1,w=y+1;r.push(L,T,w),r.push(R,w,T)}this.setIndex(r),this.setAttribute("position",new rt(a,3)),this.setAttribute("uv",new rt(o,2)),this.setAttribute("normal",new rt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},Xo=class i extends ud{constructor(e=1,t=1,n=4,s=8){let r=new _s;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},Ct=class i extends qt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let d=[],u=[],h=[],p=[],m=0,b=[],g=n/2,f=0;A(),a===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(d),this.setAttribute("position",new rt(u,3)),this.setAttribute("normal",new rt(h,3)),this.setAttribute("uv",new rt(p,2));function A(){let y=new E,L=new E,T=0,R=(t-e)/n;for(let w=0;w<=r;w++){let v=[],x=w/r,P=x*(t-e)+e;for(let F=0;F<=s;F++){let U=F/s,B=U*l+o,j=Math.sin(B),k=Math.cos(B);L.x=P*j,L.y=-x*n+g,L.z=P*k,u.push(L.x,L.y,L.z),y.set(j,R,k).normalize(),h.push(y.x,y.y,y.z),p.push(U,1-x),v.push(m++)}b.push(v)}for(let w=0;w<s;w++)for(let v=0;v<r;v++){let x=b[v][w],P=b[v+1][w],F=b[v+1][w+1],U=b[v][w+1];(e>0||v!==0)&&(d.push(x,P,U),T+=3),(t>0||v!==r-1)&&(d.push(P,F,U),T+=3)}c.addGroup(f,T,0),f+=T}function S(y){let L=m,T=new K,R=new E,w=0,v=y===!0?e:t,x=y===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,g*x,0),h.push(0,x,0),p.push(.5,.5),m++;let P=m;for(let F=0;F<=s;F++){let B=F/s*l+o,j=Math.cos(B),k=Math.sin(B);R.x=v*k,R.y=g*x,R.z=v*j,u.push(R.x,R.y,R.z),h.push(0,x,0),T.x=j*.5+.5,T.y=k*.5*x+.5,p.push(T.x,T.y),m++}for(let F=0;F<s;F++){let U=L+F,B=P+F;y===!0?d.push(B,B+1,U):d.push(B+1,B,U),w+=3}c.addGroup(f,w,y===!0?1:2),f+=w}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},qi=class extends _s{constructor(e){super(e),this.uuid=si(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new _s().fromJSON(s))}return this}},fy={triangulate:function(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=_p(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c,d,u,h,p;if(n&&(r=xy(i,e,r,t)),i.length>80*t){o=c=i[0],l=d=i[1];for(let m=t;m<s;m+=t)u=i[m],h=i[m+1],u<o&&(o=u),h<l&&(l=h),u>c&&(c=u),h>d&&(d=h);p=Math.max(c-o,d-l),p=p!==0?32767/p:0}return fa(r,a,t,o,l,p,0),a}};ra=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];$h(e),Wh(n,e);let a=e.length;t.forEach($h);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Wh(n,t[l]);let o=fy.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};Ms=class i extends qt{constructor(e=new qi([new K(.5,.5),new K(-.5,.5),new K(-.5,-.5),new K(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new rt(s,3)),this.setAttribute("uv",new rt(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:p-.1,b=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,f=t.extrudePath,A=t.UVGenerator!==void 0?t.UVGenerator:Iy,S,y=!1,L,T,R,w;f&&(S=f.getSpacedPoints(d),y=!0,h=!1,L=f.computeFrenetFrames(d,!1),T=new E,R=new E,w=new E),h||(g=0,p=0,m=0,b=0);let v=o.extractPoints(c),x=v.shape,P=v.holes;if(!ra.isClockWise(x)){x=x.reverse();for(let Z=0,ne=P.length;Z<ne;Z++){let I=P[Z];ra.isClockWise(I)&&(P[Z]=I.reverse())}}let U=ra.triangulateShape(x,P),B=x;for(let Z=0,ne=P.length;Z<ne;Z++){let I=P[Z];x=x.concat(I)}function j(Z,ne,I){return ne||console.error("THREE.ExtrudeGeometry: vec does not exist"),Z.clone().addScaledVector(ne,I)}let k=x.length,ee=U.length;function G(Z,ne,I){let Le,Q,_e,le=Z.x-ne.x,Fe=Z.y-ne.y,xe=I.x-Z.x,C=I.y-Z.y,_=le*le+Fe*Fe,V=le*C-Fe*xe;if(Math.abs(V)>Number.EPSILON){let W=Math.sqrt(_),J=Math.sqrt(xe*xe+C*C),q=ne.x-Fe/W,Te=ne.y+le/W,he=I.x-C/J,ye=I.y+xe/J,tt=((he-q)*C-(ye-Te)*xe)/(le*C-Fe*xe);Le=q+le*tt-Z.x,Q=Te+Fe*tt-Z.y;let te=Le*Le+Q*Q;if(te<=2)return new K(Le,Q);_e=Math.sqrt(te/2)}else{let W=!1;le>Number.EPSILON?xe>Number.EPSILON&&(W=!0):le<-Number.EPSILON?xe<-Number.EPSILON&&(W=!0):Math.sign(Fe)===Math.sign(C)&&(W=!0),W?(Le=-Fe,Q=le,_e=Math.sqrt(_)):(Le=le,Q=Fe,_e=Math.sqrt(_/2))}return new K(Le/_e,Q/_e)}let de=[];for(let Z=0,ne=B.length,I=ne-1,Le=Z+1;Z<ne;Z++,I++,Le++)I===ne&&(I=0),Le===ne&&(Le=0),de[Z]=G(B[Z],B[I],B[Le]);let ve=[],we,Xe=de.concat();for(let Z=0,ne=P.length;Z<ne;Z++){let I=P[Z];we=[];for(let Le=0,Q=I.length,_e=Q-1,le=Le+1;Le<Q;Le++,_e++,le++)_e===Q&&(_e=0),le===Q&&(le=0),we[Le]=G(I[Le],I[_e],I[le]);ve.push(we),Xe=Xe.concat(we)}for(let Z=0;Z<g;Z++){let ne=Z/g,I=p*Math.cos(ne*Math.PI/2),Le=m*Math.sin(ne*Math.PI/2)+b;for(let Q=0,_e=B.length;Q<_e;Q++){let le=j(B[Q],de[Q],Le);oe(le.x,le.y,-I)}for(let Q=0,_e=P.length;Q<_e;Q++){let le=P[Q];we=ve[Q];for(let Fe=0,xe=le.length;Fe<xe;Fe++){let C=j(le[Fe],we[Fe],Le);oe(C.x,C.y,-I)}}}let pt=m+b;for(let Z=0;Z<k;Z++){let ne=h?j(x[Z],Xe[Z],pt):x[Z];y?(R.copy(L.normals[0]).multiplyScalar(ne.x),T.copy(L.binormals[0]).multiplyScalar(ne.y),w.copy(S[0]).add(R).add(T),oe(w.x,w.y,w.z)):oe(ne.x,ne.y,0)}for(let Z=1;Z<=d;Z++)for(let ne=0;ne<k;ne++){let I=h?j(x[ne],Xe[ne],pt):x[ne];y?(R.copy(L.normals[Z]).multiplyScalar(I.x),T.copy(L.binormals[Z]).multiplyScalar(I.y),w.copy(S[Z]).add(R).add(T),oe(w.x,w.y,w.z)):oe(I.x,I.y,u/d*Z)}for(let Z=g-1;Z>=0;Z--){let ne=Z/g,I=p*Math.cos(ne*Math.PI/2),Le=m*Math.sin(ne*Math.PI/2)+b;for(let Q=0,_e=B.length;Q<_e;Q++){let le=j(B[Q],de[Q],Le);oe(le.x,le.y,u+I)}for(let Q=0,_e=P.length;Q<_e;Q++){let le=P[Q];we=ve[Q];for(let Fe=0,xe=le.length;Fe<xe;Fe++){let C=j(le[Fe],we[Fe],Le);y?oe(C.x,C.y+S[d-1].y,S[d-1].x+I):oe(C.x,C.y,u+I)}}}X(),ie();function X(){let Z=s.length/3;if(h){let ne=0,I=k*ne;for(let Le=0;Le<ee;Le++){let Q=U[Le];Ve(Q[2]+I,Q[1]+I,Q[0]+I)}ne=d+g*2,I=k*ne;for(let Le=0;Le<ee;Le++){let Q=U[Le];Ve(Q[0]+I,Q[1]+I,Q[2]+I)}}else{for(let ne=0;ne<ee;ne++){let I=U[ne];Ve(I[2],I[1],I[0])}for(let ne=0;ne<ee;ne++){let I=U[ne];Ve(I[0]+k*d,I[1]+k*d,I[2]+k*d)}}n.addGroup(Z,s.length/3-Z,0)}function ie(){let Z=s.length/3,ne=0;Ae(B,ne),ne+=B.length;for(let I=0,Le=P.length;I<Le;I++){let Q=P[I];Ae(Q,ne),ne+=Q.length}n.addGroup(Z,s.length/3-Z,1)}function Ae(Z,ne){let I=Z.length;for(;--I>=0;){let Le=I,Q=I-1;Q<0&&(Q=Z.length-1);for(let _e=0,le=d+g*2;_e<le;_e++){let Fe=k*_e,xe=k*(_e+1),C=ne+Le+Fe,_=ne+Q+Fe,V=ne+Q+xe,W=ne+Le+xe;$e(C,_,V,W)}}}function oe(Z,ne,I){l.push(Z),l.push(ne),l.push(I)}function Ve(Z,ne,I){He(Z),He(ne),He(I);let Le=s.length/3,Q=A.generateTopUV(n,s,Le-3,Le-2,Le-1);at(Q[0]),at(Q[1]),at(Q[2])}function $e(Z,ne,I,Le){He(Z),He(ne),He(Le),He(ne),He(I),He(Le);let Q=s.length/3,_e=A.generateSideWallUV(n,s,Q-6,Q-3,Q-2,Q-1);at(_e[0]),at(_e[1]),at(_e[3]),at(_e[1]),at(_e[2]),at(_e[3])}function He(Z){s.push(l[Z*3+0]),s.push(l[Z*3+1]),s.push(l[Z*3+2])}function at(Z){r.push(Z.x),r.push(Z.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Ly(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new qo[s.type]().fromJSON(s)),new i(n,e.options)}},Iy={generateTopUV:function(i,e,t,n,s){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[s*3],d=e[s*3+1];return[new K(r,a),new K(o,l),new K(c,d)]},generateSideWallUV:function(i,e,t,n,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],d=e[n*3+1],u=e[n*3+2],h=e[s*3],p=e[s*3+1],m=e[s*3+2],b=e[r*3],g=e[r*3+1],f=e[r*3+2];return Math.abs(o-d)<Math.abs(a-c)?[new K(a,1-l),new K(c,1-u),new K(h,1-m),new K(b,1-f)]:[new K(o,1-l),new K(d,1-u),new K(p,1-m),new K(g,1-f)]}};ba=class i extends qt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],d=[],u=e,h=(t-e)/s,p=new E,m=new K;for(let b=0;b<=s;b++){for(let g=0;g<=n;g++){let f=r+g/n*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),m.x=(p.x/t+1)/2,m.y=(p.y/t+1)/2,d.push(m.x,m.y)}u+=h}for(let b=0;b<s;b++){let g=b*(n+1);for(let f=0;f<n;f++){let A=f+g,S=A,y=A+n+1,L=A+n+2,T=A+1;o.push(S,y,T),o.push(y,L,T)}}this.setIndex(o),this.setAttribute("position",new rt(l,3)),this.setAttribute("normal",new rt(c,3)),this.setAttribute("uv",new rt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},li=class i extends qt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,d=[],u=new E,h=new E,p=[],m=[],b=[],g=[];for(let f=0;f<=n;f++){let A=[],S=f/n,y=0;f===0&&a===0?y=.5/t:f===n&&l===Math.PI&&(y=-.5/t);for(let L=0;L<=t;L++){let T=L/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+S*o),u.y=e*Math.cos(a+S*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+S*o),m.push(u.x,u.y,u.z),h.copy(u).normalize(),b.push(h.x,h.y,h.z),g.push(T+y,1-S),A.push(c++)}d.push(A)}for(let f=0;f<n;f++)for(let A=0;A<t;A++){let S=d[f][A+1],y=d[f][A],L=d[f+1][A],T=d[f+1][A+1];(f!==0||a>0)&&p.push(S,y,T),(f!==n-1||l<Math.PI)&&p.push(y,L,T)}this.setIndex(p),this.setAttribute("position",new rt(m,3)),this.setAttribute("normal",new rt(b,3)),this.setAttribute("uv",new rt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},va=class i extends qt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],l=[],c=[],d=new E,u=new E,h=new E;for(let p=0;p<=n;p++)for(let m=0;m<=s;m++){let b=m/s*r,g=p/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(b),u.y=(e+t*Math.cos(g))*Math.sin(b),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),d.x=e*Math.cos(b),d.y=e*Math.sin(b),h.subVectors(u,d).normalize(),l.push(h.x,h.y,h.z),c.push(m/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let m=1;m<=s;m++){let b=(s+1)*p+m-1,g=(s+1)*(p-1)+m-1,f=(s+1)*(p-1)+m,A=(s+1)*p+m;a.push(b,g,A),a.push(g,f,A)}this.setIndex(a),this.setAttribute("position",new rt(o,3)),this.setAttribute("normal",new rt(l,3)),this.setAttribute("uv",new rt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},jn=class i extends qt{constructor(e=new Wo(new E(-1,-1,0),new E(-1,1,0),new E(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new E,l=new E,c=new K,d=new E,u=[],h=[],p=[],m=[];b(),this.setIndex(m),this.setAttribute("position",new rt(u,3)),this.setAttribute("normal",new rt(h,3)),this.setAttribute("uv",new rt(p,2));function b(){for(let S=0;S<t;S++)g(S);g(r===!1?t:0),A(),f()}function g(S){d=e.getPointAt(S/t,d);let y=a.normals[S],L=a.binormals[S];for(let T=0;T<=s;T++){let R=T/s*Math.PI*2,w=Math.sin(R),v=-Math.cos(R);l.x=v*y.x+w*L.x,l.y=v*y.y+w*L.y,l.z=v*y.z+w*L.z,l.normalize(),h.push(l.x,l.y,l.z),o.x=d.x+n*l.x,o.y=d.y+n*l.y,o.z=d.z+n*l.z,u.push(o.x,o.y,o.z)}}function f(){for(let S=1;S<=t;S++)for(let y=1;y<=s;y++){let L=(s+1)*(S-1)+(y-1),T=(s+1)*S+(y-1),R=(s+1)*S+y,w=(s+1)*(S-1)+y;m.push(L,T,w),m.push(T,R,w)}}function A(){for(let S=0;S<=t;S++)for(let y=0;y<=s;y++)c.x=S/t,c.y=y/s,p.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new qo[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Yo=class extends ai{static get type(){return"ShadowMaterial"}constructor(e){super(),this.isShadowMaterial=!0,this.color=new Be(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}},lt=class extends ai{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Be(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cp,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};_r=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break t}a=t.length;break n}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},fd=class extends _r{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Bu,endingEnd:Bu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Fu:r=e,o=2*t-n;break;case zu:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Fu:a=e,l=2*n-t;break;case zu:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,d=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=this._offsetPrev,u=this._offsetNext,h=this._weightPrev,p=this._weightNext,m=(n-t)/(s-t),b=m*m,g=b*m,f=-h*g+2*h*b-h*m,A=(1+h)*g+(-1.5-2*h)*b+(-.5+h)*m+1,S=(-1-p)*g+(1.5+p)*b+.5*m,y=p*g-p*b;for(let L=0;L!==o;++L)r[L]=f*a[d+L]+A*a[c+L]+S*a[l+L]+y*a[u+L];return r}},md=class extends _r{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=(n-t)/(s-t),u=1-d;for(let h=0;h!==o;++h)r[h]=a[c+h]*u+a[l+h]*d;return r}},gd=class extends _r{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},qn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=xo(t,this.TimeBufferType),this.values=xo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:xo(e.times,Array),values:xo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new gd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new md(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new fd(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case To:t=this.InterpolantFactoryMethodDiscrete;break;case Hc:t=this.InterpolantFactoryMethodLinear;break;case El:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return To;case this.InterpolantFactoryMethodLinear:return Hc;case this.InterpolantFactoryMethodSmooth:return El}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Dy(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===El,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],d=e[o+1];if(c!==d&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*n,h=u-n,p=u+n;for(let m=0;m!==n;++m){let b=t[u+m];if(b!==t[h+m]||b!==t[p+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,h=a*n;for(let p=0;p!==n;++p)t[h+p]=t[u+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};qn.prototype.TimeBufferType=Float32Array;qn.prototype.ValueBufferType=Float32Array;qn.prototype.DefaultInterpolation=Hc;Es=class extends qn{constructor(e,t,n){super(e,t,n)}};Es.prototype.ValueTypeName="bool";Es.prototype.ValueBufferType=Array;Es.prototype.DefaultInterpolation=To;Es.prototype.InterpolantFactoryMethodLinear=void 0;Es.prototype.InterpolantFactoryMethodSmooth=void 0;bd=class extends qn{};bd.prototype.ValueTypeName="color";vd=class extends qn{};vd.prototype.ValueTypeName="number";xd=class extends _r{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let d=c+o;c!==d;c+=4)pn.slerpFlat(r,0,a,c-o,a,c,l);return r}},Zo=class extends qn{InterpolantFactoryMethodLinear(e){return new xd(this.times,this.values,this.getValueSize(),e)}};Zo.prototype.ValueTypeName="quaternion";Zo.prototype.InterpolantFactoryMethodSmooth=void 0;ws=class extends qn{constructor(e,t,n){super(e,t,n)}};ws.prototype.ValueTypeName="string";ws.prototype.ValueBufferType=Array;ws.prototype.DefaultInterpolation=To;ws.prototype.InterpolantFactoryMethodLinear=void 0;ws.prototype.InterpolantFactoryMethodSmooth=void 0;yd=class extends qn{};yd.prototype.ValueTypeName="vector";_d=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,u){return c.push(d,u),this},this.removeHandler=function(d){let u=c.indexOf(d);return u!==-1&&c.splice(u,2),this},this.getHandler=function(d){for(let u=0,h=c.length;u<h;u+=2){let p=c[u],m=c[u+1];if(p.global&&(p.lastIndex=0),p.test(d))return m}return null}}},Oy=new _d,Sd=class{constructor(e){this.manager=e!==void 0?e:Oy,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Sd.DEFAULT_MATERIAL_NAME="__DEFAULT";Jo=class extends sn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Be(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},As=class extends Jo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(sn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Be(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},nc=new ut,jh=new E,qh=new E,Md=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new K(512,512),this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new da,this._frameExtents=new K(1,1),this._viewportCount=1,this._viewports=[new zt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;jh.setFromMatrixPosition(e.matrixWorld),t.position.copy(jh),qh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qh),t.updateMatrixWorld(),nc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(nc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ed=class extends Md{constructor(){super(new vr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ci=class extends Jo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(sn.DEFAULT_UP),this.updateMatrix(),this.target=new sn,this.shadow=new Ed}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Sr=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Xh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=Xh();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};Vd="\\[\\]\\.:\\/",Ny=new RegExp("["+Vd+"]","g"),Bd="[^"+Vd+"]",Uy="[^"+Vd.replace("\\.","")+"]",Vy=/((?:WC+[\/:])*)/.source.replace("WC",Bd),By=/(WCOD+)?/.source.replace("WCOD",Uy),Fy=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Bd),zy=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Bd),Hy=new RegExp("^"+Vy+By+Fy+zy+"$"),ky=["material","materials","bones","map"],wd=class{constructor(e,t,n){let s=n||Ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ot=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Ny,"")}static parseTrackName(e){let t=Hy.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);ky.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===c){c=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ot.Composite=wd;Ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ot.prototype.GetterByBindingType=[Ot.prototype._getValue_direct,Ot.prototype._getValue_array,Ot.prototype._getValue_arrayElement,Ot.prototype._getValue_toArray];Ot.prototype.SetterByBindingTypeAndVersioning=[[Ot.prototype._setValue_direct,Ot.prototype._setValue_direct_setNeedsUpdate,Ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_array,Ot.prototype._setValue_array_setNeedsUpdate,Ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_arrayElement,Ot.prototype._setValue_arrayElement_setNeedsUpdate,Ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ot.prototype._setValue_fromArray,Ot.prototype._setValue_fromArray_setNeedsUpdate,Ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];X_=new Float32Array(1),Yh=new ut,Ko=class{constructor(e,t,n=0,s=1/0){this.ray=new gs(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new ca,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Yh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Yh),this}intersectObject(e,t=!0,n=[]){return Ad(e,this,n,t),n.sort(Zh),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Ad(e[s],this,n,t);return n.sort(Zh),n}};xa=class{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Wt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},Mr=class extends ha{constructor(e=10,t=10,n=4473924,s=8947848){n=new Be(n),s=new Be(s);let r=t/2,a=e/t,o=e/2,l=[],c=[];for(let h=0,p=0,m=-o;h<=t;h++,m+=a){l.push(-o,0,m,o,0,m),l.push(m,0,-o,m,0,o);let b=h===r?n:s;b.toArray(c,p),p+=3,b.toArray(c,p),p+=3,b.toArray(c,p),p+=3,b.toArray(c,p),p+=3}let d=new qt;d.setAttribute("position",new rt(l,3)),d.setAttribute("color",new rt(c,3));let u=new xr({vertexColors:!0,toneMapped:!1});super(d,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}},yo=new jt,Qo=class extends ha{constructor(e,t=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=new Float32Array(24),r=new qt;r.setIndex(new nn(n,1)),r.setAttribute("position",new nn(s,3)),super(r,new xr({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(e){if(e!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&yo.setFromObject(this.object),yo.isEmpty())return;let t=yo.min,n=yo.max,s=this.geometry.attributes.position,r=s.array;r[0]=n.x,r[1]=n.y,r[2]=n.z,r[3]=t.x,r[4]=n.y,r[5]=n.z,r[6]=t.x,r[7]=t.y,r[8]=n.z,r[9]=n.x,r[10]=t.y,r[11]=n.z,r[12]=n.x,r[13]=n.y,r[14]=t.z,r[15]=t.x,r[16]=n.y,r[17]=t.z,r[18]=t.x,r[19]=t.y,r[20]=t.z,r[21]=n.x,r[22]=t.y,r[23]=t.z,s.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}},el=class extends ha{constructor(e,t=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new qt;r.setIndex(new nn(n,1)),r.setAttribute("position",new rt(s,3)),super(r,new xr({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){let t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}},tl=class extends wi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170")});function $y(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Wy(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function jy(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Ap),this.state=_t.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function qy(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Xn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=_t.DOLLY;break;case Xn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=_t.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=_t.ROTATE}break;case Xn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=_t.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=_t.PAN}break;default:this.state=_t.NONE}this.state!==_t.NONE&&this.dispatchEvent(zd)}function Xy(i){switch(this.state){case _t.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case _t.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case _t.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Yy(i){this.enabled===!1||this.enableZoom===!1||this.state!==_t.NONE||(i.preventDefault(),this.dispatchEvent(zd),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Ap))}function Zy(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function Jy(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ci.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=_t.TOUCH_ROTATE;break;case ci.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=_t.TOUCH_PAN;break;default:this.state=_t.NONE}break;case 2:switch(this.touches.TWO){case ci.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=_t.TOUCH_DOLLY_PAN;break;case ci.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=_t.TOUCH_DOLLY_ROTATE;break;default:this.state=_t.NONE}break;default:this.state=_t.NONE}this.state!==_t.NONE&&this.dispatchEvent(zd)}function Ky(i){switch(this._trackPointer(i),this.state){case _t.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case _t.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case _t.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case _t.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=_t.NONE}}function Qy(i){this.enabled!==!1&&i.preventDefault()}function e_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function t_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Ep,zd,Ap,ol,wp,Gy,Jt,xn,_t,Fd,Cr,Hd=vt(()=>{Tr();Ep={type:"change"},zd={type:"start"},Ap={type:"end"},ol=new gs,wp=new wn,Gy=Math.cos(70*up.DEG2RAD),Jt=new E,xn=2*Math.PI,_t={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Fd=1e-6,Cr=class extends tl{constructor(e,t=null){super(e,t),this.state=_t.NONE,this.enabled=!0,this.target=new E,this.cursor=new E,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Xn.ROTATE,MIDDLE:Xn.DOLLY,RIGHT:Xn.PAN},this.touches={ONE:ci.ROTATE,TWO:ci.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new E,this._lastQuaternion=new pn,this._lastTargetPosition=new E,this._quat=new pn().setFromUnitVectors(e.up,new E(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new xa,this._sphericalDelta=new xa,this._scale=1,this._panOffset=new E,this._rotateStart=new K,this._rotateEnd=new K,this._rotateDelta=new K,this._panStart=new K,this._panEnd=new K,this._panDelta=new K,this._dollyStart=new K,this._dollyEnd=new K,this._dollyDelta=new K,this._dollyDirection=new E,this._mouse=new K,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Wy.bind(this),this._onPointerDown=$y.bind(this),this._onPointerUp=jy.bind(this),this._onContextMenu=Qy.bind(this),this._onMouseWheel=Yy.bind(this),this._onKeyDown=Zy.bind(this),this._onTouchStart=Jy.bind(this),this._onTouchMove=Ky.bind(this),this._onMouseDown=qy.bind(this),this._onMouseMove=Xy.bind(this),this._interceptControlDown=e_.bind(this),this._interceptControlUp=t_.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ep),this.update(),this.state=_t.NONE}update(e=null){let t=this.object.position;Jt.copy(t).sub(this.target),Jt.applyQuaternion(this._quat),this._spherical.setFromVector3(Jt),this.autoRotate&&this.state===_t.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=xn:n>Math.PI&&(n-=xn),s<-Math.PI?s+=xn:s>Math.PI&&(s-=xn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Jt.setFromSpherical(this._spherical),Jt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Jt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=Jt.length();a=this._clampDistance(o*this._scale);let l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let o=new E(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new E(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Jt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(ol.origin.copy(this.object.position),ol.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ol.direction))<Gy?this.object.lookAt(this.target):(wp.setFromNormalAndCoplanarPoint(this.object.up,this.target),ol.intersectPlane(wp,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Fd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Fd||this._lastTargetPosition.distanceToSquared(this.target)>Fd?(this.dispatchEvent(Ep),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?xn/60*this.autoRotateSpeed*e:xn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Jt.setFromMatrixColumn(t,0),Jt.multiplyScalar(-e),this._panOffset.add(Jt)}_panUp(e,t){this.screenSpacePanning===!0?Jt.setFromMatrixColumn(t,1):(Jt.setFromMatrixColumn(t,0),Jt.crossVectors(this.object.up,Jt)),Jt.multiplyScalar(e),this._panOffset.add(Jt)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Jt.copy(s).sub(this.target);let r=Jt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(xn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-xn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(xn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-xn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new K,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}});function Ts(i){let e=/^(tp|tn|bp|bn|[a-j])(\d{1,2})$/.exec(i);if(!e)return null;let t=e[1],n=+e[2];return n<1||n>30||ll.includes(t)&&!cl(n)?null:{row:t,col:n}}function Yn(i){let e=Ts(i);return e?{x:Ir(e.col),z:Rr[e.row]}:null}function Ri(i){let e=Ts(i);return e?ll.includes(e.row)?e.row:e.col+("abcde".includes(e.row)?"T":"B"):null}function Cs(i,e,t=.5){let n=Math.round(i+15.5);if(n<1||n>30||Math.abs(Ir(n)-i)>t)return null;for(let[s,r]of i_)if(Math.abs(r-e)<=t){let a=s+n;return n_(a)?a:null}return null}function Tp(i){let e=[];if(ll.includes(i)){for(let s=1;s<=30;s++)cl(s)&&e.push(i+s);return e}let t=parseInt(i),n=i.endsWith("T")?"abcde":"fghij";for(let s of n)e.push(s+t);return e}function Yi(i){let e=Ts(i);if(!e)return i;let t={tp:"carril + de arriba",tn:"carril \u2212 de arriba",bp:"carril + de abajo",bn:"carril \u2212 de abajo"}[e.row];return t?`${t} (col. ${e.col})`:`${e.row}${e.col}`}function Cp(i){return ll.includes(i)?{tp:"carril + de arriba",tn:"carril \u2212 de arriba",bp:"carril + de abajo",bn:"carril \u2212 de abajo"}[i]:`columna ${parseInt(i)} (${i.endsWith("T")?"a\u2013e":"f\u2013j"})`}function Rs(i,e,t){t=(t%4+4)%4;for(let n=0;n<t;n++)[i,e]=[-e,i];return[i,e]}var Rr,ll,Pr,Xi,Ir,cl,n_,i_,Sa=vt(()=>{Rr={tp:-8.5,tn:-7.5,a:-5.5,b:-4.5,c:-3.5,d:-2.5,e:-1.5,f:1.5,g:2.5,h:3.5,i:4.5,j:5.5,bp:7.5,bn:8.5},ll=["tp","tn","bp","bn"],Pr=33,Xi=20,Ir=i=>i-15.5,cl=i=>i>=1&&i<=30&&i%6!==0;n_=i=>!!Ts(i);i_=Object.entries(Rr)});function $d(i,e=3){if(!isFinite(i))return"\u2014";let t=Math.abs(i),n;return t>=100?n=i.toFixed(0):t>=10?n=i.toFixed(Math.min(1,e)):n=i.toFixed(Math.min(2,e)),n.replace(".",",").replace(/^-0(,0+)?$/,"0$1")}function Ea(i,e){let t=Math.abs(i);if(t===0||!isFinite(i))return(isFinite(i)?"0 ":"\u2014 ")+e;let n=[[1e6,"M"],[1e3,"k"],[1,""],[.001,"m"],[1e-6,"\xB5"]];for(let[s,r]of n)if(t>=s*.9995)return $d(i/s)+" "+r+e;return $d(i/1e-6)+" \xB5"+e}function ul(i){let e=Math.floor(Math.log10(i))-1,t=Math.round(i/Math.pow(10,e));t>=100&&(t=Math.round(t/10),e++);let n=Math.floor(t/10),s=t%10,r=e,a=r===-1?"oro":r===-2?"plata":kd[r],o=r===-1?"#c9a23a":r===-2?"#c0c0c0":Gd[r];return{names:[kd[n],kd[s],a,"oro"],hex:[Gd[n],Gd[s],o,"#c9a23a"],value:t*Math.pow(10,e)}}function Dr(i){return{switch:{closed:!1},button:{pressed:!1},spdt:{pos:0},pot:{pos:.5},ldr:{light:.5}}[i]||{}}var kd,Gd,Wd,Lr,Ma,dl,Ps,s_,ce,Rp,Is=vt(()=>{kd=["negro","marr\xF3n","rojo","naranja","amarillo","verde","azul","violeta","gris","blanco"],Gd=["#1b1b1b","#7a4520","#d22424","#f07a10","#f4cf1a","#1f9d3a","#1f5fd6","#8a3ab9","#8d9399","#f4f4f4"],Wd=[10,22,33,47,68,100,150,220,330,470,560,680,1e3,1500,2200,3300,4700,6800,1e4,22e3,47e3,1e5,22e4,47e4,1e6],Lr={rojo:{vf:1.8,hex:"#ff2a2a",glow:16724e3},amarillo:{vf:2,hex:"#ffd21a",glow:16760832},verde:{vf:2.1,hex:"#2bd94f",glow:3211104},azul:{vf:3,hex:"#2f7bff",glow:3174655},blanco:{vf:3,hex:"#f2f6ff",glow:15266047}},Ma=[["negro","#1e1e1e"],["marr\xF3n","#7a4a24"],["rojo","#d62020"],["naranja","#f07a10"],["amarillo","#f2c200"],["verde","#1f9d3a"],["azul","#1f5fd6"],["morado","#8a3ab9"],["gris","#8a8f96"],["blanco","#eeeeee"]],dl=Object.fromEntries(Ma);Ps=i=>Ea(i,"\u03A9");s_=i=>Math.pow(10,6-3.3*Math.max(0,Math.min(1,i))),ce={resistor:{name:"Resistencia",cat:"B\xE1sicos",board:!0,pins:[["1",0,0],["2",4,0]],perms:[["1","2"],["2","1"]],props:{r:220},desc:"Limita la corriente. Se elige con el c\xF3digo de colores.",ui:[{k:"r",label:"Resistencia",type:"res"}],sig:i=>"resistor:"+i.props.r,label:i=>"Resistencia "+Ps(i.props.r),els:(i,e)=>[{k:"R",id:i.id,a:e("1"),b:e("2"),r:i.props.r}]},led:{name:"LED",cat:"B\xE1sicos",board:!0,pins:[["a",0,0],["k",1,0]],perms:[["a","k"]],props:{color:"rojo"},desc:"Diodo que emite luz. Tiene polaridad: pata larga (\xE1nodo, +) y pata corta (c\xE1todo, \u2212). Necesita resistencia.",ui:[{k:"color",label:"Color",type:"select",options:Object.keys(Lr)}],sig:i=>"led:"+i.props.color,label:i=>"LED "+i.props.color,pinNames:{a:"\xE1nodo (+, pata larga)",k:"c\xE1todo (\u2212, pata corta)"},els:(i,e,t)=>t.burnt?[]:[{k:"D",id:i.id,a:e("a"),b:e("k"),vf:Lr[i.props.color].vf,ron:15}]},diode:{name:"Diodo 1N4007",cat:"B\xE1sicos",board:!0,pins:[["a",0,0],["k",4,0]],perms:[["a","k"]],props:{},desc:"Deja pasar la corriente en un solo sentido (de \xE1nodo a c\xE1todo; la franja gris es el c\xE1todo).",sig:()=>"diode",label:()=>"Diodo 1N4007",pinNames:{a:"\xE1nodo",k:"c\xE1todo (franja)"},els:(i,e,t)=>t.burnt?[]:[{k:"D",id:i.id,a:e("a"),b:e("k"),vf:.7,ron:.3}]},bulb:{name:"Bombilla 6 V",cat:"B\xE1sicos",board:!0,pins:[["1",0,0],["2",2,0]],perms:[["1","2"],["2","1"]],props:{},desc:"Bombilla de incandescencia de 6 V / 0,1 A (0,6 W) con portal\xE1mparas.",sig:()=>"bulb",label:()=>"Bombilla 6 V",vnom:6,pnom:.6,els:(i,e,t)=>t.burnt?[]:[{k:"R",id:i.id,a:e("1"),b:e("2"),r:60}]},button:{name:"Pulsador",cat:"Control",board:!0,pins:[["1",0,0],["2",2,0]],perms:[["1","2"],["2","1"]],props:{},desc:"Conecta sus dos patas solo mientras lo mantienes pulsado (NA, normalmente abierto).",sig:()=>"button",label:()=>"Pulsador",interactive:"press",merges:i=>i.state?.pressed?[["1","2"]]:[],els:()=>[]},switch:{name:"Interruptor",cat:"Control",board:!0,pins:[["1",0,0],["2",2,0]],perms:[["1","2"],["2","1"]],props:{},desc:"Abre o cierra el circuito. Haz clic sobre \xE9l (con la simulaci\xF3n en marcha) para cambiar de posici\xF3n.",sig:()=>"switch",label:i=>"Interruptor ("+(i.state?.closed?"cerrado":"abierto")+")",interactive:"toggle",merges:i=>i.state?.closed?[["1","2"]]:[],els:()=>[]},spdt:{name:"Conmutador",cat:"Control",board:!0,pins:[["1",0,0],["c",1,0],["2",2,0]],perms:[["1","c","2"],["2","c","1"]],props:{},desc:"La pata central (com\xFAn) se conecta con la izquierda o con la derecha. Sirve para encender una luz desde dos puntos.",sig:()=>"spdt",label:i=>"Conmutador (posici\xF3n "+(i.state?.pos?"2":"1")+")",interactive:"toggle",pinNames:{1:"extremo 1",c:"com\xFAn (centro)",2:"extremo 2"},merges:i=>i.state?.pos?[["c","2"]]:[["c","1"]],els:()=>[]},pot:{name:"Potenci\xF3metro",cat:"Control",board:!0,pins:[["1",0,0],["w",1,0],["2",2,0]],perms:[["1","w","2"],["2","w","1"]],props:{r:1e4},desc:"Resistencia variable de 3 patas. La central (cursor) se mueve al girar el mando.",ui:[{k:"r",label:"Valor total",type:"select",options:[1e3,4700,1e4,47e3,1e5],fmt:Ps},{k:"pos",label:"Posici\xF3n del mando",type:"range",state:!0,live:!0}],sig:i=>"pot:"+i.props.r,label:i=>"Potenci\xF3metro "+Ps(i.props.r),interactive:"knob",pinNames:{1:"extremo 1",w:"cursor (centro)",2:"extremo 2"},els:(i,e)=>{let t=i.state?.pos??.5,n=i.props.r;return[{k:"R",id:i.id+":1w",a:e("1"),b:e("w"),r:Math.max(1,n*t)},{k:"R",id:i.id+":w2",a:e("w"),b:e("2"),r:Math.max(1,n*(1-t))}]}},ldr:{name:"LDR",cat:"Sensores",board:!0,pins:[["1",0,0],["2",1,0]],perms:[["1","2"],["2","1"]],props:{},desc:"Resistencia que depende de la luz: con mucha luz baja (\u2248500 \u03A9) y a oscuras sube (\u22481 M\u03A9).",ui:[{k:"light",label:"Luz que recibe",type:"range",state:!0,live:!0}],sig:()=>"ldr",label:()=>"LDR",interactive:"light",els:(i,e)=>[{k:"R",id:i.id,a:e("1"),b:e("2"),r:s_(i.state?.light??.5)}]},buzzer:{name:"Zumbador",cat:"Salidas",board:!0,pins:[["p",0,0],["n",2,0]],perms:[["p","n"]],props:{},desc:"Zumbador activo: suena al recibir tensi\xF3n continua. Tiene polaridad (+ marcado en la carcasa).",sig:()=>"buzzer",label:()=>"Zumbador",pinNames:{p:"+ (pata larga)",n:"\u2212"},els:(i,e)=>[{k:"D",id:i.id,a:e("p"),b:e("n"),vf:1.5,ron:200}]},cap:{name:"Condensador",cat:"B\xE1sicos",board:!0,pins:[["p",0,0],["n",1,0]],perms:[["p","n"]],props:{c:470},desc:"Almacena carga. Electrol\xEDtico: la franja indica la pata negativa. En el simulador se carga y descarga de forma simplificada.",ui:[{k:"c",label:"Capacidad",type:"select",options:[100,470,1e3,2200],fmt:i=>i+" \xB5F"}],sig:i=>"cap:"+i.props.c,label:i=>"Condensador "+i.props.c+" \xB5F",pinNames:{p:"+",n:"\u2212 (franja)"},els:(i,e)=>[{k:"C",id:i.id,a:e("p"),b:e("n"),c:i.props.c*1e-6},{k:"R",id:i.id+":leak",a:e("p"),b:e("n"),r:5e6}]},bat9:{name:"Pila 9 V",cat:"Alimentaci\xF3n",board:!1,size:[10.6,7],pins:[["+",-2.4,0,19.6],["-",2.4,0,19.6]],perms:[["+","-"]],props:{},desc:"Pila de 9 V (resistencia interna \u22481,5 \u03A9). El borne peque\xF1o redondo es el +.",sig:()=>"bat9",label:()=>"Pila 9 V",source:!0,pinNames:{"+":"borne +","-":"borne \u2212"},els:(i,e)=>[{k:"V",id:i.id,a:e("+"),b:e("-"),v:9,rint:1.5}]},aa2:{name:"Portapilas 2\xD7AA (3 V)",cat:"Alimentaci\xF3n",board:!1,size:[13,22],pins:[["+",-2.2,-9.2,6.6],["-",2.2,-9.2,6.6]],perms:[["+","-"]],props:{},desc:"Dos pilas AA de 1,5 V en serie: 3 V.",sig:()=>"aa2",label:()=>"Portapilas 2\xD7AA",source:!0,pinNames:{"+":"cable rojo (+)","-":"cable negro (\u2212)"},els:(i,e)=>[{k:"V",id:i.id,a:e("+"),b:e("-"),v:3,rint:.3}]},aa4:{name:"Portapilas 4\xD7AA (6 V)",cat:"Alimentaci\xF3n",board:!1,size:[25,22],pins:[["+",-2.2,-9.2,6.6],["-",2.2,-9.2,6.6]],perms:[["+","-"]],props:{},desc:"Cuatro pilas AA de 1,5 V en serie: 6 V.",sig:()=>"aa4",label:()=>"Portapilas 4\xD7AA",source:!0,pinNames:{"+":"cable rojo (+)","-":"cable negro (\u2212)"},els:(i,e)=>[{k:"V",id:i.id,a:e("+"),b:e("-"),v:6,rint:.6}]},supply:{name:"Fuente de alimentaci\xF3n",cat:"Alimentaci\xF3n",board:!1,size:[20,14],pins:[["+",3.5,5,8.8],["-",7,5,8.8]],perms:[["+","-"]],props:{v:5},desc:"Fuente de laboratorio regulable de 0 a 12 V.",ui:[{k:"v",label:"Tensi\xF3n (V)",type:"number",min:0,max:12,step:.5,live:!0}],sig:()=>"supply",label:i=>"Fuente "+$d(i.props.v)+" V",source:!0,pinNames:{"+":"borne + (rojo)","-":"borne \u2212 (negro)"},els:(i,e)=>[{k:"V",id:i.id,a:e("+"),b:e("-"),v:+i.props.v||0,rint:.05}]},motor:{name:"Motor DC",cat:"Salidas",board:!1,size:[16,9],pins:[["1",-5.6,-1.6,6.3],["2",-5.6,1.6,6.3]],perms:[["1","2"],["2","1"]],props:{},desc:"Motor de corriente continua (3\u20136 V). Si inviertes los cables, gira al rev\xE9s.",sig:()=>"motor",label:()=>"Motor DC",els:(i,e)=>[{k:"R",id:i.id,a:e("1"),b:e("2"),r:15}]},meter:{name:"Pol\xEDmetro",cat:"Medida",board:!1,size:[14,24],pins:[["com",-3,9.4,2.6],["red",3,9.4,2.6]],perms:[["com","red"]],props:{mode:"V"},desc:"Mide tensi\xF3n (V, en paralelo), corriente (A, en serie) y resistencia (\u03A9, sin alimentaci\xF3n). Arrastra las puntas roja y negra.",ui:[{k:"mode",label:"Funci\xF3n",type:"seg",options:["V","A","\u03A9"],live:!0}],sig:()=>"meter",label:()=>"Pol\xEDmetro",meter:!0,els:(i,e,t)=>t.fuse?[]:i.props.mode==="V"?[{k:"R",id:i.id,a:e("red"),b:e("com"),r:1e7}]:i.props.mode==="A"?[{k:"R",id:i.id,a:e("red"),b:e("com"),r:.05}]:[]}},Rp=["Alimentaci\xF3n","B\xE1sicos","Control","Sensores","Salidas","Medida"]});function Ie(i,e={}){let t=i+JSON.stringify(e);return Ip[t]||(Ip[t]=new lt({color:i,roughness:.55,metalness:.05,...e}))}function Lt(i,e,t=0,n=0,s=0,r){let a=new Oe(i,e);return a.position.set(t,n,s),a.castShadow=!0,a.receiveShadow=!0,r&&r.add(a),a}function Lp(i,e,t,n,s,r,a,o,l){let c=new qi,d=i/2-n,u=t/2-n;c.moveTo(-d,-t/2),c.lineTo(d,-t/2),c.quadraticCurveTo(i/2,-t/2,i/2,-u),c.lineTo(i/2,u),c.quadraticCurveTo(i/2,t/2,d,t/2),c.lineTo(-d,t/2),c.quadraticCurveTo(-i/2,t/2,-i/2,u),c.lineTo(-i/2,-u),c.quadraticCurveTo(-i/2,-t/2,-d,-t/2);let h=new Ms(c,{depth:e,bevelEnabled:!1,curveSegments:4});return h.rotateX(-Math.PI/2),h.rotateY(0),Lt(h,s,r,a,o,l)}function wa(i,e,t,n,s,r,a,o=.11){let l=new E(e,t,n),c=new E(s,r,a),d=c.clone().sub(l),u=d.length(),h=Lt(new Ct(o,o,u,8),Jn(),0,0,0,i);return h.position.copy(l).add(c).multiplyScalar(.5),h.quaternion.setFromUnitVectors(new E(0,1,0),d.normalize()),h.castShadow=!1,h}function Zn(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e,t(n.getContext("2d"),i,e);let s=new yr(n);return s.colorSpace=kt,s.anisotropy=4,s.userData={canvas:n,draw:t},s}function r_(){return Dp||(Dp=Zn(128,128,(i,e)=>{let t=i.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.25,"rgba(255,255,255,.55)"),t.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=t,i.fillRect(0,0,e,e)}))}function Op(i,e,t,n,s,r){let a=new xs(new ji({map:r_(),color:i,blending:Ao,depthWrite:!1,transparent:!0,opacity:0}));return a.position.set(t,n,s),a.scale.set(e,e,1),a.userData.base=e,a.renderOrder=5,a.raycast=()=>{},r.add(a),a}function Bp(){let i=new Ue;i.name="breadboard";let e=48,t=Pr,n=Xi,s=Zn(t*e,n*e,(l,c,d)=>{let u=g=>(g+t/2)*e,h=g=>(g+n/2)*e;l.fillStyle="#f5f3ee",l.fillRect(0,0,c,d),l.fillStyle="#e4e1d9",l.fillRect(0,h(-.55),c,1.1*e),l.fillStyle="#d6d2c8",l.fillRect(0,h(-.12),c,.24*e);let p=(g,f)=>{l.fillStyle=f,l.fillRect(u(-15.2),h(g)-2,30.4*e,4)};p(-9.25,"#d42a2a"),p(-6.75,"#2a56d4"),p(6.75,"#d42a2a"),p(9.25,"#2a56d4"),l.font=`700 ${e*.62}px system-ui, Arial`,l.textAlign="center",l.textBaseline="middle";let m=(g,f,A)=>{l.fillStyle=A,l.fillText(g,u(-15.95),h(f)),l.fillText(g,u(15.95),h(f))};m("+",-8.5,"#d42a2a"),m("\u2212",-7.5,"#2a56d4"),m("+",7.5,"#d42a2a"),m("\u2212",8.5,"#2a56d4"),l.font=`600 ${e*.48}px system-ui, Arial`,l.fillStyle="#8a8478";for(let g of"abcdefghij")l.fillText(g,u(-15.95),h(Rr[g])),l.fillText(g,u(15.95),h(Rr[g]));l.font=`600 ${e*.42}px system-ui, Arial`;for(let g=1;g<=30;g++)(g===1||g%5===0)&&(l.fillText(String(g),u(Ir(g)),h(-6.55)),l.fillText(String(g),u(Ir(g)),h(6.55)));let b=(g,f)=>{let A=.44*e;l.fillStyle="#3b3a37",l.fillRect(u(g)-A/2,h(f)-A/2,A,A),l.fillStyle="#5a5852",l.fillRect(u(g)-A/2,h(f)-A/2,A,A*.25)};for(let[g,f]of Object.entries(Rr))for(let A=1;A<=30;A++)g.length===2&&!cl(A)||b(Ir(A),f)}),r=Ie(15657956,{roughness:.7}),a=new lt({map:s,roughness:.75}),o=new Oe(new Xt(t,3.4,n),[r,r,a,r,r,r]);return o.position.y=3.4/2,o.receiveShadow=!0,o.castShadow=!0,i.add(o),i}function Np(i,e){let t=e===2?13:25;Bt(t,3.2,22,Ie(2040100,{roughness:.6}),0,0,0,i);for(let n=0;n<e;n++){let s=-t/2+.6+2.95+n*5.95,r=Lt(new Ct(2.85,2.85,17.5,24),Ie((n%2,3116878),{roughness:.35}),s,3.1,.6,i);r.rotation.x=Math.PI/2;let a=Lt(new Ct(1,1,.8,14),Jn(),s,3.1,n%2?9.7:-8.5,i);a.rotation.x=Math.PI/2;let o=Lt(new Ct(2.87,2.87,4,24),Ie(1710618),s,3.1,n%2?-6:7,i);o.rotation.x=Math.PI/2}Bt(8,5.6,2.6,Ie(2763824),0,0,-9.6,i),Rt(.85,.9,Ie(13904426),-2.2,5.7,-9.2,i,16),Rt(.85,.9,Ie(1842204),2.2,5.7,-9.2,i,16)}function Up(i,e,t){i.fillStyle="#0b1a12",i.fillRect(0,0,256,96),i.fillStyle="#5dff9a",i.font="700 58px ui-monospace, Consolas, monospace",i.textAlign="right",i.fillText((+e).toFixed(1).replace(".",",")+" V",240,70)}function Vp(i,e,t){i.fillStyle="#9fb59a",i.fillRect(0,0,256,110),i.fillStyle="#b6ccb0",i.fillRect(6,6,244,98),i.fillStyle="#1b2418",i.textAlign="right",i.font="700 52px ui-monospace, Consolas, monospace",i.fillText(e||(t?"----":""),244,72),i.font="700 20px system-ui",i.textAlign="left",i.fillText(t?t==="\u03A9"?"\u03A9":t==="V"?"V \u2393":"A \u2393":"OFF",12,28)}function Aa(i){let e=new Ue,t=new Ue;return e.add(t),(a_[i.type]||(()=>Bt(2,2,2,Ie(16711935),0,3.4,0,t)))(t,i),e.userData.update=t.userData.update,e.userData.glowY=t.userData.glowY,e.userData.inner=t,e.userData.drawV=t.userData.drawV,e}function Fp(i,e){let t=ce[i.type];if(t.board)return[];let n=[];for(let[s,r,a,o]of t.pins){if(t.meter)continue;let l=new Oe(new li(1,10,8),new tn({color:1352616,transparent:!0,opacity:0,depthWrite:!1}));l.position.set(r,o+.2,a),l.userData.term=`p:${i.id}:${s}`,e.userData.inner.add(l),n.push(l)}return n}function o_(i,e){let t=i.distanceTo(e),n=Math.min(5,.9+t*.12),s=Math.max(i.y,e.y)+n,r=[i.clone(),i.clone().setY(i.y+.7),new E((i.x+e.x)/2,s,(i.z+e.z)/2),e.clone().setY(e.y+.7),e.clone()];return new Ti(r,!1,"centripetal")}function Ta(i,e,t,n={}){let s=new Ue,r=n.mat||Ie(new Be(t).getHex(),{roughness:.45}),a=new Oe(new jn(o_(i.clone().setY(i.y+.5),e.clone().setY(e.y+.5)),40,n.r||.3,8,!1),r);if(a.castShadow=!n.mat,s.add(a),!n.mat)for(let o of[i,e])Rt(.34,.9,r,o.x,o.y+.15,o.z,s,10),Rt(.12,.8,Jn(),o.x,o.y-.6,o.z,s,6);return s}function zp(i){let e=new Ue;Rt(.06,1.3,Jn(),0,-.3,0,e,6),Rt(.42,.5,Ie(i),0,1,0,e,12),Rt(.32,3.6,Ie(i,{roughness:.4}),0,1,0,e,12),Rt(.4,.6,Ie(1842204),0,4.6,0,e,12);let t=new Oe(new Ct(1,1,6,8),new tn({transparent:!0,opacity:0,depthWrite:!1}));return t.position.y=2.5,e.add(t),e}var Ip,Jn,Bt,Rt,Dp,$t,a_,Ca,Hp=vt(()=>{Tr();Sa();Is();Ip={};Jn=()=>Ie(12896462,{metalness:.9,roughness:.28});Bt=(i,e,t,n,s,r,a,o)=>Lt(new Xt(i,e,t),n,s,r+e/2,a,o),Rt=(i,e,t,n,s,r,a,o=20,l)=>Lt(new Ct(i,l??i,e,o),t,n,s+e/2,r,a);$t=(i,e,t,n)=>wa(i,e,3.4-.4,t,e,3.4+n,t),a_={resistor(i,e){let t=3.4+1.15;$t(i,0,0,1.15),$t(i,4,0,1.15),wa(i,0,t,0,4,t,0);let n=Ie(15126430,{roughness:.6}),s=Lt(new Xo(.5,1.7,4,14),n,2,t,0,i);s.rotation.z=Math.PI/2;let r=ul(e.props.r);[1.35,1.75,2.15,2.75].forEach((a,o)=>{let l=Lt(new Ct(.52,.52,.2,16),Ie(new Be(r.hex[o]).getHex(),{roughness:.5}),a,t,0,i);l.rotation.z=Math.PI/2})},led(i,e){let t=Lr[e.props.color];$t(i,0,0,1.7),$t(i,1,0,1.7);let n=new lt({color:t.hex,transparent:!0,opacity:.88,roughness:.15,emissive:new Be(t.hex),emissiveIntensity:0}),s=3.4+1.7,r=Rt(1.2,.3,n,.5,s,0,i,24),a=Rt(1,1.9,n,.5,s+.3,0,i,24),o=Lt(new li(1,24,12,0,Math.PI*2,0,Math.PI/2),n,.5,s+2.2,0,i);Bt(.06,.32,1.2,Ie(3355443),1.66,s,0,i);let l=Op(t.glow,9,.5,s+2.2,0,i);i.userData.update=(c,d)=>{let u=d.burnt,h=u?0:Math.min(1.3,c.bright||0);n.emissiveIntensity=h*2.2,l.material.opacity=Math.min(1,h*.9),l.scale.setScalar(l.userData.base*(.6+h*.6)),n.color.set(u?3811874:t.hex),n.opacity=u?1:.88},i.userData.glowY=s+2.2},diode(i){let e=3.4+.9;$t(i,0,0,.9),$t(i,4,0,.9),wa(i,0,e,0,4,e,0);let t=Lt(new Ct(.55,.55,2.1,16),Ie(1907997,{roughness:.35}),2,e,0,i);t.rotation.z=Math.PI/2;let n=Lt(new Ct(.57,.57,.3,16),Ie(13158600),2.75,e,0,i);n.rotation.z=Math.PI/2},bulb(i){$t(i,0,0,.6),$t(i,2,0,.6),Rt(1.3,1,Ie(3108175),1,3.4+.4,0,i,24),Rt(.85,.9,Jn(),1,3.4+1.4,0,i,18);let e=new lt({color:16777215,transparent:!0,opacity:.32,roughness:.05,emissive:new Be(16765562),emissiveIntensity:0,depthWrite:!1}),t=3.4+3.4,n=Lt(new li(1.4,24,16),e,1,t,0,i);n.castShadow=!1;let s=new lt({color:8413248,emissive:new Be(16752704),emissiveIntensity:0}),r=Lt(new va(.45,.06,6,16,Math.PI),s,1,t-.2,0,i);r.castShadow=!1,wa(i,.55,3.4+2.3,0,.55,t-.2,0,.04),wa(i,1.45,3.4+2.3,0,1.45,t-.2,0,.04);let a=Op(16762976,14,1,t,0,i);i.userData.update=(o,l)=>{let c=l.burnt?0:Math.min(1.5,o.bright||0);s.emissiveIntensity=c*4,e.emissiveIntensity=c*.8,a.material.opacity=Math.min(1,c*.85),a.scale.setScalar(a.userData.base*(.5+.6*Math.min(1,c))),r.visible=!l.burnt,e.color.set(l.burnt?7829367:16777215)},i.userData.glowY=t},button(i,e){$t(i,0,0,.3),$t(i,2,0,.3),Bt(2.5,1.3,2.5,Ie(2369066),1,3.4+.2,0,i);let t=Rt(.75,.9,Ie(14168618),1,3.4+1.5,0,i,20);i.userData.update=()=>{t.position.y=3.4+1.5+.45-(e.state?.pressed?.45:0)},i.userData.update({},{})},switch(i,e){$t(i,0,0,.3),$t(i,2,0,.3),Bt(3.2,1.5,1.6,Ie(2843320),1,3.4+.2,0,i),Bt(2.6,.06,.9,Ie(1456752),1,3.4+1.7,0,i);let t=Bt(.7,.9,.7,Ie(15921906),.5,3.4+1.7,0,i),n=new xs(new ji({map:Zn(128,48,s=>{s.fillStyle="#163a70",s.font="700 30px system-ui",s.textAlign="center",s.fillText("OFF   ON",64,34)}),transparent:!0,depthWrite:!1}));n.scale.set(3,1.1,1),n.position.set(1,3.4+3,0),i.add(n),i.userData.update=()=>{t.position.x=e.state?.closed?1.55:.45},i.userData.update({},{})},spdt(i,e){[0,1,2].forEach(n=>$t(i,n,0,.3)),Bt(3.4,1.5,1.5,Ie(2764083),1,3.4+.2,0,i),Bt(2,.06,.8,Ie(1118481),1,3.4+1.7,0,i);let t=Bt(.7,.9,.7,Ie(15906354),.55,3.4+1.7,0,i);i.userData.update=()=>{t.position.x=e.state?.pos?1.45:.55},i.userData.update({},{})},pot(i,e){[0,1,2].forEach(n=>$t(i,n,0,.3)),Bt(2.8,1.2,2.8,Ie(2053800),1,3.4+.2,-.3,i);let t=new Ue;t.position.set(1,3.4+1.4,-.3),i.add(t),Rt(1.05,1.8,Ie(2961203,{roughness:.4}),0,0,0,t,24),Bt(.2,.05,.9,Ie(16777215),0,1.8,-.45,t),i.userData.update=()=>{t.rotation.y=((e.state?.pos??.5)-.5)*-4.7},i.userData.update({},{})},ldr(i){$t(i,0,0,2.2),$t(i,1,0,2.2);let e=Zn(128,128,r=>{r.fillStyle="#e8b04a",r.beginPath(),r.arc(64,64,62,0,7),r.fill(),r.strokeStyle="#a3321f",r.lineWidth=9,r.beginPath(),r.moveTo(22,30);for(let a=0;a<6;a++)r.lineTo(a%2?22:106,30+a*14),r.lineTo(a%2?22:106,44+a*14);r.stroke()}),t=[Ie(13208117),new lt({map:e,roughness:.4}),Ie(13208117)],n=new Oe(new Ct(1.05,1.05,.5,28),t);n.position.set(.5,3.4+2.45,0),n.castShadow=!0,i.add(n);let s=Lt(new Ct(1.1,1.1,.52,28),new lt({color:16777215,transparent:!0,opacity:.18,depthWrite:!1}),.5,3.4+2.45,0,i);s.castShadow=!1},buzzer(i,e){$t(i,0,0,.3),$t(i,2,0,.3);let t=Zn(128,128,a=>{a.fillStyle="#1b1b1d",a.fillRect(0,0,128,128),a.fillStyle="#000",a.beginPath(),a.arc(64,64,14,0,7),a.fill(),a.fillStyle="#f2f2f2",a.font="700 34px system-ui",a.textAlign="center",a.fillText("+",26,74)}),n=[Ie(1776413,{roughness:.35}),new lt({map:t,roughness:.4}),Ie(1776413)],s=new Oe(new Ct(1.9,1.9,3.2,32),n);s.position.set(1,3.4+.3+1.6,0),s.castShadow=!0,s.rotation.y=Math.PI,i.add(s);let r=[0,1].map(()=>{let a=Lt(new va(1,.06,6,32),new tn({color:1352616,transparent:!0,opacity:0}),1,3.4+3.7,0,i);return a.rotation.x=Math.PI/2,a.castShadow=!1,a});i.userData.update=(a,o,l)=>{r.forEach((c,d)=>{let u=(l*1.6+d*.5)%1;c.scale.setScalar(1.9+u*2.5),c.material.opacity=a.on?(1-u)*.8*Math.max(.4,a.vol):0})}},cap(i){$t(i,0,0,.4),$t(i,1,0,.4),Rt(.95,2.8,Ie(2182812,{roughness:.35}),.5,3.4+.4,0,i,24),Bt(.5,2.5,.1,Ie(12568534),1,3.4+.5,0,i).rotation.y=0,Rt(.9,.05,Jn(),.5,3.4+3.2,0,i,24)},bat9(i){Bt(10.6,15,7,Ie(1908514,{roughness:.4}),0,0,0,i);let e=Zn(256,360,n=>{n.fillStyle="#f2b632",n.fillRect(0,0,256,360),n.fillStyle="#1d1f22",n.font="800 120px system-ui",n.textAlign="center",n.fillText("9V",128,200),n.font="700 30px system-ui",n.fillText("PILA",128,70)}),t=Lt(new Ht(10.62,13),new lt({map:e}),0,8.5,3.51,i);t.castShadow=!1,Bt(10.6,4,7,Ie(13225169,{metalness:.8,roughness:.3}),0,15,0,i),Rt(.9,.6,Jn(),-2.4,19,0,i,20),Rt(1.15,.6,Jn(),2.4,19,0,i,6)},aa2(i){Np(i,2)},aa4(i){Np(i,4)},supply(i,e){Bt(20,8,14,Ie(4015954,{roughness:.5}),0,0,0,i);let t=Zn(256,96,a=>Up(a,e.props.v)),n=Lt(new Ht(9,3.4),new tn({map:t}),-4,5.2,7.01,i);Rt(1.3,.8,Ie(1842979),-4,0,7.4,i).rotation.x=Math.PI/2;let s=Rt(1.4,1.2,Ie(1842979),-4,2,7.3,i);s.rotation.x=Math.PI/2,s.position.set(-4,2.2,7.6),Rt(.75,.8,Ie(13904426),3.5,8,5,i,16),Rt(.75,.8,Ie(1842204),7,8,5,i,16);let r=Zn(256,64,a=>{a.fillStyle="#dfe6ec",a.font="700 30px system-ui",a.fillText("FUENTE 0\u201312 V",10,42)});Lt(new Ht(9,2.2),new tn({map:r,transparent:!0}),5.2,6.4,7.01,i),i.userData.refresh=()=>{t.userData.draw(t.userData.canvas.getContext("2d"),256,96),t.needsUpdate=!0},i.userData.drawV=a=>{Up(t.userData.canvas.getContext("2d"),e.props.v,a),t.needsUpdate=!0}},motor(i){let e=Lt(new Ct(3.9,3.9,10,32),Ie(12106946,{metalness:.8,roughness:.3}),0,3.9,0,i);e.rotation.z=Math.PI/2;let t=Lt(new Ct(3.6,3.6,.8,28),Ie(2039583),-5.3,3.9,0,i);t.rotation.z=Math.PI/2,Bt(.5,2.6,.9,Jn(),-5.6,3.9,-1.6,i),Bt(.5,2.6,.9,Jn(),-5.6,3.9,1.6,i),Bt(8,.6,7,Ie(3817285),0,0,0,i);let n=Lt(new Ct(.3,.3,2.4,10),Jn(),6.2,3.9,0,i);n.rotation.z=Math.PI/2;let s=new Ue;s.position.set(7.2,3.9,0),i.add(s),Bt(.4,7,1,Ie(15906354),0,-3.5,0,s),Bt(.4,1,7,Ie(15906354),0,-.5,0,s),Rt(.7,.6,Ie(13904426),0,0,0,s).rotation.z=Math.PI/2,i.userData.update=(r,a,o,l)=>{s.rotation.x+=(r.speed||0)*l*40}},meter(i,e){Lp(14,2.4,24,1.6,Ie(15906354,{roughness:.5}),0,0,0,i),Lp(12.4,.1,22.4,1.2,Ie(2830133,{roughness:.6}),0,2.4,0,i);let t=Zn(256,110,l=>Vp(l,"",""));Lt(new Ht(10,4.3),new tn({map:t}),0,2.56,-7.2,i).rotation.x=-Math.PI/2;let n=Zn(256,256,l=>{l.fillStyle="#f2f2f2",l.font="700 40px system-ui",l.textAlign="center",l.textBaseline="middle";let c=[["OFF",-150],["V",-60],["A",30],["\u03A9",120]];for(let[d,u]of c){let h=u*Math.PI/180;l.fillText(d,128+Math.cos(h)*100,128+Math.sin(h)*100)}});Lt(new Ht(10,10),new tn({map:n,transparent:!0}),0,2.53,1.5,i).rotation.x=-Math.PI/2;let s=new Ue;s.position.set(0,2.5,1.5),i.add(s),Rt(2.6,.8,Ie(1842464,{roughness:.4}),0,0,0,s,28),Bt(.5,.15,2.4,Ie(15921906),0,.8,-1.2,s),Rt(.75,.3,Ie(1118481),-3,2.4,9.4,i,16),Rt(.75,.3,Ie(13904426),3,2.4,9.4,i,16);let r=Zn(256,48,l=>{l.fillStyle="#f2f2f2",l.font="700 26px system-ui",l.textAlign="center",l.fillText("COM",72,34),l.fillText("V\u03A9A",184,34)});Lt(new Ht(10,1.9),new tn({map:r,transparent:!0}),0,2.53,7.4,i).rotation.x=-Math.PI/2;let a={V:-60,A:30,\u03A9:120},o="";i.userData.update=l=>{let c=a[e.props.mode]??-150;s.rotation.y=-(c+90)*Math.PI/180;let d=l.meter?l.meter.text:(l.off,""),u=e.props.mode+"|"+d;u!==o&&(o=u,Vp(t.userData.canvas.getContext("2d"),d,e.props.mode),t.needsUpdate=!0)},i.userData.update({},{})}};Ca=i=>dl[i]||"#1f9d3a"});function Tn(i){let e=ce[i.type];if(!e.board)return null;let t=Yn(i.at);if(!t)return null;let n={};for(let[s,r,a]of e.pins){let[o,l]=Rs(r,a,i.rot||0),c=Cs(t.x+o,t.z+l,.05);if(!c)return null;n[s]=c}return n}function Ls(i,e={}){let t=new jd,n=s=>{s.startsWith("h:")&&t.union(s,"s:"+Ri(s.slice(2))),t.find(s)};for(let s of i.parts){let r=ce[s.type];if(r.board){let a=Tn(s);if(a)for(let o in a)n("h:"+a[o]),t.union(Kt(s,o),"h:"+a[o])}for(let[a]of r.pins)t.find(Kt(s,a));if(!e.structural&&r.merges)for(let[a,o]of r.merges(s))t.union(Kt(s,a),Kt(s,o));if(r.meter&&!e.structural&&s.probes)for(let[a,o]of[["red",s.probes.red],["com",s.probes.com]])o&&(n(o),t.union(Kt(s,a),o))}for(let s of i.wires)n(s.a),n(s.b),t.union(s.a,s.b);return t}function Xd(i,e={},t={}){let n=Ls(i),s=new Map,r=0,a=c=>{let d=n.find(c);return s.has(d)||s.set(d,r++),s.get(d)},o=[],l=[];for(let c of i.parts){let d=ce[c.type];if(d.board&&!Tn(c))continue;let u=e[c.id]||{},h=d.els(c,p=>Kt(c,p),u,t);t.zeroSources&&(h=h.map(p=>p.k==="V"?{...p,v:0}:p)),t.skipMeters&&d.meter&&(h=[]);for(let p of h){let m={...p,a:a(p.a),b:a(p.b),part:c.id};m.k==="V"&&m.a===m.b&&(l.push(c.id),!t.zeroSources)||o.push(m)}}return{uf:n,els:o,shorts:l,alloc:a,get n(){return r},node:c=>{let d=n.find(c);return s.has(d)?s.get(d):-1}}}var jd,Kt,qd,Ra=vt(()=>{Is();Sa();jd=class{constructor(){this.p=new Map}find(e){this.p.has(e)||this.p.set(e,e);let t=e;for(;this.p.get(t)!==t;)t=this.p.get(t);let n=e;for(;this.p.get(n)!==t;){let s=this.p.get(n);this.p.set(n,t),n=s}return t}union(e,t){let n=this.find(e),s=this.find(t);n!==s&&this.p.set(n,s)}},Kt=(i,e)=>`p:${i.id}:${e}`,qd=i=>i.startsWith("h:")?"s:"+Ri(i.slice(2)):i});function l_(i,e,t){for(let s=0;s<t;s++){let r=s,a=Math.abs(i[s*t+s]);for(let l=s+1;l<t;l++){let c=Math.abs(i[l*t+s]);c>a&&(a=c,r=l)}if(a<1e-30)continue;if(r!==s){for(let c=0;c<t;c++){let d=i[s*t+c];i[s*t+c]=i[r*t+c],i[r*t+c]=d}let l=e[s];e[s]=e[r],e[r]=l}let o=i[s*t+s];for(let l=s+1;l<t;l++){let c=i[l*t+s]/o;if(c!==0){for(let d=s;d<t;d++)i[l*t+d]-=c*i[s*t+d];e[l]-=c*e[s]}}}let n=new Float64Array(t);for(let s=t-1;s>=0;s--){let r=e[s];for(let o=s+1;o<t;o++)r-=i[s*t+o]*n[o];let a=i[s*t+s];n[s]=Math.abs(a)<1e-30?0:r/a}return n}function c_(i,e,t,n,s){let r=new Float64Array(i*i),a=new Float64Array(i),o=(c,d,u)=>{r[c*i+c]+=u,r[d*i+d]+=u,r[c*i+d]-=u,r[d*i+c]-=u},l=(c,d,u)=>{a[c]+=u,a[d]-=u};for(let c=0;c<i;c++)r[c*i+c]+=1e-9;for(let c of e)if(c.a!==c.b)switch(c.k){case"R":o(c.a,c.b,1/c.r);break;case"V":o(c.a,c.b,1/c.rint),l(c.a,c.b,c.v/c.rint);break;case"I":l(c.a,c.b,c.i);break;case"D":t[c.id]?(o(c.a,c.b,1/c.ron),l(c.a,c.b,c.vf/c.ron)):o(c.a,c.b,1e-9);break;case"C":if(isFinite(n)){let d=c.c/n;o(c.a,c.b,d),l(c.a,c.b,d*(s[c.id]||0))}break}return l_(r,a,i)}function Yd(i,e,t={}){let n=t.dt??1/0,s=t.capV||{},r=t.don||{},a=e.filter(u=>u.k==="D"&&u.a!==u.b),o=new Float64Array(i),l=!1,c;if(i===0)return{V:o,I:{},don:r,converged:!0};for(c=0;c<60;c++){o=c_(i,e,r,n,s);let u=null,h=0,p=[];for(let m of a){let b=o[m.a]-o[m.b];if(r[m.id]){let g=(b-m.vf)/m.ron;g<-1e-9&&(p.push(m),-g*m.ron>h&&(h=-g*m.ron,u=m))}else b>m.vf+1e-9&&(p.push(m),b-m.vf>h&&(h=b-m.vf,u=m))}if(!p.length){l=!0;break}if(c<25)for(let m of p)r[m.id]=!r[m.id];else r[u.id]=!r[u.id]}let d={};for(let u of e){let h=u.a===u.b?0:o[u.a]-o[u.b];switch(u.k){case"R":d[u.id]=h/u.r;break;case"V":d[u.id]=u.a===u.b?1/0:(u.v-h)/u.rint;break;case"I":d[u.id]=u.i;break;case"D":d[u.id]=r[u.id]?(h-u.vf)/u.ron:h*1e-9;break;case"C":d[u.id]=isFinite(n)?u.c/n*(h-(s[u.id]||0)):0;break}}return{V:o,I:d,don:r,converged:l}}var kp=vt(()=>{});function hl(i,e={},t={}){let n=Xd(i,e);for(let d of i.parts)ce[d.type].meter&&(n.alloc(Kt(d,"red")),n.alloc(Kt(d,"com")));let s=Yd(n.n,n.els,{dt:t.dt??1/0,capV:t.capV||{},don:t.don||{}}),r=d=>{let u=n.node(d);return u<0?0:s.V[u]},a={},o=[],l=new Set(n.shorts),c={};for(let d of i.parts){let u=ce[d.type],h=g=>Kt(d,g),p=e[d.id]||{},m=a[d.id]={},b=u.pins.map(g=>g[0]);switch(b.length>=2&&(m.v=r(h(b[0]))-r(h(b[b.length-1]))),m.i=s.I[d.id]??0,d.type){case"resistor":m.p=m.v*m.i,Math.abs(m.p)>.25&&o.push({part:d.id,kind:"hot",msg:`La resistencia de ${d.props.r} \u03A9 disipa ${m.p.toFixed(2).replace(".",",")} W (m\xE1s de 0,25 W): en la realidad se quemar\xEDa.`});break;case"led":m.bright=p.burnt?0:Math.max(0,Math.min(1.4,m.i/.02)),m.on=m.i>4e-4,m.over=m.i>.03,m.burn=m.i>.04,m.vf=Lr[d.props.color].vf;break;case"diode":m.burn=m.i>1.5;break;case"bulb":m.p=m.v*m.i,m.bright=p.burnt?0:Math.max(0,m.p/u.pnom),m.burn=m.p>2.5*u.pnom;break;case"motor":m.speed=m.v/6;break;case"buzzer":m.on=m.i>.001,m.vol=Math.min(1,m.i/.03);break;case"cap":c[d.id]=m.v,m.v<-1&&o.push({part:d.id,kind:"cap",msg:"Condensador electrol\xEDtico conectado al rev\xE9s: en la realidad podr\xEDa reventar."});break;case"pot":m.v1w=r(h("1"))-r(h("w")),m.vw2=r(h("w"))-r(h("2")),m.i=s.I[d.id+":1w"]??0;break}if(u.source){let g=n.els.find(f=>f.part===d.id&&f.k==="V");m.v=r(h("+"))-r(h("-")),l.has(d.id)?(m.short=!0,m.i=1/0):g&&(m.i=s.I[d.id],m.i>Math.min(2,.5*g.v/g.rint)&&g.v>0&&(m.short=!0,l.add(d.id)))}u.meter&&(m.meter=d_(i,e,d,r,s,n))}for(let d of l)o.unshift({part:d,kind:"short",msg:"\xA1Cortocircuito! El + y el \u2212 de la alimentaci\xF3n est\xE1n unidos sin ning\xFAn receptor. Para la simulaci\xF3n y revisa los cables."});return{res:a,warnings:o,shorts:[...l],capV:c,don:s.don,converged:s.converged,V:r,net:n}}function d_(i,e,t,n,s,r){let a=e[t.id]||{},o=t.props.mode,l=!!(t.probes?.red&&t.probes?.com);if(a.fuse)return{mode:o,text:"FUSE",value:NaN,att:l};if(o==="V"){let b=l?n(Kt(t,"red"))-n(Kt(t,"com")):0;return{mode:o,value:b,unit:"V",text:Zd(b,"V"),att:l}}if(o==="A"){let b=l?s.I[t.id]??0:0;return{mode:o,value:b,unit:"A",text:Zd(b,"A"),att:l,over:Math.abs(b)>1}}if(!l)return{mode:o,value:1/0,unit:"\u03A9",text:"OL",att:l};let c=Math.abs(n(Kt(t,"red"))-n(Kt(t,"com")))>.05,d=Xd(i,e,{zeroSources:!0,skipMeters:!0}),u=d.alloc(Kt(t,"red")),h=d.alloc(Kt(t,"com")),p=Yd(d.n,[...d.els,{k:"I",id:"_ohm",a:u,b:h,i:.001}],{}),m=u===h?0:(p.V[u]-p.V[h])/.001;return{mode:o,value:m>2e7?1/0:m,unit:"\u03A9",text:m>2e7?"OL":Zd(m,"\u03A9"),att:l,powered:c}}function Zd(i,e){let t=Math.abs(i),n,s=e;return e==="\u03A9"?t>=999500?(n=(i/1e6).toFixed(2),s="M\u03A9"):t>=999.5?(n=(i/1e3).toFixed(t>=1e5?1:2),s="k\u03A9"):n=i.toFixed(1):e==="A"?t<1?(n=(i*1e3).toFixed(t<.01?2:1),s="mA"):n=i.toFixed(2):n=i.toFixed(t>=10?1:2),/^-0[.,]?0*$/.test(n)&&(n=n.slice(1)),n.replace(".",",")+" "+s}var Jd=vt(()=>{Is();Ra();kp()});var Nt,Cn,Zi,fe,di,Gp=vt(()=>{Nt='stroke="#12343a" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"',Cn=(i,e,t,n="middle",s="#0f5e66")=>`<text x="${i}" y="${e}" font-size="12.5" font-weight="700" fill="${s}" text-anchor="${n}">${t}</text>`,Zi=(i,e,t,n)=>t?`<g transform="rotate(90 ${i} ${e})">${n}</g>`:n,fe={bat:(i,e,t,n)=>Zi(i,e,t,`<path ${Nt} d="M${i-30} ${e}H${i-4}M${i+4} ${e}H${i+30}"/><path stroke="#12343a" stroke-width="2.6" d="M${i-4} ${e-14}V${e+14}"/><path stroke="#12343a" stroke-width="5" d="M${i+4} ${e-7}V${e+7}"/>${Cn(i-12,e-18,"+","middle","#d23")}`)+(n?Cn(t?i-22:i,t?e+4:e+30,n,t?"end":"middle"):""),res:(i,e,t,n)=>Zi(i,e,t,`<path ${Nt} d="M${i-30} ${e}H${i-16}M${i+16} ${e}H${i+30}"/><rect ${Nt} x="${i-16}" y="${e-6}" width="32" height="12"/>`)+(n?Cn(t?i+14:i,t?e+4:e-12,n,t?"start":"middle"):""),lamp:(i,e,t,n)=>Zi(i,e,t,`<path ${Nt} d="M${i-30} ${e}H${i-12}M${i+12} ${e}H${i+30}"/><circle ${Nt} cx="${i}" cy="${e}" r="12"/><path ${Nt} d="M${i-8.5} ${e-8.5}L${i+8.5} ${e+8.5}M${i+8.5} ${e-8.5}L${i-8.5} ${e+8.5}"/>`)+(n?Cn(t?i+18:i,t?e+4:e-17,n,t?"start":"middle"):""),led:(i,e,t,n)=>Zi(i,e,t,`<path ${Nt} d="M${i-30} ${e}H${i-8}M${i+8} ${e}H${i+30}"/><path ${Nt} d="M${i-8} ${e-9}L${i+8} ${e}L${i-8} ${e+9}Z" fill="#fff"/><path ${Nt} d="M${i+8} ${e-10}V${e+10}"/><path ${Nt} d="M${i+1} ${e-12}l6 -8m-4 0h4v4M${i+7} ${e-9}l6 -8m-4 0h4v4"/>`)+(n?Cn(t?i+16:i,t?e+4:e+28,n,t?"start":"middle"):""),sw:(i,e,t,n)=>Zi(i,e,t,`<path ${Nt} d="M${i-30} ${e}H${i-12}L${i+10} ${e-12}M${i+12} ${e}H${i+30}"/><circle cx="${i-12}" cy="${e}" r="2.5" fill="#12343a"/><circle cx="${i+12}" cy="${e}" r="2.5" fill="#12343a"/>`)+(n?Cn(t?i+16:i,t?e+4:e+20,n,t?"start":"middle"):""),spdt:(i,e,t,n)=>{let s=n?-1:1;return`<path ${Nt} d="M${i-30*s} ${e}H${i-10*s}L${i+10*s} ${e-10}M${i+12*s} ${e-16}H${i+30*s}M${i+12*s} ${e+16}H${i+30*s}"/><circle cx="${i-10*s}" cy="${e}" r="2.5" fill="#12343a"/><circle cx="${i+12*s}" cy="${e-16}" r="2.5" fill="#12343a"/><circle cx="${i+12*s}" cy="${e+16}" r="2.5" fill="#12343a"/>`+(t?Cn(i,e+34,t):"")},pot:(i,e,t)=>`<path ${Nt} d="M${i-30} ${e}H${i-16}M${i+16} ${e}H${i+30}"/><rect ${Nt} x="${i-16}" y="${e-6}" width="32" height="12"/><path ${Nt} d="M${i} ${e-30}V${e-8}m-5 -6l5 6l5 -6"/>`+(t?Cn(i,e+24,t):""),ldr:(i,e,t,n)=>Zi(i,e,t,`<path ${Nt} d="M${i-30} ${e}H${i-16}M${i+16} ${e}H${i+30}"/><rect ${Nt} x="${i-16}" y="${e-6}" width="32" height="12"/><path ${Nt} d="M${i-14} ${e-24}l8 10m-1 -5v5h-5M${i-4} ${e-26}l8 10m-1 -5v5h-5"/>`)+(n?Cn(t?i+14:i,t?e+4:e+24,n,t?"start":"middle"):""),buzz:(i,e,t,n)=>Zi(i,e,t,`<path ${Nt} d="M${i-30} ${e}H${i-10}M${i+10} ${e}H${i+30}"/><path ${Nt} d="M${i-10} ${e}V${e-8}H${i+10}V${e}"/><path ${Nt} d="M${i-10} ${e-8}A10 10 0 0 1 ${i+10} ${e-8}"/>${Cn(i-16,e-8,"+","middle","#d23")}`)+(n?Cn(t?i+16:i,t?e+4:e+20,n,t?"start":"middle"):""),meter:(i,e,t,n,s)=>Zi(i,e,t,`<path ${Nt} d="M${i-30} ${e}H${i-13}M${i+13} ${e}H${i+30}"/><circle ${Nt} cx="${i}" cy="${e}" r="13" fill="#fff"/>`)+`<text x="${i}" y="${e+5}" font-size="15" font-weight="700" fill="#12343a" text-anchor="middle">${n}</text>`+(s?Cn(t?i+18:i,t?e+4:e-18,s,t?"start":"middle"):""),dot:(i,e)=>`<circle cx="${i}" cy="${e}" r="3.6" fill="#12343a"/>`,w:i=>`<path ${Nt} d="${i}"/>`,txt:Cn},di=(i,e,t)=>`<svg viewBox="0 0 ${i} ${e}" xmlns="http://www.w3.org/2000/svg" class="c-schem" font-family="system-ui, Segoe UI, Arial, sans-serif">${t}</svg>`});var Et,wt,Kn,Ds,Or,Pa,pl,Os,$p,Kd=vt(()=>{Gp();Et=(i,e,t,n=0,s={},r={})=>({place:{id:i,type:e,...typeof t=="string"?{at:t}:{pos:t},rot:n,props:s},...r}),wt=(i,e,t,n,s={})=>({wire:{id:i,a:e,b:t,color:n},...s}),Kn=(i={})=>({sim:!0,t:"Inicia la simulaci\xF3n",text:"Pulsa el bot\xF3n verde <b>\u25B6 Iniciar simulaci\xF3n</b> (arriba a la derecha).",...i}),Ds=(i,e,t,n,s={})=>({act:{part:i,test:e},t,text:n,...s}),Or=(i,e,t,n,s,r={})=>({measure:{mode:i,red:e,com:t},t:n,text:s,...r}),Pa=[Et("B1","aa4",[-31,-1],0,{},{t:"Coloca el portapilas",text:"Arrastra el <b>portapilas 4\xD7AA (6 V)</b> a la mesa, a la izquierda de la protoboard. Puede ir en cualquier sitio de la mesa."}),wt("w1","p:B1:+","h:tp2","rojo",{t:"Cable rojo: + al carril +",text:"Haz clic en el <b>cable rojo (+)</b> del portapilas y despu\xE9s en el agujero del <b>carril + de arriba</b> (l\xEDnea roja). As\xED toda esa fila queda a +6 V."}),wt("w2","p:B1:-","h:tn2","negro",{t:"Cable negro: \u2212 al carril \u2212",text:"Ahora del <b>cable negro (\u2212)</b> del portapilas al <b>carril \u2212 de arriba</b> (l\xEDnea azul)."})],pl=[Et("B1","bat9",[-23,-5],0,{},{t:"Coloca la pila de 9 V",text:"Arrastra la <b>pila de 9 V</b> a la mesa, a la izquierda de la protoboard."}),wt("w1","p:B1:+","h:tp2","rojo",{t:"Cable rojo: + al carril +",text:"Clic en el <b>borne +</b> (el peque\xF1o y redondo) y luego en el <b>carril + de arriba</b> (l\xEDnea roja)."}),wt("w2","p:B1:-","h:tn2","negro",{t:"Cable negro: \u2212 al carril \u2212",text:"Clic en el <b>borne \u2212</b> (hexagonal) y luego en el <b>carril \u2212 de arriba</b> (l\xEDnea azul)."})],Os=[{id:"c1",n:1,title:"Mi primer circuito",sub:"Portapilas, interruptor y bombilla",level:"Muy f\xE1cil",duration:"30 min",icon:"\u{1F4A1}",ra:{1:["a"],2:["a","b","c"],3:["d","e"]},objetivo:"Montar el circuito el\xE9ctrico m\xE1s sencillo: un generador (pilas), un elemento de control (interruptor) y un receptor (bombilla), y entender que la corriente solo circula si el circuito est\xE1 cerrado.",teoria:"Todo circuito tiene: <b>generador</b> (da la energ\xEDa), <b>conductores</b> (cables), <b>receptor</b> (la transforma: luz, calor, movimiento) y <b>elemento de control</b> (interruptor). En la protoboard, los 5 agujeros de cada columna (a\u2013e o f\u2013j) est\xE1n unidos por dentro, y los carriles + y \u2212 est\xE1n unidos a lo largo.",material:[["Portapilas 4\xD7AA (6 V)",1],["Interruptor",1],["Bombilla 6 V / 0,1 A",1],["Cables (rojo, negro y otro color)",4],["Protoboard",1]],schem:()=>di(320,210,fe.bat(40,105,!0,"6 V")+fe.w("M40 75V35H110")+fe.sw(140,35,!1,"S1")+fe.w("M170 35H270V75")+fe.lamp(270,105,!0,"Bombilla")+fe.w("M270 135V180H40V135")),steps:[...Pa,Et("S1","switch","c8",0,{},{t:"Pincha el interruptor",text:"Arrastra el <b>interruptor</b> y p\xEDnchalo con sus patas en <b>c8</b> y <b>c10</b>. Sigue la silueta naranja."}),wt("w3","h:tp7","h:a8","rojo",{t:"Del carril + al interruptor",text:"Cable rojo desde el <b>carril +</b> hasta <b>a8</b> (misma columna que la pata izquierda del interruptor)."}),Et("L1","bulb","e10",0,{},{t:"Pincha la bombilla",text:"Pincha la <b>bombilla</b> en <b>e10</b> y <b>e12</b>. Su pata izquierda queda en la columna 10, la misma que la pata derecha del interruptor."}),wt("w4","h:a12","h:tn11","negro",{t:"De la bombilla al carril \u2212",text:"Cable negro desde <b>a12</b> hasta el <b>carril \u2212</b>. El circuito ya est\xE1 completo."}),Kn(),Ds("S1",i=>i.closed,"Cierra el interruptor","Haz clic sobre el <b>interruptor</b> para cerrarlo. La bombilla debe encenderse. Vuelve a hacer clic: se apaga.")],checks:[{topo:!0},{label:"Con el interruptor cerrado, la bombilla luce",fn:i=>i.run({S1:{closed:!0}}).get("L1").bright>.5},{label:"Con el interruptor abierto, la bombilla est\xE1 apagada",fn:i=>i.run({S1:{closed:!1}}).get("L1").bright<.02},{label:"No hay cortocircuitos",fn:i=>!i.run({S1:{closed:!0}}).shorts.length}],questions:[{q:"\xBFQu\xE9 tensi\xF3n dan 4 pilas AA de 1,5 V en serie?",unit:"V",ans:6,tol:.02,expl:"4 \xD7 1,5 V = 6 V."},{q:"La bombilla es de 6 V y 0,1 A. \xBFQu\xE9 resistencia tiene? (R = V / I)",unit:"\u03A9",ans:60,tol:.03,expl:"R = 6 V / 0,1 A = 60 \u03A9."},{q:"\xBFQu\xE9 potencia consume la bombilla? (P = V \xB7 I)",unit:"W",ans:.6,tol:.03,expl:"P = 6 V \xD7 0,1 A = 0,6 W."},{q:"Con el interruptor abierto el circuito est\xE1\u2026",choices:["Cerrado","Abierto","En cortocircuito"],ans:1,expl:"Abierto: no hay camino completo y no circula corriente."}],reto:"A\xF1ade un segundo interruptor en serie con el primero. \xBFCu\xE1ndo se enciende ahora la bombilla?"},{id:"c2",n:2,title:"LED con resistencia",sub:"Polaridad y ley de Ohm",level:"F\xE1cil",duration:"40 min",icon:"\u{1F534}",ra:{1:["a"],2:["a","c"],3:["d","e","i"]},objetivo:"Conectar un LED respetando su polaridad y protegerlo con una resistencia calculada con la ley de Ohm.",teoria:"El LED tiene polaridad: la pata <b>larga</b> es el \xE1nodo (+) y la <b>corta</b> el c\xE1todo (\u2212). Un LED rojo necesita unos <b>1,8 V</b> y como m\xE1ximo <b>20 mA</b>. La resistencia limita la corriente: <b>R = (V<sub>pila</sub> \u2212 V<sub>LED</sub>) / I</b>. Sin resistencia, el LED se funde.",material:[["Pila de 9 V",1],["Resistencia de 470 \u03A9 (amarillo-violeta-marr\xF3n)",1],["LED rojo",1],["Cables",4],["Pol\xEDmetro",1]],schem:()=>di(320,210,fe.bat(40,105,!0,"9 V")+fe.w("M40 75V35H120")+fe.res(150,35,!1,"470 \u03A9")+fe.w("M180 35H270V75")+fe.led(270,105,!0,"LED")+fe.w("M270 135V180H40V135")),steps:[...pl,Et("R1","resistor","b10",0,{r:470},{t:"Pincha la resistencia de 470 \u03A9",text:"Arrastra una <b>resistencia de 470 \u03A9</b> (colores amarillo-violeta-marr\xF3n-oro) y p\xEDnchala en <b>b10</b> y <b>b14</b>. La resistencia no tiene polaridad."}),Et("L1","led","e14",0,{color:"rojo"},{t:"Pincha el LED rojo",text:"Pincha el <b>LED rojo</b> con la pata larga (+) en <b>e14</b> y la corta (\u2212) en <b>e15</b>. \xA1F\xEDjate en la polaridad!"}),wt("w3","h:tp9","h:a10","rojo",{t:"Del carril + a la resistencia",text:"Cable rojo desde el <b>carril +</b> hasta <b>a10</b>."}),wt("w4","h:a15","h:tn15","negro",{t:"Del LED al carril \u2212",text:"Cable negro desde <b>a15</b> (columna del c\xE1todo) hasta el <b>carril \u2212</b>."}),Kn({text:"Pulsa <b>\u25B6 Iniciar simulaci\xF3n</b>. El LED debe encenderse."}),Et("M1","meter",[27,0],0,{mode:"V"},{t:"Saca el pol\xEDmetro",text:"Arrastra el <b>pol\xEDmetro</b> a la mesa, a la derecha. Ponlo en <b>V</b> (tensi\xF3n)."}),Or("V","h:c14","h:c15","Mide la tensi\xF3n del LED","Lleva la <b>punta roja</b> a la columna 14 (\xE1nodo) y la <b>negra</b> a la columna 15 (c\xE1todo). Se mide <b>en paralelo</b>. Debes leer unos 2 V.",{key:"vled"}),Or("V","h:c10","h:c14","Mide la tensi\xF3n de la resistencia","Ahora la <b>roja</b> en la columna 10 y la <b>negra</b> en la 14. La pila reparte sus 9 V entre la resistencia y el LED.")],checks:[{topo:!0},{label:"El LED se enciende",fn:i=>i.run().get("L1").on},{label:"La corriente del LED es segura (menos de 20 mA)",fn:i=>{let e=i.run().get("L1").i;return e>.005&&e<.02},info:i=>"I = "+(i.run().get("L1").i*1e3).toFixed(1).replace(".",",")+" mA"},{label:"Has medido la tensi\xF3n del LED con el pol\xEDmetro",measured:"vled"}],questions:[{q:"Tensi\xF3n que cae en la resistencia: V<sub>R</sub> = 9 V \u2212 1,8 V",unit:"V",ans:7.2,tol:.06,expl:"V<sub>R</sub> = 9 \u2212 1,8 = 7,2 V (el pol\xEDmetro marca algo menos porque el LED real cae \u22482 V)."},{q:"Corriente del circuito: I = V<sub>R</sub> / R = 7,2 V / 470 \u03A9 (en mA)",unit:"mA",ans:15.3,tol:.08,expl:"I = 7,2 / 470 = 0,0153 A = 15,3 mA: menos de 20 mA, el LED est\xE1 protegido."},{q:"\xBFQu\xE9 pasa si conectas el LED al rev\xE9s?",choices:["Luce m\xE1s","No luce, pero no se estropea","Se funde"],ans:1,expl:"Al rev\xE9s el LED bloquea la corriente: no luce. Dale la vuelta y funcionar\xE1."},{q:"\xBFY si quitas la resistencia y lo conectas directo a 9 V?",choices:["Luce igual","Se funde por exceso de corriente","No pasa nada"],ans:1,expl:"Sin resistencia la corriente se dispara (cientos de mA) y el LED se funde. \xA1Pru\xE9balo en el modo libre!"}],reto:"Calcula la resistencia para un LED verde (2,1 V) a 15 mA con 9 V. \xBFQu\xE9 valor comercial elegir\xEDas?"},{id:"c3",n:3,title:"Aprende a usar el pol\xEDmetro",sub:"Medir resistencia, tensi\xF3n y corriente",level:"F\xE1cil",duration:"50 min",icon:"\u{1F4DF}",ra:{1:["a","c"],4:["a","h"],5:["b"]},objetivo:"Usar el pol\xEDmetro como \xF3hmetro (\u03A9, sin alimentaci\xF3n), volt\xEDmetro (V, en paralelo) y amper\xEDmetro (A, en serie) en un circuito de dos resistencias.",teoria:"<b>\u03A9</b>: se mide con el circuito <b>sin alimentaci\xF3n</b>. <b>V</b>: el pol\xEDmetro va <b>en paralelo</b> con el componente. <b>A</b>: hay que <b>abrir el circuito</b> y meter el pol\xEDmetro <b>en serie</b>, para que toda la corriente pase por \xE9l. \xA1Nunca midas corriente en paralelo: es un cortocircuito!",material:[["Pila de 9 V",1],["Resistencia 1 k\u03A9 (marr\xF3n-negro-rojo)",1],["Resistencia 2,2 k\u03A9 (rojo-rojo-rojo)",1],["Pol\xEDmetro",1],["Cables",4]],schem:()=>di(340,210,fe.bat(40,105,!0,"9 V")+fe.w("M40 75V35H110")+fe.res(140,35,!1,"R1 = 1 k\u03A9")+fe.w("M170 35H270V75")+fe.res(270,105,!0,"R2 = 2,2 k\u03A9")+fe.w("M270 135V150")+fe.meter(270,165,!0,"A")+fe.w("M270 195V198H40V135")),steps:[Et("R1","resistor","b10",0,{r:1e3},{t:"Pincha R1 = 1 k\u03A9",text:"Pincha la resistencia de <b>1 k\u03A9</b> (marr\xF3n-negro-rojo) en <b>b10</b> y <b>b14</b>."}),Et("R2","resistor","d14",0,{r:2200},{t:"Pincha R2 = 2,2 k\u03A9",text:"Pincha la de <b>2,2 k\u03A9</b> (rojo-rojo-rojo) en <b>d14</b> y <b>d18</b>. Las dos comparten la columna 14: est\xE1n <b>en serie</b>."}),Et("M1","meter",[27,0],0,{mode:"\u03A9"},{t:"Pol\xEDmetro en \u03A9",text:"Saca el <b>pol\xEDmetro</b> y elige la funci\xF3n <b>\u03A9</b> en su panel de propiedades (o haz clic en su rueda)."}),Kn({text:"Pulsa <b>\u25B6 Iniciar simulaci\xF3n</b> para encender el pol\xEDmetro. Todav\xEDa no hay pila: as\xED se miden las resistencias."}),Or("\u03A9","h:a10","h:a14","Mide R1","Pon la <b>punta roja</b> en la columna 10 y la <b>negra</b> en la 14. Debes leer \u2248 <b>1 k\u03A9</b>.",{key:"r1"}),{stop:!0,t:"Para la simulaci\xF3n",text:"Pulsa <b>\u25A0 Detener</b> para poder seguir montando."},...pl.map(i=>({...i})),wt("w3","h:tp9","h:a10","rojo",{t:"Del carril + a R1",text:"Cable rojo del <b>carril +</b> a <b>a10</b>."}),wt("w4","h:a18","h:tn17","negro",{t:"De R2 al carril \u2212",text:"Cable negro de <b>a18</b> al <b>carril \u2212</b>. El circuito est\xE1 cerrado."}),Kn({t:"Simula de nuevo"}),{setMode:"V",meterPart:"M1",t:"Pol\xEDmetro en V",text:"Cambia el pol\xEDmetro a <b>V</b>."},Or("V","h:e14","h:e18","Mide la tensi\xF3n de R2","<b>Roja</b> en la columna 14 y <b>negra</b> en la 18 (en paralelo con R2). Debes leer unos <b>6,2 V</b>.",{key:"v2"}),{stop:!0,t:"Para la simulaci\xF3n",text:"Pulsa <b>\u25A0 Detener</b>."},{remove:"w4",t:"Abre el circuito",text:"Selecciona el <b>cable negro a18 \u2192 carril \u2212</b> y b\xF3rralo (tecla <b>Supr</b> o bot\xF3n \u{1F5D1}). Para medir corriente hay que abrir el circuito."},{setMode:"A",meterPart:"M1",t:"Pol\xEDmetro en A",text:"Cambia el pol\xEDmetro a <b>A</b>."},Kn({t:"Simula de nuevo"}),Or("A","h:b18","h:tn20","Mide la corriente (en serie)","Cierra el circuito <b>a trav\xE9s del pol\xEDmetro</b>: <b>roja</b> en la columna 18 y <b>negra</b> en el <b>carril \u2212</b>. Debes leer unos <b>2,8 mA</b>.",{key:"i"})],checks:[{label:"Has medido R1 con el \xF3hmetro (\u2248 1 k\u03A9)",measured:"r1"},{label:"Has medido la tensi\xF3n de R2 con el volt\xEDmetro (\u2248 6,2 V)",measured:"v2"},{label:"Has medido la corriente en serie con el amper\xEDmetro (\u2248 2,8 mA)",measured:"i"}],questions:[{q:"Resistencia total en serie: R1 + R2",unit:"k\u03A9",ans:3.2,tol:.02,expl:"1 k\u03A9 + 2,2 k\u03A9 = 3,2 k\u03A9."},{q:"Corriente te\xF3rica: I = 9 V / 3,2 k\u03A9",unit:"mA",ans:2.81,tol:.04,expl:"I = 9 / 3200 = 0,00281 A = 2,81 mA."},{q:"Tensi\xF3n te\xF3rica en R2: V = I \xB7 R2",unit:"V",ans:6.19,tol:.04,expl:"V = 0,00281 \xD7 2200 = 6,19 V."},{q:"Para medir corriente, el pol\xEDmetro se conecta\u2026",choices:["En paralelo","En serie","Sin alimentaci\xF3n"],ans:1,expl:"En serie: toda la corriente tiene que atravesar el amper\xEDmetro."}],reto:"Mide la tensi\xF3n de R1. \xBFCu\xE1nto suman V(R1) + V(R2)? Comp\xE1ralo con la tensi\xF3n de la pila."},{id:"c4",n:4,title:"Circuito en serie",sub:"Dos bombillas, un solo camino",level:"F\xE1cil",duration:"40 min",icon:"\u{1F517}",ra:{2:["a","b","e"],3:["d","e"],4:["a"]},objetivo:"Montar dos receptores en serie y comprobar que comparten la misma corriente y se reparten la tensi\xF3n.",teoria:"En <b>serie</b> los receptores van uno detr\xE1s de otro: la corriente es la <b>misma</b> en todos y la tensi\xF3n se <b>reparte</b>. R<sub>total</sub> = R1 + R2. Si se funde una bombilla, se apagan todas.",material:[["Portapilas 4\xD7AA (6 V)",1],["Bombilla 6 V",2],["Cables",4]],schem:()=>di(320,210,fe.bat(40,105,!0,"6 V")+fe.w("M40 75V35H100")+fe.lamp(130,35,!1,"L1")+fe.w("M160 35H200")+fe.lamp(230,35,!1,"L2")+fe.w("M260 35H280V180H40V135")),steps:[...Pa,Et("L1","bulb","b8",0,{},{t:"Primera bombilla",text:"Pincha una <b>bombilla</b> en <b>b8</b> y <b>b10</b>."}),Et("L2","bulb","e10",0,{},{t:"Segunda bombilla",text:"Pincha otra <b>bombilla</b> en <b>e10</b> y <b>e12</b>. Comparten la columna 10: van <b>en serie</b>."}),wt("w3","h:tp7","h:d8","rojo",{t:"Del carril + a L1",text:"Cable rojo desde el <b>carril +</b> hasta <b>d8</b>."}),wt("w4","h:a12","h:tn11","negro",{t:"De L2 al carril \u2212",text:"Cable negro desde <b>a12</b> hasta el <b>carril \u2212</b>."}),Kn({text:"Pulsa <b>\u25B6 Iniciar simulaci\xF3n</b>. Las dos bombillas lucen, pero <b>flojo</b>: cada una solo recibe 3 V."})],checks:[{topo:!0},{label:"Las dos bombillas lucen, m\xE1s flojo que una sola (\u224825 %)",fn:i=>{let e=i.run(),t=e.get("L1").bright,n=e.get("L2").bright;return t>.1&&t<.5&&Math.abs(t-n)<.02}},{label:"La corriente es la misma en las dos bombillas",fn:i=>{let e=i.run();return Math.abs(Math.abs(e.get("L1").i)-Math.abs(e.get("L2").i))<1e-4},info:i=>"I = "+(Math.abs(i.run().get("L1").i)*1e3).toFixed(0)+" mA"}],questions:[{q:"Cada bombilla tiene 60 \u03A9. Resistencia total en serie:",unit:"\u03A9",ans:120,tol:.02,expl:"R<sub>T</sub> = 60 + 60 = 120 \u03A9."},{q:"Corriente del circuito: I = 6 V / R<sub>T</sub>",unit:"mA",ans:50,tol:.05,expl:"I = 6 / 120 = 0,05 A = 50 mA (en las dos bombillas)."},{q:"Tensi\xF3n en cada bombilla:",unit:"V",ans:3,tol:.05,expl:"V = 0,05 A \xD7 60 \u03A9 = 3 V. Las dos suman los 6 V de la pila."},{q:"Si se funde una bombilla, la otra\u2026",choices:["Sigue encendida","Se apaga","Luce m\xE1s"],ans:1,expl:"Se apaga: en serie solo hay un camino y queda abierto."}],reto:"Mide con el pol\xEDmetro la tensi\xF3n de cada bombilla y la de la pila. \xBFSe cumple que V1 + V2 = V<sub>pila</sub>?"},{id:"c5",n:5,title:"Circuito en paralelo",sub:"Cada bombilla con su camino",level:"Media",duration:"40 min",icon:"\u{1F500}",ra:{2:["a","b","e"],3:["d","e"],4:["a"]},objetivo:"Montar dos receptores en paralelo y comprobar que todos reciben la tensi\xF3n completa y que la corriente total es la suma.",teoria:"En <b>paralelo</b> cada receptor se conecta directamente al + y al \u2212: todos tienen la <b>misma tensi\xF3n</b> y la corriente total es la <b>suma</b>. As\xED est\xE1n conectados los enchufes y las luces de casa. Si una bombilla se funde, las dem\xE1s siguen encendidas.",material:[["Portapilas 4\xD7AA (6 V)",1],["Bombilla 6 V",2],["Cables",6]],schem:()=>di(320,210,fe.bat(40,105,!0,"6 V")+fe.w("M40 75V35H260V75M160 35V75")+fe.dot(160,35)+fe.lamp(160,105,!0,"L1")+fe.lamp(260,105,!0,"L2")+fe.w("M160 135V180M260 135V180H40V135")+fe.dot(160,180)),steps:[...Pa,Et("L1","bulb","d8",0,{},{t:"Primera bombilla",text:"Pincha una <b>bombilla</b> en <b>d8</b> y <b>d10</b>."}),wt("w3","h:tp7","h:a8","rojo",{t:"L1 al carril +",text:"Cable rojo del <b>carril +</b> a <b>a8</b>."}),wt("w4","h:a10","h:tn9","negro",{t:"L1 al carril \u2212",text:"Cable negro de <b>a10</b> al <b>carril \u2212</b>. La primera bombilla ya lucir\xEDa."}),Et("L2","bulb","d14",0,{},{t:"Segunda bombilla",text:"Pincha otra <b>bombilla</b> en <b>d14</b> y <b>d16</b>."}),wt("w5","h:tp13","h:a14","rojo",{t:"L2 al carril +",text:"Cable rojo del <b>carril +</b> a <b>a14</b>."}),wt("w6","h:a16","h:tn15","negro",{t:"L2 al carril \u2212",text:"Cable negro de <b>a16</b> al <b>carril \u2212</b>."}),Kn({text:"Pulsa <b>\u25B6 Iniciar simulaci\xF3n</b>. Las dos bombillas lucen a <b>plena potencia</b>."})],checks:[{topo:!0},{label:"Las dos bombillas lucen con fuerza",fn:i=>{let e=i.run();return e.get("L1").bright>.8&&e.get("L2").bright>.8}},{label:"Las dos tienen la misma tensi\xF3n (\u2248 6 V)",fn:i=>{let e=i.run();return Math.abs(Math.abs(e.get("L1").v)-Math.abs(e.get("L2").v))<.05&&Math.abs(e.get("L1").v)>5.5}}],questions:[{q:"Corriente por cada bombilla: I = 6 V / 60 \u03A9",unit:"mA",ans:100,tol:.05,expl:"I = 6 / 60 = 0,1 A = 100 mA."},{q:"Corriente total que da el portapilas:",unit:"mA",ans:200,tol:.05,expl:"I<sub>T</sub> = 100 + 100 = 200 mA."},{q:"Resistencia equivalente de las dos en paralelo:",unit:"\u03A9",ans:30,tol:.05,expl:"R<sub>eq</sub> = (60 \xD7 60) / (60 + 60) = 30 \u03A9 (o 6 V / 0,2 A)."},{q:"Si quitas una bombilla, la otra\u2026",choices:["Se apaga","Sigue igual","Luce el doble"],ans:1,expl:"Sigue igual: tiene su propio camino hasta la pila."}],reto:"Pon el pol\xEDmetro en A en serie con el cable rojo del portapilas y comprueba la corriente total."},{id:"c6",n:6,title:"Circuito mixto",sub:"Serie + paralelo a la vez",level:"Media",duration:"50 min",icon:"\u{1F9E9}",ra:{2:["a","b","e"],3:["d","e"],4:["a"]},objetivo:"Montar un circuito mixto (una bombilla en serie con dos en paralelo), predecir qu\xE9 bombilla lucir\xE1 m\xE1s y comprobarlo.",teoria:"Se resuelve por partes: primero el tramo en paralelo (R<sub>p</sub> = 60\xB760 / 120 = 30 \u03A9), despu\xE9s la serie (R<sub>T</sub> = 60 + 30 = 90 \u03A9). Toda la corriente pasa por L1, pero se divide entre L2 y L3.",material:[["Portapilas 4\xD7AA (6 V)",1],["Bombilla 6 V",3],["Cables",4]],schem:()=>di(340,220,fe.bat(40,110,!0,"6 V")+fe.w("M40 80V40H90")+fe.lamp(120,40,!1,"L1")+fe.w("M150 40H210V60H200M210 60H300V80M210 60V80")+fe.dot(210,60)+fe.lamp(210,110,!0,"L2")+fe.lamp(300,110,!0,"L3")+fe.w("M210 140V185M300 140V185H40V140")+fe.dot(210,185)),steps:[...Pa,Et("L1","bulb","c4",0,{},{t:"Bombilla L1 (en serie)",text:"Pincha la <b>bombilla L1</b> en <b>c4</b> y <b>c6</b>."}),wt("w3","h:tp3","h:a4","rojo",{t:"Del carril + a L1",text:"Cable rojo del <b>carril +</b> a <b>a4</b>."}),Et("L2","bulb","e6",0,{},{t:"Bombilla L2",text:"Pincha <b>L2</b> en <b>e6</b> y <b>e8</b>."}),Et("L3","bulb","a6",0,{},{t:"Bombilla L3 (en paralelo con L2)",text:"Pincha <b>L3</b> en <b>a6</b> y <b>a8</b>. L2 y L3 est\xE1n entre las mismas columnas (6 y 8): <b>en paralelo</b>."}),wt("w4","h:c8","h:tn9","negro",{t:"Del paralelo al carril \u2212",text:"Cable negro de <b>c8</b> al <b>carril \u2212</b>."}),Kn({text:"Pulsa <b>\u25B6 Iniciar simulaci\xF3n</b>. \xBFQu\xE9 bombilla luce m\xE1s?"})],checks:[{topo:!0},{label:"L1 luce m\xE1s que L2 y L3",fn:i=>{let e=i.run();return e.get("L1").bright>2*e.get("L2").bright&&e.get("L2").bright>.05}},{label:"L2 y L3 lucen igual",fn:i=>{let e=i.run();return Math.abs(e.get("L2").bright-e.get("L3").bright)<.02}}],questions:[{q:"Resistencia total del circuito:",unit:"\u03A9",ans:90,tol:.03,expl:"R<sub>p</sub> = 30 \u03A9; R<sub>T</sub> = 60 + 30 = 90 \u03A9."},{q:"Corriente total (la que pasa por L1):",unit:"mA",ans:66.7,tol:.05,expl:"I = 6 / 90 = 0,0667 A = 66,7 mA."},{q:"Tensi\xF3n en L1:",unit:"V",ans:4,tol:.05,expl:"V1 = 0,0667 \xD7 60 = 4 V."},{q:"Tensi\xF3n en L2 (y en L3):",unit:"V",ans:2,tol:.06,expl:"V2 = 6 \u2212 4 = 2 V (o 0,0667 \xD7 30)."}],reto:"Quita L3. \xBFLucen ahora m\xE1s o menos L1 y L2? Explica por qu\xE9 con la resistencia total."},{id:"c7",n:7,title:"Encender una luz desde dos puntos",sub:"Circuito conmutado",level:"Media",duration:"50 min",icon:"\u{1F3E0}",ra:{1:["a"],2:["a","b","e"],3:["d","e","i"]},objetivo:"Montar el circuito de un pasillo: una bombilla que se enciende y apaga desde dos conmutadores.",teoria:'Un <b>conmutador</b> une su pata central (com\xFAn) con un extremo u otro. Con dos conmutadores unidos por dos cables <b>"viajeros"</b>, cualquiera de ellos cambia el estado de la luz. Es la instalaci\xF3n t\xEDpica de pasillos y dormitorios.',material:[["Portapilas 4\xD7AA (6 V)",1],["Conmutador",2],["Bombilla 6 V",1],["Cables",6]],schem:()=>di(340,210,fe.bat(30,110,!0,"6 V")+fe.w("M30 80V50H60")+fe.spdt(90,50,"S1")+fe.w("M120 34H200M120 66H200")+fe.spdt(230,50,"S2",!0)+fe.w("M260 50H300V80")+fe.lamp(300,110,!0,"")+fe.w("M300 140V185H30V140")+fe.txt(160,28,"viajeros")),steps:[...Pa,Et("S1","spdt","b4",0,{},{t:"Primer conmutador",text:"Pincha un <b>conmutador</b> en <b>b4, b5 y b6</b> (la pata central, com\xFAn, queda en la columna 5)."}),Et("S2","spdt","b14",0,{},{t:"Segundo conmutador",text:"Pincha el otro <b>conmutador</b> en <b>b14, b15 y b16</b>."}),wt("w3","h:tp5","h:a5","rojo",{t:"Del carril + al com\xFAn de S1",text:"Cable rojo del <b>carril +</b> a <b>a5</b> (com\xFAn de S1)."}),wt("w4","h:a4","h:a14","amarillo",{t:"Primer viajero",text:"Cable amarillo de <b>a4</b> a <b>a14</b> (une los extremos izquierdos)."}),wt("w5","h:c6","h:c16","naranja",{t:"Segundo viajero",text:"Cable naranja de <b>c6</b> a <b>c16</b> (une los extremos derechos)."}),Et("L1","bulb","e15",0,{},{t:"Bombilla",text:"Pincha la <b>bombilla</b> en <b>e15</b> y <b>e17</b>: queda unida al com\xFAn de S2."}),wt("w6","h:a17","h:tn17","negro",{t:"De la bombilla al carril \u2212",text:"Cable negro de <b>a17</b> al <b>carril \u2212</b>."}),Kn(),Ds("S1","toggled","Prueba el conmutador S1","Haz clic en el conmutador <b>S1</b> (el de la izquierda): la luz cambia."),Ds("S2","toggled","Prueba el conmutador S2","Ahora haz clic en <b>S2</b> (el de la derecha): la luz vuelve a cambiar. \xA1Se controla desde los dos puntos!")],checks:[{topo:!0},{label:"S1 cambia el estado de la luz (con S2 en cualquier posici\xF3n)",fn:i=>[0,1].every(e=>i.run({S1:{pos:0},S2:{pos:e}}).get("L1").bright>.5!=i.run({S1:{pos:1},S2:{pos:e}}).get("L1").bright>.5)},{label:"S2 cambia el estado de la luz (con S1 en cualquier posici\xF3n)",fn:i=>[0,1].every(e=>i.run({S1:{pos:e},S2:{pos:0}}).get("L1").bright>.5!=i.run({S1:{pos:e},S2:{pos:1}}).get("L1").bright>.5)},{label:"Sin cortocircuitos en ninguna posici\xF3n",fn:i=>[[0,0],[0,1],[1,0],[1,1]].every(([e,t])=>!i.run({S1:{pos:e},S2:{pos:t}}).shorts.length)}],questions:[{q:"\xBFCu\xE1ntos cables viajeros unen los conmutadores?",unit:"cables",ans:2,tol:0,expl:"Dos: uno para cada extremo."},{q:"Corriente de la bombilla cuando luce (6 V / 60 \u03A9):",unit:"mA",ans:100,tol:.05,expl:"I = 6 / 60 = 0,1 A = 100 mA."},{q:"\xBFD\xF3nde se usa este circuito?",choices:["En un timbre","En un pasillo con dos interruptores","En una linterna"],ans:1,expl:"En pasillos, escaleras y dormitorios: se enciende desde una punta y se apaga desde la otra."}],reto:"Investiga: \xBFqu\xE9 elemento hace falta para controlar la luz desde tres puntos? (pista: \xABcruzamiento\xBB)."},{id:"c8",n:8,title:"Regulador de luz con potenci\xF3metro",sub:"Divisor de tensi\xF3n",level:"Media-alta",duration:"50 min",icon:"\u{1F39A}\uFE0F",ra:{1:["a"],2:["a","c"],3:["d","e"],4:["a"]},objetivo:"Usar un potenci\xF3metro como divisor de tensi\xF3n para regular el brillo de un LED, y medir la tensi\xF3n del cursor.",teoria:"El potenci\xF3metro tiene 3 patas. Si los extremos van a + y \u2212, la pata central (<b>cursor</b>) da una tensi\xF3n entre 0 V y 9 V seg\xFAn el giro: es un <b>divisor de tensi\xF3n</b>. Esa tensi\xF3n alimenta el LED a trav\xE9s de una resistencia de protecci\xF3n.",material:[["Pila de 9 V",1],["Potenci\xF3metro 10 k\u03A9",1],["Resistencia 330 \u03A9 (naranja-naranja-marr\xF3n)",1],["LED verde",1],["Cables",5],["Pol\xEDmetro",1]],schem:()=>di(340,220,fe.bat(40,110,!0,"9 V")+fe.w("M40 80V40H120V70")+`<g transform="rotate(90 120 110)">${fe.pot(120,110,"")}</g>`+fe.w("M120 150V185M40 140V185H300V160")+fe.dot(120,185)+fe.w("M150 110H180")+fe.res(210,110,!1,"330 \u03A9")+fe.w("M240 110H300V100")+fe.led(300,130,!0,"LED")+fe.txt(140,70,"P 10 k\u03A9","start")),steps:[...pl,Et("P1","pot","c6",0,{r:1e4},{t:"Pincha el potenci\xF3metro",text:"Pincha el <b>potenci\xF3metro de 10 k\u03A9</b> en <b>c6, c7 y c8</b>. El cursor (pata central) queda en la columna 7."}),wt("w3","h:tp5","h:a6","rojo",{t:"Extremo 1 al +",text:"Cable rojo del <b>carril +</b> a <b>a6</b>."}),wt("w4","h:a8","h:tn9","negro",{t:"Extremo 2 al \u2212",text:"Cable negro de <b>a8</b> al <b>carril \u2212</b>."}),Et("R1","resistor","e7",0,{r:330},{t:"Resistencia de 330 \u03A9",text:"Pincha la <b>resistencia de 330 \u03A9</b> en <b>e7</b> y <b>e11</b> (sale del cursor)."}),Et("L1","led","c11",0,{color:"verde"},{t:"LED verde",text:"Pincha el <b>LED verde</b>: pata larga (+) en <b>c11</b> y corta (\u2212) en <b>c12</b>."}),wt("w5","h:a12","h:tn13","negro",{t:"Del LED al carril \u2212",text:"Cable negro de <b>a12</b> al <b>carril \u2212</b>."}),Kn(),Ds("P1",i=>i.pos>.85,"Gira al m\xEDnimo","Selecciona el potenci\xF3metro y mueve el <b>mando</b> hacia la derecha del todo (o arr\xE1stralo con la rueda del rat\xF3n encima). El LED se apaga."),Ds("P1",i=>i.pos<.15,"Gira al m\xE1ximo","Ahora mueve el mando a la izquierda del todo: el LED luce al m\xE1ximo."),Et("M1","meter",[27,0],0,{mode:"V"},{t:"Saca el pol\xEDmetro (V)",text:"Arrastra el <b>pol\xEDmetro</b> a la mesa en modo <b>V</b>."}),Or("V","h:a7","h:tn20","Mide la tensi\xF3n del cursor","<b>Roja</b> en la columna 7 (cursor) y <b>negra</b> en el <b>carril \u2212</b>. Gira el mando y observa c\xF3mo cambia la tensi\xF3n.")],checks:[{topo:!0},{label:"Con el mando a un lado el LED est\xE1 apagado",fn:i=>!i.run({P1:{pos:1}}).get("L1").on},{label:"Con el mando al otro lado el LED luce sin pasar de 25 mA",fn:i=>{let e=i.run({P1:{pos:0}}).get("L1");return e.on&&e.i<.025}},{label:"El brillo cambia de forma gradual",fn:i=>{let e=i.run({P1:{pos:.6}}).get("L1").i,t=i.run({P1:{pos:.4}}).get("L1").i,n=i.run({P1:{pos:.2}}).get("L1").i;return e<t&&t<n}}],questions:[{q:"Sin LED, con el mando en el centro, \xBFqu\xE9 tensi\xF3n da el cursor?",unit:"V",ans:4.5,tol:.03,expl:"Mitad de la resistencia: mitad de la tensi\xF3n, 9 / 2 = 4,5 V."},{q:"Corriente m\xE1xima del LED (cursor a 9 V): I = (9 \u2212 2,1) / 330",unit:"mA",ans:20.9,tol:.06,expl:"I = 6,9 / 330 = 20,9 mA."},{q:"\xBFPor qu\xE9 hace falta la resistencia de 330 \u03A9?",choices:["Para que gire el mando","Para limitar la corriente del LED cuando el cursor est\xE1 a 9 V","No hace falta"],ans:1,expl:"Con el cursor en un extremo el LED quedar\xEDa conectado directamente a 9 V y se fundir\xEDa."}],reto:"Mide la tensi\xF3n del cursor con el mando en 3 posiciones y apunta tambi\xE9n el brillo del LED en una tabla."},{id:"c9",n:9,title:"Alarma de luz con LDR",sub:"Sensor de luz, zumbador y LED",level:"Media-alta",duration:"50 min",icon:"\u{1F514}",ra:{1:["a"],2:["a","c","e"],3:["d","e","j"]},objetivo:"Montar la alarma de una caja fuerte: al entrar luz en la caja, la LDR baja su resistencia, el zumbador suena y el LED se enciende.",teoria:"La <b>LDR</b> (resistencia dependiente de la luz) vale \u22481 M\u03A9 a oscuras y unos 500 \u03A9 con mucha luz. En serie con el zumbador y el LED, a oscuras casi no pasa corriente (silencio); con luz la corriente sube y la alarma se dispara. La propia LDR limita la corriente del LED.",material:[["Pila de 9 V",1],["LDR",1],["Zumbador activo",1],["LED rojo",1],["Cables",4]],schem:()=>di(340,210,fe.bat(40,105,!0,"9 V")+fe.w("M40 75V35H90")+fe.ldr(120,35,!1,"LDR")+fe.w("M150 35H190")+fe.buzz(220,35,!1,"")+fe.txt(220,64,"Zumbador")+fe.w("M250 35H290V75")+fe.led(290,105,!0,"LED")+fe.w("M290 135V180H40V135")),steps:[...pl,Et("R1","ldr","b8",0,{},{t:"Pincha la LDR",text:"Pincha la <b>LDR</b> en <b>b8</b> y <b>b9</b>. No tiene polaridad."}),wt("w3","h:tp7","h:a8","rojo",{t:"Del carril + a la LDR",text:"Cable rojo del <b>carril +</b> a <b>a8</b>."}),Et("Z1","buzzer","e9",0,{},{t:"Pincha el zumbador",text:"Pincha el <b>zumbador</b> con su pata <b>+</b> en <b>e9</b> (columna de la LDR) y la \u2212 en <b>e11</b>."}),Et("L1","led","b11",0,{color:"rojo"},{t:"Pincha el LED",text:"Pincha el <b>LED rojo</b>: pata larga (+) en <b>b11</b> (columna del \u2212 del zumbador) y corta en <b>b12</b>."}),wt("w4","h:a12","h:tn13","negro",{t:"Del LED al carril \u2212",text:"Cable negro de <b>a12</b> al <b>carril \u2212</b>. Todo queda en serie: pila \u2192 LDR \u2192 zumbador \u2192 LED \u2192 pila."}),Kn(),Ds("R1",i=>i.light<.2,"Caja cerrada: oscuridad","Selecciona la <b>LDR</b> y baja la <b>luz</b> casi a 0 en su panel. Silencio."),Ds("R1",i=>i.light>.85,"Caja abierta: entra luz","Sube la luz casi al m\xE1ximo: <b>\xA1suena la alarma!</b> y el LED se enciende.")],checks:[{topo:!0},{label:"A oscuras el zumbador est\xE1 en silencio",fn:i=>!i.run({R1:{light:.05}}).get("Z1").on},{label:"Con mucha luz el zumbador suena y el LED se enciende",fn:i=>{let e=i.run({R1:{light:.95}});return e.get("Z1").on&&e.get("L1").on}},{label:"El LED nunca supera 20 mA",fn:i=>i.run({R1:{light:1}}).get("L1").i<.02}],questions:[{q:"A oscuras la LDR vale \u2248 1 M\u03A9. Corriente aproximada: I \u2248 9 V / 1 M\u03A9",unit:"\xB5A",ans:9,tol:.2,expl:"I \u2248 9 / 1 000 000 = 0,000009 A = 9 \xB5A: demasiado poca para el zumbador."},{q:"Si la LDR recibe m\xE1s luz, su resistencia\u2026",choices:["Sube","Baja","No cambia"],ans:1,expl:"Baja: m\xE1s luz, menos resistencia, m\xE1s corriente."},{q:"La LDR, el zumbador y el LED est\xE1n conectados\u2026",choices:["En serie","En paralelo"],ans:0,expl:"En serie: forman un \xFAnico camino desde el + hasta el \u2212."}],reto:"\xBFC\xF3mo har\xEDas que la alarma sonara al hacerse de noche? (pista: hace falta un transistor; investiga c\xF3mo funciona una farola autom\xE1tica)."}],$p={1:"Identifica material, herramientas y equipos",2:"Interpreta esquemas y secuencia de montaje",3:"Monta y desmonta siguiendo esquemas",4:"Conexiona y verifica la continuidad",5:"Mantenimiento b\xE1sico"}});function Wp(i){let e={};for(let t of i){let n=ce[t.type].sig(t);e[n]=(e[n]||0)+1}return e}function jp(i,e){let t=i.parts.filter(L=>!ce[L.type].meter),n=e.parts.filter(L=>!ce[L.type].meter),s=Wp(t),r=Wp(n),a=[],o=[],l=L=>{let T=t.find(R=>ce[R.type].sig(R)===L)||n.find(R=>ce[R.type].sig(R)===L);return ce[T.type].label(T)};for(let L in s)(r[L]||0)<s[L]&&a.push(`${s[L]-(r[L]||0)} \xD7 ${l(L)}`);for(let L in r)(s[L]||0)<r[L]&&o.push(`${r[L]-(s[L]||0)} \xD7 ${l(L)}`);if(a.length||o.length)return{ok:!1,msg:(a.length?"Falta: "+a.join(", ")+". ":"")+(o.length?"Sobra: "+o.join(", ")+".":"")};let c=n.filter(L=>ce[L.type].board&&!Tn(L));if(c.length)return{ok:!1,msg:`${ce[c[0].type].label(c[0])} no est\xE1 bien pinchada en la protoboard.`};let d=Ls(i,{structural:!0}),u=Ls(e,{structural:!0}),h=(L,T,R)=>L.find(T)===L.find(R),p={},m={},b=new Set,g=[],f={depth:-1,pair:null},A=[...t].sort((L,T)=>ce[T.type].pins.length-ce[L.type].pins.length);function S(L){if(L===A.length)return!0;let T=A[L],R=ce[T.type],w=R.sig(T);for(let v of n)if(!(b.has(v.id)||ce[v.type].sig(v)!==w))for(let x of R.perms||[R.pins.map(P=>P[0])]){let P=[],F=null;R.pins.forEach(([U],B)=>{let j=Kt(T,U),k=Kt(v,x[B]);m[j]=k,P.push(j)});e:for(let U of P)for(let B of[...g,...P])if(U!==B&&h(d,U,B)!==h(u,m[U],m[B])){F=[U,B,h(d,U,B)];break e}if(F)L>f.depth&&(f={depth:L,pair:F,solPart:T});else{if(b.add(v.id),p[T.id]=v.id,g.push(...P),S(L+1))return!0;b.delete(v.id),delete p[T.id],g.splice(g.length-P.length,P.length)}for(let U of P)delete m[U]}return!1}if(S(0))return{ok:!0,map:p};let y="Las conexiones no coinciden con el esquema.";if(f.pair){let[L,T,R]=f.pair,w=v=>{let[,x,P]=v.split(":"),F=i.parts.find(U=>U.id===x);return u_(F,P)};y=R?`Deber\xEDan estar conectados: ${w(L)} y ${w(T)}.`:`No deber\xEDan estar conectados: ${w(L)} y ${w(T)}.`}return{ok:!1,msg:y,map:h_(t,n)}}function h_(i,e){let t={},n=new Set;for(let s of i){let r=e.find(a=>!n.has(a.id)&&ce[a.type].sig(a)===ce[s.type].sig(s));r&&(n.add(r.id),t[s.id]=r.id)}return t}function Qd(i,e){let t=ce[i.type];if(e.type!==i.type||t.sig(e)!==t.sig(i))return!1;if(!t.board)return!0;let n=Tn(i),s=Tn(e);return!n||!s?!1:(t.perms||[t.pins.map(r=>r[0])]).some(r=>t.pins.every(([a],o)=>Ri(n[a])===Ri(s[r[o]])))}function Ia(i,e,t,n){return n=n||Ls(i,{structural:!0}),n.find(qd(e))===n.find(qd(t))}var u_,qp=vt(()=>{Is();Ra();Sa();u_=(i,e)=>{let t=ce[i.type],n=t.pinNames?.[e];return`${t.label(i)}${n?" ("+n+")":t.pins.length>1?" (pata "+e+")":""}`}});function Ns(i){return{id:i.id,type:i.type,...i.at?{at:i.at}:{pos:[...i.pos]},rot:i.rot||0,props:{...eu(ce[i.type].props||{}),...eu(i.props||{})},state:Dr(i.type),...ce[i.type].meter?{probes:{red:null,com:null}}:{}}}function tu(i,e=1/0){let t={parts:[],wires:[]};return i.steps.forEach((n,s)=>{if(!(s>=e)){if(n.place&&t.parts.push(Ns(n.place)),n.wire&&t.wires.push({...n.wire}),n.remove&&(t.wires=t.wires.filter(r=>r.id!==n.remove)),n.setMode){let r=t.parts.find(a=>a.id===n.meterPart);r&&(r.props.mode=n.setMode)}if(n.measure){let r=t.parts.find(a=>ce[a.type].meter);r&&(r.props.mode=n.measure.mode,r.probes={red:n.measure.red,com:n.measure.com})}if(n.act&&typeof n.act.test=="function"){let r=t.parts.find(a=>a.id===n.act.part);r&&(r.type==="switch"&&(r.state.closed=!0),r.type==="pot"&&(r.state.pos=n.act.test({pos:0})?0:1),r.type==="ldr"&&(r.state.light=n.act.test({light:0})?.05:.95))}if(n.act&&n.act.test==="toggled"){let r=t.parts.find(a=>a.id===n.act.part);r&&r.type==="spdt"&&(r.state.pos=1-(r.state.pos||0))}}}),t}function Xp(i,e,t){let n=i.steps[e],{model:s,map:r}=t;if(n.place){let l=new Set(Object.entries(r).filter(([h])=>h!==n.place.id).map(([,h])=>h)),c=Ns(n.place),d=r[n.place.id]&&s.parts.find(h=>h.id===r[n.place.id]);if(d&&Qd(c,d))return!0;let u=s.parts.find(h=>!l.has(h.id)&&Qd(c,h));return u?(r[n.place.id]=u.id,!0):!1}let a=t.uf||(t.uf=Ls(s,{structural:!0}));if(n.wire)return Ia(s,Nr(n.wire.a,r),Nr(n.wire.b,r),a);if(n.remove){let l=i.steps.find(c=>c.wire&&c.wire.id===n.remove).wire;return!Ia(s,Nr(l.a,r),Nr(l.b,r),a)}if(n.sim)return!!t.running;if(n.stop)return!t.running;let o=()=>s.parts.find(l=>l.id===r[n.meterPart||"M1"])||s.parts.find(l=>ce[l.type].meter);if(n.setMode){let l=o();return!!l&&l.props.mode===n.setMode}if(n.act){if(!t.running)return!1;let l=s.parts.find(c=>c.id===r[n.act.part]);return l?n.act.test==="toggled"?t.snap!=null&&JSON.stringify(l.state)!==t.snap:!!n.act.test(l.state||{}):!1}if(n.measure){if(!t.running)return!1;let l=o();if(!l||l.props.mode!==n.measure.mode||!l.probes?.red||!l.probes?.com)return!1;let c=Ia(s,l.probes.red,Nr(n.measure.red,r),a),d=Ia(s,l.probes.com,Nr(n.measure.com,r),a);if(!c||!d)return!1;let u=t.sim?.res?.[l.id]?.meter;return u?n.measure.mode==="A"?Math.abs(u.value)>1e-5:n.measure.mode==="\u03A9"?isFinite(u.value):Math.abs(u.value)>.01:!1}return!0}function nu(i,e,t={}){let n=tu(i),s=[],r=t.map||{},a=!0;for(let c of i.checks)if(c.topo){let d=jp(n,e);a=d.ok,d.map&&(r={...r,...d.map}),s.push({label:"El montaje coincide con el esquema",ok:d.ok,info:d.ok?"":d.msg})}let l={run:(c={})=>{let d=eu(e);for(let[h,p]of Object.entries(c)){let m=d.parts.find(b=>b.id===r[h]);m&&(m.state={...m.state||{},...p})}for(let h of d.parts)ce[h.type].meter&&(h.probes={red:null,com:null});let u=hl(d,{});return{get:h=>u.res[r[h]]||{},shorts:u.shorts,raw:u}}};for(let c of i.checks){if(c.topo)continue;if(c.measured){s.push({label:c.label,ok:!!t.measured?.[c.measured]});continue}if(!a){s.push({label:c.label,ok:!1,info:"Corrige primero el montaje."});continue}let d=!1,u="";try{d=!!c.fn(l),u=c.info?c.info(l):""}catch{d=!1,u="No se ha podido comprobar."}s.push({label:c.label,ok:d,info:u})}return{items:s,ok:s.every(c=>c.ok),map:r}}var eu,Nr,Yp=vt(()=>{Is();Ra();qp();Jd();eu=i=>JSON.parse(JSON.stringify(i));Nr=(i,e)=>{let t=/^p:([^:]+):(.+)$/.exec(i);return t&&e[t[1]]?`p:${e[t[1]]}:${t[2]}`:i}});var Ji,Us,p_,iu,Ur,su,ru,Zp,Jp,au=vt(()=>{Ji={codigo:"3015",nombre:"Equipos el\xE9ctricos y electr\xF3nicos",titulo:"T\xEDtulo Profesional B\xE1sico en Inform\xE1tica y Comunicaciones",norma:"Orden de 8 de noviembre de 2016 (BOJA n\xBA 241, de 19 de diciembre de 2016), Anexo IV",url:"https://www.juntadeandalucia.es/boja/2016/241/1"},Us={1:{t:"Identifica el material, herramientas y equipo necesarios para el montaje y ensamblado de equipos el\xE9ctricos y electr\xF3nicos, describiendo sus principales caracter\xEDsticas y funcionalidad.",ce:{a:"Se han identificado y clasificado los elementos y componentes tipo de un equipo el\xE9ctrico o electr\xF3nico.",b:"Se han identificado y clasificado los anclajes y sujeciones tipo (tornillos, clips, pesta\xF1as, entre otros) de un equipo el\xE9ctrico o electr\xF3nico en funci\xF3n de su aplicaci\xF3n, rigidez y estabilidad.",c:"Se han identificado y clasificado las herramientas (atornillador el\xE9ctrico, atornilladores planos y de estrella y llaves, entre otros) normalmente empleadas en el ensamblado de un equipo el\xE9ctrico o electr\xF3nico en funci\xF3n de su aplicaci\xF3n e idoneidad.",d:"Se han identificado y clasificado los diferentes medios y equipos de seguridad personal (guantes de protecci\xF3n, gafas y mascarilla, entre otros) en funci\xF3n de su aplicaci\xF3n y teniendo en cuenta las herramientas a utilizar."}},2:{t:"Determina la secuencia de las operaciones de montaje y desmontaje de equipos el\xE9ctricos y electr\xF3nicos, interpretando esquemas e identificando los pasos a seguir.",ce:{a:"Se ha reconocido la simbolog\xEDa de representaci\xF3n gr\xE1fica de los elementos y componentes de los equipos el\xE9ctricos y electr\xF3nicos.",b:"Se ha interpretado el procedimiento y secuencia de montaje/conexi\xF3n, a partir de esquemas o gu\xEDas de montaje.",c:"Se ha identificado cada uno de los elementos representados en el esquema con el elemento real.",d:"Se ha identificado el procedimiento y secuencia de montaje/conexi\xF3n de los distintos elementos (inserci\xF3n de tarjetas, fijaci\xF3n de elementos, entre otros).",e:"Se ha definido el proceso y secuencia de montaje/conexi\xF3n a partir del esquema o gu\xEDa de montaje."}},3:{t:"Monta y desmonta elementos de equipos el\xE9ctricos o electr\xF3nicos, interpretando esquemas y gu\xEDas de montaje.",ce:{a:"Se han seleccionado los esquemas y gu\xEDas de montaje indicados para un modelo determinado.",b:"Se han seleccionado las herramientas indicadas en los esquemas y gu\xEDas de montaje.",c:"Se han preparado los elementos y materiales que se van a utilizar, siguiendo procedimientos normalizados.",d:"Se ha identificado la ubicaci\xF3n de los distintos elementos en el equipo.",e:"Se han ensamblado los distintos componentes siguiendo procedimientos normalizados, aplicando las normas de seguridad de los mismos.",f:"Se han fijado los componentes con los elementos de sujeci\xF3n indicados en los esquemas o gu\xEDas de montaje y aplicando el par de apriete o presi\xF3n establecidos.",g:"Se ha aplicado t\xE9cnicas de montaje de componentes y conectores electr\xF3nicos en placas de circuito impreso.",h:"Se han aplicado t\xE9cnicas de desmontaje de equipos el\xE9ctricos o electr\xF3nicos.",i:"Se han observado los requerimientos de seguridad establecidos.",j:"Se ha elaborado un informe recogiendo las actividades desarrolladas y resultados obtenidos."}},4:{t:"Conexiona elementos en equipos el\xE9ctricos o electr\xF3nicos aplicando t\xE9cnicas b\xE1sicas y verificando la continuidad.",ce:{a:"Se han seleccionado los esquemas y gu\xEDas de montaje indicados para un modelo determinado de conexi\xF3n.",b:"Se ha seleccionado las herramientas indicadas en los esquemas y gu\xEDas de conexi\xF3n.",c:"Se han dispuesto y colocado las piezas del conector y los cables.",d:"Se han dispuesto y colocado las protecciones personales y de los elementos.",e:"Se han acondicionado los cables (pelar, estirar, ordenar) siguiendo procedimientos.",f:"Se han insertado las piezas del conector en el orden correcto y unir los cables (soldar, crimpar, embornar, entre otros) de la forma establecida en el procedimiento.",g:"Se ha realizado la conexi\xF3n (soldadura, embornado, conector) seg\xFAn el procedimiento establecido (posici\xF3n de elementos, inserci\xF3n del elemento, maniobra de fijaci\xF3n, entre otros).",h:"Se han observado las medidas de seguridad en la utilizaci\xF3n de equipos y herramientas.",i:"Se han dispuesto y colocado las etiquetas en los cables, seg\xFAn el procedimiento establecido.",j:"Se han tratado los residuos generados de acuerdo a la normativa sobre medioambiente."}},5:{t:"Realiza el mantenimiento b\xE1sico de equipos el\xE9ctricos y electr\xF3nicos, aplicando las t\xE9cnicas establecidas en condiciones de calidad y seguridad.",ce:{a:"Se han seleccionado los esquemas y gu\xEDas indicados para un modelo determinado.",b:"Se han seleccionado las herramientas seg\xFAn las operaciones a realizar.",c:"Se han identificado los elementos a sustituir.",d:"Se han acopiado los elementos de sustituci\xF3n.",e:"Se han seleccionado las herramientas necesarias para las operaciones a realizar.",f:"Se han desmontado los elementos a sustituir, empleando las t\xE9cnicas y herramientas apropiadas seg\xFAn los requerimientos de cada intervenci\xF3n.",g:"Se han montado los elementos de sustituci\xF3n, empleando las t\xE9cnicas y herramientas apropiadas seg\xFAn los requerimientos de cada intervenci\xF3n.",h:"Se han realizado las operaciones observando las medidas de seguridad previstas para los componentes y personales.",i:"Se ha elaborado un informe con las operaciones realizadas en un documento con el formato establecido."}}},p_="https://espressif.github.io/arduino-esp32/package_esp32_index.json",iu=[["Instala Arduino IDE 2","Desc\xE1rgalo gratis de <b>arduino.cc/en/software</b> (Windows, macOS o Linux) e inst\xE1lalo con las opciones por defecto."],["A\xF1ade las placas ESP32",`Abre <b>Archivo \u2192 Preferencias</b>. En \xABURLs adicionales de gestor de placas\xBB pega:<br><code class="url">${p_}</code><br>Pulsa <b>Aceptar</b>.`],["Instala el paquete \xABesp32\xBB","Abre <b>Herramientas \u2192 Placa \u2192 Gestor de placas</b>, busca <b>esp32</b> y pulsa <b>Instalar</b> en \xABesp32 by Espressif Systems\xBB (versi\xF3n 3.x; probado con la 3.3). Tarda unos minutos."],["Instala el driver CH340","La ESP32 Plus usa el chip USB <b>CH340</b>. En Windows, si al conectar la placa no aparece ning\xFAn puerto COM nuevo, instala el driver \xABCH341SER\xBB de <b>wch-ic.com</b> (en Linux y macOS recientes ya viene incluido). Usa un cable USB-B que transmita datos."],["Selecciona la placa","En <b>Herramientas \u2192 Placa \u2192 esp32</b> elige <b>\xABESP32 Dev Module\xBB</b>."],["Selecciona el puerto","Conecta la placa por USB y elige en <b>Herramientas \u2192 Puerto</b> el puerto que aparece (COM3, COM4\u2026 en Windows; /dev/ttyUSB0 en Linux). Si dudas, desconecta la placa: el puerto que desaparece es el suyo."],["Instala las librer\xEDas de la pr\xE1ctica","Abre <b>Herramientas \u2192 Gestionar bibliotecas\u2026</b> (o el icono de libros), busca cada librer\xEDa por su nombre exacto e inst\xE1lala. Si pregunta por instalar dependencias, pulsa <b>\xABInstalar todo\xBB</b>."],["Sube el programa","Abre el archivo <b>.ino</b> de la pr\xE1ctica (o pega el c\xF3digo), pulsa <b>\u2713 Verificar</b> y despu\xE9s <b>\u2192 Subir</b>. Normalmente la placa entra sola en modo de carga. Si se queda en \xABConnecting\u2026\xBB y falla: prueba otro cable o puerto USB; como \xFAltimo recurso une con un cable M-M el agujero <b>0</b> y un <b>GND</b> del conector POWER, pulsa <b>RESET</b>, sube el programa y quita el cable."],["Abre el Monitor Serie","Pulsa la lupa (arriba a la derecha) y elige <b>115200 baudios</b> abajo a la derecha. Ah\xED ver\xE1s los mensajes de la placa."]],Ur={lcd:{n:"LiquidCrystal I2C",a:"Frank de Brabander",v:"1.1.2",inc:"#include <LiquidCrystal_I2C.h>",note:"Al compilar puede avisar de que \xABpodr\xEDa ser incompatible con ESP32\xBB: es solo un aviso, funciona."},servo:{n:"ESP32Servo",a:"Kevin Harrington, John K. Bennett",v:"3.x",inc:"#include <ESP32Servo.h>"},sh110x:{n:"Adafruit SH110X",a:"Adafruit",v:"2.1.x",inc:"#include <Adafruit_SH110X.h>",note:"Instala tambi\xE9n sus dependencias (Adafruit GFX Library y Adafruit BusIO)."},gfx:{n:"Adafruit GFX Library",a:"Adafruit",v:"1.11+",inc:"#include <Adafruit_GFX.h>"},bmp:{n:"Adafruit BMP280 Library",a:"Adafruit",v:"2.6+ / 3.x",inc:"#include <Adafruit_BMP280.h>",note:"Instala tambi\xE9n \xABAdafruit Unified Sensor\xBB y \xABAdafruit BusIO\xBB."},unified:{n:"Adafruit Unified Sensor",a:"Adafruit",v:"1.1.x",inc:"(dependencia)"}},su=[["Pol\xEDmetro digital","con escalas de tensi\xF3n continua (20 V), resistencia y prueba de continuidad (pitido)"],["Ordenador con Arduino IDE 2","Windows, macOS o Linux, con el paquete \xABesp32\xBB instalado (ver \xABPreparar el PC\xBB)"],["Cable USB-A a USB-B","el de tipo \xABimpresora\xBB; debe ser de datos, no solo de carga"],["Bandeja o alfombrilla antiest\xE1tica","recomendable: trabaja sobre una superficie limpia, seca y no met\xE1lica"]],ru=["Monta y desmonta SIEMPRE con la placa desconectada (sin USB y sin portapilas). Conecta la alimentaci\xF3n solo cuando el profesor haya revisado el montaje.","Coge las placas por los bordes. No toques los pines ni el chip con los dedos: la electricidad est\xE1tica puede da\xF1arlos.","Conecta cada cable por su NOMBRE serigrafiado (G, V, S, GND, VCC\u2026) y nunca solo por su posici\xF3n: hay m\xF3dulos con los pines en otro orden.","Nunca unas directamente V (o 5V/3V3) con G (GND): es un cortocircuito.","Si algo se calienta, huele a quemado o el LED PWR se apaga, desconecta el USB inmediatamente y avisa al profesor.","Trabajamos solo con baja tensi\xF3n (\u2264 9 V). Prohibido conectar nada a la red el\xE9ctrica (230 V)."],Zp=[["Conectores G-V-S (digitales)","Dos bloques de pines macho bajo el conector azul superior. Cada columna lleva el n\xFAmero de su GPIO (18, 19, 23, 5, 13, 12 | 14, 27, 16, 17, 25, 26) y tiene 3 pines: <b>S</b> (se\xF1al, base azul, la fila junto al conector azul), <b>V</b> (alimentaci\xF3n, base roja, fila del medio) y <b>G</b> (GND, base negra, la fila m\xE1s cercana al centro de la placa)."],["Interruptor 3.3V / 5V","Elige la tensi\xF3n que sale por los pines <b>V</b> de los conectores G-V-S y del bloque I2C. Arriba (hacia el conector azul) = <b>5V</b>; abajo = <b>3.3V</b>. C\xE1mbialo SOLO con la placa desconectada."],["Bloque ANALOG (G-3V3-S)","A la izquierda del chip, 4 filas: <b>34, 35, 4 y 2</b> (de arriba abajo). Columnas: <b>G</b> (negra), <b>3V3</b> (roja, siempre 3,3 V, no depende del interruptor) y <b>S</b> (azul). Para sensores anal\xF3gicos usaremos las filas <b>34 y 35</b>, que son solo de entrada."],["Bloque I2C (G-V-SDA-SCL)","Junto al interruptor: 4 filas iguales para conectar hasta 4 m\xF3dulos I2C (pantallas, BMP280\u2026). Columnas: <b>G</b> (negra), <b>V</b> (roja), <b>SDA</b> (azul, GPIO 21) y <b>SCL</b> (blanca, GPIO 22)."],["Conector POWER (azul, abajo)","De izquierda a derecha: 0 \xB7 5V \xB7 RST \xB7 3V3 \xB7 5V \xB7 GND \xB7 GND \xB7 VIN. Aqu\xED se toman 5 V fijos, GND y VIN (la tensi\xF3n del portapilas)."],["USB-B y jack DC","USB-B: programa y alimenta la placa (5 V). Jack DC (7\u201312 V): portapilas de 6\xD7AA (9 V) cuando un motor o servo necesita m\xE1s corriente."]],Jp=[["H-H (hembra-hembra)","de pin macho de un m\xF3dulo a pin macho de la placa (G-V-S, ANALOG, I2C)"],["M-H (macho-hembra)","de pin macho de un m\xF3dulo a un agujero del conector azul de la placa (POWER: 5V, GND\u2026)"],["M-M (macho-macho)","de un agujero del conector azul a un borne de tornillo o a la protoboard"]]});var Ee,La,ou,Ki,Kp,Vr,Pi,lu,fl,Qp=vt(()=>{Tr();Hd();Sa();Is();Hp();Ra();Jd();Kd();Yp();au();Ee=i=>String(i).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),La=i=>JSON.parse(JSON.stringify(i)),ou="circ:v1:",Ki={get(i){try{return JSON.parse(localStorage.getItem(ou+i))}catch{return null}},set(i,e){try{localStorage.setItem(ou+i,JSON.stringify(e))}catch{}},del(i){try{localStorage.removeItem(ou+i)}catch{}}},Kp='<svg viewBox="0 0 40 40" class="cx-logo" aria-hidden="true"><rect x="1" y="1" width="38" height="38" rx="10" fill="#0f5e66"/><path d="M6 24h7l2.5-7 4 13 4-15 3 9h7.5" fill="none" stroke="#f5a524" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="24" r="2.6" fill="#7fe3e0"/><circle cx="34" cy="24" r="2.6" fill="#7fe3e0"/></svg>',Vr=()=>typeof window<"u"?window.PORTAL:null,Pi={rotate:"\u27F3",del:"\u{1F5D1}",home:"\u2302",top:"\u22A4",fit:"\u2922",sound:"\u{1F50A}",mute:"\u{1F507}",help:"?"},lu=class{constructor(){this.ctx=null,this.muted=!1}ensure(){if(!this.ctx)try{let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.g=this.ctx.createGain(),this.g.gain.value=0,this.g.connect(this.ctx.destination),this.o=this.ctx.createOscillator(),this.o.type="square",this.o.frequency.value=2300,this.o.connect(this.g),this.o.start()}catch{this.ctx=null}}set(e){if(!this.ctx)return;let t=this.muted?0:e*.05;Math.abs(this.g.gain.value-t)>.001&&this.g.gain.setTargetAtTime(t,this.ctx.currentTime,.02)}},fl=class{constructor(e,t={}){this.host=e,this.opts=t,this.model={parts:[],wires:[]},this.sel=null,this.running=!1,this.runtime={},this.undoS=[],this.redoS=[],this.view=null,this.pr=null,this.g=null,this.wireColor="verde",this.buzz=new lu,this.seq=1,e.innerHTML=this.shellHTML(),this.$=n=>e.querySelector(n),this.bindShell()}shellHTML(){return`<div class="cx is-home">
    <header class="cx-top">
      <a class="cx-brand" href="#eee/circuitos" title="Inicio del laboratorio">${Kp}<span class="cx-bt"><span class="cx-b1">Laboratorio de <b>Circuitos</b></span><span class="cx-b2">Monta \xB7 simula \xB7 mide</span></span></a>
      <div class="cx-ptitle" id="cxPTitle"></div>
      <div class="cx-actions">
        <button class="cx-ib" id="cxUndo" title="Deshacer (Ctrl+Z)">\u21B6</button><button class="cx-ib" id="cxRedo" title="Rehacer (Ctrl+Y)">\u21B7</button>
        <div class="cx-menu"><button class="cx-btn" id="cxFileBtn">Archivo \u25BE</button>
          <div class="cx-dd" id="cxFileDD">
            <button data-file="save">\u{1F4BE} Guardar en este navegador</button><button data-file="load">\u{1F4C2} Abrir lo guardado</button>
            <button data-file="export">\u2B07 Exportar a archivo (.json)</button><button data-file="import">\u2B06 Importar archivo\u2026</button>
            <button data-file="clear">\u{1F9F9} Nuevo montaje (vaciar)</button>
          </div></div>
        <button class="cx-sim" id="cxSim">\u25B6 Iniciar simulaci\xF3n</button>
      </div>
    </header>
    <div class="cx-crumbs"><div id="cxCrumbs"></div><div class="cx-prof" id="cxProf"></div></div>
    <div class="cx-home" id="cxHome"></div>
    <div class="cx-editor">
      <section class="cx-view" id="cxView"><div id="cxGL"></div><div id="cxLabels"></div>
        <div class="cx-tools">
          <button data-tool="rotate" title="Girar 90\xB0 (R)">${Pi.rotate}</button><button data-tool="del" title="Borrar (Supr)">${Pi.del}</button>
          <span class="sep"></span><button data-tool="home" title="Vista inicial (H)">${Pi.home}</button><button data-tool="top" title="Vista desde arriba (T)">${Pi.top}</button><button data-tool="fit" title="Ajustar al montaje (F)">${Pi.fit}</button>
          <span class="sep"></span><button data-tool="sound" title="Sonido">${Pi.sound}</button><button data-tool="help" title="Ayuda">${Pi.help}</button>
        </div>
        <div class="cx-insp" id="cxInsp"></div>
        <div class="cx-alert" id="cxAlert"></div>
        <div class="cx-toast" id="cxToast"></div>
        <div class="cx-status" id="cxStatus"></div>
        <div class="cx-tip" id="cxTip"></div>
      </section>
      <aside class="cx-side"><div class="cx-tabs" id="cxTabs"></div><div class="cx-panel" id="cxPanel"></div></aside>
    </div>
    <input type="file" id="cxFile" accept=".json,application/json" hidden>
    </div>`}bindShell(){let e=this.$;e("#cxSim").onclick=()=>this.toggleSim(),e("#cxUndo").onclick=()=>this.undo(),e("#cxRedo").onclick=()=>this.redo(),e("#cxFileBtn").onclick=t=>{t.stopPropagation(),e("#cxFileDD").classList.toggle("open")},this.host.addEventListener("click",t=>{t.target.closest(".cx-menu")||e("#cxFileDD").classList.remove("open");let n=t.target.closest("[data-file]");n&&(e("#cxFileDD").classList.remove("open"),this.fileAction(n.dataset.file));let s=t.target.closest("[data-tool]");s&&this.tool(s.dataset.tool);let r=t.target.closest("[data-cxtab]");r&&(this.tab=r.dataset.cxtab,this.renderSide());let a=t.target.closest("[data-act]");a&&this.guideAction(a.dataset.act,a);let o=t.target.closest(".cx-schem-wrap");if(o){let l=document.createElement("div");l.className="cx-overlay",l.innerHTML=o.innerHTML+'<div class="cx-ov-close">\u2715 Cerrar</div>',l.onclick=()=>l.remove(),this.host.querySelector(".cx").appendChild(l)}}),e("#cxFile").onchange=t=>{let n=t.target.files[0];n&&this.importFile(n),t.target.value=""},document.addEventListener("keydown",t=>this.onKey(t)),this.host.addEventListener("pointerdown",t=>{let n=t.target.closest("[data-add]");n&&this.isEditor()&&!this.readOnly&&this.catalogDown(t,n)})}isEditor(){return this.host.querySelector(".cx").classList.contains("is-editor")&&getComputedStyle(this.host).display!=="none"}show(e){let t=this.$(".cx");if(this.running&&this.toggleSim(!1),this.readOnly&&(this.readOnly=!1,this.rev=null,this.view=null,t.classList.remove("is-ro")),e==="home"){this.view="home",t.classList.add("is-home"),t.classList.remove("is-editor"),this.$("#cxHome").innerHTML=this.homeHTML(),this.setCrumbs(),this.pause(),this.$("#cxPTitle").innerHTML="";return}if(t.classList.remove("is-home"),t.classList.add("is-editor"),this.renderer||this.initScene(),this.view!==e){this.view=e,this.pr=Os.find(s=>s.id===e)||null,this.sel=null,this.undoS=[],this.redoS=[],this.runtime={};let n=Ki.get("auto:"+e);this.model=n?.model?this.sanitize(n.model):{parts:[],wires:[]},this.g=this.pr?{idx:0,map:{},measured:{},answers:{},snap:null,...n?.g||{}}:null,this.tab=this.pr?"guia":"comp",this.checkResult=null,this.showAnswers=!1,this.qres=null,this.seq=1+Math.max(0,...this.model.parts.map(s=>+String(s.id).replace(/\D/g,"")||0),...this.model.wires.map(s=>+String(s.id).replace(/\D/g,"")||0)),this.$("#cxPTitle").innerHTML=this.pr?`<span class="cx-pn">${this.pr.n}</span><span class="cx-ptt">${Ee(this.pr.title)}</span>`:'<span class="cx-pn">\u221E</span><span class="cx-ptt">Modo libre</span>',this.onResize(),this.sync(),this.evalGuide(!0),this.renderSide(),this.renderInsp(),this.homeView(!0),this.status(""),this.updateUndo(),n?.model?.parts?.length&&this.toast("Se ha recuperado tu \xFAltimo montaje.")}this.setCrumbs(),this.resume(),this.onResize()}setCrumbs(){let e=`<a href="#inicio">Inicio</a> \u203A <a href="#asignaturas">Asignaturas</a> \u203A <a href="#eee">${Ee(this.opts.subject||"Equipos el\xE9ctricos y electr\xF3nicos")}</a> \u203A `,t=this.view;if(t==="revision"){this.$("#cxCrumbs").innerHTML='<a href="#panel">Panel del profesor</a> \u203A <a href="#panel/entregas">Entregas</a> \u203A <span>Revisi\xF3n</span>',this.$("#cxProf").innerHTML=Vr()?.chipHTML?.()||"";return}this.$("#cxCrumbs").innerHTML=e+(t==="home"?"<span>Circuitos</span>":`<a href="#eee/circuitos">Circuitos</a> \u203A <span>${this.pr?"Pr\xE1ctica "+this.pr.n+": "+Ee(this.pr.title):"Modo libre"}</span>`),this.$("#cxProf").innerHTML=(this.opts.profesor?`Profesor: <b>${Ee(this.opts.profesor)}</b>`:"")+(Vr()?.chipHTML?.()||"")}homeHTML(){let e=n=>Ki.get("done:"+n),t=n=>Ki.get("auto:"+n)?.model?.parts?.length;return`<div class="cx-hwrap">
      <section class="cx-hero"><div><h1>Laboratorio de <span>Circuitos</span></h1>
        <p>Monta circuitos el\xE9ctricos en una <b>protoboard 3D</b>, pulsa <b>\u25B6 Iniciar simulaci\xF3n</b> y comprueba c\xF3mo se encienden los LED, lucen las bombillas, gira el motor o suena el zumbador. Mide con el <b>pol\xEDmetro</b> como en el taller, sin miedo a romper nada.</p>
        <div class="cx-hbtns"><a class="cx-sim big" href="#eee/circuitos/c1">Empezar por la pr\xE1ctica 1 \u2192</a><a class="cx-btn big" href="#eee/circuitos/libre">Modo libre</a></div></div>
        <div class="cx-hero-art">${Kp}</div></section>
      <h2>Pr\xE1cticas guiadas <small>de dificultad creciente</small></h2>
      <div class="cx-cards">${Os.map(n=>`<a class="cx-card ${e(n.id)?"done":""}" href="#eee/circuitos/${n.id}">
        <div class="cx-card-h"><span class="cx-num">${n.n}</span><span class="cx-ic">${n.icon}</span>${e(n.id)?'<span class="cx-badge ok">\u2714 Completada</span>':t(n.id)?'<span class="cx-badge">En curso</span>':""}</div>
        <h3>${Ee(n.title)}</h3><div class="cx-sub">${Ee(n.sub)}</div>
        <div class="cx-meta"><span>${Ee(n.level)}</span><span>\u23F1 ${Ee(n.duration)}</span><span>${Object.keys(n.ra).map(s=>"RA"+s).join(" \xB7 ")}</span></div></a>`).join("")}
        <a class="cx-card free" href="#eee/circuitos/libre"><div class="cx-card-h"><span class="cx-num">\u221E</span><span class="cx-ic">\u{1F6E0}\uFE0F</span></div><h3>Modo libre</h3><div class="cx-sub">Monta lo que quieras con todos los componentes</div><div class="cx-meta"><span>Sin gu\xEDa</span><span>Guarda y exporta</span></div></a>
      </div>
      <h2>C\xF3mo se usa</h2>
      <div class="cx-how">
        <div><b>1 \xB7 Coloca</b>Arrastra un componente desde el panel de la derecha hasta la protoboard. Se pincha solo en los agujeros. <kbd>R</kbd> lo gira, <kbd>Supr</kbd> lo borra.</div>
        <div><b>2 \xB7 Cablea</b>Haz clic en un agujero o borne y despu\xE9s en otro: aparece un cable. Cambia su color con las teclas <kbd>0</kbd>\u2013<kbd>9</kbd>.</div>
        <div><b>3 \xB7 Simula</b>Pulsa <b>\u25B6 Iniciar simulaci\xF3n</b>. Haz clic en interruptores y pulsadores; mueve potenci\xF3metros y la luz de la LDR desde su panel.</div>
        <div><b>4 \xB7 Mide</b>Saca el pol\xEDmetro, elige V, A u \u03A9 y arrastra sus puntas roja y negra. Tensi\xF3n en paralelo, corriente en serie.</div>
        <div><b>Protoboard</b>Los 5 agujeros de cada columna (a\u2013e y f\u2013j) est\xE1n unidos por dentro. Los carriles + (rojo) y \u2212 (azul) est\xE1n unidos a lo largo.</div>
        <div><b>C\xE1mara</b>Arrastra para girar, rueda o pellizco para acercar, bot\xF3n derecho o dos dedos para desplazar. <kbd>T</kbd> vista desde arriba.</div>
      </div>
      <h2>Relaci\xF3n con el m\xF3dulo 3015</h2>
      <div class="cx-tblw"><table class="cx-tbl"><tr><th>Pr\xE1ctica</th>${[1,2,3,4,5].map(n=>`<th title="${Ee(Us[n].t)}">RA${n}</th>`).join("")}</tr>
        ${Os.map(n=>`<tr><td>${n.n}. ${Ee(n.title)}</td>${[1,2,3,4,5].map(s=>`<td class="c">${n.ra[s]?n.ra[s].join(", "):""}</td>`).join("")}</tr>`).join("")}</table></div>
      <p class="cx-muted">${[1,2,3,4,5].map(n=>`<b>RA${n}</b>: ${Ee($p[n])}`).join(" \xB7 ")}. Letras = criterios de evaluaci\xF3n. Orden de 8 de noviembre de 2016 (BOJA n\xBA 241), Anexo IV.</p>
      <p class="cx-muted">El simulador es una aproximaci\xF3n did\xE1ctica en corriente continua: los valores son muy cercanos a los reales, pero no sustituye las normas de seguridad del taller.</p>
    </div>`}initScene(){let e=this.$("#cxGL"),t=this.renderer=new bs({antialias:!0});t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),t.shadowMap.enabled=!0,t.shadowMap.type=ya,t.outputColorSpace=kt,t.toneMapping=Er,t.toneMappingExposure=1,e.appendChild(t.domElement);let n=this.scene=new vs;n.background=new Be(14543336);let s=this.camera=new cn(36,1,1,3e3),r=this.controls=new Cr(s,t.domElement);r.addEventListener("start",()=>{this.userCam=!0}),r.enableDamping=!0,r.dampingFactor=.12,r.maxPolarAngle=Math.PI*.47,r.minDistance=12,r.maxDistance=260,r.screenSpacePanning=!0,r.mouseButtons={LEFT:Xn.ROTATE,MIDDLE:Xn.DOLLY,RIGHT:Xn.PAN},r.touches={ONE:ci.ROTATE,TWO:ci.DOLLY_PAN},n.add(new As(16777215,9413539,1.35));let a=new Ci(16777215,2);a.position.set(-40,95,55),a.castShadow=!0,a.shadow.mapSize.set(2048,2048),Object.assign(a.shadow.camera,{left:-70,right:70,top:70,bottom:-70,near:10,far:300}),a.shadow.bias=-8e-4,a.shadow.radius=3,n.add(a);let o=new Ci(14677759,.55);o.position.set(60,40,-50),n.add(o);let l=new Oe(new Ht(800,800),new lt({color:15134702,roughness:.95}));l.rotation.x=-Math.PI/2,l.receiveShadow=!0,n.add(l);let c=new Mr(400,160,13228760,14017505);c.position.y=.02,n.add(c),n.add(Bp()),this.partsG=new Ue,this.wiresG=new Ue,this.probesG=new Ue,this.ghostG=new Ue,this.fxG=new Ue,n.add(this.partsG,this.wiresG,this.probesG,this.ghostG,this.fxG),this.objs=new Map,this.wobjs=new Map,this.terms=[];let d=new ba(.32,.5,24);d.rotateX(-Math.PI/2),this.hoverRings=new ua(d,new tn({color:1623146,transparent:!0,opacity:.95,depthWrite:!1}),40),this.hoverRings.count=0,this.hoverRings.renderOrder=3,this.hoverRings.frustumCulled=!1,n.add(this.hoverRings);let u=new ba(.42,.72,28);u.rotateX(-Math.PI/2),this.guideRings=new ua(u,new tn({color:16777215,transparent:!0,opacity:.95,depthWrite:!1}),16),this.guideRings.count=0,this.guideRings.renderOrder=3,this.guideRings.frustumCulled=!1,n.add(this.guideRings),this.guideRings.setColorAt(0,new Be(16777215)),this.ghostMat=new lt({color:16098596,transparent:!0,opacity:.42,emissive:16098596,emissiveIntensity:.35,depthWrite:!1}),this.ray=new Ko,this.ndc=new K,this.clock=new Sr,this.t=0,this.labels=[];let h=t.domElement;h.style.touchAction="none",h.addEventListener("pointerdown",p=>this.onDown(p),!0),h.addEventListener("pointermove",p=>this.onMove(p)),window.addEventListener("pointerup",p=>this.onUp(p)),window.addEventListener("pointercancel",p=>this.onUp(p)),h.addEventListener("pointerleave",()=>{!this.drag&&!this.pdrag&&(this.hoverRings.count=0,this.$("#cxTip").style.display="none")}),h.addEventListener("contextmenu",p=>p.preventDefault()),h.addEventListener("wheel",p=>{let m=this.sel?.kind==="part"&&this.part(this.sel.id);if(m&&m.type==="pot"&&this.hitPart(p)===m.id){p.preventDefault(),p.stopImmediatePropagation(),m.state.pos=Math.max(0,Math.min(1,(m.state.pos??.5)+(p.deltaY>0?.04:-.04))),this.stateChanged(m);let b=this.$("#cxInsp input[type=range]");b&&(b.value=m.state.pos)}},{capture:!0,passive:!1}),new ResizeObserver(()=>this.onResize()).observe(this.$("#cxView")),this.makeThumbs()}onResize(){if(!this.renderer)return;let e=this.$("#cxView"),t=e.clientWidth||800,n=e.clientHeight||600;this.renderer.setSize(t,n,!1),this.renderer.domElement.style.width=t+"px",this.renderer.domElement.style.height=n+"px";let s=this.camera.aspect;this.camera.aspect=t/n,this.camera.updateProjectionMatrix(),!this.userCam&&Math.abs(s-t/n)>.02&&this.view&&this.view!=="home"&&this.homeView(!0)}pause(){this.renderer?.setAnimationLoop(null)}resume(){this.renderer?.setAnimationLoop(()=>this.frame())}bounds(){let e=new jt(new E(-32,0,-Xi/2-1),new E(32,3.4,Xi/2+1)),t=n=>{if(ce[n.type].board)return;let[s,r]=ce[n.type].size,a=Math.max(s,r)/2;e.expandByPoint(new E(n.pos[0]-a,0,n.pos[1]-a)),e.expandByPoint(new E(n.pos[0]+a,4,n.pos[1]+a))};if(this.model.parts.forEach(t),this.pr)for(let n of this.pr.steps)n.place&&n.place.pos&&t(n.place);return e}homeView(e,t){let n=this.bounds(),s=n.getCenter(new E),r=n.getSize(new E),a=this.camera.aspect||1.6,o=this.camera.fov*Math.PI/180,c=Math.max(r.z*(t?1.15:1.4),r.x*1.12/a)/2/Math.tan(o/2)+(t?4:10),d=t?new E(0,1,1e-4):new E(0,1.15,.85).normalize();this.userCam=!1,s.y=0,this.camera.position.copy(s).addScaledVector(d,c),this.controls.target.copy(s),this.camera.lookAt(s),this.controls.update()}makeThumbs(){if(this.thumbs)return;this.thumbs={};let e;try{e=new bs({antialias:!0,alpha:!0,preserveDrawingBuffer:!0})}catch{return}e.setSize(150,110),e.outputColorSpace=kt,e.toneMapping=Er;let t=new vs;t.add(new As(16777215,8952234,1.6));let n=new Ci(16777215,1.8);n.position.set(-30,60,40),t.add(n);let s=new cn(30,150/110,.5,500);for(let r of Object.keys(ce)){let a={id:"T",type:r,props:La(ce[r].props||{}),state:Dr(r),at:"a1",rot:0},o=Aa(a);ce[r].board&&(o.position.y=-3.4),o.traverse(u=>{u.isSprite&&(u.visible=!1)}),t.add(o),o.updateMatrixWorld(!0);let l=new jt;o.traverse(u=>{u.isMesh&&u.visible&&u.material.opacity!==0&&l.expandByObject(u)});let c=l.getCenter(new E),d=l.getSize(new E).length();s.position.copy(c).add(new E(.55,.8,.9).normalize().multiplyScalar(d*1.6)),s.lookAt(c),e.render(t,s),this.thumbs[r]=e.domElement.toDataURL("image/png"),t.remove(o)}e.dispose(),e.forceContextLoss?.()}part(e){return this.model.parts.find(t=>t.id===e)}newId(e){return e+this.seq++}sanitize(e){e=e&&typeof e=="object"?e:{};let t=(l,c)=>(typeof l=="number"||typeof l=="string")&&isFinite(+l)&&String(l).trim()!==""?+l:c,n=(l,c)=>{let d={};for(let[u,h]of Object.entries(c)){let p=l?.[u];d[u]=p===void 0?h:typeof h=="number"?t(p,h):typeof h=="boolean"?!!p:String(p).replace(/[^\p{L}\p{N}Ω .,+-]/gu,"").slice(0,24)}return d},s=l=>typeof l=="string"&&/^[\w-]{1,16}$/.test(l),r=(l,c)=>Array.isArray(l)&&l.length===2?[t(l[0],c[0]),t(l[1],c[1])]:c,a=(Array.isArray(e.parts)?e.parts:[]).filter(l=>l&&ce[l.type]&&s(l.id)&&(ce[l.type].board?typeof l.at=="string"&&!!Ts(l.at):Array.isArray(l.pos))).slice(0,200).map(l=>{let c=ce[l.type],d={id:l.id,type:l.type,rot:(t(l.rot,0)|0)&3,props:n(l.props,c.props||{}),state:n(l.state,Dr(l.type))};return c.board?d.at=l.at:d.pos=r(l.pos,[0,0]),d}),o=l=>typeof l=="string"&&l.length<40&&(l.startsWith("h:")?!!Ts(l.slice(2)):a.some(c=>l.startsWith("p:"+c.id+":")&&/^[\w.+-]{1,12}$/.test(l.slice(c.id.length+3))));for(let l of a)if(ce[l.type].meter){let c=(Array.isArray(e.parts)?e.parts:[]).find(d=>d&&d.id===l.id)||{};l.probes={red:o(c.probes?.red)?c.probes.red:null,com:o(c.probes?.com)?c.probes.com:null},l.park={red:r(c.park?.red,[4,15]),com:r(c.park?.com,[-4,15])}}return{parts:a,wires:(Array.isArray(e.wires)?e.wires:[]).filter(l=>l&&o(l.a)&&o(l.b)).slice(0,400).map((l,c)=>({id:s(String(l.id))?String(l.id):"w"+(900+c),a:l.a,b:l.b,color:dl[l.color]?l.color:"verde"}))}}termWorld(e){if(e.startsWith("h:")){let c=Yn(e.slice(2));return new E(c.x,3.4,c.z)}let[,t,n]=e.split(":"),s=this.part(t);if(!s)return new E;let r=ce[s.type];if(r.board){let c=Tn(s),d=c&&c[n];if(d){let u=Yn(d);return new E(u.x,3.4,u.z)}return new E}let a=r.pins.find(c=>c[0]===n),[o,l]=Rs(a[1],a[2],s.rot||0);return new E(s.pos[0]+o,a[3],s.pos[1]+l)}termName(e){if(e.startsWith("h:"))return Yi(e.slice(2));let[,t,n]=e.split(":"),s=this.part(t);if(!s)return e;let r=ce[s.type];return`${r.label(s)} \xB7 ${r.pinNames?.[n]||n}`}occupied(e){let t=new Map;for(let n of this.model.parts){if(n.id===e||!ce[n.type].board)continue;let s=Tn(n);if(s)for(let r in s)t.set(s[r],n.id)}for(let n of this.model.wires)for(let s of[n.a,n.b])s.startsWith("h:")&&t.set(s.slice(2),n.id);return t}boardValid(e,t){let n=Tn(e);if(!n)return!1;let s=this.occupied(t);return Object.values(n).every(r=>!s.has(r))}tableValid(e,t){let n=this.footRect(e),s=(r,a)=>r.x1<a.x2&&r.x2>a.x1&&r.z1<a.z2&&r.z2>a.z1;return s(n,{x1:-Pr/2-.5,x2:Pr/2+.5,z1:-Xi/2-.5,z2:Xi/2+.5})?!1:!this.model.parts.some(r=>r.id!==t&&!ce[r.type].board&&s(n,this.footRect(r)))}footRect(e){let[t,n]=ce[e.type].size;return(e.rot||0)%2&&([t,n]=[n,t]),{x1:e.pos[0]-t/2,x2:e.pos[0]+t/2,z1:e.pos[1]-n/2,z2:e.pos[1]+n/2}}pinCentroid(e,t){let n=ce[e].pins,s=0,r=0;for(let[,a,o]of n){let[l,c]=Rs(a,o,t);s+=l,r+=c}return[s/n.length,r/n.length]}snapshot(){return JSON.stringify(this.model)}commit(e){return this.readOnly?(this.toast("Revisi\xF3n de una entrega: el montaje es de solo lectura."),!1):this.running&&!this._liveOK?(this.toast("Det\xE9n la simulaci\xF3n para cambiar el montaje."),!1):(this.undoS.push(this.snapshot()),this.undoS.length>120&&this.undoS.shift(),this.redoS=[],e(),this.afterChange(),!0)}afterChange(){this.sync(),this.autosave(),this.evalGuide(),this.renderInsp(),this.updateUndo(),this._force=!0}undo(){this.readOnly||this.running||!this.undoS.length||(this.redoS.push(this.snapshot()),this.model=JSON.parse(this.undoS.pop()),this.sel=null,this.afterChange())}redo(){this.readOnly||this.running||!this.redoS.length||(this.undoS.push(this.snapshot()),this.model=JSON.parse(this.redoS.pop()),this.sel=null,this.afterChange())}updateUndo(){this.$("#cxUndo").disabled=this.readOnly||this.running||!this.undoS.length,this.$("#cxRedo").disabled=this.readOnly||this.running||!this.redoS.length}autosave(){clearTimeout(this._as),this._as=setTimeout(()=>this.saveNow(),250)}saveNow(){!this.readOnly&&this.view&&this.view!=="home"&&Ki.set("auto:"+this.view,{model:this.model,g:this.g?{idx:this.g.idx,map:this.g.map,measured:this.g.measured,answers:this.g.answers}:null})}sync(){if(!this.renderer)return;let e=new Set;this.terms=[];for(let n of this.model.parts){e.add(n.id);let s=JSON.stringify([n.type,n.at,n.pos,n.rot,n.props]),r=this.objs.get(n.id);if(!r||r.key!==s){r&&(r.box&&(this.fxG.remove(r.box),r.box=null),this.disposeObj(this.partsG,r.g));let a=Aa(n);a.userData.partId=n.id,this.place(a,n),this.partsG.add(a),r={key:s,g:a,hits:Fp(n,a)},this.objs.set(n.id,r)}r.g.userData.update?.(this.lastSim?.res?.[n.id]||{},this.runtime[n.id]||{},this.t,0),this.terms.push(...r.hits)}for(let[n,s]of this.objs)e.has(n)||(s.box&&this.fxG.remove(s.box),this.disposeObj(this.partsG,s.g),this.objs.delete(n));let t=new Set;for(let n of this.model.wires){t.add(n.id);let s=this.termWorld(n.a),r=this.termWorld(n.b),a=this.sel?.kind==="wire"&&this.sel.id===n.id,o=[n.color,s.toArray().map(c=>c.toFixed(2)),r.toArray().map(c=>c.toFixed(2)),a].join("|"),l=this.wobjs.get(n.id);if(!l||l.key!==o){l&&this.disposeObj(this.wiresG,l.g);let c=Ta(s,r,Ca(n.color));a&&c.add(Ta(s,r,"#ffffff",{mat:new tn({color:1352616,transparent:!0,opacity:.35,depthWrite:!1}),r:.6})),c.traverse(d=>d.userData.wireId=n.id),this.wiresG.add(c),this.wobjs.set(n.id,l={key:o,g:c})}}for(let[n,s]of this.wobjs)t.has(n)||(this.disposeObj(this.wiresG,s.g),this.wobjs.delete(n));this.syncProbes(),this.syncSelection(),this.updateGhost()}place(e,t){if(ce[t.type].board){let n=Yn(t.at)||{x:0,z:0};e.position.set(n.x,0,n.z)}else e.position.set(t.pos[0],0,t.pos[1]);e.rotation.y=-(t.rot||0)*Math.PI/2}disposeObj(e,t){e.remove(t),t.traverse(n=>{n.geometry&&n.geometry.dispose()})}syncProbes(){for(let e of[...this.probesG.children])this.disposeObj(this.probesG,e);for(let e of this.model.parts)if(ce[e.type].meter)for(let[t,n]of[["red",14032928],["com",1842204]]){let s=this.probeTip(e,t),r=zp(n);r.position.copy(s).setY(s.y+.25),r.traverse(u=>u.userData.probe={id:e.id,pin:t}),this.probesG.add(r);let a=this.termWorld(`p:${e.id}:${t}`).setY(2.7),o=s.clone().setY(s.y+5),l=a.clone().lerp(o,.5);l.y=Math.max(a.y,o.y)+3;let c=new Ti([a,a.clone().setY(a.y+2),l,o.clone().setY(o.y+1.5),o]),d=new Oe(new jn(c,30,.2,6),Ie(n,{roughness:.5}));d.castShadow=!0,this.probesG.add(d)}}probeTip(e,t){if(this.pdrag&&this.pdrag.id===e.id&&this.pdrag.pin===t&&this.pdrag.pos)return this.pdrag.pos.clone();let n=e.probes?.[t];if(n)return this.termWorld(n);let s=e.park?.[t]||(t==="red"?[4,15]:[-4,15]);return new E(e.pos[0]+s[0],0,e.pos[1]+s[1])}syncSelection(){for(let[e,t]of this.objs){let n=this.sel?.kind==="part"&&this.sel.id===e;n&&!t.box&&(t.box=new Qo(t.g.userData.inner,1352616),t.box.material.depthTest=!1,t.box.material.transparent=!0,t.box.renderOrder=4,this.fxG.add(t.box)),n&&t.box&&t.box.update(),!n&&t.box&&(this.fxG.remove(t.box),t.box.geometry.dispose(),t.box=null)}}frame(){let e=Math.min(.1,this.clock.getDelta());if(this.t+=e,this.running&&this.simStep(e),this.controls.update(),this.guideRings.count){let t=1+.25*Math.sin(this.t*6),n=new ut,s=new E,r=new pn,a=new E;for(let o=0;o<this.guideRings.count;o++){this.guideRings.getMatrixAt(o,n),n.decompose(s,r,a);let l=t*(this.ringScale?.[o]||1);n.compose(s,r,a.set(l,1,l)),this.guideRings.setMatrixAt(o,n)}this.guideRings.instanceMatrix.needsUpdate=!0}this.ghostG.children.length&&(this.ghostMat.opacity=.3+.16*Math.sin(this.t*5)),this.renderer.render(this.scene,this.camera),this.layoutLabels()}simStep(e){this._acc=(this._acc||0)+e;let t=this.model.parts.some(o=>o.type==="cap");if(this._acc<1/30&&!this._force){this.animParts(e);return}let n=Math.max(this._acc,1/60);this._acc=0,this._force=!1;let s=hl(this.model,this.runtime,{dt:t?n:1/0,capV:this.capV,don:this.don});this.capV=s.capV,this.don=s.don,this.lastSim=s;for(let o of this.model.parts){let l=s.res[o.id]||{},c=this.runtime[o.id]||(this.runtime[o.id]={});(o.type==="led"||o.type==="diode")&&l.burn&&!c.burnt&&(c.acc=(c.acc||0)+n,c.acc>.15&&(c.burnt=!0,this.smoke(o),this.toast(o.type==="led"?"\u{1F4A5} \xA1El LED se ha fundido! Le ha pasado demasiada corriente: pon una resistencia en serie.":"\u{1F4A5} El diodo se ha quemado.",5e3),this._force=!0)),o.type==="bulb"&&l.burn&&!c.burnt&&(c.burnt=!0,this.smoke(o),this.toast("\u{1F4A5} La bombilla se ha fundido: recibe demasiada tensi\xF3n.",5e3),this._force=!0),ce[o.type].meter&&l.meter?.over&&!c.fuse&&(c.fuse=!0,this.toast("\u26A0 Se ha fundido el fusible del pol\xEDmetro: has medido corriente (A) en paralelo. La corriente se mide en serie.",6e3),this._force=!0)}let r=s.warnings.map(o=>o.msg);for(let o of this.model.parts)o.type==="led"&&this.runtime[o.id]?.burnt&&r.push("LED fundido: det\xE9n la simulaci\xF3n, revisa el circuito y vuelve a probar.");for(let o of this.model.parts)ce[o.type].meter&&s.res[o.id]?.meter?.powered&&o.props.mode==="\u03A9"&&r.push("Para medir resistencias (\u03A9) quita la alimentaci\xF3n: con tensi\xF3n la medida no es fiable y el pol\xEDmetro se puede da\xF1ar.");this.setAlert([...new Set(r)]);let a=0;for(let o of this.model.parts)o.type==="buzzer"&&s.res[o.id]?.on&&(a=Math.max(a,s.res[o.id].vol));this.buzz.set(a),this.animParts(n),this._gacc=(this._gacc||0)+n,this._gacc>.25&&(this._gacc=0,this.evalGuide(),this.updateInspLive())}animParts(e){let t=this.lastSim;for(let n of this.model.parts)this.objs.get(n.id)?.g.userData.update?.(t?.res?.[n.id]||{},this.runtime[n.id]||{},this.t,e)}toggleSim(e){let t=e??!this.running;if(t!==this.running){if(t)this.cancelWire(),this.cancelDrag(),this.running=!0,this.runtime={},this.capV={},this.don={},this.lastSim=null,this._force=!0,this.buzz.ensure(),this.buzz.ctx?.resume?.(),this.$("#cxSim").classList.add("on"),this.$("#cxSim").innerHTML="\u25A0 Detener simulaci\xF3n",this.$(".cx").classList.add("sim-on"),this.status("Simulaci\xF3n en marcha: haz clic en interruptores y pulsadores, ajusta potenci\xF3metros y la LDR en su panel, y coloca las puntas del pol\xEDmetro."),this.simStep(1/30);else{this.running=!1,this.runtime={},this.lastSim=null,this.buzz.set(0),this.$("#cxSim").classList.remove("on"),this.$("#cxSim").innerHTML="\u25B6 Iniciar simulaci\xF3n",this.$(".cx").classList.remove("sim-on");for(let n of this.model.parts)n.type==="button"&&n.state&&(n.state.pressed=!1);this.setAlert([]),this.status("");for(let n of this.model.parts)this.objs.get(n.id)?.g.userData.update?.({},{},0,0)}this.updateUndo(),this.evalGuide(),this.renderInsp(),this.updateGhost()}}smoke(e){let t=this.objs.get(e.id);if(!t)return;let n=new E;t.g.getWorldPosition(n);for(let s=0;s<6;s++){let r=new xs(new ji({color:5592405,transparent:!0,opacity:.6,depthWrite:!1}));r.position.copy(n).add(new E(.5,3.4+4,0)),r.scale.setScalar(1.2),this.fxG.add(r);let a=performance.now()+s*120,o=()=>{let l=(performance.now()-a)/1600;if(l<0)return requestAnimationFrame(o);if(l>1){this.fxG.remove(r);return}r.position.y+=.06,r.position.x+=Math.sin(l*9+s)*.02,r.scale.setScalar(1.2+l*3),r.material.opacity=.6*(1-l),requestAnimationFrame(o)};o()}}setNDC(e){let t=this.renderer.domElement.getBoundingClientRect();this.ndc.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1),this.ray.setFromCamera(this.ndc,this.camera)}hitPart(e){e&&this.setNDC(e);let t=this.ray.intersectObjects(this.partsG.children,!0).find(s=>!s.object.userData.term&&s.object.isMesh);if(!t)return null;let n=t.object;for(;n&&!n.userData.partId;)n=n.parent;return n?.userData.partId||null}hitProbe(){let e=this.ray.intersectObjects(this.probesG.children,!0).find(t=>t.object.userData.probe);return e?e.object.userData.probe:null}hitTerm(){let e=this.ray.intersectObjects(this.terms,!1)[0];return e?e.object.userData.term:null}hitWire(){let e=this.ray.intersectObjects(this.wiresG.children,!0)[0];return e?e.object.userData.wireId:null}planeAt(e){let t=new E;return this.ray.ray.intersectPlane(new wn(new E(0,1,0),-e),t)?t:null}holeUnder(){let e=this.planeAt(3.4);return!e||Math.abs(e.x)>Pr/2||Math.abs(e.z)>Xi/2?null:Cs(e.x,e.z,.5)}onDown(e){if(!this.isEditor()||this.readOnly&&!this.running)return;if(this.setNDC(e),this.down={x:e.clientX,y:e.clientY,moved:!1,id:e.pointerId},e.button===2){this.wiring&&(this.cancelWire(),this.controls.enabled=!1,this.down.consumed=!0);return}if(e.button!==0)return;let t=this.readOnly?null:this.hitProbe();if(t){this.controls.enabled=!1,this.pdrag={...t,pos:null},this.select({kind:"part",id:t.id});return}let n=this.running?null:this.hitTerm();if(n){this.controls.enabled=!1,this.down.term=n;return}if(this.wiring){let a=this.holeUnder();if(a&&!this.occupied().has(a)){this.controls.enabled=!1,this.down.hole=a;return}}let s=this.hitPart();if(s){this.controls.enabled=!1,this.down.part=s;let a=this.part(s);this.running&&a.type==="button"&&(a.state.pressed=!0,this.pressing=a,this.stateChanged(a,!0));return}let r=this.hitWire();r&&(this.down.wire=r),this.down.hole=this.holeUnder(),this.wiring&&this.down.hole&&(this.controls.enabled=!1)}onMove(e){if(!(!this.renderer||!this.isEditor())){if(this.setNDC(e),this.lastPtr=e,this.down&&Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)>5&&(this.down.moved=!0),this.pdrag){this.moveProbe();return}if(!this.cat){if(!this.readOnly&&this.down?.part&&this.down.moved&&(!this.running||ce[this.part(this.down.part)?.type]?.meter)&&!this.drag&&this.beginDrag(this.part(this.down.part),!1),this.drag){this.updateDrag();return}(!this.down||!this.down.moved)&&this.hover()}}}onUp(e){if(!this.renderer)return;if(!this.down&&!this.drag&&!this.pdrag){this.controls.enabled=!0;return}let t=this.down||{};if(this.down=null,this.pressing&&(this.pressing.state.pressed=!1,this.stateChanged(this.pressing,!0),this.pressing=null),this.pdrag){this.finishProbe(),this.controls.enabled=!0;return}if(this.drag&&!this.cat){this.finishDrag(),this.controls.enabled=!0;return}if(this.controls.enabled=!0,!(t.consumed||t.moved)){if(t.part){let n=this.part(t.part);this.running&&n&&(n.type==="switch"||n.type==="spdt")&&(n.type==="switch"?n.state.closed=!n.state.closed:n.state.pos=n.state.pos?0:1,this.stateChanged(n,!0)),this.select({kind:"part",id:t.part});return}if(!this.running&&(t.term||t.hole)){this.wireClick(t.term||"h:"+t.hole);return}if(t.wire){this.select({kind:"wire",id:t.wire});return}if(this.wiring){this.cancelWire();return}this.select(null)}}stateChanged(e,t){this._force=!0,this.objs.get(e.id)?.g.userData.update?.(this.lastSim?.res?.[e.id]||{},this.runtime[e.id]||{},this.t,0),this.autosave(),this.evalGuide(),t?this.renderInsp():this.updateInspLive()}hover(){let e=this.$("#cxTip"),t=null,n="",s=this.running?null:this.hitTerm();if(s)n=Ee(this.termName(s));else{let r=this.hitPart();if(r){let a=this.part(r);n="<b>"+Ee(ce[a.type].label(a))+"</b>"+(this.running?this.liveText(a,!0):"")}else t=this.holeUnder(),t&&(n=`<b>${Ee(Yi(t))}</b> \xB7 unido con: ${Ee(Cp(Ri(t)))}`)}if(this.showStrip(t),this.wiring&&this.rubber(s?this.termWorld(s):t?this.termWorld("h:"+t):this.planeAt(3.4)||this.planeAt(0)),n&&this.lastPtr){let r=this.$("#cxView").getBoundingClientRect();e.innerHTML=n,e.style.display="block",e.style.left=Math.min(r.width-220,this.lastPtr.clientX-r.left+14)+"px",e.style.top=this.lastPtr.clientY-r.top+16+"px"}else e.style.display="none"}showStrip(e){let t=new ut,n=0;if(e)for(let s of Tp(Ri(e))){let r=Yn(s);if(t.makeTranslation(r.x,3.4+.03,r.z),s===e&&t.scale(new E(1.35,1,1.35)),this.hoverRings.setMatrixAt(n++,t),n>=40)break}this.hoverRings.count=n,this.hoverRings.instanceMatrix.needsUpdate=!0}canEndAt(e){if(!e.startsWith("h:"))return!0;let t=e.slice(2);return this.occupied().has(t)?(this.toast(`El agujero ${Yi(t)} ya est\xE1 ocupado. Usa otro agujero de la misma columna: est\xE1n unidos por dentro.`),!1):!0}autoColor(e){return/:\+$|^h:(tp|bp)/.test(e)?"rojo":/:-$|^h:(tn|bn)/.test(e)?"negro":null}wireClick(e){if(!this.wiring){if(!this.canEndAt(e))return;this.wiring={a:e,color:this.autoColor(e)||this.wireColor},this.status(`Cable desde <b>${Ee(this.termName(e))}</b>. Haz clic en el destino (Esc o clic derecho para cancelar).`),this.rubber(this.termWorld(e));return}if(e===this.wiring.a){this.cancelWire();return}if(!this.canEndAt(e))return;let t=this.wiring.a,n=this.autoColor(t)||this.autoColor(e)||this.wiring.color;this.cancelWire();let s=this.newId("w");this.commit(()=>this.model.wires.push({id:s,a:t,b:e,color:n})),this.select({kind:"wire",id:s}),this.status("Cable colocado. Pulsa una tecla del <b>0</b> al <b>9</b> para cambiar su color.")}rubber(e){!this.wiring||!e||(this.rubberObj&&this.disposeObj(this.fxG,this.rubberObj),this.rubberObj=Ta(this.termWorld(this.wiring.a),e,Ca(this.wiring.color),{mat:Ie(new Be(Ca(this.wiring.color)).getHex(),{transparent:!0,opacity:.7}),r:.28}),this.fxG.add(this.rubberObj))}cancelWire(){!this.wiring&&!this.rubberObj||(this.wiring=null,this.rubberObj&&(this.disposeObj(this.fxG,this.rubberObj),this.rubberObj=null),this.status(""))}setWireColor(e){if(this.wireColor=e,this.sel?.kind==="wire"&&!this.running){let t=this.model.wires.find(n=>n.id===this.sel.id);t&&t.color!==e&&this.commit(()=>{t.color=e})}this.wiring&&(this.wiring.color=e),this.renderInsp()}probeTarget(){let e=this.hitTerm();if(e)return{key:e,pos:this.termWorld(e)};let t=this.holeUnder();return t?{key:"h:"+t,pos:this.termWorld("h:"+t)}:{key:null,pos:this.planeAt(0)}}moveProbe(){let e=this.probeTarget();e.pos&&(this.pdrag.pos=e.pos,this.pdrag.key=e.key,this.showStrip(e.key?.startsWith("h:")?e.key.slice(2):null),this.syncProbes())}finishProbe(){let e=this.pdrag;this.pdrag=null;let t=this.part(e.id);if(t){if(!e.pos){this.syncProbes();return}this.setProbe(t,e.pin,e.key,e.pos)}}setProbe(e,t,n,s){let r=this._liveOK;this._liveOK=!0,this.commit(()=>{e.probes=e.probes||{},e.probes[t]=n||null,!n&&s&&(e.park=e.park||{},e.park[t]=[+(s.x-e.pos[0]).toFixed(2),+(s.z-e.pos[1]).toFixed(2)])}),this._liveOK=r,this._force=!0,this.showStrip(null),n&&this.status(`Punta ${t==="red"?"roja":"negra"} en <b>${Ee(this.termName(n))}</b>.`)}catalogDown(e,t){if(this.running&&t.dataset.add!=="meter"){this.toast("Det\xE9n la simulaci\xF3n para a\xF1adir componentes (el pol\xEDmetro s\xED se puede sacar).");return}if(e.button!==void 0&&e.button!==0)return;e.preventDefault();let n=t.dataset.add,s=t.dataset.props?JSON.parse(t.dataset.props):{};this.cat={type:n,props:s,x:e.clientX,y:e.clientY,moved:!1};let r=o=>{if(!this.cat)return;Math.hypot(o.clientX-this.cat.x,o.clientY-this.cat.y)>6&&(this.cat.moved=!0);let l=this.renderer.domElement.getBoundingClientRect(),c=o.clientX>=l.left&&o.clientX<=l.right&&o.clientY>=l.top&&o.clientY<=l.bottom;this.setNDC(o),c&&this.cat.moved&&!this.drag&&this.beginDrag(this.freshPart(n,s),!0),this.drag&&(this.drag.outside=!c,this.drag.g.visible=c,this.drag.shadow.visible=c,this.updateDrag())},a=()=>{document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",a),document.removeEventListener("pointercancel",a);let o=this.cat;if(this.cat=null,this.drag){this.drag.outside?this.cancelDrag():this.finishDrag();return}o&&!o.moved&&this.autoPlace(this.freshPart(n,s))};document.addEventListener("pointermove",r),document.addEventListener("pointerup",a),document.addEventListener("pointercancel",a)}freshPart(e,t={}){let n=ce[e],r={id:this.newId({resistor:"R",led:"LED",diode:"D",bulb:"L",button:"P",switch:"S",spdt:"C",pot:"POT",ldr:"LDR",buzzer:"Z",cap:"CP",bat9:"B",aa2:"B",aa4:"B",supply:"F",motor:"MOT",meter:"M"}[e]||"X"),type:e,rot:0,props:{...La(n.props||{}),...t},state:Dr(e)};return n.board?r.at="a1":r.pos=[0,0],n.meter&&(r.probes={red:null,com:null},r.park={red:[4,15],com:[-4,15]}),r}autoPlace(e,t){let n=ce[e.type];if(t)e.rot=t.rot||0,n.board?e.at=t.at:e.pos=[...t.pos];else if(n.board){let r=[];for(let o of["c","h","b","g","d","i","a","f","e","j"])for(let l=0;l<30;l++){let c=15+(l%2?-1:1)*Math.ceil(l/2);c>=1&&c<=30&&r.push(o+c)}if(!r.find(o=>(e.at=o,this.boardValid(e))))return this.toast("No queda sitio libre en la protoboard."),null}else{let r=[];for(let o=0;o<6;o++)for(let[l,c]of[[-30,0],[30,0],[-30,-16],[30,-16],[-30,16],[30,16],[0,-26],[0,26],[-48,0],[48,0]])r.push([l*(1+o*.4),c*(1+o*.25)]);r.find(o=>(e.pos=o,this.tableValid(e)))||(e.pos=[0,40])}let s=this._liveOK;return n.meter&&(this._liveOK=!0),this.commit(()=>this.model.parts.push(e)),this._liveOK=s,this.select({kind:"part",id:e.id}),n.board||this.ensureVisible(e),e}ensureVisible(e){let[t,n]=ce[e.type].size;[[-t/2,-n/2],[t/2,-n/2],[-t/2,n/2],[t/2,n/2]].some(([a,o])=>{let l=new E(e.pos[0]+a,12,e.pos[1]+o).project(this.camera);return Math.abs(l.x)>.97||Math.abs(l.y)>.97})&&this.homeView()}beginDrag(e,t){if(!e)return;this.cancelWire();let n=t?Aa(e):this.objs.get(e.id).g;t&&(n.userData.partId=e.id,this.fxG.add(n));let s=La(e),r=ce[e.type],a=this.planeAt(r.board?3.4:0),o=[0,0];if(!t&&a){let c=this.partCenter(s);o=[c[0]-a.x,c[1]-a.z]}let l=new Oe(new Ht(1,1),new tn({color:1623146,transparent:!0,opacity:.35,depthWrite:!1}));l.rotation.x=-Math.PI/2,l.renderOrder=2,this.fxG.add(l),this.drag={p:s,orig:e,isNew:t,g:n,off:o,shadow:l,valid:!1},t||this.select({kind:"part",id:e.id},!0),this.status("Suelta la pieza en la protoboard. <b>R</b> o \u27F3 la gira."),this.updateGhost(),this.updateDrag()}partCenter(e){if(!ce[e.type].board)return[...e.pos];let n=Yn(e.at),[s,r]=this.pinCentroid(e.type,e.rot||0);return[n.x+s,n.z+r]}updateDrag(){let e=this.drag;if(!e)return;let t=e.p,n=ce[t.type],s=this.planeAt(n.board?3.4:0);if(!s)return;let r=s.x+e.off[0],a=s.z+e.off[1];if(n.board){let[o,l]=this.pinCentroid(t.type,t.rot||0),c=r-o,d=a-l,u=Cs(c,d,.5);if(!u){let b=null,g=1.6;for(let f of[-1,1,-2,2]){let A=Cs(c,d+f,.5);if(A){let S=Yn(A),y=Math.hypot(S.x-c,S.z-d);y<g&&(g=y,b=A)}}u=b}if(u){t.at=u,e.valid=this.boardValid(t,e.isNew?null:t.id);let b=Yn(u);e.g.position.set(b.x,0,b.z),e.shadow.position.set(b.x+o,3.4+.05,b.z+l)}else e.valid=!1,e.g.position.set(c,0,d),e.shadow.position.set(r,3.4+.05,a);e.g.rotation.y=-(t.rot||0)*Math.PI/2;let[h,p]=this.partFoot(t);e.shadow.scale.set(h,p,1);let m=e.valid?Tn(t):null;this.status(m?"Patas en: <b>"+Object.values(m).map(b=>Ee(Yi(b))).join(" \xB7 ")+"</b>":"Busca agujeros libres en la protoboard.")}else{t.pos=[Math.round(r*2)/2,Math.round(a*2)/2],e.g.position.set(t.pos[0],0,t.pos[1]),e.g.rotation.y=-(t.rot||0)*Math.PI/2,e.valid=this.tableValid(t,e.isNew?null:t.id);let o=this.footRect(t);e.shadow.scale.set(o.x2-o.x1,o.z2-o.z1,1),e.shadow.position.set(t.pos[0],.06,t.pos[1])}e.shadow.material.color.set(e.valid?1623146:14694462)}partFoot(e){let n=ce[e.type].pins.map(([,a,o])=>Rs(a,o,e.rot||0)),s=n.map(a=>a[0]),r=n.map(a=>a[1]);return[Math.max(...s)-Math.min(...s)+1.6,Math.max(...r)-Math.min(...r)+1.6]}finishDrag(){let e=this.drag;if(this.drag=null,!e)return;if(this.disposeObj(this.fxG,e.shadow),e.isNew&&this.disposeObj(this.fxG,e.g),!e.valid){e.isNew||this.place(e.g,e.orig),this.toast(ce[e.p.type].board?"Ah\xED no se puede: pincha la pieza en agujeros libres de la protoboard.":"Ah\xED no cabe: deja las piezas de mesa fuera de la protoboard y sin solaparse."),this.status(""),this.updateGhost();return}let t=this._liveOK;ce[e.p.type].meter&&(this._liveOK=!0),e.isNew?(this.commit(()=>this.model.parts.push(e.p)),this.select({kind:"part",id:e.p.id})):this.commit(()=>{let n=this.part(e.p.id);n.rot=e.p.rot,ce[n.type].board?n.at=e.p.at:n.pos=e.p.pos}),this._liveOK=t,this.status("")}cancelDrag(){let e=this.drag;this.drag=null,e&&(this.disposeObj(this.fxG,e.shadow),e.isNew?this.disposeObj(this.fxG,e.g):this.place(e.g,e.orig),this.status(""),this.updateGhost())}rotateSel(){if(this.drag){this.drag.p.rot=((this.drag.p.rot||0)+1)%4,this.updateDrag();return}if(this.sel?.kind!=="part")return this.toast("Selecciona primero una pieza para girarla.");if(this.running)return this.toast("Det\xE9n la simulaci\xF3n para girar piezas.");let e=this.part(this.sel.id),t=ce[e.type],n=La(e);if(n.rot=((e.rot||0)+1)%4,t.board){let[s,r]=this.partCenter(e),[a,o]=this.pinCentroid(n.type,n.rot);if(![[0,0],[.5,.5],[-.5,-.5],[.5,-.5],[-.5,.5],[1,0],[-1,0],[0,1],[0,-1],[1.5,.5],[-1.5,-.5],[0,2],[0,-2]].find(([d,u])=>{let h=Cs(s-a+d,r-o+u,.3);return h?(n.at=h,this.boardValid(n,e.id)):!1}))return this.toast("No cabe girada en ese sitio. Mu\xE9vela a una zona m\xE1s despejada.")}else if(!this.tableValid(n,e.id))return this.toast("No cabe girada ah\xED.");this.commit(()=>{e.rot=n.rot,t.board&&(e.at=n.at)})}deleteSel(){if(!this.sel)return this.toast("Selecciona una pieza o un cable para borrarlo.");if(this.running)return this.toast("Det\xE9n la simulaci\xF3n para borrar.");let e=this.sel;this.select(null,!0),this.commit(()=>{if(e.kind==="wire")this.model.wires=this.model.wires.filter(t=>t.id!==e.id);else{this.model.parts=this.model.parts.filter(t=>t.id!==e.id),this.model.wires=this.model.wires.filter(t=>!t.a.startsWith("p:"+e.id+":")&&!t.b.startsWith("p:"+e.id+":"));for(let t of this.model.parts)if(t.probes)for(let n of["red","com"])t.probes[n]?.startsWith("p:"+e.id+":")&&(t.probes[n]=null)}})}select(e,t){let n=this.sel?.kind==="wire";this.sel=e,this.renderer&&(n||e?.kind==="wire"?this.sync():this.syncSelection()),t||this.renderInsp()}tool(e){e==="rotate"?this.rotateSel():e==="del"?this.deleteSel():e==="home"||e==="fit"?this.homeView():e==="top"?this.homeView(!1,!0):e==="sound"?(this.buzz.muted=!this.buzz.muted,this.host.querySelector('[data-tool="sound"]').textContent=this.buzz.muted?Pi.mute:Pi.sound):e==="help"&&(this.tab="ayuda",this.renderSide())}onKey(e){if(!this.isEditor()||e.target.closest?.("input,textarea,select"))return;let t=e.key;if((e.ctrlKey||e.metaKey)&&t.toLowerCase()==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if((e.ctrlKey||e.metaKey)&&t.toLowerCase()==="y"){e.preventDefault(),this.redo();return}e.ctrlKey||e.metaKey||e.altKey||(t==="r"||t==="R"?this.rotateSel():t==="Delete"||t==="Backspace"?(e.preventDefault(),this.deleteSel()):t==="Escape"?(this.cancelWire(),this.cancelDrag(),this.select(null)):t==="h"||t==="H"||t==="f"||t==="F"?this.homeView():t==="t"||t==="T"?this.homeView(!1,!0):/^[0-9]$/.test(t)&&this.setWireColor(Ma[+t][0]))}status(e){let t=this.$("#cxStatus");t.innerHTML=e||(this.running?"Simulaci\xF3n en marcha.":this.readOnly?"Revisi\xF3n de una entrega \xB7 <b>solo lectura</b>: gira la vista y pulsa \u25B6 Iniciar simulaci\xF3n para verla funcionar.":"Arrastra componentes desde el panel \xB7 clic en un agujero y luego en otro para tender un cable \xB7 <b>R</b> girar \xB7 <b>Supr</b> borrar")}toast(e,t=3200){let n=this.$("#cxToast");n.innerHTML=e,n.classList.add("show"),clearTimeout(this._tt),this._tt=setTimeout(()=>n.classList.remove("show"),t)}setAlert(e){let t=this.$("#cxAlert"),n=e.join("|");n!==this._alk&&(this._alk=n,t.innerHTML=e.map(s=>`<div>\u26A0 ${Ee(s)}</div>`).join(""),t.style.display=e.length?"block":"none")}liveText(e,t){let n=this.lastSim?.res?.[e.id];if(!n)return"";let s=o=>Ea(o,"V"),r=o=>Ea(o,"A"),a="";switch(e.type){case"resistor":a=`V = ${s(Math.abs(n.v))} \xB7 I = ${r(Math.abs(n.i))} \xB7 P = ${Ea(Math.abs(n.p),"W")}`;break;case"led":a=this.runtime[e.id]?.burnt?"\u{1F4A5} Fundido":`V = ${s(n.v)} \xB7 I = ${r(Math.max(0,n.i))} \xB7 ${n.on?n.over?"\u26A0 demasiada corriente":"encendido":"apagado"}`;break;case"bulb":a=this.runtime[e.id]?.burnt?"\u{1F4A5} Fundida":`V = ${s(Math.abs(n.v))} \xB7 I = ${r(Math.abs(n.i))} \xB7 brillo ${Math.round(Math.min(1,n.bright)*100)} %`;break;case"motor":a=`V = ${s(n.v)} \xB7 I = ${r(n.i)} \xB7 ${Math.abs(n.speed)>.05?n.speed>0?"gira \u21BB":"gira \u21BA":"parado"}`;break;case"buzzer":a=`V = ${s(n.v)} \xB7 I = ${r(Math.max(0,n.i))} \xB7 ${n.on?"\u{1F50A} suena":"en silencio"}`;break;case"diode":a=`V = ${s(n.v)} \xB7 I = ${r(Math.max(0,n.i))}`;break;case"pot":a=`V(1\u2192cursor) = ${s(Math.abs(n.v1w))} \xB7 V(cursor\u21922) = ${s(Math.abs(n.vw2))}`;break;case"ldr":a=`R = ${Ps(Math.pow(10,6-3.3*(e.state?.light??.5)))} \xB7 I = ${r(Math.abs(n.i))}`;break;case"cap":a=`V = ${s(n.v)}`;break;case"meter":a=n.meter?`Lectura: ${n.meter.text}`:"";break;default:ce[e.type].source&&(a=n.short?"\u26A0 CORTOCIRCUITO":`V = ${s(n.v)} \xB7 I = ${r(n.i)}`)}return a?(t?"<br>":"")+Ee(a):""}renderInsp(){let e=this.$("#cxInsp");if(!e)return;let t=this.sel;if(!t){e.style.display="none",e.innerHTML="";return}if(t.kind==="wire"){let a=this.model.wires.find(o=>o.id===t.id);if(!a){e.style.display="none";return}e.style.display="block",e.innerHTML=`<div class="cx-ih"><b>Cable</b><button class="cx-x" data-act="desel" title="Cerrar">\u2715</button></div>
        <div class="cx-small">De <b>${Ee(this.termName(a.a))}</b><br>a <b>${Ee(this.termName(a.b))}</b></div>
        <div class="cx-lab">Color (teclas 0\u20139)</div><div class="cx-colors">${Ma.map(([o,l],c)=>`<button title="${o} (${c})" class="${a.color===o?"on":""}" style="background:${l}" data-wcolor="${o}" ${this.running?"disabled":""}></button>`).join("")}</div>
        <div class="cx-ibtns"><button class="cx-btn" data-tool="del" ${this.running?"disabled":""}>\u{1F5D1} Borrar cable</button></div>`,e.querySelectorAll("[data-wcolor]").forEach(o=>o.onclick=()=>this.setWireColor(o.dataset.wcolor));return}let n=this.part(t.id);if(!n){e.style.display="none";return}let s=ce[n.type];e.style.display="block";let r=`<div class="cx-ih"><b>${Ee(s.name)}</b><span class="cx-id">${Ee(n.id)}</span><button class="cx-x" data-act="desel" title="Cerrar">\u2715</button></div><div class="cx-small">${Ee(s.desc)}</div>`;for(let a of s.ui||[]){let o=a.state?n.state?.[a.k]:n.props[a.k],l=this.running&&!a.live?"disabled":"";if(r+=`<div class="cx-lab">${Ee(a.label)}</div>`,a.type==="res"){let c=ul(o);r+=`<div class="cx-row"><select data-prop="r" ${l}>${Wd.map(d=>`<option value="${d}" ${d===o?"selected":""}>${Ps(d)}</option>`).join("")}${Wd.includes(o)?"":`<option selected value="${o}">${Ps(o)}</option>`}</select>
          <input type="number" min="1" max="10000000" step="1" value="${o}" data-prop="r" title="Otro valor en \u03A9" ${l}><span class="cx-unit">\u03A9</span></div>
          <div class="cx-bands">${c.hex.map((d,u)=>`<span style="background:${d}" title="${c.names[u]}"></span>`).join("")}<em>${c.names.join(" \xB7 ")} (\xB15 %)</em></div>`}else a.type==="select"?r+=`<select data-prop="${a.k}" ${l}>${a.options.map(c=>`<option value="${c}" ${String(c)===String(o)?"selected":""}>${a.fmt?a.fmt(c):c}</option>`).join("")}</select>`:a.type==="range"?r+=`<div class="cx-row"><span class="cx-mini">${n.type==="ldr"?"\u{1F311}":"\u25C0"}</span><input type="range" min="0" max="1" step="0.01" value="${o??.5}" data-state="${a.k}"><span class="cx-mini">${n.type==="ldr"?"\u2600\uFE0F":"\u25B6"}</span></div>`:a.type==="number"?r+=`<div class="cx-row"><input type="number" min="${a.min}" max="${a.max}" step="${a.step}" value="${o}" data-prop="${a.k}"><span class="cx-unit">V</span></div>`:a.type==="seg"&&(r+=`<div class="cx-seg">${a.options.map(c=>`<button data-seg="${a.k}" data-v="${c}" class="${o===c?"on":""}">${c}</button>`).join("")}</div>`)}(n.type==="switch"||n.type==="spdt")&&(r+=`<div class="cx-ibtns"><button class="cx-btn" data-act="toggle">\u21C4 Cambiar posici\xF3n</button><span class="cx-small">${Ee(s.label(n))}</span></div>`),n.type==="button"&&(r+='<div class="cx-small">Con la simulaci\xF3n en marcha, mant\xE9n pulsado el bot\xF3n con el rat\xF3n o el dedo.</div>'),s.meter&&(r+='<div class="cx-small">Arrastra la <b style="color:#d62020">punta roja</b> y la <b>punta negra</b> hasta los agujeros o bornes que quieras medir.</div><div class="cx-ibtns"><button class="cx-btn" data-act="parkprobes">\u21A9 Recoger puntas</button></div>'),s.pinNames&&(r+=`<div class="cx-small cx-pins">${Object.values(s.pinNames).map(a=>`<span>${Ee(a)}</span>`).join("")}</div>`),r+=`<div class="cx-live" id="cxLive">${this.running?this.liveText(n):""}</div>`,r+=`<div class="cx-ibtns"><button class="cx-btn" data-tool="rotate" ${this.running?"disabled":""}>\u27F3 Girar</button><button class="cx-btn" data-tool="del" ${this.running?"disabled":""}>\u{1F5D1} Borrar</button></div>`,e.innerHTML=r,e.querySelectorAll("[data-prop]").forEach(a=>a.onchange=()=>{let o=a.dataset.prop,l=a.value;n.type==="resistor"?l=Math.max(1,Math.min(1e7,Math.round(+l)||220)):n.type==="supply"?l=Math.max(0,Math.min(12,+l||0)):(n.type==="pot"||n.type==="cap")&&(l=+l),this._liveOK=this.running,this.commit(()=>{n.props[o]=l}),this._liveOK=!1,this._force=!0}),e.querySelectorAll("[data-state]").forEach(a=>{a.oninput=()=>{n.state[a.dataset.state]=+a.value,this.stateChanged(n)}}),e.querySelectorAll("[data-seg]").forEach(a=>a.onclick=()=>{this._liveOK=!0,this.commit(()=>{n.props[a.dataset.seg]=a.dataset.v}),this._liveOK=!1,this.runtime[n.id]&&(this.runtime[n.id].fuse=!1),this._force=!0})}updateInspLive(){let e=this.$("#cxLive");if(e&&this.sel?.kind==="part"){let t=this.part(this.sel.id);t&&(e.innerHTML=this.running?this.liveText(t):"")}}renderSide(){let e=[];this.readOnly?e.push(["rev","\u{1F4DD} Entrega"],["ayuda","\u2754 Ayuda"]):(this.pr&&e.push(["guia","\u{1F4D8} Pr\xE1ctica"]),e.push(["comp","\u{1F9E9} Componentes"],["ayuda","\u2754 Ayuda"])),e.some(n=>n[0]===this.tab)||(this.tab=e[0][0]),this.$("#cxTabs").innerHTML=e.map(([n,s])=>`<button data-cxtab="${n}" class="${n===this.tab?"on":""}">${s}</button>`).join("");let t=this.$("#cxPanel");t.innerHTML=this.tab==="rev"?this.reviewHTML():this.tab==="comp"?this.compHTML():this.tab==="ayuda"?this.helpHTML():this.guideHTML(),t.querySelectorAll("[data-q]").forEach(n=>n.oninput=n.onchange=()=>{let s=n.dataset.q;this.g.answers[s]=n.type==="radio"?+n.value:n.value,this.autosave()})}thumb(e){return this.thumbs?.[e]?`<img src="${this.thumbs[e]}" alt="" draggable="false">`:`<span class="cx-noimg">${Ee(ce[e].name[0])}</span>`}compHTML(){return'<p class="cx-small">Arrastra un componente hasta la protoboard (o haz clic y se colocar\xE1 en un hueco libre).</p>'+Rp.map(e=>`<h4>${e}</h4><div class="cx-grid">${Object.entries(ce).filter(([,t])=>t.cat===e).map(([t,n])=>`<button class="cx-comp" data-add="${t}" title="${Ee(n.desc)}">${this.thumb(t)}<span>${Ee(n.name)}</span></button>`).join("")}</div>`).join("")}helpHTML(){return`<h4>Montar</h4><ul class="cx-ul"><li><b>Colocar:</b> arrastra un componente desde \xABComponentes\xBB. La sombra verde indica que cabe; roja, que no.</li><li><b>Girar:</b> tecla <kbd>R</kbd> o \u27F3 (tambi\xE9n mientras arrastras).</li><li><b>Mover:</b> arrastra la pieza. <b>Borrar:</b> <kbd>Supr</kbd> o \u{1F5D1}.</li><li><b>Deshacer / rehacer:</b> <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Y</kbd>.</li></ul>
    <h4>Cables</h4><ul class="cx-ul"><li>Clic en un agujero (o en el borne de una pila, fuente o motor) y clic en el destino.</li><li>Si una pieza tapa el agujero que quieres usar, pulsa <kbd>T</kbd> para ver la protoboard desde arriba.</li><li>Desde el + sale rojo y desde el \u2212 negro; si no, el color elegido. Cambia el color con <kbd>0</kbd>\u2013<kbd>9</kbd>: ${Ma.map(([e,t],n)=>`<span class="sw" style="background:${t}" title="${e}"></span>${n}`).join(" ")}</li><li>Al pasar el rat\xF3n por un agujero se iluminan en verde los que est\xE1n unidos con \xE9l.</li></ul>
    <h4>Simular y medir</h4><ul class="cx-ul"><li><b>\u25B6 Iniciar simulaci\xF3n</b>: los componentes reaccionan. Para cambiar el montaje, detenla.</li><li>Clic en interruptores y conmutadores; mant\xE9n pulsados los pulsadores. Potenci\xF3metro y LDR se ajustan en su panel (o con la rueda del rat\xF3n sobre el potenci\xF3metro).</li><li><b>Pol\xEDmetro:</b> V en paralelo, A en serie (abriendo el circuito), \u03A9 sin alimentaci\xF3n.</li><li>Avisos: cortocircuito, LED fundido, bombilla fundida, resistencia caliente y fusible del pol\xEDmetro.</li></ul>
    <h4>Guardar</h4><ul class="cx-ul"><li>El montaje se guarda solo en este navegador. En <b>Archivo</b> puedes guardar una copia, exportarla a un archivo .json y abrirla en otro ordenador.</li></ul>
    <h4>C\xE1mara</h4><ul class="cx-ul"><li>Arrastra para girar, rueda o pellizco para acercar, bot\xF3n derecho o dos dedos para desplazar. <kbd>H</kbd> vista inicial, <kbd>T</kbd> desde arriba.</li></ul>`}stepText(e){if(e.place){let t=Ns(e.place),n=ce[t.type];if(n.board){let s=Tn(t);return Object.entries(s).map(([r,a])=>`${n.pinNames?.[r]?Ee(n.pinNames[r])+": ":""}<b>${Ee(Yi(a))}</b>`).join(" \xB7 ")}return"en la mesa, donde quieras"}return e.wire?`<span class="sw" style="background:${Ca(e.wire.color)}"></span> ${Ee(this.solName(e.wire.a))} \u2192 ${Ee(this.solName(e.wire.b))}`:""}solName(e){if(e.startsWith("h:"))return Yi(e.slice(2));let[,t,n]=e.split(":"),s=this.pr.steps.find(a=>a.place?.id===t);if(!s)return e;let r=Ns(s.place);return ce[r.type].name+" \xB7 "+(ce[r.type].pinNames?.[n]||n)}guideHTML(){let e=this.pr,t=this.g;if(!e)return"";let n=e.steps.length,s=Math.min(t.idx,n),r=Object.entries(e.ra).map(([o,l])=>`<div class="cx-ra"><b>RA${o}</b> ${Ee(Us[o].t)}<ul>${l.map(c=>`<li><b>${c})</b> ${Ee(Us[o].ce[c])}</li>`).join("")}</ul></div>`).join(""),a=`<div class="cx-gh"><span class="cx-num">${e.n}</span><div><h3>${Ee(e.title)}</h3><div class="cx-small">${Ee(e.sub)} \xB7 ${Ee(e.level)} \xB7 \u23F1 ${Ee(e.duration)}</div></div></div>
      <div class="cx-prog"><div style="width:${Math.round(s/n*100)}%"></div><span>${s} / ${n} pasos</span></div>
      <details ${t.idx===0?"open":""}><summary>\u{1F3AF} Objetivo y teor\xEDa</summary><p>${Ee(e.objetivo)}</p><p class="cx-theory">${e.teoria}</p></details>
      <details ${t.idx===0?"open":""}><summary>\u{1F4D0} Esquema el\xE9ctrico</summary><div class="cx-schem-wrap" title="Clic para ampliar">${e.schem()}</div></details>
      <details><summary>\u{1F9F0} Material</summary><table class="cx-tbl">${e.material.map(([o,l])=>`<tr><td>${Ee(o)}</td><td class="c">${l}</td></tr>`).join("")}</table></details>
      <details><summary>\u{1F4CB} Resultados de aprendizaje</summary>${r}<p class="cx-small">M\xF3dulo 3015 \xB7 Orden de 8-11-2016, BOJA 241, Anexo IV.</p></details>
      <h4>Pasos</h4><ol class="cx-steps">`;if(e.steps.forEach((o,l)=>{let c=l<t.idx?"done":l===t.idx?"cur":"todo";if(a+=`<li class="${c}" ${l===t.idx?'id="cxCur"':""}><div class="cx-sh"><span class="cx-sn">${l<t.idx?"\u2714":l+1}</span><b>${Ee(o.t||"")}</b></div>`,l===t.idx){let d=this.stepText(o);if(a+=`<div class="cx-sb"><p>${o.text||""}</p>${d?`<div class="cx-where">\u{1F4CD} ${d}</div>`:""}`,o.place){let u=o.place;a+=`<button class="cx-comp inline" data-add="${u.type}" data-props='${Ee(JSON.stringify(u.props||{}))}' title="Arr\xE1stralo hasta la silueta naranja">${this.thumb(u.type)}<span>Arrastra desde aqu\xED: <b>${Ee(ce[u.type].label(Ns(u)))}</b></span></button>`}o.measure&&(a+=`<div class="cx-where cx-read">\u{1F4DF} Lectura actual: <b>${Ee(this.meterText())}</b></div>`),(o.place||o.wire||o.setMode||o.remove)&&(a+='<div class="cx-ibtns"><button class="cx-btn small" data-act="autostep" title="Lo hace el simulador por ti">\u2728 Hazlo por m\xED</button></div>'),a+="</div>"}a+="</li>"}),a+="</ol>",t.idx>=n&&(a+='<div class="cx-ok">\u{1F389} \xA1Has completado todos los pasos! Ahora pulsa <b>Comprobar circuito</b>.</div>'),a+='<div class="cx-ibtns"><button class="cx-sim" data-act="check">\u2714 Comprobar circuito</button><button class="cx-btn" data-act="solution">\u{1F441} Ver soluci\xF3n</button></div>',this.checkResult){let o=this.checkResult;a+=`<div class="cx-check ${o.ok?"ok":"ko"}"><div class="cx-ch">${o.ok?"\u2705 \xA1Circuito correcto y funcionando!":"\u274C Todav\xEDa hay algo que revisar"}</div><ul>${o.items.map(l=>`<li class="${l.ok?"ok":"ko"}">${l.ok?"\u2714":"\u2716"} ${Ee(l.label)}${l.info?`<div class="cx-small">${Ee(l.info)}</div>`:""}</li>`).join("")}</ul></div>`}return a+=`<h4>Preguntas de c\xE1lculo</h4><div class="cx-qs">${e.questions.map((o,l)=>{let c=t.answers[l],d=this.qres?.[l],u=o.choices?o.choices.map((p,m)=>`<label><input type="radio" name="cxq${l}" data-q="${l}" value="${m}" ${c===m?"checked":""}> ${Ee(p)}</label>`).join(""):`<div class="cx-row"><input type="text" inputmode="decimal" data-q="${l}" value="${c!=null?Ee(c):""}" placeholder="Tu resultado"><span class="cx-unit">${o.unit}</span></div>`,h=d==null&&!this.showAnswers?"":`<div class="cx-fb ${d?"ok":d===!1?"ko":""}">${d===!0?"\u2714 \xA1Correcto! ":d===!1?"\u2716 Revisa el c\xE1lculo. ":""}${d||this.showAnswers?"Soluci\xF3n: "+o.expl:""}</div>`;return`<div class="cx-q"><div class="cx-qq">${l+1}. ${o.q}</div>${u}${h}</div>`}).join("")}</div>
    <div class="cx-ibtns"><button class="cx-btn" data-act="answers">Comprobar respuestas</button><button class="cx-btn" data-act="showans">Ver soluciones</button></div>
    <h4>Reto</h4><p>${e.reto}</p>`,Vr()?.rol==="alumno"&&(a+=`<h4>Entrega</h4><div class="cx-entrega" id="cxEntrega">${this.entregaHTML()}</div>`),a+='<div class="cx-ibtns"><button class="cx-btn small" data-act="reset">\u21BA Reiniciar pr\xE1ctica</button></div>',a}entregaHTML(){let e=Vr(),t=this.pr;if(!e||!t)return"";if(this._entregando)return'<div class="cx-ibtns"><button class="cx-sim" disabled>\u{1F4E4} Enviando\u2026</button></div>';let n=e.estadoEntrega(t.id),s=a=>a?new Date(a).toLocaleString("es-ES",{dateStyle:"short",timeStyle:"short"}):"";if(!n)return`<p class="cx-small">Cuando termines, entrega la pr\xE1ctica al profesor. Se env\xEDan tu montaje, tus respuestas y el resultado de \xABComprobar circuito\xBB, solo con tu grupo y tu n\xFAmero de lista.</p>
      <div class="cx-ibtns"><button class="cx-sim" data-act="entregar">\u{1F4E4} Entregar al profesor</button></div>`;let r=`<div class="cx-ent-ok">\u{1F4E4} <b>Entregado</b> \xB7 ${Ee(s(n.fecha))}${n.pendiente?" \xB7 enviando\u2026":""}</div>`;return n.nota!=null?r+=`<div class="cx-ent-nota">Nota: <b>${Ee(String(n.nota).replace(".",","))}</b></div>`:r+='<div class="cx-small">Pendiente de corregir.</div>',n.comentario&&(r+=`<div class="cx-ent-com">\u{1F4AC} ${Ee(n.comentario)}</div>`),n.nota==null&&(r+='<div class="cx-ibtns"><button class="cx-btn" data-act="entregar">\u21BB Volver a entregar</button></div>'),r}refreshEntrega(){let e=this.$("#cxEntrega");e&&(e.innerHTML=this.entregaHTML())}calcQres(e,t){return e.questions.map((n,s)=>{let r=t?.[s];if(r==null||r==="")return null;if(n.choices)return+r===n.ans;let a=parseFloat(String(r).replace(",","."));return isFinite(a)&&Math.abs(a-n.ans)<=Math.max(n.tol*Math.abs(n.ans),1e-9)})}entregar(){let e=Vr(),t=this.pr,n=this.g;if(!e||!t||this._entregando)return;let s=nu(t,this.model,{map:n.map,measured:n.measured});if(this.checkResult=s,!s.ok&&!(this.opts.confirm||confirm)("La comprobaci\xF3n del circuito todav\xEDa no est\xE1 bien. \xBFQuieres entregarla igualmente?")){this.renderSide();return}let r=this.calcQres(t,n.answers),a={montaje:JSON.stringify({app:"laboratorio-circuitos",version:1,practica:t.id,model:this.model}),respuestas:Object.fromEntries(Object.entries(n.answers||{}).filter(([,o])=>o!==""&&o!=null).map(([o,l])=>[o,String(l).slice(0,40)])),comprobacion:{ok:!!s.ok,items:s.items.map(o=>({t:String(o.label).slice(0,160),ok:!!o.ok}))},aciertos:`${r.filter(o=>o===!0).length}/${t.questions.length}`};this._entregando=!0,this.renderSide(),e.entregar({practica:t.id,tipo:"circuitos",titulo:`Pr\xE1ctica ${t.n}: ${t.title}`.slice(0,120),datos:a}).then(()=>this.toast("\u{1F4E4} \xA1Pr\xE1ctica entregada al profesor!",3500),o=>this.toast("\u274C No se ha podido entregar: "+Ee(o?.mensaje||"revisa la conexi\xF3n."),5e3)).finally(()=>{this._entregando=!1,this.renderSide()})}review(e){let t=this.$(".cx");this.running&&this.toggleSim(!1),t.classList.remove("is-home"),t.classList.add("is-editor","is-ro"),this.renderer||this.initScene(),this.readOnly=!0,this.view="revision",this.rev=e,this.pr=Os.find(s=>s.id===e.practica)||null,this.sel=null,this.undoS=[],this.redoS=[],this.runtime={};let n={};try{n=JSON.parse(e.montaje||"{}")}catch{n={}}this.model=this.sanitize(n&&n.model?n.model:n),this.g=this.pr?{idx:this.pr.steps.length,map:{},measured:{},answers:e.respuestas||{},snap:null}:null,this.tab="rev",this.checkResult=null,this.qres=null,this.showAnswers=!0,this.$("#cxPTitle").innerHTML=`<span class="cx-pn">${this.pr?this.pr.n:"?"}</span><span class="cx-ptt">Revisi\xF3n \xB7 ${Ee(e.quien||"")}</span>`,this.onResize(),this.sync(),this.updateGhost(),this.renderSide(),this.renderInsp(),this.homeView(!0),this.updateUndo(),this.status("Revisi\xF3n de una entrega \xB7 <b>solo lectura</b>: gira la vista y pulsa \u25B6 Iniciar simulaci\xF3n para verla funcionar."),this.setCrumbs(),this.resume(),this.onResize()}reviewHTML(){let e=this.rev,t=this.pr;if(!e)return"";let n=a=>a?new Date(a).toLocaleString("es-ES",{dateStyle:"short",timeStyle:"short"}):"",s=`<div class="cx-gh"><span class="cx-num">${t?t.n:"?"}</span><div><h3>${Ee(t?t.title:e.practica)}</h3><div class="cx-small">${Ee(e.quien||"")} \xB7 entregada ${Ee(n(e.fecha))}</div></div></div>
      <div class="cx-ibtns"><button class="cx-btn" data-act="rev-volver">\u2190 Volver a las entregas</button></div>`,r=e.comprobacion;if(r&&(s+=`<div class="cx-check ${r.ok?"ok":"ko"}"><div class="cx-ch">${r.ok?"\u2705 La comprobaci\xF3n sali\xF3 bien al entregar":"\u274C La comprobaci\xF3n no sali\xF3 bien al entregar"}</div><ul>${(r.items||[]).map(a=>`<li class="${a.ok?"ok":"ko"}">${a.ok?"\u2714":"\u2716"} ${Ee(a.t)}</li>`).join("")}</ul></div>`),t){let a=this.calcQres(t,e.respuestas||{});s+=`<h4>Preguntas de c\xE1lculo \xB7 ${a.filter(o=>o===!0).length}/${t.questions.length} correctas</h4><div class="cx-qs">${t.questions.map((o,l)=>{let c=e.respuestas?.[l],d=c==null||c===""?"\u2014":o.choices?o.choices[+c]??c:`${c} ${o.unit||""}`;return`<div class="cx-q"><div class="cx-qq">${l+1}. ${o.q}</div><div class="cx-fb ${a[l]?"ok":a[l]===!1?"ko":""}">Respuesta: <b>${Ee(String(d))}</b> ${a[l]?"\u2714":a[l]===!1?"\u2716":""}<br><span class="cx-small">Soluci\xF3n: ${o.expl}</span></div></div>`}).join("")}</div>`}return s+=`<h4>Calificaci\xF3n</h4><div class="cx-grade"><label>Nota (0\u201310) <input type="number" id="cxNota" min="0" max="10" step="0.25" value="${e.nota!=null?Ee(e.nota):""}"></label>
      <label>Comentario para el alumno <textarea id="cxCom" maxlength="1000" rows="3">${Ee(e.comentario||"")}</textarea></label>
      <div class="cx-ibtns"><button class="cx-sim" data-act="rev-guardar">\u{1F4BE} Guardar nota</button><span class="cx-small" id="cxGradeMsg"></span></div></div>`,s}meterPart(){return this.model.parts.find(e=>e.id===this.g?.map?.M1)||this.model.parts.find(e=>ce[e.type].meter)}meterText(){if(!this.running)return"inicia la simulaci\xF3n";let e=this.meterPart(),t=e&&this.lastSim?.res?.[e.id]?.meter;return t?t.text:"\u2014"}evalGuide(e){if(!this.pr||!this.g){this.updateGhost();return}let t=this.pr,n=this.g,s=n.idx,r={model:this.model,running:this.running,map:n.map,sim:this.lastSim},a=0;for(;n.idx<t.steps.length&&a++<100&&(r.snap=n.snap,r.uf=null,!!Xp(t,n.idx,r));){let l=t.steps[n.idx];l.measure&&l.key&&(n.measured[l.key]=!0),n.idx++,n.snap=this.snapFor(t.steps[n.idx])}if(n.idx!==s||e){if(n.idx!==s&&(this.autosave(),this.toast(n.idx>=t.steps.length?"\u{1F389} \xA1Pasos completados! Pulsa \xABComprobar circuito\xBB.":`\u2714 \xA1Bien! Paso ${s+1} hecho. Ahora el paso ${n.idx+1}.`,2200)),this.tab==="guia"){let l=this.$("#cxPanel"),c=l.scrollTop;this.renderSide();let d=this.$("#cxCur");d&&n.idx!==s?d.scrollIntoView({block:"nearest"}):l.scrollTop=c}this.updateGhost()}else if(this.tab==="guia"&&t.steps[n.idx]?.measure){let l=this.$("#cxCur .cx-read b");l&&(l.textContent=this.meterText())}let o=t.steps[n.idx];this.$("#cxSim").classList.toggle("pulse",!!(o&&(o.sim&&!this.running||o.stop&&this.running)))}snapFor(e){if(!e?.act||e.act.test!=="toggled")return null;let t=this.part(this.g.map[e.act.part]);return t?JSON.stringify(t.state):null}updateGhost(){if(!this.renderer)return;for(let r of[...this.ghostG.children])this.disposeObj(this.ghostG,r);this.labels.forEach(r=>r.el.remove()),this.labels=[];let e=[],t=(r,a,o,l,c=1)=>e.push([r,a,o,l,c]),n=this.pr&&this.g&&this.pr.steps[this.g.idx];if(n&&!this.drag){let r=this.g.map,a=o=>{let l=/^p:([^:]+):(.+)$/.exec(o);return l?r[l[1]]&&this.part(r[l[1]])?`p:${r[l[1]]}:${l[2]}`:null:o};if(n.place){let o=Ns(n.place),l=ce[o.type],c=Aa(o);if(c.traverse(d=>{d.isMesh&&(d.material=this.ghostMat,d.castShadow=!1),d.isSprite&&(d.visible=!1)}),this.place(c,o),this.ghostG.add(c),l.board){let d=Tn(o);for(let h of Object.values(d)){let p=Yn(h);t(p.x,3.4+.04,p.z,16098596)}let u=this.partCenter(o);this.label(new E(u[0],3.4+5.5,u[1]),`Aqu\xED: ${Object.values(d).join(" \u2013 ")}`)}else this.label(new E(o.pos[0],14,o.pos[1]),"Aqu\xED, en la mesa")}else if(n.wire||n.remove){let o=n.wire||this.pr.steps.find(d=>d.wire&&d.wire.id===n.remove).wire,l=a(o.a),c=a(o.b);if(l&&c){let d=this.termWorld(l),u=this.termWorld(c);this.ghostG.add(Ta(d,u,"#f5a524",{mat:this.ghostMat,r:.45}));for(let h of[d,u])t(h.x,h.y+.04,h.z,n.remove?14694462:16098596);this.label(d.clone().lerp(u,.5).setY(Math.max(d.y,u.y)+4),n.remove?"\u{1F5D1} Borra este cable":`Cable ${o.color}`)}}else if(n.measure)for(let[o,l,c]of[[n.measure.red,16722474,"Punta roja aqu\xED"],[n.measure.com,1118481,"Punta negra aqu\xED"]]){let d=a(o);if(!d)continue;let u=this.termWorld(d);t(u.x,u.y+.05,u.z,l,1.3),this.label(u.clone().setY(u.y+3.4),c)}else if(n.act||n.setMode){let o=r[n.act?.part||n.meterPart],l=o&&this.objs.get(o);if(l){let c=new jt().setFromObject(l.g.userData.inner),d=c.getCenter(new E);t(d.x,Math.max(.1,c.min.y+.1),d.z,16098596,Math.max(3,c.getSize(new E).length()*.8));let u=this.part(o).type;this.label(d.clone().setY(c.max.y+2.5),n.setMode?`Elige ${n.setMode} en su panel`:u==="ldr"||u==="pot"?"Selecci\xF3nalo y aj\xFAstalo en su panel":"Haz clic aqu\xED")}}}let s=new ut;this.ringScale=[],e.slice(0,16).forEach(([r,a,o,l,c],d)=>{s.makeTranslation(r,a,o),this.guideRings.setMatrixAt(d,s),this.guideRings.setColorAt(d,new Be(l)),this.ringScale[d]=c}),this.guideRings.count=Math.min(16,e.length),this.guideRings.instanceMatrix.needsUpdate=!0,this.guideRings.instanceColor&&(this.guideRings.instanceColor.needsUpdate=!0)}label(e,t){let n=document.createElement("div");n.className="cx-glab",n.textContent=t,this.$("#cxLabels").appendChild(n),this.labels.push({el:n,pos:e})}layoutLabels(){if(!this.labels.length)return;let e=this.renderer.domElement,t=e.clientWidth,n=e.clientHeight;for(let s of this.labels){let r=s.pos.clone().project(this.camera);s.el.style.transform=`translate(${(r.x*.5+.5)*t}px, ${(-r.y*.5+.5)*n}px) translate(-50%, -100%)`,s.el.style.display=r.z<1?"":"none"}}guideAction(e){let t=this.pr,n=this.g;if(e==="desel")return this.select(null);if(e==="toggle"){let s=this.part(this.sel?.id);if(!s)return;let r=()=>{s.type==="switch"?s.state.closed=!s.state.closed:s.state.pos=s.state.pos?0:1};this.running?(r(),this.stateChanged(s,!0)):this.commit(r);return}if(e==="parkprobes"){let s=this.part(this.sel?.id);if(!s)return;this._liveOK=!0,this.commit(()=>{s.probes={red:null,com:null},s.park={red:[4,15],com:[-4,15]}}),this._liveOK=!1;return}if(e==="rev-volver"){location.hash="#panel/entregas";return}if(e==="rev-guardar"){let s=this.$("#cxGradeMsg"),r=this.$("#cxNota").value.trim().replace(",","."),a=r===""?null:Math.round(+r*100)/100;if(a!=null&&!(a>=0&&a<=10)){s.textContent="La nota tiene que estar entre 0 y 10.";return}let o=this.$("#cxCom").value.slice(0,1e3);s.textContent="Guardando\u2026",Promise.resolve(Vr()?.calificar(this.rev.id,a,o)).then(()=>{this.rev.nota=a,this.rev.comentario=o,s.textContent="\u2714 Guardado"},()=>{s.textContent="\u274C No se ha podido guardar."});return}if(!(!t||this.readOnly)){if(e==="entregar")return this.entregar();if(e==="autostep"&&this.autoStep(),e==="check"&&(this.checkResult=nu(t,this.model,{map:n.map,measured:n.measured}),this.checkResult.ok&&(Ki.set("done:"+t.id,!0),this.toast("\u2705 \xA1Pr\xE1ctica superada!",4e3)),this.renderSide(),this.$(".cx-check")?.scrollIntoView({block:"nearest"})),e==="solution"){if(!(this.opts.confirm||confirm)("\xBFCargar la soluci\xF3n completa? Tu montaje actual se puede recuperar con Deshacer."))return;this.loadSolution()}if(e==="answers"&&(this.qres=t.questions.map((s,r)=>{let a=n.answers[r];if(a==null||a==="")return null;if(s.choices)return+a===s.ans;let o=parseFloat(String(a).replace(",","."));return isFinite(o)&&Math.abs(o-s.ans)<=Math.max(s.tol*Math.abs(s.ans),1e-9)}),this.renderSide()),e==="showans"&&(this.showAnswers=!0,this.renderSide()),e==="reset"){if(!(this.opts.confirm||confirm)("\xBFEmpezar la pr\xE1ctica de nuevo? Se borrar\xE1 el montaje."))return;this.toggleSim(!1),this.commit(()=>{this.model={parts:[],wires:[]}}),Object.assign(n,{idx:0,map:{},measured:{},answers:{},snap:null}),this.checkResult=null,this.qres=null,this.showAnswers=!1,Ki.del("done:"+t.id),this.afterChange(),this.renderSide()}}}autoStep(){let e=this.pr.steps[this.g.idx];if(!e)return;this.running&&(e.place&&!ce[e.place.type].meter||e.wire||e.remove)&&this.toggleSim(!1);let t=this.g.map,n=s=>{let r=/^p:([^:]+):(.+)$/.exec(s);return r?t[r[1]]&&this.part(t[r[1]])?`p:${t[r[1]]}:${r[2]}`:null:s};if(e.place){let s=this.freshPart(e.place.type,e.place.props);if(ce[s.type].board){let a={...s,at:e.place.at,rot:e.place.rot||0};if(!this.boardValid(a))return this.toast("El sitio est\xE1 ocupado: deja libres los agujeros marcados.");this.autoPlace(s,e.place)}else{let a={...s,pos:e.place.pos,rot:e.place.rot||0};this.tableValid(a)?this.autoPlace(s,e.place):this.autoPlace(s)}t[e.place.id]=s.id,this.evalGuide()}else if(e.wire){let s=n(e.wire.a),r=n(e.wire.b);if(!s||!r)return this.toast("Falta colocar antes la pieza de este paso.");let a=this.occupied();for(let l of[s,r])if(l.startsWith("h:")&&a.has(l.slice(2)))return this.toast("El agujero "+Yi(l.slice(2))+" est\xE1 ocupado.");let o=this.newId("w");this.commit(()=>this.model.wires.push({id:o,a:s,b:r,color:e.wire.color}))}else if(e.remove){let s=this.pr.steps.find(o=>o.wire&&o.wire.id===e.remove).wire,r=n(s.a),a=n(s.b);this.commit(()=>{this.model.wires=this.model.wires.filter(o=>!(o.a===r&&o.b===a||o.a===a&&o.b===r))})}else if(e.setMode){let s=this.meterPart();s&&(this._liveOK=!0,this.commit(()=>{s.props.mode=e.setMode}),this._liveOK=!1)}}loadSolution(){let e=this.pr;this.toggleSim(!1);let t=tu(e);this.commit(()=>{this.model=this.sanitize(La(t))}),this.g.map=Object.fromEntries(t.parts.map(n=>[n.id,n.id])),this.g.idx=0,this.g.snap=null,this.evalGuide(!0),this.homeView(),this.toast("Soluci\xF3n cargada. Pulsa \u25B6 Iniciar simulaci\xF3n para verla funcionar.",4e3)}fileAction(e){if(!(!this.view||this.view==="home")){if(this.readOnly&&e!=="export")return this.toast("Revisi\xF3n de una entrega: solo se puede exportar.");if(e==="save"&&(Ki.set("save:"+this.view,{model:this.model,date:Date.now()}),this.toast("\u{1F4BE} Montaje guardado en este navegador.")),e==="load"){let t=Ki.get("save:"+this.view);if(!t)return this.toast("No hay ning\xFAn montaje guardado para esta pr\xE1ctica.");this.toggleSim(!1),this.commit(()=>{this.model=this.sanitize(t.model)}),this.toast("\u{1F4C2} Montaje recuperado ("+new Date(t.date).toLocaleString("es-ES")+").")}if(e==="export"){let t=JSON.stringify({app:"laboratorio-circuitos",version:1,practica:this.view,fecha:new Date().toISOString(),model:this.model},null,1),n=URL.createObjectURL(new Blob([t],{type:"application/json"})),s=document.createElement("a");s.href=n,s.download=`circuito-${this.view}-${new Date().toISOString().slice(0,10)}.json`,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),2e3),this.toast("\u2B07 Archivo exportado.")}if(e==="import"&&this.$("#cxFile").click(),e==="clear"){if(!(this.opts.confirm||confirm)("\xBFVaciar la protoboard?"))return;this.toggleSim(!1),this.select(null,!0),this.commit(()=>{this.model={parts:[],wires:[]}})}}}importText(e){let t=JSON.parse(e),n=this.sanitize(t.model||t);return this.toggleSim(!1),this.select(null,!0),this.commit(()=>{this.model=n}),this.homeView(),this.toast("\u2B06 Montaje importado: "+n.parts.length+" componentes y "+n.wires.length+" cables."),n}importFile(e){let t=new FileReader;t.onload=()=>{try{this.importText(t.result)}catch{this.toast("El archivo no es un montaje v\xE1lido.")}},t.readAsText(e)}}});function ae(i,e={}){let t=i+JSON.stringify(e);return cu[t]||(cu[t]=new lt({color:i,roughness:.6,metalness:.05,...e})),cu[t]}function Ne(i,e,t,n,s=0,r=0,a=0,o){let l=new Oe(new Xt(i,e,t),n);return l.position.set(s,r+e/2,a),l.castShadow=!0,l.receiveShadow=!0,o&&o.add(l),l}function ct(i,e,t,n=0,s=0,r=0,a,o=24){let l=new Oe(new Ct(i,i,e,o),t);return l.position.set(n,s+e/2,r),l.castShadow=!0,l.receiveShadow=!0,a&&a.add(l),l}function hi(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e;let s=n.getContext("2d");t(s,i,e);let r=new yr(n);return r.colorSpace=kt,r.anisotropy=8,r}function Oa(i,e,t,n,s,r,a,o=!0){let l=new Oe(new Ht(i,e),new lt({map:t,transparent:o,roughness:.7}));return l.rotation.x=-Math.PI/2,l.position.set(n,s,r),l.receiveShadow=!0,a&&a.add(l),l}function Pn(i,e,t,n,s,r={}){let o=hi(e*12,t*12,l=>{l.clearRect(0,0,e*12,t*12);for(let c of s){let[d,u,h,p=2,m=0,b="#ffffff",g="center",f="700"]=c;l.save(),l.translate((u+e/2)*12,(h+t/2)*12),l.rotate(m*Math.PI/180),l.fillStyle=b,l.font=`${f} ${p*12}px Arial, Helvetica, sans-serif`,l.textAlign=g,l.textBaseline="middle",l.fillText(d,0,0),l.restore()}r.draw&&r.draw(l,12)});return Oa(e,t,o,0,n+.02,0,i)}function lf(){let i=new Ue;i.name="board";let e={},t=new qi,n=1.5;t.moveTo(qe(n),je(0)),t.lineTo(qe(64.5),je(0)),t.lineTo(qe(66.1),je(1.6)),t.lineTo(qe(66.1),je(4)),t.lineTo(qe(68.6),je(6.5)),t.lineTo(qe(68.6),je(50)),t.lineTo(qe(66.1),je(52.5)),t.lineTo(qe(66.1),je(53.3)),t.lineTo(qe(n),je(53.3)),t.quadraticCurveTo(qe(0),je(53.3),qe(0),je(53.3-n)),t.lineTo(qe(0),je(n)),t.quadraticCurveTo(qe(0),je(0),qe(n),je(0));for(let[w,v]of[[15.2,2.5],[66-2.5,7.6+1],[66-2.5,35.5],[13.97,50.8]]){let x=new _s;x.absarc(qe(w),je(v),1.6,0,Math.PI*2,!0),t.holes.push(x)}let s=new Ms(t,{depth:gt,bevelEnabled:!1});s.rotateX(Math.PI/2),s.translate(0,gt,0);let r=new Oe(s,ae(1382170,{roughness:.45}));r.castShadow=!0,r.receiveShadow=!0,i.add(r);let a=[],o=(w,v,x,P=1.6,F=0,U="#ffffff",B="center")=>a.push([w,qe(v),je(x),P,F,U,B]);du.forEach((w,v)=>o(w,hu+v*St,5.2,1.25,-90)),uu.forEach((w,v)=>o(w,pu+v*St,5.2,1.25,-90)),ef.forEach((w,v)=>o(w,fu+v*St,48,1.25,-90)),tf.forEach((w,v)=>o(w,ml+v*St,48,1.25,-90)),o("POWER",fu+9,45.2,2),o("ANALOG",ml+3,45.2,2),o("I2C",ml+12,45.2,2),o("S",16,gl.S,1.6),o("V",16,gl.V,1.6),o("G",16,gl.G,1.6),o("G",Da.G,17.6,1.3),o("V",Da.V,17.6,1.3),o("SDA",Da.SDA,17.6,1),o("SCL",Da.SCL,17.6,1),o("I2C",37.2,23.4,1.8,-90),o("G",bl.G,31.5,1.3),o("3V3",bl.V,31.5,1),o("S",bl.S,31.5,1.3);for(let[w,v]of Object.entries(rf))o(w,28.6,v,1.3,0,"#ffffff","left");o("ANALOG",32.2,37.2,1.8,-90),o("5V",17,23,1.4),o("3.3V",17,31.2,1.4),o("ACEBOTT",47.5,16.2,2,0,"#ffffff"),o("ESP32 Plus",48.5,41,2.4,0,"#ffffff"),o("DC 7~12V",6,50.2,1.4),o("RESET",6,8.7,1.1),o("PWR",13.5,26,1.1),o("TX",66.4,7.6,1),o("RX",66.4,10.14,1),o("GND",66.6,12.68,.9),o("V",66.4,15.22,1),Pn(i,af,of,gt,a,{draw:(w,v)=>{w.strokeStyle="#ffffff",w.lineWidth=.25*v,w.strokeRect(19.6*v,32*v,7.9*v,10.6*v),w.strokeRect(25.2*v,18.4*v,10.4*v,10.2*v)}});let l=ae(1995736,{roughness:.5}),c=hi(64,64,w=>{w.fillStyle="#1e73d8",w.fillRect(0,0,64,64),w.fillStyle="#0a0f1a",w.fillRect(20,20,24,24)}),d=new lt({map:c,roughness:.5});function u(w,v,x,P){let F=w.length,U=F*St,B=new Oe(new Xt(U,8.5,St),[l,l,d,l,l,l]);c.wrapS=c.wrapT=aa,B.position.set(qe(v-St/2+U/2),gt+4.25,je(x)),B.castShadow=!0,B.receiveShadow=!0,i.add(B);let j=c.clone();j.repeat.set(F,1),j.needsUpdate=!0,B.material=[l,l,new lt({map:j,roughness:.5}),l,l,l],w.forEach((k,ee)=>{let G=P+k;e[G]&&(G=G+"_2"),e[G]={pos:new E(qe(v+ee*St),gt+8.5,je(x)),type:"female",label:k}})}u(du,hu,nf,"H."),u(uu,pu,nf,"H."),u(ef,fu,sf,"P."),u(tf,ml,sf,"AH.");let h={S:1995736,V:13904426,G:2236962,SDA:1995736,SCL:15921906,"3V3":13904426},p=new Xt(.64,6,.64);function m(w,v,x,P,F){Ne(St,2.5,St,ae(x),qe(w),gt,je(v),i);let U=new Oe(p,Vs());U.position.set(qe(w),gt+2.5+3-1,je(v)),i.add(U),P&&(e[P]={pos:new E(qe(w),gt+2.5,je(v)),type:"male",label:F})}let b=[...du.slice(4).map((w,v)=>[w,hu+(v+4)*St]),...uu.slice(0,6).map((w,v)=>[w,pu+v*St])];for(let[w,v]of b)for(let[x,P]of Object.entries(gl))m(v,P,h[x],`D${w}.${x}`,`GPIO ${w} \xB7 ${x}`);["TX","RX","GND","V"].forEach((w,v)=>m(64,7.6+v*St,1995736,"SER."+w,w)),f_.forEach((w,v)=>{for(let[x,P]of Object.entries(Da))m(P,w,h[x],`I${v+1}.${x}`,`I2C fila ${v+1} \xB7 ${x}`)});for(let[w,v]of Object.entries(rf))for(let[x,P]of Object.entries(bl))m(P,v,x==="V"?h["3V3"]:h[x],`A${w}.${x}`,`ANALOG ${w} \xB7 ${x==="V"?"3V3":x}`);Ne(25.5,.8,18,ae(1118481),qe(52.75),gt,je(28),i);let g=Ne(17.5,2.4,16,Qn(),qe(49.2),gt+.8,je(28),i),f=hi(420,384,w=>{w.fillStyle="#c9ccd1",w.fillRect(0,0,420,384),w.fillStyle="#555",w.font="bold 44px Arial",w.fillText("ESP32-WROOM-32",20,80),w.font="30px Arial",w.fillText("Wi-Fi \xB7 Bluetooth",20,140),w.fillText("CE  FCC ID",20,190),w.strokeStyle="#777",w.lineWidth=6,w.strokeRect(300,250,90,90)});Oa(17.5,16,f,qe(49.2),gt+3.22,je(28),i,!1);let A=hi(200,400,w=>{w.fillStyle="#111",w.fillRect(0,0,200,400),w.strokeStyle="#c8a24a",w.lineWidth=10,w.beginPath(),w.moveTo(30,40);for(let v=0;v<6;v++)w.lineTo(170,40+v*55),w.lineTo(170,67+v*55),w.lineTo(30,67+v*55),w.lineTo(30,95+v*55);w.stroke()});Oa(7.5,18,A,qe(61.75),gt+.82,je(28),i,!1);let S=Ne(16,10.8,12,Qn(),qe(1.7),gt,je(15.5),i);S.name="usbPort",Ne(.3,6.5,8,ae(1118481),qe(-6.2),gt+2.2,je(15.5),i),e.USB={pos:new E(qe(-6.3),gt+5.4,je(15.5)),type:"usb"},Ne(14,11,9,ae(1710618,{roughness:.8}),qe(5.2),gt,je(43),i);let y=ct(2.6,.5,ae(328965),0,0,0,i);y.rotation.z=Math.PI/2,y.position.set(qe(-1.85),gt+6,je(43)),e.DC={pos:new E(qe(-1.8),gt+6,je(43)),type:"dc"},Ne(6,3.3,6,Qn(),qe(6),gt,je(4.6),i),ct(1.7,1.2,ae(3355443),qe(6),gt+3.3,je(4.6),i),Ne(5,1.2,5,ae(855309),qe(21),gt,je(15.5),i),Ne(4,1.2,3,ae(855309),qe(30),gt,je(15.2),i),Ne(6.2,3.2,6.2,ae(7040884),qe(12.5),gt,je(32),i),Ne(6.5,2.2,7,ae(855309),qe(16.5),gt,je(41.5),i),Ne(3,1.2,1.6,Qn(),qe(16.5),gt,je(37.2),i);let T=(w=>{let v=w;return()=>(v=(v*9301+49297)%233280)/233280})(7);for(let w=0;w<26;w++){let v=8+T()*30,x=20+T()*22;v>18&&v<37&&x>17&&x<43||Ne(1.6,.6,.8,ae(T()>.5?12094037:1842204),qe(v),gt,je(x),i)}Ne(1.6,.7,.8,ae(16728128,{emissive:16719904,emissiveIntensity:.8}),qe(13.5),gt,je(24.5),i),Ne(4,3.4,8.6,Qn(),qe(17),gt,je(27),i);let R=Ne(2,2.4,2.6,ae(2236962),qe(17),gt+3.4,je(25.6),i);return R.name="switchLever",i.userData.setSwitch=w=>{R.position.z=je(w==="5V"?25.4:28.6)},i.userData.switchPos=new E(qe(17),gt+6,je(27)),i.userData.pins=e,i}function Rn(i,e,t,n,s=0){return Ne(i,1.6,e,ae(t,{roughness:.5}),0,s,0,n)}function Nn(i,e,t,n=3.2,s=St,r=0){let a={},o=e.length;return Ne(o*s,2.5,2.5,ae(1710618),r,.2,t/2-1.25,i),e.forEach((l,c)=>{let d=r+(c-(o-1)/2)*s,u=new Oe(new Xt(.64,.64,7),Vs());u.position.set(d,1.45,t/2+2.5),i.add(u),a[l]={pos:new E(d,1.45,t/2+1),dir:new E(0,0,1),type:"male"}}),a}function Un(i,e,t,n,s=St,r=0,a="#ffffff"){let o=e.map((l,c)=>[l,r+(c-(e.length-1)/2)*s,n/2-4.2,l.length>2?1.05:1.5,-90,a]);Pn(i,t,n,1.6,o)}function Qi(i,e,t,n,s,r=2,a="#ffffff"){Pn(i,e,t,1.62,[[n,0,s,r,0,a]])}function df(i){let e=new Ue,t=i.pos;Ne(14,10,14,ae(2236962),t.x-9,t.y-5,t.z,e),Ne(10,7.5,9.5,Qn(),t.x-1.5,t.y-3.75,t.z,e);let n=new ys(new E(t.x-16,t.y,t.z),new E(t.x-40,t.y,t.z),new E(t.x-40,2,t.z-8),new E(t.x-58,2,t.z-28)),s=new Oe(new jn(n,40,2.2,10),ae(2236962));return s.castShadow=!0,e.add(s),e}var af,of,gt,qe,je,St,cu,Qn,Vs,du,uu,ef,tf,hu,pu,fu,ml,nf,sf,gl,Da,f_,bl,rf,ui,cf,uf=vt(()=>{Tr();af=68.6,of=53.3,gt=1.6,qe=i=>i-af/2,je=i=>i-of/2,St=2.54,cu={};Qn=()=>ae(13225169,{metalness:.85,roughness:.3}),Vs=()=>ae(14201946,{metalness:.9,roughness:.3});du=["SCL","SDA","5V","GND","18","19","23","5","13","12"],uu=["14","27","16","17","25","26","TX","RX"],ef=["0","5V","RST","3V3","5V","GND","GND","VIN"],tf=["2","4","35","34","SDA","SCL"],hu=18,pu=44.2,fu=26.5,ml=49.5,nf=2.2,sf=51.1,gl={S:7.6,V:10.14,G:12.68},Da={G:26.6,V:29.14,SDA:31.68,SCL:34.22},f_=[19.6,22.14,24.68,27.22],bl={G:21,V:23.54,S:26.08},rf={34:33.4,35:35.94,4:38.48,2:41.02};ui=2051996,cf={led(i){let e=new Ue,t=20,n=24;Rn(t,n,ui,e);let s={rojo:16722731,verde:2282347,azul:2849791}[i.color]||16722731,r=new lt({color:s,transparent:!0,opacity:.85,roughness:.15,emissive:s,emissiveIntensity:0});ct(2.6,5,r,0,1.6,-3,e);let a=new Oe(new li(2.6,20,12,0,Math.PI*2,0,Math.PI/2),r);a.position.set(0,6.6,-3),e.add(a),ct(3,1,r,0,1.6,-3,e),e.userData.glow=r;let o=["G","V","S"];return Un(e,o,t,n),Qi(e,t,n,"LED "+i.color.toUpperCase(),-9.5,2),{group:e,pins:Nn(e,o,n)}},rgb(){let i=new Ue,e=22,t=24;Rn(e,t,ui,i);let n=new lt({color:16777215,transparent:!0,opacity:.8,roughness:.2,emissive:16777215,emissiveIntensity:0});ct(2.6,5,n,0,1.6,-3,i);let s=new Oe(new li(2.6,20,12,0,Math.PI*2,0,Math.PI/2),n);s.position.set(0,6.6,-3),i.add(s),i.userData.glow=n;let r=["R","G","B","-"];return Un(i,r,e,t),Qi(i,e,t,"LED RGB",-9.5,2),{group:i,pins:Nn(i,r,t)}},button(i){let e=new Ue,t=22,n=26;Rn(t,n,ui,e),Ne(12,3.5,12,ae(2236962),0,1.6,-3,e),ct(5,4,ae(i.cap||15909376),0,5.1,-3,e);let s=["G","V","S"];return Un(e,s,t,n),Qi(e,t,n,"PULSADOR",-11,2),{group:e,pins:Nn(e,s,n)}},buzzer(){let i=new Ue,e=20,t=26;Rn(e,t,ui,i),ct(6,8,ae(1447446),0,1.6,-3.5,i),ct(1,.2,ae(4473924),0,9.6,-3.5,i);let n=["G","V","S"];return Un(i,n,e,t),Qi(i,e,t,"ZUMBADOR PASIVO",-11.3,1.6),{group:i,pins:Nn(i,n,t)}},ldr(){let i=new Ue,e=20,t=24;Rn(e,t,ui,i);let n=hi(128,128,r=>{r.fillStyle="#e8d6a8",r.beginPath(),r.arc(64,64,62,0,7),r.fill(),r.strokeStyle="#b5521f",r.lineWidth=9,r.beginPath(),r.moveTo(20,34);for(let a=0;a<5;a++)r.lineTo(108,34+a*15),r.lineTo(108,41+a*15),r.lineTo(20,41+a*15),r.lineTo(20,49+a*15);r.stroke()});ct(2.6,2,ae(15259304),0,1.6,-4,i),Oa(5.2,5.2,n,0,3.62,-4,i);let s=["G","V","S"];return Un(i,s,e,t),Qi(i,e,t,"SENSOR DE LUZ",-9.8,1.7),{group:i,pins:Nn(i,s,t)}},lm35(){let i=new Ue,e=20,t=24;Rn(e,t,ui,i);let n=new Oe(new Ct(2.4,2.4,5,24,1,!1,0,Math.PI),ae(1118481));n.position.set(0,1.6+2.5,-3),n.castShadow=!0,i.add(n),Ne(4.8,5,.3,ae(1118481),0,1.6,-3,i);let s=["G","V","S"];return Un(i,s,e,t),Qi(i,e,t,"LM35",-9.5,2.2),{group:i,pins:Nn(i,s,t)}},ir(){let i=new Ue,e=14,t=34;Rn(e,t,ui,i);let n=ct(1.5,5,new lt({color:14674175,transparent:!0,opacity:.8}),0,0,0,i);n.rotation.x=Math.PI/2,n.position.set(-3,4,-t/2-1);let s=ct(1.5,5,ae(1118481),0,0,0,i);s.rotation.x=Math.PI/2,s.position.set(3,4,-t/2-1),Ne(6,4.5,6,ae(1925072),0,1.6,-2,i),ct(1.2,1,ae(15790320),0,6.1,-2,i),Ne(5,1.2,4,ae(855309),0,1.6,6,i);let r=["OUT","GND","VCC"];return Un(i,r,e,t),Qi(i,e,t,"SENSOR IR",-10.5,1.6),{group:i,pins:Nn(i,r,t)}},soil(){let i=new Ue,e=20,t=60,n=new qi;n.moveTo(-10,30),n.lineTo(10,30),n.lineTo(10,-14),n.lineTo(8,-30),n.lineTo(3,-30),n.lineTo(3,-12),n.lineTo(-3,-12),n.lineTo(-3,-30),n.lineTo(-8,-30),n.lineTo(-10,-14),n.lineTo(-10,30);let s=new Ms(n,{depth:1.6,bevelEnabled:!1});s.rotateX(Math.PI/2),s.translate(0,1.6,0),s.scale(1,1,-1);let r=new Oe(s,ae(ui));r.castShadow=!0,i.add(r),Ne(1.6,.1,18,Vs(),-6.5,1.6,-20,i),Ne(1.6,.1,18,Vs(),6.5,1.6,-20,i);let a=["G","V","S"];return Un(i,a,e,t),Qi(i,e,t,"HUMEDAD",14,1.8),{group:i,pins:Nn(i,a,t)}},relay(){let i=new Ue,e=28,t=42;Rn(e,t,ui,i),Ne(15.5,15,19,ae(3108832,{roughness:.35}),0,1.6,-2,i),Pn(i,e,t,16.6,[["SRD-05VDC",0,-4,1.6],["10A 250VAC",0,0,1.4]]);let n={};["NC","COM","NO"].forEach((r,a)=>{let o=(a-1)*5;Ne(5,10,7.5,ae(1745120),o,1.6,-t/2+3.8,i),ct(1.3,.6,Qn(),o,11.6,-t/2+3.8,i),n[r]={pos:new E(o,5.5,-t/2),dir:new E(0,0,-1),type:"terminal"}}),Ne(1.6,.8,1.2,ae(16724016,{emissive:0}),9,1.6,10,i);let s=["G","V","S"];return Un(i,s,e,t),Pn(i,e,t,1.62,[["NC",-5,-t/2+9.2,1.4],["COM",0,-t/2+9.2,1.2],["NO",5,-t/2+9.2,1.4],["REL\xC9",-9,12,1.8]]),{group:i,pins:{...Nn(i,s,t),...n}}},servo(){let i=new Ue;Ne(12.4,22.5,23,ae(1925072,{roughness:.4}),0,0,0,i),Ne(12.4,2.5,32.5,ae(1925072,{roughness:.4}),0,15.5,0,i),ct(5.8,4,ae(1925072),0,22.5,-5.8,i),ct(2.2,4,ae(16777215),0,26.5,-5.8,i);let e=new Ue;e.position.set(0,29,-5.8),i.add(e),Ne(20,1.6,6,ae(16777215),-7,0,0,e);for(let r=0;r<6;r++)Ne(10,3,3,ae(r%2?16777215:14417947),-20-r*10,1.6,0,e);i.userData.arm=e;let t=hi(256,128,r=>{r.fillStyle="#1d5fd0",r.fillRect(0,0,256,128),r.fillStyle="#fff",r.font="bold 44px Arial",r.fillText("SERVO 180\xB0",10,60),r.font="30px Arial",r.fillText("0\xB0 - 180\xB0",10,105)}),n=new Oe(new Ht(22,11),new lt({map:t}));n.rotation.y=Math.PI/2,n.position.set(6.25,9,0),i.add(n);let s={};return["marron","rojo","naranja"].forEach((r,a)=>{s[r]={pos:new E((a-1)*1.2,3,11.6),dir:new E(0,0,1),type:"lead"}}),{group:i,pins:s}},lcd(i){let e=new Ue,t=80,n=36;Rn(t,n,2067002,e),Ne(71,7,24,ae(1118481),0,1.6,0,e);let s=hi(1024,224,l=>{l.fillStyle="#2a56e8",l.fillRect(0,0,1024,224),l.fillStyle="rgba(255,255,255,0.08)";for(let c=0;c<2;c++)for(let d=0;d<16;d++)l.fillRect(24+d*62,24+c*98,54,82);l.fillStyle="#f2f6ff",l.font='bold 76px "Courier New", monospace',(i.lines||["",""]).forEach((c,d)=>{for(let u=0;u<16&&u<c.length;u++)l.fillText(c[u],30+u*62,92+d*98)})}),r=new Oe(new Ht(64,14),new lt({map:s,emissive:16777215,emissiveMap:s,emissiveIntensity:.35}));r.rotation.x=-Math.PI/2,r.position.set(0,8.62,0),e.add(r);for(let[l,c]of[[-37,-15],[37,-15],[-37,15],[37,15]])ct(1.5,.2,ae(13421772),l,1.6,c,e);Pn(e,t,n,1.62,[["LCD1602 I2C  (0x27)",0,-15.5,2]]),Ne(6,2,20,ae(1118481),-t/2+3,1.6,0,e);let a=["GND","VCC","SDA","SCL"],o={};return Ne(2.5,2.5,4*St,ae(1710618),-t/2-1.25,.2,0,e),a.forEach((l,c)=>{let d=(c-1.5)*St,u=new Oe(new Xt(7,.64,.64),Vs());u.position.set(-t/2-4.5,1.45,d),e.add(u),o[l]={pos:new E(-t/2-3,1.45,d),dir:new E(-1,0,0),type:"male"}}),Pn(e,t,n,1.62,a.map((l,c)=>[l,-t/2+9.5,(c-1.5)*St,1.4,0,"#ffffff","left"])),{group:e,pins:o}},oled(i){let e=new Ue,t=35.5,n=33.6;Rn(t,n,1720207,e),Ne(33,1.6,22,ae(657930,{roughness:.2}),0,1.6,-1.5,e);let s=hi(512,256,o=>{o.fillStyle="#000",o.fillRect(0,0,512,256),o.fillStyle="#e8f4ff",({parking:c=>{c.font="bold 28px monospace",c.fillText("APARCAMIENTO",8,30),c.font="bold 96px monospace",c.fillText("14",8,140),c.font="bold 30px monospace",c.fillText("cm",140,140),c.fillText("MUY CERCA",8,190),c.strokeStyle="#e8f4ff",c.lineWidth=4,c.strokeRect(6,216,496,30),c.fillRect(6,216,70,30)},fan:c=>{c.font="bold 30px monospace",c.fillText("MODO: AUTO",8,34),c.fillText("Temp: 27.0 C",8,84),c.fillText("Pres: 1014 hPa",8,130),c.fillText("Velocidad: 70 %",8,180),c.strokeStyle="#e8f4ff",c.lineWidth=4,c.strokeRect(6,210,496,36),c.fillRect(256,218,172,20),c.fillRect(254,202,4,48)}}[i.draw]||(c=>{c.font="bold 40px monospace",c.fillText("OLED",20,60)}))(o)}),r=new Oe(new Ht(29,14.5),new lt({map:s,emissive:16777215,emissiveMap:s,emissiveIntensity:.6}));r.rotation.x=-Math.PI/2,r.rotation.z=Math.PI,r.position.set(0,3.22,-2),e.add(r);let a=["GND","VCC","SCL","SDA"];return Un(e,a,t,n),Pn(e,t,n,1.62,[['OLED 1.3"',0,-15.3,1.6]]),{group:e,pins:Nn(e,a,n)}},hcsr04(){let i=new Ue;Ne(30,12,12,ae(10134445),0,0,2,i);let e=new Ue;e.position.set(0,12,0),i.add(e),Ne(45,20,1.6,ae(ui),0,0,0,e);for(let a of[-13,13]){let o=ct(8,12,Qn(),0,0,0,e);o.rotation.x=Math.PI/2,o.position.set(a,11,-6.8);let l=ct(6.5,.4,ae(3355443),0,0,0,e);l.rotation.x=Math.PI/2,l.position.set(a,11,-12.9)}Ne(5,4,2,ae(14211288),0,15,-1.5,e);let t=["VCC","Trig","Echo","GND"],n={};Ne(4*St,2.5,2.5,ae(1710618),0,2,2.05,e),t.forEach((a,o)=>{let l=(o-1.5)*St,c=new Oe(new Xt(.64,.64,7),Vs());c.position.set(l,3.25,5.5),e.add(c),n[a]={pos:new E(l,15.25,4),dir:new E(0,0,1),type:"male"}});let s=hi(512,128,a=>{a.fillStyle="#1f4f9c",a.fillRect(0,0,512,128),a.fillStyle="#fff",a.font="bold 30px Arial",a.textAlign="center",t.forEach((o,l)=>a.fillText(o,256+(l-1.5)*29*1,112)),a.font="bold 34px Arial",a.fillText("HC-SR04",256,50)}),r=new Oe(new Ht(45,11.25),new lt({map:s}));return r.position.set(0,12+5.6,.82),i.add(r),{group:i,pins:n}},joystick(){let i=new Ue,e=26,t=34;Rn(e,t,1118481,i),Ne(16,9,16,ae(2829099),0,1.6,-4,i);let n=ct(1.6,9,ae(7829367),0,10.6,-4,i);ct(6.5,6,ae(1118481),0,18,-4,i);let s=["GND","+5V","VRx","VRy","SW"];return Un(i,s,e,t),Pn(i,e,t,1.62,[["JOYSTICK",0,7,1.8],["\u2191 Y",-9.5,-13,1.8]]),{group:i,pins:Nn(i,s,t)}},bmp280(){let i=new Ue,e=14,t=16;Rn(e,t,7024552,i),Ne(2.5,.9,2,Qn(),0,1.6,-3,i);let n=["VCC","GND","SCL","SDA"];return Un(i,n,e,t),Pn(i,e,t,1.62,[["BMP280",0,-6.3,1.5]]),{group:i,pins:Nn(i,n,t)}},l298n(){let i=new Ue,e=43,t=43;Rn(e,t,13115434,i);let n=new Ue;n.position.set(0,1.6,-8),i.add(n),Ne(23,3,16,ae(1118481,{metalness:.4}),0,0,0,n);for(let o=0;o<8;o++)Ne(1.2,22,16,ae(1118481,{metalness:.4}),-10+o*2.85,3,0,n);let s={},r=(o,l,c,d,u)=>o.forEach((h,p)=>{let m=(p-(o.length-1)/2)*5,b=d?l:l+m,g=d?c+m:c;Ne(d?7.5:5,10,d?5:7.5,ae(1745120),b,1.6,g,i),ct(1.3,.6,Qn(),b,11.6,g,i),s[h]={pos:new E(b+u.x*3.8,5.5,g+u.z*3.8),dir:u,type:"terminal"}});r(["OUT1","OUT2"],-e/2+3.8,-8,!0,new E(-1,0,0)),r(["OUT3","OUT4"],e/2-3.8,-8,!0,new E(1,0,0)),r(["+12V","GND","+5V"],-11,t/2-3.8,!1,new E(0,0,1));let a=["ENA","IN1","IN2","IN3","IN4","ENB"];return a.forEach((o,l)=>{let c=4+l*St,d=t/2-5;Ne(St,2.5,St,ae(1710618),c,1.6,d,i);let u=new Oe(new Xt(.64,6,.64),Vs());u.position.set(c,1.6+2.5+2,d),i.add(u),s[o]={pos:new E(c,1.6+2.5,d),dir:new E(0,1,0),type:"maleUp"}}),Ne(St*1,5,St*2,ae(1118481),4+5*St,4.1,t/2-5-St/2,i),Ne(5,5,2.6,ae(1118481),-14,1.6,6,i),Pn(i,e,t,1.62,[...a.map((o,l)=>[o,4+l*St,t/2-9,1,-90]),["+12V",-16,t/2-9.2,1.3],["GND",-11,t/2-9.2,1.3],["+5V",-6,t/2-9.2,1.3],["OUT1",-e/2+10.5,-10.5,1.2],["OUT2",-e/2+10.5,-5.5,1.2],["L298N",0,4,2.4],["12V EN",-14,9.6,1.1]]),{group:i,pins:s}},motor(){let i=new Ue;Ne(37,18,22,ae(15909376,{roughness:.5}),0,0,0,i);let e=ct(10,26,Qn(),0,0,0,i);e.rotation.z=Math.PI/2,e.position.set(-31,9,0),ct(2.6,26,ae(16119285),0,0,0,i).position.set(8,-4,0);let n=new Ue;n.position.set(8,24,0),i.add(n);for(let r=0;r<3;r++){let a=Ne(34,1,9,ae(15964416),17,0,0);a.rotation.y=0;let o=new Ue;o.rotation.y=r*Math.PI*2/3,a.rotation.x=.35,o.add(a),n.add(o)}ct(4,3,ae(3355443),0,-1,0,n),i.userData.prop=n;let s={rojo:{pos:new E(-44,12,-3),dir:new E(-1,0,0),type:"lead"},negro:{pos:new E(-44,6,3),dir:new E(-1,0,0),type:"lead"}};return{group:i,pins:s}},pump(){let i=new Ue,e=new Oe(new Ct(34,30,80,40,1,!0),new lt({color:14544639,transparent:!0,opacity:.25,side:Gn,roughness:.1}));e.position.set(0,40,0),i.add(e),ct(30,.8,new lt({color:14544639,transparent:!0,opacity:.4}),0,0,0,i,40);let t=new Oe(new Ct(32.5,30,50,40),new lt({color:3842303,transparent:!0,opacity:.35,roughness:.1}));t.position.set(0,26,0),i.add(t);let n=ct(12,30,ae(2105376),0,1,0,i);ct(12.5,4,ae(3355443),0,31,0,i);let s=ct(2.5,12,ae(2105376),0,0,0,i);s.rotation.z=Math.PI/2,s.position.set(16,26,0);let r=new Ti([new E(22,26,0),new E(30,60,0),new E(10,95,0),new E(-30,95,0),new E(-55,70,0)]),a=new Oe(new jn(r,40,3,10),new lt({color:15790320,transparent:!0,opacity:.7}));i.add(a);let o={rojo:{pos:new E(-4,35,0),dir:new E(0,1,0),type:"lead"},negro:{pos:new E(4,35,0),dir:new E(0,1,0),type:"lead"}};return Pn(i,40,20,36,[["BOMBA 3-6V",0,0,2.4,0,"#ffffff"]]),{group:i,pins:o}},plant(){let i=new Ue,e=new Oe(new Ct(38,28,55,32),ae(12608570));e.position.y=27.5,e.castShadow=!0,i.add(e),ct(35,2,ae(4861984),0,53,0,i,32);for(let t=0;t<7;t++){let n=new Oe(new li(9,12,8),ae(4168250));n.scale.set(1,.4,2),n.position.set(Math.cos(t)*12,70+t%3*8,Math.sin(t)*12),n.rotation.y=t,i.add(n)}return ct(1.5,20,ae(3111466),0,55,0,i),{group:i,pins:{}}},breadboard(){let i=new Ue,e=165,t=55;Ne(e,8.5,t,ae(16053488,{roughness:.8}),0,0,0,i);let n=hi(1650,550,a=>{a.fillStyle="#f4f4f0",a.fillRect(0,0,1650,550),a.fillStyle="#d03030",a.fillRect(30,18,1590,4),a.fillRect(30,528,1590,4),a.fillStyle="#2050c0",a.fillRect(30,60,1590,4),a.fillRect(30,486,1590,4),a.fillStyle="#bbb",a.fillRect(30,268,1590,14),a.fillStyle="#333";for(let o=0;o<63;o++){let l=40+o*25.4;for(let c=0;c<5;c++)a.fillRect(l-4,100+c*25.4-4,8,8),a.fillRect(l-4,320+c*25.4-4,8,8);o%6!==5&&(a.fillRect(l-4,32,8,8),a.fillRect(l-4,46,8,8),a.fillRect(l-4,500,8,8),a.fillRect(l-4,514,8,8)),((o+1)%5===0||o===0)&&(a.font="16px Arial",a.fillText(String(o+1),l-8,82))}a.font="bold 16px Arial","abcde".split("").forEach((o,l)=>a.fillText(o,12,106+l*25.4)),"fghij".split("").forEach((o,l)=>a.fillText(o,12,326+l*25.4))});Oa(e,t,n,0,8.52,0,i,!1);let s=-78.5+54*2.54,r={c55a:{pos:new E(s,8.5,-t/2+10),dir:new E(0,1,0),type:"bbhole"},c55c:{pos:new E(s,8.5,-t/2+10+2*2.54),dir:new E(0,1,0),type:"bbhole"}};return{group:i,pins:r}},battery(){let i=new Ue;Ne(87,16,58,ae(1447446),0,0,0,i);for(let e=0;e<6;e++){let t=ct(7,50,ae(e%2?2236962:2763306,{metalness:.3}),0,0,0,i);t.rotation.x=Math.PI/2,t.position.set(-36.25+e*14.5,11,0);let n=ct(7.05,8,ae(13214247),0,0,0,i);n.rotation.x=Math.PI/2,n.position.set(-36.25+e*14.5,11,e%2?20:-20)}return Pn(i,87,58,18.1,[["6 x AA  =  9 V",0,0,5,0,"#ffffff"]]),{group:i,pins:{dc:{pos:new E(43.5,8,15),dir:new E(1,0,0),type:"lead"}}}},car(){let i=new Ue;Ne(60,14,32,ae(14417947,{roughness:.4}),0,5,0,i),Ne(32,12,28,ae(14540253,{transparent:!0,opacity:.8}),-4,19,0,i);for(let[e,t]of[[-18,-15],[18,-15],[-18,15],[18,15]]){let n=ct(7,5,ae(1118481),0,0,0,i);n.rotation.x=Math.PI/2,n.position.set(e,7,t)}return{group:i,pins:{}}}}});function g_(i,e){let t=e.map(a=>a.split(".")[1]).filter(Boolean),n=["G","V","3V3","S","SDA","SCL"],s=[...new Set(t)].sort((a,o)=>n.indexOf(a)-n.indexOf(o)),r;return(r=i.match(/^D(\d+)$/))?`GPIO ${r[1]} \xB7 <b>${s.join(" ")}</b>`:(r=i.match(/^A(\d+)$/))?`ANALOG ${r[1]} \xB7 <b>${s.map(a=>a==="V"?"3V3":a).join(" ")}</b>`:(r=i.match(/^I(\d)$/))?`I2C fila ${r[1]} \xB7 <b>${s.join(" ")}</b>`:(r=i.match(/^P\.(.+)$/))?`POWER \xB7 <b>${r[1].replace("_2","")}</b>`:i==="DC"?"Jack DC":i}var hf,mu,m_,Na,pf=vt(()=>{Tr();Hd();uf();hf={negro:1842204,rojo:14032928,amarillo:15909376,verde:2071866,azul:2056150,blanco:15658734,naranja:15759888,marron:8014372,morado:9059001,gris:9080726},mu=Object.fromEntries(Object.entries(hf).map(([i,e])=>[i,"#"+e.toString(16).padStart(6,"0")])),m_=i=>i<0?0:i>1?1:1-Math.pow(1-i,3),Na=class{constructor(e,t,n={}){this.container=e,this.labelLayer=t,this.opts=n,this.renderer=new bs({antialias:!0,preserveDrawingBuffer:!!n.render,alpha:!1}),this.renderer.setPixelRatio(n.render?1:Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ya,this.renderer.outputColorSpace=kt,this.renderer.toneMapping=Er,this.renderer.toneMappingExposure=1.05,e.appendChild(this.renderer.domElement),this.scene=new vs,this.scene.background=new Be(n.background||15987957),this.camera=new vr(-100,100,100,-100,-2e3,4e3),this.controls=new Cr(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.12,this.controls.maxPolarAngle=Math.PI*.49,this.controls.minZoom=.4,this.controls.maxZoom=6,this.controls.screenSpacePanning=!0,this.scene.add(new As(16777215,12172998,1.5));let s=new Ci(16777215,2.2);s.position.set(-120,300,180),s.castShadow=!0,s.shadow.mapSize.set(2048,2048);let r=s.shadow.camera;r.left=-300,r.right=300,r.top=300,r.bottom=-300,r.near=10,r.far=900,s.shadow.bias=-6e-4,s.shadow.radius=4,this.scene.add(s);let a=new Ci(16777215,.6);a.position.set(200,120,-100),this.scene.add(a);let o=new Oe(new Ht(3e3,3e3),new Yo({opacity:.16}));if(o.rotation.x=-Math.PI/2,o.position.y=-.01,o.receiveShadow=!0,this.scene.add(o),!n.render){let l=new Mr(1200,120,14277598,15001320);l.position.y=-.05,this.scene.add(l)}this.root=new Ue,this.scene.add(this.root),this.board=lf(),this.scene.add(this.board),this.labels=[],this.anims=[],this.halos=[],this.showLabels=!0,this.clock=new Sr,this.resize(),window.addEventListener("resize",()=>this.resize()),this.renderer.setAnimationLoop(()=>this.tick())}resize(){let e=this.container.clientWidth||800,t=this.container.clientHeight||600;this.renderer.setSize(e,t,!1),this.renderer.domElement.style.width=e+"px",this.renderer.domElement.style.height=t+"px",this.aspect=e/t,this.applyFrustum()}applyFrustum(){let e=this.viewH||120;this.camera.left=-e*this.aspect,this.camera.right=e*this.aspect,this.camera.top=e,this.camera.bottom=-e,this.camera.updateProjectionMatrix()}clear(){this.root.clear(),this.labels.forEach(e=>e.el.remove()),this.labels=[],this.anims=[],this.halos=[],this.parts={},this.wires={}}loadLesson(e){this.clear(),this.lesson=e,this.board.userData.setSwitch(e.switch||"3V3");for(let[t,n]of Object.entries(e.parts||{})){let s=cf[n.type](n),r=s.group;r.position.set(n.pos[0],n.y||0,n.pos[1]),r.rotation.y=(n.rot||0)*Math.PI/180,r.visible=!1,r.userData.basePos=r.position.clone(),this.root.add(r),r.updateMatrixWorld(!0),this.parts[t]={def:n,group:r,pins:s.pins}}this.usb=df(this.board.userData.pins.USB),this.usb.visible=!1,this.root.add(this.usb);for(let t of e.wires||[])this.wires[t.id]=this.buildWire(t);this.fitAll()}endpoint(e){let t=this.board.userData.pins[e];if(t){let d=t.pos.clone();if(t.type==="male")return{pos:d,dir:new E(0,1,0),housing:"female",label:e};if(t.type==="female")return{pos:d,dir:new E(0,1,0),housing:"maleIn",label:e};if(t.type==="dc")return{pos:d,dir:new E(-1,0,0),housing:"dc",label:e}}let[n,s]=e.split("."),r=this.parts[n];if(!r)throw new Error("Pieza desconocida "+e);let a=r.pins[s];if(!a)throw new Error("Pin desconocido "+e);r.group.updateMatrixWorld(!0);let o=r.group.localToWorld(a.pos.clone()),l=a.dir.clone().applyQuaternion(r.group.getWorldQuaternion(new pn)).normalize(),c={male:"female",maleUp:"female",terminal:"terminal",lead:"none",bbhole:"maleIn"}[a.type]||"none";return{pos:o,dir:l,housing:c,label:e}}buildWire(e){let t=new Ue;t.visible=!1;let n=hf[e.color]??8947848,s=[this.endpoint(e.from),this.endpoint(e.to)],r=s.map(b=>{let g=b.pos.clone(),f=14;if(b.housing==="female")e.noHousing||this.housing(t,b.pos.clone().addScaledVector(b.dir,.3),b.dir,f,1381653),g.addScaledVector(b.dir,f+.3);else if(b.housing==="maleIn")this.housing(t,b.pos.clone(),b.dir,f,1381653,!0),g.addScaledVector(b.dir,f);else if(b.housing==="terminal")this.housing(t,b.pos.clone().addScaledVector(b.dir,1.5),b.dir,f,1381653,!0),g.addScaledVector(b.dir,f+1.5);else if(b.housing==="dc"){let A=new Oe(new Ct(4,4,14,20),ae(1381653));A.quaternion.setFromUnitVectors(new E(0,1,0),b.dir),A.position.copy(b.pos).addScaledVector(b.dir,7),A.castShadow=!0,t.add(A),g.addScaledVector(b.dir,14)}return g}),a=r[0].distanceTo(r[1]),o=e.k0??Math.min(Math.max(a*.35,10),55),l=e.k1??Math.min(Math.max(a*.35,10),55),c=r[0].clone().addScaledVector(s[0].dir,o),d=r[1].clone().addScaledVector(s[1].dir,l);Math.abs(s[0].dir.y)<.5&&(c.y+=o*.5),Math.abs(s[1].dir.y)<.5&&(d.y+=l*.5),e.lift&&(c.y+=e.lift,d.y+=e.lift);let u=new ys(r[0],c,d,r[1]),h=e.thick?1.6:.75,p=new jn(u,80,h,8,!1),m=new Oe(p,new lt({color:n,roughness:.45}));return m.castShadow=!0,t.add(m),t.userData={tube:m,total:p.index.count,def:e,mid:u.getPoint(.5),ends:s,anchors:r},this.root.add(t),t}housing(e,t,n,s,r,a){let o=new Oe(new Xt(2.6,s,2.6),ae(r,{roughness:.7}));if(o.quaternion.setFromUnitVectors(new E(0,1,0),n),o.position.copy(t).addScaledVector(n,s/2),o.castShadow=!0,e.add(o),a){let l=new Oe(new Xt(.64,3,.64),ae(14201946,{metalness:.9,roughness:.3}));l.quaternion.copy(o.quaternion),l.position.copy(t).addScaledVector(n,-1),e.add(l)}}fitAll(e=!1,t=0){let n=[this.board];for(let w of Object.values(this.parts))e||(w.group.visible=!0),w.group.visible&&n.push(w.group);for(let w of Object.values(this.wires))e||(w.visible=!0),w.visible&&n.push(w);if(this.usb&&(e||(this.usb.visible=!0),this.usb.visible&&n.push(this.usb)),!e){let w=this.lesson.steps&&this.lesson.steps[this.lesson.steps.length-1];this.applyState(w&&w.state)}let s=new jt;n.forEach(w=>s.expandByObject(w)),this.bbox=s;let r=s.getCenter(new E),a=new E(...this.lesson.view||[.32,1,.92]).normalize();this.camera.position.copy(r).addScaledVector(a,800),this.camera.up.set(0,1,0),this.camera.lookAt(r),this.camera.updateMatrixWorld();let o=this.camera.matrixWorldInverse,l=1e9,c=-1e9,d=1e9,u=-1e9,h=new E;for(let w of n)w.traverse(v=>{if(!v.isMesh||!v.geometry)return;let x=v.geometry.attributes.position;if(!x)return;let P=Math.max(1,Math.floor(x.count/400));v.updateMatrixWorld(!0);for(let F=0;F<x.count;F+=P)h.fromBufferAttribute(x,F).applyMatrix4(v.matrixWorld).applyMatrix4(o),h.x<l&&(l=h.x),h.x>c&&(c=h.x),h.y<d&&(d=h.y),h.y>u&&(u=h.y)});let p=this.opts.padTop??.1,m=this.opts.padBottom??.2,b=this.opts.padX??.04,g=this.lesson.margin||1,f=this.opts.fitAspect||this.aspect,A=Math.max((u-d)/2/(1-p-m),(c-l)/2/(1-2*b)/f)*g,S=(l+c)/2,y=(d+u)/2-(m-p)*A,L=new E().setFromMatrixColumn(this.camera.matrixWorld,0),T=new E().setFromMatrixColumn(this.camera.matrixWorld,1),R=L.multiplyScalar(S).add(T.multiplyScalar(y));this.homeTarget=r.clone().add(R),this.homePos=this.homeTarget.clone().addScaledVector(a,800),this.homeH=Math.max(A,t),this.resetView()}resetView(){this.viewH=this.homeH,this.camera.zoom=1,this.applyFrustum(),this.controls.target.copy(this.homeTarget),this.camera.position.copy(this.homePos),this.controls.update()}topView(){this.controls.target.copy(this.homeTarget),this.camera.position.copy(this.homeTarget).add(new E(0,800,.01)),this.controls.update()}showStep(e,t=!1){let n=this.lesson;this.step=e;let s=new Set,r=new Set,a=!1;n.steps.forEach((p,m)=>{m<=e&&((p.add||[]).forEach(b=>s.add(b)),(p.wires||[]).forEach(b=>r.add(b)),p.usb&&(a=!0))});let o=n.steps[e],l=new Set(o.add||[]),c=new Set(o.wires||[]);this.anims=[],this.halos.forEach(p=>this.root.remove(p)),this.halos=[];let d=performance.now();for(let[p,m]of Object.entries(this.parts)){let b=s.has(p);m.group.visible=b,m.group.position.copy(m.group.userData.basePos),b&&l.has(p)&&!t&&(m.group.position.y+=40,this.anims.push({t0:d,dur:550,fn:g=>{m.group.position.y=m.group.userData.basePos.y+40*(1-g)}})),b&&l.has(p)&&this.addHalo(m.group)}let u=t?0:450;for(let[p,m]of Object.entries(this.wires)){let b=r.has(p);m.visible=b;let g=m.userData.tube;if(g.geometry.setDrawRange(0,1/0),m.children.forEach(f=>f.visible=!0),b&&c.has(p)&&!t){let f=d+u;u+=220,g.geometry.setDrawRange(0,0);let A=m.children.filter(S=>S!==g);A.forEach(S=>S.visible=!1),this.anims.push({t0:f,dur:800,fn:S=>{let y=Math.floor(m.userData.total*S/6)*6;g.geometry.setDrawRange(0,y),S>0&&A[0]&&(A[0].visible=!0),S>=1&&A.forEach(L=>L.visible=!0)}})}}this.usb.visible=a,o.focus==="switch"&&this.addHalo(null,this.board.userData.switchPos,14),o.focus==="usb"&&this.addHalo(this.usb);let h=o.state||null;this.applyState(h),this.buildLabels(o,s,c)}applyState(e){for(let t of Object.values(this.parts)){if(t.group.userData.glow){let n=e&&e.glow&&e.glow[Object.keys(this.parts).find(r=>this.parts[r]===t)],s=t.group.userData.glow;s.emissiveIntensity=n?1.6:0,n&&n!==!0&&(s.emissive.set(n),s.color.set(n))}t.group.userData.arm&&(t.group.userData.arm.rotation.z=e&&e.servo?-e.servo*Math.PI/180:0)}this.spinProp=!!(e&&e.spin)}addHalo(e,t,n){let s;e?(s=new jt().setFromObject(e),s.expandByScalar(2.5)):s=new jt().setFromCenterAndSize(t,new E(n,n*.6,n*1.3));let r=new el(s,15964416);r.material.linewidth=2,r.material.transparent=!0,r.material.depthTest=!1,r.renderOrder=10,this.root.add(r),this.halos.push(r)}buildLabels(e,t,n){this.labels.forEach(a=>a.el.remove()),this.labels=[];let s=(a,o,l)=>{let c=document.createElement("div");c.className="lbl "+(l||""),c.innerHTML=a,this.labelLayer.appendChild(c),this.labels.push({el:c,pos:o})};for(let a of t){let o=this.parts[a],l=new jt().setFromObject(o.group),c=l.getCenter(new E);c.y=l.max.y+4;let d=(e.add||[]).includes(a);o.def.label&&(d||this.opts.allPartLabels||e.allLabels)&&s(o.def.label,c,d?"part new":"part")}let r={};for(let a of n){let o=this.wires[a],l=o.userData.def;for(let[c,d]of[l.from,l.to].entries()){if(!this.board.userData.pins[d]){let[p,m]=d.split("."),b=this.parts[p],g=b&&b.pins[m];if(g&&["terminal","bbhole","maleUp"].includes(g.type)){let f=(b.def.label||b.def.type).split("\u2192")[0].trim().replace(/\s*\(.*\)/,""),A=m.replace(/^c(\d+)([a-e])$/,"col. $1 \xB7 fila $2"),S="part:"+p+(g.type==="maleUp"?":hdr":":"+m);(r[S]=r[S]||{refs:[],pts:[],text:f+" \xB7 ",pins:[]}).pts.push(o.userData.anchors[c]),r[S].pins.push(A)}continue}let h=d.includes(".")&&/^(D|A|I)/.test(d)?d.split(".")[0]:d;(r[h]=r[h]||{refs:[],pts:[]}).refs.push(d),r[h].pts.push(o.userData.anchors[c])}}for(let[a,o]of Object.entries(r)){let l=o.pts.reduce((c,d)=>c.add(d),new E).multiplyScalar(1/o.pts.length);l.y+=2,s(o.text?o.text+"<b>"+o.pins.join(" ")+"</b>":g_(a,o.refs),l,"pin")}e.focus==="switch"&&s("Interruptor \u2192 <b>"+(this.lesson.switch==="5V"?"5V":"3.3V")+"</b>",this.board.userData.switchPos.clone().add(new E(0,6,0)),"pin"),this.layoutLabels()}layoutLabels(){let e=this.container.clientWidth,t=this.container.clientHeight,n=[],s=this.labels.map(r=>{let a=r.pos.clone().project(this.camera);return{l:r,x:(a.x+1)/2*e,y:(1-a.y)/2*t,vis:this.showLabels&&a.z<1}}).sort((r,a)=>r.y-a.y);for(let r of s){let a=r.l.el;if(a.style.display=r.vis?"":"none",!r.vis)continue;let o=a.offsetWidth||80,l=a.offsetHeight||20,c=r.y-l-8,d=r.x-o/2;for(let u=0;u<12;u++){let h=n.find(p=>d<p.x+p.w+4&&d+o+4>p.x&&c<p.y+p.h+3&&c+l+3>p.y);if(!h)break;c=h.y-l-4}n.push({x:d,y:c,w:o,h:l}),a.style.transform=`translate(${Math.round(d)}px, ${Math.round(c)}px)`,a.style.setProperty("--stem",Math.max(6,r.y-(c+l))+"px")}}tick(){let e=performance.now();this.anims=this.anims.filter(n=>{let s=m_((e-n.t0)/n.dur);return n.fn(s),s<1});let t=this.clock.getElapsedTime();if(this.halos.forEach(n=>n.material.opacity=.45+.55*Math.abs(Math.sin(t*3))),this.spinProp)for(let n of Object.values(this.parts||{}))n.group.userData.prop&&(n.group.userData.prop.rotation.y+=this.opts.render?0:.25);this.controls.update(),this.renderer.render(this.scene,this.camera),this.labels.length&&this.layoutLabels()}get idle(){return this.anims.length===0}}});var mf,ff=vt(()=>{mf=`/*
  PROYECTO 1 - SEM\xC1FORO
  CFGB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")

  CONEXIONES (interruptor de la placa en 3.3V):
    M\xF3dulo LED ROJO  -> conector G-V-S del GPIO 18
    M\xF3dulo LED AZUL  -> conector G-V-S del GPIO 19 (hace de luz "\xE1mbar")
    M\xF3dulo LED VERDE -> conector G-V-S del GPIO 23
  En cada m\xF3dulo: G = GND (cable negro), V = alimentaci\xF3n (cable rojo),
  S = se\xF1al (cable de color).

  FUNCIONAMIENTO: verde 5 s -> azul parpadeando 3 s -> rojo 5 s -> repetir.
  El Monitor Serie (115200 baudios) muestra en qu\xE9 fase est\xE1 el sem\xE1foro.
*/

// --- 1. Pines (si cambias un cable de sitio, cambia aqu\xED el n\xFAmero) ---
const int PIN_ROJO  = 18;
const int PIN_AZUL  = 19;
const int PIN_VERDE = 23;

// --- 2. Tiempos en milisegundos (1000 ms = 1 segundo) ---
const unsigned long T_VERDE = 5000;
const unsigned long T_AMBAR = 3000;   // tiempo total del parpadeo azul
const unsigned long T_ROJO  = 5000;
const unsigned long T_PARPADEO = 250; // medio periodo del parpadeo

// Apaga los tres LEDs
void apagarTodo() {
  digitalWrite(PIN_ROJO, LOW);
  digitalWrite(PIN_AZUL, LOW);
  digitalWrite(PIN_VERDE, LOW);
}

void setup() {
  Serial.begin(115200);          // abre el Monitor Serie a 115200 baudios
  pinMode(PIN_ROJO, OUTPUT);     // los tres pines son SALIDAS digitales
  pinMode(PIN_AZUL, OUTPUT);
  pinMode(PIN_VERDE, OUTPUT);
  apagarTodo();

  // Prueba inicial: enciende cada LED 0,5 s para comprobar el montaje
  Serial.println("Prueba de LEDs: ROJO, AZUL, VERDE");
  int pines[3] = {PIN_ROJO, PIN_AZUL, PIN_VERDE};
  for (int i = 0; i < 3; i++) {
    digitalWrite(pines[i], HIGH);
    delay(500);
    digitalWrite(pines[i], LOW);
  }
  Serial.println("Semaforo en marcha");
}

void loop() {
  // FASE 1: VERDE (los coches pasan)
  apagarTodo();
  digitalWrite(PIN_VERDE, HIGH);
  Serial.println("VERDE  -> se puede pasar");
  delay(T_VERDE);

  // FASE 2: AZUL PARPADEANDO (precauci\xF3n, equivale al \xE1mbar)
  digitalWrite(PIN_VERDE, LOW);
  Serial.println("AZUL   -> precaucion (parpadeo)");
  unsigned long inicio = millis();
  while (millis() - inicio < T_AMBAR) {
    digitalWrite(PIN_AZUL, HIGH);
    delay(T_PARPADEO);
    digitalWrite(PIN_AZUL, LOW);
    delay(T_PARPADEO);
  }

  // FASE 3: ROJO (los coches se detienen)
  digitalWrite(PIN_ROJO, HIGH);
  Serial.println("ROJO   -> detenerse");
  delay(T_ROJO);
}
`});var bf,gf=vt(()=>{bf=`/*
  PROYECTO 2 - TIMBRE CON MELOD\xCDA
  CFGB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")

  CONEXIONES (interruptor de la placa en 3.3V):
    M\xF3dulo PULSADOR        -> conector G-V-S del GPIO 27
    M\xF3dulo ZUMBADOR PASIVO -> conector G-V-S del GPIO 25
    M\xF3dulo LED ROJO        -> conector G-V-S del GPIO 18

  FUNCIONAMIENTO: al pulsar el bot\xF3n suena "ding-dong" seguido de una
  melod\xEDa corta; el LED se enciende con cada nota. Cada pulsaci\xF3n se
  cuenta y se muestra en el Monitor Serie (115200 baudios).

  NOTA: el programa detecta solo si el pulsador da 0 o 1 en reposo,
  as\xED funciona con cualquier m\xF3dulo pulsador (activo a nivel alto o bajo).
*/

const int PIN_PULSADOR = 27;
const int PIN_ZUMBADOR = 25;
const int PIN_LED      = 18;

// Frecuencias de las notas en hercios (Hz)
const int DO4 = 262, RE4 = 294, MI4 = 330, FA4 = 349, SOL4 = 392,
          LA4 = 440, SI4 = 494, DO5 = 523, MI5 = 659, SOL5 = 784;

// Melod\xEDa: cada nota con su duraci\xF3n en ms. 0 = silencio.
const int melodia[]   = {MI5, DO5, 0,   SOL4, LA4, SI4, DO5, SOL5};
const int duracion[]  = {400, 600, 200, 150,  150, 150, 300, 500};
const int NUM_NOTAS = sizeof(melodia) / sizeof(melodia[0]);

int estadoReposo;           // nivel que da el pulsador SIN pulsar
int contadorTimbres = 0;

// Toca una nota y enciende el LED mientras suena
void tocarNota(int frecuencia, int ms) {
  if (frecuencia > 0) {
    digitalWrite(PIN_LED, HIGH);
    tone(PIN_ZUMBADOR, frecuencia);   // genera la onda cuadrada
  }
  delay(ms);
  noTone(PIN_ZUMBADOR);               // para el sonido
  digitalWrite(PIN_LED, LOW);
  delay(30);                          // peque\xF1a pausa entre notas
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_PULSADOR, INPUT_PULLUP);  // entrada con resistencia interna
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_ZUMBADOR, OUTPUT);
  delay(200);
  estadoReposo = digitalRead(PIN_PULSADOR);  // \xA1no pulses al arrancar!
  Serial.print("Pulsador en reposo = ");
  Serial.println(estadoReposo);
  Serial.println("Timbre listo. Pulsa el boton.");
}

void loop() {
  // \xBFEst\xE1 pulsado? (nivel distinto al de reposo)
  if (digitalRead(PIN_PULSADOR) != estadoReposo) {
    delay(30);                                   // antirrebote
    if (digitalRead(PIN_PULSADOR) != estadoReposo) {
      contadorTimbres++;
      Serial.print("DING-DONG! Timbre numero ");
      Serial.println(contadorTimbres);
      for (int i = 0; i < NUM_NOTAS; i++) {
        tocarNota(melodia[i], duracion[i]);
      }
      // Espera a que se suelte el bot\xF3n para no repetir
      while (digitalRead(PIN_PULSADOR) != estadoReposo) {
        delay(10);
      }
    }
  }
}
`});var xf,vf=vt(()=>{xf=`/*
  PROYECTO 3 - FAROLA AUTOM\xC1TICA
  CFGB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")

  CONEXIONES (interruptor de la placa en 3.3V):
    Sensor de luz (LDR) -> bloque ANALOG, fila 34 (G - 3V3 - S)
    M\xF3dulo LED RGB:  R -> S del GPIO 25
                     G -> S del GPIO 26
                     B -> S del GPIO 27
                     - -> G del GPIO 25  (GND)

  FUNCIONAMIENTO:
    Mucha luz   (d\xEDa)       -> farola apagada
    Luz media   (atardecer) -> luz \xE1mbar suave
    Poca luz    (noche)     -> luz blanca a tope
  El Monitor Serie (115200 baudios) muestra la lectura (0-4095) para
  que puedas CALIBRAR los umbrales de tu aula.
*/

const int PIN_LDR = 34;            // entrada anal\xF3gica (solo entrada)
const int PIN_R = 25, PIN_G = 26, PIN_B = 27;

// --- CALIBRACI\xD3N: mira el Monitor Serie y ajusta estos valores ---
// Si al TAPAR el sensor el n\xFAmero BAJA, deja true. Si SUBE, pon false.
const bool MAS_LUZ_MAS_VALOR = true;
int UMBRAL_NOCHE     = 1200;  // por debajo de esto (en "luz") es de noche
int UMBRAL_ATARDECER = 2200;  // entre NOCHE y ATARDECER: atardecer
const int HISTERESIS = 100;   // margen para que no parpadee en el l\xEDmite

// Si tu m\xF3dulo RGB tiene el pin com\xFAn marcado "+" (\xE1nodo com\xFAn),
// pon true y conecta ese pin a V en lugar de G.
const bool ANODO_COMUN = false;

int estado = -1;  // 0 = d\xEDa, 1 = atardecer, 2 = noche

void ponerColor(int r, int g, int b) {      // valores 0-255
  if (ANODO_COMUN) { r = 255 - r; g = 255 - g; b = 255 - b; }
  analogWrite(PIN_R, r);                     // PWM: brillo de cada color
  analogWrite(PIN_G, g);
  analogWrite(PIN_B, b);
}

// Media de 20 lecturas para reducir el ruido
int leerLuz() {
  long suma = 0;
  for (int i = 0; i < 20; i++) { suma += analogRead(PIN_LDR); delay(2); }
  int v = suma / 20;
  if (!MAS_LUZ_MAS_VALOR) v = 4095 - v;     // invertimos si hace falta
  return v;                                  // 0 = oscuro ... 4095 = mucha luz
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);                  // lecturas de 0 a 4095
  analogSetPinAttenuation(PIN_LDR, ADC_11db);// rango completo 0-3,3 V
  pinMode(PIN_R, OUTPUT); pinMode(PIN_G, OUTPUT); pinMode(PIN_B, OUTPUT);
  // Prueba de colores al arrancar: rojo, verde, azul
  ponerColor(255, 0, 0); delay(400);
  ponerColor(0, 255, 0); delay(400);
  ponerColor(0, 0, 255); delay(400);
  ponerColor(0, 0, 0);
  Serial.println("Farola automatica lista");
}

void loop() {
  int luz = leerLuz();
  int nuevo = estado;

  // Decide el estado con hist\xE9resis
  if (luz < UMBRAL_NOCHE - HISTERESIS)            nuevo = 2;
  else if (luz > UMBRAL_ATARDECER + HISTERESIS)   nuevo = 0;
  else if (luz > UMBRAL_NOCHE + HISTERESIS &&
           luz < UMBRAL_ATARDECER - HISTERESIS)   nuevo = 1;
  if (estado == -1 && nuevo == -1) nuevo = 1;

  if (nuevo != estado) {
    estado = nuevo;
    if (estado == 0) ponerColor(0, 0, 0);          // d\xEDa: apagada
    if (estado == 1) ponerColor(255, 90, 0);       // atardecer: \xE1mbar
    if (estado == 2) ponerColor(255, 255, 255);    // noche: blanco
  }

  Serial.print("Luz = ");
  Serial.print(luz);
  Serial.print("  ->  ");
  Serial.println(estado == 0 ? "DIA (apagada)" : estado == 1 ? "ATARDECER (ambar)" : "NOCHE (blanca)");
  delay(300);
}
`});var _f,yf=vt(()=>{_f=`/*
  PROYECTO 4 - TERM\xD3METRO CON ALARMA
  CFGB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")
  Librer\xEDa necesaria: "LiquidCrystal I2C" de Frank de Brabander

  CONEXIONES (interruptor de la placa en 5V, para que la LCD se vea bien):
    Sensor LM35:  G -> G de la fila 35 del bloque ANALOG
                  S -> S de la fila 35 del bloque ANALOG (GPIO 35)
                  V -> pin 5V del conector POWER (el LM35 necesita 4 V o m\xE1s)
    LCD1602 I2C:  GND/VCC/SDA/SCL -> fila 1 del bloque I2C (G-V-SDA-SCL)
    Zumbador pasivo -> conector G-V-S del GPIO 25

  FUNCIONAMIENTO: la LCD muestra la temperatura. Si supera la
  TEMP_ALARMA suena un pitido intermitente y la LCD muestra "ALARMA".
  La salida del LM35 es 10 mV por grado (25 \xB0C = 250 mV): nunca pasa de
  1 V, as\xED que es segura para la entrada de 3,3 V del ESP32.
*/

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const int PIN_LM35 = 35;
const int PIN_ZUMBADOR = 25;
const float TEMP_ALARMA = 28.0;   // \xBAC. Pellizca el sensor para probarla

LiquidCrystal_I2C lcd(0x27, 16, 2);  // direcci\xF3n 0x27, 16 columnas, 2 filas

// Lee el LM35 haciendo la media de 32 medidas (en milivoltios)
float leerTemperatura() {
  long suma = 0;
  for (int i = 0; i < 32; i++) { suma += analogReadMilliVolts(PIN_LM35); delay(2); }
  float mV = suma / 32.0;
  return mV / 10.0;                // 10 mV = 1 \xBAC
}

void setup() {
  Serial.begin(115200);
  analogSetPinAttenuation(PIN_LM35, ADC_11db);
  pinMode(PIN_ZUMBADOR, OUTPUT);
  Wire.begin(21, 22);              // SDA = GPIO 21, SCL = GPIO 22
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0); lcd.print("Termometro ESP32");
  lcd.setCursor(0, 1); lcd.print("Portal docente  ");
  delay(1500);
  lcd.clear();
}

void loop() {
  float t = leerTemperatura();
  bool alarma = (t >= TEMP_ALARMA);

  // Fila 1: temperatura
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(t, 1);
  lcd.print((char)223);            // s\xEDmbolo de grado en la LCD
  lcd.print("C   ");

  // Fila 2: estado
  lcd.setCursor(0, 1);
  if (alarma) lcd.print("!! ALARMA !!    ");
  else { lcd.print("Limite: "); lcd.print(TEMP_ALARMA, 0); lcd.print((char)223); lcd.print("C  "); }

  Serial.print("Temperatura = "); Serial.print(t, 1);
  Serial.println(alarma ? " C  -> ALARMA" : " C  -> normal");

  if (alarma) {                    // pitido de 200 ms
    tone(PIN_ZUMBADOR, 2000);
    delay(200);
    noTone(PIN_ZUMBADOR);
    delay(300);
  } else {
    delay(500);
  }
}
`});var Mf,Sf=vt(()=>{Mf=`/*
  PROYECTO 5 - SENSOR DE APARCAMIENTO
  CFGB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")
  Librer\xEDas: "Adafruit SH110X" + "Adafruit GFX Library" (Adafruit)

  CONEXIONES (interruptor de la placa en 3.3V):
    HC-SR04: VCC  -> pin 5V  del conector POWER (cable rojo, macho-hembra)
             GND  -> pin GND del conector POWER (cable negro, macho-hembra)
             Trig -> S del GPIO 26 (cable amarillo)
             Echo -> S del GPIO 27 (cable verde)   \xA1ver PRECAUCI\xD3N!
    OLED 1,3" I2C -> fila 1 del bloque I2C (GND-VCC-SDA-SCL)
    LED VERDE -> G-V-S del GPIO 18     LED ROJO -> G-V-S del GPIO 19
    Zumbador pasivo -> G-V-S del GPIO 25

  PRECAUCI\xD3N: el HC-SR04 funciona a 5 V y su pin Echo devuelve 5 V, pero
  las entradas del ESP32 son de 3,3 V. Muchos montajes lo conectan directo
  y funciona, pero queda fuera de especificaci\xF3n. Si el taller dispone de
  2 resistencias (1 k\u03A9 y 2 k\u03A9) monta un divisor de tensi\xF3n en Echo.

  FUNCIONAMIENTO (como el de un coche):
    > 50 cm  : LED verde, sin pitidos
    20-50 cm : pitidos lentos         10-20 cm : pitidos r\xE1pidos
    < 10 cm  : LED rojo y pitido continuo ("\xA1PARA!")
*/

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

const int PIN_TRIG = 26, PIN_ECHO = 27;
const int PIN_VERDE = 18, PIN_ROJO = 19, PIN_ZUMBADOR = 25;

Adafruit_SH1106G oled(128, 64, &Wire, -1);   // OLED 1,3" (chip SH1106)

unsigned long ultimoPitido = 0;
bool pitando = false;

// Mide la distancia en cm. Devuelve -1 si no hay eco (nada delante).
float medirDistancia() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);   // pulso de 10 \xB5s
  digitalWrite(PIN_TRIG, LOW);
  unsigned long us = pulseIn(PIN_ECHO, HIGH, 30000);     // m\xE1x 30 ms
  if (us == 0) return -1;
  return us * 0.0343 / 2.0;      // velocidad del sonido 343 m/s, ida y vuelta
}

void mostrar(float d, const char* zona) {
  oled.clearDisplay();
  oled.setTextColor(SH110X_WHITE);
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("APARCAMIENTO");
  oled.setTextSize(3); oled.setCursor(0, 16);
  if (d < 0) oled.print("---"); else oled.print((int)d);
  oled.setTextSize(1); oled.print(" cm");
  oled.setCursor(0, 44); oled.print(zona);
  int ancho = (d < 0 || d > 100) ? 128 : (int)(d * 1.28);   // barra 0-100 cm
  oled.drawRect(0, 56, 128, 8, SH110X_WHITE);
  oled.fillRect(0, 56, ancho, 8, SH110X_WHITE);
  oled.display();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT); pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_VERDE, OUTPUT); pinMode(PIN_ROJO, OUTPUT); pinMode(PIN_ZUMBADOR, OUTPUT);
  Wire.begin(21, 22);
  if (!oled.begin(0x3C, true)) Serial.println("OLED no encontrada (revisa SDA/SCL)");
  oled.clearDisplay(); oled.display();
  Serial.println("Sensor de aparcamiento listo");
}

void loop() {
  float d = medirDistancia();
  unsigned long intervalo;       // ms entre pitidos (0 = continuo)
  const char* zona;

  if (d < 0 || d > 50)  { zona = "LIBRE";       intervalo = 1000000; }
  else if (d > 20)      { zona = "CERCA";       intervalo = 600; }
  else if (d > 10)      { zona = "MUY CERCA";   intervalo = 200; }
  else                  { zona = "PARA!";       intervalo = 0; }

  digitalWrite(PIN_VERDE, (d < 0 || d > 10) ? HIGH : LOW);
  digitalWrite(PIN_ROJO,  (d >= 0 && d <= 20) ? HIGH : LOW);

  // Pitidos sin bloquear el programa (con millis)
  if (intervalo == 0) { tone(PIN_ZUMBADOR, 1500); pitando = true; }
  else if (intervalo >= 1000000) { noTone(PIN_ZUMBADOR); pitando = false; }
  else if (millis() - ultimoPitido >= intervalo) {
    ultimoPitido = millis();
    pitando = !pitando;
    if (pitando) tone(PIN_ZUMBADOR, 1500); else noTone(PIN_ZUMBADOR);
  }

  mostrar(d, zona);
  Serial.print("Distancia = ");
  if (d < 0) Serial.print("sin eco"); else Serial.print(d, 1);
  Serial.print(" cm  -> "); Serial.println(zona);
  delay(60);                     // el HC-SR04 necesita ~60 ms entre medidas
}
`});var wf,Ef=vt(()=>{wf=`/*
  PROYECTO 6 - BARRERA DE PARKING
  CFGB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")
  Librer\xEDas: "ESP32Servo" (Kevin Harrington) y "LiquidCrystal I2C" (Frank de Brabander)

  CONEXIONES:
    Interruptor de la placa en 5V  +  portapilas 6xAA en el jack DC
    Sensor IR de obst\xE1culos: GND -> G, VCC -> 3V3, OUT -> S de la fila 34 del bloque ANALOG
    Servo 180\xBA (cable marr\xF3n/rojo/naranja) -> G-V-S del GPIO 13
        marr\xF3n = G, rojo = V, naranja = S
    LCD1602 I2C -> fila 1 del bloque I2C (GND-VCC-SDA-SCL)

  FUNCIONAMIENTO: cuando el sensor IR detecta un coche (OUT = 0), la
  barrera sube a 90\xBA, la LCD muestra "ADELANTE" y cuenta el veh\xEDculo.
  Cuando el coche se va, espera 3 s y baja la barrera a 0\xBA.
*/

#include <Wire.h>
#include <ESP32Servo.h>
#include <LiquidCrystal_I2C.h>

const int PIN_IR = 34;          // solo entrada; el m\xF3dulo IR ya trae resistencia
const int PIN_SERVO = 13;
const int ANGULO_CERRADA = 0;
const int ANGULO_ABIERTA = 90;
const unsigned long ESPERA_CIERRE = 3000;  // ms tras irse el coche

Servo barrera;
LiquidCrystal_I2C lcd(0x27, 16, 2);

bool abierta = false;
unsigned long ultimaDeteccion = 0;
int coches = 0;

void mostrarLCD(const char* linea1) {
  lcd.setCursor(0, 0); lcd.print(linea1);
  lcd.setCursor(0, 1); lcd.print("Coches: "); lcd.print(coches); lcd.print("      ");
}

// Mueve el servo poco a poco (m\xE1s suave y consume menos de golpe)
void moverBarrera(int desde, int hasta) {
  int paso = (hasta > desde) ? 2 : -2;
  for (int a = desde; a != hasta; a += paso) { barrera.write(a); delay(15); }
  barrera.write(hasta);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_IR, INPUT);
  barrera.setPeriodHertz(50);                 // servo est\xE1ndar: 50 Hz
  barrera.attach(PIN_SERVO, 500, 2400);       // pulso m\xEDnimo y m\xE1ximo (\xB5s)
  barrera.write(ANGULO_CERRADA);
  Wire.begin(21, 22);
  lcd.init(); lcd.backlight();
  mostrarLCD("BARRERA CERRADA ");
  Serial.println("Barrera lista");
}

void loop() {
  bool hayCoche = (digitalRead(PIN_IR) == LOW);   // el m\xF3dulo da 0 al detectar

  if (hayCoche) {
    ultimaDeteccion = millis();
    if (!abierta) {
      coches++;
      Serial.print("Coche detectado. Total = "); Serial.println(coches);
      mostrarLCD("ADELANTE  >>>   ");
      moverBarrera(ANGULO_CERRADA, ANGULO_ABIERTA);
      abierta = true;
    }
  } else if (abierta && millis() - ultimaDeteccion > ESPERA_CIERRE) {
    Serial.println("Cerrando barrera");
    mostrarLCD("CERRANDO...     ");
    moverBarrera(ANGULO_ABIERTA, ANGULO_CERRADA);
    abierta = false;
    mostrarLCD("BARRERA CERRADA ");
  }
  delay(50);
}
`});var Tf,Af=vt(()=>{Tf=`/*
  PROYECTO 7 - RIEGO AUTOM\xC1TICO (+ pr\xE1ctica de mantenimiento)
  CFGB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")

  CONEXIONES (interruptor de la placa en 5V; portapilas 6xAA en el jack DC):
    Sensor de humedad: G -> G, V -> 3V3, S -> S de la fila 34 del bloque ANALOG
    M\xF3dulo rel\xE9:       G-V-S del GPIO 25
    Circuito de la bomba (SOLO BAJA TENSI\xD3N, 5 V):
      pin 5V del POWER -> borne COM del rel\xE9
      borne NO del rel\xE9 -> cable ROJO de la bomba
      cable NEGRO de la bomba -> fila de la protoboard -> pin GND del POWER

  FUNCIONAMIENTO: si la humedad baja de HUMEDAD_MINIMA, el rel\xE9 activa
  la bomba durante RIEGO_MS y luego espera REPOSO_MS a que el agua se
  reparta antes de volver a medir. Si la lectura sale del rango calibrado
  o es muy inestable (sensor desconectado o averiado) la bomba se BLOQUEA
  y el Monitor Serie avisa de "AVERIA SENSOR".
  ANTES DE USARLO: calibra LECTURA_SECO (sensor al aire) y LECTURA_MOJADO
  (puntas en un vaso de agua) con los valores que veas en el Monitor Serie.
*/

const int PIN_HUMEDAD = 34;
const int PIN_RELE = 25;
const int RELE_ACTIVO = HIGH;   // si tu rel\xE9 se activa con LOW, cambia a LOW

// --- CALIBRACI\xD3N (mira el Monitor Serie) ---
int LECTURA_SECO   = 3000;  // valor con el sensor al aire (seco)
int LECTURA_MOJADO = 1200;  // valor con el sensor metido en agua
const int HUMEDAD_MINIMA = 35;          // % por debajo del cual se riega
const unsigned long RIEGO_MS  = 3000;   // tiempo de bomba encendida
const unsigned long REPOSO_MS = 10000;  // espera despu\xE9s de regar

// Diagn\xF3stico de aver\xEDa: una lectura "sana" est\xE1 dentro del rango calibrado
// (con un margen) y es estable. Si no, sospechamos del sensor o su cable.
const int MARGEN_RANGO = 300;      // margen fuera de SECO..MOJADO
const int DISPERSION_MAX = 500;    // diferencia m\xE1x. entre lecturas seguidas
int dispersion = 0;                // se calcula en leerBruto()

void bomba(bool encender) {
  digitalWrite(PIN_RELE, encender ? RELE_ACTIVO : !RELE_ACTIVO);
}

// Media de 20 lecturas; adem\xE1s guarda la dispersi\xF3n (m\xE1x - m\xEDn)
int leerBruto() {
  long suma = 0;
  int mn = 4095, mx = 0;
  for (int i = 0; i < 20; i++) {
    int v = analogRead(PIN_HUMEDAD);
    suma += v; mn = min(mn, v); mx = max(mx, v);
    delay(5);
  }
  dispersion = mx - mn;
  return suma / 20;
}

// true si la lectura no tiene sentido (sensor averiado o desconectado)
bool sensorAveriado(int bruto) {
  int bajo = min(LECTURA_SECO, LECTURA_MOJADO) - MARGEN_RANGO;
  int alto = max(LECTURA_SECO, LECTURA_MOJADO) + MARGEN_RANGO;
  return (bruto < bajo || bruto > alto || dispersion > DISPERSION_MAX);
}

int aPorcentaje(int bruto) {
  int p = map(bruto, LECTURA_SECO, LECTURA_MOJADO, 0, 100);
  return constrain(p, 0, 100);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELE, OUTPUT);
  bomba(false);                              // \xA1la bomba empieza apagada!
  analogReadResolution(12);
  analogSetPinAttenuation(PIN_HUMEDAD, ADC_11db);
  Serial.println("Riego automatico listo");
}

void loop() {
  int bruto = leerBruto();
  int humedad = aPorcentaje(bruto);

  Serial.print("Lectura = "); Serial.print(bruto);
  Serial.print("   Dispersion = "); Serial.print(dispersion);
  Serial.print("   Humedad = "); Serial.print(humedad); Serial.print(" %");

  // 1) Diagn\xF3stico: \xBFla lectura tiene sentido?
  if (sensorAveriado(bruto)) {
    bomba(false);
    Serial.println("   -> AVERIA SENSOR: bomba bloqueada. Revisa/sustituye el sensor.");
    delay(1000);
    return;
  }

  // 2) Control de riego
  if (humedad < HUMEDAD_MINIMA) {
    Serial.println("   -> SECO: regando");
    bomba(true);
    delay(RIEGO_MS);
    bomba(false);
    Serial.println("Riego terminado. Esperando a que el agua se reparta...");
    delay(REPOSO_MS);
  } else {
    Serial.println("   -> OK, no hace falta regar");
    delay(1000);
  }
}
`});var Rf,Cf=vt(()=>{Rf=`/*
  PROYECTO 8 - VENTILADOR INTELIGENTE (proyecto final)
  CFGB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
  Placa: ACEBOTT ESP32 Plus (en Arduino IDE: "ESP32 Dev Module")
  Librer\xEDas: "Adafruit BMP280 Library", "Adafruit Unified Sensor",
             "Adafruit SH110X", "Adafruit GFX Library" (todas de Adafruit)

  CONEXIONES (interruptor de la placa en 3.3V; portapilas 6xAA en el jack DC):
    L298N:  borne +12V <- pin VIN del POWER     borne GND <- pin GND del POWER
            quitar el puente ENA
            ENA <- S del GPIO 25   IN1 <- S del GPIO 26   IN2 <- S del GPIO 27
            OUT1 y OUT2 -> los dos cables del motor DC
    Joystick: GND -> G, +5V -> 3V3, VRy -> S de la fila 34 del bloque ANALOG
              SW  -> S del GPIO 23        (VRx sin conectar)
    BMP280 -> fila 1 del bloque I2C       OLED 1,3" -> fila 2 del bloque I2C

  FUNCIONAMIENTO:
    Pulsa el joystick (SW) para cambiar de modo.
    MANUAL: joystick arriba = gira en un sentido, abajo = en el otro,
            cuanto m\xE1s lo empujas, m\xE1s r\xE1pido. En el centro se para.
    AUTO:   la velocidad depende de la temperatura del BMP280:
            < T_MIN parado; entre T_MIN y T_MAX de 40 % a 100 %; > T_MAX 100 %.
*/

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <Adafruit_BMP280.h>

const int PIN_ENA = 25, PIN_IN1 = 26, PIN_IN2 = 27;
const int PIN_JOY_Y = 34, PIN_JOY_SW = 23;

const float T_MIN = 24.0;        // \xBAC: por debajo, ventilador parado (modo AUTO)
const float T_MAX = 30.0;        // \xBAC: a partir de aqu\xED, al 100 %
const int PWM_MAX = 210;         // l\xEDmite (0-255) para no forzar el motor de 3-6 V
const int ZONA_MUERTA = 300;     // margen del centro del joystick

Adafruit_SH1106G oled(128, 64, &Wire, -1);
Adafruit_BMP280 bmp;

bool modoAuto = false;
bool bmpOk = false;
int centroJoy = 2048;
int estadoSWanterior = HIGH;

// velocidad de -100 a +100 (%). El signo indica el sentido de giro.
void motor(int velocidad) {
  velocidad = constrain(velocidad, -100, 100);
  digitalWrite(PIN_IN1, velocidad > 0 ? HIGH : LOW);
  digitalWrite(PIN_IN2, velocidad < 0 ? HIGH : LOW);
  ledcWrite(PIN_ENA, map(abs(velocidad), 0, 100, 0, PWM_MAX));   // PWM en ENA
}

void pantalla(float t, float p, int vel) {
  oled.clearDisplay();
  oled.setTextColor(SH110X_WHITE);
  oled.setTextSize(1); oled.setCursor(0, 0);
  oled.print("MODO: "); oled.print(modoAuto ? "AUTO" : "MANUAL");
  oled.setCursor(0, 14); oled.print("Temp: ");
  if (bmpOk) { oled.print(t, 1); oled.print(" C"); } else oled.print("sin BMP280");
  oled.setCursor(0, 26); oled.print("Pres: ");
  if (bmpOk) { oled.print(p, 0); oled.print(" hPa"); } else oled.print("--");
  oled.setCursor(0, 40); oled.print("Velocidad: "); oled.print(vel); oled.print(" %");
  oled.drawRect(0, 54, 128, 10, SH110X_WHITE);
  oled.fillRect(64, 56, (vel * 62) / 100, 6, SH110X_WHITE);  // barra con signo
  oled.drawFastVLine(64, 52, 12, SH110X_WHITE);
  oled.display();
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_IN1, OUTPUT); pinMode(PIN_IN2, OUTPUT);
  ledcAttach(PIN_ENA, 1000, 8);            // PWM 1 kHz, 8 bits (0-255)
  motor(0);                                // arranca PARADO
  pinMode(PIN_JOY_SW, INPUT_PULLUP);       // el bot\xF3n del joystick da 0 al pulsar
  analogReadResolution(12);
  analogSetPinAttenuation(PIN_JOY_Y, ADC_11db);

  Wire.begin(21, 22);
  if (!oled.begin(0x3C, true)) Serial.println("OLED no encontrada");
  bmpOk = bmp.begin(0x76) || bmp.begin(0x77);   // prueba las 2 direcciones
  Serial.println(bmpOk ? "BMP280 OK" : "BMP280 NO encontrado (revisa I2C)");

  delay(200);
  long s = 0;                               // calibra el centro del joystick
  for (int i = 0; i < 20; i++) { s += analogRead(PIN_JOY_Y); delay(5); }
  centroJoy = s / 20;
  Serial.print("Centro del joystick = "); Serial.println(centroJoy);
}

void loop() {
  // 1) Bot\xF3n: cambia de modo al pulsar (flanco de bajada)
  int sw = digitalRead(PIN_JOY_SW);
  if (sw == LOW && estadoSWanterior == HIGH) {
    modoAuto = !modoAuto;
    Serial.println(modoAuto ? "Cambio a modo AUTO" : "Cambio a modo MANUAL");
    delay(50);
  }
  estadoSWanterior = sw;

  // 2) Sensores
  float t = bmpOk ? bmp.readTemperature() : 0;
  float p = bmpOk ? bmp.readPressure() / 100.0 : 0;   // Pa -> hPa

  // 3) Decidir velocidad
  int vel = 0;
  if (modoAuto) {
    if (!bmpOk || t < T_MIN) vel = 0;
    else if (t >= T_MAX) vel = 100;
    else vel = 40 + (int)((t - T_MIN) * 60.0 / (T_MAX - T_MIN));
  } else {
    int y = analogRead(PIN_JOY_Y) - centroJoy;
    if (abs(y) < ZONA_MUERTA) vel = 0;
    else if (y > 0) vel = map(y, ZONA_MUERTA, 4095 - centroJoy, 30, 100);
    else            vel = -map(-y, ZONA_MUERTA, centroJoy, 30, 100);
  }
  motor(vel);
  pantalla(t, p, vel);

  Serial.print(modoAuto ? "AUTO" : "MANUAL");
  Serial.print("  T="); Serial.print(t, 1);
  Serial.print(" C  P="); Serial.print(p, 0);
  Serial.print(" hPa  vel="); Serial.print(vel); Serial.println(" %");
  delay(100);
}
`});var In,dn,Ua,es,ts,rn,Pf=vt(()=>{ff();gf();vf();yf();Sf();Ef();Af();Cf();In=(i,e,t,n="D")=>[{id:i+"G",from:i+".G",to:`${n}${e}.G`,color:"negro"},{id:i+"V",from:i+".V",to:`${n}${e}.V`,color:"rojo"},{id:i+"S",from:i+".S",to:`${n}${e}.S`,color:t}],dn=i=>i.map(e=>e.id),Ua=(i,e,t={G:"GND",V:"VCC",SDA:"SDA",SCL:"SCL"})=>[{id:i+"G",from:`${i}.${t.G}`,to:`I${e}.G`,color:"negro"},{id:i+"V",from:`${i}.${t.V}`,to:`I${e}.V`,color:"rojo"},{id:i+"SDA",from:`${i}.${t.SDA}`,to:`I${e}.SDA`,color:"azul"},{id:i+"SCL",from:`${i}.${t.SCL}`,to:`I${e}.SCL`,color:"blanco"}],es=(i,e=[])=>({t:"Prepara la placa",focus:"switch",take:["Placa ACEBOTT ESP32 Plus (SIN conectar el USB)",...e],do:["Coloca la placa sobre la mesa con el conector USB (plateado) a tu IZQUIERDA y el conector azul con los n\xFAmeros 18, 19, 23\u2026 arriba, lejos de ti. As\xED la ver\xE1s igual que en el modelo 3D.",`Pon el interruptor de tensi\xF3n en <b>${i==="5V"?"5V (palanca hacia ARRIBA, hacia el conector azul)":"3.3V (palanca hacia ABAJO, hacia el texto \xAB3.3V\xBB)"}</b>.`,"Los n\xFAmeros 18, 19, 23, 5, 13, 12 | 14, 27, 16, 17, 25, 26 est\xE1n impresos junto al conector azul superior: cada n\xFAmero marca la <b>columna de 3 pines</b> (S, V, G) que tiene justo debajo.","Localiza los bloques que vas a usar en esta pr\xE1ctica (mira la pesta\xF1a \xABEsquema\xBB)."],check:`La placa est\xE1 desconectada y el interruptor marca <b>${i==="5V"?"5V":"3.3V"}</b>.`}),ts=(i,e,t={})=>({t:"Conecta el USB y sube el programa",usb:!0,focus:"usb",state:e,allLabels:!0,take:["Cable USB-A a USB-B","Ordenador con Arduino IDE preparado"],do:["<b>Antes de conectar:</b> repasa todos los cables con la tabla de la pesta\xF1a \xABEsquema\xBB (color, pin de origen y pin de destino). Pide al profesor que lo revise.","Conecta el cable USB-B a la placa y al ordenador. Debe encenderse el LED <b>PWR</b> rojo.",`En Arduino IDE abre <b>${i}</b>, elige \xABESP32 Dev Module\xBB y el puerto, y pulsa <b>\u2192 Subir</b>.`,"Abre el Monitor Serie a <b>115200 baudios</b>.",...t.do||[]],check:t.check||"El programa se ha subido (\xABHard resetting via RTS pin\u2026\xBB) y el montaje funciona como se describe en la pesta\xF1a \xABPrueba\xBB."}),rn=[];{let i=[...In("r",18,"amarillo"),...In("a",19,"blanco"),...In("v",23,"verde")];rn.push({n:1,slug:"semaforo",title:"Sem\xE1foro",level:"Iniciaci\xF3n",duration:"2 sesiones (2 h)",icon:"\u{1F6A6}",short:"Tres LEDs que se encienden por turnos como un sem\xE1foro.",intro:"Tu primer montaje con la ESP32 Plus: conectar\xE1s tres m\xF3dulos LED a tres salidas digitales y programar\xE1s la secuencia de un sem\xE1foro. Aprender\xE1s a reconocer los conectores G-V-S de la placa y qu\xE9 hace cada uno de sus tres pines.",switch:"3V3",objectives:["Identificar las partes de la placa ESP32 Plus: USB, jack DC, interruptor 3.3V/5V y conectores G-V-S.","Conectar m\xF3dulos de 3 pines (G, V, S) con cables Dupont hembra-hembra respetando el c\xF3digo de colores.","Programar salidas digitales con pinMode() y digitalWrite().","Comprobar con el pol\xEDmetro la tensi\xF3n de alimentaci\xF3n y de una salida."],ra:{1:["a"],2:["a","b","c"],3:["c","d","e","i","j"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["M\xF3dulo LED rojo",1],["M\xF3dulo LED azul (har\xE1 de luz \xE1mbar)",1],["M\xF3dulo LED verde",1],["Cables Dupont hembra-hembra (H-H) 20 cm",9,"negro \xD73, rojo \xD73, amarillo, blanco, verde"],["Cable USB-A a USB-B",1]],libs:[],code:mf,file:"P1_Semaforo/P1_Semaforo.ino",parts:{r:{type:"led",color:"rojo",pos:[-30,-64],label:"LED rojo \u2192 GPIO 18"},a:{type:"led",color:"azul",pos:[0,-64],label:"LED azul \u2192 GPIO 19"},v:{type:"led",color:"verde",pos:[30,-64],label:"LED verde \u2192 GPIO 23"}},wires:i,steps:[es("3V3",["M\xF3dulos LED rojo, azul y verde","9 cables H-H"]),{t:"Conecta el LED rojo",add:["r"],wires:dn(i.slice(0,3)),take:["M\xF3dulo LED rojo","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el m\xF3dulo arriba a la izquierda de la placa, con sus pines G-V-S mirando hacia la placa."],check:"Los 3 cables salen de la columna <b>18</b> y llegan a G, V y S del LED rojo, sin cruzarse entre s\xED. Cada conector est\xE1 metido hasta el fondo."},{t:"Conecta el LED azul",add:["a"],wires:dn(i.slice(3,6)),take:["M\xF3dulo LED azul","3 cables H-H: negro, rojo y blanco"],do:["Coloca el m\xF3dulo en el centro, junto al rojo."],check:"Columna <b>19</b> (la que est\xE1 justo a la derecha de la 18): G negro, V rojo, S blanco."},{t:"Conecta el LED verde",add:["v"],wires:dn(i.slice(6,9)),take:["M\xF3dulo LED verde","3 cables H-H: negro, rojo y verde"],do:["Coloca el m\xF3dulo a la derecha."],check:"Columna <b>23</b>: G negro, V rojo, S verde. En total hay 9 cables y ninguno toca a otro pin."},ts("P1_Semaforo.ino",{glow:{v:!0}},{check:"Al arrancar se encienden rojo, azul y verde 0,5 s cada uno (prueba). Despu\xE9s: verde 5 s \u2192 azul parpadeando 3 s \u2192 rojo 5 s, y vuelta a empezar."})],expected:["Al encender: prueba r\xE1pida de los tres LEDs (rojo, azul, verde, 0,5 s cada uno).","Ciclo continuo: VERDE 5 s \u2192 AZUL parpadeando 3 s (precauci\xF3n) \u2192 ROJO 5 s.","En el Monitor Serie aparece la fase actual."],serial:`Prueba de LEDs: ROJO, AZUL, VERDE
Semaforo en marcha
VERDE  -> se puede pasar
AZUL   -> precaucion (parpadeo)
ROJO   -> detenerse
VERDE  -> se puede pasar`,example:"Ejemplo: si cambias <code>T_VERDE = 5000</code> por <code>T_VERDE = 8000</code>, el verde durar\xE1 8 segundos. Un ciclo completo dura 5 + 3 + 5 = 13 s; \xBFcu\xE1ntos ciclos hace en un minuto? (60 / 13 \u2248 4,6 ciclos).",multimeter:[["Tensi\xF3n de alimentaci\xF3n","Pol\xEDmetro en 20 V DC. Punta NEGRA en un pin G, punta ROJA en un pin V de cualquier columna.","\u2248 3,3 V (interruptor en 3.3V)"],["Salida GPIO 23 (LED verde)","Punta negra en G, roja en S de la columna 23. Mide mientras el verde est\xE1 encendido y cuando est\xE1 apagado.","Encendido \u2248 3,3 V \xB7 Apagado \u2248 0 V"],["Continuidad de un cable","ANTES de montar: pol\xEDmetro en continuidad (pitido), una punta en cada extremo del cable Dupont.","Pita = cable bueno. No pita = cable roto, ap\xE1rtalo."]],trouble:[["Ning\xFAn LED se enciende y el LED PWR est\xE1 apagado","USB mal conectado o cable solo de carga","Prueba otro cable/puerto USB."],["Un LED no se enciende nunca","Cable S en otra columna, o G/V cambiados","Sigue el cable desde el m\xF3dulo hasta la placa y comp\xE1ralo con la tabla."],["Los LEDs se encienden en otro orden","M\xF3dulos conectados en columnas cambiadas","Comprueba que rojo=18, azul=19, verde=23."],["Error \xABFailed to connect to ESP32\xBB","Puerto equivocado o Monitor Serie ocupando el puerto","Elige el puerto correcto; cierra otros programas que usen el puerto."],["Brillo muy d\xE9bil","Pin V sin conectar (el LED solo recibe se\xF1al)","Revisa el cable rojo V."]],challenge:["A\xF1ade un modo nocturno: si escribes \xABn\xBB en el Monitor Serie, el sem\xE1foro pasa a azul intermitente permanente.","Usa el cuarto m\xF3dulo (LED RGB, proyecto 3) como sem\xE1foro de peatones: verde cuando el de coches est\xE1 en rojo."]})}{let i=[...In("led",18,"amarillo"),...In("btn",27,"verde"),...In("bz",25,"naranja")];rn.push({n:2,slug:"timbre",title:"Timbre con melod\xEDa",level:"Iniciaci\xF3n",duration:"2 sesiones (2 h)",icon:"\u{1F514}",short:"Un pulsador que hace sonar una melod\xEDa y enciende un LED.",intro:"Construir\xE1s el timbre de una casa: al pulsar el bot\xF3n suena \xABding-dong\xBB y una melod\xEDa corta mientras un LED parpadea. Aprender\xE1s la diferencia entre una entrada (el pulsador) y una salida (zumbador y LED) y c\xF3mo un zumbador pasivo produce notas musicales.",switch:"3V3",objectives:["Distinguir entradas y salidas digitales.","Leer un pulsador con digitalRead() y evitar rebotes.","Generar sonidos de distinta frecuencia con tone() en un zumbador pasivo.","Medir con el pol\xEDmetro el estado de una entrada."],ra:{2:["b","c","e"],3:["d","e","i"],4:["a","b","c","h"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["M\xF3dulo pulsador",1],["M\xF3dulo zumbador pasivo",1],["M\xF3dulo LED rojo",1],["Cables Dupont H-H",9,"negro \xD73, rojo \xD73, amarillo, verde, naranja"],["Cable USB-A a USB-B",1]],libs:[],code:bf,file:"P2_Timbre/P2_Timbre.ino",parts:{led:{type:"led",color:"rojo",pos:[-32,-64],label:"LED rojo \u2192 GPIO 18"},btn:{type:"button",pos:[2,-66],label:"Pulsador \u2192 GPIO 27"},bz:{type:"buzzer",pos:[36,-66],label:"Zumbador \u2192 GPIO 25"}},wires:i,steps:[es("3V3",["M\xF3dulo pulsador, zumbador pasivo y LED rojo","9 cables H-H"]),{t:"Conecta el pulsador (entrada)",add:["btn"],wires:dn(i.slice(3,6)),take:["M\xF3dulo pulsador","3 cables H-H: negro, rojo y verde"],do:["Coloca el pulsador arriba, en el centro."],check:"Columna <b>27</b> (la segunda del bloque derecho): G negro, V rojo, S verde."},{t:"Conecta el zumbador pasivo",add:["bz"],wires:dn(i.slice(6,9)),take:["M\xF3dulo zumbador pasivo (el cilindro negro sobre placa)","3 cables H-H: negro, rojo y naranja"],do:["Coloca el zumbador arriba a la derecha."],check:"Columna <b>25</b>: G negro, V rojo, S naranja."},{t:"Conecta el LED rojo",add:["led"],wires:dn(i.slice(0,3)),take:["M\xF3dulo LED rojo","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el LED arriba a la izquierda."],check:"Columna <b>18</b>: G negro, V rojo, S amarillo. Hay 9 cables en total."},ts("P2_Timbre.ino",{glow:{led:!0}},{do:["<b>No pulses el bot\xF3n mientras arranca la placa</b>: el programa aprende c\xF3mo est\xE1 el bot\xF3n en reposo."],check:"Al pulsar suena \xABding-dong\xBB + melod\xEDa y el LED se enciende con cada nota. El Monitor Serie cuenta los timbrazos."})],expected:["Al pulsar: \xABding-dong\xBB (MI5\u2013DO5) y una escala corta (SOL\u2013LA\u2013SI\u2013DO\u2013SOL).","El LED rojo se enciende con cada nota.","El Monitor Serie muestra \xABDING-DONG! Timbre numero N\xBB.","Si mantienes pulsado, solo suena una vez hasta que sueltes."],serial:`Pulsador en reposo = 1
Timbre listo. Pulsa el boton.
DING-DONG! Timbre numero 1
DING-DONG! Timbre numero 2`,example:"Ejemplo: la nota LA4 vibra 440 veces por segundo (440 Hz). Si duplicas la frecuencia (880 Hz) suena la misma nota una octava m\xE1s aguda. Prueba a cambiar <code>MI5</code> por <code>MI4</code> en la melod\xEDa y escucha la diferencia.",multimeter:[["Se\xF1al del pulsador","Pol\xEDmetro en 20 V DC. Negra en G y roja en S de la columna 27. Mide sin pulsar y pulsando.","Un estado \u2248 3,3 V y el otro \u2248 0 V (depende del m\xF3dulo)"],["Zumbador sonando","Negra en G, roja en S de la columna 25 mientras suena.","\u2248 1,6 V: el pol\xEDmetro muestra la MEDIA de una onda cuadrada de 0 a 3,3 V"],["Alimentaci\xF3n","Negra en G, roja en V de cualquier columna.","\u2248 3,3 V"]],trouble:[["Suena solo, sin pulsar","Se puls\xF3 el bot\xF3n durante el arranque","Pulsa RESET sin tocar el bot\xF3n."],["No suena nada pero el LED parpadea","Zumbador mal conectado o es el activo","Revisa la columna 25; usa el zumbador PASIVO."],["Suena un pitido continuo sin melod\xEDa","Has usado un zumbador activo","C\xE1mbialo por el pasivo."],["No reacciona al bot\xF3n","Cable S del pulsador en otra columna","Debe ir a la columna 27."],["Suena dos veces por pulsaci\xF3n","Rebote del pulsador","Aumenta delay(30) a delay(60)."]],challenge:["Programa una segunda melod\xEDa y elige cu\xE1l suena seg\xFAn cu\xE1ntas veces pulses seguidas.","Haz que si pulsas m\xE1s de 3 veces en 5 segundos suene una \xABalarma\xBB (sirena subiendo y bajando de frecuencia)."]})}{let i=[...In("ldr",34,"amarillo","A"),{id:"rgbR",from:"rgb.R",to:"D25.S",color:"rojo"},{id:"rgbG",from:"rgb.G",to:"D26.S",color:"verde"},{id:"rgbB",from:"rgb.B",to:"D27.S",color:"azul"},{id:"rgbN",from:"rgb.-",to:"D25.G",color:"negro"}];rn.push({n:3,slug:"farola",title:"Farola autom\xE1tica",level:"B\xE1sico",duration:"2\u20133 sesiones (3 h)",icon:"\u{1F4A1}",short:"Un sensor de luz que enciende un LED RGB al anochecer.",intro:"Las farolas de la calle se encienden solas cuando se hace de noche. Usar\xE1s un sensor de luz (LDR) conectado a una entrada anal\xF3gica y un LED RGB que cambia de color: apagado de d\xEDa, \xE1mbar al atardecer y blanco de noche.",switch:"3V3",objectives:["Diferenciar se\xF1al anal\xF3gica (0\u20134095) y digital (0/1).","Leer un sensor anal\xF3gico con analogRead() y calibrar umbrales.","Controlar el brillo de cada color de un LED RGB con PWM (analogWrite).","Comprobar con el pol\xEDmetro la tensi\xF3n del sensor con luz y a oscuras."],ra:{2:["a","b","c"],3:["c","d","e"],4:["c","g"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de luz (LDR)",1],["M\xF3dulo LED RGB",1],["Cables Dupont H-H",7,"negro \xD72, rojo \xD72, amarillo, verde, azul"],["Cable USB-A a USB-B",1]],libs:[],code:xf,file:"P3_Farola/P3_Farola.ino",parts:{ldr:{type:"ldr",pos:[-30,66],rot:180,label:"Sensor de luz \u2192 ANALOG 34"},rgb:{type:"rgb",pos:[22,-66],label:"LED RGB \u2192 GPIO 25-26-27"}},wires:i,steps:[es("3V3",["Sensor de luz (LDR) y m\xF3dulo LED RGB","7 cables H-H"]),{t:"Conecta el sensor de luz al bloque ANALOG",add:["ldr"],wires:dn(i.slice(0,3)),take:["Sensor de luz (LDR)","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el sensor delante de la placa (abajo a la izquierda), con sus pines mirando hacia la placa y la LDR hacia arriba.","El bloque ANALOG est\xE1 a la izquierda del chip plateado, rodeado por un recuadro blanco. Usa la fila de ARRIBA, marcada <b>34</b>."],check:"Fila <b>34</b> del bloque ANALOG: G negro, 3V3 rojo, S amarillo. El pin rojo de este bloque da siempre 3,3 V."},{t:"Conecta el LED RGB",add:["rgb"],wires:dn(i.slice(3,7)),take:["M\xF3dulo LED RGB (4 pines: R, G, B, \u2212)","4 cables H-H: rojo, verde, azul y negro"],do:["Coloca el LED RGB arriba a la derecha.","Ojo: aqu\xED los cables de color van a pines <b>S</b> de tres columnas distintas, y el negro a un pin <b>G</b>.","Si tu m\xF3dulo tiene el pin com\xFAn marcado \xAB+\xBB en vez de \xAB\u2212\xBB, conecta ese pin a <b>V</b> (no a G) y pon <code>ANODO_COMUN = true</code> en el c\xF3digo."],check:"R \u2192 S del 25, G \u2192 S del 26, B \u2192 S del 27, \u2212 \u2192 G del 25. El pin G del m\xF3dulo RGB significa \xABgreen\xBB (verde), \xA1no GND!"},ts("P3_Farola.ino",{glow:{rgb:"#ffb347"}},{do:["<b>Calibra</b>: mira el valor \xABLuz =\xBB con la luz del aula, tapando el sensor con la mano y a medio tapar. Ajusta <code>UMBRAL_NOCHE</code> y <code>UMBRAL_ATARDECER</code> y vuelve a subir el programa."],check:"Con luz: LED apagado. A medio tapar: \xE1mbar. Tapado: blanco."})],expected:["Al arrancar: prueba de colores rojo \u2192 verde \u2192 azul.","Con la luz del aula el LED est\xE1 apagado (D\xCDA).","Tapando a medias el sensor: luz \xE1mbar (ATARDECER).","Tap\xE1ndolo del todo: luz blanca (NOCHE).","Gracias a la hist\xE9resis el LED no parpadea al estar justo en el l\xEDmite."],serial:`Farola automatica lista
Luz = 2890  ->  DIA (apagada)
Luz = 1710  ->  ATARDECER (ambar)
Luz = 420  ->  NOCHE (blanca)`,example:"Ejemplo de c\xE1lculo: el ESP32 convierte 0\u20133,3 V en 0\u20134095. Una lectura de 2048 equivale a 2048 \xD7 3,3 / 4095 \u2248 1,65 V. Mide con el pol\xEDmetro el pin S del sensor y compara con la lectura del Monitor Serie.",multimeter:[["Tensi\xF3n del sensor con luz","Pol\xEDmetro en 20 V DC. Negra en G y roja en S de la fila 34 (bloque ANALOG).","Con luz y tapado deben salir valores claramente distintos (por ejemplo 2,3 V y 0,4 V)"],["Alimentaci\xF3n del sensor","Negra en G, roja en 3V3 de la fila 34.","\u2248 3,3 V"],["Brillo de un color (PWM)","Negra en G, roja en S de la columna 25 con la luz \xE1mbar.","\u2248 3,3 V (rojo a 255) \xB7 columna 26 \u2248 1,2 V (verde a 90)"]],trouble:[["El LED nunca se enciende","Umbrales sin calibrar","Mira el Monitor Serie y ajusta los umbrales a tu aula."],["Funciona al rev\xE9s (se enciende con luz)","Tu sensor da valores m\xE1s bajos con m\xE1s luz","Pon MAS_LUZ_MAS_VALOR = false."],["Colores cambiados (rojo sale verde)","Cables R/G/B en columnas cambiadas","R\u219225, G\u219226, B\u219227."],["El LED RGB est\xE1 siempre encendido en blanco","M\xF3dulo de \xE1nodo com\xFAn","Com\xFAn a V y ANODO_COMUN = true."],["Lectura fija en 0 o 4095","Cable S suelto o en la fila equivocada","El sensor va en la fila 34 del bloque ANALOG."]],challenge:["Haz que el brillo blanco sea proporcional a la oscuridad (m\xE1s oscuro = m\xE1s brillo) usando map().","A\xF1ade el zumbador: un pitido corto cada vez que la farola cambia de estado."]})}{let i=[{id:"lmG",from:"lm.G",to:"A35.G",color:"negro"},{id:"lmS",from:"lm.S",to:"A35.S",color:"amarillo"},{id:"lmV",from:"lm.V",to:"P.5V",color:"rojo"},...Ua("lcd",1),...In("bz",25,"naranja")];rn.push({n:4,slug:"termometro",title:"Term\xF3metro con alarma",level:"B\xE1sico",duration:"3 sesiones (3 h)",icon:"\u{1F321}\uFE0F",short:"LM35 + pantalla LCD I2C + zumbador de alarma.",intro:"Fabricar\xE1s un term\xF3metro digital: el sensor LM35 mide la temperatura, la pantalla LCD de 16\xD72 caracteres la muestra y, si se supera un l\xEDmite, suena una alarma. Conocer\xE1s el bus I2C, que permite conectar pantallas con solo 4 cables.",switch:"5V",objectives:["Convertir una tensi\xF3n en temperatura (LM35: 10 mV/\xB0C).","Conectar un dispositivo I2C (LCD1602, direcci\xF3n 0x27) al bloque I2C.","Instalar y usar una librer\xEDa en Arduino IDE.","Contrastar la medida del pol\xEDmetro con la de la pantalla."],ra:{1:["a"],3:["d","e","i","j"],4:["a","c","g","h","i"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de temperatura LM35",1],["Pantalla LCD1602 con adaptador I2C",1],["M\xF3dulo zumbador pasivo",1],["Cables Dupont H-H",9,"negro \xD73, rojo \xD72, amarillo, azul, blanco, naranja"],["Cable Dupont macho-hembra (M-H)",1,"rojo"],["Cable USB-A a USB-B",1]],libs:["lcd"],code:_f,file:"P4_Termometro/P4_Termometro.ino",parts:{lm:{type:"lm35",pos:[-28,66],rot:180,label:"LM35 \u2192 ANALOG 35 + 5V"},lcd:{type:"lcd",pos:[112,4],label:"LCD1602 I2C \u2192 I2C fila 1",lines:["Temp: 24.6\xB0C","Limite: 28\xB0C"]},bz:{type:"buzzer",pos:[26,-66],label:"Zumbador \u2192 GPIO 25"}},wires:i,steps:[es("5V",["LM35, pantalla LCD1602 I2C y zumbador pasivo","9 cables H-H y 1 cable M-H"]),{t:"Conecta el sensor LM35",add:["lm"],wires:["lmG","lmS","lmV"],take:["M\xF3dulo LM35","2 cables H-H (negro y amarillo)","1 cable M-H rojo (un extremo con agujero y otro con pin)"],do:["Coloca el LM35 delante de la placa, abajo a la izquierda.","El G y la S van a la fila <b>35</b> del bloque ANALOG (la segunda fila empezando por arriba).","La V NO va al bloque ANALOG: el LM35 necesita 4 V o m\xE1s. El extremo hembra del cable rojo va al pin V del LM35 y el extremo macho se clava en el agujero <b>5V</b> del conector POWER."],check:"G (negro) y S (amarillo) en la fila 35; el pin 3V3 de esa fila queda LIBRE. V (rojo) en el 2\xBA agujero del conector POWER, marcado 5V."},{t:"Conecta la pantalla LCD al bloque I2C",add:["lcd"],wires:dn(i.slice(3,7)),take:["Pantalla LCD1602 I2C","4 cables H-H: negro, rojo, azul y blanco"],do:["Coloca la pantalla a la derecha de la placa. Sus 4 pines est\xE1n en el adaptador negro de la parte de atr\xE1s, en el lado izquierdo.","Usa la fila de ARRIBA (fila 1) del bloque I2C."],check:"GND\u2192G (negro), VCC\u2192V (rojo), SDA\u2192SDA (azul), SCL\u2192SCL (blanco). Lee los nombres en el adaptador: no los conectes por posici\xF3n."},{t:"Conecta el zumbador",add:["bz"],wires:dn(i.slice(7,10)),take:["M\xF3dulo zumbador pasivo","3 cables H-H: negro, rojo y naranja"],do:["Coloca el zumbador arriba, a la derecha."],check:"Columna <b>25</b>: G negro, V rojo, S naranja. Con el interruptor en 5V, los pines V dan 5 V."},ts("P4_Termometro.ino",null,{do:["Instala antes la librer\xEDa <b>LiquidCrystal I2C</b> (Frank de Brabander).","Si la pantalla se enciende pero no se ven letras, gira con el destornillador el potenci\xF3metro azul de la parte trasera."],check:"La LCD muestra \xABTemp: xx.x\xB0C\xBB. Al pellizcar el LM35 con los dedos la temperatura sube; al pasar de 28 \xB0C suena la alarma."})],expected:["Pantalla de bienvenida 1,5 s y luego la temperatura con 1 decimal.","Fila 2: \xABLimite: 28\xB0C\xBB o \xAB!! ALARMA !!\xBB.","Al calentar el sensor con los dedos sube unos grados en 20\u201330 s; por encima de 28 \xB0C pita cada medio segundo."],serial:`Temperatura = 24.6 C  -> normal
Temperatura = 26.9 C  -> normal
Temperatura = 28.3 C  -> ALARMA`,example:"Ejemplo: si el pol\xEDmetro marca 0,246 V en la salida del LM35, la temperatura es 0,246 V \xF7 0,010 V/\xB0C = <b>24,6 \xB0C</b>. Comp\xE1ralo con la pantalla: la diferencia deber\xEDa ser menor de 1\u20132 \xB0C.",multimeter:[["Salida del LM35","Pol\xEDmetro en 2 V o 20 V DC. Negra en G y roja en S de la fila 35.","\u2248 0,20\u20130,30 V a temperatura ambiente (= 20\u201330 \xB0C)"],["Alimentaci\xF3n del LM35","Negra en G, roja en el pin V del LM35 (o en el agujero 5V del POWER).","\u2248 5 V"],["Alimentaci\xF3n de la LCD","Negra en G, roja en V de la fila 1 del bloque I2C.","\u2248 5 V (interruptor en 5V)"]],trouble:[["Pantalla iluminada pero sin letras","Contraste mal ajustado","Gira el potenci\xF3metro azul de atr\xE1s."],["Pantalla apagada","Interruptor en 3.3V o VCC/GND mal","Interruptor en 5V; revisa GND y VCC."],["Cuadros negros en la fila 1","SDA/SCL cambiados o direcci\xF3n distinta","Comprueba SDA/SCL; si persiste prueba la direcci\xF3n 0x3F."],["Temperatura absurda (\u2248 0 \xB0C o > 100 \xB0C)","LM35 sin 5 V o S en otra fila","V al 5V del POWER; S en la fila 35."],["Error de compilaci\xF3n \xABLiquidCrystal_I2C.h: No such file\xBB","Falta la librer\xEDa","Inst\xE1lala desde el gestor de bibliotecas."]],challenge:["Guarda la temperatura m\xE1xima y m\xEDnima desde el arranque y mu\xE9stralas alternando en la fila 2.","Haz que el l\xEDmite de alarma se pueda cambiar enviando un n\xFAmero por el Monitor Serie."]})}{let i=[{id:"usV",from:"us.VCC",to:"P.5V",color:"rojo"},{id:"usG",from:"us.GND",to:"P.GND",color:"negro"},{id:"usT",from:"us.Trig",to:"D26.S",color:"amarillo"},{id:"usE",from:"us.Echo",to:"D27.S",color:"verde"},...Ua("oled",1),...In("lv",18,"verde"),...In("lr",19,"morado"),...In("bz",25,"naranja")];rn.push({n:5,slug:"aparcamiento",title:"Sensor de aparcamiento",level:"Intermedio",duration:"3 sesiones (3 h)",icon:"\u{1F17F}\uFE0F",short:"Ultrasonidos HC-SR04 + OLED + LEDs + pitidos seg\xFAn la distancia.",intro:"Como el sensor de aparcamiento de un coche: el HC-SR04 mide la distancia con ultrasonidos, la pantalla OLED la muestra en grande con una barra, y los LEDs y el zumbador avisan cada vez m\xE1s r\xE1pido seg\xFAn te acercas.",switch:"3V3",caution:"El HC-SR04 funciona a 5 V y su pin Echo devuelve pulsos de 5 V, pero las entradas del ESP32 son de 3,3 V. Muchos montajes lo conectan directo y funciona, pero queda fuera de lo que admite el fabricante y podr\xEDa da\xF1ar el pin a la larga. Si el taller dispone de 2 resistencias (1 k\u03A9 y 2 k\u03A9, no incluidas en el kit) monta un divisor de tensi\xF3n en Echo sobre la protoboard: Echo \u2192 1 k\u03A9 \u2192 GPIO 27, y GPIO 27 \u2192 2 k\u03A9 \u2192 GND.",objectives:["Explicar c\xF3mo se mide una distancia por el tiempo de un eco (d = t \xD7 343 m/s \xF7 2).","Alimentar un m\xF3dulo de 5 V desde el conector POWER y conocer el riesgo de los niveles de 5 V en entradas de 3,3 V.","Mostrar datos y gr\xE1ficos en una pantalla OLED I2C.","Programar avisos sin bloquear el programa con millis()."],ra:{2:["b","c","e"],3:["e","i"],4:["c","d","g","h"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de ultrasonidos HC-SR04",1],['Pantalla OLED 1,3" I2C',1],["M\xF3dulo LED verde",1],["M\xF3dulo LED rojo",1],["M\xF3dulo zumbador pasivo",1],["Cables Dupont H-H",15,"negro \xD74, rojo \xD74, amarillo, verde \xD72, azul, blanco, morado, naranja"],["Cables Dupont M-H",2,"rojo y negro"],["Cable USB-A a USB-B",1],["Una caja o libro como \xABcoche\xBB",1,"no incluido en el kit"]],libs:["sh110x","gfx"],code:Mf,file:"P5_Aparcamiento/P5_Aparcamiento.ino",parts:{us:{type:"hcsr04",pos:[100,-6],rot:-90,label:"HC-SR04 \u2192 5V, GND, GPIO 26, 27"},car:{type:"car",pos:[158,-6],rot:90},oled:{type:"oled",pos:[30,72],rot:180,label:"OLED \u2192 I2C fila 1",draw:"parking"},lv:{type:"led",color:"verde",pos:[-48,-64],label:"LED verde \u2192 GPIO 18"},lr:{type:"led",color:"rojo",pos:[-20,-64],label:"LED rojo \u2192 GPIO 19"},bz:{type:"buzzer",pos:[26,-66],label:"Zumbador \u2192 GPIO 25"}},wires:i,steps:[es("3V3",['HC-SR04, OLED 1,3", LED verde, LED rojo y zumbador',"15 cables H-H y 2 cables M-H"]),{t:"Alimenta el HC-SR04 desde el conector POWER",add:["us"],wires:["usV","usG"],take:["Sensor HC-SR04","2 cables M-H: rojo y negro"],do:["Coloca el HC-SR04 a la derecha de la placa, de pie, con los dos \xABojos\xBB mirando hacia fuera (ap\xF3yalo contra un estuche o suj\xE9talo con plastilina; el soporte gris del modelo 3D es solo orientativo).","Extremo hembra en el sensor; extremo macho en el conector azul POWER de abajo."],check:"VCC (rojo) en el agujero <b>5V</b> (2\xBA por la izquierda) y GND (negro) en el agujero <b>GND</b> (6\xBA por la izquierda). \xA1No los inviertas!"},{t:"Conecta Trig y Echo",add:[],wires:["usT","usE"],take:["2 cables H-H: amarillo y verde"],do:["Trig y Echo van a pines <b>S</b> (solo se\xF1al) del bloque derecho.","\u26A0\uFE0F Lee la nota de precauci\xF3n de 5 V sobre el pin Echo (pesta\xF1a \xABFicha\xBB)."],check:"Trig (amarillo) \u2192 S de la columna 26 \xB7 Echo (verde) \u2192 S de la columna 27. Los pines V y G de esas columnas quedan libres."},{t:"Conecta la pantalla OLED",add:["oled"],wires:dn(i.slice(4,8)),take:['Pantalla OLED 1,3"',"4 cables H-H: negro, rojo, azul y blanco"],do:["Coloca la OLED delante de la placa, con sus pines hacia la placa.","Lee el orden de los pines en la propia pantalla: en algunas es GND-VCC-SCL-SDA y en otras VCC-GND-SCL-SDA."],check:"Fila 1 del bloque I2C: GND\u2192G, VCC\u2192V, SDA\u2192SDA (azul), SCL\u2192SCL (blanco)."},{t:"Conecta los LEDs y el zumbador",add:["lv","lr","bz"],wires:dn(i.slice(8,17)),take:["LED verde, LED rojo y zumbador pasivo","9 cables H-H"],do:["LED verde \u2192 columna 18, LED rojo \u2192 columna 19, zumbador \u2192 columna 25 (los tres con G negro, V rojo y S de color)."],check:"En total 17 cables. Ning\xFAn pin tiene dos cables."},{...ts("P5_Aparcamiento.ino",{glow:{lr:!0}},{do:["Instala antes <b>Adafruit SH110X</b> (y sus dependencias Adafruit GFX y BusIO).","Acerca despacio una caja o tu mano al sensor."],check:">50 cm: verde y silencio \xB7 20\u201350 cm: pitidos lentos \xB7 10\u201320 cm: r\xE1pidos y LED rojo \xB7 <10 cm: pitido continuo y \xABPARA!\xBB."}),add:["car"]}],expected:["La OLED muestra la distancia en grande, la zona y una barra (0\u2013100 cm).","Sin obst\xE1culo (o a m\xE1s de 4 m) aparece \xAB---\xBB y LIBRE.","Acercando un objeto: los pitidos se aceleran hasta ser continuos a menos de 10 cm."],serial:`Sensor de aparcamiento listo
Distancia = 72.4 cm  -> LIBRE
Distancia = 35.1 cm  -> CERCA
Distancia = 14.8 cm  -> MUY CERCA
Distancia = 7.2 cm  -> PARA!`,example:"Ejemplo: si el eco tarda 1.000 \xB5s, la distancia es 1.000 \xD7 0,0343 \xF7 2 = <b>17,2 cm</b> (se divide entre 2 porque el sonido va y vuelve). Mide con una regla la distancia real a la caja y comp\xE1rala con la pantalla.",multimeter:[["Alimentaci\xF3n del HC-SR04","Pol\xEDmetro en 20 V DC. Negra en GND y roja en VCC del sensor.","\u2248 5 V"],["Alimentaci\xF3n de la OLED","Negra en G, roja en V de la fila 1 del bloque I2C.","\u2248 3,3 V"],["Pin Echo (comprobaci\xF3n de riesgo)","Negra en G, roja en el pin Echo, con un objeto a 10 cm.","Valor medio bajo (< 1 V); los picos son de 5 V aunque el pol\xEDmetro no los muestre"]],trouble:[["Siempre \xAB---\xBB","Trig/Echo cambiados o sin 5 V","Trig\u219226, Echo\u219227; VCC al 5V."],["OLED en negro","Pines cambiados o direcci\xF3n 0x3D","Conecta por nombre; prueba oled.begin(0x3D)."],["Imagen de la OLED desplazada o con basura","La pantalla es SSD1306","Usa la librer\xEDa Adafruit SSD1306 o pregunta al profesor."],["Medidas que saltan","Superficie blanda o inclinada","Usa un objeto plano y r\xEDgido."],["Pitido continuo sin objeto","Echo mal conectado (lee 0 cm)","Revisa el cable verde."]],challenge:["Muestra en la OLED la velocidad a la que se acerca el objeto (cm/s).","A\xF1ade el sensor IR del kit como \xABtope\xBB: si detecta algo, \xABPARA!\xBB aunque el ultrasonido no lo vea."]})}{let i=[{id:"irG",from:"ir.GND",to:"A34.G",color:"negro"},{id:"irV",from:"ir.VCC",to:"A34.V",color:"rojo"},{id:"irS",from:"ir.OUT",to:"A34.S",color:"amarillo"},{id:"svG",from:"sv.marron",to:"D13.G",color:"marron",k0:30},{id:"svV",from:"sv.rojo",to:"D13.V",color:"rojo",k0:30},{id:"svS",from:"sv.naranja",to:"D13.S",color:"naranja",k0:30},...Ua("lcd",1),{id:"bat",from:"bat.dc",to:"DC",color:"negro",thick:!0}];rn.push({n:6,slug:"barrera",title:"Barrera de parking",level:"Intermedio",duration:"3 sesiones (3 h)",icon:"\u{1F6A7}",short:"Sensor IR + servo 180\xB0 + LCD, con alimentaci\xF3n externa.",intro:"Automatizar\xE1s la barrera de un parking: cuando el sensor de infrarrojos detecta un coche, un servomotor levanta la barrera y la pantalla da la bienvenida y cuenta los veh\xEDculos. Como el servo consume m\xE1s corriente de la que da el USB, usar\xE1s un portapilas externo.",switch:"5V",caution:"Pon el interruptor en 5V solo con la placa desconectada. Con 5V, los pines V de TODOS los conectores G-V-S dan 5 V; por eso el sensor IR va al bloque ANALOG, cuyo pin 3V3 da siempre 3,3 V y as\xED su salida nunca supera los 3,3 V.",objectives:["Controlar la posici\xF3n de un servomotor con PWM (librer\xEDa ESP32Servo).","Justificar por qu\xE9 un actuador necesita alimentaci\xF3n externa y conectarla de forma segura.","Leer un sensor digital de obst\xE1culos (activo a nivel bajo).","Medir la tensi\xF3n del portapilas y la de los pines V."],ra:{1:["a","c","d"],3:["e","f","i"],4:["d","g","h"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de infrarrojos (obst\xE1culos)",1],["Servo motor est\xE1ndar 180\xB0",1,"el de \xE1ngulo, NO el de rotaci\xF3n continua 360\xB0"],["Pantalla LCD1602 I2C",1],["Portapilas 6\xD7AA con clavija DC y 6 pilas AA",1,"comprueba que lo tienes; las pilas no vienen en el kit"],["Cables Dupont H-H",7,"negro \xD72, rojo \xD72, amarillo, azul, blanco"],["Cable USB-A a USB-B",1],["Palito o pajita para la barrera (opcional)",1]],libs:["servo","lcd"],code:wf,file:"P6_Barrera/P6_Barrera.ino",parts:{ir:{type:"ir",pos:[-12,70],rot:180,label:"Sensor IR \u2192 ANALOG 34"},car:{type:"car",pos:[-12,130]},sv:{type:"servo",pos:[-8,-62],label:"Servo 180\xB0 \u2192 GPIO 13"},lcd:{type:"lcd",pos:[112,4],label:"LCD1602 \u2192 I2C fila 1",lines:["ADELANTE  >>>","Coches: 3"]},bat:{type:"battery",pos:[-118,52],label:"Portapilas 6\xD7AA (9 V)"}},wires:i,steps:[es("5V",["Sensor IR, servo 180\xB0, LCD1602 I2C y portapilas 6\xD7AA","7 cables H-H"]),{t:"Conecta el sensor de infrarrojos",add:["ir"],wires:["irG","irV","irS"],take:["Sensor IR (con 2 LEDs en la punta y un potenci\xF3metro azul)","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el sensor delante de la placa con los LEDs IR mirando hacia fuera (hacia donde llegar\xE1n los coches).","Va al bloque ANALOG, fila <b>34</b> (la de arriba), aunque es un sensor digital: as\xED se alimenta a 3,3 V."],check:"GND \u2192 G (negro), VCC \u2192 3V3 (rojo), OUT \u2192 S (amarillo) de la fila 34."},{t:"Enchufa el servo",add:["sv"],wires:["svG","svV","svS"],take:["Servo 180\xB0","No necesitas cables: el conector del servo se enchufa directamente"],do:["El conector del servo tiene 3 cables: <b>marr\xF3n</b> (GND), <b>rojo</b> (V) y <b>naranja</b> (se\xF1al).","Ench\xFAfalo en la columna <b>13</b> del bloque izquierdo con el cable marr\xF3n hacia el centro de la placa (fila G) y el naranja hacia el conector azul (fila S)."],check:"Marr\xF3n en G, rojo en V, naranja en S de la columna 13. Si lo enchufas al rev\xE9s el servo no se mover\xE1 (no se rompe, pero desconecta antes de girarlo)."},{t:"Conecta la pantalla LCD",add:["lcd"],wires:dn(i.slice(6,10)),take:["LCD1602 I2C","4 cables H-H: negro, rojo, azul y blanco"],do:["Igual que en el proyecto 4: fila 1 del bloque I2C."],check:"GND\u2192G, VCC\u2192V, SDA\u2192SDA (azul), SCL\u2192SCL (blanco)."},{t:"Prepara la alimentaci\xF3n externa",add:["bat"],wires:[],take:["Portapilas 6\xD7AA con interruptor y clavija DC","6 pilas AA nuevas"],do:["Mete las 6 pilas respetando la polaridad (+/\u2212) dibujada en el portapilas.","Mide con el pol\xEDmetro la tensi\xF3n en la clavija (punta roja dentro, negra fuera): debe dar 8\u20139,6 V.","Deja el portapilas APAGADO y todav\xEDa sin enchufar."],check:"El portapilas da entre 8 y 9,6 V y est\xE1 apagado."},{...ts("P6_Barrera.ino",{servo:75},{do:["Instala antes <b>ESP32Servo</b> y <b>LiquidCrystal I2C</b>.","Cuando el programa est\xE9 subido, enchufa la clavija del portapilas en el <b>jack DC</b> y enci\xE9ndelo. Puedes dejar tambi\xE9n el USB para ver el Monitor Serie.","Ajusta el potenci\xF3metro azul del sensor IR para que detecte tu mano a unos 10 cm (se enciende su LED)."],check:"Al acercar la mano al sensor IR la barrera sube a 90\xB0, la LCD pone \xABADELANTE\xBB y el contador aumenta. 3 s despu\xE9s de quitar la mano, la barrera baja."}),wires:["bat"],add:["car"]}],expected:["Al arrancar la barrera se coloca a 0\xB0 y la LCD muestra \xABBARRERA CERRADA\xBB.","Coche (o mano) delante del sensor \u2192 la barrera sube suavemente a 90\xB0 y la LCD muestra \xABADELANTE >>>\xBB y \xABCoches: N\xBB.","3 s despu\xE9s de que el coche pase, la barrera baja."],serial:`Barrera lista
Coche detectado. Total = 1
Cerrando barrera
Coche detectado. Total = 2`,example:"Ejemplo: el servo se controla con pulsos de 0,5 ms (0\xB0) a 2,4 ms (180\xB0) repetidos 50 veces por segundo. Para 90\xB0 el pulso dura unos 1,45 ms. Cambia <code>ANGULO_ABIERTA</code> a 120 y observa la diferencia.",multimeter:[["Portapilas","Pol\xEDmetro en 20 V DC, en la clavija antes de enchufarla.","8\u20139,6 V con pilas nuevas"],["Pines V con interruptor en 5V","Negra en G y roja en V de la columna 13.","\u2248 5 V"],["Salida del sensor IR","Negra en G, roja en S de la fila 34. Sin obst\xE1culo y con la mano delante.","\u2248 3,3 V sin obst\xE1culo \xB7 \u2248 0 V detectando"]],trouble:[["El servo tiembla o la placa se reinicia","Falta alimentaci\xF3n externa","Enchufa y enciende el portapilas."],["El servo no se mueve","Conector al rev\xE9s o en otra columna","Marr\xF3n en G, columna 13."],["El servo gira sin parar","Es el servo de 360\xB0","Usa el servo de 180\xB0."],["La barrera no reacciona","Sensor IR poco sensible","Gira su potenci\xF3metro azul hasta que su LED se encienda con la mano a 10 cm."],["La LCD no se ve","Interruptor en 3.3V o contraste","Interruptor en 5V; ajusta el potenci\xF3metro de la LCD."]],challenge:["Limita la capacidad del parking a 5 coches: al llegar a 5 la LCD pone \xABCOMPLETO\xBB y la barrera no sube.","A\xF1ade un LED verde/rojo como sem\xE1foro de entrada (proyecto 1)."]})}{let i=[...In("soil",34,"amarillo","A"),...In("rel",25,"naranja"),{id:"com",from:"P.5V",to:"rel.COM",color:"rojo",lift:25},{id:"pR",from:"pump.rojo",to:"rel.NO",color:"rojo",k0:40},{id:"pN",from:"pump.negro",to:"bb.c55a",color:"negro",k0:40},{id:"gnd",from:"bb.c55c",to:"P.GND",color:"negro"},{id:"bat",from:"bat.dc",to:"DC",color:"negro",thick:!0}];rn.push({n:7,slug:"riego",title:"Riego autom\xE1tico",level:"Avanzado",duration:"4 sesiones (4 h)",icon:"\u{1F331}",short:"Sensor de humedad + rel\xE9 + bomba de agua, y pr\xE1ctica de mantenimiento.",intro:"Una maceta que se riega sola: el sensor de humedad mide la tierra y, si est\xE1 seca, el rel\xE9 enciende una mini bomba de agua unos segundos. Separar\xE1s el circuito de CONTROL (ESP32) del de POTENCIA (bomba). Al final har\xE1s una pr\xE1ctica de mantenimiento: localizar y sustituir un sensor \xABaveriado\xBB.",switch:"5V",caution:"Solo baja tensi\xF3n: la bomba funciona a 5 V tomados del conector POWER. Nunca conectes el rel\xE9 a la red el\xE9ctrica de 230 V aunque su etiqueta diga 250 VAC. El agua y la electr\xF3nica no se llevan bien: la placa, el rel\xE9 y la protoboard deben quedar LEJOS del vaso, sobre una bandeja seca. Seca cualquier salpicadura con la alimentaci\xF3n desconectada.",objectives:["Explicar la funci\xF3n de un rel\xE9 (interruptor controlado) y sus bornes COM, NO y NC.","Conectar un circuito de potencia de baja tensi\xF3n separado del de control, usando bornes de tornillo y protoboard.","Calibrar un sensor anal\xF3gico (seco/mojado) y convertir la lectura en %.","Diagnosticar y sustituir un elemento averiado siguiendo un procedimiento, y documentarlo en un informe."],ra:{4:["c","f","g","h"],5:["a","b","c","d","e","f","g","h","i"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de humedad del suelo",1],["M\xF3dulo rel\xE9 de 1 canal",1],["Micro bomba de agua 3\u20136 V",1],["Protoboard 830 puntos",1],["Portapilas 6\xD7AA con clavija DC y 6 pilas AA",1,"las pilas no vienen en el kit"],["Cables Dupont H-H",6,"negro \xD72, rojo \xD72, amarillo, naranja"],["Cables Dupont M-M",2,"rojo y negro"],["Cable USB-A a USB-B",1],["Vaso o recipiente con agua, tubo de silicona de 5 mm (\u2248 50 cm) y maceta con tierra",1,"NO incluidos en el kit"],["Sensor de humedad de repuesto (de otro kit)",1,"para la pr\xE1ctica de mantenimiento"]],tools:[["Destornillador plano peque\xF1o (2\u20132,5 mm)","para apretar los bornes de tornillo del rel\xE9"],["Papel absorbente / bayeta","por si hay salpicaduras"]],libs:[],code:Tf,file:"P7_Riego/P7_Riego.ino",parts:{soil:{type:"soil",pos:[-68,96],rot:180,label:"Sensor humedad \u2192 ANALOG 34"},rel:{type:"relay",pos:[96,-24],rot:-90,label:"Rel\xE9 \u2192 GPIO 25"},bb:{type:"breadboard",pos:[42,108],label:"Protoboard"},pump:{type:"pump",pos:[168,62],rot:-90,label:"Bomba 5 V en el vaso"},plant:{type:"plant",pos:[180,-42]},bat:{type:"battery",pos:[-132,44],label:"Portapilas 6\xD7AA"}},margin:1.05,wires:i,steps:[es("5V",["Sensor de humedad, rel\xE9, bomba, protoboard y portapilas","6 cables H-H y 2 cables M-M","Destornillador plano peque\xF1o"]),{t:"Conecta el sensor de humedad",add:["soil"],wires:dn(i.slice(0,3)),take:["Sensor de humedad del suelo","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el sensor delante de la placa a la izquierda, con las dos patas doradas hacia fuera.","Va a la fila <b>34</b> del bloque ANALOG (3,3 V fijos)."],check:"G (negro), 3V3 (rojo) y S (amarillo) en la fila 34. Las patas doradas NO deben tocar nada met\xE1lico."},{t:"Conecta el rel\xE9 (circuito de control)",add:["rel"],wires:dn(i.slice(3,6)),take:["M\xF3dulo rel\xE9","3 cables H-H: negro, rojo y naranja"],do:["Coloca el rel\xE9 a la derecha de la placa, con sus pines G-V-S hacia la placa y los bornes de tornillo (NO, COM, NC) hacia fuera."],check:"Columna <b>25</b>: G negro, V rojo, S naranja. El interruptor est\xE1 en 5V (la bobina del rel\xE9 es de 5 V)."},{t:"Coloca la protoboard y la bomba",add:["bb","pump","plant"],wires:[],take:["Protoboard","Micro bomba con su tubo, dentro de un vaso con agua"],do:["Coloca la protoboard delante de la placa y el vaso con la bomba a la derecha, lejos de la electr\xF3nica.","Mete el extremo libre del tubo en la maceta.","La bomba debe estar totalmente sumergida antes de funcionar: en seco se estropea."],check:"Bomba sumergida, tubo en la maceta y vaso a m\xE1s de 15 cm de la placa."},{t:"Cablea el circuito de potencia (5 V)",add:[],wires:["com","pR","pN","gnd"],take:["2 cables M-M: rojo y negro","Destornillador plano"],do:["Afloja el tornillo del borne <b>COM</b> (el del centro), mete el pin del cable M-M rojo, aprieta y tira suavemente para comprobar que no sale. Su otro extremo va al agujero <b>5V</b> del conector POWER.","Mete el cable ROJO de la bomba en el borne <b>NO</b> (normalmente abierto) y aprieta.","Mete el cable NEGRO de la bomba en la protoboard, columna <b>55</b>, fila <b>a</b>.","Cable M-M negro: de la columna 55, fila <b>c</b> de la protoboard al agujero <b>GND</b> del conector POWER. (Los 5 agujeros a-b-c-d-e de una misma columna est\xE1n unidos por dentro.)"],check:"Recorrido de la corriente: 5V \u2192 COM \u2192 (rel\xE9 cerrado) \u2192 NO \u2192 bomba \u2192 protoboard col. 55 \u2192 GND. El borne NC queda libre."},{...ts("P7_Riego.ino",{glow:{}},{do:["Primero con SOLO el USB: mira \xABLectura =\xBB con el sensor al aire (seco) y con las patas en un vaso de agua (mojado). Escribe esos valores en <code>LECTURA_SECO</code> y <code>LECTURA_MOJADO</code> y vuelve a subir.","Enchufa el portapilas al jack DC y enci\xE9ndelo (la bomba consume m\xE1s de lo que da bien un USB).","Clava el sensor en la tierra de la maceta."],check:"Con tierra seca el rel\xE9 hace \xABclic\xBB, la bomba riega 3 s y espera 10 s. Con tierra h\xFAmeda el Monitor Serie dice \xABOK, no hace falta regar\xBB."}),add:["bat"],wires:["bat"]}],expected:["El Monitor Serie muestra la lectura bruta, la dispersi\xF3n y la humedad en %.","Si la humedad < 35 %: \xABSECO: regando\xBB, clic del rel\xE9 (se enciende su LED) y la bomba funciona 3 s; luego espera 10 s.","Si se desconecta o estropea el sensor: \xABAVERIA SENSOR: bomba bloqueada\xBB y la bomba no arranca."],serial:`Riego automatico listo
Lectura = 2950   Dispersion = 18   Humedad = 3 %   -> SECO: regando
Riego terminado. Esperando a que el agua se reparta...
Lectura = 1530   Dispersion = 22   Humedad = 82 %   -> OK, no hace falta regar
Lectura = 2210   Dispersion = 1380   Humedad = 44 %   -> AVERIA SENSOR: bomba bloqueada. Revisa/sustituye el sensor.`,example:"Ejemplo de calibraci\xF3n: seco = 3000, mojado = 1200. Una lectura de 2100 est\xE1 justo en medio \u2192 humedad = (3000 \u2212 2100) / (3000 \u2212 1200) \xD7 100 = <b>50 %</b>.",maintenance:{intro:"El profesor prepara un sensor \xABaveriado\xBB (por ejemplo con un cable cortado por dentro, una pata despegada o un conector flojo) y lo cambia por el bueno sin decir nada. El alumnado debe detectar la aver\xEDa, sustituir el elemento y documentarlo.",steps:[["Detectar el s\xEDntoma","El Monitor Serie muestra \xABAVERIA SENSOR\xBB (lectura fuera de rango o muy inestable) y la bomba no riega. Anota el s\xEDntoma y los valores de \xABLectura\xBB y \xABDispersi\xF3n\xBB."],["Consultar la gu\xEDa","Abre el esquema de esta pr\xE1ctica (pesta\xF1a \xABEsquema\xBB) e identifica qu\xE9 elemento produce la se\xF1al: el sensor de humedad en la fila 34 del bloque ANALOG."],["Medir con seguridad","Con la placa ALIMENTADA solo por USB y la bomba fuera del agua: pol\xEDmetro en 20 V DC, negra en G, roja en 3V3 de la fila 34 (debe dar \u2248 3,3 V). Luego roja en S: en seco y mojado debe cambiar. Si 3V3 es correcto pero S no cambia o baila \u2192 el sensor est\xE1 averiado."],["Comprobar los cables","DESCONECTA el USB y el portapilas. Con el pol\xEDmetro en continuidad, comprueba los 3 cables del sensor de extremo a extremo. Si un cable falla, sustit\xFAyelo; si los tres pitan, el fallo est\xE1 en el sensor."],["Acopiar el repuesto","Pide al profesor un sensor de repuesto del mismo modelo. Compru\xE9balo visualmente (patas sin \xF3xido, pines rectos)."],["Desmontar","Con todo desconectado, retira los 3 cables del sensor tirando del conector (nunca del cable). Ap\xE1rtalo en la caja de \xABaveriados\xBB etiquetado."],["Montar el repuesto","Conecta el sensor nuevo: G negro, 3V3 rojo, S amarillo en la fila 34. Revisa con la tabla del esquema."],["Verificar y recalibrar","Conecta el USB, comprueba que desaparece el aviso y repite la calibraci\xF3n seco/mojado si los valores han cambiado. Prueba un ciclo de riego completo."],["Informe","Rellena el parte de mantenimiento: fecha, equipo, s\xEDntoma, mediciones, causa, elemento sustituido, herramientas usadas, prueba final y residuos (el sensor averiado se deposita en el contenedor de RAEE del centro)."]]},multimeter:[["Alimentaci\xF3n del rel\xE9","Pol\xEDmetro en 20 V DC. Negra en G, roja en V de la columna 25.","\u2248 5 V"],["Se\xF1al del rel\xE9","Negra en G, roja en S de la columna 25 durante el riego.","\u2248 3,3 V regando \xB7 0 V en reposo"],["Tensi\xF3n en la bomba","Negra en el cable negro de la bomba (protoboard col. 55), roja en el borne NO, durante el riego.","\u2248 4,5\u20135 V"],["Contactos del rel\xE9 (sin bomba)","Desconecta todo, quita el cable de COM. Continuidad entre COM y NC, y entre COM y NO.","COM\u2013NC pita \xB7 COM\u2013NO no pita (rel\xE9 en reposo)"]],trouble:[["El rel\xE9 hace clic pero la bomba no gira","Cable suelto en un borne o en la protoboard","Aprieta los tornillos; comprueba que los dos cables est\xE1n en la MISMA columna 55."],["La bomba est\xE1 siempre encendida","Cable en NC en vez de NO, o rel\xE9 activo a nivel bajo","P\xE1salo a NO; si sigue, pon RELE_ACTIVO = LOW."],["El rel\xE9 no hace clic","Interruptor en 3.3V","Interruptor en 5V (desconectado)."],["\xABAVERIA SENSOR\xBB con el sensor bueno","Calibraci\xF3n sin hacer","Mide seco/mojado y actualiza LECTURA_SECO y LECTURA_MOJADO."],["La placa se reinicia al arrancar la bomba","Solo USB: ca\xEDda de tensi\xF3n","Usa el portapilas en el jack DC."]],challenge:["Cuenta cu\xE1ntos riegos se hacen al d\xEDa y mu\xE9stralo cada hora por el Monitor Serie.","A\xF1ade la LCD del proyecto 4 para mostrar la humedad y el estado (OK / REGANDO / AVER\xCDA)."]})}{let i=[{id:"vin",from:"P.VIN",to:"drv.+12V",color:"rojo",lift:20},{id:"gnd",from:"P.GND_2",to:"drv.GND",color:"negro",lift:20},{id:"ena",from:"drv.ENA",to:"D25.S",color:"blanco"},{id:"in1",from:"drv.IN1",to:"D26.S",color:"amarillo"},{id:"in2",from:"drv.IN2",to:"D27.S",color:"verde"},{id:"m1",from:"mot.rojo",to:"drv.OUT1",color:"rojo",k0:20,k1:20},{id:"m2",from:"mot.negro",to:"drv.OUT2",color:"negro",k0:20,k1:20},{id:"jG",from:"joy.GND",to:"A34.G",color:"negro"},{id:"jV",from:"joy.+5V",to:"A34.V",color:"rojo"},{id:"jY",from:"joy.VRy",to:"A34.S",color:"morado"},{id:"jSW",from:"joy.SW",to:"D23.S",color:"gris",lift:10},...Ua("bmp",1,{G:"GND",V:"VCC",SDA:"SDA",SCL:"SCL"}),...Ua("oled",2),{id:"bat",from:"bat.dc",to:"DC",color:"negro",thick:!0}];rn.push({n:8,slug:"ventilador",title:"Ventilador inteligente",level:"Proyecto final",duration:"6 sesiones (6 h)",icon:"\u{1F300}",short:"Motor DC + L298N, joystick, BMP280 y OLED: modo manual y autom\xE1tico.",intro:"El proyecto final re\xFAne todo lo aprendido: un ventilador cuyo motor de corriente continua se controla con el driver L298N. En modo MANUAL lo manejas con el joystick (velocidad y sentido); en modo AUTO gira m\xE1s r\xE1pido cuanto m\xE1s calor mide el sensor BMP280. Todo se muestra en la pantalla OLED.",switch:"3V3",caution:"El motor se alimenta del portapilas a trav\xE9s del pin VIN, no de los pines de la ESP32. No toques la h\xE9lice mientras gira y sujeta el motor a la mesa (cinta adhesiva o pinza) para que no salte. El disipador del L298N puede calentarse: no lo toques tras un uso prolongado.",objectives:["Explicar por qu\xE9 un motor necesita un driver (L298N, puente en H) y separar alimentaci\xF3n de potencia y de control con masa com\xFAn.","Controlar velocidad (PWM en ENA) y sentido de giro (IN1/IN2).","Integrar dos dispositivos en el mismo bus I2C (BMP280 y OLED).","Planificar, montar, verificar y documentar un sistema completo."],ra:{1:["a","b","c","d"],2:["d","e"],3:["e","f","g","h","j"],4:["e","f","g","j"],5:["a","b","h","i"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Motor DC con m\xF3dulo controlador L298N",1],["M\xF3dulo joystick anal\xF3gico",1],["Sensor BMP280",1],['Pantalla OLED 1,3" I2C',1],["Portapilas 6\xD7AA con clavija DC y 6 pilas AA",1,"las pilas no vienen en el kit"],["Cables Dupont H-H",15,"negro \xD73, rojo \xD73, blanco \xD73, azul \xD72, amarillo, verde, morado, gris"],["Cables Dupont M-M",2,"rojo y negro"],["Cable USB-A a USB-B",1],["H\xE9lice de cartulina o rueda para el eje del motor",1,"opcional, no incluida"],["Cinta adhesiva",1,"para sujetar el motor"]],tools:[["Destornillador plano peque\xF1o (2\u20132,5 mm)","bornes de tornillo del L298N"],["Pinzas o alicates de punta","para quitar el puente (jumper) de ENA"]],libs:["bmp","unified","sh110x","gfx"],code:Rf,file:"P8_Ventilador/P8_Ventilador.ino",parts:{drv:{type:"l298n",pos:[72,-84],label:"Driver L298N"},mot:{type:"motor",pos:[-30,-104],rot:180,label:"Motor DC + h\xE9lice"},joy:{type:"joystick",pos:[-42,74],rot:180,label:"Joystick \u2192 ANALOG 34 + GPIO 23"},oled:{type:"oled",pos:[10,74],rot:180,label:"OLED \u2192 I2C fila 2",draw:"fan"},bmp:{type:"bmp280",pos:[52,66],rot:180,label:"BMP280 \u2192 I2C fila 1"},bat:{type:"battery",pos:[-118,52],label:"Portapilas 6\xD7AA (9 V)"}},margin:1.06,wires:i,steps:[es("3V3",["Todos los componentes de la lista de material","15 cables H-H y 2 cables M-M","Destornillador y pinzas"]),{t:"Prepara el L298N y el motor",add:["drv","mot"],wires:["m1","m2"],take:["Driver L298N","Motor DC","Destornillador plano y pinzas"],do:["Quita con las pinzas el puente (jumper) negro que une los pines <b>ENA</b> y el de al lado; gu\xE1rdalo. Deja puesto el puente \xAB12V EN\xBB (junto a los bornes de alimentaci\xF3n).","Afloja los bornes <b>OUT1</b> y <b>OUT2</b> (lado izquierdo del L298N), mete un cable del motor en cada uno y aprieta. Tira suavemente para comprobarlo.","Sujeta el motor a la mesa con cinta adhesiva y coloca la h\xE9lice."],check:"El pin ENA est\xE1 libre (sin puente). Los cables del motor est\xE1n firmes en OUT1 y OUT2."},{t:"Alimentaci\xF3n del L298N (desde VIN)",add:[],wires:["vin","gnd"],take:["2 cables M-M: rojo y negro"],do:["Cable M-M ROJO: del agujero <b>VIN</b> del conector POWER (el \xFAltimo a la derecha) al borne <b>+12V</b> del L298N.","Cable M-M NEGRO: de un agujero <b>GND</b> del conector POWER al borne <b>GND</b> del L298N (el del centro). Esta es la MASA COM\xDAN: sin ella el motor no obedece.","El borne +5V del L298N queda LIBRE."],check:"VIN \u2192 +12V (rojo) y GND \u2192 GND (negro). Revisa que no est\xE1n cruzados: invertirlos puede da\xF1ar el driver."},{t:"Se\xF1ales de control ENA, IN1, IN2",add:[],wires:["ena","in1","in2"],take:["3 cables H-H: blanco, amarillo y verde"],do:["Del L298N a los pines <b>S</b> del bloque derecho: ENA \u2192 columna 25, IN1 \u2192 26, IN2 \u2192 27."],check:"ENA (blanco) \u2192 S 25 \xB7 IN1 (amarillo) \u2192 S 26 \xB7 IN2 (verde) \u2192 S 27. IN3, IN4 y ENB quedan libres."},{t:"Conecta el joystick",add:["joy"],wires:["jG","jV","jY","jSW"],take:["Joystick","4 cables H-H: negro, rojo, morado y gris"],do:["GND, +5V y VRy van a la fila <b>34</b> del bloque ANALOG (G, 3V3 y S). Aunque el pin diga +5V, lo alimentamos a 3,3 V para que su salida no supere los 3,3 V.","SW (el bot\xF3n al pulsar la palanca) va al pin <b>S</b> de la columna <b>23</b>.","VRx queda sin conectar."],check:"Fila 34: GND\u2192G, +5V\u21923V3, VRy\u2192S. SW\u2192S de la columna 23."},{t:"Conecta BMP280 y OLED (bus I2C)",add:["bmp","oled"],wires:dn(i.slice(11,19)),take:['BMP280 y OLED 1,3"',"8 cables H-H: 2 negros, 2 rojos, 2 azules, 2 blancos"],do:["BMP280 \u2192 fila 1 del bloque I2C. OLED \u2192 fila 2. Las 4 filas est\xE1n unidas por dentro: es el mismo bus, cada dispositivo tiene su direcci\xF3n (BMP280 0x76/0x77, OLED 0x3C).","Si tu BMP280 tiene 6 pines (tambi\xE9n CSB y SDO), deja esos dos libres."],check:"En cada m\xF3dulo: GND\u2192G, VCC\u2192V, SDA\u2192SDA (azul), SCL\u2192SCL (blanco)."},{...ts("P8_Ventilador.ino",{spin:!0},{do:["Instala antes <b>Adafruit BMP280 Library</b>, <b>Adafruit Unified Sensor</b> y <b>Adafruit SH110X</b> (con sus dependencias).","Con la palanca del joystick en el centro, enchufa el portapilas al jack DC y enci\xE9ndelo.","Pulsa la palanca del joystick para cambiar entre MANUAL y AUTO."],check:"MANUAL: palanca arriba = gira en un sentido, abajo = en el otro, centro = parado. AUTO: calienta el BMP280 con los dedos y el ventilador acelera."}),add:["bat"],wires:["bat"]}],expected:["La OLED muestra modo, temperatura, presi\xF3n y velocidad con una barra (izquierda = sentido inverso, derecha = directo).","MANUAL: la velocidad sigue a la palanca (30\u2013100 %) y se para en el centro.","AUTO: parado por debajo de 24 \xB0C, del 40 % al 100 % entre 24 y 30 \xB0C, 100 % por encima.","Cada pulsaci\xF3n del joystick cambia de modo."],serial:`BMP280 OK
Centro del joystick = 1893
MANUAL  T=23.8 C  P=1014 hPa  vel=0 %
MANUAL  T=23.8 C  P=1014 hPa  vel=72 %
Cambio a modo AUTO
AUTO  T=26.1 C  P=1014 hPa  vel=61 %`,example:"Ejemplo: con T_MIN = 24 \xB0C y T_MAX = 30 \xB0C, a 27 \xB0C la velocidad es 40 + (27 \u2212 24) \xD7 60 / 6 = <b>70 %</b>, es decir, PWM = 70 % de 210 = 147 sobre 255.",multimeter:[["VIN (portapilas)","Pol\xEDmetro en 20 V DC. Negra en GND, roja en VIN del conector POWER.","\u2248 8\u20139 V"],["5 V l\xF3gicos del L298N","Negra en el borne GND, roja en el borne +5V del L298N.","\u2248 5 V (lo genera su regulador)"],["Tensi\xF3n en el motor","Puntas en OUT1 y OUT2 en modo manual.","Sube con la palanca; cambia de signo (+/\u2212) al invertir el sentido"],["Joystick en reposo","Negra en G, roja en S de la fila 34.","\u2248 1,5\u20131,7 V (mitad de 3,3 V)"]],trouble:[["El motor no gira nunca","Puente ENA puesto, falta masa com\xFAn o portapilas apagado","Quita el puente ENA, revisa GND\u2013GND y enciende el portapilas."],["Gira solo a tope o nada","ENA sin conectar al 25","Cable blanco ENA \u2192 S 25."],["Gira al rev\xE9s de lo esperado","Cables del motor invertidos","Intercambia OUT1 y OUT2 (o IN1/IN2)."],["\xABsin BMP280\xBB en la OLED","SDA/SCL cambiados o pines CSB/SDO mal","Revisa la fila 1; prueba otra fila."],["Se mueve solo con la palanca en el centro","Centro mal calibrado","Reinicia sin tocar el joystick; aumenta ZONA_MUERTA."]],challenge:["A\xF1ade un tercer modo \xABBRISA\xBB: el ventilador alterna 5 s r\xE1pido y 5 s lento.","Guarda T_MIN y T_MAX con el joystick (eje X) en vez de en el c\xF3digo.","Elabora el informe final del proyecto con fotos, esquema, lista de material, mediciones y conclusiones."]})}});function If(i){let e;return(e=i.match(/^D(\d+)\.(S|V|G)$/))?`${w_[e[2]]} de la columna <b>GPIO ${e[1]}</b>`:(e=i.match(/^A(\d+)\.(S|V|G)$/))?`${{G:"pin <b>G</b> (base negra, columna izquierda)",V:"pin <b>3V3</b> (base roja, columna central)",S:"pin <b>S</b> (base azul, columna derecha)"}[e[2]]} de la fila <b>${e[1]}</b> del bloque <b>ANALOG</b>`:(e=i.match(/^I(\d)\.(G|V|SDA|SCL)$/))?`${{G:"pin <b>G</b> (base negra)",V:"pin <b>V</b> (base roja)",SDA:"pin <b>SDA</b> (base azul)",SCL:"pin <b>SCL</b> (base blanca)"}[e[2]]} de la <b>fila ${e[1]}</b> del bloque <b>I2C</b>`:(e=i.match(/^P\.(.+)$/))?`agujero <b>${e[1].replace("_2","")}</b> del conector azul inferior <b>POWER</b> (el ${A_[e[1]]} empezando por la izquierda)`:i==="DC"?"el <b>jack DC</b> de la placa (esquina inferior izquierda)":i}function gu(i){let e;return(e=i.match(/^D(\d+)\.(S|V|G)$/))?`GPIO ${e[1]} \xB7 ${e[2]}`:(e=i.match(/^A(\d+)\.(S|V|G)$/))?`ANALOG ${e[1]} \xB7 ${e[2]==="V"?"3V3":e[2]}`:(e=i.match(/^I(\d)\.(.+)$/))?`I2C fila ${e[1]} \xB7 ${e[2]}`:(e=i.match(/^P\.(.+)$/))?`POWER \xB7 ${e[1].replace("_2","")}`:i==="DC"?"Jack DC":i}var w_,A_,bu,Lf=vt(()=>{w_={S:"pin <b>S</b> (base azul, fila junto al conector azul superior)",V:"pin <b>V</b> (base roja, fila del medio)",G:"pin <b>G</b> (base negra, fila m\xE1s cercana al centro de la placa)"},A_={0:"1\xBA","5V":"2\xBA",RST:"3\xBA","3V3":"4\xBA","5V_2":"5\xBA",GND:"6\xBA",GND_2:"7\xBA",VIN:"8\xBA"};bu={negro:"NEGRO",rojo:"ROJO",amarillo:"AMARILLO",verde:"VERDE",azul:"AZUL",blanco:"BLANCO",naranja:"NARANJA",marron:"MARR\xD3N",morado:"MORADO",gris:"GRIS"}});var ns,nt,Qt,Dt,yn,Bs,_n,Va,Df,T_,pi,Ba,vu,xu=vt(()=>{ns=(i,e,t,n,s={})=>{let r=[];for(let a=e;a<=t;a++)r.push({tipo:n,titulo:`${i} ${a}`,...s});return r},nt=(i,e={})=>({tipo:"material",titulo:i,...e}),Qt=(i,e={})=>({tipo:"tarea",titulo:i,...e}),Dt=(i,e={})=>({tipo:"actividad",titulo:i,...e}),yn=(i,e={})=>({tipo:"proyecto",titulo:i,...e}),Bs=(i,e={})=>({tipo:"practica",titulo:i,...e}),_n=(i,e={})=>({tipo:"cuestionario",titulo:i,...e}),Va={material:{nombre:"Material",icon:"\u{1F4C4}",cat:null},tarea:{nombre:"Tarea",icon:"\u{1F4DD}",cat:"tareas"},actividad:{nombre:"Actividad",icon:"\u{1F9E9}",cat:"tareas"},practica:{nombre:"Pr\xE1ctica",icon:"\u{1F527}",cat:"practicas"},proyecto:{nombre:"Proyecto",icon:"\u{1F680}",cat:"proyectos"},cuestionario:{nombre:"Cuestionario",icon:"\u2753",cat:"examenes"},examen:{nombre:"Examen",icon:"\u{1F9EA}",cat:"examenes"}},Df=["Bachillerato","CFGB"],T_=[{id:"tic1",nombre:"Tecnolog\xEDas de la Informaci\xF3n y la Comunicaci\xF3n I",corto:"T.I.Cs 1\xBA Bach",etapa:"Bachillerato",curso:"1\xBA Bachillerato",icon:"\u{1F4BB}",color:"#1f6feb",cursos:["25/26","26/27"],desc:"Ofim\xE1tica para el trabajo acad\xE9mico, sociedad de la informaci\xF3n, hoja de c\xE1lculo y an\xE1lisis de datos, y c\xF3mo funciona el mundo conectado.",unidades:[{id:"inicio",titulo:"Inicio de curso",items:[nt("Enlace a las clases (Meet)"),_n("Evaluaci\xF3n inicial")]},{id:"sa1",titulo:"SdA 1. Mi primer dossier acad\xE9mico",items:[...ns("Desaf\xEDo",1,11,"tarea",{titulo2:"(Documentos de Google)"}),yn("Desaf\xEDo final DOCS",{desc:"Entregar el documento y capturas. En Classroom ten\xEDa una r\xFAbrica de 5 criterios (10 puntos).",rubricaPendiente:"5 criterios \xB7 10 puntos"})]},{id:"sa2",titulo:"SdA 2. Vivir en la sociedad de la informaci\xF3n",items:[nt("Estructura del debate"),Dt("Ficha para la organizaci\xF3n del debate")]},{id:"sa3",titulo:"SdA 3. Los datos hablan: hoja de c\xE1lculo y an\xE1lisis de la informaci\xF3n",items:[...ns("Desaf\xEDo",1,14,"tarea",{titulo2:"(Hojas de c\xE1lculo)"}),Dt("Google Sheets. Ahora te toca a ti. Bloque I"),yn("Google Sheets. Gr\xE1ficos",{desc:"Teor\xEDa en PDF + reto. En Classroom ten\xEDa una r\xFAbrica de 6 criterios (60 puntos).",rubricaPendiente:"6 criterios \xB7 60 puntos"})]},{id:"sa4",titulo:"SdA 4. Anatom\xEDa digital: c\xF3mo funciona realmente el mundo conectado",items:[nt("Objetivo y desarrollo del proyecto"),nt("\xBFC\xF3mo busco fuentes fiables?"),Qt("Documento de investigaci\xF3n"),yn("Presentaci\xF3n del trabajo",{desc:"Por parejas: funcionamiento t\xE9cnico + impacto social."})]}]},{id:"cdpc1",nombre:"Creaci\xF3n digital y pensamiento computacional",corto:"Creaci\xF3n digital 1\xBA Bach",etapa:"Bachillerato",curso:"1\xBA Bachillerato",icon:"\u{1F3A8}",color:"#8250df",cursos:["25/26","26/27"],desc:"Inteligencia artificial generativa, ciberseguridad y programaci\xF3n creativa con p5.js.",unidades:[{id:"inicio",titulo:"Evaluaci\xF3n inicial y presentaci\xF3n",items:[nt("Presentaci\xF3n de la asignatura"),_n("Evaluaci\xF3n inicial"),_n("Conocimientos previos")]},{id:"sa1",titulo:"SA 1. El futuro es IA",items:[Qt("Investigaci\xF3n: \xBFQu\xE9 es la IA?"),Dt("Keynote IA"),Dt("Ejercicio de prompting"),Dt("Calendario en Notion"),Dt("Imagen con IA"),Dt("V\xEDdeo con IA"),Dt("Mis cuentas de IA",{cursos:["25/26"]}),Dt("NotebookLM",{cursos:["25/26"]}),yn("Proyecto final: serie")]},{id:"sa2",titulo:"SA 2. Ciberseguridad",items:[nt("Curso b\xE1sico de ciberseguridad"),Qt("An\xE1lisis de ciberataques"),Qt("An\xE1lisis CIA (confidencialidad, integridad, disponibilidad)"),_n("Cuestionario de est\xE1ndares"),Dt("Criptograf\xEDa"),Bs("GPG/PGP"),yn("Operaci\xF3n Sombrero Blanco")]},{id:"sa3",titulo:"SA 3. Programaci\xF3n",items:[nt("Presentaciones de p5.js"),...ns("Ejercicio",1,8,"actividad"),Bs("Pr\xE1ctica final"),yn("Proyecto final 2")]}]},{id:"tic2",nombre:"Tecnolog\xEDas de la Informaci\xF3n y la Comunicaci\xF3n II",corto:"TIC II 2\xBA Bach",etapa:"Bachillerato",curso:"2\xBA Bachillerato",icon:"\u{1F5A5}\uFE0F",color:"#0f766e",cursos:["26/27"],desc:"Sociedad digital y el mundo del software.",unidades:[{id:"inicio",titulo:"Presentaci\xF3n y evaluaci\xF3n inicial",items:[nt("Presentaci\xF3n de la asignatura"),_n("Evaluaci\xF3n inicial")]},{id:"sa1",titulo:"SA 1. Sociedad digital y el mundo del software",items:[nt("Presentaciones de la SA 1"),...ns("Actividad",1,5,"actividad")]}]},{id:"proy2",nombre:"Proyecto",corto:"Proyecto 2\xBA CFGB",etapa:"CFGB",curso:"2\xBA CFGB",icon:"\u{1F3D7}\uFE0F",color:"#b45309",cursos:["25/26","26/27"],desc:"Del proyecto de empresa a la maqueta: investigaci\xF3n, planificaci\xF3n, construcci\xF3n y presentaci\xF3n (Expoeduca).",unidades:[{id:"inicio",titulo:"Evaluaci\xF3n inicial",items:[_n("Evaluaci\xF3n inicial")]},{id:"sa1",titulo:"SA 1. De la idea\u2026 al proyecto",items:[nt("Presentaci\xF3n"),Qt("Investigaci\xF3n: \xBFQu\xE9 es un proyecto?"),Dt("Detectives del cole"),Dt("El comercial"),Dt("Empresa espejo"),Dt("Jefe por un d\xEDa"),yn("Proyecto final: empresa"),Qt("Tarea 0. Investigaci\xF3n",{cursos:["25/26"]}),Dt("Exploramos nuestro entorno",{cursos:["25/26"]}),Dt("Busca informaci\xF3n y normas",{cursos:["25/26"]}),Dt("Copia una empresa",{cursos:["25/26"]}),Dt("Central de servicios",{cursos:["25/26"]}),yn("Proyecto final: empresa de chips",{cursos:["25/26"]})]},{id:"sa2",titulo:"SA 2. Proyecto para Expoeduca",items:[nt("Presentaci\xF3n del proyecto"),Qt("Propuesta"),Qt("Fase 1. Investigaci\xF3n"),Qt("Completar / recuperaci\xF3n de la fase 1"),Qt("Fase 2. Planificaci\xF3n"),yn("Fase 3. Maqueta"),yn("Proyecto final"),Dt("Folleto informativo")]},{id:"sa3",titulo:"SA 3. Conoce tu empresa",items:[Qt("Tarea 1"),Qt("Tarea 2"),Dt("Ficha 3"),Qt("Tarea 4"),Dt("Ficha 5"),yn("Proyecto final")]},{id:"recu",titulo:"Recuperaci\xF3n",recuperacion:!0,items:[yn("Recuperaci\xF3n 2\xAA evaluaci\xF3n SA 2: maqueta empresa de electricidad")]}]},{id:"eee",nombre:"Equipos el\xE9ctricos y electr\xF3nicos",corto:"EEE 2\xBA CFGB",codigo:"3015",etapa:"CFGB",curso:"2\xBA CFGB",icon:"\u26A1",color:"#DC001B",cursos:["25/26","26/27"],labs:!0,desc:"Electricidad y electr\xF3nica b\xE1sica, componentes, motores y electrodom\xE9sticos, laboratorio y programaci\xF3n. Incluye el laboratorio ESP32 y el laboratorio de circuitos 3D.",unidades:[{id:"inicio",titulo:"Evaluaci\xF3n inicial",items:[_n("Evaluaci\xF3n inicial")]},{id:"b0",titulo:"Bloque 1. Magnitudes el\xE9ctricas y su medida",cursos:["25/26"],items:[_n("Cuestionario"),nt("Preguntas imprescindibles"),...ns("Ejercicio",0,5,"actividad"),Bs("Pr\xE1cticas en Tinkercad")]},{id:"sa1b1",titulo:"SA1-B1 (temas 1\u20134). Construimos nuestro tablero el\xE9ctrico",items:[nt("Acceso a la clase de Tinkercad"),nt("Presentaci\xF3n / libro"),nt("Relaci\xF3n de ejercicios de circuitos"),nt("Preguntas te\xF3ricas de los temas 3 y 4"),_n("Test 1 del tema 3"),...ns("Mi tablero el\xE9ctrico: ejercicio",1,3,"actividad"),Dt("Ejercicio 5: resistencias"),_n("Cuestionario del tema 4")]},{id:"b2",titulo:"Bloque 2. Conmutaci\xF3n y componentes",items:[nt("Presentaci\xF3n / libro"),nt("Preguntas imprescindibles"),_n("Cuestionario del tema 5"),_n("Cuestionario del tema 6"),Qt("Chuletario de simbolog\xEDa"),Dt("Detectives el\xE9ctricos (a mano o con Canva)"),Dt("Resistencias")]},{id:"b3",titulo:"Bloque 3. Motores y electrodom\xE9sticos",items:[nt("Presentaci\xF3n-libro de los temas 8 y 9"),_n("Cuestionario del tema 8"),_n("Cuestionario del tema 9"),Qt("Preguntas imprescindibles"),Qt("Motores"),Qt("Electrodom\xE9sticos"),Dt("Comparativas"),yn("Tarea de invento")]},{id:"sa1lab",titulo:"SA1. Laboratorio el\xE9ctrico/electr\xF3nico",lab:"circuitos",items:ns("Pr\xE1ctica de laboratorio",1,4,"practica")},{id:"sa2prog",titulo:"SA2. Laboratorio de programaci\xF3n",lab:"esp32",items:[Bs("Pr\xE1ctica 0. Sensores y LED"),Bs("Pr\xE1ctica 1. Ruleta"),Bs("Pr\xE1ctica 2. Trineo")]},{id:"sa3",titulo:"SA3. Proyecto: dise\xF1o del sistema el\xE9ctrico de una maqueta de extracci\xF3n de crudo",items:[nt("Presentaci\xF3n"),Qt("Paso 0. Investigaci\xF3n"),Qt("Paso 1. Funcionamiento el\xE9ctrico"),yn("Paso 2. Proyecto de mejora")]},{id:"recu",titulo:"Recuperaci\xF3n por bloques",recuperacion:!0,items:ns("Recuperaci\xF3n bloque",1,5,"tarea")},{id:"repaso",titulo:"Material de apoyo y repasos",items:[nt("Formas can\xF3nicas"),nt("Resistencias"),nt("Introducci\xF3n a las pr\xE1cticas"),nt("Circuitos digitales combinacionales"),nt("Electr\xF3nica b\xE1sica"),nt("Repasos")]},{id:"anteriores",titulo:"Unidades de cursos anteriores",archivo:!0,items:[nt("UD1. Electr\xF3nica"),nt("UD2. Componentes y herramientas"),nt("UD3. \xC1lgebra de Boole"),nt("UD4. Mantenimiento b\xE1sico de EEE"),nt("UD5. Cableado y conexiones"),nt("UD6. Equipos"),Bs("Pr\xE1cticas del 2\xBA trimestre"),nt("Tinkercad"),nt("Crocodile Clips"),nt("Plan de recuperaci\xF3n"),nt("Recuperaciones y subida de notas")]}]}],pi=T_.map(i=>({...i,unidades:i.unidades.map(e=>({...e,items:e.items.map((t,n)=>({pendiente:!0,...t,titulo:t.titulo2?`${t.titulo} ${t.titulo2}`:t.titulo,titulo2:void 0,id:`${i.id}.${e.id}.${String(n+1).padStart(2,"0")}`}))}))})),Ba=i=>pi.find(e=>e.id===i)||null,vu=i=>i.unidades.reduce((e,t)=>e+t.items.length,0)});function Nf(i,e,t){return`<header class="scr-top"><a href="#inicio" class="brand" title="Inicio">Portal docente</a><div class="scr-ttl">${Mt(i)}</div></header>
  <div class="crumbs static"><div>${e}</div><div class="prof">Profesor: <b>${Mt(C_)}</b>${t}</div></div>`}function yu(i,{marca:e=""}={}){return`<a class="subj bib-card" href="${Of(i.id)}" style="border-top-color:${i.color}"><div class="subj-ic">${i.icon}</div>
    <div class="subj-cod">${Mt(i.etapa)} \xB7 ${Mt(i.curso)}${i.codigo?" \xB7 M\xF3dulo "+Mt(i.codigo):""}</div><h3>${Mt(i.nombre)}</h3>
    <p>${Mt(i.desc)}</p><div class="bib-meta">${i.unidades.length} unidades \xB7 ${vu(i)} elementos${e?` \xB7 <b>${Mt(e)}</b>`:""}</div><span class="subj-go">Entrar \u2192</span></a>`}function Uf({chip:i="",esProfesor:e=!1,enCurso:t=null}={}){let n=[...new Set(pi.map(s=>s.curso))];return Nf("Biblioteca de asignaturas",'<a href="#inicio">Inicio</a> \u203A <a href="#asignaturas">Asignaturas</a> \u203A <span>Biblioteca</span>',i)+`
  <div class="subj-wrap bib"><h2>\u{1F4DA} Biblioteca de asignaturas</h2>
  <p class="muted">Todas las asignaturas con sus situaciones de aprendizaje, tareas, pr\xE1cticas, proyectos y cuestionarios. ${e?'Cada curso escolar eliges en el <a href="#panel/cursos">panel</a> cu\xE1les impartes y copias de aqu\xED lo que necesites.':""}</p>
  <div class="bib-filtros" role="search">
    <div class="bib-chips" role="group" aria-label="Etapa">${["",...Df].map(s=>`<button type="button" class="bib-chip ${Vn.etapa===s?"on":""}" data-bib-etapa="${Mt(s)}">${s?Mt(s):"Todas"}</button>`).join("")}</div>
    <label>Curso <select id="bibCurso"><option value="">Todos</option>${n.map(s=>`<option ${Vn.curso===s?"selected":""}>${Mt(s)}</option>`).join("")}</select></label>
    <input id="bibQ" type="search" placeholder="Buscar: \xABhoja de c\xE1lculo\xBB, \xABresistencias\xBB, \xABproyecto\xBB\u2026" value="${Mt(Vn.q)}" aria-label="Buscar en la biblioteca">
  </div>
  <div id="bibRes">${Vf(t)}</div></div>`}function Vf(i){let e=vl(Vn.q.trim()),t=pi.filter(r=>(!Vn.etapa||r.etapa===Vn.etapa)&&(!Vn.curso||r.curso===Vn.curso)),n=r=>i&&i.asignaturas.includes(r.id)?`Impartes en ${i.curso}`:"";if(!e)return t.length?`<div class="subj-grid">${t.map(r=>yu(r,{marca:n(r)})).join("")}</div>`:'<p class="muted">No hay asignaturas con esos filtros.</p>';let s=[];for(let r of t){vl(r.nombre+" "+r.corto+" "+r.desc).includes(e)&&s.push({a:r,t:"asig"});for(let a of r.unidades){vl(a.titulo).includes(e)&&s.push({a:r,u:a,t:"unidad"});for(let o of a.items)vl(o.titulo+" "+(o.desc||"")).includes(e)&&s.push({a:r,u:a,it:o,t:"item"})}}return s.length?`<p class="muted small">${s.length} resultado${s.length===1?"":"s"}</p><ul class="bib-hits">${s.slice(0,200).map(r=>`<li><a href="${Of(r.a.id)}">${r.a.icon} ${Mt(r.a.corto)}</a>${r.u?` \u203A ${Mt(r.u.titulo)}`:""}${r.it?` \u203A <b>${Va[r.it.tipo]?.icon||""} ${Mt(r.it.titulo)}</b> <span class="muted small">(${Mt(Va[r.it.tipo]?.nombre||r.it.tipo)})</span>`:""}</li>`).join("")}</ul>`:`<p class="muted">Nada coincide con \xAB${Mt(Vn.q)}\xBB.</p>`}function Bf(i,e){let t=()=>{let n=i.querySelector("#bibRes");n&&(n.innerHTML=Vf(e))};i.querySelectorAll("[data-bib-etapa]").forEach(n=>n.addEventListener("click",()=>{Vn.etapa=n.dataset.bibEtapa,i.querySelectorAll("[data-bib-etapa]").forEach(s=>s.classList.toggle("on",s===n)),t()})),i.querySelector("#bibCurso")?.addEventListener("change",n=>{Vn.curso=n.target.value,t()}),i.querySelector("#bibQ")?.addEventListener("input",n=>{Vn.q=n.target.value,t()})}function _u(i,{completo:e=!0,abierto:t=!1}={}){return`<details class="bib-prog" ${t?"open":""}><summary>\u{1F5C2} Programa de la asignatura \xB7 biblioteca (${i.unidades.length} unidades${e?`, ${vu(i)} elementos`:""})</summary>
    ${e?'<p class="muted small">Contenido de la biblioteca (tomado de Classroom). Los elementos marcados \xABpendiente\xBB todav\xEDa no tienen su documento subido al portal.</p>':""}
    ${i.unidades.map(n=>`<section class="bib-u"><h4>${Mt(n.titulo)}${n.cursos?` <span class="muted small">(${Mt(n.cursos.join(", "))})</span>`:""}${n.archivo?' <span class="muted small">(archivo)</span>':""}</h4>
      ${e?`<ul>${n.items.map(s=>`<li><span class="bib-ti">${Va[s.tipo]?.icon||"\u{1F4C4}"}</span> ${Mt(s.titulo)} <span class="muted small">\xB7 ${Mt(Va[s.tipo]?.nombre||s.tipo)}${s.cursos?" \xB7 "+Mt(s.cursos.join(", ")):""}</span>${s.desc?`<div class="muted small">${Mt(s.desc)}</div>`:""}${s.pendiente?' <span class="bib-pend">Contenido pendiente de subir</span>':""}</li>`).join("")}</ul>`:""}</section>`).join("")}
  </details>`}function Ff(i,{chip:e="",completo:t=!0,conAula:n=!1}={}){let s=Ba(i);return s?Nf(`${s.etapa} \xB7 ${s.curso}`,`<a href="#inicio">Inicio</a> \u203A <a href="#asignaturas">Asignaturas</a> \u203A <span>${Mt(s.corto)}</span>`,e)+`
  <div class="subj-wrap"><div class="subj-cod">${Mt(s.etapa)} \xB7 ${Mt(s.curso)}</div><h2>${s.icon} ${Mt(s.nombre)}</h2><p class="muted">${Mt(s.desc)}</p>
  ${n?'<div id="asTrabajo" class="au-sec"></div>':""}
  ${_u(s,{completo:t,abierto:!n})}</div>`:""}var Mt,vl,Of,Vn,C_,zf=vt(()=>{xu();Mt=i=>String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),vl=i=>String(i||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),Of=i=>i==="eee"?"#eee":`#asig/${i}`,Vn={etapa:"",curso:"",q:""},C_="Pablo Mateos Lema"});var W_=om(()=>{Ou();Qp();Kd();pf();Pf();au();Lf();xu();zf();var Ke=(i,e=document)=>e.querySelector(i),re=i=>String(i).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Yf=new URLSearchParams(location.search),Zf=Yf.get("render")==="1",Jf={relay:["COM","NO","NC"],l298n:["OUT1","OUT2","OUT3","OUT4","+12V","GND","+5V"]};function Hf(i,e){if(/^(D|A|I)\d/.test(e))return"H";if(/^P\./.test(e))return"M";if(e==="DC")return"DC";let[t,n]=e.split("."),s=i.parts[t];return s?(Jf[s.type]||[]).includes(n)?"M":["pump","motor","servo"].includes(s.type)?"LEAD":s.type==="battery"?"DC":s.type==="breadboard"?"M":"H":"?"}function Kf(i,e){let t=Hf(i,e.from),n=Hf(i,e.to);if(t==="DC"||n==="DC")return"Clavija DC";if(t==="LEAD"||n==="LEAD")return i.parts[(t==="LEAD"?e.from:e.to).split(".")[0]].type==="servo"?"Conector del servo":"Cable propio del componente";let s=[t,n].sort().join("-");return{"H-H":"H-H","H-M":"M-H","M-M":"M-M"}[s]||s}function Qf(i,e){if(/^(D|A|I)\d|^P\.|^DC$/.test(e))return null;let[t,n]=e.split("."),s=i.parts[t],r=(s.label||s.type).split("\u2192")[0].trim();if((Jf[s.type]||[]).includes(n))return`<b>borne ${re(n)}</b> de: ${re(r)}`;let a={marron:"cable marr\xF3n",rojo:"cable rojo",naranja:"cable naranja",negro:"cable negro",dc:"clavija",c55a:"columna 55, fila a",c55c:"columna 55, fila c"}[n]||"pin "+n;return`<b>${re(a)}</b> de: ${re(r)}`}function kf(i,e){return Qf(i,e)||If(e)}function Gf(i,e){if(!Qf(i,e))return gu(e);let[n,s]=e.split("."),r=i.parts[n];return(r.label||r.type).split("\u2192")[0].trim()+" \xB7 "+s}var em=i=>`<span class="sw" style="background:${mu[i]||"#888"}"></span>`,$f=/\b(const|int|float|bool|void|if|else|for|while|return|unsigned|long|char|true|false|byte|static|break|case|switch|do|String)\b/,Wf=/\b(setup|loop|pinMode|digitalWrite|digitalRead|analogRead|analogWrite|analogReadMilliVolts|analogReadResolution|analogSetPinAttenuation|delay|delayMicroseconds|millis|tone|noTone|pulseIn|map|constrain|min|max|abs|ledcAttach|ledcWrite|Serial|Wire|begin|print|println)\b/;function R_(i){let e=/(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)')|(#\w+[^\n]*)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g,t="",n=0,s;for(;s=e.exec(i);){t+=re(i.slice(n,s.index)),n=e.lastIndex;let r=re(s[0]);s[1]?t+=`<span class="c-com">${r}</span>`:s[2]?t+=`<span class="c-str">${r}</span>`:s[3]?t+=`<span class="c-pre">${r}</span>`:s[4]?t+=`<span class="c-num">${r}</span>`:$f.test(s[0])&&s[0].match($f)[0]===s[0]?t+=`<span class="c-kw">${r}</span>`:Wf.test(s[0])&&s[0].match(Wf)[0]===s[0]?t+=`<span class="c-fn">${r}</span>`:/^[A-Z][A-Z0-9_]+$/.test(s[0])?t+=`<span class="c-const">${r}</span>`:t+=r}return t+re(i.slice(n))}function P_(i){let e=[],t={},n=T=>/^(D|A|I)\d|^P\.|^DC$/.test(T);for(let T of i.wires)for(let R of[T.from,T.to])if(n(R))e.includes(R)||e.push(R);else{let[w,v]=R.split(".");t[w]=t[w]||[],t[w].includes(v)||t[w].push(v)}let s=T=>{let R=T.match(/^(D|A|I|P)/);return({D:0,A:1,I:2,P:3}[R?R[1]:"Z"]??4)*1e3+e.indexOf(T)};e.sort((T,R)=>s(T)-s(R));let r=24,a=16,o=8,l=168,c={};e.forEach((T,R)=>c[T]=a+30+R*r);let d=e.length*r+40,u=Object.keys(t),h=392,p=196,m=a,b={},g=[];for(let T of u){let R=t[T],w=i.parts[T];g.push({pid:T,y:m,h:R.length*r+34,label:(w.label||w.type).split("\u2192")[0].trim()}),R.forEach((v,x)=>b[T+"."+v]=m+28+x*r+6),m+=R.length*r+34+18}let f=Math.max(a+d,m)+10,S=`<svg viewBox="0 0 ${600+Math.max(0,i.wires.filter(T=>!n(T.from)&&!n(T.to)).length)*14} ${f}" class="schem" xmlns="http://www.w3.org/2000/svg" font-family="Decima, Arial, sans-serif">`;S+=`<rect x="${o}" y="${a}" width="${l}" height="${d}" rx="8" fill="#15171a"/><text x="${o+l/2}" y="${a+20}" fill="#fff" font-size="13" font-weight="700" text-anchor="middle">ESP32 Plus \xB7 interruptor ${i.switch==="5V"?"5V":"3.3V"}</text>`;for(let T of e)S+=`<text x="${o+l-10}" y="${c[T]+6}" fill="#fff" font-size="13.5" text-anchor="end">${re(gu(T))}</text><circle cx="${o+l}" cy="${c[T]+2}" r="3.5" fill="#f39900"/>`;for(let T of g){S+=`<rect x="${h}" y="${T.y}" width="${p}" height="${T.h}" rx="8" fill="#fff" stroke="#51626F" stroke-width="1.5"/><text x="${h+p/2}" y="${T.y+18}" font-size="14" font-weight="700" fill="#DC001B" text-anchor="middle">${re(T.label)}</text>`;for(let R of t[T.pid]){let w=b[T.pid+"."+R];S+=`<circle cx="${h}" cy="${w-4}" r="3.5" fill="#51626F"/><text x="${h+10}" y="${w}" font-size="13.5" fill="#222">${re(R.replace(/^c55/,"col.55 "))}</text>`}}let y=0,L=0;for(let T of i.wires){let R=mu[T.color]||"#888",w=T.color==="blanco"?"#bbb":R,v=n(T.from)?T.from:n(T.to)?T.to:null;if(v){let x=v===T.from?T.to:T.from,P=c[v]+2,F=b[x]-4,U=o+l,B=h,j=190+y++%20*10;S+=`<path d="M${U} ${P} H${j} V${F} H${B}" fill="none" stroke="${w}" stroke-width="2.4" ${T.color==="blanco"?'stroke-dasharray="6 3"':""}/>`}else{let x=b[T.from]-4,P=b[T.to]-4,F=h+p+14+L++*12;S+=`<path d="M${h} ${x} H${h-12} M${h+p} ${x} H${F} V${P} H${h+p}" fill="none" stroke="${w}" stroke-width="2.4"/>`,S+=`<circle cx="${h+p}" cy="${x}" r="3" fill="${w}"/><circle cx="${h+p}" cy="${P}" r="3" fill="${w}"/>`}}return S+"</svg>"}function I_(i){return Object.entries(i.ra).map(([e,t])=>`<div class="ra"><div class="ra-h"><span class="tag">RA${e}</span> ${re(Us[e].t)}</div><ul>${t.map(n=>`<li><b>CE ${e}${n})</b> ${re(Us[e].ce[n])}</li>`).join("")}</ul></div>`).join("")}function jf(i){return i.libs.length?`<table class="tbl"><tr><th>Librer\xEDa (nombre exacto)</th><th>Autor</th><th>Versi\xF3n probada</th></tr>${i.libs.map(e=>`<tr><td><b>${re(Ur[e].n)}</b>${Ur[e].note?`<div class="muted small">${re(Ur[e].note)}</div>`:""}</td><td>${re(Ur[e].a)}</td><td>${re(Ur[e].v)}</td></tr>`).join("")}</table>`:'<p class="muted">Esta pr\xE1ctica no necesita librer\xEDas adicionales: solo el paquete \xABesp32\xBB.</p>'}function L_(i,e){let t=i.steps[e],s=(t.wires||[]).map(r=>i.wires.find(a=>a.id===r)).map(r=>`<tr><td>${em(r.color)}<b>${bu[r.color]||r.color}</b><div class="muted small">${re(Kf(i,r))}</div></td><td>${kf(i,r.from)}</td><td class="arrow">\u2192</td><td>${kf(i,r.to)}</td></tr>`).join("");return`<div class="step-card">
    <div class="step-h"><span class="step-n">${e+1}</span><div><div class="muted small">Paso ${e+1} de ${i.steps.length}</div><h3>${re(t.t)}</h3></div></div>
    <div class="blk take"><h4>\u{1F9F0} Coge</h4><ul>${(t.take||[]).map(r=>`<li>${r}</li>`).join("")}</ul></div>
    <div class="blk do"><h4>\u{1F527} Haz</h4><ol>${(t.do||[]).map(r=>`<li>${r}</li>`).join("")}</ol>
    ${s?`<table class="tbl wires"><tr><th>Cable</th><th>Desde</th><th></th><th>Hasta</th></tr>${s}</table>`:""}</div>
    <div class="blk check"><h4>\u2705 Comprueba antes de seguir</h4><p>${t.check||""}</p></div>
  </div>`}function D_(i){let e=[...su,...i.tools||[]];return{pasos:()=>L_(i,it.step)+`<div class="steps-list">${i.steps.map((t,n)=>`<button class="sl ${n===it.step?"on":""}" data-step="${n}"><span>${n+1}</span>${re(t.t)}</button>`).join("")}</div>`,ficha:()=>`<h3>Proyecto ${i.n}. ${re(i.title)}</h3><p class="lead">${re(i.intro)}</p>
      <div class="facts"><div><b>Nivel</b>${re(i.level)}</div><div><b>Duraci\xF3n</b>${re(i.duration)}</div><div><b>Interruptor</b>${i.switch==="5V"?"5V":"3.3V"}</div></div>
      ${i.caution?`<div class="caution">\u26A0\uFE0F <b>Precauci\xF3n.</b> ${re(i.caution)}</div>`:""}
      <h4>Objetivos</h4><ul>${i.objectives.map(t=>`<li>${re(t)}</li>`).join("")}</ul>
      <h4>Resultados de aprendizaje y criterios de evaluaci\xF3n</h4><p class="muted small">Profesor: <b>${re(mn.profesor)}</b> \xB7 M\xF3dulo ${Ji.codigo} \xAB${Ji.nombre}\xBB \xB7 ${re(Ji.norma)}</p>${I_(i)}
      <h4>Seguridad</h4><ul class="safety">${ru.map(t=>`<li>${re(t)}</li>`).join("")}</ul>`,material:()=>`<h4>Material del kit</h4><table class="tbl"><tr><th>Componente</th><th>Cant.</th><th>Notas</th></tr>${i.materials.map(t=>`<tr><td>${re(t[0])}</td><td class="c">${t[1]}</td><td class="muted small">${re(t[2]||"")}</td></tr>`).join("")}</table>
      <h4>Herramientas</h4><table class="tbl">${e.map(t=>`<tr><td><b>${re(t[0])}</b></td><td class="muted small">${re(t[1])}</td></tr>`).join("")}</table>
      <h4>Librer\xEDas de Arduino</h4>${jf(i)}
      <h4>Tipos de cable Dupont</h4><table class="tbl">${Jp.map(t=>`<tr><td><b>${re(t[0])}</b></td><td class="muted small">${re(t[1])}</td></tr>`).join("")}</table>`,software:()=>`<h4>Preparar el ordenador (una sola vez)</h4><ol class="sw-steps">${iu.map(([t,n])=>`<li><b>${t}</b><div>${n}</div></li>`).join("")}</ol>
      <h4>Librer\xEDas de esta pr\xE1ctica</h4>${jf(i)}
      <div class="note">Configuraci\xF3n: placa <b>ESP32 Dev Module</b> \xB7 velocidad del Monitor Serie <b>115200 baudios</b> \xB7 paquete esp32 <b>3.x</b>.</div>`,esquema:()=>`<h4>Esquema de conexiones</h4><div class="schem-wrap" title="Clic para ampliar">${P_(i)}</div><p class="muted small">Clic en el esquema para ampliarlo. Cada l\xEDnea es un cable con su color real (el blanco va discontinuo).</p>
      <h4>Tabla de cableado</h4><table class="tbl wires"><tr><th>#</th><th>Cable</th><th>Desde</th><th>Hasta</th><th>Tipo</th></tr>${i.wires.map((t,n)=>`<tr><td class="c">${n+1}</td><td>${em(t.color)}${bu[t.color]}</td><td>${re(Gf(i,t.from))}</td><td>${re(Gf(i,t.to))}</td><td class="small">${re(Kf(i,t))}</td></tr>`).join("")}</table>`,codigo:()=>`<div class="code-bar"><span>${re(i.file.split("/")[1])}</span><span class="grow"></span><button class="btn" id="copyCode">Copiar</button><a class="btn" href="codigo/${i.file}" download>Descargar .ino</a></div>
      <pre class="code"><code>${R_(i.code)}</code></pre>
      <p class="muted small">C\xF3digo verificado: compila sin errores con arduino-cli, paquete esp32 3.3 y placa \xABESP32 Dev Module\xBB.</p>`,prueba:()=>`<h4>Funcionamiento esperado</h4><ul>${i.expected.map(t=>`<li>${re(t)}</li>`).join("")}</ul>
      <h4>Ejemplo</h4><p>${i.example}</p>
      <h4>Monitor Serie (115200 baudios)</h4><pre class="serial">${re(i.serial)}</pre>
      <h4>Comprobaci\xF3n con el pol\xEDmetro</h4><table class="tbl"><tr><th>Medida</th><th>C\xF3mo</th><th>Valor esperado</th></tr>${i.multimeter.map(t=>`<tr><td><b>${re(t[0])}</b></td><td class="small">${re(t[1])}</td><td class="small">${re(t[2])}</td></tr>`).join("")}</table>
      <h4>Aver\xEDas frecuentes</h4><table class="tbl"><tr><th>S\xEDntoma</th><th>Causa probable</th><th>Soluci\xF3n</th></tr>${i.trouble.map(t=>`<tr><td><b>${re(t[0])}</b></td><td class="small">${re(t[1])}</td><td class="small">${re(t[2])}</td></tr>`).join("")}</table>
      ${i.maintenance?`<h4>Pr\xE1ctica de mantenimiento: sustituir un sensor averiado</h4><p>${re(i.maintenance.intro)}</p><ol class="sw-steps">${i.maintenance.steps.map(([t,n])=>`<li><b>${re(t)}</b><div>${re(n)}</div></li>`).join("")}</ol>`:""}`,reto:()=>`<h4>Reto de ampliaci\xF3n</h4><ol>${i.challenge.map(t=>`<li>${re(t)}</li>`).join("")}</ol>
      <h4>Informe de la pr\xE1ctica</h4><ol class="small"><li>${Ut()?.rol==="alumno"?"N\xFAmero de lista, grupo":"Nombre"}, fecha y n\xFAmero de kit.</li><li>Objetivo de la pr\xE1ctica con tus palabras.</li><li>Lista de material y herramientas usadas.</li><li>Esquema de conexiones (dib\xFAjalo o pega una captura) con los colores de los cables.</li><li>Tabla de mediciones con el pol\xEDmetro (valor esperado / valor medido).</li><li>Problemas encontrados y c\xF3mo los resolviste.</li><li>Resultado del reto y conclusiones.</li><li>Desmontaje: material guardado y revisado, residuos depositados donde corresponde.</li></ol>${N_(i)}`}}var mn=_l.find(i=>i.id==="eee");function qf(i){let e=window.PORTAL_SESION;return!e||!Array.isArray(e.asignaturas)?!0:e.asignaturas.includes("*")||e.asignaturas.includes(i)}function Mu(i){let e=window.PORTAL_SESION;return!e||!Array.isArray(e.apartados)||!e.apartados.length?!0:e.apartados.includes(i)}var Br=()=>window.PORTAL&&window.PORTAL.chipHTML?window.PORTAL.chipHTML():"",Ut=()=>window.PORTAL||null,O_=i=>i?new Date(i).toLocaleString("es-ES",{dateStyle:"short",timeStyle:"short"}):"";function Eu(i){let e=Ut()?.estadoEntrega?.("p"+i.n);return e?`<div class="esp-ent-ok">\u2705 <b>Entregado</b> \xB7 ${re(O_(e.fecha))}</div>`+(e.nota!=null?`<div class="esp-ent-nota">Nota: <b>${re(String(e.nota).replace(".",","))}</b></div>`:'<div class="muted small">Pendiente de corregir.</div>')+(e.comentario?`<div class="esp-ent-com">\u{1F4AC} ${re(e.comentario)}</div>`:""):'<p class="muted small">Todav\xEDa no lo has entregado.</p>'}function N_(i){let e=Ut();if(!e||e.rol!=="alumno")return"";let t=e.estadoEntrega("p"+i.n),n=t?.datos?.informe||{},s=t&&t.nota!=null,r=(a,o,l)=>`<label class="esp-l">${o}<textarea id="${a}" maxlength="3000" rows="3" ${s?"disabled":""}>${re(l||"")}</textarea></label>`;return`<h4>Entregar el proyecto</h4><div class="esp-entrega">
    <p class="muted small">Marca el proyecto como hecho. Si quieres, a\xF1ade respuestas del informe (no escribas tu nombre).</p>
    ${r("espMed","Tabla de mediciones (valor esperado / medido)",n.mediciones)}
    ${r("espProb","Problemas encontrados y c\xF3mo los resolviste",n.problemas)}
    ${r("espConc","Resultado del reto y conclusiones",n.conclusiones)}
    ${s?"":`<button class="btn primary" data-esp-entregar="${i.n}">${t?"\u21BB Volver a entregar":"\u2705 Marcar como hecho y entregar"}</button>`}
    <div id="espEstado" class="esp-estado">${Eu(i)}</div></div>`}function wu(){return'<a href="#inicio" class="brand" title="Inicio">Portal docente</a>'}function U_(){return`<div class="cov-band"><div class="cov-brand">Portal docente</div><div class="cov-chip">${Br()}</div></div>
  <div class="cov-body">
    <div class="cov-ciclo">Bachillerato \xB7 ${re(Hr.ciclo)}</div>
    <div class="cov-sep"></div>
    <h1 class="cov-asig">Aula virtual</h1>
    <div class="cov-mod">${Ut()?.rol==="alumno"?re(tm().map(i=>i.corto).join(" \xB7 ")):`${pi.length} asignaturas \xB7 tareas, proyectos, ex\xE1menes y laboratorios 3D`}</div>
    <div class="cov-prof">Profesor: <b>${re(mn.profesor)}</b></div>
    <a class="btn-enter" href="#asignaturas">Entrar <span>\u2192</span></a>
  </div>
  <div class="cov-foot">Biblioteca de asignaturas \xB7 Laboratorio ESP32 \xB7 Circuitos 3D</div>`}function tm(){let i=window.PORTAL_SESION;if(i&&Array.isArray(i.asignaturas))return pi.filter(t=>i.asignaturas.includes("*")||i.asignaturas.includes(t.id));let e=Ut()?.aula?.asignaturasCurso?.();return e?pi.filter(t=>e.asignaturas.includes(t.id)):pi}function nm(){let i=Ut(),e=!!i?.esProfesor,t=i?.rol==="alumno",n=e?i.aula?.asignaturasCurso?.():null,s=tm(),r=t?"Tus asignaturas":n?`Mis asignaturas \xB7 ${n.curso}`:"Asignaturas";return`<header class="scr-top">${wu()}<div class="scr-ttl">Bachillerato \xB7 ${re(Hr.ciclo)}</div></header>
  <div class="crumbs static"><div><a href="#inicio">Inicio</a> \u203A <span>Asignaturas</span></div><div class="prof">${Br()}</div></div>
  <div class="subj-wrap"><h2>${re(r)}</h2><p class="muted">${t?"Elige una asignatura para ver su trabajo de clase y sus laboratorios.":e&&!n?'Todav\xEDa no has creado el curso escolar: hazlo en el <a href="#panel/cursos">panel</a> y elige las asignaturas que impartes. Mientras, se muestran todas.':"Elige una asignatura para entrar en sus contenidos."}</p>
  ${s.length?"":'<p class="muted subj-none">Tu c\xF3digo todav\xEDa no da acceso a ninguna asignatura publicada.</p>'}
  <div class="subj-grid">${s.map(a=>yu(a)).join("")}
    ${t?"":'<a class="subj bib-card bib-lib" href="#biblioteca"><div class="subj-ic">\u{1F4DA}</div><div class="subj-cod">Todas las etapas</div><h3>Biblioteca de asignaturas</h3><p>Cat\xE1logo completo con filtros por etapa y curso, y buscador de unidades, tareas y proyectos.</p><span class="subj-go">Abrir \u2192</span></a>'}
    ${e?'<a class="subj bib-card bib-lib" href="#panel/contenido"><div class="subj-ic">\u2699\uFE0F</div><div class="subj-cod">Profesor</div><h3>Panel del profesor</h3><p>Cursos escolares, grupos y c\xF3digos, contenido, ex\xE1menes y calificaciones.</p><span class="subj-go">Abrir \u2192</span></a>':""}
  </div></div>`}function V_(){let i=it.lesson;Ke("#crumbs").innerHTML=`<a href="#inicio">Inicio</a> \u203A <a href="#asignaturas">Asignaturas</a> \u203A <a href="#eee">${re(mn.nombre)}</a> \u203A `+(i?`<a href="#eee/esp32">ESP32</a> \u203A <span>Proyecto ${i.n}: ${re(i.title)}</span>`:"<span>ESP32</span>")}function B_(){let i=(Sl[mn.id]||[]).filter(e=>Mu(e.id));return`<header class="scr-top">${wu()}<div class="scr-ttl">${re(Hr.ciclo)}</div></header>
  <div class="crumbs static"><div><a href="#inicio">Inicio</a> \u203A <a href="#asignaturas">Asignaturas</a> \u203A <span>${re(mn.nombre)}</span></div><div class="prof">Profesor: <b>${re(mn.profesor)}</b>${Br()}</div></div>
  <div class="subj-wrap"><div class="subj-cod">M\xF3dulo ${re(mn.codigo)}</div><h2>${re(mn.nombre)}</h2><p class="muted">Elige un apartado.</p>
  ${Ut()?.aula?.activa?.()?'<div id="apTrabajo" class="au-sec"></div>':""}
  <h3 class="ap-labs-t">\u{1F52C} Laboratorios</h3>
  <div class="ap-grid">${i.map(e=>e.active?`<a class="ap-card" style="--ap:${e.color}" href="#${mn.id}/${e.id}"><div class="ap-ic">${e.icon}</div><h3>${re(e.nombre)}</h3><p>${re(e.desc)}</p><div class="ap-tags">${(e.tags||[]).map(t=>`<span>${re(t)}</span>`).join("")}</div><span class="ap-go">Entrar \u2192</span></a>`:`<div class="ap-card off"><div class="ap-ic">${e.icon}</div><h3>${re(e.nombre)}</h3><p>Pr\xF3ximamente</p></div>`).join("")}
  </div>${_u(Ba("eee"),{completo:Ut()?.rol!=="alumno",abierto:!1})}</div>`}var Ii=null,Fa;function fn(i,e){if(document.body.classList.toggle("scr-cover",i==="cover"),document.body.classList.toggle("scr-subjects",i==="subjects"),document.body.classList.toggle("scr-apartados",i==="apartados"),document.body.classList.toggle("scr-circ",i==="circ"),document.body.classList.toggle("scr-panelprof",i==="panelprof"),document.body.classList.toggle("scr-biblio",i==="biblio"),document.body.classList.toggle("scr-asig",i==="asig"),document.body.classList.toggle("scr-aula",i==="aula"),Fa!==i&&Ut()?.alCambiarPantalla?.(i),i==="apartados"&&(Ke("#apartados").innerHTML=B_(),Ut()?.aula?.renderTrabajo?.(Ke("#apTrabajo"),"eee")),i==="biblio"){let t=Ut()?.aula?.asignaturasCurso?.()||null;Ke("#biblio").innerHTML=Uf({chip:Br(),esProfesor:!!Ut()?.esProfesor,enCurso:t}),Bf(Ke("#biblio"),t)}if(i==="asig"){let t=!!Ut()?.aula?.activa?.();Ke("#asig").innerHTML=Ff(e,{chip:Br(),completo:Ut()?.rol!=="alumno",conAula:t}),t&&Ut().aula.renderTrabajo(Ke("#asTrabajo"),e)}ht&&ht.renderer&&ht.renderer.setAnimationLoop(i?null:()=>ht.tick()),i!=="circ"&&Ii&&Ii.pause(),Fa!==i&&!i&&setTimeout(()=>window.dispatchEvent(new Event("resize")),0),Fa=i,i==="cover"&&(Ke("#cover").innerHTML=U_()),i==="subjects"&&(Ke("#subjects").innerHTML=nm()),i||window.dispatchEvent(new Event("resize")),window.scrollTo(0,0)}var F_=[["pasos","Paso a paso"],["ficha","Ficha"],["material","Material"],["software","Preparar PC"],["esquema","Esquema"],["codigo","C\xF3digo"],["prueba","Prueba"],["reto","Reto"]];function z_(){return`<h3>Laboratorio ESP32 \xB7 Paso a paso en 3D</h3>
  <p class="lead">8 proyectos de dificultad creciente con la placa <b>ACEBOTT ESP32 Plus</b> y el kit de sensores y actuadores. Elige un proyecto abajo y sigue los pasos: el modelo 3D muestra en cada paso qu\xE9 pieza coger y d\xF3nde va cada cable.</p>
  <div class="cards">${rn.map(i=>`<a class="card" href="#p${i.n}"><span class="num">${i.n}</span><div><b>${re(i.title)}</b><div class="muted small">${re(i.level)} \xB7 ${re(i.duration)}</div><div class="small">${re(i.short)}</div></div></a>`).join("")}</div>
  <h4>Conoce la placa ESP32 Plus</h4><table class="tbl">${Zp.map(([i,e])=>`<tr><td><b>${i}</b></td><td class="small">${e}</td></tr>`).join("")}</table>
  <img class="pinout" src="img/esp32plus_pinout.jpg" alt="Pinout ESP32 Plus">
  <h4>C\xF3mo usar esta web</h4><ul><li>Arrastra el modelo para girarlo; rueda del rat\xF3n para acercar; clic derecho (o dos dedos) para desplazar.</li><li>Botones \u25C0 \u25B6 (o flechas del teclado) para cambiar de paso. Lo nuevo de cada paso aparece resaltado en naranja.</li><li>Cada paso tiene: <b>Coge</b> (qu\xE9 material), <b>Haz</b> (d\xF3nde va cada cable, con su color) y <b>Comprueba</b> (antes de seguir).</li><li>La web funciona sin Internet: se puede abrir desde una carpeta o un USB.</li></ul>
  <h4>Preparar el ordenador</h4><ol class="sw-steps">${iu.map(([i,e])=>`<li><b>${i}</b><div>${e}</div></li>`).join("")}</ol>
  <h4>Herramientas comunes</h4><table class="tbl">${su.map(i=>`<tr><td><b>${re(i[0])}</b></td><td class="muted small">${re(i[1])}</td></tr>`).join("")}</table>
  <h4>Normas de seguridad</h4><ul class="safety">${ru.map(i=>`<li>${re(i)}</li>`).join("")}</ul>
  <p class="muted small">Profesor: <b>${re(mn.profesor)}</b> \xB7 M\xF3dulo ${Ji.codigo} \xAB${Ji.nombre}\xBB \xB7 ${Ji.titulo} \xB7 ${Ji.norma}.</p>`}var it={lesson:null,step:0,tab:"pasos"},ht;function Xf(i,e=0){let t=rn.find(n=>n.n===i);if(it.lesson=t,it.step=Math.min(e,t?t.steps.length-1:0),document.body.classList.toggle("home",!t),document.querySelectorAll(".lesson-strip .ls").forEach(n=>n.classList.toggle("on",+n.dataset.n===i)),V_(),!t){ht.loadLesson({parts:{},wires:[],steps:[{t:"",allLabels:!0}],switch:"3V3",view:[.15,1,.75],margin:1.25}),ht.showStep(0,!0),H_(),Ke("#panel").innerHTML=z_(),Ke("#tabs").innerHTML="",Ke("#vtitle").innerHTML="<b>ESP32 Plus</b> \xB7 vista general",Ke("#stepbar").style.display="none";return}Ke("#stepbar").style.display="",ht.loadLesson(t),Ke("#tabs").innerHTML=F_.map(([n,s])=>`<button data-tab="${n}" class="${n===it.tab?"on":""}">${s}</button>`).join(""),Ke("#vtitle").innerHTML=`<span class="pill">${t.n}</span><b>${re(t.title)}</b> \xB7 ${re(t.level)}`,Fs(it.step,!0)}function H_(){let i=ht.board.userData.pins,e=(t,n)=>{let s=document.createElement("div");s.className="lbl part",s.innerHTML=t,ht.labelLayer.appendChild(s),ht.labels.push({el:s,pos:n.clone().setY(n.y+4)})};e("Conectores <b>G-V-S</b> (GPIO 18\u202612)",i["D5.S"].pos),e("Conectores <b>G-V-S</b> (GPIO 14\u202626)",i["D17.S"].pos),e("Bloque <b>I2C</b>",i["I2.SDA"].pos),e("Bloque <b>ANALOG</b> 34\xB735\xB74\xB72",i["A35.V"].pos),e("Interruptor <b>3.3V / 5V</b>",ht.board.userData.switchPos),e("<b>USB-B</b>",i.USB.pos),e("<b>Jack DC</b> 7\u201312 V",i.DC.pos),e("Conector <b>POWER</b>",i["P.GND"].pos),e("<b>ESP32</b> (Wi-Fi + Bluetooth)",ht.board.position.clone().set(14,6,2))}function Fs(i,e=!1){let t=it.lesson;t&&(it.step=Math.max(0,Math.min(i,t.steps.length-1)),ht.showStep(it.step,e),Ke("#stepcount").textContent=`Paso ${it.step+1} / ${t.steps.length}`,Ke("#steptitle").textContent=t.steps[it.step].t,Ke("#dots").innerHTML=t.steps.map((n,s)=>`<button class="${s===it.step?"on":s<it.step?"done":""}" data-step="${s}" title="${re(n.t)}"></button>`).join(""),Ke("#prev").disabled=it.step===0,Ke("#next").disabled=it.step===t.steps.length-1,im(),Zf||history.replaceState(null,"",`#p${t.n}-${it.step+1}`))}function im(){let i=it.lesson;i&&(document.querySelectorAll("#tabs button").forEach(e=>e.classList.toggle("on",e.dataset.tab===it.tab)),Ke("#panel").innerHTML=D_(i)[it.tab](),Ke("#panel").scrollTop=0)}function k_(){document.body.innerHTML=`
  <div id="cover" class="screen"></div>
  <div id="subjects" class="screen"></div>
  <div id="apartados" class="screen"></div>
  <div id="circ" class="screen"></div>
  <div id="panelprof" class="screen"></div>
  <div id="biblio" class="screen"></div>
  <div id="asig" class="screen"></div>
  <div id="aula" class="screen"></div>
  <header class="top">${wu()}
    <div class="ttl"><div class="t1">Laboratorio <span>ESP32</span></div><div class="t2">${re(mn.nombre)} \xB7 ${re(Hr.ciclo)}</div></div>
    <nav><a href="#inicio" class="navb">Inicio</a><a href="#asignaturas" class="navb">Asignaturas</a><a href="#eee/circuitos" class="navb">Circuitos</a><a href="#p1" class="navb">Empezar</a></nav></header>
  <div class="crumbs"><div id="crumbs"></div><div class="prof">Profesor: <b>${re(mn.profesor)}</b>${Br()}</div></div>
  <main>
    <section class="viewer"><div id="gl"></div><div id="labels"></div>
      <div id="vtitle" class="vtitle"></div>
      <div class="vtools"><button id="vreset" title="Vista inicial">\u27F2</button><button id="vtop" title="Vista desde arriba">\u22A4</button><button id="vlabels" title="Mostrar/ocultar etiquetas">\u{1F3F7}</button><button id="vfull" title="Pantalla completa">\u26F6</button></div>
      <div id="stepbar" class="stepbar"><button id="prev" class="btn">\u25C0 Anterior</button><div class="mid"><div id="stepcount"></div><div id="steptitle"></div><div id="dots" class="dots"></div></div><button id="next" class="btn primary">Siguiente \u25B6</button></div>
      <div class="hint">Arrastra para girar \xB7 rueda para zoom \xB7 clic derecho para mover</div>
    </section>
    <aside class="side"><div id="tabs" class="tabs"></div><div id="panel" class="panel"></div></aside>
  </main>
  <footer class="lesson-strip">${rn.map(i=>`<a class="ls" data-n="${i.n}" href="#p${i.n}"><span class="num">${i.n}</span><span class="ic">${i.icon}</span><span class="nm">${re(i.title)}</span></a>`).join("")}</footer>`}function G_(){Ke("#prev").onclick=()=>Fs(it.step-1),Ke("#next").onclick=()=>Fs(it.step+1),Ke("#vreset").onclick=()=>ht.resetView(),Ke("#vtop").onclick=()=>ht.topView(),Ke("#vlabels").onclick=()=>{ht.showLabels=!ht.showLabels},Ke("#vfull").onclick=()=>{let i=Ke(".viewer");document.fullscreenElement?document.exitFullscreen():i.requestFullscreen&&i.requestFullscreen()},document.addEventListener("click",i=>{let e=i.target.closest("[data-tab]");e&&(it.tab=e.dataset.tab,im());let t=i.target.closest("[data-step]");t&&Fs(+t.dataset.step);let n=i.target.closest(".schem-wrap");if(n){let r=document.createElement("div");r.className="overlay",r.innerHTML=n.innerHTML+'<div class="ov-close">\u2715 Cerrar</div>',r.onclick=()=>r.remove(),document.body.appendChild(r)}let s=i.target.closest("[data-esp-entregar]");if(s&&Ut()?.entregar){let r=rn.find(o=>o.n===+s.dataset.espEntregar),a=o=>(Ke("#"+o)?.value||"").slice(0,3e3);s.disabled=!0,s.textContent="Enviando\u2026",Ut().entregar({practica:"p"+r.n,tipo:"esp32",titulo:`Proyecto ${r.n}: ${r.title}`.slice(0,120),datos:{hecho:!0,informe:{mediciones:a("espMed"),problemas:a("espProb"),conclusiones:a("espConc")}}}).then(()=>{s.textContent="\u21BB Volver a entregar"},o=>{s.textContent="\u274C No se ha podido entregar. Reintentar",alert("No se ha podido entregar: "+(o?.mensaje||"revisa la conexi\xF3n."))}).finally(()=>{s.disabled=!1;let o=Ke("#espEstado");o&&it.lesson&&(o.innerHTML=Eu(it.lesson))})}i.target.id==="copyCode"&&navigator.clipboard?.writeText(it.lesson.code).then(()=>{i.target.textContent="\xA1Copiado!",setTimeout(()=>i.target.textContent="Copiar",1500)}).catch(()=>{})}),document.addEventListener("keydown",i=>{i.target.closest("input,textarea,select")||Fa||(i.key==="ArrowRight"&&Fs(it.step+1),i.key==="ArrowLeft"&&Fs(it.step-1))}),window.addEventListener("hashchange",xl),window.addEventListener("portal-entregas",()=>{Ii&&Ii.refreshEntrega();let i=Ke("#espEstado");i&&it.lesson&&(i.innerHTML=Eu(it.lesson))})}function xl(){let i=location.hash;if(/^#panel(\/|$)/.test(i)){if(Ut()?.esProfesor){fn("panelprof"),Ut().renderPanel(Ke("#panelprof"),i.replace(/^#panel\/?/,"")||"grupos");return}return history.replaceState(null,"","#inicio"),fn("cover")}if(i==="#asignaturas")return fn("subjects");if(i===""||i==="#"||i==="#inicio")return fn("cover");if(i==="#biblioteca")return fn("biblio");let e=i.match(/^#asig\/([\w-]+)/);if(e)return e[1]==="eee"?(history.replaceState(null,"","#eee"),xl()):!Ba(e[1])||!qf(e[1])?(history.replaceState(null,"","#asignaturas"),fn("subjects")):fn("asig",e[1]);let t=i.match(/^#trabajo\/([\w-]+)/);if(t){if(!Ut()?.aula?.activa?.())return history.replaceState(null,"","#asignaturas"),fn("subjects");fn("aula"),Ut().aula.renderItem(Ke("#aula"),t[1]);return}if(!qf(mn.id))return history.replaceState(null,"","#asignaturas"),fn("subjects");if(i==="#eee"||i==="#eee/")return fn("apartados");let n=i.match(/^#eee\/circuitos(?:\/([\w-]+))?/);if(n&&!Mu("circuitos")||!n&&!Mu("esp32"))return history.replaceState(null,"","#eee"),fn("apartados");if(n){Ii||(Ii=new fl(Ke("#circ"),{subject:mn.nombre,profesor:mn.profesor})),fn("circ"),window.__circ=Ii;let r=n[1]||"home";if(r==="revision"){let a=Ut()?.esProfesor&&Ut().revision;if(a){Ii.review(a);return}return history.replaceState(null,"",Ut()?.esProfesor?"#panel/entregas":"#eee/circuitos"),xl()}Ii.show(r==="libre"||/^c\d+$/.test(r)?r:"home");return}fn(null);let s=i.match(/^#p(\d)(?:-(\d+))?/);if(s){let r=+s[1],a=s[2]?+s[2]-1:0;Su=!0,!it.lesson||it.lesson.n!==r?Xf(r,a):a!==it.step&&Fs(a)}else(it.lesson||!Su)&&(Su=!0,Xf(0),history.replaceState(null,"","#eee/esp32"))}var Su=!1;function $_(){document.body.className="render",document.body.innerHTML='<div class="viewer render"><div id="gl"></div><div id="labels"></div></div>',ht=new Na(Ke("#gl"),Ke("#labels"),{render:!0,background:Yf.get("bg")||"#ffffff",fitAspect:16/9,padTop:.13,padBottom:.04,padX:.05}),window.renderShot=(i,e)=>{let t=rn.find(r=>r.n===i);ht.loadLesson(t);let n=e==="final"?t.steps.length-1:e-1;ht.showStep(n,!0);let s=ht.homeH;return ht.fitAll(!0,s*.5),e==="final"&&(ht.labels.forEach(r=>r.el.remove()),ht.labels=[],ht.halos.forEach(r=>ht.root.remove(r)),ht.halos=[],ht.buildLabels({allLabels:!0},new Set(Object.keys(t.parts)),new Set)),ht.layoutLabels(),t.steps.length},window.lessonInfo=rn.map(i=>({n:i.n,slug:i.slug,steps:i.steps.length,titles:i.steps.map(e=>e.t)})),window.__viewer=ht,window.renderReady=!0}Zf?$_():(window.PORTAL_CATALOGO={practicas:Os.map(i=>({id:i.id,n:i.n,titulo:i.title})),proyectos:rn.map(i=>({id:"p"+i.n,n:i.n,titulo:i.title})),subjects:_l,apartados:Sl,biblioteca:pi},window.addEventListener("portal-aula",()=>{Fa==="subjects"&&(Ke("#subjects").innerHTML=nm())}),k_(),ht=new Na(Ke("#gl"),Ke("#labels"),{padTop:.1,padBottom:.2,padX:.04}),G_(),xl(),window.__app={state:it,viewer:ht,LESSONS:rn})});W_();})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
