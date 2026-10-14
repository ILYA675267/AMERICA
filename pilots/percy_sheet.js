// Character sheet: Percy in five charge states + palette.
function render(t) {
  let s = stitle(640, 78, 'MILO', 64, P.cream, null) + txt(640, 118, 'the sprout on his head shows how he is really doing', 24, P.cream, { weight: 600, op: 0.8 });
  const states = [
    { level: 1, eyes: 'happy', mouth: 'grin', armL: 150, armR: 150, label: 'ENERGIZED' },
    { level: 0.6, mouth: 'smile', label: 'OKAY' },
    { level: 0.15, lid: 0.45, mouth: 'flat', armL: 5, armR: 5, label: 'TIRED' },
    { level: 0.03, lid: 0.6, mouth: 'wobble', armL: 0, armR: 0, rot: -6, label: 'EXHAUSTED' },
    { level: 0, dead: true, mouth: 'flat', armL: 0, armR: 0, rot: 8, label: 'DONE' },
  ];
  states.forEach((o, i) => {
    const x = 160 + i * 240;
    s += `<ellipse cx="${x}" cy="560" rx="80" ry="12" fill="#000" opacity="0.5"/>`;
    s += percy(x, 330, 0.62, { ...o, t: t + i });
    s += txt(x, 640, o.label, 26, [P.green, P.green, P.mustard, P.red, P.dim][i], { weight: 800 });
  });
  const sw = [P.bg, P.cream, P.green, P.mustard, P.red];
  sw.forEach((c, i) => { s += `<rect x="${1076 + i * 36}" y="30" width="30" height="30" rx="6" fill="${c}" stroke="#33333b" stroke-width="3"/>`; });
  return sframe(s, t);
}
