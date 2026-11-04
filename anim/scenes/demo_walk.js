// Demo: the hero walks along his street (side view), camera tracks him.
const DURATION = 8;
const HS = 0.3, X0 = 520;
buildStreet();
fn(t => heroWalk(X0 + heroWalkX(t, HS), SIDEWALK_Y, HS, t, { blink: true }));

function render(t) {
  beginFrame();
  const hx = X0 + heroWalkX(t, HS);
  setCamera(hx + 30, SIDEWALK_Y - 80, 3.4);
  drawWorld(t);
  endFrame();
}
