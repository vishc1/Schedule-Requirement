"use client";

import { useState } from "react";
import { LYNBROOK_COURSES, LynbrookCourse } from "@/lib/lynbrookCourses";

interface ManualCourseAdderProps {
  onAddCourse: (course: {
    course: string;
    credits: number;
    category: string;
    ucCsuRequirement?: string;
    year?: 9 | 10 | 11 | 12;
    manuallyAdded: boolean;
  }) => void;
}

export default function ManualCourseAdder({ onAddCourse }: ManualCourseAdderProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<9 | 10 | 11 | 12>(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter courses based on search term
  const filteredCourses = LYNBROOK_COURSES.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesName = course.name.toLowerCase().includes(searchLower);
    const matchesAlias = course.aliases?.some((alias) =>
      alias.toLowerCase().includes(searchLower)
    );
    const matchesCategory = course.category.toLowerCase().includes(searchLower);
    return matchesName || matchesAlias || matchesCategory;
  });

  const handleAddCourse = () => {
    if (!selectedCourse) return;

    const course = LYNBROOK_COURSES.find((c) => c.name === selectedCourse);
    if (!course) return;

    onAddCourse({
      course: course.name,
      credits: course.credits,
      category: course.category,
      ucCsuRequirement: course.ucCsuRequirement,
      year: selectedYear,
      manuallyAdded: true,
    });

    // Reset form
    setSelectedCourse("");
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleSelectCourse = (courseName: string) => {
    setSelectedCourse(courseName);
    setSearchTerm(courseName);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">➕</span>
        <h3 className="text-xl font-bold text-gray-900">Add Course Manually</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Missed a course? Add it manually and select which grade level you took/will take it.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Course Search/Select */}
        <div className="flex-1 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Course
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                setSelectedCourse("");
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Type to search courses..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && searchTerm && filteredCourses.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
              {filteredCourses.slice(0, 10).map((course) => (
                <button
                  key={course.name}
                  onClick={() => handleSelectCourse(course.name)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-semibold text-gray-900">{course.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {course.category} • {course.credits} credits
                  </div>
                </button>
              ))}
              {filteredCourses.length > 10 && (
                <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50">
                  ... and {filteredCourses.length - 10} more. Keep typing to narrow down.
                </div>
              )}
            </div>
          )}

          {isDropdownOpen && searchTerm && filteredCourses.length === 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-4">
              <p className="text-sm text-gray-500">No courses found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Grade Select */}
        <div className="sm:w-40">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Grade Level
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value) as 9 | 10 | 11 | 12)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
          >
            <option value={9}>9th Grade</option>
            <option value={10}>10th Grade</option>
            <option value={11}>11th Grade</option>
            <option value={12}>12th Grade</option>
          </select>
        </div>

        {/* Add Button */}
        <div className="sm:w-32 flex items-end">
          <button
            onClick={handleAddCourse}
            disabled={!selectedCourse}
            className={`
              w-full px-6 py-3 rounded-xl font-bold text-white transition-all transform
              ${
                selectedCourse
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-105"
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            Add
          </button>
        </div>
      </div>

      {selectedCourse && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
          <p className="text-sm text-blue-900">
            <span className="font-bold">Ready to add:</span> {selectedCourse} (Grade {selectedYear})
          </p>
        </div>
      )}
    </div>
  );
}
