"""Upscale cartoon images x4 with Real-ESRGAN anime (CPU, tiled), then fit to 1920x1080 or 2560x1440.

Usage: python3 pilots/tools/upscale.py <model.pth> <out_width> <in1> [<in2> ...]   -> writes <name>_hd.jpg next to input
Model: RealESRGAN_x4plus_anime_6B.pth (github.com/xinntao/Real-ESRGAN releases).
"""
import os
import sys

import numpy as np
import torch
from PIL import Image
from spandrel import ModelLoader

model_path, out_w, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
torch.set_num_threads(os.cpu_count() or 4)
model = ModelLoader().load_from_file(model_path).eval()
scale = model.scale


def run(img, tile=256, pad=16):
    x = torch.from_numpy(np.asarray(img).astype(np.float32) / 255).permute(2, 0, 1)[None]
    _, _, h, w = x.shape
    out = torch.zeros(1, 3, h * scale, w * scale)
    for y0 in range(0, h, tile):
        for x0 in range(0, w, tile):
            ya, yb, xa, xb = max(0, y0 - pad), min(h, y0 + tile + pad), max(0, x0 - pad), min(w, x0 + tile + pad)
            with torch.no_grad():
                o = model(x[:, :, ya:yb, xa:xb])
            ty, tx = (y0 - ya) * scale, (x0 - xa) * scale
            th, tw = min(tile, h - y0) * scale, min(tile, w - x0) * scale
            out[:, :, y0 * scale:y0 * scale + th, x0 * scale:x0 * scale + tw] = o[:, :, ty:ty + th, tx:tx + tw]
    return Image.fromarray((out[0].permute(1, 2, 0).clamp(0, 1).numpy() * 255).round().astype(np.uint8))


for f in files:
    im = Image.open(f).convert('RGB')
    up = run(im)
    out_h = round(out_w * 9 / 16)
    # cover-fit to exact 16:9 (crop the few extra pixels from the centre)
    s = max(out_w / up.width, out_h / up.height)
    up = up.resize((round(up.width * s), round(up.height * s)), Image.LANCZOS)
    l, t = (up.width - out_w) // 2, (up.height - out_h) // 2
    up = up.crop((l, t, l + out_w, t + out_h))
    dst = os.path.splitext(f)[0] + '_hd.jpg'
    up.save(dst, quality=95, subsampling=0)
    print(dst, up.size, flush=True)
