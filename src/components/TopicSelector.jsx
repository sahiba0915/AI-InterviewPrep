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
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Select Your Interview Topic
        </h2>
        <p className="text-gray-600">
          Choose a role or technology area to start practicing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            disabled={isLoading}
            className={`
              relative p-6 rounded-lg border-2 transition-all duration-200
              ${selectedTopic === topic.id
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{topic.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">
                {topic.name}
              </h3>
            </div>
            
            {selectedTopic === topic.id && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading questions...</p>
        </div>
      )}
    </div>
  );
}

export default TopicSelector;
