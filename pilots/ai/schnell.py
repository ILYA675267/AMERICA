"""FLUX.1-schnell text-to-image (cheap: 4 steps). Usage: python3 pilots/ai/schnell.py <out> "<prompt>" [seed] [w] [h]"""
import shutil
import sys

from gradio_client import Client

out, prompt = sys.argv[1], sys.argv[2]
seed = int(sys.argv[3]) if len(sys.argv) > 3 else 7
w = int(sys.argv[4]) if len(sys.argv) > 4 else 1344
h = int(sys.argv[5]) if len(sys.argv) > 5 else 768
c = Client("black-forest-labs/FLUX.1-schnell", verbose=False, headers={"Authorization": "Bearer hf_proxy_injects_real_token"})
res, s = c.predict(prompt, seed, False, w, h, 4, api_name="/infer")
shutil.copy(res["path"] if isinstance(res, dict) else res, out)
print(out, s)
