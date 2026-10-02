import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage();

async function render(html, out, opts) {
  await page.goto(pathToFileURL(path.join(dir, html)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(dir, out), format: 'A4', printBackground: true, preferCSSPageSize: true, ...opts });
}

await render('cover.html', 'cover.pdf', {});
await render('csomag.html', 'body.pdf', {
  outline: true,
  tagged: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="width:100%;font-size:7.5pt;color:#777;padding:0 18mm;display:flex;justify-content:space-between;font-family:sans-serif"><span>Cohors · Ordo VIII · név- és arculati csomag v0.1</span><span class="pageNumber"></span></div>',
});
await browser.close();
