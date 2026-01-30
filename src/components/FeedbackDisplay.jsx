import { getScoreInterpretation } from '../services/answerEvaluationService';

function FeedbackDisplay({ feedback, score, isRelevant, isCorrect, onReadFeedback, isSpeaking }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-300';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const scoreInterpretation = score !== null ? getScoreInterpretation(score) : '';

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-semibold text-blue-900">AI Evaluation & Feedback</h4>
        </div>
        <button
          onClick={onReadFeedback}
          disabled={isSpeaking}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
          title="Read feedback aloud"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>

      {/* Score Display */}
      {score !== null && (
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-3">
            <div className={`px-4 py-2 rounded-lg border-2 font-bold text-2xl ${getScoreColor(score)}`}>
              {score}/100
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Score: {scoreInterpretation}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className={`flex items-center gap-1 ${isRelevant ? 'text-green-600' : 'text-red-600'}`}>
                  {isRelevant ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-xs font-medium">Relevant</span>
                </div>
                <div className={`flex items-center gap-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-xs font-medium">Correct</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Text */}
      <div className="bg-white rounded-lg p-4 border border-blue-200">
        <p className="text-gray-800 leading-relaxed whitespace-pre-line">{feedback}</p>
      </div>

      {isSpeaking && (
        <div className="mt-3 flex items-center gap-2 text-blue-600">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Reading feedback...</span>
        </div>
      )}
    </div>
  );
}

export default FeedbackDisplay;
