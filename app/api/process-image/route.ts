import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { LYNBROOK_COURSES, COURSE_NAME_MAP } from "@/lib/lynbrookCourses";
import { findBestLynbrookMatch } from "@/lib/fuzzyMatcher";
import { calculateAllRequirements } from "@/lib/requirementsTracker";

export const maxDuration = 60; // seconds (Vercel hobby plan max)

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
          content: `You are an expert OCR system for reading high school course planning tables.

The image may be a phone photo (possibly angled, shadowed, or slightly blurry) or a screenshot.
The table may be partially filled — empty cells are normal, just skip them.

YOUR TASK: Extract all text from the 4-year course planning grid.

RULES:
- Transcribe EXACTLY what you see in each cell, including abbreviations and handwriting
- Preserve which grade column (9th, 10th, 11th, 12th) each entry belongs to
- If handwriting is unclear, write your best guess — do NOT skip it
- A cell with multiple lines = multiple course entries for that grade
- Empty cells = omit from the list for that grade
- Ignore row labels on the left side (subject headers like "English", "Math", "PE")

Return JSON:
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
              text: "Extract all course entries from this 4-year planning table, organized by grade column. Include everything written in cells — abbreviations, partial names, and unclear handwriting. Skip empty cells."
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

    // ========== PASS 2: COURSE EXTRACTION WITH GRADE INFO ==========
    // Provide the official course list so the AI maps directly to official names
    // and preserves which grade (9/10/11/12) each course appears in.
    console.log("\n🔍 PASS 2: Extracting courses with grade info...");

    const officialCourseNames = LYNBROOK_COURSES.map(c => c.name);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert at reading Lynbrook High School 4-year course planning tables.

OFFICIAL LYNBROOK COURSE LIST — use EXACT spelling from this list only:
${JSON.stringify(officialCourseNames)}

YOUR TASK:
1. Read the raw table data (organized by grade column: 9th, 10th, 11th, 12th)
2. For each course cell, map the text to the CLOSEST name in the official list above
3. Record which grade (9, 10, 11, or 12) the course appears in

WHAT TO IGNORE:
- Grade column headers: "9th", "10th", "11th", "12th", "9th Grade", etc.
- Subject row labels on the left: standalone "English", "Math", "Science", "Social Studies", "PE", "World Language", "Visual & Performing Arts"
- Empty cells

WHAT TO EXTRACT (text inside data cells):
- "Lit/Writing", "LA", "World Lit", "AP Calc-BC", "Pre-calc H", "Chem H", "PE 9", "PE Inclusion", "Spanish 2", etc.
- Multi-line cells: extract each line as a separate course entry

COMMON ABBREVIATION → OFFICIAL NAME MAPPINGS:
- "Lit/Writing", "LA", "English 9", "Eng 9" → "Literature & Writing"
- "World Lit", "English 10" → "World Literature & Writing"
- "Am Lit", "American Lit", "English 11" → "American Literature & Writing"
- "AP Eng Lang", "AP Lang" → "AP English Language & Composition"
- "AP Eng Lit", "AP Lit" → "AP English Literature & Composition"
- "Pre-calc H", "Pre-Calc Honors" → "Pre-Calculus Honors"
- "Pre-calc" → "Pre-Calculus"
- "AP Calc-BC", "Calc BC", "Calc-BC" → "AP Calculus BC"
- "AP Calc-AB", "Calc AB" → "AP Calculus AB"
- "Stats", "AP Stats" → "AP Statistics"
- "Linear Alg", "Dual: Linear Alg" → "Linear Algebra"
- "Chem H" → "Chemistry Honors"; "Bio H" → "Biology Honors"; "Phys H" → "Physics Honors"
- "AP Phys C Mech", "AP Physics C:Mech" → "AP Physics C: Mechanics"
- "AP Physics C E&M" → "AP Physics C: Electricity & Magnetism"
- "AP Env Sci", "AP Environmental" → "AP Environmental Science"
- "AP Gov", "AP Govt" → "AP US Government & Politics"
- "AP US Hist", "APUSH" → "AP US History"
- "AP World Hist" → "AP World History"
- "AP Macro" → "AP Macroeconomics"; "AP Micro" → "AP Microeconomics"
- "AP Psych" → "AP Psychology"
- "AP Comp Sci A", "AP CS A" → "AP Computer Science A"
- "AP Comp Sci Principles", "AP CSP" → "AP Computer Science Principles"
- "AP Spanish", "AP Span" → "AP Spanish Language & Culture"
- "AP French" → "AP French Language & Culture"
- "AP Chinese", "AP Mandarin" → "AP Chinese Language & Culture"
- "AP Studio Art", "AP Art" → "AP Studio Art"

Return JSON: {"courses": [{"name": "Official Course Name", "grade": 9}]}`,
        },
        {
          role: "user",
          content: `Raw table data from the image (organized by grade column):

${rawTableContent}

Extract all courses with their grade level (9, 10, 11, or 12). Use EXACT official course names from the provided list.`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.1,
    });

    const responseContent = response.choices[0]?.message?.content || "";

    if (!responseContent) {
      return NextResponse.json(
        { error: "Failed to extract courses from image" },
        { status: 500 }
      );
    }

    // Parse the response — expect [{name, grade}] format
    interface ExtractedItem { name: string; grade?: number }
    let extractedItems: ExtractedItem[] = [];

    try {
      const parsed = JSON.parse(responseContent.trim());
      const rawList = Array.isArray(parsed) ? parsed : (parsed.courses || []);
      for (const item of rawList) {
        if (typeof item === "string") {
          extractedItems.push({ name: item });
        } else if (item && typeof item.name === "string") {
          extractedItems.push({
            name: item.name.trim(),
            grade: [9, 10, 11, 12].includes(item.grade) ? item.grade : undefined,
          });
        }
      }
      console.log("📋 EXTRACTED ITEMS:", JSON.stringify(extractedItems, null, 2));
    } catch {
      return NextResponse.json(
        { error: "Failed to parse course data. Please try again with a clearer image." },
        { status: 500 }
      );
    }

    // Match each item to an official Lynbrook course.
    // Since the AI outputs official names directly, try exact lookup first,
    // then fall back to fuzzy matching for any imperfect AI output.
    const matchedCourses: Array<{
      course: string; credits: number; category: string;
      ucCsuRequirement?: string; year?: 9 | 10 | 11 | 12;
    }> = [];
    const seenNames = new Set<string>();

    console.log("\n🔍 MATCHING:");
    for (const item of extractedItems) {
      const nameLower = item.name.toLowerCase();
      if (seenNames.has(nameLower)) continue;
      seenNames.add(nameLower);

      // 1. Exact lookup (works when AI outputs official name correctly)
      const exactMatch = COURSE_NAME_MAP[nameLower];
      if (exactMatch) {
        matchedCourses.push({
          course: exactMatch.name,
          credits: exactMatch.credits,
          category: exactMatch.category,
          ucCsuRequirement: exactMatch.ucCsuRequirement,
          year: item.grade as 9 | 10 | 11 | 12 | undefined,
        });
        console.log(`  ✓ Exact: "${item.name}" → "${exactMatch.name}" (grade ${item.grade ?? "?"})`);
        continue;
      }

      // 2. Fuzzy fallback for cases AI didn't normalize perfectly
      const fuzzy = findBestLynbrookMatch(item.name);
      if (fuzzy && fuzzy.score >= 0.45) {
        const lynbrookCourse = LYNBROOK_COURSES.find(c => c.name === fuzzy.course);
        matchedCourses.push({
          course: fuzzy.course,
          credits: fuzzy.credits,
          category: fuzzy.category,
          ucCsuRequirement: lynbrookCourse?.ucCsuRequirement,
          year: item.grade as 9 | 10 | 11 | 12 | undefined,
        });
        console.log(`  ~ Fuzzy: "${item.name}" → "${fuzzy.course}" (score: ${fuzzy.score.toFixed(2)}, grade ${item.grade ?? "?"})`);
        continue;
      }

      console.log(`  ✗ Dropped: "${item.name}" (no match found — likely a header)`);
    }

    // Final deduplication by official course name (different AI phrasings → same course)
    const uniqueMatchedCourses = Array.from(
      new Map(matchedCourses.map(c => [c.course.toLowerCase(), c])).values()
    );

    if (matchedCourses.length !== uniqueMatchedCourses.length) {
      console.log(`Removed ${matchedCourses.length - uniqueMatchedCourses.length} duplicate(s)`);
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

