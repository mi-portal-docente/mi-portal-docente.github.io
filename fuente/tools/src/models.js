import * as THREE from 'three';

// Unidades: milímetros. Placa centrada en el origen, cara superior en y=1.6
export const BW = 68.6, BD = 53.3, BT = 1.6;
const bx = x => x - BW / 2, bz = z => z - BD / 2;
const P = 2.54;

const matCache = {};
export function mat(color, opts = {}) {
  const k = color + JSON.stringify(opts);
  if (!matCache[k]) matCache[k] = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05, ...opts });
  return matCache[k];
}
const METAL = () => mat(0xc9ccd1, { metalness: 0.85, roughness: 0.3 });
const GOLD = () => mat(0xd8b45a, { metalness: 0.9, roughness: 0.3 });

export function box(w, h, d, material, x = 0, y = 0, z = 0, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}
export function cyl(r, h, material, x = 0, y = 0, z = 0, parent, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), material);
  m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}

// Textura de texto en canvas
export function textTexture(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
// Plano con textura apoyado (mirando hacia arriba)
export function decal(w, d, tex, x, y, z, parent, transparent = true) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: tex, transparent, roughness: 0.7 }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}
function silk(parent, w, d, y, items, opts = {}) {
  // items: [text, xmm, zmm, size, rot, color, align]
  const s = 12;
  const tex = textTexture(w * s, d * s, (g) => {
    g.clearRect(0, 0, w * s, d * s);
    for (const it of items) {
      const [t, x, z, size = 2, rot = 0, color = '#ffffff', align = 'center', weight = '700'] = it;
      g.save(); g.translate((x + w / 2) * s, (z + d / 2) * s); g.rotate(rot * Math.PI / 180);
      g.fillStyle = color; g.font = `${weight} ${size * s}px Arial, Helvetica, sans-serif`;
      g.textAlign = align; g.textBaseline = 'middle'; g.fillText(t, 0, 0); g.restore();
    }
    if (opts.draw) opts.draw(g, s);
  });
  return decal(w, d, tex, 0, y + 0.02, 0, parent);
}

// --------------------------------------------------------------------
// PLACA ACEBOTT ESP32 PLUS (TA825)
// --------------------------------------------------------------------
export const HEADER_A = ['SCL', 'SDA', '5V', 'GND', '18', '19', '23', '5', '13', '12'];
export const HEADER_B = ['14', '27', '16', '17', '25', '26', 'TX', 'RX'];
export const POWER = ['0', '5V', 'RST', '3V3', '5V', 'GND', 'GND', 'VIN'];
export const ANALOGH = ['2', '4', '35', '34', 'SDA', 'SCL'];
const XA = 18.0, XB = 44.2, XP = 26.5, XAN = 49.5, ZTOP = 2.2, ZBOT = 51.1;
const GVS_ROWS = { S: 7.6, V: 10.14, G: 12.68 };
const I2C_COLS = { G: 26.6, V: 29.14, SDA: 31.68, SCL: 34.22 };
const I2C_ROWS = [19.6, 22.14, 24.68, 27.22];
const AN_COLS = { G: 21.0, V: 23.54, S: 26.08 };
const AN_ROWS = { 34: 33.4, 35: 35.94, 4: 38.48, 2: 41.02 };

