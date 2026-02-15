/**
 * Fuzzy string matching utilities for course name matching
 * Integrated with official Lynbrook High School course database
 */

import { LYNBROOK_COURSES, COURSE_NAME_MAP, type LynbrookCourse } from './lynbrookCourses';

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculates similarity score between two strings (0-1, where 1 is identical)
 */
function similarityScore(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  if (str1.length === 0 || str2.length === 0) return 0.0;

  const maxLen = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

/**
 * Normalizes a string for comparison (removes special chars, lowercases, etc.)
 */
function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace special chars with space
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();
}

/**
 * Extracts key words from a course name (removes common words)
 */
function extractKeyWords(str: string): string[] {
  const commonWords = new Set(['the', 'and', 'or', 'a', 'an', 'to', 'of', 'in', 'on', 'at', 'for', 'with', '&']);
  return str
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length >= 1 && !commonWords.has(word)); // Allow single char words for abbreviations like "LA"
}

/**
 * Checks if one string is an abbreviation of another
 */
function isAbbreviation(short: string, long: string): boolean {
  const shortWords = extractKeyWords(short);
  const longWords = extractKeyWords(long);
  
  if (shortWords.length === 0) return false;
  
  // Check if short words match the beginning of long words or are abbreviations
  let shortIndex = 0;
  let matchedWords = 0;
  
  for (const longWord of longWords) {
    if (shortIndex < shortWords.length) {
      const shortWord = shortWords[shortIndex];
      
      // Exact match
      if (longWord === shortWord) {
        shortIndex++;
        matchedWords++;
        continue;
      }
      
      // Starts with match
      if (longWord.startsWith(shortWord) || shortWord.startsWith(longWord.substring(0, Math.min(4, longWord.length)))) {
        shortIndex++;
        matchedWords++;
        continue;
      }
      
      // Abbreviation match (e.g., "calc" matches "calculus", "precalc" matches "pre-calculus")
      // Also handle very short abbreviations (2 chars like "LA")
      if ((shortWord.length >= 2 && longWord.includes(shortWord)) || 
          (shortWord.length >= 2 && longWord.startsWith(shortWord))) {
        shortIndex++;
        matchedWords++;
        continue;
      }
      
      // Check if short word is abbreviation of long word (first 3-4 chars)
      if (shortWord.length >= 3 && longWord.length >= shortWord.length) {
        const longStart = longWord.substring(0, Math.min(shortWord.length + 1, longWord.length));
        if (similarityScore(shortWord, longStart) > 0.7) {
          shortIndex++;
          matchedWords++;
          continue;
        }
      }
    }
  }
  
  // Match if at least 50% of words match, or at least 1 word matches (for very short abbreviations)
  // For very short inputs (like "LA"), be more lenient
  if (shortWords.length <= 2) {
    return matchedWords >= 1; // Single word match is enough for short abbreviations
  }
  return matchedWords >= Math.min(shortWords.length * 0.5, 2) || matchedWords >= 2;
}

/**
 * Calculates word-based similarity (checks if key words match)
 */
