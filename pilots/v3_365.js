// Pilot 3: "The 365 Project" — serialized transformation story. Accent: green.
const GREEN = '#3DDC84';

function runner(x, y, s, t, col, eyes) {
  const ph = t * 14, bob = Math.abs(Math.sin(ph)) * 14;
  const leg = a => `<path d="M0 250 l${Math.sin(ph + a) * 50} 90" stroke="${OUT}" stroke-width="30" stroke-linecap="round"/>
    <path d="M0 250 l${Math.sin(ph + a) * 50} 90" stroke="${col}" stroke-width="20" stroke-linecap="round"/>`;
  return `<g transform="translate(${x},${y - bob}) scale(${s})">${leg(0)}${leg(Math.PI)}</g>` +
    bean(x, y - bob, s, { color: col, eyes, mouth: 'flat', rot: 6,
      hat: `<rect x="-100" y="-62" width="200" height="22" fill="${GREEN}" stroke="${OUT}" stroke-width="4"/>` });
}

function render(t) {
  let s = '', bg = '#101010';
  if (t < 3.0) {
    // Day 1: slumped, spotlight, grey
    s += `<path d="M640 0 L480 620 L800 620 Z" fill="#fff" opacity="0.05"/>
      <ellipse cx="640" cy="620" rx="200" ry="22" fill="#fff" opacity="0.05"/>`;
    s += bean(640, 470, 0.7, { color: '#8a8a8a', eyes: 'sad', mouth: 'sad', rot: -6 + Math.sin(t * 2) * 2 });
    s += txt(60, 60, 'DAY 1', 30, '#777', { anchor: 'start', weight: 700 });
    s += txt(640, 140, typed('He was tired of being tired.', t, 0.4, 1.6), 44, '#fff', { weight: 500 });
    s += fade(seg(t, 2.8, 3.0));
  } else if (t < 6.6) {
    // Montage: counter races 1 -> 365, colour returns
    const p = seg(t, 3.0, 6.4), day = Math.max(1, Math.round(365 * ease(p)));
    bg = mix('#101010', '#1b2a4a', p);
    let lines = '';
    for (let i = 0; i < 8; i++) {
      const x = ((i * 190) - (t * 900) % 190 + 1400) % 1520 - 120;
      lines += `<line x1="${x}" y1="${560 + (i % 3) * 18}" x2="${x + 80}" y2="${560 + (i % 3) * 18}" stroke="#fff" stroke-width="4" opacity="0.15"/>`;
    }
    s += lines + `<line x1="0" y1="610" x2="${W}" y2="610" stroke="#333" stroke-width="4"/>`;
    s += runner(640, 330, 0.7, t, mix('#8a8a8a', '#f2efe6', p), p > 0.5 ? 'angry' : 'open');
    s += txt(640, 170, `DAY ${day}`, 110, mix('#777777', GREEN, p));
    const caption = p < 0.33 ? 'Some days were hard.' : p < 0.66 ? 'Most days were boring.' : 'He showed up anyway.';
    s += txt(640, 680, caption, 34, '#ddd', { weight: 500 });
    s += fade(1 - seg(t, 3.0, 3.2));
  } else if (t < 8.4) {
    // Day 365: summit at sunrise
    const p = ease(seg(t, 6.6, 7.4));
    s += `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a4a"/><stop offset="1" stop-color="#ff8a3d"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#sky)"/>
      <circle cx="640" cy="${lerp(700, 520, p)}" r="120" fill="#ffd27a" opacity="0.9"/>
      <path d="M0 720 L0 600 Q320 470 640 500 Q960 470 1280 600 L1280 720 Z" fill="#0d0d0d"/>`;
    s += bean(640, 330, 0.62, { eyes: 'happy', mouth: 'smile',
      hat: `<rect x="-100" y="-62" width="200" height="22" fill="${GREEN}" stroke="${OUT}" stroke-width="4"/>`,
      extra: `<path d="M-60 120 L-150 ${lerp(160, -40, p)} M60 120 L150 ${lerp(160, -40, p)}" stroke="${OUT}" stroke-width="34" stroke-linecap="round"/><path d="M-60 120 L-150 ${lerp(160, -40, p)} M60 120 L150 ${lerp(160, -40, p)}" stroke="#f2efe6" stroke-width="24" stroke-linecap="round"/>` });
    s += txt(640, 120, 'DAY 365', 90, GREEN);
    s += txt(640, 180, typed('Same guy. New habits.', t, 7.0, 7.8), 38, '#fff', { weight: 500 });
  } else {
    const p1 = back(seg(t, 8.4, 8.75)), p2 = back(seg(t, 8.75, 9.1));
    s += `<g transform="translate(640,320) scale(${p1})">${txt(0, 0, 'THE 365 PROJECT', 96, '#fff')}</g>`;
    s += `<g transform="translate(640,450) scale(${p2})"><rect x="-200" y="-60" width="400" height="90" fill="${GREEN}"/>${txt(0, 12, 'EPISODE 1', 60, '#101010')}</g>`;
  }
  const cut = [6.6, 8.4].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.06)).reduce((a, b) => Math.max(a, b), 0);
  return frame(s + fade(Math.max(cut, 1 - seg(t, 0, 0.25), seg(t, 9.7, 10))), bg);
}