export function buildBoard() {
  const g = new THREE.Group(); g.name = 'board';
  const pins = {};  // id -> {pos:Vector3 (punta), type:'male'|'female'}
  // Contorno tipo UNO
  const sh = new THREE.Shape();
  const r = 1.5;
  sh.moveTo(bx(r), bz(0)); sh.lineTo(bx(64.5), bz(0)); sh.lineTo(bx(66.1), bz(1.6)); sh.lineTo(bx(66.1), bz(4.0));
  sh.lineTo(bx(68.6), bz(6.5)); sh.lineTo(bx(68.6), bz(50.0)); sh.lineTo(bx(66.1), bz(52.5)); sh.lineTo(bx(66.1), bz(53.3));
  sh.lineTo(bx(r), bz(53.3)); sh.quadraticCurveTo(bx(0), bz(53.3), bx(0), bz(53.3 - r)); sh.lineTo(bx(0), bz(r));
  sh.quadraticCurveTo(bx(0), bz(0), bx(r), bz(0));
  for (const [hx, hz] of [[15.2, 2.5], [66.0 - 2.5, 7.6 + 1], [66.0 - 2.5, 35.5], [13.97, 50.8]]) {
    const h = new THREE.Path(); h.absarc(bx(hx), bz(hz), 1.6, 0, Math.PI * 2, true); sh.holes.push(h);
  }
  const geo = new THREE.ExtrudeGeometry(sh, { depth: BT, bevelEnabled: false });
  geo.rotateX(Math.PI / 2); geo.translate(0, BT, 0);
  const pcb = new THREE.Mesh(geo, mat(0x15171a, { roughness: 0.45 }));
  pcb.castShadow = true; pcb.receiveShadow = true; g.add(pcb);

  // Serigrafía
  const items = [];
  const L = (t, x, z, s = 1.6, rot = 0, c = '#ffffff', al = 'center') => items.push([t, bx(x), bz(z), s, rot, c, al]);
  HEADER_A.forEach((t, i) => L(t, XA + i * P, 5.2, 1.25, -90));
  HEADER_B.forEach((t, i) => L(t, XB + i * P, 5.2, 1.25, -90));
  POWER.forEach((t, i) => L(t, XP + i * P, 48.0, 1.25, -90));
  ANALOGH.forEach((t, i) => L(t, XAN + i * P, 48.0, 1.25, -90));
  L('POWER', XP + 9, 45.2, 2.0); L('ANALOG', XAN + 3, 45.2, 2.0); L('I2C', XAN + 12, 45.2, 2.0);
  L('S', 16.0, GVS_ROWS.S, 1.6); L('V', 16.0, GVS_ROWS.V, 1.6); L('G', 16.0, GVS_ROWS.G, 1.6);
  L('G', I2C_COLS.G, 17.6, 1.3); L('V', I2C_COLS.V, 17.6, 1.3); L('SDA', I2C_COLS.SDA, 17.6, 1.0); L('SCL', I2C_COLS.SCL, 17.6, 1.0);
  L('I2C', 37.2, 23.4, 1.8, -90);
  L('G', AN_COLS.G, 31.5, 1.3); L('3V3', AN_COLS.V, 31.5, 1.0); L('S', AN_COLS.S, 31.5, 1.3);
  for (const [k, z] of Object.entries(AN_ROWS)) L(k, 28.6, z, 1.3, 0, '#ffffff', 'left');
  L('ANALOG', 32.2, 37.2, 1.8, -90);
  L('5V', 17.0, 23.0, 1.4); L('3.3V', 17.0, 31.2, 1.4);
  L('ACEBOTT', 47.5, 16.2, 2.0, 0, '#ffffff'); L('ESP32 Plus', 48.5, 41.0, 2.4, 0, '#ffffff');
  L('DC 7~12V', 6.0, 50.2, 1.4); L('RESET', 6.0, 8.7, 1.1); L('PWR', 13.5, 26.0, 1.1);
  L('TX', 66.4, 7.6, 1.0); L('RX', 66.4, 10.14, 1.0); L('GND', 66.6, 12.68, 0.9); L('V', 66.4, 15.22, 1.0);
  silk(g, BW, BD, BT, items, {
    draw: (c, s) => { // recuadros del bloque analógico e I2C
      c.strokeStyle = '#ffffff'; c.lineWidth = 0.25 * s;
      c.strokeRect((19.6) * s, (32.0) * s, 7.9 * s, 10.6 * s);
      c.strokeRect((25.2) * s, (18.4) * s, 10.4 * s, 10.2 * s);
    }
  });

  // Cabeceras hembra azules
  const blue = mat(0x1e73d8, { roughness: 0.5 });
  const holeTex = textTexture(64, 64, (c) => { c.fillStyle = '#1e73d8'; c.fillRect(0, 0, 64, 64); c.fillStyle = '#0a0f1a'; c.fillRect(20, 20, 24, 24); });
  const holeMat = new THREE.MeshStandardMaterial({ map: holeTex, roughness: 0.5 });
  function femaleRow(labels, x0, z, prefix) {
    const n = labels.length, w = n * P;
    const hb = new THREE.Mesh(new THREE.BoxGeometry(w, 8.5, P), [blue, blue, holeMat, blue, blue, blue]);
    holeTex.wrapS = holeTex.wrapT = THREE.RepeatWrapping;
    hb.position.set(bx(x0 - P / 2 + w / 2), BT + 4.25, bz(z)); hb.castShadow = true; hb.receiveShadow = true; g.add(hb);
    // textura con repetición: un material por fila
    const tex = holeTex.clone(); tex.repeat.set(n, 1); tex.needsUpdate = true;
    hb.material = [blue, blue, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 }), blue, blue, blue];
    labels.forEach((t, i) => {
      let id = prefix + t; if (pins[id]) id = id + '_2';
      pins[id] = { pos: new THREE.Vector3(bx(x0 + i * P), BT + 8.5, bz(z)), type: 'female', label: t };
    });
  }
  femaleRow(HEADER_A, XA, ZTOP, 'H.');
  femaleRow(HEADER_B, XB, ZTOP, 'H.');
  femaleRow(POWER, XP, ZBOT, 'P.');
  femaleRow(ANALOGH, XAN, ZBOT, 'AH.');

  // Pines macho con base de color
  const baseCol = { S: 0x1e73d8, V: 0xd42a2a, G: 0x222222, SDA: 0x1e73d8, SCL: 0xf2f2f2, '3V3': 0xd42a2a };
  const pinGeo = new THREE.BoxGeometry(0.64, 6, 0.64);
  function malePin(x, z, color, id, label) {
    box(P, 2.5, P, mat(color), bx(x), BT, bz(z), g);
    const pm = new THREE.Mesh(pinGeo, GOLD()); pm.position.set(bx(x), BT + 2.5 + 3 - 1, bz(z)); g.add(pm);
    if (id) pins[id] = { pos: new THREE.Vector3(bx(x), BT + 2.5, bz(z)), type: 'male', label };
  }
  const gvsCols = [...HEADER_A.slice(4).map((t, i) => [t, XA + (i + 4) * P]), ...HEADER_B.slice(0, 6).map((t, i) => [t, XB + i * P])];
  for (const [t, x] of gvsCols) for (const [row, z] of Object.entries(GVS_ROWS)) malePin(x, z, baseCol[row], `D${t}.${row}`, `GPIO ${t} · ${row}`);
  // Serie vertical
  ['TX', 'RX', 'GND', 'V'].forEach((t, i) => malePin(64.0, 7.6 + i * P, 0x1e73d8, 'SER.' + t, t));
  // Bloque I2C (4 filas)
  I2C_ROWS.forEach((z, r) => { for (const [c, x] of Object.entries(I2C_COLS)) malePin(x, z, baseCol[c], `I${r + 1}.${c}`, `I2C fila ${r + 1} · ${c}`); });
  // Bloque analógico
  for (const [k, z] of Object.entries(AN_ROWS)) for (const [c, x] of Object.entries(AN_COLS)) malePin(x, z, c === 'V' ? baseCol['3V3'] : baseCol[c], `A${k}.${c}`, `ANALOG ${k} · ${c === 'V' ? '3V3' : c}`);

  // Módulo ESP32-WROOM
  box(25.5, 0.8, 18, mat(0x111111), bx(52.75), BT, bz(28), g);
  const shield = box(17.5, 2.4, 16, METAL(), bx(49.2), BT + 0.8, bz(28), g);
  const wt = textTexture(420, 384, (c) => { c.fillStyle = '#c9ccd1'; c.fillRect(0, 0, 420, 384); c.fillStyle = '#555'; c.font = 'bold 44px Arial'; c.fillText('ESP32-WROOM-32', 20, 80); c.font = '30px Arial'; c.fillText('Wi-Fi · Bluetooth', 20, 140); c.fillText('CE  FCC ID', 20, 190); c.strokeStyle = '#777'; c.lineWidth = 6; c.strokeRect(300, 250, 90, 90); });
  decal(17.5, 16, wt, bx(49.2), BT + 3.22, bz(28), g, false);
  const ant = textTexture(200, 400, (c) => { c.fillStyle = '#111'; c.fillRect(0, 0, 200, 400); c.strokeStyle = '#c8a24a'; c.lineWidth = 10; c.beginPath(); c.moveTo(30, 40); for (let i = 0; i < 6; i++) { c.lineTo(170, 40 + i * 55); c.lineTo(170, 67 + i * 55); c.lineTo(30, 67 + i * 55); c.lineTo(30, 95 + i * 55); } c.stroke(); });
  decal(7.5, 18, ant, bx(61.75), BT + 0.82, bz(28), g, false);

  // USB-B
  const usb = box(16, 10.8, 12, METAL(), bx(1.7), BT, bz(15.5), g); usb.name = 'usbPort';
  box(0.3, 6.5, 8, mat(0x111111), bx(-6.2), BT + 2.2, bz(15.5), g);
  pins['USB'] = { pos: new THREE.Vector3(bx(-6.3), BT + 5.4, bz(15.5)), type: 'usb' };
  // Jack DC
  box(14, 11, 9, mat(0x1a1a1a, { roughness: 0.8 }), bx(5.2), BT, bz(43), g);
  const jh = cyl(2.6, 0.5, mat(0x050505), 0, 0, 0, g); jh.rotation.z = Math.PI / 2; jh.position.set(bx(-1.85), BT + 6, bz(43));
  pins['DC'] = { pos: new THREE.Vector3(bx(-1.8), BT + 6, bz(43)), type: 'dc' };
  // Botón reset
  box(6, 3.3, 6, METAL(), bx(6), BT, bz(4.6), g); cyl(1.7, 1.2, mat(0x333333), bx(6), BT + 3.3, bz(4.6), g);
  // CH340, regulador, bobina, componentes SMD
  box(5, 1.2, 5, mat(0x0d0d0d), bx(21), BT, bz(15.5), g);
  box(4, 1.2, 3, mat(0x0d0d0d), bx(30), BT, bz(15.2), g);
  box(6.2, 3.2, 6.2, mat(0x6b6f74), bx(12.5), BT, bz(32), g);
  box(6.5, 2.2, 7, mat(0x0d0d0d), bx(16.5), BT, bz(41.5), g);
  box(3, 1.2, 1.6, METAL(), bx(16.5), BT, bz(37.2), g);
  const rnd = (a) => { let s = a; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const rr = rnd(7);
  for (let i = 0; i < 26; i++) {
    const x = 8 + rr() * 30, z = 20 + rr() * 22;
    if (x > 18 && x < 37 && z > 17 && z < 43) continue;
    box(1.6, 0.6, 0.8, mat(rr() > 0.5 ? 0xb88a55 : 0x1c1c1c), bx(x), BT, bz(z), g);
  }
  // LEDs PWR
  box(1.6, 0.7, 0.8, mat(0xff4040, { emissive: 0xff2020, emissiveIntensity: 0.8 }), bx(13.5), BT, bz(24.5), g);
  // Interruptor 3.3V / 5V
  box(4, 3.4, 8.6, METAL(), bx(17), BT, bz(27), g);
  const lever = box(2, 2.4, 2.6, mat(0x222222), bx(17), BT + 3.4, bz(25.6), g); lever.name = 'switchLever';
  g.userData.setSwitch = (v) => { lever.position.z = bz(v === '5V' ? 25.4 : 28.6); };
  g.userData.switchPos = new THREE.Vector3(bx(17), BT + 6, bz(27));
  g.userData.pins = pins;
  return g;
}

