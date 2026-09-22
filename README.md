# 🎰 Buckshot Roulette Tracker / Helper

[![Status-Active](https://img.shields.io/badge/Status-Active-success)](https://github.com/flild/buckshot-roulette-helper)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Demo**: [#todo](https://#todo)

<img width="800" alt="Buckshot Tracker Preview" src="https://github.com/user-attachments/assets/e373a0f0-4c30-4951-8f65-9cddd048b79f" /> <!-- #todo update image if needed -->

A standalone web assistant for the game **Buckshot Roulette**. It helps track live and blank shells, calculates the exact probabilities of the next shot, and manages known shell sequences (simulating the "Burner Phone" item).

Designed to handle the mental math for the player, letting you focus on tactics and item management.

## ✨ Key Features

*   **🧮 Accurate Probability Calculation**: Automatically recalculates the chance of the next shot based on fired and "known" shells.
*   **📱 "Burner Phone" Support (Chamber Sequence)**: Interactive shell queue. If you use the Burner Phone item and learn a specific shell's charge, mark it in the tracker (Live / Blank) to instantly adjust the probability math.
*   **⏪ Undo Actions**: Accidentally clicked the wrong button? Any action can be rolled back.
*   **📊 Round History**: Detailed list of all shots in the current magazine. Shows the probability at which each shot was taken.
*   **🏆 Match and Streak Management**: Skip the current magazine (if items reset it or the Dealer reloads) and track Win Streaks (Best & Current).
*   **🎨 Dual Interface Modes**: Full mode with comprehensive analytics and a minimalist Assist mode.

## ⌨️ Keyboard Shortcuts

*   `L` - Shoot Live shell
*   `B` - Shoot Blank shell
*   `U` - Undo last action
*   `F` - Toggle View Mode (Full / Assist)
*   `R` - Reset current round
*   `N` - Start New Round (when applicable)

## 🔒 Privacy & LocalStorage

This application is fully client-side and requires **no internet connection** after the initial load. It uses your browser's `localStorage` to save your language preference, win streaks, and current match state so you don't lose progress if you accidentally refresh the page. No tracking, analytics, or personal data collection is implemented.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   `git clone https://github.com/flild/buckshot-roulette-helper.git`
   `cd buckshot-roulette-helper`

2. **Install dependencies:**
   `npm install`

3. **Start the development server:**
   `npm run dev &`

4. **Open in browser:** Go to [http://localhost:3000](http://localhost:3000)

## 🤝 Contributing

Pull requests are welcome! If you want to add new features, please check our [CONTRIBUTING.md](CONTRIBUTING.md) and open an *Issue* to discuss or create a *Pull Request*.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

*Disclaimer: This is a fan-made tool and is not affiliated with the creator of the original Buckshot Roulette game, Mike Klubnika.*
