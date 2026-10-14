// Pilot 4: Percy — "Why You're Always at 3%". House style (see style.js).
function room(t, sun) {
  return `<rect x="900" y="90" width="230" height="200" rx="12" fill="${mix('#0f2a30', '#ffd9a0', sun)}" stroke="${P.ink}" stroke-width="8"/>
    <circle cx="1015" cy="${lerp(300, 170, sun)}" r="44" fill="${P.mustard}" opacity="${sun}"/>
    <path d="M1015 90 v200 M900 190 h230" stroke="${P.ink}" stroke-width="8"/>
    <rect x="0" y="560" width="${W}" height="160" fill="${P.bg2}"/>
    <line x1="0" y1="560" x2="${W}" y2="560" stroke="${P.ink}" stroke-width="6"/>`;
}
function clock(str) {
  return `<rect x="40" y="34" width="190" height="64" rx="12" fill="${P.ink}"/>${txt(135, 80, str, 36, P.cream, { font: 'DejaVu Sans Mono', weight: 700 })}`;
}
function icon(kind, x, y, sc, op) {
  const inner = {
    heart: `<path d="M0 12 C-30 -10 -18 -32 0 -16 C18 -32 30 -10 0 12 Z" fill="${P.red}"/>`,
    play: `<rect x="-24" y="-18" width="48" height="36" rx="9" fill="${P.coral}"/><path d="M-7 -9 L10 0 L-7 9 Z" fill="${P.cream}"/>`,
    bell: `<path d="M-16 8 Q-16 -20 0 -20 Q16 -20 16 8 Z" fill="${P.mustard}"/><circle cy="12" r="5" fill="${P.mustard}"/>`,
  }[kind];
  return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${op}"><circle r="34" fill="${P.cream}" stroke="${P.ink}" stroke-width="5"/>${inner}</g>`;
}

function render(t) {
  let s = '';
  if (t < 2.3) {
    const sun = ease(seg(t, 0, 1.6));
    s += room(t, sun) + clock('7:00');
    const stretch = Math.sin(seg(t, 0.3, 1.6) * Math.PI);
    s += percy(520, 300, 0.75, { level: 1, t, eyes: 'happy', mouth: 'grin', armL: lerp(20, 165, stretch), armR: lerp(20, 165, stretch) });
    s += caption(640, 660, typed('Morning. Fully charged.', t, 0.3, 1.2), 34);
  } else if (t < 5.2) {
    // Doom-scroll: charge drains in steps, icons fly out of the phone
    const p = seg(t, 2.5, 5.0);
    const steps = Math.floor(p * 8) / 8, sub = (p * 8) % 1;
    const lvl = lerp(1, 0.12, clamp(steps + ease(clamp(sub * 3)) / 8));
    const mins = Math.round(lerp(0, 167, p)), hh = 7 + Math.floor(mins / 60), mm = String(mins % 60).padStart(2, '0');
    s += room(t, 1) + clock(`${hh}:${mm}`);
    s += `<circle cx="560" cy="260" r="170" fill="${P.coral}" opacity="${0.10 + 0.05 * Math.sin(t * 20)}"/>`;
    s += percy(520, 300, 0.75, { level: lvl, t, eyes: 'wide', mouth: 'flat', look: 8, armL: 20, armR: 140 });
    // phone in right hand
    s += `<g transform="translate(628,232)"><rect x="-26" y="-46" width="52" height="92" rx="10" fill="${P.ink}"/>
      <rect x="-20" y="-38" width="40" height="72" rx="5" fill="${['#FF7A59', '#FF4D4D', '#FFC845', '#57D68D'][Math.floor(t * 6) % 4]}"/></g>`;
    ['heart', 'play', 'bell', 'heart', 'play', 'bell', 'heart', 'play'].forEach((k, i) => {
      const a = seg(t, 2.5 + i * 0.32, 3.3 + i * 0.32);
      if (a > 0 && a < 1) s += icon(k, lerp(640, 760 + (i % 3) * 120, a), lerp(220, 60 + (i % 2) * 80, a), back(clamp(a * 3)), 1 - seg(a, 0.7, 1));
    });
    s += caption(640, 660, typed('Just checking one thing...', t, 2.4, 3.3), 34);
  } else if (t < 6.8) {
    const flash = Math.floor(t * 4) % 2 === 0;
    s += room(t, 1) + clock('9:47');
    s += percy(520, 300, 0.75, { level: 0.03, t, lid: 0.6, mouth: 'wobble', armL: 5, armR: 5, rot: Math.sin(t * 2) * 3 });
    s += `<rect width="${W}" height="${H}" fill="none" stroke="${P.red}" stroke-width="40" opacity="${flash ? 0.6 : 0.15}"/>`;
    s += `<g transform="translate(880,300)" opacity="${flash ? 1 : 0.4}"><rect x="-70" y="-32" width="130" height="64" rx="10" fill="none" stroke="${P.red}" stroke-width="8"/>
      <rect x="62" y="-14" width="14" height="28" rx="3" fill="${P.red}"/><rect x="-60" y="-22" width="10" height="44" fill="${P.red}"/></g>`;
    s += caption(640, 660, typed('9:47 AM. Already at 3%.', t, 5.3, 6.1), 34, { bg: P.red, fill: P.cream });
  } else if (t < 8.0) {
    const f = ease(seg(t, 6.9, 7.5));
    s += room(t, 1) + clock('9:47');
    s += percy(lerp(520, 470, f), lerp(300, 500, f), 0.75, { level: 0, dead: true, t, mouth: 'flat', armL: 0, armR: 0, rot: lerp(0, -80, f) });
    s += `<rect width="${W}" height="${H}" fill="#000" opacity="${0.45 * f}"/>`;
    s += txt(900, 330, 'SHUTTING DOWN...', 44, P.cream, { op: seg(t, 7.0, 7.3) });
  } else {
    const p1 = back(seg(t, 8.05, 8.4)), p2 = back(seg(t, 8.35, 8.7));
    s += `<g transform="translate(470,300) scale(${p1})">${stitle(0, 0, "WHY YOU'RE", 84)}${stitle(0, 95, 'ALWAYS', 84)}</g>`;
    s += `<g transform="translate(470,500) scale(${p2})" filter="url(#hard)"><rect x="-170" y="-80" width="340" height="120" rx="14" fill="${P.red}" stroke="${P.ink}" stroke-width="7"/>${txt(0, 20, 'AT 3%', 96, P.cream)}</g>`;
    s += percy(1020, 330, 0.72, { level: 0.03, t, lid: 0.6, mouth: 'wobble', armL: 5, armR: 5, rot: -8 });
  }
  const cut = [5.2, 6.8, 8.0].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.06)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(cut, 1 - seg(t, 0, 0.25), seg(t, 9.7, 10))), t);
}
