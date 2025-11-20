"use client"; // This is a Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming config.js is in src/lib/firebase

const BookServicePage = () => {
  const [carModel, setCarModel] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const router = useRouter();

  const handleNext = async () => {
    try {
      // Save data to Firestore
      const docRef = await addDoc(collection(db, 'bookings'), {
        carModel,
        carNumber,
        date,
        time,
        status: 'pending_service_selection', // Initial status
        createdAt: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);

      // Redirect to select-service page with booking ID
      router.push(`/select-service?bookingId=${docRef.id}`);
    } catch (e) {
      console.error('Error adding document: ', e);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Book Your Service</h1>

        <div className="mb-4">
          <label htmlFor="carModel" className="block text-gray-700 text-sm font-bold mb-2">
            Car Model
          </label>
          <input
            type="text"
            id="carModel"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            placeholder="e.g., Toyota Camry"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="carNumber" className="block text-gray-700 text-sm font-bold mb-2">
            Car Number
          </label>
          <input
            type="text"
            id="carNumber"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
            placeholder="e.g., ABC 1234"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
            Preferred Date
          </label>
          <input
            type="date"
            id="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">
            Preferred Time
          </label>
          <input
            type="time"
            id="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
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

export default BookServicePage;
