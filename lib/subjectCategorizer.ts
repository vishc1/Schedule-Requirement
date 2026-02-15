import { Course } from "@/app/page";
import { normalizeCourse } from "@/lib/courseNormalizer";

export interface SubjectRequirement {
  name: string;
  required: number;
  earned: number;
  remaining: number;
  courses: Course[];
}

export const SUBJECT_REQUIREMENTS = {
  socialScience: { name: "Social Studies", required: 30 },
  english: { name: "English", required: 40 },
  mathematics: { name: "Mathematics", required: 20 },
  science: { name: "Science", required: 20 },
  physicalEducation: { name: "Physical Education", required: 20 },
  worldLanguage: { name: "World Language", required: 10 },
  visualPerformingArts: { name: "Visual & Performing Arts", required: 10 },
  appliedAcademics: { name: "Applied Academics", required: 10 },
  health: { name: "Health", required: 5 },
  electives: { name: "Electives", required: 70 },
};

/**
 * Maps category name to subject requirement key
 */
function categoryToSubjectKey(category: string): keyof typeof SUBJECT_REQUIREMENTS {
  const categoryMap: Record<string, keyof typeof SUBJECT_REQUIREMENTS> = {
    "Social Studies": "socialScience",
    "English": "english",
    "Math": "mathematics",
    "Science": "science",
    "Physical Education": "physicalEducation",
    "World Language": "worldLanguage",
    "Visual & Performing Arts": "visualPerformingArts",
    "Applied Academics": "appliedAcademics",
    "Health": "health",
  };
  
  return categoryMap[category] || "electives";
}

/**
 * Categorizes a course into a subject area using normalization and fuzzy matching
 */
