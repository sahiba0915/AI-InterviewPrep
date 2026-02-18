import { useState } from 'react';
import { questionService } from '../services/questionService';
import { isGeminiConfigured } from '../services/geminiService';

const topics = [
  { id: 'frontend', name: 'Frontend Developer', icon: '💻' },
  { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
  { id: 'fullstack', name: 'Full Stack Developer', icon: '🚀' },
  { id: 'data-analyst', name: 'Data Analyst', icon: '📊' },
  { id: 'qa', name: 'QA Engineer', icon: '🔍' }
];

function TopicSelector({ onTopicSelect }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const aiEnabled = isGeminiConfigured();

  const handleTopicClick = async (topicId) => {
    // Check if AI is configured before proceeding
    if (!aiEnabled) {
      alert('⚠️ AI is required for this app!\n\nPlease:\n1. Get a free API key from: https://aistudio.google.com/app/apikey\n2. Add it to your .env file as VITE_GEMINI_API_KEY\n3. Restart the dev server\n\nSee SETUP.md for detailed instructions.');
      return;
    }

    setSelectedTopic(topicId);
    setIsLoading(true);
    
    try {
      // Fetch AI-generated questions for the selected topic
      const questions = await questionService.getQuestions(topicId);
      onTopicSelect(topicId, questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert(`❌ Failed to generate questions:\n\n${error.message}\n\nPlease check:\n- Your internet connection\n- Your API key is correct\n- The Gemini API is enabled`);
      setSelectedTopic(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="glassmorphism rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
        {/* Decorative elements - hidden on mobile for better performance */}
        <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-300/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="text-center mb-6 sm:mb-8 md:mb-10 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight px-2">
            Select Your Interview Topic
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium px-4 mb-3">
            Choose a role or technology area to start practicing 🚀
          </p>
          
          {/* AI Status Badge */}
          <div className="flex justify-center">
            {aiEnabled ? (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg text-xs sm:text-sm font-bold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                🤖 AI Powered - Questions, Evaluation & Hints
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg text-xs sm:text-sm font-bold animate-pulse">
                <span className="text-base">⚠️</span>
                AI Required - Please Configure API Key
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 relative z-10">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              disabled={isLoading}
              className={`
                relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group overflow-hidden touch-manipulation
                ${selectedTopic === topic.id
                  ? 'border-transparent bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 shadow-2xl scale-100 sm:scale-105 ring-2 sm:ring-4 ring-purple-300/50'
                  : 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-purple-300 hover:shadow-xl hover:bg-white active:scale-95'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                transform hover:-translate-y-2 active:translate-y-0
              `}
            >
              {/* Shimmer effect on hover - hidden on mobile */}
              <div className={`hidden sm:block absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
                selectedTopic === topic.id ? 'hidden' : ''
              }`}></div>
              
              <div className="text-center relative z-10">
                <div className={`text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4 transform transition-all duration-300 ${
                  selectedTopic === topic.id ? 'scale-110 drop-shadow-lg' : 'group-hover:scale-110'
                }`}>
                  {topic.icon}
                </div>
                <h3 className={`text-sm sm:text-base md:text-lg font-bold ${
                  selectedTopic === topic.id ? 'text-white drop-shadow-md' : 'text-gray-900 group-hover:text-purple-700'
                } transition-colors duration-300`}>
                  {topic.name}
                </h3>
              </div>
              
              {selectedTopic === topic.id && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/50 rounded-full blur-sm sm:blur-md animate-pulse"></div>
                    <div className="relative w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-6 sm:mt-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-xl border border-purple-200">
              <div className="relative">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-3 border-purple-200 border-t-purple-600"></div>
              </div>
              <p className="text-gray-800 font-bold text-xs sm:text-sm">
                {aiEnabled ? '🤖 AI is generating questions...' : 'Loading questions...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopicSelector;
