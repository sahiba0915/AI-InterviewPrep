# 🎯 AI Interview Prep - PrepForge

An AI-powered interview preparation platform that helps you practice technical interviews with intelligent feedback, dynamic question generation, and personalized hints.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.19-38B2AC)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## ✨ Features

### 🤖 AI-Powered (With Free Google Gemini API)
- **Dynamic Question Generation**: AI generates role-specific interview questions tailored to your chosen tech domain
- **Intelligent Answer Evaluation**: Real-time AI feedback analyzing technical accuracy, completeness, clarity, and depth
- **Smart Hints**: Get contextual hints when you're stuck on a question
- **Graceful Fallback**: Works with pre-built questions if AI is not configured

### 🎤 Speech Recognition & Synthesis
- **Voice Input**: Record your answers using speech recognition (Chrome/Edge recommended)
- **Text-to-Speech**: Listen to questions and feedback read aloud
- **Minimum Speaking Time**: Enforces 30-second minimum to encourage detailed answers

### 📊 Progress Tracking
- Track attempts per question
- Monitor questions attempted
- View average attempts per question
- Review past answers and scores

### 💼 Multiple Tech Roles
- Frontend Developer (React, JavaScript, CSS, HTML)
- Backend Developer (Node.js, APIs, Databases, Security)
- Full Stack Developer (Frontend + Backend, System Design)
- Data Analyst (SQL, Python, Statistics, Visualization)
- QA Engineer (Testing, Automation, Bug Tracking)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern browser (Chrome, Edge, or Safari recommended for speech features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AI-InterviewPrep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Gemini AI (100% FREE)**

   a. Get your free API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

   b. Create environment file:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

   c. Edit `.env` and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

   > **Note**: The app works without AI using pre-built questions, but you'll miss out on dynamic question generation, intelligent evaluation, and hints.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)
   - Start practicing! 🎯

## 🎨 Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: TailwindCSS 3.4.19
- **AI**: Google Gemini 1.5 Flash (Free Tier)
- **APIs**: Web Speech API (Speech Recognition & Synthesis)
- **State Management**: React Hooks
- **Storage**: LocalStorage (for progress tracking)

## 📁 Project Structure

```
AI-InterviewPrep/
├── src/
│   ├── assets/              # Images and static assets
│   ├── components/          # React components
│   │   ├── TopicSelector.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── FeedbackDisplay.jsx
│   │   └── ReviewPage.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useSpeechRecognition.js
│   │   └── useSpeechSynthesis.js
│   ├── services/            # Business logic & API calls
│   │   ├── geminiService.js          # AI integration
│   │   ├── questionService.js        # Question management
│   │   ├── answerEvaluationService.js # Answer evaluation
│   │   └── progressService.js        # Progress tracking
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables (create this)
├── .env.example             # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Configuration

### Google Gemini API
- **Free Tier**: 60 requests per minute
- **No Credit Card Required**
- **Model Used**: gemini-1.5-flash (fast and efficient)

### Environment Variables
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## 🎯 How to Use

1. **Select a Topic**: Choose your interview focus area (Frontend, Backend, etc.)
2. **Read the Question**: Listen to or read the interview question
3. **Record Your Answer**: Click "Start Recording" and speak your answer
4. **Get a Hint** (optional): Click the hint button if you're stuck
5. **Submit**: Once you've spoken for 30+ seconds, submit your answer
6. **Review Feedback**: Get AI-powered feedback with scores and improvement suggestions
7. **Next Question**: Move to the next question and keep practicing!

## 📊 Scoring System

Answers are evaluated on:
- **Technical Accuracy (40%)**: Correctness of information
- **Completeness (30%)**: How fully the question is answered
- **Clarity (20%)**: How well-explained the concepts are
- **Depth (10%)**: Level of understanding demonstrated

Scores range from 0-100 with detailed feedback on strengths and areas for improvement.

## 🌟 Key Features Explained

### AI Question Generation
The app generates fresh, relevant questions for each practice session based on the selected role, ensuring varied practice.

### Intelligent Evaluation
AI analyzes your answer considering:
- Use of technical terminology
- Explanation quality
- Real-world examples
- Comparisons and contrasts

### Speech Recognition
- Supports continuous speech recognition
- Tracks speaking time
- Allows re-recording
- Provides pronunciation tips

### Progress Tracking
All your attempts are saved locally, allowing you to:
- See how many times you've attempted each question
- Review your previous answers
- Track improvement over time

## 🔒 Privacy & Data

- **All data stored locally** in your browser (LocalStorage)
- **No data sent to external servers** except AI API calls for evaluation
- **API calls are secure** and use HTTPS
- **No personal information collected**

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Safari**: Full support (iOS 14.5+)
- **Firefox**: Partial support (no Web Speech API)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 Resume Points

Use these bullet points for your resume:

- Built an **AI-powered interview preparation platform** generating role-specific questions dynamically using **React** and **Google Gemini API**
- Implemented **AI-driven answer evaluation** analyzing responses on technical accuracy, completeness, clarity, and depth with real-time feedback
- Designed **intuitive feedback UI** with scoring, improvement suggestions, hint generation, and graceful error handling
- Integrated **speech recognition and synthesis** for hands-free practice with 30-second minimum speaking time enforcement

## 📄 License

This project is open source and available for personal and educational use.

## 🙏 Acknowledgments

- Google Gemini for the free AI API
- React team for the amazing framework
- TailwindCSS for beautiful styling
- Web Speech API for voice features

---

**Made with ❤️ for interview preparation**

🌟 Star this repo if you found it helpful!
