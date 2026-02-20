"use client";

import { useRef, useState, DragEvent, ChangeEvent, useEffect } from "react";
import { Course } from "@/app/page";
import { RequirementsProgress } from "@/lib/requirementsTracker";

// Compress large images before upload (phone photos can be 5-15MB)
async function compressImage(file: File): Promise<File> {
  const MAX_DIM = 1920;
  const QUALITY = 0.85;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = Math.min(MAX_DIM / img.width, MAX_DIM / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => resolve(blob
          ? new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" })
          : file),
        "image/jpeg",
        QUALITY
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

interface ApiResponse {
  courses: Course[];
  requirements?: {
    lynbrook: RequirementsProgress;
    uc: RequirementsProgress;
    csu: RequirementsProgress;
  };
}

interface ImageUploadProps {
  onUploadStart: () => void;
  onUploadComplete: (data: ApiResponse) => void;
  onUploadError: (error: string) => void;
  loading: boolean;
}

export default function ImageUpload({
  onUploadStart,
  onUploadComplete,
  onUploadError,
  loading,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loading) {
      const steps = [
        "Uploading image...",
        "Analyzing transcript...",
        "Extracting courses...",
        "Calculating credits...",
      ];
      let stepIndex = 0;
      setProcessingStep(steps[stepIndex]);
      
      const interval = setInterval(() => {
        stepIndex = (stepIndex + 1) % steps.length;
        setProcessingStep(steps[stepIndex]);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      onUploadError("Please upload a valid image file (PNG, JPG, or GIF)");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      onUploadError("Image is too large. Please use an image under 25MB.");
      return;
    }

    // Compress large images (phone photos) before uploading
    let processedFile = file;
    if (file.size > 2 * 1024 * 1024) {
      setCompressing(true);
      processedFile = await compressImage(file);
      setCompressing(false);
    }

    // Create preview from original
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setFileName(processedFile.name);

    onUploadStart();

    try {
      const formData = new FormData();
      formData.append("image", processedFile);

      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to process image");
        } else {
          // Non-JSON error (possibly from Vercel/server)
          const errorText = await response.text();
          if (response.status === 413 || errorText.includes("PAYLOAD") || errorText.includes("too large")) {
            throw new Error("Image file is too large for Vercel. Please use a smaller image.");
          } else {
            throw new Error(`Server error: ${errorText.substring(0, 100)}`);
          }
        }
      }

      // Check Content-Type even for successful responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}`);
      }

      const data: ApiResponse = await response.json();
      onUploadComplete(data);
    } catch (error) {
      onUploadError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setImagePreview(null);
      setFileName(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (!loading) fileInputRef.current?.click();
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) cameraInputRef.current?.click();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {/* File picker (gallery / desktop) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={loading}
      />
      {/* Camera capture (opens rear camera on mobile) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
        disabled={loading}
      />

      {!imagePreview && !loading ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}
          `}
        >
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xl font-semibold text-gray-700 mb-1">
              Upload Your Course Planning Sheet
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Screenshot, scan, or photo — large images are compressed automatically
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <button
                onClick={handleCameraClick}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Take Photo
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload File
              </button>
            </div>
          </div>
        </div>
      ) : compressing ? (
        <div className="border-2 border-blue-200 rounded-lg p-8 bg-blue-50 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-3"></div>
          <p className="text-lg font-semibold text-gray-700">Compressing image...</p>
          <p className="text-sm text-gray-500">Optimizing your photo for upload</p>
        </div>
      ) : loading ? (
        <div className="border-2 border-blue-200 rounded-lg p-8 bg-blue-50">
          {imagePreview && (
            <div className="mb-6 text-center">
              <img
                src={imagePreview}
                alt="Uploaded transcript"
                className="max-h-64 mx-auto rounded-lg shadow-md border-2 border-blue-200"
              />
              <p className="text-sm text-gray-600 mt-2">{fileName}</p>
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-lg font-semibold text-gray-700 mb-1">
              {processingStep}
            </p>
            <p className="text-sm text-gray-500">
              This may take a few seconds...
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-sm font-medium text-green-800">
                Image uploaded successfully
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Upload Another
            </button>
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Uploaded transcript"
              className="max-h-48 mx-auto rounded-lg shadow-sm border border-green-200"
            />
          )}
        </div>
      )}
    </div>
  );
}

