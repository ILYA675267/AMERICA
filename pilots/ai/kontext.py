import sys, shutil
from gradio_client import Client, handle_file
ref, out, prompt = sys.argv[1], sys.argv[2], sys.argv[3]
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 7
c = Client("black-forest-labs/FLUX.1-Kontext-Dev", headers={"Authorization": "Bearer hf_proxy_injects_real_token"}, verbose=False)
res, s = c.predict(handle_file(ref), prompt, seed, False, 2.5, 28, api_name="/infer")
shutil.copy(res["path"] if isinstance(res, dict) else res, out); print(out, s)
