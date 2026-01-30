import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import FeedbackDisplay from './FeedbackDisplay';
import { saveProgress } from '../services/progressService';
import { evaluateAnswer } from '../services/answerEvaluationService';

const MIN_SPEAKING_SECONDS = 30;

function QuestionCard({ question, topic, onNext, onPrevious, isFirst, isLast, onQuestionSubmitted }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(null);
  const [isRelevant, setIsRelevant] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0); // in seconds
  const [totalSpeakingTime, setTotalSpeakingTime] = useState(0); // cumulative speaking time
  const recordingStartTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  
  const {
    transcript,
    isListening,
    error: recognitionError,
    isSupported: recognitionSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: synthesisSupported
  } = useSpeechSynthesis();

  // Auto-read question when component mounts or question changes
  useEffect(() => {
    if (question && synthesisSupported) {
      speak(question.question, { rate: 0.9 });
    }
    
    // Cleanup: stop speaking and reset when question changes
    return () => {
      stopSpeaking();
      resetTranscript();
      setShowFeedback(false);
      setFeedback('');
      setHasAnswered(false);
      setRecordingDuration(0);
      setTotalSpeakingTime(0);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  // Timer effect to track recording duration and cumulative speaking time
  useEffect(() => {
    if (isListening) {
      // Start timer when recording begins
      if (!recordingStartTimeRef.current) {
        recordingStartTimeRef.current = Date.now();
      }
      
      // Update timer every second
      timerIntervalRef.current = setInterval(() => {
        if (recordingStartTimeRef.current) {
          const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
          setRecordingDuration(elapsed);
        }
      }, 1000);
    } else {
      // Stop timer when recording ends
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      
      // When stopping, add the current recording duration to total cumulative time
      if (recordingStartTimeRef.current) {
        const finalDuration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        setTotalSpeakingTime(prev => prev + finalDuration);
        recordingStartTimeRef.current = null;
        setRecordingDuration(0);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isListening]);

  const handleStartRecording = (recordAgain = false) => {
    if (!recognitionSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    if (!recordAgain) {
      resetTranscript();
    }
    setShowFeedback(false);
    setFeedback('');
    setRecordingDuration(0);
    setTotalSpeakingTime(0); // Reset so new recording must meet minimum time again
    recordingStartTimeRef.current = Date.now();
    startListening(recordAgain); // true = clear transcript so "Record again" starts fresh
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      alert('Please record an answer before submitting.');
      return;
    }

    if (totalSpeakingTime < MIN_SPEAKING_SECONDS) {
      const remaining = MIN_SPEAKING_SECONDS - totalSpeakingTime;
      alert(`Please speak for at least ${MIN_SPEAKING_SECONDS} seconds. You need ${remaining} more second${remaining !== 1 ? 's' : ''}.`);
      return;
    }

    setIsEvaluating(true);
    setShowFeedback(false);

    try {
      // Evaluate answer using AI service
      const evaluation = await evaluateAnswer(question, transcript);
      
      setFeedback(evaluation.text);
      setScore(evaluation.score);
      setIsRelevant(evaluation.isRelevant);
      setIsCorrect(evaluation.isCorrect);
      setShowFeedback(true);
      setHasAnswered(true);

      // Save progress with score
      saveProgress(topic, question.id, {
        answer: transcript,
        feedback: evaluation.text,
        score: evaluation.score,
        isRelevant: evaluation.isRelevant,
        isCorrect: evaluation.isCorrect
      });

      // Notify parent that question was submitted
      if (onQuestionSubmitted) {
        onQuestionSubmitted();
      }

      // Speak feedback
      if (synthesisSupported) {
        const feedbackToSpeak = `Your score is ${evaluation.score} out of 100. ${evaluation.text}`;
        speak(feedbackToSpeak, { rate: 0.85 });
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReadQuestion = () => {
    if (synthesisSupported && question) {
      speak(question.question, { rate: 0.9 });
    }
  };

  const handleReadFeedback = () => {
    if (synthesisSupported && feedback) {
      speak(feedback, { rate: 0.85 });
    }
  };

  return (
    <div className="glassmorphism rounded-2xl shadow-2xl p-8 mb-6 card-hover">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-md ${
              question.difficulty === 'easy' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' :
              question.difficulty === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
              'bg-gradient-to-r from-red-400 to-pink-500 text-white'
            }`}>
              {question.difficulty.toUpperCase()}
            </span>
            <span className="px-4 py-1.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full shadow-md">
              {question.category}
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">{question.question}</h3>
        </div>
        <button
          onClick={handleReadQuestion}
          disabled={isSpeaking}
          className="ml-4 p-3 text-purple-600 hover:text-white bg-purple-50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 transform hover:scale-110"
          title="Read question aloud"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>

      {/* Speech Recognition Section */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {!isListening ? (
            <button
              onClick={handleStartRecording}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              🎤 Start Recording
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-bold shadow-lg animate-pulse"
            >
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute"></div>
              <div className="w-4 h-4 bg-white rounded-full"></div>
              Recording... Click to Stop
            </button>
          )}
          
          {transcript && !isListening && (
            <button
              onClick={handleSubmitAnswer}
              disabled={hasAnswered || isEvaluating || totalSpeakingTime < MIN_SPEAKING_SECONDS}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              title={totalSpeakingTime < MIN_SPEAKING_SECONDS ? `Speak for ${MIN_SPEAKING_SECONDS - totalSpeakingTime} more second${MIN_SPEAKING_SECONDS - totalSpeakingTime !== 1 ? 's' : ''} to enable submit` : 'Submit your answer'}
            >
              {isEvaluating ? '⏳ Evaluating...' : totalSpeakingTime < MIN_SPEAKING_SECONDS ? `Submit (${MIN_SPEAKING_SECONDS - totalSpeakingTime}s left)` : '✓ Submit Answer'}
            </button>
          )}
          
          {isEvaluating && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-xl border-2 border-blue-200">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm font-bold text-blue-700">AI is evaluating your answer...</span>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 mb-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💬</span>
              <p className="text-sm text-purple-900 font-bold">Your Answer:</p>
            </div>
            <p className="text-gray-900 leading-relaxed text-lg">{transcript}</p>
            <div className="mt-4 space-y-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-purple-200">
                <p className="text-xs text-gray-700">
                  <strong className="text-purple-700">💡 Tip:</strong> Speak clearly and pause between technical terms. Use Chrome for best accuracy.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl p-3">
                <p className="text-xs text-blue-900 font-bold mb-2">✓ Common corrections:</p>
                <ul className="text-xs text-blue-800 list-disc list-inside space-y-1">
                  <li>Say "var" (not "where"), "let", "const" (not "cons")</li>
                  <li>Say "reassigned" and "redeclared" clearly</li>
                  <li>Say "block scoped" and "hoisted" distinctly</li>
                </ul>
              </div>
            </div>
            {!hasAnswered && !isListening && (
              <button
                type="button"
                onClick={() => handleStartRecording(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                title="Clear this answer and record again"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                🔄 Record again
              </button>
            )}
          </div>
        )}

        {/* Error Display */}
        {recognitionError && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-4 mb-4 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <p className="text-sm text-red-800 font-semibold">{recognitionError}</p>
            </div>
          </div>
        )}

        {/* Time Requirement and Progress */}
        <div className="mb-4">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-5 mb-3 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-yellow-900 flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                Minimum speaking time: {MIN_SPEAKING_SECONDS} seconds
              </p>
              <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${
                totalSpeakingTime >= MIN_SPEAKING_SECONDS 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {totalSpeakingTime} / {MIN_SPEAKING_SECONDS}s
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-yellow-200 rounded-full h-3 shadow-inner overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  totalSpeakingTime >= MIN_SPEAKING_SECONDS 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                }`}
                style={{ width: `${Math.min((totalSpeakingTime / MIN_SPEAKING_SECONDS) * 100, 100)}%` }}
              ></div>
            </div>
            {totalSpeakingTime < MIN_SPEAKING_SECONDS && (
              <p className="text-xs text-yellow-800 mt-2 font-semibold">
                🔔 {MIN_SPEAKING_SECONDS - totalSpeakingTime} second{MIN_SPEAKING_SECONDS - totalSpeakingTime !== 1 ? 's' : ''} remaining
              </p>
            )}
            {totalSpeakingTime >= MIN_SPEAKING_SECONDS && (
              <p className="text-xs text-green-800 mt-2 font-bold flex items-center gap-1">
                <span className="text-base">✓</span>
                Minimum time requirement met! You can now submit your answer.
              </p>
            )}
          </div>

          {/* Current Recording Indicator */}
          {isListening && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl shadow-lg mb-2 animate-pulse">
              <div className="relative">
                <div className="w-3 h-3 bg-white rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-sm font-bold">
                Recording... ({Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Display */}
      {showFeedback && feedback && (
        <FeedbackDisplay 
          feedback={feedback}
          score={score}
          isRelevant={isRelevant}
          isCorrect={isCorrect}
          onReadFeedback={handleReadFeedback}
          isSpeaking={isSpeaking}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200 mt-6">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={isLast || !hasAnswered}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          title={!hasAnswered ? 'Submit your answer first to go to the next question' : 'Next question'}
        >
          Next Question →
        </button>
      </div>
    </div>
  );
}

export default QuestionCard;
