"use client";

import React from "react";
import { Course } from "@/app/page";

interface CourseSchedulePrintableProps {
  courses: Course[];
}

interface GradeSchedule {
  "9th": Course[];
  "10th": Course[];
  "11th": Course[];
  "12th": Course[];
}

export default function CourseSchedulePrintable({ courses }: CourseSchedulePrintableProps) {
  // Group courses by category
  const coursesByCategory = courses.reduce((acc, course) => {
    const category = course.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  // Define category order
  const categoryOrder = [
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

  // Sort categories
  const sortedCategories = Object.keys(coursesByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const handlePrint = () => {
    window.print();
  };

  // Calculate totals by grade (this is a placeholder - you'd need grade info in your data)
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="space-y-6">
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">4-Year Course Schedule</h3>
          <p className="text-sm text-gray-600 mt-1">
            Organized by subject area • Ready to print
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Print Schedule</span>
        </button>
      </div>

      {/* Printable Content */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 print:shadow-none print:border-0">
        {/* Header - Only visible when printing */}
        <div className="hidden print:block p-8 border-b-2 border-gray-300">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            4-Year High School Course Plan
          </h1>
          <p className="text-center text-gray-600 text-sm">
            Lynbrook High School • Total Credits: {totalCredits}
          </p>
        </div>

        {/* Course Schedule by Category */}
        <div className="p-8 print:p-8">
          {sortedCategories.map((category, categoryIndex) => {
            const categoryCourses = coursesByCategory[category];
            const categoryTotal = categoryCourses.reduce((sum, c) => sum + c.credits, 0);

            return (
              <div
                key={category}
                className={`mb-8 ${categoryIndex !== 0 ? "print:break-inside-avoid" : ""}`}
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-t-lg print:bg-gray-800 flex justify-between items-center">
                  <h3 className="text-lg font-bold">{category}</h3>
                  <span className="text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {categoryTotal} credits
                  </span>
                </div>

                {/* Courses Table */}
                <div className="border-2 border-gray-200 border-t-0 rounded-b-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 print:bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-3/4">
                          Course Name
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider print:hidden">
                          UC/CSU
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoryCourses.map((course, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 print:hover:bg-white transition-colors`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {course.course}
                          </td>
                          <td className="px-6 py-4 text-sm text-center font-semibold text-gray-700">
                            {course.credits}
                          </td>
                          <td className="px-6 py-4 text-sm text-center print:hidden">
                            {course.ucCsuRequirement ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                                {course.ucCsuRequirement.toUpperCase()}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100 print:bg-gray-200">
                      <tr>
                        <td className="px-6 py-3 text-sm font-bold text-gray-900">
                          {category} Subtotal
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-center text-gray-900">
                          {categoryTotal}
                        </td>
                        <td className="print:hidden"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Grand Total */}
          <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 print:bg-gray-900 print:break-inside-avoid">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold opacity-90 mb-1">TOTAL CREDITS EARNED</p>
                <p className="text-4xl font-black">{totalCredits}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90 mb-1">GRADUATION REQUIREMENT</p>
                <p className="text-4xl font-black">220</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90 mb-1">REMAINING</p>
                <p className="text-4xl font-black">{Math.max(0, 220 - totalCredits)}</p>
              </div>
            </div>
          </div>

          {/* Footer Info - Only visible when printing */}
          <div className="hidden print:block mt-8 p-6 border-t-2 border-gray-300 text-sm text-gray-600">
            <p className="mb-2">
              <span className="font-bold">Note:</span> This schedule is generated from your course planning sheet.
            </p>
            <p className="text-xs">
              • Semester courses = 5 credits • Full-year courses = 10 credits • Team sports = 5 credits per season
            </p>
            <p className="text-xs mt-2">
              Generated by Lynbrook Credit Tracker • {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Instructions - Hidden when printing */}
      <div className="print:hidden bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-base text-blue-900 mb-2">Printing Tips</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click "Print Schedule" to open the print dialog</li>
              <li>• Use "Save as PDF" to create a digital copy</li>
              <li>• For best results, use Portrait orientation</li>
              <li>• All unnecessary elements are hidden when printing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
