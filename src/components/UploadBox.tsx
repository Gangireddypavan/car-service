"use client";

import React, { useState, useRef } from 'react';

interface UploadBoxProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onFilesSelected, maxFiles = 3 }) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files);
      const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition duration-300"
         onDragOver={(e) => e.preventDefault()}
         onDrop={handleDrop}
         onClick={openFileDialog}>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="File uploader"
      />
      <p className="text-gray-600 mb-2">Drag & drop your car photos here, or click to select</p>
      <p className="text-sm text-gray-500">Upload up to {maxFiles} photos</p>

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
          <ul className="list-disc list-inside text-left">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center text-gray-700">
                {file.name}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadBox;
