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
      <div className="glassmorphism rounded-3xl shadow-2xl p-8 md:p-12 mb-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-2xl animate-bounce">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Topic Review Complete! 🎉
          </h2>
          <p className="text-xl text-gray-700 font-semibold">
            {topicName}
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <p className="text-4xl font-extrabold text-white drop-shadow-lg">{averageScore}</p>
            <p className="text-sm text-white/90 mt-2 font-semibold">Average Score</p>
            <p className={`text-xs font-bold mt-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm`}>
              {performance.text}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <p className="text-4xl font-extrabold text-white drop-shadow-lg">{percentageScore}%</p>
            <p className="text-sm text-white/90 mt-2 font-semibold">Overall Score</p>
            <p className="text-xs text-white/80 mt-2 font-semibold">{totalScore} / {maxPossibleScore}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <p className="text-4xl font-extrabold text-white drop-shadow-lg">{relevantCount}/{totalQuestions}</p>
            <p className="text-sm text-white/90 mt-2 font-semibold">Relevant Answers</p>
            <p className="text-xs text-white/80 mt-2 font-semibold">{correctCount} correct</p>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <p className="text-4xl font-extrabold text-white drop-shadow-lg">{totalQuestions}</p>
            <p className="text-sm text-white/90 mt-2 font-semibold">Questions</p>
            <p className="text-xs text-white/80 mt-2 font-semibold">All completed ✓</p>
          </div>
        </div>

        {/* Questions Breakdown */}
        <div className="border-t-2 border-gray-300 pt-8">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <span>📋</span> Question Breakdown
          </h3>
          <div className="space-y-5">
            {questionScores.map((q, index) => (
              <div
                key={q.id}
                className="border-2 border-gray-200 rounded-2xl p-5 hover:border-purple-400 transition-all duration-300 bg-white shadow-md hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        Question {index + 1}
                      </span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${
                        q.difficulty === 'easy' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                        q.difficulty === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                        'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                      }`}>
                        {q.difficulty.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 text-xs font-bold text-purple-700 bg-purple-100 rounded-full shadow-md">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-gray-900 font-semibold text-base">{q.question}</p>
                  </div>
                  {q.score !== null ? (
                    <div className={`ml-4 px-5 py-3 rounded-2xl font-extrabold text-xl shadow-lg ${getScoreColor(q.score)}`}>
                      {q.score}/100
                    </div>
                  ) : (
                    <div className="ml-4 px-5 py-3 rounded-2xl font-extrabold text-xl text-gray-400 bg-gray-100 shadow-lg">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t-2 border-gray-300">
          <button
            onClick={onBackToSelection}
            className="w-full sm:w-auto px-8 py-4 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            ← Back to Topics
          </button>
          <button
            onClick={onRetakeTopic}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-bold shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            🔄 Retake Topic
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
