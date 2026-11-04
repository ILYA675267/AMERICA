# Фоны для ролика «$10 a day» — генерация в ChatGPT

Стиль — **наш**, как в референсе с улицей (`style_reference.png`): светлый, почти белый кремовый фон-бумага,
всё нарисовано тонкими тёмно-серыми линиями от руки, предметы в основном **белые/незакрашенные**, цвета — только
крошечные бледные акценты (бледно-жёлтое солнце, светло-серое стекло окон). Никаких тёмных фонов, ярких цветов,
теней, объёма и фотореализма.

Фоны — **неподвижные картинки без людей и без текста**. Героя, деньги, банку, графики и движения я рисую поверх кодом.

## Как делать в ChatGPT (по шагам)
1. Откройте **один** новый чат и делайте в нём все фоны подряд — так стиль будет одинаковым.
2. Первым сообщением прикрепите картинку `style_reference.png` и вставьте текст:
```
This image is the exact style reference for every image I will ask you to make in this chat. Copy its style exactly: a hand-drawn doodle illustration on a very light, almost white cream paper background; thin dark grey ink lines of even width; objects mostly white or uncoloured, only outlined; very few tiny pale accents (pale yellow, very light grey-blue glass); no shading except a few light grey touches; flat 2D, no gradients, no 3D, no realism. Every image: landscape format, no people, no animals, no text, no letters, no numbers, no logos. Keep the lower center of the picture empty (clear floor or sidewalk) because I will place my own character there. Keep all important details in the middle of the picture, with simple empty space near the top and bottom edges. Reply "ok" and wait for my descriptions.
```
3. Дальше отправляйте по одному описанию из таблицы ниже (только английский текст). Каждое описание начинается с
   `Same style as the reference.` — это напоминание модели.
4. Если картинка получилась темнее, цветнее или «объёмнее» референса — напишите: `Too colorful / too dark. Redraw it lighter: mostly white, only thin dark grey lines, like the reference.`
5. Скачайте картинку и назовите по номеру: `bg01.png`, `bg02.png`, …

ChatGPT делает горизонтальные картинки 3:2, а видео 16:9 — я сам аккуратно обрежу верх и низ, поэтому главное
должно быть в середине картинки (это уже сказано в первом сообщении).

## Список фонов
| № | Где в ролике | Описание для ChatGPT |
|---|---|---|
| **bg01** | дом героя: банка на столе, «день первый», финал | `Same style as the reference. A cozy small room: a wooden desk under a big window on the right, a desk lamp, a small bookshelf, a potted plant, a bed with a blanket on the far left. Empty floor in the lower center.` |
| **bg02** | кофейня | `Same style as the reference. Inside a small coffee shop: a long counter with an espresso machine and a pastry display at the back, hanging round lamps, a menu board with only small drawings of cups, two small tables on the sides. Empty floor in the lower center.` |
| **bg03** | центр города с банком | `Same style as the reference. A downtown street: a classic bank building with columns and steps in the center background, tall buildings on both sides, street lamps, a few trees, a wide empty sidewalk in the front.` |
| **bg04** | финансовый район, биржа | `Same style as the reference. A financial district: tall office towers and skyscrapers with many small windows, a large blank screen on one building, a plaza with benches, an empty pavement in the front.` |
| bg05 | заснеженный холм | `Same style as the reference. A gentle hill sloping from the upper left to the lower right, outlined pine trees, a tiny town of small houses far below, the hill drawn only with lines (white snow).` |
| bg06 | аэропорт | `Same style as the reference. An airport terminal hall: big windows with an airplane outside, rows of seats, a few luggage trolleys, a departure board with blank screens. Empty floor in the lower center.` |
| bg07 | улица с автомастерской | `Same style as the reference. A quiet suburban street with a small car repair garage with its door open, a tool wall inside, a driveway, houses and trees around, an empty sidewalk in the front.` |
| bg08 | город с крыши | `Same style as the reference. A city skyline seen from a rooftop: many skyscrapers with small windows, a big open sky, a simple railing along the front edge of the roof.` |
| bg09 | аудитория с доской | `Same style as the reference. A classroom: a large empty blackboard on the back wall, a teacher's desk, rows of desks on both sides, tall windows. Empty floor in the lower center.` |
| bg10 | коридор с дверями | `Same style as the reference. A long bright hallway with several different doors on both walls and a window at the far end. Empty floor in the lower center.` |

Минимум для старта — **bg01, bg02, bg03, bg04**: они закрывают больше всего сцен.

## Как прислать
Прямо в чат картинками (они доходят нормально). Подпишите номер, если имя файла потерялось.
