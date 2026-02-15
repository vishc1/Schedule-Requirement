/**
 * FUHSD Graduation & UC/CSU A-G Course Requirements Tracker
 * Based on official 2026-2027 requirements
 */

export interface RequirementCategory {
  name: string;
  required: number;
  earned: number;
  remaining: number;
  courses: Array<{ course: string; credits: number }>;
  note?: string;
}

export interface RequirementsProgress {
  system: "Lynbrook" | "UC A-G" | "CSU A-G";
  totalRequired: number | string;
  totalEarned: number;
  totalRemaining: number | string;
  categories: RequirementCategory[];
  meetsRequirements: boolean;
  warnings?: string[];
}

/**
 * LYNBROOK HIGH SCHOOL GRADUATION REQUIREMENTS (220 credits)
 */
export const LYNBROOK_REQUIREMENTS = {
  "Social Studies": { required: 30, note: "35 credits beginning 2030" },
  "English": { required: 40 },
  "Math": { required: 20, note: "10 credits Algebra, 10 credits Geometry minimum" },
  "Science": { required: 20, note: "10 credits Life Science, 10 credits Physical Science" },
  "Physical Education": { required: 20 },
  "Health": { required: 5, note: "Beginning 2030" },
  "World Language": { required: 10, starred: true },
  "Visual & Performing Arts": { required: 10, starred: true },
  "Applied Academics": { required: 10, starred: true },
  "Electives": { required: 70, note: "60 credits beginning 2030" },
};

/**
 * UC A-G REQUIREMENTS (15 college prep classes, C or better)
 */
export const UC_AG_REQUIREMENTS = {
  "(a) History/Social Science": {
    required: 2,
    unit: "years",
    note: "World History AND US History, or 1 sem US History & 1 sem Gov"
  },
  "(b) English": {
    required: 4,
    unit: "years",
  },
  "(c) Mathematics": {
    required: 3,
    unit: "years",
    note: "Through Algebra 2 (4 years recommended). Must complete 1 yr Geometry for UC"
  },
  "(d) Laboratory Science": {
    required: 2,
    unit: "years",
    note: "1 year Life Science, 1 year Physical Science (3 recommended)"
  },
  "(e) Language Other than English": {
    required: 2,
    unit: "years",
    note: "Same language (3 years recommended)"
  },
  "(f) Visual & Performing Arts": {
    required: 1,
    unit: "year",
  },
  "(g) College Prep Elective": {
    required: 1,
    unit: "year",
    note: "Additional approved college prep course"
  },
};

/**
 * CSU A-G REQUIREMENTS (same as UC)
 */
export const CSU_AG_REQUIREMENTS = UC_AG_REQUIREMENTS;

/**
 * Maps Lynbrook categories to UC/CSU a-g requirements
 */
export const CATEGORY_TO_AG_MAP: Record<string, string> = {
  "Social Studies": "(a) History/Social Science",
  "English": "(b) English",
  "Math": "(c) Mathematics",
  "Science": "(d) Laboratory Science",
  "World Language": "(e) Language Other than English",
  "Visual & Performing Arts": "(f) Visual & Performing Arts",
  "Applied Academics": "(g) College Prep Elective",
};

/**
 * Calculate Lynbrook graduation requirements progress
 */