// --------------------------------------------------------------------
// COMPONENTES
// Convenio: el componente "mira" con sus pines hacia +z (rot=0).
// Cada pin: {pos (punta, local), dir (vector unitario saliente), type}
// --------------------------------------------------------------------
function pcbBoard(w, d, color, parent, y = 0) {
  return box(w, 1.6, d, mat(color, { roughness: 0.5 }), 0, y, 0, parent);
}
// Fila de pines macho en ángulo recto en el borde +z
function edgePins(g, names, d, y = 3.2, pitch = P, xoff = 0) {
  const pins = {};
  const n = names.length;
  box(n * pitch, 2.5, 2.5, mat(0x1a1a1a), xoff, 0.2, d / 2 - 1.25, g);
  names.forEach((nm, i) => {
    const x = xoff + (i - (n - 1) / 2) * pitch;
    const pm = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.64, 7), GOLD()); pm.position.set(x, 1.45, d / 2 + 2.5); g.add(pm);
    pins[nm] = { pos: new THREE.Vector3(x, 1.45, d / 2 + 1.0), dir: new THREE.Vector3(0, 0, 1), type: 'male' };
  });
  return pins;
}
function pinLabels(g, names, w, d, pitch = P, xoff = 0, color = '#ffffff') {
  const items = names.map((nm, i) => [nm, xoff + (i - (names.length - 1) / 2) * pitch, d / 2 - 4.2, nm.length > 2 ? 1.05 : 1.5, -90, color]);
  silk(g, w, d, 1.6, items);
}
function moduleTitle(g, w, d, text, z, size = 2, color = '#ffffff') { silk(g, w, d, 1.62, [[text, 0, z, size, 0, color]]); }

const MODULE_BLUE = 0x1f4f9c;

