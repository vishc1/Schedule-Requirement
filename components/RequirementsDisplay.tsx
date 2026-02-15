"use client";

import React, { useState } from "react";
import { RequirementsProgress } from "@/lib/requirementsTracker";

interface RequirementsDisplayProps {
  lynbrook: RequirementsProgress;
  uc: RequirementsProgress;
  csu: RequirementsProgress;
}

export default function RequirementsDisplay({
  lynbrook,
  uc,
  csu,
}: RequirementsDisplayProps) {
  const [activeTab, setActiveTab] = useState<"lynbrook" | "uc" | "csu">("lynbrook");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const activeRequirements = activeTab === "lynbrook" ? lynbrook : activeTab === "uc" ? uc : csu;

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const renderProgressBar = (earned: number, required: number | string) => {
    const requiredNum = typeof required === "string" ? parseFloat(required.toString()) : required;
    const progress = Math.min(100, (earned / requiredNum) * 100);
    const isComplete = earned >= requiredNum;

    return (
      <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-3 rounded-full transition-all duration-500 ease-out shadow-sm ${
            isComplete
              ? "bg-gradient-to-r from-green-400 to-emerald-500"
              : progress >= 75
              ? "bg-gradient-to-r from-yellow-400 to-amber-500"
              : "bg-gradient-to-r from-red-400 to-rose-500"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation - Modern Pills Style */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-2xl shadow-inner">
        <nav className="flex space-x-2" aria-label="Requirements">
          <button
            onClick={() => setActiveTab("lynbrook")}
            className={`
              flex-1 px-6 py-4 text-base font-bold rounded-xl transition-all duration-300 transform
              ${
                activeTab === "lynbrook"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-white hover:shadow-md hover:scale-102"
              }
            `}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🎓</span>
              <div className="text-left">
                <div className="text-sm sm:text-base">Lynbrook</div>
                <div className="text-xs opacity-75">Graduation</div>
              </div>
              <span className="text-lg ml-auto">
                {lynbrook.meetsRequirements ? "✅" : "⏳"}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("uc")}
            className={`
              flex-1 px-6 py-4 text-base font-bold rounded-xl transition-all duration-300 transform
              ${
                activeTab === "uc"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-white hover:shadow-md hover:scale-102"
              }
            `}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🐻</span>
              <div className="text-left">
                <div className="text-sm sm:text-base">UC</div>
                <div className="text-xs opacity-75">A-G</div>
              </div>
              <span className="text-lg ml-auto">
                {uc.meetsRequirements ? "✅" : "⏳"}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("csu")}
            className={`
              flex-1 px-6 py-4 text-base font-bold rounded-xl transition-all duration-300 transform
              ${
                activeTab === "csu"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-white hover:shadow-md hover:scale-102"
              }
            `}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🎯</span>
              <div className="text-left">
                <div className="text-sm sm:text-base">CSU</div>
                <div className="text-xs opacity-75">A-G</div>
              </div>
              <span className="text-lg ml-auto">
                {csu.meetsRequirements ? "✅" : "⏳"}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Summary Cards - Enhanced with animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`rounded-2xl p-8 shadow-2xl text-white transform transition-all duration-500 hover:scale-105 ${
            activeTab === "lynbrook"
              ? "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"
              : activeTab === "uc"
              ? "bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600"
              : "bg-gradient-to-br from-green-500 via-green-600 to-emerald-600"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold opacity-90 uppercase tracking-wide">
              {activeTab === "lynbrook" ? "Total Credits Earned" : "Years Completed"}
            </p>
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-5xl font-black mb-2">
            {typeof activeRequirements.totalEarned === "number"
              ? activeTab === "lynbrook"
                ? activeRequirements.totalEarned
                : activeRequirements.totalEarned.toFixed(1)
              : activeRequirements.totalEarned}
          </p>
          <div className="h-1 w-20 bg-white opacity-50 rounded-full"></div>
        </div>
        <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 text-white rounded-2xl p-8 shadow-2xl transform transition-all duration-500 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold opacity-90 uppercase tracking-wide">
              {activeTab === "lynbrook" ? "Required for Graduation" : "Minimum Required"}
            </p>
            <span className="text-3xl">🎯</span>
          </div>
          <p className="text-5xl font-black mb-2">{activeRequirements.totalRequired}</p>
          <div className="h-1 w-20 bg-white opacity-50 rounded-full"></div>
        </div>
      </div>

      {/* Overall Status - Enhanced */}
      <div
        className={`p-6 rounded-2xl border-l-4 shadow-lg transform transition-all duration-300 hover:shadow-xl ${
          activeRequirements.meetsRequirements
            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500"
            : "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-500"
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="text-4xl">
            {activeRequirements.meetsRequirements ? "🎉" : "💪"}
          </div>
          <div className="flex-1">
            <p className="font-bold text-xl mb-2">
              {activeRequirements.meetsRequirements ? "✅ Requirements Met!" : "⏳ In Progress"}
            </p>
            <p className="text-base text-gray-700">
              {activeRequirements.meetsRequirements
                ? `Congratulations! You've completed all ${activeRequirements.system} requirements!`
                : `Keep up the great work! Continue towards your ${activeRequirements.system} requirements.`}
            </p>
          </div>
        </div>
      </div>

      {/* Warnings - Enhanced */}
      {activeRequirements.warnings && activeRequirements.warnings.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-6 rounded-2xl shadow-lg">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <p className="font-bold text-lg text-orange-900 mb-3">Important Notes:</p>
              <ul className="space-y-2">
                {activeRequirements.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="text-sm text-orange-800 flex-1">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown Table - Enhanced */}
      <div className="overflow-x-auto rounded-2xl border-2 border-gray-200 shadow-xl">
        <table className="min-w-full divide-y-2 divide-gray-200">
          <thead className={`${
            activeTab === "lynbrook"
              ? "bg-gradient-to-r from-blue-100 to-indigo-100"
              : activeTab === "uc"
              ? "bg-gradient-to-r from-purple-100 to-pink-100"
              : "bg-gradient-to-r from-green-100 to-emerald-100"
          }`}>
            <tr>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                {activeTab === "lynbrook" ? "Subject Area" : "A-G Category"}
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Required
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Earned
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Remaining
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                Courses
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeRequirements.categories.map((category, index) => {
              const isComplete = category.earned >= category.required;
              const isExpanded = expandedCategories.has(category.name);

              return (
                <React.Fragment key={index}>
                  <tr
                    className={`hover:bg-gradient-to-r transition-all duration-200 ${
                      isComplete
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100"
                        : "hover:from-gray-50 hover:to-gray-100"
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{isComplete ? "✅" : "📚"}</span>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{category.name}</div>
                          {category.note && (
                            <div className="text-xs text-gray-500 italic mt-0.5">{category.note}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-gray-700">{category.required}</td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-900">
                      {typeof category.earned === "number" && activeTab !== "lynbrook"
                        ? category.earned.toFixed(1)
                        : category.earned}
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-gray-600">
                      {typeof category.remaining === "number" && activeTab !== "lynbrook"
                        ? category.remaining.toFixed(1)
                        : category.remaining > 0
                        ? category.remaining
                        : 0}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      {isComplete ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-sm">
                          ✓ Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 shadow-sm">
                          ⏳ In Progress
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      {category.courses.length > 0 ? (
                        <button
                          onClick={() => toggleCategory(category.name)}
                          className={`font-bold transition-all duration-200 px-3 py-1.5 rounded-lg ${
                            activeTab === "lynbrook"
                              ? "text-blue-600 hover:bg-blue-50"
                              : activeTab === "uc"
                              ? "text-purple-600 hover:bg-purple-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {category.courses.length} {category.courses.length === 1 ? "course" : "courses"}
                          <span className="ml-1">{isExpanded ? "▲" : "▼"}</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">No courses</span>
                      )}
                    </td>
                  </tr>
                  {isExpanded && category.courses.length > 0 && (
                    <tr className={`${
                      activeTab === "lynbrook"
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                        : activeTab === "uc"
                        ? "bg-gradient-to-r from-purple-50 to-pink-50"
                        : "bg-gradient-to-r from-green-50 to-emerald-50"
                    }`}>
                      <td colSpan={6} className="px-6 py-5">
                        <div className={`pl-6 border-l-4 ${
                          activeTab === "lynbrook"
                            ? "border-blue-400"
                            : activeTab === "uc"
                            ? "border-purple-400"
                            : "border-green-400"
                        }`}>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-lg">📖</span>
                            <div className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                              Courses in {category.name}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {category.courses.map((course, courseIndex) => (
                              <div
                                key={courseIndex}
                                className="flex justify-between items-center py-3 px-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                <span className="text-sm font-medium text-gray-800">{course.course}</span>
                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                                  activeTab === "lynbrook"
                                    ? "bg-blue-100 text-blue-800"
                                    : activeTab === "uc"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {course.credits} credits
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <td colSpan={6} className="px-6 py-3">
                      {renderProgressBar(category.earned, category.required)}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Box - Enhanced */}
      <div className={`p-6 rounded-2xl border-l-4 shadow-lg ${
        activeTab === "lynbrook"
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500"
          : activeTab === "uc"
          ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500"
          : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500"
      }`}>
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            {activeTab === "lynbrook" ? (
              <>
                <p className="font-bold text-base text-gray-900 mb-2">Lynbrook Graduation Requirements</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  You need <span className="font-bold">220 total credits</span> for graduation. Remember to complete{" "}
                  <span className="font-bold">2 of 3 starred areas</span>: *World Language, *Visual & Performing Arts, or *Applied Academics.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-base text-gray-900 mb-2">UC/CSU A-G Requirements</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  You need a minimum of <span className="font-bold">15 year-long college prep courses</span>.{" "}
                  <span className="font-bold text-red-700">All a-g courses must be passed with C or better.</span>{" "}
                  This calculator assumes all courses meet the grade requirement.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
