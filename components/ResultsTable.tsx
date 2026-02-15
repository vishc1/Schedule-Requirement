"use client";

import React, { useState } from "react";
import { Course } from "@/app/page";
import { categorizeCourses, SubjectRequirement } from "@/lib/subjectCategorizer";

interface ResultsTableProps {
  courses: Course[];
}

export default function ResultsTable({ courses }: ResultsTableProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const graduationRequirement = 220;
  const creditsRemaining = Math.max(0, graduationRequirement - totalCredits);
  const progressPercentage = Math.min(100, (totalCredits / graduationRequirement) * 100);

  const subjectBreakdown = categorizeCourses(courses);

  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectName)) {
        newSet.delete(subjectName);
      } else {
        newSet.add(subjectName);
      }
      return newSet;
    });
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <p className="text-sm font-medium opacity-90 mb-1">Total Credits</p>
          <p className="text-4xl font-bold">{totalCredits}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
          <p className="text-sm font-medium opacity-90 mb-1">Required</p>
          <p className="text-4xl font-bold">{graduationRequirement}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <p className="text-sm font-medium opacity-90 mb-1">Remaining</p>
          <p className="text-4xl font-bold">{creditsRemaining}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress to Graduation</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Subject Breakdown</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Required
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Earned
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Courses
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjectBreakdown.map((subject, index) => {
                const isComplete = subject.earned >= subject.required;
                const progress = Math.min(100, (subject.earned / subject.required) * 100);
                const isExpanded = expandedSubjects.has(subject.name);

                return (
                  <React.Fragment key={index}>
                    <tr
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        isComplete ? "bg-green-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {subject.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {subject.required}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {subject.earned}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {subject.remaining > 0 ? subject.remaining : 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {isComplete ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Complete
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            In Progress
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => toggleSubject(subject.name)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {subject.courses.length} {subject.courses.length === 1 ? "course" : "courses"}
                          {isExpanded ? " ▲" : " ▼"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && subject.courses.length > 0 && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="pl-4 border-l-2 border-blue-300">
                            <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                              Courses in {subject.name}:
                            </div>
                            <div className="space-y-1">
                              {subject.courses.map((course, courseIndex) => (
                                <div
                                  key={courseIndex}
                                  className="flex justify-between items-center py-1 px-2 rounded hover:bg-white"
                                >
                                  <span className="text-sm text-gray-700">{course.course}</span>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {course.credits} credits
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isComplete
                                ? "bg-green-500"
                                : progress >= 75
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Courses Table */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">All Courses</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Credits
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {course.course}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                    {course.credits}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gradient-to-r from-gray-100 to-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  Total Credits
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  {totalCredits}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">ℹ️ Credit System:</span> Based on Lynbrook High School rules. 
          Semester courses = 5 credits, full-year courses = 10 credits, team sports = 5 credits per season.
        </p>
      </div>
    </div>
  );
}

