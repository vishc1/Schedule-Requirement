/**
 * Comprehensive course normalization with systematic pattern matching
 * Organized by priority: Exact matches → AP courses → Honors → Standard → Fallback
 */

/**
 * List of headers and labels to ignore (not actual courses)
 */
const IGNORE_LIST = [
  "9th grade",
  "10th grade",
  "11th grade",
  "12th grade",
  "9th",
  "10th",
  "11th",
  "12th",
  "grade",
  "economics &",
  "social studies",
  "electives",
  "applied academics",
  "world language",
  "visual & performing arts",
  "visual and performing arts",
];

/**
 * Checks if a string should be ignored (is a header/label, not a course)
 */
export function shouldIgnore(text: string): boolean {
  const lower = text.toLowerCase().trim();

  // Valid short course abbreviations
  const validAbbreviations = ["la", "l.a.", "lit", "pe", "pe9", "pe10", "pe 9", "pe 10", "ap"];
  if (validAbbreviations.some(abbr => lower === abbr || lower.startsWith(abbr + " "))) {
    return false;
  }

  // Don't ignore if it contains course-specific keywords
  const courseKeywords = [
    "literature", "writing", "calculus", "algebra", "geometry",
    "chemistry", "biology", "physics", "history", "government",
    "economics", "spanish", "french", "mandarin", "chinese", "japanese",
    "story", "style", "pe ", "pe9", "pe10", "inclusion",
    "racquet", "weight training", "fitness", "statistics", "linear"
  ];

  if (courseKeywords.some(keyword => lower.includes(keyword))) {
    return false;
  }

  // Ignore if in the ignore list
  if (IGNORE_LIST.some(ignore => lower === ignore || lower.includes(ignore))) {
    return true;
  }

  // Ignore grade level patterns
  if (/^\d+(st|nd|rd|th)?\s*(grade)?$/i.test(lower)) {
    return true;
  }

  // Ignore very generic headers (but NOT lit/writing - that's a valid course!)
  const genericHeaders = ["math", "science", "english"];
  if (genericHeaders.includes(lower) && text.length < 10) {
    return true;
  }

  // Ignore very short strings (< 2 chars)
  if (text.trim().length < 2) {
    return true;
  }

  // For 2-char strings, check if they're valid
  if (text.trim().length === 2 && !validAbbreviations.includes(lower)) {
    return true;
  }

  return false;
}

/**
 * Cleans OCR text to fix common errors
 */
function cleanOCR(text: string): string {
  return text
    .replace(/Lit\s*\/\s*Writing/gi, "Literature & Writing")
    .replace(/Lit\s*\/\s*Wnting/gi, "Literature & Writing")
    .replace(/Llt\s*\/\s*Writing/gi, "Literature & Writing")
    .replace(/stern/gi, "STEM")
    .replace(/STERN/gi, "STEM")
    .trim();
}

/**
 * Comprehensive course normalization with clear precedence
 * Priority: Exact matches → AP courses → Honors → Standard courses
 */
