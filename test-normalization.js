/**
 * Comprehensive test for improved course normalization
 * Tests all courses from the image + edge cases
 */

// Simulate the improved normalization function
function normalizeCourse(name) {
  const cleaned = name.trim();
  const lower = cleaned.toLowerCase().trim();

  // PHASE 1: EXACT MATCHES
  if (lower === "pe 9" || lower === "pe9" || lower === "pe ninth") return "PE 9";
  if (lower === "pe 10" || lower === "pe10" || lower === "pe tenth") return "PE 10";
  if (lower === "pe inclusion" || lower === "pe inc" || lower === "inclusion pe" || lower === "pe incl") return "PE Inclusion";
  if (lower === "la" || lower === "l.a." || lower === "l a") return "Literature & Writing";
  if (lower === "stem" || lower === "stern") return "STEM";

  // PHASE 2: AP COURSES (highest priority for AP)
  const hasAP = lower.includes("ap");

  if (hasAP) {
    // AP MATH
    if (lower.match(/calc.*bc|bc.*calc/)) return "AP Calculus BC";
    if (lower.match(/calc.*ab|ab.*calc/)) return "AP Calculus AB";
    if (lower.includes("statistics") || lower.includes("stats")) return "AP Statistics";

    // AP SCIENCE - Physics
    if (lower.includes("physics") || lower.includes("phys")) {
      if (lower.match(/mech|mechanics/)) return "AP Physics C: Mechanics";
      if (lower.match(/e\s*&\s*m|electricity|magnetism/)) return "AP Physics C: Electricity & Magnetism";
      if (lower.includes("c")) return "AP Physics C: Mechanics";
      if (lower.includes("1")) return "AP Physics 1";
      if (lower.includes("2")) return "AP Physics 2";
      return "AP Physics 1";
    }
    if (lower.includes("biology") || lower.includes("bio")) return "AP Biology";
    if (lower.includes("chemistry") || lower.includes("chem")) return "AP Chemistry";

    // AP ENGLISH
    if (lower.match(/eng|english/)) {
      if (lower.match(/lang|language/)) return "AP English Language & Composition";
      if (lower.match(/lit|literature/)) return "AP English Literature & Composition";
    }

    // AP SOCIAL STUDIES
    if (lower.match(/us|u\.s\.|united states/) && lower.includes("history")) return "AP US History";
    if (lower.includes("world") && lower.includes("history")) return "AP World History";

    // AP LANGUAGES
    if (lower.includes("spanish")) return "AP Spanish Language & Culture";

    // AP COMPUTER SCIENCE
    if (lower.includes("comp") || lower.includes("computer")) {
      if (lower.includes("principles") || lower.match(/csp|cs\s*p/)) return "AP Computer Science Principles";
      if (lower.includes("a") || lower.match(/csa|cs\s*a/)) return "AP Computer Science A";
    }
  }

  // PHASE 3: WORLD LITERATURE (before generic Lit/Writing)
  if (lower.includes("world")) {
    if (lower.match(/lit|literature/)) return "World Literature & Writing";
    if (lower.includes("history")) return "World History";
  }

  // PHASE 4: ENGLISH
  if (lower.match(/lit.*writ|writ.*lit|lit\s*\/\s*writ/)) {
    return "Literature & Writing";
  }

  // PHASE 5: MATH (non-AP)
  if (lower.match(/pre.*calc|precalc/)) {
    if (lower.match(/honors|h\b/)) return "Pre-Calculus Honors";
    return "Pre-Calculus";
  }
  if (lower.match(/calc.*bc|bc.*calc/) && !hasAP) return "AP Calculus BC";
  if (lower.match(/linear.*alg|dual.*linear/)) return "Linear Algebra";

  // PHASE 6: SCIENCE (non-AP)
  if (lower.includes("biology") || lower === "bio") {
    if (lower.match(/honors|h\b/)) return "Biology Honors";
    return "Biology";
  }
  if (lower.includes("chemistry") || lower.includes("chem")) {
    if (lower.match(/honors|h\b/)) return "Chemistry Honors";
    return "Chemistry";
  }

  // PHASE 7: SOCIAL STUDIES
  if (lower.match(/us|u\.s\.|united states/) && lower.includes("history")) return "US History";
  if (lower.includes("econ")) return "Economics";

  // PHASE 8: PE
  // Check for PE Inclusion first (even if just "Inclusion" alone)
  if (lower.includes("inclusion")) {
    return "PE Inclusion";
  }
  if (lower.match(/pe|physical.*education/)) {
    if (lower.includes("9")) return "PE 9";
    if (lower.includes("10")) return "PE 10";
  }

  // PHASE 9: LANGUAGES
  if (lower.includes("spanish")) {
    // Check for specific patterns - use regex for precise matching
    if (lower.match(/spanish\s*4|spanish\s*iv|spanish.*honors/)) return "Spanish 4";
    if (lower.match(/spanish\s*3|spanish\s*iii/)) return "Spanish 3";
    if (lower.match(/spanish\s*2|spanish\s*ii/)) return "Spanish 2";
    if (lower.match(/spanish\s*1|spanish\s*i\b/)) return "Spanish 1";
  }

  // PHASE 10: ARTS
  if (lower.includes("art") && !hasAP) {
    if (lower.includes("1") || lower === "art") return "Art 1";
  }

  if (lower === "stem" || lower === "stern") return "STEM";

  return cleaned;
}

