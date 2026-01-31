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
      <div className="glassmorphism rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 mb-4 sm:mb-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 sm:mb-6 shadow-2xl animate-bounce">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-4">
            Topic Review Complete! 🎉
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold px-4">
            {topicName}
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{averageScore}</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-white/90 mt-1 sm:mt-2 font-semibold">Average Score</p>
            <p className={`text-[9px] sm:text-xs font-bold mt-1 sm:mt-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-sm`}>
              {performance.text}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{percentageScore}%</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-white/90 mt-1 sm:mt-2 font-semibold">Overall Score</p>
            <p className="text-[9px] sm:text-xs text-white/80 mt-1 sm:mt-2 font-semibold">{totalScore} / {maxPossibleScore}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{relevantCount}/{totalQuestions}</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-white/90 mt-1 sm:mt-2 font-semibold">Relevant Answers</p>
            <p className="text-[9px] sm:text-xs text-white/80 mt-1 sm:mt-2 font-semibold">{correctCount} correct</p>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{totalQuestions}</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-white/90 mt-1 sm:mt-2 font-semibold">Questions</p>
            <p className="text-[9px] sm:text-xs text-white/80 mt-1 sm:mt-2 font-semibold">All completed ✓</p>
          </div>
        </div>

        {/* Questions Breakdown */}
        <div className="border-t-2 border-gray-300 pt-4 sm:pt-6 md:pt-8">
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 px-1">
            <span>📋</span> Question Breakdown
          </h3>
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {questionScores.map((q, index) => (
              <div
                key={q.id}
                className="border-2 border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 hover:border-purple-400 transition-all duration-300 bg-white shadow-md hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-bold text-gray-600 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        Q{index + 1}
                      </span>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full shadow-md ${
                        q.difficulty === 'easy' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
                        q.difficulty === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                        'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                      }`}>
                        {q.difficulty.toUpperCase()}
                      </span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-purple-700 bg-purple-100 rounded-full shadow-md">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base break-words">{q.question}</p>
                  </div>
                  {q.score !== null ? (
                    <div className={`sm:ml-4 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-extrabold text-base sm:text-lg md:text-xl shadow-lg ${getScoreColor(q.score)} shrink-0 self-start`}>
                      {q.score}/100
                    </div>
                  ) : (
                    <div className="sm:ml-4 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-extrabold text-base sm:text-lg md:text-xl text-gray-400 bg-gray-100 shadow-lg shrink-0 self-start">
                      N/A
                    </div>
                  )}
                </div>
                
                {q.score !== null && (
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className={`flex items-center gap-1 ${q.isRelevant ? 'text-green-600' : 'text-red-600'}`}>
                        {q.isRelevant ? (
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">Relevant</span>
                      </div>
                      <div className={`flex items-center gap-1 ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {q.isCorrect ? (
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 md:pt-8 border-t-2 border-gray-300">
          <button
            onClick={onBackToSelection}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-gray-700 bg-white border-2 border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation"
          >
            ← Back to Topics
          </button>
          <button
            onClick={onRetakeTopic}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 touch-manipulation"
          >
            🔄 Retake Topic
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
