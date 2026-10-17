// MiloLore channel art. render(0) = banner (render at SCALE=2 -> 2560x1440), render(1) = avatar (square at x 0..720).
// YouTube banner safe area (visible on all devices) at 1280x720 scale: x 254..1026, y 254..466.
function logo(x, y, size, t) {
  // "Milo" cream + "Lore" mustard as one word (tspans keep the real letter spacing).
  const word = (dx, dy, c1, c2, op = 1) => `<text x="${x + dx}" y="${y + dy}" font-family="Inter" font-weight="900" font-size="${size}" text-anchor="middle" opacity="${op}"><tspan fill="${c1}">Milo</tspan><tspan fill="${c2}">Lore</tspan></text>`;
  return word(5, 5, '#000', '#000', 0.5) + word(0, 0, P.cream, P.mustard);
}

function banner(t) {
  let s = `<defs><linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset="0.7" stop-color="#0f1526"/><stop offset="1" stop-color="#151a2e"/></linearGradient>
    <radialGradient id="bwarm" cx="0.5" cy="0.62" r="0.5"><stop offset="0" stop-color="#ffcf8a" stop-opacity="0.22"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bsky)"/>${stars(t, 70, 420)}`;
  // city skyline across the whole width (visible on TV/desktop), soft lit windows
  s += `<path d="M0 520 L0 430 L60 430 L60 380 L120 380 L120 450 L180 450 L180 360 L250 360 L250 470 L1030 470 L1030 400 L1090 400 L1090 350 L1150 350 L1150 430 L1210 430 L1210 380 L1280 380 L1280 520 Z" fill="#0b1020"/>`;
  for (const [x, y] of [[20, 445], [80, 395], [140, 465], [200, 375], [215, 400], [1050, 415], [1110, 365], [1125, 390], [1170, 445], [1230, 395]]) s += `<rect x="${x}" y="${y}" width="10" height="13" fill="#ffcf8a" opacity="0.5"/>`;
  s += `<rect y="520" width="${W}" height="200" fill="#0a0d16"/><rect width="${W}" height="${H}" fill="url(#bwarm)"/>`;
  // fireflies everywhere
  for (let i = 0; i < 40; i++) s += firefly((i * 151.7) % W, 60 + (i * 89.3) % 600, t + i, i, 0.5 + (i % 3) * 0.2);
  // inside the safe area: Milo (left), logo + tagline (centre), Mia (right)
  s += glw(640, 360, 300, '#ffcf8a', 0.10);
  s += `<ellipse cx="348" cy="462" rx="70" ry="10" fill="#000" opacity="0.5"/>` + milo(348, 352, 0.58, { level: 1, t, eyes: 'happy', mouth: 'grin', armL: 150, armR: 15 });
  s += `<ellipse cx="932" cy="462" rx="70" ry="10" fill="#000" opacity="0.5"/>` + her(932, 340, 0.6, { eyes: 'happy', mouth: 'smile', look: -6, armL: 15, armR: 150 });
  s += logo(640, 350, 96, t);
  s += txt(640, 408, 'Small animated stories about love, life & the little things', 18, P.cream, { weight: 700, op: 0.9 });
  return s + vign(0.55);
}

function avatar(t) {
  // drawn in a 720x720 square at the left; YouTube crops it to a circle
  let s = `<defs><radialGradient id="abg" cx="0.5" cy="0.55" r="0.6"><stop offset="0" stop-color="#2b2232"/><stop offset="0.55" stop-color="#121729"/><stop offset="1" stop-color="#070910"/></radialGradient></defs>
    <rect width="720" height="720" fill="url(#abg)"/>`;
  s += glw(360, 420, 260, '#ffcf8a', 0.22);
  for (let i = 0; i < 9; i++) s += firefly(110 + ((i * 173) % 500), 120 + ((i * 97) % 220), t + i, i, 0.7);
  s += milo(360, 430, 2.15, { level: 1, t: 0.3, eyes: 'happy', mouth: 'grin', pose: 'stand', armL: 15, armR: 15 });
  return s;
}

function render(t) {
  const inner = t < 0.5 ? banner(1.3) : avatar(1.3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${styleDefs(0)}<rect width="${W}" height="${H}" fill="#000"/>${inner}${grain(0.03)}</svg>`;
}
