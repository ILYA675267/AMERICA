// Act 0 — hook (20 s): the phone buzzes in the dark, Milo can't resist, freeze, "Tonight, you'll try. With him.", title.
const DUR = 20;
const MX = 640, MY = 400, MS = 0.9;

function render(t) {
  let s = '';
  const buzzAt = [0.6, 1.9, 3.2, 5.6, 7.4];
  const buzz = Math.max(...buzzAt.map(b => (t >= b && t < b + 0.45) ? 1 - (t - b) / 0.45 : 0));
  const lit = Math.max(buzz, ...buzzAt.map(b => (t >= b ? Math.max(0, 1 - (t - b) / 1.4) : 0)));
  const frozen = t >= 10 && t < 12;
  const tt = frozen ? 10 : t;  // animation time (frozen during the freeze-frame)
  if (t < 17) {
    const room = ease(seg(t, 4.2, 5.6));  // room fades in from darkness
    const reach = ease(seg(tt, 6.2, 9.8)) * (1 - ease(seg(t, 12.2, 13.0)));
    const turn = ease(seg(t, 12.6, 13.3));
    let sc = '';
    sc += `<g opacity="${room}">${roomBack(tt, room)}</g>`;
    sc += `<ellipse cx="${MX}" cy="640" rx="120" ry="14" fill="#000" opacity="${0.4 * room}"/>`;
    const hand = [lerp(52, 190, reach), lerp(130, 235, reach)];
    sc += `<g opacity="${room}">${milo(MX + reach * 10, MY, MS, {
      level: 0.35, t: tt, pose: 'sit', look: lerp(18, 0, turn), eyes: reach > 0.3 && turn < 0.5 ? 'wide' : undefined,
      mouth: turn > 0.5 ? 'smile' : reach > 0.3 ? 'o' : 'flat', sweat: reach * (1 - turn), rot: reach * 8 * (1 - turn),
      armL: 10, handR: turn > 0.5 ? undefined : hand, armR: lerp(12, 150, seg(t, 14.6, 15.0)) * (1 - seg(t, 15.8, 16.3)),
    })}${chairFront()}</g>`;
    sc += floorPhone(830, 626, tt, lit, buzz);
    sc += `<g opacity="${room}">${roomLight(tt, room)}${dust(tt, 200, 200, 600, 400, 30, '#ffe2a8', 0.45)}</g>`;
    sc += shade('sh0', 640, 420, 0.7, 0.6 + 0.3 * (1 - room)) + vignette();
    const z = frozen ? lerp(1.12, 1.18, seg(t, 10, 12)) : lerp(1.0, 1.08, seg(t, 4, 10));
    s += cam(sc, z, 760, 520);
    if (frozen) {  // freeze-frame: desaturate + red line
      s += `<rect width="${W}" height="${H}" fill="#808080" style="mix-blend-mode:saturation"/><rect width="${W}" height="${H}" fill="#000" opacity="0.25"/>`;
      s += `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${P.red}" stroke-width="10" opacity="0.6"/>`;
    }
    s += big('Most people can\'t do nothing', t, 0.9, 4.6, 300, 52);
    s += big('for 60 seconds.', t, 2.3, 4.6, 380, 52, P.mustard);
    s += big('Not even once.', t, 10.1, 12.0, 140, 60, P.cream);
    s += line('Tonight, you\'ll try.', t, 12.8, 16.8, 668, 40);
    s += big('With him.', t, 14.3, 16.8, 140, 56, P.mustard);
  } else {
    // title card
    const p = seg(t, 17, 20);
    s += `<rect width="${W}" height="${H}" fill="#0c0c10"/>` + glow(640, 330, 280, '#ffb35c', 0.08 + 0.04 * Math.sin(t * 2));
    s += dust(t, 200, 100, 880, 520, 40, '#ffe2a8', 0.4);
    const word = 'NOTHING.';
    const tsp = [...word].map((ch, i) => { const a = 17.2 + i * 0.09, k = seg(t, a, a + 0.3);
      return `<tspan opacity="${k}" dy="${i ? 0 : 0}" fill="${i === 7 ? P.mustard : P.cream}">${ch}</tspan>`; }).join('');
    s += `<g transform="translate(640,350) scale(${lerp(0.92, 1, ease(seg(t, 17.2, 18.2)))})"><text x="0" y="0" font-family="Inter" font-weight="900" font-size="130" text-anchor="middle">${tsp}</text></g>`;
    s += `<g opacity="${seg(t, 18.2, 18.8)}">${txt(640, 420, 'AN ANIMATED SHORT FILM', 24, P.dim, { weight: 700, ls: 6 })}</g>`;
    s += milo(640, 560, 0.42 * back(seg(t, 17.6, 18.0)), { level: 0.35, t, pose: 'sit', mouth: 'flat', look: 8 });
  }
  const cut = [17].map(c => Math.max(0, 1 - Math.abs(t - c) / 0.12)).reduce((a, b) => Math.max(a, b), 0);
  return sframe(s + fade(Math.max(cut, seg(t, 19.4, 20))), t, '#000');
}
