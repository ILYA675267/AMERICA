// Renders a doodle scene to video (free: Chromium + rough.js + ffmpeg).
// Usage: node render.js scenes/ep02_c01.js out.mp4 [--fps 30] [--audio voice.mp3] [--preview 0,5,9.9 outDir]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const [scene, out] = args;
const fps = +opt('--fps', 30);
const audio = opt('--audio');
const preview = opt('--preview');

(async () => {
  const lib = ['node_modules/roughjs/bundled/rough.js', 'lib/engine.js', 'lib/hero.js'].map(f => fs.readFileSync(path.join(__dirname, f), 'utf8'));
  const code = lib.join('\n;\n') + '\n;\n' + fs.readFileSync(scene, 'utf8') + '\n;window.__DUR = DURATION;';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
  await page.setContent('<html><body style="margin:0"><canvas id="c" width="1920" height="1080"></canvas></body></html>');
  await page.addScriptTag({ content: code });
  const dur = await page.evaluate(() => window.__DUR);
  const grab = t => page.evaluate(t => { render(t); return document.getElementById('c').toDataURL('image/jpeg', 0.95).split(',')[1]; }, t);

  if (preview) {
    const dir = opt('--preview-dir', path.dirname(out)); fs.mkdirSync(dir, { recursive: true });
    for (const t of preview.split(',').map(Number)) fs.writeFileSync(path.join(dir, `prev_${t}.jpg`), Buffer.from(await grab(t), 'base64'));
    await browser.close(); return;
  }
  const ff = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-'];
  if (audio) ff.push('-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  ff.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  const enc = spawn('ffmpeg', ff, { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(dur * fps);
  for (let i = 0; i < n; i++) {
    const buf = Buffer.from(await grab(i / fps), 'base64');
    if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`\r${i}/${n}`);
  }
  enc.stdin.end();
  await new Promise(r => enc.on('close', r));
  await browser.close();
  console.log(`\rdone: ${out}`);
})();
