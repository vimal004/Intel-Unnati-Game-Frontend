# 🎮 **Intel Unnati - AI Adaptive Quiz Game** 
[Visit the Live Demo](https://intel-unnati-game-frontend.vercel.app/)

Welcome to the **AI-Powered Adaptive Quiz Game**, an innovative educational platform developed under the **Intel Unnati program**. This project brings together **Generative AI** and **Machine Learning** to offer a **personalized learning experience**. Through dynamic quiz generation, real-time feedback, and adaptive difficulty, this quiz game helps learners progress at their own pace while keeping them engaged.

---

## 🚀 **Key Features**
- 🌐 **Dynamic Quiz Generation**: Automatically adapts quiz content based on student performance.
- 🎯 **Personalized Learning Paths**: Adjust quiz difficulty dynamically using AI to offer the right challenge.
- 📊 **Performance Analytics**: Visualize student progress through detailed graphs and statistics.
- ⏳ **Real-time Feedback**: Immediate results after each question to keep students informed and motivated.
- 🧩 **Interactive UI**: Designed with **Next.js**, **TypeScript**, and **TailwindCSS** for a responsive, clean, and modular experience.
- 🧠 **Topic Selector**: Personalize quizzes by selecting specific subjects and topics.
- 🖼️ **Scalable Folder Structure**: A modular code structure designed to scale with growing features and content.

---

## 🌍 **How it Works**

The **AI-Powered Adaptive Quiz Game** uses **machine learning models** to provide a highly interactive and personalized learning environment:
1. **Quiz Generation**: The **T5 model** generates dynamic quiz questions based on selected topics.
2. **Difficulty Prediction**: **XGBoost** adjusts quiz difficulty in real-time based on the learner's past performance.
3. **Personalized Recommendations**: **SVD (Singular Value Decomposition)** recommends new questions tailored to the user's strengths and weaknesses.
4. **Real-time Feedback**: The system provides continuous feedback to ensure that students stay motivated and informed about their learning progress.

---

## 🗂️ **Folder Structure**

The directory structure is organized into specific areas for clear separation of concerns:

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

## 🛠️ **Tech Stack**

The project is built using modern, scalable, and performant technologies. Here's a breakdown of the **tech stack**:

| **Technology**                                | **Description**                                             |
|-----------------------------------------------|-------------------------------------------------------------|
| **Next.js** ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)  | Framework for building fast, server-side rendered web apps |
| **TypeScript** ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Adds type safety to JavaScript for better maintainability |
| **TailwindCSS** ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Utility-first CSS framework for building custom designs |
| **React.js** ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | JavaScript library for building user interfaces |
| **Node.js** ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | JavaScript runtime for building server-side applications |
| **Express.js** ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | Web framework for Node.js used for backend API routes |
| **XGBoost** ![XGBoost](https://img.shields.io/badge/XGBoost-3E8E41?style=flat&logo=xgboost&logoColor=white) | Machine learning algorithm for difficulty prediction |
| **SVD** ![SVD](https://img.shields.io/badge/SVD-003366?style=flat&logo=python&logoColor=white) | Collaborative filtering model for recommendations |
| **Pickle** ![Pickle](https://img.shields.io/badge/Pickle-FFCC00?style=flat&logo=python&logoColor=black) | Python module for serializing and saving trained models |
| **TensorFlow/Keras** ![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat&logo=tensorflow&logoColor=white) | Framework for building and training machine learning models |
| **Python** ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | Programming language used for backend logic and AI model training |
| **Flask** ![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white) | Micro web framework for Python to serve AI models and APIs |
| **MongoDB** ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | NoSQL database used for storing user data, quiz results, and performance history |
| **Streamlit** ![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=flat&logo=streamlit&logoColor=white) | Python framework for building interactive data applications and visualizations |

---

## 📦 **Installation & Setup**

To set up and run the project locally, follow these steps:

### 1. Clone the Repository:

```bash
git clone https://github.com/vimal004/Intel-Unnati-Game-Frontend.git
cd Intel-Unnati-Game-Frontend
```

### 2. Install Dependencies:

```bash
npm install
# Or if you prefer using pnpm:
pnpm install
```

### 3. Start the Development Server:

```bash
npm run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000).

---

## 🔌 **API Integration**

This frontend is designed to work with an AI-powered backend for generating quizzes and storing user performance data.

### Backend Requirements:
- **Quiz Generation**: The frontend communicates with the backend to fetch quizzes tailored to the user’s selected topic and difficulty level.
- **Performance Tracking**: The app logs quiz results, performance metrics, and stores quiz history for personalized recommendations.

---

## 📸 **Screenshots**

Here are some key screenshots of the app’s interface:

### 📋 **Landing Page**

![Landing Page](https://via.placeholder.com/800x400)

This page allows the user to sign up, log in, and view available quiz topics.

### 🧩 **Quiz Game View**

![Quiz View](https://via.placeholder.com/800x400)

The quiz game interface where users answer dynamic questions based on their selected topics.

### 📊 **Performance Dashboard**

![Performance Dashboard](https://via.placeholder.com/800x400)

Displays detailed progress and performance statistics, allowing users to track their learning journey.

---

## 💡 **How to Run the Streamlit App (`app.py`)**

For the full interactive experience, the **Streamlit** app can be run to interact with the backend and quiz generation models.

### Step-by-Step Guide:

1. **Install Dependencies**:
   Make sure you have **Streamlit** and other required libraries installed:
   ```bash
   pip install streamlit
   pip install -r requirements.txt  # If a requirements.txt is provided
   ```

2. **Run the App**:
   Navigate to the directory containing **`app.py`** and run the following command:
   ```bash
   streamlit run app.py
   ```

3. **Open the App**:
   Once the app is running, you’ll see the URL in the terminal (usually `http://localhost:8501`). Open this in your browser to interact with the quiz app!

---

## **Conclusion**

The **AI-Powered Adaptive Quiz Game** is a powerful platform designed to enhance learning experiences through personalized, dynamic quizzes. By leveraging **Generative AI** and **Machine Learning**, this app adapts quiz content based on the learner’s progress, ensuring that students are always challenged appropriately. Through real-time feedback and personalized learning paths, the system helps students stay engaged and motivated throughout their learning journey.
