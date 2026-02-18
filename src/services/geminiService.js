/**
 * Google Gemini AI Service
 * Free tier: 60 requests per minute
 * Get API key from: https://makersuite.google.com/app/apikey
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using the actual available model names from API
const GEMINI_MODELS = [
  'models/gemini-2.5-flash',      // Latest flash model - fast and efficient
  'models/gemini-flash-latest',   // Always points to latest flash
  'models/gemini-pro-latest'      // Latest pro model - most capable
];
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Call Gemini API with retry logic and model fallback
 * @param {string} prompt - The prompt to send to Gemini
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<string>} The AI response
 */
async function callGeminiAPI(prompt, maxRetries = 2) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  // Try different models in case one isn't available
  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const apiUrl = `${GEMINI_API_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`;
        console.log(`Trying model: ${model}`);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,  // Increased from 1024 to allow longer responses
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error?.message || response.statusText;
          
          // If 404, try next model
          if (response.status === 404) {
            console.warn(`Model ${model} not available (404), trying next...`);
            break; // Break inner loop to try next model
          }
          
          throw new Error(`Gemini API error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
          throw new Error('No response from Gemini API');
        }

        const text = data.candidates[0].content.parts[0].text;
        console.log(`✅ Successfully used model: ${model}`);
        return text;

      } catch (error) {
        // If it's a 404 from the inner try, break to try next model
        if (error.message.includes('404')) {
          break;
        }
        
        if (attempt === maxRetries) {
          // If last retry for this model, try next model
          console.warn(`Model ${model} failed after ${maxRetries} retries:`, error.message);
          break;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  // If all models failed
  throw new Error('All Gemini models failed. Please check your API key and try again later.');
}

/**
 * Generate interview questions for a specific role
 * @param {string} role - The role/topic for questions
 * @param {number} count - Number of questions to generate
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateQuestions(role, count = 5) {
  const roleDescriptions = {
    'frontend': 'Frontend Developer (React, JavaScript, CSS, HTML, Web APIs)',
    'backend': 'Backend Developer (Node.js, APIs, Databases, Security, Architecture)',
    'fullstack': 'Full Stack Developer (Frontend + Backend, System Design)',
    'data-analyst': 'Data Analyst (SQL, Python, Statistics, Data Visualization, Analytics)',
    'qa': 'QA Engineer (Testing, Test Automation, Bug Tracking, QA Processes)'
  };

  const roleDescription = roleDescriptions[role] || role;

  const prompt = `Generate ${count} interview questions for ${roleDescription}.

Return ONLY valid JSON (no markdown, no extra text):
[
  {
    "id": 1,
    "question": "question text",
    "difficulty": "easy",
    "category": "category name"
  }
]

Mix difficulties (easy/medium/hard). Keep questions concise. Generate now:`;

  try {
    const response = await callGeminiAPI(prompt);
    
    // Extract JSON from response (handle cases where AI adds markdown)
    let jsonText = response.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Check if JSON is complete (basic validation)
    if (!jsonText.endsWith(']') && !jsonText.endsWith('}')) {
      console.warn('⚠️ Response appears truncated:', jsonText.slice(-100));
      throw new Error('AI response was incomplete (hit token limit). Please try again.');
    }
    
    // Parse JSON
    const questions = JSON.parse(jsonText);
    
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format from AI');
    }

    // Validate and normalize questions
    return questions.map((q, index) => ({
      id: q.id || index + 1,
      question: q.question || 'Question not provided',
      difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty?.toLowerCase()) 
        ? q.difficulty.toLowerCase() 
        : 'medium',
      category: q.category || 'General'
    }));

  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Provide helpful error message
    if (error.message.includes('JSON')) {
      throw new Error('AI response was incomplete. This usually means the response was too long. Please try again.');
    }
    
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

/**
 * Evaluate an answer using AI
 * @param {Object} question - The question object
 * @param {string} answer - The user's answer
 * @returns {Promise<Object>} Evaluation result with feedback and score
 */
export async function evaluateAnswerWithAI(question, answer) {
  const prompt = `Evaluate this interview answer:

Q: "${question.question}"
Category: ${question.category}

Answer: "${answer}"

Return ONLY this JSON (no markdown):
{
  "score": 75,
  "isRelevant": true,
  "isCorrect": true,
  "strengths": ["point 1", "point 2"],
  "improvements": ["tip 1", "tip 2"],
  "summary": "Brief assessment"
}

Score 0-100. Be constructive.`;

  try {
    const response = await callGeminiAPI(prompt);
    
    // Extract JSON from response
    let jsonText = response.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Check if JSON is complete
    if (!jsonText.endsWith('}')) {
      console.warn('⚠️ Evaluation response appears truncated');
      throw new Error('AI response was incomplete. Please try again.');
    }
    
    const evaluation = JSON.parse(jsonText);
    
    // Build feedback text
    let feedbackText = evaluation.summary || 'Answer evaluated.';
    
    if (evaluation.strengths && evaluation.strengths.length > 0) {
      feedbackText += '\n\n✅ Strengths:\n• ' + evaluation.strengths.join('\n• ');
    }
    
    if (evaluation.improvements && evaluation.improvements.length > 0) {
      feedbackText += '\n\n💡 Areas for Improvement:\n• ' + evaluation.improvements.join('\n• ');
    }

    return {
      text: feedbackText,
      score: Math.min(Math.max(evaluation.score || 0, 0), 100),
      relevanceScore: Math.min(Math.max(evaluation.score || 0, 0), 100),
      isRelevant: evaluation.isRelevant !== false,
      isCorrect: evaluation.isCorrect !== false
    };

  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw new Error(`Failed to evaluate answer: ${error.message}`);
  }
}

/**
 * Generate a hint for a question
 * @param {Object} question - The question object
 * @returns {Promise<string>} A helpful hint
 */
export async function generateHint(question) {
  const prompt = `Give a helpful hint for: "${question.question}"

Rules:
- Don't reveal the answer
- Mention 1-2 key concepts
- 2-3 sentences max
- Be encouraging

Provide ONLY the hint text:`;

  try {
    const response = await callGeminiAPI(prompt);
    return response.trim();
  } catch (error) {
    console.error('Error generating hint:', error);
    throw new Error(`Failed to generate hint: ${error.message}`);
  }
}

/**
 * Check if Gemini API is configured
 * @returns {boolean} True if API key is configured
 */
export function isGeminiConfigured() {
  return GEMINI_API_KEY && GEMINI_API_KEY !== 'your_api_key_here';
}

/**
 * Test API connection and list available models
 * @returns {Promise<Object>} Test results
 */
export async function testGeminiAPI() {
  if (!isGeminiConfigured()) {
    return { success: false, error: 'API key not configured' };
  }

  try {
    // Try to list available models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    const availableModels = data.models?.map(m => m.name) || [];

    return {
      success: true,
      availableModels,
      message: 'API connection successful'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
