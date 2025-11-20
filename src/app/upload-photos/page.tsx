"use client"; // This is a Client Component

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Updated to use src/lib/firebase.ts
import UploadBox from '@/components/UploadBox'; // Assuming UploadBox.tsx is in src/components
import Image from 'next/image';
import { saveFileLocally } from '@/actions/upload';

const UploadPhotosPage = () => {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      router.push('/book-service'); // Redirect if no bookingId
    }
  }, [bookingId, router]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFilesToUpload(selectedFiles);
  };

  const handleUpload = async () => {
    if (!bookingId || filesToUpload.length === 0) {
      console.error('Booking ID or files are missing.');
      return;
    }

    setIsUploading(true);
    setUploadedImageUrl(null); // Clear previous image

    try {
      // Assuming only one file for simplicity or handling multiple files one by one
      if (filesToUpload.length > 0) {
        const formData = new FormData();
        formData.append('file', filesToUpload[0]);

        const result = await saveFileLocally(formData);

        if (result.success && result.url) {
          setUploadedImageUrl(result.url);
          console.log('File saved locally:', result.url);

          // Update Firestore if still needed for status, but not photo URL directly
          const bookingRef = doc(db, 'bookings', bookingId);
          await updateDoc(bookingRef, {
            status: 'pending_location_share', // Update status
            // Removed photoUrls: photoUrls, as it's now local
          });
          console.log('Booking status updated.');

          // Optionally, redirect after upload and display
          router.push(`/checkout?bookingId=${bookingId}`);
        } else {
          console.error('Error saving file locally:', result.message);
        }
      }
    } catch (e) {
      console.error('Error uploading photo or updating document: ', e);
      // Optionally, show an error message to the user
    } finally {
      setIsUploading(false);
    }
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading or invalid booking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Upload Car Photos</h1>

        <div className="mb-6">
          <UploadBox onFilesSelected={handleFilesSelected} maxFiles={3} />
        </div>

        <button
          onClick={handleUpload}
          disabled={filesToUpload.length === 0 || isUploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload & Continue'}
        </button>

        {uploadedImageUrl && (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Uploaded Image:</h2>
            <Image
              src={uploadedImageUrl}
              alt="Uploaded Car Photo"
              width={300} // Adjust width as needed
              height={200} // Adjust height as needed
              objectFit="contain"
              className="mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-500 mt-2">Public URL: {uploadedImageUrl}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPhotosPage;
