/**
 * Service for managing user progress using localStorage
 */

const STORAGE_KEY = 'interview_prep_progress';

/**
 * Get all progress data
 * @returns {Object} Progress data object
 */
export const getProgress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading progress from localStorage:', error);
    return {};
  }
};

/**
 * Save progress for a specific topic and question
 * @param {string} topic - Topic/role identifier
 * @param {number} questionId - Question ID
 * @param {Object} progressData - Progress data to save
 */
export const saveProgress = (topic, questionId, progressData) => {
  try {
    const progress = getProgress();
    
    if (!progress[topic]) {
      progress[topic] = {};
    }
    
    if (!progress[topic][questionId]) {
      progress[topic][questionId] = {
        attempts: 0,
        lastAttempt: null,
        feedback: []
      };
    }
    
    // Update progress
    progress[topic][questionId].attempts += 1;
    progress[topic][questionId].lastAttempt = new Date().toISOString();
    
    // Add feedback if provided
    if (progressData.feedback) {
      progress[topic][questionId].feedback.push({
        text: progressData.feedback,
        timestamp: new Date().toISOString()
      });
    }
    
    // Store answer if provided
    if (progressData.answer) {
      progress[topic][questionId].lastAnswer = progressData.answer;
    }
    
    // Store score and evaluation results
    if (progressData.score !== undefined) {
      progress[topic][questionId].lastScore = progressData.score;
      progress[topic][questionId].bestScore = Math.max(
        progress[topic][questionId].bestScore || 0,
        progressData.score
      );
    }
    
    if (progressData.isRelevant !== undefined) {
      progress[topic][questionId].isRelevant = progressData.isRelevant;
    }
    
    if (progressData.isCorrect !== undefined) {
      progress[topic][questionId].isCorrect = progressData.isCorrect;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
    return false;
  }
};

/**
 * Get progress for a specific topic and question
 * @param {string} topic - Topic/role identifier
 * @param {number} questionId - Question ID
 * @returns {Object|null} Progress data or null if not found
 */
export const getQuestionProgress = (topic, questionId) => {
  const progress = getProgress();
  return progress[topic]?.[questionId] || null;
};

/**
 * Get all progress for a specific topic
 * @param {string} topic - Topic/role identifier
 * @returns {Object} Progress data for the topic
 */
export const getTopicProgress = (topic) => {
  const progress = getProgress();
  return progress[topic] || {};
};

/**
 * Get statistics for a topic
 * @param {string} topic - Topic/role identifier
 * @returns {Object} Statistics object
 */
export const getTopicStats = (topic) => {
  const topicProgress = getTopicProgress(topic);
  const questionIds = Object.keys(topicProgress);
  
  if (questionIds.length === 0) {
    return {
      totalAttempts: 0,
      questionsAttempted: 0,
      averageAttempts: 0
    };
  }
  
  const totalAttempts = questionIds.reduce((sum, id) => {
    return sum + (topicProgress[id].attempts || 0);
  }, 0);
  
  return {
    totalAttempts,
    questionsAttempted: questionIds.length,
    averageAttempts: totalAttempts / questionIds.length
  };
};

/**
 * Clear all progress
 */
export const clearProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing progress:', error);
    return false;
  }
};

/**
 * Clear progress for a specific topic
 * @param {string} topic - Topic/role identifier
 */
export const clearTopicProgress = (topic) => {
  try {
    const progress = getProgress();
    delete progress[topic];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.error('Error clearing topic progress:', error);
    return false;
  }
};

/**
 * Check if all questions for a topic have been answered
 * @param {string} topic - Topic/role identifier
 * @param {Array} questions - Array of question objects with id property
 * @returns {boolean} True if all questions have been answered
 */
export const areAllQuestionsAnswered = (topic, questions) => {
  const topicProgress = getTopicProgress(topic);
  return questions.every(q => {
    const progress = topicProgress[q.id];
    return progress && progress.lastScore !== undefined;
  });
};
