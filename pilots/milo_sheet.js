// Character sheet for the hand-drawn chibi Milo (milo() in style.js).
function render(t) {
  let s = stitle(640, 70, 'MILO', 56) + txt(640, 108, 'small, round, cartoon — the sprout shows his energy', 24, P.cream, { weight: 600, op: 0.8 });
  const st = [
    { level: 1, eyes: 'happy', mouth: 'grin', armL: 160, armR: 160, label: 'DAY 1' },
    { level: 0.7, mouth: 'smile', label: 'OKAY' },
    { level: 0.35, lid: 0.45, bags: 0.6, mouth: 'flat', label: 'TIRED' },
    { level: 0, dead: true, lid: 0.6, bags: 1, mouth: 'sad', pose: 'sit', label: 'DAY 47' },
  ];
  st.forEach((o, i) => {
    const x = 200 + i * 290;
    s += `<ellipse cx="${x}" cy="${o.pose === 'sit' ? 540 : 555}" rx="85" ry="12" fill="#000" opacity="0.5"/>`;
    s += milo(x, o.pose === 'sit' ? 360 : 360, 1, { ...o, t: t + i });
    s += txt(x, 630, o.label, 26, [P.green, P.green, P.mustard, P.red][i], { weight: 800 });
  });
  return sframe(s, t);
}
