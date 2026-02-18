import { generateQuestions as generateQuestionsWithAI, isGeminiConfigured } from './geminiService';

// Mock question data for different tech topics/roles (fallback if AI fails)
const mockQuestions = {
  'frontend': [
    {
      id: 1,
      question: "Explain the difference between let, const, and var in JavaScript.",
      difficulty: "easy",
      category: "JavaScript"
    },
    {
      id: 2,
      question: "What is the Virtual DOM in React and how does it work?",
      difficulty: "medium",
      category: "React"
    },
    {
      id: 3,
      question: "How would you optimize a React application for performance?",
      difficulty: "hard",
      category: "React"
    },
    {
      id: 4,
      question: "Explain CSS specificity and how it determines which styles are applied.",
      difficulty: "medium",
      category: "CSS"
    },
    {
      id: 5,
      question: "What are the differences between REST and GraphQL APIs?",
      difficulty: "medium",
      category: "APIs"
    }
  ],
  'backend': [
    {
      id: 1,
      question: "Explain the difference between SQL and NoSQL databases.",
      difficulty: "medium",
      category: "Database"
    },
    {
      id: 2,
      question: "What is the difference between authentication and authorization?",
      difficulty: "easy",
      category: "Security"
    },
    {
      id: 3,
      question: "How would you design a scalable microservices architecture?",
      difficulty: "hard",
      category: "Architecture"
    },
    {
      id: 4,
      question: "Explain the concept of database indexing and its benefits.",
      difficulty: "medium",
      category: "Database"
    },
    {
      id: 5,
      question: "What is the difference between synchronous and asynchronous programming?",
      difficulty: "medium",
      category: "Programming"
    }
  ],
  'fullstack': [
    {
      id: 1,
      question: "Explain the full request-response cycle in a web application.",
      difficulty: "medium",
      category: "Web Development"
    },
    {
      id: 2,
      question: "How would you implement user authentication in a full-stack application?",
      difficulty: "hard",
      category: "Security"
    },
    {
      id: 3,
      question: "What is the difference between server-side rendering and client-side rendering?",
      difficulty: "medium",
      category: "Web Development"
    },
    {
      id: 4,
      question: "Explain how you would handle CORS in a full-stack application.",
      difficulty: "medium",
      category: "APIs"
    },
    {
      id: 5,
      question: "How would you structure a full-stack project for maintainability?",
      difficulty: "hard",
      category: "Architecture"
    }
  ],
  'data-analyst': [
    {
      id: 1,
      question: "Explain the difference between descriptive, diagnostic, predictive, and prescriptive analytics.",
      difficulty: "medium",
      category: "Analytics"
    },
    {
      id: 2,
      question: "How would you identify and handle outliers in a dataset?",
      difficulty: "medium",
      category: "Data Cleaning"
    },
    {
      id: 3,
      question: "What is the difference between correlation and causation?",
      difficulty: "easy",
      category: "Statistics"
    },
    {
      id: 4,
      question: "Explain how you would create a dashboard to visualize key business metrics.",
      difficulty: "medium",
      category: "Data Visualization"
    },
    {
      id: 5,
      question: "What SQL techniques would you use to analyze large datasets efficiently?",
      difficulty: "hard",
      category: "SQL"
    }
  ],
  'qa': [
    {
      id: 1,
      question: "What is the difference between manual testing and automated testing?",
      difficulty: "easy",
      category: "Testing"
    },
    {
      id: 2,
      question: "Explain the different types of testing: unit, integration, system, and acceptance testing.",
      difficulty: "medium",
      category: "Testing"
    },
    {
      id: 3,
      question: "What is test-driven development (TDD) and how does it work?",
      difficulty: "medium",
      category: "Testing"
    },
    {
      id: 4,
      question: "How would you write a test case for a login functionality?",
      difficulty: "medium",
      category: "Test Cases"
    },
    {
      id: 5,
      question: "What is the difference between bug, defect, and error in software testing?",
      difficulty: "easy",
      category: "Testing"
    }
  ]
};

/**
 * Question service with AI-powered question generation
 * Falls back to mock data if AI is not configured or fails
 */
export const questionService = {
  /**
   * Get questions for a specific topic (AI-generated ONLY)
   * @param {string} topic - The topic/role to get questions for
   * @returns {Promise<Array>} Array of question objects
   */
  async getQuestions(topic) {
    if (!topic) {
      throw new Error('Topic is required');
    }

    // Check if AI is configured
    if (!isGeminiConfigured()) {
      throw new Error('AI is not configured. Please set VITE_GEMINI_API_KEY in your .env file to use this app.');
    }

    // Generate questions with AI
    try {
      console.log(`🤖 Generating AI questions for: ${topic}`);
      const aiQuestions = await generateQuestionsWithAI(topic, 5);
      console.log('✅ AI questions generated successfully');
      return aiQuestions;
    } catch (error) {
      console.error('❌ AI generation failed:', error.message);
      throw new Error(`Failed to generate questions: ${error.message}. Please check your API key and internet connection.`);
    }
  },

  /**
   * Get a random question for a specific topic
   * @param {string} topic - The topic/role to get a question for
   * @returns {Promise<Object>} A random question object
   */
  async getRandomQuestion(topic) {
    const questions = await this.getQuestions(topic);
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  },

  /**
   * Get all available topics
   * @returns {Array<string>} Array of available topic names
   */
  getAvailableTopics() {
    return Object.keys(mockQuestions);
  }
};
