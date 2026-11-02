# Builds ep01_read_minds.md (33 clips x 10 s = 5:30) and ep01_voiceover.md (narration only, for Fish Audio).
# Shared character/style blocks live in blocks.py.
from blocks import STYLE, HERO, CAST, THOUGHT

# (timecode, chapter, voiceover EN, meaning RU, cast keys, shot with 0-4 / 4-7 / 7-10 s beats, on-screen text for editing)
S = [
 # ---------------- HOOK ----------------
 ("0:00", "HOOK",
  "(calm) Right now, about eight billion people are thinking. And not one of them knows what YOU are thinking. (serious) But what if that changed… tomorrow?",
  "Сейчас думают 8 млрд человек, и никто не знает, что думаешь ты. А если завтра это изменится?", [],
  "A huge city at night seen from high above, thousands of warm glowing windows, light fog between the buildings. 0–4 s: tiny pale-blue glowing wisps of light slowly rise from every window like fireflies. 4–7 s: the camera glides down toward one small apartment window. 7–10 s: through the window we see the main character sitting on his bed in a dark bedroom, lit only by a bedside lamp. Camera: slow aerial descent and push-in.",
  "8,000,000,000"),
 ("0:10", "HOOK",
  "What if you woke up… and could hear every thought of every person around you? Their secrets. Their lies. What they REALLY think of you.",
  "А если ты проснёшься и услышишь мысли всех вокруг? Секреты, ложь, что о тебе думают на самом деле.", [],
  "A dark bedroom at dawn, cold blue light through the blinds making volumetric rays, dust in the air. 0–4 s: the main character lies in bed, his dot eyes suddenly open wide. 4–7 s: faint pale-blue glowing wisps of light seep in through the window and the gap under the door. 7–10 s: he slowly sits up and tilts his big round head, listening, as the wisps circle around him. Camera: slow push-in from medium shot to close-up.",
  ""),
 ("0:20", "HOOK",
  "(serious) It sounds like a superpower. But brain scientists would tell you… it might be the fastest way to lose your mind. Let's find out why.",
  "Звучит как суперсила. Но учёные сказали бы: это быстрый способ сойти с ума.", [],
  "An empty dark infinite space with a reflective black floor and soft fog. 0–4 s: the main character stands calmly in the center while a few pale-blue glowing wisps orbit his head peacefully. 4–7 s: more and more wisps appear, spinning faster and turning chaotic. 7–10 s: a few of them flicker dark red, the light pulses, and the character looks up at the storm above him with fear. Camera: slow low-angle orbit.",
  "WHAT IF YOU COULD READ MINDS?"),
 # ---------------- DAY 1: FUN ----------------
 ("0:30", "DAY 1",
  "(warm) Day one. Seven A.M. At first, it's amazing. Your mom says, \"Good morning, sweetie.\" And her thoughts agree: \"I'm so proud of him.\"",
  "День первый, 7 утра. Мама говорит «доброе утро», и мысли совпадают: «Я так им горжусь».", ["MOM"],
  "A warm cozy kitchen in the morning, golden sunlight through the window, steam rising from a coffee mug, the rest of the room in soft darkness. 0–4 s: the mom pours coffee and smiles warmly at the main character, who sits at the table with a bowl of cereal. 4–7 s: a soft pale-blue glowing wisp floats gently from her head to his. 7–10 s: he looks up at her and his face slowly lights up with a happy smile. Camera: medium two-shot, slow sideways dolly.",
  "7:00 AM"),
 ("0:50", "DAY 1",
  "On the bus, you hear everything. The driver hates Mondays. The guy next to you forgot his homework. And honestly? Nobody's thinking about you.",
  "В автобусе слышишь всех: водитель ненавидит понедельники, сосед забыл домашку, о тебе не думает никто.", ["CROWD"],
  "Inside a dim yellow school bus in the morning, sunlight flickering through the windows. 0–4 s: the main character sits by the window and looks around curiously. 4–7 s: pale-blue wisps rise from the heads of the passengers, each one drifting toward him. 7–10 s: he looks at all the passengers absorbed in their own thoughts, none of them looking at him, and he blinks in surprise. Camera: slow push-in down the aisle.",
  "8:30 AM"),
 ("1:00", "FACT",
  "That's actually real. Psychologists call it the spotlight effect: we believe people notice us far more than they actually do.",
  "Это реальный эффект — «эффект прожектора»: нам кажется, что нас замечают гораздо чаще, чем на самом деле.", ["CROWD"],
  "A dark theater. 0–4 s: the main character stands alone on a stage under one bright spotlight, nervously hugging himself. 4–7 s: the house lights slowly come up. 7–10 s: we see the audience seats are full, but everyone is looking at their own glowing phones or at each other, nobody watches him; he lowers his arms with relief. Camera: starts on the character, then pulls back wide to reveal the audience.",
  "THE SPOTLIGHT EFFECT"),
 ("1:10", "DAY 1",
  "(sly) At school, you find the real cheat code. The smartest kid in class is thinking the answers to the test. Loudly. In your head.",
  "В школе — чит-код: отличник думает ответы на тест прямо тебе в голову.", ["LEO"],
  "A classroom with a dark moody atmosphere, sunlight beams through tall windows full of dust, rows of desks. 0–4 s: the main character stares nervously at a test paper and taps his pencil. 4–7 s: behind him the classmate with big round glasses writes quickly while a pale-blue wisp floats from his head over the main character's shoulder. 7–10 s: the main character smiles slyly and starts writing very fast. Camera: over-the-shoulder shot, focus shift from the classmate to the main character.",
  "9:00 AM"),
 ("1:20", "DAY 1",
  "(excited) Perfect score. Your friends are impressed. Your teacher is impressed. By lunch, you feel like the most powerful person alive.",
  "Идеальный балл. К обеду ты чувствуешь себя самым могущественным человеком.", ["CROWD"],
  "A school hallway with rows of lockers, warm backlight from a big window at the end creating a glowing silhouette effect. 0–4 s: the main character walks confidently toward the camera holding a test paper. 4–7 s: classmates around him turn and look at him with admiration. 7–10 s: he raises the paper above his head and does a triumphant little jump, captured in slow motion. Camera: low-angle hero shot, slow motion at the peak.",
  ""),
 # ---------------- PROBLEM: NOISE ----------------
 ("1:30", "THE NOISE",
  "(serious) But then you notice something strange. People don't think in neat little sentences. Their thoughts are messy. Fast. And they never… ever… stop.",
  "Но мысли людей — не аккуратные фразы. Они хаотичные, быстрые и никогда не останавливаются.", ["CROWD"],
  "A crowded school cafeteria, warm light over the tables but dark edges, background blurred. 0–4 s: the main character sits down with a lunch tray, still smiling. 4–7 s: from every head in the room, pale-blue wisps start rising in tangled, chaotic streams. 7–10 s: the streams pile up above him into a buzzing cloud, and his smile fades into worry. Camera: slow crane up from the character to the cloud.",
  "12:00 PM"),
 ("1:40", "FACT",
  "In twenty-twenty, researchers at Queen's University in Canada estimated that the average person has more than six thousand separate thoughts every single day.",
  "В 2020 году учёные Университета Квинс (Канада) оценили: у человека больше 6000 отдельных мыслей в день.", [],
  "An abstract dark space. 0–4 s: the main character stands small in the center of the frame. 4–7 s: a huge river of thousands of tiny glowing pale-blue particles flows past him from left to right like a galaxy. 7–10 s: he reaches out a mitten hand and the particles stream around it. Camera: slow wide dolly, the river of light fills the screen.",
  "6,000+ THOUGHTS / DAY"),
 ("1:50", "FACT",
  "Now multiply that by thirty people in one classroom. That's nearly two hundred thousand thoughts a day. All of them… crashing into your head.",
  "Умножь на 30 человек в классе — почти 200 000 мыслей в день, и все летят тебе в голову.", ["CROWD"],
  "A dark classroom lit by a single warm desk lamp. 0–4 s: the main character sits at his desk surrounded by classmates. 4–7 s: thick streams of pale-blue wisps pour from all thirty heads at once and converge on him. 7–10 s: the light around his head becomes blinding and he grips the edge of his desk. Camera: slow push-in, slight shake.",
  "×30 = 180,000"),
 ("2:00", "FACT",
  "And most of it isn't even words. Studies of inner experience show people often think in images, feelings and half-finished fragments.",
  "И это даже не слова: исследования показывают, что люди часто думают образами, чувствами и обрывками.", ["CROWD"],
  "A dark space with soft fog. 0–4 s: a girl with a yellow headband stands beside the main character; a pale-blue wisp rises from her head. 4–7 s: the wisp breaks apart into small glowing translucent images floating in the air: a dog, a slice of pizza, a rain cloud, a cracked heart. 7–10 s: the images flicker and dissolve before the main character can catch them; he tilts his head, confused. Camera: slow orbit around the floating images.",
  ""),
 # ---------------- DARK THOUGHTS ----------------
 ("2:20", "DARK THOUGHTS",
  "(quiet) Then comes the darkest part. You start hearing things people would never say out loud. Strange thoughts. Scary thoughts. Even from people you love.",
  "Потом самое тёмное: ты слышишь то, что люди никогда не скажут вслух. Даже от близких.", ["CROWD"],
  "A dimly lit evening bus stop in the rain, streetlight reflections on wet asphalt. 0–4 s: the main character waits next to a kind elderly character with a knitted hat. 4–7 s: a calm pale-blue wisp rises from the elderly character's head. 7–10 s: the wisp suddenly flickers and turns dark red; the main character slowly turns his head and looks at the old man in shock. Camera: static medium shot, rain in the foreground.",
  "7:00 PM"),
 ("2:30", "FACT",
  "Here's the twist. In a study across thirteen countries, about ninety-four percent of people said they have unwanted, intrusive thoughts.",
  "Поворот: в исследовании в 13 странах около 94% людей признались, что у них бывают навязчивые нежелательные мысли.", ["CROWD"],
  "A vast dark space filled with a huge crowd of minimalist characters standing in rows, each with a small colorful accessory. 0–4 s: the camera rises slowly above the crowd. 4–7 s: above almost every head a small flickering dark-red wisp lights up, one after another. 7–10 s: only a few heads stay without one; the main character stands in the middle, looking around. Camera: slow crane up to a high wide shot.",
  "94%"),
 ("2:40", "FACT",
  "Like standing on a balcony and thinking, \"What if I jumped?\" Psychologists call it the call of the void. It's normal. It means nothing.",
  "Как мысль «а что если прыгнуть?» на балконе — «зов бездны». Это нормально и ничего не значит.", [],
  "A high apartment balcony at night overlooking a glowing city far below. 0–4 s: the main character leans on the railing, looking down at the lights. 4–7 s: a small flickering dark-red wisp appears from his own head. 7–10 s: he blinks, steps back from the railing, and the wisp fades into a calm golden glow. Camera: over-the-shoulder shot, then slow pull-back.",
  "THE CALL OF THE VOID"),
 ("2:50", "DARK THOUGHTS",
  "But you can't push them away. You hear everyone's worst three seconds… all day long. And slowly, you start to believe people are monsters.",
  "Но ты не можешь их отогнать. Слышишь худшие три секунды каждого — весь день. И начинаешь верить, что люди — монстры.", ["CROWD"],
  "A dark city street at night, people walking under streetlights. 0–4 s: the main character walks slowly through the crowd, looking anxious. 4–7 s: dark-red wisps flicker above many heads around him. 7–10 s: the shadows of the passersby on the brick wall slowly stretch and twist into tall monster shapes with long claws, while the people themselves look normal. Camera: side tracking shot along the wall.",
  ""),
 # ---------------- TRUST ----------------
 ("3:00", "TRUST",
  "Next to go: trust. Research suggests the average person tells one or two lies a day. Mostly tiny ones. \"I'm fine.\" \"I love the gift.\"",
  "Дальше рушится доверие. В среднем человек врёт 1–2 раза в день, в основном по мелочи: «Я в порядке», «Обожаю подарок».", ["JAKE"],
  "A cozy dark living room lit by a warm floor lamp and birthday candles. 0–4 s: the best friend with a red cap opens a gift box from the main character and smiles widely. 4–7 s: a pale-blue wisp floats from the friend's head. 7–10 s: the main character's happy face slowly falls as he hears it. Camera: medium two-shot, slow push-in on the main character.",
  "1–2 LIES / DAY"),
 ("3:20", "TRUST",
  "Your best friend laughs at your joke… and thinks, \"That wasn't funny.\" Your crush smiles at you… and thinks about someone else.",
  "Друг смеётся над шуткой и думает «не смешно». Симпатия улыбается — и думает о другом.", ["JAKE", "EMMA"],
  "A school hallway in cool evening light, lockers in soft focus. 0–4 s: the best friend with a red cap laughs and pats the main character on the shoulder; a pale-blue wisp leaves his head. 4–7 s: the girl with a yellow headband walks by and smiles at the main character; a pale-blue wisp drifts from her head toward a different boy down the hallway. 7–10 s: the main character stands alone, his smile slowly freezing. Camera: slow push-in to a close-up.",
  ""),
 ("3:30", "TRUST",
  "(sad) Within a week, you stop calling people. Not because they're bad. Because you know too much. And knowing too much… is lonely.",
  "Через неделю ты перестаёшь звонить людям. Не потому, что они плохие. Ты знаешь слишком много, и это одиноко.", [],
  "A dark bedroom at night, rain running down the window, city lights blurred outside. 0–4 s: the main character sits on the floor against his bed, knees pulled up. 4–7 s: his phone lies on the floor beside him, the screen lighting up again and again with incoming calls. 7–10 s: he slowly turns the phone face down and the room goes darker. Camera: slow side dolly, cold blue light with one warm lamp.",
  "DAY 7"),
 # ---------------- THE BRAIN ----------------
 ("3:40", "THE BRAIN",
  "Now let's talk about your brain. Right now, it's ignoring most of what your senses pick up. Scientists call this sensory gating.",
  "Теперь про мозг. Прямо сейчас он игнорирует большую часть сигналов от органов чувств. Это «сенсорный гейтинг».", [],
  "An abstract dark space with soft fog. 0–4 s: the main character stands calmly; above his head floats a large transparent glowing glass funnel. 4–7 s: thousands of tiny colorful sparks rain down into the funnel. 7–10 s: only a few sparks pass through the funnel into his head, while the rest bounce away harmlessly. Camera: slow tilt up from the character to the funnel.",
  "SENSORY GATING"),
 ("3:50", "THE BRAIN",
  "It's a filter. It's the reason you can read a book in a noisy café. (serious) Mind reading would rip that filter out. Permanently.",
  "Это фильтр — благодаря ему ты читаешь в шумном кафе. Чтение мыслей вырвало бы его навсегда.", [],
  "The same abstract dark space with the glowing glass funnel above the main character. 0–4 s: the funnel starts to crack with bright lines. 4–7 s: it shatters into glittering pieces in slow motion. 7–10 s: a flood of sparks pours straight down onto the character, who staggers back and shields his head with his arms. Camera: low-angle shot, slow motion at the shatter.",
  ""),
 ("4:00", "THE BRAIN",
  "With no filter, your brain never rests. Your stress hormone, cortisol, stays high. You can't focus. And you can't fall asleep.",
  "Без фильтра мозг не отдыхает. Кортизол — гормон стресса — держится высоким. Ни сосредоточиться, ни уснуть.", [],
  "A dark bedroom at 3 a.m., only a dim red glow from an alarm clock with no visible numbers. 0–4 s: the main character lies in bed with eyes wide open. 4–7 s: pale-blue whispering wisps slip through the walls and swirl around the bed. 7–10 s: he pulls the blanket over his head, but the glow still shines through the fabric. Camera: top-down shot slowly rotating above the bed.",
  "3:17 AM"),
 ("4:10", "FACT",
  "And after just a couple of days without proper sleep, people can start to hallucinate. Seeing shapes. Hearing voices. Things that aren't there.",
  "А после пары суток без нормального сна у людей начинаются галлюцинации: тени, голоса, то, чего нет.", [],
  "A dark bathroom lit by a single flickering bulb. 0–4 s: the exhausted main character looks at himself in the mirror, his eyes heavy. 4–7 s: his reflection slowly blurs and doubles. 7–10 s: for a split second a dark shadow figure appears behind him in the mirror, then vanishes; he spins around but nothing is there. Camera: over-the-shoulder into the mirror, slow push-in.",
  "48–72 HOURS"),
 # ---------------- MADNESS ----------------
 ("4:20", "LOSING YOUR MIND",
  "(serious) And here's what really worries psychiatrists. Some people with schizophrenia describe thought insertion: the feeling that the thoughts in their head belong to someone else.",
  "Психиатров тревожит вот что: при шизофрении бывает «вкладывание мыслей» — ощущение, что мысли в голове чужие.", [],
  "A dark abstract space resembling the inside of a mind, soft fog with glowing threads. 0–4 s: the main character stands still with his eyes closed. 4–7 s: thin pale-blue threads of light reach in from the darkness and slowly connect to his head. 7–10 s: his small golden wisp starts flickering and turns pale blue like the others; he opens his eyes in alarm. Camera: slow circular dolly around him.",
  "THOUGHT INSERTION"),
 ("4:30", "LOSING YOUR MIND",
  "For you, that wouldn't be a symptom. It would be reality. So which voice in your head is yours? After a while… you can't tell anymore.",
  "Для тебя это была бы реальность. Какой голос в голове твой? Со временем ты уже не различишь.", [],
  "A dark room with a large mirror. 0–4 s: the main character stares at his reflection. 4–7 s: dozens of pale-blue wisps swirl around both him and his reflection, mixing together. 7–10 s: his reflection slowly moves out of sync with him, turning its head a moment later than he does; he steps back in fear. Camera: static shot from the side showing both him and the mirror.",
  ""),
 ("4:40", "LOSING YOUR MIND",
  "(quiet) That's the real danger. Not knowing too much about other people… but losing the one voice that's truly yours.",
  "Настоящая опасность — не знать слишком много о других, а потерять единственный голос, который по-настоящему твой.", [],
  "An endless dark space. 0–4 s: hundreds of pale-blue wisps float around the main character like a slow storm. 4–7 s: his small warm golden wisp flickers weakly among them. 7–10 s: it fades and almost disappears in the blue noise as he reaches out his mitten hand toward it. Camera: slow push-in on the tiny golden light.",
  ""),
 # ---------------- REAL SCIENCE ----------------
 ("4:50", "IS IT POSSIBLE?",
  "And this isn't pure science fiction anymore. In twenty-twenty-three, scientists in Texas used brain scans and AI to decode the gist of stories people heard… and even imagined.",
  "Это уже не совсем фантастика: в 2023 году учёные в Техасе с помощью томографа и ИИ расшифровали смысл историй, которые люди слушали и даже представляли.", ["SCIENTIST"],
  "A dark high-tech lab lit by the cold blue glow of monitors. 0–4 s: a character lies inside a large brain scanner machine. 4–7 s: the scientist in a lab coat watches glowing monitors showing abstract colorful brain maps and flowing patterns. 7–10 s: pale-blue wisps rise from the scanner and turn into glowing data streams flowing into the screens. Camera: slow dolly from the scanner to the scientist.",
  "2023 · UNIVERSITY OF TEXAS"),
 ("5:00", "IS IT POSSIBLE?",
  "It wasn't perfect. It only worked on volunteers who spent many hours inside the scanner, and only if they cooperated. But it proved thoughts can be decoded.",
  "Неидеально: работало только на добровольцах после многих часов в томографе и с их согласия. Но доказало, что мысли можно расшифровать.", ["SCIENTIST"],
  "The same dark lab. 0–4 s: the scientist leans closer to the main monitor. 4–7 s: blurry glowing images on the screen slowly sharpen into a recognizable soft picture of a house and a tree. 7–10 s: the scientist slowly takes off his glasses and stares at the screen in amazement. Camera: over-the-shoulder shot toward the monitor, slow push-in.",
  ""),
 ("5:10", "IS IT POSSIBLE?",
  "Meanwhile, brain implants already let paralyzed patients move a computer cursor just by thinking. Step by step, the walls of the mind are getting thinner.",
  "А мозговые импланты уже позволяют парализованным двигать курсор силой мысли. Стены разума становятся тоньше.", [],
  "A dim hospital room lit by a large glowing screen. 0–4 s: a minimalist character with a tiny glowing dot on the side of his round head sits in a wheelchair facing the screen. 4–7 s: a pale-blue thread of light flows from the glowing dot to the screen, and a small glowing cursor moves across it. 7–10 s: the character smiles as the cursor lands on a target that bursts into soft light. Camera: slow side dolly.",
  "BRAIN IMPLANTS"),
 ("5:20", "IS IT POSSIBLE?",
  "Which raises a question nobody has answered yet. If your thoughts can be read… who should be allowed to read them?",
  "Встаёт вопрос, на который пока нет ответа: если мысли можно читать — кому это разрешено?", ["CROWD"],
  "A vast dark hall. 0–4 s: the main character walks toward a giant translucent glowing glass head floating in the center of the hall. 4–7 s: inside the glass head pale-blue wisps swirl like a galaxy. 7–10 s: from the shadows around the hall, many silent silhouetted figures slowly step forward and watch the glowing head. Camera: slow wide push-in, symmetrical composition.",
  ""),
 # ---------------- ENDING ----------------
 ("5:30", "ENDING",
  "(warm) So maybe the privacy of your mind isn't a weakness. Maybe it's exactly what lets us be kind… be strange… and be ourselves.",
  "Может, тайна мыслей — не слабость, а то, что позволяет быть добрыми, странными и самими собой.", [],
  "A dark bedroom at night, moonlight through the window and a small warm lamp. 0–4 s: the main character sits on his bed as the pale-blue wisps around him slowly dissolve one by one. 4–7 s: the room becomes calm and quiet. 7–10 s: his small warm golden wisp rises from his head, glowing brighter, and he smiles softly. Camera: slow push-in to a close-up.",
  ""),
 ("5:40", "ENDING",
  "Your thoughts are the last place on Earth where no one can follow you. (whispering) At least… for now.",
  "Твои мысли — последнее место на Земле, куда никто не может пойти за тобой. По крайней мере, пока.", [],
  "The same dark bedroom, the window behind the bed showing the night city. 0–4 s: the main character lies down and closes his eyes peacefully. 4–7 s: a single cold, bright blue wisp slowly drifts in through the closed window glass. 7–10 s: it floats toward his head and his eyes snap open in the darkness. Camera: slow creeping push-in, suspenseful.",
  ""),
 ("5:50", "OUTRO",
  "(friendly) So… would you take this power if someone offered it to you? Tell me in the comments. And next time: what if you became invisible?",
  "Взял бы ты эту силу? Пиши в комментариях. А в следующий раз — что если ты станешь невидимым?", [],
  "The same bedroom in the warm light of morning. 0–4 s: the main character looks straight into the camera and gives a playful shrug. 4–7 s: he waves with his mitten hand. 7–10 s: his body slowly turns semi-transparent like glass with a shimmering outline until he almost disappears. Camera: static medium shot, centered.",
  "WHAT IF YOU BECAME INVISIBLE?"),
]


