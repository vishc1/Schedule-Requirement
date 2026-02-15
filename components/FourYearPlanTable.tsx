"use client";

import React, { useState, useEffect } from "react";
import { Course } from "@/app/page";

interface FourYearPlanTableProps {
  courses: Course[];
}

interface GradeAssignments {
  [grade: string]: {
    [category: string]: Course | null;
  };
}

const SUBJECT_AREAS = [
  "English",
  "Math",
  "Science",
  "Social Studies",
  "Physical Education",
  "World Languages",
  "Visual & Performing Arts",
  "Applied Academics",
  "Health",
  "Other"
];

const GRADES = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"];

export default function FourYearPlanTable({ courses }: FourYearPlanTableProps) {
  const [assignments, setAssignments] = useState<GradeAssignments>(() => {
    // Initialize empty grid
    const initialAssignments: GradeAssignments = {};
    GRADES.forEach(grade => {
      initialAssignments[grade] = {};
      SUBJECT_AREAS.forEach(subject => {
        initialAssignments[grade][subject] = null;
      });
    });
    return initialAssignments;
  });

  const [unassignedCourses, setUnassignedCourses] = useState<Course[]>([]);
  const [editingCell, setEditingCell] = useState<{ grade: string; subject: string } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fourYearPlan");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAssignments(parsed);
      } catch (e) {
        console.error("Failed to load saved plan:", e);
      }
    }
  }, []);

  // Auto-assign courses based on their category and try to infer grade
  useEffect(() => {
    if (courses.length > 0) {
      const newAssignments = { ...assignments };
      const assigned = new Set<string>();

      courses.forEach(course => {
        const category = course.category || "Other";

        // Try to infer grade from course name
        let inferredGrade: string | null = null;
        if (course.course.match(/\b9\b|ninth|freshman/i)) inferredGrade = "9th Grade";
        else if (course.course.match(/\b10\b|tenth|sophomore/i)) inferredGrade = "10th Grade";
        else if (course.course.match(/\b11\b|eleventh|junior/i)) inferredGrade = "11th Grade";
        else if (course.course.match(/\b12\b|twelfth|senior/i)) inferredGrade = "12th Grade";

        // If we can infer a grade and that slot is empty, assign it
        if (inferredGrade && !newAssignments[inferredGrade][category]) {
          newAssignments[inferredGrade][category] = course;
          assigned.add(course.course);
        } else {
          // Try to find an empty slot in any grade for this category
          for (const grade of GRADES) {
            if (!newAssignments[grade][category]) {
              newAssignments[grade][category] = course;
              assigned.add(course.course);
              break;
            }
          }
        }
      });

      setAssignments(newAssignments);
      setUnassignedCourses(courses.filter(c => !assigned.has(c.course)));
    }
  }, [courses]);

  // Save to localStorage whenever assignments change
  useEffect(() => {
    localStorage.setItem("fourYearPlan", JSON.stringify(assignments));
  }, [assignments]);

  const handleCourseSelect = (grade: string, subject: string, course: Course | null) => {
    const newAssignments = { ...assignments };
    newAssignments[grade][subject] = course;
    setAssignments(newAssignments);
    setEditingCell(null);
  };

  const handleRemoveCourse = (grade: string, subject: string) => {
    const newAssignments = { ...assignments };
    newAssignments[grade][subject] = null;
    setAssignments(newAssignments);
  };

  const calculateGradeTotal = (grade: string): number => {
    return SUBJECT_AREAS.reduce((sum, subject) => {
      const course = assignments[grade][subject];
      return sum + (course?.credits || 0);
    }, 0);
  };

  const calculateSubjectTotal = (subject: string): number => {
    return GRADES.reduce((sum, grade) => {
      const course = assignments[grade][subject];
      return sum + (course?.credits || 0);
    }, 0);
  };

  const calculateGrandTotal = (): number => {
    return GRADES.reduce((sum, grade) => sum + calculateGradeTotal(grade), 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all course assignments?")) {
      const emptyAssignments: GradeAssignments = {};
      GRADES.forEach(grade => {
        emptyAssignments[grade] = {};
        SUBJECT_AREAS.forEach(subject => {
          emptyAssignments[grade][subject] = null;
        });
      });
      setAssignments(emptyAssignments);
      localStorage.removeItem("fourYearPlan");
    }
  };

  // Get available courses for a subject (courses with that category that aren't assigned elsewhere)
  const getAvailableCourses = (currentGrade: string, subject: string): Course[] => {
    const assignedCourses = new Set<string>();

    // Collect all assigned courses except the current cell
    GRADES.forEach(grade => {
      SUBJECT_AREAS.forEach(subj => {
        if (!(grade === currentGrade && subj === subject)) {
          const course = assignments[grade][subj];
          if (course) assignedCourses.add(course.course);
        }
      });
    });

    return courses.filter(c =>
      !assignedCourses.has(c.course) &&
      (c.category === subject || subject === "Other")
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="print:hidden flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">4-Year Course Plan</h3>
          <p className="text-sm text-gray-600 mt-1">
            Click cells to assign courses • Auto-saved to browser
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleClearAll}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear All</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Plan</span>
          </button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-6 pb-4 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          4-Year High School Course Plan
        </h1>
        <p className="text-center text-gray-600 text-sm">
          Lynbrook High School
        </p>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border-2 border-gray-300 shadow-2xl print:shadow-none">
        <table className="min-w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white print:bg-gray-800">
              <th className="border-2 border-gray-300 px-4 py-3 text-left font-bold text-sm uppercase tracking-wide">
                Subject Area
              </th>
              {GRADES.map(grade => (
                <th key={grade} className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-sm uppercase tracking-wide">
                  {grade}
                </th>
              ))}
              <th className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-sm uppercase tracking-wide bg-blue-700 print:bg-gray-900">
                Total Credits
              </th>
            </tr>
          </thead>
          <tbody>
            {SUBJECT_AREAS.map((subject, subjectIndex) => (
              <tr key={subject} className={subjectIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border-2 border-gray-300 px-4 py-3 font-semibold text-sm text-gray-900 bg-gray-100 print:bg-gray-200">
                  {subject}
                </td>
                {GRADES.map(grade => {
                  const course = assignments[grade][subject];
                  const isEditing = editingCell?.grade === grade && editingCell?.subject === subject;
                  const availableCourses = getAvailableCourses(grade, subject);

                  return (
                    <td key={grade} className="border-2 border-gray-300 px-2 py-2 text-sm relative group">
                      {isEditing ? (
                        <div className="absolute z-10 top-0 left-0 w-full bg-white border-2 border-blue-500 shadow-xl rounded-lg p-2 max-h-48 overflow-y-auto">
                          <div className="space-y-1">
                            <button
                              onClick={() => setEditingCell(null)}
                              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-xs text-gray-600"
                            >
                              ✕ Cancel
                            </button>
                            <button
                              onClick={() => handleCourseSelect(grade, subject, null)}
                              className="w-full text-left px-2 py-1 hover:bg-red-50 rounded text-xs text-red-600"
                            >
                              🗑️ Clear
                            </button>
                            <div className="border-t border-gray-200 my-1"></div>
                            {availableCourses.length === 0 ? (
                              <div className="px-2 py-1 text-xs text-gray-400 italic">
                                No courses available
                              </div>
                            ) : (
                              availableCourses.map(c => (
                                <button
                                  key={c.course}
                                  onClick={() => handleCourseSelect(grade, subject, c)}
                                  className="w-full text-left px-2 py-1 hover:bg-blue-50 rounded text-xs"
                                >
                                  {c.course} ({c.credits} cr)
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingCell({ grade, subject })}
                          className="w-full h-full min-h-[3rem] text-left px-2 py-1 hover:bg-blue-50 print:hover:bg-white rounded transition-colors print:border-0"
                        >
                          {course ? (
                            <div>
                              <div className="font-medium text-gray-900">{course.course}</div>
                              <div className="text-xs text-gray-500 mt-1">{course.credits} credits</div>
                            </div>
                          ) : (
                            <div className="text-gray-400 italic text-xs print:hidden">Click to assign</div>
                          )}
                        </button>
                      )}
                    </td>
                  );
                })}
                <td className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-sm bg-blue-50 print:bg-gray-100">
                  {calculateSubjectTotal(subject)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white print:bg-gray-900">
              <td className="border-2 border-gray-300 px-4 py-3 font-bold text-sm uppercase">
                Total Credits
              </td>
              {GRADES.map(grade => (
                <td key={grade} className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-lg">
                  {calculateGradeTotal(grade)}
                </td>
              ))}
              <td className="border-2 border-gray-300 px-4 py-3 text-center font-black text-xl bg-green-600 print:bg-black">
                {calculateGrandTotal()} / 220
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-sm font-semibold opacity-90 mb-1">Total Credits Earned</p>
          <p className="text-4xl font-black">{calculateGrandTotal()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-sm font-semibold opacity-90 mb-1">Required for Graduation</p>
          <p className="text-4xl font-black">220</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <p className="text-sm font-semibold opacity-90 mb-1">Remaining</p>
          <p className="text-4xl font-black">{Math.max(0, 220 - calculateGrandTotal())}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="print:hidden bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-base text-blue-900 mb-2">How to Use</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Click any cell</strong> to assign a course to that grade and subject</li>
              <li>• Courses are <strong>automatically saved</strong> to your browser</li>
              <li>• <strong>Print</strong> to create a PDF or physical copy</li>
              <li>• Use <strong>Clear All</strong> to start over</li>
              <li>• Courses are auto-assigned based on their names and categories</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t-2 border-gray-300 text-sm text-gray-600">
        <p className="text-xs">
          Generated by Lynbrook Credit Tracker • {new Date().toLocaleDateString()} •
          Semester courses = 5 credits • Full-year courses = 10 credits
        </p>
      </div>
    </div>
  );
}
