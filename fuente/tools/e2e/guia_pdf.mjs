import { marked } from 'marked';
import { readFileSync, writeFileSync } from 'fs';
import { chromium } from 'playwright-core';
import { tmpdir } from 'os';
import { join } from 'path';
import { SITE_URL } from '../rutas.mjs';
// Uso: node e2e/guia_pdf.mjs <guia.md> <salida.pdf>   (la guía no forma parte del repositorio)
const [GUIA, PDF] = process.argv.slice(2);
if (!GUIA || !PDF) { console.error('Uso: node e2e/guia_pdf.mjs <guia.md> <salida.pdf>'); process.exit(1); }
const TMP = join(tmpdir(), 'guia.html');
const md = readFileSync(GUIA, 'utf8').replace(/\(\.\.\/esp32-lecciones\//g, '(' + SITE_URL);
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
@font-face{font-family:Decima;src:url(${SITE_URL}fonts/DecimaNovaPro-Regular.otf)}@font-face{font-family:Decima;font-weight:700;src:url(${SITE_URL}fonts/DecimaNovaPro-Bold.otf)}
body{font-family:Decima,'Segoe UI',Arial,sans-serif;color:#1d2329;font-size:11pt;line-height:1.45;margin:0}
h1{color:#51626F;border-bottom:4px solid #DC001B;padding-bottom:6px;font-size:22pt}
h2{color:#DC001B;font-size:15pt;margin-top:22px;break-after:avoid}
img{max-width:100%;border:1px solid #DADCDE;border-radius:8px;margin:6px 0 4px;break-inside:avoid}
p:has(img){break-inside:avoid}
code{background:#F3F4F5;padding:1px 5px;border-radius:4px}
li{margin:3px 0}
</style></head><body>${marked.parse(md)}</body></html>`;
writeFileSync(TMP, html);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const pg = await b.newPage(); await pg.goto('file://' + TMP); await pg.waitForTimeout(500);
await pg.pdf({ path: PDF, format: 'A4', margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' }, printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:8pt;color:#888;width:100%;text-align:center">Super Profe Pablo · Guía del panel del profesor · <span class="pageNumber"></span>/<span class="totalPages"></span></div>' });
await b.close(); console.log('ok');
