// Usage: node render.js <scene.js> <outDir> [t1,t2,...]
// Renders every frame (10 s @ 30 fps) of a scene to PNG, or only the listed times for previews.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const [scene, outDir, only] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const code = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8') + '\n' + fs.readFileSync(scene, 'utf8');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`<html><body style="margin:0;background:#000"><div id="s"></div><script>${code}</script></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const times = only ? only.split(',').map(Number) : [...Array(300).keys()].map(i => i / 30);
  for (let i = 0; i < times.length; i++) {
    await page.evaluate(t => { document.getElementById('s').innerHTML = render(t); }, times[i]);
    await page.screenshot({ path: path.join(outDir, `f${String(i).padStart(4, '0')}.png`) });
  }
  await browser.close();
})();
