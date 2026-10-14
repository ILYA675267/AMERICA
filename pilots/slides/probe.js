// Slideshow probe (10 s): AI-drawn backgrounds + cut-out Milo poses, motion and light added in code.
const DUR = 10;
const BW = 1344, BH = 768;  // background image size

// Background that covers the frame, with a slow camera move: pan (px) and zoom.
function bg(img, pan, zoom) {
  const s = (H / BH) * zoom * 1.06, w = BW * s, h = BH * s;
  return `<image href="${img}" x="${(W - w) / 2 - pan}" y="${(H - h) / 2}" width="${w}" height="${h}"/>`;
}
// Milo sprite: feet at (x, y), height hgt. tint lets the night light colour him.
function sprite(img, x, y, hgt, iw, ih, op = 1, flip = false) {
  const w = hgt * iw / ih;
  return `<g opacity="${op}"><ellipse cx="${x}" cy="${y - 4}" rx="${w * 0.36}" ry="${hgt * 0.035}" fill="#000" opacity="0.35"/>
    <image href="${img}" x="${flip ? -x - w / 2 : x - w / 2}" y="${y - hgt}" width="${w}" height="${hgt}" filter="url(#night)" ${flip ? 'transform="scale(-1,1)"' : ''}/></g>`;
}
const SZ = { walk1: [490, 651], walk2: [486, 641], happy: [497, 600] };
function walker(t, x, y, hgt) {
  const k = Math.floor(t / 0.22) % 2, bob = Math.abs(Math.sin(t * Math.PI / 0.22)) * 5;
  const pose = k ? 'walk2' : 'walk1';
  return sprite(ASSETS['milo_pose_' + pose], x, y - bob, hgt, ...SZ[pose]);
}
const glw = (x, y, r, col, op) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
function motes(t, x0, y0, w, h, n, col, op) {
  let o = '';
  for (let i = 0; i < n; i++) {
    const sx = (i * 97.13) % 1, sy = (i * 57.71) % 1;
    const x = x0 + ((sx * w + t * (6 + (i % 5) * 3)) % w), y = y0 + ((sy * h - t * (4 + (i % 3) * 2) + h * 40) % h);
    o += `<circle cx="${x}" cy="${y}" r="${1.2 + (i % 3) * 0.7}" fill="${col}" opacity="${op * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + i)))}"/>`;
  }
  return o;
}
function soft(s, t, a, b, y = 668, size = 36) {
  const op = Math.min(seg(t, a, a + 0.5), 1 - seg(t, b - 0.5, b));
  return op > 0 ? `<g opacity="${op}">${txt(640, y, s, size, P.cream, { weight: 700 })}</g>` : '';
}

function render(t) {
  let s = `<defs><filter id="night"><feColorMatrix type="matrix" values="${t < 5.6 ? '0.78 0 0 0 0  0 0.82 0 0 0  0 0 0.98 0 0' : '0.92 0 0 0 0.02  0 0.86 0 0 0  0 0 0.84 0 0'}  0 0 0 1 0"/></filter></defs>`;
  if (t < 5.6) {  // street: Milo walks home under the lamps, camera follows a little
    const p = seg(t, 0, 5.6);
    s += bg(ASSETS.bg_street, lerp(-40, 60, p), 1.0);
    const flick = 0.3 + 0.05 * Math.sin(t * 7) + 0.03 * Math.sin(t * 19);
    s += glw(485, 140, 70, '#ffc76a', flick);
    s += `<ellipse cx="${1010 - lerp(-40, 60, p)}" cy="600" rx="260" ry="40" fill="#ffc76a" opacity="${0.12 + 0.03 * Math.sin(t * 5)}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
    const x = lerp(140, 980, seg(t, 0.2, 5.6));
    s += walker(t, x, 640, 230);
    // warm light on Milo while he passes the lamp pool
    const near = Math.max(0, 1 - Math.abs(x - 950) / 260);
    s += glw(x, 520, 90, '#ffb35c', 0.18 * near);
    s += motes(t, 300, 80, 700, 500, 30, '#ffe2a8', 0.45);
    s += soft('Every night, the same walk home.', t, 0.6, 5.3);
  } else {  // room: he comes in through the door, stops, and is happy to be home
    const p = seg(t, 5.6, 10);
    s += bg(ASSETS.bg_room, lerp(30, -10, p), lerp(1.0, 1.05, p));
    const lampPulse = 0.35 + 0.04 * Math.sin(t * 3);
    s += glw(860, 300, 110, '#ffc76a', lampPulse);
    const walkEnd = 8.0, x = lerp(230, 560, ease(seg(t, 5.7, walkEnd)));
    if (t < walkEnd) s += walker(t, x, 660, 250);
    else {
      const hop = Math.sin(seg(t, walkEnd, walkEnd + 0.5) * Math.PI) * 26;
      s += sprite(ASSETS.milo_pose_happy, x, 660 - hop, 250, ...SZ.happy);
      s += glw(x, 470, 160, '#ffcf8a', 0.25 * seg(t, walkEnd, walkEnd + 0.8));
    }
    s += motes(t, 400, 150, 700, 450, 26, '#ffe2a8', 0.4);
    s += soft('Home. Finally.', t, 6.2, 9.6);
  }
  // vignette + transitions
  s += `<defs><radialGradient id="vg" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.6"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#vg)"/>`;
  const dip = Math.max(0, 1 - Math.abs(t - 5.6) / 0.35);
  return sframe(s + fade(Math.max(1 - seg(t, 0, 0.6), dip, seg(t, 9.4, 10))), t, '#000');
}
