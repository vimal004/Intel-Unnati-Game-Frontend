# 🎮 Intel Unnati - AI Adaptive Quiz Game 
(https://intel-unnati-game-frontend.vercel.app/)

This project is the frontend for an **adaptive educational quiz game**, developed under the **Intel Unnati program**. It features dynamic quiz generation, performance tracking, and personalized user interactions. Built with **Next.js**, **TypeScript**, and **TailwindCSS**, it provides a responsive and modular UI designed to integrate with an AI-powered backend that curates quizzes.

---

## 🚀 Features

- 🌐 **Next.js App Router** with dedicated routes for Quiz, History, Results, and Performance
- 🎨 **TailwindCSS** for rapid and clean UI styling
- 🧩 **Modular Components** (Buttons, Cards, Charts, etc.)
- 🧠 **Topic Selector** to personalize quizzes
- 📊 **Performance Analytics** section
- ⏳ **Results Loading View** for async feedback
- 📁 Scalable folder structure for enterprise-grade apps

---

## 🗂️ Folder Structure

```
Intel-Unnati-Game-Frontend/
├── app/                        # Route-based views (Next.js App Router)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing/Homepage
│   ├── globals.css             # Tailwind global styles
│   ├── quiz/                   # Quiz game view
│   ├── results/                # Result summary + loader
│   ├── history/                # Past attempts
│   └── performance/            # Stats & analytics
│
├── components/
│   ├── quiz-topic-selector.tsx # Allows users to choose quiz topics
│   ├── theme-provider.tsx      # Dark/Light mode provider
│   └── ui/                     # Reusable UI components (buttons, cards, dialogs, etc.)
│
├── public/                     # Static files
├── tailwind.config.ts          # Tailwind customization
├── postcss.config.mjs          # PostCSS integration
├── next.config.mjs             # Next.js config
├── tsconfig.json               # TypeScript settings
├── package.json                # NPM metadata & dependencies
└── .gitignore
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 13+](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component UI**: Custom & ShadCN-based reusable UI components
- **Charting**: Simple chart integration for performance metrics

---

## 📦 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/vimal004/Intel-Unnati-Game-Frontend.git
cd Intel-Unnati-Game-Frontend

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
```

---

## 🔌 API Integration

This frontend expects an AI-powered backend for:
- Generating adaptive quizzes based on performance
- Returning result summaries and storing quiz history
