// Character sheet: Percy in five charge states + palette.
function render(t) {
  let s = stitle(640, 78, 'PERCY', 64) + txt(640, 118, 'his head is a battery — you always see how much he has left', 24, P.cream, { weight: 600, op: 0.8 });
  const states = [
    { level: 1, eyes: 'happy', mouth: 'grin', armL: 150, armR: 150, label: 'FULL' },
    { level: 0.6, mouth: 'smile', label: 'OKAY' },
    { level: 0.15, lid: 0.45, mouth: 'flat', armL: 5, armR: 5, label: 'LOW' },
    { level: 0.03, lid: 0.6, mouth: 'wobble', armL: 0, armR: 0, rot: -6, label: '3%' },
    { level: 0, dead: true, mouth: 'flat', armL: 0, armR: 0, rot: 8, label: 'SHUTDOWN' },
  ];
  states.forEach((o, i) => {
    const x = 160 + i * 240;
    s += `<ellipse cx="${x}" cy="540" rx="95" ry="14" fill="${P.ink}" opacity="0.35"/>`;
    s += percy(x, 330, 0.62, { ...o, t: t + i });
    s += caption(x, 680, o.label, 26);
  });
  const sw = [P.bg, P.cream, P.coral, P.mustard, P.green, P.red];
  sw.forEach((c, i) => { s += `<rect x="${1040 + i * 36}" y="30" width="30" height="30" rx="6" fill="${c}" stroke="${P.ink}" stroke-width="3"/>`; });
  return sframe(s, t);
}
