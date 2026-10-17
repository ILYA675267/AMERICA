// Thumbnail for "The Small Things She'll Remember Forever". Render one frame with SCALE=2.
function render(t) {
  t = 0.6;
  let s = `<defs><radialGradient id="tbg" cx="0.36" cy="0.6" r="0.7"><stop offset="0" stop-color="#3a2a1c"/><stop offset="0.45" stop-color="#141626"/><stop offset="1" stop-color="#06070c"/></radialGradient>
    <radialGradient id="jarGlow"><stop offset="0" stop-color="#ffe7a8" stop-opacity="0.95"/><stop offset="0.5" stop-color="#ffc56a" stop-opacity="0.45"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>
    <clipPath id="jarIn"><rect x="-108" y="-140" width="216" height="290" rx="48"/></clipPath></defs>
    <rect width="${W}" height="${H}" fill="url(#tbg)"/>`;
  // fireflies drifting around
  for (let i = 0; i < 26; i++) s += firefly((i * 137.3) % W, 40 + (i * 83.1) % 640, t + i, i, 0.6 + (i % 3) * 0.25);
  // old Mia, big, tear of joy, holding the jar to her chest
  s += `<ellipse cx="400" cy="740" rx="330" ry="60" fill="#000" opacity="0.5"/>`;
  s += her(400, 262, 2.05, { ...OLD_MIA, pose: 'stand', eyes: 'happy', mouth: 'smile', look: 6, handL: [-30, 200], handR: [30, 200],
    extra: `<path d="M-46 12 q-6 16 0 26 q8 -6 0 -26 Z" fill="#8fd0ff" stroke="${INK}" stroke-width="3"/><path d="M48 14 q-6 14 0 22 q7 -5 0 -22 Z" fill="#8fd0ff" stroke="${INK}" stroke-width="3" opacity="0.8"/>` });
  // the glowing jar in front of her, a tiny memory inside (young Milo & Mia under the yellow umbrella)
  s += `<circle cx="420" cy="630" r="330" fill="url(#jarGlow)" style="mix-blend-mode:screen"/>`;
  s += `<g transform="translate(425,612) rotate(-6) scale(0.92)">
    <rect x="-112" y="-144" width="224" height="298" rx="52" fill="#fff3d6" fill-opacity="0.22" stroke="#fff4dc" stroke-width="7"/>
    <g clip-path="url(#jarIn)"><rect x="-120" y="-150" width="240" height="310" fill="#ffd27a" opacity="0.28"/>
      <g transform="translate(0,20) scale(0.36)">${milo(-80, 0, 1, { level: 1, t, eyes: 'happy', mouth: 'grin', handR: [90, 90] })}${her(90, 0, 1, { eyes: 'happy', mouth: 'smile', handL: [-92, 90] })}
        <g transform="translate(0,-190)"><path d="M-170 0 Q0 -140 170 0 Q115 -22 57 0 Q0 -22 -57 0 Q-115 -22 -170 0 Z" fill="${P.mustard}" stroke="${INK}" stroke-width="9"/><path d="M0 -70 V200" stroke="${INK}" stroke-width="9"/></g></g>
      ${[[-70, -100], [60, -110], [-40, 110], [70, 90], [0, -60], [-80, 30], [85, -20]].map(([x, y], i) => firefly(x, y, t + i, i, 0.9)).join('')}</g>
    <rect x="-80" y="-176" width="160" height="40" rx="10" fill="#7a5638" stroke="${INK}" stroke-width="6"/>
    <path d="M-80 -110 Q-88 0 -80 110" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.5"/></g>`;
  // headline
  const hl = (y, str, col, size = 118) => txt(1220 + 6, y + 6, str, size, '#000', { anchor: 'end', op: 0.55 }) + txt(1220, y, str, size, col, { anchor: 'end' });
  s += hl(170, 'SHE NEVER', P.cream) + hl(300, 'FORGOT', P.mustard, 140);
  s += `<g transform="translate(1100,350)"><rect x="-230" y="-34" width="250" height="62" rx="14" fill="#16161a" stroke="#f1ede4" stroke-opacity="0.4" stroke-width="3"/>${txt(-105, 9, '40 YEARS LATER', 30, P.cream, { weight: 900 })}</g>`;
  // red arrow pointing at the jar
  s += `<path d="M960 440 Q860 540 660 560" stroke="#16161a" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M960 440 Q860 540 660 560" stroke="${P.red}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M690 520 L630 562 L694 598" stroke="#16161a" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M690 520 L630 562 L694 598" stroke="${P.red}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${styleDefs(0)}${s}${grain(0.035)}</svg>`;
}
