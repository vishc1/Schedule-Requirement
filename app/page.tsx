"use client";

import { useState, useRef } from "react";
import ImageUpload from "@/components/ImageUpload";
import ResultsTable from "@/components/ResultsTable";
import RequirementsDisplay from "@/components/RequirementsDisplay";
import { RequirementsProgress } from "@/lib/requirementsTracker";

export interface Course {
  course: string;
  credits: number;
  category?: string;
  ucCsuRequirement?: string;
}

interface ApiResponse {
  courses: Course[];
  requirements?: {
    lynbrook: RequirementsProgress;
    uc: RequirementsProgress;
    csu: RequirementsProgress;
  };
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [requirements, setRequirements] = useState<ApiResponse["requirements"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleUploadComplete = (data: ApiResponse) => {
    setCourses(data.courses);
    setRequirements(data.requirements || null);
    setLoading(false);
    setError(null);
    // Auto-scroll to results after a brief delay
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleUploadStart = () => {
    setLoading(true);
    setError(null);
    setCourses([]);
    setRequirements(null);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
    setCourses([]);
    setRequirements(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Enhanced */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-105 transition-transform duration-300">
              Official Lynbrook HS Tracker
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 drop-shadow-sm">
            🎓 Credit Tracker
          </h1>
          <p className="text-2xl font-semibold text-gray-700 mb-2">
            Upload your course planning sheet
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant insights into your progress toward{" "}
            <span className="font-bold text-blue-600">Lynbrook</span>,{" "}
            <span className="font-bold text-purple-600">UC</span>, and{" "}
            <span className="font-bold text-green-600">CSU</span> graduation requirements
          </p>
        </div>

        {/* Upload Section - Enhanced */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-8 transform hover:shadow-3xl transition-all duration-300 border-2 border-gray-100">
          <ImageUpload
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            loading={loading}
          />
        </div>

        {/* Error Message - Enhanced */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-800 px-8 py-6 rounded-2xl mb-8 shadow-xl animate-shake">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl mb-2">Oops! Something went wrong</p>
                <p className="text-base mb-3">{error}</p>
                <div className="bg-red-100 rounded-lg p-3 border border-red-200">
                  <p className="text-sm font-semibold">
                    💡 Tip: Make sure your image is clear and contains your course planning sheet
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section - Enhanced */}
        {courses.length > 0 && (
          <div ref={resultsRef} className="space-y-8 animate-slideUp">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 rounded-full p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-black mb-1">Success! 🎉</p>
                    <p className="text-lg opacity-90">
                      Extracted <span className="font-bold">{courses.length}</span> {courses.length === 1 ? "course" : "courses"} from your image
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Tracker */}
            {requirements && (
              <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-100">
                <div className="mb-8">
                  <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-4">
                    <span className="text-3xl">📊</span>
                    <h2 className="text-2xl font-black text-gray-900">
                      Requirements Progress
                    </h2>
                  </div>
                  <p className="text-lg text-gray-600 ml-1">
                    Track your progress toward all graduation requirements
                  </p>
                </div>
                <RequirementsDisplay
                  lynbrook={requirements.lynbrook}
                  uc={requirements.uc}
                  csu={requirements.csu}
                />
              </div>
            )}

            {/* Course List */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-100">
              <div className="mb-8">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-4">
                  <span className="text-3xl">📚</span>
                  <h2 className="text-2xl font-black text-gray-900">
                    Extracted Courses
                  </h2>
                </div>
                <p className="text-lg text-gray-600 ml-1">
                  All courses identified from your planning sheet
                </p>
              </div>
              <ResultsTable courses={courses} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