export function normalizeCourse(name: string): string {
  const cleaned = cleanOCR(name);
  const lower = cleaned.toLowerCase().trim();

  // ========== PHASE 1: EXACT MATCHES (highest priority) ==========

  // PE courses (exact matches)
  if (lower === "pe 9" || lower === "pe9" || lower === "pe ninth") return "PE 9";
  if (lower === "pe 10" || lower === "pe10" || lower === "pe tenth") return "PE 10";
  if (lower === "pe inclusion" || lower === "pe inc" || lower === "inclusion pe" || lower === "pe incl") return "PE Inclusion";
  if (lower === "la" || lower === "l.a." || lower === "l a") return "Literature & Writing";
  if (lower === "lit") return "Literature & Writing"; // Handle "Lit" alone
  if (lower === "stem" || lower === "stern") return "STEM";

  // ========== PHASE 2: AP COURSES (second priority) ==========

  // Check for AP first to avoid conflicts
  const hasAP = lower.includes("ap");

  if (hasAP) {
    // AP MATH
    if (lower.match(/calc.*bc|bc.*calc/)) return "AP Calculus BC";
    if (lower.match(/calc.*ab|ab.*calc/)) return "AP Calculus AB";
    if (lower.includes("statistics") || lower.includes("stats")) return "AP Statistics";

    // AP SCIENCE
    // Physics C - check for specific variant
    if (lower.includes("physics") || lower.includes("phys")) {
      if (lower.match(/mech|mechanics/)) return "AP Physics C: Mechanics";
      if (lower.match(/e\s*&\s*m|electricity|magnetism/)) return "AP Physics C: Electricity & Magnetism";
      if (lower.includes("c")) return "AP Physics C: Mechanics"; // Default for "AP Physics C"
      if (lower.includes("1")) return "AP Physics 1";
      if (lower.includes("2")) return "AP Physics 2";
      return "AP Physics 1"; // Default AP Physics
    }
    if (lower.includes("biology") || lower.includes("bio")) return "AP Biology";
    if (lower.includes("chemistry") || lower.includes("chem")) return "AP Chemistry";
    if (lower.includes("environmental")) return "AP Environmental Science";

    // AP ENGLISH
    if (lower.match(/eng|english/)) {
      if (lower.match(/lang|language/)) return "AP English Language & Composition";
      if (lower.match(/lit|literature/)) return "AP English Literature & Composition";
    }

    // AP SOCIAL STUDIES
    if (lower.match(/us|u\.?\s*s\.?|united states/) && lower.includes("history")) return "AP US History";
    if (lower.includes("world") && lower.includes("history")) return "AP World History";
    if (lower.match(/government|gov/)) return "AP US Government & Politics";
    if (lower.includes("macro")) return "AP Macroeconomics";
    if (lower.includes("micro")) return "AP Microeconomics";
    if (lower.match(/psych|psychology/)) return "AP Psychology";
    if (lower.includes("human") && lower.match(/geo|geography/)) return "AP Human Geography";

    // AP WORLD LANGUAGES
    if (lower.includes("spanish")) return "AP Spanish Language & Culture";
    if (lower.includes("french")) return "AP French Language & Culture";
    if (lower.includes("chinese") || lower.includes("mandarin")) return "AP Chinese Language & Culture";

    // AP COMPUTER SCIENCE
    if (lower.includes("comp") || lower.includes("computer")) {
      if (lower.includes("principles") || lower.match(/csp|cs\s*p/)) return "AP Computer Science Principles";
      if (lower.includes("a") || lower.match(/csa|cs\s*a/)) return "AP Computer Science A";
    }

    // AP ART
    if (lower.includes("art") || lower.includes("studio")) return "AP Studio Art";
    if (lower.includes("music") && lower.includes("theory")) return "AP Music Theory";
  }

  // ========== PHASE 3: WORLD LITERATURE CHECK (before generic Lit/Writing) ==========

  if (lower.includes("world")) {
    if (lower.match(/lit|literature/)) return "World Literature & Writing";
    if (lower.includes("history")) return "World History";
  }

  // ========== PHASE 4: ENGLISH COURSES ==========

  // American Literature
  if (lower.match(/american|am\s/) && lower.match(/lit|literature/)) {
    return "American Literature & Writing";
  }

  // Lit/Writing variations (check this AFTER World Lit and American Lit)
  if (lower.match(/lit.*writ|writ.*lit|lit\s*\/\s*writ|lit\s*&\s*writ/)) {
    return "Literature & Writing";
  }

  // Story and Style
  if (lower.includes("story") && lower.includes("style")) {
    return "Story and Style";
  }

  // Generic English by grade level
  if (lower.match(/^english\s*9|^eng\s*9/)) return "Literature & Writing";
  if (lower.match(/^english\s*10|^eng\s*10/)) return "World Literature & Writing";
  if (lower.match(/^english\s*11|^eng\s*11/)) return "American Literature & Writing";
  if (lower.match(/^english\s*12|^eng\s*12/)) return "Story and Style";

  // ========== PHASE 5: MATH COURSES (non-AP) ==========

  // Pre-Calculus (check for honors)
  if (lower.match(/pre.*calc|precalc/)) {
    if (lower.match(/honors|h\b/)) return "Pre-Calculus Honors";
    return "Pre-Calculus";
  }

  // Calculus (non-AP) - rare but possible
  if (lower.match(/calc.*bc|bc.*calc/) && !hasAP) return "AP Calculus BC";
  if (lower.match(/calc.*ab|ab.*calc/) && !hasAP) return "AP Calculus AB";

  // Other math
  if (lower.includes("algebra")) {
    if (lower.includes("2") || lower.includes("ii")) {
      if (lower.includes("trig")) return "Algebra 2/Trigonometry";
      return "Algebra 2";
    }
    if (lower.includes("1") || lower.includes("i")) return "Algebra 1";
  }
  if (lower.includes("geometry") || lower.includes("geom")) return "Geometry";
  if (lower.match(/multi.*variable|multivariable/)) return "Multivariable Calculus";
  if (lower.match(/linear.*alg|dual.*linear/)) return "Linear Algebra";
  if (lower.match(/diff.*eq|differential.*eq/)) return "Differential Equations";
  if (lower.includes("statistics") || lower.includes("stats")) return "AP Statistics";

  // ========== PHASE 6: SCIENCE COURSES (non-AP) ==========

  if (lower.includes("biology") || lower === "bio") {
    if (lower.match(/honors|h\b/)) return "Biology Honors";
    return "Biology";
  }

  if (lower.includes("chemistry") || lower.includes("chem")) {
    if (lower.match(/honors|h\b/)) return "Chemistry Honors";
    return "Chemistry";
  }

  if (lower.includes("physics") || lower.includes("phys")) {
    if (lower.match(/honors|h\b/)) return "Physics Honors";
    return "Physics";
  }

  if (lower.includes("physiology") || lower === "physio") return "Physiology";
  if (lower.includes("science") && lower.includes("society")) return "Science & Society";

  // ========== PHASE 7: SOCIAL STUDIES COURSES (non-AP) ==========

  if (lower.match(/us|u\.s\.|united states/) && lower.includes("history")) {
    return "US History";
  }

  if (lower.includes("world") && lower.includes("history")) {
    if (lower.match(/honors|h\b/)) return "World History Honors";
    return "World History";
  }

  if (lower.match(/government|gov/)) return "US Government";

  if (lower.includes("econ")) {
    if (lower.includes("macro")) return "AP Macroeconomics";
    if (lower.includes("micro")) return "AP Microeconomics";
    return "Economics";
  }

  if (lower.includes("ethnic") && lower.includes("studies")) {
    return "Introduction to Ethnic Studies";
  }

  // ========== PHASE 8: PHYSICAL EDUCATION ==========

  // Check for PE Inclusion first (even if just "Inclusion" alone)
  if (lower.includes("inclusion")) {
    // If it contains "inclusion", it's almost certainly PE Inclusion
    return "PE Inclusion";
  }

  if (lower.match(/pe|physical.*education/)) {
    if (lower.includes("9")) return "PE 9";
    if (lower.includes("10")) return "PE 10";
  }

  // Other PE courses
  if (lower.match(/racquet|racket/)) return "Racquet Sports";
  if (lower.match(/weight.*training|weights/)) return "Weight Training";
  if (lower.match(/total.*fitness/) || lower === "fitness") return "Total Fitness";

  // Team sports
  if (lower.match(/^basketball$|^bball$|^bb$/)) return "Basketball";
  if (lower.match(/^volleyball$|^vball$|^vb$/)) return "Volleyball";
  if (lower === "soccer") return "Soccer";
  if (lower.includes("track")) return "Track & Field";
  if (lower.match(/cross.*country|^xc$|^cc$/)) return "Cross Country";
  if (lower.match(/^swimming$|^swim$/)) return "Swimming";
  if (lower === "wrestling") return "Wrestling";
  if (lower === "tennis") return "Tennis";
  if (lower === "softball") return "Softball";
  if (lower === "baseball") return "Baseball";
  if (lower === "football") return "Football";

  // ========== PHASE 9: WORLD LANGUAGES (non-AP) ==========

  if (lower.includes("spanish")) {
    // Check for specific patterns - use regex for precise matching
    if (lower.match(/spanish\s*4|spanish\s*iv|spanish.*honors/)) return "Spanish 4";
    if (lower.match(/spanish\s*3|spanish\s*iii/)) return "Spanish 3";
    if (lower.match(/spanish\s*2|spanish\s*ii/)) return "Spanish 2";
    if (lower.match(/spanish\s*1|spanish\s*i\b/)) return "Spanish 1";
  }

  if (lower.includes("french")) {
    if (lower.match(/french\s*4|french\s*iv/)) return "French 4";
    if (lower.match(/french\s*3|french\s*iii/)) return "French 3";
    if (lower.match(/french\s*2|french\s*ii/)) return "French 2";
    if (lower.match(/french\s*1|french\s*i\b/)) return "French 1";
  }

  if (lower.includes("mandarin") || lower.includes("chinese")) {
    if (lower.match(/(?:mandarin|chinese)\s*4|(?:mandarin|chinese)\s*iv/)) return "Mandarin 4";
    if (lower.match(/(?:mandarin|chinese)\s*3|(?:mandarin|chinese)\s*iii/)) return "Mandarin 3";
    if (lower.match(/(?:mandarin|chinese)\s*2|(?:mandarin|chinese)\s*ii/)) return "Mandarin 2";
    if (lower.match(/(?:mandarin|chinese)\s*1|(?:mandarin|chinese)\s*i\b/)) return "Mandarin 1";
  }

  if (lower.includes("japanese")) {
    if (lower.match(/japanese\s*4|japanese\s*iv/)) return "Japanese 4";
    if (lower.match(/japanese\s*3|japanese\s*iii/)) return "Japanese 3";
    if (lower.match(/japanese\s*2|japanese\s*ii/)) return "Japanese 2";
    if (lower.match(/japanese\s*1|japanese\s*i\b/)) return "Japanese 1";
  }

  // ========== PHASE 10: VISUAL & PERFORMING ARTS ==========

  if (lower.includes("art") && !hasAP) {
    if (lower.includes("2") || lower === "art ii") return "Art 2";
    if (lower.includes("1") || lower === "art i" || lower === "art") return "Art 1";
  }

  if (lower.includes("photography") || lower === "photo") return "Photography";
  if (lower.includes("drama") || lower.includes("theatre") || lower.includes("theater")) return "Drama";
  if (lower === "band") return "Band";
  if (lower === "orchestra") return "Orchestra";
  if (lower.match(/choir|chorus/)) return "Choir";

  // ========== PHASE 11: APPLIED ACADEMICS ==========

  if (lower.includes("journalism") || lower === "journ") return "Journalism";
  if (lower.includes("yearbook")) return "Yearbook";
  if (lower.match(/stagecraft|tech.*theatre/)) return "Stagecraft Tech";

  // Computer Science (non-AP)
  if (lower.includes("java") || (lower.includes("programming") && !hasAP)) {
    return "Computer Programming Java";
  }

  // ========== PHASE 12: HEALTH ==========

  if (lower === "health") return "Health";

  // ========== FALLBACK: Return cleaned input ==========
  return cleaned;
}

/**
 * Splits multi-line course entries
 */
export function splitCourses(rawText: string): string[] {
  const validAbbreviations = ["la", "l.a.", "lit", "pe", "pe9", "pe10"];
  return rawText
    .split("\n")
    .map(c => c.trim())
    .filter(c => {
      const lower = c.toLowerCase();
      const hasValidAbbr = validAbbreviations.some(abbr =>
        lower === abbr || lower.startsWith(abbr + " ")
      );
      return c.length >= 2 && (c.length > 3 || hasValidAbbr);
    });
}

/**
 * Legacy compatibility
 */
export function findBestMatch(normalizedName: string): { course: string; category: string; credits: number } | null {
  return null;
}
