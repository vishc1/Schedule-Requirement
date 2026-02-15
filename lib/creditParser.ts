// Credit system rules based on Lynbrook High School
export const CREDIT_RULES = {
  semester_class: 5,
  year_class: 10,
  team_sport_season: 5,
  failed_class: 0,
};

export interface Course {
  course: string;
  credits: number;
}

/**
 * Parses extracted text from OCR to find courses and their credit values
 */
export function parseCoursesFromText(text: string): Course[] {
  const courses: Course[] = [];
  const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);

  // Common patterns to identify courses
  const coursePatterns = [
    // Pattern: "Course Name – X credits" or "Course Name - X credits"
    /^([^–\-]+?)\s*[–\-]\s*(\d+)\s*(?:credit|credits)/i,
    // Pattern: "Course Name (X credits)"
    /^([^(]+?)\s*\((\d+)\s*(?:credit|credits)\)/i,
    // Pattern: "Course Name X credits"
    /^([^0-9]+?)\s+(\d+)\s+(?:credit|credits)/i,
    // Pattern: "Course Name – X" (assumes credits if number is 5 or 10)
    /^([^–\-]+?)\s*[–\-]\s*(\d+)\s*$/,
  ];

  // Known course names that should default to specific credits
  const knownCourses: { [key: string]: number } = {
    // Math courses (typically 10 credits for full year)
    "Algebra 1": 10,
    "Algebra 2": 10,
    "Algebra 2/Trigonometry": 10,
    "Geometry": 10,
    "Pre-Calculus": 10,
    "Pre-Calculus Honors": 10,
    "AP Calculus AB": 10,
    "AP Calculus BC": 10,
    "AP Statistics": 10,
    // English courses (typically 10 credits)
    "Literature & Writing": 10,
    "World Literature & Writing": 10,
    "American Literature & Writing": 10,
    "Story and Style": 10,
    "AP English": 10,
    "AP English Language": 10,
    "AP English Literature": 10,
    // Science courses (typically 10 credits)
    "Biology": 10,
    "AP Biology": 10,
    "Chemistry": 10,
    "Chemistry Honors": 10,
    "AP Chemistry": 10,
    "Physics": 10,
    "Physics Honors": 10,
    "AP Physics C": 10,
    "Physiology": 10,
    "Science & Society": 10,
    // History courses (typically 10 credits)
    "World History": 10,
    "US History": 10,
    "US Government": 5,
    "Economics": 5,
    "Intro to Ethnic Studies": 5,
    // PE courses
    "PE 9": 10,
    "PE 10": 10,
    "PE 11": 10,
    "PE 12": 10,
    "Racquet Sports": 10,
    "Weight Training": 10,
    "Total Fitness": 10,
    // Applied Academics
    "AP Computer Science A": 10,
    "AP Computer Science Principles": 10,
    "Computer Programming Java": 10,
    "Journalism": 10,
    "Yearbook": 10,
    "Stagecraft Tech": 10,
    // Health
    "Health": 5,
  };

  const processedCourses = new Set<string>();

  for (const line of lines) {
    // Try to match known patterns
    let matched = false;
    for (const pattern of coursePatterns) {
      const match = line.match(pattern);
      if (match) {
        const courseName = match[1].trim();
        const credits = parseInt(match[2], 10);
        
        if (courseName && !processedCourses.has(courseName.toLowerCase())) {
          courses.push({ course: courseName, credits });
          processedCourses.add(courseName.toLowerCase());
          matched = true;
          break;
        }
      }
    }

    // If no pattern matched, try to find known course names
    if (!matched) {
      for (const [knownCourse, defaultCredits] of Object.entries(knownCourses)) {
        const courseLower = knownCourse.toLowerCase();
        const lineLower = line.toLowerCase();
        
        // Check if the line contains the known course name
        if (lineLower.includes(courseLower) && !processedCourses.has(courseLower)) {
          // Try to extract credits from the line if present
          const creditMatch = line.match(/(\d+)\s*(?:credit|credits?)/i);
          const credits = creditMatch ? parseInt(creditMatch[1], 10) : defaultCredits;
          
          courses.push({ course: knownCourse, credits });
          processedCourses.add(courseLower);
          break;
        }
      }
    }
  }

  // If we found very few courses, try a more aggressive parsing approach
  if (courses.length < 3) {
    // Look for lines that might be course names (contain common keywords)
    const courseKeywords = [
      "history",
      "english",
      "math",
      "algebra",
      "geometry",
      "calculus",
      "biology",
      "chemistry",
      "physics",
      "literature",
      "writing",
      "science",
      "pe",
      "physical education",
      "art",
      "music",
      "theatre",
      "language",
      "computer",
      "journalism",
    ];

    for (const line of lines) {
      const lineLower = line.toLowerCase();
      const hasKeyword = courseKeywords.some((keyword) => lineLower.includes(keyword));
      
      if (hasKeyword && line.length > 3 && line.length < 100) {
        // Extract potential course name (remove common prefixes/suffixes)
        let courseName = line
          .replace(/^[–\-•]\s*/, "")
          .replace(/\s*[–\-]\s*\d+.*$/, "")
          .replace(/\s*\(.*\)$/, "")
          .trim();

        // Try to extract credits
        const creditMatch = line.match(/(\d+)\s*(?:credit|credits?)/i);
        const credits = creditMatch
          ? parseInt(creditMatch[1], 10)
          : CREDIT_RULES.year_class; // Default to 10 for full year

        if (
          courseName &&
          courseName.length > 2 &&
          !processedCourses.has(courseName.toLowerCase())
        ) {
          courses.push({ course: courseName, credits });
          processedCourses.add(courseName.toLowerCase());
        }
      }
    }
  }

  return courses;
}

