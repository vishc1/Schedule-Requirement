import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { normalizeCourse, splitCourses, shouldIgnore } from "@/lib/courseNormalizer";
import { categorizeCourses } from "@/lib/subjectCategorizer";
import { findBestLynbrookMatch, findTopLynbrookMatches } from "@/lib/fuzzyMatcher";
import { calculateAllRequirements } from "@/lib/requirementsTracker";
import { LYNBROOK_COURSES } from "@/lib/lynbrookCourses";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Course {
  course: string;
  credits: number;
  category?: string;
  ucCsuRequirement?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert to buffer and base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = imageFile.type || "image/jpeg";

    // ========== PASS 1: RAW TABLE EXTRACTION ==========
    console.log("🔍 PASS 1: Extracting raw table structure...");

    const rawTableResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a precise OCR system. Extract text from this high school course planning table.

IMPORTANT:
- Transcribe EXACTLY what you see, including all text in cells
- Preserve the table structure (which column, which row)
- Include grade labels and subject labels
- Don't interpret or normalize - just transcribe
- If handwriting is unclear, write your best guess

Return JSON with this structure:
{
  "table": {
    "9th": ["course1", "course2"],
    "10th": ["course1", "course2"],
    "11th": ["course1", "course2"],
    "12th": ["course1", "course2"]
  }
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Transcribe all text from this 4-year course planning table. Extract EVERYTHING you see in each grade column, including abbreviated course names, partial text, and unclear handwriting. Return the raw text exactly as written."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
      temperature: 0.1,
    });

    const rawTableContent = rawTableResponse.choices[0]?.message?.content || "";
    console.log("📋 RAW TABLE EXTRACTION:", rawTableContent);

    if (!rawTableContent) {
      return NextResponse.json(
        { error: "Failed to extract table structure from image" },
        { status: 500 }
      );
    }

    // ========== PASS 2: COURSE NAME EXTRACTION & NORMALIZATION ==========
    console.log("\n🔍 PASS 2: Extracting and normalizing course names...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert at identifying official Lynbrook High School course names from raw table data.

You have been given raw extracted text from a 4-year high school course planning table.

YOUR TASK:
Identify and extract ONLY official course names. Filter out headers and labels.

CRITICAL RULES:
1. IGNORE: Grade labels ("9th Grade", "10th", etc.), subject headers ("English", "Math", "PE" as standalone)
2. EXTRACT: Actual course names like "AP Calculus BC", "Spanish 2", "PE 9", "Lit/Writing"
3. Expand abbreviations to likely full course names
4. If text is unclear, infer the closest official Lynbrook course name
5. Multi-line entries: treat each line as a separate course

Return JSON: {"courses": [string]} - array of course name strings only.`,
        },
        {
          role: "user",
          content: `Here is the raw table data extracted from the image:

${rawTableContent}

Now extract ONLY the official course names from this data.

📋 TABLE STRUCTURE:
- Columns: 9th Grade | 10th Grade | 11th Grade | 12th Grade
- Rows: Subject areas (English, Math, Science, Social Studies, PE, Languages, Arts, etc.)
- Data cells: Students write their planned courses

🎯 YOUR TASK: Extract ONLY actual course names from data cells.

🚫 WHAT TO IGNORE (Headers - DO NOT EXTRACT):
✗ Grade labels: "9th Grade", "10th Grade", "11th Grade", "12th Grade"
✗ Short grade labels: "9th", "10th", "11th", "12th"
✗ Subject row headers: "English", "Math", "Science", "Social Studies", "PE", "World Language", "Visual & Performing Arts"
✗ Category labels: "Mathematics", "Physical Education", "Language Arts"
✗ Table structure: Lines, borders, grid marks
✗ Empty cells: Skip them
✗ Note: When you see "PE" or "English" AS A ROW LABEL on the left side, that's a header. When you see "PE 9" or "Lit/Writing" INSIDE A CELL, that's a course!

✅ WHAT TO EXTRACT (Data in cells - these are COURSES):
✓ **English/Language Arts**: "Lit/Writing", "LA", "World Literature", "World Lit", "AP Eng Lang and Comp", "AP English Language", "Story and Style"
✓ **Math**: "Pre-Calc Honors", "Pre-Calculus", "AP Calc-BC", "AP Calculus BC", "Calc-BC", "AP Statistics", "Linear Algebra", "Dual: Linear Alg"
✓ **Science**: "Biology", "Chemistry Honors", "AP Chemistry", "Physics", "AP Physics C", "AP Physics C:Mech", "AP Phys C Mech", "AP Environmental"
✓ **Social Studies**: "World History", "AP US History", "AP U.S History", "Economics", "AP Government", "AP Psychology"
✓ **PE**: "PE 9", "PE 10", "PE Inclusion", "Physical Education 9"
✓ **Languages**: "Spanish 1", "Spanish 2", "Spanish 3", "Spanish 4", "AP Spanish", "French 2", "Mandarin 3"
✓ **Arts**: "Art 1", "AP Studio Art", "Band", "Orchestra", "Photography"
✓ **Other**: "AP Computer Science", "AP Comp Sci Principles", "Journalism", "STEM", "Health"
✓ Multi-line cells: "AP Statistics\nDual: Linear Alg" → Extract BOTH courses separately

🧠 INDUCTIVE REASONING FOR MESSY HANDWRITING:

**Location matters**:
- If text is in a COLUMN HEADER or ROW LABEL position → it's a header (ignore it)
- If text is INSIDE A DATA CELL under a grade column → it's a course (extract it)
- Example: "PE" as a row label = ignore; "PE 9" in a cell = extract as course

**Abbreviation expansion**:
- "Pre-calc" / "Precalc" → "Pre-Calculus" or "Pre-Calculus Honors"
- "AP Eng Lang" / "Eng Lang and Comp" → "AP English Language & Composition"
- "Calc-BC" / "Calc BC" → "AP Calculus BC"
- "LA" / "Lit/Writing" → "Literature & Writing"
- "World Lit" → "World Literature" or "World Literature & Writing"
- "Stats" → "AP Statistics"
- "Linear Alg" / "Dual Linear Alg" → "Linear Algebra"
- "AP Physics C:Mech" / "AP Phys C Mech" → "AP Physics C: Mechanics"
- "Chem" → "Chemistry"; "Chem H" → "Chemistry Honors"
- "Bio" → "Biology"; "Phys" → "Physics"

**Language courses with numbers**:
- "Spanish 2", "Spanish 3", "Spanish 4" → extract as-is
- "French 1", "Mandarin 3", "Japanese 2" → extract as-is
- "AP Spanish" → "AP Spanish Language & Culture"

**PE courses are ALWAYS courses, never headers**:
- "PE 9", "PE9", "PE 10", "PE10" → extract them as courses
- "PE Inclusion", "PE Inc", "Inclusion PE", "PE Incl" → extract them as courses
- IMPORTANT: "PE Inclusion" is a COURSE NAME, not a category label!

**When in doubt**:
- If text contains "AP" → it's a course
- If partially unclear, choose the closest official Lynbrook course name
- Multi-line cells: extract each line separately

📝 SPECIAL CASES:
- Multi-line cells: Extract each line as a separate course
- Abbreviations: Preserve them (we'll normalize later)
- Unclear text: Use best judgment based on context (grade level, surrounding courses)
- Empty cells: Skip them

Return JSON:
{
  "courses": ["course1", "course2"]
}`
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000, // Increased for more comprehensive extraction
      temperature: 0.2, // Slightly higher for better inference with unclear text
    });

    const responseContent = response.choices[0]?.message?.content || "";

    if (!responseContent) {
      return NextResponse.json(
        { error: "Failed to extract courses from image" },
        { status: 500 }
      );
    }

    // Parse JSON response - expect array of course name strings
    let courseNames: string[] = [];

    try {
      const parsed = JSON.parse(responseContent.trim());

      // Handle different response formats
      if (Array.isArray(parsed)) {
        courseNames = parsed.filter((c: unknown) => typeof c === "string");
      } else if (parsed.courses && Array.isArray(parsed.courses)) {
        courseNames = parsed.courses.filter((c: unknown) => typeof c === "string");
      } else {
        return NextResponse.json(
          {
            error: "Invalid response format. Expected courses array of strings.",
            rawResponse: responseContent,
          },
          { status: 500 }
        );
      }

      // Debug: Log raw OCR extraction
      console.log("📋 RAW OCR EXTRACTION:", JSON.stringify(courseNames, null, 2));
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = responseContent.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          courseNames = Array.isArray(parsed)
            ? parsed.filter((c: unknown) => typeof c === "string")
            : (parsed.courses || []).filter((c: unknown) => typeof c === "string");
        } catch (e) {
          return NextResponse.json(
            {
              error: "Failed to parse course data. Please try again with a clearer image.",
              rawResponse: responseContent,
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: "Failed to parse course data. Please try again with a clearer image.",
            rawResponse: responseContent,
          },
          { status: 500 }
        );
      }
    }

    // Split multi-line cells and process each course
    let allCourseNames: string[] = [];
    for (const courseText of courseNames) {
      // Split if it contains multiple courses (e.g., "AP statistics\nDual: Linear Alg.")
      const split = splitCourses(courseText);
      allCourseNames.push(...split);
    }

    // Normalize FIRST (so "LA" becomes "Language Arts" before filtering)
    // Then filter out headers and validate
    console.log("🔄 BEFORE NORMALIZATION:", allCourseNames);

    const normalizedCourses = allCourseNames
      .map(c => c.trim())
      .map(c => {
        const normalized = normalizeCourse(c);
        if (normalized !== c) {
          console.log(`  ✏️  "${c}" → "${normalized}"`);
        }
        return normalized;
      }) // Normalize first - converts "LA" to "Language Arts"
      .filter(c => {
        const tooShort = c.length <= 3;
        if (tooShort) {
          console.log(`  ⚠️  Filtering out "${c}" (too short after normalization)`);
        }
        return !tooShort;
      }) // After normalization, require minimum length
      .filter(c => {
        const shouldIgnoreIt = shouldIgnore(c);
        if (shouldIgnoreIt) {
          console.log(`  🚫 Ignoring "${c}" (detected as header/label)`);
        }
        return !shouldIgnoreIt;
      }); // Filter out headers/labels (after normalization)

    console.log("✅ AFTER NORMALIZATION & FILTERING:", normalizedCourses);

    // Deduplicate normalized courses (case-insensitive) to avoid adding the same course multiple times
    const uniqueCourses = Array.from(
      new Set(normalizedCourses.map(c => c.toLowerCase()))
    ).map(lower =>
      normalizedCourses.find(c => c.toLowerCase() === lower)!
    );

    // Debug logging
    if (normalizedCourses.length === 0 && allCourseNames.length > 0) {
      console.log("RAW OCR extracted:", allCourseNames);
      console.log("After filtering:", normalizedCourses);
    }
    if (normalizedCourses.length !== uniqueCourses.length) {
      console.log(`Removed ${normalizedCourses.length - uniqueCourses.length} duplicate course(s)`);
    }

    // Use fuzzy matching to find official Lynbrook courses with exact credits
    const matchedCourses: Array<{ course: string; credits: number; category: string; ucCsuRequirement?: string }> = [];
    const unmatchedCourses: string[] = [];

    console.log("\n🔍 FUZZY MATCHING:");
    for (const courseName of uniqueCourses) {
      const match = findBestLynbrookMatch(courseName);

      if (match && match.score >= 0.5) {
        // Good match found - use official course name, credits, category, and UC/CSU requirement
        const lynbrookCourse = LYNBROOK_COURSES.find(c => c.name === match.course);
        matchedCourses.push({
          course: match.course,
          credits: match.credits,
          category: match.category,
          ucCsuRequirement: lynbrookCourse?.ucCsuRequirement,
        });
        console.log(`  ✓ Matched "${courseName}" → "${match.course}" (${match.credits} credits, ${match.category}, score: ${match.score.toFixed(2)})`);
      } else {
        // No good match - try to get top matches for logging
        const topMatches = findTopLynbrookMatches(courseName, 3);
        if (topMatches.length > 0) {
          console.log(`  ⚠️  Weak match for "${courseName}". Top candidates:`,
            topMatches.map(m => `${m.course} (${m.score.toFixed(2)})`).join(", "));
          // Use best candidate even if score is low
          const lynbrookCourse = LYNBROOK_COURSES.find(c => c.name === topMatches[0].course);
          matchedCourses.push({
            course: topMatches[0].course,
            credits: topMatches[0].credits,
            category: topMatches[0].category,
            ucCsuRequirement: lynbrookCourse?.ucCsuRequirement,
          });
        } else {
          // Fallback: Keep original name and use categorizer for credits
          unmatchedCourses.push(courseName);
          console.log(`  ❌ No match found for "${courseName}" - using fallback`);
        }
      }
    }

    // Handle unmatched courses with categorizer fallback
    if (unmatchedCourses.length > 0) {
      const fallbackCourses: Course[] = unmatchedCourses.map((courseName) => ({
        course: courseName,
        credits: 10, // Default to year-long course
      }));

      const subjectBreakdown = categorizeCourses(fallbackCourses);
      subjectBreakdown.forEach(subject => {
        subject.courses.forEach(course => {
          matchedCourses.push({
            course: course.course,
            credits: course.credits,
            category: subject.name,
            ucCsuRequirement: undefined, // Fallback courses don't have UC/CSU mapping
          });
        });
      });
    }

    // Final deduplication: Remove duplicate courses from matched results
    // This catches cases where different input variations all fuzzy match to the same official course
    const uniqueMatchedCourses = Array.from(
      new Map(
        matchedCourses.map(c => [c.course.toLowerCase(), c])
      ).values()
    );

    if (matchedCourses.length !== uniqueMatchedCourses.length) {
      console.log(`Removed ${matchedCourses.length - uniqueMatchedCourses.length} duplicate course(s) from final results`);
    }

    const courses = uniqueMatchedCourses;

    if (courses.length === 0) {
      return NextResponse.json(
        {
          error:
            "No courses found in the image. Please ensure the image contains a course list or transcript.",
          rawResponse: responseContent,
        },
        { status: 400 }
      );
    }

    // Calculate all three requirement systems
    const requirements = calculateAllRequirements(courses);

    return NextResponse.json({
      courses,
      requirements: {
        lynbrook: requirements.lynbrook,
        uc: requirements.uc,
        csu: requirements.csu,
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while processing the image",
      },
      { status: 500 }
    );
  }
}

