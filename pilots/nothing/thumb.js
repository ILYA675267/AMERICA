// Thumbnail for "NOTHING": huge sweating Milo vs. a glowing phone that reaches for him. Render with SCALE=2.
function render(t) {
  const ink = '#16161a';
  let s = `<defs>
    <radialGradient id="warm" cx="0.33" cy="0.55" r="0.55"><stop offset="0" stop-color="#ffb35c" stop-opacity="0.55"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>
    <radialGradient id="blue" cx="0.76" cy="0.72" r="0.42"><stop offset="0" stop-color="#3fa2ff" stop-opacity="0.75"/><stop offset="1" stop-color="#3fa2ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe4ff"/><stop offset="1" stop-color="#4aa6ff"/></linearGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter></defs>
    <rect width="${W}" height="${H}" fill="#0f0f15"/><rect width="${W}" height="${H}" fill="url(#warm)"/><rect width="${W}" height="${H}" fill="url(#blue)"/>`;
  // floor line
  s += `<rect y="640" width="${W}" height="80" fill="#0a0a0e" opacity="0.6"/>`;
  // phone: glowing, buzzing, with a tiny grabbing arm towards Milo
  s += `<g transform="translate(960,505) rotate(14)">
    <rect x="-95" y="-165" width="190" height="330" rx="30" fill="#3fa2ff" filter="url(#soft)" opacity="0.9"/>
    <rect x="-90" y="-160" width="180" height="320" rx="28" fill="#1b1c24" stroke="${ink}" stroke-width="8"/>
    <rect x="-76" y="-144" width="152" height="288" rx="18" fill="url(#scr)"/>
    ${[0, 1, 2, 3].map(i => `<rect x="-64" y="${-126 + i * 66}" width="128" height="52" rx="12" fill="#fff" opacity="0.95"/>
      <circle cx="-40" cy="${-100 + i * 66}" r="15" fill="${[P.red, '#ff4fa3', P.mustard, P.green][i]}"/>
      <rect x="-18" y="${-110 + i * 66}" width="70" height="9" rx="4" fill="#9aa3b5"/><rect x="-18" y="${-94 + i * 66}" width="48" height="9" rx="4" fill="#c8cfdb"/>`).join('')}
    <circle cx="82" cy="-152" r="38" fill="${P.red}" stroke="${ink}" stroke-width="6"/>${txt(82, -139, '99+', 30, '#fff', { weight: 900 })}
    </g>`;
  // buzz lines
  s += [[-1, 0], [1, 0]].map(([d]) => `<g stroke="#bfe4ff" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.9">
    <path d="M${960 + d * 150} 400 q${d * 22} 30 0 60"/><path d="M${960 + d * 182} 380 q${d * 30} 50 0 100"/></g>`).join('');
  // tiny arm reaching from the phone to Milo
  s += `<path d="M860 520 Q730 440 630 470" stroke="${ink}" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path d="M860 520 Q730 440 630 470" stroke="#2a2c38" stroke-width="15" fill="none" stroke-linecap="round"/>
    <circle cx="624" cy="472" r="18" fill="#2a2c38" stroke="${ink}" stroke-width="6"/>`;
  // Milo, huge, sweating, eyes wide, leaning away
  s += `<ellipse cx="380" cy="700" rx="230" ry="30" fill="#000" opacity="0.5"/>`;
  s += milo(380, 400, 2.15, { level: 0.55, t: 0.4, eyes: 'wide', look: 9, mouth: 'shock', sweat: 1, rot: -7, armL: 25, armR: 40 });
  // second sweat drop and shake marks
  s += `<path d="M168 300 q10 15 0 22 q-10 -7 0 -22 z" fill="#9fd8ff" stroke="${ink}" stroke-width="3.5" transform="scale(1.6) translate(-60,-120)"/>
    <g stroke="#f1ede4" stroke-width="8" stroke-linecap="round" opacity="0.85"><path d="M150 300 l-40 -14 M140 360 l-44 4 M170 245 l-30 -26"/></g>`;
  // text
  s += `<g transform="translate(1190,120)">${txt(0, 0, "DON'T", 112, '#000', { anchor: 'end', op: 0.6 }).replace('<text', '<text dx="6" dy="6"')}${txt(0, 0, "DON'T", 112, P.cream, { anchor: 'end' })}
    ${txt(0, 112, 'TOUCH IT.', 112, '#000', { anchor: 'end', op: 0.6 }).replace('<text', '<text dx="6" dy="6"')}${txt(0, 112, 'TOUCH IT.', 112, P.mustard, { anchor: 'end' })}</g>`;
  s += `<g transform="translate(170,105) rotate(-6)"><rect x="-120" y="-62" width="240" height="110" rx="22" fill="${P.red}" stroke="${ink}" stroke-width="8"/>
    ${txt(0, 28, '0:60', 88, '#fff', { weight: 900 })}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${styleDefs(0)}${s}${grain(0.04)}</svg>`;
}