function categorizeCourse(courseName: string): {
  category: keyof typeof SUBJECT_REQUIREMENTS;
  normalizedName: string;
  credits?: number;
} {
  // First, normalize the course name to fix OCR errors
  const normalized = normalizeCourse(courseName);
  
  // Simple keyword-based categorization (conservative approach)
  const name = normalized.toLowerCase();
  
  // Social Studies / History
  if (
    name.includes("history") ||
    name.includes("government") ||
    name.includes("economics") ||
    name.includes("ethnic studies") ||
    name.includes("social studies") ||
    name.includes("world history") ||
    name.includes("us history") ||
    name.includes("ap us history") ||
    name.includes("ap world history") ||
    name.includes("civics")
  ) {
    return { category: "socialScience", normalizedName: normalized };
  }

  // English
  if (
    name.includes("english") ||
    name.includes("literature") ||
    name.includes("writing") ||
    name.includes("composition") ||
    name.includes("language arts") ||
    name.includes("ap english") ||
    name.includes("eld")
  ) {
    return { category: "english", normalizedName: normalized };
  }

  // Mathematics
  if (
    name.includes("math") ||
    name.includes("algebra") ||
    name.includes("geometry") ||
    name.includes("calculus") ||
    name.includes("trigonometry") ||
    name.includes("pre-calculus") ||
    name.includes("precalc") ||
    name.includes("statistics") ||
    name.includes("ap calculus") ||
    name.includes("ap statistics") ||
    name.includes("linear algebra") ||
    name.includes("multivariable") ||
    name.includes("differential equations")
  ) {
    return { category: "mathematics", normalizedName: normalized };
  }

  // Science
  if (
    name.includes("biology") ||
    name.includes("chemistry") ||
    name.includes("physics") ||
    name.includes("science") ||
    name.includes("physiology") ||
    name.includes("anatomy") ||
    name.includes("environmental") ||
    name.includes("ap biology") ||
    name.includes("ap chemistry") ||
    name.includes("ap physics") ||
    name.includes("stem")
  ) {
    return { category: "science", normalizedName: normalized };
  }

  // Physical Education
  if (
    name.includes("pe ") ||
    name.includes("physical education") ||
    name.includes("racquet") ||
    name.includes("weight training") ||
    name.includes("total fitness") ||
    name.includes("team sport") ||
    name.includes("athletics")
  ) {
    return { category: "physicalEducation", normalizedName: normalized };
  }

  // World Language
  if (
    name.includes("spanish") ||
    name.includes("french") ||
    name.includes("german") ||
    name.includes("chinese") ||
    name.includes("mandarin") ||
    name.includes("japanese") ||
    name.includes("korean") ||
    name.includes("italian") ||
    name.includes("latin") ||
    (name.includes("language") && !name.includes("english") && !name.includes("arts"))
  ) {
    return { category: "worldLanguage", normalizedName: normalized };
  }

  // Visual & Performing Arts
  if (
    name.includes("art") ||
    name.includes("music") ||
    name.includes("theatre") ||
    name.includes("theater") ||
    name.includes("dance") ||
    name.includes("band") ||
    name.includes("orchestra") ||
    name.includes("choir") ||
    name.includes("chorus") ||
    name.includes("drama")
  ) {
    return { category: "visualPerformingArts", normalizedName: normalized };
  }

  // Applied Academics
  if (
    name.includes("computer") ||
    name.includes("programming") ||
    name.includes("journalism") ||
    name.includes("yearbook") ||
    name.includes("stagecraft") ||
    name.includes("engineering") ||
    name.includes("business") ||
    name.includes("culinary") ||
    name.includes("law") ||
    name.includes("construction") ||
    name.includes("media")
  ) {
    return { category: "appliedAcademics", normalizedName: normalized };
  }

  // Health
  if (name.includes("health")) {
    return { category: "health", normalizedName: normalized };
  }

  // If no match, it's an elective
  return { category: "electives", normalizedName: normalized };

  // Social Studies / History
  if (
    name.includes("history") ||
    name.includes("government") ||
    name.includes("economics") ||
    name.includes("ethnic studies") ||
    name.includes("social studies") ||
    name.includes("world history") ||
    name.includes("us history") ||
    name.includes("ap us history") ||
    name.includes("ap world history") ||
    name.includes("civics")
  ) {
    return { category: "socialScience", normalizedName: normalized };
  }

  // English
  if (
    name.includes("english") ||
    name.includes("literature") ||
    name.includes("writing") ||
    name.includes("composition") ||
    name.includes("language arts") ||
    name.includes("ap english") ||
    name.includes("eld")
  ) {
    return { category: "english", normalizedName: normalized };
  }

  // Mathematics
  if (
    name.includes("math") ||
    name.includes("algebra") ||
    name.includes("geometry") ||
    name.includes("calculus") ||
    name.includes("trigonometry") ||
    name.includes("pre-calculus") ||
    name.includes("precalc") ||
    name.includes("statistics") ||
    name.includes("ap calculus") ||
    name.includes("ap statistics")
  ) {
    return { category: "mathematics", normalizedName: normalized };
  }

  // Science
  if (
    name.includes("biology") ||
    name.includes("chemistry") ||
    name.includes("physics") ||
    name.includes("science") ||
    name.includes("physiology") ||
    name.includes("anatomy") ||
    name.includes("environmental") ||
    name.includes("ap biology") ||
    name.includes("ap chemistry") ||
    name.includes("ap physics") ||
    name.includes("stem")
  ) {
    return { category: "science", normalizedName: normalized };
  }

  // Physical Education
  if (
    name.includes("pe ") ||
    name.includes("physical education") ||
    name.includes("racquet") ||
    name.includes("weight training") ||
    name.includes("total fitness") ||
    name.includes("team sport") ||
    name.includes("athletics") ||
    name.includes("basketball") ||
    name.includes("volleyball") ||
    name.includes("soccer") ||
    name.includes("wrestling") ||
    name.includes("softball") ||
    name.includes("baseball") ||
    name.includes("tennis") ||
    name.includes("golf") ||
    name.includes("swimming") ||
    name.includes("diving") ||
    name.includes("track") ||
    name.includes("cross country")
  ) {
    return { category: "physicalEducation", normalizedName: normalized };
  }

  // World Language
  if (
    name.includes("spanish") ||
    name.includes("french") ||
    name.includes("german") ||
    name.includes("chinese") ||
    name.includes("mandarin") ||
    name.includes("japanese") ||
    name.includes("korean") ||
    name.includes("italian") ||
    name.includes("latin") ||
    (name.includes("language") && !name.includes("english") && !name.includes("arts"))
  ) {
    return { category: "worldLanguage", normalizedName: normalized };
  }

  // Visual & Performing Arts
  if (
    name.includes("art") ||
    name.includes("music") ||
    name.includes("theatre") ||
    name.includes("theater") ||
    name.includes("dance") ||
    name.includes("band") ||
    name.includes("orchestra") ||
    name.includes("choir") ||
    name.includes("chorus") ||
    name.includes("drama") ||
    name.includes("visual arts")
  ) {
    return { category: "visualPerformingArts", normalizedName: normalized };
  }

  // Applied Academics
  if (
    name.includes("computer") ||
    name.includes("programming") ||
    name.includes("journalism") ||
    name.includes("yearbook") ||
    name.includes("stagecraft") ||
    name.includes("engineering") ||
    name.includes("business") ||
    name.includes("culinary") ||
    name.includes("law") ||
    name.includes("construction") ||
    name.includes("media") ||
    name.includes("ap computer science")
  ) {
    return { category: "appliedAcademics", normalizedName: normalized };
  }

  // Health
  if (name.includes("health")) {
    return { category: "health", normalizedName: normalized };
  }

  // If no match, it's an elective
  return { category: "electives", normalizedName: normalized };
}

