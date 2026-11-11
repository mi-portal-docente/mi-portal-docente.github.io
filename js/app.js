(()=>{var Pt=(n,e,t)=>()=>{if(t)throw t[0];try{return n&&(e=n(n=0)),e}catch(i){throw t=[i],i}};var Xh=(n,e)=>()=>{try{return e||n((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}};var Pi,_a,tc=Pt(()=>{Pi={nombre:"Salesianos Algeciras",ciclo:"CFGB Inform\xE1tica y Comunicaciones"},_a=[{id:"eee",codigo:"3015",nombre:"Equipos el\xE9ctricos y electr\xF3nicos",profesor:"Pablo Mateos Lema",icon:"\u26A1",active:!0,desc:"8 proyectos paso a paso en 3D con la placa ESP32 Plus y el kit de sensores: sem\xE1foro, timbre, farola, term\xF3metro, aparcamiento, barrera, riego y ventilador."}]});function Ti(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(It[n&255]+It[n>>8&255]+It[n>>16&255]+It[n>>24&255]+"-"+It[e&255]+It[e>>8&255]+"-"+It[e>>16&15|64]+It[e>>24&255]+"-"+It[t&63|128]+It[t>>8&255]+"-"+It[t>>16&255]+It[t>>24&255]+It[i&255]+It[i>>8&255]+It[i>>16&255]+It[i>>24&255]).toLowerCase()}function Ct(n,e,t){return Math.max(e,Math.min(t,n))}function Al(n,e){return(n%e+e)%e}function Iu(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function Du(n,e,t){return n!==e?(t-n)/(e-n):0}function Es(n,e,t){return(1-t)*n+t*e}function Lu(n,e,t,i){return Es(n,e,1-Math.exp(-t*i))}function Nu(n,e=1){return e-Math.abs(Al(n,e*2)-e)}function Ou(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Uu(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Bu(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Fu(n,e){return n+Math.random()*(e-n)}function Vu(n){return n*(.5-Math.random())}function zu(n){n!==void 0&&(uc=n);let e=uc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Hu(n){return n*Ms}function ku(n){return n*Is}function Gu(n){return(n&n-1)===0&&n!==0}function Wu(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Xu(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function qu(n,e,t,i,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),d=a((e+i)/2),h=r((e-i)/2),u=a((e-i)/2),p=r((i-e)/2),g=a((i-e)/2);switch(s){case"XYX":n.set(o*d,l*h,l*u,o*c);break;case"YZY":n.set(l*u,o*d,l*h,o*c);break;case"ZXZ":n.set(l*h,l*u,o*d,o*c);break;case"XZX":n.set(o*d,l*g,l*p,o*c);break;case"YXY":n.set(l*p,o*d,l*g,o*c);break;case"ZYZ":n.set(l*g,l*p,o*d,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Xi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Bt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}function Pd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Rr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function ju(){let n=Rr("canvas");return n.style.display="block",n}function bs(n){n in fc||(fc[n]=!0,console.warn(n))}function $u(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function Yu(n){let e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Zu(n){let e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}function Bn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Zi(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}function ba(n){return typeof HTMLImageElement!="undefined"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&n instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&n instanceof ImageBitmap?Bo.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}function Ma(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){oi.fromArray(n,r);let o=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),l=e.dot(oi),c=t.dot(oi),d=i.dot(oi);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}function Ua(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}function cf(n,e,t,i,s,r,a,o){let l;if(e.side===Ht?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===ei,o),l===null)return null;dr.copy(o),dr.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(dr);return c<t.near||c>t.far?null:{distance:c,point:dr.clone(),object:n}}function hr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,ar),n.getVertexPosition(l,or),n.getVertexPosition(c,lr);let d=cf(n,e,t,i,ar,or,lr,Pc);if(d){let h=new C;pi.getBarycoord(Pc,ar,or,lr,h),s&&(d.uv=pi.getInterpolatedAttribute(s,o,l,c,h,new se)),r&&(d.uv1=pi.getInterpolatedAttribute(r,o,l,c,h,new se)),a&&(d.normal=pi.getInterpolatedAttribute(a,o,l,c,h,new C),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new C,materialIndex:0};pi.getNormal(ar,or,lr,u.normal),d.face=u,d.barycoord=h}return d}function rs(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Ft(n){let e={};for(let t=0;t<n.length;t++){let i=rs(n[t]);for(let s in i)e[s]=i[s]}return e}function df(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Dd(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}function Ld(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function gf(n){let e=new WeakMap;function t(o,l){let c=o.array,d=o.usage,h=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,d),o.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){let d=l.array,h=l.updateRanges;if(n.bindBuffer(c,o),h.length===0)n.bufferSubData(c,0,d);else{h.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<h.length;p++){let g=h[u],_=h[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,h[u]=_)}h.length=u+1;for(let p=0,g=h.length;p<g;p++){let _=h[p];n.bufferSubData(c,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}function Jm(n,e,t,i,s,r,a){let o=new je(0),l=r===!0?0:1,c,d,h=null,u=0,p=null;function g(T){let S=T.isScene===!0?T.background:null;return S&&S.isTexture&&(S=(T.backgroundBlurriness>0?t:e).get(S)),S}function _(T){let S=!1,b=g(T);b===null?f(o,l):b&&b.isColor&&(f(b,1),S=!0);let N=n.xr.getEnvironmentBlendMode();N==="additive"?i.buffers.color.setClear(0,0,0,1,a):N==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(T,S){let b=g(S);b&&(b.isCubeTexture||b.mapping===aa)?(d===void 0&&(d=new He(new Ot(1,1,1),new Mn({name:"BackgroundCubeMaterial",uniforms:rs(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(N,w,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),di.copy(S.backgroundRotation),di.x*=-1,di.y*=-1,di.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),d.material.uniforms.envMap.value=b,d.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Zm.makeRotationFromEuler(di)),d.material.toneMapped=Ke.getTransfer(b.colorSpace)!==lt,(h!==b||u!==b.version||p!==n.toneMapping)&&(d.material.needsUpdate=!0,h=b,u=b.version,p=n.toneMapping),d.layers.enableAll(),T.unshift(d,d.geometry,d.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new He(new sn(2,2),new Mn({name:"BackgroundMaterial",uniforms:rs(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=Ke.getTransfer(b.colorSpace)!==lt,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||u!==b.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,h=b,u=b.version,p=n.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function f(T,S){T.getRGB(fr,Dd(n)),i.buffers.color.setClear(fr.r,fr.g,fr.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(T,S=1){o.set(T),l=S,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,f(o,l)},render:_,addToRenderList:m}}function Km(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=u(null),r=s,a=!1;function o(v,R,F,U,V){let X=!1,k=h(U,F,R);r!==k&&(r=k,c(r.object)),X=p(v,U,F,V),X&&g(v,U,F,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,b(v,R,F,U),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(v){return n.bindVertexArray(v)}function d(v){return n.deleteVertexArray(v)}function h(v,R,F){let U=F.wireframe===!0,V=i[v.id];V===void 0&&(V={},i[v.id]=V);let X=V[R.id];X===void 0&&(X={},V[R.id]=X);let k=X[U];return k===void 0&&(k=u(l()),X[U]=k),k}function u(v){let R=[],F=[],U=[];for(let V=0;V<t;V++)R[V]=0,F[V]=0,U[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:F,attributeDivisors:U,object:v,attributes:{},index:null}}function p(v,R,F,U){let V=r.attributes,X=R.attributes,k=0,Q=F.getAttributes();for(let G in Q)if(Q[G].location>=0){let ge=V[G],Se=X[G];if(Se===void 0&&(G==="instanceMatrix"&&v.instanceMatrix&&(Se=v.instanceMatrix),G==="instanceColor"&&v.instanceColor&&(Se=v.instanceColor)),ge===void 0||ge.attribute!==Se||Se&&ge.data!==Se.data)return!0;k++}return r.attributesNum!==k||r.index!==U}function g(v,R,F,U){let V={},X=R.attributes,k=0,Q=F.getAttributes();for(let G in Q)if(Q[G].location>=0){let ge=X[G];ge===void 0&&(G==="instanceMatrix"&&v.instanceMatrix&&(ge=v.instanceMatrix),G==="instanceColor"&&v.instanceColor&&(ge=v.instanceColor));let Se={};Se.attribute=ge,ge&&ge.data&&(Se.data=ge.data),V[G]=Se,k++}r.attributes=V,r.attributesNum=k,r.index=U}function _(){let v=r.newAttributes;for(let R=0,F=v.length;R<F;R++)v[R]=0}function m(v){f(v,0)}function f(v,R){let F=r.newAttributes,U=r.enabledAttributes,V=r.attributeDivisors;F[v]=1,U[v]===0&&(n.enableVertexAttribArray(v),U[v]=1),V[v]!==R&&(n.vertexAttribDivisor(v,R),V[v]=R)}function T(){let v=r.newAttributes,R=r.enabledAttributes;for(let F=0,U=R.length;F<U;F++)R[F]!==v[F]&&(n.disableVertexAttribArray(F),R[F]=0)}function S(v,R,F,U,V,X,k){k===!0?n.vertexAttribIPointer(v,R,F,V,X):n.vertexAttribPointer(v,R,F,U,V,X)}function b(v,R,F,U){_();let V=U.attributes,X=F.getAttributes(),k=R.defaultAttributeValues;for(let Q in X){let G=X[Q];if(G.location>=0){let ce=V[Q];if(ce===void 0&&(Q==="instanceMatrix"&&v.instanceMatrix&&(ce=v.instanceMatrix),Q==="instanceColor"&&v.instanceColor&&(ce=v.instanceColor)),ce!==void 0){let ge=ce.normalized,Se=ce.itemSize,ze=e.get(ce);if(ze===void 0)continue;let nt=ze.buffer,$=ze.type,ne=ze.bytesPerElement,Me=$===n.INT||$===n.UNSIGNED_INT||ce.gpuType===yl;if(ce.isInterleavedBufferAttribute){let ae=ce.data,Ie=ae.stride,Ue=ce.offset;if(ae.isInstancedInterleavedBuffer){for(let Ne=0;Ne<G.locationSize;Ne++)f(G.location+Ne,ae.meshPerAttribute);v.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Ne=0;Ne<G.locationSize;Ne++)m(G.location+Ne);n.bindBuffer(n.ARRAY_BUFFER,nt);for(let Ne=0;Ne<G.locationSize;Ne++)S(G.location+Ne,Se/G.locationSize,$,ge,Ie*ne,(Ue+Se/G.locationSize*Ne)*ne,Me)}else{if(ce.isInstancedBufferAttribute){for(let ae=0;ae<G.locationSize;ae++)f(G.location+ae,ce.meshPerAttribute);v.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ae=0;ae<G.locationSize;ae++)m(G.location+ae);n.bindBuffer(n.ARRAY_BUFFER,nt);for(let ae=0;ae<G.locationSize;ae++)S(G.location+ae,Se/G.locationSize,$,ge,Se*ne,Se/G.locationSize*ae*ne,Me)}}else if(k!==void 0){let ge=k[Q];if(ge!==void 0)switch(ge.length){case 2:n.vertexAttrib2fv(G.location,ge);break;case 3:n.vertexAttrib3fv(G.location,ge);break;case 4:n.vertexAttrib4fv(G.location,ge);break;default:n.vertexAttrib1fv(G.location,ge)}}}}T()}function N(){E();for(let v in i){let R=i[v];for(let F in R){let U=R[F];for(let V in U)d(U[V].object),delete U[V];delete R[F]}delete i[v]}}function w(v){if(i[v.id]===void 0)return;let R=i[v.id];for(let F in R){let U=R[F];for(let V in U)d(U[V].object),delete U[V];delete R[F]}delete i[v.id]}function I(v){for(let R in i){let F=i[R];if(F[v.id]===void 0)continue;let U=F[v.id];for(let V in U)d(U[V].object),delete U[V];delete F[v.id]}}function E(){y(),a=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:y,dispose:N,releaseStatesOfGeometry:w,releaseStatesOfProgram:I,initAttributes:_,enableAttribute:m,disableUnusedAttributes:T}}function Qm(n,e,t){let i;function s(c){i=c}function r(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function a(c,d,h){h!==0&&(n.drawArraysInstanced(i,c,d,h),t.update(d,i,h))}function o(c,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,h);let p=0;for(let g=0;g<h;g++)p+=d[g];t.update(p,i,1)}function l(c,d,h,u){if(h===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],d[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,d,0,u,0,h);let g=0;for(let _=0;_<h;_++)g+=d[_]*u[_];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function eg(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let I=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==mn&&i.convert(I)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){let E=I===ks&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==Fn&&i.convert(I)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==On&&!E)}function l(I){if(I==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);let h=t.logarithmicDepthBuffer===!0,u=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),T=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),b=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),N=g>0,w=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:T,maxVaryings:S,maxFragmentUniforms:b,vertexTextures:N,maxSamples:w}}function tg(n){let e=this,t=null,i=0,s=!1,r=!1,a=new fn,o=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){let p=h.length!==0||u||i!==0||s;return s=u,i=h.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,u){t=d(h,u,0)},this.setState=function(h,u,p){let g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,f=n.get(h);if(!s||g===null||g.length===0||r&&!m)r?d(null):c();else{let T=r?0:i,S=T*4,b=f.clippingState||null;l.value=b,b=d(g,u,S,p);for(let N=0;N!==S;++N)b[N]=t[N];f.clippingState=b,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(h,u,p,g){let _=h!==null?h.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let f=p+_*4,T=u.matrixWorldInverse;o.getNormalMatrix(T),(m===null||m.length<f)&&(m=new Float32Array(f));for(let S=0,b=p;S!==_;++S,b+=4)a.copy(h[S]).applyMatrix4(T,o),a.normal.toArray(m,b),m[b+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function ng(n){let e=new WeakMap;function t(a,o){return o===ao?a.mapping=Qi:o===oo&&(a.mapping=es),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===ao||o===oo)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new Ho(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}function ig(n){let e=[],t=[],i=[],s=n,r=n-qi+1+Lc.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let l=1/o;a>n-qi?l=Lc[a-n+qi-1]:a===0&&(l=0),i.push(l);let c=1/(o-2),d=-c,h=1+c,u=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,g=6,_=3,m=2,f=1,T=new Float32Array(_*g*p),S=new Float32Array(m*g*p),b=new Float32Array(f*g*p);for(let w=0;w<p;w++){let I=w%3*2/3-1,E=w>2?0:-1,y=[I,E,0,I+2/3,E,0,I+2/3,E+1,0,I,E,0,I+2/3,E+1,0,I,E+1,0];T.set(y,_*g*w),S.set(u,m*g*w);let v=[w,w,w,w,w,w];b.set(v,f*g*w)}let N=new kt;N.setAttribute("position",new $t(T,_)),N.setAttribute("uv",new $t(S,m)),N.setAttribute("faceIndex",new $t(b,f)),e.push(N),s>qi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Uc(n,e,t){let i=new zn(n,e,t);return i.texture.mapping=aa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function pr(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function sg(n,e,t){let i=new Float32Array(mi),s=new C(0,1,0);return new Mn({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Tl(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Bc(){return new Mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tl(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Fc(){return new Mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Tl(){return`

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
	`}function rg(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){let l=o.mapping,c=l===ao||l===oo,d=l===Qi||l===es;if(c||d){let h=e.get(o),u=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new Fr(n)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{let p=o.image;return c&&p&&p.height>0||d&&p&&s(p)?(t===null&&(t=new Fr(n)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let l=0,c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function ag(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&bs("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function og(n,e,t,i){let s={},r=new WeakMap;function a(h){let u=h.target;u.index!==null&&e.remove(u.index);for(let g in u.attributes)e.remove(u.attributes[g]);for(let g in u.morphAttributes){let _=u.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)e.remove(_[m])}u.removeEventListener("dispose",a),delete s[u.id];let p=r.get(u);p&&(e.remove(p),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(h,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(h){let u=h.attributes;for(let g in u)e.update(u[g],n.ARRAY_BUFFER);let p=h.morphAttributes;for(let g in p){let _=p[g];for(let m=0,f=_.length;m<f;m++)e.update(_[m],n.ARRAY_BUFFER)}}function c(h){let u=[],p=h.index,g=h.attributes.position,_=0;if(p!==null){let T=p.array;_=p.version;for(let S=0,b=T.length;S<b;S+=3){let N=T[S+0],w=T[S+1],I=T[S+2];u.push(N,w,w,I,I,N)}}else if(g!==void 0){let T=g.array;_=g.version;for(let S=0,b=T.length/3-1;S<b;S+=3){let N=S+0,w=S+1,I=S+2;u.push(N,w,w,I,I,N)}}else return;let m=new(Pd(u)?Or:Nr)(u,1);m.version=_;let f=r.get(h);f&&e.remove(f),r.set(h,m)}function d(h){let u=r.get(h);if(u){let p=h.index;p!==null&&u.version<p.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:d}}function lg(n,e,t){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,p){n.drawElements(i,p,r,u*a),t.update(p,i,1)}function c(u,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,u*a,g),t.update(p,i,g))}function d(u,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,u,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,i,1)}function h(u,p,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)c(u[f]/a,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,u,0,_,0,g);let f=0;for(let T=0;T<g;T++)f+=p[T]*_[T];t.update(f,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function cg(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function dg(n,e,t){let i=new WeakMap,s=new bt;function r(a,o,l){let c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0,u=i.get(o);if(u===void 0||u.count!==h){let y=function(){I.dispose(),i.delete(o),o.removeEventListener("dispose",y)};u!==void 0&&u.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],T=o.morphAttributes.color||[],S=0;p===!0&&(S=1),g===!0&&(S=2),_===!0&&(S=3);let b=o.attributes.position.count*S,N=1;b>e.maxTextureSize&&(N=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let w=new Float32Array(b*N*4*h),I=new Ir(w,b,N,h);I.type=On,I.needsUpdate=!0;let E=S*4;for(let v=0;v<h;v++){let R=m[v],F=f[v],U=T[v],V=b*N*4*v;for(let X=0;X<R.count;X++){let k=X*E;p===!0&&(s.fromBufferAttribute(R,X),w[V+k+0]=s.x,w[V+k+1]=s.y,w[V+k+2]=s.z,w[V+k+3]=0),g===!0&&(s.fromBufferAttribute(F,X),w[V+k+4]=s.x,w[V+k+5]=s.y,w[V+k+6]=s.z,w[V+k+7]=0),_===!0&&(s.fromBufferAttribute(U,X),w[V+k+8]=s.x,w[V+k+9]=s.y,w[V+k+10]=s.z,w[V+k+11]=U.itemSize===4?s.w:1)}}u={count:h,texture:I,size:new se(b,N)},i.set(o,u),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];let g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:r}}function hg(n,e,t,i){let s=new WeakMap;function r(l){let c=i.render.frame,d=l.geometry,h=e.get(l,d);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return h}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}function us(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=zc[s];if(r===void 0&&(r=new Float32Array(s),zc[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Et(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function At(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function la(n,e){let t=Hc[e];t===void 0&&(t=new Int32Array(e),Hc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function ug(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function fg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2fv(this.addr,e),At(t,e)}}function pg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;n.uniform3fv(this.addr,e),At(t,e)}}function mg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4fv(this.addr,e),At(t,e)}}function gg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(Et(t,i))return;Wc.set(i),n.uniformMatrix2fv(this.addr,!1,Wc),At(t,i)}}function _g(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(Et(t,i))return;Gc.set(i),n.uniformMatrix3fv(this.addr,!1,Gc),At(t,i)}}function vg(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(Et(t,i))return;kc.set(i),n.uniformMatrix4fv(this.addr,!1,kc),At(t,i)}}function yg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function xg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2iv(this.addr,e),At(t,e)}}function bg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;n.uniform3iv(this.addr,e),At(t,e)}}function Sg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4iv(this.addr,e),At(t,e)}}function Mg(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Eg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;n.uniform2uiv(this.addr,e),At(t,e)}}function Ag(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;n.uniform3uiv(this.addr,e),At(t,e)}}function Tg(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;n.uniform4uiv(this.addr,e),At(t,e)}}function wg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Vc.compareFunction=Cd,r=Vc):r=Nd,t.setTexture2D(e||r,s)}function Cg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Ud,s)}function Rg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Bd,s)}function Pg(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Od,s)}function Ig(n){switch(n){case 5126:return ug;case 35664:return fg;case 35665:return pg;case 35666:return mg;case 35674:return gg;case 35675:return _g;case 35676:return vg;case 5124:case 35670:return yg;case 35667:case 35671:return xg;case 35668:case 35672:return bg;case 35669:case 35673:return Sg;case 5125:return Mg;case 36294:return Eg;case 36295:return Ag;case 36296:return Tg;case 35678:case 36198:case 36298:case 36306:case 35682:return wg;case 35679:case 36299:case 36307:return Cg;case 35680:case 36300:case 36308:case 36293:return Rg;case 36289:case 36303:case 36311:case 36292:return Pg}}function Dg(n,e){n.uniform1fv(this.addr,e)}function Lg(n,e){let t=us(e,this.size,2);n.uniform2fv(this.addr,t)}function Ng(n,e){let t=us(e,this.size,3);n.uniform3fv(this.addr,t)}function Og(n,e){let t=us(e,this.size,4);n.uniform4fv(this.addr,t)}function Ug(n,e){let t=us(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Bg(n,e){let t=us(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Fg(n,e){let t=us(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Vg(n,e){n.uniform1iv(this.addr,e)}function zg(n,e){n.uniform2iv(this.addr,e)}function Hg(n,e){n.uniform3iv(this.addr,e)}function kg(n,e){n.uniform4iv(this.addr,e)}function Gg(n,e){n.uniform1uiv(this.addr,e)}function Wg(n,e){n.uniform2uiv(this.addr,e)}function Xg(n,e){n.uniform3uiv(this.addr,e)}function qg(n,e){n.uniform4uiv(this.addr,e)}function jg(n,e,t){let i=this.cache,s=e.length,r=la(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Nd,r[a])}function $g(n,e,t){let i=this.cache,s=e.length,r=la(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Ud,r[a])}function Yg(n,e,t){let i=this.cache,s=e.length,r=la(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Bd,r[a])}function Zg(n,e,t){let i=this.cache,s=e.length,r=la(t,s);Et(i,r)||(n.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Od,r[a])}function Jg(n){switch(n){case 5126:return Dg;case 35664:return Lg;case 35665:return Ng;case 35666:return Og;case 35674:return Ug;case 35675:return Bg;case 35676:return Fg;case 5124:case 35670:return Vg;case 35667:case 35671:return zg;case 35668:case 35672:return Hg;case 35669:case 35673:return kg;case 5125:return Gg;case 36294:return Wg;case 36295:return Xg;case 36296:return qg;case 35678:case 36198:case 36298:case 36306:case 35682:return jg;case 35679:case 36299:case 36307:return $g;case 35680:case 36300:case 36308:case 36293:return Yg;case 36289:case 36303:case 36311:case 36292:return Zg}}function Xc(n,e){n.seq.push(e),n.map[e.id]=e}function Kg(n,e,t){let i=n.name,s=i.length;for(Xa.lastIndex=0;;){let r=Xa.exec(i),a=Xa.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Xc(t,c===void 0?new ko(o,n,e):new Go(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new Wo(o),Xc(t,h)),t=h}}}function qc(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}function t0(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}function n0(n){Ke._getMatrix(jc,Ke.workingColorSpace,n);let e=`mat3( ${jc.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(n)){case oa:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function $c(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+t0(n.getShaderSource(e),a)}else return s}function i0(n,e){let t=n0(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function s0(n,e){let t;switch(e){case pu:t="Linear";break;case mu:t="Reinhard";break;case gu:t="Cineon";break;case vl:t="ACESFilmic";break;case vu:t="AgX";break;case yu:t="Neutral";break;case _u:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function r0(){Ke.getLuminanceCoefficients(mr);let n=mr.x.toFixed(4),e=mr.y.toFixed(4),t=mr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function a0(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function o0(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function l0(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Ss(n){return n!==""}function Yc(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Zc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function Xo(n){return n.replace(c0,h0)}function h0(n,e){let t=qe[e];if(t===void 0){let i=d0.get(e);if(i!==void 0)t=qe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Xo(t)}function Jc(n){return n.replace(u0,f0)}function f0(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Kc(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function p0(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===pd?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===_l?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Nn&&(e="SHADOWMAP_TYPE_VSM"),e}function m0(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Qi:case es:e="ENVMAP_TYPE_CUBE";break;case aa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function g0(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===es&&(e="ENVMAP_MODE_REFRACTION"),e}function _0(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case md:e="ENVMAP_BLENDING_MULTIPLY";break;case uu:e="ENVMAP_BLENDING_MIX";break;case fu:e="ENVMAP_BLENDING_ADD";break}return e}function v0(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function y0(n,e,t,i){let s=n.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=p0(t),c=m0(t),d=g0(t),h=_0(t),u=v0(t),p=a0(t),g=o0(r),_=s.createProgram(),m,f,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),f.length>0&&(f+=`
`)):(m=[Kc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),f=[Kc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qn?"#define TONE_MAPPING":"",t.toneMapping!==Qn?qe.tonemapping_pars_fragment:"",t.toneMapping!==Qn?s0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,i0("linearToOutputTexel",t.outputColorSpace),r0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ss).join(`
`)),a=Xo(a),a=Yc(a,t),a=Zc(a,t),o=Xo(o),o=Yc(o,t),o=Zc(o,t),a=Jc(a),o=Jc(o),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===hc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===hc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let S=T+m+a,b=T+f+o,N=qc(s,s.VERTEX_SHADER,S),w=qc(s,s.FRAGMENT_SHADER,b);s.attachShader(_,N),s.attachShader(_,w),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function I(R){if(n.debug.checkShaderErrors){let F=s.getProgramInfoLog(_).trim(),U=s.getShaderInfoLog(N).trim(),V=s.getShaderInfoLog(w).trim(),X=!0,k=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,N,w);else{let Q=$c(s,N,"vertex"),G=$c(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+F+`
`+Q+`
`+G)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(U===""||V==="")&&(k=!1);k&&(R.diagnostics={runnable:X,programLog:F,vertexShader:{log:U,prefix:m},fragmentShader:{log:V,prefix:f}})}s.deleteShader(N),s.deleteShader(w),E=new Ji(s,_),y=l0(s,_)}let E;this.getUniforms=function(){return E===void 0&&I(this),E};let y;this.getAttributes=function(){return y===void 0&&I(this),y};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,Qg)),v},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=e0++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=N,this.fragmentShader=w,this}function b0(n,e,t,i,s,r,a){let o=new Dr,l=new qo,c=new Set,d=[],h=s.logarithmicDepthBuffer,u=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,v,R,F,U){let V=F.fog,X=U.geometry,k=y.isMeshStandardMaterial?F.environment:null,Q=(y.isMeshStandardMaterial?t:e).get(y.envMap||k),G=Q&&Q.mapping===aa?Q.image.height:null,ce=g[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));let ge=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Se=ge!==void 0?ge.length:0,ze=0;X.morphAttributes.position!==void 0&&(ze=1),X.morphAttributes.normal!==void 0&&(ze=2),X.morphAttributes.color!==void 0&&(ze=3);let nt,$,ne,Me;if(ce){let ot=xn[ce];nt=ot.vertexShader,$=ot.fragmentShader}else nt=y.vertexShader,$=y.fragmentShader,l.update(y),ne=l.getVertexShaderID(y),Me=l.getFragmentShaderID(y);let ae=n.getRenderTarget(),Ie=n.state.buffers.depth.getReversed(),Ue=U.isInstancedMesh===!0,Ne=U.isBatchedMesh===!0,Je=!!y.map,Z=!!y.matcap,te=!!Q,P=!!y.aoMap,Ce=!!y.lightMap,K=!!y.bumpMap,ye=!!y.normalMap,le=!!y.displacementMap,De=!!y.emissiveMap,_e=!!y.metalnessMap,A=!!y.roughnessMap,x=y.anisotropy>0,B=y.clearcoat>0,q=y.dispersion>0,J=y.iridescence>0,j=y.sheen>0,Ee=y.transmission>0,he=x&&!!y.anisotropyMap,ve=B&&!!y.clearcoatMap,Ye=B&&!!y.clearcoatNormalMap,ee=B&&!!y.clearcoatRoughnessMap,xe=J&&!!y.iridescenceMap,Le=J&&!!y.iridescenceThicknessMap,Oe=j&&!!y.sheenColorMap,be=j&&!!y.sheenRoughnessMap,Ze=!!y.specularMap,Xe=!!y.specularColorMap,ut=!!y.specularIntensityMap,D=Ee&&!!y.transmissionMap,ue=Ee&&!!y.thicknessMap,W=!!y.gradientMap,Y=!!y.alphaMap,me=y.alphaTest>0,fe=!!y.alphaHash,ke=!!y.extensions,xt=Qn;y.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(xt=n.toneMapping);let Rt={shaderID:ce,shaderType:y.type,shaderName:y.name,vertexShader:nt,fragmentShader:$,defines:y.defines,customVertexShaderID:ne,customFragmentShaderID:Me,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Ne,batchingColor:Ne&&U._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&U.instanceColor!==null,instancingMorph:Ue&&U.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:ae===null?n.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:hs,alphaToCoverage:!!y.alphaToCoverage,map:Je,matcap:Z,envMap:te,envMapMode:te&&Q.mapping,envMapCubeUVHeight:G,aoMap:P,lightMap:Ce,bumpMap:K,normalMap:ye,displacementMap:u&&le,emissiveMap:De,normalMapObjectSpace:ye&&y.normalMapType===Mu,normalMapTangentSpace:ye&&y.normalMapType===wd,metalnessMap:_e,roughnessMap:A,anisotropy:x,anisotropyMap:he,clearcoat:B,clearcoatMap:ve,clearcoatNormalMap:Ye,clearcoatRoughnessMap:ee,dispersion:q,iridescence:J,iridescenceMap:xe,iridescenceThicknessMap:Le,sheen:j,sheenColorMap:Oe,sheenRoughnessMap:be,specularMap:Ze,specularColorMap:Xe,specularIntensityMap:ut,transmission:Ee,transmissionMap:D,thicknessMap:ue,gradientMap:W,opaque:y.transparent===!1&&y.blending===$i&&y.alphaToCoverage===!1,alphaMap:Y,alphaTest:me,alphaHash:fe,combine:y.combine,mapUv:Je&&_(y.map.channel),aoMapUv:P&&_(y.aoMap.channel),lightMapUv:Ce&&_(y.lightMap.channel),bumpMapUv:K&&_(y.bumpMap.channel),normalMapUv:ye&&_(y.normalMap.channel),displacementMapUv:le&&_(y.displacementMap.channel),emissiveMapUv:De&&_(y.emissiveMap.channel),metalnessMapUv:_e&&_(y.metalnessMap.channel),roughnessMapUv:A&&_(y.roughnessMap.channel),anisotropyMapUv:he&&_(y.anisotropyMap.channel),clearcoatMapUv:ve&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:Ye&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:Le&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:be&&_(y.sheenRoughnessMap.channel),specularMapUv:Ze&&_(y.specularMap.channel),specularColorMapUv:Xe&&_(y.specularColorMap.channel),specularIntensityMapUv:ut&&_(y.specularIntensityMap.channel),transmissionMapUv:D&&_(y.transmissionMap.channel),thicknessMapUv:ue&&_(y.thicknessMap.channel),alphaMapUv:Y&&_(y.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(ye||x),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!X.attributes.uv&&(Je||Y),fog:!!V,useFog:y.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Ie,skinning:U.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:Se,morphTextureStride:ze,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:xt,decodeVideoTexture:Je&&y.map.isVideoTexture===!0&&Ke.getTransfer(y.map.colorSpace)===lt,decodeVideoTextureEmissive:De&&y.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(y.emissiveMap.colorSpace)===lt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===pn,flipSided:y.side===Ht,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:ke&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&y.extensions.multiDraw===!0||Ne)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Rt.vertexUv1s=c.has(1),Rt.vertexUv2s=c.has(2),Rt.vertexUv3s=c.has(3),c.clear(),Rt}function f(y){let v=[];if(y.shaderID?v.push(y.shaderID):(v.push(y.customVertexShaderID),v.push(y.customFragmentShaderID)),y.defines!==void 0)for(let R in y.defines)v.push(R),v.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(T(v,y),S(v,y),v.push(n.outputColorSpace)),v.push(y.customProgramCacheKey),v.join()}function T(y,v){y.push(v.precision),y.push(v.outputColorSpace),y.push(v.envMapMode),y.push(v.envMapCubeUVHeight),y.push(v.mapUv),y.push(v.alphaMapUv),y.push(v.lightMapUv),y.push(v.aoMapUv),y.push(v.bumpMapUv),y.push(v.normalMapUv),y.push(v.displacementMapUv),y.push(v.emissiveMapUv),y.push(v.metalnessMapUv),y.push(v.roughnessMapUv),y.push(v.anisotropyMapUv),y.push(v.clearcoatMapUv),y.push(v.clearcoatNormalMapUv),y.push(v.clearcoatRoughnessMapUv),y.push(v.iridescenceMapUv),y.push(v.iridescenceThicknessMapUv),y.push(v.sheenColorMapUv),y.push(v.sheenRoughnessMapUv),y.push(v.specularMapUv),y.push(v.specularColorMapUv),y.push(v.specularIntensityMapUv),y.push(v.transmissionMapUv),y.push(v.thicknessMapUv),y.push(v.combine),y.push(v.fogExp2),y.push(v.sizeAttenuation),y.push(v.morphTargetsCount),y.push(v.morphAttributeCount),y.push(v.numDirLights),y.push(v.numPointLights),y.push(v.numSpotLights),y.push(v.numSpotLightMaps),y.push(v.numHemiLights),y.push(v.numRectAreaLights),y.push(v.numDirLightShadows),y.push(v.numPointLightShadows),y.push(v.numSpotLightShadows),y.push(v.numSpotLightShadowsWithMaps),y.push(v.numLightProbes),y.push(v.shadowMapType),y.push(v.toneMapping),y.push(v.numClippingPlanes),y.push(v.numClipIntersection),y.push(v.depthPacking)}function S(y,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reverseDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),y.push(o.mask)}function b(y){let v=g[y.type],R;if(v){let F=xn[v];R=hf.clone(F.uniforms)}else R=y.uniforms;return R}function N(y,v){let R;for(let F=0,U=d.length;F<U;F++){let V=d[F];if(V.cacheKey===v){R=V,++R.usedTimes;break}}return R===void 0&&(R=new y0(n,v,y,r),d.push(R)),R}function w(y){if(--y.usedTimes===0){let v=d.indexOf(y);d[v]=d[d.length-1],d.pop(),y.destroy()}}function I(y){l.remove(y)}function E(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:b,acquireProgram:N,releaseProgram:w,releaseShaderCache:I,programs:d,dispose:E}}function S0(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function M0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Qc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ed(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(h,u,p,g,_,m){let f=n[e];return f===void 0?(f={id:h.id,object:h,geometry:u,material:p,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},n[e]=f):(f.id=h.id,f.object=h,f.geometry=u,f.material=p,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=_,f.group=m),e++,f}function o(h,u,p,g,_,m){let f=a(h,u,p,g,_,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(h,u,p,g,_,m){let f=a(h,u,p,g,_,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(h,u){t.length>1&&t.sort(h||M0),i.length>1&&i.sort(u||Qc),s.length>1&&s.sort(u||Qc)}function d(){for(let h=e,u=n.length;h<u;h++){let p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:d,sort:c}}function E0(){let n=new WeakMap;function e(i,s){let r=n.get(i),a;return r===void 0?(a=new ed,n.set(i,[a])):s>=r.length?(a=new ed,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function A0(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new je};break;case"SpotLight":t={position:new C,direction:new C,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new C,halfWidth:new C,halfHeight:new C};break}return n[e.id]=t,t}}}function T0(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}function C0(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function R0(n){let e=new A0,t=T0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new C);let s=new C,r=new yt,a=new yt;function o(c){let d=0,h=0,u=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,T=0,S=0,b=0,N=0,w=0,I=0;c.sort(C0);for(let y=0,v=c.length;y<v;y++){let R=c[y],F=R.color,U=R.intensity,V=R.distance,X=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=F.r*U,h+=F.g*U,u+=F.b*U;else if(R.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(R.sh.coefficients[k],U);I++}else if(R.isDirectionalLight){let k=e.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let Q=R.shadow,G=t.get(R);G.shadowIntensity=Q.intensity,G.shadowBias=Q.bias,G.shadowNormalBias=Q.normalBias,G.shadowRadius=Q.radius,G.shadowMapSize=Q.mapSize,i.directionalShadow[p]=G,i.directionalShadowMap[p]=X,i.directionalShadowMatrix[p]=R.shadow.matrix,T++}i.directional[p]=k,p++}else if(R.isSpotLight){let k=e.get(R);k.position.setFromMatrixPosition(R.matrixWorld),k.color.copy(F).multiplyScalar(U),k.distance=V,k.coneCos=Math.cos(R.angle),k.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),k.decay=R.decay,i.spot[_]=k;let Q=R.shadow;if(R.map&&(i.spotLightMap[N]=R.map,N++,Q.updateMatrices(R),R.castShadow&&w++),i.spotLightMatrix[_]=Q.matrix,R.castShadow){let G=t.get(R);G.shadowIntensity=Q.intensity,G.shadowBias=Q.bias,G.shadowNormalBias=Q.normalBias,G.shadowRadius=Q.radius,G.shadowMapSize=Q.mapSize,i.spotShadow[_]=G,i.spotShadowMap[_]=X,b++}_++}else if(R.isRectAreaLight){let k=e.get(R);k.color.copy(F).multiplyScalar(U),k.halfWidth.set(R.width*.5,0,0),k.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=k,m++}else if(R.isPointLight){let k=e.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),k.distance=R.distance,k.decay=R.decay,R.castShadow){let Q=R.shadow,G=t.get(R);G.shadowIntensity=Q.intensity,G.shadowBias=Q.bias,G.shadowNormalBias=Q.normalBias,G.shadowRadius=Q.radius,G.shadowMapSize=Q.mapSize,G.shadowCameraNear=Q.camera.near,G.shadowCameraFar=Q.camera.far,i.pointShadow[g]=G,i.pointShadowMap[g]=X,i.pointShadowMatrix[g]=R.shadow.matrix,S++}i.point[g]=k,g++}else if(R.isHemisphereLight){let k=e.get(R);k.skyColor.copy(R.color).multiplyScalar(U),k.groundColor.copy(R.groundColor).multiplyScalar(U),i.hemi[f]=k,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2):(i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=h,i.ambient[2]=u;let E=i.hash;(E.directionalLength!==p||E.pointLength!==g||E.spotLength!==_||E.rectAreaLength!==m||E.hemiLength!==f||E.numDirectionalShadows!==T||E.numPointShadows!==S||E.numSpotShadows!==b||E.numSpotMaps!==N||E.numLightProbes!==I)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=T,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=b+N-w,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=I,E.directionalLength=p,E.pointLength=g,E.spotLength=_,E.rectAreaLength=m,E.hemiLength=f,E.numDirectionalShadows=T,E.numPointShadows=S,E.numSpotShadows=b,E.numSpotMaps=N,E.numLightProbes=I,i.version=w0++)}function l(c,d){let h=0,u=0,p=0,g=0,_=0,m=d.matrixWorldInverse;for(let f=0,T=c.length;f<T;f++){let S=c[f];if(S.isDirectionalLight){let b=i.directional[h];b.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),h++}else if(S.isSpotLight){let b=i.spot[p];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),p++}else if(S.isRectAreaLight){let b=i.rectArea[g];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(m),a.identity(),r.copy(S.matrixWorld),r.premultiply(m),a.extractRotation(r),b.halfWidth.set(S.width*.5,0,0),b.halfHeight.set(0,S.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){let b=i.point[u];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(m),u++}else if(S.isHemisphereLight){let b=i.hemi[_];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:i}}function td(n){let e=new R0(n),t=[],i=[];function s(d){c.camera=d,t.length=0,i.length=0}function r(d){t.push(d)}function a(d){i.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}let c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function P0(n){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new td(n),e.set(s,[o])):r>=a.length?(o=new td(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}function L0(n,e,t){let i=new Ds,s=new se,r=new se,a=new bt,o=new $o({depthPacking:Su}),l=new Yo,c={},d=t.maxTextureSize,h={[ei]:Ht,[Ht]:ei,[pn]:pn},u=new Mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new se},radius:{value:4}},vertexShader:I0,fragmentShader:D0}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let g=new kt;g.setAttribute("position",new $t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new He(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pd;let f=this.type;this.render=function(w,I,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let y=n.getRenderTarget(),v=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Kn),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let U=f!==Nn&&this.type===Nn,V=f===Nn&&this.type!==Nn;for(let X=0,k=w.length;X<k;X++){let Q=w[X],G=Q.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let ce=G.getFrameExtents();if(s.multiply(ce),r.copy(G.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/ce.x),s.x=r.x*ce.x,G.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/ce.y),s.y=r.y*ce.y,G.mapSize.y=r.y)),G.map===null||U===!0||V===!0){let Se=this.type!==Nn?{minFilter:gn,magFilter:gn}:{};G.map!==null&&G.map.dispose(),G.map=new zn(s.x,s.y,Se),G.map.texture.name=Q.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();let ge=G.getViewportCount();for(let Se=0;Se<ge;Se++){let ze=G.getViewport(Se);a.set(r.x*ze.x,r.y*ze.y,r.x*ze.z,r.y*ze.w),F.viewport(a),G.updateMatrices(Q,Se),i=G.getFrustum(),b(I,E,G.camera,Q,this.type)}G.isPointLightShadow!==!0&&this.type===Nn&&T(G,E),G.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(y,v,R)};function T(w,I){let E=e.update(_);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new zn(s.x,s.y)),u.uniforms.shadow_pass.value=w.map.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(I,null,E,u,_,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(I,null,E,p,_,null)}function S(w,I,E,y){let v=null,R=E.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)v=R;else if(v=E.isPointLight===!0?l:o,n.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0){let F=v.uuid,U=I.uuid,V=c[F];V===void 0&&(V={},c[F]=V);let X=V[U];X===void 0&&(X=v.clone(),V[U]=X,I.addEventListener("dispose",N)),v=X}if(v.visible=I.visible,v.wireframe=I.wireframe,y===Nn?v.side=I.shadowSide!==null?I.shadowSide:I.side:v.side=I.shadowSide!==null?I.shadowSide:h[I.side],v.alphaMap=I.alphaMap,v.alphaTest=I.alphaTest,v.map=I.map,v.clipShadows=I.clipShadows,v.clippingPlanes=I.clippingPlanes,v.clipIntersection=I.clipIntersection,v.displacementMap=I.displacementMap,v.displacementScale=I.displacementScale,v.displacementBias=I.displacementBias,v.wireframeLinewidth=I.wireframeLinewidth,v.linewidth=I.linewidth,E.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let F=n.properties.get(v);F.light=E}return v}function b(w,I,E,y,v){if(w.visible===!1)return;if(w.layers.test(I.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&v===Nn)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,w.matrixWorld);let U=e.update(w),V=w.material;if(Array.isArray(V)){let X=U.groups;for(let k=0,Q=X.length;k<Q;k++){let G=X[k],ce=V[G.materialIndex];if(ce&&ce.visible){let ge=S(w,ce,y,v);w.onBeforeShadow(n,w,I,E,U,ge,G),n.renderBufferDirect(E,null,U,ge,w,G),w.onAfterShadow(n,w,I,E,U,ge,G)}}}else if(V.visible){let X=S(w,V,y,v);w.onBeforeShadow(n,w,I,E,U,X,null),n.renderBufferDirect(E,null,U,X,w,null),w.onAfterShadow(n,w,I,E,U,X,null)}}let F=w.children;for(let U=0,V=F.length;U<V;U++)b(F[U],I,E,y,v)}function N(w){w.target.removeEventListener("dispose",N);for(let E in c){let y=c[E],v=w.target.uuid;v in y&&(y[v].dispose(),delete y[v])}}}function O0(n,e){function t(){let D=!1,ue=new bt,W=null,Y=new bt(0,0,0,0);return{setMask:function(me){W!==me&&!D&&(n.colorMask(me,me,me,me),W=me)},setLocked:function(me){D=me},setClear:function(me,fe,ke,xt,Rt){Rt===!0&&(me*=xt,fe*=xt,ke*=xt),ue.set(me,fe,ke,xt),Y.equals(ue)===!1&&(n.clearColor(me,fe,ke,xt),Y.copy(ue))},reset:function(){D=!1,W=null,Y.set(-1,0,0,0)}}}function i(){let D=!1,ue=!1,W=null,Y=null,me=null;return{setReversed:function(fe){if(ue!==fe){let ke=e.get("EXT_clip_control");ue?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT);let xt=me;me=null,this.setClear(xt)}ue=fe},getReversed:function(){return ue},setTest:function(fe){fe?ae(n.DEPTH_TEST):Ie(n.DEPTH_TEST)},setMask:function(fe){W!==fe&&!D&&(n.depthMask(fe),W=fe)},setFunc:function(fe){if(ue&&(fe=N0[fe]),Y!==fe){switch(fe){case Qa:n.depthFunc(n.NEVER);break;case eo:n.depthFunc(n.ALWAYS);break;case to:n.depthFunc(n.LESS);break;case Ki:n.depthFunc(n.LEQUAL);break;case no:n.depthFunc(n.EQUAL);break;case io:n.depthFunc(n.GEQUAL);break;case so:n.depthFunc(n.GREATER);break;case ro:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Y=fe}},setLocked:function(fe){D=fe},setClear:function(fe){me!==fe&&(ue&&(fe=1-fe),n.clearDepth(fe),me=fe)},reset:function(){D=!1,W=null,Y=null,me=null,ue=!1}}}function s(){let D=!1,ue=null,W=null,Y=null,me=null,fe=null,ke=null,xt=null,Rt=null;return{setTest:function(ot){D||(ot?ae(n.STENCIL_TEST):Ie(n.STENCIL_TEST))},setMask:function(ot){ue!==ot&&!D&&(n.stencilMask(ot),ue=ot)},setFunc:function(ot,ln,wn){(W!==ot||Y!==ln||me!==wn)&&(n.stencilFunc(ot,ln,wn),W=ot,Y=ln,me=wn)},setOp:function(ot,ln,wn){(fe!==ot||ke!==ln||xt!==wn)&&(n.stencilOp(ot,ln,wn),fe=ot,ke=ln,xt=wn)},setLocked:function(ot){D=ot},setClear:function(ot){Rt!==ot&&(n.clearStencil(ot),Rt=ot)},reset:function(){D=!1,ue=null,W=null,Y=null,me=null,fe=null,ke=null,xt=null,Rt=null}}}let r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap,d={},h={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,T=null,S=null,b=null,N=null,w=null,I=new je(0,0,0),E=0,y=!1,v=null,R=null,F=null,U=null,V=null,X=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,Q=0,G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(G)[1]),k=Q>=1):G.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),k=Q>=2);let ce=null,ge={},Se=n.getParameter(n.SCISSOR_BOX),ze=n.getParameter(n.VIEWPORT),nt=new bt().fromArray(Se),$=new bt().fromArray(ze);function ne(D,ue,W,Y){let me=new Uint8Array(4),fe=n.createTexture();n.bindTexture(D,fe),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ke=0;ke<W;ke++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(ue,0,n.RGBA,1,1,Y,0,n.RGBA,n.UNSIGNED_BYTE,me):n.texImage2D(ue+ke,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,me);return fe}let Me={};Me[n.TEXTURE_2D]=ne(n.TEXTURE_2D,n.TEXTURE_2D,1),Me[n.TEXTURE_CUBE_MAP]=ne(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Me[n.TEXTURE_2D_ARRAY]=ne(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Me[n.TEXTURE_3D]=ne(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ae(n.DEPTH_TEST),a.setFunc(Ki),K(!1),ye(nc),ae(n.CULL_FACE),P(Kn);function ae(D){d[D]!==!0&&(n.enable(D),d[D]=!0)}function Ie(D){d[D]!==!1&&(n.disable(D),d[D]=!1)}function Ue(D,ue){return h[D]!==ue?(n.bindFramebuffer(D,ue),h[D]=ue,D===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ue),D===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ue),!0):!1}function Ne(D,ue){let W=p,Y=!1;if(D){W=u.get(ue),W===void 0&&(W=[],u.set(ue,W));let me=D.textures;if(W.length!==me.length||W[0]!==n.COLOR_ATTACHMENT0){for(let fe=0,ke=me.length;fe<ke;fe++)W[fe]=n.COLOR_ATTACHMENT0+fe;W.length=me.length,Y=!0}}else W[0]!==n.BACK&&(W[0]=n.BACK,Y=!0);Y&&n.drawBuffers(W)}function Je(D){return g!==D?(n.useProgram(D),g=D,!0):!1}let Z={[fi]:n.FUNC_ADD,[Yh]:n.FUNC_SUBTRACT,[Zh]:n.FUNC_REVERSE_SUBTRACT};Z[Jh]=n.MIN,Z[Kh]=n.MAX;let te={[Qh]:n.ZERO,[eu]:n.ONE,[tu]:n.SRC_COLOR,[Ja]:n.SRC_ALPHA,[ou]:n.SRC_ALPHA_SATURATE,[ru]:n.DST_COLOR,[iu]:n.DST_ALPHA,[nu]:n.ONE_MINUS_SRC_COLOR,[Ka]:n.ONE_MINUS_SRC_ALPHA,[au]:n.ONE_MINUS_DST_COLOR,[su]:n.ONE_MINUS_DST_ALPHA,[lu]:n.CONSTANT_COLOR,[cu]:n.ONE_MINUS_CONSTANT_COLOR,[du]:n.CONSTANT_ALPHA,[hu]:n.ONE_MINUS_CONSTANT_ALPHA};function P(D,ue,W,Y,me,fe,ke,xt,Rt,ot){if(D===Kn){_===!0&&(Ie(n.BLEND),_=!1);return}if(_===!1&&(ae(n.BLEND),_=!0),D!==$h){if(D!==m||ot!==y){if((f!==fi||b!==fi)&&(n.blendEquation(n.FUNC_ADD),f=fi,b=fi),ot)switch(D){case $i:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ic:n.blendFunc(n.ONE,n.ONE);break;case sc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case rc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case $i:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ic:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case sc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case rc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}T=null,S=null,N=null,w=null,I.set(0,0,0),E=0,m=D,y=ot}return}me=me||ue,fe=fe||W,ke=ke||Y,(ue!==f||me!==b)&&(n.blendEquationSeparate(Z[ue],Z[me]),f=ue,b=me),(W!==T||Y!==S||fe!==N||ke!==w)&&(n.blendFuncSeparate(te[W],te[Y],te[fe],te[ke]),T=W,S=Y,N=fe,w=ke),(xt.equals(I)===!1||Rt!==E)&&(n.blendColor(xt.r,xt.g,xt.b,Rt),I.copy(xt),E=Rt),m=D,y=!1}function Ce(D,ue){D.side===pn?Ie(n.CULL_FACE):ae(n.CULL_FACE);let W=D.side===Ht;ue&&(W=!W),K(W),D.blending===$i&&D.transparent===!1?P(Kn):P(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);let Y=D.stencilWrite;o.setTest(Y),Y&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),De(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ae(n.SAMPLE_ALPHA_TO_COVERAGE):Ie(n.SAMPLE_ALPHA_TO_COVERAGE)}function K(D){v!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),v=D)}function ye(D){D!==qh?(ae(n.CULL_FACE),D!==R&&(D===nc?n.cullFace(n.BACK):D===jh?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ie(n.CULL_FACE),R=D}function le(D){D!==F&&(k&&n.lineWidth(D),F=D)}function De(D,ue,W){D?(ae(n.POLYGON_OFFSET_FILL),(U!==ue||V!==W)&&(n.polygonOffset(ue,W),U=ue,V=W)):Ie(n.POLYGON_OFFSET_FILL)}function _e(D){D?ae(n.SCISSOR_TEST):Ie(n.SCISSOR_TEST)}function A(D){D===void 0&&(D=n.TEXTURE0+X-1),ce!==D&&(n.activeTexture(D),ce=D)}function x(D,ue,W){W===void 0&&(ce===null?W=n.TEXTURE0+X-1:W=ce);let Y=ge[W];Y===void 0&&(Y={type:void 0,texture:void 0},ge[W]=Y),(Y.type!==D||Y.texture!==ue)&&(ce!==W&&(n.activeTexture(W),ce=W),n.bindTexture(D,ue||Me[D]),Y.type=D,Y.texture=ue)}function B(){let D=ge[ce];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function q(){try{n.compressedTexImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{n.compressedTexImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function j(){try{n.texSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{n.texSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function he(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ve(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ye(){try{n.texStorage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ee(){try{n.texStorage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{n.texImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Le(){try{n.texImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Oe(D){nt.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),nt.copy(D))}function be(D){$.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),$.copy(D))}function Ze(D,ue){let W=c.get(ue);W===void 0&&(W=new WeakMap,c.set(ue,W));let Y=W.get(D);Y===void 0&&(Y=n.getUniformBlockIndex(ue,D.name),W.set(D,Y))}function Xe(D,ue){let Y=c.get(ue).get(D);l.get(ue)!==Y&&(n.uniformBlockBinding(ue,Y,D.__bindingPointIndex),l.set(ue,Y))}function ut(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},ce=null,ge={},h={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,T=null,S=null,b=null,N=null,w=null,I=new je(0,0,0),E=0,y=!1,v=null,R=null,F=null,U=null,V=null,nt.set(0,0,n.canvas.width,n.canvas.height),$.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ae,disable:Ie,bindFramebuffer:Ue,drawBuffers:Ne,useProgram:Je,setBlending:P,setMaterial:Ce,setFlipSided:K,setCullFace:ye,setLineWidth:le,setPolygonOffset:De,setScissorTest:_e,activeTexture:A,bindTexture:x,unbindTexture:B,compressedTexImage2D:q,compressedTexImage3D:J,texImage2D:xe,texImage3D:Le,updateUBOMapping:Ze,uniformBlockBinding:Xe,texStorage2D:Ye,texStorage3D:ee,texSubImage2D:j,texSubImage3D:Ee,compressedTexSubImage2D:he,compressedTexSubImage3D:ve,scissor:Oe,viewport:be,reset:ut}}function nd(n,e,t,i){let s=U0(i);switch(t){case xd:return n*e;case Sd:return n*e;case Md:return n*e*2;case Ed:return n*e/s.components*s.byteLength;case Sl:return n*e/s.components*s.byteLength;case Ad:return n*e*2/s.components*s.byteLength;case Ml:return n*e*2/s.components*s.byteLength;case bd:return n*e*3/s.components*s.byteLength;case mn:return n*e*4/s.components*s.byteLength;case El:return n*e*4/s.components*s.byteLength;case Sr:case Mr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Er:case Ar:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ho:case fo:return Math.max(n,16)*Math.max(e,8)/4;case co:case uo:return Math.max(n,8)*Math.max(e,8)/2;case po:case mo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case go:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case _o:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case vo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case yo:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case xo:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case bo:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case So:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Mo:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Eo:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ao:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case To:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case wo:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Co:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ro:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Po:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Tr:case Io:case Do:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Td:case Lo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case No:case Oo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function U0(n){switch(n){case Fn:case _d:return{byteLength:1,components:1};case Ps:case vd:case ks:return{byteLength:2,components:1};case xl:case bl:return{byteLength:2,components:4};case vi:case yl:case On:return{byteLength:4,components:1};case yd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function B0(n,e,t,i,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new se,d=new WeakMap,h,u=new WeakMap,p=!1;try{p=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,x){return p?new OffscreenCanvas(A,x):Rr("canvas")}function _(A,x,B){let q=1,J=_e(A);if((J.width>B||J.height>B)&&(q=B/Math.max(J.width,J.height)),q<1)if(typeof HTMLImageElement!="undefined"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&A instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&A instanceof ImageBitmap||typeof VideoFrame!="undefined"&&A instanceof VideoFrame){let j=Math.floor(q*J.width),Ee=Math.floor(q*J.height);h===void 0&&(h=g(j,Ee));let he=x?g(j,Ee):h;return he.width=j,he.height=Ee,he.getContext("2d").drawImage(A,0,0,j,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+j+"x"+Ee+")."),he}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function m(A){return A.generateMipmaps}function f(A){n.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(A,x,B,q,J=!1){if(A!==null){if(n[A]!==void 0)return n[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let j=x;if(x===n.RED&&(B===n.FLOAT&&(j=n.R32F),B===n.HALF_FLOAT&&(j=n.R16F),B===n.UNSIGNED_BYTE&&(j=n.R8)),x===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&(j=n.R8UI),B===n.UNSIGNED_SHORT&&(j=n.R16UI),B===n.UNSIGNED_INT&&(j=n.R32UI),B===n.BYTE&&(j=n.R8I),B===n.SHORT&&(j=n.R16I),B===n.INT&&(j=n.R32I)),x===n.RG&&(B===n.FLOAT&&(j=n.RG32F),B===n.HALF_FLOAT&&(j=n.RG16F),B===n.UNSIGNED_BYTE&&(j=n.RG8)),x===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&(j=n.RG8UI),B===n.UNSIGNED_SHORT&&(j=n.RG16UI),B===n.UNSIGNED_INT&&(j=n.RG32UI),B===n.BYTE&&(j=n.RG8I),B===n.SHORT&&(j=n.RG16I),B===n.INT&&(j=n.RG32I)),x===n.RGB_INTEGER&&(B===n.UNSIGNED_BYTE&&(j=n.RGB8UI),B===n.UNSIGNED_SHORT&&(j=n.RGB16UI),B===n.UNSIGNED_INT&&(j=n.RGB32UI),B===n.BYTE&&(j=n.RGB8I),B===n.SHORT&&(j=n.RGB16I),B===n.INT&&(j=n.RGB32I)),x===n.RGBA_INTEGER&&(B===n.UNSIGNED_BYTE&&(j=n.RGBA8UI),B===n.UNSIGNED_SHORT&&(j=n.RGBA16UI),B===n.UNSIGNED_INT&&(j=n.RGBA32UI),B===n.BYTE&&(j=n.RGBA8I),B===n.SHORT&&(j=n.RGBA16I),B===n.INT&&(j=n.RGBA32I)),x===n.RGB&&B===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),x===n.RGBA){let Ee=J?oa:Ke.getTransfer(q);B===n.FLOAT&&(j=n.RGBA32F),B===n.HALF_FLOAT&&(j=n.RGBA16F),B===n.UNSIGNED_BYTE&&(j=Ee===lt?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function b(A,x){let B;return A?x===null||x===vi||x===ts?B=n.DEPTH24_STENCIL8:x===On?B=n.DEPTH32F_STENCIL8:x===Ps&&(B=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===vi||x===ts?B=n.DEPTH_COMPONENT24:x===On?B=n.DEPTH_COMPONENT32F:x===Ps&&(B=n.DEPTH_COMPONENT16),B}function N(A,x){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==gn&&A.minFilter!==bn?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function w(A){let x=A.target;x.removeEventListener("dispose",w),E(x),x.isVideoTexture&&d.delete(x)}function I(A){let x=A.target;x.removeEventListener("dispose",I),v(x)}function E(A){let x=i.get(A);if(x.__webglInit===void 0)return;let B=A.source,q=u.get(B);if(q){let J=q[x.__cacheKey];J.usedTimes--,J.usedTimes===0&&y(A),Object.keys(q).length===0&&u.delete(B)}i.remove(A)}function y(A){let x=i.get(A);n.deleteTexture(x.__webglTexture);let B=A.source,q=u.get(B);delete q[x.__cacheKey],a.memory.textures--}function v(A){let x=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(x.__webglFramebuffer[q]))for(let J=0;J<x.__webglFramebuffer[q].length;J++)n.deleteFramebuffer(x.__webglFramebuffer[q][J]);else n.deleteFramebuffer(x.__webglFramebuffer[q]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[q])}else{if(Array.isArray(x.__webglFramebuffer))for(let q=0;q<x.__webglFramebuffer.length;q++)n.deleteFramebuffer(x.__webglFramebuffer[q]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let q=0;q<x.__webglColorRenderbuffer.length;q++)x.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[q]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let B=A.textures;for(let q=0,J=B.length;q<J;q++){let j=i.get(B[q]);j.__webglTexture&&(n.deleteTexture(j.__webglTexture),a.memory.textures--),i.remove(B[q])}i.remove(A)}let R=0;function F(){R=0}function U(){let A=R;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),R+=1,A}function V(A){let x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function X(A,x){let B=i.get(A);if(A.isVideoTexture&&le(A),A.isRenderTargetTexture===!1&&A.version>0&&B.__version!==A.version){let q=A.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(B,A,x);return}}t.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+x)}function k(A,x){let B=i.get(A);if(A.version>0&&B.__version!==A.version){$(B,A,x);return}t.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+x)}function Q(A,x){let B=i.get(A);if(A.version>0&&B.__version!==A.version){$(B,A,x);return}t.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+x)}function G(A,x){let B=i.get(A);if(A.version>0&&B.__version!==A.version){ne(B,A,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+x)}let ce={[Rs]:n.REPEAT,[gi]:n.CLAMP_TO_EDGE,[lo]:n.MIRRORED_REPEAT},ge={[gn]:n.NEAREST,[xu]:n.NEAREST_MIPMAP_NEAREST,[Ys]:n.NEAREST_MIPMAP_LINEAR,[bn]:n.LINEAR,[va]:n.LINEAR_MIPMAP_NEAREST,[_i]:n.LINEAR_MIPMAP_LINEAR},Se={[Eu]:n.NEVER,[Pu]:n.ALWAYS,[Au]:n.LESS,[Cd]:n.LEQUAL,[Tu]:n.EQUAL,[Ru]:n.GEQUAL,[wu]:n.GREATER,[Cu]:n.NOTEQUAL};function ze(A,x){if(x.type===On&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===bn||x.magFilter===va||x.magFilter===Ys||x.magFilter===_i||x.minFilter===bn||x.minFilter===va||x.minFilter===Ys||x.minFilter===_i)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,ce[x.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,ce[x.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,ce[x.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,ge[x.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,ge[x.minFilter]),x.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,Se[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===gn||x.minFilter!==Ys&&x.minFilter!==_i||x.type===On&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){let B=e.get("EXT_texture_filter_anisotropic");n.texParameterf(A,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function nt(A,x){let B=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",w));let q=x.source,J=u.get(q);J===void 0&&(J={},u.set(q,J));let j=V(x);if(j!==A.__cacheKey){J[j]===void 0&&(J[j]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,B=!0),J[j].usedTimes++;let Ee=J[A.__cacheKey];Ee!==void 0&&(J[A.__cacheKey].usedTimes--,Ee.usedTimes===0&&y(x)),A.__cacheKey=j,A.__webglTexture=J[j].texture}return B}function $(A,x,B){let q=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(q=n.TEXTURE_3D);let J=nt(A,x),j=x.source;t.bindTexture(q,A.__webglTexture,n.TEXTURE0+B);let Ee=i.get(j);if(j.version!==Ee.__version||J===!0){t.activeTexture(n.TEXTURE0+B);let he=Ke.getPrimaries(Ke.workingColorSpace),ve=x.colorSpace===Jn?null:Ke.getPrimaries(x.colorSpace),Ye=x.colorSpace===Jn||he===ve?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let ee=_(x.image,!1,s.maxTextureSize);ee=De(x,ee);let xe=r.convert(x.format,x.colorSpace),Le=r.convert(x.type),Oe=S(x.internalFormat,xe,Le,x.colorSpace,x.isVideoTexture);ze(q,x);let be,Ze=x.mipmaps,Xe=x.isVideoTexture!==!0,ut=Ee.__version===void 0||J===!0,D=j.dataReady,ue=N(x,ee);if(x.isDepthTexture)Oe=b(x.format===ns,x.type),ut&&(Xe?t.texStorage2D(n.TEXTURE_2D,1,Oe,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,Oe,ee.width,ee.height,0,xe,Le,null));else if(x.isDataTexture)if(Ze.length>0){Xe&&ut&&t.texStorage2D(n.TEXTURE_2D,ue,Oe,Ze[0].width,Ze[0].height);for(let W=0,Y=Ze.length;W<Y;W++)be=Ze[W],Xe?D&&t.texSubImage2D(n.TEXTURE_2D,W,0,0,be.width,be.height,xe,Le,be.data):t.texImage2D(n.TEXTURE_2D,W,Oe,be.width,be.height,0,xe,Le,be.data);x.generateMipmaps=!1}else Xe?(ut&&t.texStorage2D(n.TEXTURE_2D,ue,Oe,ee.width,ee.height),D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ee.width,ee.height,xe,Le,ee.data)):t.texImage2D(n.TEXTURE_2D,0,Oe,ee.width,ee.height,0,xe,Le,ee.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Xe&&ut&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ue,Oe,Ze[0].width,Ze[0].height,ee.depth);for(let W=0,Y=Ze.length;W<Y;W++)if(be=Ze[W],x.format!==mn)if(xe!==null)if(Xe){if(D)if(x.layerUpdates.size>0){let me=nd(be.width,be.height,x.format,x.type);for(let fe of x.layerUpdates){let ke=be.data.subarray(fe*me/be.data.BYTES_PER_ELEMENT,(fe+1)*me/be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,W,0,0,fe,be.width,be.height,1,xe,ke)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,W,0,0,0,be.width,be.height,ee.depth,xe,be.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,W,Oe,be.width,be.height,ee.depth,0,be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,W,0,0,0,be.width,be.height,ee.depth,xe,Le,be.data):t.texImage3D(n.TEXTURE_2D_ARRAY,W,Oe,be.width,be.height,ee.depth,0,xe,Le,be.data)}else{Xe&&ut&&t.texStorage2D(n.TEXTURE_2D,ue,Oe,Ze[0].width,Ze[0].height);for(let W=0,Y=Ze.length;W<Y;W++)be=Ze[W],x.format!==mn?xe!==null?Xe?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,W,0,0,be.width,be.height,xe,be.data):t.compressedTexImage2D(n.TEXTURE_2D,W,Oe,be.width,be.height,0,be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?D&&t.texSubImage2D(n.TEXTURE_2D,W,0,0,be.width,be.height,xe,Le,be.data):t.texImage2D(n.TEXTURE_2D,W,Oe,be.width,be.height,0,xe,Le,be.data)}else if(x.isDataArrayTexture)if(Xe){if(ut&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ue,Oe,ee.width,ee.height,ee.depth),D)if(x.layerUpdates.size>0){let W=nd(ee.width,ee.height,x.format,x.type);for(let Y of x.layerUpdates){let me=ee.data.subarray(Y*W/ee.data.BYTES_PER_ELEMENT,(Y+1)*W/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Y,ee.width,ee.height,1,xe,Le,me)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,xe,Le,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Oe,ee.width,ee.height,ee.depth,0,xe,Le,ee.data);else if(x.isData3DTexture)Xe?(ut&&t.texStorage3D(n.TEXTURE_3D,ue,Oe,ee.width,ee.height,ee.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,xe,Le,ee.data)):t.texImage3D(n.TEXTURE_3D,0,Oe,ee.width,ee.height,ee.depth,0,xe,Le,ee.data);else if(x.isFramebufferTexture){if(ut)if(Xe)t.texStorage2D(n.TEXTURE_2D,ue,Oe,ee.width,ee.height);else{let W=ee.width,Y=ee.height;for(let me=0;me<ue;me++)t.texImage2D(n.TEXTURE_2D,me,Oe,W,Y,0,xe,Le,null),W>>=1,Y>>=1}}else if(Ze.length>0){if(Xe&&ut){let W=_e(Ze[0]);t.texStorage2D(n.TEXTURE_2D,ue,Oe,W.width,W.height)}for(let W=0,Y=Ze.length;W<Y;W++)be=Ze[W],Xe?D&&t.texSubImage2D(n.TEXTURE_2D,W,0,0,xe,Le,be):t.texImage2D(n.TEXTURE_2D,W,Oe,xe,Le,be);x.generateMipmaps=!1}else if(Xe){if(ut){let W=_e(ee);t.texStorage2D(n.TEXTURE_2D,ue,Oe,W.width,W.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,xe,Le,ee)}else t.texImage2D(n.TEXTURE_2D,0,Oe,xe,Le,ee);m(x)&&f(q),Ee.__version=j.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function ne(A,x,B){if(x.image.length!==6)return;let q=nt(A,x),J=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+B);let j=i.get(J);if(J.version!==j.__version||q===!0){t.activeTexture(n.TEXTURE0+B);let Ee=Ke.getPrimaries(Ke.workingColorSpace),he=x.colorSpace===Jn?null:Ke.getPrimaries(x.colorSpace),ve=x.colorSpace===Jn||Ee===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);let Ye=x.isCompressedTexture||x.image[0].isCompressedTexture,ee=x.image[0]&&x.image[0].isDataTexture,xe=[];for(let Y=0;Y<6;Y++)!Ye&&!ee?xe[Y]=_(x.image[Y],!0,s.maxCubemapSize):xe[Y]=ee?x.image[Y].image:x.image[Y],xe[Y]=De(x,xe[Y]);let Le=xe[0],Oe=r.convert(x.format,x.colorSpace),be=r.convert(x.type),Ze=S(x.internalFormat,Oe,be,x.colorSpace),Xe=x.isVideoTexture!==!0,ut=j.__version===void 0||q===!0,D=J.dataReady,ue=N(x,Le);ze(n.TEXTURE_CUBE_MAP,x);let W;if(Ye){Xe&&ut&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ue,Ze,Le.width,Le.height);for(let Y=0;Y<6;Y++){W=xe[Y].mipmaps;for(let me=0;me<W.length;me++){let fe=W[me];x.format!==mn?Oe!==null?Xe?D&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me,0,0,fe.width,fe.height,Oe,fe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me,Ze,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Xe?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me,0,0,fe.width,fe.height,Oe,be,fe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me,Ze,fe.width,fe.height,0,Oe,be,fe.data)}}}else{if(W=x.mipmaps,Xe&&ut){W.length>0&&ue++;let Y=_e(xe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ue,Ze,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(ee){Xe?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,xe[Y].width,xe[Y].height,Oe,be,xe[Y].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ze,xe[Y].width,xe[Y].height,0,Oe,be,xe[Y].data);for(let me=0;me<W.length;me++){let ke=W[me].image[Y].image;Xe?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me+1,0,0,ke.width,ke.height,Oe,be,ke.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me+1,Ze,ke.width,ke.height,0,Oe,be,ke.data)}}else{Xe?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Oe,be,xe[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ze,Oe,be,xe[Y]);for(let me=0;me<W.length;me++){let fe=W[me];Xe?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me+1,0,0,Oe,be,fe.image[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,me+1,Ze,Oe,be,fe.image[Y])}}}m(x)&&f(n.TEXTURE_CUBE_MAP),j.__version=J.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Me(A,x,B,q,J,j){let Ee=r.convert(B.format,B.colorSpace),he=r.convert(B.type),ve=S(B.internalFormat,Ee,he,B.colorSpace),Ye=i.get(x),ee=i.get(B);if(ee.__renderTarget=x,!Ye.__hasExternalTextures){let xe=Math.max(1,x.width>>j),Le=Math.max(1,x.height>>j);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?t.texImage3D(J,j,ve,xe,Le,x.depth,0,Ee,he,null):t.texImage2D(J,j,ve,xe,Le,0,Ee,he,null)}t.bindFramebuffer(n.FRAMEBUFFER,A),ye(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,J,ee.__webglTexture,0,K(x)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,J,ee.__webglTexture,j),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ae(A,x,B){if(n.bindRenderbuffer(n.RENDERBUFFER,A),x.depthBuffer){let q=x.depthTexture,J=q&&q.isDepthTexture?q.type:null,j=b(x.stencilBuffer,J),Ee=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=K(x);ye(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,he,j,x.width,x.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,he,j,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,j,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ee,n.RENDERBUFFER,A)}else{let q=x.textures;for(let J=0;J<q.length;J++){let j=q[J],Ee=r.convert(j.format,j.colorSpace),he=r.convert(j.type),ve=S(j.internalFormat,Ee,he,j.colorSpace),Ye=K(x);B&&ye(x)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ye,ve,x.width,x.height):ye(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ye,ve,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,ve,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ie(A,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let q=i.get(x.depthTexture);q.__renderTarget=x,(!q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),X(x.depthTexture,0);let J=q.__webglTexture,j=K(x);if(x.depthTexture.format===Yi)ye(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,j):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(x.depthTexture.format===ns)ye(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,j):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Ue(A){let x=i.get(A),B=A.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==A.depthTexture){let q=A.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),q){let J=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,q.removeEventListener("dispose",J)};q.addEventListener("dispose",J),x.__depthDisposeCallback=J}x.__boundDepthTexture=q}if(A.depthTexture&&!x.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Ie(x.__webglFramebuffer,A)}else if(B){x.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[q]),x.__webglDepthbuffer[q]===void 0)x.__webglDepthbuffer[q]=n.createRenderbuffer(),ae(x.__webglDepthbuffer[q],A,!1);else{let J=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,j=x.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,j),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,j)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),ae(x.__webglDepthbuffer,A,!1);else{let q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,J=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,J),n.framebufferRenderbuffer(n.FRAMEBUFFER,q,n.RENDERBUFFER,J)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ne(A,x,B){let q=i.get(A);x!==void 0&&Me(q.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&Ue(A)}function Je(A){let x=A.texture,B=i.get(A),q=i.get(x);A.addEventListener("dispose",I);let J=A.textures,j=A.isWebGLCubeRenderTarget===!0,Ee=J.length>1;if(Ee||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=x.version,a.memory.textures++),j){B.__webglFramebuffer=[];for(let he=0;he<6;he++)if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer[he]=[];for(let ve=0;ve<x.mipmaps.length;ve++)B.__webglFramebuffer[he][ve]=n.createFramebuffer()}else B.__webglFramebuffer[he]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer=[];for(let he=0;he<x.mipmaps.length;he++)B.__webglFramebuffer[he]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(Ee)for(let he=0,ve=J.length;he<ve;he++){let Ye=i.get(J[he]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=n.createTexture(),a.memory.textures++)}if(A.samples>0&&ye(A)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let he=0;he<J.length;he++){let ve=J[he];B.__webglColorRenderbuffer[he]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[he]);let Ye=r.convert(ve.format,ve.colorSpace),ee=r.convert(ve.type),xe=S(ve.internalFormat,Ye,ee,ve.colorSpace,A.isXRRenderTarget===!0),Le=K(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,Le,xe,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,B.__webglColorRenderbuffer[he])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),ae(B.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(j){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),ze(n.TEXTURE_CUBE_MAP,x);for(let he=0;he<6;he++)if(x.mipmaps&&x.mipmaps.length>0)for(let ve=0;ve<x.mipmaps.length;ve++)Me(B.__webglFramebuffer[he][ve],A,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,ve);else Me(B.__webglFramebuffer[he],A,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);m(x)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let he=0,ve=J.length;he<ve;he++){let Ye=J[he],ee=i.get(Ye);t.bindTexture(n.TEXTURE_2D,ee.__webglTexture),ze(n.TEXTURE_2D,Ye),Me(B.__webglFramebuffer,A,Ye,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,0),m(Ye)&&f(n.TEXTURE_2D)}t.unbindTexture()}else{let he=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(he=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(he,q.__webglTexture),ze(he,x),x.mipmaps&&x.mipmaps.length>0)for(let ve=0;ve<x.mipmaps.length;ve++)Me(B.__webglFramebuffer[ve],A,x,n.COLOR_ATTACHMENT0,he,ve);else Me(B.__webglFramebuffer,A,x,n.COLOR_ATTACHMENT0,he,0);m(x)&&f(he),t.unbindTexture()}A.depthBuffer&&Ue(A)}function Z(A){let x=A.textures;for(let B=0,q=x.length;B<q;B++){let J=x[B];if(m(J)){let j=T(A),Ee=i.get(J).__webglTexture;t.bindTexture(j,Ee),f(j),t.unbindTexture()}}}let te=[],P=[];function Ce(A){if(A.samples>0){if(ye(A)===!1){let x=A.textures,B=A.width,q=A.height,J=n.COLOR_BUFFER_BIT,j=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ee=i.get(A),he=x.length>1;if(he)for(let ve=0;ve<x.length;ve++)t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let ve=0;ve<x.length;ve++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),he){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[ve]);let Ye=i.get(x[ve]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ye,0)}n.blitFramebuffer(0,0,B,q,0,0,B,q,J,n.NEAREST),l===!0&&(te.length=0,P.length=0,te.push(n.COLOR_ATTACHMENT0+ve),A.depthBuffer&&A.resolveDepthBuffer===!1&&(te.push(j),P.push(j),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,P)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,te))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),he)for(let ve=0;ve<x.length;ve++){t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[ve]);let Ye=i.get(x[ve]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.TEXTURE_2D,Ye,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){let x=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function K(A){return Math.min(s.maxSamples,A.samples)}function ye(A){let x=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function le(A){let x=a.render.frame;d.get(A)!==x&&(d.set(A,x),A.update())}function De(A,x){let B=A.colorSpace,q=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||B!==hs&&B!==Jn&&(Ke.getTransfer(B)===lt?(q!==mn||J!==Fn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),x}function _e(A){return typeof HTMLImageElement!="undefined"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame!="undefined"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=F,this.setTexture2D=X,this.setTexture2DArray=k,this.setTexture3D=Q,this.setTextureCube=G,this.rebindTextures=Ne,this.setupRenderTarget=Je,this.updateRenderTargetMipmap=Z,this.updateMultisampleRenderTarget=Ce,this.setupDepthRenderbuffer=Ue,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=ye}function F0(n,e){function t(i,s=Jn){let r,a=Ke.getTransfer(s);if(i===Fn)return n.UNSIGNED_BYTE;if(i===xl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===bl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===yd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===_d)return n.BYTE;if(i===vd)return n.SHORT;if(i===Ps)return n.UNSIGNED_SHORT;if(i===yl)return n.INT;if(i===vi)return n.UNSIGNED_INT;if(i===On)return n.FLOAT;if(i===ks)return n.HALF_FLOAT;if(i===xd)return n.ALPHA;if(i===bd)return n.RGB;if(i===mn)return n.RGBA;if(i===Sd)return n.LUMINANCE;if(i===Md)return n.LUMINANCE_ALPHA;if(i===Yi)return n.DEPTH_COMPONENT;if(i===ns)return n.DEPTH_STENCIL;if(i===Ed)return n.RED;if(i===Sl)return n.RED_INTEGER;if(i===Ad)return n.RG;if(i===Ml)return n.RG_INTEGER;if(i===El)return n.RGBA_INTEGER;if(i===Sr||i===Mr||i===Er||i===Ar)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Sr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Sr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Mr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Er)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ar)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===co||i===ho||i===uo||i===fo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===co)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ho)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===uo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===fo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===po||i===mo||i===go)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===po||i===mo)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===go)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===_o||i===vo||i===yo||i===xo||i===bo||i===So||i===Mo||i===Eo||i===Ao||i===To||i===wo||i===Co||i===Ro||i===Po)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===_o)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===vo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===yo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===xo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===bo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===So)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Mo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Eo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ao)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===To)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===wo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Co)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ro)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Po)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Tr||i===Io||i===Do)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Tr)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Io)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Do)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Td||i===Lo||i===No||i===Oo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Tr)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Lo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===No)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Oo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ts?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}function G0(n,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Dd(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,T,S,b){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),h(m,f)):f.isMeshPhongMaterial?(r(m,f),d(m,f)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,b)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,T,S):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ht&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ht&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let T=e.get(f),S=T.envMap,b=T.envMapRotation;S&&(m.envMap.value=S,hi.copy(b),hi.x*=-1,hi.y*=-1,hi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),m.envMapRotation.value.setFromMatrix4(k0.makeRotationFromEuler(hi)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,T,S){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*T,m.scale.value=S*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function d(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,T){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ht&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let T=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function W0(n,e,t,i){let s={},r={},a=[],o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,S){let b=S.program;i.uniformBlockBinding(T,b)}function c(T,S){let b=s[T.id];b===void 0&&(g(T),b=d(T),s[T.id]=b,T.addEventListener("dispose",m));let N=S.program;i.updateUBOMapping(T,N);let w=e.render.frame;r[T.id]!==w&&(u(T),r[T.id]=w)}function d(T){let S=h();T.__bindingPointIndex=S;let b=n.createBuffer(),N=T.__size,w=T.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,N,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,b),b}function h(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(T){let S=s[T.id],b=T.uniforms,N=T.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let w=0,I=b.length;w<I;w++){let E=Array.isArray(b[w])?b[w]:[b[w]];for(let y=0,v=E.length;y<v;y++){let R=E[y];if(p(R,w,y,N)===!0){let F=R.__offset,U=Array.isArray(R.value)?R.value:[R.value],V=0;for(let X=0;X<U.length;X++){let k=U[X],Q=_(k);typeof k=="number"||typeof k=="boolean"?(R.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,F+V,R.__data)):k.isMatrix3?(R.__data[0]=k.elements[0],R.__data[1]=k.elements[1],R.__data[2]=k.elements[2],R.__data[3]=0,R.__data[4]=k.elements[3],R.__data[5]=k.elements[4],R.__data[6]=k.elements[5],R.__data[7]=0,R.__data[8]=k.elements[6],R.__data[9]=k.elements[7],R.__data[10]=k.elements[8],R.__data[11]=0):(k.toArray(R.__data,V),V+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(T,S,b,N){let w=T.value,I=S+"_"+b;if(N[I]===void 0)return typeof w=="number"||typeof w=="boolean"?N[I]=w:N[I]=w.clone(),!0;{let E=N[I];if(typeof w=="number"||typeof w=="boolean"){if(E!==w)return N[I]=w,!0}else if(E.equals(w)===!1)return E.copy(w),!0}return!1}function g(T){let S=T.uniforms,b=0,N=16;for(let I=0,E=S.length;I<E;I++){let y=Array.isArray(S[I])?S[I]:[S[I]];for(let v=0,R=y.length;v<R;v++){let F=y[v],U=Array.isArray(F.value)?F.value:[F.value];for(let V=0,X=U.length;V<X;V++){let k=U[V],Q=_(k),G=b%N,ce=G%Q.boundary,ge=G+ce;b+=ce,ge!==0&&N-ge<Q.storage&&(b+=N-ge),F.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=b,b+=Q.storage}}}let w=b%N;return w>0&&(b+=N-w),T.__size=b,T.__cache={},this}function _(T){let S={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(S.boundary=4,S.storage=4):T.isVector2?(S.boundary=8,S.storage=8):T.isVector3||T.isColor?(S.boundary=16,S.storage=12):T.isVector4?(S.boundary=16,S.storage=16):T.isMatrix3?(S.boundary=48,S.storage=48):T.isMatrix4?(S.boundary=64,S.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),S}function m(T){let S=T.target;S.removeEventListener("dispose",m);let b=a.indexOf(S.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function f(){for(let T in s)n.deleteBuffer(s[T]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}function _r(n,e,t,i,s,r){let a=n.geometry.attributes.position;if(kr.fromBufferAttribute(a,s),Gr.fromBufferAttribute(a,r),t.distanceSqToSegment(kr,Gr,qa,sd)>i)return;qa.applyMatrix4(n.matrixWorld);let l=e.ray.origin.distanceTo(qa);if(!(l<e.near||l>e.far))return{distance:l,point:sd.clone().applyMatrix4(n.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:n}}function wl(){let n=0,e=0,t=0,i=0;function s(r,a,o,l){n=r,e=o,t=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,d,h){let u=(a-r)/c-(o-r)/(c+d)+(o-a)/d,p=(o-a)/d-(l-a)/(d+h)+(l-o)/h;u*=d,p*=d,s(a,o,u,p)},calc:function(r){let a=r*r,o=a*r;return n+e*r+t*a+i*o}}}function od(n,e,t,i,s){let r=(i-e)*.5,a=(s-t)*.5,o=n*n,l=n*o;return(2*t-2*i+r+a)*l+(-3*t+3*i-2*r-a)*o+r*n+t}function X0(n,e){let t=1-n;return t*t*e}function q0(n,e){return 2*(1-n)*n*e}function j0(n,e){return n*n*e}function Ts(n,e,t,i){return X0(n,e)+q0(n,t)+j0(n,i)}function $0(n,e){let t=1-n;return t*t*t*e}function Y0(n,e){let t=1-n;return 3*t*t*n*e}function Z0(n,e){return 3*(1-n)*n*n*e}function J0(n,e){return n*n*n*e}function ws(n,e,t,i,s){return $0(n,e)+Y0(n,t)+Z0(n,i)+J0(n,s)}function Fd(n,e,t,i,s){let r,a;if(s===p_(n,e,t,i)>0)for(r=e;r<t;r+=i)a=ld(r,n[r],n[r+1],a);else for(r=t-i;r>=e;r-=i)a=ld(r,n[r],n[r+1],a);return a&&ca(a,a.next)&&(Fs(a),a=a.next),a}function xi(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(ca(t,t.next)||vt(t.prev,t,t.next)===0)){if(Fs(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Us(n,e,t,i,s,r,a){if(!n)return;!a&&r&&l_(n,i,s,r);let o=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,r?e_(n,i,s,r):Q0(n)){e.push(l.i/t|0),e.push(n.i/t|0),e.push(c.i/t|0),Fs(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=t_(xi(n),e,t),Us(n,e,t,i,s,r,2)):a===2&&n_(n,e,t,i,s,r):Us(xi(n),e,t,i,s,r,1);break}}}function Q0(n){let e=n.prev,t=n,i=n.next;if(vt(e,t,i)>=0)return!1;let s=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,d=s<r?s<a?s:a:r<a?r:a,h=o<l?o<c?o:c:l<c?l:c,u=s>r?s>a?s:a:r>a?r:a,p=o>l?o>c?o:c:l>c?l:c,g=i.next;for(;g!==e;){if(g.x>=d&&g.x<=u&&g.y>=h&&g.y<=p&&ji(s,o,r,l,a,c,g.x,g.y)&&vt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function e_(n,e,t,i){let s=n.prev,r=n,a=n.next;if(vt(s,r,a)>=0)return!1;let o=s.x,l=r.x,c=a.x,d=s.y,h=r.y,u=a.y,p=o<l?o<c?o:c:l<c?l:c,g=d<h?d<u?d:u:h<u?h:u,_=o>l?o>c?o:c:l>c?l:c,m=d>h?d>u?d:u:h>u?h:u,f=il(p,g,e,t,i),T=il(_,m,e,t,i),S=n.prevZ,b=n.nextZ;for(;S&&S.z>=f&&b&&b.z<=T;){if(S.x>=p&&S.x<=_&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&ji(o,d,l,h,c,u,S.x,S.y)&&vt(S.prev,S,S.next)>=0||(S=S.prevZ,b.x>=p&&b.x<=_&&b.y>=g&&b.y<=m&&b!==s&&b!==a&&ji(o,d,l,h,c,u,b.x,b.y)&&vt(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;S&&S.z>=f;){if(S.x>=p&&S.x<=_&&S.y>=g&&S.y<=m&&S!==s&&S!==a&&ji(o,d,l,h,c,u,S.x,S.y)&&vt(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;b&&b.z<=T;){if(b.x>=p&&b.x<=_&&b.y>=g&&b.y<=m&&b!==s&&b!==a&&ji(o,d,l,h,c,u,b.x,b.y)&&vt(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function t_(n,e,t){let i=n;do{let s=i.prev,r=i.next.next;!ca(s,r)&&Vd(s,i,i.next,r)&&Bs(s,r)&&Bs(r,s)&&(e.push(s.i/t|0),e.push(i.i/t|0),e.push(r.i/t|0),Fs(i),Fs(i.next),i=n=r),i=i.next}while(i!==n);return xi(i)}function n_(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&h_(a,o)){let l=zd(a,o);a=xi(a,a.next),l=xi(l,l.next),Us(a,e,t,i,s,r,0),Us(l,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function i_(n,e,t,i){let s=[],r,a,o,l,c;for(r=0,a=e.length;r<a;r++)o=e[r]*i,l=r<a-1?e[r+1]*i:n.length,c=Fd(n,o,l,i,!1),c===c.next&&(c.steiner=!0),s.push(d_(c));for(s.sort(s_),r=0;r<s.length;r++)t=r_(s[r],t);return t}function s_(n,e){return n.x-e.x}function r_(n,e){let t=a_(n,e);if(!t)return e;let i=zd(t,n);return xi(i,i.next),xi(t,t.next)}function a_(n,e){let t=e,i=-1/0,s,r=n.x,a=n.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){let u=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=r&&u>i&&(i=u,s=t.x<t.next.x?t:t.next,u===r))return s}t=t.next}while(t!==e);if(!s)return null;let o=s,l=s.x,c=s.y,d=1/0,h;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&ji(a<c?r:i,a,l,c,a<c?i:r,a,t.x,t.y)&&(h=Math.abs(a-t.y)/(r-t.x),Bs(t,n)&&(h<d||h===d&&(t.x>s.x||t.x===s.x&&o_(s,t)))&&(s=t,d=h)),t=t.next;while(t!==o);return s}function o_(n,e){return vt(n.prev,n,e.prev)<0&&vt(e.next,n,n.next)<0}function l_(n,e,t,i){let s=n;do s.z===0&&(s.z=il(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,c_(s)}function c_(n){let e,t,i,s,r,a,o,l,c=1;do{for(t=n,n=null,r=null,a=0;t;){for(a++,i=t,o=0,e=0;e<c&&(o++,i=i.nextZ,!!i);e++);for(l=c;o>0||l>0&&i;)o!==0&&(l===0||!i||t.z<=i.z)?(s=t,t=t.nextZ,o--):(s=i,i=i.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;t=i}r.nextZ=null,c*=2}while(a>1);return n}function il(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function d_(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function ji(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function h_(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!u_(n,e)&&(Bs(n,e)&&Bs(e,n)&&f_(n,e)&&(vt(n.prev,n,e.prev)||vt(n,e.prev,e))||ca(n,e)&&vt(n.prev,n,n.next)>0&&vt(e.prev,e,e.next)>0)}function vt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function ca(n,e){return n.x===e.x&&n.y===e.y}function Vd(n,e,t,i){let s=xr(vt(n,e,t)),r=xr(vt(n,e,i)),a=xr(vt(t,i,n)),o=xr(vt(t,i,e));return!!(s!==r&&a!==o||s===0&&yr(n,t,e)||r===0&&yr(n,i,e)||a===0&&yr(t,n,i)||o===0&&yr(t,e,i))}function yr(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function xr(n){return n>0?1:n<0?-1:0}function u_(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&Vd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Bs(n,e){return vt(n.prev,n,n.next)<0?vt(n,e,n.next)>=0&&vt(n,n.prev,e)>=0:vt(n,e,n.prev)<0||vt(n,n.next,e)<0}function f_(n,e){let t=n,i=!1,s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function zd(n,e){let t=new sl(n.i,n.x,n.y),i=new sl(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function ld(n,e,t,i){let s=new sl(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Fs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function sl(n,e,t){this.i=n,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function p_(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}function cd(n){let e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function dd(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}function g_(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){let r=n[i];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}function br(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function __(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function fd(){return performance.now()}var Ei,Ai,qh,nc,jh,pd,_l,Nn,ei,Ht,pn,Kn,$i,ic,sc,rc,$h,fi,Yh,Zh,Jh,Kh,Qh,eu,tu,nu,Ja,Ka,iu,su,ru,au,ou,lu,cu,du,hu,Qa,eo,to,Ki,no,io,so,ro,md,uu,fu,Qn,pu,mu,gu,vl,_u,vu,yu,gd,Qi,es,ao,oo,aa,Rs,gi,lo,gn,xu,Ys,bn,va,_i,Fn,_d,vd,Ps,yl,vi,On,ks,xl,bl,ts,yd,xd,bd,mn,Sd,Md,Yi,ns,Ed,Sl,Ad,Ml,El,Sr,Mr,Er,Ar,co,ho,uo,fo,po,mo,go,_o,vo,yo,xo,bo,So,Mo,Eo,Ao,To,wo,Co,Ro,Po,Tr,Io,Do,Td,Lo,No,Oo,wr,Uo,ya,ac,oc,lc,bu,Su,wd,Mu,Jn,Lt,hs,oa,lt,Ii,cc,Eu,Au,Tu,Cd,wu,Cu,Ru,Pu,dc,hc,Un,Cr,Vn,It,uc,Ms,Is,Rd,se,We,xa,fc,Ke,pc,mc,gc,_c,vc,Di,Bo,Ju,Pr,Ku,Yt,bt,Fo,zn,Ir,Vo,Zt,C,Sa,yc,nn,Rn,dn,Zs,Li,Ni,Oi,Xn,qn,ai,gs,Js,Ks,oi,Qu,_s,Ea,is,Pn,Aa,Qs,jn,Ta,er,wa,ss,yt,Ui,hn,ef,tf,$n,tr,Xt,xc,bc,Sn,Dr,nf,Sc,Bi,In,nr,vs,sf,rf,Mc,Ec,Ac,Tc,af,Fi,Ca,Nt,un,Dn,Ra,Ln,Vi,zi,wc,Pa,Ia,Da,La,Na,Oa,pi,Id,Yn,ir,je,Dt,of,Hn,Lr,St,sr,$t,Nr,Or,gt,lf,tn,Ba,Hi,qt,ys,wt,kt,Cc,li,rr,Rc,ar,or,lr,Fa,cr,Pc,dr,He,Ot,hf,uf,ff,Mn,Ur,Zn,Ic,Dc,jt,ki,Gi,zo,Br,Ho,Va,pf,mf,fn,ci,ur,Ds,sn,_f,vf,yf,xf,bf,Sf,Mf,Ef,Af,Tf,wf,Cf,Rf,Pf,If,Df,Lf,Nf,Of,Uf,Bf,Ff,Vf,zf,Hf,kf,Gf,Wf,Xf,qf,jf,$f,Yf,Zf,Jf,Kf,Qf,ep,tp,np,ip,sp,rp,ap,op,lp,cp,dp,hp,up,fp,pp,mp,gp,_p,vp,yp,xp,bp,Sp,Mp,Ep,Ap,Tp,wp,Cp,Rp,Pp,Ip,Dp,Lp,Np,Op,Up,Bp,Fp,Vp,zp,Hp,kp,Gp,Wp,Xp,qp,jp,$p,Yp,Zp,Jp,Kp,Qp,em,tm,nm,im,sm,rm,am,om,lm,cm,dm,hm,um,fm,pm,mm,gm,_m,vm,ym,xm,bm,Sm,Mm,Em,Am,Tm,wm,Cm,Rm,Pm,Im,Dm,Lm,Nm,Om,Um,Bm,Fm,Vm,zm,Hm,km,Gm,Wm,Xm,qm,jm,$m,Ym,qe,de,xn,fr,di,Zm,as,qi,Lc,mi,za,Nc,Ha,ka,Ga,Wa,ui,Wi,Oc,Fr,Vr,Nd,Vc,Od,Ud,Bd,zc,Hc,kc,Gc,Wc,ko,Go,Wo,Xa,Ji,Qg,e0,jc,mr,c0,d0,u0,x0,qo,jo,w0,$o,Yo,I0,D0,N0,Zo,$e,V0,As,z0,H0,Jo,Ko,hi,k0,zr,Hr,Ls,kr,Gr,id,xs,gr,qa,sd,Qo,rd,ad,Wr,Xr,rn,Ns,el,vr,ja,$a,Ya,Os,qr,yi,jr,tl,$r,Yr,Zr,Jr,nl,os,En,ls,K0,Cs,Vs,m_,cs,bi,Kr,Mt,ds,rl,al,ol,_n,Si,ll,cl,dl,Qr,Mi,hl,ul,v_,fl,ea,ta,Za,hd,ud,pl,ml,zs,na,Cl,y_,Rl,x_,b_,S_,M_,E_,A_,T_,gl,_t,_v,Hs,ia,sa,ra,da=Pt(()=>{Ei={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Ai={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},qh=0,nc=1,jh=2,pd=1,_l=2,Nn=3,ei=0,Ht=1,pn=2,Kn=0,$i=1,ic=2,sc=3,rc=4,$h=5,fi=100,Yh=101,Zh=102,Jh=103,Kh=104,Qh=200,eu=201,tu=202,nu=203,Ja=204,Ka=205,iu=206,su=207,ru=208,au=209,ou=210,lu=211,cu=212,du=213,hu=214,Qa=0,eo=1,to=2,Ki=3,no=4,io=5,so=6,ro=7,md=0,uu=1,fu=2,Qn=0,pu=1,mu=2,gu=3,vl=4,_u=5,vu=6,yu=7,gd=300,Qi=301,es=302,ao=303,oo=304,aa=306,Rs=1e3,gi=1001,lo=1002,gn=1003,xu=1004,Ys=1005,bn=1006,va=1007,_i=1008,Fn=1009,_d=1010,vd=1011,Ps=1012,yl=1013,vi=1014,On=1015,ks=1016,xl=1017,bl=1018,ts=1020,yd=35902,xd=1021,bd=1022,mn=1023,Sd=1024,Md=1025,Yi=1026,ns=1027,Ed=1028,Sl=1029,Ad=1030,Ml=1031,El=1033,Sr=33776,Mr=33777,Er=33778,Ar=33779,co=35840,ho=35841,uo=35842,fo=35843,po=36196,mo=37492,go=37496,_o=37808,vo=37809,yo=37810,xo=37811,bo=37812,So=37813,Mo=37814,Eo=37815,Ao=37816,To=37817,wo=37818,Co=37819,Ro=37820,Po=37821,Tr=36492,Io=36494,Do=36495,Td=36283,Lo=36284,No=36285,Oo=36286,wr=2300,Uo=2301,ya=2302,ac=2400,oc=2401,lc=2402,bu=3200,Su=3201,wd=0,Mu=1,Jn="",Lt="srgb",hs="srgb-linear",oa="linear",lt="srgb",Ii=7680,cc=519,Eu=512,Au=513,Tu=514,Cd=515,wu=516,Cu=517,Ru=518,Pu=519,dc=35044,hc="300 es",Un=2e3,Cr=2001,Vn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let i=this._listeners[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},It=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],uc=1234567,Ms=Math.PI/180,Is=180/Math.PI;Rd={DEG2RAD:Ms,RAD2DEG:Is,generateUUID:Ti,clamp:Ct,euclideanModulo:Al,mapLinear:Iu,inverseLerp:Du,lerp:Es,damp:Lu,pingpong:Nu,smoothstep:Ou,smootherstep:Uu,randInt:Bu,randFloat:Fu,randFloatSpread:Vu,seededRandom:zu,degToRad:Hu,radToDeg:ku,isPowerOfTwo:Gu,ceilPowerOfTwo:Wu,floorPowerOfTwo:Xu,setQuaternionFromProperEuler:qu,normalize:Bt,denormalize:Xi},se=class n{constructor(e=0,t=0){n.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ct(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},We=class n{constructor(e,t,i,s,r,a,o,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){let d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],h=i[7],u=i[2],p=i[5],g=i[8],_=s[0],m=s[3],f=s[6],T=s[1],S=s[4],b=s[7],N=s[2],w=s[5],I=s[8];return r[0]=a*_+o*T+l*N,r[3]=a*m+o*S+l*w,r[6]=a*f+o*b+l*I,r[1]=c*_+d*T+h*N,r[4]=c*m+d*S+h*w,r[7]=c*f+d*b+h*I,r[2]=u*_+p*T+g*N,r[5]=u*m+p*S+g*w,r[8]=u*f+p*b+g*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-i*r*d+i*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=d*a-o*c,u=o*l-d*r,p=c*r-a*l,g=t*h+i*u+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=h*_,e[1]=(s*c-d*i)*_,e[2]=(o*i-s*a)*_,e[3]=u*_,e[4]=(d*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=p*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(xa.makeScale(e,t)),this}rotate(e){return this.premultiply(xa.makeRotation(-e)),this}translate(e,t){return this.premultiply(xa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},xa=new We;fc={};Ke={enabled:!0,workingColorSpace:hs,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===lt&&(n.r=Bn(n.r),n.g=Bn(n.g),n.b=Bn(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===lt&&(n.r=Zi(n.r),n.g=Zi(n.g),n.b=Zi(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Jn?oa:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};pc=[.64,.33,.3,.6,.15,.06],mc=[.2126,.7152,.0722],gc=[.3127,.329],_c=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),vc=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ke.define({[hs]:{primaries:pc,whitePoint:gc,transfer:oa,toXYZ:_c,fromXYZ:vc,luminanceCoefficients:mc,workingColorSpaceConfig:{unpackColorSpace:Lt},outputColorSpaceConfig:{drawingBufferColorSpace:Lt}},[Lt]:{primaries:pc,whitePoint:gc,transfer:lt,toXYZ:_c,fromXYZ:vc,luminanceCoefficients:mc,outputColorSpaceConfig:{drawingBufferColorSpace:Lt}}});Bo=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement=="undefined")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Di===void 0&&(Di=Rr("canvas")),Di.width=e.width,Di.height=e.height;let i=Di.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Di}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement!="undefined"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&e instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&e instanceof ImageBitmap){let t=Rr("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Bn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Bn(t[i]/255)*255):t[i]=Bn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Ju=0,Pr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ju++}),this.uuid=Ti(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ba(s[a].image)):r.push(ba(s[a]))}else r=ba(s);i.url=r}return t||(e.images[this.uuid]=i),i}};Ku=0,Yt=class n extends Vn{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=gi,s=gi,r=bn,a=_i,o=mn,l=Fn,c=n.DEFAULT_ANISOTROPY,d=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=Ti(),this.name="",this.source=new Pr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new se(0,0),this.repeat=new se(1,1),this.center=new se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==gd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Rs:e.x=e.x-Math.floor(e.x);break;case gi:e.x=e.x<0?0:1;break;case lo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Rs:e.y=e.y-Math.floor(e.y);break;case gi:e.y=e.y<0?0:1;break;case lo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Yt.DEFAULT_IMAGE=null;Yt.DEFAULT_MAPPING=gd;Yt.DEFAULT_ANISOTROPY=1;bt=class n{constructor(e=0,t=0,i=0,s=1){n.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,l=e.elements,c=l[0],d=l[4],h=l[8],u=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(d-u)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let S=(c+1)/2,b=(p+1)/2,N=(f+1)/2,w=(d+u)/4,I=(h+_)/4,E=(g+m)/4;return S>b&&S>N?S<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(S),s=w/i,r=I/i):b>N?b<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),i=w/s,r=E/s):N<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(N),i=I/r,s=E/r),this.set(i,s,r,t),this}let T=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(u-d)*(u-d));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(h-_)/T,this.z=(u-d)/T,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Fo=class extends Vn{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new bt(0,0,e,t),this.scissorTest=!1,this.viewport=new bt(0,0,e,t);let s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:bn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let r=new Yt(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Pr(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},zn=class extends Fo{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Ir=class extends Yt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Vo=class extends Yt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Zt=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],d=i[s+2],h=i[s+3],u=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h;return}if(o===1){e[t+0]=u,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(h!==_||l!==u||c!==p||d!==g){let m=1-o,f=l*u+c*p+d*g+h*_,T=f>=0?1:-1,S=1-f*f;if(S>Number.EPSILON){let N=Math.sqrt(S),w=Math.atan2(N,f*T);m=Math.sin(m*w)/N,o=Math.sin(o*w)/N}let b=o*T;if(l=l*m+u*b,c=c*m+p*b,d=d*m+g*b,h=h*m+_*b,m===1-o){let N=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=N,c*=N,d*=N,h*=N}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,r,a){let o=i[s],l=i[s+1],c=i[s+2],d=i[s+3],h=r[a],u=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+d*h+l*p-c*u,e[t+1]=l*g+d*u+c*h-o*p,e[t+2]=c*g+d*p+o*u-l*h,e[t+3]=d*g-o*h-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(s/2),h=o(r/2),u=l(i/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=u*d*h+c*p*g,this._y=c*p*h-u*d*g,this._z=c*d*g+u*p*h,this._w=c*d*h-u*p*g;break;case"YXZ":this._x=u*d*h+c*p*g,this._y=c*p*h-u*d*g,this._z=c*d*g-u*p*h,this._w=c*d*h+u*p*g;break;case"ZXY":this._x=u*d*h-c*p*g,this._y=c*p*h+u*d*g,this._z=c*d*g+u*p*h,this._w=c*d*h-u*p*g;break;case"ZYX":this._x=u*d*h-c*p*g,this._y=c*p*h+u*d*g,this._z=c*d*g-u*p*h,this._w=c*d*h+u*p*g;break;case"YZX":this._x=u*d*h+c*p*g,this._y=c*p*h+u*d*g,this._z=c*d*g-u*p*h,this._w=c*d*h-u*p*g;break;case"XZY":this._x=u*d*h-c*p*g,this._y=c*p*h-u*d*g,this._z=c*d*g+u*p*h,this._w=c*d*h+u*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],h=t[10],u=i+o+h;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(d-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(i>o&&i>h){let p=2*Math.sqrt(1+i-o-h);this._w=(d-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>h){let p=2*Math.sqrt(1+o-i-h);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+d)/p}else{let p=2*Math.sqrt(1+h-i-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-i*c,this._z=r*d+a*c+i*l-s*o,this._w=a*d-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),d=Math.atan2(c,o),h=Math.sin((1-t)*d)/c,u=Math.sin(t*d)/c;return this._w=a*h+this._w*u,this._x=i*h+this._x*u,this._y=s*h+this._y*u,this._z=r*h+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class n{constructor(e=0,t=0,i=0){n.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(yc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(yc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),d=2*(o*t-r*s),h=2*(r*i-a*t);return this.x=t+l*c+a*h-o*d,this.y=i+l*d+o*c-r*h,this.z=s+l*h+r*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Sa.copy(this).projectOnVector(e),this.sub(Sa)}reflect(e){return this.sub(Sa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ct(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Sa=new C,yc=new Zt,nn=class{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,dn):dn.fromBufferAttribute(r,a),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Zs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Zs.copy(i.boundingBox)),Zs.applyMatrix4(e.matrixWorld),this.union(Zs)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(gs),Js.subVectors(this.max,gs),Li.subVectors(e.a,gs),Ni.subVectors(e.b,gs),Oi.subVectors(e.c,gs),Xn.subVectors(Ni,Li),qn.subVectors(Oi,Ni),ai.subVectors(Li,Oi);let t=[0,-Xn.z,Xn.y,0,-qn.z,qn.y,0,-ai.z,ai.y,Xn.z,0,-Xn.x,qn.z,0,-qn.x,ai.z,0,-ai.x,-Xn.y,Xn.x,0,-qn.y,qn.x,0,-ai.y,ai.x,0];return!Ma(t,Li,Ni,Oi,Js)||(t=[1,0,0,0,1,0,0,0,1],!Ma(t,Li,Ni,Oi,Js))?!1:(Ks.crossVectors(Xn,qn),t=[Ks.x,Ks.y,Ks.z],Ma(t,Li,Ni,Oi,Js))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Rn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Rn=[new C,new C,new C,new C,new C,new C,new C,new C],dn=new C,Zs=new nn,Li=new C,Ni=new C,Oi=new C,Xn=new C,qn=new C,ai=new C,gs=new C,Js=new C,Ks=new C,oi=new C;Qu=new nn,_s=new C,Ea=new C,is=class{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Qu.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_s.subVectors(e,this.center);let t=_s.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(_s,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ea.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_s.copy(e.center).add(Ea)),this.expandByPoint(_s.copy(e.center).sub(Ea))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Pn=new C,Aa=new C,Qs=new C,jn=new C,Ta=new C,er=new C,wa=new C,ss=class{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Pn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Pn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Pn.copy(this.origin).addScaledVector(this.direction,t),Pn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Aa.copy(e).add(t).multiplyScalar(.5),Qs.copy(t).sub(e).normalize(),jn.copy(this.origin).sub(Aa);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Qs),o=jn.dot(this.direction),l=-jn.dot(Qs),c=jn.lengthSq(),d=Math.abs(1-a*a),h,u,p,g;if(d>0)if(h=a*l-o,u=a*o-l,g=r*d,h>=0)if(u>=-g)if(u<=g){let _=1/d;h*=_,u*=_,p=h*(h+a*u+2*o)+u*(a*h+u+2*l)+c}else u=r,h=Math.max(0,-(a*u+o)),p=-h*h+u*(u+2*l)+c;else u=-r,h=Math.max(0,-(a*u+o)),p=-h*h+u*(u+2*l)+c;else u<=-g?(h=Math.max(0,-(-a*r+o)),u=h>0?-r:Math.min(Math.max(-r,-l),r),p=-h*h+u*(u+2*l)+c):u<=g?(h=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(h=Math.max(0,-(a*r+o)),u=h>0?r:Math.min(Math.max(-r,-l),r),p=-h*h+u*(u+2*l)+c);else u=a>0?-r:r,h=Math.max(0,-(a*u+o)),p=-h*h+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Aa).addScaledVector(Qs,u),p}intersectSphere(e,t){Pn.subVectors(e.center,this.origin);let i=Pn.dot(this.direction),s=Pn.dot(Pn)-i*i,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l,c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),d>=0?(r=(e.min.y-u.y)*d,a=(e.max.y-u.y)*d):(r=(e.max.y-u.y)*d,a=(e.min.y-u.y)*d),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-u.z)*h,l=(e.max.z-u.z)*h):(o=(e.max.z-u.z)*h,l=(e.min.z-u.z)*h),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Pn)!==null}intersectTriangle(e,t,i,s,r){Ta.subVectors(t,e),er.subVectors(i,e),wa.crossVectors(Ta,er);let a=this.direction.dot(wa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;jn.subVectors(this.origin,e);let l=o*this.direction.dot(er.crossVectors(jn,er));if(l<0)return null;let c=o*this.direction.dot(Ta.cross(jn));if(c<0||l+c>a)return null;let d=-o*jn.dot(wa);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},yt=class n{constructor(e,t,i,s,r,a,o,l,c,d,h,u,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,d,h,u,p,g,_,m)}set(e,t,i,s,r,a,o,l,c,d,h,u,p,g,_,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=d,f[10]=h,f[14]=u,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/Ui.setFromMatrixColumn(e,0).length(),r=1/Ui.setFromMatrixColumn(e,1).length(),a=1/Ui.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let u=a*d,p=a*h,g=o*d,_=o*h;t[0]=l*d,t[4]=-l*h,t[8]=c,t[1]=p+g*c,t[5]=u-_*c,t[9]=-o*l,t[2]=_-u*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){let u=l*d,p=l*h,g=c*d,_=c*h;t[0]=u+_*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*h,t[5]=a*d,t[9]=-o,t[2]=p*o-g,t[6]=_+u*o,t[10]=a*l}else if(e.order==="ZXY"){let u=l*d,p=l*h,g=c*d,_=c*h;t[0]=u-_*o,t[4]=-a*h,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*d,t[9]=_-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let u=a*d,p=a*h,g=o*d,_=o*h;t[0]=l*d,t[4]=g*c-p,t[8]=u*c+_,t[1]=l*h,t[5]=_*c+u,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let u=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*d,t[4]=_-u*h,t[8]=g*h+p,t[1]=h,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=p*h+g,t[10]=u-_*h}else if(e.order==="XZY"){let u=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*d,t[4]=-h,t[8]=c*d,t[1]=u*h+_,t[5]=a*d,t[9]=p*h-g,t[2]=g*h-p,t[6]=o*d,t[10]=_*h+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ef,e,tf)}lookAt(e,t,i){let s=this.elements;return Xt.subVectors(e,t),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),$n.crossVectors(i,Xt),$n.lengthSq()===0&&(Math.abs(i.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),$n.crossVectors(i,Xt)),$n.normalize(),tr.crossVectors(Xt,$n),s[0]=$n.x,s[4]=tr.x,s[8]=Xt.x,s[1]=$n.y,s[5]=tr.y,s[9]=Xt.y,s[2]=$n.z,s[6]=tr.z,s[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],h=i[5],u=i[9],p=i[13],g=i[2],_=i[6],m=i[10],f=i[14],T=i[3],S=i[7],b=i[11],N=i[15],w=s[0],I=s[4],E=s[8],y=s[12],v=s[1],R=s[5],F=s[9],U=s[13],V=s[2],X=s[6],k=s[10],Q=s[14],G=s[3],ce=s[7],ge=s[11],Se=s[15];return r[0]=a*w+o*v+l*V+c*G,r[4]=a*I+o*R+l*X+c*ce,r[8]=a*E+o*F+l*k+c*ge,r[12]=a*y+o*U+l*Q+c*Se,r[1]=d*w+h*v+u*V+p*G,r[5]=d*I+h*R+u*X+p*ce,r[9]=d*E+h*F+u*k+p*ge,r[13]=d*y+h*U+u*Q+p*Se,r[2]=g*w+_*v+m*V+f*G,r[6]=g*I+_*R+m*X+f*ce,r[10]=g*E+_*F+m*k+f*ge,r[14]=g*y+_*U+m*Q+f*Se,r[3]=T*w+S*v+b*V+N*G,r[7]=T*I+S*R+b*X+N*ce,r[11]=T*E+S*F+b*k+N*ge,r[15]=T*y+S*U+b*Q+N*Se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],h=e[6],u=e[10],p=e[14],g=e[3],_=e[7],m=e[11],f=e[15];return g*(+r*l*h-s*c*h-r*o*u+i*c*u+s*o*p-i*l*p)+_*(+t*l*p-t*c*u+r*a*u-s*a*p+s*c*d-r*l*d)+m*(+t*c*h-t*o*p-r*a*h+i*a*p+r*o*d-i*c*d)+f*(-s*o*d-t*l*h+t*o*u+s*a*h-i*a*u+i*l*d)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=e[9],u=e[10],p=e[11],g=e[12],_=e[13],m=e[14],f=e[15],T=h*m*c-_*u*c+_*l*p-o*m*p-h*l*f+o*u*f,S=g*u*c-d*m*c-g*l*p+a*m*p+d*l*f-a*u*f,b=d*_*c-g*h*c+g*o*p-a*_*p-d*o*f+a*h*f,N=g*h*l-d*_*l-g*o*u+a*_*u+d*o*m-a*h*m,w=t*T+i*S+s*b+r*N;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let I=1/w;return e[0]=T*I,e[1]=(_*u*r-h*m*r-_*s*p+i*m*p+h*s*f-i*u*f)*I,e[2]=(o*m*r-_*l*r+_*s*c-i*m*c-o*s*f+i*l*f)*I,e[3]=(h*l*r-o*u*r-h*s*c+i*u*c+o*s*p-i*l*p)*I,e[4]=S*I,e[5]=(d*m*r-g*u*r+g*s*p-t*m*p-d*s*f+t*u*f)*I,e[6]=(g*l*r-a*m*r-g*s*c+t*m*c+a*s*f-t*l*f)*I,e[7]=(a*u*r-d*l*r+d*s*c-t*u*c-a*s*p+t*l*p)*I,e[8]=b*I,e[9]=(g*h*r-d*_*r-g*i*p+t*_*p+d*i*f-t*h*f)*I,e[10]=(a*_*r-g*o*r+g*i*c-t*_*c-a*i*f+t*o*f)*I,e[11]=(d*o*r-a*h*r-d*i*c+t*h*c+a*i*p-t*o*p)*I,e[12]=N*I,e[13]=(d*_*s-g*h*s+g*i*u-t*_*u-d*i*m+t*h*m)*I,e[14]=(g*o*s-a*_*s-g*i*l+t*_*l+a*i*m-t*o*m)*I,e[15]=(a*h*s-d*o*s+d*i*l-t*h*l-a*i*u+t*o*u)*I,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,d=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+i,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,d=a+a,h=o+o,u=r*c,p=r*d,g=r*h,_=a*d,m=a*h,f=o*h,T=l*c,S=l*d,b=l*h,N=i.x,w=i.y,I=i.z;return s[0]=(1-(_+f))*N,s[1]=(p+b)*N,s[2]=(g-S)*N,s[3]=0,s[4]=(p-b)*w,s[5]=(1-(u+f))*w,s[6]=(m+T)*w,s[7]=0,s[8]=(g+S)*I,s[9]=(m-T)*I,s[10]=(1-(u+_))*I,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,r=Ui.set(s[0],s[1],s[2]).length(),a=Ui.set(s[4],s[5],s[6]).length(),o=Ui.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],hn.copy(this);let c=1/r,d=1/a,h=1/o;return hn.elements[0]*=c,hn.elements[1]*=c,hn.elements[2]*=c,hn.elements[4]*=d,hn.elements[5]*=d,hn.elements[6]*=d,hn.elements[8]*=h,hn.elements[9]*=h,hn.elements[10]*=h,t.setFromRotationMatrix(hn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=Un){let l=this.elements,c=2*r/(t-e),d=2*r/(i-s),h=(t+e)/(t-e),u=(i+s)/(i-s),p,g;if(o===Un)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Cr)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Un){let l=this.elements,c=1/(t-e),d=1/(i-s),h=1/(a-r),u=(t+e)*c,p=(i+s)*d,g,_;if(o===Un)g=(a+r)*h,_=-2*h;else if(o===Cr)g=r*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Ui=new C,hn=new yt,ef=new C(0,0,0),tf=new C(1,1,1),$n=new C,tr=new C,Xt=new C,xc=new yt,bc=new Zt,Sn=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],h=s[2],u=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ct(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return xc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(xc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return bc.setFromEuler(this),this.setFromQuaternion(bc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Sn.DEFAULT_ORDER="XYZ";Dr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},nf=0,Sc=new C,Bi=new Zt,In=new yt,nr=new C,vs=new C,sf=new C,rf=new Zt,Mc=new C(1,0,0),Ec=new C(0,1,0),Ac=new C(0,0,1),Tc={type:"added"},af={type:"removed"},Fi={type:"childadded",child:null},Ca={type:"childremoved",child:null},Nt=class n extends Vn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:nf++}),this.uuid=Ti(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new C,t=new Sn,i=new Zt,s=new C(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new yt},normalMatrix:{value:new We}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Bi.setFromAxisAngle(e,t),this.quaternion.multiply(Bi),this}rotateOnWorldAxis(e,t){return Bi.setFromAxisAngle(e,t),this.quaternion.premultiply(Bi),this}rotateX(e){return this.rotateOnAxis(Mc,e)}rotateY(e){return this.rotateOnAxis(Ec,e)}rotateZ(e){return this.rotateOnAxis(Ac,e)}translateOnAxis(e,t){return Sc.copy(e).applyQuaternion(this.quaternion),this.position.add(Sc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mc,e)}translateY(e){return this.translateOnAxis(Ec,e)}translateZ(e){return this.translateOnAxis(Ac,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?nr.copy(e):nr.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(vs,nr,this.up):In.lookAt(nr,vs,this.up),this.quaternion.setFromRotationMatrix(In),s&&(In.extractRotation(s.matrixWorld),Bi.setFromRotationMatrix(In),this.quaternion.premultiply(Bi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Tc),Fi.child=e,this.dispatchEvent(Fi),Fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(af),Ca.child=e,this.dispatchEvent(Ca),Ca.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),In.multiply(e.parent.matrixWorld)),e.applyMatrix4(In),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Tc),Fi.child=e,this.dispatchEvent(Fi),Fi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,e,sf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,rf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){let h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),h=a(e.shapes),u=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),h.length>0&&(i.shapes=h),u.length>0&&(i.skeletons=u),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){let l=[];for(let c in o){let d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Nt.DEFAULT_UP=new C(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;un=new C,Dn=new C,Ra=new C,Ln=new C,Vi=new C,zi=new C,wc=new C,Pa=new C,Ia=new C,Da=new C,La=new bt,Na=new bt,Oa=new bt,pi=class n{constructor(e=new C,t=new C,i=new C){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),un.subVectors(e,t),s.cross(un);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){un.subVectors(s,t),Dn.subVectors(i,t),Ra.subVectors(e,t);let a=un.dot(un),o=un.dot(Dn),l=un.dot(Ra),c=Dn.dot(Dn),d=Dn.dot(Ra),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;let u=1/h,p=(c*l-o*d)*u,g=(a*d-o*l)*u;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ln.x),l.addScaledVector(a,Ln.y),l.addScaledVector(o,Ln.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return La.setScalar(0),Na.setScalar(0),Oa.setScalar(0),La.fromBufferAttribute(e,t),Na.fromBufferAttribute(e,i),Oa.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(La,r.x),a.addScaledVector(Na,r.y),a.addScaledVector(Oa,r.z),a}static isFrontFacing(e,t,i,s){return un.subVectors(i,t),Dn.subVectors(e,t),un.cross(Dn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return un.subVectors(this.c,this.b),Dn.subVectors(this.a,this.b),un.cross(Dn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,a,o;Vi.subVectors(s,i),zi.subVectors(r,i),Pa.subVectors(e,i);let l=Vi.dot(Pa),c=zi.dot(Pa);if(l<=0&&c<=0)return t.copy(i);Ia.subVectors(e,s);let d=Vi.dot(Ia),h=zi.dot(Ia);if(d>=0&&h<=d)return t.copy(s);let u=l*h-d*c;if(u<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(i).addScaledVector(Vi,a);Da.subVectors(e,r);let p=Vi.dot(Da),g=zi.dot(Da);if(g>=0&&p<=g)return t.copy(r);let _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(zi,o);let m=d*g-p*h;if(m<=0&&h-d>=0&&p-g>=0)return wc.subVectors(r,s),o=(h-d)/(h-d+(p-g)),t.copy(s).addScaledVector(wc,o);let f=1/(m+_+u);return a=_*f,o=u*f,t.copy(i).addScaledVector(Vi,a).addScaledVector(zi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Id={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},ir={h:0,s:0,l:0};je=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ke.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=Ke.workingColorSpace){if(e=Al(e,1),t=Ct(t,0,1),i=Ct(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Ua(a,r,e+1/3),this.g=Ua(a,r,e),this.b=Ua(a,r,e-1/3)}return Ke.toWorkingColorSpace(this,s),this}setStyle(e,t=Lt){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){let i=Id[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bn(e.r),this.g=Bn(e.g),this.b=Bn(e.b),this}copyLinearToSRGB(e){return this.r=Zi(e.r),this.g=Zi(e.g),this.b=Zi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return Ke.fromWorkingColorSpace(Dt.copy(this),e),Math.round(Ct(Dt.r*255,0,255))*65536+Math.round(Ct(Dt.g*255,0,255))*256+Math.round(Ct(Dt.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.fromWorkingColorSpace(Dt.copy(this),t);let i=Dt.r,s=Dt.g,r=Dt.b,a=Math.max(i,s,r),o=Math.min(i,s,r),l,c,d=(o+a)/2;if(o===a)l=0,c=0;else{let h=a-o;switch(c=d<=.5?h/(a+o):h/(2-a-o),a){case i:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-i)/h+2;break;case r:l=(i-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=Ke.workingColorSpace){return Ke.fromWorkingColorSpace(Dt.copy(this),t),e.r=Dt.r,e.g=Dt.g,e.b=Dt.b,e}getStyle(e=Lt){Ke.fromWorkingColorSpace(Dt.copy(this),e);let t=Dt.r,i=Dt.g,s=Dt.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Yn),this.setHSL(Yn.h+e,Yn.s+t,Yn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Yn),e.getHSL(ir);let i=Es(Yn.h,ir.h,t),s=Es(Yn.s,ir.s,t),r=Es(Yn.l,ir.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Dt=new je;je.NAMES=Id;of=0,Hn=class extends Vn{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:of++}),this.uuid=Ti(),this.name="",this.blending=$i,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ja,this.blendDst=Ka,this.blendEquation=fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=Ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ii,this.stencilZFail=Ii,this.stencilZPass=Ii,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==$i&&(i.blending=this.blending),this.side!==ei&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ja&&(i.blendSrc=this.blendSrc),this.blendDst!==Ka&&(i.blendDst=this.blendDst),this.blendEquation!==fi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ki&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ii&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ii&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ii&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Lr=class extends Hn{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=md,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},St=new C,sr=new se,$t=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=dc,this.updateRanges=[],this.gpuType=On,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)sr.fromBufferAttribute(this,t),sr.applyMatrix3(e),this.setXY(t,sr.x,sr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix3(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Bt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Bt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),i=Bt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),i=Bt(i,this.array),s=Bt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Bt(t,this.array),i=Bt(i,this.array),s=Bt(s,this.array),r=Bt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==dc&&(e.usage=this.usage),e}},Nr=class extends $t{constructor(e,t,i){super(new Uint16Array(e),t,i)}},Or=class extends $t{constructor(e,t,i){super(new Uint32Array(e),t,i)}},gt=class extends $t{constructor(e,t,i){super(new Float32Array(e),t,i)}},lf=0,tn=new yt,Ba=new Nt,Hi=new C,qt=new nn,ys=new nn,wt=new C,kt=class n extends Vn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:lf++}),this.uuid=Ti(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Pd(e)?Or:Nr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new We().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return tn.makeRotationFromQuaternion(e),this.applyMatrix4(tn),this}rotateX(e){return tn.makeRotationX(e),this.applyMatrix4(tn),this}rotateY(e){return tn.makeRotationY(e),this.applyMatrix4(tn),this}rotateZ(e){return tn.makeRotationZ(e),this.applyMatrix4(tn),this}translate(e,t,i){return tn.makeTranslation(e,t,i),this.applyMatrix4(tn),this}scale(e,t,i){return tn.makeScale(e,t,i),this.applyMatrix4(tn),this}lookAt(e){return Ba.lookAt(e),Ba.updateMatrix(),this.applyMatrix4(Ba.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hi).negate(),this.translate(Hi.x,Hi.y,Hi.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new gt(i,3))}else{for(let i=0,s=t.count;i<s;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new nn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];qt.setFromBufferAttribute(r),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,qt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,qt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(qt.min),this.boundingBox.expandByPoint(qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new is);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let i=this.boundingSphere.center;if(qt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];ys.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(qt.min,ys.min),qt.expandByPoint(wt),wt.addVectors(qt.max,ys.max),qt.expandByPoint(wt)):(qt.expandByPoint(ys.min),qt.expandByPoint(ys.max))}qt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)wt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(wt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)wt.fromBufferAttribute(o,c),l&&(Hi.fromBufferAttribute(e,c),wt.add(Hi)),s=Math.max(s,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $t(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let E=0;E<i.count;E++)o[E]=new C,l[E]=new C;let c=new C,d=new C,h=new C,u=new se,p=new se,g=new se,_=new C,m=new C;function f(E,y,v){c.fromBufferAttribute(i,E),d.fromBufferAttribute(i,y),h.fromBufferAttribute(i,v),u.fromBufferAttribute(r,E),p.fromBufferAttribute(r,y),g.fromBufferAttribute(r,v),d.sub(c),h.sub(c),p.sub(u),g.sub(u);let R=1/(p.x*g.y-g.x*p.y);isFinite(R)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(R),m.copy(h).multiplyScalar(p.x).addScaledVector(d,-g.x).multiplyScalar(R),o[E].add(_),o[y].add(_),o[v].add(_),l[E].add(m),l[y].add(m),l[v].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let E=0,y=T.length;E<y;++E){let v=T[E],R=v.start,F=v.count;for(let U=R,V=R+F;U<V;U+=3)f(e.getX(U+0),e.getX(U+1),e.getX(U+2))}let S=new C,b=new C,N=new C,w=new C;function I(E){N.fromBufferAttribute(s,E),w.copy(N);let y=o[E];S.copy(y),S.sub(N.multiplyScalar(N.dot(y))).normalize(),b.crossVectors(w,y);let R=b.dot(l[E])<0?-1:1;a.setXYZW(E,S.x,S.y,S.z,R)}for(let E=0,y=T.length;E<y;++E){let v=T[E],R=v.start,F=v.count;for(let U=R,V=R+F;U<V;U+=3)I(e.getX(U+0)),I(e.getX(U+1)),I(e.getX(U+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new $t(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,p=i.count;u<p;u++)i.setXYZ(u,0,0,0);let s=new C,r=new C,a=new C,o=new C,l=new C,c=new C,d=new C,h=new C;if(e)for(let u=0,p=e.count;u<p;u+=3){let g=e.getX(u+0),_=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(d),l.add(d),c.add(d),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),d.subVectors(a,r),h.subVectors(s,r),d.cross(h),i.setXYZ(u+0,d.x,d.y,d.z),i.setXYZ(u+1,d.x,d.y,d.z),i.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,l){let c=o.array,d=o.itemSize,h=o.normalized,u=new c.constructor(l.length*d),p=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*d;for(let f=0;f<d;f++)u[g++]=c[p++]}return new $t(u,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,i);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let d=0,h=c.length;d<h;d++){let u=c[d],p=e(u,i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],d=[];for(let h=0,u=c.length;h<u;h++){let p=c[h];d.push(p.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let s=e.attributes;for(let c in s){let d=s[c];this.setAttribute(c,d.clone(t))}let r=e.morphAttributes;for(let c in r){let d=[],h=r[c];for(let u=0,p=h.length;u<p;u++)d.push(h[u].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,d=a.length;c<d;c++){let h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Cc=new yt,li=new ss,rr=new is,Rc=new C,ar=new C,or=new C,lr=new C,Fa=new C,cr=new C,Pc=new C,dr=new C,He=class extends Nt{constructor(e=new kt,t=new Lr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){cr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let d=o[l],h=r[l];d!==0&&(Fa.fromBufferAttribute(h,e),a?cr.addScaledVector(Fa,d):cr.addScaledVector(Fa.sub(t),d))}t.add(cr)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),rr.copy(i.boundingSphere),rr.applyMatrix4(r),li.copy(e.ray).recast(e.near),!(rr.containsPoint(li.origin)===!1&&(li.intersectSphere(rr,Rc)===null||li.origin.distanceToSquared(Rc)>(e.far-e.near)**2))&&(Cc.copy(r).invert(),li.copy(e.ray).applyMatrix4(Cc),!(i.boundingBox!==null&&li.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,li)))}_computeIntersections(e,t,i){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,h=r.attributes.normal,u=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){let m=u[g],f=a[m.materialIndex],T=Math.max(m.start,p.start),S=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let b=T,N=S;b<N;b+=3){let w=o.getX(b),I=o.getX(b+1),E=o.getX(b+2);s=hr(this,f,e,i,c,d,h,w,I,E),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let T=o.getX(m),S=o.getX(m+1),b=o.getX(m+2);s=hr(this,a,e,i,c,d,h,T,S,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){let m=u[g],f=a[m.materialIndex],T=Math.max(m.start,p.start),S=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let b=T,N=S;b<N;b+=3){let w=b,I=b+1,E=b+2;s=hr(this,f,e,i,c,d,h,w,I,E),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let T=m,S=m+1,b=m+2;s=hr(this,a,e,i,c,d,h,T,S,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};Ot=class n extends kt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],d=[],h=[],u=0,p=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new gt(c,3)),this.setAttribute("normal",new gt(d,3)),this.setAttribute("uv",new gt(h,2));function g(_,m,f,T,S,b,N,w,I,E,y){let v=b/I,R=N/E,F=b/2,U=N/2,V=w/2,X=I+1,k=E+1,Q=0,G=0,ce=new C;for(let ge=0;ge<k;ge++){let Se=ge*R-U;for(let ze=0;ze<X;ze++){let nt=ze*v-F;ce[_]=nt*T,ce[m]=Se*S,ce[f]=V,c.push(ce.x,ce.y,ce.z),ce[_]=0,ce[m]=0,ce[f]=w>0?1:-1,d.push(ce.x,ce.y,ce.z),h.push(ze/I),h.push(1-ge/E),Q+=1}}for(let ge=0;ge<E;ge++)for(let Se=0;Se<I;Se++){let ze=u+Se+X*ge,nt=u+Se+X*(ge+1),$=u+(Se+1)+X*(ge+1),ne=u+(Se+1)+X*ge;l.push(ze,nt,ne),l.push(nt,$,ne),G+=6}o.addGroup(p,G,y),p+=G,u+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};hf={clone:rs,merge:Ft},uf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ff=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Mn=class extends Hn{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uf,this.fragmentShader=ff,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=rs(e.uniforms),this.uniformsGroups=df(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Ur=class extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=Un}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Zn=new C,Ic=new se,Dc=new se,jt=class extends Ur{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Is*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ms*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Is*2*Math.atan(Math.tan(Ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Zn.x,Zn.y).multiplyScalar(-e/Zn.z),Zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Zn.x,Zn.y).multiplyScalar(-e/Zn.z)}getViewSize(e,t){return this.getViewBounds(e,Ic,Dc),t.subVectors(Dc,Ic)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ms*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ki=-90,Gi=1,zo=class extends Nt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new jt(ki,Gi,e,t);s.layers=this.layers,this.add(s);let r=new jt(ki,Gi,e,t);r.layers=this.layers,this.add(r);let a=new jt(ki,Gi,e,t);a.layers=this.layers,this.add(a);let o=new jt(ki,Gi,e,t);o.layers=this.layers,this.add(o);let l=new jt(ki,Gi,e,t);l.layers=this.layers,this.add(l);let c=new jt(ki,Gi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Un)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Cr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,d]=this.children,h=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(h,u,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Br=class extends Yt{constructor(e,t,i,s,r,a,o,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:Qi,super(e,t,i,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ho=class extends zn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Br(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:bn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ot(5,5,5),r=new Mn({name:"CubemapFromEquirect",uniforms:rs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ht,blending:Kn});r.uniforms.tEquirect.value=t;let a=new He(s,r),o=t.minFilter;return t.minFilter===_i&&(t.minFilter=bn),new zo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}},Va=new C,pf=new C,mf=new We,fn=class{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=Va.subVectors(i,t).cross(pf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Va),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||mf.getNormalMatrix(e),s=this.coplanarPoint(Va).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ci=new is,ur=new C,Ds=class{constructor(e=new fn,t=new fn,i=new fn,s=new fn,r=new fn,a=new fn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Un){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],d=s[5],h=s[6],u=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],T=s[13],S=s[14],b=s[15];if(i[0].setComponents(l-r,u-c,m-p,b-f).normalize(),i[1].setComponents(l+r,u+c,m+p,b+f).normalize(),i[2].setComponents(l+a,u+d,m+g,b+T).normalize(),i[3].setComponents(l-a,u-d,m-g,b-T).normalize(),i[4].setComponents(l-o,u-h,m-_,b-S).normalize(),t===Un)i[5].setComponents(l+o,u+h,m+_,b+S).normalize();else if(t===Cr)i[5].setComponents(o,h,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(e){return ci.center.set(0,0,0),ci.radius=.7071067811865476,ci.applyMatrix4(e.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(ur.x=s.normal.x>0?e.max.x:e.min.x,ur.y=s.normal.y>0?e.max.y:e.min.y,ur.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ur)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};sn=class n extends kt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,d=l+1,h=e/o,u=t/l,p=[],g=[],_=[],m=[];for(let f=0;f<d;f++){let T=f*u-a;for(let S=0;S<c;S++){let b=S*h-r;g.push(b,-T,0),_.push(0,0,1),m.push(S/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let T=0;T<o;T++){let S=T+c*f,b=T+c*(f+1),N=T+1+c*(f+1),w=T+1+c*f;p.push(S,b,w),p.push(b,N,w)}this.setIndex(p),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(_,3)),this.setAttribute("uv",new gt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},_f=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vf=`#ifdef USE_ALPHAHASH
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
#endif`,yf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Sf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mf=`#ifdef USE_AOMAP
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
#endif`,Ef=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Af=`#ifdef USE_BATCHING
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
#endif`,Tf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Rf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Pf=`#ifdef USE_IRIDESCENCE
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
#endif`,If=`#ifdef USE_BUMPMAP
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
#endif`,Df=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Lf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Nf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Of=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Uf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Bf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ff=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Vf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,zf=`#define PI 3.141592653589793
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
} // validated`,Hf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,kf=`vec3 transformedNormal = objectNormal;
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
#endif`,Gf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jf="gl_FragColor = linearToOutputTexel( gl_FragColor );",$f=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Yf=`#ifdef USE_ENVMAP
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
#endif`,Zf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Jf=`#ifdef USE_ENVMAP
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
#endif`,Kf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qf=`#ifdef USE_ENVMAP
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
#endif`,ep=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,tp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,np=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ip=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sp=`#ifdef USE_GRADIENTMAP
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
}`,rp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ap=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,op=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lp=`uniform bool receiveShadow;
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
#endif`,cp=`#ifdef USE_ENVMAP
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
#endif`,dp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,up=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pp=`PhysicalMaterial material;
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
#endif`,mp=`struct PhysicalMaterial {
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
}`,gp=`
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
#endif`,_p=`#if defined( RE_IndirectDiffuse )
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
#endif`,vp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Mp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ep=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ap=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Tp=`#if defined( USE_POINTS_UV )
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
#endif`,wp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ip=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dp=`#ifdef USE_MORPHTARGETS
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
#endif`,Lp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Np=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Op=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Vp=`#ifdef USE_NORMALMAP
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
#endif`,zp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Hp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Gp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,qp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,$p=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Zp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Kp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,em=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,tm=`float getShadowMask() {
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
}`,nm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,im=`#ifdef USE_SKINNING
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
#endif`,sm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rm=`#ifdef USE_SKINNING
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
#endif`,am=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,om=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,dm=`#ifdef USE_TRANSMISSION
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
#endif`,hm=`#ifdef USE_TRANSMISSION
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
#endif`,um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,gm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_m=`uniform sampler2D t2D;
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
}`,vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ym=`#ifdef ENVMAP_TYPE_CUBE
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
}`,xm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sm=`#include <common>
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
}`,Mm=`#if DEPTH_PACKING == 3200
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
}`,Em=`#define DISTANCE
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
}`,Am=`#define DISTANCE
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
}`,Tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,wm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cm=`uniform float scale;
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
}`,Rm=`uniform vec3 diffuse;
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
}`,Pm=`#include <common>
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
}`,Im=`uniform vec3 diffuse;
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
}`,Dm=`#define LAMBERT
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
}`,Lm=`#define LAMBERT
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
}`,Nm=`#define MATCAP
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
}`,Om=`#define MATCAP
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
}`,Um=`#define NORMAL
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
}`,Bm=`#define NORMAL
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
}`,Fm=`#define PHONG
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
}`,Vm=`#define PHONG
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
}`,zm=`#define STANDARD
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
}`,Hm=`#define STANDARD
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
}`,km=`#define TOON
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
}`,Gm=`#define TOON
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
}`,Wm=`uniform float size;
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
}`,Xm=`uniform vec3 diffuse;
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
}`,qm=`#include <common>
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
}`,jm=`uniform vec3 color;
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
}`,$m=`uniform float rotation;
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
}`,Ym=`uniform vec3 diffuse;
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
}`,qe={alphahash_fragment:_f,alphahash_pars_fragment:vf,alphamap_fragment:yf,alphamap_pars_fragment:xf,alphatest_fragment:bf,alphatest_pars_fragment:Sf,aomap_fragment:Mf,aomap_pars_fragment:Ef,batching_pars_vertex:Af,batching_vertex:Tf,begin_vertex:wf,beginnormal_vertex:Cf,bsdfs:Rf,iridescence_fragment:Pf,bumpmap_pars_fragment:If,clipping_planes_fragment:Df,clipping_planes_pars_fragment:Lf,clipping_planes_pars_vertex:Nf,clipping_planes_vertex:Of,color_fragment:Uf,color_pars_fragment:Bf,color_pars_vertex:Ff,color_vertex:Vf,common:zf,cube_uv_reflection_fragment:Hf,defaultnormal_vertex:kf,displacementmap_pars_vertex:Gf,displacementmap_vertex:Wf,emissivemap_fragment:Xf,emissivemap_pars_fragment:qf,colorspace_fragment:jf,colorspace_pars_fragment:$f,envmap_fragment:Yf,envmap_common_pars_fragment:Zf,envmap_pars_fragment:Jf,envmap_pars_vertex:Kf,envmap_physical_pars_fragment:cp,envmap_vertex:Qf,fog_vertex:ep,fog_pars_vertex:tp,fog_fragment:np,fog_pars_fragment:ip,gradientmap_pars_fragment:sp,lightmap_pars_fragment:rp,lights_lambert_fragment:ap,lights_lambert_pars_fragment:op,lights_pars_begin:lp,lights_toon_fragment:dp,lights_toon_pars_fragment:hp,lights_phong_fragment:up,lights_phong_pars_fragment:fp,lights_physical_fragment:pp,lights_physical_pars_fragment:mp,lights_fragment_begin:gp,lights_fragment_maps:_p,lights_fragment_end:vp,logdepthbuf_fragment:yp,logdepthbuf_pars_fragment:xp,logdepthbuf_pars_vertex:bp,logdepthbuf_vertex:Sp,map_fragment:Mp,map_pars_fragment:Ep,map_particle_fragment:Ap,map_particle_pars_fragment:Tp,metalnessmap_fragment:wp,metalnessmap_pars_fragment:Cp,morphinstance_vertex:Rp,morphcolor_vertex:Pp,morphnormal_vertex:Ip,morphtarget_pars_vertex:Dp,morphtarget_vertex:Lp,normal_fragment_begin:Np,normal_fragment_maps:Op,normal_pars_fragment:Up,normal_pars_vertex:Bp,normal_vertex:Fp,normalmap_pars_fragment:Vp,clearcoat_normal_fragment_begin:zp,clearcoat_normal_fragment_maps:Hp,clearcoat_pars_fragment:kp,iridescence_pars_fragment:Gp,opaque_fragment:Wp,packing:Xp,premultiplied_alpha_fragment:qp,project_vertex:jp,dithering_fragment:$p,dithering_pars_fragment:Yp,roughnessmap_fragment:Zp,roughnessmap_pars_fragment:Jp,shadowmap_pars_fragment:Kp,shadowmap_pars_vertex:Qp,shadowmap_vertex:em,shadowmask_pars_fragment:tm,skinbase_vertex:nm,skinning_pars_vertex:im,skinning_vertex:sm,skinnormal_vertex:rm,specularmap_fragment:am,specularmap_pars_fragment:om,tonemapping_fragment:lm,tonemapping_pars_fragment:cm,transmission_fragment:dm,transmission_pars_fragment:hm,uv_pars_fragment:um,uv_pars_vertex:fm,uv_vertex:pm,worldpos_vertex:mm,background_vert:gm,background_frag:_m,backgroundCube_vert:vm,backgroundCube_frag:ym,cube_vert:xm,cube_frag:bm,depth_vert:Sm,depth_frag:Mm,distanceRGBA_vert:Em,distanceRGBA_frag:Am,equirect_vert:Tm,equirect_frag:wm,linedashed_vert:Cm,linedashed_frag:Rm,meshbasic_vert:Pm,meshbasic_frag:Im,meshlambert_vert:Dm,meshlambert_frag:Lm,meshmatcap_vert:Nm,meshmatcap_frag:Om,meshnormal_vert:Um,meshnormal_frag:Bm,meshphong_vert:Fm,meshphong_frag:Vm,meshphysical_vert:zm,meshphysical_frag:Hm,meshtoon_vert:km,meshtoon_frag:Gm,points_vert:Wm,points_frag:Xm,shadow_vert:qm,shadow_frag:jm,sprite_vert:$m,sprite_frag:Ym},de={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},xn={basic:{uniforms:Ft([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Ft([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new je(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Ft([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Ft([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Ft([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new je(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Ft([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Ft([de.points,de.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Ft([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Ft([de.common,de.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Ft([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Ft([de.sprite,de.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:Ft([de.common,de.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:Ft([de.lights,de.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};xn.physical={uniforms:Ft([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};fr={r:0,b:0,g:0},di=new Sn,Zm=new yt;as=class extends Ur{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},qi=4,Lc=[.125,.215,.35,.446,.526,.582],mi=20,za=new as,Nc=new je,Ha=null,ka=0,Ga=0,Wa=!1,ui=(1+Math.sqrt(5))/2,Wi=1/ui,Oc=[new C(-ui,Wi,0),new C(ui,Wi,0),new C(-Wi,0,ui),new C(Wi,0,ui),new C(0,ui,-Wi),new C(0,ui,Wi),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],Fr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){Ha=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),Ga=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ha,ka,Ga),this._renderer.xr.enabled=Wa,e.scissorTest=!1,pr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Qi||e.mapping===es?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ha=this._renderer.getRenderTarget(),ka=this._renderer.getActiveCubeFace(),Ga=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:bn,minFilter:bn,generateMipmaps:!1,type:ks,format:mn,colorSpace:hs,depthBuffer:!1},s=Uc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Uc(e,t,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ig(r)),this._blurMaterial=sg(r,e,t)}return s}_compileMaterial(e){let t=new He(this._lodPlanes[0],e);this._renderer.compile(t,za)}_sceneToCubeUV(e,t,i,s){let o=new jt(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,u=d.toneMapping;d.getClearColor(Nc),d.toneMapping=Qn,d.autoClear=!1;let p=new Lr({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),g=new He(new Ot,p),_=!1,m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(Nc),_=!0);for(let f=0;f<6;f++){let T=f%3;T===0?(o.up.set(0,l[f],0),o.lookAt(c[f],0,0)):T===1?(o.up.set(0,0,l[f]),o.lookAt(0,c[f],0)):(o.up.set(0,l[f],0),o.lookAt(0,0,c[f]));let S=this._cubeSize;pr(s,T*S,f>2?S:0,S,S),d.setRenderTarget(s),_&&d.render(g,o),d.render(e,o)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=u,d.autoClear=h,e.background=m}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Qi||e.mapping===es;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bc());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new He(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;pr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,za)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Oc[(s-r-1)%Oc.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let d=3,h=new He(this._lodPlanes[s],c),u=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*mi-1),_=r/g,m=isFinite(r)?1+Math.floor(d*_):mi;m>mi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${mi}`);let f=[],T=0;for(let I=0;I<mi;++I){let E=I/_,y=Math.exp(-E*E/2);f.push(y),I===0?T+=y:I<m&&(T+=2*y)}for(let I=0;I<f.length;I++)f[I]=f[I]/T;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:S}=this;u.dTheta.value=g,u.mipInt.value=S-i;let b=this._sizeLods[s],N=3*b*(s>S-qi?s-S+qi:0),w=4*(this._cubeSize-b);pr(t,N,w,3*b,2*b),l.setRenderTarget(t),l.render(h,za)}};Vr=class extends Yt{constructor(e,t,i,s,r,a,o,l,c,d=Yi){if(d!==Yi&&d!==ns)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Yi&&(i=vi),i===void 0&&d===ns&&(i=ts),super(null,s,r,a,o,l,d,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:gn,this.minFilter=l!==void 0?l:gn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Nd=new Yt,Vc=new Vr(1,1),Od=new Ir,Ud=new Vo,Bd=new Br,zc=[],Hc=[],kc=new Float32Array(16),Gc=new Float32Array(9),Wc=new Float32Array(4);ko=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Ig(t.type)}},Go=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Jg(t.type)}},Wo=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],i)}}},Xa=/(\w+)(\])?(\[|\.)?/g;Ji=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Kg(r,a,this)}}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&i.push(a)}return i}};Qg=37297,e0=0;jc=new We;mr=new C;c0=/^[ \t]*#include +<([\w\d./]+)>/gm;d0=new Map;u0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;x0=0,qo=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new jo(e),t.set(e,i)),i}},jo=class{constructor(e){this.id=x0++,this.code=e,this.usedTimes=0}};w0=0;$o=class extends Hn{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=bu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Yo=class extends Hn{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},I0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D0=`uniform sampler2D shadow_pass;
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
}`;N0={[Qa]:eo,[to]:so,[no]:ro,[Ki]:io,[eo]:Qa,[so]:to,[ro]:no,[io]:Ki};Zo=class extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},$e=class extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}},V0={type:"move"},As=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,i),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],u=d.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(V0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new $e;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},z0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,H0=`
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

}`,Jo=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){let s=new Yt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Mn({vertexShader:z0,fragmentShader:H0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new He(new sn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ko=class extends Vn{constructor(e,t){super();let i=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,h=null,u=null,p=null,g=null,_=new Jo,m=t.getContextAttributes(),f=null,T=null,S=[],b=[],N=new se,w=null,I=new jt;I.viewport=new bt;let E=new jt;E.viewport=new bt;let y=[I,E],v=new Zo,R=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ne=S[$];return ne===void 0&&(ne=new As,S[$]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function($){let ne=S[$];return ne===void 0&&(ne=new As,S[$]=ne),ne.getGripSpace()},this.getHand=function($){let ne=S[$];return ne===void 0&&(ne=new As,S[$]=ne),ne.getHandSpace()};function U($){let ne=b.indexOf($.inputSource);if(ne===-1)return;let Me=S[ne];Me!==void 0&&(Me.update($.inputSource,$.frame,c||a),Me.dispatchEvent({type:$.type,data:$.inputSource}))}function V(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",X);for(let $=0;$<S.length;$++){let ne=b[$];ne!==null&&(b[$]=null,S[$].disconnect(ne))}R=null,F=null,_.reset(),e.setRenderTarget(f),p=null,u=null,h=null,s=null,T=null,nt.stop(),i.isPresenting=!1,e.setPixelRatio(w),e.setSize(N.width,N.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(f=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",V),s.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(N),s.renderState.layers===void 0){let ne={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ne),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),T=new zn(p.framebufferWidth,p.framebufferHeight,{format:mn,type:Fn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ne=null,Me=null,ae=null;m.depth&&(ae=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ne=m.stencil?ns:Yi,Me=m.stencil?ts:vi);let Ie={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:r};h=new XRWebGLBinding(s,t),u=h.createProjectionLayer(Ie),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),T=new zn(u.textureWidth,u.textureHeight,{format:mn,type:Fn,depthTexture:new Vr(u.textureWidth,u.textureHeight,Me,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),nt.setContext(s),nt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function X($){for(let ne=0;ne<$.removed.length;ne++){let Me=$.removed[ne],ae=b.indexOf(Me);ae>=0&&(b[ae]=null,S[ae].disconnect(Me))}for(let ne=0;ne<$.added.length;ne++){let Me=$.added[ne],ae=b.indexOf(Me);if(ae===-1){for(let Ue=0;Ue<S.length;Ue++)if(Ue>=b.length){b.push(Me),ae=Ue;break}else if(b[Ue]===null){b[Ue]=Me,ae=Ue;break}if(ae===-1)break}let Ie=S[ae];Ie&&Ie.connect(Me)}}let k=new C,Q=new C;function G($,ne,Me){k.setFromMatrixPosition(ne.matrixWorld),Q.setFromMatrixPosition(Me.matrixWorld);let ae=k.distanceTo(Q),Ie=ne.projectionMatrix.elements,Ue=Me.projectionMatrix.elements,Ne=Ie[14]/(Ie[10]-1),Je=Ie[14]/(Ie[10]+1),Z=(Ie[9]+1)/Ie[5],te=(Ie[9]-1)/Ie[5],P=(Ie[8]-1)/Ie[0],Ce=(Ue[8]+1)/Ue[0],K=Ne*P,ye=Ne*Ce,le=ae/(-P+Ce),De=le*-P;if(ne.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(De),$.translateZ(le),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ie[10]===-1)$.projectionMatrix.copy(ne.projectionMatrix),$.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let _e=Ne+le,A=Je+le,x=K-De,B=ye+(ae-De),q=Z*Je/A*_e,J=te*Je/A*_e;$.projectionMatrix.makePerspective(x,B,q,J,_e,A),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ce($,ne){ne===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ne.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let ne=$.near,Me=$.far;_.texture!==null&&(_.depthNear>0&&(ne=_.depthNear),_.depthFar>0&&(Me=_.depthFar)),v.near=E.near=I.near=ne,v.far=E.far=I.far=Me,(R!==v.near||F!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),R=v.near,F=v.far),I.layers.mask=$.layers.mask|2,E.layers.mask=$.layers.mask|4,v.layers.mask=I.layers.mask|E.layers.mask;let ae=$.parent,Ie=v.cameras;ce(v,ae);for(let Ue=0;Ue<Ie.length;Ue++)ce(Ie[Ue],ae);Ie.length===2?G(v,I,E):v.projectionMatrix.copy(I.projectionMatrix),ge($,v,ae)};function ge($,ne,Me){Me===null?$.matrix.copy(ne.matrixWorld):($.matrix.copy(Me.matrixWorld),$.matrix.invert(),$.matrix.multiply(ne.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ne.projectionMatrix),$.projectionMatrixInverse.copy(ne.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Is*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function($){l=$,u!==null&&(u.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let Se=null;function ze($,ne){if(d=ne.getViewerPose(c||a),g=ne,d!==null){let Me=d.views;p!==null&&(e.setRenderTargetFramebuffer(T,p.framebuffer),e.setRenderTarget(T));let ae=!1;Me.length!==v.cameras.length&&(v.cameras.length=0,ae=!0);for(let Ue=0;Ue<Me.length;Ue++){let Ne=Me[Ue],Je=null;if(p!==null)Je=p.getViewport(Ne);else{let te=h.getViewSubImage(u,Ne);Je=te.viewport,Ue===0&&(e.setRenderTargetTextures(T,te.colorTexture,u.ignoreDepthValues?void 0:te.depthStencilTexture),e.setRenderTarget(T))}let Z=y[Ue];Z===void 0&&(Z=new jt,Z.layers.enable(Ue),Z.viewport=new bt,y[Ue]=Z),Z.matrix.fromArray(Ne.transform.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.projectionMatrix.fromArray(Ne.projectionMatrix),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert(),Z.viewport.set(Je.x,Je.y,Je.width,Je.height),Ue===0&&(v.matrix.copy(Z.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),ae===!0&&v.cameras.push(Z)}let Ie=s.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")){let Ue=h.getDepthInformation(Me[0]);Ue&&Ue.isValid&&Ue.texture&&_.init(e,Ue,s.renderState)}}for(let Me=0;Me<S.length;Me++){let ae=b[Me],Ie=S[Me];ae!==null&&Ie!==void 0&&Ie.update(ae,ne,c||a)}Se&&Se($,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),g=null}let nt=new Ld;nt.setAnimationLoop(ze),this.setAnimationLoop=function($){Se=$},this.dispose=function(){}}},hi=new Sn,k0=new yt;zr=class{constructor(e={}){let{canvas:t=ju(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext!="undefined"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;let g=new Uint32Array(4),_=new Int32Array(4),m=null,f=null,T=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Lt,this.toneMapping=Qn,this.toneMappingExposure=1;let b=this,N=!1,w=0,I=0,E=null,y=-1,v=null,R=new bt,F=new bt,U=null,V=new je(0),X=0,k=t.width,Q=t.height,G=1,ce=null,ge=null,Se=new bt(0,0,k,Q),ze=new bt(0,0,k,Q),nt=!1,$=new Ds,ne=!1,Me=!1,ae=new yt,Ie=new yt,Ue=new C,Ne=new bt,Je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Z=!1;function te(){return E===null?G:1}let P=i;function Ce(M,L){return t.getContext(M,L)}try{let M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r170"),t.addEventListener("webglcontextlost",Y,!1),t.addEventListener("webglcontextrestored",me,!1),t.addEventListener("webglcontextcreationerror",fe,!1),P===null){let L="webgl2";if(P=Ce(L,M),P===null)throw Ce(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let K,ye,le,De,_e,A,x,B,q,J,j,Ee,he,ve,Ye,ee,xe,Le,Oe,be,Ze,Xe,ut,D;function ue(){K=new ag(P),K.init(),Xe=new F0(P,K),ye=new eg(P,K,e,Xe),le=new O0(P,K),ye.reverseDepthBuffer&&u&&le.buffers.depth.setReversed(!0),De=new cg(P),_e=new S0,A=new B0(P,K,le,_e,ye,Xe,De),x=new ng(b),B=new rg(b),q=new gf(P),ut=new Km(P,q),J=new og(P,q,De,ut),j=new hg(P,J,q,De),Oe=new dg(P,ye,A),ee=new tg(_e),Ee=new b0(b,x,B,K,ye,ut,ee),he=new G0(b,_e),ve=new E0,Ye=new P0(K),Le=new Jm(b,x,B,le,j,p,l),xe=new L0(b,j,ye),D=new W0(P,De,ye,le),be=new Qm(P,K,De),Ze=new lg(P,K,De),De.programs=Ee.programs,b.capabilities=ye,b.extensions=K,b.properties=_e,b.renderLists=ve,b.shadowMap=xe,b.state=le,b.info=De}ue();let W=new Ko(b,P);this.xr=W,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let M=K.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=K.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(M){M!==void 0&&(G=M,this.setSize(k,Q,!1))},this.getSize=function(M){return M.set(k,Q)},this.setSize=function(M,L,z=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=M,Q=L,t.width=Math.floor(M*G),t.height=Math.floor(L*G),z===!0&&(t.style.width=M+"px",t.style.height=L+"px"),this.setViewport(0,0,M,L)},this.getDrawingBufferSize=function(M){return M.set(k*G,Q*G).floor()},this.setDrawingBufferSize=function(M,L,z){k=M,Q=L,G=z,t.width=Math.floor(M*z),t.height=Math.floor(L*z),this.setViewport(0,0,M,L)},this.getCurrentViewport=function(M){return M.copy(R)},this.getViewport=function(M){return M.copy(Se)},this.setViewport=function(M,L,z,H){M.isVector4?Se.set(M.x,M.y,M.z,M.w):Se.set(M,L,z,H),le.viewport(R.copy(Se).multiplyScalar(G).round())},this.getScissor=function(M){return M.copy(ze)},this.setScissor=function(M,L,z,H){M.isVector4?ze.set(M.x,M.y,M.z,M.w):ze.set(M,L,z,H),le.scissor(F.copy(ze).multiplyScalar(G).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(M){le.setScissorTest(nt=M)},this.setOpaqueSort=function(M){ce=M},this.setTransparentSort=function(M){ge=M},this.getClearColor=function(M){return M.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor.apply(Le,arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha.apply(Le,arguments)},this.clear=function(M=!0,L=!0,z=!0){let H=0;if(M){let O=!1;if(E!==null){let ie=E.texture.format;O=ie===El||ie===Ml||ie===Sl}if(O){let ie=E.texture.type,pe=ie===Fn||ie===vi||ie===Ps||ie===ts||ie===xl||ie===bl,Ae=Le.getClearColor(),Te=Le.getClearAlpha(),Be=Ae.r,Ge=Ae.g,we=Ae.b;pe?(g[0]=Be,g[1]=Ge,g[2]=we,g[3]=Te,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Be,_[1]=Ge,_[2]=we,_[3]=Te,P.clearBufferiv(P.COLOR,0,_))}else H|=P.COLOR_BUFFER_BIT}L&&(H|=P.DEPTH_BUFFER_BIT),z&&(H|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Y,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",fe,!1),ve.dispose(),Ye.dispose(),_e.dispose(),x.dispose(),B.dispose(),j.dispose(),ut.dispose(),D.dispose(),Ee.dispose(),W.dispose(),W.removeEventListener("sessionstart",jl),W.removeEventListener("sessionend",$l),ri.stop()};function Y(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function me(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;let M=De.autoReset,L=xe.enabled,z=xe.autoUpdate,H=xe.needsUpdate,O=xe.type;ue(),De.autoReset=M,xe.enabled=L,xe.autoUpdate=z,xe.needsUpdate=H,xe.type=O}function fe(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function ke(M){let L=M.target;L.removeEventListener("dispose",ke),xt(L)}function xt(M){Rt(M),_e.remove(M)}function Rt(M){let L=_e.get(M).programs;L!==void 0&&(L.forEach(function(z){Ee.releaseProgram(z)}),M.isShaderMaterial&&Ee.releaseShaderCache(M))}this.renderBufferDirect=function(M,L,z,H,O,ie){L===null&&(L=Je);let pe=O.isMesh&&O.matrixWorld.determinant()<0,Ae=kh(M,L,z,H,O);le.setMaterial(H,pe);let Te=z.index,Be=1;if(H.wireframe===!0){if(Te=J.getWireframeAttribute(z),Te===void 0)return;Be=2}let Ge=z.drawRange,we=z.attributes.position,et=Ge.start*Be,ft=(Ge.start+Ge.count)*Be;ie!==null&&(et=Math.max(et,ie.start*Be),ft=Math.min(ft,(ie.start+ie.count)*Be)),Te!==null?(et=Math.max(et,0),ft=Math.min(ft,Te.count)):we!=null&&(et=Math.max(et,0),ft=Math.min(ft,we.count));let pt=ft-et;if(pt<0||pt===1/0)return;ut.setup(O,H,Ae,z,Te);let zt,it=be;if(Te!==null&&(zt=q.get(Te),it=Ze,it.setIndex(zt)),O.isMesh)H.wireframe===!0?(le.setLineWidth(H.wireframeLinewidth*te()),it.setMode(P.LINES)):it.setMode(P.TRIANGLES);else if(O.isLine){let Re=H.linewidth;Re===void 0&&(Re=1),le.setLineWidth(Re*te()),O.isLineSegments?it.setMode(P.LINES):O.isLineLoop?it.setMode(P.LINE_LOOP):it.setMode(P.LINE_STRIP)}else O.isPoints?it.setMode(P.POINTS):O.isSprite&&it.setMode(P.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)it.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(K.get("WEBGL_multi_draw"))it.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Re=O._multiDrawStarts,Cn=O._multiDrawCounts,st=O._multiDrawCount,cn=Te?q.get(Te).bytesPerElement:1,Ri=_e.get(H).currentProgram.getUniforms();for(let Wt=0;Wt<st;Wt++)Ri.setValue(P,"_gl_DrawID",Wt),it.render(Re[Wt]/cn,Cn[Wt])}else if(O.isInstancedMesh)it.renderInstances(et,pt,O.count);else if(z.isInstancedBufferGeometry){let Re=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Cn=Math.min(z.instanceCount,Re);it.renderInstances(et,pt,Cn)}else it.render(et,pt)};function ot(M,L,z){M.transparent===!0&&M.side===pn&&M.forceSinglePass===!1?(M.side=Ht,M.needsUpdate=!0,$s(M,L,z),M.side=ei,M.needsUpdate=!0,$s(M,L,z),M.side=pn):$s(M,L,z)}this.compile=function(M,L,z=null){z===null&&(z=M),f=Ye.get(z),f.init(L),S.push(f),z.traverseVisible(function(O){O.isLight&&O.layers.test(L.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),M!==z&&M.traverseVisible(function(O){O.isLight&&O.layers.test(L.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),f.setupLights();let H=new Set;return M.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let ie=O.material;if(ie)if(Array.isArray(ie))for(let pe=0;pe<ie.length;pe++){let Ae=ie[pe];ot(Ae,z,O),H.add(Ae)}else ot(ie,z,O),H.add(ie)}),S.pop(),f=null,H},this.compileAsync=function(M,L,z=null){let H=this.compile(M,L,z);return new Promise(O=>{function ie(){if(H.forEach(function(pe){_e.get(pe).currentProgram.isReady()&&H.delete(pe)}),H.size===0){O(M);return}setTimeout(ie,10)}K.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let ln=null;function wn(M){ln&&ln(M)}function jl(){ri.stop()}function $l(){ri.start()}let ri=new Ld;ri.setAnimationLoop(wn),typeof self!="undefined"&&ri.setContext(self),this.setAnimationLoop=function(M){ln=M,W.setAnimationLoop(M),M===null?ri.stop():ri.start()},W.addEventListener("sessionstart",jl),W.addEventListener("sessionend",$l),this.render=function(M,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(L),L=W.getCamera()),M.isScene===!0&&M.onBeforeRender(b,M,L,E),f=Ye.get(M,S.length),f.init(L),S.push(f),Ie.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),$.setFromProjectionMatrix(Ie),Me=this.localClippingEnabled,ne=ee.init(this.clippingPlanes,Me),m=ve.get(M,T.length),m.init(),T.push(m),W.enabled===!0&&W.isPresenting===!0){let ie=b.xr.getDepthSensingMesh();ie!==null&&ga(ie,L,-1/0,b.sortObjects)}ga(M,L,0,b.sortObjects),m.finish(),b.sortObjects===!0&&m.sort(ce,ge),Z=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,Z&&Le.addToRenderList(m,M),this.info.render.frame++,ne===!0&&ee.beginShadows();let z=f.state.shadowsArray;xe.render(z,M,L),ne===!0&&ee.endShadows(),this.info.autoReset===!0&&this.info.reset();let H=m.opaque,O=m.transmissive;if(f.setupLights(),L.isArrayCamera){let ie=L.cameras;if(O.length>0)for(let pe=0,Ae=ie.length;pe<Ae;pe++){let Te=ie[pe];Zl(H,O,M,Te)}Z&&Le.render(M);for(let pe=0,Ae=ie.length;pe<Ae;pe++){let Te=ie[pe];Yl(m,M,Te,Te.viewport)}}else O.length>0&&Zl(H,O,M,L),Z&&Le.render(M),Yl(m,M,L);E!==null&&(A.updateMultisampleRenderTarget(E),A.updateRenderTargetMipmap(E)),M.isScene===!0&&M.onAfterRender(b,M,L),ut.resetDefaultState(),y=-1,v=null,S.pop(),S.length>0?(f=S[S.length-1],ne===!0&&ee.setGlobalState(b.clippingPlanes,f.state.camera)):f=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function ga(M,L,z,H){if(M.visible===!1)return;if(M.layers.test(L.layers)){if(M.isGroup)z=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(L);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||$.intersectsSprite(M)){H&&Ne.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Ie);let pe=j.update(M),Ae=M.material;Ae.visible&&m.push(M,pe,Ae,z,Ne.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||$.intersectsObject(M))){let pe=j.update(M),Ae=M.material;if(H&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Ne.copy(M.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ne.copy(pe.boundingSphere.center)),Ne.applyMatrix4(M.matrixWorld).applyMatrix4(Ie)),Array.isArray(Ae)){let Te=pe.groups;for(let Be=0,Ge=Te.length;Be<Ge;Be++){let we=Te[Be],et=Ae[we.materialIndex];et&&et.visible&&m.push(M,pe,et,z,Ne.z,we)}}else Ae.visible&&m.push(M,pe,Ae,z,Ne.z,null)}}let ie=M.children;for(let pe=0,Ae=ie.length;pe<Ae;pe++)ga(ie[pe],L,z,H)}function Yl(M,L,z,H){let O=M.opaque,ie=M.transmissive,pe=M.transparent;f.setupLightsView(z),ne===!0&&ee.setGlobalState(b.clippingPlanes,z),H&&le.viewport(R.copy(H)),O.length>0&&js(O,L,z),ie.length>0&&js(ie,L,z),pe.length>0&&js(pe,L,z),le.buffers.depth.setTest(!0),le.buffers.depth.setMask(!0),le.buffers.color.setMask(!0),le.setPolygonOffset(!1)}function Zl(M,L,z,H){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[H.id]===void 0&&(f.state.transmissionRenderTarget[H.id]=new zn(1,1,{generateMipmaps:!0,type:K.has("EXT_color_buffer_half_float")||K.has("EXT_color_buffer_float")?ks:Fn,minFilter:_i,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ke.workingColorSpace}));let ie=f.state.transmissionRenderTarget[H.id],pe=H.viewport||R;ie.setSize(pe.z,pe.w);let Ae=b.getRenderTarget();b.setRenderTarget(ie),b.getClearColor(V),X=b.getClearAlpha(),X<1&&b.setClearColor(16777215,.5),b.clear(),Z&&Le.render(z);let Te=b.toneMapping;b.toneMapping=Qn;let Be=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),f.setupLightsView(H),ne===!0&&ee.setGlobalState(b.clippingPlanes,H),js(M,z,H),A.updateMultisampleRenderTarget(ie),A.updateRenderTargetMipmap(ie),K.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let we=0,et=L.length;we<et;we++){let ft=L[we],pt=ft.object,zt=ft.geometry,it=ft.material,Re=ft.group;if(it.side===pn&&pt.layers.test(H.layers)){let Cn=it.side;it.side=Ht,it.needsUpdate=!0,Jl(pt,z,H,zt,it,Re),it.side=Cn,it.needsUpdate=!0,Ge=!0}}Ge===!0&&(A.updateMultisampleRenderTarget(ie),A.updateRenderTargetMipmap(ie))}b.setRenderTarget(Ae),b.setClearColor(V,X),Be!==void 0&&(H.viewport=Be),b.toneMapping=Te}function js(M,L,z){let H=L.isScene===!0?L.overrideMaterial:null;for(let O=0,ie=M.length;O<ie;O++){let pe=M[O],Ae=pe.object,Te=pe.geometry,Be=H===null?pe.material:H,Ge=pe.group;Ae.layers.test(z.layers)&&Jl(Ae,L,z,Te,Be,Ge)}}function Jl(M,L,z,H,O,ie){M.onBeforeRender(b,L,z,H,O,ie),M.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),O.onBeforeRender(b,L,z,H,M,ie),O.transparent===!0&&O.side===pn&&O.forceSinglePass===!1?(O.side=Ht,O.needsUpdate=!0,b.renderBufferDirect(z,L,H,O,M,ie),O.side=ei,O.needsUpdate=!0,b.renderBufferDirect(z,L,H,O,M,ie),O.side=pn):b.renderBufferDirect(z,L,H,O,M,ie),M.onAfterRender(b,L,z,H,O,ie)}function $s(M,L,z){L.isScene!==!0&&(L=Je);let H=_e.get(M),O=f.state.lights,ie=f.state.shadowsArray,pe=O.state.version,Ae=Ee.getParameters(M,O.state,ie,L,z),Te=Ee.getProgramCacheKey(Ae),Be=H.programs;H.environment=M.isMeshStandardMaterial?L.environment:null,H.fog=L.fog,H.envMap=(M.isMeshStandardMaterial?B:x).get(M.envMap||H.environment),H.envMapRotation=H.environment!==null&&M.envMap===null?L.environmentRotation:M.envMapRotation,Be===void 0&&(M.addEventListener("dispose",ke),Be=new Map,H.programs=Be);let Ge=Be.get(Te);if(Ge!==void 0){if(H.currentProgram===Ge&&H.lightsStateVersion===pe)return Ql(M,Ae),Ge}else Ae.uniforms=Ee.getUniforms(M),M.onBeforeCompile(Ae,b),Ge=Ee.acquireProgram(Ae,Te),Be.set(Te,Ge),H.uniforms=Ae.uniforms;let we=H.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(we.clippingPlanes=ee.uniform),Ql(M,Ae),H.needsLights=Wh(M),H.lightsStateVersion=pe,H.needsLights&&(we.ambientLightColor.value=O.state.ambient,we.lightProbe.value=O.state.probe,we.directionalLights.value=O.state.directional,we.directionalLightShadows.value=O.state.directionalShadow,we.spotLights.value=O.state.spot,we.spotLightShadows.value=O.state.spotShadow,we.rectAreaLights.value=O.state.rectArea,we.ltc_1.value=O.state.rectAreaLTC1,we.ltc_2.value=O.state.rectAreaLTC2,we.pointLights.value=O.state.point,we.pointLightShadows.value=O.state.pointShadow,we.hemisphereLights.value=O.state.hemi,we.directionalShadowMap.value=O.state.directionalShadowMap,we.directionalShadowMatrix.value=O.state.directionalShadowMatrix,we.spotShadowMap.value=O.state.spotShadowMap,we.spotLightMatrix.value=O.state.spotLightMatrix,we.spotLightMap.value=O.state.spotLightMap,we.pointShadowMap.value=O.state.pointShadowMap,we.pointShadowMatrix.value=O.state.pointShadowMatrix),H.currentProgram=Ge,H.uniformsList=null,Ge}function Kl(M){if(M.uniformsList===null){let L=M.currentProgram.getUniforms();M.uniformsList=Ji.seqWithValue(L.seq,M.uniforms)}return M.uniformsList}function Ql(M,L){let z=_e.get(M);z.outputColorSpace=L.outputColorSpace,z.batching=L.batching,z.batchingColor=L.batchingColor,z.instancing=L.instancing,z.instancingColor=L.instancingColor,z.instancingMorph=L.instancingMorph,z.skinning=L.skinning,z.morphTargets=L.morphTargets,z.morphNormals=L.morphNormals,z.morphColors=L.morphColors,z.morphTargetsCount=L.morphTargetsCount,z.numClippingPlanes=L.numClippingPlanes,z.numIntersection=L.numClipIntersection,z.vertexAlphas=L.vertexAlphas,z.vertexTangents=L.vertexTangents,z.toneMapping=L.toneMapping}function kh(M,L,z,H,O){L.isScene!==!0&&(L=Je),A.resetTextureUnits();let ie=L.fog,pe=H.isMeshStandardMaterial?L.environment:null,Ae=E===null?b.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:hs,Te=(H.isMeshStandardMaterial?B:x).get(H.envMap||pe),Be=H.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Ge=!!z.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),we=!!z.morphAttributes.position,et=!!z.morphAttributes.normal,ft=!!z.morphAttributes.color,pt=Qn;H.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(pt=b.toneMapping);let zt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,it=zt!==void 0?zt.length:0,Re=_e.get(H),Cn=f.state.lights;if(ne===!0&&(Me===!0||M!==v)){let en=M===v&&H.id===y;ee.setState(H,M,en)}let st=!1;H.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==Cn.state.version||Re.outputColorSpace!==Ae||O.isBatchedMesh&&Re.batching===!1||!O.isBatchedMesh&&Re.batching===!0||O.isBatchedMesh&&Re.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Re.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Re.instancing===!1||!O.isInstancedMesh&&Re.instancing===!0||O.isSkinnedMesh&&Re.skinning===!1||!O.isSkinnedMesh&&Re.skinning===!0||O.isInstancedMesh&&Re.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Re.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Re.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Re.instancingMorph===!1&&O.morphTexture!==null||Re.envMap!==Te||H.fog===!0&&Re.fog!==ie||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==ee.numPlanes||Re.numIntersection!==ee.numIntersection)||Re.vertexAlphas!==Be||Re.vertexTangents!==Ge||Re.morphTargets!==we||Re.morphNormals!==et||Re.morphColors!==ft||Re.toneMapping!==pt||Re.morphTargetsCount!==it)&&(st=!0):(st=!0,Re.__version=H.version);let cn=Re.currentProgram;st===!0&&(cn=$s(H,L,O));let Ri=!1,Wt=!1,ps=!1,mt=cn.getUniforms(),yn=Re.uniforms;if(le.useProgram(cn.program)&&(Ri=!0,Wt=!0,ps=!0),H.id!==y&&(y=H.id,Wt=!0),Ri||v!==M){le.buffers.depth.getReversed()?(ae.copy(M.projectionMatrix),Yu(ae),Zu(ae),mt.setValue(P,"projectionMatrix",ae)):mt.setValue(P,"projectionMatrix",M.projectionMatrix),mt.setValue(P,"viewMatrix",M.matrixWorldInverse);let Gn=mt.map.cameraPosition;Gn!==void 0&&Gn.setValue(P,Ue.setFromMatrixPosition(M.matrixWorld)),ye.logarithmicDepthBuffer&&mt.setValue(P,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&mt.setValue(P,"isOrthographic",M.isOrthographicCamera===!0),v!==M&&(v=M,Wt=!0,ps=!0)}if(O.isSkinnedMesh){mt.setOptional(P,O,"bindMatrix"),mt.setOptional(P,O,"bindMatrixInverse");let en=O.skeleton;en&&(en.boneTexture===null&&en.computeBoneTexture(),mt.setValue(P,"boneTexture",en.boneTexture,A))}O.isBatchedMesh&&(mt.setOptional(P,O,"batchingTexture"),mt.setValue(P,"batchingTexture",O._matricesTexture,A),mt.setOptional(P,O,"batchingIdTexture"),mt.setValue(P,"batchingIdTexture",O._indirectTexture,A),mt.setOptional(P,O,"batchingColorTexture"),O._colorsTexture!==null&&mt.setValue(P,"batchingColorTexture",O._colorsTexture,A));let ms=z.morphAttributes;if((ms.position!==void 0||ms.normal!==void 0||ms.color!==void 0)&&Oe.update(O,z,cn),(Wt||Re.receiveShadow!==O.receiveShadow)&&(Re.receiveShadow=O.receiveShadow,mt.setValue(P,"receiveShadow",O.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(yn.envMap.value=Te,yn.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&L.environment!==null&&(yn.envMapIntensity.value=L.environmentIntensity),Wt&&(mt.setValue(P,"toneMappingExposure",b.toneMappingExposure),Re.needsLights&&Gh(yn,ps),ie&&H.fog===!0&&he.refreshFogUniforms(yn,ie),he.refreshMaterialUniforms(yn,H,G,Q,f.state.transmissionRenderTarget[M.id]),Ji.upload(P,Kl(Re),yn,A)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ji.upload(P,Kl(Re),yn,A),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&mt.setValue(P,"center",O.center),mt.setValue(P,"modelViewMatrix",O.modelViewMatrix),mt.setValue(P,"normalMatrix",O.normalMatrix),mt.setValue(P,"modelMatrix",O.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){let en=H.uniformsGroups;for(let Gn=0,Wn=en.length;Gn<Wn;Gn++){let ec=en[Gn];D.update(ec,cn),D.bind(ec,cn)}}return cn}function Gh(M,L){M.ambientLightColor.needsUpdate=L,M.lightProbe.needsUpdate=L,M.directionalLights.needsUpdate=L,M.directionalLightShadows.needsUpdate=L,M.pointLights.needsUpdate=L,M.pointLightShadows.needsUpdate=L,M.spotLights.needsUpdate=L,M.spotLightShadows.needsUpdate=L,M.rectAreaLights.needsUpdate=L,M.hemisphereLights.needsUpdate=L}function Wh(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(M,L,z){_e.get(M.texture).__webglTexture=L,_e.get(M.depthTexture).__webglTexture=z;let H=_e.get(M);H.__hasExternalTextures=!0,H.__autoAllocateDepthBuffer=z===void 0,H.__autoAllocateDepthBuffer||K.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,L){let z=_e.get(M);z.__webglFramebuffer=L,z.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(M,L=0,z=0){E=M,w=L,I=z;let H=!0,O=null,ie=!1,pe=!1;if(M){let Te=_e.get(M);if(Te.__useDefaultFramebuffer!==void 0)le.bindFramebuffer(P.FRAMEBUFFER,null),H=!1;else if(Te.__webglFramebuffer===void 0)A.setupRenderTarget(M);else if(Te.__hasExternalTextures)A.rebindTextures(M,_e.get(M.texture).__webglTexture,_e.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let we=M.depthTexture;if(Te.__boundDepthTexture!==we){if(we!==null&&_e.has(we)&&(M.width!==we.image.width||M.height!==we.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(M)}}let Be=M.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(pe=!0);let Ge=_e.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ge[L])?O=Ge[L][z]:O=Ge[L],ie=!0):M.samples>0&&A.useMultisampledRTT(M)===!1?O=_e.get(M).__webglMultisampledFramebuffer:Array.isArray(Ge)?O=Ge[z]:O=Ge,R.copy(M.viewport),F.copy(M.scissor),U=M.scissorTest}else R.copy(Se).multiplyScalar(G).floor(),F.copy(ze).multiplyScalar(G).floor(),U=nt;if(le.bindFramebuffer(P.FRAMEBUFFER,O)&&H&&le.drawBuffers(M,O),le.viewport(R),le.scissor(F),le.setScissorTest(U),ie){let Te=_e.get(M.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+L,Te.__webglTexture,z)}else if(pe){let Te=_e.get(M.texture),Be=L||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,Te.__webglTexture,z||0,Be)}y=-1},this.readRenderTargetPixels=function(M,L,z,H,O,ie,pe){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=_e.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&pe!==void 0&&(Ae=Ae[pe]),Ae){le.bindFramebuffer(P.FRAMEBUFFER,Ae);try{let Te=M.texture,Be=Te.format,Ge=Te.type;if(!ye.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ye.textureTypeReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=M.width-H&&z>=0&&z<=M.height-O&&P.readPixels(L,z,H,O,Xe.convert(Be),Xe.convert(Ge),ie)}finally{let Te=E!==null?_e.get(E).__webglFramebuffer:null;le.bindFramebuffer(P.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(M,L,z,H,O,ie,pe){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=_e.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&pe!==void 0&&(Ae=Ae[pe]),Ae){let Te=M.texture,Be=Te.format,Ge=Te.type;if(!ye.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ye.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(L>=0&&L<=M.width-H&&z>=0&&z<=M.height-O){le.bindFramebuffer(P.FRAMEBUFFER,Ae);let we=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,we),P.bufferData(P.PIXEL_PACK_BUFFER,ie.byteLength,P.STREAM_READ),P.readPixels(L,z,H,O,Xe.convert(Be),Xe.convert(Ge),0);let et=E!==null?_e.get(E).__webglFramebuffer:null;le.bindFramebuffer(P.FRAMEBUFFER,et);let ft=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await $u(P,ft,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,we),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ie),P.deleteBuffer(we),P.deleteSync(ft),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,L=null,z=0){M.isTexture!==!0&&(bs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),L=arguments[0]||null,M=arguments[1]);let H=Math.pow(2,-z),O=Math.floor(M.image.width*H),ie=Math.floor(M.image.height*H),pe=L!==null?L.x:0,Ae=L!==null?L.y:0;A.setTexture2D(M,0),P.copyTexSubImage2D(P.TEXTURE_2D,z,0,0,pe,Ae,O,ie),le.unbindTexture()},this.copyTextureToTexture=function(M,L,z=null,H=null,O=0){M.isTexture!==!0&&(bs("WebGLRenderer: copyTextureToTexture function signature has changed."),H=arguments[0]||null,M=arguments[1],L=arguments[2],O=arguments[3]||0,z=null);let ie,pe,Ae,Te,Be,Ge,we,et,ft,pt=M.isCompressedTexture?M.mipmaps[O]:M.image;z!==null?(ie=z.max.x-z.min.x,pe=z.max.y-z.min.y,Ae=z.isBox3?z.max.z-z.min.z:1,Te=z.min.x,Be=z.min.y,Ge=z.isBox3?z.min.z:0):(ie=pt.width,pe=pt.height,Ae=pt.depth||1,Te=0,Be=0,Ge=0),H!==null?(we=H.x,et=H.y,ft=H.z):(we=0,et=0,ft=0);let zt=Xe.convert(L.format),it=Xe.convert(L.type),Re;L.isData3DTexture?(A.setTexture3D(L,0),Re=P.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(A.setTexture2DArray(L,0),Re=P.TEXTURE_2D_ARRAY):(A.setTexture2D(L,0),Re=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,L.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,L.unpackAlignment);let Cn=P.getParameter(P.UNPACK_ROW_LENGTH),st=P.getParameter(P.UNPACK_IMAGE_HEIGHT),cn=P.getParameter(P.UNPACK_SKIP_PIXELS),Ri=P.getParameter(P.UNPACK_SKIP_ROWS),Wt=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,pt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,pt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Te),P.pixelStorei(P.UNPACK_SKIP_ROWS,Be),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ge);let ps=M.isDataArrayTexture||M.isData3DTexture,mt=L.isDataArrayTexture||L.isData3DTexture;if(M.isRenderTargetTexture||M.isDepthTexture){let yn=_e.get(M),ms=_e.get(L),en=_e.get(yn.__renderTarget),Gn=_e.get(ms.__renderTarget);le.bindFramebuffer(P.READ_FRAMEBUFFER,en.__webglFramebuffer),le.bindFramebuffer(P.DRAW_FRAMEBUFFER,Gn.__webglFramebuffer);for(let Wn=0;Wn<Ae;Wn++)ps&&P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,_e.get(M).__webglTexture,O,Ge+Wn),M.isDepthTexture?(mt&&P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,_e.get(L).__webglTexture,O,ft+Wn),P.blitFramebuffer(Te,Be,ie,pe,we,et,ie,pe,P.DEPTH_BUFFER_BIT,P.NEAREST)):mt?P.copyTexSubImage3D(Re,O,we,et,ft+Wn,Te,Be,ie,pe):P.copyTexSubImage2D(Re,O,we,et,ft+Wn,Te,Be,ie,pe);le.bindFramebuffer(P.READ_FRAMEBUFFER,null),le.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else mt?M.isDataTexture||M.isData3DTexture?P.texSubImage3D(Re,O,we,et,ft,ie,pe,Ae,zt,it,pt.data):L.isCompressedArrayTexture?P.compressedTexSubImage3D(Re,O,we,et,ft,ie,pe,Ae,zt,pt.data):P.texSubImage3D(Re,O,we,et,ft,ie,pe,Ae,zt,it,pt):M.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,O,we,et,ie,pe,zt,it,pt.data):M.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,O,we,et,pt.width,pt.height,zt,pt.data):P.texSubImage2D(P.TEXTURE_2D,O,we,et,ie,pe,zt,it,pt);P.pixelStorei(P.UNPACK_ROW_LENGTH,Cn),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,st),P.pixelStorei(P.UNPACK_SKIP_PIXELS,cn),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ri),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Wt),O===0&&L.generateMipmaps&&P.generateMipmap(Re),le.unbindTexture()},this.copyTextureToTexture3D=function(M,L,z=null,H=null,O=0){return M.isTexture!==!0&&(bs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,H=arguments[1]||null,M=arguments[2],L=arguments[3],O=arguments[4]||0),bs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,L,z,H,O)},this.initRenderTarget=function(M){_e.get(M).__webglFramebuffer===void 0&&A.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?A.setTextureCube(M,0):M.isData3DTexture?A.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?A.setTexture2DArray(M,0):A.setTexture2D(M,0),le.unbindTexture()},this.resetState=function(){w=0,I=0,E=null,le.reset(),ut.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}},Hr=class extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sn,this.environmentIntensity=1,this.environmentRotation=new Sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ls=class extends Hn{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new je(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},kr=new C,Gr=new C,id=new yt,xs=new ss,gr=new is,qa=new C,sd=new C,Qo=class extends Nt{constructor(e=new kt,t=new Ls){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)kr.fromBufferAttribute(t,s-1),Gr.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=kr.distanceTo(Gr);e.setAttribute("lineDistance",new gt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),gr.copy(i.boundingSphere),gr.applyMatrix4(s),gr.radius+=r,e.ray.intersectsSphere(gr)===!1)return;id.copy(s).invert(),xs.copy(e.ray).applyMatrix4(id);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=i.index,u=i.attributes.position;if(d!==null){let p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){let f=d.getX(_),T=d.getX(_+1),S=_r(this,e,xs,l,f,T);S&&t.push(S)}if(this.isLineLoop){let _=d.getX(g-1),m=d.getX(p),f=_r(this,e,xs,l,_,m);f&&t.push(f)}}else{let p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){let f=_r(this,e,xs,l,_,_+1);f&&t.push(f)}if(this.isLineLoop){let _=_r(this,e,xs,l,g-1,p);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};rd=new C,ad=new C,Wr=class extends Qo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)rd.fromBufferAttribute(t,s),ad.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+rd.distanceTo(ad);e.setAttribute("lineDistance",new gt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Xr=class extends Yt{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},rn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),s=0,r=i.length,a;t?a=t:a=e*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);let d=i[s],u=i[s+1]-d,p=(a-d)/u;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new se:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new C,s=[],r=[],a=[],o=new C,l=new yt;for(let p=0;p<=e;p++){let g=p/e;s[p]=this.getTangentAt(g,new C)}r[0]=new C,a[0]=new C;let c=Number.MAX_VALUE,d=Math.abs(s[0].x),h=Math.abs(s[0].y),u=Math.abs(s[0].z);d<=c&&(c=d,i.set(1,0,0)),h<=c&&(c=h,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Ct(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Ct(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ns=class extends rn{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new se){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let d=Math.cos(this.aRotation),h=Math.sin(this.aRotation),u=l-this.aX,p=c-this.aY;l=u*d-p*h+this.aX,c=u*h+p*d+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},el=class extends Ns{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};vr=new C,ja=new wl,$a=new wl,Ya=new wl,Os=class extends rn{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new C){let i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,d;this.closed||o>0?c=s[(o-1)%r]:(vr.subVectors(s[0],s[1]).add(s[0]),c=vr);let h=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(vr.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=vr),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(h),p),_=Math.pow(h.distanceToSquared(u),p),m=Math.pow(u.distanceToSquared(d),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),ja.initNonuniformCatmullRom(c.x,h.x,u.x,d.x,g,_,m),$a.initNonuniformCatmullRom(c.y,h.y,u.y,d.y,g,_,m),Ya.initNonuniformCatmullRom(c.z,h.z,u.z,d.z,g,_,m)}else this.curveType==="catmullrom"&&(ja.initCatmullRom(c.x,h.x,u.x,d.x,this.tension),$a.initCatmullRom(c.y,h.y,u.y,d.y,this.tension),Ya.initCatmullRom(c.z,h.z,u.z,d.z,this.tension));return i.set(ja.calc(l),$a.calc(l),Ya.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new C().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};qr=class extends rn{constructor(e=new se,t=new se,i=new se,s=new se){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new se){let i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(ws(e,s.x,r.x,a.x,o.x),ws(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},yi=class extends rn{constructor(e=new C,t=new C,i=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new C){let i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(ws(e,s.x,r.x,a.x,o.x),ws(e,s.y,r.y,a.y,o.y),ws(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},jr=class extends rn{constructor(e=new se,t=new se){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new se){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new se){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},tl=class extends rn{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$r=class extends rn{constructor(e=new se,t=new se,i=new se){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new se){let i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Ts(e,s.x,r.x,a.x),Ts(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yr=class extends rn{constructor(e=new C,t=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new C){let i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(Ts(e,s.x,r.x,a.x),Ts(e,s.y,r.y,a.y),Ts(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zr=class extends rn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new se){let i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],d=s[a>s.length-2?s.length-1:a+1],h=s[a>s.length-3?s.length-1:a+2];return i.set(od(o,l.x,c.x,d.x,h.x),od(o,l.y,c.y,d.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new se().fromArray(s))}return this}},Jr=Object.freeze({__proto__:null,ArcCurve:el,CatmullRomCurve3:Os,CubicBezierCurve:qr,CubicBezierCurve3:yi,EllipseCurve:Ns,LineCurve:jr,LineCurve3:tl,QuadraticBezierCurve:$r,QuadraticBezierCurve3:Yr,SplineCurve:Zr}),nl=class extends rn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Jr[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let a=s[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let d=l[c];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(new Jr[s.type]().fromJSON(s))}return this}},os=class extends nl{constructor(e){super(),this.type="Path",this.currentPoint=new se,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new jr(this.currentPoint.clone(),new se(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){let r=new $r(this.currentPoint.clone(),new se(e,t),new se(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){let o=new qr(this.currentPoint.clone(),new se(e,t),new se(i,s),new se(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new Zr(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,l){let c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,i,s,r,a,o,l),this}absellipse(e,t,i,s,r,a,o,l){let c=new Ns(e,t,i,s,r,a,o,l);if(this.curves.length>0){let h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);let d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},En=class n extends kt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let d=[],h=[],u=[],p=[],g=0,_=[],m=i/2,f=0;T(),a===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(d),this.setAttribute("position",new gt(h,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(p,2));function T(){let b=new C,N=new C,w=0,I=(t-e)/i;for(let E=0;E<=r;E++){let y=[],v=E/r,R=v*(t-e)+e;for(let F=0;F<=s;F++){let U=F/s,V=U*l+o,X=Math.sin(V),k=Math.cos(V);N.x=R*X,N.y=-v*i+m,N.z=R*k,h.push(N.x,N.y,N.z),b.set(X,I,k).normalize(),u.push(b.x,b.y,b.z),p.push(U,1-v),y.push(g++)}_.push(y)}for(let E=0;E<s;E++)for(let y=0;y<r;y++){let v=_[y][E],R=_[y+1][E],F=_[y+1][E+1],U=_[y][E+1];(e>0||y!==0)&&(d.push(v,R,U),w+=3),(t>0||y!==r-1)&&(d.push(R,F,U),w+=3)}c.addGroup(f,w,0),f+=w}function S(b){let N=g,w=new se,I=new C,E=0,y=b===!0?e:t,v=b===!0?1:-1;for(let F=1;F<=s;F++)h.push(0,m*v,0),u.push(0,v,0),p.push(.5,.5),g++;let R=g;for(let F=0;F<=s;F++){let V=F/s*l+o,X=Math.cos(V),k=Math.sin(V);I.x=y*k,I.y=m*v,I.z=y*X,h.push(I.x,I.y,I.z),u.push(0,v,0),w.x=X*.5+.5,w.y=k*.5*v+.5,p.push(w.x,w.y),g++}for(let F=0;F<s;F++){let U=N+F,V=R+F;b===!0?d.push(V,V+1,U):d.push(V+1,V,U),E+=3}c.addGroup(f,E,b===!0?1:2),f+=E}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ls=class extends os{constructor(e){super(e),this.uuid=Ti(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(new os().fromJSON(s))}return this}},K0={triangulate:function(n,e,t=2){let i=e&&e.length,s=i?e[0]*t:n.length,r=Fd(n,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c,d,h,u,p;if(i&&(r=i_(n,e,r,t)),n.length>80*t){o=c=n[0],l=d=n[1];for(let g=t;g<s;g+=t)h=n[g],u=n[g+1],h<o&&(o=h),u<l&&(l=u),h>c&&(c=h),u>d&&(d=u);p=Math.max(c-o,d-l),p=p!==0?32767/p:0}return Us(r,a,t,o,l,p,0),a}};Cs=class n{static area(e){let t=e.length,i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return n.area(e)<0}static triangulateShape(e,t){let i=[],s=[],r=[];cd(e),dd(i,e);let a=e.length;t.forEach(cd);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,dd(i,t[l]);let o=K0.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};Vs=class n extends kt{constructor(e=new ls([new se(.5,.5),new se(-.5,.5),new se(-.5,-.5),new se(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new gt(s,3)),this.setAttribute("uv",new gt(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1,u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:p-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,f=t.extrudePath,T=t.UVGenerator!==void 0?t.UVGenerator:m_,S,b=!1,N,w,I,E;f&&(S=f.getSpacedPoints(d),b=!0,u=!1,N=f.computeFrenetFrames(d,!1),w=new C,I=new C,E=new C),u||(m=0,p=0,g=0,_=0);let y=o.extractPoints(c),v=y.shape,R=y.holes;if(!Cs.isClockWise(v)){v=v.reverse();for(let Z=0,te=R.length;Z<te;Z++){let P=R[Z];Cs.isClockWise(P)&&(R[Z]=P.reverse())}}let U=Cs.triangulateShape(v,R),V=v;for(let Z=0,te=R.length;Z<te;Z++){let P=R[Z];v=v.concat(P)}function X(Z,te,P){return te||console.error("THREE.ExtrudeGeometry: vec does not exist"),Z.clone().addScaledVector(te,P)}let k=v.length,Q=U.length;function G(Z,te,P){let Ce,K,ye,le=Z.x-te.x,De=Z.y-te.y,_e=P.x-Z.x,A=P.y-Z.y,x=le*le+De*De,B=le*A-De*_e;if(Math.abs(B)>Number.EPSILON){let q=Math.sqrt(x),J=Math.sqrt(_e*_e+A*A),j=te.x-De/q,Ee=te.y+le/q,he=P.x-A/J,ve=P.y+_e/J,Ye=((he-j)*A-(ve-Ee)*_e)/(le*A-De*_e);Ce=j+le*Ye-Z.x,K=Ee+De*Ye-Z.y;let ee=Ce*Ce+K*K;if(ee<=2)return new se(Ce,K);ye=Math.sqrt(ee/2)}else{let q=!1;le>Number.EPSILON?_e>Number.EPSILON&&(q=!0):le<-Number.EPSILON?_e<-Number.EPSILON&&(q=!0):Math.sign(De)===Math.sign(A)&&(q=!0),q?(Ce=-De,K=le,ye=Math.sqrt(x)):(Ce=le,K=De,ye=Math.sqrt(x/2))}return new se(Ce/ye,K/ye)}let ce=[];for(let Z=0,te=V.length,P=te-1,Ce=Z+1;Z<te;Z++,P++,Ce++)P===te&&(P=0),Ce===te&&(Ce=0),ce[Z]=G(V[Z],V[P],V[Ce]);let ge=[],Se,ze=ce.concat();for(let Z=0,te=R.length;Z<te;Z++){let P=R[Z];Se=[];for(let Ce=0,K=P.length,ye=K-1,le=Ce+1;Ce<K;Ce++,ye++,le++)ye===K&&(ye=0),le===K&&(le=0),Se[Ce]=G(P[Ce],P[ye],P[le]);ge.push(Se),ze=ze.concat(Se)}for(let Z=0;Z<m;Z++){let te=Z/m,P=p*Math.cos(te*Math.PI/2),Ce=g*Math.sin(te*Math.PI/2)+_;for(let K=0,ye=V.length;K<ye;K++){let le=X(V[K],ce[K],Ce);ae(le.x,le.y,-P)}for(let K=0,ye=R.length;K<ye;K++){let le=R[K];Se=ge[K];for(let De=0,_e=le.length;De<_e;De++){let A=X(le[De],Se[De],Ce);ae(A.x,A.y,-P)}}}let nt=g+_;for(let Z=0;Z<k;Z++){let te=u?X(v[Z],ze[Z],nt):v[Z];b?(I.copy(N.normals[0]).multiplyScalar(te.x),w.copy(N.binormals[0]).multiplyScalar(te.y),E.copy(S[0]).add(I).add(w),ae(E.x,E.y,E.z)):ae(te.x,te.y,0)}for(let Z=1;Z<=d;Z++)for(let te=0;te<k;te++){let P=u?X(v[te],ze[te],nt):v[te];b?(I.copy(N.normals[Z]).multiplyScalar(P.x),w.copy(N.binormals[Z]).multiplyScalar(P.y),E.copy(S[Z]).add(I).add(w),ae(E.x,E.y,E.z)):ae(P.x,P.y,h/d*Z)}for(let Z=m-1;Z>=0;Z--){let te=Z/m,P=p*Math.cos(te*Math.PI/2),Ce=g*Math.sin(te*Math.PI/2)+_;for(let K=0,ye=V.length;K<ye;K++){let le=X(V[K],ce[K],Ce);ae(le.x,le.y,h+P)}for(let K=0,ye=R.length;K<ye;K++){let le=R[K];Se=ge[K];for(let De=0,_e=le.length;De<_e;De++){let A=X(le[De],Se[De],Ce);b?ae(A.x,A.y+S[d-1].y,S[d-1].x+P):ae(A.x,A.y,h+P)}}}$(),ne();function $(){let Z=s.length/3;if(u){let te=0,P=k*te;for(let Ce=0;Ce<Q;Ce++){let K=U[Ce];Ie(K[2]+P,K[1]+P,K[0]+P)}te=d+m*2,P=k*te;for(let Ce=0;Ce<Q;Ce++){let K=U[Ce];Ie(K[0]+P,K[1]+P,K[2]+P)}}else{for(let te=0;te<Q;te++){let P=U[te];Ie(P[2],P[1],P[0])}for(let te=0;te<Q;te++){let P=U[te];Ie(P[0]+k*d,P[1]+k*d,P[2]+k*d)}}i.addGroup(Z,s.length/3-Z,0)}function ne(){let Z=s.length/3,te=0;Me(V,te),te+=V.length;for(let P=0,Ce=R.length;P<Ce;P++){let K=R[P];Me(K,te),te+=K.length}i.addGroup(Z,s.length/3-Z,1)}function Me(Z,te){let P=Z.length;for(;--P>=0;){let Ce=P,K=P-1;K<0&&(K=Z.length-1);for(let ye=0,le=d+m*2;ye<le;ye++){let De=k*ye,_e=k*(ye+1),A=te+Ce+De,x=te+K+De,B=te+K+_e,q=te+Ce+_e;Ue(A,x,B,q)}}}function ae(Z,te,P){l.push(Z),l.push(te),l.push(P)}function Ie(Z,te,P){Ne(Z),Ne(te),Ne(P);let Ce=s.length/3,K=T.generateTopUV(i,s,Ce-3,Ce-2,Ce-1);Je(K[0]),Je(K[1]),Je(K[2])}function Ue(Z,te,P,Ce){Ne(Z),Ne(te),Ne(Ce),Ne(te),Ne(P),Ne(Ce);let K=s.length/3,ye=T.generateSideWallUV(i,s,K-6,K-3,K-2,K-1);Je(ye[0]),Je(ye[1]),Je(ye[3]),Je(ye[1]),Je(ye[2]),Je(ye[3])}function Ne(Z){s.push(l[Z*3+0]),s.push(l[Z*3+1]),s.push(l[Z*3+2])}function Je(Z){r.push(Z.x),r.push(Z.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return g_(t,i,e)}static fromJSON(e,t){let i=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];i.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Jr[s.type]().fromJSON(s)),new n(i,e.options)}},m_={generateTopUV:function(n,e,t,i,s){let r=e[t*3],a=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[s*3],d=e[s*3+1];return[new se(r,a),new se(o,l),new se(c,d)]},generateSideWallUV:function(n,e,t,i,s,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],d=e[i*3+1],h=e[i*3+2],u=e[s*3],p=e[s*3+1],g=e[s*3+2],_=e[r*3],m=e[r*3+1],f=e[r*3+2];return Math.abs(o-d)<Math.abs(a-c)?[new se(a,1-l),new se(c,1-h),new se(u,1-g),new se(_,1-f)]:[new se(o,1-l),new se(d,1-h),new se(p,1-g),new se(m,1-f)]}};cs=class n extends kt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,d=[],h=new C,u=new C,p=[],g=[],_=[],m=[];for(let f=0;f<=i;f++){let T=[],S=f/i,b=0;f===0&&a===0?b=.5/t:f===i&&l===Math.PI&&(b=-.5/t);for(let N=0;N<=t;N++){let w=N/t;h.x=-e*Math.cos(s+w*r)*Math.sin(a+S*o),h.y=e*Math.cos(a+S*o),h.z=e*Math.sin(s+w*r)*Math.sin(a+S*o),g.push(h.x,h.y,h.z),u.copy(h).normalize(),_.push(u.x,u.y,u.z),m.push(w+b,1-S),T.push(c++)}d.push(T)}for(let f=0;f<i;f++)for(let T=0;T<t;T++){let S=d[f][T+1],b=d[f][T],N=d[f+1][T],w=d[f+1][T+1];(f!==0||a>0)&&p.push(S,b,w),(f!==i-1||l<Math.PI)&&p.push(b,N,w)}this.setIndex(p),this.setAttribute("position",new gt(g,3)),this.setAttribute("normal",new gt(_,3)),this.setAttribute("uv",new gt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},bi=class n extends kt{constructor(e=new Yr(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),t=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:r};let a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new C,l=new C,c=new se,d=new C,h=[],u=[],p=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new gt(h,3)),this.setAttribute("normal",new gt(u,3)),this.setAttribute("uv",new gt(p,2));function _(){for(let S=0;S<t;S++)m(S);m(r===!1?t:0),T(),f()}function m(S){d=e.getPointAt(S/t,d);let b=a.normals[S],N=a.binormals[S];for(let w=0;w<=s;w++){let I=w/s*Math.PI*2,E=Math.sin(I),y=-Math.cos(I);l.x=y*b.x+E*N.x,l.y=y*b.y+E*N.y,l.z=y*b.z+E*N.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=d.x+i*l.x,o.y=d.y+i*l.y,o.z=d.z+i*l.z,h.push(o.x,o.y,o.z)}}function f(){for(let S=1;S<=t;S++)for(let b=1;b<=s;b++){let N=(s+1)*(S-1)+(b-1),w=(s+1)*S+(b-1),I=(s+1)*S+b,E=(s+1)*(S-1)+b;g.push(N,w,E),g.push(w,I,E)}}function T(){for(let S=0;S<=t;S++)for(let b=0;b<=s;b++)c.x=S/t,c.y=b/s,p.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new Jr[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Kr=class extends Hn{static get type(){return"ShadowMaterial"}constructor(e){super(),this.isShadowMaterial=!0,this.color=new je(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}},Mt=class extends Hn{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=wd,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};ds=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}a=i,i=0;break t}break n}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},rl=class extends ds{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ac,endingEnd:ac}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case oc:r=e,o=2*t-i;break;case lc:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case oc:a=e,l=2*i-t;break;case lc:a=1,l=i+s[1]-s[0];break;default:a=e-1,l=t}let c=(i-t)*.5,d=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=this._offsetPrev,h=this._offsetNext,u=this._weightPrev,p=this._weightNext,g=(i-t)/(s-t),_=g*g,m=_*g,f=-u*m+2*u*_-u*g,T=(1+u)*m+(-1.5-2*u)*_+(-.5+u)*g+1,S=(-1-p)*m+(1.5+p)*_+.5*g,b=p*m-p*_;for(let N=0;N!==o;++N)r[N]=f*a[d+N]+T*a[c+N]+S*a[l+N]+b*a[h+N];return r}},al=class extends ds{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=(i-t)/(s-t),h=1-d;for(let u=0;u!==o;++u)r[u]=a[c+u]*h+a[l+u]*d;return r}},ol=class extends ds{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},_n=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=br(t,this.TimeBufferType),this.values=br(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:br(e.times,Array),values:br(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new ol(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new al(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new rl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case wr:t=this.InterpolantFactoryMethodDiscrete;break;case Uo:t=this.InterpolantFactoryMethodLinear;break;case ya:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return wr;case this.InterpolantFactoryMethodLinear:return Uo;case this.InterpolantFactoryMethodSmooth:return ya}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&__(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ya,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],d=e[o+1];if(c!==d&&(o!==1||c!==e[0]))if(s)l=!0;else{let h=o*i,u=h-i,p=h+i;for(let g=0;g!==i;++g){let _=t[h+g];if(_!==t[u+g]||_!==t[p+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*i,u=a*i;for(let p=0;p!==i;++p)t[u+p]=t[h+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};_n.prototype.TimeBufferType=Float32Array;_n.prototype.ValueBufferType=Float32Array;_n.prototype.DefaultInterpolation=Uo;Si=class extends _n{constructor(e,t,i){super(e,t,i)}};Si.prototype.ValueTypeName="bool";Si.prototype.ValueBufferType=Array;Si.prototype.DefaultInterpolation=wr;Si.prototype.InterpolantFactoryMethodLinear=void 0;Si.prototype.InterpolantFactoryMethodSmooth=void 0;ll=class extends _n{};ll.prototype.ValueTypeName="color";cl=class extends _n{};cl.prototype.ValueTypeName="number";dl=class extends ds{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(s-t),c=e*o;for(let d=c+o;c!==d;c+=4)Zt.slerpFlat(r,0,a,c-o,a,c,l);return r}},Qr=class extends _n{InterpolantFactoryMethodLinear(e){return new dl(this.times,this.values,this.getValueSize(),e)}};Qr.prototype.ValueTypeName="quaternion";Qr.prototype.InterpolantFactoryMethodSmooth=void 0;Mi=class extends _n{constructor(e,t,i){super(e,t,i)}};Mi.prototype.ValueTypeName="string";Mi.prototype.ValueBufferType=Array;Mi.prototype.DefaultInterpolation=wr;Mi.prototype.InterpolantFactoryMethodLinear=void 0;Mi.prototype.InterpolantFactoryMethodSmooth=void 0;hl=class extends _n{};hl.prototype.ValueTypeName="vector";ul=class{constructor(e,t,i){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,h){return c.push(d,h),this},this.removeHandler=function(d){let h=c.indexOf(d);return h!==-1&&c.splice(h,2),this},this.getHandler=function(d){for(let h=0,u=c.length;h<u;h+=2){let p=c[h],g=c[h+1];if(p.global&&(p.lastIndex=0),p.test(d))return g}return null}}},v_=new ul,fl=class{constructor(e){this.manager=e!==void 0?e:v_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};fl.DEFAULT_MATERIAL_NAME="__DEFAULT";ea=class extends Nt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new je(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},ta=class extends ea{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Za=new yt,hd=new C,ud=new C,pl=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new se(512,512),this.map=null,this.mapPass=null,this.matrix=new yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ds,this._frameExtents=new se(1,1),this._viewportCount=1,this._viewports=[new bt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;hd.setFromMatrixPosition(e.matrixWorld),t.position.copy(hd),ud.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ud),t.updateMatrixWorld(),Za.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Za),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Za)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ml=class extends pl{constructor(){super(new as(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},zs=class extends ea{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.shadow=new ml}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},na=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=fd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=fd();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};Cl="\\[\\]\\.:\\/",y_=new RegExp("["+Cl+"]","g"),Rl="[^"+Cl+"]",x_="[^"+Cl.replace("\\.","")+"]",b_=/((?:WC+[\/:])*)/.source.replace("WC",Rl),S_=/(WCOD+)?/.source.replace("WCOD",x_),M_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Rl),E_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Rl),A_=new RegExp("^"+b_+S_+M_+E_+"$"),T_=["material","materials","bones","map"],gl=class{constructor(e,t,i){let s=i||_t.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},_t=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(y_,"")}static parseTrackName(e){let t=A_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);T_.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===c){c=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_t.Composite=gl;_t.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_t.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_t.prototype.GetterByBindingType=[_t.prototype._getValue_direct,_t.prototype._getValue_array,_t.prototype._getValue_arrayElement,_t.prototype._getValue_toArray];_t.prototype.SetterByBindingTypeAndVersioning=[[_t.prototype._setValue_direct,_t.prototype._setValue_direct_setNeedsUpdate,_t.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_array,_t.prototype._setValue_array_setNeedsUpdate,_t.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_arrayElement,_t.prototype._setValue_arrayElement_setNeedsUpdate,_t.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_fromArray,_t.prototype._setValue_fromArray_setNeedsUpdate,_t.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];_v=new Float32Array(1),Hs=class{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ct(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},ia=class extends Wr{constructor(e=10,t=10,i=4473924,s=8947848){i=new je(i),s=new je(s);let r=t/2,a=e/t,o=e/2,l=[],c=[];for(let u=0,p=0,g=-o;u<=t;u++,g+=a){l.push(-o,0,g,o,0,g),l.push(g,0,-o,g,0,o);let _=u===r?i:s;_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3}let d=new kt;d.setAttribute("position",new gt(l,3)),d.setAttribute("color",new gt(c,3));let h=new Ls({vertexColors:!0,toneMapped:!1});super(d,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}},sa=class extends Wr{constructor(e,t=16776960){let i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new kt;r.setIndex(new $t(i,1)),r.setAttribute("position",new gt(s,3)),super(r,new Ls({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){let t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}},ra=class extends Vn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}};typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170")});function C_(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function R_(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function P_(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Wd),this.state=ct.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function I_(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ei.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ct.DOLLY;break;case Ei.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ct.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ct.ROTATE}break;case Ei.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ct.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ct.PAN}break;default:this.state=ct.NONE}this.state!==ct.NONE&&this.dispatchEvent(Il)}function D_(n){switch(this.state){case ct.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ct.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ct.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function L_(n){this.enabled===!1||this.enableZoom===!1||this.state!==ct.NONE||(n.preventDefault(),this.dispatchEvent(Il),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Wd))}function N_(n){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(n)}function O_(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ai.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ct.TOUCH_ROTATE;break;case Ai.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ct.TOUCH_PAN;break;default:this.state=ct.NONE}break;case 2:switch(this.touches.TWO){case Ai.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ct.TOUCH_DOLLY_PAN;break;case Ai.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ct.TOUCH_DOLLY_ROTATE;break;default:this.state=ct.NONE}break;default:this.state=ct.NONE}this.state!==ct.NONE&&this.dispatchEvent(Il)}function U_(n){switch(this._trackPointer(n),this.state){case ct.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ct.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ct.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ct.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ct.NONE}}function B_(n){this.enabled!==!1&&n.preventDefault()}function F_(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function V_(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var kd,Il,Wd,ha,Gd,w_,Tt,Gt,ct,Pl,ua,Xd=Pt(()=>{da();kd={type:"change"},Il={type:"start"},Wd={type:"end"},ha=new ss,Gd=new fn,w_=Math.cos(70*Rd.DEG2RAD),Tt=new C,Gt=2*Math.PI,ct={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Pl=1e-6,ua=class extends ra{constructor(e,t=null){super(e,t),this.state=ct.NONE,this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ei.ROTATE,MIDDLE:Ei.DOLLY,RIGHT:Ei.PAN},this.touches={ONE:Ai.ROTATE,TWO:Ai.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new Zt,this._lastTargetPosition=new C,this._quat=new Zt().setFromUnitVectors(e.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Hs,this._sphericalDelta=new Hs,this._scale=1,this._panOffset=new C,this._rotateStart=new se,this._rotateEnd=new se,this._rotateDelta=new se,this._panStart=new se,this._panEnd=new se,this._panDelta=new se,this._dollyStart=new se,this._dollyEnd=new se,this._dollyDelta=new se,this._dollyDirection=new C,this._mouse=new se,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=R_.bind(this),this._onPointerDown=C_.bind(this),this._onPointerUp=P_.bind(this),this._onContextMenu=B_.bind(this),this._onMouseWheel=L_.bind(this),this._onKeyDown=N_.bind(this),this._onTouchStart=O_.bind(this),this._onTouchMove=U_.bind(this),this._onMouseDown=I_.bind(this),this._onMouseMove=D_.bind(this),this._interceptControlDown=F_.bind(this),this._interceptControlUp=V_.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(kd),this.update(),this.state=ct.NONE}update(e=null){let t=this.object.position;Tt.copy(t).sub(this.target),Tt.applyQuaternion(this._quat),this._spherical.setFromVector3(Tt),this.autoRotate&&this.state===ct.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Gt:i>Math.PI&&(i-=Gt),s<-Math.PI?s+=Gt:s>Math.PI&&(s-=Gt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Tt.setFromSpherical(this._spherical),Tt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Tt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=Tt.length();a=this._clampDistance(o*this._scale);let l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let o=new C(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new C(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Tt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(ha.origin.copy(this.object.position),ha.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ha.direction))<w_?this.object.lookAt(this.target):(Gd.setFromNormalAndCoplanarPoint(this.object.up,this.target),ha.intersectPlane(Gd,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Pl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Pl||this._lastTargetPosition.distanceToSquared(this.target)>Pl?(this.dispatchEvent(kd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Gt/60*this.autoRotateSpeed*e:Gt/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Tt.setFromMatrixColumn(t,0),Tt.multiplyScalar(-e),this._panOffset.add(Tt)}_panUp(e,t){this.screenSpacePanning===!0?Tt.setFromMatrixColumn(t,1):(Tt.setFromMatrixColumn(t,0),Tt.crossVectors(this.object.up,Tt)),Tt.multiplyScalar(e),this._panOffset.add(Tt)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Tt.copy(s).sub(this.target);let r=Tt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(Gt*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-Gt*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(Gt*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-Gt*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new se,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}});function re(n,e={}){let t=n+JSON.stringify(e);return Dl[t]||(Dl[t]=new Mt({color:n,roughness:.6,metalness:.05,...e})),Dl[t]}function Pe(n,e,t,i,s=0,r=0,a=0,o){let l=new He(new Ot(n,e,t),i);return l.position.set(s,r+e/2,a),l.castShadow=!0,l.receiveShadow=!0,o&&o.add(l),l}function Qe(n,e,t,i=0,s=0,r=0,a,o=24){let l=new He(new En(n,n,e,o),t);return l.position.set(i,s+e/2,r),l.castShadow=!0,l.receiveShadow=!0,a&&a.add(l),l}function Tn(n,e,t){let i=document.createElement("canvas");i.width=n,i.height=e;let s=i.getContext("2d");t(s,n,e);let r=new Xr(i);return r.colorSpace=Lt,r.anisotropy=8,r}function Ws(n,e,t,i,s,r,a,o=!0){let l=new He(new sn(n,e),new Mt({map:t,transparent:o,roughness:.7}));return l.rotation.x=-Math.PI/2,l.position.set(i,s,r),l.receiveShadow=!0,a&&a.add(l),l}function Kt(n,e,t,i,s,r={}){let o=Tn(e*12,t*12,l=>{l.clearRect(0,0,e*12,t*12);for(let c of s){let[d,h,u,p=2,g=0,_="#ffffff",m="center",f="700"]=c;l.save(),l.translate((h+e/2)*12,(u+t/2)*12),l.rotate(g*Math.PI/180),l.fillStyle=_,l.font=`${f} ${p*12}px Arial, Helvetica, sans-serif`,l.textAlign=m,l.textBaseline="middle",l.fillText(d,0,0),l.restore()}r.draw&&r.draw(l,12)});return Ws(e,t,o,0,i+.02,0,n)}function Qd(){let n=new $e;n.name="board";let e={},t=new ls,i=1.5;t.moveTo(Ve(i),Fe(0)),t.lineTo(Ve(64.5),Fe(0)),t.lineTo(Ve(66.1),Fe(1.6)),t.lineTo(Ve(66.1),Fe(4)),t.lineTo(Ve(68.6),Fe(6.5)),t.lineTo(Ve(68.6),Fe(50)),t.lineTo(Ve(66.1),Fe(52.5)),t.lineTo(Ve(66.1),Fe(53.3)),t.lineTo(Ve(i),Fe(53.3)),t.quadraticCurveTo(Ve(0),Fe(53.3),Ve(0),Fe(53.3-i)),t.lineTo(Ve(0),Fe(i)),t.quadraticCurveTo(Ve(0),Fe(0),Ve(i),Fe(0));for(let[E,y]of[[15.2,2.5],[66-2.5,7.6+1],[66-2.5,35.5],[13.97,50.8]]){let v=new os;v.absarc(Ve(E),Fe(y),1.6,0,Math.PI*2,!0),t.holes.push(v)}let s=new Vs(t,{depth:rt,bevelEnabled:!1});s.rotateX(Math.PI/2),s.translate(0,rt,0);let r=new He(s,re(1382170,{roughness:.45}));r.castShadow=!0,r.receiveShadow=!0,n.add(r);let a=[],o=(E,y,v,R=1.6,F=0,U="#ffffff",V="center")=>a.push([E,Ve(y),Fe(v),R,F,U,V]);Ll.forEach((E,y)=>o(E,Ol+y*dt,5.2,1.25,-90)),Nl.forEach((E,y)=>o(E,Ul+y*dt,5.2,1.25,-90)),qd.forEach((E,y)=>o(E,Bl+y*dt,48,1.25,-90)),jd.forEach((E,y)=>o(E,fa+y*dt,48,1.25,-90)),o("POWER",Bl+9,45.2,2),o("ANALOG",fa+3,45.2,2),o("I2C",fa+12,45.2,2),o("S",16,pa.S,1.6),o("V",16,pa.V,1.6),o("G",16,pa.G,1.6),o("G",Gs.G,17.6,1.3),o("V",Gs.V,17.6,1.3),o("SDA",Gs.SDA,17.6,1),o("SCL",Gs.SCL,17.6,1),o("I2C",37.2,23.4,1.8,-90),o("G",ma.G,31.5,1.3),o("3V3",ma.V,31.5,1),o("S",ma.S,31.5,1.3);for(let[E,y]of Object.entries(Zd))o(E,28.6,y,1.3,0,"#ffffff","left");o("ANALOG",32.2,37.2,1.8,-90),o("5V",17,23,1.4),o("3.3V",17,31.2,1.4),o("ACEBOTT",47.5,16.2,2,0,"#ffffff"),o("ESP32 Plus",48.5,41,2.4,0,"#ffffff"),o("DC 7~12V",6,50.2,1.4),o("RESET",6,8.7,1.1),o("PWR",13.5,26,1.1),o("TX",66.4,7.6,1),o("RX",66.4,10.14,1),o("GND",66.6,12.68,.9),o("V",66.4,15.22,1),Kt(n,Jd,Kd,rt,a,{draw:(E,y)=>{E.strokeStyle="#ffffff",E.lineWidth=.25*y,E.strokeRect(19.6*y,32*y,7.9*y,10.6*y),E.strokeRect(25.2*y,18.4*y,10.4*y,10.2*y)}});let l=re(1995736,{roughness:.5}),c=Tn(64,64,E=>{E.fillStyle="#1e73d8",E.fillRect(0,0,64,64),E.fillStyle="#0a0f1a",E.fillRect(20,20,24,24)}),d=new Mt({map:c,roughness:.5});function h(E,y,v,R){let F=E.length,U=F*dt,V=new He(new Ot(U,8.5,dt),[l,l,d,l,l,l]);c.wrapS=c.wrapT=Rs,V.position.set(Ve(y-dt/2+U/2),rt+4.25,Fe(v)),V.castShadow=!0,V.receiveShadow=!0,n.add(V);let X=c.clone();X.repeat.set(F,1),X.needsUpdate=!0,V.material=[l,l,new Mt({map:X,roughness:.5}),l,l,l],E.forEach((k,Q)=>{let G=R+k;e[G]&&(G=G+"_2"),e[G]={pos:new C(Ve(y+Q*dt),rt+8.5,Fe(v)),type:"female",label:k}})}h(Ll,Ol,$d,"H."),h(Nl,Ul,$d,"H."),h(qd,Bl,Yd,"P."),h(jd,fa,Yd,"AH.");let u={S:1995736,V:13904426,G:2236962,SDA:1995736,SCL:15921906,"3V3":13904426},p=new Ot(.64,6,.64);function g(E,y,v,R,F){Pe(dt,2.5,dt,re(v),Ve(E),rt,Fe(y),n);let U=new He(p,wi());U.position.set(Ve(E),rt+2.5+3-1,Fe(y)),n.add(U),R&&(e[R]={pos:new C(Ve(E),rt+2.5,Fe(y)),type:"male",label:F})}let _=[...Ll.slice(4).map((E,y)=>[E,Ol+(y+4)*dt]),...Nl.slice(0,6).map((E,y)=>[E,Ul+y*dt])];for(let[E,y]of _)for(let[v,R]of Object.entries(pa))g(y,R,u[v],`D${E}.${v}`,`GPIO ${E} \xB7 ${v}`);["TX","RX","GND","V"].forEach((E,y)=>g(64,7.6+y*dt,1995736,"SER."+E,E)),z_.forEach((E,y)=>{for(let[v,R]of Object.entries(Gs))g(R,E,u[v],`I${y+1}.${v}`,`I2C fila ${y+1} \xB7 ${v}`)});for(let[E,y]of Object.entries(Zd))for(let[v,R]of Object.entries(ma))g(R,y,v==="V"?u["3V3"]:u[v],`A${E}.${v}`,`ANALOG ${E} \xB7 ${v==="V"?"3V3":v}`);Pe(25.5,.8,18,re(1118481),Ve(52.75),rt,Fe(28),n);let m=Pe(17.5,2.4,16,vn(),Ve(49.2),rt+.8,Fe(28),n),f=Tn(420,384,E=>{E.fillStyle="#c9ccd1",E.fillRect(0,0,420,384),E.fillStyle="#555",E.font="bold 44px Arial",E.fillText("ESP32-WROOM-32",20,80),E.font="30px Arial",E.fillText("Wi-Fi \xB7 Bluetooth",20,140),E.fillText("CE  FCC ID",20,190),E.strokeStyle="#777",E.lineWidth=6,E.strokeRect(300,250,90,90)});Ws(17.5,16,f,Ve(49.2),rt+3.22,Fe(28),n,!1);let T=Tn(200,400,E=>{E.fillStyle="#111",E.fillRect(0,0,200,400),E.strokeStyle="#c8a24a",E.lineWidth=10,E.beginPath(),E.moveTo(30,40);for(let y=0;y<6;y++)E.lineTo(170,40+y*55),E.lineTo(170,67+y*55),E.lineTo(30,67+y*55),E.lineTo(30,95+y*55);E.stroke()});Ws(7.5,18,T,Ve(61.75),rt+.82,Fe(28),n,!1);let S=Pe(16,10.8,12,vn(),Ve(1.7),rt,Fe(15.5),n);S.name="usbPort",Pe(.3,6.5,8,re(1118481),Ve(-6.2),rt+2.2,Fe(15.5),n),e.USB={pos:new C(Ve(-6.3),rt+5.4,Fe(15.5)),type:"usb"},Pe(14,11,9,re(1710618,{roughness:.8}),Ve(5.2),rt,Fe(43),n);let b=Qe(2.6,.5,re(328965),0,0,0,n);b.rotation.z=Math.PI/2,b.position.set(Ve(-1.85),rt+6,Fe(43)),e.DC={pos:new C(Ve(-1.8),rt+6,Fe(43)),type:"dc"},Pe(6,3.3,6,vn(),Ve(6),rt,Fe(4.6),n),Qe(1.7,1.2,re(3355443),Ve(6),rt+3.3,Fe(4.6),n),Pe(5,1.2,5,re(855309),Ve(21),rt,Fe(15.5),n),Pe(4,1.2,3,re(855309),Ve(30),rt,Fe(15.2),n),Pe(6.2,3.2,6.2,re(7040884),Ve(12.5),rt,Fe(32),n),Pe(6.5,2.2,7,re(855309),Ve(16.5),rt,Fe(41.5),n),Pe(3,1.2,1.6,vn(),Ve(16.5),rt,Fe(37.2),n);let w=(E=>{let y=E;return()=>(y=(y*9301+49297)%233280)/233280})(7);for(let E=0;E<26;E++){let y=8+w()*30,v=20+w()*22;y>18&&y<37&&v>17&&v<43||Pe(1.6,.6,.8,re(w()>.5?12094037:1842204),Ve(y),rt,Fe(v),n)}Pe(1.6,.7,.8,re(16728128,{emissive:16719904,emissiveIntensity:.8}),Ve(13.5),rt,Fe(24.5),n),Pe(4,3.4,8.6,vn(),Ve(17),rt,Fe(27),n);let I=Pe(2,2.4,2.6,re(2236962),Ve(17),rt+3.4,Fe(25.6),n);return I.name="switchLever",n.userData.setSwitch=E=>{I.position.z=Fe(E==="5V"?25.4:28.6)},n.userData.switchPos=new C(Ve(17),rt+6,Fe(27)),n.userData.pins=e,n}function Jt(n,e,t,i,s=0){return Pe(n,1.6,e,re(t,{roughness:.5}),0,s,0,i)}function an(n,e,t,i=3.2,s=dt,r=0){let a={},o=e.length;return Pe(o*s,2.5,2.5,re(1710618),r,.2,t/2-1.25,n),e.forEach((l,c)=>{let d=r+(c-(o-1)/2)*s,h=new He(new Ot(.64,.64,7),wi());h.position.set(d,1.45,t/2+2.5),n.add(h),a[l]={pos:new C(d,1.45,t/2+1),dir:new C(0,0,1),type:"male"}}),a}function on(n,e,t,i,s=dt,r=0,a="#ffffff"){let o=e.map((l,c)=>[l,r+(c-(e.length-1)/2)*s,i/2-4.2,l.length>2?1.05:1.5,-90,a]);Kt(n,t,i,1.6,o)}function ti(n,e,t,i,s,r=2,a="#ffffff"){Kt(n,e,t,1.62,[[i,0,s,r,0,a]])}function th(n){let e=new $e,t=n.pos;Pe(14,10,14,re(2236962),t.x-9,t.y-5,t.z,e),Pe(10,7.5,9.5,vn(),t.x-1.5,t.y-3.75,t.z,e);let i=new yi(new C(t.x-16,t.y,t.z),new C(t.x-40,t.y,t.z),new C(t.x-40,2,t.z-8),new C(t.x-58,2,t.z-28)),s=new He(new bi(i,40,2.2,10),re(2236962));return s.castShadow=!0,e.add(s),e}var Jd,Kd,rt,Ve,Fe,dt,Dl,vn,wi,Ll,Nl,qd,jd,Ol,Ul,Bl,fa,$d,Yd,pa,Gs,z_,ma,Zd,An,eh,nh=Pt(()=>{da();Jd=68.6,Kd=53.3,rt=1.6,Ve=n=>n-Jd/2,Fe=n=>n-Kd/2,dt=2.54,Dl={};vn=()=>re(13225169,{metalness:.85,roughness:.3}),wi=()=>re(14201946,{metalness:.9,roughness:.3});Ll=["SCL","SDA","5V","GND","18","19","23","5","13","12"],Nl=["14","27","16","17","25","26","TX","RX"],qd=["0","5V","RST","3V3","5V","GND","GND","VIN"],jd=["2","4","35","34","SDA","SCL"],Ol=18,Ul=44.2,Bl=26.5,fa=49.5,$d=2.2,Yd=51.1,pa={S:7.6,V:10.14,G:12.68},Gs={G:26.6,V:29.14,SDA:31.68,SCL:34.22},z_=[19.6,22.14,24.68,27.22],ma={G:21,V:23.54,S:26.08},Zd={34:33.4,35:35.94,4:38.48,2:41.02};An=2051996,eh={led(n){let e=new $e,t=20,i=24;Jt(t,i,An,e);let s={rojo:16722731,verde:2282347,azul:2849791}[n.color]||16722731,r=new Mt({color:s,transparent:!0,opacity:.85,roughness:.15,emissive:s,emissiveIntensity:0});Qe(2.6,5,r,0,1.6,-3,e);let a=new He(new cs(2.6,20,12,0,Math.PI*2,0,Math.PI/2),r);a.position.set(0,6.6,-3),e.add(a),Qe(3,1,r,0,1.6,-3,e),e.userData.glow=r;let o=["G","V","S"];return on(e,o,t,i),ti(e,t,i,"LED "+n.color.toUpperCase(),-9.5,2),{group:e,pins:an(e,o,i)}},rgb(){let n=new $e,e=22,t=24;Jt(e,t,An,n);let i=new Mt({color:16777215,transparent:!0,opacity:.8,roughness:.2,emissive:16777215,emissiveIntensity:0});Qe(2.6,5,i,0,1.6,-3,n);let s=new He(new cs(2.6,20,12,0,Math.PI*2,0,Math.PI/2),i);s.position.set(0,6.6,-3),n.add(s),n.userData.glow=i;let r=["R","G","B","-"];return on(n,r,e,t),ti(n,e,t,"LED RGB",-9.5,2),{group:n,pins:an(n,r,t)}},button(n){let e=new $e,t=22,i=26;Jt(t,i,An,e),Pe(12,3.5,12,re(2236962),0,1.6,-3,e),Qe(5,4,re(n.cap||15909376),0,5.1,-3,e);let s=["G","V","S"];return on(e,s,t,i),ti(e,t,i,"PULSADOR",-11,2),{group:e,pins:an(e,s,i)}},buzzer(){let n=new $e,e=20,t=26;Jt(e,t,An,n),Qe(6,8,re(1447446),0,1.6,-3.5,n),Qe(1,.2,re(4473924),0,9.6,-3.5,n);let i=["G","V","S"];return on(n,i,e,t),ti(n,e,t,"ZUMBADOR PASIVO",-11.3,1.6),{group:n,pins:an(n,i,t)}},ldr(){let n=new $e,e=20,t=24;Jt(e,t,An,n);let i=Tn(128,128,r=>{r.fillStyle="#e8d6a8",r.beginPath(),r.arc(64,64,62,0,7),r.fill(),r.strokeStyle="#b5521f",r.lineWidth=9,r.beginPath(),r.moveTo(20,34);for(let a=0;a<5;a++)r.lineTo(108,34+a*15),r.lineTo(108,41+a*15),r.lineTo(20,41+a*15),r.lineTo(20,49+a*15);r.stroke()});Qe(2.6,2,re(15259304),0,1.6,-4,n),Ws(5.2,5.2,i,0,3.62,-4,n);let s=["G","V","S"];return on(n,s,e,t),ti(n,e,t,"SENSOR DE LUZ",-9.8,1.7),{group:n,pins:an(n,s,t)}},lm35(){let n=new $e,e=20,t=24;Jt(e,t,An,n);let i=new He(new En(2.4,2.4,5,24,1,!1,0,Math.PI),re(1118481));i.position.set(0,1.6+2.5,-3),i.castShadow=!0,n.add(i),Pe(4.8,5,.3,re(1118481),0,1.6,-3,n);let s=["G","V","S"];return on(n,s,e,t),ti(n,e,t,"LM35",-9.5,2.2),{group:n,pins:an(n,s,t)}},ir(){let n=new $e,e=14,t=34;Jt(e,t,An,n);let i=Qe(1.5,5,new Mt({color:14674175,transparent:!0,opacity:.8}),0,0,0,n);i.rotation.x=Math.PI/2,i.position.set(-3,4,-t/2-1);let s=Qe(1.5,5,re(1118481),0,0,0,n);s.rotation.x=Math.PI/2,s.position.set(3,4,-t/2-1),Pe(6,4.5,6,re(1925072),0,1.6,-2,n),Qe(1.2,1,re(15790320),0,6.1,-2,n),Pe(5,1.2,4,re(855309),0,1.6,6,n);let r=["OUT","GND","VCC"];return on(n,r,e,t),ti(n,e,t,"SENSOR IR",-10.5,1.6),{group:n,pins:an(n,r,t)}},soil(){let n=new $e,e=20,t=60,i=new ls;i.moveTo(-10,30),i.lineTo(10,30),i.lineTo(10,-14),i.lineTo(8,-30),i.lineTo(3,-30),i.lineTo(3,-12),i.lineTo(-3,-12),i.lineTo(-3,-30),i.lineTo(-8,-30),i.lineTo(-10,-14),i.lineTo(-10,30);let s=new Vs(i,{depth:1.6,bevelEnabled:!1});s.rotateX(Math.PI/2),s.translate(0,1.6,0),s.scale(1,1,-1);let r=new He(s,re(An));r.castShadow=!0,n.add(r),Pe(1.6,.1,18,wi(),-6.5,1.6,-20,n),Pe(1.6,.1,18,wi(),6.5,1.6,-20,n);let a=["G","V","S"];return on(n,a,e,t),ti(n,e,t,"HUMEDAD",14,1.8),{group:n,pins:an(n,a,t)}},relay(){let n=new $e,e=28,t=42;Jt(e,t,An,n),Pe(15.5,15,19,re(3108832,{roughness:.35}),0,1.6,-2,n),Kt(n,e,t,16.6,[["SRD-05VDC",0,-4,1.6],["10A 250VAC",0,0,1.4]]);let i={};["NC","COM","NO"].forEach((r,a)=>{let o=(a-1)*5;Pe(5,10,7.5,re(1745120),o,1.6,-t/2+3.8,n),Qe(1.3,.6,vn(),o,11.6,-t/2+3.8,n),i[r]={pos:new C(o,5.5,-t/2),dir:new C(0,0,-1),type:"terminal"}}),Pe(1.6,.8,1.2,re(16724016,{emissive:0}),9,1.6,10,n);let s=["G","V","S"];return on(n,s,e,t),Kt(n,e,t,1.62,[["NC",-5,-t/2+9.2,1.4],["COM",0,-t/2+9.2,1.2],["NO",5,-t/2+9.2,1.4],["REL\xC9",-9,12,1.8]]),{group:n,pins:{...an(n,s,t),...i}}},servo(){let n=new $e;Pe(12.4,22.5,23,re(1925072,{roughness:.4}),0,0,0,n),Pe(12.4,2.5,32.5,re(1925072,{roughness:.4}),0,15.5,0,n),Qe(5.8,4,re(1925072),0,22.5,-5.8,n),Qe(2.2,4,re(16777215),0,26.5,-5.8,n);let e=new $e;e.position.set(0,29,-5.8),n.add(e),Pe(20,1.6,6,re(16777215),-7,0,0,e);for(let r=0;r<6;r++)Pe(10,3,3,re(r%2?16777215:14417947),-20-r*10,1.6,0,e);n.userData.arm=e;let t=Tn(256,128,r=>{r.fillStyle="#1d5fd0",r.fillRect(0,0,256,128),r.fillStyle="#fff",r.font="bold 44px Arial",r.fillText("SERVO 180\xB0",10,60),r.font="30px Arial",r.fillText("0\xB0 - 180\xB0",10,105)}),i=new He(new sn(22,11),new Mt({map:t}));i.rotation.y=Math.PI/2,i.position.set(6.25,9,0),n.add(i);let s={};return["marron","rojo","naranja"].forEach((r,a)=>{s[r]={pos:new C((a-1)*1.2,3,11.6),dir:new C(0,0,1),type:"lead"}}),{group:n,pins:s}},lcd(n){let e=new $e,t=80,i=36;Jt(t,i,2067002,e),Pe(71,7,24,re(1118481),0,1.6,0,e);let s=Tn(1024,224,l=>{l.fillStyle="#2a56e8",l.fillRect(0,0,1024,224),l.fillStyle="rgba(255,255,255,0.08)";for(let c=0;c<2;c++)for(let d=0;d<16;d++)l.fillRect(24+d*62,24+c*98,54,82);l.fillStyle="#f2f6ff",l.font='bold 76px "Courier New", monospace',(n.lines||["",""]).forEach((c,d)=>{for(let h=0;h<16&&h<c.length;h++)l.fillText(c[h],30+h*62,92+d*98)})}),r=new He(new sn(64,14),new Mt({map:s,emissive:16777215,emissiveMap:s,emissiveIntensity:.35}));r.rotation.x=-Math.PI/2,r.position.set(0,8.62,0),e.add(r);for(let[l,c]of[[-37,-15],[37,-15],[-37,15],[37,15]])Qe(1.5,.2,re(13421772),l,1.6,c,e);Kt(e,t,i,1.62,[["LCD1602 I2C  (0x27)",0,-15.5,2]]),Pe(6,2,20,re(1118481),-t/2+3,1.6,0,e);let a=["GND","VCC","SDA","SCL"],o={};return Pe(2.5,2.5,4*dt,re(1710618),-t/2-1.25,.2,0,e),a.forEach((l,c)=>{let d=(c-1.5)*dt,h=new He(new Ot(7,.64,.64),wi());h.position.set(-t/2-4.5,1.45,d),e.add(h),o[l]={pos:new C(-t/2-3,1.45,d),dir:new C(-1,0,0),type:"male"}}),Kt(e,t,i,1.62,a.map((l,c)=>[l,-t/2+9.5,(c-1.5)*dt,1.4,0,"#ffffff","left"])),{group:e,pins:o}},oled(n){let e=new $e,t=35.5,i=33.6;Jt(t,i,1720207,e),Pe(33,1.6,22,re(657930,{roughness:.2}),0,1.6,-1.5,e);let s=Tn(512,256,o=>{o.fillStyle="#000",o.fillRect(0,0,512,256),o.fillStyle="#e8f4ff",({parking:c=>{c.font="bold 28px monospace",c.fillText("APARCAMIENTO",8,30),c.font="bold 96px monospace",c.fillText("14",8,140),c.font="bold 30px monospace",c.fillText("cm",140,140),c.fillText("MUY CERCA",8,190),c.strokeStyle="#e8f4ff",c.lineWidth=4,c.strokeRect(6,216,496,30),c.fillRect(6,216,70,30)},fan:c=>{c.font="bold 30px monospace",c.fillText("MODO: AUTO",8,34),c.fillText("Temp: 27.0 C",8,84),c.fillText("Pres: 1014 hPa",8,130),c.fillText("Velocidad: 70 %",8,180),c.strokeStyle="#e8f4ff",c.lineWidth=4,c.strokeRect(6,210,496,36),c.fillRect(256,218,172,20),c.fillRect(254,202,4,48)}}[n.draw]||(c=>{c.font="bold 40px monospace",c.fillText("OLED",20,60)}))(o)}),r=new He(new sn(29,14.5),new Mt({map:s,emissive:16777215,emissiveMap:s,emissiveIntensity:.6}));r.rotation.x=-Math.PI/2,r.rotation.z=Math.PI,r.position.set(0,3.22,-2),e.add(r);let a=["GND","VCC","SCL","SDA"];return on(e,a,t,i),Kt(e,t,i,1.62,[['OLED 1.3"',0,-15.3,1.6]]),{group:e,pins:an(e,a,i)}},hcsr04(){let n=new $e;Pe(30,12,12,re(10134445),0,0,2,n);let e=new $e;e.position.set(0,12,0),n.add(e),Pe(45,20,1.6,re(An),0,0,0,e);for(let a of[-13,13]){let o=Qe(8,12,vn(),0,0,0,e);o.rotation.x=Math.PI/2,o.position.set(a,11,-6.8);let l=Qe(6.5,.4,re(3355443),0,0,0,e);l.rotation.x=Math.PI/2,l.position.set(a,11,-12.9)}Pe(5,4,2,re(14211288),0,15,-1.5,e);let t=["VCC","Trig","Echo","GND"],i={};Pe(4*dt,2.5,2.5,re(1710618),0,2,2.05,e),t.forEach((a,o)=>{let l=(o-1.5)*dt,c=new He(new Ot(.64,.64,7),wi());c.position.set(l,3.25,5.5),e.add(c),i[a]={pos:new C(l,15.25,4),dir:new C(0,0,1),type:"male"}});let s=Tn(512,128,a=>{a.fillStyle="#1f4f9c",a.fillRect(0,0,512,128),a.fillStyle="#fff",a.font="bold 30px Arial",a.textAlign="center",t.forEach((o,l)=>a.fillText(o,256+(l-1.5)*29*1,112)),a.font="bold 34px Arial",a.fillText("HC-SR04",256,50)}),r=new He(new sn(45,11.25),new Mt({map:s}));return r.position.set(0,12+5.6,.82),n.add(r),{group:n,pins:i}},joystick(){let n=new $e,e=26,t=34;Jt(e,t,1118481,n),Pe(16,9,16,re(2829099),0,1.6,-4,n);let i=Qe(1.6,9,re(7829367),0,10.6,-4,n);Qe(6.5,6,re(1118481),0,18,-4,n);let s=["GND","+5V","VRx","VRy","SW"];return on(n,s,e,t),Kt(n,e,t,1.62,[["JOYSTICK",0,7,1.8],["\u2191 Y",-9.5,-13,1.8]]),{group:n,pins:an(n,s,t)}},bmp280(){let n=new $e,e=14,t=16;Jt(e,t,7024552,n),Pe(2.5,.9,2,vn(),0,1.6,-3,n);let i=["VCC","GND","SCL","SDA"];return on(n,i,e,t),Kt(n,e,t,1.62,[["BMP280",0,-6.3,1.5]]),{group:n,pins:an(n,i,t)}},l298n(){let n=new $e,e=43,t=43;Jt(e,t,13115434,n);let i=new $e;i.position.set(0,1.6,-8),n.add(i),Pe(23,3,16,re(1118481,{metalness:.4}),0,0,0,i);for(let o=0;o<8;o++)Pe(1.2,22,16,re(1118481,{metalness:.4}),-10+o*2.85,3,0,i);let s={},r=(o,l,c,d,h)=>o.forEach((u,p)=>{let g=(p-(o.length-1)/2)*5,_=d?l:l+g,m=d?c+g:c;Pe(d?7.5:5,10,d?5:7.5,re(1745120),_,1.6,m,n),Qe(1.3,.6,vn(),_,11.6,m,n),s[u]={pos:new C(_+h.x*3.8,5.5,m+h.z*3.8),dir:h,type:"terminal"}});r(["OUT1","OUT2"],-e/2+3.8,-8,!0,new C(-1,0,0)),r(["OUT3","OUT4"],e/2-3.8,-8,!0,new C(1,0,0)),r(["+12V","GND","+5V"],-11,t/2-3.8,!1,new C(0,0,1));let a=["ENA","IN1","IN2","IN3","IN4","ENB"];return a.forEach((o,l)=>{let c=4+l*dt,d=t/2-5;Pe(dt,2.5,dt,re(1710618),c,1.6,d,n);let h=new He(new Ot(.64,6,.64),wi());h.position.set(c,1.6+2.5+2,d),n.add(h),s[o]={pos:new C(c,1.6+2.5,d),dir:new C(0,1,0),type:"maleUp"}}),Pe(dt*1,5,dt*2,re(1118481),4+5*dt,4.1,t/2-5-dt/2,n),Pe(5,5,2.6,re(1118481),-14,1.6,6,n),Kt(n,e,t,1.62,[...a.map((o,l)=>[o,4+l*dt,t/2-9,1,-90]),["+12V",-16,t/2-9.2,1.3],["GND",-11,t/2-9.2,1.3],["+5V",-6,t/2-9.2,1.3],["OUT1",-e/2+10.5,-10.5,1.2],["OUT2",-e/2+10.5,-5.5,1.2],["L298N",0,4,2.4],["12V EN",-14,9.6,1.1]]),{group:n,pins:s}},motor(){let n=new $e;Pe(37,18,22,re(15909376,{roughness:.5}),0,0,0,n);let e=Qe(10,26,vn(),0,0,0,n);e.rotation.z=Math.PI/2,e.position.set(-31,9,0),Qe(2.6,26,re(16119285),0,0,0,n).position.set(8,-4,0);let i=new $e;i.position.set(8,24,0),n.add(i);for(let r=0;r<3;r++){let a=Pe(34,1,9,re(15964416),17,0,0);a.rotation.y=0;let o=new $e;o.rotation.y=r*Math.PI*2/3,a.rotation.x=.35,o.add(a),i.add(o)}Qe(4,3,re(3355443),0,-1,0,i),n.userData.prop=i;let s={rojo:{pos:new C(-44,12,-3),dir:new C(-1,0,0),type:"lead"},negro:{pos:new C(-44,6,3),dir:new C(-1,0,0),type:"lead"}};return{group:n,pins:s}},pump(){let n=new $e,e=new He(new En(34,30,80,40,1,!0),new Mt({color:14544639,transparent:!0,opacity:.25,side:pn,roughness:.1}));e.position.set(0,40,0),n.add(e),Qe(30,.8,new Mt({color:14544639,transparent:!0,opacity:.4}),0,0,0,n,40);let t=new He(new En(32.5,30,50,40),new Mt({color:3842303,transparent:!0,opacity:.35,roughness:.1}));t.position.set(0,26,0),n.add(t);let i=Qe(12,30,re(2105376),0,1,0,n);Qe(12.5,4,re(3355443),0,31,0,n);let s=Qe(2.5,12,re(2105376),0,0,0,n);s.rotation.z=Math.PI/2,s.position.set(16,26,0);let r=new Os([new C(22,26,0),new C(30,60,0),new C(10,95,0),new C(-30,95,0),new C(-55,70,0)]),a=new He(new bi(r,40,3,10),new Mt({color:15790320,transparent:!0,opacity:.7}));n.add(a);let o={rojo:{pos:new C(-4,35,0),dir:new C(0,1,0),type:"lead"},negro:{pos:new C(4,35,0),dir:new C(0,1,0),type:"lead"}};return Kt(n,40,20,36,[["BOMBA 3-6V",0,0,2.4,0,"#ffffff"]]),{group:n,pins:o}},plant(){let n=new $e,e=new He(new En(38,28,55,32),re(12608570));e.position.y=27.5,e.castShadow=!0,n.add(e),Qe(35,2,re(4861984),0,53,0,n,32);for(let t=0;t<7;t++){let i=new He(new cs(9,12,8),re(4168250));i.scale.set(1,.4,2),i.position.set(Math.cos(t)*12,70+t%3*8,Math.sin(t)*12),i.rotation.y=t,n.add(i)}return Qe(1.5,20,re(3111466),0,55,0,n),{group:n,pins:{}}},breadboard(){let n=new $e,e=165,t=55;Pe(e,8.5,t,re(16053488,{roughness:.8}),0,0,0,n);let i=Tn(1650,550,a=>{a.fillStyle="#f4f4f0",a.fillRect(0,0,1650,550),a.fillStyle="#d03030",a.fillRect(30,18,1590,4),a.fillRect(30,528,1590,4),a.fillStyle="#2050c0",a.fillRect(30,60,1590,4),a.fillRect(30,486,1590,4),a.fillStyle="#bbb",a.fillRect(30,268,1590,14),a.fillStyle="#333";for(let o=0;o<63;o++){let l=40+o*25.4;for(let c=0;c<5;c++)a.fillRect(l-4,100+c*25.4-4,8,8),a.fillRect(l-4,320+c*25.4-4,8,8);o%6!==5&&(a.fillRect(l-4,32,8,8),a.fillRect(l-4,46,8,8),a.fillRect(l-4,500,8,8),a.fillRect(l-4,514,8,8)),((o+1)%5===0||o===0)&&(a.font="16px Arial",a.fillText(String(o+1),l-8,82))}a.font="bold 16px Arial","abcde".split("").forEach((o,l)=>a.fillText(o,12,106+l*25.4)),"fghij".split("").forEach((o,l)=>a.fillText(o,12,326+l*25.4))});Ws(e,t,i,0,8.52,0,n,!1);let s=-78.5+54*2.54,r={c55a:{pos:new C(s,8.5,-t/2+10),dir:new C(0,1,0),type:"bbhole"},c55c:{pos:new C(s,8.5,-t/2+10+2*2.54),dir:new C(0,1,0),type:"bbhole"}};return{group:n,pins:r}},battery(){let n=new $e;Pe(87,16,58,re(1447446),0,0,0,n);for(let e=0;e<6;e++){let t=Qe(7,50,re(e%2?2236962:2763306,{metalness:.3}),0,0,0,n);t.rotation.x=Math.PI/2,t.position.set(-36.25+e*14.5,11,0);let i=Qe(7.05,8,re(13214247),0,0,0,n);i.rotation.x=Math.PI/2,i.position.set(-36.25+e*14.5,11,e%2?20:-20)}return Kt(n,87,58,18.1,[["6 x AA  =  9 V",0,0,5,0,"#ffffff"]]),{group:n,pins:{dc:{pos:new C(43.5,8,15),dir:new C(1,0,0),type:"lead"}}}},car(){let n=new $e;Pe(60,14,32,re(14417947,{roughness:.4}),0,5,0,n),Pe(32,12,28,re(14540253,{transparent:!0,opacity:.8}),-4,19,0,n);for(let[e,t]of[[-18,-15],[18,-15],[-18,15],[18,15]]){let i=Qe(7,5,re(1118481),0,0,0,n);i.rotation.x=Math.PI/2,i.position.set(e,7,t)}return{group:n,pins:{}}}}});function k_(n,e){let t=e.map(a=>a.split(".")[1]).filter(Boolean),i=["G","V","3V3","S","SDA","SCL"],s=[...new Set(t)].sort((a,o)=>i.indexOf(a)-i.indexOf(o)),r;return(r=n.match(/^D(\d+)$/))?`GPIO ${r[1]} \xB7 <b>${s.join(" ")}</b>`:(r=n.match(/^A(\d+)$/))?`ANALOG ${r[1]} \xB7 <b>${s.map(a=>a==="V"?"3V3":a).join(" ")}</b>`:(r=n.match(/^I(\d)$/))?`I2C fila ${r[1]} \xB7 <b>${s.join(" ")}</b>`:(r=n.match(/^P\.(.+)$/))?`POWER \xB7 <b>${r[1].replace("_2","")}</b>`:n==="DC"?"Jack DC":n}var ih,Fl,H_,Xs,sh=Pt(()=>{da();Xd();nh();ih={negro:1842204,rojo:14032928,amarillo:15909376,verde:2071866,azul:2056150,blanco:15658734,naranja:15759888,marron:8014372,morado:9059001,gris:9080726},Fl=Object.fromEntries(Object.entries(ih).map(([n,e])=>[n,"#"+e.toString(16).padStart(6,"0")])),H_=n=>n<0?0:n>1?1:1-Math.pow(1-n,3),Xs=class{constructor(e,t,i={}){this.container=e,this.labelLayer=t,this.opts=i,this.renderer=new zr({antialias:!0,preserveDrawingBuffer:!!i.render,alpha:!1}),this.renderer.setPixelRatio(i.render?1:Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=_l,this.renderer.outputColorSpace=Lt,this.renderer.toneMapping=vl,this.renderer.toneMappingExposure=1.05,e.appendChild(this.renderer.domElement),this.scene=new Hr,this.scene.background=new je(i.background||15987957),this.camera=new as(-100,100,100,-100,-2e3,4e3),this.controls=new ua(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.12,this.controls.maxPolarAngle=Math.PI*.49,this.controls.minZoom=.4,this.controls.maxZoom=6,this.controls.screenSpacePanning=!0,this.scene.add(new ta(16777215,12172998,1.5));let s=new zs(16777215,2.2);s.position.set(-120,300,180),s.castShadow=!0,s.shadow.mapSize.set(2048,2048);let r=s.shadow.camera;r.left=-300,r.right=300,r.top=300,r.bottom=-300,r.near=10,r.far=900,s.shadow.bias=-6e-4,s.shadow.radius=4,this.scene.add(s);let a=new zs(16777215,.6);a.position.set(200,120,-100),this.scene.add(a);let o=new He(new sn(3e3,3e3),new Kr({opacity:.16}));if(o.rotation.x=-Math.PI/2,o.position.y=-.01,o.receiveShadow=!0,this.scene.add(o),!i.render){let l=new ia(1200,120,14277598,15001320);l.position.y=-.05,this.scene.add(l)}this.root=new $e,this.scene.add(this.root),this.board=Qd(),this.scene.add(this.board),this.labels=[],this.anims=[],this.halos=[],this.showLabels=!0,this.clock=new na,this.resize(),window.addEventListener("resize",()=>this.resize()),this.renderer.setAnimationLoop(()=>this.tick())}resize(){let e=this.container.clientWidth||800,t=this.container.clientHeight||600;this.renderer.setSize(e,t,!1),this.renderer.domElement.style.width=e+"px",this.renderer.domElement.style.height=t+"px",this.aspect=e/t,this.applyFrustum()}applyFrustum(){let e=this.viewH||120;this.camera.left=-e*this.aspect,this.camera.right=e*this.aspect,this.camera.top=e,this.camera.bottom=-e,this.camera.updateProjectionMatrix()}clear(){this.root.clear(),this.labels.forEach(e=>e.el.remove()),this.labels=[],this.anims=[],this.halos=[],this.parts={},this.wires={}}loadLesson(e){this.clear(),this.lesson=e,this.board.userData.setSwitch(e.switch||"3V3");for(let[t,i]of Object.entries(e.parts||{})){let s=eh[i.type](i),r=s.group;r.position.set(i.pos[0],i.y||0,i.pos[1]),r.rotation.y=(i.rot||0)*Math.PI/180,r.visible=!1,r.userData.basePos=r.position.clone(),this.root.add(r),r.updateMatrixWorld(!0),this.parts[t]={def:i,group:r,pins:s.pins}}this.usb=th(this.board.userData.pins.USB),this.usb.visible=!1,this.root.add(this.usb);for(let t of e.wires||[])this.wires[t.id]=this.buildWire(t);this.fitAll()}endpoint(e){let t=this.board.userData.pins[e];if(t){let d=t.pos.clone();if(t.type==="male")return{pos:d,dir:new C(0,1,0),housing:"female",label:e};if(t.type==="female")return{pos:d,dir:new C(0,1,0),housing:"maleIn",label:e};if(t.type==="dc")return{pos:d,dir:new C(-1,0,0),housing:"dc",label:e}}let[i,s]=e.split("."),r=this.parts[i];if(!r)throw new Error("Pieza desconocida "+e);let a=r.pins[s];if(!a)throw new Error("Pin desconocido "+e);r.group.updateMatrixWorld(!0);let o=r.group.localToWorld(a.pos.clone()),l=a.dir.clone().applyQuaternion(r.group.getWorldQuaternion(new Zt)).normalize(),c={male:"female",maleUp:"female",terminal:"terminal",lead:"none",bbhole:"maleIn"}[a.type]||"none";return{pos:o,dir:l,housing:c,label:e}}buildWire(e){var _,m,f;let t=new $e;t.visible=!1;let i=(_=ih[e.color])!=null?_:8947848,s=[this.endpoint(e.from),this.endpoint(e.to)],r=s.map(T=>{let S=T.pos.clone(),b=14;if(T.housing==="female")e.noHousing||this.housing(t,T.pos.clone().addScaledVector(T.dir,.3),T.dir,b,1381653),S.addScaledVector(T.dir,b+.3);else if(T.housing==="maleIn")this.housing(t,T.pos.clone(),T.dir,b,1381653,!0),S.addScaledVector(T.dir,b);else if(T.housing==="terminal")this.housing(t,T.pos.clone().addScaledVector(T.dir,1.5),T.dir,b,1381653,!0),S.addScaledVector(T.dir,b+1.5);else if(T.housing==="dc"){let N=new He(new En(4,4,14,20),re(1381653));N.quaternion.setFromUnitVectors(new C(0,1,0),T.dir),N.position.copy(T.pos).addScaledVector(T.dir,7),N.castShadow=!0,t.add(N),S.addScaledVector(T.dir,14)}return S}),a=r[0].distanceTo(r[1]),o=(m=e.k0)!=null?m:Math.min(Math.max(a*.35,10),55),l=(f=e.k1)!=null?f:Math.min(Math.max(a*.35,10),55),c=r[0].clone().addScaledVector(s[0].dir,o),d=r[1].clone().addScaledVector(s[1].dir,l);Math.abs(s[0].dir.y)<.5&&(c.y+=o*.5),Math.abs(s[1].dir.y)<.5&&(d.y+=l*.5),e.lift&&(c.y+=e.lift,d.y+=e.lift);let h=new yi(r[0],c,d,r[1]),u=e.thick?1.6:.75,p=new bi(h,80,u,8,!1),g=new He(p,new Mt({color:i,roughness:.45}));return g.castShadow=!0,t.add(g),t.userData={tube:g,total:p.index.count,def:e,mid:h.getPoint(.5),ends:s,anchors:r},this.root.add(t),t}housing(e,t,i,s,r,a){let o=new He(new Ot(2.6,s,2.6),re(r,{roughness:.7}));if(o.quaternion.setFromUnitVectors(new C(0,1,0),i),o.position.copy(t).addScaledVector(i,s/2),o.castShadow=!0,e.add(o),a){let l=new He(new Ot(.64,3,.64),re(14201946,{metalness:.9,roughness:.3}));l.quaternion.copy(o.quaternion),l.position.copy(t).addScaledVector(i,-1),e.add(l)}}fitAll(e=!1,t=0){var E,y,v;let i=[this.board];for(let R of Object.values(this.parts))e||(R.group.visible=!0),R.group.visible&&i.push(R.group);for(let R of Object.values(this.wires))e||(R.visible=!0),R.visible&&i.push(R);if(this.usb&&(e||(this.usb.visible=!0),this.usb.visible&&i.push(this.usb)),!e){let R=this.lesson.steps&&this.lesson.steps[this.lesson.steps.length-1];this.applyState(R&&R.state)}let s=new nn;i.forEach(R=>s.expandByObject(R)),this.bbox=s;let r=s.getCenter(new C),a=new C(...this.lesson.view||[.32,1,.92]).normalize();this.camera.position.copy(r).addScaledVector(a,800),this.camera.up.set(0,1,0),this.camera.lookAt(r),this.camera.updateMatrixWorld();let o=this.camera.matrixWorldInverse,l=1e9,c=-1e9,d=1e9,h=-1e9,u=new C;for(let R of i)R.traverse(F=>{if(!F.isMesh||!F.geometry)return;let U=F.geometry.attributes.position;if(!U)return;let V=Math.max(1,Math.floor(U.count/400));F.updateMatrixWorld(!0);for(let X=0;X<U.count;X+=V)u.fromBufferAttribute(U,X).applyMatrix4(F.matrixWorld).applyMatrix4(o),u.x<l&&(l=u.x),u.x>c&&(c=u.x),u.y<d&&(d=u.y),u.y>h&&(h=u.y)});let p=(E=this.opts.padTop)!=null?E:.1,g=(y=this.opts.padBottom)!=null?y:.2,_=(v=this.opts.padX)!=null?v:.04,m=this.lesson.margin||1,f=this.opts.fitAspect||this.aspect,T=Math.max((h-d)/2/(1-p-g),(c-l)/2/(1-2*_)/f)*m,S=(l+c)/2,b=(d+h)/2-(g-p)*T,N=new C().setFromMatrixColumn(this.camera.matrixWorld,0),w=new C().setFromMatrixColumn(this.camera.matrixWorld,1),I=N.multiplyScalar(S).add(w.multiplyScalar(b));this.homeTarget=r.clone().add(I),this.homePos=this.homeTarget.clone().addScaledVector(a,800),this.homeH=Math.max(T,t),this.resetView()}resetView(){this.viewH=this.homeH,this.camera.zoom=1,this.applyFrustum(),this.controls.target.copy(this.homeTarget),this.camera.position.copy(this.homePos),this.controls.update()}topView(){this.controls.target.copy(this.homeTarget),this.camera.position.copy(this.homeTarget).add(new C(0,800,.01)),this.controls.update()}showStep(e,t=!1){let i=this.lesson;this.step=e;let s=new Set,r=new Set,a=!1;i.steps.forEach((p,g)=>{g<=e&&((p.add||[]).forEach(_=>s.add(_)),(p.wires||[]).forEach(_=>r.add(_)),p.usb&&(a=!0))});let o=i.steps[e],l=new Set(o.add||[]),c=new Set(o.wires||[]);this.anims=[],this.halos.forEach(p=>this.root.remove(p)),this.halos=[];let d=performance.now();for(let[p,g]of Object.entries(this.parts)){let _=s.has(p);g.group.visible=_,g.group.position.copy(g.group.userData.basePos),_&&l.has(p)&&!t&&(g.group.position.y+=40,this.anims.push({t0:d,dur:550,fn:m=>{g.group.position.y=g.group.userData.basePos.y+40*(1-m)}})),_&&l.has(p)&&this.addHalo(g.group)}let h=t?0:450;for(let[p,g]of Object.entries(this.wires)){let _=r.has(p);g.visible=_;let m=g.userData.tube;if(m.geometry.setDrawRange(0,1/0),g.children.forEach(f=>f.visible=!0),_&&c.has(p)&&!t){let f=d+h;h+=220,m.geometry.setDrawRange(0,0);let T=g.children.filter(S=>S!==m);T.forEach(S=>S.visible=!1),this.anims.push({t0:f,dur:800,fn:S=>{let b=Math.floor(g.userData.total*S/6)*6;m.geometry.setDrawRange(0,b),S>0&&T[0]&&(T[0].visible=!0),S>=1&&T.forEach(N=>N.visible=!0)}})}}this.usb.visible=a,o.focus==="switch"&&this.addHalo(null,this.board.userData.switchPos,14),o.focus==="usb"&&this.addHalo(this.usb);let u=o.state||null;this.applyState(u),this.buildLabels(o,s,c)}applyState(e){for(let t of Object.values(this.parts)){if(t.group.userData.glow){let i=e&&e.glow&&e.glow[Object.keys(this.parts).find(r=>this.parts[r]===t)],s=t.group.userData.glow;s.emissiveIntensity=i?1.6:0,i&&i!==!0&&(s.emissive.set(i),s.color.set(i))}t.group.userData.arm&&(t.group.userData.arm.rotation.z=e&&e.servo?-e.servo*Math.PI/180:0)}this.spinProp=!!(e&&e.spin)}addHalo(e,t,i){let s;e?(s=new nn().setFromObject(e),s.expandByScalar(2.5)):s=new nn().setFromCenterAndSize(t,new C(i,i*.6,i*1.3));let r=new sa(s,15964416);r.material.linewidth=2,r.material.transparent=!0,r.material.depthTest=!1,r.renderOrder=10,this.root.add(r),this.halos.push(r)}buildLabels(e,t,i){this.labels.forEach(a=>a.el.remove()),this.labels=[];let s=(a,o,l)=>{let c=document.createElement("div");c.className="lbl "+(l||""),c.innerHTML=a,this.labelLayer.appendChild(c),this.labels.push({el:c,pos:o})};for(let a of t){let o=this.parts[a],l=new nn().setFromObject(o.group),c=l.getCenter(new C);c.y=l.max.y+4;let d=(e.add||[]).includes(a);o.def.label&&(d||this.opts.allPartLabels||e.allLabels)&&s(o.def.label,c,d?"part new":"part")}let r={};for(let a of i){let o=this.wires[a],l=o.userData.def;for(let[c,d]of[l.from,l.to].entries()){if(!this.board.userData.pins[d]){let[p,g]=d.split("."),_=this.parts[p],m=_&&_.pins[g];if(m&&["terminal","bbhole","maleUp"].includes(m.type)){let f=(_.def.label||_.def.type).split("\u2192")[0].trim().replace(/\s*\(.*\)/,""),T=g.replace(/^c(\d+)([a-e])$/,"col. $1 \xB7 fila $2"),S="part:"+p+(m.type==="maleUp"?":hdr":":"+g);(r[S]=r[S]||{refs:[],pts:[],text:f+" \xB7 ",pins:[]}).pts.push(o.userData.anchors[c]),r[S].pins.push(T)}continue}let u=d.includes(".")&&/^(D|A|I)/.test(d)?d.split(".")[0]:d;(r[u]=r[u]||{refs:[],pts:[]}).refs.push(d),r[u].pts.push(o.userData.anchors[c])}}for(let[a,o]of Object.entries(r)){let l=o.pts.reduce((c,d)=>c.add(d),new C).multiplyScalar(1/o.pts.length);l.y+=2,s(o.text?o.text+"<b>"+o.pins.join(" ")+"</b>":k_(a,o.refs),l,"pin")}e.focus==="switch"&&s("Interruptor \u2192 <b>"+(this.lesson.switch==="5V"?"5V":"3.3V")+"</b>",this.board.userData.switchPos.clone().add(new C(0,6,0)),"pin"),this.layoutLabels()}layoutLabels(){let e=this.container.clientWidth,t=this.container.clientHeight,i=[],s=this.labels.map(r=>{let a=r.pos.clone().project(this.camera);return{l:r,x:(a.x+1)/2*e,y:(1-a.y)/2*t,vis:this.showLabels&&a.z<1}}).sort((r,a)=>r.y-a.y);for(let r of s){let a=r.l.el;if(a.style.display=r.vis?"":"none",!r.vis)continue;let o=a.offsetWidth||80,l=a.offsetHeight||20,c=r.y-l-8,d=r.x-o/2;for(let h=0;h<12;h++){let u=i.find(p=>d<p.x+p.w+4&&d+o+4>p.x&&c<p.y+p.h+3&&c+l+3>p.y);if(!u)break;c=u.y-l-4}i.push({x:d,y:c,w:o,h:l}),a.style.transform=`translate(${Math.round(d)}px, ${Math.round(c)}px)`,a.style.setProperty("--stem",Math.max(6,r.y-(c+l))+"px")}}tick(){let e=performance.now();this.anims=this.anims.filter(i=>{let s=H_((e-i.t0)/i.dur);return i.fn(s),s<1});let t=this.clock.getElapsedTime();if(this.halos.forEach(i=>i.material.opacity=.45+.55*Math.abs(Math.sin(t*3))),this.spinProp)for(let i of Object.values(this.parts||{}))i.group.userData.prop&&(i.group.userData.prop.rotation.y+=this.opts.render?0:.25);this.controls.update(),this.renderer.render(this.scene,this.camera),this.labels.length&&this.layoutLabels()}get idle(){return this.anims.length===0}}});var ah,rh=Pt(()=>{ah=`/*
  PROYECTO 1 - SEM\xC1FORO
  Salesianos Algeciras \xB7 FPB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
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
`});var lh,oh=Pt(()=>{lh=`/*
  PROYECTO 2 - TIMBRE CON MELOD\xCDA
  Salesianos Algeciras \xB7 FPB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
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
`});var dh,ch=Pt(()=>{dh=`/*
  PROYECTO 3 - FAROLA AUTOM\xC1TICA
  Salesianos Algeciras \xB7 FPB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
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
`});var uh,hh=Pt(()=>{uh=`/*
  PROYECTO 4 - TERM\xD3METRO CON ALARMA
  Salesianos Algeciras \xB7 FPB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
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
  lcd.setCursor(0, 1); lcd.print("Salesianos  Alg");
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
`});var ph,fh=Pt(()=>{ph=`/*
  PROYECTO 5 - SENSOR DE APARCAMIENTO
  Salesianos Algeciras \xB7 FPB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
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
`});var gh,mh=Pt(()=>{gh=`/*
  PROYECTO 6 - BARRERA DE PARKING
  Salesianos Algeciras \xB7 FPB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
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
`});var vh,_h=Pt(()=>{vh=`/*
  PROYECTO 7 - RIEGO AUTOM\xC1TICO (+ pr\xE1ctica de mantenimiento)
  Salesianos Algeciras \xB7 FPB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
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
`});var xh,yh=Pt(()=>{xh=`/*
  PROYECTO 8 - VENTILADOR INTELIGENTE (proyecto final)
  Salesianos Algeciras \xB7 FPB Inform\xE1tica y Comunicaciones \xB7 M\xF3dulo 3015
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
`});var Qt,Ut,qs,ni,ii,Vt,bh=Pt(()=>{rh();oh();ch();hh();fh();mh();_h();yh();Qt=(n,e,t,i="D")=>[{id:n+"G",from:n+".G",to:`${i}${e}.G`,color:"negro"},{id:n+"V",from:n+".V",to:`${i}${e}.V`,color:"rojo"},{id:n+"S",from:n+".S",to:`${i}${e}.S`,color:t}],Ut=n=>n.map(e=>e.id),qs=(n,e,t={G:"GND",V:"VCC",SDA:"SDA",SCL:"SCL"})=>[{id:n+"G",from:`${n}.${t.G}`,to:`I${e}.G`,color:"negro"},{id:n+"V",from:`${n}.${t.V}`,to:`I${e}.V`,color:"rojo"},{id:n+"SDA",from:`${n}.${t.SDA}`,to:`I${e}.SDA`,color:"azul"},{id:n+"SCL",from:`${n}.${t.SCL}`,to:`I${e}.SCL`,color:"blanco"}],ni=(n,e=[])=>({t:"Prepara la placa",focus:"switch",take:["Placa ACEBOTT ESP32 Plus (SIN conectar el USB)",...e],do:["Coloca la placa sobre la mesa con el conector USB (plateado) a tu IZQUIERDA y el conector azul con los n\xFAmeros 18, 19, 23\u2026 arriba, lejos de ti. As\xED la ver\xE1s igual que en el modelo 3D.",`Pon el interruptor de tensi\xF3n en <b>${n==="5V"?"5V (palanca hacia ARRIBA, hacia el conector azul)":"3.3V (palanca hacia ABAJO, hacia el texto \xAB3.3V\xBB)"}</b>.`,"Los n\xFAmeros 18, 19, 23, 5, 13, 12 | 14, 27, 16, 17, 25, 26 est\xE1n impresos junto al conector azul superior: cada n\xFAmero marca la <b>columna de 3 pines</b> (S, V, G) que tiene justo debajo.","Localiza los bloques que vas a usar en esta pr\xE1ctica (mira la pesta\xF1a \xABEsquema\xBB)."],check:`La placa est\xE1 desconectada y el interruptor marca <b>${n==="5V"?"5V":"3.3V"}</b>.`}),ii=(n,e,t={})=>({t:"Conecta el USB y sube el programa",usb:!0,focus:"usb",state:e,allLabels:!0,take:["Cable USB-A a USB-B","Ordenador con Arduino IDE preparado"],do:["<b>Antes de conectar:</b> repasa todos los cables con la tabla de la pesta\xF1a \xABEsquema\xBB (color, pin de origen y pin de destino). Pide al profesor que lo revise.","Conecta el cable USB-B a la placa y al ordenador. Debe encenderse el LED <b>PWR</b> rojo.",`En Arduino IDE abre <b>${n}</b>, elige \xABESP32 Dev Module\xBB y el puerto, y pulsa <b>\u2192 Subir</b>.`,"Abre el Monitor Serie a <b>115200 baudios</b>.",...t.do||[]],check:t.check||"El programa se ha subido (\xABHard resetting via RTS pin\u2026\xBB) y el montaje funciona como se describe en la pesta\xF1a \xABPrueba\xBB."}),Vt=[];{let n=[...Qt("r",18,"amarillo"),...Qt("a",19,"blanco"),...Qt("v",23,"verde")];Vt.push({n:1,slug:"semaforo",title:"Sem\xE1foro",level:"Iniciaci\xF3n",duration:"2 sesiones (2 h)",icon:"\u{1F6A6}",short:"Tres LEDs que se encienden por turnos como un sem\xE1foro.",intro:"Tu primer montaje con la ESP32 Plus: conectar\xE1s tres m\xF3dulos LED a tres salidas digitales y programar\xE1s la secuencia de un sem\xE1foro. Aprender\xE1s a reconocer los conectores G-V-S de la placa y qu\xE9 hace cada uno de sus tres pines.",switch:"3V3",objectives:["Identificar las partes de la placa ESP32 Plus: USB, jack DC, interruptor 3.3V/5V y conectores G-V-S.","Conectar m\xF3dulos de 3 pines (G, V, S) con cables Dupont hembra-hembra respetando el c\xF3digo de colores.","Programar salidas digitales con pinMode() y digitalWrite().","Comprobar con el pol\xEDmetro la tensi\xF3n de alimentaci\xF3n y de una salida."],ra:{1:["a"],2:["a","b","c"],3:["c","d","e","i","j"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["M\xF3dulo LED rojo",1],["M\xF3dulo LED azul (har\xE1 de luz \xE1mbar)",1],["M\xF3dulo LED verde",1],["Cables Dupont hembra-hembra (H-H) 20 cm",9,"negro \xD73, rojo \xD73, amarillo, blanco, verde"],["Cable USB-A a USB-B",1]],libs:[],code:ah,file:"P1_Semaforo/P1_Semaforo.ino",parts:{r:{type:"led",color:"rojo",pos:[-30,-64],label:"LED rojo \u2192 GPIO 18"},a:{type:"led",color:"azul",pos:[0,-64],label:"LED azul \u2192 GPIO 19"},v:{type:"led",color:"verde",pos:[30,-64],label:"LED verde \u2192 GPIO 23"}},wires:n,steps:[ni("3V3",["M\xF3dulos LED rojo, azul y verde","9 cables H-H"]),{t:"Conecta el LED rojo",add:["r"],wires:Ut(n.slice(0,3)),take:["M\xF3dulo LED rojo","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el m\xF3dulo arriba a la izquierda de la placa, con sus pines G-V-S mirando hacia la placa."],check:"Los 3 cables salen de la columna <b>18</b> y llegan a G, V y S del LED rojo, sin cruzarse entre s\xED. Cada conector est\xE1 metido hasta el fondo."},{t:"Conecta el LED azul",add:["a"],wires:Ut(n.slice(3,6)),take:["M\xF3dulo LED azul","3 cables H-H: negro, rojo y blanco"],do:["Coloca el m\xF3dulo en el centro, junto al rojo."],check:"Columna <b>19</b> (la que est\xE1 justo a la derecha de la 18): G negro, V rojo, S blanco."},{t:"Conecta el LED verde",add:["v"],wires:Ut(n.slice(6,9)),take:["M\xF3dulo LED verde","3 cables H-H: negro, rojo y verde"],do:["Coloca el m\xF3dulo a la derecha."],check:"Columna <b>23</b>: G negro, V rojo, S verde. En total hay 9 cables y ninguno toca a otro pin."},ii("P1_Semaforo.ino",{glow:{v:!0}},{check:"Al arrancar se encienden rojo, azul y verde 0,5 s cada uno (prueba). Despu\xE9s: verde 5 s \u2192 azul parpadeando 3 s \u2192 rojo 5 s, y vuelta a empezar."})],expected:["Al encender: prueba r\xE1pida de los tres LEDs (rojo, azul, verde, 0,5 s cada uno).","Ciclo continuo: VERDE 5 s \u2192 AZUL parpadeando 3 s (precauci\xF3n) \u2192 ROJO 5 s.","En el Monitor Serie aparece la fase actual."],serial:`Prueba de LEDs: ROJO, AZUL, VERDE
Semaforo en marcha
VERDE  -> se puede pasar
AZUL   -> precaucion (parpadeo)
ROJO   -> detenerse
VERDE  -> se puede pasar`,example:"Ejemplo: si cambias <code>T_VERDE = 5000</code> por <code>T_VERDE = 8000</code>, el verde durar\xE1 8 segundos. Un ciclo completo dura 5 + 3 + 5 = 13 s; \xBFcu\xE1ntos ciclos hace en un minuto? (60 / 13 \u2248 4,6 ciclos).",multimeter:[["Tensi\xF3n de alimentaci\xF3n","Pol\xEDmetro en 20 V DC. Punta NEGRA en un pin G, punta ROJA en un pin V de cualquier columna.","\u2248 3,3 V (interruptor en 3.3V)"],["Salida GPIO 23 (LED verde)","Punta negra en G, roja en S de la columna 23. Mide mientras el verde est\xE1 encendido y cuando est\xE1 apagado.","Encendido \u2248 3,3 V \xB7 Apagado \u2248 0 V"],["Continuidad de un cable","ANTES de montar: pol\xEDmetro en continuidad (pitido), una punta en cada extremo del cable Dupont.","Pita = cable bueno. No pita = cable roto, ap\xE1rtalo."]],trouble:[["Ning\xFAn LED se enciende y el LED PWR est\xE1 apagado","USB mal conectado o cable solo de carga","Prueba otro cable/puerto USB."],["Un LED no se enciende nunca","Cable S en otra columna, o G/V cambiados","Sigue el cable desde el m\xF3dulo hasta la placa y comp\xE1ralo con la tabla."],["Los LEDs se encienden en otro orden","M\xF3dulos conectados en columnas cambiadas","Comprueba que rojo=18, azul=19, verde=23."],["Error \xABFailed to connect to ESP32\xBB","Puerto equivocado o Monitor Serie ocupando el puerto","Elige el puerto correcto; cierra otros programas que usen el puerto."],["Brillo muy d\xE9bil","Pin V sin conectar (el LED solo recibe se\xF1al)","Revisa el cable rojo V."]],challenge:["A\xF1ade un modo nocturno: si escribes \xABn\xBB en el Monitor Serie, el sem\xE1foro pasa a azul intermitente permanente.","Usa el cuarto m\xF3dulo (LED RGB, proyecto 3) como sem\xE1foro de peatones: verde cuando el de coches est\xE1 en rojo."]})}{let n=[...Qt("led",18,"amarillo"),...Qt("btn",27,"verde"),...Qt("bz",25,"naranja")];Vt.push({n:2,slug:"timbre",title:"Timbre con melod\xEDa",level:"Iniciaci\xF3n",duration:"2 sesiones (2 h)",icon:"\u{1F514}",short:"Un pulsador que hace sonar una melod\xEDa y enciende un LED.",intro:"Construir\xE1s el timbre de una casa: al pulsar el bot\xF3n suena \xABding-dong\xBB y una melod\xEDa corta mientras un LED parpadea. Aprender\xE1s la diferencia entre una entrada (el pulsador) y una salida (zumbador y LED) y c\xF3mo un zumbador pasivo produce notas musicales.",switch:"3V3",objectives:["Distinguir entradas y salidas digitales.","Leer un pulsador con digitalRead() y evitar rebotes.","Generar sonidos de distinta frecuencia con tone() en un zumbador pasivo.","Medir con el pol\xEDmetro el estado de una entrada."],ra:{2:["b","c","e"],3:["d","e","i"],4:["a","b","c","h"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["M\xF3dulo pulsador",1],["M\xF3dulo zumbador pasivo",1],["M\xF3dulo LED rojo",1],["Cables Dupont H-H",9,"negro \xD73, rojo \xD73, amarillo, verde, naranja"],["Cable USB-A a USB-B",1]],libs:[],code:lh,file:"P2_Timbre/P2_Timbre.ino",parts:{led:{type:"led",color:"rojo",pos:[-32,-64],label:"LED rojo \u2192 GPIO 18"},btn:{type:"button",pos:[2,-66],label:"Pulsador \u2192 GPIO 27"},bz:{type:"buzzer",pos:[36,-66],label:"Zumbador \u2192 GPIO 25"}},wires:n,steps:[ni("3V3",["M\xF3dulo pulsador, zumbador pasivo y LED rojo","9 cables H-H"]),{t:"Conecta el pulsador (entrada)",add:["btn"],wires:Ut(n.slice(3,6)),take:["M\xF3dulo pulsador","3 cables H-H: negro, rojo y verde"],do:["Coloca el pulsador arriba, en el centro."],check:"Columna <b>27</b> (la segunda del bloque derecho): G negro, V rojo, S verde."},{t:"Conecta el zumbador pasivo",add:["bz"],wires:Ut(n.slice(6,9)),take:["M\xF3dulo zumbador pasivo (el cilindro negro sobre placa)","3 cables H-H: negro, rojo y naranja"],do:["Coloca el zumbador arriba a la derecha."],check:"Columna <b>25</b>: G negro, V rojo, S naranja."},{t:"Conecta el LED rojo",add:["led"],wires:Ut(n.slice(0,3)),take:["M\xF3dulo LED rojo","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el LED arriba a la izquierda."],check:"Columna <b>18</b>: G negro, V rojo, S amarillo. Hay 9 cables en total."},ii("P2_Timbre.ino",{glow:{led:!0}},{do:["<b>No pulses el bot\xF3n mientras arranca la placa</b>: el programa aprende c\xF3mo est\xE1 el bot\xF3n en reposo."],check:"Al pulsar suena \xABding-dong\xBB + melod\xEDa y el LED se enciende con cada nota. El Monitor Serie cuenta los timbrazos."})],expected:["Al pulsar: \xABding-dong\xBB (MI5\u2013DO5) y una escala corta (SOL\u2013LA\u2013SI\u2013DO\u2013SOL).","El LED rojo se enciende con cada nota.","El Monitor Serie muestra \xABDING-DONG! Timbre numero N\xBB.","Si mantienes pulsado, solo suena una vez hasta que sueltes."],serial:`Pulsador en reposo = 1
Timbre listo. Pulsa el boton.
DING-DONG! Timbre numero 1
DING-DONG! Timbre numero 2`,example:"Ejemplo: la nota LA4 vibra 440 veces por segundo (440 Hz). Si duplicas la frecuencia (880 Hz) suena la misma nota una octava m\xE1s aguda. Prueba a cambiar <code>MI5</code> por <code>MI4</code> en la melod\xEDa y escucha la diferencia.",multimeter:[["Se\xF1al del pulsador","Pol\xEDmetro en 20 V DC. Negra en G y roja en S de la columna 27. Mide sin pulsar y pulsando.","Un estado \u2248 3,3 V y el otro \u2248 0 V (depende del m\xF3dulo)"],["Zumbador sonando","Negra en G, roja en S de la columna 25 mientras suena.","\u2248 1,6 V: el pol\xEDmetro muestra la MEDIA de una onda cuadrada de 0 a 3,3 V"],["Alimentaci\xF3n","Negra en G, roja en V de cualquier columna.","\u2248 3,3 V"]],trouble:[["Suena solo, sin pulsar","Se puls\xF3 el bot\xF3n durante el arranque","Pulsa RESET sin tocar el bot\xF3n."],["No suena nada pero el LED parpadea","Zumbador mal conectado o es el activo","Revisa la columna 25; usa el zumbador PASIVO."],["Suena un pitido continuo sin melod\xEDa","Has usado un zumbador activo","C\xE1mbialo por el pasivo."],["No reacciona al bot\xF3n","Cable S del pulsador en otra columna","Debe ir a la columna 27."],["Suena dos veces por pulsaci\xF3n","Rebote del pulsador","Aumenta delay(30) a delay(60)."]],challenge:["Programa una segunda melod\xEDa y elige cu\xE1l suena seg\xFAn cu\xE1ntas veces pulses seguidas.","Haz que si pulsas m\xE1s de 3 veces en 5 segundos suene una \xABalarma\xBB (sirena subiendo y bajando de frecuencia)."]})}{let n=[...Qt("ldr",34,"amarillo","A"),{id:"rgbR",from:"rgb.R",to:"D25.S",color:"rojo"},{id:"rgbG",from:"rgb.G",to:"D26.S",color:"verde"},{id:"rgbB",from:"rgb.B",to:"D27.S",color:"azul"},{id:"rgbN",from:"rgb.-",to:"D25.G",color:"negro"}];Vt.push({n:3,slug:"farola",title:"Farola autom\xE1tica",level:"B\xE1sico",duration:"2\u20133 sesiones (3 h)",icon:"\u{1F4A1}",short:"Un sensor de luz que enciende un LED RGB al anochecer.",intro:"Las farolas de la calle se encienden solas cuando se hace de noche. Usar\xE1s un sensor de luz (LDR) conectado a una entrada anal\xF3gica y un LED RGB que cambia de color: apagado de d\xEDa, \xE1mbar al atardecer y blanco de noche.",switch:"3V3",objectives:["Diferenciar se\xF1al anal\xF3gica (0\u20134095) y digital (0/1).","Leer un sensor anal\xF3gico con analogRead() y calibrar umbrales.","Controlar el brillo de cada color de un LED RGB con PWM (analogWrite).","Comprobar con el pol\xEDmetro la tensi\xF3n del sensor con luz y a oscuras."],ra:{2:["a","b","c"],3:["c","d","e"],4:["c","g"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de luz (LDR)",1],["M\xF3dulo LED RGB",1],["Cables Dupont H-H",7,"negro \xD72, rojo \xD72, amarillo, verde, azul"],["Cable USB-A a USB-B",1]],libs:[],code:dh,file:"P3_Farola/P3_Farola.ino",parts:{ldr:{type:"ldr",pos:[-30,66],rot:180,label:"Sensor de luz \u2192 ANALOG 34"},rgb:{type:"rgb",pos:[22,-66],label:"LED RGB \u2192 GPIO 25-26-27"}},wires:n,steps:[ni("3V3",["Sensor de luz (LDR) y m\xF3dulo LED RGB","7 cables H-H"]),{t:"Conecta el sensor de luz al bloque ANALOG",add:["ldr"],wires:Ut(n.slice(0,3)),take:["Sensor de luz (LDR)","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el sensor delante de la placa (abajo a la izquierda), con sus pines mirando hacia la placa y la LDR hacia arriba.","El bloque ANALOG est\xE1 a la izquierda del chip plateado, rodeado por un recuadro blanco. Usa la fila de ARRIBA, marcada <b>34</b>."],check:"Fila <b>34</b> del bloque ANALOG: G negro, 3V3 rojo, S amarillo. El pin rojo de este bloque da siempre 3,3 V."},{t:"Conecta el LED RGB",add:["rgb"],wires:Ut(n.slice(3,7)),take:["M\xF3dulo LED RGB (4 pines: R, G, B, \u2212)","4 cables H-H: rojo, verde, azul y negro"],do:["Coloca el LED RGB arriba a la derecha.","Ojo: aqu\xED los cables de color van a pines <b>S</b> de tres columnas distintas, y el negro a un pin <b>G</b>.","Si tu m\xF3dulo tiene el pin com\xFAn marcado \xAB+\xBB en vez de \xAB\u2212\xBB, conecta ese pin a <b>V</b> (no a G) y pon <code>ANODO_COMUN = true</code> en el c\xF3digo."],check:"R \u2192 S del 25, G \u2192 S del 26, B \u2192 S del 27, \u2212 \u2192 G del 25. El pin G del m\xF3dulo RGB significa \xABgreen\xBB (verde), \xA1no GND!"},ii("P3_Farola.ino",{glow:{rgb:"#ffb347"}},{do:["<b>Calibra</b>: mira el valor \xABLuz =\xBB con la luz del aula, tapando el sensor con la mano y a medio tapar. Ajusta <code>UMBRAL_NOCHE</code> y <code>UMBRAL_ATARDECER</code> y vuelve a subir el programa."],check:"Con luz: LED apagado. A medio tapar: \xE1mbar. Tapado: blanco."})],expected:["Al arrancar: prueba de colores rojo \u2192 verde \u2192 azul.","Con la luz del aula el LED est\xE1 apagado (D\xCDA).","Tapando a medias el sensor: luz \xE1mbar (ATARDECER).","Tap\xE1ndolo del todo: luz blanca (NOCHE).","Gracias a la hist\xE9resis el LED no parpadea al estar justo en el l\xEDmite."],serial:`Farola automatica lista
Luz = 2890  ->  DIA (apagada)
Luz = 1710  ->  ATARDECER (ambar)
Luz = 420  ->  NOCHE (blanca)`,example:"Ejemplo de c\xE1lculo: el ESP32 convierte 0\u20133,3 V en 0\u20134095. Una lectura de 2048 equivale a 2048 \xD7 3,3 / 4095 \u2248 1,65 V. Mide con el pol\xEDmetro el pin S del sensor y compara con la lectura del Monitor Serie.",multimeter:[["Tensi\xF3n del sensor con luz","Pol\xEDmetro en 20 V DC. Negra en G y roja en S de la fila 34 (bloque ANALOG).","Con luz y tapado deben salir valores claramente distintos (por ejemplo 2,3 V y 0,4 V)"],["Alimentaci\xF3n del sensor","Negra en G, roja en 3V3 de la fila 34.","\u2248 3,3 V"],["Brillo de un color (PWM)","Negra en G, roja en S de la columna 25 con la luz \xE1mbar.","\u2248 3,3 V (rojo a 255) \xB7 columna 26 \u2248 1,2 V (verde a 90)"]],trouble:[["El LED nunca se enciende","Umbrales sin calibrar","Mira el Monitor Serie y ajusta los umbrales a tu aula."],["Funciona al rev\xE9s (se enciende con luz)","Tu sensor da valores m\xE1s bajos con m\xE1s luz","Pon MAS_LUZ_MAS_VALOR = false."],["Colores cambiados (rojo sale verde)","Cables R/G/B en columnas cambiadas","R\u219225, G\u219226, B\u219227."],["El LED RGB est\xE1 siempre encendido en blanco","M\xF3dulo de \xE1nodo com\xFAn","Com\xFAn a V y ANODO_COMUN = true."],["Lectura fija en 0 o 4095","Cable S suelto o en la fila equivocada","El sensor va en la fila 34 del bloque ANALOG."]],challenge:["Haz que el brillo blanco sea proporcional a la oscuridad (m\xE1s oscuro = m\xE1s brillo) usando map().","A\xF1ade el zumbador: un pitido corto cada vez que la farola cambia de estado."]})}{let n=[{id:"lmG",from:"lm.G",to:"A35.G",color:"negro"},{id:"lmS",from:"lm.S",to:"A35.S",color:"amarillo"},{id:"lmV",from:"lm.V",to:"P.5V",color:"rojo"},...qs("lcd",1),...Qt("bz",25,"naranja")];Vt.push({n:4,slug:"termometro",title:"Term\xF3metro con alarma",level:"B\xE1sico",duration:"3 sesiones (3 h)",icon:"\u{1F321}\uFE0F",short:"LM35 + pantalla LCD I2C + zumbador de alarma.",intro:"Fabricar\xE1s un term\xF3metro digital: el sensor LM35 mide la temperatura, la pantalla LCD de 16\xD72 caracteres la muestra y, si se supera un l\xEDmite, suena una alarma. Conocer\xE1s el bus I2C, que permite conectar pantallas con solo 4 cables.",switch:"5V",objectives:["Convertir una tensi\xF3n en temperatura (LM35: 10 mV/\xB0C).","Conectar un dispositivo I2C (LCD1602, direcci\xF3n 0x27) al bloque I2C.","Instalar y usar una librer\xEDa en Arduino IDE.","Contrastar la medida del pol\xEDmetro con la de la pantalla."],ra:{1:["a"],3:["d","e","i","j"],4:["a","c","g","h","i"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de temperatura LM35",1],["Pantalla LCD1602 con adaptador I2C",1],["M\xF3dulo zumbador pasivo",1],["Cables Dupont H-H",9,"negro \xD73, rojo \xD72, amarillo, azul, blanco, naranja"],["Cable Dupont macho-hembra (M-H)",1,"rojo"],["Cable USB-A a USB-B",1]],libs:["lcd"],code:uh,file:"P4_Termometro/P4_Termometro.ino",parts:{lm:{type:"lm35",pos:[-28,66],rot:180,label:"LM35 \u2192 ANALOG 35 + 5V"},lcd:{type:"lcd",pos:[112,4],label:"LCD1602 I2C \u2192 I2C fila 1",lines:["Temp: 24.6\xB0C","Limite: 28\xB0C"]},bz:{type:"buzzer",pos:[26,-66],label:"Zumbador \u2192 GPIO 25"}},wires:n,steps:[ni("5V",["LM35, pantalla LCD1602 I2C y zumbador pasivo","9 cables H-H y 1 cable M-H"]),{t:"Conecta el sensor LM35",add:["lm"],wires:["lmG","lmS","lmV"],take:["M\xF3dulo LM35","2 cables H-H (negro y amarillo)","1 cable M-H rojo (un extremo con agujero y otro con pin)"],do:["Coloca el LM35 delante de la placa, abajo a la izquierda.","El G y la S van a la fila <b>35</b> del bloque ANALOG (la segunda fila empezando por arriba).","La V NO va al bloque ANALOG: el LM35 necesita 4 V o m\xE1s. El extremo hembra del cable rojo va al pin V del LM35 y el extremo macho se clava en el agujero <b>5V</b> del conector POWER."],check:"G (negro) y S (amarillo) en la fila 35; el pin 3V3 de esa fila queda LIBRE. V (rojo) en el 2\xBA agujero del conector POWER, marcado 5V."},{t:"Conecta la pantalla LCD al bloque I2C",add:["lcd"],wires:Ut(n.slice(3,7)),take:["Pantalla LCD1602 I2C","4 cables H-H: negro, rojo, azul y blanco"],do:["Coloca la pantalla a la derecha de la placa. Sus 4 pines est\xE1n en el adaptador negro de la parte de atr\xE1s, en el lado izquierdo.","Usa la fila de ARRIBA (fila 1) del bloque I2C."],check:"GND\u2192G (negro), VCC\u2192V (rojo), SDA\u2192SDA (azul), SCL\u2192SCL (blanco). Lee los nombres en el adaptador: no los conectes por posici\xF3n."},{t:"Conecta el zumbador",add:["bz"],wires:Ut(n.slice(7,10)),take:["M\xF3dulo zumbador pasivo","3 cables H-H: negro, rojo y naranja"],do:["Coloca el zumbador arriba, a la derecha."],check:"Columna <b>25</b>: G negro, V rojo, S naranja. Con el interruptor en 5V, los pines V dan 5 V."},ii("P4_Termometro.ino",null,{do:["Instala antes la librer\xEDa <b>LiquidCrystal I2C</b> (Frank de Brabander).","Si la pantalla se enciende pero no se ven letras, gira con el destornillador el potenci\xF3metro azul de la parte trasera."],check:"La LCD muestra \xABTemp: xx.x\xB0C\xBB. Al pellizcar el LM35 con los dedos la temperatura sube; al pasar de 28 \xB0C suena la alarma."})],expected:["Pantalla de bienvenida 1,5 s y luego la temperatura con 1 decimal.","Fila 2: \xABLimite: 28\xB0C\xBB o \xAB!! ALARMA !!\xBB.","Al calentar el sensor con los dedos sube unos grados en 20\u201330 s; por encima de 28 \xB0C pita cada medio segundo."],serial:`Temperatura = 24.6 C  -> normal
Temperatura = 26.9 C  -> normal
Temperatura = 28.3 C  -> ALARMA`,example:"Ejemplo: si el pol\xEDmetro marca 0,246 V en la salida del LM35, la temperatura es 0,246 V \xF7 0,010 V/\xB0C = <b>24,6 \xB0C</b>. Comp\xE1ralo con la pantalla: la diferencia deber\xEDa ser menor de 1\u20132 \xB0C.",multimeter:[["Salida del LM35","Pol\xEDmetro en 2 V o 20 V DC. Negra en G y roja en S de la fila 35.","\u2248 0,20\u20130,30 V a temperatura ambiente (= 20\u201330 \xB0C)"],["Alimentaci\xF3n del LM35","Negra en G, roja en el pin V del LM35 (o en el agujero 5V del POWER).","\u2248 5 V"],["Alimentaci\xF3n de la LCD","Negra en G, roja en V de la fila 1 del bloque I2C.","\u2248 5 V (interruptor en 5V)"]],trouble:[["Pantalla iluminada pero sin letras","Contraste mal ajustado","Gira el potenci\xF3metro azul de atr\xE1s."],["Pantalla apagada","Interruptor en 3.3V o VCC/GND mal","Interruptor en 5V; revisa GND y VCC."],["Cuadros negros en la fila 1","SDA/SCL cambiados o direcci\xF3n distinta","Comprueba SDA/SCL; si persiste prueba la direcci\xF3n 0x3F."],["Temperatura absurda (\u2248 0 \xB0C o > 100 \xB0C)","LM35 sin 5 V o S en otra fila","V al 5V del POWER; S en la fila 35."],["Error de compilaci\xF3n \xABLiquidCrystal_I2C.h: No such file\xBB","Falta la librer\xEDa","Inst\xE1lala desde el gestor de bibliotecas."]],challenge:["Guarda la temperatura m\xE1xima y m\xEDnima desde el arranque y mu\xE9stralas alternando en la fila 2.","Haz que el l\xEDmite de alarma se pueda cambiar enviando un n\xFAmero por el Monitor Serie."]})}{let n=[{id:"usV",from:"us.VCC",to:"P.5V",color:"rojo"},{id:"usG",from:"us.GND",to:"P.GND",color:"negro"},{id:"usT",from:"us.Trig",to:"D26.S",color:"amarillo"},{id:"usE",from:"us.Echo",to:"D27.S",color:"verde"},...qs("oled",1),...Qt("lv",18,"verde"),...Qt("lr",19,"morado"),...Qt("bz",25,"naranja")];Vt.push({n:5,slug:"aparcamiento",title:"Sensor de aparcamiento",level:"Intermedio",duration:"3 sesiones (3 h)",icon:"\u{1F17F}\uFE0F",short:"Ultrasonidos HC-SR04 + OLED + LEDs + pitidos seg\xFAn la distancia.",intro:"Como el sensor de aparcamiento de un coche: el HC-SR04 mide la distancia con ultrasonidos, la pantalla OLED la muestra en grande con una barra, y los LEDs y el zumbador avisan cada vez m\xE1s r\xE1pido seg\xFAn te acercas.",switch:"3V3",caution:"El HC-SR04 funciona a 5 V y su pin Echo devuelve pulsos de 5 V, pero las entradas del ESP32 son de 3,3 V. Muchos montajes lo conectan directo y funciona, pero queda fuera de lo que admite el fabricante y podr\xEDa da\xF1ar el pin a la larga. Si el taller dispone de 2 resistencias (1 k\u03A9 y 2 k\u03A9, no incluidas en el kit) monta un divisor de tensi\xF3n en Echo sobre la protoboard: Echo \u2192 1 k\u03A9 \u2192 GPIO 27, y GPIO 27 \u2192 2 k\u03A9 \u2192 GND.",objectives:["Explicar c\xF3mo se mide una distancia por el tiempo de un eco (d = t \xD7 343 m/s \xF7 2).","Alimentar un m\xF3dulo de 5 V desde el conector POWER y conocer el riesgo de los niveles de 5 V en entradas de 3,3 V.","Mostrar datos y gr\xE1ficos en una pantalla OLED I2C.","Programar avisos sin bloquear el programa con millis()."],ra:{2:["b","c","e"],3:["e","i"],4:["c","d","g","h"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de ultrasonidos HC-SR04",1],['Pantalla OLED 1,3" I2C',1],["M\xF3dulo LED verde",1],["M\xF3dulo LED rojo",1],["M\xF3dulo zumbador pasivo",1],["Cables Dupont H-H",15,"negro \xD74, rojo \xD74, amarillo, verde \xD72, azul, blanco, morado, naranja"],["Cables Dupont M-H",2,"rojo y negro"],["Cable USB-A a USB-B",1],["Una caja o libro como \xABcoche\xBB",1,"no incluido en el kit"]],libs:["sh110x","gfx"],code:ph,file:"P5_Aparcamiento/P5_Aparcamiento.ino",parts:{us:{type:"hcsr04",pos:[100,-6],rot:-90,label:"HC-SR04 \u2192 5V, GND, GPIO 26, 27"},car:{type:"car",pos:[158,-6],rot:90},oled:{type:"oled",pos:[30,72],rot:180,label:"OLED \u2192 I2C fila 1",draw:"parking"},lv:{type:"led",color:"verde",pos:[-48,-64],label:"LED verde \u2192 GPIO 18"},lr:{type:"led",color:"rojo",pos:[-20,-64],label:"LED rojo \u2192 GPIO 19"},bz:{type:"buzzer",pos:[26,-66],label:"Zumbador \u2192 GPIO 25"}},wires:n,steps:[ni("3V3",['HC-SR04, OLED 1,3", LED verde, LED rojo y zumbador',"15 cables H-H y 2 cables M-H"]),{t:"Alimenta el HC-SR04 desde el conector POWER",add:["us"],wires:["usV","usG"],take:["Sensor HC-SR04","2 cables M-H: rojo y negro"],do:["Coloca el HC-SR04 a la derecha de la placa, de pie, con los dos \xABojos\xBB mirando hacia fuera (ap\xF3yalo contra un estuche o suj\xE9talo con plastilina; el soporte gris del modelo 3D es solo orientativo).","Extremo hembra en el sensor; extremo macho en el conector azul POWER de abajo."],check:"VCC (rojo) en el agujero <b>5V</b> (2\xBA por la izquierda) y GND (negro) en el agujero <b>GND</b> (6\xBA por la izquierda). \xA1No los inviertas!"},{t:"Conecta Trig y Echo",add:[],wires:["usT","usE"],take:["2 cables H-H: amarillo y verde"],do:["Trig y Echo van a pines <b>S</b> (solo se\xF1al) del bloque derecho.","\u26A0\uFE0F Lee la nota de precauci\xF3n de 5 V sobre el pin Echo (pesta\xF1a \xABFicha\xBB)."],check:"Trig (amarillo) \u2192 S de la columna 26 \xB7 Echo (verde) \u2192 S de la columna 27. Los pines V y G de esas columnas quedan libres."},{t:"Conecta la pantalla OLED",add:["oled"],wires:Ut(n.slice(4,8)),take:['Pantalla OLED 1,3"',"4 cables H-H: negro, rojo, azul y blanco"],do:["Coloca la OLED delante de la placa, con sus pines hacia la placa.","Lee el orden de los pines en la propia pantalla: en algunas es GND-VCC-SCL-SDA y en otras VCC-GND-SCL-SDA."],check:"Fila 1 del bloque I2C: GND\u2192G, VCC\u2192V, SDA\u2192SDA (azul), SCL\u2192SCL (blanco)."},{t:"Conecta los LEDs y el zumbador",add:["lv","lr","bz"],wires:Ut(n.slice(8,17)),take:["LED verde, LED rojo y zumbador pasivo","9 cables H-H"],do:["LED verde \u2192 columna 18, LED rojo \u2192 columna 19, zumbador \u2192 columna 25 (los tres con G negro, V rojo y S de color)."],check:"En total 17 cables. Ning\xFAn pin tiene dos cables."},{...ii("P5_Aparcamiento.ino",{glow:{lr:!0}},{do:["Instala antes <b>Adafruit SH110X</b> (y sus dependencias Adafruit GFX y BusIO).","Acerca despacio una caja o tu mano al sensor."],check:">50 cm: verde y silencio \xB7 20\u201350 cm: pitidos lentos \xB7 10\u201320 cm: r\xE1pidos y LED rojo \xB7 <10 cm: pitido continuo y \xABPARA!\xBB."}),add:["car"]}],expected:["La OLED muestra la distancia en grande, la zona y una barra (0\u2013100 cm).","Sin obst\xE1culo (o a m\xE1s de 4 m) aparece \xAB---\xBB y LIBRE.","Acercando un objeto: los pitidos se aceleran hasta ser continuos a menos de 10 cm."],serial:`Sensor de aparcamiento listo
Distancia = 72.4 cm  -> LIBRE
Distancia = 35.1 cm  -> CERCA
Distancia = 14.8 cm  -> MUY CERCA
Distancia = 7.2 cm  -> PARA!`,example:"Ejemplo: si el eco tarda 1.000 \xB5s, la distancia es 1.000 \xD7 0,0343 \xF7 2 = <b>17,2 cm</b> (se divide entre 2 porque el sonido va y vuelve). Mide con una regla la distancia real a la caja y comp\xE1rala con la pantalla.",multimeter:[["Alimentaci\xF3n del HC-SR04","Pol\xEDmetro en 20 V DC. Negra en GND y roja en VCC del sensor.","\u2248 5 V"],["Alimentaci\xF3n de la OLED","Negra en G, roja en V de la fila 1 del bloque I2C.","\u2248 3,3 V"],["Pin Echo (comprobaci\xF3n de riesgo)","Negra en G, roja en el pin Echo, con un objeto a 10 cm.","Valor medio bajo (< 1 V); los picos son de 5 V aunque el pol\xEDmetro no los muestre"]],trouble:[["Siempre \xAB---\xBB","Trig/Echo cambiados o sin 5 V","Trig\u219226, Echo\u219227; VCC al 5V."],["OLED en negro","Pines cambiados o direcci\xF3n 0x3D","Conecta por nombre; prueba oled.begin(0x3D)."],["Imagen de la OLED desplazada o con basura","La pantalla es SSD1306","Usa la librer\xEDa Adafruit SSD1306 o pregunta al profesor."],["Medidas que saltan","Superficie blanda o inclinada","Usa un objeto plano y r\xEDgido."],["Pitido continuo sin objeto","Echo mal conectado (lee 0 cm)","Revisa el cable verde."]],challenge:["Muestra en la OLED la velocidad a la que se acerca el objeto (cm/s).","A\xF1ade el sensor IR del kit como \xABtope\xBB: si detecta algo, \xABPARA!\xBB aunque el ultrasonido no lo vea."]})}{let n=[{id:"irG",from:"ir.GND",to:"A34.G",color:"negro"},{id:"irV",from:"ir.VCC",to:"A34.V",color:"rojo"},{id:"irS",from:"ir.OUT",to:"A34.S",color:"amarillo"},{id:"svG",from:"sv.marron",to:"D13.G",color:"marron",k0:30},{id:"svV",from:"sv.rojo",to:"D13.V",color:"rojo",k0:30},{id:"svS",from:"sv.naranja",to:"D13.S",color:"naranja",k0:30},...qs("lcd",1),{id:"bat",from:"bat.dc",to:"DC",color:"negro",thick:!0}];Vt.push({n:6,slug:"barrera",title:"Barrera de parking",level:"Intermedio",duration:"3 sesiones (3 h)",icon:"\u{1F6A7}",short:"Sensor IR + servo 180\xB0 + LCD, con alimentaci\xF3n externa.",intro:"Automatizar\xE1s la barrera de un parking: cuando el sensor de infrarrojos detecta un coche, un servomotor levanta la barrera y la pantalla da la bienvenida y cuenta los veh\xEDculos. Como el servo consume m\xE1s corriente de la que da el USB, usar\xE1s un portapilas externo.",switch:"5V",caution:"Pon el interruptor en 5V solo con la placa desconectada. Con 5V, los pines V de TODOS los conectores G-V-S dan 5 V; por eso el sensor IR va al bloque ANALOG, cuyo pin 3V3 da siempre 3,3 V y as\xED su salida nunca supera los 3,3 V.",objectives:["Controlar la posici\xF3n de un servomotor con PWM (librer\xEDa ESP32Servo).","Justificar por qu\xE9 un actuador necesita alimentaci\xF3n externa y conectarla de forma segura.","Leer un sensor digital de obst\xE1culos (activo a nivel bajo).","Medir la tensi\xF3n del portapilas y la de los pines V."],ra:{1:["a","c","d"],3:["e","f","i"],4:["d","g","h"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de infrarrojos (obst\xE1culos)",1],["Servo motor est\xE1ndar 180\xB0",1,"el de \xE1ngulo, NO el de rotaci\xF3n continua 360\xB0"],["Pantalla LCD1602 I2C",1],["Portapilas 6\xD7AA con clavija DC y 6 pilas AA",1,"comprueba que lo tienes; las pilas no vienen en el kit"],["Cables Dupont H-H",7,"negro \xD72, rojo \xD72, amarillo, azul, blanco"],["Cable USB-A a USB-B",1],["Palito o pajita para la barrera (opcional)",1]],libs:["servo","lcd"],code:gh,file:"P6_Barrera/P6_Barrera.ino",parts:{ir:{type:"ir",pos:[-12,70],rot:180,label:"Sensor IR \u2192 ANALOG 34"},car:{type:"car",pos:[-12,130]},sv:{type:"servo",pos:[-8,-62],label:"Servo 180\xB0 \u2192 GPIO 13"},lcd:{type:"lcd",pos:[112,4],label:"LCD1602 \u2192 I2C fila 1",lines:["ADELANTE  >>>","Coches: 3"]},bat:{type:"battery",pos:[-118,52],label:"Portapilas 6\xD7AA (9 V)"}},wires:n,steps:[ni("5V",["Sensor IR, servo 180\xB0, LCD1602 I2C y portapilas 6\xD7AA","7 cables H-H"]),{t:"Conecta el sensor de infrarrojos",add:["ir"],wires:["irG","irV","irS"],take:["Sensor IR (con 2 LEDs en la punta y un potenci\xF3metro azul)","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el sensor delante de la placa con los LEDs IR mirando hacia fuera (hacia donde llegar\xE1n los coches).","Va al bloque ANALOG, fila <b>34</b> (la de arriba), aunque es un sensor digital: as\xED se alimenta a 3,3 V."],check:"GND \u2192 G (negro), VCC \u2192 3V3 (rojo), OUT \u2192 S (amarillo) de la fila 34."},{t:"Enchufa el servo",add:["sv"],wires:["svG","svV","svS"],take:["Servo 180\xB0","No necesitas cables: el conector del servo se enchufa directamente"],do:["El conector del servo tiene 3 cables: <b>marr\xF3n</b> (GND), <b>rojo</b> (V) y <b>naranja</b> (se\xF1al).","Ench\xFAfalo en la columna <b>13</b> del bloque izquierdo con el cable marr\xF3n hacia el centro de la placa (fila G) y el naranja hacia el conector azul (fila S)."],check:"Marr\xF3n en G, rojo en V, naranja en S de la columna 13. Si lo enchufas al rev\xE9s el servo no se mover\xE1 (no se rompe, pero desconecta antes de girarlo)."},{t:"Conecta la pantalla LCD",add:["lcd"],wires:Ut(n.slice(6,10)),take:["LCD1602 I2C","4 cables H-H: negro, rojo, azul y blanco"],do:["Igual que en el proyecto 4: fila 1 del bloque I2C."],check:"GND\u2192G, VCC\u2192V, SDA\u2192SDA (azul), SCL\u2192SCL (blanco)."},{t:"Prepara la alimentaci\xF3n externa",add:["bat"],wires:[],take:["Portapilas 6\xD7AA con interruptor y clavija DC","6 pilas AA nuevas"],do:["Mete las 6 pilas respetando la polaridad (+/\u2212) dibujada en el portapilas.","Mide con el pol\xEDmetro la tensi\xF3n en la clavija (punta roja dentro, negra fuera): debe dar 8\u20139,6 V.","Deja el portapilas APAGADO y todav\xEDa sin enchufar."],check:"El portapilas da entre 8 y 9,6 V y est\xE1 apagado."},{...ii("P6_Barrera.ino",{servo:75},{do:["Instala antes <b>ESP32Servo</b> y <b>LiquidCrystal I2C</b>.","Cuando el programa est\xE9 subido, enchufa la clavija del portapilas en el <b>jack DC</b> y enci\xE9ndelo. Puedes dejar tambi\xE9n el USB para ver el Monitor Serie.","Ajusta el potenci\xF3metro azul del sensor IR para que detecte tu mano a unos 10 cm (se enciende su LED)."],check:"Al acercar la mano al sensor IR la barrera sube a 90\xB0, la LCD pone \xABADELANTE\xBB y el contador aumenta. 3 s despu\xE9s de quitar la mano, la barrera baja."}),wires:["bat"],add:["car"]}],expected:["Al arrancar la barrera se coloca a 0\xB0 y la LCD muestra \xABBARRERA CERRADA\xBB.","Coche (o mano) delante del sensor \u2192 la barrera sube suavemente a 90\xB0 y la LCD muestra \xABADELANTE >>>\xBB y \xABCoches: N\xBB.","3 s despu\xE9s de que el coche pase, la barrera baja."],serial:`Barrera lista
Coche detectado. Total = 1
Cerrando barrera
Coche detectado. Total = 2`,example:"Ejemplo: el servo se controla con pulsos de 0,5 ms (0\xB0) a 2,4 ms (180\xB0) repetidos 50 veces por segundo. Para 90\xB0 el pulso dura unos 1,45 ms. Cambia <code>ANGULO_ABIERTA</code> a 120 y observa la diferencia.",multimeter:[["Portapilas","Pol\xEDmetro en 20 V DC, en la clavija antes de enchufarla.","8\u20139,6 V con pilas nuevas"],["Pines V con interruptor en 5V","Negra en G y roja en V de la columna 13.","\u2248 5 V"],["Salida del sensor IR","Negra en G, roja en S de la fila 34. Sin obst\xE1culo y con la mano delante.","\u2248 3,3 V sin obst\xE1culo \xB7 \u2248 0 V detectando"]],trouble:[["El servo tiembla o la placa se reinicia","Falta alimentaci\xF3n externa","Enchufa y enciende el portapilas."],["El servo no se mueve","Conector al rev\xE9s o en otra columna","Marr\xF3n en G, columna 13."],["El servo gira sin parar","Es el servo de 360\xB0","Usa el servo de 180\xB0."],["La barrera no reacciona","Sensor IR poco sensible","Gira su potenci\xF3metro azul hasta que su LED se encienda con la mano a 10 cm."],["La LCD no se ve","Interruptor en 3.3V o contraste","Interruptor en 5V; ajusta el potenci\xF3metro de la LCD."]],challenge:["Limita la capacidad del parking a 5 coches: al llegar a 5 la LCD pone \xABCOMPLETO\xBB y la barrera no sube.","A\xF1ade un LED verde/rojo como sem\xE1foro de entrada (proyecto 1)."]})}{let n=[...Qt("soil",34,"amarillo","A"),...Qt("rel",25,"naranja"),{id:"com",from:"P.5V",to:"rel.COM",color:"rojo",lift:25},{id:"pR",from:"pump.rojo",to:"rel.NO",color:"rojo",k0:40},{id:"pN",from:"pump.negro",to:"bb.c55a",color:"negro",k0:40},{id:"gnd",from:"bb.c55c",to:"P.GND",color:"negro"},{id:"bat",from:"bat.dc",to:"DC",color:"negro",thick:!0}];Vt.push({n:7,slug:"riego",title:"Riego autom\xE1tico",level:"Avanzado",duration:"4 sesiones (4 h)",icon:"\u{1F331}",short:"Sensor de humedad + rel\xE9 + bomba de agua, y pr\xE1ctica de mantenimiento.",intro:"Una maceta que se riega sola: el sensor de humedad mide la tierra y, si est\xE1 seca, el rel\xE9 enciende una mini bomba de agua unos segundos. Separar\xE1s el circuito de CONTROL (ESP32) del de POTENCIA (bomba). Al final har\xE1s una pr\xE1ctica de mantenimiento: localizar y sustituir un sensor \xABaveriado\xBB.",switch:"5V",caution:"Solo baja tensi\xF3n: la bomba funciona a 5 V tomados del conector POWER. Nunca conectes el rel\xE9 a la red el\xE9ctrica de 230 V aunque su etiqueta diga 250 VAC. El agua y la electr\xF3nica no se llevan bien: la placa, el rel\xE9 y la protoboard deben quedar LEJOS del vaso, sobre una bandeja seca. Seca cualquier salpicadura con la alimentaci\xF3n desconectada.",objectives:["Explicar la funci\xF3n de un rel\xE9 (interruptor controlado) y sus bornes COM, NO y NC.","Conectar un circuito de potencia de baja tensi\xF3n separado del de control, usando bornes de tornillo y protoboard.","Calibrar un sensor anal\xF3gico (seco/mojado) y convertir la lectura en %.","Diagnosticar y sustituir un elemento averiado siguiendo un procedimiento, y documentarlo en un informe."],ra:{4:["c","f","g","h"],5:["a","b","c","d","e","f","g","h","i"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Sensor de humedad del suelo",1],["M\xF3dulo rel\xE9 de 1 canal",1],["Micro bomba de agua 3\u20136 V",1],["Protoboard 830 puntos",1],["Portapilas 6\xD7AA con clavija DC y 6 pilas AA",1,"las pilas no vienen en el kit"],["Cables Dupont H-H",6,"negro \xD72, rojo \xD72, amarillo, naranja"],["Cables Dupont M-M",2,"rojo y negro"],["Cable USB-A a USB-B",1],["Vaso o recipiente con agua, tubo de silicona de 5 mm (\u2248 50 cm) y maceta con tierra",1,"NO incluidos en el kit"],["Sensor de humedad de repuesto (de otro kit)",1,"para la pr\xE1ctica de mantenimiento"]],tools:[["Destornillador plano peque\xF1o (2\u20132,5 mm)","para apretar los bornes de tornillo del rel\xE9"],["Papel absorbente / bayeta","por si hay salpicaduras"]],libs:[],code:vh,file:"P7_Riego/P7_Riego.ino",parts:{soil:{type:"soil",pos:[-68,96],rot:180,label:"Sensor humedad \u2192 ANALOG 34"},rel:{type:"relay",pos:[96,-24],rot:-90,label:"Rel\xE9 \u2192 GPIO 25"},bb:{type:"breadboard",pos:[42,108],label:"Protoboard"},pump:{type:"pump",pos:[168,62],rot:-90,label:"Bomba 5 V en el vaso"},plant:{type:"plant",pos:[180,-42]},bat:{type:"battery",pos:[-132,44],label:"Portapilas 6\xD7AA"}},margin:1.05,wires:n,steps:[ni("5V",["Sensor de humedad, rel\xE9, bomba, protoboard y portapilas","6 cables H-H y 2 cables M-M","Destornillador plano peque\xF1o"]),{t:"Conecta el sensor de humedad",add:["soil"],wires:Ut(n.slice(0,3)),take:["Sensor de humedad del suelo","3 cables H-H: negro, rojo y amarillo"],do:["Coloca el sensor delante de la placa a la izquierda, con las dos patas doradas hacia fuera.","Va a la fila <b>34</b> del bloque ANALOG (3,3 V fijos)."],check:"G (negro), 3V3 (rojo) y S (amarillo) en la fila 34. Las patas doradas NO deben tocar nada met\xE1lico."},{t:"Conecta el rel\xE9 (circuito de control)",add:["rel"],wires:Ut(n.slice(3,6)),take:["M\xF3dulo rel\xE9","3 cables H-H: negro, rojo y naranja"],do:["Coloca el rel\xE9 a la derecha de la placa, con sus pines G-V-S hacia la placa y los bornes de tornillo (NO, COM, NC) hacia fuera."],check:"Columna <b>25</b>: G negro, V rojo, S naranja. El interruptor est\xE1 en 5V (la bobina del rel\xE9 es de 5 V)."},{t:"Coloca la protoboard y la bomba",add:["bb","pump","plant"],wires:[],take:["Protoboard","Micro bomba con su tubo, dentro de un vaso con agua"],do:["Coloca la protoboard delante de la placa y el vaso con la bomba a la derecha, lejos de la electr\xF3nica.","Mete el extremo libre del tubo en la maceta.","La bomba debe estar totalmente sumergida antes de funcionar: en seco se estropea."],check:"Bomba sumergida, tubo en la maceta y vaso a m\xE1s de 15 cm de la placa."},{t:"Cablea el circuito de potencia (5 V)",add:[],wires:["com","pR","pN","gnd"],take:["2 cables M-M: rojo y negro","Destornillador plano"],do:["Afloja el tornillo del borne <b>COM</b> (el del centro), mete el pin del cable M-M rojo, aprieta y tira suavemente para comprobar que no sale. Su otro extremo va al agujero <b>5V</b> del conector POWER.","Mete el cable ROJO de la bomba en el borne <b>NO</b> (normalmente abierto) y aprieta.","Mete el cable NEGRO de la bomba en la protoboard, columna <b>55</b>, fila <b>a</b>.","Cable M-M negro: de la columna 55, fila <b>c</b> de la protoboard al agujero <b>GND</b> del conector POWER. (Los 5 agujeros a-b-c-d-e de una misma columna est\xE1n unidos por dentro.)"],check:"Recorrido de la corriente: 5V \u2192 COM \u2192 (rel\xE9 cerrado) \u2192 NO \u2192 bomba \u2192 protoboard col. 55 \u2192 GND. El borne NC queda libre."},{...ii("P7_Riego.ino",{glow:{}},{do:["Primero con SOLO el USB: mira \xABLectura =\xBB con el sensor al aire (seco) y con las patas en un vaso de agua (mojado). Escribe esos valores en <code>LECTURA_SECO</code> y <code>LECTURA_MOJADO</code> y vuelve a subir.","Enchufa el portapilas al jack DC y enci\xE9ndelo (la bomba consume m\xE1s de lo que da bien un USB).","Clava el sensor en la tierra de la maceta."],check:"Con tierra seca el rel\xE9 hace \xABclic\xBB, la bomba riega 3 s y espera 10 s. Con tierra h\xFAmeda el Monitor Serie dice \xABOK, no hace falta regar\xBB."}),add:["bat"],wires:["bat"]}],expected:["El Monitor Serie muestra la lectura bruta, la dispersi\xF3n y la humedad en %.","Si la humedad < 35 %: \xABSECO: regando\xBB, clic del rel\xE9 (se enciende su LED) y la bomba funciona 3 s; luego espera 10 s.","Si se desconecta o estropea el sensor: \xABAVERIA SENSOR: bomba bloqueada\xBB y la bomba no arranca."],serial:`Riego automatico listo
Lectura = 2950   Dispersion = 18   Humedad = 3 %   -> SECO: regando
Riego terminado. Esperando a que el agua se reparta...
Lectura = 1530   Dispersion = 22   Humedad = 82 %   -> OK, no hace falta regar
Lectura = 2210   Dispersion = 1380   Humedad = 44 %   -> AVERIA SENSOR: bomba bloqueada. Revisa/sustituye el sensor.`,example:"Ejemplo de calibraci\xF3n: seco = 3000, mojado = 1200. Una lectura de 2100 est\xE1 justo en medio \u2192 humedad = (3000 \u2212 2100) / (3000 \u2212 1200) \xD7 100 = <b>50 %</b>.",maintenance:{intro:"El profesor prepara un sensor \xABaveriado\xBB (por ejemplo con un cable cortado por dentro, una pata despegada o un conector flojo) y lo cambia por el bueno sin decir nada. El alumnado debe detectar la aver\xEDa, sustituir el elemento y documentarlo.",steps:[["Detectar el s\xEDntoma","El Monitor Serie muestra \xABAVERIA SENSOR\xBB (lectura fuera de rango o muy inestable) y la bomba no riega. Anota el s\xEDntoma y los valores de \xABLectura\xBB y \xABDispersi\xF3n\xBB."],["Consultar la gu\xEDa","Abre el esquema de esta pr\xE1ctica (pesta\xF1a \xABEsquema\xBB) e identifica qu\xE9 elemento produce la se\xF1al: el sensor de humedad en la fila 34 del bloque ANALOG."],["Medir con seguridad","Con la placa ALIMENTADA solo por USB y la bomba fuera del agua: pol\xEDmetro en 20 V DC, negra en G, roja en 3V3 de la fila 34 (debe dar \u2248 3,3 V). Luego roja en S: en seco y mojado debe cambiar. Si 3V3 es correcto pero S no cambia o baila \u2192 el sensor est\xE1 averiado."],["Comprobar los cables","DESCONECTA el USB y el portapilas. Con el pol\xEDmetro en continuidad, comprueba los 3 cables del sensor de extremo a extremo. Si un cable falla, sustit\xFAyelo; si los tres pitan, el fallo est\xE1 en el sensor."],["Acopiar el repuesto","Pide al profesor un sensor de repuesto del mismo modelo. Compru\xE9balo visualmente (patas sin \xF3xido, pines rectos)."],["Desmontar","Con todo desconectado, retira los 3 cables del sensor tirando del conector (nunca del cable). Ap\xE1rtalo en la caja de \xABaveriados\xBB etiquetado."],["Montar el repuesto","Conecta el sensor nuevo: G negro, 3V3 rojo, S amarillo en la fila 34. Revisa con la tabla del esquema."],["Verificar y recalibrar","Conecta el USB, comprueba que desaparece el aviso y repite la calibraci\xF3n seco/mojado si los valores han cambiado. Prueba un ciclo de riego completo."],["Informe","Rellena el parte de mantenimiento: fecha, equipo, s\xEDntoma, mediciones, causa, elemento sustituido, herramientas usadas, prueba final y residuos (el sensor averiado se deposita en el contenedor de RAEE del centro)."]]},multimeter:[["Alimentaci\xF3n del rel\xE9","Pol\xEDmetro en 20 V DC. Negra en G, roja en V de la columna 25.","\u2248 5 V"],["Se\xF1al del rel\xE9","Negra en G, roja en S de la columna 25 durante el riego.","\u2248 3,3 V regando \xB7 0 V en reposo"],["Tensi\xF3n en la bomba","Negra en el cable negro de la bomba (protoboard col. 55), roja en el borne NO, durante el riego.","\u2248 4,5\u20135 V"],["Contactos del rel\xE9 (sin bomba)","Desconecta todo, quita el cable de COM. Continuidad entre COM y NC, y entre COM y NO.","COM\u2013NC pita \xB7 COM\u2013NO no pita (rel\xE9 en reposo)"]],trouble:[["El rel\xE9 hace clic pero la bomba no gira","Cable suelto en un borne o en la protoboard","Aprieta los tornillos; comprueba que los dos cables est\xE1n en la MISMA columna 55."],["La bomba est\xE1 siempre encendida","Cable en NC en vez de NO, o rel\xE9 activo a nivel bajo","P\xE1salo a NO; si sigue, pon RELE_ACTIVO = LOW."],["El rel\xE9 no hace clic","Interruptor en 3.3V","Interruptor en 5V (desconectado)."],["\xABAVERIA SENSOR\xBB con el sensor bueno","Calibraci\xF3n sin hacer","Mide seco/mojado y actualiza LECTURA_SECO y LECTURA_MOJADO."],["La placa se reinicia al arrancar la bomba","Solo USB: ca\xEDda de tensi\xF3n","Usa el portapilas en el jack DC."]],challenge:["Cuenta cu\xE1ntos riegos se hacen al d\xEDa y mu\xE9stralo cada hora por el Monitor Serie.","A\xF1ade la LCD del proyecto 4 para mostrar la humedad y el estado (OK / REGANDO / AVER\xCDA)."]})}{let n=[{id:"vin",from:"P.VIN",to:"drv.+12V",color:"rojo",lift:20},{id:"gnd",from:"P.GND_2",to:"drv.GND",color:"negro",lift:20},{id:"ena",from:"drv.ENA",to:"D25.S",color:"blanco"},{id:"in1",from:"drv.IN1",to:"D26.S",color:"amarillo"},{id:"in2",from:"drv.IN2",to:"D27.S",color:"verde"},{id:"m1",from:"mot.rojo",to:"drv.OUT1",color:"rojo",k0:20,k1:20},{id:"m2",from:"mot.negro",to:"drv.OUT2",color:"negro",k0:20,k1:20},{id:"jG",from:"joy.GND",to:"A34.G",color:"negro"},{id:"jV",from:"joy.+5V",to:"A34.V",color:"rojo"},{id:"jY",from:"joy.VRy",to:"A34.S",color:"morado"},{id:"jSW",from:"joy.SW",to:"D23.S",color:"gris",lift:10},...qs("bmp",1,{G:"GND",V:"VCC",SDA:"SDA",SCL:"SCL"}),...qs("oled",2),{id:"bat",from:"bat.dc",to:"DC",color:"negro",thick:!0}];Vt.push({n:8,slug:"ventilador",title:"Ventilador inteligente",level:"Proyecto final",duration:"6 sesiones (6 h)",icon:"\u{1F300}",short:"Motor DC + L298N, joystick, BMP280 y OLED: modo manual y autom\xE1tico.",intro:"El proyecto final re\xFAne todo lo aprendido: un ventilador cuyo motor de corriente continua se controla con el driver L298N. En modo MANUAL lo manejas con el joystick (velocidad y sentido); en modo AUTO gira m\xE1s r\xE1pido cuanto m\xE1s calor mide el sensor BMP280. Todo se muestra en la pantalla OLED.",switch:"3V3",caution:"El motor se alimenta del portapilas a trav\xE9s del pin VIN, no de los pines de la ESP32. No toques la h\xE9lice mientras gira y sujeta el motor a la mesa (cinta adhesiva o pinza) para que no salte. El disipador del L298N puede calentarse: no lo toques tras un uso prolongado.",objectives:["Explicar por qu\xE9 un motor necesita un driver (L298N, puente en H) y separar alimentaci\xF3n de potencia y de control con masa com\xFAn.","Controlar velocidad (PWM en ENA) y sentido de giro (IN1/IN2).","Integrar dos dispositivos en el mismo bus I2C (BMP280 y OLED).","Planificar, montar, verificar y documentar un sistema completo."],ra:{1:["a","b","c","d"],2:["d","e"],3:["e","f","g","h","j"],4:["e","f","g","j"],5:["a","b","h","i"]},materials:[["Placa ACEBOTT ESP32 Plus",1],["Motor DC con m\xF3dulo controlador L298N",1],["M\xF3dulo joystick anal\xF3gico",1],["Sensor BMP280",1],['Pantalla OLED 1,3" I2C',1],["Portapilas 6\xD7AA con clavija DC y 6 pilas AA",1,"las pilas no vienen en el kit"],["Cables Dupont H-H",15,"negro \xD73, rojo \xD73, blanco \xD73, azul \xD72, amarillo, verde, morado, gris"],["Cables Dupont M-M",2,"rojo y negro"],["Cable USB-A a USB-B",1],["H\xE9lice de cartulina o rueda para el eje del motor",1,"opcional, no incluida"],["Cinta adhesiva",1,"para sujetar el motor"]],tools:[["Destornillador plano peque\xF1o (2\u20132,5 mm)","bornes de tornillo del L298N"],["Pinzas o alicates de punta","para quitar el puente (jumper) de ENA"]],libs:["bmp","unified","sh110x","gfx"],code:xh,file:"P8_Ventilador/P8_Ventilador.ino",parts:{drv:{type:"l298n",pos:[72,-84],label:"Driver L298N"},mot:{type:"motor",pos:[-30,-104],rot:180,label:"Motor DC + h\xE9lice"},joy:{type:"joystick",pos:[-42,74],rot:180,label:"Joystick \u2192 ANALOG 34 + GPIO 23"},oled:{type:"oled",pos:[10,74],rot:180,label:"OLED \u2192 I2C fila 2",draw:"fan"},bmp:{type:"bmp280",pos:[52,66],rot:180,label:"BMP280 \u2192 I2C fila 1"},bat:{type:"battery",pos:[-118,52],label:"Portapilas 6\xD7AA (9 V)"}},margin:1.06,wires:n,steps:[ni("3V3",["Todos los componentes de la lista de material","15 cables H-H y 2 cables M-M","Destornillador y pinzas"]),{t:"Prepara el L298N y el motor",add:["drv","mot"],wires:["m1","m2"],take:["Driver L298N","Motor DC","Destornillador plano y pinzas"],do:["Quita con las pinzas el puente (jumper) negro que une los pines <b>ENA</b> y el de al lado; gu\xE1rdalo. Deja puesto el puente \xAB12V EN\xBB (junto a los bornes de alimentaci\xF3n).","Afloja los bornes <b>OUT1</b> y <b>OUT2</b> (lado izquierdo del L298N), mete un cable del motor en cada uno y aprieta. Tira suavemente para comprobarlo.","Sujeta el motor a la mesa con cinta adhesiva y coloca la h\xE9lice."],check:"El pin ENA est\xE1 libre (sin puente). Los cables del motor est\xE1n firmes en OUT1 y OUT2."},{t:"Alimentaci\xF3n del L298N (desde VIN)",add:[],wires:["vin","gnd"],take:["2 cables M-M: rojo y negro"],do:["Cable M-M ROJO: del agujero <b>VIN</b> del conector POWER (el \xFAltimo a la derecha) al borne <b>+12V</b> del L298N.","Cable M-M NEGRO: de un agujero <b>GND</b> del conector POWER al borne <b>GND</b> del L298N (el del centro). Esta es la MASA COM\xDAN: sin ella el motor no obedece.","El borne +5V del L298N queda LIBRE."],check:"VIN \u2192 +12V (rojo) y GND \u2192 GND (negro). Revisa que no est\xE1n cruzados: invertirlos puede da\xF1ar el driver."},{t:"Se\xF1ales de control ENA, IN1, IN2",add:[],wires:["ena","in1","in2"],take:["3 cables H-H: blanco, amarillo y verde"],do:["Del L298N a los pines <b>S</b> del bloque derecho: ENA \u2192 columna 25, IN1 \u2192 26, IN2 \u2192 27."],check:"ENA (blanco) \u2192 S 25 \xB7 IN1 (amarillo) \u2192 S 26 \xB7 IN2 (verde) \u2192 S 27. IN3, IN4 y ENB quedan libres."},{t:"Conecta el joystick",add:["joy"],wires:["jG","jV","jY","jSW"],take:["Joystick","4 cables H-H: negro, rojo, morado y gris"],do:["GND, +5V y VRy van a la fila <b>34</b> del bloque ANALOG (G, 3V3 y S). Aunque el pin diga +5V, lo alimentamos a 3,3 V para que su salida no supere los 3,3 V.","SW (el bot\xF3n al pulsar la palanca) va al pin <b>S</b> de la columna <b>23</b>.","VRx queda sin conectar."],check:"Fila 34: GND\u2192G, +5V\u21923V3, VRy\u2192S. SW\u2192S de la columna 23."},{t:"Conecta BMP280 y OLED (bus I2C)",add:["bmp","oled"],wires:Ut(n.slice(11,19)),take:['BMP280 y OLED 1,3"',"8 cables H-H: 2 negros, 2 rojos, 2 azules, 2 blancos"],do:["BMP280 \u2192 fila 1 del bloque I2C. OLED \u2192 fila 2. Las 4 filas est\xE1n unidas por dentro: es el mismo bus, cada dispositivo tiene su direcci\xF3n (BMP280 0x76/0x77, OLED 0x3C).","Si tu BMP280 tiene 6 pines (tambi\xE9n CSB y SDO), deja esos dos libres."],check:"En cada m\xF3dulo: GND\u2192G, VCC\u2192V, SDA\u2192SDA (azul), SCL\u2192SCL (blanco)."},{...ii("P8_Ventilador.ino",{spin:!0},{do:["Instala antes <b>Adafruit BMP280 Library</b>, <b>Adafruit Unified Sensor</b> y <b>Adafruit SH110X</b> (con sus dependencias).","Con la palanca del joystick en el centro, enchufa el portapilas al jack DC y enci\xE9ndelo.","Pulsa la palanca del joystick para cambiar entre MANUAL y AUTO."],check:"MANUAL: palanca arriba = gira en un sentido, abajo = en el otro, centro = parado. AUTO: calienta el BMP280 con los dedos y el ventilador acelera."}),add:["bat"],wires:["bat"]}],expected:["La OLED muestra modo, temperatura, presi\xF3n y velocidad con una barra (izquierda = sentido inverso, derecha = directo).","MANUAL: la velocidad sigue a la palanca (30\u2013100 %) y se para en el centro.","AUTO: parado por debajo de 24 \xB0C, del 40 % al 100 % entre 24 y 30 \xB0C, 100 % por encima.","Cada pulsaci\xF3n del joystick cambia de modo."],serial:`BMP280 OK
Centro del joystick = 1893
MANUAL  T=23.8 C  P=1014 hPa  vel=0 %
MANUAL  T=23.8 C  P=1014 hPa  vel=72 %
Cambio a modo AUTO
AUTO  T=26.1 C  P=1014 hPa  vel=61 %`,example:"Ejemplo: con T_MIN = 24 \xB0C y T_MAX = 30 \xB0C, a 27 \xB0C la velocidad es 40 + (27 \u2212 24) \xD7 60 / 6 = <b>70 %</b>, es decir, PWM = 70 % de 210 = 147 sobre 255.",multimeter:[["VIN (portapilas)","Pol\xEDmetro en 20 V DC. Negra en GND, roja en VIN del conector POWER.","\u2248 8\u20139 V"],["5 V l\xF3gicos del L298N","Negra en el borne GND, roja en el borne +5V del L298N.","\u2248 5 V (lo genera su regulador)"],["Tensi\xF3n en el motor","Puntas en OUT1 y OUT2 en modo manual.","Sube con la palanca; cambia de signo (+/\u2212) al invertir el sentido"],["Joystick en reposo","Negra en G, roja en S de la fila 34.","\u2248 1,5\u20131,7 V (mitad de 3,3 V)"]],trouble:[["El motor no gira nunca","Puente ENA puesto, falta masa com\xFAn o portapilas apagado","Quita el puente ENA, revisa GND\u2013GND y enciende el portapilas."],["Gira solo a tope o nada","ENA sin conectar al 25","Cable blanco ENA \u2192 S 25."],["Gira al rev\xE9s de lo esperado","Cables del motor invertidos","Intercambia OUT1 y OUT2 (o IN1/IN2)."],["\xABsin BMP280\xBB en la OLED","SDA/SCL cambiados o pines CSB/SDO mal","Revisa la fila 1; prueba otra fila."],["Se mueve solo con la palanca en el centro","Centro mal calibrado","Reinicia sin tocar el joystick; aumenta ZONA_MUERTA."]],challenge:["A\xF1ade un tercer modo \xABBRISA\xBB: el ventilador alterna 5 s r\xE1pido y 5 s lento.","Guarda T_MIN y T_MAX con el joystick (eje X) en vez de en el c\xF3digo.","Elabora el informe final del proyecto con fotos, esquema, lista de material, mediciones y conclusiones."]})}});var si,Vl,J_,zl,fs,Hl,kl,Sh,Mh,Eh=Pt(()=>{si={codigo:"3015",nombre:"Equipos el\xE9ctricos y electr\xF3nicos",titulo:"T\xEDtulo Profesional B\xE1sico en Inform\xE1tica y Comunicaciones",norma:"Orden de 8 de noviembre de 2016 (BOJA n\xBA 241, de 19 de diciembre de 2016), Anexo IV",url:"https://www.juntadeandalucia.es/boja/2016/241/1"},Vl={1:{t:"Identifica el material, herramientas y equipo necesarios para el montaje y ensamblado de equipos el\xE9ctricos y electr\xF3nicos, describiendo sus principales caracter\xEDsticas y funcionalidad.",ce:{a:"Se han identificado y clasificado los elementos y componentes tipo de un equipo el\xE9ctrico o electr\xF3nico.",b:"Se han identificado y clasificado los anclajes y sujeciones tipo (tornillos, clips, pesta\xF1as, entre otros) de un equipo el\xE9ctrico o electr\xF3nico en funci\xF3n de su aplicaci\xF3n, rigidez y estabilidad.",c:"Se han identificado y clasificado las herramientas (atornillador el\xE9ctrico, atornilladores planos y de estrella y llaves, entre otros) normalmente empleadas en el ensamblado de un equipo el\xE9ctrico o electr\xF3nico en funci\xF3n de su aplicaci\xF3n e idoneidad.",d:"Se han identificado y clasificado los diferentes medios y equipos de seguridad personal (guantes de protecci\xF3n, gafas y mascarilla, entre otros) en funci\xF3n de su aplicaci\xF3n y teniendo en cuenta las herramientas a utilizar."}},2:{t:"Determina la secuencia de las operaciones de montaje y desmontaje de equipos el\xE9ctricos y electr\xF3nicos, interpretando esquemas e identificando los pasos a seguir.",ce:{a:"Se ha reconocido la simbolog\xEDa de representaci\xF3n gr\xE1fica de los elementos y componentes de los equipos el\xE9ctricos y electr\xF3nicos.",b:"Se ha interpretado el procedimiento y secuencia de montaje/conexi\xF3n, a partir de esquemas o gu\xEDas de montaje.",c:"Se ha identificado cada uno de los elementos representados en el esquema con el elemento real.",d:"Se ha identificado el procedimiento y secuencia de montaje/conexi\xF3n de los distintos elementos (inserci\xF3n de tarjetas, fijaci\xF3n de elementos, entre otros).",e:"Se ha definido el proceso y secuencia de montaje/conexi\xF3n a partir del esquema o gu\xEDa de montaje."}},3:{t:"Monta y desmonta elementos de equipos el\xE9ctricos o electr\xF3nicos, interpretando esquemas y gu\xEDas de montaje.",ce:{a:"Se han seleccionado los esquemas y gu\xEDas de montaje indicados para un modelo determinado.",b:"Se han seleccionado las herramientas indicadas en los esquemas y gu\xEDas de montaje.",c:"Se han preparado los elementos y materiales que se van a utilizar, siguiendo procedimientos normalizados.",d:"Se ha identificado la ubicaci\xF3n de los distintos elementos en el equipo.",e:"Se han ensamblado los distintos componentes siguiendo procedimientos normalizados, aplicando las normas de seguridad de los mismos.",f:"Se han fijado los componentes con los elementos de sujeci\xF3n indicados en los esquemas o gu\xEDas de montaje y aplicando el par de apriete o presi\xF3n establecidos.",g:"Se ha aplicado t\xE9cnicas de montaje de componentes y conectores electr\xF3nicos en placas de circuito impreso.",h:"Se han aplicado t\xE9cnicas de desmontaje de equipos el\xE9ctricos o electr\xF3nicos.",i:"Se han observado los requerimientos de seguridad establecidos.",j:"Se ha elaborado un informe recogiendo las actividades desarrolladas y resultados obtenidos."}},4:{t:"Conexiona elementos en equipos el\xE9ctricos o electr\xF3nicos aplicando t\xE9cnicas b\xE1sicas y verificando la continuidad.",ce:{a:"Se han seleccionado los esquemas y gu\xEDas de montaje indicados para un modelo determinado de conexi\xF3n.",b:"Se ha seleccionado las herramientas indicadas en los esquemas y gu\xEDas de conexi\xF3n.",c:"Se han dispuesto y colocado las piezas del conector y los cables.",d:"Se han dispuesto y colocado las protecciones personales y de los elementos.",e:"Se han acondicionado los cables (pelar, estirar, ordenar) siguiendo procedimientos.",f:"Se han insertado las piezas del conector en el orden correcto y unir los cables (soldar, crimpar, embornar, entre otros) de la forma establecida en el procedimiento.",g:"Se ha realizado la conexi\xF3n (soldadura, embornado, conector) seg\xFAn el procedimiento establecido (posici\xF3n de elementos, inserci\xF3n del elemento, maniobra de fijaci\xF3n, entre otros).",h:"Se han observado las medidas de seguridad en la utilizaci\xF3n de equipos y herramientas.",i:"Se han dispuesto y colocado las etiquetas en los cables, seg\xFAn el procedimiento establecido.",j:"Se han tratado los residuos generados de acuerdo a la normativa sobre medioambiente."}},5:{t:"Realiza el mantenimiento b\xE1sico de equipos el\xE9ctricos y electr\xF3nicos, aplicando las t\xE9cnicas establecidas en condiciones de calidad y seguridad.",ce:{a:"Se han seleccionado los esquemas y gu\xEDas indicados para un modelo determinado.",b:"Se han seleccionado las herramientas seg\xFAn las operaciones a realizar.",c:"Se han identificado los elementos a sustituir.",d:"Se han acopiado los elementos de sustituci\xF3n.",e:"Se han seleccionado las herramientas necesarias para las operaciones a realizar.",f:"Se han desmontado los elementos a sustituir, empleando las t\xE9cnicas y herramientas apropiadas seg\xFAn los requerimientos de cada intervenci\xF3n.",g:"Se han montado los elementos de sustituci\xF3n, empleando las t\xE9cnicas y herramientas apropiadas seg\xFAn los requerimientos de cada intervenci\xF3n.",h:"Se han realizado las operaciones observando las medidas de seguridad previstas para los componentes y personales.",i:"Se ha elaborado un informe con las operaciones realizadas en un documento con el formato establecido."}}},J_="https://espressif.github.io/arduino-esp32/package_esp32_index.json",zl=[["Instala Arduino IDE 2","Desc\xE1rgalo gratis de <b>arduino.cc/en/software</b> (Windows, macOS o Linux) e inst\xE1lalo con las opciones por defecto."],["A\xF1ade las placas ESP32",`Abre <b>Archivo \u2192 Preferencias</b>. En \xABURLs adicionales de gestor de placas\xBB pega:<br><code class="url">${J_}</code><br>Pulsa <b>Aceptar</b>.`],["Instala el paquete \xABesp32\xBB","Abre <b>Herramientas \u2192 Placa \u2192 Gestor de placas</b>, busca <b>esp32</b> y pulsa <b>Instalar</b> en \xABesp32 by Espressif Systems\xBB (versi\xF3n 3.x; probado con la 3.3). Tarda unos minutos."],["Instala el driver CH340","La ESP32 Plus usa el chip USB <b>CH340</b>. En Windows, si al conectar la placa no aparece ning\xFAn puerto COM nuevo, instala el driver \xABCH341SER\xBB de <b>wch-ic.com</b> (en Linux y macOS recientes ya viene incluido). Usa un cable USB-B que transmita datos."],["Selecciona la placa","En <b>Herramientas \u2192 Placa \u2192 esp32</b> elige <b>\xABESP32 Dev Module\xBB</b>."],["Selecciona el puerto","Conecta la placa por USB y elige en <b>Herramientas \u2192 Puerto</b> el puerto que aparece (COM3, COM4\u2026 en Windows; /dev/ttyUSB0 en Linux). Si dudas, desconecta la placa: el puerto que desaparece es el suyo."],["Instala las librer\xEDas de la pr\xE1ctica","Abre <b>Herramientas \u2192 Gestionar bibliotecas\u2026</b> (o el icono de libros), busca cada librer\xEDa por su nombre exacto e inst\xE1lala. Si pregunta por instalar dependencias, pulsa <b>\xABInstalar todo\xBB</b>."],["Sube el programa","Abre el archivo <b>.ino</b> de la pr\xE1ctica (o pega el c\xF3digo), pulsa <b>\u2713 Verificar</b> y despu\xE9s <b>\u2192 Subir</b>. Normalmente la placa entra sola en modo de carga. Si se queda en \xABConnecting\u2026\xBB y falla: prueba otro cable o puerto USB; como \xFAltimo recurso une con un cable M-M el agujero <b>0</b> y un <b>GND</b> del conector POWER, pulsa <b>RESET</b>, sube el programa y quita el cable."],["Abre el Monitor Serie","Pulsa la lupa (arriba a la derecha) y elige <b>115200 baudios</b> abajo a la derecha. Ah\xED ver\xE1s los mensajes de la placa."]],fs={lcd:{n:"LiquidCrystal I2C",a:"Frank de Brabander",v:"1.1.2",inc:"#include <LiquidCrystal_I2C.h>",note:"Al compilar puede avisar de que \xABpodr\xEDa ser incompatible con ESP32\xBB: es solo un aviso, funciona."},servo:{n:"ESP32Servo",a:"Kevin Harrington, John K. Bennett",v:"3.x",inc:"#include <ESP32Servo.h>"},sh110x:{n:"Adafruit SH110X",a:"Adafruit",v:"2.1.x",inc:"#include <Adafruit_SH110X.h>",note:"Instala tambi\xE9n sus dependencias (Adafruit GFX Library y Adafruit BusIO)."},gfx:{n:"Adafruit GFX Library",a:"Adafruit",v:"1.11+",inc:"#include <Adafruit_GFX.h>"},bmp:{n:"Adafruit BMP280 Library",a:"Adafruit",v:"2.6+ / 3.x",inc:"#include <Adafruit_BMP280.h>",note:"Instala tambi\xE9n \xABAdafruit Unified Sensor\xBB y \xABAdafruit BusIO\xBB."},unified:{n:"Adafruit Unified Sensor",a:"Adafruit",v:"1.1.x",inc:"(dependencia)"}},Hl=[["Pol\xEDmetro digital","con escalas de tensi\xF3n continua (20 V), resistencia y prueba de continuidad (pitido)"],["Ordenador con Arduino IDE 2","Windows, macOS o Linux, con el paquete \xABesp32\xBB instalado (ver \xABPreparar el PC\xBB)"],["Cable USB-A a USB-B","el de tipo \xABimpresora\xBB; debe ser de datos, no solo de carga"],["Bandeja o alfombrilla antiest\xE1tica","recomendable: trabaja sobre una superficie limpia, seca y no met\xE1lica"]],kl=["Monta y desmonta SIEMPRE con la placa desconectada (sin USB y sin portapilas). Conecta la alimentaci\xF3n solo cuando el profesor haya revisado el montaje.","Coge las placas por los bordes. No toques los pines ni el chip con los dedos: la electricidad est\xE1tica puede da\xF1arlos.","Conecta cada cable por su NOMBRE serigrafiado (G, V, S, GND, VCC\u2026) y nunca solo por su posici\xF3n: hay m\xF3dulos con los pines en otro orden.","Nunca unas directamente V (o 5V/3V3) con G (GND): es un cortocircuito.","Si algo se calienta, huele a quemado o el LED PWR se apaga, desconecta el USB inmediatamente y avisa al profesor.","Trabajamos solo con baja tensi\xF3n (\u2264 9 V). Prohibido conectar nada a la red el\xE9ctrica (230 V)."],Sh=[["Conectores G-V-S (digitales)","Dos bloques de pines macho bajo el conector azul superior. Cada columna lleva el n\xFAmero de su GPIO (18, 19, 23, 5, 13, 12 | 14, 27, 16, 17, 25, 26) y tiene 3 pines: <b>S</b> (se\xF1al, base azul, la fila junto al conector azul), <b>V</b> (alimentaci\xF3n, base roja, fila del medio) y <b>G</b> (GND, base negra, la fila m\xE1s cercana al centro de la placa)."],["Interruptor 3.3V / 5V","Elige la tensi\xF3n que sale por los pines <b>V</b> de los conectores G-V-S y del bloque I2C. Arriba (hacia el conector azul) = <b>5V</b>; abajo = <b>3.3V</b>. C\xE1mbialo SOLO con la placa desconectada."],["Bloque ANALOG (G-3V3-S)","A la izquierda del chip, 4 filas: <b>34, 35, 4 y 2</b> (de arriba abajo). Columnas: <b>G</b> (negra), <b>3V3</b> (roja, siempre 3,3 V, no depende del interruptor) y <b>S</b> (azul). Para sensores anal\xF3gicos usaremos las filas <b>34 y 35</b>, que son solo de entrada."],["Bloque I2C (G-V-SDA-SCL)","Junto al interruptor: 4 filas iguales para conectar hasta 4 m\xF3dulos I2C (pantallas, BMP280\u2026). Columnas: <b>G</b> (negra), <b>V</b> (roja), <b>SDA</b> (azul, GPIO 21) y <b>SCL</b> (blanca, GPIO 22)."],["Conector POWER (azul, abajo)","De izquierda a derecha: 0 \xB7 5V \xB7 RST \xB7 3V3 \xB7 5V \xB7 GND \xB7 GND \xB7 VIN. Aqu\xED se toman 5 V fijos, GND y VIN (la tensi\xF3n del portapilas)."],["USB-B y jack DC","USB-B: programa y alimenta la placa (5 V). Jack DC (7\u201312 V): portapilas de 6\xD7AA (9 V) cuando un motor o servo necesita m\xE1s corriente."]],Mh=[["H-H (hembra-hembra)","de pin macho de un m\xF3dulo a pin macho de la placa (G-V-S, ANALOG, I2C)"],["M-H (macho-hembra)","de pin macho de un m\xF3dulo a un agujero del conector azul de la placa (POWER: 5V, GND\u2026)"],["M-M (macho-macho)","de un agujero del conector azul a un borne de tornillo o a la protoboard"]]});function Ah(n){let e;return(e=n.match(/^D(\d+)\.(S|V|G)$/))?`${K_[e[2]]} de la columna <b>GPIO ${e[1]}</b>`:(e=n.match(/^A(\d+)\.(S|V|G)$/))?`${{G:"pin <b>G</b> (base negra, columna izquierda)",V:"pin <b>3V3</b> (base roja, columna central)",S:"pin <b>S</b> (base azul, columna derecha)"}[e[2]]} de la fila <b>${e[1]}</b> del bloque <b>ANALOG</b>`:(e=n.match(/^I(\d)\.(G|V|SDA|SCL)$/))?`${{G:"pin <b>G</b> (base negra)",V:"pin <b>V</b> (base roja)",SDA:"pin <b>SDA</b> (base azul)",SCL:"pin <b>SCL</b> (base blanca)"}[e[2]]} de la <b>fila ${e[1]}</b> del bloque <b>I2C</b>`:(e=n.match(/^P\.(.+)$/))?`agujero <b>${e[1].replace("_2","")}</b> del conector azul inferior <b>POWER</b> (el ${Q_[e[1]]} empezando por la izquierda)`:n==="DC"?"el <b>jack DC</b> de la placa (esquina inferior izquierda)":n}function Gl(n){let e;return(e=n.match(/^D(\d+)\.(S|V|G)$/))?`GPIO ${e[1]} \xB7 ${e[2]}`:(e=n.match(/^A(\d+)\.(S|V|G)$/))?`ANALOG ${e[1]} \xB7 ${e[2]==="V"?"3V3":e[2]}`:(e=n.match(/^I(\d)\.(.+)$/))?`I2C fila ${e[1]} \xB7 ${e[2]}`:(e=n.match(/^P\.(.+)$/))?`POWER \xB7 ${e[1].replace("_2","")}`:n==="DC"?"Jack DC":n}var K_,Q_,Wl,Th=Pt(()=>{K_={S:"pin <b>S</b> (base azul, fila junto al conector azul superior)",V:"pin <b>V</b> (base roja, fila del medio)",G:"pin <b>G</b> (base negra, fila m\xE1s cercana al centro de la placa)"},Q_={0:"1\xBA","5V":"2\xBA",RST:"3\xBA","3V3":"4\xBA","5V_2":"5\xBA",GND:"6\xBA",GND_2:"7\xBA",VIN:"8\xBA"};Wl={negro:"NEGRO",rojo:"ROJO",amarillo:"AMARILLO",verde:"VERDE",azul:"AZUL",blanco:"BLANCO",naranja:"NARANJA",marron:"MARR\xD3N",morado:"MORADO",gris:"GRIS"}});var pv=Xh(()=>{tc();sh();bh();Eh();Th();var at=(n,e=document)=>e.querySelector(n),oe=n=>String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Nh=new URLSearchParams(location.search),Oh=Nh.get("render")==="1",Uh={relay:["COM","NO","NC"],l298n:["OUT1","OUT2","OUT3","OUT4","+12V","GND","+5V"]};function wh(n,e){if(/^(D|A|I)\d/.test(e))return"H";if(/^P\./.test(e))return"M";if(e==="DC")return"DC";let[t,i]=e.split("."),s=n.parts[t];return s?(Uh[s.type]||[]).includes(i)?"M":["pump","motor","servo"].includes(s.type)?"LEAD":s.type==="battery"?"DC":s.type==="breadboard"?"M":"H":"?"}function Bh(n,e){let t=wh(n,e.from),i=wh(n,e.to);if(t==="DC"||i==="DC")return"Clavija DC";if(t==="LEAD"||i==="LEAD")return n.parts[(t==="LEAD"?e.from:e.to).split(".")[0]].type==="servo"?"Conector del servo":"Cable propio del componente";let s=[t,i].sort().join("-");return{"H-H":"H-H","H-M":"M-H","M-M":"M-M"}[s]||s}function Fh(n,e){if(/^(D|A|I)\d|^P\.|^DC$/.test(e))return null;let[t,i]=e.split("."),s=n.parts[t],r=(s.label||s.type).split("\u2192")[0].trim();if((Uh[s.type]||[]).includes(i))return`<b>borne ${oe(i)}</b> de: ${oe(r)}`;let a={marron:"cable marr\xF3n",rojo:"cable rojo",naranja:"cable naranja",negro:"cable negro",dc:"clavija",c55a:"columna 55, fila a",c55c:"columna 55, fila c"}[i]||"pin "+i;return`<b>${oe(a)}</b> de: ${oe(r)}`}function Ch(n,e){return Fh(n,e)||Ah(e)}function Rh(n,e){if(!Fh(n,e))return Gl(e);let[i,s]=e.split("."),r=n.parts[i];return(r.label||r.type).split("\u2192")[0].trim()+" \xB7 "+s}var Vh=n=>`<span class="sw" style="background:${Fl[n]||"#888"}"></span>`,Ph=/\b(const|int|float|bool|void|if|else|for|while|return|unsigned|long|char|true|false|byte|static|break|case|switch|do|String)\b/,Ih=/\b(setup|loop|pinMode|digitalWrite|digitalRead|analogRead|analogWrite|analogReadMilliVolts|analogReadResolution|analogSetPinAttenuation|delay|delayMicroseconds|millis|tone|noTone|pulseIn|map|constrain|min|max|abs|ledcAttach|ledcWrite|Serial|Wire|begin|print|println)\b/;function ev(n){let e=/(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)')|(#\w+[^\n]*)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g,t="",i=0,s;for(;s=e.exec(n);){t+=oe(n.slice(i,s.index)),i=e.lastIndex;let r=oe(s[0]);s[1]?t+=`<span class="c-com">${r}</span>`:s[2]?t+=`<span class="c-str">${r}</span>`:s[3]?t+=`<span class="c-pre">${r}</span>`:s[4]?t+=`<span class="c-num">${r}</span>`:Ph.test(s[0])&&s[0].match(Ph)[0]===s[0]?t+=`<span class="c-kw">${r}</span>`:Ih.test(s[0])&&s[0].match(Ih)[0]===s[0]?t+=`<span class="c-fn">${r}</span>`:/^[A-Z][A-Z0-9_]+$/.test(s[0])?t+=`<span class="c-const">${r}</span>`:t+=r}return t+oe(n.slice(i))}function tv(n){let e=[],t={},i=w=>/^(D|A|I)\d|^P\.|^DC$/.test(w);for(let w of n.wires)for(let I of[w.from,w.to])if(i(I))e.includes(I)||e.push(I);else{let[E,y]=I.split(".");t[E]=t[E]||[],t[E].includes(y)||t[E].push(y)}let s=w=>{var E;let I=w.match(/^(D|A|I|P)/);return((E={D:0,A:1,I:2,P:3}[I?I[1]:"Z"])!=null?E:4)*1e3+e.indexOf(w)};e.sort((w,I)=>s(w)-s(I));let r=24,a=16,o=8,l=168,c={};e.forEach((w,I)=>c[w]=a+30+I*r);let d=e.length*r+40,h=Object.keys(t),u=392,p=196,g=a,_={},m=[];for(let w of h){let I=t[w],E=n.parts[w];m.push({pid:w,y:g,h:I.length*r+34,label:(E.label||E.type).split("\u2192")[0].trim()}),I.forEach((y,v)=>_[w+"."+y]=g+28+v*r+6),g+=I.length*r+34+18}let f=Math.max(a+d,g)+10,S=`<svg viewBox="0 0 ${600+Math.max(0,n.wires.filter(w=>!i(w.from)&&!i(w.to)).length)*14} ${f}" class="schem" xmlns="http://www.w3.org/2000/svg" font-family="Decima, Arial, sans-serif">`;S+=`<rect x="${o}" y="${a}" width="${l}" height="${d}" rx="8" fill="#15171a"/><text x="${o+l/2}" y="${a+20}" fill="#fff" font-size="13" font-weight="700" text-anchor="middle">ESP32 Plus \xB7 interruptor ${n.switch==="5V"?"5V":"3.3V"}</text>`;for(let w of e)S+=`<text x="${o+l-10}" y="${c[w]+6}" fill="#fff" font-size="13.5" text-anchor="end">${oe(Gl(w))}</text><circle cx="${o+l}" cy="${c[w]+2}" r="3.5" fill="#f39900"/>`;for(let w of m){S+=`<rect x="${u}" y="${w.y}" width="${p}" height="${w.h}" rx="8" fill="#fff" stroke="#51626F" stroke-width="1.5"/><text x="${u+p/2}" y="${w.y+18}" font-size="14" font-weight="700" fill="#DC001B" text-anchor="middle">${oe(w.label)}</text>`;for(let I of t[w.pid]){let E=_[w.pid+"."+I];S+=`<circle cx="${u}" cy="${E-4}" r="3.5" fill="#51626F"/><text x="${u+10}" y="${E}" font-size="13.5" fill="#222">${oe(I.replace(/^c55/,"col.55 "))}</text>`}}let b=0,N=0;for(let w of n.wires){let I=Fl[w.color]||"#888",E=w.color==="blanco"?"#bbb":I,y=i(w.from)?w.from:i(w.to)?w.to:null;if(y){let v=y===w.from?w.to:w.from,R=c[y]+2,F=_[v]-4,U=o+l,V=u,X=190+b++%20*10;S+=`<path d="M${U} ${R} H${X} V${F} H${V}" fill="none" stroke="${E}" stroke-width="2.4" ${w.color==="blanco"?'stroke-dasharray="6 3"':""}/>`}else{let v=_[w.from]-4,R=_[w.to]-4,F=u+p+14+N++*12;S+=`<path d="M${u} ${v} H${u-12} M${u+p} ${v} H${F} V${R} H${u+p}" fill="none" stroke="${E}" stroke-width="2.4"/>`,S+=`<circle cx="${u+p}" cy="${v}" r="3" fill="${E}"/><circle cx="${u+p}" cy="${R}" r="3" fill="${E}"/>`}}return S+"</svg>"}function nv(n){return Object.entries(n.ra).map(([e,t])=>`<div class="ra"><div class="ra-h"><span class="tag">RA${e}</span> ${oe(Vl[e].t)}</div><ul>${t.map(i=>`<li><b>CE ${e}${i})</b> ${oe(Vl[e].ce[i])}</li>`).join("")}</ul></div>`).join("")}function Dh(n){return n.libs.length?`<table class="tbl"><tr><th>Librer\xEDa (nombre exacto)</th><th>Autor</th><th>Versi\xF3n probada</th></tr>${n.libs.map(e=>`<tr><td><b>${oe(fs[e].n)}</b>${fs[e].note?`<div class="muted small">${oe(fs[e].note)}</div>`:""}</td><td>${oe(fs[e].a)}</td><td>${oe(fs[e].v)}</td></tr>`).join("")}</table>`:'<p class="muted">Esta pr\xE1ctica no necesita librer\xEDas adicionales: solo el paquete \xABesp32\xBB.</p>'}function iv(n,e){let t=n.steps[e],s=(t.wires||[]).map(r=>n.wires.find(a=>a.id===r)).map(r=>`<tr><td>${Vh(r.color)}<b>${Wl[r.color]||r.color}</b><div class="muted small">${oe(Bh(n,r))}</div></td><td>${Ch(n,r.from)}</td><td class="arrow">\u2192</td><td>${Ch(n,r.to)}</td></tr>`).join("");return`<div class="step-card">
    <div class="step-h"><span class="step-n">${e+1}</span><div><div class="muted small">Paso ${e+1} de ${n.steps.length}</div><h3>${oe(t.t)}</h3></div></div>
    <div class="blk take"><h4>\u{1F9F0} Coge</h4><ul>${(t.take||[]).map(r=>`<li>${r}</li>`).join("")}</ul></div>
    <div class="blk do"><h4>\u{1F527} Haz</h4><ol>${(t.do||[]).map(r=>`<li>${r}</li>`).join("")}</ol>
    ${s?`<table class="tbl wires"><tr><th>Cable</th><th>Desde</th><th></th><th>Hasta</th></tr>${s}</table>`:""}</div>
    <div class="blk check"><h4>\u2705 Comprueba antes de seguir</h4><p>${t.check||""}</p></div>
  </div>`}function sv(n){let e=[...Hl,...n.tools||[]];return{pasos:()=>iv(n,tt.step)+`<div class="steps-list">${n.steps.map((t,i)=>`<button class="sl ${i===tt.step?"on":""}" data-step="${i}"><span>${i+1}</span>${oe(t.t)}</button>`).join("")}</div>`,ficha:()=>`<h3>Proyecto ${n.n}. ${oe(n.title)}</h3><p class="lead">${oe(n.intro)}</p>
      <div class="facts"><div><b>Nivel</b>${oe(n.level)}</div><div><b>Duraci\xF3n</b>${oe(n.duration)}</div><div><b>Interruptor</b>${n.switch==="5V"?"5V":"3.3V"}</div></div>
      ${n.caution?`<div class="caution">\u26A0\uFE0F <b>Precauci\xF3n.</b> ${oe(n.caution)}</div>`:""}
      <h4>Objetivos</h4><ul>${n.objectives.map(t=>`<li>${oe(t)}</li>`).join("")}</ul>
      <h4>Resultados de aprendizaje y criterios de evaluaci\xF3n</h4><p class="muted small">Profesor: <b>${oe(kn.profesor)}</b> \xB7 M\xF3dulo ${si.codigo} \xAB${si.nombre}\xBB \xB7 ${oe(si.norma)}</p>${nv(n)}
      <h4>Seguridad</h4><ul class="safety">${kl.map(t=>`<li>${oe(t)}</li>`).join("")}</ul>`,material:()=>`<h4>Material del kit</h4><table class="tbl"><tr><th>Componente</th><th>Cant.</th><th>Notas</th></tr>${n.materials.map(t=>`<tr><td>${oe(t[0])}</td><td class="c">${t[1]}</td><td class="muted small">${oe(t[2]||"")}</td></tr>`).join("")}</table>
      <h4>Herramientas</h4><table class="tbl">${e.map(t=>`<tr><td><b>${oe(t[0])}</b></td><td class="muted small">${oe(t[1])}</td></tr>`).join("")}</table>
      <h4>Librer\xEDas de Arduino</h4>${Dh(n)}
      <h4>Tipos de cable Dupont</h4><table class="tbl">${Mh.map(t=>`<tr><td><b>${oe(t[0])}</b></td><td class="muted small">${oe(t[1])}</td></tr>`).join("")}</table>`,software:()=>`<h4>Preparar el ordenador (una sola vez)</h4><ol class="sw-steps">${zl.map(([t,i])=>`<li><b>${t}</b><div>${i}</div></li>`).join("")}</ol>
      <h4>Librer\xEDas de esta pr\xE1ctica</h4>${Dh(n)}
      <div class="note">Configuraci\xF3n: placa <b>ESP32 Dev Module</b> \xB7 velocidad del Monitor Serie <b>115200 baudios</b> \xB7 paquete esp32 <b>3.x</b>.</div>`,esquema:()=>`<h4>Esquema de conexiones</h4><div class="schem-wrap" title="Clic para ampliar">${tv(n)}</div><p class="muted small">Clic en el esquema para ampliarlo. Cada l\xEDnea es un cable con su color real (el blanco va discontinuo).</p>
      <h4>Tabla de cableado</h4><table class="tbl wires"><tr><th>#</th><th>Cable</th><th>Desde</th><th>Hasta</th><th>Tipo</th></tr>${n.wires.map((t,i)=>`<tr><td class="c">${i+1}</td><td>${Vh(t.color)}${Wl[t.color]}</td><td>${oe(Rh(n,t.from))}</td><td>${oe(Rh(n,t.to))}</td><td class="small">${oe(Bh(n,t))}</td></tr>`).join("")}</table>`,codigo:()=>`<div class="code-bar"><span>${oe(n.file.split("/")[1])}</span><span class="grow"></span><button class="btn" id="copyCode">Copiar</button><a class="btn" href="codigo/${n.file}" download>Descargar .ino</a></div>
      <pre class="code"><code>${ev(n.code)}</code></pre>
      <p class="muted small">C\xF3digo verificado: compila sin errores con arduino-cli, paquete esp32 3.3 y placa \xABESP32 Dev Module\xBB.</p>`,prueba:()=>`<h4>Funcionamiento esperado</h4><ul>${n.expected.map(t=>`<li>${oe(t)}</li>`).join("")}</ul>
      <h4>Ejemplo</h4><p>${n.example}</p>
      <h4>Monitor Serie (115200 baudios)</h4><pre class="serial">${oe(n.serial)}</pre>
      <h4>Comprobaci\xF3n con el pol\xEDmetro</h4><table class="tbl"><tr><th>Medida</th><th>C\xF3mo</th><th>Valor esperado</th></tr>${n.multimeter.map(t=>`<tr><td><b>${oe(t[0])}</b></td><td class="small">${oe(t[1])}</td><td class="small">${oe(t[2])}</td></tr>`).join("")}</table>
      <h4>Aver\xEDas frecuentes</h4><table class="tbl"><tr><th>S\xEDntoma</th><th>Causa probable</th><th>Soluci\xF3n</th></tr>${n.trouble.map(t=>`<tr><td><b>${oe(t[0])}</b></td><td class="small">${oe(t[1])}</td><td class="small">${oe(t[2])}</td></tr>`).join("")}</table>
      ${n.maintenance?`<h4>Pr\xE1ctica de mantenimiento: sustituir un sensor averiado</h4><p>${oe(n.maintenance.intro)}</p><ol class="sw-steps">${n.maintenance.steps.map(([t,i])=>`<li><b>${oe(t)}</b><div>${oe(i)}</div></li>`).join("")}</ol>`:""}`,reto:()=>`<h4>Reto de ampliaci\xF3n</h4><ol>${n.challenge.map(t=>`<li>${oe(t)}</li>`).join("")}</ol>
      <h4>Informe de la pr\xE1ctica</h4><ol class="small"><li>Nombre, fecha y n\xFAmero de kit.</li><li>Objetivo de la pr\xE1ctica con tus palabras.</li><li>Lista de material y herramientas usadas.</li><li>Esquema de conexiones (dib\xFAjalo o pega una captura) con los colores de los cables.</li><li>Tabla de mediciones con el pol\xEDmetro (valor esperado / valor medido).</li><li>Problemas encontrados y c\xF3mo los resolviste.</li><li>Resultado del reto y conclusiones.</li><li>Desmontaje: material guardado y revisado, residuos depositados donde corresponde.</li></ol>`}}var kn=_a.find(n=>n.id==="eee");function rv(){return`<div class="cov-band"><img src="img/logo_salesianos_algeciras_blanco.png" alt="Salesianos Algeciras"></div>
  <div class="cov-body">
    <div class="cov-centro">${oe(Pi.nombre)}</div>
    <div class="cov-ciclo">${oe(Pi.ciclo)}</div>
    <div class="cov-sep"></div>
    <h1 class="cov-asig">${oe(kn.nombre)}</h1>
    <div class="cov-mod">M\xF3dulo profesional ${oe(kn.codigo)}</div>
    <div class="cov-prof">Profesor: <b>${oe(kn.profesor)}</b></div>
    <a class="btn-enter" href="#asignaturas">Entrar <span>\u2192</span></a>
  </div>
  <div class="cov-foot">Laboratorio ESP32 \xB7 funciona sin conexi\xF3n</div>`}function av(){return`<header class="scr-top"><a href="#inicio" class="brand"><img src="img/logo_salesianos_horizontal.png" alt="Salesianos"></a><div class="scr-ttl">${oe(Pi.nombre)} \xB7 ${oe(Pi.ciclo)}</div></header>
  <div class="crumbs static"><div><a href="#inicio">Inicio</a> \u203A <span>Asignaturas</span></div></div>
  <div class="subj-wrap"><h2>Asignaturas</h2><p class="muted">Elige una asignatura para entrar en sus contenidos.</p>
  <div class="subj-grid">${_a.map(n=>n.active?`<a class="subj" href="#${n.id}"><div class="subj-ic">${n.icon}</div><div class="subj-cod">M\xF3dulo ${oe(n.codigo)}</div><h3>${oe(n.nombre)}</h3><div class="subj-prof">Profesor: <b>${oe(n.profesor)}</b></div><p>${oe(n.desc)}</p><span class="subj-go">Entrar \u2192</span></a>`:`<div class="subj off"><div class="subj-ic">${n.icon||"\u{1F4D8}"}</div><h3>${oe(n.nombre)}</h3><p>Pr\xF3ximamente</p></div>`).join("")}
    <div class="subj off soon"><div class="subj-ic">\uFF0B</div><h3>Pr\xF3ximamente</h3><p>M\xE1s asignaturas en preparaci\xF3n.</p></div>
  </div></div>`}function ov(){let n=tt.lesson;at("#crumbs").innerHTML='<a href="#inicio">Inicio</a> \u203A <a href="#asignaturas">Asignaturas</a> \u203A '+(n?`<a href="#eee">${oe(kn.nombre)}</a> \u203A <span>Proyecto ${n.n}: ${oe(n.title)}</span>`:`<span>${oe(kn.nombre)}</span>`)}function Xl(n){document.body.classList.toggle("scr-cover",n==="cover"),document.body.classList.toggle("scr-subjects",n==="subjects"),n==="cover"&&!at("#cover").innerHTML&&(at("#cover").innerHTML=rv()),n==="subjects"&&!at("#subjects").innerHTML&&(at("#subjects").innerHTML=av()),n||window.dispatchEvent(new Event("resize")),window.scrollTo(0,0)}var lv=[["pasos","Paso a paso"],["ficha","Ficha"],["material","Material"],["software","Preparar PC"],["esquema","Esquema"],["codigo","C\xF3digo"],["prueba","Prueba"],["reto","Reto"]];function cv(){return`<h3>Laboratorio ESP32 \xB7 Paso a paso en 3D</h3>
  <p class="lead">8 proyectos de dificultad creciente con la placa <b>ACEBOTT ESP32 Plus</b> y el kit de sensores y actuadores. Elige un proyecto abajo y sigue los pasos: el modelo 3D muestra en cada paso qu\xE9 pieza coger y d\xF3nde va cada cable.</p>
  <div class="cards">${Vt.map(n=>`<a class="card" href="#p${n.n}"><span class="num">${n.n}</span><div><b>${oe(n.title)}</b><div class="muted small">${oe(n.level)} \xB7 ${oe(n.duration)}</div><div class="small">${oe(n.short)}</div></div></a>`).join("")}</div>
  <h4>Conoce la placa ESP32 Plus</h4><table class="tbl">${Sh.map(([n,e])=>`<tr><td><b>${n}</b></td><td class="small">${e}</td></tr>`).join("")}</table>
  <img class="pinout" src="img/esp32plus_pinout.jpg" alt="Pinout ESP32 Plus">
  <h4>C\xF3mo usar esta web</h4><ul><li>Arrastra el modelo para girarlo; rueda del rat\xF3n para acercar; clic derecho (o dos dedos) para desplazar.</li><li>Botones \u25C0 \u25B6 (o flechas del teclado) para cambiar de paso. Lo nuevo de cada paso aparece resaltado en naranja.</li><li>Cada paso tiene: <b>Coge</b> (qu\xE9 material), <b>Haz</b> (d\xF3nde va cada cable, con su color) y <b>Comprueba</b> (antes de seguir).</li><li>La web funciona sin Internet: se puede abrir desde una carpeta o un USB.</li></ul>
  <h4>Preparar el ordenador</h4><ol class="sw-steps">${zl.map(([n,e])=>`<li><b>${n}</b><div>${e}</div></li>`).join("")}</ol>
  <h4>Herramientas comunes</h4><table class="tbl">${Hl.map(n=>`<tr><td><b>${oe(n[0])}</b></td><td class="muted small">${oe(n[1])}</td></tr>`).join("")}</table>
  <h4>Normas de seguridad</h4><ul class="safety">${kl.map(n=>`<li>${oe(n)}</li>`).join("")}</ul>
  <p class="muted small">Profesor: <b>${oe(kn.profesor)}</b> \xB7 M\xF3dulo ${si.codigo} \xAB${si.nombre}\xBB \xB7 ${si.titulo} \xB7 ${si.norma}.</p>`}var tt={lesson:null,step:0,tab:"pasos"},ht;function Lh(n,e=0){let t=Vt.find(i=>i.n===n);if(tt.lesson=t,tt.step=Math.min(e,t?t.steps.length-1:0),document.body.classList.toggle("home",!t),document.querySelectorAll(".lesson-strip .ls").forEach(i=>i.classList.toggle("on",+i.dataset.n===n)),ov(),!t){ht.loadLesson({parts:{},wires:[],steps:[{t:"",allLabels:!0}],switch:"3V3",view:[.15,1,.75],margin:1.25}),ht.showStep(0,!0),dv(),at("#panel").innerHTML=cv(),at("#tabs").innerHTML="",at("#vtitle").innerHTML="<b>ESP32 Plus</b> \xB7 vista general",at("#stepbar").style.display="none";return}at("#stepbar").style.display="",ht.loadLesson(t),at("#tabs").innerHTML=lv.map(([i,s])=>`<button data-tab="${i}" class="${i===tt.tab?"on":""}">${s}</button>`).join(""),at("#vtitle").innerHTML=`<span class="pill">${t.n}</span><b>${oe(t.title)}</b> \xB7 ${oe(t.level)}`,Ci(tt.step,!0)}function dv(){let n=ht.board.userData.pins,e=(t,i)=>{let s=document.createElement("div");s.className="lbl part",s.innerHTML=t,ht.labelLayer.appendChild(s),ht.labels.push({el:s,pos:i.clone().setY(i.y+4)})};e("Conectores <b>G-V-S</b> (GPIO 18\u202612)",n["D5.S"].pos),e("Conectores <b>G-V-S</b> (GPIO 14\u202626)",n["D17.S"].pos),e("Bloque <b>I2C</b>",n["I2.SDA"].pos),e("Bloque <b>ANALOG</b> 34\xB735\xB74\xB72",n["A35.V"].pos),e("Interruptor <b>3.3V / 5V</b>",ht.board.userData.switchPos),e("<b>USB-B</b>",n.USB.pos),e("<b>Jack DC</b> 7\u201312 V",n.DC.pos),e("Conector <b>POWER</b>",n["P.GND"].pos),e("<b>ESP32</b> (Wi-Fi + Bluetooth)",ht.board.position.clone().set(14,6,2))}function Ci(n,e=!1){let t=tt.lesson;t&&(tt.step=Math.max(0,Math.min(n,t.steps.length-1)),ht.showStep(tt.step,e),at("#stepcount").textContent=`Paso ${tt.step+1} / ${t.steps.length}`,at("#steptitle").textContent=t.steps[tt.step].t,at("#dots").innerHTML=t.steps.map((i,s)=>`<button class="${s===tt.step?"on":s<tt.step?"done":""}" data-step="${s}" title="${oe(i.t)}"></button>`).join(""),at("#prev").disabled=tt.step===0,at("#next").disabled=tt.step===t.steps.length-1,zh(),Oh||history.replaceState(null,"",`#p${t.n}-${tt.step+1}`))}function zh(){let n=tt.lesson;n&&(document.querySelectorAll("#tabs button").forEach(e=>e.classList.toggle("on",e.dataset.tab===tt.tab)),at("#panel").innerHTML=sv(n)[tt.tab](),at("#panel").scrollTop=0)}function hv(){document.body.innerHTML=`
  <div id="cover" class="screen"></div>
  <div id="subjects" class="screen"></div>
  <header class="top"><a href="#inicio" class="brand"><img src="img/logo_salesianos_horizontal.png" alt="Salesianos"></a>
    <div class="ttl"><div class="t1">Laboratorio <span>ESP32</span></div><div class="t2">${oe(kn.nombre)} \xB7 ${oe(Pi.ciclo)}</div></div>
    <nav><a href="#inicio" class="navb">Inicio</a><a href="#asignaturas" class="navb">Asignaturas</a><a href="#p1" class="navb">Empezar</a></nav></header>
  <div class="crumbs"><div id="crumbs"></div><div class="prof">Profesor: <b>${oe(kn.profesor)}</b></div></div>
  <main>
    <section class="viewer"><div id="gl"></div><div id="labels"></div>
      <div id="vtitle" class="vtitle"></div>
      <div class="vtools"><button id="vreset" title="Vista inicial">\u27F2</button><button id="vtop" title="Vista desde arriba">\u22A4</button><button id="vlabels" title="Mostrar/ocultar etiquetas">\u{1F3F7}</button><button id="vfull" title="Pantalla completa">\u26F6</button></div>
      <div id="stepbar" class="stepbar"><button id="prev" class="btn">\u25C0 Anterior</button><div class="mid"><div id="stepcount"></div><div id="steptitle"></div><div id="dots" class="dots"></div></div><button id="next" class="btn primary">Siguiente \u25B6</button></div>
      <div class="hint">Arrastra para girar \xB7 rueda para zoom \xB7 clic derecho para mover</div>
    </section>
    <aside class="side"><div id="tabs" class="tabs"></div><div id="panel" class="panel"></div></aside>
  </main>
  <footer class="lesson-strip">${Vt.map(n=>`<a class="ls" data-n="${n.n}" href="#p${n.n}"><span class="num">${n.n}</span><span class="ic">${n.icon}</span><span class="nm">${oe(n.title)}</span></a>`).join("")}</footer>`}function uv(){at("#prev").onclick=()=>Ci(tt.step-1),at("#next").onclick=()=>Ci(tt.step+1),at("#vreset").onclick=()=>ht.resetView(),at("#vtop").onclick=()=>ht.topView(),at("#vlabels").onclick=()=>{ht.showLabels=!ht.showLabels},at("#vfull").onclick=()=>{let n=at(".viewer");document.fullscreenElement?document.exitFullscreen():n.requestFullscreen&&n.requestFullscreen()},document.addEventListener("click",n=>{var s;let e=n.target.closest("[data-tab]");e&&(tt.tab=e.dataset.tab,zh());let t=n.target.closest("[data-step]");t&&Ci(+t.dataset.step);let i=n.target.closest(".schem-wrap");if(i){let r=document.createElement("div");r.className="overlay",r.innerHTML=i.innerHTML+'<div class="ov-close">\u2715 Cerrar</div>',r.onclick=()=>r.remove(),document.body.appendChild(r)}n.target.id==="copyCode"&&((s=navigator.clipboard)==null||s.writeText(tt.lesson.code).then(()=>{n.target.textContent="\xA1Copiado!",setTimeout(()=>n.target.textContent="Copiar",1500)}).catch(()=>{}))}),document.addEventListener("keydown",n=>{n.target.closest("input,textarea")||(n.key==="ArrowRight"&&Ci(tt.step+1),n.key==="ArrowLeft"&&Ci(tt.step-1))}),window.addEventListener("hashchange",Hh)}function Hh(){let n=location.hash;if(n===""||n==="#"||n==="#inicio")return Xl("cover");if(n==="#asignaturas")return Xl("subjects");Xl(null);let e=n.match(/^#p(\d)(?:-(\d+))?/);if(e){let t=+e[1],i=e[2]?+e[2]-1:0;ql=!0,!tt.lesson||tt.lesson.n!==t?Lh(t,i):i!==tt.step&&Ci(i)}else(tt.lesson||!ql)&&(ql=!0,Lh(0),history.replaceState(null,"","#eee"))}var ql=!1;function fv(){document.body.className="render",document.body.innerHTML='<div class="viewer render"><div id="gl"></div><div id="labels"></div></div>',ht=new Xs(at("#gl"),at("#labels"),{render:!0,background:Nh.get("bg")||"#ffffff",fitAspect:16/9,padTop:.13,padBottom:.04,padX:.05}),window.renderShot=(n,e)=>{let t=Vt.find(r=>r.n===n);ht.loadLesson(t);let i=e==="final"?t.steps.length-1:e-1;ht.showStep(i,!0);let s=ht.homeH;return ht.fitAll(!0,s*.5),e==="final"&&(ht.labels.forEach(r=>r.el.remove()),ht.labels=[],ht.halos.forEach(r=>ht.root.remove(r)),ht.halos=[],ht.buildLabels({allLabels:!0},new Set(Object.keys(t.parts)),new Set)),ht.layoutLabels(),t.steps.length},window.lessonInfo=Vt.map(n=>({n:n.n,slug:n.slug,steps:n.steps.length,titles:n.steps.map(e=>e.t)})),window.__viewer=ht,window.renderReady=!0}Oh?fv():(hv(),ht=new Xs(at("#gl"),at("#labels"),{padTop:.1,padBottom:.2,padX:.04}),uv(),Hh(),window.__app={state:tt,viewer:ht,LESSONS:Vt})});pv();})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
