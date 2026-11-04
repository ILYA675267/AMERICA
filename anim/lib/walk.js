// Side-view walk cycle for the hero (facing right), proportions taken from whatif/hero_reference.jpg:
// wide oval head (rx:ry = 1.25), two dot eyes set wide apart, simple smile, no neck, body widening downward,
// thick short legs that continue the body, rounded shoes, thin arms with round mitten hands; all white, one black outline.
// Classic cycle: contact - down - passing - up. The stance foot is locked to the ground, so feet never slide.
// Local units: ground at y = 0, head ry = 100.
const WALK = {
  thigh: 44, shin: 42, hipY: -92, stride: 78, lift: 22, period: 1.0,     // seconds per full cycle (two steps)
  legW: 36, armW: 15, arm: 82, torsoH: 116, torsoTop: 62, torsoBot: 104,
  headRx: 125, headRy: 100, bob: 7, line: 6,
};
const walkSpeed = () => 2 * WALK.stride / WALK.period;      // one stride per half cycle
const heroWalkX = (t, scale) => walkSpeed() * t * scale;

function ik2(hx, hy, fx, fy, a, b) {
  const dx = fx - hx, dy = fy - hy; let d = Math.hypot(dx, dy);
  d = Math.min(d, a + b - 0.5);
  const base = Math.atan2(dy, dx), A = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
  const k1 = [hx + Math.cos(base - A) * a, hy + Math.sin(base - A) * a], k2 = [hx + Math.cos(base + A) * a, hy + Math.sin(base + A) * a];
  return { knee: k1[0] > k2[0] ? k1 : k2, foot: [hx + Math.cos(base) * d, hy + Math.sin(base) * d] };   // knee bends forward
}

// foot relative to hip at phase p: 0..0.5 stance (moves back at walk speed), 0.5..1 swing (lifts and comes forward)
function footAt(p) {
  const S = WALK.stride;
  if (p < 0.5) { const u = p / 0.5; return { x: S / 2 - S * u, y: 0, ang: u > 0.75 ? -(u - 0.75) / 0.25 * 0.4 : 0 }; }
  const u = (p - 0.5) / 0.5;
  return { x: -S / 2 + S * ease(u), y: -Math.sin(u * Math.PI) * WALK.lift, ang: -0.12 * Math.sin(u * Math.PI) };
}

const LW = () => WALK.line * HERO_LINE;
function tube(pts, w) {          // white limb with black outline
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
  ctx.strokeStyle = C.ink; ctx.lineWidth = w + 2 * LW(); ctx.stroke();
  ctx.strokeStyle = C.white; ctx.lineWidth = w; ctx.stroke();
}
function shoe(x, y, ang) {       // rounded shoe, sole flat on the ground, toe forward
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath(); ctx.moveTo(-20, 0); ctx.bezierCurveTo(-24, -20, -6, -26, 8, -24); ctx.bezierCurveTo(34, -22, 40, -8, 36, 0); ctx.closePath();
  ctx.fillStyle = C.white; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = LW(); ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}

// Draw the walking hero at world (x, groundY), scale s, time t. o.blink adds an occasional blink.
function heroWalk(x, groundY, s, t, o = {}) {
  const p = ((t / WALK.period) % 1 + 1) % 1;
  const bob = -WALK.bob * (1 - Math.cos(p * 4 * Math.PI)) / 2;          // body is highest at the passing poses
  ctx.save(); ctx.translate(x, groundY); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(70,70,75,0.16)'; ctx.beginPath(); ctx.ellipse(6, 3, 70 + bob * 1.5, 10, 0, 0, 7); ctx.fill();
  const hipY = WALK.hipY + bob, topY = hipY - WALK.torsoH;
  const shoulder = [8, topY + 26];
  const arm = ph => {                                                    // ph: arm phase, cos > 0 = forward
    const sw = Math.cos(ph * 2 * Math.PI) * 0.75, ang = Math.PI / 2 - sw;
    const bend = 0.2 + Math.max(0, sw) * 0.55;
    const el = [shoulder[0] + Math.cos(ang) * WALK.arm * 0.5, shoulder[1] + Math.sin(ang) * WALK.arm * 0.5];
    const hd = [el[0] + Math.cos(ang - bend) * WALK.arm * 0.5, el[1] + Math.sin(ang - bend) * WALK.arm * 0.5];
    tube([shoulder, el, hd], WALK.armW);
    ctx.beginPath(); ctx.arc(hd[0], hd[1], 15, 0, 7); ctx.fillStyle = C.white; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = LW(); ctx.stroke();
  };
  const leg = (ph, dx) => {
    const f = footAt(ph);
    const { knee, foot } = ik2(dx, hipY, f.x + dx, f.y - 14, WALK.thigh, WALK.shin);
    tube([[dx, hipY - 10], [dx, hipY], knee, foot], WALK.legW);
    shoe(foot[0] + 4, foot[1] + 14, f.ang);
  };
  arm(p + 1);                 // back arm: forward when the front leg is forward
  leg((p + 0.5) % 1, -10);    // back leg
  leg(p, 10);                 // front leg
  // torso: no neck, widening downward; sides outlined, bottom open so the legs read as one shape with the body
  const tt = WALK.torsoTop / 2, tb = WALK.torsoBot / 2;
  ctx.beginPath(); ctx.moveTo(-tb, hipY + 6); ctx.bezierCurveTo(-tb + 2, hipY - 50, -tt - 6, topY + 30, -tt, topY);
  ctx.lineTo(tt, topY); ctx.bezierCurveTo(tt + 6, topY + 30, tb - 2, hipY - 50, tb, hipY + 6); ctx.closePath();
  ctx.fillStyle = C.white; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-tb, hipY + 6); ctx.bezierCurveTo(-tb + 2, hipY - 50, -tt - 6, topY + 30, -tt, topY);
  ctx.moveTo(tt, topY); ctx.bezierCurveTo(tt + 6, topY + 30, tb - 2, hipY - 50, tb, hipY + 6);
  ctx.strokeStyle = C.ink; ctx.lineWidth = LW(); ctx.lineCap = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-6, hipY + 4); ctx.lineTo(6, hipY + 4); ctx.stroke();   // crotch line
  arm(p + 0.5);               // front arm: back when the front leg is forward
  // head: wide oval, slight lag and nod
  const hb = -WALK.bob * (1 - Math.cos((p - 0.06) * 4 * Math.PI)) / 2 - bob;
  ctx.save(); ctx.translate(10, topY - WALK.headRy + 18 + hb); ctx.rotate(0.025 * Math.sin(p * 4 * Math.PI));
  ctx.beginPath(); ctx.ellipse(0, 0, WALK.headRx, WALK.headRy, 0, 0, 7); ctx.fillStyle = C.white; ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = LW() * 1.1; ctx.stroke();
  const blink = o.blink && (t % 3.4) > 3.25;
  ctx.fillStyle = C.ink;
  for (const [ex, ey] of [[8, -16], [80, -22]]) {
    if (blink) { ctx.beginPath(); ctx.moveTo(ex - 9, ey); ctx.lineTo(ex + 9, ey); ctx.lineWidth = LW(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(ex, ey, 9.5, 0, 7); ctx.fill(); }
  }
  ctx.beginPath(); ctx.moveTo(18, 14); ctx.bezierCurveTo(40, 30, 74, 26, 92, 6); ctx.lineWidth = LW(); ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
  ctx.restore();
}
