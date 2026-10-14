// Pilot 4: Milo — "Why You're Always Tired". House style (see style.js).
function room(t, sun) {
  return `<rect x="920" y="100" width="200" height="180" rx="6" fill="${mix('#0d0f16', '#2a2f45', sun)}" stroke="#2c2c34" stroke-width="6"/>
    <circle cx="1020" cy="${lerp(290, 170, sun)}" r="30" fill="${P.mustard}" opacity="${0.8 * sun}"/>
    <path d="M1020 100 v180 M920 190 h200" stroke="#2c2c34" stroke-width="6"/>
    <line x1="0" y1="560" x2="${W}" y2="560" stroke="#2a2a30" stroke-width="4"/>`;
}
function clock(str) {
  return txt(60, 66, str, 28, P.dim, { anchor: 'start', weight: 700, font: 'DejaVu Sans Mono' });
}
function icon(kind, x, y, sc, op) {
  const inner = {
    heart: `<path d="M0 10 C-24 -8 -14 -26 0 -13 C14 -26 24 -8 0 10 Z" fill="${P.red}"/>`,
    play: `<rect x="-18" y="-13" width="36" height="26" rx="7" fill="${P.red}"/><path d="M-5 -7 L8 0 L-5 7 Z" fill="${P.cream}"/>`,
    bell: `<path d="M-13 7 Q-13 -16 0 -16 Q13 -16 13 7 Z" fill="${P.mustard}"/><circle cy="10" r="4" fill="${P.mustard}"/>`,
  }[kind];
  return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${op}"><circle r="27" fill="#1d1d22" stroke="#33333b" stroke-width="3"/>${inner}</g>`;
}

function render(t) {
  let s = '';
  if (t < 2.3) {
    const sun = ease(seg(t, 0, 1.6));
    s += room(t, sun) + clock('7:00');
    const stretch = Math.sin(seg(t, 0.3, 1.6) * Math.PI);
    s += percy(520, 300, 0.75, { level: 1, t, eyes: 'happy', mouth: 'grin', armL: lerp(20, 165, stretch), armR: lerp(20, 165, stretch) });
    s += caption(640, 140, typed('Morning. Full of energy.', t, 0.3, 1.2), 34);
  } else if (t < 5.2) {
    // Doom-scroll: charge drains in steps, icons fly out of the phone
    const p = seg(t, 2.5, 5.0);
    const steps = Math.floor(p * 8) / 8, sub = (p * 8) % 1;
    const lvl = lerp(1, 0.12, clamp(steps + ease(clamp(sub * 3)) / 8));
    const mins = Math.round(lerp(0, 167, p)), hh = 7 + Math.floor(mins / 60), mm = String(mins % 60).padStart(2, '0');
    s += room(t, 1) + clock(`${hh}:${mm}`);
    s += `<circle cx="560" cy="250" r="140" fill="${P.red}" opacity="${0.10 + 0.05 * Math.sin(t * 20)}" filter="url(#glow)"/>`;
    s += percy(520, 300, 0.75, { level: lvl, t, eyes: 'wide', mouth: 'flat', look: 8, armL: 20, armR: 140 });
    // phone in right hand
    s += `<g transform="translate(592,330)"><rect x="-18" y="-32" width="36" height="64" rx="8" fill="${P.ink}" stroke="#33333b" stroke-width="3"/>
      <rect x="-13" y="-26" width="26" height="50" rx="4" fill="${['#FF7A59', '#FF4D4D', '#FFC845', '#57D68D'][Math.floor(t * 6) % 4]}"/></g>`;
    ['heart', 'play', 'bell', 'heart', 'play', 'bell', 'heart', 'play'].forEach((k, i) => {
      const a = seg(t, 2.5 + i * 0.32, 3.3 + i * 0.32);
      if (a > 0 && a < 1) s += icon(k, lerp(600, 740 + (i % 3) * 110, a), lerp(310, 200 + (i % 2) * 90, a), back(clamp(a * 3)), 1 - seg(a, 0.7, 1));
    });
    s += caption(640, 140, typed('Just checking one thing...', t, 2.4, 3.3), 34);
  } else if (t < 6.8) {
    const flash = Math.floor(t * 4) % 2 === 0;
    s += room(t, 1) + clock('9:47');
    s += percy(520, 300, 0.75, { level: 0.03, t, lid: 0.6, mouth: 'wobble', armL: 5, armR: 5, rot: Math.sin(t * 2) * 3 });
    s += `<rect width="${W}" height="${H}" fill="none" stroke="${P.red}" stroke-width="40" opacity="${flash ? 0.6 : 0.15}"/>`;
    s += caption(640, 140, typed('9:47 AM. Already exhausted.', t, 5.3, 6.1), 34, { fill: P.red });
  } else if (t < 8.0) {
    const f = ease(seg(t, 6.9, 7.5));
    s += room(t, 1) + clock('9:47');
    s += percy(lerp(520, 470, f), lerp(300, 500, f), 0.75, { level: 0, dead: true, t, mouth: 'flat', armL: 0, armR: 0, rot: lerp(0, -80, f) });
    s += `<rect width="${W}" height="${H}" fill="#000" opacity="${0.45 * f}"/>`;
    s += txt(900, 330, 'Done for today.', 44, P.cream, { op: seg(t, 7.0, 7.3) });
  } else {
    const p1 = back(seg(t, 8.05, 8.4)), p2 = back(seg(t, 8.35, 8.7));
    s += `<g transform="translate(470,300) scale(${p1})">${stitle(0, 0, "WHY YOU'RE", 84)}${stitle(0, 95, 'ALWAYS', 84)}</g>`;
    s += `<g transform="translate(470,500) scale(${p2})" filter="url(#hard)"><rect x="-170" y="-80" width="340" height="120" rx="14" fill="${P.red}" stroke="${P.ink}" stroke-width="7"/>${txt(0, 20, 'TIRED', 96, P.cream)}</g>`;
    s += percy(1020, 330, 0.72, { level: 0.03, t, lid: 0.6, mouth: 'wobble', armL: 5, armR: 5, rot: -8 });
  }
  const cut = [5.2, 6.8, 8.0].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.06)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(cut, 1 - seg(t, 0, 0.25), seg(t, 9.7, 10))), t);
}
