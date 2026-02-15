/**
 * Official Lynbrook High School Course Database
 * Source: FUHSD Course Selection & Planning Guide 2026-2027
 *
 * Credit System:
 * - Semester course = 5 credits
 * - Full year course = 10 credits
 * - Team sport per season = 5 credits
 */

export interface LynbrookCourse {
  code?: string;
  name: string;
  credits: 5 | 10;
  category: string;
  ucCsuRequirement?: string;
  aliases?: string[]; // Common abbreviations and variations
}

export const LYNBROOK_COURSES: LynbrookCourse[] = [
  // ========== ENGLISH (40 credits required) ==========
  {
    code: "1010",
    name: "Literature & Writing",
    credits: 10,
    category: "English",
    ucCsuRequirement: "b",
    aliases: [
      "Lit & Writing",
      "Lit/Writing",
      "LA",
      "L.A.",
      "Language Arts",
      "Lit Writing",
      "Literature and Writing",
      "English 9",
      "Eng 9",
      "English",
      "Lit/Wnting",
      "Llt/Writing"
    ]
  },
  {
    code: "1020",
    name: "World Literature & Writing",
    credits: 10,
    category: "English",
    ucCsuRequirement: "b",
    aliases: [
      "World Lit & Writing",
      "World Lit",
      "World Literature",
      "World Lit/Writing",
      "English 10",
      "Eng 10"
    ]
  },
  {
    code: "1130",
    name: "American Literature & Writing",
    credits: 10,
    category: "English",
    ucCsuRequirement: "b",
    aliases: [
      "American Lit & Writing",
      "American Lit",
      "Am Lit",
      "American Literature",
      "English 11",
      "Eng 11"
    ]
  },
  {
    code: "1260",
    name: "Story and Style",
    credits: 10,
    category: "English",
    ucCsuRequirement: "b",
    aliases: [
      "Story & Style",
      "Story and Style: A Critical Lens",
      "English 12",
      "Eng 12"
    ]
  },
  {
    code: "1190",
    name: "AP English Language & Composition",
    credits: 10,
    category: "English",
    ucCsuRequirement: "b",
    aliases: [
      "AP English Language",
      "AP Eng Lang",
      "AP English Lang & Comp",
      "AP Lang",
      "AP Language",
      "AP English Lang and Comp",
      "APEL"
    ]
  },
  {
    code: "1410",
    name: "AP English Literature & Composition",
    credits: 10,
    category: "English",
    ucCsuRequirement: "b",
    aliases: [
      "AP English Literature",
      "AP Eng Lit",
      "AP English Lit & Comp",
      "AP Lit",
      "AP Literature",
      "AP English Lit and Comp",
      "APEL"
    ]
  },
  {
    code: "1450",
    name: "ELD Level 2",
    credits: 10,
    category: "English",
    aliases: ["ELD 2"]
  },
  {
    code: "1460",
    name: "ELD Level 3",
    credits: 10,
    category: "English",
    ucCsuRequirement: "b",
    aliases: ["ELD 3"]
  },

  // ========== MATHEMATICS (20 credits required) ==========
  {
    code: "2210",
    name: "Algebra 1",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["Alg 1", "Algebra I"]
  },
  {
    code: "2230",
    name: "Geometry",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["Geom"]
  },
  {
    code: "2310",
    name: "Algebra 2",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["Alg 2", "Algebra II"]
  },
  {
    code: "2320",
    name: "Algebra 2/Trigonometry",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["Alg 2/Trig", "Algebra 2 Trig", "Alg 2 Trigonometry"]
  },
  {
    code: "2390",
    name: "Pre-Calculus",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["Pre-Calc", "PreCalculus", "Precalc"]
  },
  {
    code: "2420",
    name: "Pre-Calculus Honors",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["Pre-Calc Honors", "Pre-Calc H", "Precalc Honors", "PreCalculus Honors"]
  },
  {
    name: "AP Calculus AB",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["AP Calc AB", "Calc AB", "Calculus AB"]
  },
  {
    name: "AP Calculus BC",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["AP Calc BC", "Calc BC", "Calculus BC", "Calc-BC"]
  },
  {
    name: "AP Statistics",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["AP Stats", "Statistics", "Stats"]
  },
  {
    name: "Multivariable Calculus",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["Multi-Variable Calc", "Multivariable", "Multi Calc"]
  },
  {
    name: "Linear Algebra",
    credits: 10,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["Linear Alg", "Dual: Linear Alg", "Dual Enrollment Linear Algebra"]
  },
  {
    name: "Differential Equations",
    credits: 5,
    category: "Math",
    ucCsuRequirement: "c",
    aliases: ["Diff Eq", "Differential Eq"]
  },

  // ========== SCIENCE (20 credits required) ==========
  {
    name: "Biology",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["Bio"]
  },
  {
    name: "Biology Honors",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["Bio Honors", "Bio H", "Biology H"]
  },
  {
    name: "AP Biology",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["AP Bio"]
  },
  {
    name: "Chemistry",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["Chem"]
  },
  {
    name: "Chemistry Honors",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["Chem Honors", "Chem H", "Chemistry H"]
  },
  {
    name: "AP Chemistry",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["AP Chem"]
  },
  {
    name: "Physics",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["Phys"]
  },
  {
    name: "Physics Honors",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["Physics H", "Phys Honors", "Phys H"]
  },
  {
    name: "AP Physics 1",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["AP Phys 1"]
  },
  {
    name: "AP Physics 2",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["AP Phys 2"]
  },
  {
    name: "AP Physics C: Mechanics",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: [
      "AP Physics C",
      "AP Phys C",
      "Physics C Mechanics",
      "AP Physics C Mech",
      "AP Phys C Mech",
      "AP Physics C: Mech",
      "AP Phys C:Mech",
      "Physics C: Mechanics",
      "Phys C Mechanics",
      "C:Mech",
      "C Mech"
    ]
  },
  {
    name: "AP Physics C: Electricity & Magnetism",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: [
      "AP Physics C E&M",
      "Physics C E&M",
      "AP Phys C E&M",
      "AP Physics C: E&M",
      "Physics C: E&M",
      "AP Phys C:E&M",
      "C:E&M"
    ]
  },
  {
    name: "AP Environmental Science",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["AP Environmental", "APES", "AP Enviro", "Environmental Science"]
  },
  {
    name: "Physiology",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["Physio"]
  },
  {
    name: "Science & Society",
    credits: 10,
    category: "Science",
    ucCsuRequirement: "d",
    aliases: ["Science and Society"]
  },

  // ========== SOCIAL SCIENCE (30 credits required) ==========
  {
    name: "World History",
    credits: 10,
    category: "Social Studies",
    ucCsuRequirement: "a",
    aliases: ["World Hist"]
  },
  {
    name: "World History Honors",
    credits: 10,
    category: "Social Studies",
    ucCsuRequirement: "a",
    aliases: ["World Hist Honors", "World History H"]
  },
  {
    name: "AP World History",
    credits: 10,
    category: "Social Studies",
    ucCsuRequirement: "a",
    aliases: ["AP World Hist", "APWH"]
  },
  {
    name: "US History",
    credits: 10,
    category: "Social Studies",
    ucCsuRequirement: "a",
    aliases: ["U.S. History", "United States History", "US Hist"]
  },
  {
    name: "AP US History",
    credits: 10,
    category: "Social Studies",
    ucCsuRequirement: "a",
    aliases: ["APUSH", "AP U.S. History", "AP United States History"]
  },
  {
    name: "US Government",
    credits: 5,
    category: "Social Studies",
    ucCsuRequirement: "a",
    aliases: ["U.S. Government", "Government", "Gov", "US Gov"]
  },
  {
    name: "AP US Government & Politics",
    credits: 5,
    category: "Social Studies",
    ucCsuRequirement: "a",
    aliases: ["AP Gov", "AP Government", "AP US Gov"]
  },
  {
    name: "Economics",
    credits: 5,
    category: "Social Studies",
    ucCsuRequirement: "g",
    aliases: ["Econ"]
  },
  {
    name: "AP Macroeconomics",
    credits: 5,
    category: "Social Studies",
    ucCsuRequirement: "g",
    aliases: ["AP Macro", "Macroeconomics"]
  },
  {
    name: "AP Microeconomics",
    credits: 5,
    category: "Social Studies",
    ucCsuRequirement: "g",
    aliases: ["AP Micro", "Microeconomics"]
  },
  {
    name: "Introduction to Ethnic Studies",
    credits: 5,
    category: "Social Studies",
    ucCsuRequirement: "a",
    aliases: ["Intro to Ethnic Studies", "Ethnic Studies", "Intro Ethnic Studies"]
  },
  {
    name: "AP Psychology",
    credits: 10,
    category: "Social Studies",
    ucCsuRequirement: "g",
    aliases: ["AP Psych", "Psychology"]
  },
  {
    name: "AP Human Geography",
    credits: 10,
    category: "Social Studies",
    ucCsuRequirement: "a",
    aliases: ["AP Human Geo", "Human Geography"]
  },

  // ========== PHYSICAL EDUCATION (20 credits required) ==========
  {
    name: "PE 9",
    credits: 10,
    category: "Physical Education",
    aliases: ["PE9", "Physical Education 9", "Phys Ed 9", "PE ninth", "PE 9th", "P.E. 9", "P.E.9"]
  },
  {
    name: "PE 10",
    credits: 10,
    category: "Physical Education",
    aliases: ["PE10", "Physical Education 10", "Phys Ed 10", "PE tenth", "PE 10th", "P.E. 10", "P.E.10"]
  },
  {
    name: "PE Inclusion",
    credits: 10,
    category: "Physical Education",
    aliases: ["PE Inc", "Physical Education Inclusion", "Inclusion PE", "P.E. Inclusion", "PE Incl"]
  },
  {
    name: "Racquet Sports",
    credits: 10,
    category: "Physical Education",
    aliases: ["Racquet"]
  },
  {
    name: "Weight Training",
    credits: 10,
    category: "Physical Education",
    aliases: ["Weights", "Weight Lifting"]
  },
  {
    name: "Total Fitness",
    credits: 10,
    category: "Physical Education",
    aliases: ["Fitness"]
  },
  // Team Sports (5 credits per season)
  {
    name: "Basketball",
    credits: 5,
    category: "Physical Education",
    aliases: ["BB", "Bball"]
  },
  {
    name: "Volleyball",
    credits: 5,
    category: "Physical Education",
    aliases: ["VB", "Vball"]
  },
  {
    name: "Soccer",
    credits: 5,
    category: "Physical Education",
    aliases: []
  },
  {
    name: "Track & Field",
    credits: 5,
    category: "Physical Education",
    aliases: ["Track", "Track and Field"]
  },
  {
    name: "Cross Country",
    credits: 5,
    category: "Physical Education",
    aliases: ["XC", "CC"]
  },
  {
    name: "Swimming",
    credits: 5,
    category: "Physical Education",
    aliases: ["Swim"]
  },
  {
    name: "Wrestling",
    credits: 5,
    category: "Physical Education",
    aliases: []
  },
  {
    name: "Tennis",
    credits: 5,
    category: "Physical Education",
    aliases: []
  },
  {
    name: "Softball",
    credits: 5,
    category: "Physical Education",
    aliases: []
  },
  {
    name: "Baseball",
    credits: 5,
    category: "Physical Education",
    aliases: []
  },
  {
    name: "Football",
    credits: 5,
    category: "Physical Education",
    aliases: []
  },

  // ========== WORLD LANGUAGE (10 credits required) ==========
  {
    name: "Spanish 1",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Spanish I", "Spanish 1st", "Span 1", "Span I"]
  },
  {
    name: "Spanish 2",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Spanish II", "Spanish 2nd", "Span 2", "Span II"]
  },
  {
    name: "Spanish 3",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Spanish III", "Spanish 3rd", "Span 3", "Span III"]
  },
  {
    name: "Spanish 4",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Spanish IV", "Spanish 4th", "Span 4", "Span IV", "Spanish 4 Honors", "Spanish 4H", "Spanish Honors", "Spanish H"]
  },
  {
    name: "AP Spanish Language & Culture",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["AP Spanish", "AP Spanish Lang", "AP Spanish Language", "AP Span"]
  },
  {
    name: "French 1",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["French I"]
  },
  {
    name: "French 2",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["French II"]
  },
  {
    name: "French 3",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["French III"]
  },
  {
    name: "French 4",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["French IV"]
  },
  {
    name: "AP French Language & Culture",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["AP French", "AP French Lang"]
  },
  {
    name: "Mandarin 1",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Mandarin I", "Chinese 1"]
  },
  {
    name: "Mandarin 2",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Mandarin II", "Chinese 2"]
  },
  {
    name: "Mandarin 3",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Mandarin III", "Chinese 3"]
  },
  {
    name: "Mandarin 4",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Mandarin IV", "Chinese 4"]
  },
  {
    name: "AP Chinese Language & Culture",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["AP Chinese", "AP Mandarin"]
  },
  {
    name: "Japanese 1",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Japanese I"]
  },
  {
    name: "Japanese 2",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Japanese II"]
  },
  {
    name: "Japanese 3",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Japanese III"]
  },
  {
    name: "Japanese 4",
    credits: 10,
    category: "World Language",
    ucCsuRequirement: "e",
    aliases: ["Japanese IV"]
  },

  // ========== APPLIED ACADEMICS (10 credits required) ==========
  {
    name: "AP Computer Science A",
    credits: 10,
    category: "Applied Academics",
    ucCsuRequirement: "g",
    aliases: ["AP CS A", "AP Comp Sci A", "APCSA"]
  },
  {
    name: "AP Computer Science Principles",
    credits: 10,
    category: "Applied Academics",
    ucCsuRequirement: "g",
    aliases: ["AP CSP", "AP CS Principles", "APCSP"]
  },
  {
    name: "Computer Programming Java",
    credits: 10,
    category: "Applied Academics",
    ucCsuRequirement: "g",
    aliases: ["Java Programming", "Java", "Comp Programming"]
  },
  {
    name: "Journalism",
    credits: 10,
    category: "Applied Academics",
    ucCsuRequirement: "g",
    aliases: ["Journ"]
  },
  {
    name: "Yearbook",
    credits: 10,
    category: "Applied Academics",
    aliases: []
  },
  {
    name: "Stagecraft Tech",
    credits: 10,
    category: "Applied Academics",
    aliases: ["Stagecraft", "Tech Theatre"]
  },

  // ========== VISUAL & PERFORMING ARTS (10 credits required) ==========
  {
    name: "Art 1",
    credits: 10,
    category: "Visual & Performing Arts",
    ucCsuRequirement: "f",
    aliases: ["Art I", "Art"]
  },
  {
    name: "Art 2",
    credits: 10,
    category: "Visual & Performing Arts",
    ucCsuRequirement: "f",
    aliases: ["Art II"]
  },
  {
    name: "AP Studio Art",
    credits: 10,
    category: "Visual & Performing Arts",
    ucCsuRequirement: "f",
    aliases: ["AP Art"]
  },
  {
    name: "Photography",
    credits: 10,
    category: "Visual & Performing Arts",
    ucCsuRequirement: "f",
    aliases: ["Photo"]
  },
  {
    name: "Drama",
    credits: 10,
    category: "Visual & Performing Arts",
    ucCsuRequirement: "f",
    aliases: ["Theatre", "Theater"]
  },
  {
    name: "Band",
    credits: 10,
    category: "Visual & Performing Arts",
    ucCsuRequirement: "f",
    aliases: []
  },
  {
    name: "Orchestra",
    credits: 10,
    category: "Visual & Performing Arts",
    ucCsuRequirement: "f",
    aliases: []
  },
  {
    name: "Choir",
    credits: 10,
    category: "Visual & Performing Arts",
    ucCsuRequirement: "f",
    aliases: ["Chorus"]
  },
  {
    name: "AP Music Theory",
    credits: 10,
    category: "Visual & Performing Arts",
    ucCsuRequirement: "f",
    aliases: ["Music Theory"]
  },

  // ========== HEALTH (5 credits required) ==========
  {
    name: "Health",
    credits: 5,
    category: "Health",
    aliases: []
  }
];

/**
 * Create lookup maps for fast searching
 */
export const COURSE_NAME_MAP: Record<string, LynbrookCourse> = {};
export const COURSE_CREDITS_MAP: Record<string, number> = {};
export const COURSE_CATEGORY_MAP: Record<string, string> = {};

// Build lookup maps
LYNBROOK_COURSES.forEach(course => {
  const nameLower = course.name.toLowerCase();
  COURSE_NAME_MAP[nameLower] = course;
  COURSE_CREDITS_MAP[course.name] = course.credits;
  COURSE_CATEGORY_MAP[course.name] = course.category;

  // Add aliases to lookup
  course.aliases?.forEach(alias => {
    const aliasLower = alias.toLowerCase();
    COURSE_NAME_MAP[aliasLower] = course;
  });
});

/**
 * Get all possible course name variations for fuzzy matching
 */
export function getAllCourseVariations(): string[] {
  const variations: string[] = [];
  LYNBROOK_COURSES.forEach(course => {
    variations.push(course.name);
    if (course.aliases) {
      variations.push(...course.aliases);
    }
  });
  return variations;
}
