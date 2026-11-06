"""Split ChatGPT pose sheets (white background) into single Milo poses with a transparent background.

Usage: python3 -I pilots/poses/extract.py   (from the repo root or anywhere)
Each sheet is split into N poses by the widest white column gaps; the white background and the soft grey ground
shadow are removed by flood fill from the image border (the thick black outline protects Milo's white body).
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SHEETS = {
    'sheet1.jpg': ['excited_wave', 'question_think', 'phone'],
    'sheet2_sit.jpg': ['sit_think'],
    'sheet3.jpg': ['tired_sigh', 'talking', 'walking'],
    'sheet4.jpg': ['confident', 'laptop', 'reading'],
    'sheet5.jpg': ['presenting', 'idea', 'shrug', 'laugh_laptop'],
}


def split_columns(im, n):
    """Return n (x0, x1) column ranges separated by the widest runs of near-white columns."""
    a = np.asarray(im.convert('L')).astype(int)
    ink = (a < 200).sum(0)  # dark pixels per column (outlines, eyes, props)
    empty = ink == 0
    runs, x = [], 0
    while x < len(empty):
        if empty[x]:
            s = x
            while x < len(empty) and empty[x]:
                x += 1
            runs.append((s, x))
        else:
            x += 1
    inner = [r for r in runs if r[0] > 0 and r[1] < len(empty)]
    cuts = sorted(sorted(inner, key=lambda r: r[1] - r[0], reverse=True)[:n - 1])
    edges = [0] + [(s + e) // 2 for s, e in cuts] + [im.width]
    return list(zip(edges[:-1], edges[1:]))


def cutout(im):
    rgb = im.convert('RGB')
    w, h = rgb.size
    mark = (255, 0, 255)
    work = rgb.copy()
    for x in range(0, w, 7):
        for y in (0, h - 1):
            if work.getpixel((x, y)) != mark:
                ImageDraw.floodfill(work, (x, y), mark, thresh=62)
    for y in range(0, h, 7):
        for x in (0, w - 1):
            if work.getpixel((x, y)) != mark:
                ImageDraw.floodfill(work, (x, y), mark, thresh=62)
    bg = np.all(np.asarray(work) == mark, axis=2)
    # the soft grey ground shadow: light, low-saturation pixels connected to the background (grown step by step;
    # Milo's white body is closed off by the black outline, so it is never reached)
    c = np.asarray(rgb).astype(int)
    lum, sat = c.mean(2), c.max(2) - c.min(2)
    shadow_ok = (lum > 175) & (sat < 30)
    shadow_ok[: int(h * 0.8)] = False  # the ground shadow is only at the bottom; never touch arms or the head
    for _ in range(400):
        grown = bg.copy()
        grown[1:] |= bg[:-1]; grown[:-1] |= bg[1:]; grown[:, 1:] |= bg[:, :-1]; grown[:, :-1] |= bg[:, 1:]
        grown &= (shadow_ok | bg)
        if (grown == bg).all():
            break
        bg = grown
    m = ~bg
    alpha = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    out = rgb.convert('RGBA')
    out.putalpha(alpha)
    bb = out.getbbox()
    pad = 6
    return out.crop((max(0, bb[0] - pad), max(0, bb[1] - pad), min(w, bb[2] + pad), min(h, bb[3] + pad)))


# Manual fixes where poses overlap in a sheet: fixed column ranges and areas to blank out (sheet coordinates).
CUTS = {'sheet3.jpg': [(0, 520), (520, 1140), (1040, 1536)]}
ERASE = {'talking': [(1000, 600, 1140, 1024)], 'walking': [(1040, 0, 1140, 600)]}


def main():
    os.makedirs(os.path.join(HERE, 'png'), exist_ok=True)
    for sheet, names in SHEETS.items():
        im = Image.open(os.path.join(HERE, 'src', sheet))
        for (x0, x1), name in zip(CUTS.get(sheet) or split_columns(im, len(names)), names):
            src = im.convert('RGB').copy()
            for (ex0, ey0, ex1, ey1) in ERASE.get(name, []):
                ImageDraw.Draw(src).rectangle((ex0, ey0, ex1, ey1), fill=(255, 255, 255))
            piece = cutout(src.crop((x0, 0, x1, im.height)))
            path = os.path.join(HERE, 'png', f'milo_{name}.png')
            piece.save(path)
            print(f'{name:16s} {piece.size}')


if __name__ == '__main__':
    main()