export const COMPONENTS = {
  led(opts) {
    const g = new THREE.Group(); const w = 20, d = 24;
    pcbBoard(w, d, MODULE_BLUE, g);
    const col = { rojo: 0xff2b2b, verde: 0x22d36b, azul: 0x2b7bff }[opts.color] || 0xff2b2b;
    const ledMat = new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.85, roughness: 0.15, emissive: col, emissiveIntensity: 0.0 });
    cyl(2.6, 5, ledMat, 0, 1.6, -3, g);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), ledMat); dome.position.set(0, 6.6, -3); g.add(dome);
    cyl(3.0, 1, ledMat, 0, 1.6, -3, g);
    g.userData.glow = ledMat;
    const names = ['G', 'V', 'S'];
    pinLabels(g, names, w, d); moduleTitle(g, w, d, 'LED ' + opts.color.toUpperCase(), -9.5, 2);
    return { group: g, pins: edgePins(g, names, d) };
  },
  rgb() {
    const g = new THREE.Group(); const w = 22, d = 24;
    pcbBoard(w, d, MODULE_BLUE, g);
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, roughness: 0.2, emissive: 0xffffff, emissiveIntensity: 0 });
    cyl(2.6, 5, m, 0, 1.6, -3, g);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), m); dome.position.set(0, 6.6, -3); g.add(dome);
    g.userData.glow = m;
    const names = ['R', 'G', 'B', '-'];
    pinLabels(g, names, w, d); moduleTitle(g, w, d, 'LED RGB', -9.5, 2);
    return { group: g, pins: edgePins(g, names, d) };
  },
  button(opts) {
    const g = new THREE.Group(); const w = 22, d = 26;
    pcbBoard(w, d, MODULE_BLUE, g);
    box(12, 3.5, 12, mat(0x222222), 0, 1.6, -3, g);
    cyl(5, 4, mat(opts.cap || 0xf2c200), 0, 5.1, -3, g);
    const names = ['G', 'V', 'S'];
    pinLabels(g, names, w, d); moduleTitle(g, w, d, 'PULSADOR', -11, 2);
    return { group: g, pins: edgePins(g, names, d) };
  },
  buzzer() {
    const g = new THREE.Group(); const w = 20, d = 26;
    pcbBoard(w, d, MODULE_BLUE, g);
    cyl(6, 8, mat(0x161616), 0, 1.6, -3.5, g); cyl(1, 0.2, mat(0x444444), 0, 9.6, -3.5, g);
    const names = ['G', 'V', 'S'];
    pinLabels(g, names, w, d); moduleTitle(g, w, d, 'ZUMBADOR PASIVO', -11.3, 1.6);
    return { group: g, pins: edgePins(g, names, d) };
  },
  ldr() {
    const g = new THREE.Group(); const w = 20, d = 24;
    pcbBoard(w, d, MODULE_BLUE, g);
    const t = textTexture(128, 128, (c) => { c.fillStyle = '#e8d6a8'; c.beginPath(); c.arc(64, 64, 62, 0, 7); c.fill(); c.strokeStyle = '#b5521f'; c.lineWidth = 9; c.beginPath(); c.moveTo(20, 34); for (let i = 0; i < 5; i++) { c.lineTo(108, 34 + i * 15); c.lineTo(108, 41 + i * 15); c.lineTo(20, 41 + i * 15); c.lineTo(20, 49 + i * 15); } c.stroke(); });
    cyl(2.6, 2, mat(0xe8d6a8), 0, 1.6, -4, g); decal(5.2, 5.2, t, 0, 3.62, -4, g);
    const names = ['G', 'V', 'S'];
    pinLabels(g, names, w, d); moduleTitle(g, w, d, 'SENSOR DE LUZ', -9.8, 1.7);
    return { group: g, pins: edgePins(g, names, d) };
  },
  lm35() {
    const g = new THREE.Group(); const w = 20, d = 24;
    pcbBoard(w, d, MODULE_BLUE, g);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 5, 24, 1, false, 0, Math.PI), mat(0x111111));
    body.position.set(0, 1.6 + 2.5, -3); body.castShadow = true; g.add(body); box(4.8, 5, 0.3, mat(0x111111), 0, 1.6, -3, g);
    const names = ['G', 'V', 'S'];
    pinLabels(g, names, w, d); moduleTitle(g, w, d, 'LM35', -9.5, 2.2);
    return { group: g, pins: edgePins(g, names, d) };
  },
  ir() {
    const g = new THREE.Group(); const w = 14, d = 34;
    pcbBoard(w, d, MODULE_BLUE, g);
    const e = cyl(1.5, 5, new THREE.MeshStandardMaterial({ color: 0xdfe8ff, transparent: true, opacity: 0.8 }), 0, 0, 0, g); e.rotation.x = Math.PI / 2; e.position.set(-3, 4, -d / 2 - 1);
    const r = cyl(1.5, 5, mat(0x111111), 0, 0, 0, g); r.rotation.x = Math.PI / 2; r.position.set(3, 4, -d / 2 - 1);
    box(6, 4.5, 6, mat(0x1d5fd0), 0, 1.6, -2, g); cyl(1.2, 1, mat(0xf0f0f0), 0, 6.1, -2, g);
    box(5, 1.2, 4, mat(0x0d0d0d), 0, 1.6, 6, g);
    const names = ['OUT', 'GND', 'VCC'];
    pinLabels(g, names, w, d); moduleTitle(g, w, d, 'SENSOR IR', -10.5, 1.6);
    return { group: g, pins: edgePins(g, names, d) };
  },
  soil() {
    const g = new THREE.Group(); const w = 20, d = 60;
    const sh = new THREE.Shape(); sh.moveTo(-10, 30); sh.lineTo(10, 30); sh.lineTo(10, -14); sh.lineTo(8, -30); sh.lineTo(3, -30); sh.lineTo(3, -12); sh.lineTo(-3, -12); sh.lineTo(-3, -30); sh.lineTo(-8, -30); sh.lineTo(-10, -14); sh.lineTo(-10, 30);
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 1.6, bevelEnabled: false }); geo.rotateX(Math.PI / 2); geo.translate(0, 1.6, 0); geo.scale(1, 1, -1);
    const m = new THREE.Mesh(geo, mat(MODULE_BLUE)); m.castShadow = true; g.add(m);
    // pistas doradas
    box(1.6, 0.1, 18, GOLD(), -6.5, 1.6, -20, g); box(1.6, 0.1, 18, GOLD(), 6.5, 1.6, -20, g);
    const names = ['G', 'V', 'S'];
    pinLabels(g, names, w, d); moduleTitle(g, w, d, 'HUMEDAD', 14, 1.8);
    return { group: g, pins: edgePins(g, names, d) };
  },
  relay() {
    const g = new THREE.Group(); const w = 28, d = 42;
    pcbBoard(w, d, MODULE_BLUE, g);
    box(15.5, 15, 19, mat(0x2f6fe0, { roughness: 0.35 }), 0, 1.6, -2, g);
    silk(g, w, d, 16.6, [['SRD-05VDC', 0, -4, 1.6], ['10A 250VAC', 0, 0, 1.4]]);
    // bornes NO COM NC en el borde -z
    const term = {};
    ['NC', 'COM', 'NO'].forEach((nm, i) => {
      const x = (i - 1) * 5;
      box(5, 10, 7.5, mat(0x1aa0e0), x, 1.6, -d / 2 + 3.8, g);
      cyl(1.3, 0.6, METAL(), x, 11.6, -d / 2 + 3.8, g);
      term[nm] = { pos: new THREE.Vector3(x, 5.5, -d / 2), dir: new THREE.Vector3(0, 0, -1), type: 'terminal' };
    });
    box(1.6, 0.8, 1.2, mat(0xff3030, { emissive: 0x000000 }), 9, 1.6, 10, g);
    const names = ['G', 'V', 'S'];
    pinLabels(g, names, w, d);
    silk(g, w, d, 1.62, [['NC', -5, -d / 2 + 9.2, 1.4], ['COM', 0, -d / 2 + 9.2, 1.2], ['NO', 5, -d / 2 + 9.2, 1.4], ['RELÉ', -9, 12, 1.8]]);
    return { group: g, pins: { ...edgePins(g, names, d), ...term } };
  },
  servo() {
    const g = new THREE.Group();
    box(12.4, 22.5, 23, mat(0x1d5fd0, { roughness: 0.4 }), 0, 0, 0, g);
    box(12.4, 2.5, 32.5, mat(0x1d5fd0, { roughness: 0.4 }), 0, 15.5, 0, g);
    cyl(5.8, 4, mat(0x1d5fd0), 0, 22.5, -5.8, g); cyl(2.2, 4, mat(0xffffff), 0, 26.5, -5.8, g);
    const arm = new THREE.Group(); arm.position.set(0, 29, -5.8); g.add(arm);
    box(20, 1.6, 6, mat(0xffffff), -7, 0, 0, arm);
    // brazo de barrera (rayas rojas y blancas) hacia -x
    for (let i = 0; i < 6; i++) box(10, 3, 3, mat(i % 2 ? 0xffffff : 0xdc001b), -20 - i * 10, 1.6, 0, arm);
    g.userData.arm = arm;
    const label = textTexture(256, 128, (c) => { c.fillStyle = '#1d5fd0'; c.fillRect(0, 0, 256, 128); c.fillStyle = '#fff'; c.font = 'bold 44px Arial'; c.fillText('SERVO 180°', 10, 60); c.font = '30px Arial'; c.fillText('0° - 180°', 10, 105); });
    const lm = new THREE.Mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshStandardMaterial({ map: label })); lm.rotation.y = Math.PI / 2; lm.position.set(6.25, 9, 0); g.add(lm);
    // salida del cable por el lado +z
    const pins = {};
    ['marron', 'rojo', 'naranja'].forEach((nm, i) => { pins[nm] = { pos: new THREE.Vector3((i - 1) * 1.2, 3, 11.6), dir: new THREE.Vector3(0, 0, 1), type: 'lead' }; });
    return { group: g, pins };
  },
  lcd(opts) {
    const g = new THREE.Group(); const w = 80, d = 36;
    pcbBoard(w, d, 0x1f8a3a, g);
    box(71, 7, 24, mat(0x111111), 0, 1.6, 0, g);
    const scr = textTexture(1024, 224, (c) => {
      c.fillStyle = '#2a56e8'; c.fillRect(0, 0, 1024, 224);
      c.fillStyle = 'rgba(255,255,255,0.08)';
      for (let r = 0; r < 2; r++) for (let i = 0; i < 16; i++) c.fillRect(24 + i * 62, 24 + r * 98, 54, 82);
      c.fillStyle = '#f2f6ff'; c.font = 'bold 76px "Courier New", monospace';
      (opts.lines || ['', '']).forEach((t, r) => { for (let i = 0; i < 16 && i < t.length; i++) c.fillText(t[i], 30 + i * 62, 92 + r * 98); });
    });
    const sm = new THREE.Mesh(new THREE.PlaneGeometry(64, 14), new THREE.MeshStandardMaterial({ map: scr, emissive: 0xffffff, emissiveMap: scr, emissiveIntensity: 0.35 }));
    sm.rotation.x = -Math.PI / 2; sm.position.set(0, 8.62, 0); g.add(sm);
    for (const [x, z] of [[-37, -15], [37, -15], [-37, 15], [37, 15]]) cyl(1.5, 0.2, mat(0xcccccc), x, 1.6, z, g);
    silk(g, w, d, 1.62, [['LCD1602 I2C  (0x27)', 0, -15.5, 2]]);
    // adaptador I2C (PCF8574) por detrás; sus 4 pines salen por el lado corto izquierdo (-x)
    box(6, 2, 20, mat(0x111111), -w / 2 + 3, 1.6, 0, g);
    const names = ['GND', 'VCC', 'SDA', 'SCL'];
    const pins = {};
    box(2.5, 2.5, 4 * P, mat(0x1a1a1a), -w / 2 - 1.25, 0.2, 0, g);
    names.forEach((nm, i) => {
      const z = (i - 1.5) * P;
      const pm = new THREE.Mesh(new THREE.BoxGeometry(7, 0.64, 0.64), GOLD()); pm.position.set(-w / 2 - 4.5, 1.45, z); g.add(pm);
      pins[nm] = { pos: new THREE.Vector3(-w / 2 - 3.0, 1.45, z), dir: new THREE.Vector3(-1, 0, 0), type: 'male' };
    });
    silk(g, w, d, 1.62, names.map((nm, i) => [nm, -w / 2 + 9.5, (i - 1.5) * P, 1.4, 0, '#ffffff', 'left']));
    return { group: g, pins };
  },
  oled(opts) {
    const g = new THREE.Group(); const w = 35.5, d = 33.6;
    pcbBoard(w, d, 0x1a3f8f, g);
    box(33, 1.6, 22, mat(0x0a0a0a, { roughness: 0.2 }), 0, 1.6, -1.5, g);
    const scr = textTexture(512, 256, (c) => {
      c.fillStyle = '#000'; c.fillRect(0, 0, 512, 256); c.fillStyle = '#e8f4ff';
      const D = {
        parking: (c) => { c.font = 'bold 28px monospace'; c.fillText('APARCAMIENTO', 8, 30); c.font = 'bold 96px monospace'; c.fillText('14', 8, 140); c.font = 'bold 30px monospace'; c.fillText('cm', 140, 140); c.fillText('MUY CERCA', 8, 190); c.strokeStyle = '#e8f4ff'; c.lineWidth = 4; c.strokeRect(6, 216, 496, 30); c.fillRect(6, 216, 70, 30); },
        fan: (c) => { c.font = 'bold 30px monospace'; c.fillText('MODO: AUTO', 8, 34); c.fillText('Temp: 27.0 C', 8, 84); c.fillText('Pres: 1014 hPa', 8, 130); c.fillText('Velocidad: 70 %', 8, 180); c.strokeStyle = '#e8f4ff'; c.lineWidth = 4; c.strokeRect(6, 210, 496, 36); c.fillRect(256, 218, 172, 20); c.fillRect(254, 202, 4, 48); },
      };
      (D[opts.draw] || ((c) => { c.font = 'bold 40px monospace'; c.fillText('OLED', 20, 60); }))(c);
    });
    const sm = new THREE.Mesh(new THREE.PlaneGeometry(29, 14.5), new THREE.MeshStandardMaterial({ map: scr, emissive: 0xffffff, emissiveMap: scr, emissiveIntensity: 0.6 }));
    sm.rotation.x = -Math.PI / 2; sm.rotation.z = Math.PI; sm.position.set(0, 3.22, -2); g.add(sm);
    const names = ['GND', 'VCC', 'SCL', 'SDA'];
    pinLabels(g, names, w, d); silk(g, w, d, 1.62, [['OLED 1.3"', 0, -15.3, 1.6]]);
    return { group: g, pins: edgePins(g, names, d) };
  },
  hcsr04() {
    // De pie sobre un soporte, transductores hacia -z, pines hacia abajo-atrás (+z)
    const g = new THREE.Group();
    box(30, 12, 12, mat(0x9aa3ad), 0, 0, 2, g); // soporte
    const m = new THREE.Group(); m.position.set(0, 12, 0); g.add(m);
    box(45, 20, 1.6, mat(MODULE_BLUE), 0, 0, 0, m);
    for (const x of [-13, 13]) {
      const c = cyl(8, 12, METAL(), 0, 0, 0, m); c.rotation.x = Math.PI / 2; c.position.set(x, 11, -6.8);
      const mesh = cyl(6.5, 0.4, mat(0x333333), 0, 0, 0, m); mesh.rotation.x = Math.PI / 2; mesh.position.set(x, 11, -12.9);
    }
    box(5, 4, 2, mat(0xd8d8d8), 0, 15, -1.5, m);
    const names = ['VCC', 'Trig', 'Echo', 'GND'];
    const pins = {};
    box(4 * P, 2.5, 2.5, mat(0x1a1a1a), 0, 2, 2.05, m);
    names.forEach((nm, i) => {
      const x = (i - 1.5) * P;
      const pm = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.64, 7), GOLD()); pm.position.set(x, 3.25, 5.5); m.add(pm);
      pins[nm] = { pos: new THREE.Vector3(x, 15.25, 4.0), dir: new THREE.Vector3(0, 0, 1), type: 'male' };
    });
    const lab = textTexture(512, 128, (c) => { c.fillStyle = '#1f4f9c'; c.fillRect(0, 0, 512, 128); c.fillStyle = '#fff'; c.font = 'bold 30px Arial'; c.textAlign = 'center'; names.forEach((n, i) => c.fillText(n, 256 + (i - 1.5) * 29 * 1, 112)); c.font = 'bold 34px Arial'; c.fillText('HC-SR04', 256, 50); });
    const lm = new THREE.Mesh(new THREE.PlaneGeometry(45, 11.25), new THREE.MeshStandardMaterial({ map: lab })); lm.position.set(0, 12 + 5.6, 0.82); g.add(lm);
    return { group: g, pins };
  },
  joystick() {
    const g = new THREE.Group(); const w = 26, d = 34;
    pcbBoard(w, d, 0x111111, g);
    box(16, 9, 16, mat(0x2b2b2b), 0, 1.6, -4, g);
    const stick = cyl(1.6, 9, mat(0x777777), 0, 10.6, -4, g);
    cyl(6.5, 6, mat(0x111111), 0, 18, -4, g);
    const names = ['GND', '+5V', 'VRx', 'VRy', 'SW'];
    pinLabels(g, names, w, d); silk(g, w, d, 1.62, [['JOYSTICK', 0, 7, 1.8], ['↑ Y', -9.5, -13, 1.8]]);
    return { group: g, pins: edgePins(g, names, d) };
  },
  bmp280() {
    const g = new THREE.Group(); const w = 14, d = 16;
    pcbBoard(w, d, 0x6b2fa8, g);
    box(2.5, 0.9, 2, METAL(), 0, 1.6, -3, g);
    const names = ['VCC', 'GND', 'SCL', 'SDA'];
    pinLabels(g, names, w, d); silk(g, w, d, 1.62, [['BMP280', 0, -6.3, 1.5]]);
    return { group: g, pins: edgePins(g, names, d) };
  },
  l298n() {
    const g = new THREE.Group(); const w = 43, d = 43;
    pcbBoard(w, d, 0xc8202a, g);
    // disipador
    const hs = new THREE.Group(); hs.position.set(0, 1.6, -8); g.add(hs);
    box(23, 3, 16, mat(0x111111, { metalness: 0.4 }), 0, 0, 0, hs);
    for (let i = 0; i < 8; i++) box(1.2, 22, 16, mat(0x111111, { metalness: 0.4 }), -10 + i * 2.85, 3, 0, hs);
    const pins = {};
    // bornes laterales OUT1/OUT2 (-x) y OUT3/OUT4 (+x)
    const termBlock = (names, x, z, rot, dir) => names.forEach((nm, i) => {
      const off = (i - (names.length - 1) / 2) * 5;
      const px = rot ? x : x + off, pz = rot ? z + off : z;
      box(rot ? 7.5 : 5, 10, rot ? 5 : 7.5, mat(0x1aa0e0), px, 1.6, pz, g);
      cyl(1.3, 0.6, METAL(), px, 11.6, pz, g);
      pins[nm] = { pos: new THREE.Vector3(px + dir.x * 3.8, 5.5, pz + dir.z * 3.8), dir, type: 'terminal' };
    });
    termBlock(['OUT1', 'OUT2'], -w / 2 + 3.8, -8, true, new THREE.Vector3(-1, 0, 0));
    termBlock(['OUT3', 'OUT4'], w / 2 - 3.8, -8, true, new THREE.Vector3(1, 0, 0));
    termBlock(['+12V', 'GND', '+5V'], -11, d / 2 - 3.8, false, new THREE.Vector3(0, 0, 1));
    // cabecera ENA IN1 IN2 IN3 IN4 ENB (vertical)
    const hn = ['ENA', 'IN1', 'IN2', 'IN3', 'IN4', 'ENB'];
    hn.forEach((nm, i) => {
      const x = 4 + i * P, z = d / 2 - 5;
      box(P, 2.5, P, mat(0x1a1a1a), x, 1.6, z, g);
      const pm = new THREE.Mesh(new THREE.BoxGeometry(0.64, 6, 0.64), GOLD()); pm.position.set(x, 1.6 + 2.5 + 2, z); g.add(pm);
      pins[nm] = { pos: new THREE.Vector3(x, 1.6 + 2.5, z), dir: new THREE.Vector3(0, 1, 0), type: 'maleUp' };
    });
    // puente ENB (el de ENA se quita) y puente 12V-5V
    box(P * 1.0, 5, P * 2, mat(0x111111), 4 + 5 * P, 4.1, d / 2 - 5 - P / 2, g);
    box(5, 5, 2.6, mat(0x111111), -14, 1.6, 6, g);
    silk(g, w, d, 1.62, [
      ...hn.map((nm, i) => [nm, 4 + i * P, d / 2 - 9, 1.0, -90]),
      ['+12V', -16, d / 2 - 9.2, 1.3], ['GND', -11, d / 2 - 9.2, 1.3], ['+5V', -6, d / 2 - 9.2, 1.3],
      ['OUT1', -w / 2 + 10.5, -10.5, 1.2], ['OUT2', -w / 2 + 10.5, -5.5, 1.2],
      ['L298N', 0, 4, 2.4], ['12V EN', -14, 9.6, 1.1]
    ]);
    return { group: g, pins };
  },
  motor() {
    const g = new THREE.Group();
    box(37, 18, 22, mat(0xf2c200, { roughness: 0.5 }), 0, 0, 0, g);
    const m = cyl(10, 26, METAL(), 0, 0, 0, g); m.rotation.z = Math.PI / 2; m.position.set(-31, 9, 0);
    const sh = cyl(2.6, 26, mat(0xf5f5f5), 0, 0, 0, g); sh.position.set(8, -4, 0);
    // hélice (cartulina) sobre el eje superior
    const prop = new THREE.Group(); prop.position.set(8, 24, 0); g.add(prop);
    for (let i = 0; i < 3; i++) { const b = box(34, 1, 9, mat(0xf39900), 17, 0, 0); b.rotation.y = 0; const p = new THREE.Group(); p.rotation.y = i * Math.PI * 2 / 3; b.rotation.x = 0.35; p.add(b); prop.add(p); }
    cyl(4, 3, mat(0x333333), 0, -1, 0, prop);
    g.userData.prop = prop;
    const pins = {
      rojo: { pos: new THREE.Vector3(-44, 12, -3), dir: new THREE.Vector3(-1, 0, 0), type: 'lead' },
      negro: { pos: new THREE.Vector3(-44, 6, 3), dir: new THREE.Vector3(-1, 0, 0), type: 'lead' },
    };
    return { group: g, pins };
  },
  pump() {
    const g = new THREE.Group();
    // vaso con agua
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(34, 30, 80, 40, 1, true), new THREE.MeshStandardMaterial({ color: 0xddeeff, transparent: true, opacity: 0.25, side: THREE.DoubleSide, roughness: 0.1 }));
    glass.position.set(0, 40, 0); g.add(glass);
    cyl(30, 0.8, new THREE.MeshStandardMaterial({ color: 0xddeeff, transparent: true, opacity: 0.4 }), 0, 0, 0, g, 40);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(32.5, 30, 50, 40), new THREE.MeshStandardMaterial({ color: 0x3aa0ff, transparent: true, opacity: 0.35, roughness: 0.1 }));
    water.position.set(0, 26, 0); g.add(water);
    // bomba sumergible
    const b = cyl(12, 30, mat(0x202020), 0, 1, 0, g);
    cyl(12.5, 4, mat(0x333333), 0, 31, 0, g);
    const out = cyl(2.5, 12, mat(0x202020), 0, 0, 0, g); out.rotation.z = Math.PI / 2; out.position.set(16, 26, 0);
    // tubo
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(22, 26, 0), new THREE.Vector3(30, 60, 0), new THREE.Vector3(10, 95, 0), new THREE.Vector3(-30, 95, 0), new THREE.Vector3(-55, 70, 0)]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 3, 10), new THREE.MeshStandardMaterial({ color: 0xf0f0f0, transparent: true, opacity: 0.7 })); g.add(tube);
    const pins = {
      rojo: { pos: new THREE.Vector3(-4, 35, 0), dir: new THREE.Vector3(0, 1, 0), type: 'lead' },
      negro: { pos: new THREE.Vector3(4, 35, 0), dir: new THREE.Vector3(0, 1, 0), type: 'lead' },
    };
    silk(g, 40, 20, 36, [['BOMBA 3-6V', 0, 0, 2.4, 0, '#ffffff']]);
    return { group: g, pins };
  },
  plant() {
    const g = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(38, 28, 55, 32), mat(0xc0643a)); pot.position.y = 27.5; pot.castShadow = true; g.add(pot);
    cyl(35, 2, mat(0x4a3020), 0, 53, 0, g, 32);
    for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(9, 12, 8), mat(0x3f9a3a)); l.scale.set(1, 0.4, 2); l.position.set(Math.cos(i) * 12, 70 + (i % 3) * 8, Math.sin(i) * 12); l.rotation.y = i; g.add(l); }
    cyl(1.5, 20, mat(0x2f7a2a), 0, 55, 0, g);
    return { group: g, pins: {} };
  },
  breadboard() {
    const g = new THREE.Group(); const w = 165, d = 55;
    box(w, 8.5, d, mat(0xf4f4f0, { roughness: 0.8 }), 0, 0, 0, g);
    const tex = textTexture(1650, 550, (c) => {
      c.fillStyle = '#f4f4f0'; c.fillRect(0, 0, 1650, 550);
      c.fillStyle = '#d03030'; c.fillRect(30, 18, 1590, 4); c.fillRect(30, 528, 1590, 4);
      c.fillStyle = '#2050c0'; c.fillRect(30, 60, 1590, 4); c.fillRect(30, 486, 1590, 4);
      c.fillStyle = '#bbb'; c.fillRect(30, 268, 1590, 14);
      c.fillStyle = '#333';
      for (let i = 0; i < 63; i++) {
        const x = 40 + i * 25.4;
        for (let r = 0; r < 5; r++) { c.fillRect(x - 4, 100 + r * 25.4 - 4, 8, 8); c.fillRect(x - 4, 320 + r * 25.4 - 4, 8, 8); }
        if (i % 6 !== 5) { c.fillRect(x - 4, 32, 8, 8); c.fillRect(x - 4, 46 - 0, 8, 8); c.fillRect(x - 4, 500, 8, 8); c.fillRect(x - 4, 514, 8, 8); }
        if ((i + 1) % 5 === 0 || i === 0) { c.font = '16px Arial'; c.fillText(String(i + 1), x - 8, 92 - 10); }
      }
      c.font = 'bold 16px Arial'; 'abcde'.split('').forEach((l, r) => c.fillText(l, 12, 106 + r * 25.4)); 'fghij'.split('').forEach((l, r) => c.fillText(l, 12, 326 + r * 25.4));
    });
    decal(w, d, tex, 0, 8.52, 0, g, false);
    // columna 55 (i = 54), filas a y c
    const x55 = -78.5 + 54 * 2.54;
    const pins = {
      'c55a': { pos: new THREE.Vector3(x55, 8.5, -d / 2 + 10), dir: new THREE.Vector3(0, 1, 0), type: 'bbhole' },
      'c55c': { pos: new THREE.Vector3(x55, 8.5, -d / 2 + 10 + 2 * 2.54), dir: new THREE.Vector3(0, 1, 0), type: 'bbhole' },
    };
    return { group: g, pins };
  },
  battery() {
    const g = new THREE.Group();
    box(87, 16, 58, mat(0x161616), 0, 0, 0, g);
    for (let i = 0; i < 6; i++) { const c = cyl(7, 50, mat(i % 2 ? 0x222222 : 0x2a2a2a, { metalness: 0.3 }), 0, 0, 0, g); c.rotation.x = Math.PI / 2; c.position.set(-36.25 + i * 14.5, 11, 0); const t = cyl(7.05, 8, mat(0xc9a227), 0, 0, 0, g); t.rotation.x = Math.PI / 2; t.position.set(-36.25 + i * 14.5, 11, i % 2 ? 20 : -20); }
    silk(g, 87, 58, 18.1, [['6 x AA  =  9 V', 0, 0, 5, 0, '#ffffff']]);
    return { group: g, pins: { dc: { pos: new THREE.Vector3(43.5, 8, 15), dir: new THREE.Vector3(1, 0, 0), type: 'lead' } } };
  },
  car() {
    const g = new THREE.Group();
    box(60, 14, 32, mat(0xdc001b, { roughness: 0.4 }), 0, 5, 0, g); box(32, 12, 28, mat(0xdddddd, { transparent: true, opacity: 0.8 }), -4, 19, 0, g);
    for (const [x, z] of [[-18, -15], [18, -15], [-18, 15], [18, 15]]) { const w = cyl(7, 5, mat(0x111111), 0, 0, 0, g); w.rotation.x = Math.PI / 2; w.position.set(x, 7, z); }
    return { group: g, pins: {} };
  },
};

// Cable USB: conector macho + cable que sale hacia -x
export function buildUSBCable(pin) {
  const g = new THREE.Group();
  const p = pin.pos;
  box(14, 10, 14, mat(0x222222), p.x - 9, p.y - 5, p.z, g);
  box(10, 7.5, 9.5, METAL(), p.x - 1.5, p.y - 3.75, p.z, g);
  const c = new THREE.CubicBezierCurve3(new THREE.Vector3(p.x - 16, p.y, p.z), new THREE.Vector3(p.x - 40, p.y, p.z), new THREE.Vector3(p.x - 40, 2, p.z - 8), new THREE.Vector3(p.x - 58, 2, p.z - 28));
  const t = new THREE.Mesh(new THREE.TubeGeometry(c, 40, 2.2, 10), mat(0x222222)); t.castShadow = true; g.add(t);
  return g;
}