function wordSimilarity(str1: string, str2: string): number {
  const words1 = extractKeyWords(str1);
  const words2 = extractKeyWords(str2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  let matches = 0;
  const totalWords = Math.max(words1.length, words2.length);
  
  for (const word1 of words1) {
    for (const word2 of words2) {
      // Exact match
      if (word1 === word2) {
        matches++;
        break;
      }
      // Partial match (one contains the other)
      if (word1.includes(word2) || word2.includes(word1)) {
        matches += 0.7;
        break;
      }
      // Similarity match (Levenshtein)
      if (word1.length > 3 && word2.length > 3) {
        const sim = similarityScore(word1, word2);
        if (sim > 0.7) {
          matches += sim;
          break;
        }
      }
    }
  }
  
  return matches / totalWords;
}

/**
 * Calculates comprehensive similarity score between two course names
 */
function calculateSimilarity(input: string, official: string): number {
  const inputNorm = normalizeForComparison(input);
  const officialNorm = normalizeForComparison(official);
  
  // Exact match after normalization
  if (inputNorm === officialNorm) return 1.0;
  
  // Check if input contains official or vice versa
  if (inputNorm.includes(officialNorm) || officialNorm.includes(inputNorm)) {
    return 0.9;
  }
  
  // Check abbreviation (higher weight for abbreviations)
  if (isAbbreviation(inputNorm, officialNorm) || isAbbreviation(officialNorm, inputNorm)) {
    return 0.9; // Higher score for abbreviations since they're intentional
  }
  
  // Special handling for very short abbreviations (2-3 chars) that might match first letters
  if (inputNorm.length <= 3 && inputNorm.length >= 2) {
    const officialWords = extractKeyWords(officialNorm);
    const inputUpper = inputNorm.toUpperCase();
    
    // Check if input matches first letters of official course words
    const firstLetters = officialWords.map(w => w[0] || '').join('');
    if (firstLetters === inputUpper || firstLetters.startsWith(inputUpper) || inputUpper.startsWith(firstLetters)) {
      return 0.85; // High score for acronym matches
    }
    
    // Check if input matches beginning of any key word
    for (const word of officialWords) {
      if (word.startsWith(inputNorm) && word.length >= inputNorm.length + 2) {
        return 0.8; // Good match for abbreviation
      }
    }
  }
  
  // Word-based similarity
  const wordSim = wordSimilarity(inputNorm, officialNorm);
  
  // Character-based similarity (Levenshtein)
  const charSim = similarityScore(inputNorm, officialNorm);
  
  // Combined score (weighted)
  return Math.max(wordSim * 0.6 + charSim * 0.4, wordSim, charSim);
}

/**
 * Finds the best matching Lynbrook course using fuzzy matching with official database
 */
export function findBestLynbrookMatch(
  input: string
): { course: string; category: string; credits: number; score: number } | null {
  if (!input || input.trim().length === 0) return null;

  const inputNorm = normalizeForComparison(input);

  // First, try exact match (including aliases) - fastest path
  const exactMatch = COURSE_NAME_MAP[inputNorm];
  if (exactMatch) {
    return {
      course: exactMatch.name,
      category: exactMatch.category,
      credits: exactMatch.credits,
      score: 1.0,
    };
  }

  let bestMatch: { course: string; category: string; credits: number; score: number } | null = null;
  let bestScore = 0;

  // Calculate similarity with all official Lynbrook courses
  for (const lynbrookCourse of LYNBROOK_COURSES) {
    // Check against main course name
    let score = calculateSimilarity(input, lynbrookCourse.name);

    // Also check against all aliases and take the best score
    if (lynbrookCourse.aliases) {
      for (const alias of lynbrookCourse.aliases) {
        const aliasScore = calculateSimilarity(input, alias);
        score = Math.max(score, aliasScore);
      }
    }

    // Lower threshold for very short inputs (like "LA", "PE") - they need special handling
    const minThreshold = inputNorm.length <= 3 ? 0.35 : 0.45;

    if (score > bestScore && score >= minThreshold) {
      bestScore = score;
      bestMatch = {
        course: lynbrookCourse.name,
        category: lynbrookCourse.category,
        credits: lynbrookCourse.credits,
        score,
      };
    }
  }

  return bestMatch;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use findBestLynbrookMatch instead
 */
export function findBestFuzzyMatch(
  input: string,
  courseMap: Record<string, string>,
  creditsMap: Record<string, number>
): { course: string; category: string; credits: number; score: number } | null {
  // Redirect to new Lynbrook-specific matcher
  return findBestLynbrookMatch(input);
}

/**
 * Finds multiple potential Lynbrook course matches (for debugging or user selection)
 */
export function findTopLynbrookMatches(
  input: string,
  topN: number = 3
): Array<{ course: string; category: string; credits: number; score: number }> {
  if (!input || input.trim().length === 0) return [];

  const matches: Array<{ course: string; category: string; credits: number; score: number }> = [];

  for (const lynbrookCourse of LYNBROOK_COURSES) {
    // Check against main course name
    let score = calculateSimilarity(input, lynbrookCourse.name);

    // Also check against all aliases and take the best score
    if (lynbrookCourse.aliases) {
      for (const alias of lynbrookCourse.aliases) {
        const aliasScore = calculateSimilarity(input, alias);
        score = Math.max(score, aliasScore);
      }
    }

    if (score >= 0.4) { // Lower threshold for multiple matches
      matches.push({
        course: lynbrookCourse.name,
        category: lynbrookCourse.category,
        credits: lynbrookCourse.credits,
        score,
      });
    }
  }

  // Sort by score descending and return top N
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use findTopLynbrookMatches instead
 */
export function findTopMatches(
  input: string,
  courseMap: Record<string, string>,
  creditsMap: Record<string, number>,
  topN: number = 3
): Array<{ course: string; category: string; credits: number; score: number }> {
  // Redirect to new Lynbrook-specific matcher
  return findTopLynbrookMatches(input, topN);
}

