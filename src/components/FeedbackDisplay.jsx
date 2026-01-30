import { getScoreInterpretation } from '../services/answerEvaluationService';

function FeedbackDisplay({ feedback, score, isRelevant, isCorrect, onReadFeedback, isSpeaking }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-300';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const scoreInterpretation = score !== null ? getScoreInterpretation(score) : '';

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 rounded-2xl p-6 mb-4 shadow-2xl">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Evaluation & Feedback</h4>
        </div>
        <button
          onClick={onReadFeedback}
          disabled={isSpeaking}
          className="p-3 text-blue-600 hover:text-white bg-blue-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 transform hover:scale-110"
          title="Read feedback aloud"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>

      {/* Score Display */}
      {score !== null && (
        <div className="mb-5">
          <div className="flex items-center gap-5 mb-4">
            <div className={`px-6 py-3 rounded-2xl border-2 font-extrabold text-3xl shadow-lg ${getScoreColor(score)}`}>
              {score}/100
            </div>
            <div>
              <p className="text-base font-bold text-gray-800">Score: {scoreInterpretation}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${isRelevant ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isRelevant ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-xs font-bold ${isRelevant ? 'text-green-700' : 'text-red-700'}`}>Relevant</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isCorrect ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-xs font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>Correct</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Text */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border-2 border-purple-200 shadow-lg">
        <p className="text-gray-800 leading-relaxed whitespace-pre-line text-base">{feedback}</p>
      </div>

      {isSpeaking && (
        <div className="mt-4 flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow-lg">
          <div className="relative">
            <div className="w-3 h-3 bg-white rounded-full animate-ping absolute"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-bold">Reading feedback...</span>
        </div>
      )}
    </div>
  );
}

export default FeedbackDisplay;
