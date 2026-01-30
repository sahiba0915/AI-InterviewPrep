/**
 * Mock AI Evaluation Service
 * Simulates AI-based answer evaluation with relevance checking and scoring
 */

// Keywords and concepts for different question categories
const categoryKeywords = {
  'JavaScript': ['variable', 'scope', 'hoisting', 'closure', 'async', 'promise', 'function', 'object', 'array', 'let', 'const', 'var', 'es6', 'arrow function'],
  'React': ['component', 'virtual dom', 'state', 'props', 'hook', 'lifecycle', 'render', 'jsx', 'reconciliation', 'fiber'],
  'CSS': ['specificity', 'selector', 'cascade', 'inheritance', 'box model', 'flexbox', 'grid', 'responsive', 'media query'],
  'APIs': ['rest', 'graphql', 'endpoint', 'http', 'request', 'response', 'json', 'crud', 'status code'],
  'Database': ['sql', 'nosql', 'query', 'index', 'transaction', 'normalization', 'schema', 'relational', 'mongodb', 'mysql'],
  'Security': ['authentication', 'authorization', 'encryption', 'hash', 'jwt', 'oauth', 'csrf', 'xss', 'sql injection'],
  'Architecture': ['microservice', 'monolith', 'scalability', 'design pattern', 'mvc', 'api', 'service', 'deployment'],
  'Programming': ['synchronous', 'asynchronous', 'thread', 'concurrency', 'parallel', 'callback', 'event loop'],
  'Web Development': ['http', 'https', 'request', 'response', 'client', 'server', 'rendering', 'ssr', 'csr'],
  'Analytics': ['descriptive', 'diagnostic', 'predictive', 'prescriptive', 'metric', 'kpi', 'dashboard', 'visualization'],
  'Data Cleaning': ['outlier', 'missing data', 'normalization', 'validation', 'transformation', 'quality'],
  'Statistics': ['correlation', 'causation', 'mean', 'median', 'standard deviation', 'distribution', 'hypothesis'],
  'Data Visualization': ['chart', 'graph', 'dashboard', 'plot', 'visualization', 'insight', 'trend'],
  'SQL': ['select', 'join', 'where', 'group by', 'having', 'index', 'query', 'optimization', 'performance'],
  'Testing': ['test', 'testing', 'manual', 'automated', 'automation', 'unit', 'integration', 'system', 'acceptance', 'tdd', 'test-driven', 'bug', 'defect', 'error', 'test case', 'scenario', 'assertion', 'verification', 'validation'],
  'Test Cases': ['test case', 'scenario', 'precondition', 'steps', 'expected result', 'actual result', 'test data', 'boundary', 'edge case', 'positive', 'negative']
};

/**
 * Calculate relevance score based on keyword matching
 * @param {string} answer - User's answer
 * @param {string} category - Question category
 * @returns {number} Relevance score (0-100)
 */
function calculateRelevanceScore(answer, category) {
  const keywords = categoryKeywords[category] || [];
  if (keywords.length === 0) return 60; // Default score if category not found

  const answerLower = answer.toLowerCase();
  let matchedKeywords = 0;
  
  keywords.forEach(keyword => {
    if (answerLower.includes(keyword.toLowerCase())) {
      matchedKeywords++;
    }
  });

  // More lenient: Give partial credit even for few matches
  // Base score of 40 for attempting to answer
  const baseScore = 40;
  
  // Keyword matching: More generous scoring
  const keywordMatchRatio = matchedKeywords / keywords.length;
  const keywordScore = Math.min(keywordMatchRatio * 100, 100);
  
  // Boost score for longer, more detailed answers (more generous)
  const wordCount = answer.split(' ').length;
  const lengthScore = Math.min(wordCount / 30 * 40, 40); // Max 40 points for length (was 30)
  
  // Combine scores: 30% base, 30% keyword matching, 40% length (more lenient)
  const finalScore = baseScore + (keywordScore * 0.3) + lengthScore;
  
  return Math.min(Math.round(finalScore), 100);
}

/**
 * Check if answer is correct based on question content
 * @param {Object} question - Question object
 * @param {string} answer - User's answer
 * @returns {Object} Correctness analysis
 */
function checkCorrectness(question, answer) {
  const answerLower = answer.toLowerCase();
  const questionLower = question.question.toLowerCase();
  
  // Extract key concepts from question
  const questionWords = questionLower.split(' ').filter(w => w.length > 4);
  
  // Check if answer addresses the question
  let addressesQuestion = false;
  questionWords.forEach(word => {
    if (answerLower.includes(word)) {
      addressesQuestion = true;
    }
  });

  // Check answer quality indicators
  const hasTechnicalTerms = /(function|variable|method|api|database|component|algorithm|structure)/i.test(answer);
  const hasExplanation = answer.split('.').length > 2; // Multiple sentences
  const hasExamples = /(example|instance|case|scenario|for instance)/i.test(answer);
  const hasComparison = /(difference|compare|versus|vs|unlike|similar)/i.test(answer);

  return {
    addressesQuestion,
    hasTechnicalTerms,
    hasExplanation,
    hasExamples,
    hasComparison
  };
}

