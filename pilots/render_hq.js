// High-quality renderer: streams frames straight into ffmpeg (no PNGs on disk), several browser pages in parallel.
// Usage: node render_hq.js <scene.js[,more.js]> <out.mp4> [--scale 2] [--from 0] [--to DUR] [--jobs 4] [--fps 30]
//   --scale 2 -> 2560x1440 (YouTube serves VP9/AV1 for 1440p+), --scale 1.5 -> 1080p, --scale 1 -> 720p preview.
// The scene may define `const DUR = <seconds>`; default 10. Output is video-only H.264 (yuv420p); mux audio separately.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? Number(args[i + 1]) : d; };
const [scene, out] = args;

(async () => {
  const adir = path.join(__dirname, 'assets');
  const assets = fs.existsSync(adir) ? Object.fromEntries(fs.readdirSync(adir).filter(f => /\.(png|jpe?g)$/.test(f))
    .map(f => [f.replace(/\.\w+$/, ''), `data:image/${f.endsWith('png') ? 'png' : 'jpeg'};base64,` + fs.readFileSync(path.join(adir, f)).toString('base64')])) : {};
  const code = `const ASSETS = ${JSON.stringify(assets)};\n` + ['lib.js', 'style.js'].map(f => fs.readFileSync(path.join(__dirname, f), 'utf8')).join('\n') + '\n' + scene.split(',').map(f => fs.readFileSync(f, 'utf8')).join('\n');
  const scale = opt('scale', 2), fps = opt('fps', 30), jobs = opt('jobs', 4);
  // One browser process per job (real parallelism). The page is laid out at the final pixel size with DPR 1 and the
  // 1280x720 SVG scaled up by CSS: vector-sharp, and CDP captures it ~2x faster than page.screenshot().
  const pw = Math.round(1280 * scale), ph = Math.round(720 * scale);
  const browsers = [], pages = [];
  for (let j = 0; j < jobs; j++) {
    const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
    const p = await browser.newPage({ viewport: { width: pw, height: ph }, deviceScaleFactor: 1 });
    await p.setContent(`<html><body style="margin:0;background:#000"><style>#s svg{width:${pw}px;height:${ph}px;display:block}</style><div id="s"></div><script>${code}</script></body></html>`);
    await p.evaluate(() => document.fonts.ready);
    p.cdp = await p.context().newCDPSession(p);
    browsers.push(browser); pages.push(p);
  }
  const dur = await pages[0].evaluate(() => (typeof DUR !== 'undefined' ? DUR : 10));
  const from = opt('from', 0), to = opt('to', dur);
  const n = Math.round((to - from) * fps);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  // Render in batches of `jobs` frames in parallel, write them to ffmpeg in order.
  const t0 = Date.now();
  for (let i = 0; i < n; i += jobs) {
    const batch = await Promise.all(pages.map(async (p, j) => {
      const k = i + j;
      if (k >= n) return null;
      // draw, wait two animation frames so the compositor has the new frame, then grab it losslessly via CDP
      await p.evaluate(t => new Promise(r => { document.getElementById('s').innerHTML = render(t); requestAnimationFrame(() => requestAnimationFrame(r)); }), from + k / fps);
      const { data } = await p.cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
      return Buffer.from(data, 'base64');
    }));
    for (const buf of batch) if (buf && !ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % (fps * 5) < jobs) process.stderr.write(`\r${(from + i / fps).toFixed(1)}s / ${to}s  ${((Date.now() - t0) / 1000).toFixed(0)}s elapsed`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await Promise.all(browsers.map(b => b.close()));
  process.stderr.write(`\ndone: ${out}\n`);
})();
