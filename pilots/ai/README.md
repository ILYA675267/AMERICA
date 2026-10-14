# Нейросети через Hugging Face Spaces (ZeroGPU)

- Токен: секрет окружения `HF_TOKEN` (Bearer) для `huggingface.co` и `*.hf.space`; прокси подставляет его сам.
- ВАЖНО: `gradio_client` по умолчанию кладёт токен в `X-HF-Authorization`, куда прокси НЕ подставляет ключ.
  Поэтому создаём клиент так: `Client(space, headers={"Authorization": "Bearer hf_proxy_injects_real_token"})` —
  прокси заменит заглушку настоящим токеном, и квота считается по аккаунту (проверено 14.10.2026).
- `kontext.py <образец> <out> "<промпт>" [seed]` — FLUX.1-Kontext-Dev: новая сцена в стиле образца (`../assets/ai_day1.png`).
- `wan.py <картинка> <out.mp4> "<промпт>" [сек]` — Wan 2.2 image-to-video, 832×480, 16 fps, ~3,5 с. Стиль сохраняет.
- `ltx.py <картинка> <out.mp4> "<промпт>"` — LTX-Video distilled, запасной вариант.
- Запускать из этой папки нельзя (рядом скачанные файлы) — запускать `python3 pilots/ai/<script>.py ...` из корня.
- Квота бесплатного аккаунта маленькая: за раз ~1 оживление + 1 картинка, потом «GPU limit» до восстановления.
