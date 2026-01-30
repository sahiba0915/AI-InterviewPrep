import { useState, useEffect, useRef, useCallback } from 'react';
import { correctTranscript } from '../utils/transcriptCorrections';

/**
 * Custom hook for speech recognition using Web Speech API
 * Provides speech-to-text functionality
 * 
 * @returns {Object} Object containing recognition state and controls
 */
export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    setIsSupported(true);
    
    // Initialize recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = true; // Show interim results
    recognition.lang = 'en-US'; // Use en-US for clearer tech term recognition
    recognition.maxAlternatives = 3; // Get alternatives; we use the first (highest confidence)

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = finalTranscriptRef.current;

      // Process all results; use first alternative (highest confidence)
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const first = result[0];
        const text = first ? first.transcript : '';
        
        if (result.isFinal && text) {
          finalTranscript += text + ' ';
        } else if (text) {
          interimTranscript += text;
        }
      }

      finalTranscriptRef.current = finalTranscript;
      const rawTranscript = (finalTranscript + interimTranscript).trim();
      // Apply corrections to improve accuracy for technical terms
      // Only correct final parts to avoid flickering during interim results
      const correctedFinal = correctTranscript(finalTranscript);
      const combinedTranscript = (correctedFinal + interimTranscript).trim();
      setTranscript(combinedTranscript);
    };

    recognition.onerror = (event) => {
      let errorMessage = 'An error occurred with speech recognition.';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        case 'aborted':
          // Triggered when we manually stop recognition.
          // Treat this as a normal stop: clear listening state but don't show an error.
          setIsListening(false);
          return;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      setError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  /**
   * Start speech recognition
   * @param {boolean} clearPrevious - If true, reset transcript before starting (e.g. for "Record again")
   */
  const startListening = useCallback((clearPrevious = false) => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        if (clearPrevious) {
          finalTranscriptRef.current = '';
          setTranscript('');
        } else {
          finalTranscriptRef.current = transcript; // Preserve current transcript
        }
        recognitionRef.current.start();
      } catch (err) {
        // Recognition might already be starting
        if (err.name !== 'InvalidStateError') {
          setError('Failed to start speech recognition.');
        }
      }
    }
  }, [isSupported, isListening, transcript]);

  /**
   * Stop speech recognition
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  /**
   * Reset transcript
   */
  const resetTranscript = useCallback(() => {
    setTranscript('');
    finalTranscriptRef.current = '';
  }, []);

  /**
   * Set recognition language
   */
  const setLanguage = useCallback((lang) => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, []);

  return {
    transcript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage
  };
}
