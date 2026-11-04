// Channel avatar: the hero's face with a $ coin, on a yellow circle. Rendered 1920x1080, center 1080x1080 crop -> 800x800.
const DURATION = 0.04;
function render(t) {
  beginFrame(); setCamera(960, 540, 1);
  ctx.fillStyle = '#ffd34d'; ctx.beginPath(); ctx.arc(960, 540, 540, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(224,168,40,0.6)'; ctx.lineWidth = 14; ctx.lineCap = 'round';
  for (let k = 0; k < 16; k++) { const a = k / 16 * 6.28; ctx.beginPath(); ctx.moveTo(960 + Math.cos(a) * 400, 540 + Math.sin(a) * 400); ctx.lineTo(960 + Math.cos(a) * 480, 540 + Math.sin(a) * 480); ctx.stroke(); }
  heroFront(930, 1380, 2.6, { face: 'grin', armR: [160, -330], armL: [-150, -150] });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  coin(1290, 520, 120); at(1290, 520, 1, 0, () => marker('$', 0, 6, 150, { color: '#7a5b12' }));
  endFrame();
}
