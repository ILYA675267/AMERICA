import sys, shutil
from gradio_client import Client, handle_file
img, out, prompt = sys.argv[1], sys.argv[2], sys.argv[3]
c = Client("Lightricks/ltx-video-distilled", headers={"Authorization": "Bearer hf_proxy_injects_real_token"}, verbose=False)
res, seed = c.predict(prompt, "worst quality, inconsistent motion, blurry, jittery, distorted, deformed", handle_file(img), None, 512, 896, "image-to-video", 3, 9, 42, False, 1, True, api_name="/image_to_video")
p = res["video"] if isinstance(res, dict) else res
shutil.copy(p, out); print(out, seed)