/**
 * Generate detailed feedback based on evaluation
 * @param {Object} question - Question object
 * @param {string} answer - User's answer
 * @param {number} relevanceScore - Relevance score
 * @param {Object} correctness - Correctness analysis
 * @returns {Object} Feedback object with text and score
 */
function generateFeedback(question, answer, relevanceScore, correctness) {
  const score = Math.round(relevanceScore);
  let feedback = '';
  const strengths = [];
  const improvements = [];

  // Score-based feedback
  if (score >= 80) {
    feedback += 'Excellent answer! ';
    strengths.push('Your answer demonstrates strong understanding');
  } else if (score >= 60) {
    feedback += 'Good answer! ';
    strengths.push('You covered the main concepts');
  } else if (score >= 40) {
    feedback += 'Decent start. ';
    improvements.push('Try to include more technical details');
  } else {
    feedback += 'Your answer needs more depth. ';
    improvements.push('Consider explaining the concepts more thoroughly');
  }

  // Relevance feedback (more lenient thresholds)
  if (relevanceScore >= 60) {
    strengths.push('Your answer is relevant to the question');
  } else if (relevanceScore >= 40) {
    strengths.push('Your answer touches on relevant concepts');
    improvements.push('Try to expand on the topic: ' + question.category);
  } else {
    improvements.push('Focus more on the specific topic: ' + question.category);
  }

  // Correctness feedback
  if (correctness.addressesQuestion) {
    strengths.push('You directly addressed the question');
  } else {
    improvements.push('Make sure your answer directly relates to the question asked');
  }

  if (correctness.hasTechnicalTerms) {
    strengths.push('You used appropriate technical terminology');
  } else {
    improvements.push('Include more technical terms and concepts');
  }

  if (correctness.hasExplanation) {
    strengths.push('You provided a detailed explanation');
  } else {
    improvements.push('Elaborate more with detailed explanations');
  }

  if (correctness.hasExamples) {
    strengths.push('Good use of examples');
  } else {
    improvements.push('Consider adding examples to illustrate your points');
  }

  if (correctness.hasComparison) {
    strengths.push('You made helpful comparisons');
  }

  // Build feedback text
  if (strengths.length > 0) {
    feedback += '\n\nStrengths:\n• ' + strengths.join('\n• ');
  }

  if (improvements.length > 0) {
    feedback += '\n\nAreas for Improvement:\n• ' + improvements.join('\n• ');
  }

  // Add category-specific suggestions
  feedback += `\n\nTip: For ${question.category} questions, try to include specific concepts, best practices, and real-world applications.`;

  // More lenient thresholds for relevance and correctness
  const finalScore = Math.round(relevanceScore);
  
  return {
    text: feedback,
    score: finalScore,
    relevanceScore: finalScore,
    isRelevant: relevanceScore >= 50, // Lowered from 60 to 50
    isCorrect: finalScore >= 60 && correctness.addressesQuestion // Lowered from 70 to 60
  };
}

/**
 * Evaluate an answer using AI-like analysis
 * @param {Object} question - Question object
 * @param {string} answer - User's answer text
 * @returns {Promise<Object>} Evaluation result with feedback and score
 */
export async function evaluateAnswer(question, answer) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!answer || answer.trim().length === 0) {
    return {
      text: 'Please provide an answer to evaluate.',
      score: 0,
      relevanceScore: 0,
      isRelevant: false,
      isCorrect: false
    };
  }

  // Calculate scores
  let relevanceScore = calculateRelevanceScore(answer, question.category);
  const correctness = checkCorrectness(question, answer);

  // Boost score if answer addresses the question directly
  if (correctness.addressesQuestion) {
    relevanceScore = Math.min(relevanceScore + 15, 100); // +15 bonus for addressing question
  }

  // Boost score for technical terms
  if (correctness.hasTechnicalTerms) {
    relevanceScore = Math.min(relevanceScore + 10, 100); // +10 bonus for technical terms
  }

  // Boost score for explanations
  if (correctness.hasExplanation) {
    relevanceScore = Math.min(relevanceScore + 5, 100); // +5 bonus for detailed explanation
  }

  // Ensure minimum score for any reasonable attempt (at least 30 words)
  const wordCount = answer.split(' ').length;
  if (wordCount >= 30 && relevanceScore < 50) {
    relevanceScore = Math.max(relevanceScore, 50); // Minimum 50 for substantial answers
  }

  // Generate feedback
  const feedback = generateFeedback(question, answer, relevanceScore, correctness);

  return feedback;
}

/**
 * Get score interpretation
 * @param {number} score - Score (0-100)
 * @returns {string} Score interpretation
 */
export function getScoreInterpretation(score) {
  if (score >= 90) return 'Outstanding';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 40) return 'Needs Improvement';
  return 'Poor';
}
