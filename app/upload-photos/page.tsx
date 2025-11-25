"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import UploadBox from '@/components/UploadBox';
import Image from 'next/image';
import { uploadFile } from '@/actions/upload';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadPhotosContent = () => {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      router.push('/book-service');
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
    setUploadedImageUrl(null);
    setUploadError(null);

    try {
      if (filesToUpload.length > 0) {
        const result = await uploadFile(filesToUpload[0]);

        if (result.success && result.url) {
          setUploadedImageUrl(result.url);
          console.log('File uploaded successfully:', result.url);

          const bookingRef = doc(db, 'bookings', bookingId);
          await updateDoc(bookingRef, {
            status: 'pending_checkout',
          });
          console.log('Booking status updated.');

          // Redirect directly to checkout, skipping the nearby-mechanics page
          router.push(`/checkout?bookingId=${bookingId}`);
        } else {
          console.error('Error uploading file:', result.message);
          setUploadError(result.message || 'Upload failed');
        }
      }
    } catch (e) {
      console.error('Error uploading photo:', e);
      setUploadError('An unexpected error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!bookingId) return null;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Upload Photos</h1>
            <p className="text-muted-foreground text-lg">
              Help us understand the issue better by uploading photos of your car.
            </p>
          </div>

          <Card className="border-border/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Photo Evidence
              </CardTitle>
              <CardDescription>
                Upload clear photos of the affected area or the entire vehicle.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <UploadBox onFilesSelected={handleFilesSelected} maxFiles={3} />

              {uploadError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                  {uploadError}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleUpload}
                  disabled={filesToUpload.length === 0 || isUploading}
                  className="w-full h-12 text-lg font-semibold shadow-lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" /> Upload & Continue
                    </>
                  )}
                </Button>

                <button
                  onClick={() => router.push(`/checkout?bookingId=${bookingId}`)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-center"
                >
                  Skip for now
                </button>
              </div>

              {uploadedImageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-4 bg-secondary/50 rounded-xl border border-border/50"
                >
                  <h3 className="text-sm font-semibold mb-3 text-center">Last Uploaded</h3>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={uploadedImageUrl}
                      alt="Uploaded Car Photo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

const UploadPhotosPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <UploadPhotosContent />
    </Suspense>
  );
};

export default UploadPhotosPage;
