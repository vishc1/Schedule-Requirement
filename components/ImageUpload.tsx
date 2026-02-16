"use client";

import { useRef, useState, DragEvent, ChangeEvent, useEffect } from "react";
import { Course } from "@/app/page";
import { RequirementsProgress } from "@/lib/requirementsTracker";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Compress image to fit Vercel's 4.5MB request limit
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(file); // Fallback if canvas not supported
            return;
          }

          // Resize if too large (max 1920px on longest side)
          let width = img.width;
          let height = img.height;
          const maxDimension = 1920;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with 80% quality for smaller file size
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.80 // 80% quality - good balance between size and readability
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      onUploadError("Please upload a valid image file (PNG, JPG, or GIF)");
      return;
    }

    try {
      // Compress the image to fit within Vercel's limits
      const compressedFile = await compressImage(file);

      // Check compressed file size (target 3MB max to ensure it fits with overhead)
      const maxSize = 3 * 1024 * 1024; // 3MB
      if (compressedFile.size > maxSize) {
        onUploadError(
          `Image is too large (${(compressedFile.size / 1024 / 1024).toFixed(1)}MB after compression). ` +
          "Please use a smaller or lower resolution image."
        );
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
      setFileName(file.name);

      // Use compressed file for upload
      file = compressedFile;

      onUploadStart();

      const formData = new FormData();
      formData.append("image", file);

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
    if (!loading) {
      fileInputRef.current?.click();
    }
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }
          `}
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-20 h-20 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              Upload Your Planned Schedule
            </p>
            <p className="text-base text-gray-600 mb-1">
              Click here or drag and drop your schedule image
            </p>
            <p className="text-sm text-gray-500">
              Supports PNG, JPG, GIF • Auto-compressed for optimal upload
            </p>
          </div>
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