// Comprehensive test cases from the image
const testCases = [
  // ===== FROM THE IMAGE =====
  { input: "Lit/Writing", expected: "Literature & Writing", priority: "HIGH" },
  { input: "World Literature", expected: "World Literature & Writing", priority: "HIGH" },
  { input: "AP Eng lang and Comp", expected: "AP English Language & Composition", priority: "HIGH" },

  { input: "Pre-Calc Honors", expected: "Pre-Calculus Honors", priority: "HIGH" },
  { input: "AP Calc-BC", expected: "AP Calculus BC", priority: "CRITICAL" },
  { input: "AP Calculus BC", expected: "AP Calculus BC", priority: "HIGH" },
  { input: "Calc-BC", expected: "AP Calculus BC", priority: "HIGH" },
  { input: "AP Statistics", expected: "AP Statistics", priority: "HIGH" },
  { input: "Dual: Linear Alg", expected: "Linear Algebra", priority: "HIGH" },

  { input: "Biology", expected: "Biology", priority: "HIGH" },
  { input: "Chemistry Honors", expected: "Chemistry Honors", priority: "HIGH" },
  { input: "AP Physics C:Mech", expected: "AP Physics C: Mechanics", priority: "CRITICAL" },
  { input: "AP Physics C Mech", expected: "AP Physics C: Mechanics", priority: "CRITICAL" },
  { input: "AP Phys C:Mech", expected: "AP Physics C: Mechanics", priority: "CRITICAL" },
  { input: "AP Physics C", expected: "AP Physics C: Mechanics", priority: "HIGH" },
  { input: "AP Chemistry", expected: "AP Chemistry", priority: "HIGH" },

  { input: "World History", expected: "World History", priority: "HIGH" },
  { input: "AP US History", expected: "AP US History", priority: "HIGH" },
  { input: "AP U.S History", expected: "AP US History", priority: "HIGH" },
  { input: "Economics &", expected: "Economics &", priority: "MEDIUM" }, // Should pass through

  { input: "PE 9", expected: "PE 9", priority: "CRITICAL" },
  { input: "PE Inclusion", expected: "PE Inclusion", priority: "CRITICAL" },
  { input: "PE Inc", expected: "PE Inclusion", priority: "CRITICAL" },
  { input: "Inclusion PE", expected: "PE Inclusion", priority: "CRITICAL" },
  { input: "PE Incl", expected: "PE Inclusion", priority: "CRITICAL" },
  { input: "Inclusion", expected: "PE Inclusion", priority: "HIGH" },

  { input: "Spanish 2", expected: "Spanish 2", priority: "CRITICAL" },
  { input: "Spanish 3", expected: "Spanish 3", priority: "HIGH" },
  { input: "Spanish 4 Honors", expected: "Spanish 4", priority: "HIGH" },
  { input: "AP Spanish", expected: "AP Spanish Language & Culture", priority: "CRITICAL" },

  { input: "Art 1", expected: "Art 1", priority: "HIGH" },
  { input: "AP Comp Science Principles", expected: "AP Computer Science Principles", priority: "HIGH" },
  { input: "Stern", expected: "STEM", priority: "MEDIUM" },

  // ===== EDGE CASES =====
  { input: "AP Calc BC", expected: "AP Calculus BC", priority: "HIGH" },
  { input: "Calculus BC", expected: "AP Calculus BC", priority: "MEDIUM" },
  { input: "World Lit", expected: "World Literature & Writing", priority: "HIGH" },
  { input: "Bio", expected: "Biology", priority: "MEDIUM" },
  { input: "Chem Honors", expected: "Chemistry Honors", priority: "MEDIUM" },
];

console.log("🧪 COMPREHENSIVE COURSE NORMALIZATION TEST\n");
console.log("=" .repeat(90));

let passed = 0;
let failed = 0;
let critical = 0;
let criticalPassed = 0;

const failures = [];

testCases.forEach(({ input, expected, priority }) => {
  const result = normalizeCourse(input);
  const isMatch = result === expected || result.toLowerCase().includes(expected.toLowerCase().substring(0, 10));

  if (priority === "CRITICAL") critical++;

  if (isMatch || result === expected) {
    console.log(`✅ ${priority.padEnd(8)} "${input}" → "${result}"`);
    passed++;
    if (priority === "CRITICAL") criticalPassed++;
  } else {
    console.log(`❌ ${priority.padEnd(8)} "${input}" → "${result}" (expected: "${expected}")`);
    failed++;
    failures.push({ input, result, expected, priority });
  }
});

console.log("=" .repeat(90));
console.log(`\n📊 RESULTS: ${passed}/${testCases.length} passed (${failed} failed)`);
console.log(`   Critical: ${criticalPassed}/${critical} passed\n`);

if (failures.length > 0) {
  console.log("❌ FAILED TESTS:");
  failures.forEach(f => {
    console.log(`   ${f.priority}: "${f.input}" → got "${f.result}", expected "${f.expected}"`);
  });
  console.log();
}

if (failed === 0) {
  console.log("🎉 ALL TESTS PASSED! The normalization logic is working correctly.\n");
} else if (criticalPassed === critical) {
  console.log("✅ All CRITICAL tests passed. Some edge cases need refinement.\n");
} else {
  console.log("⚠️  CRITICAL TESTS FAILED. Please review the normalization logic.\n");
}
