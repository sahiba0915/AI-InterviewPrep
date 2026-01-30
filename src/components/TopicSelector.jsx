import { useState } from 'react';
import { questionService } from '../services/questionService';

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

  const handleTopicClick = async (topicId) => {
    setSelectedTopic(topicId);
    setIsLoading(true);
    
    try {
      // Fetch questions for the selected topic
      const questions = await questionService.getQuestions(topicId);
      onTopicSelect(topicId, questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="glassmorphism rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-300/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent mb-4 leading-tight">
            Select Your Interview Topic
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            Choose a role or technology area to start practicing 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              disabled={isLoading}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300 group overflow-hidden
                ${selectedTopic === topic.id
                  ? 'border-transparent bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 shadow-2xl scale-105 ring-4 ring-purple-300/50'
                  : 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-purple-300 hover:shadow-xl hover:bg-white'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                transform hover:-translate-y-2
              `}
            >
              {/* Shimmer effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
                selectedTopic === topic.id ? 'hidden' : ''
              }`}></div>
              
              <div className="text-center relative z-10">
                <div className={`text-5xl mb-4 transform transition-all duration-300 ${
                  selectedTopic === topic.id ? 'scale-110 drop-shadow-lg' : 'group-hover:scale-110'
                }`}>
                  {topic.icon}
                </div>
                <h3 className={`text-lg font-bold ${
                  selectedTopic === topic.id ? 'text-white drop-shadow-md' : 'text-gray-900 group-hover:text-purple-700'
                } transition-colors duration-300`}>
                  {topic.name}
                </h3>
              </div>
              
              {selectedTopic === topic.id && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/50 rounded-full blur-md animate-pulse"></div>
                    <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce">
                      <svg
                        className="w-5 h-5 text-purple-600"
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
          <div className="mt-8 text-center relative z-10">
            <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-xl border border-purple-200">
              <div className="relative">
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-purple-200 border-t-purple-600"></div>
              </div>
              <p className="text-gray-800 font-bold text-sm">Loading questions...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopicSelector;
