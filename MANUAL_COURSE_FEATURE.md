# Manual Course Addition Feature

## Overview
Users can now manually add courses that were missed during image extraction and specify which grade year they took/will take the course.

## What Was Implemented

### 1. **New Component: ManualCourseAdder**
Located at: `components/ManualCourseAdder.tsx`

Features:
- ✅ Searchable dropdown with all Lynbrook courses
- ✅ Year selector (9th, 10th, 11th, 12th grade)
- ✅ Auto-complete filtering as user types
- ✅ Shows course details (category, credits) in dropdown
- ✅ Prevents duplicate courses from being added
- ✅ Clean, modern UI matching the app's design

### 2. **Updated Course Interface**
`app/page.tsx`

Added new optional fields:
```typescript
export interface Course {
  course: string;
  credits: number;
  category?: string;
  ucCsuRequirement?: string;
  year?: 9 | 10 | 11 | 12;        // NEW: Grade year
  manuallyAdded?: boolean;          // NEW: Source tracking
}
```

### 3. **Updated ResultsTable Component**
`components/ResultsTable.tsx`

Features:
- ✅ Shows year badge for each course (9th, 10th, 11th, 12th)
- ✅ Visual distinction between auto-detected and manual courses
  - 🤖 **Auto** = Green badge (extracted from image)
  - ✏️ **Manual** = Amber badge (manually added)
- ✅ Yellow background highlight for manually added courses
- ✅ "Remove" button for each course
- ✅ New columns: Year, Source, Action

### 4. **State Management**
`app/page.tsx`

New functions:
- `handleAddCourse()` - Adds manual course and recalculates requirements
- `handleRemoveCourse()` - Removes course and recalculates requirements
- Automatic requirements recalculation using existing `calculateAllRequirements()`

## User Experience

### Adding a Course:
1. User uploads image → courses auto-extracted
2. User scrolls to "Add Course Manually" section (blue gradient box)
3. User types to search (e.g., "AP Calculus")
4. Dropdown shows matching courses with details
5. User selects course and year
6. Clicks "Add" button
7. Course appears in table with amber "Manual" badge
8. Requirements automatically recalculate

### Removing a Course:
1. User sees all courses in "Your Courses" table
2. Each row has a "Remove" button
3. Click "Remove" → course deleted
4. Requirements automatically recalculate

### Visual Indicators:
- **Auto-detected courses**: Green badge, normal background
- **Manually added courses**: Amber badge, yellow background highlight
- **Year badges**: Blue badges showing "9th", "10th", "11th", or "12th"

## Example Use Case

**Scenario**: Student's handwriting for "Lit/Writing" was unclear and wasn't detected

**Solution**:
1. Upload image → other courses extracted successfully
2. Notice "Literature & Writing" is missing
3. Click "Add Course Manually"
4. Type "Lit" → dropdown shows "Literature & Writing"
5. Select it, choose "9th Grade"
6. Click "Add"
7. Course now appears with ✏️ Manual badge and can be removed if needed

## Technical Details

### Duplicate Prevention
- Checks if course with same name AND year already exists
- Shows alert if duplicate detected

### Requirements Recalculation
- Uses existing `calculateAllRequirements()` from `lib/requirementsTracker.ts`
- Automatically updates Lynbrook, UC, and CSU progress
- No backend changes needed

### Backwards Compatibility
- All new fields are optional
- Existing auto-detected courses work without year/manuallyAdded fields
- Works seamlessly with existing components (FourYearPlanTable, CourseSchedulePrintable)

## Files Modified

1. ✅ `app/page.tsx` - Main page with state management
2. ✅ `components/ManualCourseAdder.tsx` - NEW component
3. ✅ `components/ResultsTable.tsx` - Updated table with new columns

## Future Enhancements (Optional)

- [ ] Add year to auto-detected courses (based on typical grade levels)
- [ ] Allow editing course year after adding
- [ ] Bulk import from text list
- [ ] Export/import course list as JSON
- [ ] "Undo" button for removed courses
