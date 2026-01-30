import { getTopicProgress } from '../services/progressService';
import { getScoreInterpretation } from '../services/answerEvaluationService';

function ReviewPage({ topic, topicName, questions, onBackToSelection, onRetakeTopic }) {
  const topicProgress = getTopicProgress(topic);
  
  // Get scores for all questions
  const questionScores = questions.map(q => {
    const progress = topicProgress[q.id];
    return {
      ...q,
      score: progress?.lastScore || null,
      bestScore: progress?.bestScore || null,
      attempts: progress?.attempts || 0,
      isRelevant: progress?.isRelevant || false,
      isCorrect: progress?.isCorrect || false,
      feedback: progress?.feedback || []
    };
  });

  // Calculate statistics
  const answeredQuestions = questionScores.filter(q => q.score !== null);
  const totalQuestions = questions.length;
  const averageScore = answeredQuestions.length > 0
    ? Math.round(answeredQuestions.reduce((sum, q) => sum + q.score, 0) / answeredQuestions.length)
    : 0;
  const totalScore = answeredQuestions.reduce((sum, q) => sum + q.score, 0);
  const maxPossibleScore = totalQuestions * 100;
  const percentageScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  
  const relevantCount = answeredQuestions.filter(q => q.isRelevant).length;
  const correctCount = answeredQuestions.filter(q => q.isCorrect).length;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getOverallPerformance = () => {
    if (averageScore >= 80) return { text: 'Excellent', color: 'text-green-600' };
    if (averageScore >= 70) return { text: 'Very Good', color: 'text-blue-600' };
    if (averageScore >= 60) return { text: 'Good', color: 'text-yellow-600' };
    if (averageScore >= 50) return { text: 'Fair', color: 'text-orange-600' };
    return { text: 'Needs Improvement', color: 'text-red-600' };
  };

  const performance = getOverallPerformance();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Topic Review Complete!
          </h2>
          <p className="text-lg text-gray-600">
            {topicName}
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{averageScore}</p>
            <p className="text-sm text-gray-600 mt-1">Average Score</p>
            <p className={`text-xs font-medium mt-1 ${performance.color}`}>
              {performance.text}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{percentageScore}%</p>
            <p className="text-sm text-gray-600 mt-1">Overall Score</p>
            <p className="text-xs text-gray-500 mt-1">{totalScore} / {maxPossibleScore}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{relevantCount}/{totalQuestions}</p>
            <p className="text-sm text-gray-600 mt-1">Relevant Answers</p>
            <p className="text-xs text-gray-500 mt-1">{correctCount} correct</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{totalQuestions}</p>
            <p className="text-sm text-gray-600 mt-1">Questions</p>
            <p className="text-xs text-gray-500 mt-1">All completed</p>
          </div>
        </div>

        {/* Questions Breakdown */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Question Breakdown</h3>
          <div className="space-y-4">
            {questionScores.map((q, index) => (
              <div
                key={q.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        q.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">{q.question}</p>
                  </div>
                  {q.score !== null ? (
                    <div className={`ml-4 px-4 py-2 rounded-lg font-bold text-lg ${getScoreColor(q.score)}`}>
                      {q.score}/100
                    </div>
                  ) : (
                    <div className="ml-4 px-4 py-2 rounded-lg font-bold text-lg text-gray-400 bg-gray-100">
                      N/A
                    </div>
                  )}
                </div>
                
                {q.score !== null && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm">
                      <div className={`flex items-center gap-1 ${q.isRelevant ? 'text-green-600' : 'text-red-600'}`}>
                        {q.isRelevant ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">Relevant</span>
                      </div>
                      <div className={`flex items-center gap-1 ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {q.isCorrect ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">Correct</span>
                      </div>
                      <span className="text-gray-500">
                        {q.attempts} attempt{q.attempts !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {q.bestScore && q.bestScore > q.score && (
                      <p className="text-xs text-gray-500 mt-2">
                        Best score: {q.bestScore}/100
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onBackToSelection}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Topics
          </button>
          <button
            onClick={onRetakeTopic}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Retake Topic
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