export function calculateLynbrookProgress(
  courses: Array<{ course: string; credits: number; category: string }>
): RequirementsProgress {
  const categories: RequirementCategory[] = [];
  const categoryTotals: Record<string, { earned: number; courses: Array<{ course: string; credits: number }> }> = {};

  // Initialize all categories
  for (const [categoryName, requirement] of Object.entries(LYNBROOK_REQUIREMENTS)) {
    categoryTotals[categoryName] = { earned: 0, courses: [] };
  }

  // Categorize and sum credits
  for (const course of courses) {
    const category = course.category;
    if (categoryTotals[category]) {
      categoryTotals[category].earned += course.credits;
      categoryTotals[category].courses.push({ course: course.course, credits: course.credits });
    } else {
      // Uncategorized goes to Electives
      categoryTotals["Electives"].earned += course.credits;
      categoryTotals["Electives"].courses.push({ course: course.course, credits: course.credits });
    }
  }

  let totalEarned = 0;
  const warnings: string[] = [];

  // Build category requirements
  for (const [categoryName, requirement] of Object.entries(LYNBROOK_REQUIREMENTS)) {
    const earned = categoryTotals[categoryName].earned;
    const remaining = Math.max(0, requirement.required - earned);
    totalEarned += earned;

    categories.push({
      name: ('starred' in requirement && requirement.starred) ? `${categoryName}*` : categoryName,
      required: requirement.required,
      earned,
      remaining,
      courses: categoryTotals[categoryName].courses,
      note: 'note' in requirement ? requirement.note : undefined,
    });
  }

  // Check starred requirement (must complete 2 of 3)
  const starredCategories = ["World Language", "Visual & Performing Arts", "Applied Academics"];
  const completedStarred = starredCategories.filter(
    cat => categoryTotals[cat].earned >= LYNBROOK_REQUIREMENTS[cat as keyof typeof LYNBROOK_REQUIREMENTS].required
  ).length;

  if (completedStarred < 2) {
    warnings.push(`Must complete 2 of 3 starred areas (${starredCategories.join(", ")}). Currently completed: ${completedStarred}`);
  }

  const totalRequired = 220;
  const totalRemaining = Math.max(0, totalRequired - totalEarned);
  const meetsRequirements = totalEarned >= totalRequired && completedStarred >= 2;

  return {
    system: "Lynbrook",
    totalRequired,
    totalEarned,
    totalRemaining,
    categories,
    meetsRequirements,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Calculate UC A-G requirements progress
 * Note: This assumes all courses passed with C or better for simplification
 * In a real system, you'd need grade information
 */
export function calculateUCProgress(
  courses: Array<{ course: string; credits: number; category: string; ucCsuRequirement?: string }>
): RequirementsProgress {
  const categories: RequirementCategory[] = [];
  const categoryTotals: Record<string, { earned: number; courses: Array<{ course: string; credits: number }> }> = {};

  // Initialize all a-g categories
  for (const categoryName of Object.keys(UC_AG_REQUIREMENTS)) {
    categoryTotals[categoryName] = { earned: 0, courses: [] };
  }

  // Count courses that meet UC a-g requirements (1 year = 10 credits)
  for (const course of courses) {
    const agCategory = CATEGORY_TO_AG_MAP[course.category];
    if (agCategory && course.ucCsuRequirement) {
      // Convert credits to years (10 credits = 1 year, 5 credits = 0.5 year)
      const years = course.credits / 10;
      categoryTotals[agCategory].earned += years;
      categoryTotals[agCategory].courses.push({ course: course.course, credits: course.credits });
    }
  }

  let totalYearsEarned = 0;
  const warnings: string[] = [];

  // Build category requirements
  for (const [categoryName, requirement] of Object.entries(UC_AG_REQUIREMENTS)) {
    const earned = categoryTotals[categoryName].earned;
    const remaining = Math.max(0, requirement.required - earned);
    totalYearsEarned += earned;

    categories.push({
      name: `${categoryName}`,
      required: requirement.required,
      earned,
      remaining,
      courses: categoryTotals[categoryName].courses,
      note: 'note' in requirement ? requirement.note : undefined,
    });
  }

  // UC requires minimum 15 a-g courses
  const totalRequired = 15;
  const meetsRequirements = totalYearsEarned >= totalRequired;

  if (!meetsRequirements) {
    warnings.push(`Need minimum 15 year-long a-g courses. Currently have: ${totalYearsEarned.toFixed(1)} years`);
  }

  warnings.push("⚠️ All a-g courses must be passed with C or better");

  return {
    system: "UC A-G",
    totalRequired: `${totalRequired} classes`,
    totalEarned: totalYearsEarned,
    totalRemaining: `${Math.max(0, totalRequired - totalYearsEarned).toFixed(1)} classes`,
    categories,
    meetsRequirements,
    warnings,
  };
}

/**
 * Calculate CSU A-G requirements progress (same as UC)
 */
export function calculateCSUProgress(
  courses: Array<{ course: string; credits: number; category: string; ucCsuRequirement?: string }>
): RequirementsProgress {
  const ucProgress = calculateUCProgress(courses);
  return {
    ...ucProgress,
    system: "CSU A-G",
  };
}

/**
 * Calculate all three requirement systems at once
 */
export function calculateAllRequirements(
  courses: Array<{ course: string; credits: number; category: string; ucCsuRequirement?: string }>
): {
  lynbrook: RequirementsProgress;
  uc: RequirementsProgress;
  csu: RequirementsProgress;
} {
  return {
    lynbrook: calculateLynbrookProgress(courses),
    uc: calculateUCProgress(courses),
    csu: calculateCSUProgress(courses),
  };
}