/**
 * Categorizes all courses and calculates credits per subject
 * Also normalizes course names and updates credits if needed
 */
export function categorizeCourses(courses: Course[]): SubjectRequirement[] {
  const categorized: { [key: string]: Course[] } = {
    socialScience: [],
    english: [],
    mathematics: [],
    science: [],
    physicalEducation: [],
    worldLanguage: [],
    visualPerformingArts: [],
    appliedAcademics: [],
    health: [],
    electives: [],
  };

  // Categorize each course with normalization
  courses.forEach((course) => {
    const result = categorizeCourse(course.course);
    
    // Determine credits based on course type
    let credits = course.credits; // Use provided credits if available
    
    // Assign default credits based on common patterns
    if (credits === 10 || credits === 0) { // If default or unset
      const name = result.normalizedName.toLowerCase();
      
      // Semester courses (5 credits)
      if (
        name.includes("economics") ||
        name.includes("government") ||
        name.includes("ethnic studies") ||
        name.includes("health")
      ) {
        credits = 5;
      }
      // Team sports (5 credits per season)
      else if (
        name.includes("basketball") ||
        name.includes("volleyball") ||
        name.includes("soccer") ||
        name.includes("wrestling") ||
        name.includes("softball") ||
        name.includes("baseball") ||
        name.includes("tennis") ||
        name.includes("golf") ||
        name.includes("swimming") ||
        name.includes("diving") ||
        name.includes("track") ||
        name.includes("cross country") ||
        name.includes("team sport")
      ) {
        credits = 5;
      }
      // Default to year-long (10 credits)
      else {
        credits = 10;
      }
    }
    
    // Use normalized name and calculated credits
    const normalizedCourse: Course = {
      course: result.normalizedName,
      credits: credits,
    };
    
    categorized[result.category].push(normalizedCourse);
  });

  // Calculate requirements for each subject
  const subjects: SubjectRequirement[] = Object.entries(SUBJECT_REQUIREMENTS).map(
    ([key, requirement]) => {
      const categoryCourses = categorized[key as keyof typeof categorized] || [];
      const earned = categoryCourses.reduce((sum, course) => sum + course.credits, 0);
      const remaining = Math.max(0, requirement.required - earned);

      return {
        name: requirement.name,
        required: requirement.required,
        earned,
        remaining,
        courses: categoryCourses,
      };
    }
  );

  return subjects;
}

