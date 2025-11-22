"use client"; // This is a Client Component

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming config.js is in src/lib/firebase

interface BookingDetails {
  carModel: string;
  carNumber: string;
  date: string;
  time: string;
  selectedServices: string[];
  photoUrls: string[];
  userLocation: { latitude: number; longitude: number };
  mechanicId: string;
  status: string;
  createdAt: Date;
}

interface Service {
  id: string;
  name: string;
  price: number;
}

const allServices = [
  { id: 'flat_tyre', name: 'Flat Tyre Repair', price: 50 },
  { id: 'battery', name: 'Battery Replacement', price: 150 },
  { id: 'general_service', name: 'General Service', price: 200 },
  { id: 'oil_change', name: 'Oil Change', price: 80 },
  { id: 'brake_inspection', name: 'Brake Inspection', price: 70 },
  { id: 'ac_service', name: 'AC Service', price: 120 },
];

const dummyMechanics = [
  { id: 'mech1', name: 'AutoFix Pro', rating: 4.8, distance: 5.2, estimatedArrival: '25 min', price: 100 },
  { id: 'mech2', name: 'Speedy Repairs', rating: 4.5, distance: 8.1, estimatedArrival: '40 min', price: 90 },
  { id: 'mech3', name: 'Reliable Auto', rating: 4.9, distance: 3.5, estimatedArrival: '15 min', price: 110 },
  { id: 'mech4', name: 'Quick Service', rating: 4.2, distance: 10.0, estimatedArrival: '50 min', price: 85 },
];

const TrackOrderPage = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      router.push('/book-service');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const bookingRef = doc(db, 'bookings', bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          const data = bookingSnap.data();
          // Convert Firestore Timestamp to Date object if necessary
          if (data?.createdAt && typeof data.createdAt.toDate === 'function') {
            data.createdAt = data.createdAt.toDate();
          }
          setBookingDetails(data as BookingDetails);
        } else {
          setError('Booking not found.');
        }
      } catch (e) {
        console.error('Error fetching booking details:', e);
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, router]);

  const calculateTotalPrice = () => {
    if (!bookingDetails || !bookingDetails.selectedServices) return 0;
    return bookingDetails.selectedServices.reduce((total, serviceId) => {
      const service = allServices.find(s => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const getMechanicName = (mechanicId: string) => {
    const mechanic = dummyMechanics.find(m => m.id === mechanicId);
    return mechanic ? mechanic.name : 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_service_selection':
      case 'pending_photo_upload':
      case 'pending_location_share':
        return 'bg-yellow-200 text-yellow-800';
      case 'mechanic_selected':
        return 'bg-blue-200 text-blue-800';
      case 'confirmed':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading or invalid booking...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading order tracking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">No booking details available.</p>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Track Your Order</h1>

        <div className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
          <p className="text-gray-700"><strong>Booking ID:</strong> {bookingId}</p>
          <p className="text-gray-700"><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(bookingDetails.status)}`}>{bookingDetails.status.replace(/_/g, ' ')}</span></p>
          <p className="text-gray-700"><strong>Car Model:</strong> {bookingDetails.carModel}</p>
          <p className="text-gray-700"><strong>Car Number:</strong> {bookingDetails.carNumber}</p>
          <p className="text-gray-700"><strong>Date:</strong> {bookingDetails.date}</p>
          <p className="text-gray-700"><strong>Time:</strong> {bookingDetails.time}</p>
          {bookingDetails.createdAt && (
            <p className="text-gray-700"><strong>Booked On:</strong> {new Date(bookingDetails.createdAt).toLocaleString()}</p>
          )}
        </div>

        {bookingDetails.selectedServices.length > 0 && (
          <div className="mb-6 space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">Services</h2>
            <ul className="list-disc list-inside text-gray-700">
              {bookingDetails.selectedServices.map((serviceId) => {
                const service = allServices.find(s => s.id === serviceId);
                return <li key={serviceId}>{service?.name} (${service?.price})</li>;
              })}
            </ul>
          </div>
        )}

        {bookingDetails.mechanicId && (
          <div className="mb-6 space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">Assigned Mechanic</h2>
            <p className="text-gray-700"><strong>Name:</strong> {getMechanicName(bookingDetails.mechanicId)}</p>
            {/* Add more mechanic details here if available */}
          </div>
        )}

        <div className="mb-8 text-right">
          <p className="text-2xl font-bold text-blue-600">Estimated Total: ${totalPrice}</p>
        </div>

        {/* Simple Progress Tracker (conceptual) */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress</h2>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className={`text-center ${bookingDetails.status === 'confirmed' ? 'text-green-600' : ''}`}>
              <p>✅</p>
              <p>Confirmed</p>
            </div>
            <div className="flex-grow border-t-2 border-gray-300 mx-2"></div>
            <div className={`text-center ${bookingDetails.status === 'mechanic_on_way' ? 'text-blue-600' : ''}`}>
              <p>🚗</p>
              <p>Mechanic On Way</p>
            </div>
            <div className="flex-grow border-t-2 border-gray-300 mx-2"></div>
            <div className={`text-center ${bookingDetails.status === 'service_started' ? 'text-blue-600' : ''}`}>
              <p>🛠️</p>
              <p>Service Started</p>
            </div>
            <div className="flex-grow border-t-2 border-gray-300 mx-2"></div>
            <div className={`text-center ${bookingDetails.status === 'completed' ? 'text-green-600' : ''}`}>
              <p>✅</p>
              <p>Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TrackOrderPage;
