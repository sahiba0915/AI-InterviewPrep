/**
 * Post-processing utility to fix common speech recognition errors
 * Especially for technical terms that the Web Speech API struggles with
 */

// Common technical term corrections
const technicalCorrections = {
  // JavaScript keywords
  'where': 'var',
  'wear': 'var',
  'ware': 'var',
  'were': 'var',
  'well': 'var',
  'bar': 'var',
  
  // Variable operations
  'resive': 'reassigned',
  'resign': 'reassigned',
  'rear sign': 'reassigned',
  'reassign': 'reassigned',
  're declared': 'redeclared',
  'rede declared': 'redeclared',
  'read declared': 'redeclared',
  'read declare': 'redeclared',
  're declare': 'redeclared',
  
  // Scope-related terms
  'blocks cooked': 'block scoped',
  'block scope': 'block scoped',
  'blocks scope': 'block scoped',
  'function scope': 'function scoped',
  'function scoped': 'function scoped',
  
  // Const/let specific
  'constant': 'const',
  'cons': 'const',
  'conscious': 'const',
  'causes': 'const',
  'cause': 'const',
  'coins': 'const',
  'coined': 'const',
  
  // Temporal dead zone
  'latent constant iron temporal': 'let and const have temporal',
  'latent constant': 'let and const',
  'iron temporal': 'temporal',
  
  // Other common errors
  'ascent': 'reassigned',
  'or read declared': 'or redeclared',
  'can be the ascent or read declared': 'can be reassigned or redeclared',
  'that sound': 'that',
  'you prefer': 'prefer',
  'we try to avoid': 'avoid',
  
  // Hoisting
  'hosted': 'hoisted',
  'hosting': 'hoisting',
  'hosted with undefined': 'hoisted with undefined',
  
  // Common phrases
  'the difference between': 'the difference between',
  'is that': 'is that',
  'can be': 'can be',
  'cannot be': 'cannot be',
  'but not': 'but not',
  'and can be': 'and can be',
};

/**
 * Fix common technical term errors in transcript
 * @param {string} text - Raw transcript text
 * @returns {string} - Corrected transcript
 */
export function correctTranscript(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let corrected = text.toLowerCase();
  
  // Apply technical corrections (longer phrases first to avoid partial matches)
  const sortedCorrections = Object.entries(technicalCorrections)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [incorrect, correct] of sortedCorrections) {
    // Use word boundaries for better matching
    const regex = new RegExp(`\\b${incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    corrected = corrected.replace(regex, correct);
  }
  
  // Fix common spacing issues
  corrected = corrected
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\s+([.,!?])/g, '$1') // Remove space before punctuation
    .replace(/([.,!?])\s*/g, '$1 ') // Ensure space after punctuation
    .trim();
  
  // Capitalize first letter of sentences
  corrected = corrected
    .split(/[.!?]\s+/)
    .map(sentence => {
      if (sentence.length === 0) return sentence;
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    })
    .join('. ');
  
  // Capitalize first letter of the entire text
  if (corrected.length > 0) {
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
  }
  
  return corrected;
}

/**
 * Get suggestions for common technical terms
 * @returns {Array<string>} Array of terms to speak clearly
 */
export function getTechnicalTermTips() {
  return [
    'Say "var" (not "where" or "wear")',
    'Say "let" clearly',
    'Say "const" (not "cons" or "cause")',
    'Say "reassigned" (not "resign" or "resive")',
    'Say "redeclared" (not "read declared")',
    'Say "block scoped" (not "blocks cooked")',
    'Say "hoisted" (not "hosted")',
    'Pause briefly between technical terms'
  ];
}
