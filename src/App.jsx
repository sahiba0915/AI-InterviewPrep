import { useState, useEffect } from 'react';
import TopicSelector from './components/TopicSelector';
import QuestionCard from './components/QuestionCard';
import ReviewPage from './components/ReviewPage';
import { getTopicStats, areAllQuestionsAnswered, clearTopicProgress } from './services/progressService';

// Topic mapping for display names
const topicNames = {
  'frontend': 'Frontend Developer',
  'backend': 'Backend Developer',
  'fullstack': 'Full Stack Developer',
  'data-analyst': 'Data Analyst'
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          AI Interview Prep
        </h1>
        
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
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {topicNames[selectedTopic] || selectedTopic}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                <button
                  onClick={handleBackToSelection}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Change Topic
                </button>
              </div>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.totalAttempts}</p>
                  <p className="text-xs text-gray-600">Total Attempts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.questionsAttempted}</p>
                  <p className="text-xs text-gray-600">Questions Attempted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.averageAttempts > 0 ? stats.averageAttempts.toFixed(1) : '0'}
                  </p>
                  <p className="text-xs text-gray-600">Avg Attempts</p>
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