# chapter starts (FACT clips belong to the surrounding chapter)
CHAPTERS, _cur = [], None
for _i, _s in enumerate(S):
    if _s[1] != "FACT" and _s[1] != _cur:
        _cur = _s[1]
        CHAPTERS.append((_i, {"HOOK": "INTRO", "OUTRO": "ENDING"}.get(_cur, _cur)))
CHAPTERS = [c for k, c in enumerate(CHAPTERS) if k == 0 or c[1] != CHAPTERS[k - 1][1]]


def prompt(cast, shot):
    chars = [f"Main character: {HERO}"] + [f"{k.title()}: {CAST[k]}" for k in cast]
    return (f"10-second shot. {shot}\n\n" + "\n".join(chars) +
            f"\n\nThought visuals: {THOUGHT}\n\nStyle: {STYLE}")


ep = ["# Ep. 01 — What If You Could Read Minds? (5:30)\n",
      f"{len(S)} клипов × 10 с = {len(S) * 10 // 60}:{len(S) * 10 % 60:02d}. Озвучка — английский, под ней смысл по-русски.\n",
      "**Название:** What If You Could Read Minds? (Science Explains)  \n"
      "**Обложка:** герой крупно в темноте, глаза широко раскрыты, вокруг головы вихрь голубых и красных светящихся завитков; "
      "надпись `READ MINDS?` белым рукописным шрифтом, слово `MINDS` на розовой плашке.  \n"
      "**Главы для описания:** " + " · ".join(f"{(i * 10) // 60}:{(i * 10) % 60:02d} {c.title()}" for i, c in CHAPTERS) + "\n",
      "**Как пользоваться:** «Промпт» → Google Vids целиком. «Озвучка» → Fish Audio (текст без смысловой строки; "
      "весь текст подряд — в `ep01_voiceover.md`). «Надпись» — добавить в монтаже крупно, ключевое слово на розовой плашке.\n",
      "Источники фактов — в конце файла.\n"]
