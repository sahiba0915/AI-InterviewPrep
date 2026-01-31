import { useState, useEffect } from 'react';
import TopicSelector from './components/TopicSelector';
import QuestionCard from './components/QuestionCard';
import ReviewPage from './components/ReviewPage';
import { getTopicStats, areAllQuestionsAnswered, clearTopicProgress } from './services/progressService';
import logo from './assets/PrepForgeLogo.webp';

// Topic mapping for display names
const topicNames = {
  'frontend': 'Frontend Developer',
  'backend': 'Backend Developer',
  'fullstack': 'Full Stack Developer',
  'data-analyst': 'Data Analyst',
  'qa': 'QA Engineer'
};

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stats, setStats] = useState({ totalAttempts: 0, questionsAttempted: 0, averageAttempts: 0 });

  const handleTopicSelect = (topic, fetchedQuestions) => {
    setSelectedTopic(topic);
    setQuestions(fetchedQuestions);
    setCurrentQuestionIndex(0);
    updateStats(topic);
  };

  const handleBackToSelection = () => {
    setSelectedTopic(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
  };

  const updateStats = (topic) => {
    const topicStats = getTopicStats(topic);
    setStats(topicStats);
  };

  useEffect(() => {
    if (selectedTopic) {
      updateStats(selectedTopic);
    }
  }, [selectedTopic, currentQuestionIndex]);

  // Check if all questions are answered
  const allQuestionsAnswered = selectedTopic && questions.length > 0 
    ? areAllQuestionsAnswered(selectedTopic, questions)
    : false;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSubmitted = () => {
    // Update stats after a question is submitted
    if (selectedTopic) {
      updateStats(selectedTopic);
    }
  };

  const handleRetakeTopic = () => {
    if (selectedTopic) {
      clearTopicProgress(selectedTopic);
      setCurrentQuestionIndex(0);
      updateStats(selectedTopic);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header with Logo */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          {/* Logo with elegant background */}
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <div className="relative group">
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-white/30 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl group-hover:bg-white/40 transition-all duration-500"></div>
              {/* Logo container */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <img 
                  src={logo} 
                  alt="PrepForge Logo" 
                  className="h-20 sm:h-28 md:h-36 w-auto relative z-10"
                />
              </div>
            </div>
          </div>
          
          {/* Tagline badge */}
          <div className="inline-block mb-3 sm:mb-4 animate-fade-in">
            <div className="bg-white/20 backdrop-blur-md rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 border border-white/30 shadow-xl hover:bg-white/25 transition-all duration-300">
              <span className="text-white text-xs sm:text-sm md:text-base font-semibold tracking-wide">🎯 Practice Makes Perfect</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-white/95 text-base sm:text-lg md:text-xl lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg px-4">
            Forge your interview skills with AI-powered feedback
          </p>
        </div>
        
        {!selectedTopic ? (
          <TopicSelector onTopicSelect={handleTopicSelect} />
        ) : allQuestionsAnswered ? (
          <ReviewPage
            topic={selectedTopic}
            topicName={topicNames[selectedTopic] || selectedTopic}
            questions={questions}
            onBackToSelection={handleBackToSelection}
            onRetakeTopic={handleRetakeTopic}
          />
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            {/* Header with Topic and Stats */}
            <div className="glassmorphism rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 card-hover">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent break-words">
                    {topicNames[selectedTopic] || selectedTopic}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium">
                    📝 Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                <button
                  onClick={handleBackToSelection}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 touch-manipulation"
                >
                  ← Change Topic
                </button>
              </div>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
                <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.totalAttempts}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-semibold mt-0.5 sm:mt-1">Total Attempts</p>
                </div>
                <div className="text-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.questionsAttempted}</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-semibold mt-0.5 sm:mt-1">Questions Attempted</p>
                </div>
                <div className="text-center bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stats.averageAttempts > 0 ? stats.averageAttempts.toFixed(1) : '0'}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 font-semibold mt-0.5 sm:mt-1">Avg Attempts</p>
                </div>
              </div>
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                topic={selectedTopic}
                onNext={handleNextQuestion}
                onPrevious={handlePreviousQuestion}
                isFirst={currentQuestionIndex === 0}
                isLast={currentQuestionIndex === questions.length - 1}
                onQuestionSubmitted={handleQuestionSubmitted}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
