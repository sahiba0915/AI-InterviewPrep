# AI Interview Prep - Web Application

A modern web application for interview preparation with speech-to-text and text-to-speech capabilities.

## 🚀 Tech Stack

- **React 19** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Web Speech API** - Browser-native STT and TTS (no external dependencies)

## 📁 Project Structure

```
src/
├── components/     # Reusable React components
├── hooks/         # Custom React hooks
├── services/      # API services, localStorage utilities
├── utils/         # Helper functions and utilities
├── contexts/      # React Context providers
├── types/         # Type definitions
├── App.jsx        # Main application component
├── main.jsx       # Application entry point
└── index.css      # Global styles with Tailwind directives
```

## 🛠️ Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🎯 Features

- Topic/role selection for interview preparation
- Question display from mock API
- Voice answers using microphone (Speech-to-Text)
- Text and audio feedback (Text-to-Speech)
- Progress tracking with localStorage
