// Pilot 5: AI-generated scenes (free FLUX.1-schnell) + our own motion, light and HUD on top.
// "Why you quit on day 47" — Milo with the sprout on his head.

// Slow camera push towards (fx, fy) over the shot.
function shot(img, p, z0, z1, fx, fy) {
  const z = lerp(z0, z1, p);
  return `<g transform="translate(${fx},${fy}) scale(${z}) translate(${-fx},${-fy})"><image href="${img}" width="${W}" height="${H}"/></g>`;
}

// Pulsing warm glow (lamp / phone) using screen-like additive blending.
function glow(x, y, r, col, op) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}" filter="url(#glow)" style="mix-blend-mode:screen"/>`;
}

// Dust motes drifting inside a light cone.
function dust(t, x0, y0, w, h, n, col) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const sx = (i * 97.13) % 1, sy = (i * 57.71) % 1;
    const x = x0 + ((sx * w + t * (8 + (i % 5) * 4)) % w);
    const y = y0 + ((sy * h - t * (5 + (i % 3) * 3) + h * 4) % h);
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + i));
    out += `<circle cx="${x}" cy="${y}" r="${1.2 + (i % 3) * 0.8}" fill="${col}" opacity="${0.55 * tw}"/>`;
  }
  return out;
}

function vignette() {
  return `<defs><linearGradient id="bot" x1="0" y1="0" x2="0" y2="1"><stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.7"/></linearGradient><radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.75"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#vig)"/><rect width="${W}" height="${H}" fill="url(#bot)"/>`;
}

// Neon HUD bar like the reference genre, in our palette.
function hud(x, y, label, value, col, t, blink) {
  const w = 420, fillW = Math.max(8, (w - 12) * value);
  const on = blink ? (Math.floor(t * 4) % 2 === 0 ? 1 : 0.35) : 1;
  return `<g transform="translate(${x},${y})" opacity="${on}">
    ${txt(0, -14, label, 26, P.cream, { anchor: 'start', weight: 800, ls: 2 })}
    <rect x="0" y="0" width="${w}" height="34" rx="17" fill="#000" fill-opacity="0.45" stroke="#ffffff" stroke-opacity="0.35" stroke-width="3"/>
    <rect x="6" y="6" width="${fillW}" height="22" rx="11" fill="${col}" filter="url(#glow)" opacity="0.8"/>
    <rect x="6" y="6" width="${fillW}" height="22" rx="11" fill="${col}"/>
    ${txt(w + 20, 30, Math.round(value * 100) + '%', 38, col, { anchor: 'start', weight: 900 })}</g>`;
}

function dayCounter(x, y, n, sc = 1) {
  return `<g transform="translate(${x},${y}) scale(${sc})">${txt(0, 0, 'DAY', 84, P.cream, { anchor: 'start' })}${txt(205, 0, String(n), 84, P.mustard, { anchor: 'start' })}
    <path d="M200 16 q60 -8 ${String(n).length * 52 + 10} 0" stroke="${P.mustard}" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
}

function render(t) {
  let s = '';
  if (t < 4.3) {
    const p = seg(t, 0, 4.3);
    s += shot(ASSETS.ai_day1, p, 1.0, 1.12, 470, 420);
    const flick = 0.35 + 0.08 * Math.sin(t * 9) + 0.05 * Math.sin(t * 23);
    s += glow(760, 300, 120, '#ffb347', flick) + glow(650, 520, 220, '#ff9a3c', 0.12);
    s += dust(t, 560, 230, 520, 380, 45, '#ffe2a8');
    s += vignette();
    const hp = back(seg(t, 0.5, 0.9));
    s += `<g transform="translate(70,130) scale(${hp})">${dayCounter(0, 0, 1, 0.8)}</g>`;
    s += `<g opacity="${seg(t, 0.9, 1.3)}">${hud(70, 210, 'ENERGY', lerp(0.4, 1, ease(seg(t, 0.9, 2.0))), P.green, t)}</g>`;
    s += caption(640, 670, typed('Day 1. He had a plan.', t, 1.6, 2.6), 36);
  } else if (t < 8.3) {
    const p = seg(t, 4.3, 8.3);
    s += shot(ASSETS.ai_day47, p, 1.05, 1.2, 680, 430);
    const flick = 0.22 + 0.06 * Math.sin(t * 7);
    s += glow(215, 345, 90, '#ffb347', flick);
    s += glow(272, 585, 110, '#fff2a0', 0.18 + 0.1 * Math.sin(t * 15));
    s += dust(t, 120, 300, 420, 300, 25, '#ffe2a8');
    s += vignette();
    s += `<rect width="${W}" height="${H}" fill="#000" opacity="${0.15 * p}"/>`;
    s += dayCounter(70, 130, 47, 0.8);
    const e = lerp(0.62, 0.09, ease(seg(t, 4.6, 6.0)));
    s += hud(70, 210, 'ENERGY', e, chargeColor(e), t, e < 0.15);
    s += caption(640, 670, typed('Day 47. The plan was gone.', t, 5.2, 6.3), 36);
  } else {
    const p1 = back(seg(t, 8.35, 8.7)), p2 = back(seg(t, 8.65, 9.0));
    s += `<rect width="${W}" height="${H}" fill="#0b0b0d"/>` + glow(640, 360, 260, '#ffb347', 0.08);
    s += dust(t, 200, 100, 880, 520, 40, '#ffe2a8');
    s += `<g transform="translate(640,320) scale(${p1})">${txt(0, 0, 'WHY YOU QUIT', 96, P.cream)}</g>`;
    s += `<g transform="translate(640,440) scale(${p2})"><rect x="-210" y="-72" width="420" height="104" rx="12" fill="${P.mustard}"/>${txt(0, 12, 'ON DAY 47', 76, '#111')}</g>`;
  }
  const cut = [4.3, 8.3].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.1)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(cut, 1 - seg(t, 0, 0.4), seg(t, 9.6, 10))), t, '#000');
}
