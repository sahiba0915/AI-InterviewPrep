import { getScoreInterpretation } from '../services/answerEvaluationService';

function FeedbackDisplay({ feedback, score, isRelevant, isCorrect, onReadFeedback, isSpeaking }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-300';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const scoreInterpretation = score !== null ? getScoreInterpretation(score) : '';

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5 sm:p-2 shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-base sm:text-lg md:text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-words">AI Evaluation & Feedback</h4>
        </div>
        <button
          onClick={onReadFeedback}
          disabled={isSpeaking}
          className="w-10 h-10 sm:w-auto sm:h-auto sm:p-3 shrink-0 flex items-center justify-center text-blue-600 hover:text-white bg-blue-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 transform hover:scale-110 touch-manipulation"
          title="Read feedback aloud"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>

      {/* Score Display */}
      {score !== null && (
        <div className="mb-4 sm:mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mb-3 sm:mb-4">
            <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 font-extrabold text-2xl sm:text-3xl shadow-lg ${getScoreColor(score)}`}>
              {score}/100
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-bold text-gray-800">Score: {scoreInterpretation}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                <div className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full ${isRelevant ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isRelevant ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-[10px] sm:text-xs font-bold ${isRelevant ? 'text-green-700' : 'text-red-700'}`}>Relevant</span>
                </div>
                <div className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isCorrect ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-[10px] sm:text-xs font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>Correct</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Text */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-200 shadow-lg custom-scrollbar overflow-y-auto max-h-96">
        <p className="text-gray-800 leading-relaxed whitespace-pre-line text-xs sm:text-sm md:text-base break-words">{feedback}</p>
      </div>

      {isSpeaking && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl shadow-lg">
          <div className="relative shrink-0">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full animate-ping absolute"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-xs sm:text-sm font-bold">Reading feedback...</span>
        </div>
      )}
    </div>
  );
}

export default FeedbackDisplay;
