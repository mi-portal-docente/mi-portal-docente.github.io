// Fase 11 · Exportar el documento a .docx (Word / LibreOffice / Google Docs) sin librerías: se genera el
// WordprocessingML a partir del HTML limpio y se empaqueta en un ZIP sin comprimir (STORE) con su CRC-32.
// Títulos, párrafos, negrita, cursiva, subrayado, tachado, código, listas, tablas, enlaces e imágenes.
import { parsear, escHTML } from './doc-html.js';

const enc = new TextEncoder();
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
export function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
/** ZIP sin compresión. archivos: [{ nombre, datos: Uint8Array | string }] → Uint8Array */
export function zip(archivos) {
  const partes = []; const central = []; let off = 0;
  const u16 = (v) => [v & 0xff, (v >>> 8) & 0xff]; const u32 = (v) => [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];
  for (const f of archivos) {
    const nom = enc.encode(f.nombre); const d = typeof f.datos === 'string' ? enc.encode(f.datos) : f.datos; const c = crc32(d);
    const loc = new Uint8Array([...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(c), ...u32(d.length), ...u32(d.length), ...u16(nom.length), ...u16(0)]);
    partes.push(loc, nom, d);
    central.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(c), ...u32(d.length), ...u32(d.length), ...u16(nom.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(off)]), nom);
    off += loc.length + nom.length + d.length;
  }
  const tamC = central.reduce((s, x) => s + x.length, 0);
  const fin = new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(archivos.length), ...u16(archivos.length), ...u32(tamC), ...u32(off), ...u16(0)]);
  const todo = [...partes, ...central, fin]; const out = new Uint8Array(todo.reduce((s, x) => s + x.length, 0)); let p = 0;
  for (const x of todo) { out.set(x, p); p += x.length; }
  return out;
}
const x = (s) => escHTML(s).replace(/'/g, '&apos;');
function base64aBytes(b64) { if (typeof atob === 'function') { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; } return new Uint8Array(Buffer.from(b64, 'base64')); }

/**
 * html: documento limpio. op: { titulo, meta, imagenes: { img1: { data: 'data:image/jpeg;base64,…', w, h } } }
 * → Uint8Array con el .docx
 */
export function docx(html, op = {}) {
  const rels = []; const media = []; let nImg = 0;
  const relLink = (u) => { const id = 'rId' + (100 + rels.length); rels.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${x(u)}" TargetMode="External"/>`); return id; };
  const relImg = (dataUrl) => {
    const m = /^data:image\/(png|jpeg|gif|webp);base64,(.+)$/.exec(dataUrl || ''); if (!m || m[1] === 'webp') return null;
    const ext = m[1] === 'jpeg' ? 'jpeg' : m[1]; const nombre = `media/imagen${++nImg}.${ext}`; media.push({ nombre: 'word/' + nombre, datos: base64aBytes(m[2]), ext });
    const id = 'rId' + (100 + rels.length); rels.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${nombre}"/>`); return id;
  };
  const run = (t, f) => `<w:r><w:rPr>${f.b ? '<w:b/>' : ''}${f.i ? '<w:i/>' : ''}${f.u ? '<w:u w:val="single"/>' : ''}${f.s ? '<w:strike/>' : ''}${f.code ? '<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="20"/>' : ''}${f.link ? '<w:rStyle w:val="Hyperlink"/>' : ''}</w:rPr>${String(t).split('\n').map((p, i) => (i ? '<w:br/>' : '') + `<w:t xml:space="preserve">${x(p)}</w:t>`).join('')}</w:r>`;
  function inline(n, f) {
    if (n.x != null) return n.x ? run(n.x, f) : '';
    const g = { ...f };
    if (n.t === 'strong') g.b = true; if (n.t === 'em') g.i = true; if (n.t === 'u') g.u = true; if (n.t === 's') g.s = true; if (n.t === 'code') g.code = true;
    if (n.t === 'br') return '<w:r><w:br/></w:r>';
    if (n.t === 'img') return imagen(n);
    if (n.t === 'a') { const id = relLink(n.a.href); return `<w:hyperlink r:id="${id}">${n.c.map((c) => inline(c, { ...g, link: true })).join('')}</w:hyperlink>`; }
    return n.c.map((c) => inline(c, g)).join('');
  }
  function imagen(n) {
    const im = n.a['data-img'] ? op.imagenes?.[n.a['data-img']] : n.a.src?.startsWith('data:') ? { data: n.a.src } : null;
    if (!im?.data) return n.a.src ? run(`[imagen: ${n.a.src}]`, {}) : '';
    const id = relImg(im.data); if (!id) return '';
    const maxW = 15 * 360000; let w = (im.w || 600) * 9525, h = (im.h || 400) * 9525; if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${w}" cy="${h}"/><wp:docPr id="${nImg}" name="Imagen ${nImg}"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${nImg}" name="imagen${nImg}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  }
  const par = (contenido, estilo, extra = '') => `<w:p><w:pPr>${estilo ? `<w:pStyle w:val="${estilo}"/>` : ''}${extra}</w:pPr>${contenido}</w:p>`;
  function bloque(n, nivelLista = -1, tipoLista = null) {
    if (n.x != null) return n.x.trim() ? par(run(n.x, {})) : '';
    switch (n.t) {
      case 'h2': return par(inline(n, {}), 'Heading2');
      case 'h3': return par(inline(n, {}), 'Heading3');
      case 'h4': return par(inline(n, {}), 'Heading4');
      case 'p': return par(inline(n, {}));
      case 'blockquote': return n.c.some((c) => c.t && ['p', 'ul', 'ol', 'h2', 'h3'].includes(c.t)) ? n.c.map((c) => bloque(c)).join('') : par(inline(n, { i: true }), 'Quote');
      case 'pre': return textoPlano(n).split('\n').map((l) => par(run(l, { code: true }), 'Code')).join('');
      case 'ul': case 'ol': return n.c.map((li) => bloque(li, nivelLista + 1, n.t)).join('');
      case 'li': {
        const dentro = n.c.filter((c) => !(c.t === 'ul' || c.t === 'ol')); const sub = n.c.filter((c) => c.t === 'ul' || c.t === 'ol');
        return par(dentro.map((c) => (c.t === 'p' ? inline(c, {}) : inline(c, {}))).join(''), 'ListParagraph', `<w:numPr><w:ilvl w:val="${Math.min(8, Math.max(0, nivelLista))}"/><w:numId w:val="${tipoLista === 'ol' ? 2 : 1}"/></w:numPr>`) + sub.map((s) => bloque(s, nivelLista, tipoLista)).join('');
      }
      case 'table': {
        const filas = []; (function rec(m) { for (const c of m.c || []) { if (c.t === 'tr') filas.push(c); else if (c.t === 'thead' || c.t === 'tbody') rec(c); } })(n);
        const borde = (k) => `<w:${k} w:val="single" w:sz="4" w:space="0" w:color="999999"/>`;
        return `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="0" w:type="auto"/><w:tblBorders>${['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(borde).join('')}</w:tblBorders></w:tblPr>${filas.map((tr) => `<w:tr>${tr.c.filter((c) => c.t === 'td' || c.t === 'th').map((td) => `<w:tc><w:tcPr>${td.a.colspan ? `<w:gridSpan w:val="${td.a.colspan}"/>` : ''}</w:tcPr>${par(inline(td, { b: td.t === 'th' }))}</w:tc>`).join('') || '<w:tc><w:p/></w:tc>'}</w:tr>`).join('')}</w:tbl>${par('')}`;
      }
      case 'img': return par(imagen(n));
      case 'br': return '';
      default: return par(inline(n, {}));
    }
  }
  const textoPlano = (n) => (n.x != null ? n.x : (n.c || []).map(textoPlano).join('') + (n.t === 'br' ? '\n' : ''));
  // agrupa los «inline» sueltos de la raíz en párrafos
  const raiz = parsear(html); const cuerpo = []; let suelto = [];
  const vaciar = () => { if (suelto.length) { const c = suelto.map((n) => inline(n, {})).join(''); if (c) cuerpo.push(par(c)); suelto = []; } };
  for (const n of raiz.c) { if (n.x != null || ['strong', 'em', 'u', 's', 'code', 'a', 'br'].includes(n.t)) suelto.push(n); else { vaciar(); cuerpo.push(bloque(n)); } }
  vaciar();
  const cab = (op.titulo ? par(run(op.titulo, {}), 'Title') : '') + (op.meta ? par(run(op.meta, { i: true })) : '');
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  const documento = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${cab}${cuerpo.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const estilo = (id, nombre, rpr, ppr = '') => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${nombre}"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr>${ppr}</w:pPr><w:rPr>${rpr}</w:rPr></w:style>`;
  const estilos = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:lang w:val="es-ES"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
${estilo('Title', 'Title', '<w:b/><w:sz w:val="36"/>', '<w:spacing w:after="80"/>')}${estilo('Heading2', 'heading 2', '<w:b/><w:sz w:val="30"/>', '<w:keepNext/><w:spacing w:before="240" w:after="80"/><w:outlineLvl w:val="1"/>')}${estilo('Heading3', 'heading 3', '<w:b/><w:sz w:val="26"/>', '<w:keepNext/><w:spacing w:before="200" w:after="60"/><w:outlineLvl w:val="2"/>')}${estilo('Heading4', 'heading 4', '<w:b/><w:i/><w:sz w:val="24"/>', '<w:keepNext/><w:outlineLvl w:val="3"/>')}${estilo('Quote', 'Quote', '<w:i/><w:color w:val="555555"/>', '<w:ind w:left="567"/>')}${estilo('Code', 'Code', '<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="20"/>', '<w:spacing w:after="0"/><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/>')}${estilo('ListParagraph', 'List Paragraph', '', '<w:spacing w:after="40"/>')}
<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:rPr><w:color w:val="0563C1"/><w:u w:val="single"/></w:rPr></w:style><w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:tblPr><w:tblCellMar><w:left w:w="108" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`;
  const niv = (fmt, txt, i) => `<w:lvl w:ilvl="${i}"><w:start w:val="1"/><w:numFmt w:val="${fmt}"/><w:lvlText w:val="${txt}"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="${720 + i * 360}" w:hanging="360"/></w:pPr></w:lvl>`;
  const numeracion = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => niv('bullet', ['•', '◦', '▪'][i % 3], i)).join('')}</w:abstractNum><w:abstractNum w:abstractNumId="1">${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => niv(['decimal', 'lowerLetter', 'lowerRoman'][i % 3], `%${i + 1}.`, i)).join('')}</w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num><w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num></w:numbering>`;
  const ext = [...new Set(media.map((m) => m.ext))];
  const tipos = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${ext.map((e) => `<Default Extension="${e}" ContentType="image/${e}"/>`).join('')}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>`;
  const relsRaiz = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const relsDoc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>${rels.join('')}</Relationships>`;
  return zip([{ nombre: '[Content_Types].xml', datos: tipos }, { nombre: '_rels/.rels', datos: relsRaiz }, { nombre: 'word/document.xml', datos: documento }, { nombre: 'word/styles.xml', datos: estilos }, { nombre: 'word/numbering.xml', datos: numeracion }, { nombre: 'word/_rels/document.xml.rels', datos: relsDoc }, ...media]);
}