vo = ["# Ep. 01 — текст для озвучки (Fish Audio)\n",
      "Один голос рассказчика. Скорость 1.0. Каждый блок = 10 секунд, генерировать по 3–4 блока за раз. "
      "Файлы называть `ep01_01.mp3`, `ep01_02.mp3` … по номеру клипа.\n"]
chapter = None
for i, (_tc, ch, en, ru, cast, shot, onscreen) in enumerate(S, 1):
    tc = f"{(i - 1) * 10 // 60}:{(i - 1) * 10 % 60:02d}"
    starts = dict(CHAPTERS)
    if i - 1 in starts:
        ep.append(f"\n# Глава: {starts[i - 1]}\n")
        vo.append(f"\n## {starts[i - 1]}\n")
    ep.append(f"---\n\n## Клип {i:02d} · {tc}{' · ФАКТ' if ch == 'FACT' else ''}\n\n**Озвучка:**\n> {en}\n\n_Смысл:_ {ru}\n" +
              (f"\n**Надпись на экране:** `{onscreen}`\n" if onscreen else "") +
              f"\n**Промпт для Google Vids:**\n```\n{prompt(cast, shot)}\n```\n")
    vo.append(f"**{i:02d}** ({tc})  \n{en}\n")
ep.append("""---

## Источники фактов (для описания под видео)
- Spotlight effect — Gilovich, Medvec & Savitsky, 2000, *Journal of Personality and Social Psychology*.
- ~6 000 мыслей в день — Tseng & Poppenk, 2020, *Nature Communications* (Queen's University).
- Мышление образами и обрывками — исследования Р. Херлберта (Descriptive Experience Sampling).
- 94% людей с навязчивыми мыслями, 13 стран — Radomsky et al., 2014, *Journal of Obsessive-Compulsive and Related Disorders*.
- «Зов бездны» — Hames et al., 2012, *Journal of Affective Disorders* (high place phenomenon).
- 1–2 лжи в день — DePaulo et al., 1996; Serota et al., 2010.
- Галлюцинации от недосыпа — Waters et al., 2018, *Frontiers in Psychiatry*.
- Thought insertion — один из «симптомов первого ранга» шизофрении (К. Шнайдер).
- Декодер мыслей — Tang, LeBel, Jain & Huth, 2023, *Nature Neuroscience* (University of Texas at Austin).
- Управление курсором через имплант — BrainGate, Neuralink (2024).
""")
open("ep01_read_minds.md", "w").write("\n".join(ep))
open("ep01_voiceover.md", "w").write("\n".join(vo))
words = sum(len(s[2].split()) for s in S)
print(len(S), "clips,", words, "words,", round(words / len(S), 1), "words/clip")
