import sys, shutil
from gradio_client import Client, handle_file
img, out, prompt = sys.argv[1], sys.argv[2], sys.argv[3]
dur = float(sys.argv[4]) if len(sys.argv) > 4 else 3.5
c = Client("zerogpu-aoti/wan2-2-fp8da-aoti-faster", headers={"Authorization": "Bearer hf_proxy_injects_real_token"}, verbose=False)
res, seed = c.predict(handle_file(img), prompt, 6, "blurry, distorted, deformed, extra limbs, morphing, flicker, text", dur, 1, 1, 42, False, api_name="/generate_video")
p = res["video"] if isinstance(res, dict) else res
shutil.copy(p, out); print(out, seed)
