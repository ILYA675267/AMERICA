# Renders an episode into a single HTML shot list with copy buttons: python3 build_page.py 02 out.html
import html, importlib, sys
from epbuild import TC, chapters, prompt
from blocks import THOUGHT

num, out = sys.argv[1], sys.argv[2]
m = importlib.import_module(f"build_ep{num}")
S, LOC = m.S, m.LOC
visuals = getattr(m, "VISUALS", THOUGHT)
TITLES = {"01": ("What If You Could", "Read Minds?"), "02": ("What If Everyone", "Told the Truth?")}
LEGEND = {"01": ["Голубые каракули = мысли других", "Красные = тёмные мысли", "Жёлтая = мысли героя"],
          "02": ["Зелёный пузырь = правда", "Серый кривой = ложь", "Жёлтая = чувства героя"]}
t1, t2 = TITLES[num]
starts = dict(chapters(S))
cards, toc = [], []
for i, s in enumerate(S):
    ch, loc, en, ru, cast, action, ons = s
    if i in starts:
        cards.append(f'<h2 class="chap" id="ch{i}"><span class="tc">{TC(i)}</span> {html.escape(ch.title())}</h2>')
        toc.append(f'<a href="#ch{i}"><span class="tc">{TC(i)}</span> {html.escape(ch.title())}</a>')
    ons_html = f'<div class="ons"><span class="lbl">Надпись</span><code>{html.escape(ons)}</code></div>' if ons else ''
    cards.append(f'''<article class="clip">
<header><span class="num">{i + 1:02d}</span><span class="tc">{TC(i)}–{TC(i + 1)}</span></header>
<div class="vo"><div class="row"><span class="lbl">Озвучка</span><button type="button" data-copy="vo{i}">Копировать</button></div>
<p id="vo{i}">{html.escape(en)}</p><p class="ru">{html.escape(ru)}</p></div>
{ons_html}
<details><summary><span>Промпт для Google Vids</span><button type="button" data-copy="pr{i}">Копировать промпт</button></summary>
<pre id="pr{i}">{html.escape(prompt(S, LOC, i, visuals))}</pre></details>
</article>''')
allvo = "\n\n".join(f"{i + 1:02d}. {s[2]}" for i, s in enumerate(S))
legend = "".join(f"<span>{html.escape(x)}</span>" for x in LEGEND[num])
page = f'''<title>{html.escape(t2.rstrip("?"))} — Episode {num}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Nunito+Sans:wght@400;600;700&family=JetBrains+Mono&display=swap">
<style>
/* Layout: one reading column, like a storyboard sheet: chapter marks, then clip cards on paper */
:root {{
  --bg:#f6f4ee; --panel:#ffffff; --line:#d9d5ca; --fg:#1d1c1a; --muted:#6c6a63;
  --pink:#e8246f; --blue:#2f7fc1; --gold:#b9820c; --code:#f1eee6;
  --display:"Gochi Hand", "Comic Sans MS", cursive; --body:"Nunito Sans", system-ui, sans-serif; --mono:"JetBrains Mono", ui-monospace, monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#16161a; --panel:#1e1e23; --line:#34343c; --fg:#ecebe6; --muted:#a3a19a; --pink:#ff4f8f; --blue:#7cc0ff; --gold:#f2b544; --code:#121216; color-scheme:dark; }} }}
:root[data-theme="dark"] {{ --bg:#16161a; --panel:#1e1e23; --line:#34343c; --fg:#ecebe6; --muted:#a3a19a; --pink:#ff4f8f; --blue:#7cc0ff; --gold:#f2b544; --code:#121216; color-scheme:dark; }}
body {{ background:var(--bg); color:var(--fg); font:16px/1.5 var(--body); }}
.wrap {{ max-width:860px; margin:0 auto; padding-block:28px 64px; padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); display:grid; gap:18px; }}
h1 {{ font:44px/1.05 var(--display); margin:0; text-wrap:balance; }}
h1 mark {{ background:var(--pink); color:#fff; padding:0 .15em; }}
.meta {{ color:var(--muted); margin:0; }}
.facts {{ display:flex; flex-wrap:wrap; gap:8px; }}
.facts span {{ border:1.5px solid var(--fg); border-radius:999px; padding:3px 12px; font-size:14px; }}
.toc {{ display:flex; flex-wrap:wrap; gap:6px 14px; font-size:14px; }}
.toc a {{ color:var(--fg); text-decoration:none; border-bottom:1px solid var(--line); }}
.toc a:hover {{ border-color:var(--pink); }}
.tc {{ font-family:var(--mono); font-size:.8em; color:var(--blue); font-variant-numeric:tabular-nums; }}
.chap {{ font:30px/1.1 var(--display); margin:22px 0 0; display:flex; gap:10px; align-items:baseline; }}
.clip {{ background:var(--panel); border:1.5px solid var(--line); border-radius:10px; padding:14px 16px; display:grid; gap:10px; min-width:0; }}
.clip header {{ display:flex; gap:10px; align-items:center; }}
.num {{ font:24px var(--display); color:var(--pink); }}
.row {{ display:flex; justify-content:space-between; align-items:center; gap:10px; }}
.lbl {{ font-size:12px; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); }}
.vo p {{ margin:4px 0 0; font-size:18px; }}
.vo p.ru {{ font-size:14px; color:var(--muted); }}
.ons {{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }}
.ons code {{ background:var(--pink); color:#fff; font:13px var(--mono); padding:2px 8px; border-radius:3px; }}
details summary {{ cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:10px; color:var(--blue); font-weight:700; list-style:none; }}
details summary::-webkit-details-marker {{ display:none; }}
details summary span::before {{ content:"▸ "; }}
details[open] summary span::before {{ content:"▾ "; }}
pre {{ white-space:pre-wrap; word-break:break-word; font:12.5px/1.55 var(--mono); background:var(--code); border:1px solid var(--line); border-radius:8px; padding:12px; margin:10px 0 0; max-height:340px; overflow:auto; }}
button {{ font:700 13px var(--body); background:transparent; color:var(--fg); border:1.5px solid var(--line); border-radius:6px; padding:5px 10px; cursor:pointer; white-space:nowrap; }}
button:hover {{ border-color:var(--pink); }}
button:focus-visible, a:focus-visible, summary:focus-visible {{ outline:2px solid var(--pink); outline-offset:2px; }}
button.ok {{ border-color:var(--gold); color:var(--gold); }}
.big {{ background:var(--pink); border-color:var(--pink); color:#fff; padding:8px 14px; }}
.tips {{ border-left:3px solid var(--gold); padding:4px 0 4px 12px; color:var(--muted); font-size:14px; margin:0; }}
#allvo {{ position:absolute; left:-9999px; }}
</style>
<div class="wrap">
<h1>{html.escape(t1)} <mark>{html.escape(t2)}</mark></h1>
<p class="meta">Выпуск {num} · {len(S)} клипов по 10 секунд · {TC(len(S))} · плоская рисовка · одна непрерывная история</p>
<div class="facts">{legend}</div>
<p class="tips">Промпт копируйте целиком: в нём уже есть герой, место, стиль и связь с прошлым клипом. Если Vids умеет начинать видео с картинки, давайте ему последний кадр предыдущего клипа. Звук клипов выключайте, надписи добавляйте в монтаже.</p>
<nav class="toc">{"".join(toc)}</nav>
<div><button type="button" class="big" data-copy="allvo">Копировать весь текст озвучки</button></div>
<textarea id="allvo" readonly aria-hidden="true" tabindex="-1">{html.escape(allvo)}</textarea>
{"".join(cards)}
</div>
<script>
document.addEventListener('click', async e => {{
  const b = e.target.closest('button[data-copy]'); if (!b) return;
  e.preventDefault(); e.stopPropagation();
  const el = document.getElementById(b.dataset.copy);
  const text = el.value ?? el.textContent;
  const old = b.textContent;
  try {{ await navigator.clipboard.writeText(text); b.textContent = 'Скопировано'; }}
  catch (_) {{ const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Выделено — Ctrl+C'; }}
  b.classList.add('ok'); setTimeout(() => {{ b.textContent = old; b.classList.remove('ok'); }}, 1600);
}});
</script>'''
open(out, "w").write(page)
print(out, len(page))
