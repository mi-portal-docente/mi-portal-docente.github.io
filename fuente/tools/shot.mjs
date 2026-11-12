import { chromium } from 'playwright-core';
const [url,out,w,h,wait]=process.argv.slice(2);
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:+w||1440,height:+h||900}});
p.on('console',m=>{ if(m.type()==='error') console.log('CONSOLE',m.text())});
p.on('pageerror',e=>console.log('PAGEERR',e.message));
await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(+wait||6000);
await p.screenshot({path:out}); await b.close();
