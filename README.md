# 🎰 Buckshot Roulette Tracker / Трекер Buckshot Roulette

[![Status-Active](https://img.shields.io/badge/Status-Active-success)](https://github.com/your-username/buckshot-tracker)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Read this in other languages: [English](#english), [Русский](#русский).*

<img width="800" alt="Buckshot Tracker Preview" src="https://github.com/user-attachments/assets/e373a0f0-4c30-4951-8f65-9cddd048b79f" />

---

## English

A standalone web assistant for the game **Buckshot Roulette**. It helps track live and blank shells, calculates the exact probabilities of the next shot, and manages known shell sequences (simulating the "Burner Phone" item).

Designed to handle the mental math for the player, letting you focus on tactics and item management.

### ✨ Key Features

*   **🧮 Accurate Probability Calculation**: Automatically recalculates the chance of the next shot based on fired and "known" shells.
*   **📱 "Burner Phone" Support (Chamber Sequence)**: Interactive shell queue. If you use the Burner Phone item and learn a specific shell's charge, mark it in the tracker (Live / Blank) to instantly adjust the probability math.
*   **⏪ Undo Actions**: Accidentally clicked the wrong button? Any action can be rolled back.
*   **📊 Round History**: Detailed list of all shots in the current magazine. Shows the probability at which each shot was taken.
*   **🏆 Match and Streak Management**: Skip the current magazine (if items reset it or the Dealer reloads) and track Win Streaks (Best & Current).
*   **💾 Local Save**: Progress, win streaks, and the current magazine state won't be lost on accidental page refreshes.
*   **🎨 Dual Interface Modes**: Full mode with comprehensive analytics and a minimalist Assist mode.

### 🚀 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Icons:** [Lucide React](https://lucide.dev/)

### 🛠️ Installation & Setup (For Developers)

1. **Clone the repository:**
   `git clone https://github.com/your-username/buckshot-tracker.git`
   `cd buckshot-tracker`
2. **Install dependencies:**
   `npm install`
3. **Start the development server:**
   `npm run dev &`
4. **Open in browser:** Go to [http://localhost:3000](http://localhost:3000)

### 🤝 Contributing
Pull requests are welcome! If you want to add new features (e.g., item inventory, damage calculator with the handsaw, or Dealer AI predictor), please open an *Issue* to discuss or create a *Pull Request*.

---

## Русский

Автономный веб-помощник для игры **Buckshot Roulette**. Позволяет отслеживать боевые и холостые патроны, рассчитывать точные вероятности следующего выстрела и управлять известной последовательностью патронов (имитация предмета «Телефон»).

Трекер создан для того, чтобы снять с игрока рутину подсчетов в уме, помогая сосредоточиться на тактике и управлении предметами.

### ✨ Ключевые возможности

*   **🧮 Точный расчет вероятностей**: Автоматический пересчет шанса следующего выстрела с учетом уже отстрелянных и «известных» патронов.
*   **📱 Поддержка «Телефона» (Chamber Sequence)**: Интерактивная очередь патронов. Если в игре вы используете предмет (Burner Phone) и узнаете заряд конкретного патрона по счету, вы можете отметить его в трекере (Боевой / Холостой), и математика вероятностей мгновенно перестроится.
*   **⏪ Отмена действий (Undo)**: Случайно нажали не ту кнопку? Любое действие можно откатить.
*   **📊 История раунда**: Подробный список всех выстрелов в текущем магазине. Для каждого выстрела показывается вероятность.
*   **🏆 Управление матчами и сериями**: Скип текущего магазина, подсчет побед (Win Streak) и лучшей серии.
*   **💾 Локальное сохранение**: Ваш прогресс и текущий магазин сохраняются в браузере.
*   **🎨 Два режима интерфейса**: Полный режим (Full) со всей аналитикой и компактный режим помощника (Assist).

### 🛠️ Установка и запуск (Для разработчиков)

1. **Склонируйте репозиторий:**
   `git clone https://github.com/ВАШ_НИК/buckshot-tracker.git`
   `cd buckshot-tracker`
2. **Установите зависимости:**
   `npm install`
3. **Запустите сервер разработки:**
   `npm run dev &`
4. **Откройте в браузере:** Перейдите по адресу [http://localhost:3000](http://localhost:3000)

### 🤝 Вклад в проект (Contributing)
Пулл-реквесты приветствуются! Открывайте *Issue* для обсуждения новых фич или сразу создавайте *Pull Request*.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

*Disclaimer: This is a fan-made tool and is not affiliated with the creator of the original Buckshot Roulette game, Mike Klubnika.*
