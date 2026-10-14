"""Cut a character off a flat (green) background: flood-fill from the borders with a colour tolerance, so inner
green details (the sprout leaves) survive, then feather the edge, kill green spill and crop to the bounding box.
Usage: python3 -I pilots/ai/cutout.py <in.png> <out.png> [thresh]"""
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
thresh = int(sys.argv[3]) if len(sys.argv) > 3 else 85
im = Image.open(src).convert("RGB")
w, h = im.size
marker = (255, 0, 255)
work = im.copy()
for x, y in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
    if work.getpixel((x, y)) != marker:
        ImageDraw.floodfill(work, (x, y), marker, thresh=thresh)
a = np.array(work)
mask = ~np.all(a == marker, axis=2)
# drop the green ground shadow: green-dominant pixels in the lower third (the sprout leaves are at the top)
c = np.array(im).astype(int)
greenish = (c[..., 1] > c[..., 0] + 20) & (c[..., 1] > c[..., 2] + 20)
low = np.zeros_like(mask); low[int(h * 0.62):] = True
mask &= ~(greenish & low)
alpha = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
rgb = np.array(im).astype(np.float32)
al = np.array(alpha).astype(np.float32) / 255
# green spill: on semi-transparent edge pixels pull green down to max(red, blue)
edge = (al > 0) & (al < 0.98)
g_cap = np.maximum(rgb[..., 0], rgb[..., 2])
rgb[..., 1] = np.where(edge, np.minimum(rgb[..., 1], g_cap), rgb[..., 1])
out = Image.fromarray(np.dstack([rgb, al * 255]).clip(0, 255).astype(np.uint8), "RGBA")
out = out.crop(out.getbbox())
out.save(dst)
print(dst, out.size)
