"use client"; // This is a Client Component

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming config.js is in src/lib/firebase

const services = [
  { id: 'flat_tyre', name: 'Flat Tyre Repair', price: 50 },
  { id: 'battery', name: 'Battery Replacement', price: 150 },
  { id: 'general_service', name: 'General Service', price: 200 },
  { id: 'oil_change', name: 'Oil Change', price: 80 },
  { id: 'brake_inspection', name: 'Brake Inspection', price: 70 },
  { id: 'ac_service', name: 'AC Service', price: 120 },
];

const SelectServicePage = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      // If no bookingId, redirect back to book-service or show an error
      router.push('/book-service');
    }
  }, [bookingId, router]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId)
        : [...prevSelected, serviceId]
    );
  };

  const handleNext = async () => {
    if (!bookingId) {
      console.error('Booking ID is missing.');
      return;
    }

    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        selectedServices: selectedServices,
        status: 'pending_photo_upload', // Update status
      });
      console.log('Booking updated with selected services.');

      // Redirect to upload-photos page with booking ID
      router.push(`/upload-photos?bookingId=${bookingId}`);
    } catch (e) {
      console.error('Error updating document: ', e);
      // Optionally, show an error message to the user
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
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Select Services</h1>

        <div className="space-y-4 mb-6">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <label htmlFor={service.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={service.id}
                  checked={selectedServices.includes(service.id)}
                  onChange={() => handleServiceChange(service.id)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-lg text-gray-800">{service.name}</span>
              </label>
              <span className="text-gray-600 font-semibold">${service.price}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SelectServicePage;
