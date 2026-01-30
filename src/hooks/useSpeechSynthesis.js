import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for speech synthesis using Web Speech API
 * Provides text-to-speech functionality
 * 
 * @returns {Object} Object containing synthesis state and controls
 */
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  // Check browser support and load voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      setError('Speech synthesis is not supported in this browser.');
      return;
    }

    setIsSupported(true);

    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Voices may load asynchronously
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /**
   * Speak text
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options (rate, pitch, volume, voice, lang)
   */
  const speak = useCallback((text, options = {}) => {
    if (!isSupported) {
      setError('Speech synthesis is not supported in this browser.');
      return;
    }

    if (!text || text.trim() === '') {
      setError('No text provided to speak.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set default options
    utterance.rate = options.rate || 1.0; // 0.1 to 10
    utterance.pitch = options.pitch || 1.0; // 0 to 2
    utterance.volume = options.volume !== undefined ? options.volume : 1.0; // 0 to 1
    utterance.lang = options.lang || 'en-US';

    // Set voice if provided
    if (options.voice) {
      const selectedVoice = voices.find(v => 
        v.name === options.voice || v.voiceURI === options.voice
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setError(null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      let errorMessage = 'An error occurred with speech synthesis.';
      
      switch (event.error) {
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        case 'synthesis-failed':
          errorMessage = 'Speech synthesis failed.';
          break;
        case 'synthesis-unavailable':
          errorMessage = 'Speech synthesis is unavailable.';
          break;
        case 'text-too-long':
          errorMessage = 'Text is too long to speak.';
          break;
        case 'invalid-argument':
          errorMessage = 'Invalid argument provided.';
          break;
        default:
          errorMessage = `Speech synthesis error: ${event.error}`;
      }
      
      setError(errorMessage);
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  /**
   * Stop speaking
   */
  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, []);

  /**
   * Pause speaking
   */
  const pause = useCallback(() => {
    if (window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
    }
  }, [isSpeaking, isPaused]);

  /**
   * Resume speaking
   */
  const resume = useCallback(() => {
    if (window.speechSynthesis && isSpeaking && isPaused) {
      window.speechSynthesis.resume();
    }
  }, [isSpeaking, isPaused]);

  /**
   * Get available voices filtered by language
   * @param {string} lang - Language code (e.g., 'en-US')
   * @returns {Array} Filtered voices
   */
  const getVoicesByLang = useCallback((lang = 'en-US') => {
    return voices.filter(voice => voice.lang.startsWith(lang.split('-')[0]));
  }, [voices]);

  return {
    isSpeaking,
    isPaused,
    error,
    isSupported,
    voices,
    speak,
    stop,
    pause,
    resume,
    getVoicesByLang
  };
}
