# CodeTrace - AI Bug Detective

An AI-powered visual debugging tool that analyzes screen recordings and codebases to identify and fix root causes of bugs.

## ✨ Features

- **🎥 Visual Analysis**: Upload a screen recording (.mp4) of the bug in action.
- **💻 Code Context**: Upload your codebase (.zip) for deep analysis.
- **🤖 Gemini AI**: Uses Google's Gemini 1.5 Flash to correlate visual symptoms with code logic.
- **⚡ Modern UI**: 
    - **Sticky Scroll Hero**: Immersive storytelling introduction.
    - **Video Previews**: Instant playback of uploaded evidence.
    - **Interactive Toasts**: Real-time feedback.
    - **Responsive Design**: Optimized for all devices.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to the app directory**:
   ```bash
   cd app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [CSS Modules](https://github.com/css-modules/css-modules)
- **AI Model**: Google Gemini 1.5 Flash
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📂 Project Structure

```
TraceBack Project/
├── app/                      # Next.js Application
│   ├── src/
│   │   ├── app/              # App Router Pages & Layouts
│   │   ├── components/       # Reusable UI Components
│   │   └── styles/           # Global Styles
│   ├── public/               # Static Assets
│   └── package.json          # Project Configuration
└── README.md                 # Documentation
```

## 🔒 Security & Privacy

- Codebase uploads are processed securely.
- Video evidence is analyzed for debugging purposes only.

---
*Built with ❤️ by [Your Name]*
