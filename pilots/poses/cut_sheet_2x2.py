"""Cut 2x2 pose sheet. Background = pixels the flood fill reaches in BOTH the exact image and a version with
thickened outlines (closed gaps). Exact edges where the outline is intact, no lost head where it has a gap."""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
src, out, names = sys.argv[1], sys.argv[2], sys.argv[3:]
im = Image.open(src).convert('RGB'); W, H = im.size
quads = [(0, 0, W // 2, H // 2), (W // 2, 0, W, H // 2), (0, H // 2, W // 2, H), (W // 2, H // 2, W, H)]
mark = (255, 0, 255)
def bgmask(work, rgb):
    w, h = work.size
    for x in range(0, w, 7):
        for y in (0, h - 1):
            if work.getpixel((x, y)) != mark: ImageDraw.floodfill(work, (x, y), mark, thresh=62)
    for y in range(0, h, 7):
        for x in (0, w - 1):
            if work.getpixel((x, y)) != mark: ImageDraw.floodfill(work, (x, y), mark, thresh=62)
    bg = np.all(np.asarray(work) == mark, axis=2)
    c = np.asarray(rgb).astype(int); ok = (c.mean(2) > 175) & ((c.max(2) - c.min(2)) < 30); ok[: int(h * 0.8)] = False
    for _ in range(400):
        g = bg.copy(); g[1:] |= bg[:-1]; g[:-1] |= bg[1:]; g[:, 1:] |= bg[:, :-1]; g[:, :-1] |= bg[:, 1:]; g &= (ok | bg)
        if (g == bg).all(): break
        bg = g
    return bg
for q, n in zip(quads, names):
    rgb = im.crop(q)
    exact = bgmask(rgb.copy(), rgb)
    closed = bgmask(Image.merge('RGB', [rgb.convert('L').filter(ImageFilter.MinFilter(7))] * 3), rgb)
    # grow the closed background back to the exact edge: exact-bg pixels within 6 px of closed-bg
    near = Image.fromarray((closed * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(13))
    bg = exact & (np.asarray(near) > 0)
    a = Image.fromarray((~bg * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    o = rgb.convert('RGBA'); o.putalpha(a); bb = o.getbbox(); w, h = rgb.size
    o = o.crop((max(0, bb[0] - 6), max(0, bb[1] - 6), min(w, bb[2] + 6), min(h, bb[3] + 6)))
    o.save(f'{out}/milo_{n}.png'); print(n, o.size)
