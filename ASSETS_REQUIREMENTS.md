# Требования к визуальным ассетам (Buckshot Tracker)

Для полного погружения в атмосферу игры **Buckshot Roulette** (мрачный, индустриальный вайб грязного ночного клуба) рекомендуется заменить базовые цвета и CSS-элементы на реалистичные текстуры и спрайты.

Ниже приведен список необходимых изображений и промпты для нейросетей (Midjourney / Stable Diffusion), которые помогут их сгенерировать.

## 1. Фон (Background)
**Назначение:** Задний фон приложения. Должен быть темным, чтобы текст читался, но передавать атмосферу стола в клубе.
**Формат:** PNG / WebP, 1920x1080 (или бесшовный паттерн).
**Промпт для генерации:**
> *Dark, gritty industrial metal table surface, dimly lit by a flickering red neon light from above, scratches and grime on the metal, underground nightclub vibe, deep shadows, cinematic lighting, photorealistic, 8k --ar 16:9*

## 2. Патроны (Shells)
**Назначение:** Иконки патронов (вместо текущих кружков/квадратов в FullTracker).
**Формат:** PNG с прозрачным фоном, ~256x256.

* **Боевой патрон (Live Shell - Красный):**
  **Промпт:** *Single red 12-gauge shotgun shell standing upright, scratched plastic, tarnished brass base, dark background, dramatic rim lighting, photorealistic, macro photography --no background*
* **Холостой патрон (Blank Shell - Синий/Серый/Зеленый - в зависимости от версии, чаще синий или темный):**
  **Промпт:** *Single blue 12-gauge shotgun shell standing upright, weathered texture, tarnished brass base, dark background, photorealistic, macro photography --no background*

## 3. Дефибриллятор / Лампочки (Charges)
**Назначение:** Индикаторы выигранных раундов.
**Формат:** PNG с прозрачным фоном или CSS/SVG на базе текстур.

* **Выключенный заряд:**
  **Промпт:** *Old industrial glass light bulb or fuse on a dirty metal panel, unlit, dark and dusty, cyberpunk, macro photography, photorealistic --no background*
* **Включенный заряд:**
  **Промпт:** *Old industrial glass light bulb or fuse on a dirty metal panel, glowing intensely with bright yellow electricity/light, sparks, cyberpunk, macro photography, photorealistic --no background*

## 4. Предметы (Items - для будущих обновлений)
Если в трекер будут добавлены предметы (наручники, лупа, пиво, сигареты, пила):
* **Промпт (Лупа):** *A dirty, scratched magnifying glass on a dark metal table, creepy lighting, photorealistic.*
* **Промпт (Наручники):** *Heavy rusted iron handcuffs on a dark table, low light, photorealistic.*
* **Промпт (Пила):** *A small, rusty hand saw with a yellow handle, lying on a dark table, photorealistic.*

## Инструкция по внедрению:
Когда изображения будут готовы, поместите их в папку `/public/assets/` и используйте компонент `<Image>` из `next/image` или пропишите пути в `app/globals.css` в качестве `background-image`.
